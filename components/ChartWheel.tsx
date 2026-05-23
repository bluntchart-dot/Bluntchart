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

/**
 * Professional aspect colors:
 *   Blue  = harmonious (trine, sextile)
 *   Red   = challenging (square, opposition)
 *   Green = conjunction (neutral/powerful)
 * Matches astro.com / astro-seek conventions.
 */
const ASPECT_STYLE: Record<string, { stroke: string; width: number; dash?: string }> = {
  conjunction: { stroke: "#8cc88c", width: 1.4 },
  opposition:  { stroke: "#e07070", width: 1.3, dash: "6 3" },
  trine:       { stroke: "#6090e0", width: 1.3 },
  square:      { stroke: "#e07070", width: 1.2, dash: "3 3" },
  sextile:     { stroke: "#6090e0", width: 1.1, dash: "5 3" },
};

/** Only show aspects tighter than this orb (degrees) */
const MAX_DISPLAY_ORB = 6;

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 90) * (Math.PI / 180);
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function eclipticToWheel(absoluteDeg: number, ascDeg: number): number {
  return ((absoluteDeg - ascDeg + 180) % 360 + 360) % 360;
}

function signGlyphForLongitude(absDeg: number): string {
  const idx = Math.floor(((absDeg % 360) + 360) % 360 / 30);
  return SIGN_SYMBOLS[idx] ?? "·";
}

