/**
 * lib/tarot/draw.ts
 *
 * Deterministic card drawing using order-ID-seeded PRNG.
 * Same order ID always produces the same cards — reproducible
 * for customer support and redelivery.
 */

import type { TarotCard } from "./deck";
import { FULL_DECK, MAJOR_ARCANA_ONLY } from "./deck";

/* ═════════════════════════════════════════════════════════════════
   SEEDED PRNG (mulberry32)
   Simple, fast, deterministic. Takes a 32-bit seed.
═════════════════════════════════════════════════════════════════ */

function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return hash;
}

/* ═════════════════════════════════════════════════════════════════
   DRAWN CARD
═════════════════════════════════════════════════════════════════ */

export interface DrawnCard {
  readonly card: TarotCard;
  readonly orientation: "upright" | "reversed";
  readonly position?: string;
}

/* ═════════════════════════════════════════════════════════════════
   DRAW FUNCTIONS
═════════════════════════════════════════════════════════════════ */

function shuffleDeck(
  deck: readonly TarotCard[],
  rng: () => number
): TarotCard[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export interface DrawOptions {
  seed: string;
  count: number;
  majorOnly?: boolean;
  allowReversed?: boolean;
  positions?: readonly string[];
}

export function drawCards(options: DrawOptions): DrawnCard[] {
  const { seed, count, majorOnly = false, allowReversed = true, positions } = options;

  const rng = mulberry32(hashString(seed));
  const sourceDeck = majorOnly ? MAJOR_ARCANA_ONLY : FULL_DECK;
  const shuffled = shuffleDeck(sourceDeck, rng);

  const drawn: DrawnCard[] = [];
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const orientation = allowReversed && rng() < 0.3 ? "reversed" : "upright";
    drawn.push({
      card: shuffled[i],
      orientation,
      position: positions?.[i],
    });
  }

  return drawn;
}

export function drawYesNo(seed: string): {
  card: DrawnCard;
  answer: "yes" | "no" | "maybe";
  confidence: string;
} {
  const [drawn] = drawCards({ seed, count: 1, majorOnly: true, allowReversed: true });

  const positiveCards = new Set([
    "The Sun", "The Star", "The World", "The Empress", "The Magician",
    "Wheel of Fortune", "The Lovers", "Strength", "Temperance",
  ]);
  const negativeCards = new Set([
    "The Tower", "Death", "The Devil", "The Moon",
    "The Hanged Man", "The Hermit",
  ]);

  let answer: "yes" | "no" | "maybe";
  let confidence: string;

  if (drawn.orientation === "reversed") {
    if (positiveCards.has(drawn.card.name)) {
      answer = "maybe";
      confidence = "Leaning no, but there is room for change.";
    } else {
      answer = "no";
      confidence = "The cards are clear on this one.";
    }
  } else {
    if (positiveCards.has(drawn.card.name)) {
      answer = "yes";
      confidence = "Strong yes. The energy is aligned.";
    } else if (negativeCards.has(drawn.card.name)) {
      answer = "no";
      confidence = "Not right now. Something needs to shift first.";
    } else {
      answer = "maybe";
      confidence = "It depends on what you do next.";
    }
  }

  return { card: drawn, answer, confidence };
}
