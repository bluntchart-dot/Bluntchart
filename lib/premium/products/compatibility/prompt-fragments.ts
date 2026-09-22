import type { BirthData, ChartData } from "@/lib/types";
import type { SynastryResult } from "@/lib/astro-compat";
import { buildRichChartContext } from "@/lib/claude-prompt";

export const SYSTEM_PROMPT = `You are the friend who tells two people what is actually going on between them. Not the fairytale. Not the doom. The real picture.

You have read thousands of synastry charts. You know when two people are going to challenge each other in ways that make both of them grow, and you know when they are going to tear each other apart in the kitchen at 11pm over nothing. And you get invested. Because you can see what this connection COULD be if they both understood what is actually happening between them.

VOICE:
Short lines. Direct. Warm but honest. Dramatic when the dynamic is obvious. You talk to BOTH of them.
Use both names naturally. Talk about "you two" and "between you."
Internal monologues in quotes, the messy kind both of them think.
Sprinkle "listen", "honestly" naturally and sparingly.
No paragraph longer than 3 sentences.

THE GOLDEN RULE:
Open every section with a SPECIFIC dynamic between them. Not "you communicate differently." The exact moment. What one does, how the other reacts, and why neither of them is wrong.

ASTROLOGY IN PLAIN LANGUAGE:
Explain what the connection DOES in their daily life before naming the aspects. The feeling first, the astrology second.

EVIDENCE-ONLY RULE:
Every claim must trace to actual synastry aspects between their charts. Do not invent cross-aspects not in the data. Do not project relationship events onto the aspects. Describe the DYNAMIC the aspects create, not events you are guessing happened. If the synastry data shows 5 strong aspects, go deep on those. Go deeper into what IS there.

HARD RULES:
Every claim tied to actual synastry aspects between their charts.
No fabricating specific events or cross-aspects not in data. Describe PATTERNS and DYNAMICS.
No medical, legal, or financial advice.
Zero em-dashes or en-dashes anywhere.
Be honest about friction AND magnetism. Both are real.

FORBIDDEN WORDS:
journey, manifest, universe, soul, empath, abundance, alignment, authentic, portal, energy, vibration, divine, sacred, awakening, twin flame, soulmate`;

export const TOOL_NAME = "submit_compatibility_reading";

export const TOOL_SCHEMA = {
  type: "object" as const,
  required: ["opener", "sections", "final_word"],
  properties: {
    opener: {
      type: "string",
      minLength: 80,
      description: "The dynamic between them that neither of them has named out loud.",
    },
    sections: {
      type: "array" as const,
      minItems: 6,
      maxItems: 7,
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
      minLength: 150,
      description: "The honest truth about what this connection is and what it asks of both of them.",
    },
  },
};

function formatSynastry(synastry: SynastryResult): string {
  const b = synastry.breakdown;
  return `SYNASTRY SCORES (0-100 scale):
  Overall compatibility: ${synastry.score}/100
  Venus-Mars (physical + romantic chemistry): ${b.venusMars}
  Moon-Moon (emotional wavelength): ${b.moonMoon}
  Sun-Moon (nurture + identity fit): ${b.sunMoon}
  Venus-Venus (love language match): ${b.venusVenus}
  Sun-Sun (core identity harmony): ${b.sunSun}
  Mars-Mars (conflict + drive style): ${b.marsMars}
  Sun-Venus (attraction + appreciation): ${b.sunVenus}`;
}

export function buildUserPrompt(
  birth1: BirthData, chart1: ChartData,
  birth2: BirthData, chart2: ChartData,
  synastry: SynastryResult
): string {
  const ctx1 = buildRichChartContext(birth1, chart1);
  const ctx2 = buildRichChartContext(birth2, chart2);
  const name1 = birth1.name ?? "Person 1";
  const name2 = birth2.name ?? "Person 2";

  return `PERSON 1 — ${name1}:
${ctx1}

PERSON 2 — ${name2}:
${ctx2}

${formatSynastry(synastry)}

Write a Compatibility Reading for ${name1} and ${name2}. This is the LONG format — a comprehensive deep dive into how these two people work together: what pulls them together, what pushes them apart, and what they need to understand about each other.

Use both names naturally throughout the reading (3-4 times each).

QA INSIGHT CHECKLIST (combine overlapping insights — quality checkpoints, not separate questions):
- What is the core magnetism between them?
- How do their love languages differ?
- What is the recurring argument pattern?
- How do they communicate differently and where does it break down?
- What emotional needs does each person bring?
- What does each person heal or trigger in the other?
- What is the biggest growth edge for this relationship?
- Is this connection about comfort or growth?
- What is the long-term potential?
- What is the one thing they both need to understand?
- What does each person need that the other struggles to give?
- What is the strongest and weakest point of this connection?

The reading has 7 sections IN THIS ORDER:

1. TRANSIT HOOK — "Where This Connection Is Right Now"
   The current energy between them. What is being activated or tested in their dynamic right now. Derive from how current transits hit BOTH charts and their synastry points. 250-300 words.

2. "The Magnetism" — Venus-Mars cross-aspects + Sun-Venus
   What draws them to each other. The specific thing one does that the other cannot look away from. The chemistry explained through actual cross-aspects. 300-350 words.

3. "How You Love Differently" — Venus-Venus + Moon-Moon
   Their love languages compared. Where they line up and where they miss each other completely. What ${name1} needs vs what ${name2} gives and vice versa. 300-350 words.

4. "The Fight You Keep Having" — Mars-Mars + Sun-Sun squares/oppositions
   The recurring argument. What it looks like on the surface vs what it is actually about underneath. What each person thinks is happening vs what the synastry shows is happening. 300-350 words.

5. "How You Talk Past Each Other" — Mercury cross-aspects
   Communication styles compared. How ${name1} processes vs how ${name2} processes. Where the misunderstanding lives. How to bridge it. 250-300 words.

6. "What You Heal and What You Trigger" — Chiron + Moon cross-aspects
   The wound one person touches in the other. How this connection forces both of them to grow. The tender spot and why it keeps getting pressed. 250-300 words.

7. FUTURE CLOSE — "What This Connection Is Asking of Both of You"
   North Node + Saturn cross-aspects. Whether this is about comfort or growth. What it is asking both of them to become. The long-term picture and what makes or breaks it. 250-300 words.

CRITICAL: Every dynamic described MUST trace to actual synastry aspects in the data. Do not invent cross-aspects.

Each section:
- Opens with a specific dynamic between them (a moment, not a trait)
- At least one quoted internal monologue from either person (the messy thought)
- Synastry explanation AFTER the feeling lands
- Every claim traceable to actual synastry data

The opener (40-60 words): The dynamic between them nobody has named out loud.
The final_word (60-80 words): The honest bottom line about what this connection IS. Dramatic. Real. The thing that makes them both go quiet.

Return ONLY valid JSON via the tool call.`;
}
