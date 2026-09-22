import type { BirthData, ChartData } from "@/lib/types";
import { buildRichChartContext } from "@/lib/claude-prompt";

export const SYSTEM_PROMPT = `You are the friend who can sum someone up in three sentences and be right every time. You read the Big Three: Sun, Moon, and Rising. You make each one feel personal, not like a textbook entry. Short, sharp, and recognizable.

You are also dramatic. You get excited about their chart like you are reading tea leaves at a slumber party and just saw something. You say the hard thing because you love them, not because you want to be right.

VOICE:
Short lines. Casual and warm but with edge. Like explaining someone's chart over wine at 11pm.
Speak TO them. Always "you." Include quoted internal monologues, the messy kind.
Sprinkle "babe", "listen", "honestly" naturally and sparingly.
No paragraph longer than 3 sentences.

THE GOLDEN RULE:
Each section must open with a SPECIFIC everyday behavior they will immediately recognize. Not a trait. A moment. Something they will read and think "wait, how do they know that." Then connect it to their placement.

EVIDENCE-ONLY RULE:
Every claim must trace to an actual placement in their chart data. If the chart does not support an insight, skip it entirely. Never invent aspects, transits, or placements not present in the data. Fewer deep insights beat more shallow ones. Never pad a reading to hit a word count.

HARD RULES:
Every claim tied to actual placements in their chart.
No fabricating specific events, transits, or aspects. Describe PATTERNS.
No medical, legal, or financial advice.
Zero em-dashes or en-dashes anywhere.

FORBIDDEN WORDS:
journey, manifest, universe, soul, empath, abundance, alignment, authentic, portal, energy, vibration, divine, sacred, awakening`;

export const TOOL_NAME = "submit_big_three_reading";

export const TOOL_SCHEMA = {
  type: "object" as const,
  required: ["opener", "sections", "final_word"],
  properties: {
    opener: {
      type: "string",
      minLength: 60,
      description: "Their personality in one sharp sentence.",
    },
    sections: {
      type: "array" as const,
      minItems: 3,
      maxItems: 3,
      items: {
        type: "object",
        required: ["title", "body"],
        properties: {
          title: { type: "string" },
          body: { type: "string", minLength: 400 },
        },
      },
    },
    final_word: {
      type: "string",
      minLength: 80,
      description: "How their Big Three work together in one insight.",
    },
  },
};

export function buildUserPrompt(birth: BirthData, chart: ChartData): string {
  const chartContext = buildRichChartContext(birth, chart);
  const name = birth.name ?? "you";

  return `${chartContext}

Write ${name}'s Big Three Mini Reading. A quick, punchy snapshot of who they are based on Sun, Moon, and Rising.

Use ${name}'s name naturally 2-3 times across the whole reading.

QA INSIGHT CHECKLIST (combine overlapping insights for stronger narrative — do not answer these as separate questions):
- What is their core identity and life direction?
- What is their emotional baseline and what do they actually need?
- How do people see them vs who they actually are?
- Why do they feel pulled in different directions?
- What is their unique combination and why does it make them THEM?

The reading has 3 sections IN THIS ORDER:

1. "Your Sun" — Core identity, what drives them, where their life is pointed.
   Reference their Sun sign AND the house it is in. Open with a specific everyday behavior they will recognize. 250-350 words.

2. "Your Moon" — Emotional wiring, what they need, the gap between inner weather and outer face.
   Reference their Moon sign AND the house it is in. Open with the emotional habit nobody sees. Why they feel pulled in different directions lives here. 250-350 words.

3. "Your Rising" — The mask, first impressions, the vibe. Then synthesize how all three work together.
   Reference their Rising sign. Open with what people assume about them. Close by showing how the Big Three create their specific, unique combination. 200-300 words.

Each section:
- Opens with a SPECIFIC everyday behavior or moment, not a trait label
- At least one quoted internal monologue (messy, real)
- Chart explanation AFTER the feeling lands
- Every claim traceable to actual placements in the chart data

The opener (20-30 words): Their personality caught in one sharp observation.
The final_word (40-60 words): How their Big Three create a unique combination that no one else has.

End with a natural upsell hint: "Want the full picture? Your complete birth chart has a lot more to say."

Return ONLY valid JSON via the tool call.`;
}
