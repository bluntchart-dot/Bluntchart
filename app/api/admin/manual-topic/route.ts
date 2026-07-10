import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/blog/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { DB } from "@/lib/db/tables";
import { createOrGetTodayRun } from "@/lib/blog/run-manager";
import {
  normalizeTopic,
  computeDedupHash,
  getExistingHashes,
} from "@/lib/blog/dedup";
import { getCtaUrl } from "@/lib/blog/internal-links";
import { TARGET_PRODUCTS } from "@/lib/blog/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Sentinel that puts manual topics ahead of Gemini-scored topics in
 * every existing .order("opportunity_score", desc) queue. Gemini's
 * scores are clamped to 1-100 in topic-discovery.ts, so any value >100
 * is safe. Kept as a documented constant so operators know the number
 * is a routing sentinel, not a real quality signal.
 */
const MANUAL_PRIORITY_SCORE = 1000;

interface ManualTopicBody {
  topic?: string;
  keywords?: string[];
}

export async function POST(req: NextRequest) {
  try {
    const authError = requireAdmin(req);
    if (authError) return authError;

    let body: ManualTopicBody = {};
    try {
      body = (await req.json()) as ManualTopicBody;
    } catch {
      return NextResponse.json(
        { ok: false, errorCode: "INVALID_BODY", errorMessage: "Body must be JSON" },
        { status: 400 }
      );
    }

    const topic = (body.topic ?? "").trim();
    if (!topic) {
      return NextResponse.json(
        { ok: false, errorCode: "MISSING_TOPIC", errorMessage: "topic is required" },
        { status: 400 }
      );
    }
    if (topic.length > 240) {
      return NextResponse.json(
        { ok: false, errorCode: "TOPIC_TOO_LONG", errorMessage: "topic must be <=240 chars" },
        { status: 400 }
      );
    }

    const rawKeywords = Array.isArray(body.keywords) ? body.keywords : [];
    const keywords = rawKeywords
      .map((k) => (typeof k === "string" ? k.trim() : ""))
      .filter((k) => k.length > 0 && k.length <= 120)
      .slice(0, 8);

    const supabase = createSupabaseAdmin();

    const runResult = await createOrGetTodayRun(supabase, false);
    if (!runResult.ok || !runResult.run) {
      return NextResponse.json(
        { ok: false, errorCode: "RUN_CREATE_FAILED", errorMessage: runResult.error ?? "Failed to create today's run" },
        { status: 500 }
      );
    }

    const normalized = normalizeTopic(topic);
    const dedupHash = computeDedupHash(normalized);

    // Dedup against every past topic (Gemini or manual)
    const existing = await getExistingHashes(supabase, [dedupHash]);
    if (existing.has(dedupHash)) {
      return NextResponse.json(
        {
          ok: false,
          errorCode: "DUPLICATE_TOPIC",
          errorMessage: "This topic (or a normalized variant) already exists in blog_posts",
          normalized_topic: normalized,
          dedup_hash: dedupHash,
        },
        { status: 409 }
      );
    }

    // Product mapping is left to the brief stage. We seed a sane default
    // (birth_chart) so the CTA URL is not null before the brief runs.
    const defaultProduct: keyof typeof TARGET_PRODUCTS = "birth_chart";

    const row = {
      run_id: runResult.run.id,
      source: "manual",
      primary_keyword: topic,
      normalized_topic: normalized,
      secondary_keywords: keywords.length > 0 ? keywords : null,
      search_intent: null,
      content_cluster: null,
      target_product: null,
      product_status: TARGET_PRODUCTS[defaultProduct].status,
      conversion_angle: null,
      cta_destination: getCtaUrl(defaultProduct),
      opportunity_score: MANUAL_PRIORITY_SCORE,
      dedup_hash: dedupHash,
      pipeline_stage: "TOPIC_SELECTED",
      publishing_status: "pending",
    };

    const { data, error } = await supabase
      .from(DB.blogPosts)
      .insert(row)
      .select("id, primary_keyword, source, opportunity_score, pipeline_stage, run_id, created_at")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, errorCode: "DB_INSERT_FAILED", errorMessage: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, post: data }, { status: 201 });
  } catch (err) {
    console.error("[manual-topic] unhandled:", err instanceof Error ? err.stack ?? err.message : err);
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
