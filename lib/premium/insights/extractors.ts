/**
 * lib/premium/insights/extractors.ts
 *
 * Deterministic chart-fact extraction. Pure functions of ChartData.
 * No astrology INTERPRETATION here — only signal identification.
 *
 * Phase 1 extractor families:
 *   1. Tight aspects (orb < 5°)
 *   2. Angular planets (within 5° of ASC/MC/DC/IC)
 *   3. Element balance (dominant / missing)
 *   4. Modality balance (dominant / missing)
 *   5. Personal planet placements (Mercury / Venus / Mars)
 *   6. Contradictions (Sun/Moon element, Venus/Mars mode)
 *
 * Deferred to Phase 2 (add if insight yield stays low in production):
 *   - Stellium detector
 *   - Chart-ruler analyzer
 *   - Outer-planet contact scanner
 */

import type { AnglePoint, ChartData, PlanetPosition } from "@/lib/types";
import type { Signal } from "./types";

/* ─────────────────────────────────────────────────────────────────────
   Sign / element / modality lookup
───────────────────────────────────────────────────────────────────── */

type Sign =
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

type Element = "fire" | "earth" | "air" | "water";
type Modality = "cardinal" | "fixed" | "mutable";

const SIGN_ELEMENT: Record<Sign, Element> = {
  Aries: "fire", Leo: "fire", Sagittarius: "fire",
  Taurus: "earth", Virgo: "earth", Capricorn: "earth",
  Gemini: "air", Libra: "air", Aquarius: "air",
  Cancer: "water", Scorpio: "water", Pisces: "water",
};

const SIGN_MODALITY: Record<Sign, Modality> = {
  Aries: "cardinal", Cancer: "cardinal", Libra: "cardinal", Capricorn: "cardinal",
  Taurus: "fixed", Leo: "fixed", Scorpio: "fixed", Aquarius: "fixed",
  Gemini: "mutable", Virgo: "mutable", Sagittarius: "mutable", Pisces: "mutable",
};

function asSign(s: string | undefined): Sign | null {
  const known = Object.keys(SIGN_ELEMENT) as Sign[];
  return known.includes(s as Sign) ? (s as Sign) : null;
}

function findPlanet(chart: ChartData, name: string): PlanetPosition | null {
  return chart.planets.find((p) => p.name === name) ?? null;
}

/* ─────────────────────────────────────────────────────────────────────
   Utility: strength scoring helpers
───────────────────────────────────────────────────────────────────── */

/** Aspect strength inversely proportional to orb. Orb 0° → 1.0, orb 5° → 0.0. */
function aspectStrength(orb: number, maxOrb = 5): number {
  if (orb >= maxOrb) return 0;
  return Math.max(0, 1 - orb / maxOrb);
}

/** Angular strength inversely proportional to distance from angle in degrees. */
function angularStrength(distanceDeg: number, maxDistance = 5): number {
  if (distanceDeg >= maxDistance) return 0;
  return Math.max(0, 1 - distanceDeg / maxDistance);
}

/** Minimum angular distance between two absolute-degree positions, wrapped. */
function circularDistance(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return Math.min(diff, 360 - diff);
}

/* ─────────────────────────────────────────────────────────────────────
   1. TIGHT ASPECTS
───────────────────────────────────────────────────────────────────── */

const HARD_ASPECTS = new Set(["square", "opposition"]);
const SOFT_ASPECTS = new Set(["trine", "sextile"]);

function extractTightAspects(chart: ChartData): Signal[] {
  const out: Signal[] = [];
  for (const a of chart.aspects) {
    if (a.orb >= 5) continue;
    // Skip aspects involving unfamiliar planets to keep signal quality high.
    const p1 = findPlanet(chart, a.planet1);
    const p2 = findPlanet(chart, a.planet2);
    if (!p1 || !p2) continue;
    // Skip aspects between only outer-outer planets (generational).
    const OUTER = new Set(["Uranus", "Neptune", "Pluto"]);
    if (OUTER.has(a.planet1) && OUTER.has(a.planet2)) continue;

    const strength = aspectStrength(a.orb);
    const flavor = HARD_ASPECTS.has(a.type)
      ? "hard"
      : SOFT_ASPECTS.has(a.type)
        ? "soft"
        : "conjunct";
    const orbFmt = a.orb.toFixed(1);
    const id = `sig_aspect_${a.planet1.toLowerCase()}_${a.type}_${a.planet2.toLowerCase()}`;
    out.push({
      id,
      kind: "tight_aspect",
      description:
        `${a.planet1} in ${p1.sign} ${a.type} ${a.planet2} in ${p2.sign}, orb ${orbFmt}° (${flavor})`,
      strength,
      raw: {
        planet1: a.planet1,
        planet2: a.planet2,
        aspect: a.type,
        orb: a.orb,
        flavor,
        involvesPersonal:
          !OUTER.has(a.planet1) || !OUTER.has(a.planet2),
      },
    });
  }
  return out;
}

/* ─────────────────────────────────────────────────────────────────────
   2. ANGULAR PLANETS
───────────────────────────────────────────────────────────────────── */

