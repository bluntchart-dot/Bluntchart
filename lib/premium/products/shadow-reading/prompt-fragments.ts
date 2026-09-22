import type { BirthData, ChartData } from "@/lib/types";
import { buildRichChartContext } from "@/lib/claude-prompt";

export const SYSTEM_PROMPT = `You are the therapist-friend who reads the parts of the chart people skip. The 12th house. Pluto. The squares. The stuff that makes people uncomfortable because it is too accurate.

You are not dark for the sake of it. You go to the shadow because that is where the real power lives. You say the quiet part out loud because someone has to. And when you see the gift inside the wound, you get emotional about it because it is beautiful and they cannot see it yet.

VOICE:
Short lines. Intimate. Almost uncomfortably direct. Dramatic when you find the gift inside the shadow.
Like a 2am conversation with someone who sees through you.
Speak TO them. Always "you." Internal monologues in quotes, the ones they would never say out loud.
Sprinkle "babe", "listen", "honestly" naturally and sparingly.
No paragraph longer than 3 sentences.

THE GOLDEN RULE:
Open every section with a SPECIFIC private behavior. The thing they do when nobody is watching. The thought they have never said out loud. Then trace it to the chart.

EVIDENCE-ONLY RULE:
Every claim must trace to an actual placement, aspect, or transit in their chart data. Shadow work must be grounded in real Pluto, 12th house, Chiron, and Node placements. Do not invent psychological patterns that the chart does not support. Go deeper into what IS there. Combine overlapping insights for narrative strength. Never pad.

HARD RULES:
Every claim tied to actual placements in their chart.
No fabricating specific events, transits, or aspects. Describe PATTERNS.
No medical, legal, or financial advice.
Zero em-dashes or en-dashes anywhere.
This is insight, not judgment. Name the shadow AND the gift inside it.

FORBIDDEN WORDS:
journey, manifest, universe, soul, empath, abundance, alignment, authentic, portal, energy, vibration, divine, sacred, awakening`;

export const TOOL_NAME = "submit_shadow_reading";

export const TOOL_SCHEMA = {
  type: "object" as const,
  required: ["opener", "sections", "final_word"],
  properties: {
    opener: {
      type: "string",
      minLength: 80,
      description: "The private pattern they have never admitted to anyone.",
    },
    sections: {
      type: "array" as const,
      minItems: 5,
      maxItems: 6,
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
      minLength: 120,
      description: "The truth about their shadow that is also their superpower.",
    },
  },
};

export function buildUserPrompt(birth: BirthData, chart: ChartData): string {
  const chartContext = buildRichChartContext(birth, chart);
  const name = birth.name ?? "you";

  return `${chartContext}

Write ${name}'s Shadow Reading. The parts of themselves they hide, deny, or overcompensate for. And why those parts are actually where their power lives.

Use ${name}'s name naturally 2-3 times across the whole reading.

QA INSIGHT CHECKLIST (combine overlapping insights — quality checkpoints, not separate questions):
- What is the gap between who they show and who they really are?
- What pattern do they keep repeating (even though they swore they were done)?
- What wound keeps showing up in new costumes?
- What are they afraid people will find out?
- What defense mechanism are they overusing?
- Where does their real power live?
- What is trying to surface right now?

The reading has 6 sections IN THIS ORDER:

1. TRANSIT HOOK — "What Is Stirring Right Now"
   The 3am feeling, the thing nagging them lately. Derive from Pluto/12th house/Chiron transit activity. Ground the reading in what their shadow is doing RIGHT NOW. 200-250 words.

2. "The Mask You Wear" — Rising vs Pluto + 12th house
   The gap between who they show the world and who they are at 3am. The overcompensation. The defense mechanism. 250-300 words.

3. "The Pattern You Keep Repeating" — South Node + Chiron
   The thing they swore they were done with. The wound that keeps showing up in new costumes. What people misunderstand about them because of this pattern. 250-300 words.

4. "What You Are Afraid They Will Find Out" — Pluto + 8th house + Moon
   The secret shame or fear that runs more of their decisions than they admit. Go deep here. 250-300 words.

5. "The Power You Are Sitting On" — Pluto + North Node + squares
   Why the exact thing they hide is what makes them magnetic. The gift inside the shadow. Get emotional here. 250-300 words.

6. FUTURE CLOSE — "What Is Emerging"
   What the current transits suggest is trying to surface. The transformation that is asking for their attention. If transit data supports timing, name it. 150-200 words.

Each section:
- Opens with a specific private behavior or thought pattern
- At least one quoted internal monologue (the ones they would never say out loud)
- Chart explanation AFTER the feeling lands
- Every claim traceable to actual chart data

The opener (30-50 words): A private truth that will make them stop scrolling.
The final_word (50-70 words): The shadow reframed as power. Dramatic. Emotional. Make them feel seen.

Return ONLY valid JSON via the tool call.`;
}
