/**
 * lib/premium/versions.ts
 *
 * Version constants persisted with each generated reading. Bump these
 * manually when the engine changes. Prompt/blueprint versions are
 * derived at boot from string hashes so a prompt edit auto-bumps.
 */

import { createHash } from "node:crypto";
import { SYSTEM_PROMPT } from "@/lib/premium/products/birth-chart/prompt-fragments";
import { BIRTH_CHART_BLUEPRINT } from "@/lib/premium/products/birth-chart/blueprint";

export const PRODUCT_VERSION = "birth-chart-1.1.0" as const;
export const INSIGHT_ENGINE_VERSION = "insight-1.0.0" as const;

function shortHash(input: string): string {
  return createHash("sha256").update(input).digest("hex").slice(0, 8);
}

// Computed once at boot. Changes automatically if the prompt/blueprint changes.
export const PROMPT_VERSION = `pv-${shortHash(SYSTEM_PROMPT)}` as const;
export const BLUEPRINT_VERSION = `bp-${shortHash(
  JSON.stringify(BIRTH_CHART_BLUEPRINT.map((s) => [s.id, s.order, s.pageType]))
)}` as const;
