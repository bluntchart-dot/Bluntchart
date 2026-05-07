import * as Astronomy from 'astronomy-engine';
import type {
  BirthData,
  PlanetPosition,
  ChartData,
  Aspect,
} from './types';

/* -------------------------------------------------------------------------- */
/*                                   TABLES                                   */
/* -------------------------------------------------------------------------- */

const SIGNS = [
  { name: 'Aries', symbol: '♈' },
  { name: 'Taurus', symbol: '♉' },
  { name: 'Gemini', symbol: '♊' },
  { name: 'Cancer', symbol: '♋' },
  { name: 'Leo', symbol: '♌' },
  { name: 'Virgo', symbol: '♍' },
  { name: 'Libra', symbol: '♎' },
  { name: 'Scorpio', symbol: '♏' },
  { name: 'Sagittarius', symbol: '♐' },
  { name: 'Capricorn', symbol: '♑' },
  { name: 'Aquarius', symbol: '♒' },
  { name: 'Pisces', symbol: '♓' },
];

const PLANETS = [
  'Sun',
  'Moon',
  'Mercury',
  'Venus',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Pluto',
] as const;

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: '☉',
  Moon: '☽',
  Mercury: '☿',
  Venus: '♀',
  Mars: '♂',
  Jupiter: '♃',
  Saturn: '♄',
  Uranus: '♅',
  Neptune: '♆',
  Pluto: '♇',
};

const ASPECTS = [
  { angle: 0, type: 'conjunction' },
  { angle: 60, type: 'sextile' },
  { angle: 90, type: 'square' },
  { angle: 120, type: 'trine' },
  { angle: 180, type: 'opposition' },
] as const;

/* -------------------------------------------------------------------------- */
/*                                  HELPERS                                   */
/* -------------------------------------------------------------------------- */

function normalizeDeg(value: number): number {
  return ((value % 360) + 360) % 360;
}

function getSign(absDeg: number) {
  const index = Math.floor(normalizeDeg(absDeg) / 30);
  return SIGNS[index];
}

function getDegreeInSign(absDeg: number): number {
  return normalizeDeg(absDeg) % 30;
}

function angleDistance(a: number, b: number): number {
  const diff = Math.abs(a - b);
  return diff > 180 ? 360 - diff : diff;
}

function houseFromPlanet(
  planetDeg: number,
  ascDeg: number
): number {
  const diff = normalizeDeg(planetDeg - ascDeg);
  return Math.floor(diff / 30) + 1;
}

/* -------------------------------------------------------------------------- */
/*                              PLANET POSITIONS                              */
/* -------------------------------------------------------------------------- */

function getPlanetLongitude(
  planet: string,
  date: Date
): number {
  switch (planet) {
    case 'Sun':
     return Astronomy.EclipticLongitude(
  Astronomy.Body.Sun,
  date
);

    case 'Moon':
      return Astronomy.EclipticLongitude(
  Astronomy.Body.Moon,
  date
);

    default:
     return Astronomy.EclipticLongitude(
  Astronomy.Body[planet as keyof typeof Astronomy.Body],
  date
);
  }
}

function buildPlanet(
  name: string,
  date: Date,
  ascDeg: number
): PlanetPosition {
  const absoluteDegree = normalizeDeg(
    getPlanetLongitude(name, date)
  );

  const sign = getSign(absoluteDegree);

  return {
    name,
    sign: sign.name,
    symbol: PLANET_SYMBOLS[name],
    degree: Number(getDegreeInSign(absoluteDegree).toFixed(2)),
    absoluteDegree: Number(absoluteDegree.toFixed(2)),
    house: houseFromPlanet(absoluteDegree, ascDeg),
    retrograde: false,
  };
}

/* -------------------------------------------------------------------------- */
/*                                ASCENDANT MC                                */
/* -------------------------------------------------------------------------- */

function getAscendant(date: Date): number {
  const sidereal = Astronomy.SiderealTime(date);
  return normalizeDeg(sidereal * 15);
}

function getMidheaven(ascDeg: number): number {
  return normalizeDeg(ascDeg + 90);
}

/* -------------------------------------------------------------------------- */
/*                                  ASPECTS                                   */
/* -------------------------------------------------------------------------- */

function calculateAspects(
  planets: PlanetPosition[]
): Aspect[] {
  const results: Aspect[] = [];

  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const p1 = planets[i];
      const p2 = planets[j];

      const diff = angleDistance(
        p1.absoluteDegree,
        p2.absoluteDegree
      );

      for (const asp of ASPECTS) {
        const orb = Math.abs(diff - asp.angle);

        if (orb <= 6) {
          results.push({
            planet1: p1.name,
            planet2: p2.name,
            type: asp.type as Aspect['type'],
            orb: Number(orb.toFixed(2)),
          });
          break;
        }
      }
    }
  }

  return results;
}

/* -------------------------------------------------------------------------- */
/*                                MAIN EXPORT                                 */
/* -------------------------------------------------------------------------- */

export function calculateChart(
  birth: BirthData
): ChartData {
  const localDate = new Date(
    `${birth.date}T${birth.time}:00`
  );

  const ascDeg = getAscendant(localDate);
  const mcDeg = getMidheaven(ascDeg);

  const planets = PLANETS.map((planet) =>
    buildPlanet(planet, localDate, ascDeg)
  );

  const aspects = calculateAspects(planets);
  const houses = Array.from({ length: 12 }, (_, i) => {
  const deg = (ascDeg + i * 30) % 360;

  return {
    number: i + 1,
    sign: getSign(deg).name,
    degree: Number(getDegreeInSign(deg).toFixed(2)),
    absoluteDegree: Number(deg.toFixed(2)),
  };
});

  return {
  planets,
  aspects,
  houses,

    ascendant: {
  sign: getSign(ascDeg).name,
  degree: Number(getDegreeInSign(ascDeg).toFixed(2)),
  absoluteDegree: Number(ascDeg.toFixed(2)),
},

    midheaven: {
  sign: getSign(mcDeg).name,
  degree: Number(getDegreeInSign(mcDeg).toFixed(2)),
  absoluteDegree: Number(mcDeg.toFixed(2)),
},
  };
}