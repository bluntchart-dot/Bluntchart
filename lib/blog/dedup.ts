import { createHash } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { DB } from "../db/tables";

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "could",
  "should", "may", "might", "can", "shall", "it", "its", "my", "your",
  "his", "her", "our", "their", "this", "that", "these", "those", "what",
  "which", "who", "whom", "how", "when", "where", "why",
]);

export function normalizeTopic(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !STOP_WORDS.has(w))
    .sort()
    .join(" ");
}

export function computeDedupHash(normalizedTopic: string): string {
  return createHash("sha256").update(normalizedTopic).digest("hex").slice(0, 32);
}

export async function getExistingHashes(
  supabase: SupabaseClient,
  hashes: string[]
): Promise<Set<string>> {
  if (hashes.length === 0) return new Set();

  const { data } = await supabase
    .from(DB.blogPosts)
    .select("dedup_hash")
    .in("dedup_hash", hashes);

  return new Set(
    (data ?? []).map((r: { dedup_hash: string }) => r.dedup_hash)
  );
}

export async function getRecentTopics(
  supabase: SupabaseClient,
  limit = 50
): Promise<string[]> {
  const { data } = await supabase
    .from(DB.blogPosts)
    .select("primary_keyword")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map(
    (r: { primary_keyword: string }) => r.primary_keyword
  );
}
