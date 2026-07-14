import { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireCronSecret } from "@/lib/blog/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { DB } from "@/lib/db/tables";
import type { BlogPostRow, BlogRunRow } from "@/lib/blog/db-types";
import { createOrGetTodayRun, updateRunStatus } from "@/lib/blog/run-manager";
import { discoverTopics } from "@/lib/blog/topic-discovery";
import { generateBrief } from "@/lib/blog/content-brief";
import { generateArticle } from "@/lib/blog/article-writer";
import { runQaGate } from "@/lib/blog/qa-gate";
import { buildImagePrompt } from "@/lib/blog/image-prompt";
import { generateImage } from "@/lib/blog/image-generator";
import { uploadImage } from "@/lib/blog/image-uploader";
import { publishToBlogger } from "@/lib/blog/blogger-publisher";
import { refreshAccessToken, getPost } from "@/lib/blog/blogger-client";
import type { ContentBrief } from "@/lib/blog/content-brief";
import { ERROR_CODES, MAX_POSTS_PER_DAY } from "@/lib/blog/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Cron entry-point for the blog pipeline.
 *
 * On each tick this endpoint tries to advance ONE row through EACH
 * pipeline stage (reconcile, publish, image, QA, article, brief,
 * discover). Stages are ordered downstream-first so that when the
 * per-tick time budget runs out, the stages we skip are the upstream
 * ones with smaller queues — downstream work still drains.
 *
 * Why: GitHub Actions' scheduled workflows can only fire ~ once every
 * 1-2 hours in practice (the docs explicitly warn about scheduling
 * delays under load). With one-stage-per-tick we could not sustain
 * 4 posts/day; with one-per-stage-per-tick we can.
 *
 * Each stage helper is idempotent and safe under concurrency:
 *   - Every DB update is gated by .eq("pipeline_stage", <expected>)
 *   - No stage assumes another stage ran in the same tick
 *   - Errors in one stage never abort the loop; the next stage still runs
 */

// ── Time budget ─────────────────────────────────────────────────────
// Vercel Hobby caps the function at 60s. Keep a 5s safety margin.
const DEADLINE_MS = 55_000;

// Minimum remaining budget required to attempt each stage.
// Conservative: worst-case wall clock we've observed + a small margin.
const STAGE_MIN_BUDGET_MS = {
  reconcile: 8_000, //  ~2s per row, up to 5 rows
  publish: 15_000, //   OAuth refresh + Blogger createPost
  image: 25_000, //     Gemini prompt + Cloudflare Flux + Supabase upload
  qa: 30_000, //        Gemini scoring + potential revision (revision is another article gen)
  article: 30_000, //   Gemini article generation, heaviest single call
  brief: 20_000, //     Gemini structured brief
  discover: 15_000, //  Gemini topic list, only fires on the first tick of each day
} as const;

// ── Common helpers ──────────────────────────────────────────────────

