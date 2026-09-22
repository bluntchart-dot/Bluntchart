/**
 * lib/tarot/spreads.ts
 *
 * Spread layout definitions. Each spread defines positions
 * and how many cards to draw.
 */

export interface SpreadPosition {
  readonly label: string;
  readonly meaning: string;
}

export interface SpreadLayout {
  readonly id: string;
  readonly name: string;
  readonly positions: readonly SpreadPosition[];
  readonly description: string;
}

export const SINGLE_CARD: SpreadLayout = {
  id: "single",
  name: "Single Card Pull",
  positions: [
    { label: "Your Card", meaning: "The message the cards have for you right now" },
  ],
  description: "One card, one truth. No hiding.",
};

export const THREE_CARD: SpreadLayout = {
  id: "three-card",
  name: "Past, Present, Future",
  positions: [
    { label: "Past", meaning: "What shaped the current situation" },
    { label: "Present", meaning: "Where you are right now" },
    { label: "Future", meaning: "Where this is headed if you stay on this path" },
  ],
  description: "Three cards that tell the story of where you have been, where you are, and where you are going.",
};

export const YES_NO: SpreadLayout = {
  id: "yes-no",
  name: "Yes or No",
  positions: [
    { label: "The Answer", meaning: "A direct answer to your question" },
  ],
  description: "One card. One answer. No sugarcoating.",
};

export const LOVE_SPREAD: SpreadLayout = {
  id: "love",
  name: "Love Reading",
  positions: [
    { label: "You", meaning: "Your energy in love right now" },
    { label: "Them (or the next person)", meaning: "The energy of the person in question or who is coming" },
    { label: "The Connection", meaning: "What is between you" },
    { label: "The Challenge", meaning: "What is getting in the way" },
    { label: "The Outcome", meaning: "Where this is heading" },
  ],
  description: "Five cards that map the full picture of your love situation.",
};

export const CAREER_SPREAD: SpreadLayout = {
  id: "career",
  name: "Career Crossroads",
  positions: [
    { label: "Current Position", meaning: "Where you are in your career right now" },
    { label: "The Block", meaning: "What is holding you back" },
    { label: "Hidden Strength", meaning: "A talent or resource you are underusing" },
    { label: "The Move", meaning: "The action the cards are pointing you toward" },
  ],
  description: "Four cards that cut through career confusion.",
};

export const SPREADS: Record<string, SpreadLayout> = {
  single: SINGLE_CARD,
  "three-card": THREE_CARD,
  "yes-no": YES_NO,
  love: LOVE_SPREAD,
  career: CAREER_SPREAD,
};

export function getSpread(id: string): SpreadLayout | null {
  return SPREADS[id] ?? null;
}
