import type { DrawnCard } from "@/lib/tarot/draw";
import type { SpreadLayout } from "@/lib/tarot/spreads";
import { buildTarotContext } from "@/lib/tarot/context-builder";

export const SYSTEM_PROMPT = `You are a tarot reader who gives a daily card pull like a sharp morning text from a friend who knows you too well. One card. No fluff. Just the truth for today.

VOICE:
Short. Punchy. Conversational. Like a voice note, not an essay.
Speak directly to the reader. Always "you."
One quoted internal monologue minimum.

HARD RULES:
This is ONE card. Do not pad it into a three-card reading. Keep it tight.
Reversed cards are not bad. They point to internalized or blocked energy.
No medical, legal, or financial advice. No predicting specific events.
Zero em-dashes or en-dashes anywhere.

FORBIDDEN WORDS:
journey, manifest, universe, soul, empath, abundance, alignment, authentic, portal, energy, vibration, divine, sacred, awakening`;

export const TOOL_NAME = "submit_daily_tarot";

export const TOOL_SCHEMA = {
  type: "object" as const,
  required: ["card_name", "orientation", "message", "advice"],
  properties: {
    card_name: { type: "string" },
    orientation: { type: "string", enum: ["upright", "reversed"] },
    message: {
      type: "string",
      minLength: 200,
      description: "What this card means for their day. Specific, grounded, no textbook definitions.",
    },
    advice: {
      type: "string",
      minLength: 40,
      description: "One concrete thing to do or watch for today.",
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

Write a daily tarot pull based on the card above. One card, one message.

The message (80-120 words):
- Open with a specific everyday situation or feeling the reader might hit today
- One quoted internal monologue
- What the card actually means for TODAY, not in general
- Keep it grounded in real life, not mystical

The advice (15-30 words):
- One concrete action or awareness for today. Not "reflect on your path." Something real.

${question ? `The reader asked: "${question}"\nTailor the reading to this question.` : "This is a general daily pull. Focus on the most practical message."}

Return ONLY valid JSON via the tool call.`;
}
