import * as Astronomy from "astronomy-engine";
import { fromZonedTime } from "date-fns-tz";

import type {
  BirthData,
  PlanetPosition,
  ChartData,
  Aspect,
} from "./types";

/* -------------------------------------------------------------------------- */
/*                                   TABLES                                   */
/* -------------------------------------------------------------------------- */

const SIGNS = [
  { name: "Aries",       symbol: "♈" },
  { name: "Taurus",      symbol: "♉" },
  { name: "Gemini",      symbol: "♊" },
  { name: "Cancer",      symbol: "♋" },
  { name: "Leo",         symbol: "♌" },
  { name: "Virgo",       symbol: "♍" },
  { name: "Libra",       symbol: "♎" },
  { name: "Scorpio",     symbol: "♏" },
  { name: "Sagittarius", symbol: "♐" },
  { name: "Capricorn",   symbol: "♑" },
  { name: "Aquarius",    symbol: "♒" },
  { name: "Pisces",      symbol: "♓" },
] as const;

const PLANETS = [
  "Sun", "Moon", "Mercury", "Venus", "Mars",
  "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto",
] as const;

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
  Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇",
  "North Node": "☊", "South Node": "☋", Chiron: "⚷",
};

export const ASPECT_DEFS: { angle: number; type: Aspect["type"]; orb: number }[] = [
  { angle: 0,   type: "conjunction", orb: 8 },
  { angle: 60,  type: "sextile",     orb: 6 },
  { angle: 90,  type: "square",      orb: 8 },
  { angle: 120, type: "trine",       orb: 8 },
  { angle: 180, type: "opposition",  orb: 8 },
];

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

export function normalizeDeg(value: number): number {
  return ((value % 360) + 360) % 360;
}

export function getSign(absDeg: number) {
  const index = Math.floor(normalizeDeg(absDeg) / 30);
  return SIGNS[index];
}

export function getDegreeInSign(absDeg: number): number {
  return Number((normalizeDeg(absDeg) % 30).toFixed(2));
}

export function angleDistance(a: number, b: number): number {
  const diff = Math.abs(a - b);
  return diff > 180 ? 360 - diff : diff;
}

function houseFromPlanet(planetDeg: number, ascDeg: number): number {
  const diff = normalizeDeg(planetDeg - ascDeg);
  return Math.floor(diff / 30) + 1;
}

export function birthInstantUtc(birth: BirthData): Date {
  const iana = birth.timezone?.trim() || "Etc/UTC";
  const localIso = `${birth.date}T${birth.time}:00`;
  return fromZonedTime(localIso, iana);
}

function eclipticLongitudeFromHorizon(
  time: Astronomy.AstroTime,
  observer: Astronomy.Observer,
  azimuthClockwiseFromNorth: number
): number {
  const vHor = Astronomy.VectorFromHorizon(
    { lat: 0, lon: azimuthClockwiseFromNorth, dist: 1 },
    time,
    "normal"
  );
  const rotHorEqj = Astronomy.InverseRotation(
    Astronomy.Rotation_EQJ_HOR(time, observer)
  );
  const vEqj = Astronomy.RotateVector(rotHorEqj, vHor);
  const vEct = Astronomy.RotateVector(Astronomy.Rotation_EQJ_ECT(time), vEqj);
  const sph = Astronomy.SphereFromVector(vEct);
  return normalizeDeg(sph.lon);
}

/* -------------------------------------------------------------------------- */
/*                     MEAN LUNAR NODE & CHIRON HELPERS                       */
/* -------------------------------------------------------------------------- */

const J2000_MS = Date.UTC(2000, 0, 1, 12, 0, 0);

function getMeanNodeLongitude(time: Astronomy.AstroTime): number {
  const T = (time.date.getTime() - J2000_MS) / (86400000 * 36525);
  return normalizeDeg(
    125.0445479
    - 1934.1362891 * T
    + 0.0020754 * T * T
    + (T * T * T) / 467441
    - (T * T * T * T) / 60616000
  );
}

