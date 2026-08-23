/**
 * lib/premium/build-indepth-reading.ts
 *
 * Bridge between the order pipeline and the In-Depth Reading product.
 * Mirrors build-book-reading.ts but passes product: "in-depth-reading"
 * to the shared V1.2 engine.
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

const INDEPTH_MODEL: AiModelId = "sonnet-5";

export async function buildInDepthReadingPayload(
  lead: BirthLead
): Promise<PremiumReading | null> {
  const scope = "build-indepth-reading";

  const birth: PremiumBirthDetails = {
    name: lead.name,
    dob: lead.dob,
    birth_time: lead.birth_time,
    birth_place: lead.birth_place,
    timezone: lead.timezone,
    birth_lat: lead.birth_lat,
    birth_lng: lead.birth_lng,
  };

  dbLog(scope, "starting in-depth reading generation", {
    name: lead.name,
    model: INDEPTH_MODEL,
  });

  const result = await generateAiReading(birth, {
    modelId: INDEPTH_MODEL,
    product: "in-depth-reading",
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
