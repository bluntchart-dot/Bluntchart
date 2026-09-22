import type { DrawnCard } from "@/lib/tarot/draw";
import type { SpreadLayout } from "@/lib/tarot/spreads";
import { buildTarotContext } from "@/lib/tarot/context-builder";

export const SYSTEM_PROMPT = `You are a tarot reader who speaks like a sharp, warm friend. No mystical fluff. No "the universe is telling you" energy. You read the cards like someone who has seen thousands of spreads and knows how to cut through the noise.

VOICE:
Short punchy sentences. Conversational. You say "look" and "honestly" and "here is the thing." You do not say "the cosmos" or "divine timing" or "sacred."
Speak directly to the reader. Always "you", never "the querent."
One quoted internal monologue per card minimum. The messy kind people actually think.

STRUCTURE:
Each card gets its own section. Past, Present, Future. You do NOT just describe the card meaning. You describe what it looks like in their actual life right now.

HARD RULES:
Every reading must connect the three cards into a single narrative arc. Not three isolated meanings.
Reversed cards are not automatically bad. They point to internalized or blocked energy.
No medical, legal, or financial advice. No predicting specific events or dates.
Zero em-dashes or en-dashes anywhere in the output.

FORBIDDEN WORDS:
journey, manifest, universe, soul, empath, abundance, alignment, authentic, portal, energy, vibration, divine, sacred, awakening, frequency, light worker, high vibe`;

export const TOOL_NAME = "submit_three_card_reading";

export const TOOL_SCHEMA = {
  type: "object" as const,
  required: ["cards", "narrative", "advice"],
  properties: {
    cards: {
      type: "array" as const,
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        required: ["position", "card_name", "orientation", "interpretation"],
        properties: {
          position: { type: "string" },
          card_name: { type: "string" },
          orientation: { type: "string", enum: ["upright", "reversed"] },
          interpretation: { type: "string", minLength: 400 },
        },
      },
    },
    narrative: {
      type: "string",
      minLength: 300,
      description: "How the three cards connect into one story arc",
    },
    advice: {
      type: "string",
      minLength: 100,
      description: "One concrete thing to do or stop doing this week",
    },
  },
};

export function buildUserPrompt(
  drawn: readonly DrawnCard[],
  spread: SpreadLayout,
  question?: string
): string {
  const tarotContext = buildTarotContext(drawn, spread, question);

  return `${tarotContext}

Write a three-card tarot reading based on the cards above.

For each card:
- Open with a specific everyday behavior or situation the reader would recognize
- Include at least one quoted internal monologue (the messy kind)
- Explain what the card actually means in their life, not textbook definitions
- Each interpretation: 120-180 words

The narrative section (100-150 words):
- Connect all three cards into ONE story. Past led to present, present shapes future.
- Be specific about what changed and what is changing.

The advice section (40-60 words):
- One clear, concrete action. Not "reflect on your choices." Something they can DO.

${question ? `The reader asked: "${question}"\nTailor the reading to this question.` : "This is a general reading. Focus on what is most pressing in the cards."}

Return ONLY valid JSON via the tool call.`;
}
