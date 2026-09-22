/**
 * lib/pipeline/quick.ts
 *
 * Config-driven Quick pipeline for single-AI-call products.
 *
 * Flow:
 *   1. Geocode birth place (if no coords provided)
 *   2. Calculate natal chart
 *   3. Assemble prompt from QuickProductConfig
 *   4. Single AI call with forced tool use
 *   5. Lightweight validation (validate-quick.ts)
 *   6. Retry once on fatal validation failure
 *   7. Return result (ships even if retry also fails)
 *
 * Does NOT touch the existing $15 reading pipeline, the Premium
 * pipeline, or the love letter pipeline. Completely additive.
 */

import { dbError } from "@/lib/db/log";
import { calculateChart, getChartHighlights } from "@/lib/chart-calculator";
import type { ChartHighlights } from "@/lib/chart-calculator";
import { geocodeCity } from "@/lib/geocode-city";
import type { BirthData, ChartData } from "@/lib/types";
import type { QuickProductConfig, CompatProductConfig } from "@/lib/premium/products/registry";
import { calculateSynastry } from "@/lib/astro-compat";
import {
  validateQuickReading,
  type QuickValidationResult,
  type QuickValidationConfig,
} from "./validate-quick";

/* ═════════════════════════════════════════════════════════════════
   TYPES
═════════════════════════════════════════════════════════════════ */

export interface QuickBirthInput {
  name: string;
  dob: string;
  birth_time: string;
  birth_place: string;
  birth_lat?: number | null;
  birth_lng?: number | null;
  timezone?: string | null;
  focus_area?: string | null;
  birth_time_approximate?: boolean;
}

export interface QuickPipelineResult {
  ok: boolean;
  reading: Record<string, unknown> | null;
  chart: ChartData | null;
  highlights: ChartHighlights | null;
  validation: QuickValidationResult | null;
  attempts: number;
  error?: string;
}

/* ═════════════════════════════════════════════════════════════════
   ANTHROPIC API CALLER
   Mirrors the proven pattern from reading-tool.ts callClaudeWithTool.
═════════════════════════════════════════════════════════════════ */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

export async function callQuickTool(
  config: QuickProductConfig,
  userPrompt: string
): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    dbError("quick-pipeline", "Missing ANTHROPIC_API_KEY", "");
    return null;
  }

  const tool = {
    name: config.toolName,
    description: "Submit the complete reading. Call this exactly once.",
    input_schema: config.toolSchema,
  };

  let res: Response;
  try {
    res = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        system: config.systemPrompt,
        tools: [tool],
        tool_choice: { type: "tool", name: config.toolName },
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
  } catch (err) {
    dbError(
      "quick-pipeline",
      "Fetch threw",
      err instanceof Error ? err.message : String(err)
    );
    return null;
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    dbError("quick-pipeline", "Anthropic error", body, { status: res.status });
    return null;
  }

  let data: any;
  try {
    data = await res.json();
  } catch (err) {
    dbError(
      "quick-pipeline",
      "Response JSON parse failed",
      err instanceof Error ? err.message : String(err)
    );
    return null;
  }

  const content: any[] = Array.isArray(data?.content) ? data.content : [];
  const toolBlock = content.find(
    (b) => b && b.type === "tool_use" && b.name === config.toolName
  );

  if (!toolBlock?.input || typeof toolBlock.input !== "object") {
    dbError(
      "quick-pipeline",
      "Model did not invoke tool",
      JSON.stringify(content).slice(0, 2000),
      { stop_reason: data?.stop_reason }
    );
    return null;
  }

  return toolBlock.input as Record<string, unknown>;
}

/* ═════════════════════════════════════════════════════════════════
   MAIN PIPELINE
═════════════════════════════════════════════════════════════════ */

