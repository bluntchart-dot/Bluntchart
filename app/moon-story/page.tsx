"use client";

import { useState, useRef } from "react";
import { getMoonPhase, calculateCompatibility } from "@/lib/moon-phase";
import type { PhaseCategory, MoonPhaseData } from "@/lib/moon-phase";
import {
  getZodiacSign,
  getElementPairKey,
  getElementCompatScore,
} from "@/lib/zodiac";
import type { ZodiacSign, Element } from "@/lib/zodiac";
import {
  PHASE_PERSONALITIES,
  SOULMATE_INTERPRETATIONS,
  ZODIAC_PERSONALITIES,
  ELEMENT_COMPATIBILITY,
  UPSELL_A,
  UPSELL_B,
} from "@/lib/moon-story-content";

type Product = "A" | "B";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00Z");
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function phaseFriendlyName(cat: PhaseCategory): string {
  const map: Record<PhaseCategory, string> = {
    new: "New Moon",
    "waxing-crescent": "Waxing Crescent",
    "first-quarter": "First Quarter",
    "waxing-gibbous": "Waxing Gibbous",
    full: "Full Moon",
    "waning-gibbous": "Waning Gibbous",
    "third-quarter": "Last Quarter",
    "waning-crescent": "Waning Crescent",
  };
  return map[cat];
}

function combinedPhaseCategory(
  p1: MoonPhaseData,
  p2: MoonPhaseData
): PhaseCategory {
  const avg = (p1.phaseAngle + p2.phaseAngle) / 2;
  const norm = ((avg % 360) + 360) % 360;
  if (norm < 11.25 || norm >= 348.75) return "new";
  if (norm < 78.75) return "waxing-crescent";
  if (norm < 101.25) return "first-quarter";
  if (norm < 168.75) return "waxing-gibbous";
  if (norm < 191.25) return "full";
  if (norm < 258.75) return "waning-gibbous";
  if (norm < 281.25) return "third-quarter";
  return "waning-crescent";
}

/* ─── Moon SVG Component ─── */

function MoonSVG({
  phase,
  size = 80,
  glow = false,
}: {
  phase: PhaseCategory;
  size?: number;
  glow?: boolean;
}) {
  const uid = `m${size}${phase}`;
  const isLit =
    phase === "full" ||
    phase === "waxing-gibbous" ||
    phase === "waning-gibbous";

  const glowFilter = glow || isLit
    ? `drop-shadow(0 0 ${size * 0.18}px rgba(215,200,165,0.5)) drop-shadow(0 0 ${size * 0.06}px rgba(215,200,165,0.3))`
    : `drop-shadow(0 0 ${size * 0.05}px rgba(180,170,145,0.2))`;

  const litPaths: Record<PhaseCategory, string | null> = {
    new: null,
    "waxing-crescent": "M24 4A20 20 0 0 1 24 44A12 20 0 0 1 24 4Z",
    "first-quarter": "M24 4A20 20 0 0 1 24 44L24 4Z",
    "waxing-gibbous": "M24 4A20 20 0 0 1 24 44A12 20 0 0 0 24 4Z",
    full: null,
    "waning-gibbous": "M24 4A20 20 0 0 0 24 44A12 20 0 0 1 24 4Z",
    "third-quarter": "M24 4A20 20 0 0 0 24 44L24 4Z",
    "waning-crescent": "M24 4A20 20 0 0 0 24 44A12 20 0 0 0 24 4Z",
  };

  const craters = (
    <g opacity="0.12">
      <circle cx="28" cy="16" r="3.5" fill="#8A7E68" />
      <circle cx="18" cy="28" r="4.2" fill="#8A7E68" />
      <circle cx="30" cy="30" r="2.2" fill="#8A7E68" />
      <circle cx="22" cy="12" r="1.8" fill="#8A7E68" />
      <circle cx="14" cy="20" r="2.8" fill="#8A7E68" />
      <circle cx="32" cy="22" r="1.5" fill="#8A7E68" />
      <circle cx="20" cy="36" r="2" fill="#8A7E68" />
    </g>
  );

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      style={{ filter: glowFilter, flexShrink: 0 }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}-dark`} cx="40%" cy="40%">
          <stop offset="0%" stopColor="#3A342A" />
          <stop offset="60%" stopColor="#252018" />
          <stop offset="100%" stopColor="#1A1610" />
        </radialGradient>
        <radialGradient id={`${uid}-lit`} cx="45%" cy="40%">
          <stop offset="0%" stopColor="#F0E8D4" />
          <stop offset="50%" stopColor="#DDD3B8" />
          <stop offset="100%" stopColor="#C4B898" />
        </radialGradient>
        <clipPath id={`${uid}-clip`}>
          <circle cx="24" cy="24" r="20" />
        </clipPath>
      </defs>

      {/* Dark base disk */}
      <circle cx="24" cy="24" r="20" fill={`url(#${uid}-dark)`} />

      {/* Lit portion */}
      {phase === "full" ? (
        <circle cx="24" cy="24" r="20" fill={`url(#${uid}-lit)`} />
      ) : phase === "new" ? null : (
        <path d={litPaths[phase]!} fill={`url(#${uid}-lit)`} />
      )}

      {/* Craters clipped to disk */}
      <g clipPath={`url(#${uid}-clip)`}>{craters}</g>

      {/* Subtle rim highlight */}
      <circle
        cx="24"
        cy="24"
        r="19.5"
        fill="none"
        stroke="rgba(210,200,175,0.2)"
        strokeWidth="0.8"
      />

      {/* New moon faint rim */}
      {phase === "new" && (
        <circle
          cx="24"
          cy="24"
          r="19.5"
          fill="none"
          stroke="rgba(180,170,140,0.25)"
          strokeWidth="0.6"
        />
      )}
    </svg>
  );
}

