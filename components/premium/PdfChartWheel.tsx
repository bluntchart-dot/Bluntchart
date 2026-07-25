"use client";

/**
 * PdfChartWheel — native @react-pdf/renderer chart wheel.
 *
 * Traditional natal-chart layout drawn with pure SVG primitives so the
 * PDF renders identically on every device. No html2canvas dependency.
 *
 * Layers (drawn back-to-front):
 *   1. Element-tinted zodiac ring        (fire/earth/air/water washes)
 *   2. Outer boundary + zodiac dividers  (30° slices)
 *   3. Degree ticks around outer ring    (clock-face feel — 1°/5°/10°)
 *   4. Zodiac abbreviations              (Ari/Tau/…, mid-slice)
 *   5. Inner house ring + 12 house dividers (angles 1/4/7/10 emphasised)
 *   6. House numbers                     (subtle sepia)
 *   7. Aspect lines between planets      (blue harmonious / red tension,
 *                                          dashed = tighter aspects)
 *   8. Four angle markers                (AC / DC / MC / IC)
 *   9. Planet marks                      (category-tinted circles + degrees)
 *
 * Rotation convention: the reader's ASCENDANT sits at 9-o'clock, per
 * traditional astrology. Everything else rotates with it.
 */

import { Svg, G, Circle, Line, Path, Text } from "@react-pdf/renderer";
import type { ChartData } from "@/lib/types";

/* ─── Layout constants (in Svg viewBox units) ─────────────────────── */

const VB = 320;
const CX = VB / 2;
const CY = VB / 2;

const R_OUTER        = 145;   // outer boundary
const R_ZODIAC_INNER = 128;   // inner edge of zodiac ring
const R_TICK_INNER   = 137;   // where minor tick starts
const R_TICK_MID     = 132;   // where 5° ticks start
const R_TICK_MAJOR   = 128;   // where 10° ticks start (touches zodiac ring)
const R_ZODIAC_LABEL = 137;   // vertical centre of a sign label
const R_HOUSE_OUTER  = 106;   // outer edge of house ring
const R_HOUSE_LABEL  = 100;   // house number placement
const R_PLANET       = 84;    // planet marker default radius
const R_HUB          = 20;    // central hub

/* ─── Palette ─────────────────────────────────────────────────────── */

const INK           = "#1a1420";
const OUTER_LINE    = "#1a1420";
const ZODIAC_LINE   = "#8a7ba8";
const HOUSE_LINE    = "#c4a875";
const HOUSE_ANGLE   = "#7a5a20";
const ZODIAC_LABEL  = "#3a2c58";
const HOUSE_LABEL   = "#a89373";
const ANGLE_LABEL   = "#7a5a20";
const PLANET_FILL   = "#f7f4fb";

const ELEMENT_TINT: Record<string, string> = {
  fire:  "#f6e4d8",
  earth: "#e6ecdc",
  air:   "#f2ebd6",
  water: "#dee5ec",
};

const ASPECT_STYLE: Record<
  "conjunction" | "sextile" | "square" | "trine" | "opposition",
  { color: string; dash?: string; width: number }
> = {
  conjunction: { color: "#8a6a2a", width: 0.35 },              // subtle brown
  sextile:     { color: "#3a6a9a", width: 0.4, dash: "1.4 2" }, // dashed blue
  trine:       { color: "#2a5a80", width: 0.55 },              // solid blue
  square:      { color: "#a04040", width: 0.55 },              // solid red
  opposition:  { color: "#a04040", width: 0.5, dash: "1.4 2" }, // dashed red
};

const PLANET_TINT: Record<string, string> = {
  Sun:     "#b06a2a", Moon: "#b06a2a", Mercury: "#b06a2a",
  Venus:   "#b06a2a", Mars: "#b06a2a",
  Jupiter: "#7a4a9a", Saturn: "#7a4a9a",
  Uranus:  "#4a7a6a", Neptune: "#4a7a6a", Pluto: "#4a7a6a",
};

/* ─── Zodiac + planet codes ───────────────────────────────────────── */

const ZODIAC = [
  { name: "Ari", element: "fire"  },
  { name: "Tau", element: "earth" },
  { name: "Gem", element: "air"   },
  { name: "Can", element: "water" },
  { name: "Leo", element: "fire"  },
  { name: "Vir", element: "earth" },
  { name: "Lib", element: "air"   },
  { name: "Sco", element: "water" },
  { name: "Sag", element: "fire"  },
  { name: "Cap", element: "earth" },
  { name: "Aqu", element: "air"   },
  { name: "Pis", element: "water" },
] as const;

