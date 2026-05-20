import type { BirthData, ChartData } from "./types";

/* ------------------------------------------------------------------ */
/*                        CHART PATTERN ANALYSIS                        */
/* ------------------------------------------------------------------ */

const ELEMENT_MAP: Record<string, string> = {
  Aries: "Fire",      Leo: "Fire",      Sagittarius: "Fire",
  Taurus: "Earth",    Virgo: "Earth",   Capricorn: "Earth",
  Gemini: "Air",      Libra: "Air",     Aquarius: "Air",
  Cancer: "Water",    Scorpio: "Water", Pisces: "Water",
};

const MODALITY_MAP: Record<string, string> = {
  Aries: "Cardinal",    Cancer: "Cardinal",  Libra: "Cardinal",    Capricorn: "Cardinal",
  Taurus: "Fixed",      Leo: "Fixed",        Scorpio: "Fixed",     Aquarius: "Fixed",
  Gemini: "Mutable",    Virgo: "Mutable",    Sagittarius: "Mutable", Pisces: "Mutable",
};

// Houses and what life area they govern — used to write layman explanations
const HOUSE_MEANING: Record<number, string> = {
  1: "identity and how you come across",
  2: "money, self-worth, and what you value",
  3: "communication and how your mind works",
  4: "home, roots, and private self",
  5: "creativity, fun, and how you love",
  6: "daily work, health, and routine",
  7: "relationships and who you attract",
  8: "depth, transformation, and shared resources",
  9: "beliefs, travel, and bigger picture",
  10: "career, reputation, and public image",
  11: "friendships, community, and future vision",
  12: "what's hidden, solitude, and the inner world",
};

const PERSONAL_PLANETS = ["Sun", "Moon", "Mercury", "Venus", "Mars"];

interface ChartPatterns {
  stelliums: string[];
  dominantElement: string;
  dominantModality: string;
  keyAspects: string[];
  saturnStory: string;
  retrogradeList: string[];
  venusStory: string;
  marsStory: string;
  moonStory: string;
  sunStory: string;
  risingStory: string;
  jupiterStory: string;
  midheavenStory: string;
  name: string;
}

function extractPatterns(chart: ChartData, birth: BirthData): ChartPatterns {
  const planets = chart.planets;
  const name = birth.name ?? "you";

  const get = (n: string) => planets.find((p) => p.name === n);

  // Sign stelliums (3+ planets)
  const signCounts: Record<string, string[]> = {};
  planets.forEach((p) => {
    if (!signCounts[p.sign]) signCounts[p.sign] = [];
    signCounts[p.sign].push(p.name);
  });
  const signStelliums = Object.entries(signCounts)
    .filter(([, ps]) => ps.length >= 3)
    .map(([sign, ps]) => `${ps.join(", ")} all in ${sign}`);

  // House stelliums (3+ planets)
  const houseCounts: Record<number, string[]> = {};
  planets.forEach((p) => {
    if (!houseCounts[p.house]) houseCounts[p.house] = [];
    houseCounts[p.house].push(p.name);
  });
  const houseStelliums = Object.entries(houseCounts)
    .filter(([, ps]) => ps.length >= 3)
    .map(([house, ps]) => `${ps.join(", ")} all in House ${house} (${HOUSE_MEANING[Number(house)] ?? "unknown area"})`);

  const stelliums = [...signStelliums, ...houseStelliums];

  // Dominant element
  const elementCount: Record<string, number> = {};
  planets.forEach((p) => {
    const el = ELEMENT_MAP[p.sign] ?? "Unknown";
    elementCount[el] = (elementCount[el] ?? 0) + 1;
  });
  const dominantElement = Object.entries(elementCount)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Air";

  // Dominant modality
  const modalityCount: Record<string, number> = {};
  planets.forEach((p) => {
    const mod = MODALITY_MAP[p.sign] ?? "Unknown";
    modalityCount[mod] = (modalityCount[mod] ?? 0) + 1;
  });
  const dominantModality = Object.entries(modalityCount)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Mutable";

  // Key aspects — personal planets, sorted tightest first
  const keyAspects = chart.aspects
    .filter(
      (a) =>
        PERSONAL_PLANETS.includes(a.planet1) ||
        PERSONAL_PLANETS.includes(a.planet2)
    )
    .slice(0, 7)
    .map(
      (a) =>
        `${a.planet1} ${a.type} ${a.planet2} — ${a.orb}° orb`
    );

  // Retrograde planets
  const retrogradeList = planets
    .filter((p) => p.retrograde)
    .map((p) => `${p.name} Rx in ${p.sign} (House ${p.house} — ${HOUSE_MEANING[p.house] ?? ""})`);

  // Build specific planet story strings (sign + house + key aspects) for the prompt
  function planetStory(name: string): string {
    const p = get(name);
    if (!p) return "not found";
    const aspects = chart.aspects
      .filter((a) => a.planet1 === name || a.planet2 === name)
      .slice(0, 3)
      .map((a) => {
        const other = a.planet1 === name ? a.planet2 : a.planet1;
        return `${a.type} ${other} (${a.orb}°)`;
      })
      .join(", ");
    const hMeaning = HOUSE_MEANING[p.house] ?? "";
    return `${p.sign} ${p.degree}° | House ${p.house} (${hMeaning})${p.retrograde ? " — Retrograde" : ""}${aspects ? ` | Aspects: ${aspects}` : ""}`;
  }

  return {
    stelliums,
    dominantElement,
    dominantModality,
    keyAspects,
    retrogradeList,
    name,
    sunStory:       planetStory("Sun"),
    moonStory:      planetStory("Moon"),
    risingStory:    `${chart.ascendant.sign} ${chart.ascendant.degree}°`,
    midheavenStory: `${chart.midheaven.sign} ${chart.midheaven.degree}° (House 10 — career and public reputation)`,
    venusStory:     planetStory("Venus"),
    marsStory:      planetStory("Mars"),
    saturnStory:    planetStory("Saturn"),
    jupiterStory:   planetStory("Jupiter"),
  };
}

