/**
 * lib/premium/generate-ai-reading.ts
 *
 * Real-AI counterpart to build-mock-reading.ts. Same inputs, same
 * PremiumReading output shape — nothing in the renderer changes when
 * this is used instead of the mock builder.
 *
 * Pipeline:
 *   1. Resolve geo (LocationPicker coords first, geocode fallback).
 *   2. Calculate the birth chart.
 *   3. For every AI chapter, compose a compact chart-context digest.
 *   4. Call the configured provider once with the full slot list.
 *   5. Map the provider's `bodies` back onto blueprint sections and
 *      hand off to the same builder logic mock-reading uses.
 */

import { calculateChart } from "@/lib/chart-calculator";
import { geocodeCity } from "@/lib/geocode-city";
import type { BirthData, ChartData } from "@/lib/types";
import { buildBuiltUsing } from "./built-using";
import type { PremiumBirthDetails } from "./build-mock-reading";
import { buildReaderOpener, buildSectionChartContext } from "./chart-context";
import { getProduct } from "./products/registry";
import {
  READING_VERSION,
  type BlueprintSection,
  type BuiltUsingItem,
  type PremiumReading,
  type ReadingProduct,
  type RenderedSection,
  type RenderHints,
} from "./types";
import { AnthropicProvider } from "./ai/anthropic-provider";
import { getModelConfig } from "./ai/models";
import type {
  AiGenerationRequest,
  AiModelId,
  AiSectionRequest,
  AiTelemetry,
} from "./ai/types";

const AVERAGE_READING_WPM = 240;

export interface GenerateAiResult {
  ok: true;
  reading: PremiumReading;
  telemetry: AiTelemetry;
}
export interface GenerateAiFailure {
  ok: false;
  error: string;
  telemetry?: Partial<AiTelemetry>;
}

/* ─────────────────────────────────────────────────────────────────────
   Small helpers reused with build-mock-reading semantics.
───────────────────────────────────────────────────────────────────── */

function estimateReadingMinutes(sections: RenderedSection[]): number {
  const totalWords = sections.reduce(
    (acc, s) => acc + s.body.trim().split(/\s+/).filter(Boolean).length,
    0
  );
  const raw = totalWords / AVERAGE_READING_WPM;
  return Math.max(5, Math.round(raw / 5) * 5);
}

function pageBackgroundForTheme(
  theme: BlueprintSection["pageTheme"]
): RenderHints["pageBackground"] {
  switch (theme) {
    case "warm":     return "warm-glow";
    case "night":    return "starfield";
    case "shadow":   return "plain";
    case "elevated": return "gradient";
    case "neutral":
    default:         return "gradient";
  }
}

async function resolveGeo(
  birth: PremiumBirthDetails
): Promise<{ lat: number; lng: number; timezone: string } | null> {
  if (birth.birth_lat != null && birth.birth_lng != null) {
    return {
      lat: birth.birth_lat,
      lng: birth.birth_lng,
      timezone: birth.timezone ?? "UTC",
    };
  }
  if (birth.birth_place) {
    const geocoded = await geocodeCity(birth.birth_place);
    if (geocoded) return geocoded;
  }
  return null;
}

/* ─────────────────────────────────────────────────────────────────────
   Post-processing: strip em/en dashes (voice contract) and normalise
   whitespace. Keeps the model's output aligned with the punctuation
   rules from the system prompt even if it slips.
───────────────────────────────────────────────────────────────────── */

