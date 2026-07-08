import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/blog/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { DB } from "@/lib/db/tables";
import type { BlogPostRow } from "@/lib/blog/db-types";
import { generateBrief } from "@/lib/blog/content-brief";
import { ERROR_CODES, MAX_POSTS_PER_DAY } from "@/lib/blog/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  let body: { count?: number; runId?: string; postId?: string; dryRun?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    // empty body — use defaults
  }

  const count = Math.min(Math.max(body.count ?? MAX_POSTS_PER_DAY, 1), MAX_POSTS_PER_DAY);
  const dryRun = body.dryRun ?? false;
  const supabase = createSupabaseAdmin();

  let query = supabase
    .from(DB.blogPosts)
    .select("*")
    .eq("pipeline_stage", "TOPIC_SELECTED");

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

    const r = await generateBrief(supabase, post, { dryRun });

    if (r.ok) {
      results.push({
        ok: true,
        postId: post.id,
        primary_keyword: post.primary_keyword,
        brief: r.brief,
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
}
