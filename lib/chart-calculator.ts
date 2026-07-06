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
};

const ASPECT_DEFS: { angle: number; type: Aspect["type"]; orb: number }[] = [
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

function getSign(absDeg: number) {
  const index = Math.floor(normalizeDeg(absDeg) / 30);
  return SIGNS[index];
}

function getDegreeInSign(absDeg: number): number {
  return Number((normalizeDeg(absDeg) % 30).toFixed(2));
}

function angleDistance(a: number, b: number): number {
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
/*                           GEOCENTRIC LONGITUDE FIX                         */
/* -------------------------------------------------------------------------- */

function getGeocentricLongitude(
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

function isRetrograde(planet: string, time: Astronomy.AstroTime): boolean {
  if (planet === "Sun" || planet === "Moon") return false;
  const body = Astronomy.Body[planet as keyof typeof Astronomy.Body];
  if (typeof body === "undefined") return false;
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

  const planets = PLANETS.map((planet) => buildPlanet(planet, time, ascDeg));
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