const PLANET_CODE: Record<string, string> = {
  Sun: "Su", Moon: "Mo", Mercury: "Me", Venus: "Ve", Mars: "Ma",
  Jupiter: "Ju", Saturn: "Sa", Uranus: "Ur", Neptune: "Ne", Pluto: "Pl",
};

/* ─── Angle math ──────────────────────────────────────────────────── */

function polar(radius: number, absoluteDegree: number, rotationDeg: number) {
  const rel = absoluteDegree - rotationDeg;
  const mathDeg = 180 + rel;
  const rad = (mathDeg * Math.PI) / 180;
  return {
    x: CX + radius * Math.cos(rad),
    y: CY - radius * Math.sin(rad),
  };
}

/**
 * SVG arc path for a ring segment (annulus wedge) between two angles
 * and two radii. All angles are in *relative* degrees, where 0° sits at
 * the 9-o'clock position (matches the wheel's rotation convention).
 */
function ringSlicePath(
  startDeg: number,     // relative degree
  endDeg: number,       // relative degree (must be > startDeg for the arc direction we want)
  rOuter: number,
  rInner: number
): string {
  const startOuter = polar(rOuter, startDeg, 0);
  const endOuter   = polar(rOuter, endDeg,   0);
  const startInner = polar(rInner, startDeg, 0);
  const endInner   = polar(rInner, endDeg,   0);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  // In SVG's flipped-y coords, counter-clockwise math = sweep flag 0
  return [
    `M ${startOuter.x.toFixed(2)} ${startOuter.y.toFixed(2)}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 0 ${endOuter.x.toFixed(2)} ${endOuter.y.toFixed(2)}`,
    `L ${endInner.x.toFixed(2)} ${endInner.y.toFixed(2)}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 1 ${startInner.x.toFixed(2)} ${startInner.y.toFixed(2)}`,
    "Z",
  ].join(" ");
}

/* ─── Nudge coincident planets onto slightly different radii ─────── */

function distributePlanets(
  planets: { name: string; absoluteDegree: number; degreeInSign: number }[],
  minSepDeg = 8
) {
  const sorted = [...planets].sort((a, b) => a.absoluteDegree - b.absoluteDegree);
  const out: Array<typeof planets[number] & { radius: number }> = [];
  for (const p of sorted) {
    let radius = R_PLANET;
    let bump = 0;
    for (const q of out) {
      const diff = Math.abs(p.absoluteDegree - q.absoluteDegree);
      const sep = Math.min(diff, 360 - diff);
      if (sep < minSepDeg && q.radius === radius) {
        bump += 13;
        radius = R_PLANET - bump;
      }
    }
    out.push({ ...p, radius });
  }
  return out;
}

/* ─── Component ───────────────────────────────────────────────────── */

interface Props {
  chart: ChartData;
  size?: number;
}

