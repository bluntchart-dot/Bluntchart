/**
 * generate-full-reading.ts
 *
 * REWRITTEN. This file used to contain a broken prompt that sent only
 * (name, dob, time, city) to Claude without any computed chart data.
 * The result was generic Sun-sign content dressed in the BluntChart voice.
 *
 * It is now a thin adapter file. The actual reading generation happens
 * in reading-tool.ts (and the orchestration in build-paid-reading.ts).
 *
 * Exports:
 *   - toLegacyReadingShape(reading, chart): maps the new shape returned
 *     by claude-prompt.ts into the OLD shape that ReadingText.tsx and
 *     email-templates.ts currently expect. This keeps the UI working
 *     without immediate downstream changes.
 *   - generateFullReadingJson: deprecated stub. Throws a clear error so
 *     any forgotten caller fails loud instead of silently producing
 *     generic content.
 */

import type { ChartData } from "@/lib/types";
import type { FullReading } from "@/lib/reading-tool";
import { FOCUS_SPEC } from "@/lib/claude-prompt";

// Derived from FOCUS_SPEC titles (single source of truth) so a renamed or
// added focus area can't silently fall through to the wrong color.
const FOCUS_TITLE_COLOR: Record<string, string> = {
  [FOCUS_SPEC.love.title.toLowerCase()]:    "venus",
  [FOCUS_SPEC.career.title.toLowerCase()]:  "saturn",
  [FOCUS_SPEC.money.title.toLowerCase()]:   "jupiter",
  [FOCUS_SPEC.purpose.title.toLowerCase()]: "pluto",
};

/* ─────────────────────────────────────────────────────────────────────
   SUN SIGN DATE RANGES
───────────────────────────────────────────────────────────────────── */

const SUN_DATE_RANGES: Record<string, string> = {
  Aries:       "Mar 21 - Apr 19",
  Taurus:      "Apr 20 - May 20",
  Gemini:      "May 21 - Jun 20",
  Cancer:      "Jun 21 - Jul 22",
  Leo:         "Jul 23 - Aug 22",
  Virgo:       "Aug 23 - Sep 22",
  Libra:       "Sep 23 - Oct 22",
  Scorpio:     "Oct 23 - Nov 21",
  Sagittarius: "Nov 22 - Dec 21",
  Capricorn:   "Dec 22 - Jan 19",
  Aquarius:    "Jan 20 - Feb 18",
  Pisces:      "Feb 19 - Mar 20",
};

/* ─────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────── */

/**
 * Map a new-shape section title like "Saturn. Why You Procrastinate..."
 * into a UI color key the old renderer expects.
 */
function colorKeyFromPlanet(planetField: string): string {
  const lower = (planetField ?? "").toLowerCase();

  // Direct planet names (cover the standard 8 paid sections)
  if (lower.includes("rising"))  return "rising";
  if (lower.includes("moon"))    return "moon";
  if (lower.includes("venus"))   return "venus";
  if (lower.includes("mars"))    return "mars";
  if (lower.includes("mercury")) return "mercury";
  if (lower.includes("saturn"))  return "saturn";
  if (lower.includes("jupiter")) return "jupiter";

  // Focus synthesis section title
  if (FOCUS_TITLE_COLOR[lower]) return FOCUS_TITLE_COLOR[lower];

  // The Full Picture closer, anything else
  if (lower.includes("full picture") || lower.includes("right now")) return "sun";
  if (lower.includes("sun")) return "sun";

  return "sun";
}

/**
 * Get the sign for a planet from the calculated chart.
 * Returns "—" if not found.
 */
function planetSign(chart: ChartData, name: string): string {
  if (name === "Rising") return chart.ascendant.sign;
  const p = chart.planets.find((x) => x.name === name);
  return p ? p.sign : "—";
}

/* ─────────────────────────────────────────────────────────────────────
   LEGACY READING SHAPE
   Matches what ReadingText.tsx and email-templates.ts read today.
───────────────────────────────────────────────────────────────────── */

