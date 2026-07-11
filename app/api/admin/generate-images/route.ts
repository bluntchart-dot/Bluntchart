import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/blog/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { DB } from "@/lib/db/tables";
import type { BlogPostRow } from "@/lib/blog/db-types";
import { buildImagePrompt } from "@/lib/blog/image-prompt";
import { generateImage } from "@/lib/blog/image-generator";
import { uploadImage } from "@/lib/blog/image-uploader";
import { ERROR_CODES } from "@/lib/blog/config";
import type { ContentBrief } from "@/lib/blog/content-brief";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Image work is small per post (~3-8s Cloudflare + <1s upload).
// Default 1 per invocation but allow up to 4.
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
      // empty body — use defaults
    }

    const count = Math.min(Math.max(body.count ?? DEFAULT_COUNT, 1), MAX_COUNT);
    const dryRun = body.dryRun ?? false;
    const supabase = createSupabaseAdmin();

    let query = supabase
      .from(DB.blogPosts)
      .select("*")
      .eq("pipeline_stage", "QA_PASSED");

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
    let quotaHit = false;

    for (const post of posts) {
      if (quotaHit) break;

      const brief = post.content_brief as unknown as ContentBrief | null;
      const title = post.title ?? post.primary_keyword;
      if (!brief) {
        results.push({
          ok: false,
          postId: post.id,
          errorCode: "MISSING_BRIEF",
          errorMessage: "content_brief is empty",
        });
        continue;
      }

      const promptRes = await buildImagePrompt(title, brief);
      if (!promptRes.ok || !promptRes.image_prompt || !promptRes.image_alt) {
        results.push({
          ok: false,
          postId: post.id,
          stage: "prompt",
          errorCode: promptRes.errorCode,
          errorMessage: promptRes.errorMessage,
        });
        if (promptRes.errorCode === ERROR_CODES.GEMINI_QUOTA_EXHAUSTED) {
          quotaHit = true;
        }
        continue;
      }

      const genRes = await generateImage(promptRes.image_prompt);
      if (!genRes.ok || !genRes.bytes || !genRes.contentType) {
        results.push({
          ok: false,
          postId: post.id,
          stage: "generation",
          image_prompt: promptRes.image_prompt,
          errorCode: genRes.errorCode,
          errorMessage: genRes.errorMessage,
        });
        if (genRes.errorCode === ERROR_CODES.IMAGE_GENERATION_QUOTA_ERROR) {
          quotaHit = true;
        }
        if (!dryRun) {
          await supabase
            .from(DB.blogPosts)
            .update({
              image_prompt: promptRes.image_prompt,
              image_alt: promptRes.image_alt,
              last_error_code: genRes.errorCode ?? ERROR_CODES.IMAGE_GENERATION_FAILED,
              last_error_message:
                (genRes.errorMessage ?? "unknown").slice(0, 500),
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
          stage: "dry",
          image_prompt: promptRes.image_prompt,
          image_alt: promptRes.image_alt,
          image_bytes_length: genRes.bytes.length,
          image_content_type: genRes.contentType,
        });
        continue;
      }

      const upload = await uploadImage(
        supabase,
        post.id,
        genRes.bytes,
        genRes.contentType
      );
      if (!upload.ok || !upload.publicUrl) {
        results.push({
          ok: false,
          postId: post.id,
          stage: "upload",
          errorCode: upload.errorCode,
          errorMessage: upload.errorMessage,
        });
        await supabase
          .from(DB.blogPosts)
          .update({
            image_prompt: promptRes.image_prompt,
            image_alt: promptRes.image_alt,
            last_error_code: upload.errorCode ?? ERROR_CODES.IMAGE_UPLOAD_FAILED,
            last_error_message: (upload.errorMessage ?? "unknown").slice(0, 500),
            updated_at: new Date().toISOString(),
          })
          .eq("id", post.id);
        continue;
      }

      const { error: updateError } = await supabase
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
        .eq("id", post.id)
        .eq("pipeline_stage", "QA_PASSED");

      if (updateError) {
        results.push({
          ok: false,
          postId: post.id,
          stage: "db",
          errorCode: "DB_UPDATE_FAILED",
          errorMessage: updateError.message,
        });
        continue;
      }

      results.push({
        ok: true,
        postId: post.id,
        primary_keyword: post.primary_keyword,
        image_url: upload.publicUrl,
        image_alt: promptRes.image_alt,
        image_bytes_length: genRes.bytes.length,
        image_content_type: genRes.contentType,
      });
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
    console.error(
      "[generate-images] unhandled:",
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
