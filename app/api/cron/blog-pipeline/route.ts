import { NextRequest, NextResponse } from "next/server";
import { requireCronSecret } from "@/lib/blog/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { DB } from "@/lib/db/tables";
import type { BlogPostRow } from "@/lib/blog/db-types";
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
 * Single Vercel cron entry-point. Schedule declared in vercel.json
 * (every 15 minutes).
 *
 * On each invocation, advance the pipeline by ONE unit of work at the
 * earliest pending stage. Never processes more than one stage per
 * invocation and never processes more than one post per invocation for
 * the expensive stages (article + QA + image + publish). Reason: keep
 * each fire well under the 60 s maxDuration. Cron runs every 15 min,
 * so the full 4-post pipeline drains over the course of the day.
 *
 * Stage priority (earliest wins so no stage starves):
 *   1. today's blog_run absent  → discoverTopics(count=MAX_POSTS_PER_DAY)
 *   2. TOPIC_SELECTED exists    → generateBrief (one post)
 *   3. BRIEF_CREATED exists     → generateArticle (one post)
 *   4. ARTICLE_GENERATED exists → runQaGate     (one post)
 *   5. QA_PASSED exists         → generate+upload image (one post)
 *   6. IMAGE_UPLOADED exists    → publishToBlogger (one post)
 *   otherwise → { action: "idle" }
 */
