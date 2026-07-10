import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/blog/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { DB } from "@/lib/db/tables";
import type { BlogPostRow } from "@/lib/blog/db-types";
import { runQaGate } from "@/lib/blog/qa-gate";
import { ERROR_CODES } from "@/lib/blog/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// QA runs a rubric call and, if REVISE, a full article regeneration.
// Give it the same headroom as generate-articles.
export const maxDuration = 60;

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
    .eq("pipeline_stage", "ARTICLE_GENERATED");

  if (body.postId) query = query.eq("id", body.postId);
  else if (body.runId) query = query.eq("run_id", body.runId);

  const { data, error } = await query
    .order("opportunity_score", { ascending: false })
    .order("created_at", { ascending: true })
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

    const r = await runQaGate(supabase, post, { dryRun });

    if (r.ok && r.outcome) {
      results.push({
        ok: true,
        postId: post.id,
        primary_keyword: post.primary_keyword,
        verdict: r.outcome.verdict,
        finalStage: r.finalStage,
        revised: r.revised ?? false,
        overall_score: r.outcome.overall_score,
        rubric_scores: r.outcome.rubric_scores,
        word_count: r.outcome.word_count,
        hard_rule_violations: r.outcome.hard_rule_violations,
        banned_matches: r.outcome.banned_matches,
        disallowed_links: r.outcome.disallowed_links,
        competitor_matches: r.outcome.competitor_matches,
        feedback: r.outcome.feedback,
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
    console.error("[qa-articles] unhandled:", err instanceof Error ? err.stack ?? err.message : err);
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
