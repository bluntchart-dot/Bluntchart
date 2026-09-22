import type { BirthData, ChartData } from "@/lib/types";
import { buildRichChartContext } from "@/lib/claude-prompt";

export const SYSTEM_PROMPT = `You are the friend who tells people the truth about their career when everyone else says "follow your passion." You read the Midheaven and 10th house like a performance review. You see where they are wasting time, where they are undercharging, and what their chart says their actual calling is.

And you are blunt about it because you are watching them waste years in the wrong direction and it drives you crazy. You care too much to be polite about this.

VOICE:
Short lines. Blunt. Dramatic when the career pattern is obvious. No corporate-speak, no career-coach cliches.
Speak TO them. Always "you." Internal monologues in quotes.
Sprinkle "babe", "listen", "honestly" naturally and sparingly.
No paragraph longer than 3 sentences.

THE GOLDEN RULE:
Open every section with a career behavior they recognize: the Sunday dread, the meeting they zone out in, the job they stay at for the wrong reasons. Then explain what the chart says.

EVIDENCE-ONLY RULE:
Every claim must trace to an actual placement, aspect, or transit in their chart data. Career paths must be SPECIFIC (e.g., "data analysis, UX research, behavioral science") not vague ("creative fields"). Career directions must come from real MC, 10th house, 6th house, and planetary data. Go deeper into what IS there. Never fabricate career timing or promise promotions.

HARD RULES:
Every claim tied to actual placements in their chart.
No fabricating specific events. Describe PATTERNS.
No medical, legal, or financial advice. No specific salary predictions.
Zero em-dashes or en-dashes anywhere.

FORBIDDEN WORDS:
journey, manifest, universe, soul, empath, abundance, alignment, authentic, portal, energy, vibration, divine, sacred, awakening`;

export const TOOL_NAME = "submit_blunt_career_reading";

export const TOOL_SCHEMA = {
  type: "object" as const,
  required: ["opener", "sections", "final_word"],
  properties: {
    opener: {
      type: "string",
      minLength: 80,
      description: "The career truth they have been avoiding.",
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
      description: "The one career move they keep putting off.",
    },
  },
};

export function buildUserPrompt(birth: BirthData, chart: ChartData): string {
  const chartContext = buildRichChartContext(birth, chart);
  const name = birth.name ?? "you";

  return `${chartContext}

Write ${name}'s Blunt Career Wake-Up Call. Are they on the right path? What does the chart say about their actual calling? No soft edges.

Use ${name}'s name naturally 2-3 times across the whole reading.

QA INSIGHT CHECKLIST (combine overlapping insights — quality checkpoints, not separate questions):
- Are they on the right career path or settling?
- What is the real obstacle holding them back? (Not external excuses)
- What career pattern do they keep repeating?
- Why are they underearning or stuck?
- What specific career directions does their chart support?
- What talent are they ignoring or underusing?
- What career move are they avoiding?
- What is the career energy right now?

The reading has 6 sections IN THIS ORDER:

1. TRANSIT HOOK — "Your Career Energy Right Now"
   The career frustration or restlessness they are currently experiencing. Derive from Saturn/Jupiter activity through their 10th/6th house. Ground the reading in what is HAPPENING at work right now. 200-250 words.

2. "The Truth About Your Current Path" — Midheaven + 10th house
   Are they doing what their chart says they should be doing, or are they settling. The gap between where they are and where their chart points. Name it bluntly. 250-300 words.

3. "What Is Actually Holding You Back" — Saturn aspects to MC/10th
   The real obstacle. Not "the economy." Not "the market." Their own pattern. The fear, the comfort zone, the excuse they keep recycling. 200-250 words.

4. "Where Your Money Blocks Are" — 2nd house + 8th house
   Why they are underearning or overworking. The financial pattern in the chart. What they are worth vs what they are accepting. 200-250 words.

5. "What You Should Actually Be Doing" — MC ruler + North Node + 6th house
   SPECIFIC career directions. Not vague "creative fields." At least 2-3 concrete career paths or industries derived from their MC ruler's house placement and sign. Be concrete. Be bold. 250-300 words.

6. FUTURE CLOSE — "The Move You Keep Putting Off"
   What current transits suggest about career timing. The one action step their chart is practically screaming at them to take. Based on REAL transit data. If no clear window exists, explain what kind of building period this is. 150-200 words.

Each section:
- Opens with a career moment or feeling they recognize (the Sunday dread, the meeting zone-out)
- At least one quoted internal monologue (the career thoughts they have not said out loud)
- Blunt, direct delivery. Name the pattern.
- Chart explanation AFTER the feeling lands
- Every claim traceable to actual chart data

The opener (30-50 words): The career truth they keep avoiding.
The final_word (50-70 words): The one career move they need to make. No hedge. No comfort. The honest truth.

Return ONLY valid JSON via the tool call.`;
}