/* ─── Illumination Moon SVG (exact %) ─── */

function IlluminationMoonSVG({
  illumination,
  size = 110,
}: {
  illumination: number;
  size?: number;
}) {
  const uid = `illum${size}`;
  const f = Math.max(0, Math.min(100, illumination)) / 100;
  const r = 20;
  const cx = 24;
  const top = cx - r;
  const bot = cx + r;
  const addGlow = f > 0.6;

  const glowFilter = addGlow
    ? `drop-shadow(0 0 ${size * 0.18}px rgba(215,200,165,0.5)) drop-shadow(0 0 ${size * 0.06}px rgba(215,200,165,0.3))`
    : `drop-shadow(0 0 ${size * 0.05}px rgba(180,170,145,0.2))`;

  let litShape: React.ReactNode = null;
  if (f >= 0.995) {
    litShape = <circle cx={cx} cy={cx} r={r} fill={`url(#${uid}-lit)`} />;
  } else if (f <= 0.005) {
    litShape = null;
  } else if (Math.abs(f - 0.5) < 0.005) {
    litShape = (
      <path
        d={`M${cx} ${top}A${r} ${r} 0 0 1 ${cx} ${bot}L${cx} ${top}Z`}
        fill={`url(#${uid}-lit)`}
      />
    );
  } else {
    const rx = (r * Math.abs(2 * f - 1)).toFixed(2);
    const sweep = f > 0.5 ? 0 : 1;
    litShape = (
      <path
        d={`M${cx} ${top}A${r} ${r} 0 0 1 ${cx} ${bot}A${rx} ${r} 0 0 ${sweep} ${cx} ${top}Z`}
        fill={`url(#${uid}-lit)`}
      />
    );
  }

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      style={{ filter: glowFilter, flexShrink: 0 }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`${uid}-dark`} cx="40%" cy="40%">
          <stop offset="0%" stopColor="#3A342A" />
          <stop offset="60%" stopColor="#252018" />
          <stop offset="100%" stopColor="#1A1610" />
        </radialGradient>
        <radialGradient id={`${uid}-lit`} cx="45%" cy="40%">
          <stop offset="0%" stopColor="#F0E8D4" />
          <stop offset="50%" stopColor="#DDD3B8" />
          <stop offset="100%" stopColor="#C4B898" />
        </radialGradient>
        <clipPath id={`${uid}-clip`}>
          <circle cx={cx} cy={cx} r={r} />
        </clipPath>
      </defs>
      <circle cx={cx} cy={cx} r={r} fill={`url(#${uid}-dark)`} />
      {litShape}
      <g clipPath={`url(#${uid}-clip)`} opacity="0.12">
        <circle cx="28" cy="16" r="3.5" fill="#8A7E68" />
        <circle cx="18" cy="28" r="4.2" fill="#8A7E68" />
        <circle cx="30" cy="30" r="2.2" fill="#8A7E68" />
        <circle cx="22" cy="12" r="1.8" fill="#8A7E68" />
        <circle cx="14" cy="20" r="2.8" fill="#8A7E68" />
        <circle cx="32" cy="22" r="1.5" fill="#8A7E68" />
        <circle cx="20" cy="36" r="2" fill="#8A7E68" />
      </g>
      <circle
        cx={cx}
        cy={cx}
        r="19.5"
        fill="none"
        stroke="rgba(210,200,175,0.2)"
        strokeWidth="0.8"
      />
    </svg>
  );
}

