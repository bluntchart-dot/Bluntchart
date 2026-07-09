import type { SupabaseClient } from "@supabase/supabase-js";
import { DB } from "../db/tables";
import type { BlogPostRow } from "./db-types";
import {
  MODELS,
  BANNED_PHRASES,
  TARGET_PRODUCTS,
  type TargetProduct,
} from "./config";
import { generateJson, Type } from "./gemini-client";
import { CLUSTER_LINK_MAP, getCtaUrl } from "./internal-links";

export interface ContentBrief {
  angle_summary: string;
  reader_pain_point: string;
  problem_signals: string[];
  proposed_title: string;
  meta_description: string;
  target_word_count: number;
  key_sections: Array<{
    h2: string;
    angle: string;
    must_cover: string[];
    reader_takeaway: string;
  }>;
  faq: Array<{ q: string; a_gist: string }>;
  cta_plan: {
    target_product: TargetProduct;
    product_status: "live" | "upcoming";
    cta_url: string;
    cta_hook: string;
    upcoming_teaser: string | null;
  };
  internal_link_candidates: Array<{ url: string; label: string; context: string }>;
}

const BRIEF_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    angle_summary: { type: Type.STRING },
    reader_pain_point: { type: Type.STRING },
    problem_signals: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    proposed_title: { type: Type.STRING },
    meta_description: { type: Type.STRING },
    target_word_count: { type: Type.INTEGER },
    key_sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          h2: { type: Type.STRING },
          angle: { type: Type.STRING },
          must_cover: { type: Type.ARRAY, items: { type: Type.STRING } },
          reader_takeaway: { type: Type.STRING },
        },
        required: ["h2", "angle", "must_cover", "reader_takeaway"],
      },
    },
    faq: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          q: { type: Type.STRING },
          a_gist: { type: Type.STRING },
        },
        required: ["q", "a_gist"],
      },
    },
  },
  required: [
    "angle_summary",
    "reader_pain_point",
    "problem_signals",
    "proposed_title",
    "meta_description",
    "target_word_count",
    "key_sections",
    "faq",
  ],
};

function upcomingTeaser(product: TargetProduct): string | null {
  if (product === "compatibility") {
    return "BluntChart's Compatibility Chart is launching soon. In the meantime, run your own birth chart — you'll need it as the baseline the compatibility tool reads from.";
  }
  if (product === "transit") {
    return "BluntChart's Transit Chart is launching soon. Start with your birth chart today so the transit tool has your natal placements the moment it goes live.";
  }
  return null;
}

function buildBriefPrompt(post: BlogPostRow): string {
  const cluster = post.content_cluster ?? "self_sabotage";
  const linkCandidates = CLUSTER_LINK_MAP[cluster] ?? [];
  const linkList = linkCandidates
    .map((l) => `- ${l.url}  →  "${l.label}"`)
    .join("\n");

  const product = (post.target_product ?? "birth_chart") as TargetProduct;
  const productInfo = TARGET_PRODUCTS[product];
  const productLine =
    productInfo.status === "live"
      ? `${product} — LIVE at ${productInfo.url}`
      : `${product} — UPCOMING (do NOT invent a URL; link only to /free-birth-chart)`;

  return `You are a senior SEO + AEO content strategist for BluntChart, an astrology SaaS.

Your job is to plan ONE blog article that ranks on Google, gets cited by Google's AI Overviews and Perplexity, AND converts readers into trying a BluntChart tool. The article should make the reader feel "wait — how does this know me?" within the first 100 words.

TOPIC:
- primary_keyword: ${post.primary_keyword}
- secondary_keywords: ${(post.secondary_keywords ?? []).join(", ")}
- search_intent: ${post.search_intent ?? "informational"}
- content_cluster: ${cluster}
- target_product: ${productLine}
- conversion_angle: ${post.conversion_angle ?? ""}

INTERNAL LINK CANDIDATES for this cluster (only these URLs are live — never invent others):
${linkList}

WHAT MAKES A GREAT BRIEF for BluntChart:
- reader_pain_point must be a specific, second-person recognition ("You keep dating people who go cold after week three") — NOT a category ("relationship problems").
- problem_signals: 4-6 concrete "if you..." patterns a reader would silently nod at.
- proposed_title: 50-65 chars, keyword-forward, conversational, benefit or curiosity hook — never clickbait.
- meta_description: 150-160 chars, includes the primary_keyword naturally, ends with a soft benefit or CTA-adjacent line.
- target_word_count: 1200-1800.
- key_sections: 4-6 H2s. Each H2 should read like a question the reader would type into Google or ask out loud ("Why do I keep attracting emotionally unavailable partners?"). must_cover items must reference concrete astrology mechanics — placements, aspects, houses, transits — not generic sun-sign traits.
- faq: 3-5 questions. Each question must be a real Google-style query. a_gist is a 1-2 sentence direct answer optimized for AI Overview extraction.

CONVERSION RULES:
- Every article funnels toward the target product's live CTA URL. If the target product is UPCOMING, the CTA still points at /free-birth-chart, and the article mentions the upcoming product as a teaser only — never as a link.
- No sun-sign clichés ("Leos love attention", "Scorpios are mysterious").
- No AI-slop openers.

BANNED PHRASES the article must never contain (call this out in the brief so the writer avoids them):
${BANNED_PHRASES.map((p) => `- "${p}"`).join("\n")}

Return a strict JSON object with the schema fields. Do not include cta_plan or internal_link_candidates — those are computed after your response.`;
}

