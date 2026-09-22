import type { BirthData, ChartData } from "@/lib/types";
import { buildRichChartContext } from "@/lib/claude-prompt";
import { formatTransitContext } from "@/lib/transit/aspects";
import { getTransitWindowContext } from "@/lib/transit/engine";

export const SYSTEM_PROMPT = `You are the friend who reads the sky like a weather report for someone's specific life. Not generic horoscope predictions. You know exactly which transits are hitting their chart, what those transits feel like in real life, and what to actually do about them.

You get excited about good transits. You get protective about hard ones. When you see a major transit hitting their chart, you react like you are reading a text from the person they have been waiting to hear from. The sky is personal to you because they are personal to you.

VOICE:
Short lines. Warm but direct. Dramatic when a big transit hits. Present-tense when describing the current month.
Speak TO them. Always "you." Internal monologues in quotes.
Sprinkle "babe", "listen", "honestly" naturally and sparingly.
No paragraph longer than 3 sentences.

THE GOLDEN RULE:
Every transit you mention MUST come from the transit data provided. Do not fabricate transits. If the data shows Saturn squaring their Venus, talk about Saturn squaring their Venus. If it does not show it, do not mention it.

EVIDENCE-ONLY RULE:
Every claim must trace to actual transit aspects provided in the data. NEVER fabricate transits, aspects, or timing not present in the data. If only 2-3 major transits are active, go DEEP on those rather than inventing additional ones. "Nothing major hitting your chart this month" is a valid and valuable observation. Go deeper into what IS there.

HARD RULES:
Every claim tied to actual transit aspects provided in the data.
No fabricating transits or aspects not in the data.
No medical, legal, or financial advice.
Zero em-dashes or en-dashes anywhere.
Describe FEELINGS and PATTERNS, not specific events.

FORBIDDEN WORDS:
journey, manifest, universe, soul, empath, abundance, alignment, authentic, portal, energy, vibration, divine, sacred, awakening`;

export const TOOL_NAME = "submit_monthly_transit_reading";

export const TOOL_SCHEMA = {
  type: "object" as const,
  required: ["opener", "sections", "final_word"],
  properties: {
    opener: {
      type: "string",
      minLength: 80,
      description: "The headline energy of this month in one sharp observation.",
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
      description: "The one thing to remember this month.",
    },
  },
};

export function buildUserPrompt(birth: BirthData, chart: ChartData): string {
  const chartContext = buildRichChartContext(birth, chart);
  const name = birth.name ?? "you";

  const now = new Date();
  const transitContext = formatTransitContext(chart, now, 1, {
    includeWindows: true,
    maxAspects: 15,
  });

  const windowContext = getTransitWindowContext(now, 1);
  const positionsText = windowContext.currentPositions.positions
    .map((p) => {
      const rx = p.retrograde ? " Rx" : "";
      return `${p.planet}${rx} at ${p.degree}° ${p.sign}`;
    })
    .join(", ");

  const stationsText = windowContext.stations.length > 0
    ? windowContext.stations
        .map((s) => `${s.planet} stations ${s.type} in ${s.sign} ~${s.approximateDate.toISOString().slice(0, 10)}`)
        .join("; ")
    : "No major stations this month.";

  const ingressText = windowContext.ingresses.length > 0
    ? windowContext.ingresses
        .map((i) => `${i.planet} enters ${i.toSign} ~${i.approximateDate.toISOString().slice(0, 10)}`)
        .join("; ")
    : "No major sign changes this month.";

  const monthName = now.toLocaleString("en-US", { month: "long", year: "numeric" });

  return `${chartContext}

CURRENT SKY (${monthName}):
${positionsText}

STATIONS: ${stationsText}
SIGN CHANGES: ${ingressText}

TRANSIT ASPECTS TO ${name.toUpperCase()}'S NATAL CHART:
${transitContext || "No major outer-planet aspects this month."}

Write ${name}'s Monthly Transit Reading for ${monthName}. A real-time map of what the sky is doing to THEIR specific chart this month.

Use ${name}'s name naturally 2-3 times across the whole reading.

QA INSIGHT CHECKLIST (combine overlapping insights — quality checkpoints, not separate questions):
- What is the dominant energy of this month for their chart?
- Which life areas are being activated or stressed?
- What should they lean into this month?
- What should they be careful about?
- Are there any retrogrades affecting their chart?
- What is the best use of this month's energy?
- What emotional weather should they expect?
- When does the pressure ease or shift?

The reading has 6 sections IN THIS ORDER:

1. TRANSIT HOOK — "What This Month Feels Like For You"
   The headline transit that defines this month for their specific chart. Not a generic horoscope. The transit that hits THEIR planets. What it feels like waking up under this sky. 200-250 words.

2. "The Big Shift" — The dominant outer-planet transit
   The loudest signal. What is changing, ending, or beginning. Which life area (house) is being activated and what that means in daily life. 250-300 words.

3. "Where You Will Feel It Most" — The house and planet being hit hardest
   The life area under the most pressure or receiving the most energy. What it feels like day to day. Specific situations they might recognize. 200-250 words.

4. "The Opportunity Window" — Supportive transits
   Any trines, sextiles, or helpful aspects. What to lean into. If no clear opportunities exist in the data, be honest and explain what kind of integration or rest period this is. 200-250 words.

5. "What to Watch For" — Challenging transits
   Squares, oppositions, or retrogrades hitting their chart. Not doom. A realistic heads-up. What the tension is asking them to confront. 200-250 words.

6. FUTURE CLOSE — "How to Use This Month"
   Practical guidance based on the transit picture. What to prioritize, what to postpone, what to pay attention to. The emotional weather forecast for the weeks ahead. 150-200 words.

CRITICAL: Every transit mentioned MUST come from the data above. If few transits are active, go DEEP on those instead of inventing additional ones.

Each section:
- Opens with a feeling or situation they will recognize this month
- At least one quoted internal monologue (the thought they will have this month)
- References SPECIFIC transits from the data above
- Chart explanation AFTER the feeling lands
- Every transit traceable to actual data provided

The opener (30-50 words): This month's headline energy for their chart.
The final_word (50-70 words): The one thing to carry through the month. Dramatic. Personal. Real.

Return ONLY valid JSON via the tool call.`;
}
