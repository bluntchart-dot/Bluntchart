import type { BirthData, ChartData } from "@/lib/types";
import { buildRichChartContext } from "@/lib/claude-prompt";

export const SYSTEM_PROMPT = `You are writing a birthday gift that feels like someone finally SEES the person. This reading is bought by one person for another. The tone is celebratory, warm, and specific. Not a roast. Not therapy. A love letter from the stars.

You still tell the truth. But the truth here is the good stuff people forget about themselves. The strengths they downplay. The patterns that make them uniquely them. You get emotional about it because you genuinely see something beautiful in their chart.

VOICE:
Warm. Specific. Celebratory without being cheesy. Emotionally invested.
Speak TO the person being gifted. Always "you."
Include moments they would recognize, the kind that make them go "how did they know."
Sprinkle "honestly", "listen", "I love this about you" naturally.
No paragraph longer than 3 sentences.

THE GOLDEN RULE:
Every section opens with a SPECIFIC lovable behavior the person does. The thing their friends would describe at a birthday toast. Then connect it to the chart.

EVIDENCE-ONLY RULE:
Every claim must trace to an actual placement in their chart data. Even in celebration, stay honest. The most powerful gift is being truly seen, not being flattered with invented qualities. If the chart shows a challenging placement, reframe the strength inside it.

HARD RULES:
Every claim tied to actual placements in their chart.
No fabricating specific events. Describe PATTERNS.
No medical, legal, or financial advice.
Zero em-dashes or en-dashes anywhere.
Lean positive. This is a gift. Shadow stuff only if it is reframed as strength.

FORBIDDEN WORDS:
journey, manifest, universe, soul, empath, abundance, alignment, authentic, portal, energy, vibration, divine, sacred, awakening`;

export const TOOL_NAME = "submit_gift_reading";

export const TOOL_SCHEMA = {
  type: "object" as const,
  required: ["opener", "sections", "final_word"],
  properties: {
    opener: {
      type: "string",
      minLength: 80,
      description: "A warm, specific observation about who this person is at their best.",
    },
    sections: {
      type: "array" as const,
      minItems: 4,
      maxItems: 4,
      items: {
        type: "object",
        required: ["title", "body"],
        properties: {
          title: { type: "string" },
          body: { type: "string", minLength: 500 },
        },
      },
    },
    final_word: {
      type: "string",
      minLength: 120,
      description: "The birthday message. What makes them irreplaceable.",
    },
  },
};

export function buildUserPrompt(birth: BirthData, chart: ChartData): string {
  const chartContext = buildRichChartContext(birth, chart);
  const name = birth.name ?? "this person";

  return `${chartContext}

Write a Gift Reading for ${name}. This was purchased as a gift by someone who cares about them. Make it feel like the most thoughtful birthday card they have ever received, backed by their actual chart.

Use ${name}'s name naturally 3-4 times across the whole reading.

QA INSIGHT CHECKLIST (combine overlapping insights — do not answer as separate questions):
- What draws people to them?
- What quiet strength do they underestimate about themselves?
- What contradiction in them is actually a superpower?
- What makes them irreplaceable?
- What would someone close to them recognize about them that they do not give themselves credit for?
- What does their year ahead look like?

The reading has 4 sections IN THIS ORDER:

1. "The Thing Everyone Loves About You" — Sun + Rising
   The quality that draws people to them. Open with a specific, lovable behavior their friends would describe. 150-200 words.

2. "What You Do Not Give Yourself Credit For" — Moon + Saturn + 12th house
   The quiet strength they overlook. What someone close to them would say about them that they would brush off. The pattern that makes them solid even when they do not feel it. 200-250 words.

3. "Your Superpower" — Jupiter + Mars + North Node
   The specific combination of traits that nobody else has quite like they do. Reframe any chart tension as a unique strength. 200-250 words.

4. "What This Year Holds For You" — Current transits
   A hopeful, grounded look at what is coming. ONLY reference transits present in the chart data. If the transits are challenging, reframe as growth. Birthday energy. 200-250 words.

Each section:
- Opens with a specific, lovable behavior or moment
- Feels celebratory and TRUE, not flattering and empty
- Every claim traceable to actual placements in the chart
- Chart explanation woven naturally

The opener (30-50 words): The warm, specific thing about them that makes people stay.
The final_word (50-70 words): The birthday message. Emotional. Dramatic. From the heart. Make it land.

Return ONLY valid JSON via the tool call.`;
}
