import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/blog/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { DB } from "@/lib/db/tables";
import type { BlogPostRow } from "@/lib/blog/db-types";
import { generateArticle } from "@/lib/blog/article-writer";
import type { ContentBrief } from "@/lib/blog/content-brief";
import { ERROR_CODES } from "@/lib/blog/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Gemini article generation is ~15-25s per post on gemini-2.5-flash.
// Vercel's plan default (10-15s) causes empty-body 500s at the edge.
export const maxDuration = 60;

// Article generation is expensive per post; default to 1 per invocation to
// stay well inside the maxDuration budget. Cron or admin can loop.
const DEFAULT_COUNT = 1;
const MAX_COUNT = 4;

export async function POST(req: NextRequest) {
  try {
  const authError = requireAdmin(req);
  if (authError) return authError;

  let body: { count?: number; runId?: string; postId?: string; dryRun?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    // empty body — use defaults
  }

  const count = Math.min(Math.max(body.count ?? DEFAULT_COUNT, 1), MAX_COUNT);
  const dryRun = body.dryRun ?? false;
  const supabase = createSupabaseAdmin();

  let query = supabase
    .from(DB.blogPosts)
    .select("*")
    .eq("pipeline_stage", "BRIEF_CREATED");

  if (body.postId) query = query.eq("id", body.postId);
  else if (body.runId) query = query.eq("run_id", body.runId);

  const { data, error } = await query
    .order("opportunity_score", { ascending: false })
    .limit(count);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  const posts = (data ?? []) as BlogPostRow[];
  if (posts.length === 0) {
    return NextResponse.json({ ok: true, dryRun, processed: 0, results: [] });
  }

  const results: Array<Record<string, unknown>> = [];
  let quotaHit = false;

  for (const post of posts) {
    if (quotaHit) break;

    if (!post.content_brief) {
      results.push({
        ok: false,
        postId: post.id,
        primary_keyword: post.primary_keyword,
        errorCode: "MISSING_BRIEF",
        errorMessage: "content_brief is empty; run /api/admin/generate-briefs first",
      });
      continue;
    }

    const brief = post.content_brief as unknown as ContentBrief;
    const r = await generateArticle(supabase, post, brief, { dryRun });

    if (r.ok && r.article) {
      results.push({
        ok: true,
        postId: post.id,
        primary_keyword: post.primary_keyword,
        title: r.article.title,
        slug: r.article.slug,
        word_count: r.article.word_count,
        meta_description: r.article.meta_description,
        generation_model: r.article.generation_model,
        ...(dryRun ? { article_html_preview: r.article.article_html.slice(0, 600) } : {}),
      });
    } else {
      results.push({
        ok: false,
        postId: post.id,
        primary_keyword: post.primary_keyword,
        errorCode: r.errorCode,
        errorMessage: r.errorMessage,
      });

      if (r.errorCode === ERROR_CODES.GEMINI_QUOTA_EXHAUSTED) {
        quotaHit = true;
        if (!dryRun) {
          await supabase
            .from(DB.blogPosts)
            .update({
              last_error_code: r.errorCode,
              last_error_message: r.errorMessage?.slice(0, 500) ?? null,
              updated_at: new Date().toISOString(),
            })
            .eq("id", post.id);
        }
      }
    }
  }

  const anyOk = results.some((r) => r.ok);
  return NextResponse.json(
    {
      ok: anyOk,
      dryRun,
      processed: results.length,
      quotaExhausted: quotaHit,
      results,
    },
    { status: anyOk ? 200 : 502 }
  );
  } catch (err) {
    // Full stack goes to Vercel function logs only. Response body stays
    // short so we don't leak internal paths to any external caller.
    console.error("[generate-articles] unhandled:", err instanceof Error ? err.stack ?? err.message : err);
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
