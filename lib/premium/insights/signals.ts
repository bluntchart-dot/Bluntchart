/**
 * lib/premium/insights/signals.ts
 *
 * Metadata about each SignalKind — what shapes of psychology it can
 * plausibly ground.
 *
 * This is the PRIMARY deterministic grounding check. When the AI attaches
 * a signal ID to an insight, the validator asks: "does this signal kind
 * make sense for this insight's category / domain / tone?" If the answer
 * is no on ALL cited signals, the insight is dropped.
 *
 * The anchor keyword list is a SECONDARY confidence signal — it is not
 * used as a hard gate. An otherwise well-grounded insight is not rejected
 * merely because it lacks a literal anchor keyword. (Doing so would
 * accidentally re-introduce template language via the validator.)
 *
 * Keep this table small and honest. Adding a category to a signal kind
 * because the AI wrote something clever is how we lose the guardrail.
 */

import type { SignalKind, SignalKindMetadata } from "./types";

export const SIGNAL_KIND_METADATA: Record<SignalKind, SignalKindMetadata> = {
  /* ─── Tight aspects (orb < 5°) ──────────────────────────────────── */
  tight_aspect: {
    compatibleCategories: [
      "pattern",
      "shadow",
      "growth-edge",
      "contradiction",
      "strength",
    ],
    compatibleDomains: [
      "decisions",
      "conflict",
      "communication",
      "work",
      "love",
      "private-thoughts",
      "desire",
    ],
    compatibleTones: [
      "fiery",
      "vulnerable",
      "protective",
      "hungry",
      "quiet",
      "tender",
    ],
    anchorKeywords: [
      "drive", "hold", "pull", "push", "brake", "tension", "friction",
      "clash", "reach", "resist", "hesitate", "patience", "delay",
      "restraint", "doubt", "block", "melt", "dissolve",
    ],
  },

  /* ─── Angular planet (near ASC/MC/DC/IC) ────────────────────────── */
  angular_planet: {
    compatibleCategories: [
      "strength",
      "gift",
      "pattern",
      "contradiction",
      "desire",
    ],
    compatibleDomains: [
      "work",
      "social-situations",
      "communication",
      "decisions",
      "private-thoughts",
    ],
    compatibleTones: ["fiery", "hungry", "protective", "playful", "quiet"],
    anchorKeywords: [
      "visible", "presence", "seen", "public", "room", "first impression",
      "front", "spotlight", "walks in", "enters", "meets people",
    ],
  },

  /* ─── Element balance (one element clearly dominant) ────────────── */
  element_balance: {
    compatibleCategories: [
      "strength",
      "pattern",
      "contradiction",
      "gift",
      "shadow",
    ],
    compatibleDomains: [
      "decisions",
      "communication",
      "routines",
      "social-situations",
      "private-thoughts",
      "work",
      "love",
    ],
    compatibleTones: ["fiery", "quiet", "playful", "protective", "hungry"],
    anchorKeywords: [
      "pace", "temperature", "engine", "rhythm", "energy", "processes",
      "moves through", "runs on", "operates", "leads with",
    ],
  },

  /* ─── Element missing (an element notably absent) ───────────────── */
  element_missing: {
    compatibleCategories: ["desire", "fear", "growth-edge", "shadow", "pattern"],
    compatibleDomains: [
      "love",
      "friendships",
      "communication",
      "decisions",
      "desire",
      "private-thoughts",
    ],
    compatibleTones: ["hungry", "vulnerable", "quiet", "tender"],
    anchorKeywords: [
      "reach", "chase", "long for", "hungry", "missing", "seek",
      "attracted to", "drawn to", "pull toward",
    ],
  },

  /* ─── Modality balance (cardinal/fixed/mutable dominance) ───────── */
  modality_balance: {
    compatibleCategories: ["pattern", "strength", "shadow", "growth-edge"],
    compatibleDomains: [
      "decisions",
      "work",
      "routines",
      "communication",
      "conflict",
    ],
    compatibleTones: ["fiery", "protective", "quiet", "hungry"],
    anchorKeywords: [
      "start", "finish", "hold", "adapt", "change", "commit", "shift",
      "sustain", "initiate", "carry through", "let go",
    ],
  },

  /* ─── Modality missing ──────────────────────────────────────────── */
  modality_missing: {
    compatibleCategories: ["pattern", "growth-edge", "desire", "fear"],
    compatibleDomains: [
      "decisions",
      "work",
      "communication",
      "conflict",
      "routines",
    ],
    compatibleTones: ["hungry", "vulnerable", "quiet"],
    anchorKeywords: [
      "start", "finish", "hold", "commit", "adapt", "leave", "stay",
    ],
  },

  /* ─── Personal planet placement (Mercury/Venus/Mars sign+house) ─ */
  personal_planet_placement: {
    compatibleCategories: [
      "strength",
      "pattern",
      "desire",
      "gift",
      "shadow",
      "contradiction",
      "restoration",
    ],
    compatibleDomains: [
      "love",
      "communication",
      "decisions",
      "work",
      "friendships",
      "desire",
      "conflict",
      "private-thoughts",
      "routines",
      "social-situations",
    ],
    compatibleTones: [
      "fiery",
      "tender",
      "playful",
      "vulnerable",
      "protective",
      "hungry",
      "quiet",
    ],
    anchorKeywords: [
      "mind", "voice", "words", "attract", "want", "love", "desire",
      "chase", "protect", "pursue", "act", "decide", "speak", "listen",
    ],
  },

  /* ─── Contradiction: Sun/Moon element clash ─────────────────────── */
  contradiction_sun_moon_element: {
    compatibleCategories: ["contradiction", "pattern", "shadow", "growth-edge"],
    compatibleDomains: [
      "private-thoughts",
      "social-situations",
      "love",
      "friendships",
      "decisions",
    ],
    compatibleTones: ["vulnerable", "quiet", "tender", "hungry"],
    anchorKeywords: [
      "outside", "inside", "underneath", "surface", "public", "private",
      "presented", "hidden", "shown", "kept", "gap", "seam",
    ],
  },

  /* ─── Contradiction: Venus/Mars mode clash ──────────────────────── */
  contradiction_venus_mars_mode: {
    compatibleCategories: ["contradiction", "pattern", "desire"],
    compatibleDomains: ["love", "desire", "conflict", "communication"],
    compatibleTones: ["hungry", "vulnerable", "fiery", "playful"],
    anchorKeywords: [
      "want", "chase", "attract", "pursue", "wait", "pull", "push",
      "receive", "reach", "hold back", "give in",
    ],
  },
};