/* ─── Story Page Component (Print Target) ─── */

function MoonStoryPage({
  product,
  name1,
  date1,
  name2,
  date2,
}: {
  product: Product;
  name1: string;
  date1: string;
  name2: string;
  date2: string;
}) {
  const moon1 = getMoonPhase(date1);
  const moon2 = getMoonPhase(date2);
  const compat = calculateCompatibility(date1, date2);
  const combinedPhase = combinedPhaseCategory(moon1, moon2);
  const combinedIllum = compat.score;

  const zodiac1 = getZodiacSign(date1);
  const zodiac2 = getZodiacSign(date2);
  const elementKey = getElementPairKey(zodiac1.element, zodiac2.element);
  const compatScore = getElementCompatScore(zodiac1.element, zodiac2.element);

  if (product === "A") {
    return (
      <div className="story-page">
        <div className="story-header">
          <div className="story-rule" />
          <h1>Your Moon Story</h1>
          <div className="story-rule" />
        </div>

        {/* Person 1 */}
        <div className="person-section">
          <div className="person-intro">
            <MoonSVG
              phase={moon1.phaseCategory}
              size={90}
              glow={
                moon1.phaseCategory === "full" ||
                moon1.phaseCategory === "waxing-gibbous" ||
                moon1.phaseCategory === "waning-gibbous"
              }
            />
            <div className="person-meta">
              <h2>{name1}</h2>
              <p className="meta-date">{formatDate(date1)}</p>
              <p className="meta-phase">
                {phaseFriendlyName(moon1.phaseCategory)} &mdash;{" "}
                {moon1.illuminationPercent}% illuminated
              </p>
            </div>
          </div>
          <p className="story-body">
            {PHASE_PERSONALITIES[moon1.phaseCategory]}
          </p>
        </div>

        {/* Person 2 */}
        <div className="person-section">
          <div className="person-intro">
            <MoonSVG
              phase={moon2.phaseCategory}
              size={90}
              glow={
                moon2.phaseCategory === "full" ||
                moon2.phaseCategory === "waxing-gibbous" ||
                moon2.phaseCategory === "waning-gibbous"
              }
            />
            <div className="person-meta">
              <h2>{name2}</h2>
              <p className="meta-date">{formatDate(date2)}</p>
              <p className="meta-phase">
                {phaseFriendlyName(moon2.phaseCategory)} &mdash;{" "}
                {moon2.illuminationPercent}% illuminated
              </p>
            </div>
          </div>
          <p className="story-body">
            {PHASE_PERSONALITIES[moon2.phaseCategory]}
          </p>
        </div>

        {/* Combined / Soulmate Moon */}
        <div className="divider">&#10022; &nbsp; &#10022; &nbsp; &#10022;</div>

        <div className="combined-section">
          <div className="combined-intro">
            <IlluminationMoonSVG
              illumination={combinedIllum}
              size={110}
            />
          </div>
          <p className="combined-lead">
            When we brought your moons together, something new appeared &mdash;
            a {phaseFriendlyName(combinedPhase)} at {combinedIllum}%
            illumination. A moon that has never hung in any sky. Your Soulmate
            Moon.
          </p>
          <p className="story-body">
            {SOULMATE_INTERPRETATIONS[combinedPhase]}
          </p>
        </div>

        {/* Upsell */}
        <div className="upsell">
          {UPSELL_A.split("\n\n").map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    );
  }

  /* ─── B1 & B2: Cosmic Story ─── */
  return (
    <div className="story-page">
      <div className="story-header">
        <div className="story-rule" />
        <h1>Your Cosmic Story</h1>
        <div className="story-rule" />
      </div>

      {/* Person 1 */}
      <div className="person-section">
        <div className="person-intro">
          <MoonSVG
            phase={moon1.phaseCategory}
            size={90}
            glow={
              moon1.phaseCategory === "full" ||
              moon1.phaseCategory === "waxing-gibbous" ||
              moon1.phaseCategory === "waning-gibbous"
            }
          />
          <div className="person-meta">
            <h2>
              {name1}{" "}
              <span className="zodiac-badge">
                {zodiac1.sign}
              </span>
            </h2>
            <p className="meta-date">{formatDate(date1)}</p>
            <p className="meta-phase">
              {phaseFriendlyName(moon1.phaseCategory)} &mdash;{" "}
              {moon1.illuminationPercent}% illuminated
            </p>
          </div>
        </div>
        <p className="story-body">
          {ZODIAC_PERSONALITIES[zodiac1.sign]}{" "}
          {PHASE_PERSONALITIES[moon1.phaseCategory]}
        </p>
      </div>

      {/* Person 2 */}
      <div className="person-section">
        <div className="person-intro">
          <MoonSVG
            phase={moon2.phaseCategory}
            size={90}
            glow={
              moon2.phaseCategory === "full" ||
              moon2.phaseCategory === "waxing-gibbous" ||
              moon2.phaseCategory === "waning-gibbous"
            }
          />
          <div className="person-meta">
            <h2>
              {name2}{" "}
              <span className="zodiac-badge">
                {zodiac2.sign}
              </span>
            </h2>
            <p className="meta-date">{formatDate(date2)}</p>
            <p className="meta-phase">
              {phaseFriendlyName(moon2.phaseCategory)} &mdash;{" "}
              {moon2.illuminationPercent}% illuminated
            </p>
          </div>
        </div>
        <p className="story-body">
          {ZODIAC_PERSONALITIES[zodiac2.sign]}{" "}
          {PHASE_PERSONALITIES[moon2.phaseCategory]}
        </p>
      </div>

      {/* Compatibility */}
      <div className="divider">&#10022; &nbsp; &#10022; &nbsp; &#10022;</div>

      <div className="compat-section">
        <p className="compat-intro">
          Together: {zodiac1.sign} and {zodiac2.sign}.
          <br />
          <span className="compat-score">
            Your compatibility score: {compatScore}%.
          </span>
        </p>
        <p className="compat-pair-label">{elementKey}</p>
        <p className="story-body">
          {ELEMENT_COMPATIBILITY[elementKey] ?? ""}
        </p>
      </div>

      {/* Upsell */}
      <div className="upsell">
        {UPSELL_B.split("\n\n").map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */

export default function MoonStoryGenerator() {
  const [product, setProduct] = useState<Product>("A");
  const [name1, setName1] = useState("Olivia");
  const [date1, setDate1] = useState("1997-02-01");
  const [name2, setName2] = useState("Ethan");
  const [date2, setDate2] = useState("1995-01-07");
  const [generated, setGenerated] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  function handleGenerate() {
    setGenerated(true);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Lora:ital,wght@0,400;0,500;1,400&family=Source+Sans+3:wght@300;400;500;600&display=swap');

        /* ─── Generator Form (screen only) ─── */
        .gen-wrap {
          max-width: 580px;
          margin: 0 auto;
          padding: 2rem 1rem;
          font-family: 'Source Sans 3', system-ui, sans-serif;
          color: #1A1612;
        }
        .gen-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.8rem;
          font-weight: 600;
          color: #B8953E;
          text-align: center;
          margin-bottom: 0.3rem;
        }
        .gen-sub {
          text-align: center;
          color: #857E72;
          font-size: 0.88rem;
          margin-bottom: 2rem;
        }
        .form-group {
          margin-bottom: 1.2rem;
        }
        .form-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #857E72;
          margin-bottom: 0.3rem;
        }
        .form-group input, .form-group select {
          width: 100%;
          padding: 0.55rem 0.75rem;
          border: 1px solid #D5D0C7;
          border-radius: 5px;
          font-size: 0.95rem;
          font-family: 'Source Sans 3', system-ui, sans-serif;
          background: #FDFAF3;
          color: #1A1612;
          outline: none;
          transition: border-color 0.2s;
        }
        .form-group input:focus, .form-group select:focus {
          border-color: #B8953E;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .form-section-label {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #B8953E;
          margin: 1.5rem 0 0.8rem;
          padding-bottom: 0.3rem;
          border-bottom: 1px solid rgba(184,149,62,0.2);
        }
        .product-toggle {
          display: flex;
          gap: 0;
          border: 1px solid #D5D0C7;
          border-radius: 5px;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }
        .product-toggle button {
          flex: 1;
          padding: 0.6rem;
          border: none;
          background: #FDFAF3;
          font-family: 'Source Sans 3', system-ui, sans-serif;
          font-size: 0.85rem;
          color: #857E72;
          cursor: pointer;
          transition: all 0.2s;
        }
        .product-toggle button.active {
          background: #B8953E;
          color: white;
          font-weight: 600;
        }
        .product-toggle button + button {
          border-left: 1px solid #D5D0C7;
        }
        .gen-btn {
          display: block;
          width: 100%;
          padding: 0.75rem;
          background: #B8953E;
          color: white;
          border: none;
          border-radius: 5px;
          font-family: 'Source Sans 3', system-ui, sans-serif;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          cursor: pointer;
          margin-top: 1.5rem;
          transition: background 0.2s;
        }
        .gen-btn:hover {
          background: #A07E30;
        }
        .print-btn {
          display: block;
          width: 100%;
          padding: 0.6rem;
          background: transparent;
          color: #B8953E;
          border: 1px solid #B8953E;
          border-radius: 5px;
          font-family: 'Source Sans 3', system-ui, sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          margin-top: 0.8rem;
          transition: all 0.2s;
        }
        .print-btn:hover {
          background: rgba(184,149,62,0.08);
        }

        /* ─── Story Page (screen preview + print) ─── */
        .story-page {
          max-width: 650px;
          margin: 2rem auto;
          padding: 3rem 2.5rem;
          background: #F5F0E6;
          font-family: 'Source Sans 3', system-ui, sans-serif;
          color: #1A1612;
          line-height: 1.7;
          border: 1px solid #EDE8DE;
          box-shadow: 0 2px 20px rgba(0,0,0,0.06);
        }

        .story-header {
          text-align: center;
          margin-bottom: 2.5rem;
        }
        .story-header h1 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 2rem;
          font-weight: 600;
          color: #B8953E;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin: 0.8rem 0;
        }
        .story-rule {
          height: 1px;
          background: rgba(184,149,62,0.25);
          max-width: 120px;
          margin: 0 auto;
        }

        .person-section {
          margin-bottom: 2rem;
        }
        .person-intro {
          display: flex;
          align-items: flex-start;
          gap: 1.2rem;
          margin-bottom: 1rem;
        }
        .person-meta h2 {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.35rem;
          font-weight: 600;
          color: #1A1612;
          margin: 0 0 0.15rem;
        }
        .zodiac-badge {
          font-size: 0.82rem;
          color: #8A5E4A;
          font-weight: 400;
        }
        .meta-date {
          font-size: 0.82rem;
          color: #857E72;
          margin: 0;
        }
        .meta-phase {
          font-size: 0.78rem;
          color: #AFA899;
          margin: 0.1rem 0 0;
          font-style: italic;
        }

        .story-body {
          font-family: 'Lora', Georgia, serif;
          font-size: 0.95rem;
          line-height: 1.85;
          color: #3D3830;
          margin: 0;
        }

        .divider {
          text-align: center;
          padding: 1.8rem 0;
          color: #B8953E;
          font-size: 0.7rem;
          letter-spacing: 0.6rem;
          opacity: 0.7;
        }

        .combined-section {
          text-align: center;
          margin-bottom: 2rem;
        }
        .combined-intro {
          margin-bottom: 1rem;
        }
        .combined-lead {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.05rem;
          font-weight: 400;
          font-style: italic;
          color: #3D3830;
          line-height: 1.7;
          margin: 0 0 1rem;
        }
        .combined-section .story-body {
          text-align: left;
        }

        .compat-section {
          margin-bottom: 2rem;
        }
        .compat-intro {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: #1A1612;
          text-align: center;
          margin: 0 0 0.3rem;
          line-height: 1.5;
        }
        .compat-score {
          color: #B8953E;
          font-weight: 600;
        }
        .compat-pair-label {
          text-align: center;
          font-size: 0.72rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #857E72;
          margin: 0.3rem 0 1rem;
        }

        .upsell {
          margin-top: 2.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(184,149,62,0.2);
        }
        .upsell p {
          font-family: 'Lora', Georgia, serif;
          font-size: 0.85rem;
          line-height: 1.7;
          color: #857E72;
          margin: 0 0 0.6rem;
          font-style: italic;
        }

        /* ─── Print Styles ─── */
        @media print {
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .gen-wrap, .print-btn {
            display: none !important;
          }
          .story-page {
            max-width: none;
            margin: 0;
            padding: 0.75in 1in;
            border: none;
            box-shadow: none;
            background: white;
            page-break-inside: avoid;
          }
          .story-header h1 {
            font-size: 1.6rem;
          }
          .person-meta h2 {
            font-size: 1.15rem;
          }
          .story-body {
            font-size: 0.88rem;
          }
          .upsell {
            page-break-before: auto;
          }
        }

        @page {
          size: letter;
          margin: 0;
        }
      `}</style>

      {/* Generator Form */}
      <div className="gen-wrap" style={{ display: generated ? "none" : undefined }}>
        <h1 className="gen-title">Moon Story Generator</h1>
        <p className="gen-sub">Internal tool &mdash; generates personalized story pages for orders</p>

        <div className="product-toggle">
          <button
            className={product === "A" ? "active" : ""}
            onClick={() => setProduct("A")}
          >
            A1 / A2 &mdash; Moon Story
          </button>
          <button
            className={product === "B" ? "active" : ""}
            onClick={() => setProduct("B")}
          >
            B1 / B2 &mdash; Cosmic Story
          </button>
        </div>

        <div className="form-section-label">Person 1</div>
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name1}
              onChange={(e) => setName1(e.target.value)}
              placeholder="First name"
            />
          </div>
          <div className="form-group">
            <label>Birth Date</label>
            <input
              type="date"
              value={date1}
              onChange={(e) => setDate1(e.target.value)}
            />
          </div>
        </div>

        <div className="form-section-label">Person 2</div>
        <div className="form-row">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={name2}
              onChange={(e) => setName2(e.target.value)}
              placeholder="First name"
            />
          </div>
          <div className="form-group">
            <label>Birth Date</label>
            <input
              type="date"
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
            />
          </div>
        </div>

        <button className="gen-btn" onClick={handleGenerate}>
          Generate Story Page
        </button>
      </div>

      {/* Preview + Print */}
      {generated && (
        <>
          <div className="gen-wrap">
            <button
              className="print-btn"
              onClick={() => setGenerated(false)}
              style={{ marginBottom: "0.5rem" }}
            >
              &larr; Back to Form
            </button>
            <button className="print-btn" onClick={handlePrint}>
              Save as PDF / Print
            </button>
          </div>
          <div ref={previewRef}>
            <MoonStoryPage
              product={product}
              name1={name1}
              date1={date1}
              name2={name2}
              date2={date2}
            />
          </div>
        </>
      )}
    </>
  );
}