export async function GET(req: NextRequest) {
  try {
    const authError = requireCronSecret(req);
    if (authError) return authError;

    const supabase = createSupabaseAdmin();
    const today = new Date().toISOString().slice(0, 10);

    // ── Stage 0: reconcile BLOGGER_SCHEDULED rows whose scheduled_publish_at
    // has passed. Blogger owns the SCHEDULED→LIVE transition; this stage only
    // catches up our own bookkeeping. Ask Blogger for the actual state; if it
    // is LIVE, update Supabase to PUBLISHED with Blogger's own published
    // timestamp. Safe to no-op — if nothing needs reconciling, we fall through
    // to the normal pipeline. Bounded to 5 rows per tick.
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

    if (dueRows && dueRows.length > 0) {
      let accessToken: string | null = null;
      try {
        accessToken = await refreshAccessToken();
      } catch (err) {
        // If OAuth fails, don't block the rest of the pipeline — log and fall through.
        console.error(
          "[cron/reconcile] blogger oauth refresh failed:",
          err instanceof Error ? err.message : err
        );
      }

      const reconciled: Array<Record<string, unknown>> = [];
      if (accessToken) {
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
              reconciled.push({
                postId: r.id,
                bloggerPostId: postId,
                status: "LIVE",
              });
            } else {
              reconciled.push({
                postId: r.id,
                bloggerPostId: postId,
                status: bp?.status ?? "not-found",
                skipped: true,
              });
            }
          } catch (err) {
            reconciled.push({
              postId: r.id,
              bloggerPostId: postId,
              error: (err instanceof Error ? err.message : String(err)).slice(
                0,
                200
              ),
            });
          }
        }
      }

      if (reconciled.length > 0) {
        return NextResponse.json({
          ok: true,
          action: "reconcile",
          reconciled,
        });
      }
    }

    // ── Stage 1: today's run row ──────────────────────────────────
    const runResult = await createOrGetTodayRun(supabase, false);
    if (!runResult.ok || !runResult.run) {
      return NextResponse.json(
        { ok: false, errorCode: "RUN_CREATE_FAILED", errorMessage: runResult.error },
        { status: 500 }
      );
    }
    const run = runResult.run;

    if ((run.topics_discovered ?? 0) === 0 && run.status === "STARTED") {
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
      return NextResponse.json({
        ok: discovery.ok,
        action: "discover",
        runId: run.id,
        inserted: discovery.inserted,
        errorCode: discovery.errorCode,
      });
    }

    // ── Stage promoter helpers ────────────────────────────────────
    const firstPendingAt = async (stage: string): Promise<BlogPostRow | null> => {
      const { data } = await supabase
        .from(DB.blogPosts)
        .select("*")
        .eq("pipeline_stage", stage)
        .order("opportunity_score", { ascending: false })
        .order("created_at", { ascending: true })
        .limit(1);
      const row = (data ?? [])[0] as BlogPostRow | undefined;
      return row ?? null;
    };

    const setRowError = async (postId: string, code: string, msg: string) => {
      await supabase
        .from(DB.blogPosts)
        .update({
          last_error_code: code,
          last_error_message: msg.slice(0, 500),
          updated_at: new Date().toISOString(),
        })
        .eq("id", postId);
    };

    // ── Stage 2: brief ────────────────────────────────────────────
    const briefTarget = await firstPendingAt("TOPIC_SELECTED");
    if (briefTarget) {
      const res = await generateBrief(supabase, briefTarget);
      if (!res.ok) {
        await setRowError(
          briefTarget.id,
          res.errorCode ?? ERROR_CODES.GEMINI_GENERATION_FAILED,
          res.errorMessage ?? "brief generation failed"
        );
      }
      return NextResponse.json({
        ok: res.ok,
        action: "brief",
        postId: briefTarget.id,
        primary_keyword: briefTarget.primary_keyword,
        errorCode: res.errorCode,
      });
    }

    // ── Stage 3: article ──────────────────────────────────────────
    const articleTarget = await firstPendingAt("BRIEF_CREATED");
    if (articleTarget) {
      const brief = articleTarget.content_brief as unknown as ContentBrief | null;
      if (!brief) {
        await setRowError(
          articleTarget.id,
          "MISSING_BRIEF",
          "content_brief is empty; cannot advance"
        );
        return NextResponse.json({
          ok: false,
          action: "article",
          postId: articleTarget.id,
          errorCode: "MISSING_BRIEF",
        });
      }
      const res = await generateArticle(supabase, articleTarget, brief);
      if (!res.ok) {
        await setRowError(
          articleTarget.id,
          res.errorCode ?? "ARTICLE_GENERATION_FAILED",
          res.errorMessage ?? "article generation failed"
        );
      }
      return NextResponse.json({
        ok: res.ok,
        action: "article",
        postId: articleTarget.id,
        primary_keyword: articleTarget.primary_keyword,
        title: res.article?.title,
        wordCount: res.article?.word_count,
        errorCode: res.errorCode,
      });
    }

    // ── Stage 4: QA ───────────────────────────────────────────────
    const qaTarget = await firstPendingAt("ARTICLE_GENERATED");
    if (qaTarget) {
      const res = await runQaGate(supabase, qaTarget);
      if (!res.ok) {
        await setRowError(
          qaTarget.id,
          res.errorCode ?? ERROR_CODES.QA_FAILED,
          res.errorMessage ?? "qa failed"
        );
      }
      return NextResponse.json({
        ok: res.ok,
        action: "qa",
        postId: qaTarget.id,
        verdict: res.outcome?.verdict,
        finalStage: res.finalStage,
        revised: res.revised,
        recoverable: res.outcome?.recoverable,
        overall_score: res.outcome?.overall_score,
        errorCode: res.errorCode,
      });
    }

    // ── Stage 5: image (generate + upload atomically) ─────────────
    const imageTarget = await firstPendingAt("QA_PASSED");
    if (imageTarget) {
      const brief = imageTarget.content_brief as unknown as ContentBrief | null;
      if (!brief) {
        await setRowError(imageTarget.id, "MISSING_BRIEF", "content_brief empty");
        return NextResponse.json({
          ok: false,
          action: "image",
          postId: imageTarget.id,
          errorCode: "MISSING_BRIEF",
        });
      }

      const title = imageTarget.title ?? imageTarget.primary_keyword;
      const promptRes = await buildImagePrompt(title, brief);
      if (!promptRes.ok || !promptRes.image_prompt || !promptRes.image_alt) {
        await setRowError(
          imageTarget.id,
          promptRes.errorCode ?? ERROR_CODES.IMAGE_GENERATION_FAILED,
          promptRes.errorMessage ?? "image prompt failed"
        );
        return NextResponse.json({
          ok: false,
          action: "image",
          postId: imageTarget.id,
          stage: "prompt",
          errorCode: promptRes.errorCode,
        });
      }

      const genRes = await generateImage(promptRes.image_prompt);
      if (!genRes.ok || !genRes.bytes || !genRes.contentType) {
        await supabase
          .from(DB.blogPosts)
          .update({
            image_prompt: promptRes.image_prompt,
            image_alt: promptRes.image_alt,
            last_error_code: genRes.errorCode ?? ERROR_CODES.IMAGE_GENERATION_FAILED,
            last_error_message: (genRes.errorMessage ?? "unknown").slice(0, 500),
            updated_at: new Date().toISOString(),
          })
          .eq("id", imageTarget.id);
        return NextResponse.json({
          ok: false,
          action: "image",
          postId: imageTarget.id,
          stage: "generation",
          errorCode: genRes.errorCode,
        });
      }

      const upload = await uploadImage(
        supabase,
        imageTarget.id,
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
          .eq("id", imageTarget.id);
        return NextResponse.json({
          ok: false,
          action: "image",
          postId: imageTarget.id,
          stage: "upload",
          errorCode: upload.errorCode,
        });
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
        .eq("id", imageTarget.id)
        .eq("pipeline_stage", "QA_PASSED");

      return NextResponse.json({
        ok: true,
        action: "image",
        postId: imageTarget.id,
        image_url: upload.publicUrl,
      });
    }

    // ── Stage 6: publish ──────────────────────────────────────────
    const publishTarget = await firstPendingAt("IMAGE_UPLOADED");
    if (publishTarget) {
      const res = await publishToBlogger(supabase, publishTarget);
      if (!res.ok) {
        await setRowError(
          publishTarget.id,
          res.errorCode ?? ERROR_CODES.BLOGGER_PUBLISH_FAILED,
          res.errorMessage ?? "blogger publish failed"
        );
        return NextResponse.json({
          ok: false,
          action: "publish",
          postId: publishTarget.id,
          errorCode: res.errorCode,
        });
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
        .eq("id", publishTarget.id)
        .eq("pipeline_stage", "IMAGE_UPLOADED");

      if (isPublishedNow) {
        await updateRunStatus(supabase, run.id, {
          posts_published: (run.posts_published ?? 0) + 1,
        });
      }

      return NextResponse.json({
        ok: true,
        action: "publish",
        postId: publishTarget.id,
        status: res.status,
        bloggerUrl: res.bloggerUrl,
        scheduledPublishAt: res.scheduledPublishAt,
      });
    }

    return NextResponse.json({
      ok: true,
      action: "idle",
      runId: run.id,
      today,
      message: "No pending work.",
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
        errorCode: "ROUTE_UNHANDLED_EXCEPTION",
        errorMessage: msg.slice(0, 500),
      },
      { status: 500 }
    );
  }
}
