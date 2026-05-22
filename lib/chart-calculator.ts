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
/*                                                                            */
/*  astronomy-engine's EclipticLongitude(body, time) is HELIOCENTRIC and     */
/*  throws for the Sun ("Cannot calculate heliocentric longitude of the Sun") */
/*  Astrology needs GEOCENTRIC positions for every body, so we use the        */
/*  correct API call for each case:                                           */
/*                                                                            */
/*  Sun   → SunPosition(time).elon          geocentric ecliptic longitude     */
/*  Moon  → GeoMoon(time) → Ecliptic()      geocentric ecliptic longitude     */
/*  Other → GeoVector(body) → Ecliptic()    geocentric ecliptic longitude     */
/* -------------------------------------------------------------------------- */

function getGeocentricLongitude(
  planet: string,
  time: Astronomy.AstroTime
): number {
  switch (planet) {
    case "Sun": {
      // SunPosition() returns the Sun's geocentric ecliptic coordinates
      const pos = Astronomy.SunPosition(time);
      return normalizeDeg(pos.elon);
    }

    case "Moon": {
      // GeoMoon() returns geocentric equatorial vector (EQJ)
      // Ecliptic() converts EQJ vector → ecliptic coordinates
      const moonVec = Astronomy.GeoMoon(time);
      const ecl = Astronomy.Ecliptic(moonVec);
      return normalizeDeg(ecl.elon);
    }

    default: {
      // GeoVector() returns geocentric equatorial vector (EQJ) for any planet
      // true = apply stellar aberration correction (correct for apparent position)
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
  // Sun and Moon never retrograde
  if (planet === "Sun" || planet === "Moon") return false;

  // Verify body exists in the enum
  const body = Astronomy.Body[planet as keyof typeof Astronomy.Body];
  if (typeof body === "undefined") return false;

  // Compare geocentric longitude 36 hours apart
  // Negative change = planet appears to move backward = retrograde
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

  // Sort tightest orb first — tighter = stronger influence
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

  // Ascendant / angles from horizon–ecliptic intersection
  const ascDeg = eclipticLongitudeFromHorizon(time, observer, 90);
  const mcDeg  = eclipticLongitudeFromHorizon(time, observer, 180);
  const dcDeg  = eclipticLongitudeFromHorizon(time, observer, 270);
  const icDeg  = eclipticLongitudeFromHorizon(time, observer, 0);

  const planets = PLANETS.map((planet) => buildPlanet(planet, time, ascDeg));
  const aspects = calculateAspects(planets);

  // Equal house system from Ascendant (30° per house)
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