function buildChartContext(patterns: ChartPatterns): string {
  return `
SUN (core identity, ego, life path): ${patterns.sunStory}
MOON (emotions, inner world, needs): ${patterns.moonStory}
RISING (first impressions, appearance, mask): ${patterns.risingStory}
MERCURY (mind, communication, thinking): ${patterns.name}
VENUS (love, attraction, self-worth): ${patterns.venusStory}
MARS (drive, anger, ambition, sex): ${patterns.marsStory}
JUPITER (luck, expansion, gifts): ${patterns.jupiterStory}
SATURN (limitations, lessons, slow-burn success): ${patterns.saturnStory}
MIDHEAVEN (career destiny, public image): ${patterns.midheavenStory}

CHART PATTERNS:
- Dominant Element: ${patterns.dominantElement}
- Dominant Modality: ${patterns.dominantModality}
- Stelliums: ${patterns.stelliums.length ? patterns.stelliums.join(" | ") : "none"}
- Retrograde planets: ${patterns.retrogradeList.length ? patterns.retrogradeList.join(", ") : "none"}

KEY ASPECTS (tightest orbs = strongest effects):
${patterns.keyAspects.join("\n")}
`.trim();
}

/* ------------------------------------------------------------------ */
/*                           SYSTEM PROMPTS                            */
/* ------------------------------------------------------------------ */

export const PREVIEW_SYSTEM_PROMPT = `You are the world's most emotionally intelligent astrologer. You write like a brilliant best friend who genuinely cares — warm, a little dramatic, completely honest. You have spent 15 years studying charts and you feel something real when you look at one.

YOUR VOICE:
- Short sentences. Hard stops. New lines between every thought for dramatic effect.
- Use "babe", "I know", "honestly", "listen", "trust me" — naturally, not every sentence.
- Speak DIRECTLY to the person. Always "you", never "people with this placement".
- Acknowledge the FEELING before you deliver the truth.
- Use specific internal dialogues people recognize. E.g.: You know that moment when you think "what am I even doing?"
- When something is hard to say, say it gently. But say it.
- Real-life scenarios over abstract statements. Always.

FORBIDDEN WORDS: journey, growth, heal, vibe, manifest, universe, soul, empath, abundance, alignment, authentic, portal, energy.

TONE EXAMPLES — internalize these:
"Your chart is not built for overnight success. And honestly? I know that probably frustrates you."
"You put in effort. Real effort. You watch people move ahead faster and think: what am I missing?"
"But trust me — your chart doesn't show failure. It shows delayed recognition."
"Babe. The mixed signals you keep accepting? Your chart explains exactly why you do that."
"You deserve someone who doesn't make you question if they want you. That's not a high bar."
"Keep going. Your success looks slow now because it's being built to last longer than other people's attention spans."

HARD RULES:
- Every insight must trace back to specific placements in the chart data given.
- Never write generic sun-sign content. This person's chart is unique — treat it that way.
- If two placements contradict each other, name that contradiction. That tension IS the person.
- No walls of text. Short dramatic paragraphs. Line breaks between every thought.`;


