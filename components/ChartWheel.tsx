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
  conjunction: { stroke: "#f0d78a", width: 1.5, opacity: 0.9 },
  opposition: { stroke: "#e8a0c8", width: 1.3, dash: "6 4", opacity: 0.85 },
  trine: { stroke: "#7dd4b8", width: 1.3, dash: "2 5", opacity: 0.88 },
  square: { stroke: "#f0a0a8", width: 1.4, dash: "1 3", opacity: 0.9 },
  sextile: { stroke: "#a8c4f0", width: 1.2, dash: "4 4", opacity: 0.82 },
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

/**
 * Spread planet labels apart so they don't overlap.
 * Takes an array of wheel-degrees and returns nudged degrees
 * with at least `minGap` between consecutive labels.
 */
function spreadPlanets(
  planets: { name: string; wheelDeg: number }[],
  minGap = 10
): Map<string, number> {
  const sorted = [...planets].sort((a, b) => a.wheelDeg - b.wheelDeg);
  const nudged = sorted.map((p) => ({ ...p, nudgedDeg: p.wheelDeg }));

  // Two passes to push apart clusters
  for (let pass = 0; pass < 3; pass++) {
    for (let i = 1; i < nudged.length; i++) {
      const diff = nudged[i].nudgedDeg - nudged[i - 1].nudgedDeg;
      if (diff < minGap && diff >= 0) {
        const push = (minGap - diff) / 2 + 0.5;
        nudged[i].nudgedDeg += push;
        nudged[i - 1].nudgedDeg -= push;
      }
    }
    // Wrap-around check (last vs first across 360°)
    if (nudged.length > 1) {
      const last = nudged[nudged.length - 1];
      const first = nudged[0];
      const wrapDiff = (first.nudgedDeg + 360) - last.nudgedDeg;
      if (wrapDiff < minGap) {
        const push = (minGap - wrapDiff) / 2 + 0.5;
        last.nudgedDeg -= push;
        first.nudgedDeg += push;
      }
    }
  }

  const map = new Map<string, number>();
  for (const p of nudged) map.set(p.name, p.nudgedDeg);
  return map;
}

interface Props {
  chart: ChartData;
}

