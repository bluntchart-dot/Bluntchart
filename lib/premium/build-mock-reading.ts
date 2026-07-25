/**
 * build-mock-reading.ts
 *
 * Assembles a full PremiumReading using:
 *   - real birth chart calculation (via lib/chart-calculator)
 *   - the birth-chart blueprint (static)
 *   - in-voice mock bodies for AI chapters (until Claude is wired in)
 *   - deterministic Built Using cards (from the real chart)
 *
 * Nothing here calls out to an AI model. That is intentional — this is
 * the module the UI preview phase runs against.
 *
 * When the Haiku wire-up ships, a sibling `generate-premium-reading.ts`
 * will do the same job with real AI-authored bodies. Nothing in the
 * renderer will change.
 */

import { calculateChart } from "@/lib/chart-calculator";
import { geocodeCity } from "@/lib/geocode-city";
import type { BirthData } from "@/lib/types";
import { buildBuiltUsing } from "./built-using";
import { getProduct } from "./products/registry";
import {
  READING_VERSION,
  type BlueprintSection,
  type BuiltUsingItem,
  type ChartInput,
  type PremiumReading,
  type ReadingProduct,
  type RenderedSection,
  type RenderHints,
} from "./types";

const AVERAGE_READING_WPM = 240;

export interface PremiumBirthDetails {
  name: string;
  email?: string;
  dob: string;         // YYYY-MM-DD
  birth_time: string;  // HH:mm
  birth_place: string;
  birth_lat: number | null;
  birth_lng: number | null;
  timezone: string | null;
  focus_area: string | null;
}

export type BuildResult =
  | { ok: true;  reading: PremiumReading }
  | { ok: false; error: string };

/**
 * Estimate the total spoken-length of the book in minutes, based on the
 * concatenated bodies + static copy of every active section. Rounded up
 * to the nearest 5 minutes so the cover reads "about 30 min".
 */
function estimateReadingMinutes(sections: RenderedSection[]): number {
  const totalWords = sections.reduce(
    (acc, s) => acc + s.body.trim().split(/\s+/).filter(Boolean).length,
    0
  );
  const raw = totalWords / AVERAGE_READING_WPM;
  return Math.max(5, Math.round(raw / 5) * 5);
}

/**
 * Resolve geo the same way the live site does: stored coordinates first,
 * geocode fallback. Returns null if we can't place the birth city.
 */
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

/**
 * Turn one blueprint section into a rendered section. For static pages
 * we copy staticBody verbatim; for chapters we look up the mock body
 * (or produce a small default if none is registered). Built Using is
 * always computed from the real chart.
 */
function renderSection(
  section: BlueprintSection,
  mockBodies: Partial<Record<BlueprintSection["id"], string>>,
  builtUsingFor: (inputs: readonly ChartInput[]) => BuiltUsingItem[]
): RenderedSection {
  const body =
    section.pageType === "chapter"
      ? (mockBodies[section.id] ??
        `This chapter's mock body has not been written yet. Section id: ${section.id}.`)
      : (section.staticBody ?? "");

  const chartInputs = section.chartInputs ?? [];
  const builtUsing = chartInputs.length > 0 ? builtUsingFor(chartInputs as never) : undefined;

  const renderHints: RenderHints | undefined =
    section.pageType === "chapter"
      ? { pageBackground: pageBackgroundForTheme(section.pageTheme) }
      : section.pageType === "cover"
        ? { pageBackground: "starfield" }
        : section.pageType === "closing"
          ? { pageBackground: "starfield" }
          : { pageBackground: "gradient" };

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

/* ─────────────────────────────────────────────────────────────────────
   Public entry
───────────────────────────────────────────────────────────────────── */

export async function buildMockPremiumReading(
  birth: PremiumBirthDetails,
  product: ReadingProduct = "birth-chart"
): Promise<BuildResult> {
  const geo = await resolveGeo(birth);
  if (!geo) {
    return {
      ok: false,
      error: "Could not locate the birth city. Please include the country name.",
    };
  }

  const birthData: BirthData = {
    name:      birth.name,
    date:      birth.dob,
    time:      birth.birth_time,
    lat:       geo.lat,
    lng:       geo.lng,
    timezone:  birth.timezone ?? geo.timezone,
    placeName: birth.birth_place,
  };

  let chart;
  try {
    chart = calculateChart(birthData);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error
        ? `Chart calculation failed: ${err.message}`
        : "Chart calculation failed.",
    };
  }

  const def = getProduct(product);

  const sections: RenderedSection[] = def.activeSections.map((section) =>
    renderSection(section, def.mockBodies, (inputs) =>
      buildBuiltUsing(chart, inputs)
    )
  );

  const readingMinutes = estimateReadingMinutes(sections);

  const reading: PremiumReading = {
    meta: {
      readingVersion:          READING_VERSION,
      product,
      name:                    birth.name,
      dob:                     birth.dob,
      birthTime:               birth.birth_time,
      birthPlace:              birth.birth_place,
      generatedAt:             new Date().toISOString(),
      estimatedReadingMinutes: readingMinutes,
      totalChapters:           def.totalChapters,
      generationSource:        "mock",
    },
    chart,
    sections,
  };

  return { ok: true, reading };
}