function extractAngularEmphasis(chart: ChartData): Signal[] {
  const out: Signal[] = [];
  const angles: Array<{ key: string; angle: AnglePoint | undefined }> = [
    { key: "Ascendant", angle: chart.ascendant },
    { key: "Midheaven", angle: chart.midheaven },
    { key: "Descendant", angle: chart.descendant },
    { key: "ImumCoeli", angle: chart.imumCoeli },
  ];
  for (const p of chart.planets) {
    for (const { key, angle } of angles) {
      if (!angle) continue;
      const dist = circularDistance(p.absoluteDegree, angle.absoluteDegree);
      if (dist >= 5) continue;
      const strength = angularStrength(dist);
      const id = `sig_angular_${p.name.toLowerCase()}_${key.toLowerCase()}`;
      out.push({
        id,
        kind: "angular_planet",
        description:
          `${p.name} in ${p.sign} within ${dist.toFixed(1)}° of the ${key}`,
        strength,
        raw: {
          planet: p.name,
          angle: key,
          distance: dist,
          sign: p.sign,
        },
      });
    }
  }
  return out;
}

/* ─────────────────────────────────────────────────────────────────────
   3. ELEMENT BALANCE + missing
───────────────────────────────────────────────────────────────────── */

// Personal + luminary planets carry the most weight when scoring element mix.
const ELEMENT_WEIGHT: Record<string, number> = {
  Sun: 3, Moon: 3, Ascendant: 2, Mercury: 2, Venus: 2, Mars: 2,
  Jupiter: 1, Saturn: 1,
};

function extractElementBalance(chart: ChartData): Signal[] {
  const scores: Record<Element, number> = { fire: 0, earth: 0, air: 0, water: 0 };
  let total = 0;

  for (const p of chart.planets) {
    const s = asSign(p.sign);
    if (!s) continue;
    const w = ELEMENT_WEIGHT[p.name] ?? 0;
    if (w === 0) continue;
    scores[SIGN_ELEMENT[s]] += w;
    total += w;
  }
  // Also count Rising via the Ascendant sign.
  const risingSign = asSign(chart.ascendant?.sign);
  if (risingSign) {
    scores[SIGN_ELEMENT[risingSign]] += ELEMENT_WEIGHT.Ascendant;
    total += ELEMENT_WEIGHT.Ascendant;
  }

  if (total === 0) return [];

  const percentages = Object.fromEntries(
    (Object.keys(scores) as Element[]).map((el) => [el, scores[el] / total])
  ) as Record<Element, number>;

  const out: Signal[] = [];
  const sorted = (Object.entries(percentages) as [Element, number][])
    .sort((a, b) => b[1] - a[1]);

  const [dominant, dominantPct] = sorted[0];
  if (dominantPct >= 0.4) {
    out.push({
      id: `sig_element_dominant_${dominant}`,
      kind: "element_balance",
      description:
        `${dominant}-heavy chart (${Math.round(dominantPct * 100)}% weight)`,
      strength: Math.min(1, (dominantPct - 0.4) * 2 + 0.5),
      raw: { element: dominant, percentages },
    });
  }

  for (const [el, pct] of sorted) {
    if (pct <= 0.10) {
      out.push({
        id: `sig_element_missing_${el}`,
        kind: "element_missing",
        description:
          `${el} is markedly absent (${Math.round(pct * 100)}% weight)`,
        strength: Math.min(1, (0.10 - pct) * 4 + 0.4),
        raw: { element: el, percentages },
      });
    }
  }

  return out;
}

/* ─────────────────────────────────────────────────────────────────────
   4. MODALITY BALANCE + missing
───────────────────────────────────────────────────────────────────── */

function extractModalityBalance(chart: ChartData): Signal[] {
  const scores: Record<Modality, number> = { cardinal: 0, fixed: 0, mutable: 0 };
  let total = 0;

  for (const p of chart.planets) {
    const s = asSign(p.sign);
    if (!s) continue;
    const w = ELEMENT_WEIGHT[p.name] ?? 0;
    if (w === 0) continue;
    scores[SIGN_MODALITY[s]] += w;
    total += w;
  }
  const risingSign = asSign(chart.ascendant?.sign);
  if (risingSign) {
    scores[SIGN_MODALITY[risingSign]] += ELEMENT_WEIGHT.Ascendant;
    total += ELEMENT_WEIGHT.Ascendant;
  }
  if (total === 0) return [];

  const percentages = Object.fromEntries(
    (Object.keys(scores) as Modality[]).map((m) => [m, scores[m] / total])
  ) as Record<Modality, number>;

  const out: Signal[] = [];
  const sorted = (Object.entries(percentages) as [Modality, number][])
    .sort((a, b) => b[1] - a[1]);

  const [dominant, dominantPct] = sorted[0];
  if (dominantPct >= 0.5) {
    out.push({
      id: `sig_modality_dominant_${dominant}`,
      kind: "modality_balance",
      description:
        `${dominant}-heavy chart (${Math.round(dominantPct * 100)}% weight)`,
      strength: Math.min(1, (dominantPct - 0.5) * 2 + 0.4),
      raw: { modality: dominant, percentages },
    });
  }
  for (const [m, pct] of sorted) {
    if (pct <= 0.10) {
      out.push({
        id: `sig_modality_missing_${m}`,
        kind: "modality_missing",
        description:
          `${m} modality is markedly absent (${Math.round(pct * 100)}% weight)`,
        strength: Math.min(1, (0.10 - pct) * 4 + 0.4),
        raw: { modality: m, percentages },
      });
    }
  }
  return out;
}

