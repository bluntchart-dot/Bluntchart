/**
 * lib/transit/aspects.ts
 *
 * Transit-to-natal aspect calculations. Given a natal chart and a
 * date (or date range), computes which transiting planets aspect
 * which natal bodies, with applying/separating detection and
 * aspect window scanning.
 */

import * as Astronomy from "astronomy-engine";
import {
  getGeocentricLongitude,
  getSign,
  getDegreeInSign,
  angleDistance,
  normalizeDeg,
  isRetrograde,
  ASPECT_DEFS,
} from "@/lib/chart-calculator";
import type { ChartData, Aspect } from "@/lib/types";
import { OUTER_TRANSIT_BODIES, ALL_TRANSIT_BODIES } from "./engine";

/* ═════════════════════════════════════════════════════════════════
   TYPES
═════════════════════════════════════════════════════════════════ */

export interface TransitToNatalAspect {
  transitPlanet: string;
  transitSign: string;
  transitDegree: number;
  transitRetrograde: boolean;
  natalBody: string;
  natalSign: string;
  natalDegree: number;
  aspectType: Aspect["type"];
  orb: number;
  applying: boolean;
}

export interface TransitAspectWindow {
  transitPlanet: string;
  natalBody: string;
  aspectType: Aspect["type"];
  enterDate: Date;
  exactDate: Date | null;
  exitDate: Date;
  minOrb: number;
}

/* ═════════════════════════════════════════════════════════════════
   NATAL TARGETS — which natal bodies we check transits against
═════════════════════════════════════════════════════════════════ */

function getNatalTargets(chart: ChartData): { name: string; absoluteDegree: number; sign: string; degree: number }[] {
  const targets: { name: string; absoluteDegree: number; sign: string; degree: number }[] = [];

  for (const p of chart.planets) {
    targets.push({
      name: p.name,
      absoluteDegree: p.absoluteDegree,
      sign: p.sign,
      degree: p.degree,
    });
  }

  targets.push({
    name: "Ascendant",
    absoluteDegree: chart.ascendant.absoluteDegree,
    sign: chart.ascendant.sign,
    degree: chart.ascendant.degree,
  });

  targets.push({
    name: "Midheaven",
    absoluteDegree: chart.midheaven.absoluteDegree,
    sign: chart.midheaven.sign,
    degree: chart.midheaven.degree,
  });

  return targets;
}

/* ═════════════════════════════════════════════════════════════════
   SINGLE-DATE TRANSIT ASPECTS
═════════════════════════════════════════════════════════════════ */

export function getTransitAspectsForDate(
  chart: ChartData,
  date: Date,
  transitBodies: readonly string[] = ALL_TRANSIT_BODIES
): TransitToNatalAspect[] {
  const time = Astronomy.MakeTime(date);
  const prevTime = Astronomy.MakeTime(new Date(date.getTime() - 86400000));
  const natalTargets = getNatalTargets(chart);
  const results: TransitToNatalAspect[] = [];

  for (const tName of transitBodies) {
    const tLon = getGeocentricLongitude(tName, time);
    const tLonPrev = getGeocentricLongitude(tName, prevTime);
    const tRetro = isRetrograde(tName, time);
    const tSignObj = getSign(tLon);
    const tDeg = getDegreeInSign(tLon);

    for (const natal of natalTargets) {
      const diff = angleDistance(tLon, natal.absoluteDegree);

      for (const asp of ASPECT_DEFS) {
        const orb = Math.abs(diff - asp.angle);
        if (orb <= asp.orb) {
          const prevDiff = angleDistance(tLonPrev, natal.absoluteDegree);
          const prevOrb = Math.abs(prevDiff - asp.angle);
          const applying = orb < prevOrb;

          results.push({
            transitPlanet: tName,
            transitSign: tSignObj.name,
            transitDegree: tDeg,
            transitRetrograde: tRetro,
            natalBody: natal.name,
            natalSign: natal.sign,
            natalDegree: natal.degree,
            aspectType: asp.type,
            orb: Number(orb.toFixed(2)),
            applying,
          });
          break;
        }
      }
    }
  }

  results.sort((a, b) => a.orb - b.orb);
  return results;
}

/* ═════════════════════════════════════════════════════════════════
   ASPECT WINDOWS — find when aspects enter/exit orb in a range
═════════════════════════════════════════════════════════════════ */