export interface BriefResult {
  ok: boolean;
  dryRun: boolean;
  brief?: ContentBrief;
  errorCode?: string;
  errorMessage?: string;
}

/**
 * Structural check for a brief that the article writer can consume.
 * Guards against Gemini returning an alternate JSON shape (e.g. nesting
 * strategy fields under a wrapper key) — which is exactly how the
 * original brief-generation bug slipped past. Returns the list of
 * missing/empty required fields, empty when the brief is usable.
 */
export function validateBriefShape(brief: unknown): {
  ok: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  const b = brief as Record<string, unknown> | null | undefined;

  const isNonEmptyString = (v: unknown): boolean =>
    typeof v === "string" && v.trim().length > 0;
  const isNonEmptyArray = (v: unknown): boolean =>
    Array.isArray(v) && v.length > 0;

  if (!b || typeof b !== "object") {
    return { ok: false, missing: ["<brief is not an object>"] };
  }

  if (!isNonEmptyString(b.reader_pain_point)) missing.push("reader_pain_point");
  if (!isNonEmptyString(b.proposed_title)) missing.push("proposed_title");
  if (!isNonEmptyString(b.meta_description)) missing.push("meta_description");
  if (!isNonEmptyArray(b.problem_signals)) missing.push("problem_signals");
  if (!isNonEmptyArray(b.key_sections)) missing.push("key_sections");
  if (!isNonEmptyArray(b.faq)) missing.push("faq");

  return { ok: missing.length === 0, missing };
}

export async function generateBrief(
  supabase: SupabaseClient,
  post: BlogPostRow,
  options: { dryRun?: boolean } = {}
): Promise<BriefResult> {
  const dryRun = options.dryRun ?? false;
  const prompt = buildBriefPrompt(post);

  const result = await generateJson<Omit<ContentBrief, "cta_plan" | "internal_link_candidates">>({
    model: MODELS.contentBrief,
    prompt,
    schema: BRIEF_SCHEMA,
    temperature: 0.6,
    maxOutputTokens: 3000,
  });

  if (!result.ok || !result.data) {
    return {
      ok: false,
      dryRun,
      errorCode: result.errorCode,
      errorMessage: result.errorMessage,
    };
  }

  const shape = validateBriefShape(result.data);
  if (!shape.ok) {
    return {
      ok: false,
      dryRun,
      errorCode: "BRIEF_MALFORMED",
      errorMessage: `Gemini returned a brief missing required fields: ${shape.missing.join(", ")}`,
    };
  }

  const product = (post.target_product ?? "birth_chart") as TargetProduct;
  const productInfo = TARGET_PRODUCTS[product];
  const ctaUrl = getCtaUrl(product);
  const cluster = post.content_cluster ?? "self_sabotage";
  const linkCandidates = (CLUSTER_LINK_MAP[cluster] ?? []).map((l) => ({
    url: l.url,
    label: l.label,
    context: `Natural fit for ${cluster.replace(/_/g, " ")} content`,
  }));

  const brief: ContentBrief = {
    ...result.data,
    target_word_count: Math.max(800, Math.min(2500, result.data.target_word_count || 1500)),
    cta_plan: {
      target_product: product,
      product_status: productInfo.status,
      cta_url: ctaUrl,
      cta_hook:
        post.conversion_angle ??
        "The article's insight naturally leads the reader to want their own chart.",
      upcoming_teaser: productInfo.status === "upcoming" ? upcomingTeaser(product) : null,
    },
    internal_link_candidates: linkCandidates,
  };

  if (dryRun) {
    return { ok: true, dryRun: true, brief };
  }

  const { error } = await supabase
    .from(DB.blogPosts)
    .update({
      content_brief: brief,
      pipeline_stage: "BRIEF_CREATED",
      updated_at: new Date().toISOString(),
    })
    .eq("id", post.id)
    .eq("pipeline_stage", "TOPIC_SELECTED");

  if (error) {
    return {
      ok: false,
      dryRun: false,
      errorCode: "DB_UPDATE_FAILED",
      errorMessage: error.message,
    };
  }

  return { ok: true, dryRun: false, brief };
}
