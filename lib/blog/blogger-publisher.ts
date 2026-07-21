import type { SupabaseClient } from "@supabase/supabase-js";
import { DB } from "../db/tables";
import type { BlogPostRow } from "./db-types";
import {
  BLOGGER_LABELS_TAXONOMY,
  MAX_LABELS_PER_POST,
  PUBLISH_HOURS_UTC,
  ERROR_CODES,
} from "./config";
import {
  refreshAccessToken,
  createPost,
  createScheduledPost,
  type BloggerPost,
} from "./blogger-client";

// ── Label mapping ────────────────────────────────────────────────────
//
// Deterministic mapping from the (cluster, target_product) pair to the
// Blogger taxonomy defined in config.ts. Kept small so the whole post
// stays under MAX_LABELS_PER_POST = 4.

const CLUSTER_LABELS: Record<string, string[]> = {
  self_sabotage: ["Emotional Patterns", "Astrology Houses"],
  love_patterns: ["Relationships", "Compatibility"],
  career_money: ["Career", "Astrology Houses"],
  emotional_patterns: ["Moon Sign", "Emotional Patterns"],
  compatibility: ["Compatibility", "Relationships"],
  life_timing: ["Transits", "Saturn Return"],
};

const PRODUCT_LABELS: Record<string, string> = {
  birth_chart: "Birth Chart",
  compatibility: "Compatibility",
  transit: "Transits",
};

const TAXONOMY_SET = new Set<string>(BLOGGER_LABELS_TAXONOMY);

export function chooseLabels(post: BlogPostRow): string[] {
  const raw: string[] = [];
  const cluster = post.content_cluster;
  const product = post.target_product;

  if (cluster && CLUSTER_LABELS[cluster]) {
    raw.push(...CLUSTER_LABELS[cluster]);
  }
  if (product && PRODUCT_LABELS[product]) {
    raw.push(PRODUCT_LABELS[product]);
  }

  const kw = (post.primary_keyword ?? "").toLowerCase();
  if (kw.includes("moon")) raw.push("Moon Sign");
  else if (kw.includes("rising")) raw.push("Rising Sign");
  else if (kw.includes("saturn return")) raw.push("Saturn Return");
  else if (kw.includes("big three")) raw.push("Big Three");

  const seen = new Set<string>();
  const filtered: string[] = [];
  for (const label of raw) {
    if (!TAXONOMY_SET.has(label)) continue;
    if (seen.has(label)) continue;
    seen.add(label);
    filtered.push(label);
    if (filtered.length >= MAX_LABELS_PER_POST) break;
  }
  return filtered;
}

// ── Scheduling ───────────────────────────────────────────────────────
//
// Walk day-by-day starting at `now`. For each day, count how many slots
// are already claimed (BLOGGER_SCHEDULED or PUBLISHED rows landing in
// that day's window), then pick the first PUBLISH_HOURS_UTC slot that is
// (a) after `now` and (b) not already claimed. Bounded by SCHEDULING_HORIZON_DAYS
// so a misconfigured queue can't spin forever.
//
// Correctness note: the previous version stubbed tomorrow's count to 0
// and rolled every subsequent publish to `tomorrow at PUBLISH_HOURS_UTC[0]`,
// so a burst of publishes all clustered on the same 08:00 UTC slot.

const SCHEDULING_HORIZON_DAYS = 14;

export async function computeScheduledPublishAt(
  supabase: SupabaseClient,
  now: Date = new Date()
): Promise<{ at: Date; alreadyDueSlot: boolean }> {
  for (let dayOffset = 0; dayOffset < SCHEDULING_HORIZON_DAYS; dayOffset++) {
    const day = new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + dayOffset
      )
    );
    const claimed = await countPublishesForDate(supabase, day);
    const remainingSlots = PUBLISH_HOURS_UTC.slice(claimed);
    for (const hour of remainingSlots) {
      const candidate = new Date(
        Date.UTC(
          day.getUTCFullYear(),
          day.getUTCMonth(),
          day.getUTCDate(),
          hour,
          0,
          0
        )
      );
      if (candidate.getTime() > now.getTime()) {
        return { at: candidate, alreadyDueSlot: false };
      }
    }
  }

  // Safety fallback — shouldn't hit unless SCHEDULING_HORIZON_DAYS × MAX_POSTS_PER_DAY
  // rows are already scheduled ahead. Land at the last horizon day's first slot.
  const fallback = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() + SCHEDULING_HORIZON_DAYS,
      PUBLISH_HOURS_UTC[0],
      0,
      0
    )
  );
  return { at: fallback, alreadyDueSlot: false };
}

