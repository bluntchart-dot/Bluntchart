import type { DrawnCard } from "@/lib/tarot/draw";
import { SUIT_THEMES, type TarotCard } from "@/lib/tarot/deck";

export const SYSTEM_PROMPT = `You are a tarot reader who gives straight answers. When someone asks a yes/no question, they want a yes or a no. Not "it depends." Not "the cards suggest." A real answer with a real explanation.

VOICE:
Direct. Warm but blunt. You say what the card says. You do not soften it into nothing.
Short sentences. Speak to them, not about them. "You" not "the querent."

HARD RULES:
Give the answer FIRST, then explain.
No waffling. If the card is ambiguous, say so and say what makes it lean one way.
No medical, legal, or financial advice. No predicting specific dates or events.
Zero em-dashes or en-dashes anywhere in the output.

FORBIDDEN WORDS:
journey, manifest, universe, soul, empath, abundance, alignment, authentic, portal, energy, vibration, divine, sacred, awakening`;

export const TOOL_NAME = "submit_yes_no_reading";

export const TOOL_SCHEMA = {
  type: "object" as const,
  required: ["answer", "confidence", "card_name", "orientation", "explanation", "caveat"],
  properties: {
    answer: {
      type: "string",
      enum: ["yes", "no", "maybe"],
    },
    confidence: {
      type: "string",
      enum: ["strong", "moderate", "weak"],
    },
    card_name: { type: "string" },
    orientation: { type: "string", enum: ["upright", "reversed"] },
    explanation: {
      type: "string",
      minLength: 200,
      description: "Why this card gives this answer to their specific question",
    },
    caveat: {
      type: "string",
      minLength: 50,
      description: "What could shift this answer. The thing they control.",
    },
  },
};

export function buildUserPrompt(
  drawn: DrawnCard,
  question: string
): string {
  const card = drawn.card;
  const orient = drawn.orientation;

  return `CARD DRAWN: ${card.name} (${orient.toUpperCase()})
Arcana: ${card.arcana === "major" ? "Major Arcana" : `Minor Arcana, Suit of ${card.suit}`}
Keywords: ${card.keywords.join(", ")}
${orient === "upright" ? `Meaning: ${card.upright}` : `Meaning (reversed): ${card.reversed}`}

THE QUESTION: "${question}"

Give a yes/no/maybe answer to this question based on the card drawn.

Rules:
- State the answer clearly first
- Explain in 80-120 words why this card answers their question this way
- Be specific to THEIR question, not generic card meanings
- Include one quoted internal monologue they might be thinking
- The caveat (30-50 words): what is in their control that could change things

Return ONLY valid JSON via the tool call.`;
}
