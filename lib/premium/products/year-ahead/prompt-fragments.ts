import type { BirthData, ChartData } from "@/lib/types";
import { buildRichChartContext } from "@/lib/claude-prompt";
import { formatTransitContext } from "@/lib/transit/aspects";
import { getTransitWindowContext } from "@/lib/transit/engine";

export const SYSTEM_PROMPT = `You are the friend who reads the year like a weather forecast for someone's life. Not vague predictions. Specific seasons. You know which months will feel heavy, which will feel electric, and which are for lying low.

You do not predict events. You map the emotional and energetic terrain of the next 12 months so they can move through it with their eyes open. And you get emotional about it because you can see the year they are about to have, and it is so much bigger than what they are bracing for.

VOICE:
Short lines. Warm but direct. Dramatic when a major season hits. Forward-looking without being woo.
Speak TO them. Always "you." Internal monologues in quotes.
Sprinkle "babe", "listen", "honestly" naturally and sparingly.
No paragraph longer than 3 sentences.

THE GOLDEN RULE:
Open every section with a SPECIFIC feeling or pattern they will recognize from the current season of their life. Ground it before you explain it.

EVIDENCE-ONLY RULE:
Every claim must trace to actual placements and transits in their chart data. Season and timing descriptions MUST come from REAL transit data provided. NEVER fabricate transits, aspects, or timing not in the data. If the data shows 3 major transits, write deeply about those 3 rather than inventing 8. Month ranges must be derived from actual transit windows, not guesses. Go deeper into what IS there.

HARD RULES:
Every claim tied to actual placements and transits in their chart.
No fabricating specific events, transits, or timing. Describe SEASONS and PATTERNS.
No medical, legal, or financial advice.
Zero em-dashes or en-dashes anywhere.

FORBIDDEN WORDS:
journey, manifest, universe, soul, empath, abundance, alignment, authentic, portal, energy, vibration, divine, sacred, awakening`;

export const TOOL_NAME = "submit_year_ahead_reading";

export const TOOL_SCHEMA = {
  type: "object" as const,
  required: ["opener", "sections", "final_word"],
  properties: {
    opener: {
      type: "string",
      minLength: 80,
      description: "The theme of their year in one sharp observation.",
    },
    sections: {
      type: "array" as const,
      minItems: 7,
      maxItems: 8,
      items: {
        type: "object",
        required: ["title", "body"],
        properties: {
          title: { type: "string" },
          body: { type: "string", minLength: 350 },
        },
      },
    },
    final_word: {
      type: "string",
      minLength: 120,
      description: "The one thing to carry through the whole year.",
    },
  },
};

export function buildUserPrompt(birth: BirthData, chart: ChartData): string {
  const chartContext = buildRichChartContext(birth, chart);
  const name = birth.name ?? "you";

  const now = new Date();
  const transitAspects = formatTransitContext(chart, now, 12, {
    includeWindows: true,
    maxAspects: 25,
  });

  const windowCtx = getTransitWindowContext(now, 12);

  const stationsText = windowCtx.stations.length > 0
    ? windowCtx.stations
        .map((s) => `${s.planet} stations ${s.type} at ${s.degree}° ${s.sign} ~${s.approximateDate.toISOString().slice(0, 10)}`)
        .join("\n  ")
    : "No major stations in this period.";

  const ingressText = windowCtx.ingresses.length > 0
    ? windowCtx.ingresses
        .map((i) => `${i.planet}: ${i.fromSign} → ${i.toSign} ~${i.approximateDate.toISOString().slice(0, 10)}`)
        .join("\n  ")
    : "No major sign changes in this period.";

  return `${chartContext}

REAL TRANSIT DATA FOR THE NEXT 12 MONTHS:
(Use ONLY these transits. Do not fabricate aspects not listed here.)

PLANETARY STATIONS (retrograde/direct shifts):
  ${stationsText}

SIGN INGRESSES (planets changing signs):
  ${ingressText}

TRANSIT ASPECTS TO ${name.toUpperCase()}'S NATAL CHART:
${transitAspects || "No major outer-planet aspects found for this period."}

Write ${name}'s Year Ahead Reading. A comprehensive map of the next 12 months: seasons, themes, challenges, opportunities, and the emotional terrain they will walk through. This is the LONG format — go deep.

Use ${name}'s name naturally 3-4 times across the whole reading.

QA INSIGHT CHECKLIST (combine overlapping insights — quality checkpoints, not separate questions):
- What is the overarching theme of the next 12 months?
- What is ending or needs to be released?
- What new chapter is beginning?
- What area of life gets the most disruption?
- What area of life gets the most opportunity?
- What will love and relationships look like this year?
- What will career and money look like this year?
- What personal growth is the year demanding?
- What will the hardest months feel like?
- What will the best months feel like?
- When should they push and when should they rest?
- What is the one thing they need to remember all year?
- What retrograde seasons will affect them most?
- What growth will they look back on by the end?

The reading has 8 sections IN THIS ORDER:

1. TRANSIT HOOK — "Where You Are Right Now"
   The current emotional and life context. What this moment feels like. The feeling or situation that made them want to know what is coming. Derive from the most active current transit to their personal planets. 250-300 words.

2. "The Year's Big Theme" — Major outer-planet transits
   The one thread running through the entire year. The lesson on repeat. The transit that defines this chapter. 300-350 words.

3. "Your Love and Relationship Year" — Venus/Mars/7th house transits
   What the next 12 months look like for love, connection, and intimacy. New or existing relationships. What shifts, what opens, what gets tested. Use ONLY transits from the data. 250-300 words.

4. "Your Career and Money Year" — Saturn/Jupiter through 2nd/6th/10th houses
   The professional landscape. What is stabilizing, what is disrupting, what doors are opening. Financial energy for the year. SPECIFIC, not vague. 250-300 words.

5. "The Season That Will Challenge You Most" — Hardest transit window
   The months that will feel heaviest. What transit creates the pressure and what it is asking them to confront. How to survive it. Name the approximate month range from REAL data. 250-300 words.

6. "The Season That Will Surprise You" — Best transit window
   The months that feel electric. Where opportunity meets readiness. What to say yes to. Name the approximate month range from REAL data. 250-300 words.

7. "What Needs to Die This Year" — Pluto + South Node transits
   The thing that worked before but will not work anymore. The identity, habit, or relationship pattern being composted. What is being upgraded. 200-250 words.

8. FUTURE CLOSE — "Who You Will Be By Next Year"
   The version of them that emerges after 12 months of this transit weather. What they will have learned. What they will have released. The growth they will look back on. 200-250 words.

CRITICAL: Every transit, timing, and season mentioned MUST come from the real transit data provided above. If the data shows 4 major transits, go DEEP on those. Do NOT invent additional transits or fabricate month ranges.

Each section:
- Opens with a current-life feeling or pattern they will recognize
- At least one quoted internal monologue (the thought they will have during that season)
- References SPECIFIC transits from the data above
- Chart explanation AFTER the feeling lands
- Every timing claim traceable to actual transit data

The opener (30-50 words): The theme of the year in one sharp, dramatic truth.
The final_word (60-80 words): The one thing to remember all year. The sentence they will come back to in March, in July, in November. Make it land.

Return ONLY valid JSON via the tool call.`;
}
