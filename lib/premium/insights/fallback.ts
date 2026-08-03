/**
 * lib/premium/insights/fallback.ts
 *
 * Deterministic safe fallback used when the AI interpreter fails or
 * returns fewer than the minimum viable set of valid insights.
 *
 * Priority ordering (per approved plan):
 *   1. Strongest grounded insights first.
 *   2. Sufficient chapter coverage across the standard categories.
 *   3. Distinct psychological value — no filler.
 *
 * NOT prioritised: hitting an arbitrary count like 12. A book with 9
 * strong grounded insights beats one with 12 where 3 are filler. The
 * scheduler is designed to handle underfilled chapters gracefully.
 *
 * These rules are small on purpose. They exist so the book still ships
 * when the AI is unavailable — not to replicate the interpreter's nuance.
 */

import type {
  Domain,
  EmotionalTone,
  InsightCategory,
  ReaderInsight,
  Signal,
  SignalKind,
} from "./types";

/**
 * A rule builds the wording bits of the insight. Evidence + id + strength +
 * origin are wired in when we assemble the final ReaderInsight from the
 * matching signal.
 */
type BuiltShape = Omit<ReaderInsight, "id" | "origin" | "evidence" | "strength">;
interface FallbackRule {
  readonly match: (sig: Signal) => boolean;
  readonly build: (sig: Signal) => BuiltShape;
}

/* ─────────────────────────────────────────────────────────────────────
   Helper builders — small, plainly worded, no astrology vocab.
───────────────────────────────────────────────────────────────────── */

function insight(
  pattern: string,
  category: InsightCategory,
  tone: EmotionalTone,
  domains: Domain[],
  bestChapters: string[]
): Omit<ReaderInsight, "id" | "origin" | "evidence" | "strength"> {
  return {
    pattern,
    category,
    emotionalTone: tone,
    behavioralDomains: domains,
    bestChapters: bestChapters as ReaderInsight["bestChapters"],
  };
}

/* ─────────────────────────────────────────────────────────────────────
   Rules — one per common signal shape.
   Each rule produces one plainly worded, generic-but-grounded insight.
   These are NOT meant to feel as nuanced as the AI output. They exist
   to keep the book structurally complete when interpretation fails.
───────────────────────────────────────────────────────────────────── */

