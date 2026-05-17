"use client";

import type { ChartData } from "@/lib/types";

const SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

const SIGN_SYMBOLS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

const SIGN_COLORS: Record<string, string> = {
  Fire: "#e8a090",
  Earth: "#9bc88a",
  Air: "#8ec5e8",
  Water: "#8aa8e8",
};

const ELEMENT: Record<string, string> = {
  Aries: "Fire", Taurus: "Earth", Gemini: "Air", Cancer: "Water",
  Leo: "Fire", Virgo: "Earth", Libra: "Air", Scorpio: "Water",
  Sagittarius: "Fire", Capricorn: "Earth", Aquarius: "Air", Pisces: "Water",
};

const PLANET_SYMBOLS: Record<string, string> = {
  Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂",
  Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇",
};

/** Pastel aspect strokes (clear pattern in dark UI). */
const ASPECT_STYLE: Record<string, { stroke: string; width: number; dash?: string; opacity: number }> = {
  conjunction: { stroke: "#f0d78a", width: 1.35, opacity: 0.9 },
  opposition: { stroke: "#e8a0c8", width: 1.15, dash: "6 4", opacity: 0.85 },
  trine: { stroke: "#7dd4b8", width: 1.15, dash: "2 5", opacity: 0.88 },
  square: { stroke: "#f0a0a8", width: 1.25, dash: "1 3", opacity: 0.9 },
  sextile: { stroke: "#a8c4f0", width: 1.05, dash: "4 4", opacity: 0.82 },
};

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

/** Rotate ecliptic longitude so Ascendant sits at wheel angle 180° (left / ninth‑house convention). */
function eclipticToWheel(absoluteDeg: number, ascDeg: number): number {
  return ((absoluteDeg - ascDeg + 180) % 360 + 360) % 360;
}

function signGlyphForLongitude(absDeg: number): string {
  const idx = Math.floor(((absDeg % 360) + 360) % 360 / 30);
  return SIGN_SYMBOLS[idx] ?? "·";
}

interface Props {
  chart: ChartData;
}

