/**
 * lib/etsy/listing-map.ts
 *
 * Maps Etsy listing IDs to internal product types.
 * Updated when new listings are created on Etsy.
 *
 * Each listing ID is a number from the Etsy dashboard URL.
 * Example: etsy.com/listing/1234567890 → listing_id = 1234567890
 */

import type { ReadingProduct } from "@/lib/premium/types";
import { isBundle, getBundleProducts } from "@/lib/pipeline/bundles";

export type ListingResolution =
  | { type: "product"; product: ReadingProduct }
  | { type: "bundle"; bundleId: string; products: readonly ReadingProduct[] };

const ETSY_LISTING_MAP: Record<string, string> = {
  // Populate these when actual Etsy listings are created.
  // Single products:
  // "1234567890": "brutally-honest-reading",
  // Bundles:
  // "1234567895": "self-discovery-bundle",
};

export function resolveListingId(listingId: string | number): ListingResolution | null {
  const val = ETSY_LISTING_MAP[String(listingId)];
  if (!val) return null;
  if (isBundle(val)) {
    const products = getBundleProducts(val);
    if (!products) return null;
    return { type: "bundle", bundleId: val, products };
  }
  return { type: "product", product: val as ReadingProduct };
}

export function productFromListingId(listingId: string | number): ReadingProduct | null {
  const resolution = resolveListingId(listingId);
  if (!resolution || resolution.type !== "product") return null;
  return resolution.product;
}

export function registerListing(listingId: string | number, productOrBundle: string): void {
  ETSY_LISTING_MAP[String(listingId)] = productOrBundle;
}

export function getAllMappings(): Record<string, string> {
  return { ...ETSY_LISTING_MAP };
}

/**
 * Attempts to determine product from listing title keywords
 * when the listing ID isn't in the map. Fallback only.
 */
export function guessProductFromTitle(title: string): ReadingProduct | null {
  const t = title.toLowerCase();

  if (t.includes("yes") && t.includes("no") && t.includes("tarot")) return "yes-no-tarot";
  if (t.includes("three card") || t.includes("3 card") || t.includes("past present future")) return "three-card-tarot";
  if (t.includes("daily tarot") || t.includes("card of the day")) return "daily-tarot";
  if (t.includes("compatibility") && t.includes("reading")) return "compatibility";
  if (t.includes("love") && t.includes("reading")) return "love-reading";
  if (t.includes("career") && t.includes("reading")) return "career-reading";
  if (t.includes("shadow")) return "shadow-reading";
  if (t.includes("saturn return")) return "saturn-return";
  if (t.includes("moon reading")) return "moon-reading";
  if (t.includes("money") && t.includes("reading")) return "money-reading";
  if (t.includes("year ahead")) return "year-ahead";
  if (t.includes("gift") && t.includes("reading")) return "gift-reading";
  if (t.includes("monthly transit") || t.includes("monthly forecast") || t.includes("next 3 month") || t.includes("3 month forecast")) return "monthly-transit";
  if (t.includes("in-depth") || t.includes("in depth")) return "in-depth-reading";
  if (t.includes("birth chart book") || t.includes("premium birth chart")) return "birth-chart";
  if (t.includes("big 3") || t.includes("big three") || t.includes("mini birth chart")) return "big-three-mini";
  if (t.includes("soulmate") || t.includes("twin flame") || t.includes("future spouse")) return "soulmate-reading";
  if (t.includes("hidden feeling") || t.includes("what are they thinking")) return "hidden-feelings";
  if (t.includes("ex") && (t.includes("come back") || t.includes("reconcil"))) return "ex-love-reading";
  if (t.includes("blunt") && t.includes("love")) return "blunt-love";
  if (t.includes("blunt") && t.includes("career")) return "blunt-career";
  if (t.includes("life purpose") || t.includes("what you're here")) return "life-purpose";
  if (t.includes("personality decoded") || t.includes("personality deep")) return "personality-decoded";
  if (t.includes("situationship") || t.includes("reality check") && t.includes("love")) return "situationship-reality-check";
  if (t.includes("blind reading") || t.includes("no question")) return "blind-reading";
  if (t.includes("brutally honest") || t.includes("birth chart reading")) return "brutally-honest-reading";

  return null;
}

export function guessBundleFromTitle(title: string): string | null {
  const t = title.toLowerCase();
  if (t.includes("full") && t.includes("bundle")) return "full-reading-bundle";
  if (t.includes("self") && t.includes("discovery") && t.includes("bundle")) return "self-discovery-bundle";
  if (t.includes("love") && t.includes("bundle")) return "love-bundle";
  if (t.includes("career") && t.includes("money") && t.includes("bundle")) return "career-money-bundle";
  return null;
}