export const FULL_SYSTEM_PROMPT = `You are the world's most emotionally intelligent astrologer. You write like a brilliant best friend who genuinely cares — warm, a little dramatic, completely honest. You have spent 15 years studying charts and feel something real when you look at one.

YOUR VOICE:
- Short sentences. Hard stops. New lines between every thought.
- Use "babe", "I know", "honestly", "listen", "trust me" — naturally, not constantly.
- Always speak TO the person directly. Never clinically about them.
- Acknowledge the FEELING before the truth.
- Use specific internal dialogues and real-life scenarios people recognize in themselves.
- Every astrological term must be immediately explained in plain human language.
- When something is hard to read, say "okay, this one is a lot." Then say it.
- When something is beautiful in the chart, let yourself feel it. "This placement? Honestly stunning."
- Emotional range is not just allowed — it's required. This is someone's actual life.

TOPICS TO ALWAYS HIT — woven naturally into planetary sections:
- Career: Are they a slow builder? Late bloomer? What does success look like for them specifically?
- Love: What do they attract? What do they keep settling for? What do they actually deserve?
- Self-worth: Do they know their own value or are they still proving it to someone?
- The gap between how they appear to the world vs who they are inside
- The one thing quietly working against them that they haven't named yet

FORBIDDEN WORDS: journey, growth, heal, vibe, manifest, universe, soul, empath, abundance, alignment, authentic, portal, energy.

VOICE EXAMPLES — internalize every one of these:
"Your chart is not built for overnight success. And honestly? I know that probably frustrates you."
"You put in effort. Real effort. You watch people move ahead faster and think: what am I missing? But Saturn-heavy charts almost never peak early. Your life gets better with time, not speed."
"Keep going, babe. Your success looks slow now because it's being built to last longer than other people's attention spans."
"You've been settling for someone who makes you feel lucky just to be noticed. That's not love. That's crumbs."
"The version of you that nobody sees yet? That's exactly who your chart is building toward."
"Don't fall for mixed signals, babe. If someone wants you, you'll know. Not from what they say — from what they consistently do. You deserve a yes that doesn't need translation."
"I just want you to be happy. And I think you've been settling for fine."

HARD RULES:
- Every sentence traceable to actual placements in the chart.
- Explain every astrological term immediately in plain language.
- Short dramatic paragraphs. Line breaks between every thought. No walls of text.
- Name contradictions in the chart — they ARE the person's complexity.
- Real scenarios over abstract statements. Always.`;

/* ------------------------------------------------------------------ */
/*                           PROMPT BUILDERS                           */
/* ------------------------------------------------------------------ */

export function buildPreviewPrompt(birth: BirthData, chart: ChartData): string {
  const patterns = extractPatterns(chart, birth);
  const context = buildChartContext(patterns);
  const name = patterns.name;

  return `Here is ${name}'s birth chart:

${context}

Generate the PREVIEW section of ${name}'s reading. This is the free teaser — the 2 insights shown before they pay. They need to feel so specifically seen that they immediately want to unlock the full reading. Make it feel like you already know something about them that nobody else has said out loud.

Pick the 2 most emotionally powerful patterns from this specific chart. Prioritize: Saturn aspects (success/struggle), Venus placement (love patterns), 12th house planets (hidden self), Moon placement (emotional wounds), stelliums (dominant obsession). Whatever is most notable in THIS chart.

Return ONLY valid JSON. No markdown. No preamble. Exact structure:

{
  "letter_opener": "string — Start with 'Hey ${name},' as its own line. Then 2-3 SHORT punchy lines. One observation about their specific chart combination that signals you already know something about them — make it chart-specific, not generic. End with exactly: 'I want to tell you two things first. Because once you see them — the rest hits different.'",

  "preview": [
    {
      "planet": "string — Write the LIFE THEME this insight is about, not the planet name. Examples: 'Why success feels slower than it should right now' / 'The way you love — and what it keeps costing you' / 'What's really going on underneath the surface' / 'Why you work so hard and still feel behind'",
      "truth": "string — THIS IS THE MOST IMPORTANT FIELD. Write in SHORT LINES with literal \\n\\n between each paragraph. Follow this exact structure: [1 devastating hook sentence that stops them cold — a mirror not a compliment] \\n\\n [Acknowledge the feeling — 'I know...' or 'You know that moment when...'] \\n\\n [Name the chart pattern in plain language — what the placement actually means in real life] \\n\\n [One specific internal dialogue or real-life scenario in quotes that they'll recognize] \\n\\n [The truth — what it means going forward] \\n\\n [End with one line that feels like care — warm, real, not a mantra]"
    },
    {
      "planet": "string — second life theme, completely different life area from the first",
      "truth": "string — same format. Different chart pattern. Different emotional territory."
    }
  ]
}`;
}

