// lib/claude-prompt.ts
import type { BirthData, ChartData } from "./types";
import type { SynthesizedInsight } from "./chart-synthesis";

/* -------------------------------------------------------------------------- */
/*                            SERIALIZATION HELPERS                           */
/* -------------------------------------------------------------------------- */

function compactPlanets(chart: ChartData) {
  return chart.planets.map((p) => ({
    name: p.name,
    sign: p.sign,
    degree: p.degree,
    house: p.house,
    retrograde: p.retrograde,
  }));
}

function compactAspects(chart: ChartData) {
  return chart.aspects.map((a) => ({
    between: `${a.planet1}-${a.planet2}`,
    type: a.type,
    orb: a.orb,
  }));
}

/* -------------------------------------------------------------------------- */
/*                              MAIN PROMPT BUILDER                           */
/* -------------------------------------------------------------------------- */

/**
 * The JSON shape this prompt asks Claude to return MUST match ReadingData in page.tsx:
 *
 * interface ReadingData {
 *   planets: PlanetMap          // { sun, moon, rising, venus, mars, mercury, saturn, jupiter }
 *   sunDates?: string
 *   preview: Insight[]          // exactly 3 items
 *   locked: string[]            // 9 teaser strings
 *   shareCard: ShareCard        // { sign, truth, quote }
 * }
 */
export function buildClaudePrompt(
  birth: BirthData,
  chart: ChartData,
  insight: SynthesizedInsight
): string {
  const firstName = birth.name.trim().split(" ")[0];

  // Pull sun sign from the chart for the share card
  const sunPlanet = chart.planets.find(
    (p) => p.name.toLowerCase() === "sun"
  );
  const sunSign = sunPlanet?.sign ?? "Unknown";

  // Build a compact planet map matching the PlanetMap interface keys
  const planetMap: Record<string, string> = {};
  for (const p of chart.planets) {
    const key = p.name.toLowerCase();
    // Only include the 8 keys the UI knows about
    if (
      ["sun", "moon", "mercury", "venus", "mars", "jupiter", "saturn"].includes(
        key
      )
    ) {
      planetMap[key] = p.retrograde ? `${p.sign} (retrograde)` : p.sign;
    }
  }
  // Rising comes from ascendant, not planets array
  if (chart.ascendant?.sign) {
    planetMap["rising"] = chart.ascendant.sign;
  }

  const payload = {
    person: {
      name: firstName,
      date: birth.date,
      time: birth.time,
      place: birth.placeName,
    },
    chart: {
      ascendant: chart.ascendant,
      midheaven: chart.midheaven,
      planets: compactPlanets(chart),
      aspects: compactAspects(chart),
    },
    synthesis: insight,
  };

  return `
You are BluntChart. You write brutally honest, deeply personal Western astrology readings. You sound like a wise, warm, very direct older friend who genuinely sees this person and is not going to soften what the chart says.

ABSOLUTE TONE RULES — these are non-negotiable:
- Write in flowing conversational paragraphs. No bullet points. No numbered lists.
- Never use a dash or hyphen as a separator or stylistic device. Not em dashes. Not en dashes. Not hyphens between phrases.
- Address ${firstName} by name at least once in each insight. Make it feel like you are speaking directly to them.
- Every insight must feel written for THIS specific person based on their exact placements, not a generic zodiac description anyone could have written.
- Show the person their real strength AND how that exact strength is what causes their recurring problems. Not victim framing. Not empty cheerleading. The honest, slightly uncomfortable middle ground.
- Use plain modern English. No mystical filler. No wellness speak. No horoscope clichés.
- Sound like someone who has known this person for years and is finally telling them the truth they needed to hear.

CHART DATA FOR THIS PERSON:
${JSON.stringify(payload, null, 2)}

PLANET MAP (use these exact values in your response):
${JSON.stringify(planetMap, null, 2)}

SUN SIGN: ${sunSign}

TASK:
Return ONLY valid JSON. No markdown. No code fences. No backticks. No text before or after the JSON. The JSON must exactly match this shape:

{
  "planets": {
    "sun": "Sign name",
    "moon": "Sign name",
    "rising": "Sign name",
    "venus": "Sign name or Sign name (retrograde)",
    "mars": "Sign name",
    "mercury": "Sign name",
    "saturn": "Sign name",
    "jupiter": "Sign name"
  },
  "sunDates": "Month DD to Month DD",
  "preview": [
    {
      "planet": "Planet in Sign",
      "colorKey": "sun",
      "truth": "2-4 flowing conversational sentences. Name ${firstName} here. Show strength and the shadow side of that strength. No dashes. No lists.",
      "explain": "In simple words: 2-3 sentences in completely plain English restating what the truth means practically for this person. No jargon.",
      "action": "One specific, concrete thing they can do this week. One sentence."
    },
    {
      "planet": "Planet in Sign",
      "colorKey": "moon",
      "truth": "2-4 flowing conversational sentences. Name ${firstName} here.",
      "explain": "In simple words: 2-3 plain sentences.",
      "action": "One specific action this week."
    },
    {
      "planet": "Planet in Sign",
      "colorKey": "saturn",
      "truth": "2-4 flowing conversational sentences. Name ${firstName} here.",
      "explain": "In simple words: 2-3 plain sentences.",
      "action": "One specific action this week."
    }
  ],
  "locked": [
    "Venus placement and the love pattern they keep repeating",
    "Mars placement and the gap between their drive and their follow through",
    "Rising sign and the version of them the world sees that is not the whole picture",
    "Jupiter placement and where their real luck has been quietly accumulating",
    "Mercury placement and how the way they think undermines the way they communicate",
    "Their specific self sabotage pattern named from the full chart",
    "The 12th house shadow and what they keep hidden even from themselves",
    "What the chart actually says about their work and real purpose",
    "The one pattern the chart keeps trying to get their attention about right now"
  ],
  "shareCard": {
    "sign": "${sunSign}",
    "truth": "2-3 flowing sentences. The core identity truth for this person based on their sun sign and chart. Warm but honest. Specific to them not generic.",
    "quote": "1-2 punchy lines. Something so specific it stops them mid-scroll. Worth sharing. No fluff."
  }
}

RULES:
1. The planets object must use ONLY these keys: sun, moon, rising, venus, mars, mercury, saturn, jupiter.
2. Use the planet map values provided above verbatim.
3. The preview array must have EXACTLY 3 items.
4. The locked array must have EXACTLY 9 items. Write them as plain descriptive phrases, not titles.
5. colorKey in preview items must be one of: sun, moon, rising, venus, mars, mercury, saturn, jupiter.
6. Choose the 3 most interesting and revealing placements for the preview based on the synthesis data.
7. Output JSON only. Nothing else.
`.trim();
}