function cleanBody(body: string): string {
  return body
    .replace(/—/g, ",")   // em-dash → comma
    .replace(/–/g, ",")   // en-dash → comma
    .replace(/[ \t]+\n/g, "\n") // trailing spaces before newline
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* ─────────────────────────────────────────────────────────────────────
   Build AI request from blueprint + guidelines
───────────────────────────────────────────────────────────────────── */

function buildAiRequest(
  chart: ChartData,
  name: string,
  product: ReadingProduct
): AiGenerationRequest {
  const def = getProduct(product);
  const guidelines = def.guidelines;

  const sections: AiSectionRequest[] = [];
  for (const section of def.activeSections) {
    if (section.pageType !== "chapter") continue;
    const g = guidelines[section.id];
    if (!g) continue;
    const inputs = section.chartInputs ?? [];
    sections.push({
      id: section.id,
      title: section.title,
      subtitle: section.subtitle,
      narrativeForm: g.narrativeForm,
      emotionalObjective: g.emotionalObjective,
      tone: g.tone,
      desiredReaderFeeling: g.desiredReaderFeeling,
      writingStyle: g.writingStyle,
      transitionGoal: g.transitionGoal,
      approxWords: g.approxWords,
      chartContext:
        inputs.length > 0
          ? buildSectionChartContext(chart, inputs)
          : "(this chapter is a synthesis chapter — draw on the reader's overall shape from placements introduced in earlier chapters)",
    });
  }

  return {
    readerName: name,
    readerOpener: buildReaderOpener(chart, name),
    sections,
  };
}

/* ─────────────────────────────────────────────────────────────────────
   Assemble the PremiumReading
───────────────────────────────────────────────────────────────────── */

function renderSectionsFromBodies(
  chart: ChartData,
  bodies: Record<string, string>,
  product: ReadingProduct
): RenderedSection[] {
  const def = getProduct(product);
  return def.activeSections.map((section) => {
    const body =
      section.pageType === "chapter"
        ? cleanBody(bodies[section.id] ?? "")
        : (section.staticBody ?? "");

    const chartInputs = section.chartInputs ?? [];
    const builtUsing: BuiltUsingItem[] | undefined =
      chartInputs.length > 0 ? buildBuiltUsing(chart, chartInputs) : undefined;

    const renderHints: RenderHints = {
      pageBackground: pageBackgroundForTheme(section.pageTheme),
    };

    return {
      id: section.id,
      order: section.order,
      part: section.part,
      pageType: section.pageType,
      pageTheme: section.pageTheme,
      title: section.title,
      subtitle: section.subtitle,
      body,
      builtUsing: builtUsing && builtUsing.length > 0 ? builtUsing : undefined,
      renderHints,
      chapterNumber: section.chapterNumber,
    };
  });
}

/* ─────────────────────────────────────────────────────────────────────
   Public entry
───────────────────────────────────────────────────────────────────── */

export interface GenerateAiOptions {
  readonly modelId: AiModelId;
  readonly product?: ReadingProduct;
}

export async function generateAiReading(
  birth: PremiumBirthDetails,
  opts: GenerateAiOptions
): Promise<GenerateAiResult | GenerateAiFailure> {
  const product: ReadingProduct = opts.product ?? "birth-chart";

  const geo = await resolveGeo(birth);
  if (!geo) {
    return {
      ok: false,
      error: "Could not locate the birth city. Please include the country name.",
    };
  }

  const birthData: BirthData = {
    name: birth.name,
    date: birth.dob,
    time: birth.birth_time,
    lat: geo.lat,
    lng: geo.lng,
    timezone: birth.timezone ?? geo.timezone,
    placeName: birth.birth_place,
  };

  let chart: ChartData;
  try {
    chart = calculateChart(birthData);
  } catch (err) {
    return {
      ok: false,
      error:
        err instanceof Error
          ? `Chart calculation failed: ${err.message}`
          : "Chart calculation failed.",
    };
  }

  const aiRequest = buildAiRequest(chart, birth.name, product);
  const model = getModelConfig(opts.modelId);

  // Today: only Anthropic is implemented. Adding Gemini = pick provider by
  // model.provider and swap the class here.
  if (model.provider !== "anthropic") {
    return {
      ok: false,
      error: `Provider "${model.provider}" not implemented yet — pick an Anthropic model.`,
    };
  }

  const provider = new AnthropicProvider();
  const genResult = await provider.generate(aiRequest, model);

  if (!genResult.ok) {
    return {
      ok: false,
      error: genResult.error,
      telemetry: genResult.telemetry,
    };
  }

  const sections = renderSectionsFromBodies(chart, genResult.body.bodies, product);
  const def = getProduct(product);
  const reading: PremiumReading = {
    meta: {
      readingVersion: READING_VERSION,
      product,
      name: birth.name,
      dob: birth.dob,
      birthTime: birth.birth_time,
      birthPlace: birth.birth_place,
      generatedAt: new Date().toISOString(),
      estimatedReadingMinutes: estimateReadingMinutes(sections),
      totalChapters: def.totalChapters,
      generationSource: opts.modelId.startsWith("haiku")
        ? "haiku"
        : opts.modelId.startsWith("sonnet")
          ? "sonnet"
          : opts.modelId.startsWith("opus")
            ? "opus"
            : "unknown",
    },
    chart,
    sections,
  };

  return { ok: true, reading, telemetry: genResult.telemetry };
}
