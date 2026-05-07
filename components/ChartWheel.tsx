'use client';

import type { ChartData } from '@/lib/types';

const SIGNS = [
  'Aries','Taurus','Gemini','Cancer','Leo','Virgo',
  'Libra','Scorpio','Sagittarius','Capricorn','Aquarius','Pisces'
];

const SIGN_SYMBOLS = ['♈','♉','♊','♋','♌','♍','♎','♏','♐','♑','♒','♓'];

const SIGN_COLORS: Record<string, string> = {
  Fire: '#e8855a',
  Earth: '#8faa6f',
  Air: '#8ab4d4',
  Water: '#7a8fd4',
};

const ELEMENT: Record<string, string> = {
  Aries:'Fire', Taurus:'Earth', Gemini:'Air', Cancer:'Water',
  Leo:'Fire', Virgo:'Earth', Libra:'Air', Scorpio:'Water',
  Sagittarius:'Fire', Capricorn:'Earth', Aquarius:'Air', Pisces:'Water',
};

const PLANET_SYMBOLS: Record<string, string> = {
  Sun:'☉', Moon:'☽', Mercury:'☿', Venus:'♀', Mars:'♂',
  Jupiter:'♃', Saturn:'♄', Uranus:'♅', Neptune:'♆', Pluto:'♇',
};

const ASPECT_COLORS: Record<string, string> = {
  conjunction: '#bf9660',
  opposition: '#c45c5c',
  trine: '#5c9c6c',
  square: '#c45c5c',
  sextile: '#5c8cbc',
};

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

function eclipticToWheel(absoluteDeg: number, ascDeg: number): number {
  return ((absoluteDeg - ascDeg + 180) % 360 + 360) % 360;
}

interface Props {
  chart: ChartData;
}