const RULES: FallbackRule[] = [
  /* ─── Tight aspects ────────────────────────────────────────────── */
  {
    match: (s) =>
      s.kind === "tight_aspect" &&
      (s.raw.flavor === "hard") &&
      pair(s, "Mars", "Saturn"),
    build: (s) => ({
      ...insight(
        "your drive to move and your instinct to check yourself run through the same nerve",
        "pattern", "vulnerable",
        ["decisions", "conflict", "work"],
        ["inner-fighter", "blind-spot", "growth-lesson"]
      ),
    }),
  },
  {
    match: (s) =>
      s.kind === "tight_aspect" &&
      (s.raw.flavor === "hard") &&
      pair(s, "Sun", "Saturn"),
    build: () => ({
      ...insight(
        "you have felt like you had to earn your own confidence, quietly, for years",
        "shadow", "vulnerable",
        ["private-thoughts", "work", "decisions"],
        ["shadow", "growth-lesson", "real-you"]
      ),
    }),
  },
  {
    match: (s) =>
      s.kind === "tight_aspect" &&
      (s.raw.flavor === "hard") &&
      pair(s, "Venus", "Saturn"),
    build: () => ({
      ...insight(
        "when you love someone, you brace for the moment they might change their mind",
        "fear", "tender",
        ["love", "private-thoughts"],
        ["love-patterns", "shadow"]
      ),
    }),
  },
  {
    match: (s) =>
      s.kind === "tight_aspect" &&
      (s.raw.flavor === "hard") &&
      pair(s, "Moon", "Saturn"),
    build: () => ({
      ...insight(
        "you learned early to hold your softer feelings tightly and let them out on your own schedule",
        "shadow", "quiet",
        ["private-thoughts", "family", "love"],
        ["shadow", "safe-place"]
      ),
    }),
  },
  {
    match: (s) =>
      s.kind === "tight_aspect" &&
      (s.raw.flavor === "soft") &&
      pair(s, "Jupiter", "Sun"),
    build: () => ({
      ...insight(
        "when you decide to bet on yourself, doors open faster than the average person expects",
        "gift", "playful",
        ["work", "decisions"],
        ["hidden-gift", "career"]
      ),
    }),
  },
  {
    match: (s) =>
      s.kind === "tight_aspect" &&
      pair(s, "Venus", "Mars"),
    build: () => ({
      ...insight(
        "what you want and how you go after it don't always agree, and the mismatch is loudest in love",
        "contradiction", "hungry",
        ["love", "desire", "conflict"],
        ["love-patterns", "real-you"]
      ),
    }),
  },
  {
    match: (s) =>
      s.kind === "tight_aspect" &&
      pair(s, "Sun", "Moon"),
    build: () => ({
      ...insight(
        "the person you show the world and the person who runs you inside are wired to different fuels",
        "contradiction", "vulnerable",
        ["private-thoughts", "social-situations"],
        ["real-you", "before-we-begin"]
      ),
    }),
  },
  {
    match: (s) =>
      s.kind === "tight_aspect" &&
      involves(s, "Pluto"),
    build: () => ({
      ...insight(
        "you feel things at a depth most people around you have quietly learned not to notice",
        "strength", "protective",
        ["private-thoughts", "conflict"],
        ["shadow", "inner-fighter"]
      ),
    }),
  },

  /* ─── Angular planets ──────────────────────────────────────────── */
  {
    match: (s) =>
      s.kind === "angular_planet" &&
      s.raw.planet === "Sun" &&
      s.raw.angle === "Ascendant",
    build: () => ({
      ...insight(
        "your presence enters a room before your words do, whether you meant to or not",
        "strength", "fiery",
        ["social-situations", "work", "communication"],
        ["real-you", "before-we-begin"]
      ),
    }),
  },
  {
    match: (s) =>
      s.kind === "angular_planet" &&
      s.raw.planet === "Sun" &&
      s.raw.angle === "Midheaven",
    build: () => ({
      ...insight(
        "your ambition is visible even to people who barely know you",
        "strength", "hungry",
        ["work"],
        ["career", "hidden-gift"]
      ),
    }),
  },
  {
    match: (s) =>
      s.kind === "angular_planet" &&
      s.raw.planet === "Moon",
    build: () => ({
      ...insight(
        "what you feel shows up on your face before you have chosen what to say about it",
        "pattern", "tender",
        ["private-thoughts", "social-situations"],
        ["real-you", "safe-place"]
      ),
    }),
  },
  {
    match: (s) =>
      s.kind === "angular_planet" &&
      s.raw.planet === "Mars",
    build: () => ({
      ...insight(
        "you carry a visible edge that people either lean into or step around",
        "strength", "fiery",
        ["conflict", "social-situations", "work"],
        ["inner-fighter", "real-you"]
      ),
    }),
  },
  {
    match: (s) =>
      s.kind === "angular_planet" &&
      s.raw.planet === "Venus",
    build: () => ({
      ...insight(
        "there is something magnetic about the way you occupy a room, and you are usually the last one to notice it",
        "gift", "playful",
        ["love", "social-situations"],
        ["hidden-gift", "love-patterns"]
      ),
    }),
  },

  /* ─── Element balance ──────────────────────────────────────────── */
  {
    match: (s) => s.kind === "element_balance" && s.raw.element === "fire",
    build: () => ({
      ...insight(
        "your default speed is forward, and the pause is the part you have had to learn",
        "pattern", "fiery",
        ["decisions", "work", "conflict"],
        ["blind-spot", "inner-fighter"]
      ),
    }),
  },
  {
    match: (s) => s.kind === "element_balance" && s.raw.element === "earth",
    build: () => ({
      ...insight(
        "you build things slowly on purpose because you have watched other people build fast and lose it all",
        "strength", "quiet",
        ["work", "money", "routines"],
        ["career", "safe-place"]
      ),
    }),
  },
  {
    match: (s) => s.kind === "element_balance" && s.raw.element === "air",
    build: () => ({
      ...insight(
        "you think through your feelings before you feel them, and sometimes you skip the feeling part entirely",
        "pattern", "quiet",
        ["private-thoughts", "communication"],
        ["real-you", "shadow"]
      ),
    }),
  },
  {
    match: (s) => s.kind === "element_balance" && s.raw.element === "water",
    build: () => ({
      ...insight(
        "you feel everything in the room, whether you signed up to or not",
        "pattern", "tender",
        ["private-thoughts", "social-situations", "love"],
        ["shadow", "safe-place"]
      ),
    }),
  },

  /* ─── Element missing ──────────────────────────────────────────── */
  {
    match: (s) => s.kind === "element_missing" && s.raw.element === "water",
    build: () => ({
      ...insight(
        "you have always been quietly drawn to people who feel things more openly than you allow yourself to",
        "desire", "hungry",
        ["love", "friendships", "desire"],
        ["love-patterns", "shadow"]
      ),
    }),
  },
  {
    match: (s) => s.kind === "element_missing" && s.raw.element === "fire",
    build: () => ({
      ...insight(
        "you envy the people who don't overthink before they act, and you're closer to being one than you think",
        "desire", "hungry",
        ["decisions", "desire"],
        ["growth-lesson", "hidden-gift"]
      ),
    }),
  },
  {
    match: (s) => s.kind === "element_missing" && s.raw.element === "earth",
    build: () => ({
      ...insight(
        "you are looking for a version of stability you have never quite been shown",
        "desire", "vulnerable",
        ["money", "routines", "love"],
        ["safe-place", "growth-lesson"]
      ),
    }),
  },
  {
    match: (s) => s.kind === "element_missing" && s.raw.element === "air",
    build: () => ({
      ...insight(
        "you get impatient with people who need everything explained back to them three times",
        "pattern", "fiery",
        ["communication", "conflict"],
        ["blind-spot"]
      ),
    }),
  },

  /* ─── Modality balance ─────────────────────────────────────────── */
  {
    match: (s) => s.kind === "modality_balance" && s.raw.modality === "cardinal",
    build: () => ({
      ...insight(
        "you start more things than most people do, and finishing them is the part that costs you",
        "pattern", "fiery",
        ["work", "decisions"],
        ["blind-spot", "growth-lesson"]
      ),
    }),
  },
  {
    match: (s) => s.kind === "modality_balance" && s.raw.modality === "fixed",
    build: () => ({
      ...insight(
        "once you commit to something, moving you off it takes more than a good argument",
        "strength", "protective",
        ["work", "love", "decisions"],
        ["real-you", "inner-fighter"]
      ),
    }),
  },
  {
    match: (s) => s.kind === "modality_balance" && s.raw.modality === "mutable",
    build: () => ({
      ...insight(
        "you shape-shift depending on the room, and half the time you don't notice you're doing it",
        "pattern", "quiet",
        ["social-situations", "work"],
        ["real-you", "shadow"]
      ),
    }),
  },

  /* ─── Modality missing ─────────────────────────────────────────── */
  {
    match: (s) => s.kind === "modality_missing" && s.raw.modality === "fixed",
    build: () => ({
      ...insight(
        "commitment scares you less than being stuck does, and you'll leave a good situation to avoid feeling trapped",
        "fear", "vulnerable",
        ["love", "work", "decisions"],
        ["growth-lesson", "love-patterns"]
      ),
    }),
  },
  {
    match: (s) => s.kind === "modality_missing" && s.raw.modality === "mutable",
    build: () => ({
      ...insight(
        "you have a hard time adjusting mid-plan, and it costs you when the plan needed to change",
        "growth-edge", "quiet",
        ["decisions", "work"],
        ["growth-lesson"]
      ),
    }),
  },

  /* ─── Personal planet placements ───────────────────────────────── */
  {
    match: (s) => s.kind === "personal_planet_placement" && s.raw.planet === "Mercury",
    build: () => ({
      ...insight(
        "your mind runs in a specific shape and it gets impatient with conversations that don't move fast enough",
        "pattern", "quiet",
        ["communication", "private-thoughts"],
        ["real-you"]
      ),
    }),
  },
  {
    match: (s) => s.kind === "personal_planet_placement" && s.raw.planet === "Venus",
    build: () => ({
      ...insight(
        "what you find beautiful is very specific, and people who don't get it don't stay long",
        "desire", "playful",
        ["love", "desire"],
        ["love-patterns"]
      ),
    }),
  },
  {
    match: (s) => s.kind === "personal_planet_placement" && s.raw.planet === "Mars",
    build: () => ({
      ...insight(
        "you don't fight loudly, you fight decisively, and people usually only find out afterwards",
        "strength", "protective",
        ["conflict", "decisions"],
        ["inner-fighter"]
      ),
    }),
  },

  /* ─── Contradictions ───────────────────────────────────────────── */
  {
    match: (s) => s.kind === "contradiction_sun_moon_element",
    build: () => ({
      ...insight(
        "the version of you people meet at the door is not the version that runs the house inside",
        "contradiction", "vulnerable",
        ["private-thoughts", "social-situations"],
        ["real-you", "before-we-begin"]
      ),
    }),
  },
  {
    match: (s) => s.kind === "contradiction_venus_mars_mode",
    build: () => ({
      ...insight(
        "you want love that comes toward you and love that lets you chase, sometimes in the same week",
        "contradiction", "hungry",
        ["love", "desire"],
        ["love-patterns"]
      ),
    }),
  },
];