async function countPublishesForDate(
  supabase: SupabaseClient,
  when: Date
): Promise<number> {
  const startIso = new Date(
    Date.UTC(when.getUTCFullYear(), when.getUTCMonth(), when.getUTCDate(), 0, 0, 0)
  ).toISOString();
  const endIso = new Date(
    Date.UTC(when.getUTCFullYear(), when.getUTCMonth(), when.getUTCDate() + 1, 0, 0, 0)
  ).toISOString();

  const { count } = await supabase
    .from(DB.blogPosts)
    .select("id", { count: "exact", head: true })
    .gte("scheduled_publish_at", startIso)
    .lt("scheduled_publish_at", endIso)
    .in("pipeline_stage", ["BLOGGER_SCHEDULED", "PUBLISHED"]);

  return count ?? 0;
}

// ── HTML assembly ────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function assembleBloggerHtml(post: BlogPostRow): string {
  const parts: string[] = [];
  if (post.image_url && post.image_alt) {
    parts.push(
      `<p><img src="${escapeHtml(post.image_url)}" alt="${escapeHtml(post.image_alt)}" loading="lazy" style="width:100%;height:auto;border-radius:12px;" /></p>`
    );
  }
  parts.push(post.article_html ?? "");
  return parts.join("\n");
}

// ── Publish entry-point ──────────────────────────────────────────────

export interface PublishResult {
  ok: boolean;
  bloggerPostId?: string;
  bloggerUrl?: string;
  scheduledPublishAt?: string;
  status?: "PUBLISHED" | "BLOGGER_SCHEDULED";
  labels?: string[];
  errorCode?: string;
  errorMessage?: string;
}

export interface PublishOptions {
  dryRun?: boolean;
  scheduleAheadMinutes?: number;
  now?: Date;
}

/**
 * Publish or schedule a single post. Never overwrites: relies on
 * blogger-client.createPost / createScheduledPost, both of which POST
 * fresh entries. If the row already has a blogger_post_id, publishing
 * again would create a duplicate — callers should therefore call this
 * only on rows still at IMAGE_UPLOADED.
 */
export async function publishToBlogger(
  supabase: SupabaseClient,
  post: BlogPostRow,
  options: PublishOptions = {}
): Promise<PublishResult> {
  if (!post.title || !post.article_html) {
    return {
      ok: false,
      errorCode: ERROR_CODES.BLOGGER_PUBLISH_FAILED,
      errorMessage: "post is missing title or article_html",
    };
  }

  const labels = chooseLabels(post);
  const html = assembleBloggerHtml(post);
  const now = options.now ?? new Date();
  const scheduleAheadMinutes = options.scheduleAheadMinutes ?? 5;

  const { at } = await computeScheduledPublishAt(supabase, now);
  const millisFromNow = at.getTime() - now.getTime();
  const publishNow = millisFromNow < scheduleAheadMinutes * 60 * 1000;

  if (options.dryRun) {
    return {
      ok: true,
      labels,
      scheduledPublishAt: at.toISOString(),
      status: publishNow ? "PUBLISHED" : "BLOGGER_SCHEDULED",
    };
  }

  let accessToken: string;
  try {
    accessToken = await refreshAccessToken();
  } catch (err) {
    return {
      ok: false,
      errorCode: ERROR_CODES.BLOGGER_PUBLISH_FAILED,
      errorMessage: `oauth: ${(err instanceof Error ? err.message : String(err)).slice(0, 250)}`,
    };
  }

  let created: BloggerPost;
  try {
    if (publishNow) {
      created = await createPost(
        accessToken,
        { title: post.title, content: html, labels },
        false
      );
    } else {
      created = await createScheduledPost(
        accessToken,
        { title: post.title, content: html, labels },
        at
      );
    }
  } catch (err) {
    return {
      ok: false,
      errorCode: publishNow
        ? ERROR_CODES.BLOGGER_PUBLISH_FAILED
        : ERROR_CODES.BLOGGER_SCHEDULE_FAILED,
      errorMessage: (err instanceof Error ? err.message : String(err)).slice(0, 300),
    };
  }

  if (!created.id) {
    return {
      ok: false,
      errorCode: ERROR_CODES.BLOGGER_PUBLISH_FAILED,
      errorMessage: "Blogger returned no post id",
    };
  }

  return {
    ok: true,
    bloggerPostId: created.id,
    bloggerUrl: created.url,
    scheduledPublishAt: at.toISOString(),
    status: publishNow ? "PUBLISHED" : "BLOGGER_SCHEDULED",
    labels,
  };
}