export async function runQuickPipeline(
  input: QuickBirthInput,
  productConfig: QuickProductConfig
): Promise<QuickPipelineResult> {
  // ── 1. Resolve geo ──────────────────────────────────────────
  let lat = input.birth_lat;
  let lng = input.birth_lng;
  let timezone = input.timezone;

  if (!lat || !lng) {
    const geo = await geocodeCity(input.birth_place);
    if (!geo) {
      return {
        ok: false, reading: null, chart: null, highlights: null,
        validation: null, attempts: 0,
        error: `Could not geocode birth place: "${input.birth_place}"`,
      };
    }
    lat = geo.lat;
    lng = geo.lng;
    timezone = timezone || geo.timezone;
  }

  // ── 2. Calculate chart ──────────────────────────────────────
  const birth: BirthData = {
    name: input.name,
    date: input.dob,
    time: input.birth_time,
    lat: lat!,
    lng: lng!,
    timezone: timezone || "UTC",
    placeName: input.birth_place,
    birthTimeApproximate: input.birth_time_approximate,
  };

  let chart: ChartData;
  let highlights: ChartHighlights;
  try {
    chart = calculateChart(birth);
    highlights = getChartHighlights(chart);
  } catch (err) {
    return {
      ok: false, reading: null, chart: null, highlights: null,
      validation: null, attempts: 0,
      error: `Chart calculation failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }

  // ── 3. Build prompt ─────────────────────────────────────────
  const userPrompt = productConfig.buildUserPrompt(birth, chart);

  // ── 4-6. Generate + validate + retry once ───────────────────
  const validationConfig: QuickValidationConfig = {
    expectedSections: productConfig.expectedSections,
    minWordsPerSection: productConfig.minWordsPerSection,
    maxWordsPerSection: productConfig.maxWordsPerSection,
    chart,
    customerName: input.name,
    forbiddenWords: productConfig.forbiddenWords,
    sectionField: productConfig.sectionField,
  };

  let lastReading: Record<string, unknown> | null = null;
  let lastValidation: QuickValidationResult | null = null;
  let attempts = 0;
  const maxAttempts = 2;
  let currentPrompt = userPrompt;

  while (attempts < maxAttempts) {
    attempts++;
    const reading = await callQuickTool(productConfig, currentPrompt);

    if (!reading) {
      if (attempts >= maxAttempts) {
        return {
          ok: false, reading: null, chart, highlights,
          validation: null, attempts,
          error: "AI generation failed after retries",
        };
      }
      continue;
    }

    const validation = validateQuickReading(reading, validationConfig);
    lastReading = reading;
    lastValidation = validation;

    if (validation.ok) {
      return { ok: true, reading, chart, highlights, validation, attempts };
    }

    const fatalIssues = validation.issues
      .filter((i) => i.severity === "fatal")
      .map((i) => `- ${i.field}: ${i.problem}`);

    dbError(
      "quick-pipeline",
      `Attempt ${attempts} failed validation`,
      fatalIssues.join(" | "),
      { attempts }
    );

    if (attempts < maxAttempts) {
      currentPrompt = userPrompt + "\n\n" +
        "IMPORTANT — your previous response failed quality checks. " +
        "Fix ALL of the following issues in your next response:\n" +
        fatalIssues.join("\n");
    }
  }

  // Out of retries. Ship the last attempt — paying customer > nothing.
  return {
    ok: lastReading !== null,
    reading: lastReading,
    chart,
    highlights,
    validation: lastValidation,
    attempts,
  };
}

/* ═════════════════════════════════════════════════════════════════
   COMPATIBILITY PIPELINE (two-person variant)
═════════════════════════════════════════════════════════════════ */

export interface CompatPipelineResult {
  ok: boolean;
  reading: Record<string, unknown> | null;
  chart1: ChartData | null;
  chart2: ChartData | null;
  synastryScore: number | null;
  validation: QuickValidationResult | null;
  attempts: number;
  error?: string;
}

export async function runCompatibilityPipeline(
  input1: QuickBirthInput,
  input2: QuickBirthInput,
  config: CompatProductConfig
): Promise<CompatPipelineResult> {
  const fail = (error: string): CompatPipelineResult => ({
    ok: false, reading: null, chart1: null, chart2: null,
    synastryScore: null, validation: null, attempts: 0, error,
  });

  // Resolve geo for both people
  async function resolveBirth(input: QuickBirthInput): Promise<BirthData | string> {
    let lat = input.birth_lat;
    let lng = input.birth_lng;
    let timezone = input.timezone;
    if (!lat || !lng) {
      const geo = await geocodeCity(input.birth_place);
      if (!geo) return `Could not geocode: "${input.birth_place}"`;
      lat = geo.lat;
      lng = geo.lng;
      timezone = timezone || geo.timezone;
    }
    return {
      name: input.name,
      date: input.dob,
      time: input.birth_time,
      lat: lat!,
      lng: lng!,
      timezone: timezone || "UTC",
      placeName: input.birth_place,
      birthTimeApproximate: input.birth_time_approximate,
    };
  }

  const [r1, r2] = await Promise.all([resolveBirth(input1), resolveBirth(input2)]);
  if (typeof r1 === "string") return fail(r1);
  if (typeof r2 === "string") return fail(r2);
  const birth1 = r1;
  const birth2 = r2;

  let chart1: ChartData;
  let chart2: ChartData;
  try {
    chart1 = calculateChart(birth1);
    chart2 = calculateChart(birth2);
  } catch (err) {
    return fail(`Chart calculation failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  const synastry = calculateSynastry(
    birth1.date, birth1.lat, birth1.lng,
    birth2.date, birth2.lat, birth2.lng,
    birth1.time, birth2.time
  );

  const userPrompt = config.buildUserPrompt(birth1, chart1, birth2, chart2, synastry);

  const quickLikeConfig: QuickProductConfig = {
    model: config.model,
    maxTokens: config.maxTokens,
    temperature: config.temperature,
    toolName: config.toolName,
    toolSchema: config.toolSchema,
    systemPrompt: config.systemPrompt,
    buildUserPrompt: () => userPrompt,
    expectedSections: config.expectedSections,
    minWordsPerSection: config.minWordsPerSection,
    maxWordsPerSection: config.maxWordsPerSection,
    sectionField: config.sectionField,
    forbiddenWords: config.forbiddenWords,
  };

  const validationConfig: QuickValidationConfig = {
    expectedSections: config.expectedSections,
    minWordsPerSection: config.minWordsPerSection,
    maxWordsPerSection: config.maxWordsPerSection,
    chart: chart1,
    customerName: input1.name,
    forbiddenWords: config.forbiddenWords,
    sectionField: config.sectionField,
  };

  let lastReading: Record<string, unknown> | null = null;
  let lastValidation: QuickValidationResult | null = null;
  let attempts = 0;
  const maxAttempts = 2;
  let currentPrompt = userPrompt;

  while (attempts < maxAttempts) {
    attempts++;
    const reading = await callQuickTool(quickLikeConfig, currentPrompt);
    if (!reading) {
      if (attempts >= maxAttempts) {
        return {
          ok: false, reading: null, chart1, chart2,
          synastryScore: synastry.score, validation: null, attempts,
          error: "AI generation failed after retries",
        };
      }
      continue;
    }

    const validation = validateQuickReading(reading, validationConfig);
    lastReading = reading;
    lastValidation = validation;

    if (validation.ok) {
      return { ok: true, reading, chart1, chart2, synastryScore: synastry.score, validation, attempts };
    }

    const fatalIssues = validation.issues
      .filter((i) => i.severity === "fatal")
      .map((i) => `- ${i.field}: ${i.problem}`);

    dbError("compat-pipeline", `Attempt ${attempts} failed validation`, fatalIssues.join(" | "), { attempts });

    if (attempts < maxAttempts) {
      currentPrompt = userPrompt + "\n\nIMPORTANT — your previous response failed quality checks. Fix ALL of the following issues:\n" + fatalIssues.join("\n");
    }
  }

  return {
    ok: lastReading !== null,
    reading: lastReading,
    chart1, chart2,
    synastryScore: synastry.score,
    validation: lastValidation,
    attempts,
  };
}
