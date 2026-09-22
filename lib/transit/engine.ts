/**
 * lib/transit/engine.ts
 *
 * Full ephemeris-based transit engine. Computes planetary positions
 * for any date, scans date ranges for transit windows, detects
 * retrogrades, sign ingresses, and stations.
 *
 * Uses astronomy-engine for precise ephemeris and reuses
 * chart-calculator utilities for sign/degree math.
 */

import * as Astronomy from "astronomy-engine";
import {
  getGeocentricLongitude,
  getSign,
  getDegreeInSign,
  normalizeDeg,
  isRetrograde,
} from "@/lib/chart-calculator";

/* ═════════════════════════════════════════════════════════════════
   TYPES
═════════════════════════════════════════════════════════════════ */

export interface TransitPosition {
  planet: string;
  sign: string;
  degree: number;
  absoluteDegree: number;
  retrograde: boolean;
}

export interface SignIngress {
  planet: string;
  fromSign: string;
  toSign: string;
  approximateDate: Date;
}

export interface PlanetStation {
  planet: string;
  type: "retrograde" | "direct";
  sign: string;
  degree: number;
  approximateDate: Date;
}

export interface TransitSnapshot {
  date: Date;
  positions: TransitPosition[];
}

/* ═════════════════════════════════════════════════════════════════
   CONSTANTS
═════════════════════════════════════════════════════════════════ */

export const ALL_TRANSIT_BODIES = [
  "Sun", "Moon", "Mercury", "Venus", "Mars",
  "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto",
  "North Node", "Chiron",
] as const;

export const OUTER_TRANSIT_BODIES = [
  "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Chiron",
] as const;

export const INNER_TRANSIT_BODIES = [
  "Sun", "Mercury", "Venus", "Mars",
] as const;

/* ═════════════════════════════════════════════════════════════════
   SNAPSHOT — positions at a single date
═════════════════════════════════════════════════════════════════ */

export function getTransitSnapshot(
  date: Date,
  bodies: readonly string[] = ALL_TRANSIT_BODIES
): TransitSnapshot {
  const time = Astronomy.MakeTime(date);
  const positions: TransitPosition[] = bodies.map((planet) => {
    const lon = getGeocentricLongitude(planet, time);
    return {
      planet,
      sign: getSign(lon).name,
      degree: getDegreeInSign(lon),
      absoluteDegree: Number(lon.toFixed(4)),
      retrograde: isRetrograde(planet, time),
    };
  });
  return { date, positions };
}

/* ═════════════════════════════════════════════════════════════════
   MONTHLY SNAPSHOTS — positions at 1st of each month in a range
═════════════════════════════════════════════════════════════════ */

export function getMonthlySnapshots(
  startDate: Date,
  months: number,
  bodies: readonly string[] = OUTER_TRANSIT_BODIES
): TransitSnapshot[] {
  const snapshots: TransitSnapshot[] = [];
  for (let i = 0; i < months; i++) {
    const d = new Date(
      Date.UTC(
        startDate.getUTCFullYear(),
        startDate.getUTCMonth() + i,
        1
      )
    );
    snapshots.push(getTransitSnapshot(d, bodies));
  }
  return snapshots;
}

/* ═════════════════════════════════════════════════════════════════
   SIGN INGRESSES — detect when a planet changes sign in a range
═════════════════════════════════════════════════════════════════ */

export function findSignIngresses(
  startDate: Date,
  endDate: Date,
  bodies: readonly string[] = OUTER_TRANSIT_BODIES,
  stepDays: number = 1
): SignIngress[] {
  const ingresses: SignIngress[] = [];
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  const stepMs = stepDays * 86400000;

  for (const planet of bodies) {
    let prevTime = Astronomy.MakeTime(startDate);
    let prevSign = getSign(getGeocentricLongitude(planet, prevTime)).name;

    for (let ms = startMs + stepMs; ms <= endMs; ms += stepMs) {
      const d = new Date(ms);
      const time = Astronomy.MakeTime(d);
      const lon = getGeocentricLongitude(planet, time);
      const sign = getSign(lon).name;

      if (sign !== prevSign) {
        ingresses.push({
          planet,
          fromSign: prevSign,
          toSign: sign,
          approximateDate: d,
        });
        prevSign = sign;
      }

      prevTime = time;
    }
  }

  ingresses.sort(
    (a, b) => a.approximateDate.getTime() - b.approximateDate.getTime()
  );
  return ingresses;
}

/* ═════════════════════════════════════════════════════════════════
   STATIONS — detect retrograde/direct station changes
═════════════════════════════════════════════════════════════════ */

const STATION_BODIES = [
  "Mercury", "Venus", "Mars", "Jupiter", "Saturn",
  "Uranus", "Neptune", "Pluto",
] as const;

export function findStations(
  startDate: Date,
  endDate: Date,
  stepDays: number = 1
): PlanetStation[] {
  const stations: PlanetStation[] = [];
  const startMs = startDate.getTime();
  const endMs = endDate.getTime();
  const stepMs = stepDays * 86400000;

  for (const planet of STATION_BODIES) {
    let prevRetro = isRetrograde(planet, Astronomy.MakeTime(startDate));

    for (let ms = startMs + stepMs; ms <= endMs; ms += stepMs) {
      const d = new Date(ms);
      const time = Astronomy.MakeTime(d);
      const retro = isRetrograde(planet, time);

      if (retro !== prevRetro) {
        const lon = getGeocentricLongitude(planet, time);
        stations.push({
          planet,
          type: retro ? "retrograde" : "direct",
          sign: getSign(lon).name,
          degree: getDegreeInSign(lon),
          approximateDate: d,
        });
      }

      prevRetro = retro;
    }
  }

  stations.sort(
    (a, b) => a.approximateDate.getTime() - b.approximateDate.getTime()
  );
  return stations;
}

/* ═════════════════════════════════════════════════════════════════
   CONVENIENCE — full transit context for a time window
═════════════════════════════════════════════════════════════════ */

export interface TransitWindowContext {
  currentPositions: TransitSnapshot;
  monthlySnapshots: TransitSnapshot[];
  ingresses: SignIngress[];
  stations: PlanetStation[];
}

export function getTransitWindowContext(
  startDate: Date,
  months: number
): TransitWindowContext {
  const endDate = new Date(
    Date.UTC(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth() + months,
      1
    )
  );

  return {
    currentPositions: getTransitSnapshot(startDate),
    monthlySnapshots: getMonthlySnapshots(startDate, months),
    ingresses: findSignIngresses(startDate, endDate),
    stations: findStations(startDate, endDate),
  };
}
