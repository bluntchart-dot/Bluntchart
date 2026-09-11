/**
 * Synastry-based compatibility engine for B1/B2 products.
 *
 * Computes compatibility using Sun, Moon, Venus, and Mars positions from
 * astronomy-engine. Birth place adjusts to local solar noon for more
 * accurate Moon positioning.
 *
 * Scoring model (v2):
 * - Continuous harmony function maps every angular difference (0°–180°)
 *   to a compatibility value — no dead zones.
 * - Cross-chart pairs only compare planets across charts (not natal).
 * - Stronger connection leads in cross-pairs (65/35 blend).
 * - 7 weighted categories, calibrated to a 0–100 scale.
 *
 * Simulated distribution (10k pairs):
 *   Mean ~62, Median ~62, p10 ~39, p90 ~84
 *   <20: ~1% | 20–39: ~10% | 40–59: ~34% | 60–79: ~40% | 80–89: ~10% | 90+: ~5%
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

// Continuous harmony landscape: every angular difference maps to a modifier.
// Positive = harmonious, negative = challenging.
// Cosine-interpolated between control points for smooth transitions.
const HARMONY_POINTS: [number, number][] = [
  [0, 0.48],     // conjunction
  [15, 0.28],    // fading conjunction
  [30, 0.08],    // semi-sextile
  [45, -0.22],   // semi-square
  [60, 0.35],    // sextile
  [75, -0.02],   // transition
  [90, -0.46],   // square
  [105, -0.10],  // fading square
  [120, 0.46],   // trine
  [135, -0.18],  // sesquisquare
  [150, -0.28],  // quincunx
  [165, -0.36],  // approaching opposition
  [180, -0.42],  // opposition
];

const BASELINE = 0.50;

function toBirthMoment(dateStr: string, lng?: number, timeStr?: string): Date {
  if (timeStr) {
    const d = new Date(dateStr + "T" + timeStr + ":00Z");
    if (lng !== undefined && lng !== null) {
      d.setTime(d.getTime() - (lng / 15) * 3600000);
    }
    return d;
  }
  const d = new Date(dateStr + "T12:00:00Z");
  if (lng !== undefined && lng !== null) {
    d.setTime(d.getTime() - (lng / 15) * 3600000);
  }
  return d;
}

function getPositions(dateStr: string, lng?: number, timeStr?: string): ChartPositions {
  const d = toBirthMoment(dateStr, lng, timeStr);
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

function continuousHarmony(diff: number): number {
  if (diff <= 0) return HARMONY_POINTS[0][1];
  if (diff >= 180) return HARMONY_POINTS[HARMONY_POINTS.length - 1][1];

  for (let i = 0; i < HARMONY_POINTS.length - 1; i++) {
    const [a1, v1] = HARMONY_POINTS[i];
    const [a2, v2] = HARMONY_POINTS[i + 1];
    if (diff >= a1 && diff <= a2) {
      const t = (diff - a1) / (a2 - a1);
      const smooth = (1 - Math.cos(t * Math.PI)) / 2;
      return v1 + (v2 - v1) * smooth;
    }
  }
  return 0;
}

function aspectScore(lon1: number, lon2: number): number {
  const diff = angularDiff(lon1, lon2);
  const modifier = continuousHarmony(diff);
  return Math.max(0, Math.min(1, BASELINE + modifier));
}

function crossPairScore(
  lon1a: number,
  lon2a: number,
  lon1b: number,
  lon2b: number
): number {
  const s1 = aspectScore(lon1a, lon2b);
  const s2 = aspectScore(lon2a, lon1b);
  const hi = Math.max(s1, s2);
  const lo = Math.min(s1, s2);
  return hi * 0.65 + lo * 0.35;
}

export function calculateSynastry(
  dob1: string,
  lat1?: number,
  lng1?: number,
  dob2?: string,
  lat2?: number,
  lng2?: number,
  time1?: string,
  time2?: string
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

  const p1 = getPositions(dob1, lng1, time1);
  const p2 = getPositions(dob2, lng2, time2);

  const venusMars = crossPairScore(p1.venus, p2.venus, p1.mars, p2.mars);
  const moonMoon = aspectScore(p1.moon, p2.moon);
  const sunMoon = crossPairScore(p1.sun, p2.sun, p1.moon, p2.moon);
  const venusVenus = aspectScore(p1.venus, p2.venus);
  const sunSun = aspectScore(p1.sun, p2.sun);
  const marsMars = aspectScore(p1.mars, p2.mars);
  const sunVenus = crossPairScore(p1.sun, p2.sun, p1.venus, p2.venus);

  const raw =
    venusMars * 0.25 +
    moonMoon * 0.18 +
    sunMoon * 0.18 +
    venusVenus * 0.14 +
    sunSun * 0.12 +
    marsMars * 0.08 +
    sunVenus * 0.05;

  const score = Math.min(100, Math.max(0, Math.round(-26 + raw * 180)));

  return {
    score,
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