async function firstPendingAt(
  supabase: SupabaseClient,
  stage: string
): Promise<BlogPostRow | null> {
  const { data } = await supabase
    .from(DB.blogPosts)
    .select("*")
    .eq("pipeline_stage", stage)
    .order("opportunity_score", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(1);
  return ((data ?? [])[0] as BlogPostRow | undefined) ?? null;
}

async function setRowError(
  supabase: SupabaseClient,
  postId: string,
  code: string,
  msg: string
): Promise<void> {
  await supabase
    .from(DB.blogPosts)
    .update({
      last_error_code: code,
      last_error_message: msg.slice(0, 500),
      updated_at: new Date().toISOString(),
    })
    .eq("id", postId);
}

// ── Stage implementations ──────────────────────────────────────────

/**
 * Reconcile any BLOGGER_SCHEDULED rows whose scheduled_publish_at has
 * passed. If Blogger reports LIVE, flip to PUBLISHED using Blogger's
 * own published timestamp.
 */
async function stageReconcile(
  supabase: SupabaseClient
): Promise<{ reconciled: number; details: Array<Record<string, unknown>> } | null> {
  const nowIso = new Date().toISOString();
  const { data: dueRows } = await supabase
    .from(DB.blogPosts)
    .select(
      "id, blogger_post_id, scheduled_publish_at, published_at, pipeline_stage"
    )
    .eq("pipeline_stage", "BLOGGER_SCHEDULED")
    .not("blogger_post_id", "is", null)
    .lte("scheduled_publish_at", nowIso)
    .order("scheduled_publish_at", { ascending: true })
    .limit(5);

  if (!dueRows || dueRows.length === 0) return null;

  let accessToken: string | null = null;
  try {
    accessToken = await refreshAccessToken();
  } catch (err) {
    console.error(
      "[cron/reconcile] blogger oauth refresh failed:",
      err instanceof Error ? err.message : err
    );
    return { reconciled: 0, details: [{ error: "oauth_refresh_failed" }] };
  }

  const details: Array<Record<string, unknown>> = [];
  let promoted = 0;
  for (const r of dueRows) {
    const postId = r.blogger_post_id as string;
    try {
      const bp = await getPost(accessToken, postId);
      if (bp && bp.status === "LIVE") {
        await supabase
          .from(DB.blogPosts)
          .update({
            pipeline_stage: "PUBLISHED",
            publishing_status: "published",
            published_at: bp.published ?? r.scheduled_publish_at,
            last_error_code: null,
            last_error_message: null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", r.id)
          .eq("pipeline_stage", "BLOGGER_SCHEDULED");
        details.push({ postId: r.id, status: "LIVE" });
        promoted++;
      } else {
        details.push({
          postId: r.id,
          status: bp?.status ?? "not-found",
          skipped: true,
        });
      }
    } catch (err) {
      details.push({
        postId: r.id,
        error: (err instanceof Error ? err.message : String(err)).slice(0, 200),
      });
    }
  }
  return { reconciled: promoted, details };
}

async function stagePublish(
  supabase: SupabaseClient,
  run: BlogRunRow
): Promise<Record<string, unknown> | null> {
  const target = await firstPendingAt(supabase, "IMAGE_UPLOADED");
  if (!target) return null;

  const res = await publishToBlogger(supabase, target);
  if (!res.ok) {
    await setRowError(
      supabase,
      target.id,
      res.errorCode ?? ERROR_CODES.BLOGGER_PUBLISH_FAILED,
      res.errorMessage ?? "blogger publish failed"
    );
    return { postId: target.id, ok: false, errorCode: res.errorCode };
  }

  const isPublishedNow = res.status === "PUBLISHED";
  await supabase
    .from(DB.blogPosts)
    .update({
      blogger_post_id: res.bloggerPostId,
      blogger_url: res.bloggerUrl ?? null,
      scheduled_publish_at: res.scheduledPublishAt,
      labels: res.labels ?? [],
      publishing_status: isPublishedNow ? "published" : "scheduled",
      pipeline_stage: res.status,
      published_at: isPublishedNow ? new Date().toISOString() : null,
      last_error_code: null,
      last_error_message: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", target.id)
    .eq("pipeline_stage", "IMAGE_UPLOADED");

  if (isPublishedNow) {
    await updateRunStatus(supabase, run.id, {
      posts_published: (run.posts_published ?? 0) + 1,
    });
  }

  return {
    postId: target.id,
    ok: true,
    status: res.status,
    bloggerUrl: res.bloggerUrl,
    scheduledPublishAt: res.scheduledPublishAt,
  };
}

async function stageImage(
  supabase: SupabaseClient
): Promise<Record<string, unknown> | null> {
  const target = await firstPendingAt(supabase, "QA_PASSED");
  if (!target) return null;

  const brief = target.content_brief as unknown as ContentBrief | null;
  if (!brief) {
    await setRowError(supabase, target.id, "MISSING_BRIEF", "content_brief empty");
    return { postId: target.id, ok: false, errorCode: "MISSING_BRIEF" };
  }

  const title = target.title ?? target.primary_keyword;
  const promptRes = await buildImagePrompt(title, brief);
  if (!promptRes.ok || !promptRes.image_prompt || !promptRes.image_alt) {
    await setRowError(
      supabase,
      target.id,
      promptRes.errorCode ?? ERROR_CODES.IMAGE_GENERATION_FAILED,
      promptRes.errorMessage ?? "image prompt failed"
    );
    return {
      postId: target.id,
      ok: false,
      sub_stage: "prompt",
      errorCode: promptRes.errorCode,
    };
  }

  const genRes = await generateImage(promptRes.image_prompt);
  if (!genRes.ok || !genRes.bytes || !genRes.contentType) {
    await supabase
      .from(DB.blogPosts)
      .update({
        image_prompt: promptRes.image_prompt,
        image_alt: promptRes.image_alt,
        last_error_code:
          genRes.errorCode ?? ERROR_CODES.IMAGE_GENERATION_FAILED,
        last_error_message: (genRes.errorMessage ?? "unknown").slice(0, 500),
        updated_at: new Date().toISOString(),
      })
      .eq("id", target.id);
    return {
      postId: target.id,
      ok: false,
      sub_stage: "generation",
      errorCode: genRes.errorCode,
    };
  }

  const upload = await uploadImage(
    supabase,
    target.id,
    genRes.bytes,
    genRes.contentType
  );
  if (!upload.ok || !upload.publicUrl) {
    await supabase
      .from(DB.blogPosts)
      .update({
        image_prompt: promptRes.image_prompt,
        image_alt: promptRes.image_alt,
        last_error_code: upload.errorCode ?? ERROR_CODES.IMAGE_UPLOAD_FAILED,
        last_error_message: (upload.errorMessage ?? "unknown").slice(0, 500),
        updated_at: new Date().toISOString(),
      })
      .eq("id", target.id);
    return {
      postId: target.id,
      ok: false,
      sub_stage: "upload",
      errorCode: upload.errorCode,
    };
  }

  await supabase
    .from(DB.blogPosts)
    .update({
      image_prompt: promptRes.image_prompt,
      image_alt: promptRes.image_alt,
      image_url: upload.publicUrl,
      pipeline_stage: "IMAGE_UPLOADED",
      last_error_code: null,
      last_error_message: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", target.id)
    .eq("pipeline_stage", "QA_PASSED");

  return { postId: target.id, ok: true, image_url: upload.publicUrl };
}

async function stageQa(
  supabase: SupabaseClient
): Promise<Record<string, unknown> | null> {
  const target = await firstPendingAt(supabase, "ARTICLE_GENERATED");
  if (!target) return null;

  const res = await runQaGate(supabase, target);
  if (!res.ok) {
    await setRowError(
      supabase,
      target.id,
      res.errorCode ?? ERROR_CODES.QA_FAILED,
      res.errorMessage ?? "qa failed"
    );
    return { postId: target.id, ok: false, errorCode: res.errorCode };
  }
  return {
    postId: target.id,
    ok: true,
    finalStage: res.finalStage,
    revised: res.revised,
    publishing_verdict: res.outcome?.publishing_gate.verdict,
    publishing_recoverable: res.outcome?.publishing_gate.recoverable,
    brand_score: res.outcome?.brand_quality.overall_score,
    brand_verdict: res.outcome?.brand_quality.verdict,
  };
}

async function stageArticle(
  supabase: SupabaseClient
): Promise<Record<string, unknown> | null> {
  const target = await firstPendingAt(supabase, "BRIEF_CREATED");
  if (!target) return null;

  const brief = target.content_brief as unknown as ContentBrief | null;
  if (!brief) {
    await setRowError(
      supabase,
      target.id,
      "MISSING_BRIEF",
      "content_brief is empty; cannot advance"
    );
    return { postId: target.id, ok: false, errorCode: "MISSING_BRIEF" };
  }

  const res = await generateArticle(supabase, target, brief);
  if (!res.ok) {
    await setRowError(
      supabase,
      target.id,
      res.errorCode ?? "ARTICLE_GENERATION_FAILED",
      res.errorMessage ?? "article generation failed"
    );
    return { postId: target.id, ok: false, errorCode: res.errorCode };
  }
  return {
    postId: target.id,
    ok: true,
    title: res.article?.title,
    wordCount: res.article?.word_count,
  };
}

async function stageBrief(
  supabase: SupabaseClient
): Promise<Record<string, unknown> | null> {
  const target = await firstPendingAt(supabase, "TOPIC_SELECTED");
  if (!target) return null;

  const res = await generateBrief(supabase, target);
  if (!res.ok) {
    await setRowError(
      supabase,
      target.id,
      res.errorCode ?? ERROR_CODES.GEMINI_GENERATION_FAILED,
      res.errorMessage ?? "brief generation failed"
    );
    return { postId: target.id, ok: false, errorCode: res.errorCode };
  }
  return {
    postId: target.id,
    ok: true,
    primary_keyword: target.primary_keyword,
  };
}

async function stageDiscover(
  supabase: SupabaseClient,
  run: BlogRunRow
): Promise<Record<string, unknown> | null> {
  if ((run.topics_discovered ?? 0) > 0 || run.status !== "STARTED") return null;

  const discovery = await discoverTopics(supabase, run.id, {
    count: MAX_POSTS_PER_DAY,
  });
  const status = discovery.ok
    ? discovery.inserted > 0
      ? "TOPICS_DISCOVERED"
      : run.status
    : "ERROR";
  await updateRunStatus(supabase, run.id, {
    topics_discovered: (run.topics_discovered ?? 0) + discovery.inserted,
    status,
    ...(discovery.errorCode
      ? { last_error: `${discovery.errorCode}: ${discovery.errorMessage}` }
      : { last_error: null }),
  });
  return {
    ok: discovery.ok,
    inserted: discovery.inserted,
    errorCode: discovery.errorCode,
  };
}

// ── Orchestrator ────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const startedAt = Date.now();
  const remaining = () => DEADLINE_MS - (Date.now() - startedAt);

  try {
    const authError = requireCronSecret(req);
    if (authError) return authError;

    const supabase = createSupabaseAdmin();

    // Ensure today's blog_run exists so stageDiscover has a run row to
    // attach topics to. Cheap: one indexed lookup + at most one insert.
    const runResult = await createOrGetTodayRun(supabase, false);
    if (!runResult.ok || !runResult.run) {
      return NextResponse.json(
        {
          ok: false,
          errorCode: "RUN_CREATE_FAILED",
          errorMessage: runResult.error,
        },
        { status: 500 }
      );
    }
    const run = runResult.run;

    // Stage order: reconcile (cheap, always) → downstream → upstream →
    // discover (once/day). If we run out of budget, we skip upstream
    // stages first. Downstream rows drain every tick.
    const stages: Array<{
      name: keyof typeof STAGE_MIN_BUDGET_MS;
      fn: () => Promise<Record<string, unknown> | null>;
    }> = [
      { name: "reconcile", fn: () => stageReconcile(supabase) },
      { name: "publish", fn: () => stagePublish(supabase, run) },
      { name: "image", fn: () => stageImage(supabase) },
      { name: "qa", fn: () => stageQa(supabase) },
      { name: "article", fn: () => stageArticle(supabase) },
      { name: "brief", fn: () => stageBrief(supabase) },
      { name: "discover", fn: () => stageDiscover(supabase, run) },
    ];

    const actions: Array<Record<string, unknown>> = [];
    const skipped: string[] = [];

    for (const s of stages) {
      const budget = remaining();
      const min = STAGE_MIN_BUDGET_MS[s.name];
      if (budget < min) {
        skipped.push(`${s.name}(budget:${budget}ms<${min}ms)`);
        continue;
      }
      const stageStarted = Date.now();
      try {
        const result = await s.fn();
        if (result !== null) {
          actions.push({
            stage: s.name,
            elapsed_ms: Date.now() - stageStarted,
            ...result,
          });
        }
      } catch (err) {
        console.error(
          `[cron/${s.name}] unhandled:`,
          err instanceof Error ? err.stack ?? err.message : err
        );
        actions.push({
          stage: s.name,
          ok: false,
          elapsed_ms: Date.now() - stageStarted,
          error: (err instanceof Error ? err.message : String(err)).slice(0, 200),
        });
      }
    }

    return NextResponse.json({
      ok: true,
      elapsed_ms: Date.now() - startedAt,
      runId: run.id,
      actions_count: actions.length,
      skipped_count: skipped.length,
      actions,
      skipped,
    });
  } catch (err) {
    console.error(
      "[cron/blog-pipeline] unhandled:",
      err instanceof Error ? err.stack ?? err.message : err
    );
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ok: false,
        elapsed_ms: Date.now() - startedAt,
        errorCode: "ROUTE_UNHANDLED_EXCEPTION",
        errorMessage: msg.slice(0, 500),
      },
      { status: 500 }
    );
  }
}