export default function ChartWheel({ chart }: Props) {
  const SIZE = 520;
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  const R_OUTER = 238;
  const R_TICK_OUT = 232;
  const R_TICK_IN = 218;
  const R_ZODIAC_IN = 200;
  const R_HOUSE = 188;
  const R_PLANET = 158;
  const R_ASPECT = 92;

  const ascDeg = chart.ascendant.absoluteDegree;
  const ascSignIdx = Math.floor(ascDeg / 30);

  const mcWheel = eclipticToWheel(chart.midheaven.absoluteDegree, ascDeg);
  const icWheel = eclipticToWheel(chart.imumCoeli.absoluteDegree, ascDeg);
  const dcWheel = eclipticToWheel(chart.descendant.absoluteDegree, ascDeg);

  return (
    <div className="w-full max-w-[520px] mx-auto">
      <p className="text-center text-[11px] tracking-[0.18em] uppercase text-white/35 mb-2">
        Tropical · Equal houses from Asc · High-precision ephemeris (Astronomy Engine)
      </p>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full drop-shadow-[0_0_28px_rgba(107,47,212,0.22)]"
        role="img"
        aria-label="Birth chart wheel: zodiac ring, twelve equal houses, planet glyphs on the ecliptic, and aspect lines in the centre."
      >
        <title>Natal chart wheel</title>

        <defs>
          <radialGradient id="cw-bg" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#15101f" />
            <stop offset="55%" stopColor="#0a0812" />
            <stop offset="100%" stopColor="#050308" />
          </radialGradient>
        </defs>

        <circle cx={cx} cy={cy} r={R_OUTER + 14} fill="url(#cw-bg)" />

        {/* Zodiac segments + glyphs */}
        {Array.from({ length: 12 }).map((_, i) => {
          const signIdx = (ascSignIdx + i) % 12;
          const signName = SIGNS[signIdx];
          const color = SIGN_COLORS[ELEMENT[signName]] ?? "#888";

          const startDeg = i * 30;
          const endDeg = startDeg + 30;

          const startOuter = polar(cx, cy, R_OUTER, startDeg);
          const endOuter = polar(cx, cy, R_OUTER, endDeg);
          const startInner = polar(cx, cy, R_ZODIAC_IN, startDeg);
          const endInner = polar(cx, cy, R_ZODIAC_IN, endDeg);

          const midDeg = startDeg + 15;
          const symPt = polar(cx, cy, (R_ZODIAC_IN + R_OUTER) / 2, midDeg);

          return (
            <g key={`z-${i}`}>
              <path
                d={`M ${startOuter.x} ${startOuter.y}
                    A ${R_OUTER} ${R_OUTER} 0 0 1 ${endOuter.x} ${endOuter.y}
                    L ${endInner.x} ${endInner.y}
                    A ${R_ZODIAC_IN} ${R_ZODIAC_IN} 0 0 0 ${startInner.x} ${startInner.y}
                    Z`}
                fill={color}
                fillOpacity={0.14}
                stroke={color}
                strokeOpacity={0.45}
                strokeWidth={0.75}
              />
              <line
                x1={startInner.x}
                y1={startInner.y}
                x2={startOuter.x}
                y2={startOuter.y}
                stroke={color}
                strokeOpacity={0.35}
                strokeWidth={0.6}
              />
              <text
                x={symPt.x}
                y={symPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={15}
                fill={color}
                fillOpacity={0.92}
                style={{ fontFamily: "Georgia, serif" }}
              >
                {SIGN_SYMBOLS[signIdx]}
              </text>
            </g>
          );
        })}

        {/* 5° ticks on outer rim */}
        {Array.from({ length: 72 }).map((_, i) => {
          const a = i * 5;
          const major = i % 6 === 0;
          const pOut = polar(cx, cy, R_TICK_OUT, a);
          const pIn = polar(cx, cy, major ? R_TICK_IN - 4 : R_TICK_IN, a);
          return (
            <line
              key={`tk-${i}`}
              x1={pIn.x}
              y1={pIn.y}
              x2={pOut.x}
              y2={pOut.y}
              stroke={major ? "rgba(240,184,120,0.45)" : "rgba(255,255,255,0.12)"}
              strokeWidth={major ? 1.1 : 0.45}
            />
          );
        })}

        {/* House lines */}
        {chart.houses.map((house, i) => {
          const deg = eclipticToWheel(house.absoluteDegree, ascDeg);
          const inner = polar(cx, cy, R_ASPECT - 12, deg);
          const outer = polar(cx, cy, R_ZODIAC_IN, deg);
          const isAngle = [1, 4, 7, 10].includes(house.number);

          return (
            <line
              key={`h-${i}`}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
              stroke={isAngle ? "rgba(240,200,140,0.55)" : "rgba(255,255,255,0.14)"}
              strokeOpacity={1}
              strokeWidth={isAngle ? 1.35 : 0.55}
              strokeDasharray={isAngle ? undefined : "2 5"}
            />
          );
        })}

        {/* House numbers */}
        {chart.houses.map((house, i) => {
          const next = chart.houses[(i + 1) % 12].absoluteDegree;
          let mid = (house.absoluteDegree + next) / 2;
          if (next < house.absoluteDegree) {
            mid = (house.absoluteDegree + next + 360) / 2;
          }
          const wheelMid = eclipticToWheel(mid, ascDeg);
          const pt = polar(cx, cy, R_HOUSE - 20, wheelMid);

          return (
            <text
              key={`hn-${i}`}
              x={pt.x}
              y={pt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={10}
              fill="#ffffff"
              fillOpacity={0.32}
              fontWeight={600}
            >
              {house.number}
            </text>
          );
        })}

        {/* AC / DC / MC / IC radial guides */}
        {[
          { label: "AC", deg: 180, desc: "Ascendant (eastern horizon)" },
          { label: "DC", deg: dcWheel, desc: "Descendant (western horizon)" },
          { label: "MC", deg: mcWheel, desc: "Midheaven (meridian south)" },
          { label: "IC", deg: icWheel, desc: "Imum Coeli (meridian north)" },
        ].map(({ label, deg, desc }) => {
          const inner = polar(cx, cy, R_ASPECT - 12, deg);
          const outer = polar(cx, cy, R_OUTER - 4, deg);
          const labelPt = polar(cx, cy, R_OUTER - 18, deg);
          return (
            <g key={label}>
              <line
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="rgba(240,200,140,0.35)"
                strokeWidth={label === "AC" || label === "MC" ? 1.5 : 0.9}
                strokeDasharray={label === "AC" || label === "MC" ? undefined : "3 4"}
              />
              <title>{`${label}: ${desc}`}</title>
              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={9}
                fill="rgba(240,200,140,0.85)"
                fontWeight={700}
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Aspects inside inner circle */}
        {chart.aspects.map((asp, i) => {
          const p1 = chart.planets.find((p) => p.name === asp.planet1);
          const p2 = chart.planets.find((p) => p.name === asp.planet2);
          if (!p1 || !p2) return null;

          const w1 = eclipticToWheel(p1.absoluteDegree, ascDeg);
          const w2 = eclipticToWheel(p2.absoluteDegree, ascDeg);

          const pt1 = polar(cx, cy, R_ASPECT, w1);
          const pt2 = polar(cx, cy, R_ASPECT, w2);

          const st = ASPECT_STYLE[asp.type] ?? {
            stroke: "#aaa",
            width: 0.8,
            opacity: 0.5,
          };

          return (
            <line
              key={`asp-${i}-${asp.planet1}-${asp.planet2}`}
              x1={pt1.x}
              y1={pt1.y}
              x2={pt2.x}
              y2={pt2.y}
              stroke={st.stroke}
              strokeOpacity={st.opacity}
              strokeWidth={st.width}
              strokeDasharray={st.dash}
              strokeLinecap="round"
            >
              <title>{`${asp.planet1} ${asp.type} ${asp.planet2} (orb ${asp.orb}°)`}</title>
            </line>
          );
        })}

        <circle
          cx={cx}
          cy={cy}
          r={R_ASPECT - 12}
          fill="#07060c"
          stroke="rgba(240,200,140,0.22)"
          strokeWidth={0.75}
        />

        {/* Planets on ecliptic band */}
        {chart.planets.map((planet) => {
          const deg = eclipticToWheel(planet.absoluteDegree, ascDeg);
          const pt = polar(cx, cy, R_PLANET, deg);
          const g = signGlyphForLongitude(planet.absoluteDegree);
          const degStr = planet.degree.toFixed(1).replace(/\.0$/, "");

          return (
            <g key={planet.name}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={14}
                fill="#0c0a14"
                stroke="rgba(240,200,140,0.35)"
                strokeWidth={0.6}
              />
              <text
                x={pt.x}
                y={pt.y - 3}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={13}
                fill={planet.retrograde ? "#f0a0b8" : "#f5ead0"}
                style={{ fontFamily: "Georgia, serif" }}
              >
                {PLANET_SYMBOLS[planet.name] ?? planet.name[0]}
              </text>
              {planet.retrograde && (
                <text
                  x={pt.x + 9}
                  y={pt.y - 9}
                  fontSize={7}
                  fill="#f0a0b8"
                  fillOpacity={0.95}
                >
                  ℞
                </text>
              )}
              <text
                x={pt.x}
                y={pt.y + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={7.5}
                fill="rgba(232,228,240,0.55)"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                {`${degStr}° ${g}`}
              </text>
              <title>{`${planet.name} ${planet.degree.toFixed(2)}° ${planet.sign}${planet.retrograde ? " retrograde" : ""} · house ${planet.house}`}</title>
            </g>
          );
        })}

        {/* Aspect legend */}
        <g transform={`translate(${cx - 118}, ${SIZE - 36})`}>
          {(
            [
              ["☌", "conjunction", "Conjunction"],
              ["⚹", "sextile", "Sextile"],
              ["□", "square", "Square"],
              ["△", "trine", "Trine"],
              ["☍", "opposition", "Opposition"],
            ] as const
          ).map(([sym, key, name], idx) => {
            const st = ASPECT_STYLE[key];
            const x = idx * 48;
            return (
              <g key={key} transform={`translate(${x},0)`}>
                <line
                  x1={0}
                  y1={-5}
                  x2={22}
                  y2={-5}
                  stroke={st.stroke}
                  strokeOpacity={st.opacity}
                  strokeWidth={st.width}
                  strokeDasharray={st.dash}
                  strokeLinecap="round"
                />
                <text
                  x={26}
                  y={-2}
                  fontSize={9}
                  fill="rgba(232,228,240,0.45)"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  {sym}
                </text>
                <title>{name}</title>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
