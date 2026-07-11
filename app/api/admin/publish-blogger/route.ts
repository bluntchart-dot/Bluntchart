import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/blog/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { DB } from "@/lib/db/tables";
import type { BlogPostRow } from "@/lib/blog/db-types";
import { publishToBlogger } from "@/lib/blog/blogger-publisher";
import { ERROR_CODES } from "@/lib/blog/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const DEFAULT_COUNT = 1;
const MAX_COUNT = 4;

export async function POST(req: NextRequest) {
  try {
    const authError = requireAdmin(req);
    if (authError) return authError;

    let body: {
      count?: number;
      runId?: string;
      postId?: string;
      dryRun?: boolean;
    } = {};
    try {
      body = await req.json();
    } catch {
      // empty — use defaults
    }

    const count = Math.min(Math.max(body.count ?? DEFAULT_COUNT, 1), MAX_COUNT);
    const dryRun = body.dryRun ?? false;
    const supabase = createSupabaseAdmin();

    let query = supabase
      .from(DB.blogPosts)
      .select("*")
      .eq("pipeline_stage", "IMAGE_UPLOADED");

    if (body.postId) query = query.eq("id", body.postId);
    else if (body.runId) query = query.eq("run_id", body.runId);

    const { data, error } = await query
      .order("opportunity_score", { ascending: false })
      .order("created_at", { ascending: true })
      .limit(count);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    const posts = (data ?? []) as BlogPostRow[];
    if (posts.length === 0) {
      return NextResponse.json({ ok: true, dryRun, processed: 0, results: [] });
    }

    const results: Array<Record<string, unknown>> = [];

    for (const post of posts) {
      const publishRes = await publishToBlogger(supabase, post, { dryRun });

      if (!publishRes.ok) {
        results.push({
          ok: false,
          postId: post.id,
          errorCode: publishRes.errorCode,
          errorMessage: publishRes.errorMessage,
        });
        if (!dryRun) {
          await supabase
            .from(DB.blogPosts)
            .update({
              last_error_code:
                publishRes.errorCode ?? ERROR_CODES.BLOGGER_PUBLISH_FAILED,
              last_error_message:
                (publishRes.errorMessage ?? "unknown").slice(0, 500),
              updated_at: new Date().toISOString(),
            })
            .eq("id", post.id);
        }
        continue;
      }

      if (dryRun) {
        results.push({
          ok: true,
          postId: post.id,
          dryRun: true,
          scheduledPublishAt: publishRes.scheduledPublishAt,
          status: publishRes.status,
          labels: publishRes.labels,
        });
        continue;
      }

      const nextStage = publishRes.status; // "PUBLISHED" or "BLOGGER_SCHEDULED"
      const isPublishedNow = nextStage === "PUBLISHED";

      const { error: updErr } = await supabase
        .from(DB.blogPosts)
        .update({
          blogger_post_id: publishRes.bloggerPostId,
          blogger_url: publishRes.bloggerUrl ?? null,
          scheduled_publish_at: publishRes.scheduledPublishAt,
          labels: publishRes.labels ?? [],
          publishing_status: isPublishedNow ? "published" : "scheduled",
          pipeline_stage: nextStage,
          published_at: isPublishedNow ? new Date().toISOString() : null,
          last_error_code: null,
          last_error_message: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", post.id)
        .eq("pipeline_stage", "IMAGE_UPLOADED");

      if (updErr) {
        results.push({
          ok: false,
          postId: post.id,
          stage: "db",
          errorCode: "DB_UPDATE_FAILED",
          errorMessage: updErr.message,
          bloggerPostId: publishRes.bloggerPostId,
          bloggerUrl: publishRes.bloggerUrl,
        });
        continue;
      }

      results.push({
        ok: true,
        postId: post.id,
        primary_keyword: post.primary_keyword,
        status: nextStage,
        bloggerPostId: publishRes.bloggerPostId,
        bloggerUrl: publishRes.bloggerUrl,
        scheduledPublishAt: publishRes.scheduledPublishAt,
        labels: publishRes.labels,
      });
    }

    const anyOk = results.some((r) => r.ok);
    return NextResponse.json(
      { ok: anyOk, dryRun, processed: results.length, results },
      { status: anyOk ? 200 : 502 }
    );
  } catch (err) {
    console.error(
      "[publish-blogger] unhandled:",
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
