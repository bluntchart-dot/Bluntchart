/**
 * lib/moon-story-html.ts
 *
 * Generates self-contained moon story HTML pages for A1/A2 (Moon Story)
 * and B1/B2 (Cosmic Story) products. The output is a standalone HTML
 * file that can be printed to PDF or downloaded directly.
 *
 * Runs server-side (no DOM/canvas needed) — pure string template.
 */

import { getMoonPhase, calculateCompatibility } from "@/lib/moon-phase";
import type { PhaseCategory } from "@/lib/moon-phase";
import { getZodiacSign, getElementPairKey, getElementCompatScore } from "@/lib/zodiac";
import {
  PHASE_PERSONALITIES,
  SOULMATE_INTERPRETATIONS,
  ZODIAC_PERSONALITIES,
  ELEMENT_COMPATIBILITY,
  UPSELL_A,
  UPSELL_B,
} from "@/lib/moon-story-content";

export type MoonStoryProduct = "a1" | "a2" | "b1" | "b2";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

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

function combinedPhaseCategory(phaseAngle1: number, phaseAngle2: number): PhaseCategory {
  const avg = (phaseAngle1 + phaseAngle2) / 2;
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

/* ─── SVG Builders ─── */

const MOON_PHASES_LIT: Record<PhaseCategory, string | null> = {
  new: null,
  "waxing-crescent": "M24 4A20 20 0 0 1 24 44A12 20 0 0 1 24 4Z",
  "first-quarter": "M24 4A20 20 0 0 1 24 44L24 4Z",
  "waxing-gibbous": "M24 4A20 20 0 0 1 24 44A12 20 0 0 0 24 4Z",
  full: null,
  "waning-gibbous": "M24 4A20 20 0 0 0 24 44A12 20 0 0 1 24 4Z",
  "third-quarter": "M24 4A20 20 0 0 0 24 44L24 4Z",
  "waning-crescent": "M24 4A20 20 0 0 0 24 44A12 20 0 0 0 24 4Z",
};

function moonSvg(phase: PhaseCategory, size: number, uid: string): string {
  const isLit = phase === "full" || phase === "waxing-gibbous" || phase === "waning-gibbous";
  const glow = isLit
    ? `drop-shadow(0 0 ${Math.round(size * 0.18)}px rgba(215,200,165,0.5)) drop-shadow(0 0 ${Math.round(size * 0.06)}px rgba(215,200,165,0.3))`
    : `drop-shadow(0 0 ${Math.round(size * 0.05)}px rgba(180,170,145,0.2))`;

  let litPortion = "";
  if (phase === "full") {
    litPortion = `<circle cx="24" cy="24" r="20" fill="url(#${uid}-lit)"/>`;
  } else if (phase !== "new" && MOON_PHASES_LIT[phase]) {
    litPortion = `<path d="${MOON_PHASES_LIT[phase]}" fill="url(#${uid}-lit)"/>`;
  }

  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" style="filter: ${glow}; flex-shrink: 0" aria-hidden="true">
  <defs>
    <radialGradient id="${uid}-dark" cx="40%" cy="40%"><stop offset="0%" stop-color="#3A342A"/><stop offset="60%" stop-color="#252018"/><stop offset="100%" stop-color="#1A1610"/></radialGradient>
    <radialGradient id="${uid}-lit" cx="45%" cy="40%"><stop offset="0%" stop-color="#F0E8D4"/><stop offset="50%" stop-color="#DDD3B8"/><stop offset="100%" stop-color="#C4B898"/></radialGradient>
    <clipPath id="${uid}-clip"><circle cx="24" cy="24" r="20"/></clipPath>
  </defs>
  <circle cx="24" cy="24" r="20" fill="url(#${uid}-dark)"/>
  ${litPortion}
  <g clip-path="url(#${uid}-clip)" opacity="0.12"><circle cx="28" cy="16" r="3.5" fill="#8A7E68"/><circle cx="18" cy="28" r="4.2" fill="#8A7E68"/><circle cx="30" cy="30" r="2.2" fill="#8A7E68"/><circle cx="22" cy="12" r="1.8" fill="#8A7E68"/><circle cx="14" cy="20" r="2.8" fill="#8A7E68"/><circle cx="32" cy="22" r="1.5" fill="#8A7E68"/><circle cx="20" cy="36" r="2" fill="#8A7E68"/></g>
  <circle cx="24" cy="24" r="19.5" fill="none" stroke="rgba(210,200,175,0.2)" stroke-width="0.8"/>
</svg>`;
}

function illuminationMoonSvg(illumination: number, size: number, uid: string): string {
  const f = Math.max(0, Math.min(100, illumination)) / 100;
  const addGlow = f > 0.6;
  const glow = addGlow
    ? `drop-shadow(0 0 ${Math.round(size * 0.18)}px rgba(215,200,165,0.5)) drop-shadow(0 0 ${Math.round(size * 0.06)}px rgba(215,200,165,0.3))`
    : `drop-shadow(0 0 ${Math.round(size * 0.05)}px rgba(180,170,145,0.2))`;

  let litPortion = "";
  if (f >= 0.995) {
    litPortion = `<circle cx="24" cy="24" r="20" fill="url(#${uid}-lit)"/>`;
  } else if (f <= 0.005) {
    litPortion = "";
  } else if (Math.abs(f - 0.5) < 0.005) {
    litPortion = `<path d="M24 4A20 20 0 0 1 24 44L24 4Z" fill="url(#${uid}-lit)"/>`;
  } else {
    const rx = (20 * Math.abs(2 * f - 1)).toFixed(2);
    const sweep = f > 0.5 ? 0 : 1;
    litPortion = `<path d="M24 4A20 20 0 0 1 24 44A${rx} 20 0 0 ${sweep} 24 4Z" fill="url(#${uid}-lit)"/>`;
  }

  return `<svg viewBox="0 0 48 48" width="${size}" height="${size}" style="filter: ${glow}; flex-shrink: 0" aria-hidden="true">
  <defs>
    <radialGradient id="${uid}-dark" cx="40%" cy="40%"><stop offset="0%" stop-color="#3A342A"/><stop offset="60%" stop-color="#252018"/><stop offset="100%" stop-color="#1A1610"/></radialGradient>
    <radialGradient id="${uid}-lit" cx="45%" cy="40%"><stop offset="0%" stop-color="#F0E8D4"/><stop offset="50%" stop-color="#DDD3B8"/><stop offset="100%" stop-color="#C4B898"/></radialGradient>
    <clipPath id="${uid}-clip"><circle cx="24" cy="24" r="20"/></clipPath>
  </defs>
  <circle cx="24" cy="24" r="20" fill="url(#${uid}-dark)"/>
  ${litPortion}
  <g clip-path="url(#${uid}-clip)" opacity="0.12"><circle cx="28" cy="16" r="3.5" fill="#8A7E68"/><circle cx="18" cy="28" r="4.2" fill="#8A7E68"/><circle cx="30" cy="30" r="2.2" fill="#8A7E68"/><circle cx="22" cy="12" r="1.8" fill="#8A7E68"/><circle cx="14" cy="20" r="2.8" fill="#8A7E68"/><circle cx="32" cy="22" r="1.5" fill="#8A7E68"/><circle cx="20" cy="36" r="2" fill="#8A7E68"/></g>
  <circle cx="24" cy="24" r="19.5" fill="none" stroke="rgba(210,200,175,0.2)" stroke-width="0.8"/>
</svg>`;
}

/* ─── CSS (shared across A & B templates) ─── */

const SHARED_CSS = `
@page { size: letter; margin: 0; }
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { background: #F5F0E6; }
body {
  font-family: 'Source Sans 3', system-ui, sans-serif;
  color: #1A1612;
  line-height: 1.7;
  max-width: 650px;
  margin: 0 auto;
  padding: 2.8rem 2.5rem 2rem;
}
.header { text-align: center; margin-bottom: 2.2rem; }
.rule { height: 1px; background: rgba(184,149,62,0.25); max-width: 120px; margin: 0 auto; }
.header h1 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.7rem;
  font-weight: 600;
  color: #B8953E;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin: 0.7rem 0;
}
.person { margin-bottom: 1.6rem; }
.person-intro { display: flex; align-items: flex-start; gap: 1.1rem; margin-bottom: 0.8rem; }
.person-intro svg { flex-shrink: 0; }
.person-meta h2 {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: #1A1612;
  margin: 0 0 0.1rem;
}
.zodiac-badge {
  font-size: 0.82rem;
  color: #8A5E4A;
  font-weight: 400;
  font-style: italic;
}
.meta-date { font-size: 0.82rem; color: #857E72; }
.meta-phase { font-size: 0.76rem; color: #AFA899; font-style: italic; margin-top: 0.05rem; }
.body-text {
  font-family: 'Lora', Georgia, serif;
  font-size: 0.88rem;
  line-height: 1.85;
  color: #3D3830;
}
.divider {
  text-align: center;
  padding: 1.3rem 0;
  color: #B8953E;
  font-size: 0.7rem;
  letter-spacing: 0.6rem;
  opacity: 0.65;
}
.combined { text-align: center; margin-bottom: 1.6rem; }
.combined svg { margin-bottom: 0.8rem; }
.combined-lead {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1rem;
  font-weight: 400;
  font-style: italic;
  color: #3D3830;
  line-height: 1.7;
  margin: 0 0 1rem;
  max-width: 520px;
  margin-inline: auto;
}
.combined .body-text { text-align: left; }
.compat { text-align: center; margin-bottom: 1.6rem; }
.compat-intro {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1A1612;
  line-height: 1.5;
  margin: 0 0 0.2rem;
}
.compat-score { color: #B8953E; font-weight: 600; }
.compat-pair {
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #857E72;
  margin: 0.2rem 0 1rem;
}
.compat .body-text { text-align: left; }
.upsell {
  margin-top: 1.8rem;
  padding-top: 1.2rem;
  border-top: 1px solid rgba(184,149,62,0.2);
}
.upsell p {
  font-family: 'Lora', Georgia, serif;
  font-size: 0.8rem;
  line-height: 1.7;
  color: #857E72;
  font-style: italic;
  margin: 0 0 0.5rem;
}
`;

const FONT_LINK = `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Lora:ital,wght@0,400;0,500;1,400&family=Source+Sans+3:wght@300;400;500;600&display=swap">`;

/* ─── Main Generator ─── */

export interface MoonStoryInput {
  product: MoonStoryProduct;
  name1: string;
  date1: string;
  name2: string;
  date2: string;
}

export function generateMoonStoryHtml(input: MoonStoryInput): string {
  const { product, name1, date1, name2, date2 } = input;
  const isA = product === "a1" || product === "a2";

  const moon1 = getMoonPhase(date1);
  const moon2 = getMoonPhase(date2);
  const compat = calculateCompatibility(date1, date2);

  const title = isA
    ? `Your Moon Story &mdash; ${escapeHtml(name1)} &amp; ${escapeHtml(name2)}`
    : `Your Cosmic Story &mdash; ${escapeHtml(name1)} &amp; ${escapeHtml(name2)}`;

  const heading = isA ? "Your Moon Story" : "Your Cosmic Story";

  // Person sections
  const zodiac1 = getZodiacSign(date1);
  const zodiac2 = getZodiacSign(date2);

  const person1NameHtml = isA
    ? escapeHtml(name1)
    : `${escapeHtml(name1)} <span class="zodiac-badge">${escapeHtml(zodiac1.sign)}</span>`;
  const person2NameHtml = isA
    ? escapeHtml(name2)
    : `${escapeHtml(name2)} <span class="zodiac-badge">${escapeHtml(zodiac2.sign)}</span>`;

  const person1Body = isA
    ? PHASE_PERSONALITIES[moon1.phaseCategory]
    : `${ZODIAC_PERSONALITIES[zodiac1.sign]} ${PHASE_PERSONALITIES[moon1.phaseCategory]}`;
  const person2Body = isA
    ? PHASE_PERSONALITIES[moon2.phaseCategory]
    : `${ZODIAC_PERSONALITIES[zodiac2.sign]} ${PHASE_PERSONALITIES[moon2.phaseCategory]}`;

  // Soulmate / compatibility section
  let middleSection: string;
  if (isA) {
    const combinedPhase = combinedPhaseCategory(moon1.phaseAngle, moon2.phaseAngle);
    const combinedIllum = compat.score;
    middleSection = `
<div class="combined">
  ${illuminationMoonSvg(combinedIllum, 110, "mh")}
  <p class="combined-lead">When we brought your moons together, something new appeared, a ${phaseFriendlyName(combinedPhase)} at ${combinedIllum}% illumination. A moon that has never hung in any sky. Your Soulmate Moon.</p>
  <p class="body-text">${escapeHtml(SOULMATE_INTERPRETATIONS[combinedPhase])}</p>
</div>`;
  } else {
    const elementKey = getElementPairKey(zodiac1.element, zodiac2.element);
    const compatScore = getElementCompatScore(zodiac1.element, zodiac2.element);
    middleSection = `
<div class="compat">
  <p class="compat-intro">Together: ${escapeHtml(zodiac1.sign)} and ${escapeHtml(zodiac2.sign)}.<br><span class="compat-score">Your compatibility score: ${compatScore}%.</span></p>
  <p class="compat-pair">${escapeHtml(elementKey)}</p>
  <p class="body-text">${escapeHtml(ELEMENT_COMPATIBILITY[elementKey] ?? "")}</p>
</div>`;
  }

  const upsellText = isA ? UPSELL_A : UPSELL_B;
  const upsellHtml = upsellText
    .split("\n\n")
    .map((p) => `  <p>${escapeHtml(p).replace(/→/g, "&rarr;")}</p>`)
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
${FONT_LINK}
<style>${SHARED_CSS}</style>
</head>
<body>

<div class="header">
  <div class="rule"></div>
  <h1>${heading}</h1>
  <div class="rule"></div>
</div>

<div class="person">
  <div class="person-intro">
    ${moonSvg(moon1.phaseCategory, isA ? 90 : 85, "m1")}
    <div class="person-meta">
      <h2>${person1NameHtml}</h2>
      <p class="meta-date">${formatDate(date1)}</p>
      <p class="meta-phase">${phaseFriendlyName(moon1.phaseCategory)}, ${moon1.illuminationPercent}% illuminated</p>
    </div>
  </div>
  <p class="body-text">${escapeHtml(person1Body)}</p>
</div>

<div class="person">
  <div class="person-intro">
    ${moonSvg(moon2.phaseCategory, isA ? 90 : 85, "m2")}
    <div class="person-meta">
      <h2>${person2NameHtml}</h2>
      <p class="meta-date">${formatDate(date2)}</p>
      <p class="meta-phase">${phaseFriendlyName(moon2.phaseCategory)}, ${moon2.illuminationPercent}% illuminated</p>
    </div>
  </div>
  <p class="body-text">${escapeHtml(person2Body)}</p>
</div>

<div class="divider">&#10022; &nbsp; &#10022; &nbsp; &#10022;</div>

${middleSection}

<div class="upsell">
${upsellHtml}
</div>

</body>
</html>`;
}

export function buildMoonStoryFilename(
  product: MoonStoryProduct,
  name1: string,
  name2: string
): string {
  const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 20);
  const type = product === "a1" || product === "a2" ? "moon-story" : "cosmic-story";
  return `${type}-${slug(name1)}-${slug(name2)}.html`;
}