export function findTransitAspectWindows(
  chart: ChartData,
  startDate: Date,
  endDate: Date,
  transitBodies: readonly string[] = OUTER_TRANSIT_BODIES,
  stepDays: number = 1
): TransitAspectWindow[] {
  const natalTargets = getNatalTargets(chart);
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  const stepMs = stepDays * 86400000;

  type WindowKey = string;
  const activeWindows = new Map<WindowKey, {
    transitPlanet: string;
    natalBody: string;
    aspectType: Aspect["type"];
    enterDate: Date;
    minOrb: number;
    exactDate: Date | null;
  }>();
  const completed: TransitAspectWindow[] = [];

  function key(t: string, n: string, a: string): WindowKey {
    return `${t}|${n}|${a}`;
  }

  for (let ms = startMs; ms <= endMs; ms += stepMs) {
    const d = new Date(ms);
    const time = Astronomy.MakeTime(d);
    const inAspectThisTick = new Set<WindowKey>();

    for (const tName of transitBodies) {
      const tLon = getGeocentricLongitude(tName, time);

      for (const natal of natalTargets) {
        const diff = angleDistance(tLon, natal.absoluteDegree);

        for (const asp of ASPECT_DEFS) {
          const orb = Math.abs(diff - asp.angle);
          if (orb <= asp.orb) {
            const k = key(tName, natal.name, asp.type);
            inAspectThisTick.add(k);

            const existing = activeWindows.get(k);
            if (existing) {
              if (orb < existing.minOrb) {
                existing.minOrb = orb;
                if (orb < 0.5) existing.exactDate = d;
              }
            } else {
              activeWindows.set(k, {
                transitPlanet: tName,
                natalBody: natal.name,
                aspectType: asp.type,
                enterDate: d,
                minOrb: orb,
                exactDate: orb < 0.5 ? d : null,
              });
            }
            break;
          }
        }
      }
    }

    activeWindows.forEach((win, k) => {
      if (!inAspectThisTick.has(k)) {
        completed.push({
          transitPlanet: win.transitPlanet,
          natalBody: win.natalBody,
          aspectType: win.aspectType,
          enterDate: win.enterDate,
          exactDate: win.exactDate,
          exitDate: d,
          minOrb: Number(win.minOrb.toFixed(2)),
        });
        activeWindows.delete(k);
      }
    });
  }

  activeWindows.forEach((win) => {
    completed.push({
      transitPlanet: win.transitPlanet,
      natalBody: win.natalBody,
      aspectType: win.aspectType,
      enterDate: win.enterDate,
      exactDate: win.exactDate,
      exitDate: endDate,
      minOrb: Number(win.minOrb.toFixed(2)),
    });
  });

  completed.sort(
    (a, b) => a.enterDate.getTime() - b.enterDate.getTime()
  );
  return completed;
}

/* ═════════════════════════════════════════════════════════════════
   FORMATTED CONTEXT — human-readable transit report for AI prompts
═════════════════════════════════════════════════════════════════ */

export function formatTransitContext(
  chart: ChartData,
  startDate: Date,
  months: number,
  options?: { includeWindows?: boolean; maxAspects?: number }
): string {
  const endDate = new Date(
    Date.UTC(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth() + months,
      1
    )
  );

  const includeWindows = options?.includeWindows ?? true;
  const maxAspects = options?.maxAspects ?? 20;

  const parts: string[] = [];

  const now = getTransitAspectsForDate(chart, startDate, OUTER_TRANSIT_BODIES);
  if (now.length > 0) {
    parts.push("CURRENT TRANSIT ASPECTS (tightest orb first):");
    for (const a of now.slice(0, 12)) {
      const dir = a.applying ? "applying" : "separating";
      const rx = a.transitRetrograde ? " Rx" : "";
      parts.push(
        `- Transit ${a.transitPlanet}${rx} in ${a.transitSign} ${a.transitDegree}° ${a.aspectType} natal ${a.natalBody} in ${a.natalSign} (${a.orb}° orb, ${dir})`
      );
    }
  }

  if (includeWindows) {
    const windows = findTransitAspectWindows(
      chart, startDate, endDate, OUTER_TRANSIT_BODIES
    );
    if (windows.length > 0) {
      parts.push("");
      parts.push(`TRANSIT ASPECT WINDOWS (next ${months} months):`);
      for (const w of windows.slice(0, maxAspects)) {
        const enter = w.enterDate.toISOString().slice(0, 10);
        const exit = w.exitDate.toISOString().slice(0, 10);
        const exact = w.exactDate
          ? ` (exact ~${w.exactDate.toISOString().slice(0, 10)})`
          : "";
        parts.push(
          `- ${w.transitPlanet} ${w.aspectType} natal ${w.natalBody}: ${enter} to ${exit}${exact}`
        );
      }
    }
  }

  return parts.join("\n");
}