// Chiron geocentric ecliptic longitude — JPL Horizons DE441, quarterly
// 426 entries: Jan/Apr/Jul/Oct from 1930 through 2036-Apr
// prettier-ignore
const CHIRON_Q0_YEAR = 1930;
// prettier-ignore
const CHIRON_LON = [
  39.78,41.96,47.54,48.23,44.27,46.15,51.96,53.13,49.04,50.65,56.67,58.29,
  54.10,55.37,61.62,63.84,59.59,60.43,66.91,69.82,65.57,65.92,72.61,76.30,
  72.15,71.98,78.88,83.37,79.41,78.61,85.67,91.16,87.62,86.03,93.16,99.78,
  96.93,94.44,101.51,109.35,107.57,104.10,110.98,120.06,119.69,115.26,121.55,131.88,
  133.57,128.27,133.50,144.86,149.07,143.39,146.94,158.90,165.81,160.56,161.99,173.87,
  183.13,179.38,178.20,189.10,200.17,198.75,195.21,204.25,216.22,217.36,212.30,218.89,
  230.87,234.20,228.67,232.77,244.12,249.00,243.76,245.46,255.78,261.74,257.27,257.01,
  266.11,272.70,269.18,267.45,275.29,282.23,279.56,276.90,283.60,290.55,288.75,285.39,
  290.99,297.92,296.88,293.09,297.70,304.52,304.15,300.11,303.84,310.55,310.66,306.54,
  309.58,316.03,316.64,312.49,314.84,321.10,322.13,318.03,319.77,325.82,327.23,323.22,
  324.42,330.31,331.98,328.08,328.87,334.51,336.48,332.72,333.08,338.52,340.76,337.15,
  337.11,342.35,344.84,341.40,341.00,346.11,348.76,345.46,344.80,349.69,352.55,349.43,
  348.47,353.17,356.23,353.30,352.05,356.58,359.83,357.08,355.57,359.98,3.36,0.77,
  359.07,3.29,6.84,4.45,2.52,6.56,10.30,8.12,5.96,9.83,13.74,11.78,
  9.41,13.16,17.20,15.41,12.88,16.46,20.67,19.12,16.39,19.78,24.17,22.88,
  19.95,23.16,27.73,26.70,23.59,26.66,31.38,30.58,27.32,30.19,35.09,34.60,
  31.16,33.81,38.91,38.76,35.14,37.56,42.86,43.07,39.30,41.52,47.01,47.55,
  43.64,45.60,51.30,52.29,48.25,49.90,55.81,57.31,53.17,54.46,60.59,62.67,
  58.45,59.40,65.76,68.39,64.15,64.67,71.24,74.61,70.43,70.42,77.18,81.38,
  77.38,76.74,83.67,88.80,85.15,83.83,90.89,97.01,93.86,91.75,98.82,106.10,
  103.85,100.78,107.67,116.21,115.27,111.19,117.64,127.44,128.32,123.30,129.02,139.94,
  143.01,137.41,141.75,153.50,159.22,153.69,156.01,168.00,176.36,171.91,171.72,183.10,
  193.59,191.15,188.55,198.51,210.21,210.27,205.73,213.43,225.51,227.99,222.52,227.61,
  239.30,243.68,238.23,240.79,251.56,257.22,252.37,252.90,262.53,268.89,264.93,263.79,
  272.16,278.95,275.96,273.61,280.76,287.73,285.65,282.48,288.47,295.50,294.14,290.51,
  295.55,302.41,301.76,297.81,301.92,308.64,308.60,304.50,307.78,314.33,314.81,310.66,
  313.22,319.62,320.47,316.35,318.35,324.49,325.74,321.69,323.12,329.04,330.64,326.70,
  327.62,333.34,335.25,331.44,331.90,337.47,339.59,335.91,336.04,341.37,343.74,340.21,
  339.97,345.11,347.71,344.36,343.77,348.72,351.54,348.36,347.47,352.28,355.24,352.22,
  351.10,355.71,358.87,356.03,354.64,359.07,2.41,359.77,358.13,2.39,5.91,3.48,
  1.60,5.74,9.39,7.11,5.06,9.01,12.84,10.77,8.51,12.29,16.28,14.45,
  11.97,15.58,19.74,18.14,15.46,18.95,23.25,21.83,19.00,22.30,26.78,25.62,
  22.60,25.71,30.37,29.49,26.28,29.18,34.03,33.45,30.06,32.81,37.82,37.49,
  33.96,36.49,41.70,41.73,38.03,40.32,45.72,46.14,42.28,44.31,49.91,50.77,
  46.78,48.56,54.37,55.62,51.53,53.00,59.03,60.82,56.64,57.74,63.99,66.39,
  62.17,62.84,69.29,72.39,68.21,68.42,
];

