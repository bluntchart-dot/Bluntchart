import type { SupabaseClient } from "@supabase/supabase-js";
import { DB } from "../db/tables";

/** Kebab-case slug from arbitrary title text. */
export function toSlug(input: string, maxLength = 60): string {
  const base = input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, maxLength)
    .replace(/-+$/g, "");
  return base || "post";
}

/**
 * Returns a slug that does not collide with any existing blog_posts.slug.
 * The migration does not enforce UNIQUE(slug) — this is a lazy code-level check.
 */
export async function uniqueSlug(
  supabase: SupabaseClient,
  base: string
): Promise<string> {
  let candidate = base;
  for (let i = 2; i < 100; i++) {
    const { data } = await supabase
      .from(DB.blogPosts)
      .select("id")
      .eq("slug", candidate)
      .limit(1)
      .maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${i}`.slice(0, 60).replace(/-+$/g, "");
  }
  return `${base}-${Date.now()}`.slice(0, 60);
}