function spreadPlanets(
  planets: { name: string; wheelDeg: number }[],
  minGap = 10
): Map<string, number> {
  const sorted = [...planets].sort((a, b) => a.wheelDeg - b.wheelDeg);
  const nudged = sorted.map((p) => ({ ...p, nudgedDeg: p.wheelDeg }));

  for (let pass = 0; pass < 3; pass++) {
    for (let i = 1; i < nudged.length; i++) {
      const diff = nudged[i].nudgedDeg - nudged[i - 1].nudgedDeg;
      if (diff < minGap && diff >= 0) {
        const push = (minGap - diff) / 2 + 0.5;
        nudged[i].nudgedDeg += push;
        nudged[i - 1].nudgedDeg -= push;
      }
    }
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
  /* ────────────────────────────────────────────────────────────────────────
     PROPORTIONS — modeled after astro.com / Swiss Ephemeris charts:
       Outer ring   (zodiac signs):   R_OUTER → R_ZODIAC_IN   (~14% of radius)
       Degree ticks:                  inside the zodiac ring
       Planet band:                   R_PLANET (between zodiac & inner circle)
       House area:                    R_INNER → R_ZODIAC_IN (house cusp lines)
       Aspect area:                   0 → R_INNER (lines cross through center)
       NO large black center circle — aspects span freely.
     ──────────────────────────────────────────────────────────────────────── */
  const SIZE = 680;
  const cx = SIZE / 2;
  const cy = SIZE / 2;

  const R_OUTER     = 310;                 // outermost edge
  const R_ZODIAC_IN = 268;                 // inner edge of zodiac ring (42px band)
  const R_TICK_OUT  = 266;                 // degree ticks outer
  const R_TICK_IN   = 254;                 // degree ticks inner
  const R_PLANET    = 228;                 // planet glyph placement
  const R_INNER     = 185;                 // inner circle — house lines stop here, aspect lines start here
  // No center fill circle — aspect lines cross through center

  const ascDeg = chart.ascendant.absoluteDegree;
  const ascSignIdx = Math.floor(ascDeg / 30);

  const mcWheel = eclipticToWheel(chart.midheaven.absoluteDegree, ascDeg);
  const icWheel = eclipticToWheel(chart.imumCoeli.absoluteDegree, ascDeg);
  const dcWheel = eclipticToWheel(chart.descendant.absoluteDegree, ascDeg);

  const planetWheelDeg = chart.planets.map((p) => ({
    name: p.name,
    wheelDeg: eclipticToWheel(p.absoluteDegree, ascDeg),
  }));
  const nudgedPositions = spreadPlanets(planetWheelDeg, 11);

  const visibleAspects = chart.aspects.filter((asp) => asp.orb <= MAX_DISPLAY_ORB);

  return (
    <div className="w-full max-w-[680px] mx-auto">
      <p className="text-center text-[11px] tracking-[0.18em] uppercase text-white/35 mb-3">
        Tropical · Equal houses from Asc · High-precision ephemeris
      </p>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full drop-shadow-[0_0_36px_rgba(107,47,212,0.25)]"
        role="img"
        aria-label="Birth chart wheel"
      >
        <title>Natal chart wheel</title>

        <defs>
          <radialGradient id="cw-bg" cx="50%" cy="45%" r="55%">
            <stop offset="0%" stopColor="#15101f" />
            <stop offset="55%" stopColor="#0a0812" />
            <stop offset="100%" stopColor="#050308" />
          </radialGradient>
        </defs>

        {/* Full background */}
        <circle cx={cx} cy={cy} r={R_OUTER + 18} fill="url(#cw-bg)" />
        <circle cx={cx} cy={cy} r={R_OUTER + 2} fill="none" stroke="rgba(139,92,246,0.12)" strokeWidth={2} />

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
                fill={color} fillOpacity={0.14}
                stroke={color} strokeOpacity={0.45} strokeWidth={0.75}
              />
              <line
                x1={startInner.x} y1={startInner.y}
                x2={startOuter.x} y2={startOuter.y}
                stroke={color} strokeOpacity={0.35} strokeWidth={0.6}
              />
              <text
                x={symPt.x} y={symPt.y}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={17} fill={color} fillOpacity={0.92}
                style={{ fontFamily: "Georgia, serif" }}
              >
                {SIGN_SYMBOLS[signIdx]}
              </text>
            </g>
          );
        })}

        {/* ── 5° ticks ── */}
        {Array.from({ length: 72 }).map((_, i) => {
          const a = i * 5;
          const major = i % 6 === 0;
          const pOut = polar(cx, cy, R_TICK_OUT, a);
          const pIn = polar(cx, cy, major ? R_TICK_IN - 4 : R_TICK_IN, a);
          return (
            <line key={`tk-${i}`}
              x1={pIn.x} y1={pIn.y} x2={pOut.x} y2={pOut.y}
              stroke={major ? "rgba(240,184,120,0.45)" : "rgba(255,255,255,0.12)"}
              strokeWidth={major ? 1 : 0.5}
            />
          );
        })}

        {/* ── Inner circle boundary (aspect area edge) ── */}
        <circle
          cx={cx} cy={cy} r={R_INNER}
          fill="none"
          stroke="rgba(240,200,140,0.2)"
          strokeWidth={0.8}
        />

        {/* ── House cusp lines (from inner circle to zodiac ring) ── */}
        {chart.houses.map((house, i) => {
          const deg = eclipticToWheel(house.absoluteDegree, ascDeg);
          const inner = polar(cx, cy, R_INNER, deg);
          const outer = polar(cx, cy, R_ZODIAC_IN, deg);
          const isAngle = [1, 4, 7, 10].includes(house.number);

          return (
            <line key={`h-${i}`}
              x1={inner.x} y1={inner.y}
              x2={outer.x} y2={outer.y}
              stroke={isAngle ? "rgba(240,200,140,0.5)" : "rgba(255,255,255,0.12)"}
              strokeWidth={isAngle ? 1.4 : 0.5}
              strokeDasharray={isAngle ? undefined : "2 4"}
            />
          );
        })}

        {/* ── House numbers (in the house area between inner circle and planet band) ── */}
        {chart.houses.map((house, i) => {
          const next = chart.houses[(i + 1) % 12].absoluteDegree;
          let mid = (house.absoluteDegree + next) / 2;
          if (next < house.absoluteDegree) mid = (house.absoluteDegree + next + 360) / 2;
          const wheelMid = eclipticToWheel(mid, ascDeg);
          const pt = polar(cx, cy, (R_INNER + R_PLANET) / 2 - 5, wheelMid);

          return (
            <text key={`hn-${i}`}
              x={pt.x} y={pt.y}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={11} fill="#ffffff" fillOpacity={0.25} fontWeight={600}
            >
              {house.number}
            </text>
          );
        })}

        {/* ── AC / DC / MC / IC axis lines (full length from center to outer) ── */}
        {[
          { label: "AC", deg: 180, bold: true },
          { label: "DC", deg: dcWheel, bold: false },
          { label: "MC", deg: mcWheel, bold: true },
          { label: "IC", deg: icWheel, bold: false },
        ].map(({ label, deg, bold }) => {
          const outer = polar(cx, cy, R_ZODIAC_IN, deg);
          const labelPt = polar(cx, cy, R_ZODIAC_IN + 16, deg);
          return (
            <g key={label}>
              {/* Axis line from center to outer */}
              <line
                x1={cx} y1={cy}
                x2={outer.x} y2={outer.y}
                stroke={bold ? "rgba(240,200,140,0.4)" : "rgba(240,200,140,0.2)"}
                strokeWidth={bold ? 1.6 : 0.8}
                strokeDasharray={bold ? undefined : "4 4"}
              />
              {/* Label outside zodiac ring */}
              <text
                x={labelPt.x} y={labelPt.y}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={10} fill="rgba(240,200,140,0.85)" fontWeight={700}
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* ── Aspect lines (span across the full inner circle) ── */}
        {visibleAspects.map((asp, i) => {
          const p1 = chart.planets.find((p) => p.name === asp.planet1);
          const p2 = chart.planets.find((p) => p.name === asp.planet2);
          if (!p1 || !p2) return null;

          const w1 = eclipticToWheel(p1.absoluteDegree, ascDeg);
          const w2 = eclipticToWheel(p2.absoluteDegree, ascDeg);
          const pt1 = polar(cx, cy, R_INNER, w1);
          const pt2 = polar(cx, cy, R_INNER, w2);

          const st = ASPECT_STYLE[asp.type] ?? { stroke: "#888", width: 0.8 };
          const orbFade = Math.max(0.5, 1 - asp.orb / (MAX_DISPLAY_ORB * 1.5));

          return (
            <line key={`asp-${i}-${asp.planet1}-${asp.planet2}`}
              x1={pt1.x} y1={pt1.y}
              x2={pt2.x} y2={pt2.y}
              stroke={st.stroke} strokeOpacity={orbFade}
              strokeWidth={st.width}
              strokeDasharray={st.dash}
              strokeLinecap="round"
            >
              <title>{`${asp.planet1} ${asp.type} ${asp.planet2} (orb ${asp.orb}°)`}</title>
            </line>
          );
        })}

        {/* ── Planet glyphs (in the band between zodiac ring and inner circle) ── */}
        {chart.planets.map((planet) => {
          const realDeg = eclipticToWheel(planet.absoluteDegree, ascDeg);
          const nudgedDeg = nudgedPositions.get(planet.name) ?? realDeg;
          const pt = polar(cx, cy, R_PLANET, nudgedDeg);
          const g = signGlyphForLongitude(planet.absoluteDegree);
          const degStr = planet.degree.toFixed(1).replace(/\.0$/, "");

          const tickPt = polar(cx, cy, R_ZODIAC_IN - 2, realDeg);
          const glyphEdge = polar(cx, cy, R_PLANET + 17, nudgedDeg);
          const showConnector = Math.abs(nudgedDeg - realDeg) > 1.5;

          return (
            <g key={planet.name}>
              {/* Tick at real ecliptic position on zodiac ring */}
              <line
                x1={polar(cx, cy, R_ZODIAC_IN - 1, realDeg).x}
                y1={polar(cx, cy, R_ZODIAC_IN - 1, realDeg).y}
                x2={polar(cx, cy, R_ZODIAC_IN - 8, realDeg).x}
                y2={polar(cx, cy, R_ZODIAC_IN - 8, realDeg).y}
                stroke={planet.retrograde ? "#f0a0b8" : "rgba(240,200,140,0.5)"}
                strokeWidth={1}
              />
              {/* Connector when nudged */}
              {showConnector && (
                <line
                  x1={tickPt.x} y1={tickPt.y}
                  x2={glyphEdge.x} y2={glyphEdge.y}
                  stroke="rgba(255,255,255,0.08)" strokeWidth={0.5}
                />
              )}
              {/* Planet badge */}
              <circle
                cx={pt.x} cy={pt.y} r={16}
                fill="#0c0a14" fillOpacity={0.85}
                stroke={planet.retrograde ? "rgba(240,160,184,0.4)" : "rgba(240,200,140,0.3)"}
                strokeWidth={0.6}
              />
              {/* Planet symbol */}
              <text
                x={pt.x} y={pt.y - 3}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={15}
                fill={planet.retrograde ? "#f0a0b8" : "#f5ead0"}
                style={{ fontFamily: "Georgia, serif" }}
              >
                {PLANET_SYMBOLS[planet.name] ?? planet.name[0]}
              </text>
              {/* Retrograde marker */}
              {planet.retrograde && (
                <text x={pt.x + 10} y={pt.y - 10} fontSize={7.5} fill="#f0a0b8" fillOpacity={0.95}>
                  ℞
                </text>
              )}
              {/* Degree + sign below symbol */}
              <text
                x={pt.x} y={pt.y + 10}
                textAnchor="middle" dominantBaseline="middle"
                fontSize={7.5} fill="rgba(232,228,240,0.55)"
                style={{ fontFamily: "system-ui, sans-serif" }}
              >
                {`${degStr}° ${g}`}
              </text>
              <title>{`${planet.name} ${planet.degree.toFixed(2)}° ${planet.sign}${planet.retrograde ? " ℞" : ""} · house ${planet.house}`}</title>
            </g>
          );
        })}

        {/* Tiny center dot */}
        <circle cx={cx} cy={cy} r={3} fill="rgba(240,200,140,0.15)" />
      </svg>

      {/* ── Aspect legend (HTML below chart) ── */}
      <div className="flex items-center justify-center gap-5 mt-3 mb-2 flex-wrap">
        {[
          { sym: "☌", label: "Conjunction", color: "#8cc88c", dash: false },
          { sym: "⚹", label: "Sextile",     color: "#6090e0", dash: true },
          { sym: "□", label: "Square",       color: "#e07070", dash: true },
          { sym: "△", label: "Trine",        color: "#6090e0", dash: false },
          { sym: "☍", label: "Opposition",   color: "#e07070", dash: true },
        ].map(({ sym, label, color, dash }) => (
          <div key={label} className="flex items-center gap-1.5">
            <svg width="22" height="10" className="shrink-0">
              <line x1={0} y1={5} x2={22} y2={5}
                stroke={color} strokeWidth={1.4}
                strokeDasharray={dash ? "4 3" : undefined}
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[11px] text-white/45" style={{ fontFamily: "Georgia, serif" }}>
              {sym}
            </span>
          </div>
        ))}
      </div>

      {/* ── Placement summary table ── */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-[12px] text-white/50 max-w-[520px] mx-auto">
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