function getChironGeocentricLongitude(time: Astronomy.AstroTime): number {
  const d = time.date;
  const year = d.getUTCFullYear();
  const quarter = Math.floor(d.getUTCMonth() / 3);
  const baseIdx = (year - CHIRON_Q0_YEAR) * 4 + quarter;

  if (baseIdx < 0 || baseIdx >= CHIRON_LON.length - 1) return 0;

  const qStart = Date.UTC(year, quarter * 3, 1);
  const qEnd = quarter < 3
    ? Date.UTC(year, quarter * 3 + 3, 1)
    : Date.UTC(year + 1, 0, 1);
  const frac = (d.getTime() - qStart) / (qEnd - qStart);

  const lon1 = CHIRON_LON[baseIdx];
  const lon2 = CHIRON_LON[baseIdx + 1];
  let diff = lon2 - lon1;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  return normalizeDeg(lon1 + diff * frac);
}

/* -------------------------------------------------------------------------- */
/*                           GEOCENTRIC LONGITUDE FIX                         */
/* -------------------------------------------------------------------------- */

export function getGeocentricLongitude(
  planet: string,
  time: Astronomy.AstroTime
): number {
  switch (planet) {
    case "Sun": {
      const pos = Astronomy.SunPosition(time);
      return normalizeDeg(pos.elon);
    }
    case "Moon": {
      const moonVec = Astronomy.GeoMoon(time);
      const ecl = Astronomy.Ecliptic(moonVec);
      return normalizeDeg(ecl.elon);
    }
    case "North Node":
      return getMeanNodeLongitude(time);
    case "South Node":
      return normalizeDeg(getMeanNodeLongitude(time) + 180);
    case "Chiron":
      return getChironGeocentricLongitude(time);
    default: {
      const body = Astronomy.Body[planet as keyof typeof Astronomy.Body];
      const geoVec = Astronomy.GeoVector(body, time, true);
      const ecl = Astronomy.Ecliptic(geoVec);
      return normalizeDeg(ecl.elon);
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                           RETROGRADE DETECTION                             */
/* -------------------------------------------------------------------------- */

export function isRetrograde(planet: string, time: Astronomy.AstroTime): boolean {
  if (planet === "Sun" || planet === "Moon") return false;
  if (planet === "North Node" || planet === "South Node") return true;
  if (planet !== "Chiron") {
    const body = Astronomy.Body[planet as keyof typeof Astronomy.Body];
    if (typeof body === "undefined") return false;
  }
  const t1 = Astronomy.MakeTime(
    new Date(time.date.getTime() - 36 * 3600 * 1000)
  );
  const lon0 = getGeocentricLongitude(planet, time);
  const lon1 = getGeocentricLongitude(planet, t1);
  let diff = lon0 - lon1;
  if (diff >  180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

/* -------------------------------------------------------------------------- */
/*                              PLANET BUILDER                                */
/* -------------------------------------------------------------------------- */

function buildPlanet(
  name: string,
  time: Astronomy.AstroTime,
  ascDeg: number
): PlanetPosition {
  const absoluteDegree = getGeocentricLongitude(name, time);
  const sign = getSign(absoluteDegree);
  return {
    name,
    sign: sign.name,
    symbol: PLANET_SYMBOLS[name] ?? "",
    degree: getDegreeInSign(absoluteDegree),
    absoluteDegree: Number(absoluteDegree.toFixed(4)),
    house: houseFromPlanet(absoluteDegree, ascDeg),
    retrograde: isRetrograde(name, time),
  };
}

/* -------------------------------------------------------------------------- */
/*                                  ASPECTS                                   */
/* -------------------------------------------------------------------------- */

function calculateAspects(planets: PlanetPosition[]): Aspect[] {
  const results: Aspect[] = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];
      if (
        (p1.name === "North Node" && p2.name === "South Node") ||
        (p1.name === "South Node" && p2.name === "North Node")
      ) continue;
      const diff = angleDistance(p1.absoluteDegree, p2.absoluteDegree);
      let best: { type: Aspect["type"]; orb: number } | null = null;
      for (const asp of ASPECT_DEFS) {
        const orb = Math.abs(diff - asp.angle);
        if (orb <= asp.orb) {
          if (!best || orb < best.orb) {
            best = { type: asp.type, orb: Number(orb.toFixed(2)) };
          }
        }
      }
      if (best) {
        results.push({
          planet1: p1.name,
          planet2: p2.name,
          type: best.type,
          orb: best.orb,
        });
      }
    }
  }
  results.sort((a, b) => a.orb - b.orb);
  return results;
}

/* -------------------------------------------------------------------------- */
/*                                MAIN EXPORT                                 */
/* -------------------------------------------------------------------------- */

export function calculateChart(birth: BirthData): ChartData {
  const utc  = birthInstantUtc(birth);
  const time = Astronomy.MakeTime(utc);
  const observer = new Astronomy.Observer(birth.lat, birth.lng, 0);

  const ascDeg = eclipticLongitudeFromHorizon(time, observer, 90);
  const mcDeg  = eclipticLongitudeFromHorizon(time, observer, 180);
  const dcDeg  = eclipticLongitudeFromHorizon(time, observer, 270);
  const icDeg  = eclipticLongitudeFromHorizon(time, observer, 0);

  const planets: PlanetPosition[] = PLANETS.map((planet) => buildPlanet(planet, time, ascDeg));
  planets.push(
    buildPlanet("North Node", time, ascDeg),
    buildPlanet("South Node", time, ascDeg),
    buildPlanet("Chiron", time, ascDeg),
  );
  const aspects = calculateAspects(planets);

  const houses = Array.from({ length: 12 }, (_, i) => {
    const deg = normalizeDeg(ascDeg + i * 30);
    return {
      number:        i + 1,
      sign:          getSign(deg).name,
      degree:        getDegreeInSign(deg),
      absoluteDegree: Number(deg.toFixed(4)),
    };
  });

  return {
    planets,
    aspects,
    houses,
    ascendant: {
      sign:          getSign(ascDeg).name,
      degree:        getDegreeInSign(ascDeg),
      absoluteDegree: Number(ascDeg.toFixed(4)),
    },
    midheaven: {
      sign:          getSign(mcDeg).name,
      degree:        getDegreeInSign(mcDeg),
      absoluteDegree: Number(mcDeg.toFixed(4)),
    },
    descendant: {
      sign:          getSign(dcDeg).name,
      degree:        getDegreeInSign(dcDeg),
      absoluteDegree: Number(dcDeg.toFixed(4)),
    },
    imumCoeli: {
      sign:          getSign(icDeg).name,
      degree:        getDegreeInSign(icDeg),
      absoluteDegree: Number(icDeg.toFixed(4)),
    },
  };
}

/* -------------------------------------------------------------------------- */
/*                            TRANSIT ASPECTS                                 */
/* -------------------------------------------------------------------------- */

export interface TransitAspect {
  transitPlanet: string;
  transitSign: string;
  transitDegree: number;
  natalBody: string;
  natalSign: string;
  type: Aspect["type"];
  orb: number;
}

export function getTransitAspects(natalChart: ChartData): TransitAspect[] {
  const now = Astronomy.MakeTime(new Date());
  const TRANSIT_BODIES = [
    "Jupiter", "Saturn", "Uranus", "Neptune", "Pluto", "Chiron",
  ];
  const NATAL_TARGETS = ["Sun", "Moon", "Mercury", "Venus", "Mars"];
  const results: TransitAspect[] = [];

  for (const tName of TRANSIT_BODIES) {
    const tLon = getGeocentricLongitude(tName, now);
    const tSignObj = getSign(tLon);
    const tDeg = getDegreeInSign(tLon);

    for (const natal of natalChart.planets) {
      if (!NATAL_TARGETS.includes(natal.name)) continue;
      const diff = angleDistance(tLon, natal.absoluteDegree);
      for (const asp of ASPECT_DEFS) {
        const orb = Math.abs(diff - asp.angle);
        if (orb <= asp.orb) {
          results.push({
            transitPlanet: tName, transitSign: tSignObj.name, transitDegree: tDeg,
            natalBody: natal.name, natalSign: natal.sign,
            type: asp.type, orb: Number(orb.toFixed(2)),
          });
          break;
        }
      }
    }

    const ascDiff = angleDistance(tLon, natalChart.ascendant.absoluteDegree);
    for (const asp of ASPECT_DEFS) {
      const orb = Math.abs(ascDiff - asp.angle);
      if (orb <= asp.orb) {
        results.push({
          transitPlanet: tName, transitSign: tSignObj.name, transitDegree: tDeg,
          natalBody: "Ascendant", natalSign: natalChart.ascendant.sign,
          type: asp.type, orb: Number(orb.toFixed(2)),
        });
        break;
      }
    }
  }

  results.sort((a, b) => a.orb - b.orb);
  return results;
}

/* -------------------------------------------------------------------------- */
/*                          HIGHLIGHT BOXES EXPORT                            */
/*                                                                            */
/*  Call getChartHighlights(chart) after calculateChart() to get clean data  */
/*  for Big 3 boxes and key planet chips shown below the chart.              */
/* -------------------------------------------------------------------------- */

export interface HighlightEntry {
  label:      string;        // "Sun" | "Moon" | "Rising" | "Mercury" | "Venus" | "Mars"
  sign:       string;        // e.g. "Scorpio"
  symbol:     string;        // zodiac glyph e.g. "♏"
  degree:     number;        // degree within sign e.g. 14.5
  house:      number | null; // null for Rising (it IS the 1st house cusp)
  retrograde: boolean;       // always false for Sun / Moon / Rising
}

export interface ChartHighlights {
  /** Big 3 — shown first, larger boxes */
  big3: {
    sun:    HighlightEntry;
    moon:   HighlightEntry;
    rising: HighlightEntry;
  };
  /** Secondary — Mercury, Venus, Mars shown as smaller chips */
  keyPlanets: HighlightEntry[];
}

const SIGN_SYMBOLS: Record<string, string> = {
  Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋",
  Leo: "♌", Virgo: "♍", Libra: "♎", Scorpio: "♏",
  Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓",
};

function toEntry(
  label: string,
  p: PlanetPosition,
  overrideHouse?: number | null
): HighlightEntry {
  return {
    label,
    sign:       p.sign,
    symbol:     SIGN_SYMBOLS[p.sign] ?? p.sign,
    degree:     p.degree,
    house:      overrideHouse !== undefined ? overrideHouse : p.house,
    retrograde: p.retrograde,
  };
}

function fallback(label: string): HighlightEntry {
  return { label, sign: "—", symbol: "—", degree: 0, house: null, retrograde: false };
}

export function getChartHighlights(chart: ChartData): ChartHighlights {
  const get = (name: string) => chart.planets.find((p) => p.name === name);

  const sun     = get("Sun");
  const moon    = get("Moon");
  const mercury = get("Mercury");
  const venus   = get("Venus");
  const mars    = get("Mars");

  return {
    big3: {
      sun:    sun  ? toEntry("Sun",  sun)  : fallback("Sun"),
      moon:   moon ? toEntry("Moon", moon) : fallback("Moon"),
      rising: {
        label:      "Rising",
        sign:       chart.ascendant.sign,
        symbol:     SIGN_SYMBOLS[chart.ascendant.sign] ?? chart.ascendant.sign,
        degree:     chart.ascendant.degree,
        house:      null,
        retrograde: false,
      },
    },
    keyPlanets: [
      mercury ? toEntry("Mercury", mercury) : fallback("Mercury"),
      venus   ? toEntry("Venus",   venus)   : fallback("Venus"),
      mars    ? toEntry("Mars",    mars)    : fallback("Mars"),
    ],
  };
}