function involves(sig: Signal, planet: string): boolean {
  const p1 = String(sig.raw.planet1 ?? "");
  const p2 = String(sig.raw.planet2 ?? "");
  return p1 === planet || p2 === planet;
}

function pair(sig: Signal, a: string, b: string): boolean {
  return involves(sig, a) && involves(sig, b);
}

/* ─────────────────────────────────────────────────────────────────────
   PUBLIC
───────────────────────────────────────────────────────────────────── */

/**
 * Build fallback insights from selected signals. Prioritises strongest
 * grounded coverage over hitting an arbitrary count. Returned insights
 * carry origin: "fallback".
 *
 * De-dupe by pattern text so we don't ship two rules that produced the
 * same wording from different signals.
 */
export function buildFallbackInsights(signals: readonly Signal[]): ReaderInsight[] {
  // Consider signals in strength order.
  const ordered = [...signals].sort((a, b) => b.strength - a.strength);
  const out: ReaderInsight[] = [];
  const seenPatterns = new Set<string>();

  for (const sig of ordered) {
    for (const rule of RULES) {
      if (!rule.match(sig)) continue;
      const built = rule.build(sig);
      if (seenPatterns.has(built.pattern)) continue;
      seenPatterns.add(built.pattern);
      out.push({
        id: `fb_${sig.id}`,
        origin: "fallback",
        evidence: { primary: sig.id, supporting: [] },
        strength: Math.min(1, sig.strength * 0.85),
        ...built,
      });
      break; // one insight per signal from fallback
    }
  }

  return out;
}