export default function ChartWheel({ chart }: Props) {
  const SIZE = 500;
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  const R_OUTER = 220;
  const R_ZODIAC_IN = 185;
  const R_HOUSE = 175;
  const R_PLANET = 145;
  const R_ASPECT = 80;

  const ascDeg = chart.ascendant.absoluteDegree;
  const ascSignIdx = Math.floor(ascDeg / 30);

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full max-w-[480px] mx-auto"
      aria-label="Birth chart wheel"
    >
      {/* Background */}
      <circle cx={cx} cy={cy} r={R_OUTER + 10} fill="#09090f" />

      {/* Zodiac Segments */}
      {Array.from({ length: 12 }).map((_, i) => {
        const signIdx = (ascSignIdx + i) % 12;
        const signName = SIGNS[signIdx];
        const color = SIGN_COLORS[ELEMENT[signName]] ?? '#888';

        const startDeg = i * 30;
        const endDeg = startDeg + 30;

        const startOuter = polar(cx, cy, R_OUTER, startDeg);
        const endOuter = polar(cx, cy, R_OUTER, endDeg);
        const startInner = polar(cx, cy, R_ZODIAC_IN, startDeg);
        const endInner = polar(cx, cy, R_ZODIAC_IN, endDeg);

        const midDeg = startDeg + 15;
        const symPt = polar(cx, cy, (R_ZODIAC_IN + R_OUTER) / 2, midDeg);

        return (
          <g key={i}>
            <path
              d={`M ${startOuter.x} ${startOuter.y}
                  A ${R_OUTER} ${R_OUTER} 0 0 1 ${endOuter.x} ${endOuter.y}
                  L ${endInner.x} ${endInner.y}
                  A ${R_ZODIAC_IN} ${R_ZODIAC_IN} 0 0 0 ${startInner.x} ${startInner.y}
                  Z`}
              fill={color}
              fillOpacity={0.12}
              stroke={color}
              strokeOpacity={0.3}
              strokeWidth={0.5}
            />

            <text
              x={symPt.x}
              y={symPt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={13}
              fill={color}
              fillOpacity={0.8}
            >
              {SIGN_SYMBOLS[signIdx]}
            </text>
          </g>
        );
      })}

      {/* House Lines */}
      {chart.houses.map((house, i) => {
        const deg = eclipticToWheel(house.absoluteDegree, ascDeg);
        const inner = polar(cx, cy, R_ASPECT - 10, deg);
        const outer = polar(cx, cy, R_ZODIAC_IN, deg);

        const isAngle = [1, 4, 7, 10].includes(house.number);

        return (
          <line
            key={i}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke={isAngle ? '#bf9660' : '#ffffff'}
            strokeOpacity={isAngle ? 0.5 : 0.12}
            strokeWidth={isAngle ? 1.5 : 0.5}
          />
        );
      })}

      {/* House Numbers */}
      {chart.houses.map((house, i) => {
        const next = chart.houses[(i + 1) % 12].absoluteDegree;

        let mid = (house.absoluteDegree + next) / 2;
        if (next < house.absoluteDegree) {
          mid = (house.absoluteDegree + next + 360) / 2;
        }

        const wheelMid = eclipticToWheel(mid, ascDeg);
        const pt = polar(cx, cy, R_HOUSE - 18, wheelMid);

        return (
          <text
            key={i}
            x={pt.x}
            y={pt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={9}
            fill="#ffffff"
            fillOpacity={0.25}
          >
            {house.number}
          </text>
        );
      })}

      {/* Aspects */}
      {chart.aspects.slice(0, 18).map((asp, i) => {
        const p1 = chart.planets.find(p => p.name === asp.planet1);
        const p2 = chart.planets.find(p => p.name === asp.planet2);
        if (!p1 || !p2) return null;

        const w1 = eclipticToWheel(p1.absoluteDegree, ascDeg);
        const w2 = eclipticToWheel(p2.absoluteDegree, ascDeg);

        const pt1 = polar(cx, cy, R_ASPECT, w1);
        const pt2 = polar(cx, cy, R_ASPECT, w2);

        const color = ASPECT_COLORS[asp.type] ?? '#888';
        const dashed = asp.type === 'sextile' || asp.type === 'trine';

        return (
          <line
            key={i}
            x1={pt1.x}
            y1={pt1.y}
            x2={pt2.x}
            y2={pt2.y}
            stroke={color}
            strokeOpacity={0.35}
            strokeWidth={0.8}
            strokeDasharray={dashed ? '4 3' : undefined}
          />
        );
      })}

      {/* Inner Circle */}
      <circle
        cx={cx}
        cy={cy}
        r={R_ASPECT - 10}
        fill="#09090f"
        stroke="#bf9660"
        strokeOpacity={0.2}
        strokeWidth={0.5}
      />

      {/* Planets */}
      {chart.planets.map((planet) => {
        const deg = eclipticToWheel(planet.absoluteDegree, ascDeg);
        const pt = polar(cx, cy, R_PLANET, deg);

        return (
          <g key={planet.name}>
            <circle cx={pt.x} cy={pt.y} r={10} fill="#09090f" fillOpacity={0.8} />

            <text
              x={pt.x}
              y={pt.y - 1}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={12}
              fill={planet.retrograde ? '#c47070' : '#e8d5b0'}
            >
              {PLANET_SYMBOLS[planet.name] ?? planet.name[0]}
            </text>

            {planet.retrograde && (
              <text
                x={pt.x + 7}
                y={pt.y - 7}
                fontSize={7}
                fill="#c47070"
                fillOpacity={0.8}
              >
                ℞
              </text>
            )}
          </g>
        );
      })}

      {/* AC / MC */}
      {[
        { label: 'AC', deg: 0 },
        { label: 'DC', deg: 180 },
        { label: 'MC', deg: eclipticToWheel(chart.midheaven.absoluteDegree, ascDeg) },
        { label: 'IC', deg: eclipticToWheel((chart.midheaven.absoluteDegree + 180) % 360, ascDeg) },
      ].map(({ label, deg }) => {
        const pt = polar(cx, cy, R_ZODIAC_IN - 12, deg);

        return (
          <text
            key={label}
            x={pt.x}
            y={pt.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize={8}
            fill="#bf9660"
            fillOpacity={0.7}
            fontWeight="600"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}