export default function ChartWheel({ chart }: Props) {
  /* ── Increased size for clarity ── */
  const SIZE = 680;
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  const R_OUTER     = 310;
  const R_TICK_OUT  = 303;
  const R_TICK_IN   = 286;
  const R_ZODIAC_IN = 262;
  const R_HOUSE     = 248;
  const R_PLANET    = 208;
  const R_ASPECT    = 118;

  const ascDeg =
  chart?.ascendant?.absoluteDegree ??
  chart?.ascendant?.degree ??
  0;

const ascSignIdx = Math.floor(ascDeg / 30);

const mcDeg =
  chart?.midheaven?.absoluteDegree ??
  chart?.midheaven?.degree ??
  0;

const icDeg =
  chart?.imumCoeli?.absoluteDegree ??
  chart?.imumCoeli?.degree ??
  0;

const dcDeg =
  chart?.descendant?.absoluteDegree ??
  chart?.descendant?.degree ??
  0;

const mcWheel = eclipticToWheel(mcDeg, ascDeg);
const icWheel = eclipticToWheel(icDeg, ascDeg);
const dcWheel = eclipticToWheel(dcDeg, ascDeg);

  /* ── Spread planets to avoid overlapping glyphs ── */
  const planetWheelDeg = chart.planets.map((p) => ({
    name: p.name,
    wheelDeg: eclipticToWheel(p.absoluteDegree, ascDeg),
  }));
  const nudgedPositions = spreadPlanets(planetWheelDeg, 11);

  return (
    <div className="w-full max-w-[680px] mx-auto">
      <p className="text-center text-[11px] tracking-[0.18em] uppercase text-white/35 mb-3">
        Tropical · Equal houses from Asc · High-precision ephemeris
      </p>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full drop-shadow-[0_0_36px_rgba(107,47,212,0.25)]"
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
          {/* Subtle glow behind planet badges */}
          <filter id="planet-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle cx={cx} cy={cy} r={R_OUTER + 18} fill="url(#cw-bg)" />

        {/* Outer glow ring */}
        <circle
          cx={cx} cy={cy} r={R_OUTER + 2}
          fill="none"
          stroke="rgba(139,92,246,0.12)"
          strokeWidth={2}
        />

        {/* ── Zodiac segments + glyphs ── */}
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
                fontSize={19}
                fill={color}
                fillOpacity={0.92}
                style={{ fontFamily: "Georgia, serif" }}
              >
                {SIGN_SYMBOLS[signIdx]}
              </text>
            </g>
          );
        })}

        {/* ── 5° ticks on outer rim ── */}
        {Array.from({ length: 72 }).map((_, i) => {
          const a = i * 5;
          const major = i % 6 === 0;
          const pOut = polar(cx, cy, R_TICK_OUT, a);
          const pIn = polar(cx, cy, major ? R_TICK_IN - 5 : R_TICK_IN, a);
          return (
            <line
              key={`tk-${i}`}
              x1={pIn.x}
              y1={pIn.y}
              x2={pOut.x}
              y2={pOut.y}
              stroke={major ? "rgba(240,184,120,0.45)" : "rgba(255,255,255,0.12)"}
              strokeWidth={major ? 1.2 : 0.5}
            />
          );
        })}

        {/* ── House lines ── */}
        {chart.houses.map((house, i) => {
          const deg = eclipticToWheel(house.absoluteDegree, ascDeg);
          const inner = polar(cx, cy, R_ASPECT - 14, deg);
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
              strokeWidth={isAngle ? 1.5 : 0.6}
              strokeDasharray={isAngle ? undefined : "2 5"}
            />
          );
        })}

        {/* ── House numbers ── */}
        {chart.houses.map((house, i) => {
          const next = chart.houses[(i + 1) % 12].absoluteDegree;
          let mid = (house.absoluteDegree + next) / 2;
          if (next < house.absoluteDegree) {
            mid = (house.absoluteDegree + next + 360) / 2;
          }
          const wheelMid = eclipticToWheel(mid, ascDeg);
          const pt = polar(cx, cy, R_HOUSE - 24, wheelMid);

          return (
            <text
              key={`hn-${i}`}
              x={pt.x}
              y={pt.y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize={12}
              fill="#ffffff"
              fillOpacity={0.35}
              fontWeight={600}
            >
              {house.number}
            </text>
          );
        })}

        {/* ── AC / DC / MC / IC axis labels ── */}
        {[
          { label: "AC", deg: 180, desc: "Ascendant (eastern horizon)" },
          { label: "DC", deg: dcWheel, desc: "Descendant (western horizon)" },
          { label: "MC", deg: mcWheel, desc: "Midheaven (meridian south)" },
          { label: "IC", deg: icWheel, desc: "Imum Coeli (meridian north)" },
        ].map(({ label, deg, desc }) => {
          const inner = polar(cx, cy, R_ASPECT - 14, deg);
          const outer = polar(cx, cy, R_OUTER - 4, deg);
          const labelPt = polar(cx, cy, R_OUTER - 22, deg);
          return (
            <g key={label}>
              <line
                x1={inner.x}
                y1={inner.y}
                x2={outer.x}
                y2={outer.y}
                stroke="rgba(240,200,140,0.35)"
                strokeWidth={label === "AC" || label === "MC" ? 1.8 : 1}
                strokeDasharray={label === "AC" || label === "MC" ? undefined : "3 4"}
              />
              <title>{`${label}: ${desc}`}</title>
              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={11}
                fill="rgba(240,200,140,0.9)"
                fontWeight={700}
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* ── Aspect lines inside inner circle ── */}
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

        {/* Inner circle background */}
        <circle
          cx={cx}
          cy={cy}
          r={R_ASPECT - 14}
          fill="#07060c"
          stroke="rgba(240,200,140,0.22)"
          strokeWidth={0.85}
        />

        {/* ── Planet glyphs on ecliptic band (with collision spreading) ── */}
        {chart.planets.map((planet) => {
          const realDeg = eclipticToWheel(planet.absoluteDegree, ascDeg);
          const nudgedDeg = nudgedPositions.get(planet.name) ?? realDeg;

          const pt = polar(cx, cy, R_PLANET, nudgedDeg);
          const g = signGlyphForLongitude(planet.absoluteDegree);
          const degStr = planet.degree.toFixed(1).replace(/\.0$/, "");

          /* Thin line from actual ecliptic position to nudged glyph (when spread) */
          const tickPt = polar(cx, cy, R_ZODIAC_IN - 2, realDeg);
          const glyphEdge = polar(cx, cy, R_PLANET + 17, nudgedDeg);
          const showTick = Math.abs(nudgedDeg - realDeg) > 1.5;

          return (
            <g key={planet.name}>
              {/* Tick mark at real ecliptic position */}
              <line
                x1={polar(cx, cy, R_ZODIAC_IN - 2, realDeg).x}
                y1={polar(cx, cy, R_ZODIAC_IN - 2, realDeg).y}
                x2={polar(cx, cy, R_ZODIAC_IN - 10, realDeg).x}
                y2={polar(cx, cy, R_ZODIAC_IN - 10, realDeg).y}
                stroke={planet.retrograde ? "#f0a0b8" : "rgba(240,200,140,0.5)"}
                strokeWidth={1}
              />
              {/* Connector line when glyph is nudged away from real position */}
              {showTick && (
                <line
                  x1={tickPt.x}
                  y1={tickPt.y}
                  x2={glyphEdge.x}
                  y2={glyphEdge.y}
                  stroke="rgba(255,255,255,0.08)"
                  strokeWidth={0.6}
                />
              )}
              {/* Planet badge background */}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={17}
                fill="#0c0a14"
                stroke={planet.retrograde ? "rgba(240,160,184,0.45)" : "rgba(240,200,140,0.35)"}
                strokeWidth={0.7}
              />
              {/* Planet symbol */}
              <text
                x={pt.x}
                y={pt.y - 3.5}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={16}
                fill={planet.retrograde ? "#f0a0b8" : "#f5ead0"}
                style={{ fontFamily: "Georgia, serif" }}
              >
                {PLANET_SYMBOLS[planet.name] ?? planet.name[0]}
              </text>
              {/* Retrograde marker */}
              {planet.retrograde && (
                <text
                  x={pt.x + 11}
                  y={pt.y - 11}
                  fontSize={8}
                  fill="#f0a0b8"
                  fillOpacity={0.95}
                >
                  ℞
                </text>
              )}
              {/* Degree + sign glyph below planet symbol */}
              <text
                x={pt.x}
                y={pt.y + 11}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={8.5}
                fill="rgba(232,228,240,0.6)"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                {`${degStr}° ${g}`}
              </text>
              <title>{`${planet.name} ${planet.degree.toFixed(2)}° ${planet.sign}${planet.retrograde ? " retrograde" : ""} · house ${planet.house}`}</title>
            </g>
          );
        })}

        {/* ── Aspect legend ── */}
        <g transform={`translate(${cx - 140}, ${SIZE - 42})`}>
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
            const x = idx * 57;
            return (
              <g key={key} transform={`translate(${x},0)`}>
                <line
                  x1={0}
                  y1={-5}
                  x2={26}
                  y2={-5}
                  stroke={st.stroke}
                  strokeOpacity={st.opacity}
                  strokeWidth={st.width}
                  strokeDasharray={st.dash}
                  strokeLinecap="round"
                />
                <text
                  x={30}
                  y={-1}
                  fontSize={11}
                  fill="rgba(232,228,240,0.5)"
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

      {/* ── Placement summary table below the chart ── */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-[12px] text-white/50 max-w-[520px] mx-auto">
        {chart.planets.map((p) => (
          <div key={p.name} className="flex items-center gap-2">
            <span className="text-[15px]" style={{ color: p.retrograde ? "#f0a0b8" : "#f5ead0", fontFamily: "Georgia, serif" }}>
              {PLANET_SYMBOLS[p.name] ?? p.name[0]}
            </span>
            <span className="text-white/70 font-medium">{p.name}</span>
            <span className="ml-auto tabular-nums">
              {p.sign} {p.degree.toFixed(1)}°
              {p.retrograde && <span className="text-[#f0a0b8] ml-1">℞</span>}
            </span>
          </div>
        ))}
        {/* Ascendant + Midheaven */}
        <div className="flex items-center gap-2">
          <span className="text-[15px] text-amber-300/80" style={{ fontFamily: "Georgia, serif" }}>↑</span>
          <span className="text-white/70 font-medium">Ascendant</span>
          <span className="ml-auto tabular-nums">{chart.ascendant.sign} {chart.ascendant.degree.toFixed(1)}°</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[15px] text-amber-300/80" style={{ fontFamily: "Georgia, serif" }}>MC</span>
          <span className="text-white/70 font-medium">Midheaven</span>
          <span className="ml-auto tabular-nums">{chart.midheaven.sign} {chart.midheaven.degree.toFixed(1)}°</span>
        </div>
      </div>
    </div>
  );
}