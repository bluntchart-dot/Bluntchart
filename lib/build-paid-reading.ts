/**
 * build-paid-reading.ts
 *
 * Orchestrates the complete paid reading pipeline.
 *
 * Order of operations (this matters):
 *   1. Resolve geo (stored coords from LocationPicker first, geocode fallback)
 *   2. Calculate the birth chart from real ephemeris data
 *   3. Send the rich chart context to Claude via the new prompt
 *   4. Validate the response (auto-retry once on failure)
 *   5. Adapt to legacy shape so existing UI and email templates keep working
 *
 * If geo or chart calc fails, returns null. Previously the old code path
 * would silently continue and Claude would generate generic Sun-sign content
 * with no real chart data. That was the bug. We now fail explicitly so the
 * caller can handle it (retry, manual escalation, or error message to user).
 */

import {
  calculateChart,
  getChartHighlights,
} from "@/lib/chart-calculator";
import type { ChartHighlights } from "@/lib/chart-calculator";
import { dbError } from "@/lib/db/log";
import type { BirthLead } from "@/lib/db/checkout-flow";
import { geocodeCity } from "@/lib/geocode-city";
import {
  toLegacyReadingShape,
} from "@/lib/generate-full-reading";
import type { LegacyReading } from "@/lib/generate-full-reading";
import { generateFullReadingValidated } from "@/lib/validate-reading";
import type { BirthData, ChartData } from "@/lib/types";

/* ─────────────────────────────────────────────────────────────────────
   PAYLOAD TYPE
   Extends the legacy shape so all existing consumers keep working.
   Adds chart + highlights + meta on top.
───────────────────────────────────────────────────────────────────── */

export interface PaidReadingPayload extends LegacyReading,  Record<string, unknown> {
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

/* ─────────────────────────────────────────────────────────────────────
   MAIN ORCHESTRATOR
───────────────────────────────────────────────────────────────────── */

export async function buildPaidReadingPayload(
  lead: BirthLead,
  focusArea?: string | null
): Promise<PaidReadingPayload | null> {
  // ── 1. Resolve geo ──────────────────────────────────────────────────
  let geo: { lat: number; lng: number; timezone: string } | null = null;

  if (lead.birth_lat && lead.birth_lng) {
    // Coordinates came from the LocationPicker. Trust them.
    console.log(
      "[build-paid-reading] using stored coordinates for:",
      lead.birth_place
    );
    geo = {
      lat:      lead.birth_lat,
      lng:      lead.birth_lng,
      timezone: lead.timezone ?? "UTC",
    };
  } else {
    // Legacy flow. No stored coords. Geocode the city name.
    console.log(
      "[build-paid-reading] no stored coords, geocoding:",
      lead.birth_place
    );
    const geocoded = await geocodeCity(lead.birth_place);
    if (geocoded) {
      geo = geocoded;
    }
  }

  if (!geo) {
    dbError(
      "build-paid-reading",
      "geocode failed and no stored coordinates",
      "",
      { name: lead.name, place: lead.birth_place }
    );
    return null;
  }

  // ── 2. Calculate chart ──────────────────────────────────────────────
  const birth: BirthData = {
    name:      lead.name,
    date:      lead.dob,
    time:      lead.birth_time,
    lat:       geo.lat,
    lng:       geo.lng,
    timezone:  lead.timezone ?? geo.timezone,
    placeName: lead.birth_place,
  };

  let chart:      ChartData;
  let highlights: ChartHighlights;

  try {
    chart      = calculateChart(birth);
    highlights = getChartHighlights(chart);
    console.log("[build-paid-reading] chart OK for:", lead.birth_place);
  } catch (err) {
    dbError(
      "build-paid-reading",
      "chart calculation failed",
      err instanceof Error ? err.message : String(err),
      { name: lead.name, place: lead.birth_place }
    );
    return null;
  }

  // ── 3 + 4. Generate the reading with chart context, validate, retry ─
  // If the user already saw a free preview, tell the model so the paid
  // insights cover new ground instead of repeating what they already read.
  const existingPreview = lead.preview_json?.preview?.length
    ? lead.preview_json.preview.map((p) => ({ planet: p.planet, truth: p.truth }))
    : null;

  const { reading, validation, attempts } = await generateFullReadingValidated(
    birth,
    chart,
    focusArea,
    {},
    existingPreview
  );

  if (!reading) {
    dbError(
      "build-paid-reading",
      "reading generation failed after retries",
      `attempts=${attempts}`,
      { name: lead.name, focusArea: focusArea ?? "none" }
    );
    return null;
  }

  if (validation && !validation.ok) {
    // Validator already logged the specific issues via dbError.
    // We still ship because a paying customer deserves something, and
    // partial-but-real is better than nothing.
    console.warn(
      "[build-paid-reading] shipped reading with validation warnings:",
      validation.issues.length,
      "issues. attempts:",
      attempts
    );
  } else {
    console.log(
      "[build-paid-reading] reading OK. attempts:",
      attempts,
      "words:",
      validation?.metrics.totalWords ?? "?"
    );
  }

  // If a free preview was saved, splice it in verbatim so the paid page
  // shows the exact same 2 insights the user already read for free,
  // instead of the fresh (different) ones the model just generated above.
  if (lead.preview_json?.preview?.length) {
    reading.preview = lead.preview_json.preview.map((p) => ({
      planet: p.planet,
      hook: p.hook ?? "",
      truth: p.truth,
      reveal: p.reveal ?? "",
      cliffhanger: p.cliffhanger ?? "",
    }));
    if (lead.preview_json.letter_opener) {
      reading.letter_opener = lead.preview_json.letter_opener;
    }
  }

  // ── 5. Adapt to legacy shape for downstream consumers ──────────────
  const legacy = toLegacyReadingShape(reading, chart);

  return {
    ...legacy,
    chart,
    highlights,
    meta: {
      dob:         lead.dob,
      name:        lead.name,
      birth_place: lead.birth_place,
      birth_time:  lead.birth_time,
      geo: { lat: geo.lat, lng: geo.lng, timezone: geo.timezone },
    },
  };
}