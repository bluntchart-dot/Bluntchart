/**
 * lib/premium/build-book-reading.ts
 *
 * Bridge between the Gumroad webhook pipeline and the Premium Book engine.
 * Takes a BirthLead (from the webhook's abandoned_checkouts lookup) and
 * produces a PremiumReading using the same generation pipeline as the
 * internal /internal/premium playground.
 *
 * This ensures the public product and internal product share exactly the
 * same prompts, blueprint, guidelines, and generation logic.
 */

import type { BirthLead } from "@/lib/db/checkout-flow";
import { dbError, dbLog } from "@/lib/db/log";
import {
  generateAiReading,
  type GenerateAiResult,
} from "./generate-ai-reading";
import type { PremiumBirthDetails } from "./build-mock-reading";
import type { PremiumReading } from "./types";
import type { AiModelId } from "./ai/types";

const BOOK_MODEL: AiModelId = "sonnet-5";

export async function buildBookReadingPayload(
  lead: BirthLead
): Promise<PremiumReading | null> {
  const scope = "build-book-reading";

  const birth: PremiumBirthDetails = {
    name: lead.name,
    dob: lead.dob,
    birth_time: lead.birth_time,
    birth_place: lead.birth_place,
    timezone: lead.timezone,
    birth_lat: lead.birth_lat,
    birth_lng: lead.birth_lng,
  };

  dbLog(scope, "starting book generation", {
    name: lead.name,
    model: BOOK_MODEL,
  });

  const result = await generateAiReading(birth, {
    modelId: BOOK_MODEL,
    product: "birth-chart",
  });

  if (!result.ok) {
    dbError(scope, "generation failed", result.error, {
      name: lead.name,
    });
    return null;
  }

  const { reading, telemetry } = result as GenerateAiResult;

  dbLog(scope, "generation complete", {
    name: lead.name,
    chapters: reading.meta.totalChapters,
    readingMinutes: reading.meta.estimatedReadingMinutes,
    inputTokens: telemetry.inputTokens,
    outputTokens: telemetry.outputTokens,
  });

  return reading;
}
