/**
 * lib/premium/chart-context.ts
 *
 * Provides two things to the generation pipeline:
 *
 *   1. buildReaderAnchor(chart, name) → { leanPortrait, silentReference }
 *      A small anchor read once at the top of the main user prompt.
 *      Deliberately NOT templated per-sign — the old SUN_CORE / MOON_NEED
 *      / SUN_THROUGHLINE tables were the root cause of the "every book
 *      says the same thing" problem. Now the anchor is a neutral,
 *      3-sentence sketch plus a silent reference the model may consult
 *      but must never narrate.
 *
 *   2. buildSectionChartContext(chart, inputs) → string
 *      Preserved for transit chapters (which keep their existing path).
 *      Returns a plain-language emotional-territory hint for a chapter's
 *      declared chartInputs, never coordinates. Part I chapters no
 *      longer use this — they receive insight assignments instead.
 */

import type { ChartData, PlanetPosition } from "@/lib/types";
import type { ChartInput } from "./types";

function findPlanet(chart: ChartData, name: string): PlanetPosition | null {
  return chart.planets.find((p) => p.name === name) ?? null;
}

/* ─────────────────────────────────────────────────────────────────────
   Reader anchor — used ONCE at the top of the main user prompt.
   Neutral by design. Not templated per-sign.
───────────────────────────────────────────────────────────────────── */

export interface ReaderAnchor {
  /** 3-sentence neutral prose sketch. No sign-based slogans. */
  readonly leanPortrait: string;
  /**
   * Placement facts. Framed as reference-only. The model may consult
   * for accuracy; the book must not name any of it.
   */
  readonly silentReference: string;
}

export function buildReaderAnchor(chart: ChartData, name: string): ReaderAnchor {
  const first = name.trim().split(/\s+/)[0] || name.trim();
  const leanPortrait = [
    `This book is for ${first}.`,
    `Hold ${first} in mind while you write — not as a chart, as a friend you have watched for a long time.`,
    `Write to who ${first} actually is underneath, not to the version people meet first.`,
  ].join(" ");

  const silentReference = buildSilentReference(chart);

  return { leanPortrait, silentReference };
}

/* ─── Silent chart reference (unchanged intent from prior versions) ── */

function factLine(chart: ChartData, name: string): string | null {
  const p = findPlanet(chart, name);
  if (!p) return null;
  const deg = Math.floor(p.degree);
  const retro = p.retrograde ? " (retrograde)" : "";
  return `- ${name}: ${p.sign} ${deg}°, house ${p.house}${retro}`;
}

function angleFact(
  chart: ChartData,
  key: "ascendant" | "midheaven" | "imumCoeli",
  label: string
): string | null {
  const a = chart[key];
  if (!a?.sign) return null;
  const deg = Math.floor(a.degree ?? 0);
  return `- ${label}: ${a.sign} ${deg}°`;
}

function houseFact(chart: ChartData, num: number): string | null {
  const h = chart.houses.find((x) => x.number === num);
  if (!h) return null;
  return `- House ${num} cusp: ${h.sign}`;
}

function buildSilentReference(chart: ChartData): string {
  const parts: string[] = [];
  const planets = [
    "Sun", "Moon", "Mercury", "Venus", "Mars",
    "Jupiter", "Saturn", "Pluto",
  ];
  for (const name of planets) {
    const l = factLine(chart, name);
    if (l) parts.push(l);
  }
  for (const angle of [
    ["ascendant", "Rising"] as const,
    ["midheaven", "Midheaven"] as const,
    ["imumCoeli", "IC"] as const,
  ]) {
    const l = angleFact(chart, angle[0], angle[1]);
    if (l) parts.push(l);
  }
  for (const num of [2, 5, 7, 10, 12]) {
    const l = houseFact(chart, num);
    if (l) parts.push(l);
  }
  const strongest =
    chart.aspects.find((a) => a.type === "trine" || a.type === "square") ??
    chart.aspects.find((a) => a.type === "conjunction") ??
    chart.aspects[0];
  if (strongest) {
    parts.push(
      `- Defining aspect: ${strongest.planet1} ${strongest.type} ${strongest.planet2}`
    );
  }

  const header = [
    "SILENT CHART REFERENCE — for accuracy only.",
    "The reader will never see this block. The book does not narrate these.",
    "Do not name planets, houses, degrees, or aspects in the chapters unless",
    "the sentence is genuinely stronger with the mention than without it.",
    "The technical \"why we're saying this\" card is generated separately by",
    "the app and lives outside the story.",
  ].join("\n");

  if (parts.length === 0) return header;
  return `${header}\n\n${parts.join("\n")}`;
}

/* ─────────────────────────────────────────────────────────────────────
   Per-chapter chart context — used by TRANSIT chapters only.
   Part I chapters now receive insight assignments instead.
───────────────────────────────────────────────────────────────────── */

const TERRITORY: Record<ChartInput, string> = {
  "sun":               "who they are at the core, and what they quietly want",
  "moon":              "what they need to feel safe, and how they hide it",
  "mercury":           "how their mind moves, and where it gets stuck",
  "venus":             "what they love, how they attract, what they reach for",
  "mars":              "how they fight, pursue, and protect themselves",
  "jupiter":           "where luck lands for them, and how they expand",
  "saturn":            "the lesson life keeps giving them",
  "pluto":             "what runs deep and quietly transforms them",
  "rising":            "how they open a door, and what people meet first",
  "midheaven":         "their public path and long-term work",
  "ic":                "their private roots and their safe place",
  "house-2":           "how they build worth, money, and safety",
  "house-5":           "how they play, create, and take romantic risks",
  "house-7":           "the partnership their chart is drawn to",
  "house-10":          "their public shape and long career arc",
  "house-12":          "the parts of them that live behind closed doors",
  "major-aspects":     "the defining tension or flow inside them",
  "north-node":        "the direction their chart is quietly pulling them",
  "south-node":        "the pattern their chart is quietly pulling them away from",
  "chiron":            "the wound they keep circling",
  "current-transits":  "the sky moving across their chart right this season",
};

export function buildSectionChartContext(
  chart: ChartData,
  inputs: readonly ChartInput[]
): string {
  void chart;
  const territories: string[] = [];
  for (const input of inputs) {
    const t = TERRITORY[input];
    if (t) territories.push(`- ${t}`);
  }
  if (territories.length === 0) {
    return "This chapter is a synthesis chapter. Draw on the reader's overall shape from the anchor above.";
  }
  return [
    "Emotional territory this chapter draws on:",
    territories.join("\n"),
    "",
    "Specific placements are in the silent chart reference in the anchor above. Do not narrate them here.",
  ].join("\n");
}

/**
 * BACKWARDS-COMPAT: preserved because callers still import it. Returns
 * the same leanPortrait as buildReaderAnchor — the old one-liner form.
 */
export function buildReaderOpener(chart: ChartData, name: string): string {
  const anchor = buildReaderAnchor(chart, name);
  return [
    "# Reader",
    anchor.leanPortrait,
    "",
    "# " + anchor.silentReference.split("\n")[0],
    anchor.silentReference.split("\n").slice(1).join("\n").trim(),
  ].join("\n").trim();
}
