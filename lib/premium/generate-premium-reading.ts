/**
 * generate-premium-reading.ts
 *
 * Orchestrator for the hidden Premium Reading Engine (/internal/premium).
 *
 * This intentionally does NOT touch the production pipeline:
 *   - No calls into lib/reading-tool, lib/claude-prompt, or lib/validate-reading.
 *   - No writes to Users / Payments / abandoned_checkouts / readings.
 *   - No dependency on any part of the Gumroad flow.
 *
 * It uses only:
 *   - lib/chart-calculator      (real ephemeris — safe to share)
 *   - lib/geocode-city          (Nominatim — safe to share)
 *   - lib/generate-full-reading (toLegacyReadingShape adapter — safe to share)
 *   - lib/premium/premium-reading-tool (the FORK, editable freely)
 *
 * Steps:
 *   1. Resolve geo (stored coords first, geocode fallback).
 *   2. Calculate the birth chart.
 *   3. Call the FORKED premium prompt.
 *   4. Adapt to the legacy shape so the shared UI components render as-is.
 *
 * There is no validator retry loop here — the internal playground exists
 * so you can see raw output and tune the prompt directly. Add validation
 * once the premium prompt has stabilised.
 */

import {
  calculateChart,
  getChartHighlights,
} from "@/lib/chart-calculator";
import type { ChartHighlights } from "@/lib/chart-calculator";
import { geocodeCity } from "@/lib/geocode-city";
import { toLegacyReadingShape } from "@/lib/generate-full-reading";
import type { LegacyReading } from "@/lib/generate-full-reading";
import type { BirthData, ChartData } from "@/lib/types";
import { generateFullReading } from "./premium-reading-tool";

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

export interface PremiumReadingPayload extends LegacyReading, Record<string, unknown> {
  chart:      ChartData;
  highlights: ChartHighlights;
  meta: {
    dob:         string;
    name:        string;
    birth_place: string;
    birth_time:  string;
    geo?: { lat: number; lng: number; timezone: string };
  };
}

export type GenerateResult =
  | { ok: true;  reading: PremiumReadingPayload }
  | { ok: false; error: string };

export async function generatePremiumReading(
  birth: PremiumBirthDetails
): Promise<GenerateResult> {
  // ── 1. Resolve geo ────────────────────────────────────────────────
  let geo: { lat: number; lng: number; timezone: string } | null = null;

  if (birth.birth_lat != null && birth.birth_lng != null) {
    geo = {
      lat:      birth.birth_lat,
      lng:      birth.birth_lng,
      timezone: birth.timezone ?? "UTC",
    };
  } else if (birth.birth_place) {
    const geocoded = await geocodeCity(birth.birth_place);
    if (geocoded) geo = geocoded;
  }

  if (!geo) {
    return {
      ok: false,
      error: "Could not locate the birth city. Please include the country name.",
    };
  }

  // ── 2. Calculate chart ────────────────────────────────────────────
  const birthData: BirthData = {
    name:      birth.name,
    date:      birth.dob,
    time:      birth.birth_time,
    lat:       geo.lat,
    lng:       geo.lng,
    timezone:  birth.timezone ?? geo.timezone,
    placeName: birth.birth_place,
  };

  let chart: ChartData;
  let highlights: ChartHighlights;
  try {
    chart      = calculateChart(birthData);
    highlights = getChartHighlights(chart);
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error
        ? `Chart calculation failed: ${err.message}`
        : "Chart calculation failed.",
    };
  }

  // ── 3. Run the FORKED premium prompt ──────────────────────────────
  const reading = await generateFullReading(
    birthData,
    chart,
    birth.focus_area,
    null
  );
  if (!reading) {
    return { ok: false, error: "Reading generation failed. Please try again." };
  }

  // ── 4. Adapt to legacy shape for the shared UI components ─────────
  const legacy = toLegacyReadingShape(reading, chart);

  return {
    ok: true,
    reading: {
      ...legacy,
      chart,
      highlights,
      meta: {
        dob:         birth.dob,
        name:        birth.name,
        birth_place: birth.birth_place,
        birth_time:  birth.birth_time,
        geo,
      },
    },
  };
}
