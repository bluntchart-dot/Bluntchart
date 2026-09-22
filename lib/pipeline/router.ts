/**
 * lib/pipeline/router.ts
 *
 * Routes a product to the correct generation pipeline based on its
 * ProductDefinition.pipelineTier.
 *
 * "quick"   → lib/pipeline/quick.ts (single AI call + lightweight QA)
 * "premium" → lib/premium/generate-ai-reading.ts (existing multi-call pipeline)
 *
 * "standard" is reserved for future 2-4 call products (compatibility, etc).
 *
 * This router does NOT replace any existing code paths. The $15 reading
 * still goes through build-paid-reading.ts → validate-reading.ts. The
 * Premium products still go through generate-ai-reading.ts. This router
 * is only called by the new internal test endpoint and (later) the Etsy
 * webhook handler.
 */

import type { ReadingProduct, PremiumReading } from "@/lib/premium/types";
import { getProduct } from "@/lib/premium/products/registry";
import type { PipelineTier } from "@/lib/premium/products/registry";
import { runQuickPipeline, runCompatibilityPipeline, type QuickBirthInput, type QuickPipelineResult, type CompatPipelineResult } from "./quick";
import { runTarotPipeline, type TarotPipelineInput, type TarotPipelineResult } from "./tarot";
import { generateAiReading } from "@/lib/premium/generate-ai-reading";
import type { PremiumBirthDetails } from "@/lib/premium/build-mock-reading";
import type { AiModelId } from "@/lib/premium/ai/types";

/* ═════════════════════════════════════════════════════════════════
   TYPES
═════════════════════════════════════════════════════════════════ */

export interface PipelineInput {
  product: ReadingProduct;
  birth?: QuickBirthInput;
  birth2?: QuickBirthInput;
  tarot?: TarotPipelineInput;
}

export type PipelineResult =
  | { tier: "quick"; ok: boolean; reading: Record<string, unknown> | null; attempts: number; validation: any; error?: string }
  | { tier: "compat"; ok: boolean; reading: Record<string, unknown> | null; synastryScore: number | null; attempts: number; validation: any; error?: string }
  | { tier: "tarot"; ok: boolean; reading: Record<string, unknown> | null; cards: any; attempts: number; validation: any; error?: string }
  | { tier: "premium"; ok: true; reading: PremiumReading }
  | { tier: "premium"; ok: false; reading: null; error: string }
  | { tier: "standard"; error: string };

/* ═════════════════════════════════════════════════════════════════
   ROUTER
═════════════════════════════════════════════════════════════════ */

export async function routeToGeneration(
  input: PipelineInput
): Promise<PipelineResult> {
  const definition = getProduct(input.product);
  const tier: PipelineTier = definition.pipelineTier;

  switch (tier) {
    case "quick": {
      // Tarot products use tarotConfig, not quickConfig
      if (definition.tarotConfig) {
        if (!input.tarot) {
          return {
            tier: "tarot",
            ok: false, reading: null, cards: null,
            attempts: 0, validation: null,
            error: `Product "${input.product}" is a tarot product but no tarot input was provided.`,
          };
        }
        const result = await runTarotPipeline(input.tarot, definition.tarotConfig);
        return {
          tier: "tarot",
          ok: result.ok,
          reading: result.reading,
          cards: result.cards,
          attempts: result.attempts,
          validation: result.validation,
          error: result.error,
        };
      }

      // Compatibility products use compatConfig (two-person)
      if (definition.compatConfig) {
        if (!input.birth || !input.birth2) {
          return {
            tier: "compat",
            ok: false, reading: null, synastryScore: null,
            attempts: 0, validation: null,
            error: `Product "${input.product}" requires two birth data inputs (birth + birth2).`,
          };
        }
        const result = await runCompatibilityPipeline(input.birth, input.birth2, definition.compatConfig);
        return {
          tier: "compat",
          ok: result.ok,
          reading: result.reading,
          synastryScore: result.synastryScore,
          attempts: result.attempts,
          validation: result.validation,
          error: result.error,
        };
      }

      // Birth-chart-based Quick products
      if (!definition.quickConfig) {
        return {
          tier: "quick",
          ok: false, reading: null, attempts: 0, validation: null,
          error: `Product "${input.product}" is tier "quick" but has no quickConfig, tarotConfig, or compatConfig.`,
        };
      }
      if (!input.birth) {
        return {
          tier: "quick",
          ok: false, reading: null, attempts: 0, validation: null,
          error: `Product "${input.product}" requires birth data but none was provided.`,
        };
      }
      const result = await runQuickPipeline(input.birth, definition.quickConfig);
      return {
        tier: "quick",
        ok: result.ok,
        reading: result.reading,
        attempts: result.attempts,
        validation: result.validation,
        error: result.error,
      };
    }

    case "premium": {
      if (!input.birth) {
        return {
          tier: "premium",
          ok: false,
          reading: null,
          error: `Product "${input.product}" requires birth data but none was provided.`,
        };
      }

      const premiumBirth: PremiumBirthDetails = {
        name: input.birth.name,
        dob: input.birth.dob,
        birth_time: input.birth.birth_time,
        birth_place: input.birth.birth_place,
        birth_lat: null,
        birth_lng: null,
        timezone: null,
      };

      const premiumModelId: AiModelId = "sonnet-5";
      const premiumResult = await generateAiReading(premiumBirth, {
        modelId: premiumModelId,
        product: input.product,
      });

      if (!premiumResult.ok) {
        return {
          tier: "premium",
          ok: false,
          reading: null,
          error: premiumResult.error,
        };
      }

      return {
        tier: "premium",
        ok: true,
        reading: premiumResult.reading,
      };
    }

    case "standard":
      return {
        tier: "standard",
        error: "Standard pipeline is not yet implemented. Reserved for compatibility and year-ahead products.",
      };

    default: {
      const _exhaustive: never = tier;
      return { tier: "quick", ok: false, reading: null, attempts: 0, validation: null, error: `Unknown pipeline tier: ${tier}` };
    }
  }
}

export { type QuickBirthInput } from "./quick";
export { type TarotPipelineInput } from "./tarot";