export default function PdfChartWheel({ chart, size = 260 }: Props) {
  const ascDeg = chart.ascendant?.absoluteDegree ?? 0;
  const mcDeg  = chart.midheaven?.absoluteDegree ?? (ascDeg + 90);
  const dscDeg = (ascDeg + 180) % 360;
  const icDeg  = (mcDeg  + 180) % 360;

  /* ── Zodiac slices ─────────────────────────────────────────────── */
  const zodiacSlices = ZODIAC.map((z, i) => {
    const sliceStart = i * 30;
    const sliceMid   = i * 30 + 15;
    return {
      ...z,
      sliceStart,
      dividerOuter: polar(R_OUTER,        sliceStart, ascDeg),
      dividerInner: polar(R_ZODIAC_INNER, sliceStart, ascDeg),
      labelPos:     polar(R_ZODIAC_LABEL, sliceMid,   ascDeg),
    };
  });

  /* ── Degree ticks: 72 marks every 5°, 12 major every 30° ──────── */
  const ticks: Array<{ kind: "minor" | "mid" | "major"; from: {x:number;y:number}; to: {x:number;y:number} }> = [];
  for (let d = 0; d < 360; d += 5) {
    const isMajor = d % 30 === 0;
    const isMid = d % 10 === 0;
    const rIn  = isMajor ? R_TICK_MAJOR : (isMid ? R_TICK_MID : R_TICK_INNER);
    const rOut = R_OUTER;
    ticks.push({
      kind: isMajor ? "major" : (isMid ? "mid" : "minor"),
      from: polar(rIn,  d, ascDeg),
      to:   polar(rOut, d, ascDeg),
    });
  }
  /* Add 1° minor ticks (subtle) — filter out multiples of 5 to avoid dup */
  const minorTicks: Array<{ from: {x:number;y:number}; to: {x:number;y:number} }> = [];
  for (let d = 0; d < 360; d++) {
    if (d % 5 === 0) continue;
    minorTicks.push({
      from: polar(R_OUTER - 2, d, ascDeg),
      to:   polar(R_OUTER,      d, ascDeg),
    });
  }

  /* ── House lines — 12 divisions of 30° from AC ─────────────────── */
  const houseLines = [];
  for (let h = 0; h < 12; h++) {
    const angle = ascDeg + h * 30;
    houseLines.push({
      index: h,
      isAngle: h === 0 || h === 3 || h === 6 || h === 9,
      inner: polar(R_HUB,          angle, ascDeg),
      outer: polar(R_HOUSE_OUTER,  angle, ascDeg),
    });
  }

  /* ── House labels ──────────────────────────────────────────────── */
  const houseLabels = [];
  for (let h = 1; h <= 12; h++) {
    const houseMid = ascDeg + (h - 1) * 30 + 15;
    houseLabels.push({ n: h, pos: polar(R_HOUSE_LABEL, houseMid, ascDeg) });
  }

  /* ── Planet plot ───────────────────────────────────────────────── */
  const planetsRaw = (chart.planets ?? [])
    .filter((p) => PLANET_CODE[p.name])
    .map((p) => ({
      name: p.name,
      absoluteDegree: p.absoluteDegree,
      degreeInSign: Math.floor(p.degree),
    }));
  const planets = distributePlanets(planetsRaw);
  const planetPosByName = new Map<string, { x: number; y: number }>();
  for (const p of planets) {
    planetPosByName.set(p.name, polar(p.radius - 10, p.absoluteDegree, ascDeg));
  }

  /* ── Aspect lines ──────────────────────────────────────────────── */
  const aspectLines = (chart.aspects ?? []).flatMap((a) => {
    const style = ASPECT_STYLE[a.type];
    const a1 = planetPosByName.get(a.planet1);
    const a2 = planetPosByName.get(a.planet2);
    if (!style || !a1 || !a2) return [];
    return [{ style, from: a1, to: a2 }];
  });

  /* ── Four angle markers ────────────────────────────────────────── */
  const angleMarkers: Array<{ label: string; degree: number; pos: {x:number;y:number} }> = [
    { label: "AC", degree: ascDeg,  pos: polar(R_OUTER + 5, ascDeg,  ascDeg) },
    { label: "DC", degree: dscDeg, pos: polar(R_OUTER + 5, dscDeg, ascDeg) },
    { label: "MC", degree: mcDeg,  pos: polar(R_OUTER + 5, mcDeg,  ascDeg) },
    { label: "IC", degree: icDeg,  pos: polar(R_OUTER + 5, icDeg,  ascDeg) },
  ];

  return (
    <Svg viewBox={`0 0 ${VB} ${VB}`} width={size} height={size}>
      {/* Element-tinted zodiac ring */}
      {zodiacSlices.map((s) => (
        <Path
          key={`el-${s.name}`}
          d={ringSlicePath(s.sliceStart, s.sliceStart + 30, R_OUTER, R_ZODIAC_INNER)}
          fill={ELEMENT_TINT[s.element]}
          stroke="none"
        />
      ))}

      {/* Outer + inner zodiac ring boundaries */}
      <Circle cx={CX} cy={CY} r={R_OUTER}        stroke={OUTER_LINE} strokeWidth={0.9} fill="none" />
      <Circle cx={CX} cy={CY} r={R_ZODIAC_INNER} stroke={OUTER_LINE} strokeWidth={0.5} fill="none" />
      <Circle cx={CX} cy={CY} r={R_HOUSE_OUTER}  stroke={HOUSE_LINE} strokeWidth={0.4} fill="none" />
      <Circle cx={CX} cy={CY} r={R_HUB}          stroke={ZODIAC_LABEL} strokeWidth={0.5} fill="#fbf9fd" />

      {/* Degree ticks — 1° minor */}
      {minorTicks.map((t, i) => (
        <Line key={`mtn-${i}`}
          x1={t.from.x} y1={t.from.y} x2={t.to.x} y2={t.to.y}
          stroke="#c4b0a0" strokeWidth={0.18}
        />
      ))}
      {/* Degree ticks — 5° / 10° / 30° */}
      {ticks.map((t, i) => (
        <Line key={`tk-${i}`}
          x1={t.from.x} y1={t.from.y} x2={t.to.x} y2={t.to.y}
          stroke={t.kind === "major" ? INK : (t.kind === "mid" ? "#7a5a20" : "#a09080")}
          strokeWidth={t.kind === "major" ? 0.6 : (t.kind === "mid" ? 0.4 : 0.3)}
        />
      ))}

      {/* Zodiac dividers (30° slices) */}
      {zodiacSlices.map((s) => (
        <Line key={`zd-${s.name}`}
          x1={s.dividerInner.x} y1={s.dividerInner.y}
          x2={s.dividerOuter.x} y2={s.dividerOuter.y}
          stroke={ZODIAC_LINE} strokeWidth={0.4}
        />
      ))}

      {/* Zodiac labels */}
      {zodiacSlices.map((s) => (
        <Text key={`zl-${s.name}`}
          x={s.labelPos.x} y={s.labelPos.y + 3}
          fontSize={7.5} fill={ZODIAC_LABEL}
          textAnchor="middle" fontFamily="Helvetica-Bold"
        >
          {s.name}
        </Text>
      ))}

      {/* House dividers */}
      {houseLines.map((h) => (
        <Line key={`hd-${h.index}`}
          x1={h.inner.x} y1={h.inner.y} x2={h.outer.x} y2={h.outer.y}
          stroke={h.isAngle ? HOUSE_ANGLE : HOUSE_LINE}
          strokeWidth={h.isAngle ? 0.75 : 0.3}
        />
      ))}

      {/* House numbers */}
      {houseLabels.map((h) => (
        <Text key={`hn-${h.n}`}
          x={h.pos.x} y={h.pos.y + 2.8}
          fontSize={7} fill={HOUSE_LABEL}
          textAnchor="middle" fontFamily="Helvetica"
        >
          {h.n}
        </Text>
      ))}

      {/* Aspect lines — drawn BEFORE planets so the planet dots sit on top */}
      {aspectLines.map((a, i) => (
        <Line key={`asp-${i}`}
          x1={a.from.x} y1={a.from.y} x2={a.to.x} y2={a.to.y}
          stroke={a.style.color}
          strokeWidth={a.style.width}
          strokeDasharray={a.style.dash}
        />
      ))}

      {/* Four angle labels (AC / DC / MC / IC) */}
      {angleMarkers.map((a) => (
        <G key={`ang-${a.label}`}>
          <Circle cx={a.pos.x} cy={a.pos.y} r={2.5} fill={ASCENDANT_DOT_COLOR(a.label)} />
          <Text
            x={a.pos.x + LABEL_OFFSET_X(a.pos.x)}
            y={a.pos.y + LABEL_OFFSET_Y(a.pos.y)}
            fontSize={7.5} fill={ANGLE_LABEL}
            textAnchor={a.pos.x < CX ? "end" : "start"}
            fontFamily="Helvetica-Bold"
          >
            {a.label}
          </Text>
        </G>
      ))}

      {/* Planet marks */}
      {planets.map((p) => {
        const pos = planetPosByName.get(p.name)!;
        const tint = PLANET_TINT[p.name] ?? INK;
        return (
          <G key={p.name}>
            <Circle cx={pos.x} cy={pos.y} r={9} fill={PLANET_FILL} stroke={tint} strokeWidth={0.8} />
            <Text x={pos.x} y={pos.y - 0.4}
              fontSize={6.5} fill={INK}
              textAnchor="middle" fontFamily="Helvetica-Bold"
            >
              {PLANET_CODE[p.name]}
            </Text>
            <Text x={pos.x} y={pos.y + 6}
              fontSize={5.2} fill={tint}
              textAnchor="middle" fontFamily="Helvetica"
            >
              {p.degreeInSign}°
            </Text>
          </G>
        );
      })}

      {/* Central star */}
      <Text x={CX} y={CY + 3}
        fontSize={8} fill={ZODIAC_LABEL} textAnchor="middle"
      >
        ✦
      </Text>
    </Svg>
  );
}

/* ─── Label offset helpers keep AC/DC/MC/IC text outside the ring ─── */

function LABEL_OFFSET_X(x: number): number {
  return x < CX ? -4 : 4;
}
function LABEL_OFFSET_Y(y: number): number {
  return y < CY ? -2 : 6;
}
function ASCENDANT_DOT_COLOR(label: string): string {
  return label === "AC" || label === "MC" ? "#c4a875" : "#a89373";
}
