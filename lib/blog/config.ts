/**
 * Centralized configuration for the blog automation pipeline.
 *
 * ALL provider-specific model IDs, endpoints, and tunables live here.
 * When upgrading models, rotating keys, switching providers, or enabling
 * paid tiers — change this file only.  The pipeline, schema, and
 * publishing layers reference these values and do not hardcode providers.
 */

// ── AI text generation (currently: Google Gemini free tier) ─────────

export const AI_PROVIDER = "gemini" as const;

export const MODELS = {
  /** Strongest free-tier flash model — used for article writing. */
  articleGeneration: "gemini-3.5-flash",

  /** Mid-tier — used for content briefs, outreach email drafts. */
  contentBrief: "gemini-2.5-flash",

  /** Cheapest/fastest — used for keyword scoring, dedup, classification, QA. */
  scoring: "gemini-3.1-flash-lite",

  /** Fallback if the primary article model 429s. */
  articleFallback: "gemini-2.5-flash",

  /** QA gate — structured rubric scoring. */
  qaGate: "gemini-3.1-flash-lite",

  /** Backlink qualification scoring. */
  backlinkScoring: "gemini-3.1-flash-lite",

  /** Outreach email personalization. */
  outreachDraft: "gemini-2.5-flash",
} as const;

/**
 * Models that support native responseSchema enforcement (no thinking
 * preamble issues).  For all other models, use thinkingBudget: 0 when
 * requesting JSON output.
 */
export const NATIVE_JSON_MODELS = new Set([
  "gemini-3.1-flash-lite",
  "gemini-2.0-flash-lite",
]);

// ── Image generation (currently: Cloudflare Workers AI) ─────────────

export const IMAGE_PROVIDER = "cloudflare" as const;

export const IMAGE_MODEL = "@cf/black-forest-labs/flux-1-schnell";

export const IMAGE_ENDPOINT =
  "https://api.cloudflare.com/client/v4/accounts/{accountId}/ai/run/{model}";

// ── Image hosting (currently: Supabase Storage) ─────────────────────

export const IMAGE_STORAGE_BUCKET = "blog-images";

// ── Blog publishing (currently: Blogger API v3) ─────────────────────

export const BLOG_URL = "https://blog.bluntchart.com";

export const BLOGGER_LABELS_TAXONOMY = [
  "Birth Chart",
  "Moon Sign",
  "Rising Sign",
  "Big Three",
  "Compatibility",
  "Relationships",
  "Career",
  "Astrology Houses",
  "Planets",
  "Saturn Return",
  "Transits",
  "Emotional Patterns",
] as const;

export const MAX_LABELS_PER_POST = 4;

// ── Scheduling (staggered across US/UK/AU peak hours) ───────────────

/** UTC hours at which daily posts are scheduled. */
export const PUBLISH_HOURS_UTC = [8, 13, 17, 22] as const;

// ── Pipeline limits ─────────────────────────────────────────────────

export const MAX_POSTS_PER_DAY = 4;
export const MAX_QA_REVISIONS = 1;
export const MAX_RETRIES_PER_STAGE = 1;

// ── Content clusters ────────────────────────────────────────────────

export const CONTENT_CLUSTERS = [
  "self_sabotage",
  "love_patterns",
  "career_money",
  "emotional_patterns",
  "compatibility",
  "life_timing",
] as const;

export type ContentCluster = (typeof CONTENT_CLUSTERS)[number];

// ── Target products ─────────────────────────────────────────────────

export const TARGET_PRODUCTS = {
  birth_chart: { status: "live" as const, url: "/free-birth-chart" },
  compatibility: { status: "upcoming" as const, url: null },
  transit: { status: "upcoming" as const, url: null },
} as const;

export type TargetProduct = keyof typeof TARGET_PRODUCTS;

// ── Pipeline stages (in order) ──────────────────────────────────────

export const PIPELINE_STAGES = [
  "TOPIC_SELECTED",
  "BRIEF_CREATED",
  "ARTICLE_GENERATED",
  "QA_PASSED",
  "IMAGE_GENERATED",
  "IMAGE_UPLOADED",
  "BLOGGER_CREATED",
  "BLOGGER_SCHEDULED",
  "PUBLISHED",
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const TERMINAL_STAGES = new Set([
  "PUBLISHED",
  "QA_FAILED",
  "REJECTED",
]);

// ── Error codes ─────────────────────────────────────────────────────

export const ERROR_CODES = {
  GEMINI_QUOTA_EXHAUSTED: "GEMINI_QUOTA_EXHAUSTED",
  GEMINI_MODEL_UNAVAILABLE: "GEMINI_MODEL_UNAVAILABLE",
  GEMINI_INVALID_JSON: "GEMINI_INVALID_JSON",
  GEMINI_GENERATION_FAILED: "GEMINI_GENERATION_FAILED",
  IMAGE_GENERATION_QUOTA_ERROR: "IMAGE_GENERATION_QUOTA_ERROR",
  IMAGE_GENERATION_FAILED: "IMAGE_GENERATION_FAILED",
  IMAGE_UPLOAD_FAILED: "IMAGE_UPLOAD_FAILED",
  BLOGGER_PUBLISH_FAILED: "BLOGGER_PUBLISH_FAILED",
  BLOGGER_SCHEDULE_FAILED: "BLOGGER_SCHEDULE_FAILED",
  QA_FAILED: "QA_FAILED",
  DUPLICATE_TOPIC: "DUPLICATE_TOPIC",
  PIPELINE_TIMEOUT: "PIPELINE_TIMEOUT",
} as const;

// ── Banned AI phrases (QA gate rejects articles containing these) ───

export const BANNED_PHRASES = [
  "let's dive in",
  "let's delve into",
  "unlock the secrets",
  "celestial tapestry",
  "cosmic dance",
  "embark on a journey",
  "in today's fast-paced world",
  "whether you're a seasoned astrology enthusiast",
  "in conclusion",
  "astrology has fascinated humans for centuries",
  "leos love attention",
  "scorpios are mysterious",
  "virgos are perfectionists",
];
