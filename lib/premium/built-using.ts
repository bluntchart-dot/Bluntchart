/**
 * built-using.ts
 *
 * Deterministic generator for the small "Built Using" trust card that
 * appears at the end of every AI chapter.
 *
 * Same ChartData + same ChartInput[] in → same BuiltUsingItem[] out.
 * The AI never invents these. They are computed from the real chart.
 */

import type { ChartData, PlanetPosition } from "@/lib/types";
import type { BuiltUsingItem, ChartInput } from "./types";

/* ─── Symbol table ─────────────────────────────────────────────────── */

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☀",
  Moon: "🌙",
  Mercury: "☿",
  Venus: "♀",
  Mars: "♂",
  Jupiter: "♃",
  Saturn: "♄",
  Uranus: "♅",
  Neptune: "♆",
  Pluto: "♇",
};

/* ─── One-line explanations, kept beginner-friendly ────────────────── */

const MEANINGS: Record<ChartInput, string> = {
  sun:           "Your core personality and life direction.",
  moon:          "Your emotional world and inner needs.",
  rising:        "How you naturally show up and how others first experience you.",
  venus:         "How you love and what you're drawn to.",
  mars:          "How you fight, act, and pursue what you want.",
  mercury:       "How your mind moves and how you talk to yourself.",
  jupiter:       "Where your luck lives and how you expand.",
  saturn:        "The lesson life keeps handing you until you learn it.",
  pluto:         "What runs deep, transforms you, and what you hide.",
  "north-node":  "The direction you're growing toward.",
  "south-node":  "The comfortable pattern you're being asked to leave.",
  chiron:        "Your oldest wound and where your healing lives.",
  midheaven:     "How you're meant to be seen in the world.",
  ic:            "Your private roots and what home feels like.",
  "house-2":     "How you build safety, worth, and resources.",
  "house-5":     "How you play, create, and take romantic risks.",
  "house-7":     "The kind of partnership your chart is drawn to.",
  "house-10":    "Your public path and long-term work.",
  "house-12":    "The parts of you that live behind closed doors.",
  "major-aspects":"A key aspect shaping this specific tension.",
  "current-transits":"What the sky is doing to your chart right now.",
};

/* ─── Helpers ──────────────────────────────────────────────────────── */

function findPlanet(chart: ChartData, name: string): PlanetPosition | null {
  return chart.planets.find((p) => p.name === name) ?? null;
}

function formatPlanetLabel(name: string, p: PlanetPosition): string {
  const deg = Math.floor(p.degree);
  return `${name} in ${p.sign} (${deg}°)`;
}

function angleItem(
  chart: ChartData,
  angle: "ascendant" | "midheaven" | "imumCoeli",
  friendlyName: string,
  input: ChartInput,
  symbol: string
): BuiltUsingItem | null {
  const a = chart[angle];
  if (!a?.sign) return null;
  const deg = Math.floor(a.degree ?? 0);
  return {
    symbol,
    label: `${friendlyName} in ${a.sign} (${deg}°)`,
    meaning: MEANINGS[input],
  };
}

/* ─── Public entry point ───────────────────────────────────────────── */

/**
 * Compute the Built Using card entries for one section, given its
 * declared chart inputs and the real chart data.
 *
 * Any input we can't resolve from the chart is silently dropped rather
 * than throwing — the card degrades gracefully. Order is preserved.
 */
export function buildBuiltUsing(
  chart: ChartData,
  inputs: readonly ChartInput[]
): BuiltUsingItem[] {
  const items: BuiltUsingItem[] = [];

  for (const input of inputs) {
    switch (input) {
      case "sun":
      case "moon":
      case "mercury":
      case "venus":
      case "mars":
      case "jupiter":
      case "saturn":
      case "pluto": {
        const name = input.charAt(0).toUpperCase() + input.slice(1);
        const p = findPlanet(chart, name);
        if (p) {
          items.push({
            symbol: PLANET_SYMBOLS[name] ?? "✨",
            label: formatPlanetLabel(name, p),
            meaning: MEANINGS[input],
          });
        }
        break;
      }

      case "rising": {
        const item = angleItem(chart, "ascendant", "Rising", "rising", "⬆");
        if (item) items.push(item);
        break;
      }
      case "midheaven": {
        const item = angleItem(chart, "midheaven", "Midheaven", "midheaven", "★");
        if (item) items.push(item);
        break;
      }
      case "ic": {
        const item = angleItem(chart, "imumCoeli", "Imum Coeli", "ic", "⌂");
        if (item) items.push(item);
        break;
      }

      case "north-node":
      case "south-node":
      case "chiron": {
        // Not currently produced by our chart calculator. Skip until we add them.
        break;
      }

      case "house-2":
      case "house-5":
      case "house-7":
      case "house-10":
      case "house-12": {
        const num = Number(input.split("-")[1]);
        const house = chart.houses.find((h) => h.number === num);
        if (house) {
          items.push({
            symbol: "🏛",
            label: `${num}th house in ${house.sign}`,
            meaning: MEANINGS[input],
          });
        }
        break;
      }

      case "major-aspects": {
        const strongest =
          chart.aspects.find((a) => a.type === "trine" || a.type === "conjunction") ??
          chart.aspects[0] ?? null;
        if (strongest) {
          const symbol =
            strongest.type === "trine" ? "△" :
            strongest.type === "square" ? "□" :
            strongest.type === "opposition" ? "☍" :
            strongest.type === "sextile" ? "✶" : "☌";
          items.push({
            symbol,
            label: `${strongest.planet1} ${strongest.type} ${strongest.planet2}`,
            meaning: MEANINGS[input],
          });
        }
        break;
      }

      case "current-transits": {
        // Transit engine not built yet. Skip until it ships; Part II
        // sections are `disabled: true` in the blueprint anyway.
        break;
      }
    }
  }

  return items;
}