/**
 * Astrology vocabulary that must never appear in an insight's `pattern`
 * text. If any of these appear, the validator drops the insight.
 * Kept case-insensitive; regex boundaries applied at match time.
 */
export const ASTROLOGY_VOCAB: readonly string[] = [
  // planets
  "sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn",
  "uranus", "neptune", "pluto", "chiron",
  // signs
  "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra",
  "scorpio", "sagittarius", "capricorn", "aquarius", "pisces",
  // structural
  "ascendant", "descendant", "midheaven", "imum coeli", "north node",
  "south node", "house", "houses", "degree", "degrees",
  // aspects
  "conjunct", "conjunction", "square", "trine", "sextile", "opposition",
  "opposing", "aspect", "aspects", "orb", "retrograde",
  // meta
  "placement", "placements", "chart", "natal", "zodiac", "horoscope",
  "cosmic", "cusp",
];

/**
 * Aphorism patterns to detect at the pattern level. Kept short — most
 * aphorism policing lives at the QA layer, not here. This catches only
 * the most obvious universal maxims that leaked into an insight.
 */
export const APHORISM_PATTERNS: readonly RegExp[] = [
  /trust the process/i,
  /you are exactly where you need to be/i,
  /the universe (has|is|will|wants)/i,
  /(everything|it all) happens for a reason/i,
  /^(be|do) yourself\b/i,
];