/* ─────────────────────────────────────────────────────────────────────
   5. PERSONAL PLANET PLACEMENTS (Mercury, Venus, Mars)
───────────────────────────────────────────────────────────────────── */

const PERSONAL_PLANETS = ["Mercury", "Venus", "Mars"];

function extractPersonalPlanetPlacements(chart: ChartData): Signal[] {
  const out: Signal[] = [];
  for (const name of PERSONAL_PLANETS) {
    const p = findPlanet(chart, name);
    if (!p) continue;
    const sign = asSign(p.sign);
    if (!sign) continue;
    const element = SIGN_ELEMENT[sign];
    const modality = SIGN_MODALITY[sign];
    out.push({
      id: `sig_personal_${name.toLowerCase()}`,
      kind: "personal_planet_placement",
      description:
        `${name} in ${p.sign} (${element}, ${modality}), house ${p.house}`,
      strength: 0.55,
      raw: {
        planet: name,
        sign: p.sign,
        element,
        modality,
        house: p.house,
        retrograde: p.retrograde,
      },
    });
  }
  return out;
}

/* ─────────────────────────────────────────────────────────────────────
   6. CONTRADICTIONS
───────────────────────────────────────────────────────────────────── */

function extractContradictions(chart: ChartData): Signal[] {
  const out: Signal[] = [];
  const sun = findPlanet(chart, "Sun");
  const moon = findPlanet(chart, "Moon");
  const venus = findPlanet(chart, "Venus");
  const mars = findPlanet(chart, "Mars");
  const rising = asSign(chart.ascendant?.sign);

  // Sun/Moon element clash — a classic split-signature.
  if (sun && moon) {
    const sSign = asSign(sun.sign);
    const mSign = asSign(moon.sign);
    if (sSign && mSign) {
      const sunEl = SIGN_ELEMENT[sSign];
      const moonEl = SIGN_ELEMENT[mSign];
      const clashPairs: Record<Element, Element> = {
        fire: "water", water: "fire",
        earth: "air", air: "earth",
      };
      if (clashPairs[sunEl] === moonEl) {
        out.push({
          id: "sig_contradiction_sun_moon_element",
          kind: "contradiction_sun_moon_element",
          description:
            `Sun in ${sun.sign} (${sunEl}) contradicts Moon in ${moon.sign} (${moonEl}) — surface vs. interior operate on different fuels`,
          strength: 0.72,
          raw: {
            sunSign: sun.sign, moonSign: moon.sign,
            sunElement: sunEl, moonElement: moonEl,
          },
        });
      }
    }
  }

  // Rising vs Sun element split — how she opens the door vs how she runs inside.
  if (sun && rising) {
    const sSign = asSign(sun.sign);
    if (sSign && SIGN_ELEMENT[sSign] !== SIGN_ELEMENT[rising]) {
      out.push({
        id: "sig_contradiction_sun_rising_element",
        kind: "contradiction_sun_moon_element",
        description:
          `Rising in ${rising} (${SIGN_ELEMENT[rising]}) reads different from Sun in ${sun.sign} (${SIGN_ELEMENT[sSign]}) — presented self vs. core self`,
        strength: 0.62,
        raw: {
          risingSign: rising, sunSign: sun.sign,
          risingElement: SIGN_ELEMENT[rising], sunElement: SIGN_ELEMENT[sSign],
        },
      });
    }
  }

  // Venus/Mars modality clash — how she attracts vs how she pursues.
  if (venus && mars) {
    const vSign = asSign(venus.sign);
    const mSign = asSign(mars.sign);
    if (vSign && mSign && SIGN_MODALITY[vSign] !== SIGN_MODALITY[mSign]) {
      out.push({
        id: "sig_contradiction_venus_mars_mode",
        kind: "contradiction_venus_mars_mode",
        description:
          `Venus in ${venus.sign} (${SIGN_MODALITY[vSign]}) and Mars in ${mars.sign} (${SIGN_MODALITY[mSign]}) — desire and pursuit want opposite tempos`,
        strength: 0.60,
        raw: {
          venusSign: venus.sign, marsSign: mars.sign,
          venusModality: SIGN_MODALITY[vSign], marsModality: SIGN_MODALITY[mSign],
        },
      });
    }
  }

  return out;
}

/* ─────────────────────────────────────────────────────────────────────
   PUBLIC: extract all signals
───────────────────────────────────────────────────────────────────── */

export function extractAllSignals(chart: ChartData): Signal[] {
  return [
    ...extractTightAspects(chart),
    ...extractAngularEmphasis(chart),
    ...extractElementBalance(chart),
    ...extractModalityBalance(chart),
    ...extractPersonalPlanetPlacements(chart),
    ...extractContradictions(chart),
  ];
}
