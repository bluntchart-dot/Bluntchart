import type { ReadingProduct } from "@/lib/premium/types";

export interface BundleDefinition {
  readonly id: string;
  readonly name: string;
  readonly products: readonly ReadingProduct[];
}

const BUNDLES: Record<string, BundleDefinition> = {
  "self-discovery-bundle": {
    id: "self-discovery-bundle",
    name: "Self Discovery Bundle",
    products: ["brutally-honest-reading", "shadow-reading", "moon-reading"],
  },
  "love-bundle": {
    id: "love-bundle",
    name: "Love Bundle",
    products: ["love-reading", "compatibility"],
  },
  "career-money-bundle": {
    id: "career-money-bundle",
    name: "Career & Money Bundle",
    products: ["career-reading", "money-reading"],
  },
  "full-reading-bundle": {
    id: "full-reading-bundle",
    name: "Full Reading Bundle",
    products: ["brutally-honest-reading", "love-reading", "career-reading", "shadow-reading"],
  },
};

export function getBundle(id: string): BundleDefinition | null {
  return BUNDLES[id] ?? null;
}

export function getBundleProducts(id: string): readonly ReadingProduct[] | null {
  return BUNDLES[id]?.products ?? null;
}

export function isBundle(id: string): boolean {
  return id in BUNDLES;
}

export function getAllBundles(): Record<string, BundleDefinition> {
  return { ...BUNDLES };
}
