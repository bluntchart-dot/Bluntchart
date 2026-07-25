/**
 * Reading product registry.
 *
 * One entry per reading product. Every product exposes the same shape:
 *   - blueprint    (static structure)
 *   - guidelines   (per-chapter AI direction)
 *   - mockBodies   (in-voice placeholder narratives, until AI is wired in)
 *
 * A future prompt-fragments module hangs off the birth-chart folder and
 * will be joined here once the generator starts calling Claude.
 *
 * Add new products by dropping a folder next to birth-chart and adding
 * an entry to REGISTRY below. The rest of the engine (types, generator,
 * renderer) does not change.
 */

import type {
  BlueprintSection,
  ReadingProduct,
  SectionGuideline,
  SectionId,
} from "@/lib/premium/types";

import {
  ACTIVE_BLUEPRINT_SECTIONS,
  BIRTH_CHART_BLUEPRINT,
  TOTAL_ACTIVE_CHAPTERS,
} from "./birth-chart/blueprint";
import { BIRTH_CHART_GUIDELINES } from "./birth-chart/guidelines";
import { BIRTH_CHART_MOCK_BODIES } from "./birth-chart/mock-content";

export interface ProductDefinition {
  readonly product: ReadingProduct;
  readonly blueprint: readonly BlueprintSection[];
  readonly activeSections: readonly BlueprintSection[];
  readonly totalChapters: number;
  readonly guidelines: Partial<Record<SectionId, SectionGuideline>>;
  readonly mockBodies: Partial<Record<SectionId, string>>;
}

const REGISTRY: Record<ReadingProduct, ProductDefinition | null> = {
  "birth-chart": {
    product: "birth-chart",
    blueprint: BIRTH_CHART_BLUEPRINT,
    activeSections: ACTIVE_BLUEPRINT_SECTIONS,
    totalChapters: TOTAL_ACTIVE_CHAPTERS,
    guidelines: BIRTH_CHART_GUIDELINES,
    mockBodies: BIRTH_CHART_MOCK_BODIES,
  },
  // Reserved slots — implementations added when built.
  compatibility: null,
  "year-ahead": null,
  "gift-reading": null,
};

/**
 * Look up a product by id. Throws if the product is registered but not
 * yet implemented so no caller silently degrades.
 */
export function getProduct(product: ReadingProduct): ProductDefinition {
  const entry = REGISTRY[product];
  if (!entry) {
    throw new Error(
      `[premium/registry] Product "${product}" is reserved but not implemented yet.`
    );
  }
  return entry;
}
