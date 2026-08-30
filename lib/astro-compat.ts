/**
 * Synastry-based compatibility engine for B1/B2 products.
 *
 * Computes aspect-based compatibility using Sun, Moon, Venus, and Mars
 * positions from astronomy-engine. Birth place adjusts to local solar
 * noon for more accurate Moon positioning.
 *
 * Scoring: weighted sum of best aspects across 7 planet-pair categories,
 * with orb-based decay. Range: 12–100.
 */

import * as Astronomy from "astronomy-engine";

export interface SynastryResult {
  score: number;
  breakdown: {
    venusMars: number;
    moonMoon: number;
    sunMoon: number;
    venusVenus: number;
    sunSun: number;
    marsMars: number;
    sunVenus: number;
  };
}

interface ChartPositions {
  sun: number;
  moon: number;
  venus: number;
  mars: number;
}

const ASPECTS: { angle: number; orb: number; base: number }[] = [
  { angle: 0, orb: 10, base: 1.0 },
  { angle: 60, orb: 6, base: 0.65 },
  { angle: 90, orb: 8, base: 0.35 },
  { angle: 120, orb: 8, base: 0.85 },
  { angle: 180, orb: 10, base: 0.5 },
];

function localNoon(dateStr: string, lng?: number): Date {
  const d = new Date(dateStr + "T12:00:00Z");
  if (lng !== undefined && lng !== null) {
    d.setTime(d.getTime() - (lng / 15) * 3600000);
  }
  return d;
}

function getPositions(dateStr: string, lng?: number): ChartPositions {
  const d = localNoon(dateStr, lng);
  return {
    sun: Astronomy.SunPosition(d).elon,
    moon: Astronomy.EclipticGeoMoon(d).lon,
    venus: Astronomy.EclipticLongitude(Astronomy.Body.Venus, d),
    mars: Astronomy.EclipticLongitude(Astronomy.Body.Mars, d),
  };
}

function angularDiff(a: number, b: number): number {
  const diff = Math.abs(a - b) % 360;
  return diff > 180 ? 360 - diff : diff;
}

function bestAspectScore(lon1: number, lon2: number): number {
  const diff = angularDiff(lon1, lon2);
  let best = 0;
  for (const asp of ASPECTS) {
    const dist = Math.abs(diff - asp.angle);
    if (dist <= asp.orb) {
      const score = asp.base * (1 - dist / asp.orb);
      if (score > best) best = score;
    }
  }
  return best;
}

function pairScore(lons1: number[], lons2: number[]): number {
  let total = 0;
  let count = 0;
  for (const a of lons1) {
    for (const b of lons2) {
      total += bestAspectScore(a, b);
      count++;
    }
  }
  return count > 0 ? total / count : 0;
}

export function calculateSynastry(
  dob1: string,
  lat1?: number,
  lng1?: number,
  dob2?: string,
  lat2?: number,
  lng2?: number
): SynastryResult {
  if (!dob2) {
    return {
      score: 50,
      breakdown: {
        venusMars: 0, moonMoon: 0, sunMoon: 0,
        venusVenus: 0, sunSun: 0, marsMars: 0, sunVenus: 0,
      },
    };
  }

  const p1 = getPositions(dob1, lng1);
  const p2 = getPositions(dob2, lng2);

  const venusMars = pairScore(
    [p1.venus, p2.venus],
    [p2.mars, p1.mars]
  );
  const moonMoon = bestAspectScore(p1.moon, p2.moon);
  const sunMoon = pairScore(
    [p1.sun, p2.sun],
    [p2.moon, p1.moon]
  );
  const venusVenus = bestAspectScore(p1.venus, p2.venus);
  const sunSun = bestAspectScore(p1.sun, p2.sun);
  const marsMars = bestAspectScore(p1.mars, p2.mars);
  const sunVenus = pairScore(
    [p1.sun, p2.sun],
    [p2.venus, p1.venus]
  );

  const raw =
    venusMars * 0.25 +
    moonMoon * 0.18 +
    sunMoon * 0.18 +
    venusVenus * 0.14 +
    sunSun * 0.12 +
    marsMars * 0.08 +
    sunVenus * 0.05;

  const score = Math.round(12 + raw * 88);

  return {
    score: Math.min(100, Math.max(0, score)),
    breakdown: {
      venusMars: Math.round(venusMars * 100),
      moonMoon: Math.round(moonMoon * 100),
      sunMoon: Math.round(sunMoon * 100),
      venusVenus: Math.round(venusVenus * 100),
      sunSun: Math.round(sunSun * 100),
      marsMars: Math.round(marsMars * 100),
      sunVenus: Math.round(sunVenus * 100),
    },
  };
}