export interface LegacyInsight {
  planet:   string;
  colorKey: string;
  truth:    string;
  explain:  string;
  action:   string;
}

export interface LegacyShareCard {
  sign:    string;
  keyword: string;
  lines:   [string, string, string];
  quote:   string;
}

export interface LegacyReading {
  planets: {
    sun: string; moon: string; rising: string;
    venus: string; mars: string; mercury: string;
    saturn: string; jupiter: string;
  };
  sunDates:     string;
  preview:      LegacyInsight[];
  paidInsights: LegacyInsight[];
  locked:       string[];
  shareCard:    LegacyShareCard;

  // Pass-throughs from the new shape so any consumer ready to migrate
  // can read them directly without waiting for a full UI rewrite.
  letter_opener: string;
  shareCardV2:   FullReading["shareCard"];
}

/* ─────────────────────────────────────────────────────────────────────
   ADAPTER
   Maps the new FullReading shape into the legacy shape above.
───────────────────────────────────────────────────────────────────── */

export function toLegacyReadingShape(
  reading: FullReading,
  chart: ChartData
): LegacyReading {
  const sunSign = planetSign(chart, "Sun");

  return {
    planets: {
      sun:     sunSign,
      moon:    planetSign(chart, "Moon"),
      rising:  planetSign(chart, "Rising"),
      venus:   planetSign(chart, "Venus"),
      mars:    planetSign(chart, "Mars"),
      mercury: planetSign(chart, "Mercury"),
      saturn:  planetSign(chart, "Saturn"),
      jupiter: planetSign(chart, "Jupiter"),
    },

    sunDates: SUN_DATE_RANGES[sunSign] ?? "",

    preview: (reading.preview ?? []).map((p) => ({
      planet:   p.planet,
      colorKey: colorKeyFromPlanet(p.planet),
      truth:    p.hook,   // new.hook is the bold one-liner
      explain:  p.truth,  // new.truth is the elaboration paragraphs
      action:   p.reveal, // new.reveal is the emotional kicker
    })),

    paidInsights: (reading.paidInsights ?? []).map((p) => ({
      planet:   p.planet,
      colorKey: colorKeyFromPlanet(p.planet),
      truth:    p.truth,
      explain:  p.explain,
      action:   p.action,
    })),

    // The old `locked` array used to hold which sections were paywalled.
    // Since paid users get everything now, we fill it with the section
    // titles for any UI that iterates over locked content.
    locked: (reading.paidInsights ?? []).map((p) => p.planet),

    shareCard: {
      sign:    sunSign,
      keyword: reading.shareCard?.keyword ?? "",
      lines: [
        reading.shareCard?.line1 || reading.shareCard?.flexLine || "",
        reading.shareCard?.line2 || "",
        reading.shareCard?.line3 || "",
      ],
      quote: reading.shareCard?.quote || reading.shareCard?.flexLine || "",
    },

    letter_opener: reading.letter_opener ?? "",
    shareCardV2:   reading.shareCard,
  };
}

/* ─────────────────────────────────────────────────────────────────────
   DEPRECATED STUB
   The old function name. Throws so any forgotten caller is loud.
───────────────────────────────────────────────────────────────────── */

/**
 * @deprecated REMOVED. This function used to send only
 * (name, dob, time, city) to Claude, with no computed chart data.
 * That produced generic Sun-sign readings.
 *
 * Use `buildPaidReadingPayload(lead, focusArea)` from
 * `@/lib/build-paid-reading` instead. It computes the real chart and
 * sends the rich chart context to Claude.
 */
export async function generateFullReadingJson(): Promise<never> {
  throw new Error(
    "[generate-full-reading] generateFullReadingJson has been removed. " +
    "It was bypassing the chart calculation, which is why readings felt " +
    "generic to Sun-sign. " +
    "Migrate the caller to buildPaidReadingPayload from @/lib/build-paid-reading."
  );
}