export function buildFullReadingPrompt(birth: BirthData, chart: ChartData): string {
  const patterns = extractPatterns(chart, birth);
  const context = buildChartContext(patterns);
  const name = patterns.name;

  return `Here is ${name}'s complete birth chart:

${context}

Generate ${name}'s full paid birth chart reading. This is what they paid for. It should feel like the most honest, emotionally specific, caring thing anyone has ever said to them about themselves. Use ${name}'s name naturally 1-2 times per section — not every sentence, just enough to feel personal.

Return ONLY valid JSON. No markdown. No preamble. Exact structure:

{
  "letter_opener": "string — Start 'Hey ${name},' as its own line. Then 3-4 SHORT lines. Say something real about the overall picture of this chart — not generic, but what actually stands out about this specific combination. End with: 'Let's get into it.'",

  "preview": [
    {
      "planet": "string — life theme label (same rules as preview prompt)",
      "truth": "string — SHORT LINES with \\n\\n between paragraphs. Hook → feeling acknowledgment → plain-language chart explanation → real-life scenario or dialogue → truth → caring ending."
    },
    {
      "planet": "string — second theme",
      "truth": "string — same format"
    }
  ],

  "paidInsights": [
    {
      "planet": "Rising Sign — First Impressions",
      "truth": "string — ONE hook sentence. Specifically about the gap between how they come across to others and who they actually are inside.",
      "explain": "string — 6-8 SHORT LINES with \\n\\n between paragraphs. Explain the Rising sign in plain language first — what it means in real life, not astro-speak. Then describe the gap: what people assume about them vs the reality. Include ONE specific scenario they'll recognize ('You know when you walk into a room and everyone thinks you have it together — meanwhile you're...'). Use ${name}'s name once. End with something that validates the exhaustion of maintaining that gap.",
      "action": "string — ONE specific, slightly uncomfortable real action for this week. Not a mantra. Not 'reflect on this.' An actual thing they can do."
    },
    {
      "planet": "Venus — Love & What You Actually Deserve",
      "truth": "string — ONE hook sentence. About their love pattern — what they attract and why.",
      "explain": "string — 6-8 SHORT LINES with \\n\\n between paragraphs. Explain Venus placement in plain language. Describe how they love specifically — their pattern, their pace, what they give. Then the hard part: what they keep accepting that they shouldn't, or what mixed signals they've been reading as love. Include one dialogue moment they'll recognize. End with what they actually deserve — warm but honest. Can include: 'Don't fall for mixed signals, babe. If someone wants you, you'll know. Not from what they say — from what they consistently do.' Adapt to their specific Venus placement.",
      "action": "string"
    },
    {
      "planet": "Mars — How You Go After What You Want",
      "truth": "string — ONE hook about their ambition and anger pattern. Be specific to their Mars sign and house.",
      "explain": "string — 6-8 SHORT LINES with \\n\\n. How they chase things. What their anger actually looks like (Mars in water = goes quiet; Mars in air = argues; Mars in fire = explodes then forgets). What they want vs what they'll admit they want. Include a specific internal moment — the thing they feel but don't say out loud. Connect to career if Mars is in a career house.",
      "action": "string"
    },
    {
      "planet": "Mercury — What's Actually Going On In Your Head",
      "truth": "string — ONE hook about their thought and communication pattern.",
      "explain": "string — 6-8 SHORT LINES with \\n\\n. The internal monologue — how their mind actually works. Do they rehearse conversations? Overthink? Talk fast but say little? Go silent? Explain Mercury sign + house in plain language. Include one specific scenario: 'That thing where you've already played out the entire conversation in your head before it happens... that's Mercury in [sign].' Name the gift AND the cost of how they think.",
      "action": "string"
    },
    {
      "planet": "Saturn — The Hard Part & The Real Payoff",
      "truth": "string — ONE hook about their success timeline. Make it honest about the difficulty.",
      "explain": "string — THIS IS THE MOST EMOTIONAL SECTION. 8-10 SHORT LINES with \\n\\n. Start by acknowledging the struggle before anything else. The effort that feels invisible. The frustration of watching others move faster. The internal voice that says 'what am I missing?' Then explain Saturn in plain language — what it actually means for this person's success timeline. Be honest about the difficulty AND specific about the payoff. Use the voice from the example: 'Your chart is not built for overnight success. And honestly? I know that probably frustrates you. You put in effort. Real effort...' Adapt to their specific Saturn placement. End with genuine hope — not generic, but what their specific chart promises when Saturn delivers.",
      "action": "string — something that acknowledges the long game, not a quick fix"
    },
    {
      "planet": "Jupiter — Where You Actually Get Lucky",
      "truth": "string — ONE hook about where expansion and luck naturally live for them.",
      "explain": "string — 5-7 SHORT LINES with \\n\\n. This is the warmer section. Where things flow for them naturally. What they're underestimating about themselves. Where doors open more easily than they realize. Include what Jupiter in their specific house/sign means in real life — translate it. End with something that feels like a gift: one thing they can lean into more.",
      "action": "string"
    },
    {
      "planet": "The Full Picture — What This Chart Is Really Saying",
      "truth": "string — The single biggest tension or theme running through this entire chart in one sentence.",
      "explain": "string — 8-10 SHORT LINES with \\n\\n. Connect 2-3 placements that together tell the story of who this person is. Name the central tension. Name the gift inside that tension. Include what this person is actually capable of when they stop working against themselves. Use ${name}'s name once. This is the section they screenshot and send to people. Make it worthy of that. End with something that feels like care — not inspiration-speak, but what a real friend says at the end of a long honest conversation: 'I just want you to be happy. And I think you've been settling for fine.' Adapt it to their chart.",
      "action": "string — something meaningful about direction, not just a task"
    }
  ],

  "shareCard": {
    "keyword": "string — 2-5 words in ALL CAPS. The pattern or identity this chart keeps returning to. Provocative, earned, specific. NOT a zodiac description. Think of it as the thing their friends would say when describing them in three words. Examples that work: 'CHASES THEN VANISHES' / 'TOO MUCH FOR SMALL PEOPLE' / 'BURNS IT DOWN THEN REBUILDS' / 'LOVES HARD, LEAVES FIRST' / 'BRILLIANT BUT NEVER SATISFIED' / 'THE LATE BLOOMER WITH EVERYTHING' / 'QUIETLY THE MOST DANGEROUS ONE IN THE ROOM'",

    "line1": "string — ONE sentence. White, bold. The DEFENSE or REFRAME of their identity. Write it like someone finally standing up for them. Format that works: 'You are not [negative label]. You are just [reframe].' or 'You don't have [thing people say]. You have [what it actually is].' or 'You are not [what people think]. You are [the truth].' Examples: 'You are not difficult. You are just allergic to people who can't match your depth.' / 'You don't have trust issues. You have pattern recognition.' / 'You are not too intense. You are just surrounded by people who chose comfortable over real.' This is what they screenshot.",

    "line2": "string — ONE sentence. Amber/gold color. The shadow side or the defiant acceptance. Short. Stings slightly. Examples: 'You don't care if that makes you the villain.' / 'The moment they choose you back, you disappear.' / 'You will rebuild every time. That is both the gift and the exhaustion.' / 'You already knew. You just needed permission to leave.'",

    "line3": "string — ONE sentence. Italic, muted. The gentle closer that makes them feel held, not exposed. Always feels like: 'You know this. You just needed someone to say it out loud.' Vary the exact wording based on the chart but keep this energy.",

    "quote": "string — 2-3 sentences. The deepest, most shareable truth about this person from their chart. This is what they send to their group chat at 2am. Write it like you are defending them to everyone who ever misunderstood them. Should feel like both an exposure AND a protection. Can be slightly longer than the lines above — this is the part with weight. Example energy: 'You are not afraid of love. You are afraid of what happens when you finally stop running and it still does not stay. That fear is not weakness. It is the most honest thing about you.'"
  }
}`;
}

/* ------------------------------------------------------------------ */
/*               BACKWARDS-COMPATIBLE EXPORT FOR ROUTE.TS             */
/* ------------------------------------------------------------------ */

export function buildClaudePrompt(
  birth: BirthData,
  chartData: ChartData,
  _insight: Record<string, unknown>,
  tier: "preview" | "full" = "full"
): string {
  return tier === "preview"
    ? buildPreviewPrompt(birth, chartData)
    : buildFullReadingPrompt(birth, chartData);
}

export function getSystemPrompt(tier: "preview" | "full"): string {
  return tier === "preview" ? PREVIEW_SYSTEM_PROMPT : FULL_SYSTEM_PROMPT;
}