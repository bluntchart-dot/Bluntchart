/**
 * lib/premium/versions.ts
 *
 * Version constants persisted with each generated reading. Bump these
 * manually when the engine changes. Prompt/blueprint versions are
 * derived at boot from string hashes so a prompt edit auto-bumps.
 *
 * Product-aware: each product gets its own computed prompt/blueprint
 * hash so changes to one product don't affect the other's version.
 */

import { createHash } from "node:crypto";
import type { ReadingProduct } from "./types";
import { getProduct } from "./products/registry";

export const PRODUCT_VERSION = "birth-chart-1.1.0" as const;
export const IN_DEPTH_READING_PRODUCT_VERSION = "in-depth-reading-1.0.0" as const;
export const INSIGHT_ENGINE_VERSION = "insight-1.0.0" as const;

function shortHash(input: string): string {
  return createHash("sha256").update(input).digest("hex").slice(0, 8);
}

function computePromptVersion(systemPrompt: string): string {
  return `pv-${shortHash(systemPrompt)}`;
}

function computeBlueprintVersion(
  blueprint: readonly { id: string; order: number; pageType: string }[]
): string {
  return `bp-${shortHash(
    JSON.stringify(blueprint.map((s) => [s.id, s.order, s.pageType]))
  )}`;
}

export interface ProductVersions {
  readonly productVersion: string;
  readonly insightEngineVersion: string;
  readonly promptVersion: string;
  readonly blueprintVersion: string;
}

const versionCache = new Map<ReadingProduct, ProductVersions>();

export function getProductVersions(product: ReadingProduct): ProductVersions {
  const cached = versionCache.get(product);
  if (cached) return cached;

  const def = getProduct(product);
  const versions: ProductVersions = {
    productVersion:
      product === "in-depth-reading"
        ? IN_DEPTH_READING_PRODUCT_VERSION
        : PRODUCT_VERSION,
    insightEngineVersion: INSIGHT_ENGINE_VERSION,
    promptVersion: computePromptVersion(def.systemPrompt),
    blueprintVersion: computeBlueprintVersion(def.blueprint),
  };
  versionCache.set(product, versions);
  return versions;
}

// Backwards-compatible exports for existing code that doesn't pass a product.
// These resolve to the birth-chart product's values.
const bcDef = getProduct("birth-chart");
export const PROMPT_VERSION = computePromptVersion(bcDef.systemPrompt);
export const BLUEPRINT_VERSION = computeBlueprintVersion(bcDef.blueprint);
