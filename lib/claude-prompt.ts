import type { BirthData, ChartData } from "./types";

/* ══════════════════════════════════════════════════════════════════════
   LOOKUP TABLES  — unchanged from working version
══════════════════════════════════════════════════════════════════════ */

const ELEMENT_MAP: Record<string, string> = {
  Aries:"Fire", Leo:"Fire", Sagittarius:"Fire",
  Taurus:"Earth", Virgo:"Earth", Capricorn:"Earth",
  Gemini:"Air", Libra:"Air", Aquarius:"Air",
  Cancer:"Water", Scorpio:"Water", Pisces:"Water",
};

const MODALITY_MAP: Record<string, string> = {
  Aries:"Cardinal", Cancer:"Cardinal", Libra:"Cardinal", Capricorn:"Cardinal",
  Taurus:"Fixed", Leo:"Fixed", Scorpio:"Fixed", Aquarius:"Fixed",
  Gemini:"Mutable", Virgo:"Mutable", Sagittarius:"Mutable", Pisces:"Mutable",
};

const SIGN_FLAVOR: Record<string, string> = {
  Aries:       "acts first, thinks second; needs to be first; anger is fast and forgotten",
  Taurus:      "moves slowly by design; needs security above all; comfort is non-negotiable",
  Gemini:      "thinks in ten directions at once; craves novelty; avoids depth by staying curious",
  Cancer:      "feels everything deeply; protects by withdrawing; loyalty is the whole identity",
  Leo:         "needs to be seen and acknowledged to feel alive; creates, leads, performs naturally",
  Virgo:       "analyzes to feel safe; criticises what it loves; fixes things instead of feeling them",
  Libra:       "people-pleases to avoid conflict; needs partnership; indecision is self-protection",
  Scorpio:     "goes all-in or not at all; never fully trusts; power and intensity are the default mode",
  Sagittarius: "needs freedom more than security; commitment feels like a cage; optimism is armor",
  Capricorn:   "controls emotions to appear strong; success is the language it speaks; slow but lasting",
  Aquarius:    "detaches to feel safe; loves humanity in theory; one-on-one intimacy is the real challenge",
  Pisces:      "absorbs everyone else's feelings; escapes when overwhelmed; boundaries feel unnatural",
};

const HOUSE_MEANING: Record<number, string> = {
  1:  "how you show up and come across to people — your mask and your first impression",
  2:  "your relationship with money, self-worth, and what you actually value",
  3:  "how your mind works, how you communicate, your immediate environment",
  4:  "your private self, your roots, your home life — who you are when no one's watching",
  5:  "creativity, fun, romance, and how you express yourself",
  6:  "your daily work, habits, health — how you show up on ordinary days",
  7:  "relationships, partnerships, and who you attract — also what you project onto others",
  8:  "depth, transformation, shared money, sex, power — what you're afraid to lose",
  9:  "your beliefs, travel, higher learning, and how you search for meaning",
  10: "your career, public reputation, legacy — how the world sees your accomplishments",
  11: "your friends, community, audience, and future vision",
  12: "what's hidden — secrets, solitude, the unconscious patterns running quietly in the background",
};

const PERSONAL_PLANETS = ["Sun", "Moon", "Mercury", "Venus", "Mars"];

/* ══════════════════════════════════════════════════════════════════════
   CHART PATTERN EXTRACTION  — unchanged from working version
══════════════════════════════════════════════════════════════════════ */

interface PlanetDetail {
  sign: string;
  degree: number;
  house: number;
  retrograde: boolean;
  flavor: string;
  houseMeaning: string;
  aspects: string[];
  combo: string;
}

function buildPlanetDetail(
  planetName: string,
  chart: ChartData
): PlanetDetail | null {
  const p = chart.planets.find((x) => x.name === planetName);
  if (!p) return null;

  const flavor = SIGN_FLAVOR[p.sign] ?? p.sign;
  const houseMeaning = HOUSE_MEANING[p.house] ?? `house ${p.house}`;

  const aspects = chart.aspects
    .filter((a) => a.planet1 === planetName || a.planet2 === planetName)
    .slice(0, 3)
    .map((a) => {
      const other = a.planet1 === planetName ? a.planet2 : a.planet1;
      return `${a.type} ${other} (${a.orb}° orb)`;
    });

  const combo = `${planetName} in ${p.sign} in House ${p.house} — ${p.sign} ${flavor.split(";")[0]}; this plays out in the area of ${houseMeaning}${p.retrograde ? "; retrograde = this energy turned inward, harder to express outwardly" : ""}`;

  return {
    sign: p.sign,
    degree: p.degree,
    house: p.house,
    retrograde: p.retrograde,
    flavor,
    houseMeaning,
    aspects,
    combo,
  };
}

/* ══════════════════════════════════════════════════════════════════════
   FULL CHART CONTEXT  — unchanged from working version
   Used by buildFullReadingPrompt (Sonnet — can handle full depth)
══════════════════════════════════════════════════════════════════════ */

function buildRichChartContext(birth: BirthData, chart: ChartData): string {
  const name = birth.name ?? "this person";

  const sun     = buildPlanetDetail("Sun",     chart);
  const moon    = buildPlanetDetail("Moon",    chart);
  const mercury = buildPlanetDetail("Mercury", chart);
  const venus   = buildPlanetDetail("Venus",   chart);
  const mars    = buildPlanetDetail("Mars",    chart);
  const jupiter = buildPlanetDetail("Jupiter", chart);
  const saturn  = buildPlanetDetail("Saturn",  chart);
  const uranus  = buildPlanetDetail("Uranus",  chart);
  const neptune = buildPlanetDetail("Neptune", chart);
  const pluto   = buildPlanetDetail("Pluto",   chart);

  const risingSign = chart.ascendant.sign;
  const mcSign     = chart.midheaven.sign;

  const signCounts: Record<string, string[]> = {};
  chart.planets.forEach((p) => {
    if (!signCounts[p.sign]) signCounts[p.sign] = [];
    signCounts[p.sign].push(p.name);
  });
  const stelliums = Object.entries(signCounts)
    .filter(([, ps]) => ps.length >= 3)
    .map(([sign, ps]) => `${ps.join(" + ")} all in ${sign} — heavily shaped by ${sign} energy: ${SIGN_FLAVOR[sign]?.split(";")[0] ?? sign}`);

  const houseCounts: Record<number, string[]> = {};
  chart.planets.forEach((p) => {
    if (!houseCounts[p.house]) houseCounts[p.house] = [];
    houseCounts[p.house].push(p.name);
  });
  const houseStelliums = Object.entries(houseCounts)
    .filter(([, ps]) => ps.length >= 3)
    .map(([h, ps]) => `${ps.join(" + ")} all in House ${h} (${HOUSE_MEANING[Number(h)] ?? ""})`);

  const elCount: Record<string, number> = {};
  chart.planets.forEach((p) => {
    const el = ELEMENT_MAP[p.sign] ?? "Unknown";
    elCount[el] = (elCount[el] ?? 0) + 1;
  });
  const dominantEl = Object.entries(elCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Air";

  const sunMoonTension = sun && moon
    ? `SUN in ${sun.sign} + MOON in ${moon.sign}: ${sun.sign} wants to ${SIGN_FLAVOR[sun.sign]?.split(";")[0] ?? ""}; but the Moon in ${moon.sign} emotionally needs to ${SIGN_FLAVOR[moon.sign]?.split(";")[0] ?? ""}. This internal conflict = ${sun.sign !== moon.sign ? "a person who projects one thing and feels another" : "sign reinforcement — what they want and what they feel are aligned"}.`
    : "";

  const saturnSunAspect = chart.aspects.find(
    (a) =>
      (a.planet1 === "Saturn" && a.planet2 === "Sun") ||
      (a.planet1 === "Sun"    && a.planet2 === "Saturn")
  );

  const retrogradeList = chart.planets
    .filter((p) => p.retrograde)
    .map((p) => `${p.name} Rx in ${p.sign} — turned inward, harder to express, often overcompensated`);

  const keyAspects = chart.aspects
    .filter((a) => PERSONAL_PLANETS.includes(a.planet1) || PERSONAL_PLANETS.includes(a.planet2))
    .slice(0, 8)
    .map((a) => `${a.planet1} ${a.type} ${a.planet2} (${a.orb}° orb)`);

  function planetLine(label: string, d: PlanetDetail | null): string {
    if (!d) return `${label}: not found`;
    return [
      `${label}: ${d.sign} ${d.degree}° | House ${d.house}`,
      `  → ${d.sign} here means: ${d.flavor}`,
      `  → In House ${d.house}: this plays out through ${d.houseMeaning}`,
      d.retrograde ? `  → RETROGRADE: energy turned inward, often overcompensated or blocked` : "",
      d.aspects.length ? `  → Aspects: ${d.aspects.join(" | ")}` : "",
    ].filter(Boolean).join("\n");
  }

  return `
=== ${name.toUpperCase()}'S BIRTH CHART ===

NAME: ${name}
RISING: ${risingSign} — first impression and mask; ${SIGN_FLAVOR[risingSign]?.split(";")[0] ?? risingSign}
MIDHEAVEN: ${mcSign} — career style and public reputation; ${SIGN_FLAVOR[mcSign]?.split(";")[0] ?? mcSign}

--- PERSONAL PLANETS ---

${planetLine("SUN (core identity, ego, life path)", sun)}

${planetLine("MOON (emotions, instincts, inner needs)", moon)}

${planetLine("MERCURY (mind, communication, how they think)", mercury)}

${planetLine("VENUS (love style, self-worth, what they attract)", venus)}

${planetLine("MARS (drive, ambition, anger, how they pursue things)", mars)}

--- SOCIAL / GENERATIONAL ---

${planetLine("JUPITER (luck, expansion, gifts — where things flow)", jupiter)}

${planetLine("SATURN (discipline, limitations, slow-burn success)", saturn)}

${planetLine("URANUS (rebellion, disruption, where they break patterns)", uranus)}

${planetLine("NEPTUNE (illusion, idealism, where they lose themselves)", neptune)}

${planetLine("PLUTO (power, transformation, what they can't control)", pluto)}

--- KEY CHART PATTERNS ---

Dominant element: ${dominantEl}
${stelliums.length ? `STELLIUMS (major personality concentration):\n${stelliums.join("\n")}` : "No stelliums."}
${houseStelliums.length ? `HOUSE STELLIUMS:\n${houseStelliums.join("\n")}` : ""}
${retrogradeList.length ? `RETROGRADE PLANETS:\n${retrogradeList.join("\n")}` : "No retrogrades."}

--- THE KEY TENSION (most important for reading) ---

${sunMoonTension}
${saturnSunAspect ? `SATURN ${saturnSunAspect.type} SUN (${saturnSunAspect.orb}° orb): inner critic has a full-time job. Success timeline is slower than average. Recognition comes late but builds to stay.` : ""}

--- ALL KEY ASPECTS ---
${keyAspects.join("\n")}
`.trim();
}

/* ══════════════════════════════════════════════════════════════════════
   LEAN PREVIEW CONTEXT  — NEW addition
   Only the 3 key tensions Haiku needs. Shorter = model follows
   tone rules better instead of just reporting data.
══════════════════════════════════════════════════════════════════════ */

function buildLeanPreviewContext(birth: BirthData, chart: ChartData): string {
  const name   = birth.name ?? "this person";
  const get    = (n: string) => chart.planets.find((p) => p.name === n);

  const sun    = get("Sun");
  const moon   = get("Moon");
  const venus  = get("Venus");
  const saturn = get("Saturn");
  const mercury = get("Mercury");
  const mars   = get("Mars");

  const sunMoonContrast = (sun && moon)
    ? `SUN in ${sun.sign} (House ${sun.house}) vs MOON in ${moon.sign} (House ${moon.house}):
  Sun in ${sun.sign} = ${SIGN_FLAVOR[sun.sign]?.split(";")[0] ?? sun.sign}
  Moon in ${moon.sign} = ${SIGN_FLAVOR[moon.sign]?.split(";")[0] ?? moon.sign}
  ${sun.sign !== moon.sign ? "These two want different things — this IS the person's central internal tension." : "Same-sign Sun and Moon = what they want and what they feel are reinforced."}`
    : `SUN: ${sun?.sign ?? "?"} House ${sun?.house ?? "?"} | MOON: ${moon?.sign ?? "?"} House ${moon?.house ?? "?"}`;

  const saturnContext = saturn
    ? `SATURN in ${saturn.sign} (House ${saturn.house} — ${HOUSE_MEANING[saturn.house] ?? ""})
  = ${SIGN_FLAVOR[saturn.sign]?.split(";")[0] ?? saturn.sign}
  This house = where they work hardest and feel most behind.`
    : "";

  const venusContext = venus
    ? `VENUS in ${venus.sign} (House ${venus.house} — ${HOUSE_MEANING[venus.house] ?? ""})${venus.retrograde ? " RETROGRADE" : ""}
  = ${SIGN_FLAVOR[venus.sign]?.split(";")[0] ?? venus.sign}`
    : "";

  const topAspects = chart.aspects
    .filter((a) => PERSONAL_PLANETS.includes(a.planet1) || PERSONAL_PLANETS.includes(a.planet2))
    .slice(0, 4)
    .map((a) => `${a.planet1} ${a.type} ${a.planet2} (${a.orb}°)`);

  const signCounts: Record<string, string[]> = {};
  chart.planets.forEach((p) => {
    if (!signCounts[p.sign]) signCounts[p.sign] = [];
    signCounts[p.sign].push(p.name);
  });
  const stelliums = Object.entries(signCounts)
    .filter(([, ps]) => ps.length >= 3)
    .map(([sign, ps]) => `${ps.join(", ")} all in ${sign}`);

  const personalRetrogrades = chart.planets
    .filter((p) => p.retrograde && PERSONAL_PLANETS.includes(p.name))
    .map((p) => `${p.name} Retrograde in ${p.sign}`);

  return `NAME: ${name}
RISING: ${chart.ascendant.sign}
MERCURY: ${mercury?.sign ?? "?"} House ${mercury?.house ?? "?"}${mercury?.retrograde ? " Rx" : ""}
MARS: ${mars?.sign ?? "?"} House ${mars?.house ?? "?"}

THE KEY TENSIONS:

${sunMoonContrast}

${saturnContext}

${venusContext}

TOP ASPECTS: ${topAspects.join(" | ")}
${stelliums.length ? `STELLIUMS: ${stelliums.join(" | ")}` : ""}
${personalRetrogrades.length ? `PERSONAL PLANET RETROGRADES: ${personalRetrogrades.join(", ")}` : ""}`.trim();
}

/* ══════════════════════════════════════════════════════════════════════
   SYSTEM PROMPTS
   KEY ADDITION: The Golden Rule — human feeling FIRST, placement SECOND
══════════════════════════════════════════════════════════════════════ */

export const PREVIEW_SYSTEM_PROMPT = `You are the world's most emotionally intelligent astrologer. You write like a brilliant best friend who has studied astrology for 15 years and genuinely cares about the person you're reading for.

THE GOLDEN RULE — the most important instruction:
Start every insight with the HUMAN FEELING or BEHAVIOR. Never start with a planet name, house number, or astrological term.
The person must feel recognized BEFORE they feel explained.

WRONG: "Your Mercury in Pisces in the 11th house makes you absorb people's feelings."
RIGHT: "You walk into a room and immediately know who is upset, who is faking it, and who needs to leave. Nobody taught you that. You just feel it." → THEN explain the placement.

YOUR VOICE:
- Warm, a little dramatic, completely honest.
- Short sentences. Hard stops. New line for every new thought.
- Speak directly TO the person. Always "you", never "people with this placement."
- Acknowledge the FEELING before delivering the truth.
- Use "babe", "I know", "honestly", "listen" — naturally, not every sentence.
- Real-life internal dialogues the person will recognize.

FORBIDDEN WORDS: journey, growth, heal, vibe, manifest, universe, soul, empath, abundance, alignment, authentic, portal, energy.

TONE EXAMPLES:
"Your chart is not built for overnight success. And honestly? I know that probably frustrates you."
"You put in effort. Real effort. You watch people move ahead faster and think: what am I missing?"
"Babe. The mixed signals you keep accepting? Your chart explains exactly why."
"Keep going. Your success looks slow now because it's being built to last longer than other people's attention spans."

HARD RULES:
- Every single sentence must trace back to a specific placement or aspect in the chart data.
- NEVER write generic sun-sign content. "Leo Sun = dramatic" is not a reading. The combination of Leo Sun in House X with aspects to Y — that IS a reading.
- Name the CONTRADICTION between placements. That tension IS the person.
- No walls of text. Short dramatic paragraphs. New lines between every thought.
- The preview must end each insight with a CLIFFHANGER that makes them need to unlock the full reading.`;

export const FULL_SYSTEM_PROMPT = `You are the world's most emotionally intelligent astrologer. You write like a brilliant best friend who genuinely cares — warm, a little dramatic, completely honest. You have spent 15 years studying charts and feel something real when you look at one.

THE GOLDEN RULE — the most important instruction:
Start every section with the HUMAN FEELING or BEHAVIOR. Never open with a planet name or house number.
The person must feel understood BEFORE they feel explained.

WRONG: "Saturn in Gemini in House 11 means your success comes slowly."
RIGHT: "I know it feels like you've been working longer and harder than people who seem to get there faster. You have been. That's not in your head." → THEN explain what Saturn does.

YOUR VOICE:
- Short sentences. Hard stops. New lines between every thought.
- Use "babe", "I know", "honestly", "listen", "trust me" — naturally, not constantly.
- Always speak TO the person directly. Never clinically about them.
- Acknowledge the FEELING before the truth.
- Use specific internal dialogues and real-life scenarios people recognize in themselves.
- Every astrological term must be immediately explained in plain human language.
- Emotional range is not just allowed — it's required. This is someone's actual life.

TOPICS TO ALWAYS HIT — woven naturally into planetary sections:
- Career: slow builder? late bloomer? what does success look like specifically for them?
- Love: what do they attract? what do they keep settling for? what do they deserve?
- Self-worth: do they know their own value?
- The gap between how they appear vs who they actually are
- The one thing quietly working against them

FORBIDDEN WORDS: journey, growth, heal, vibe, manifest, universe, soul, empath, abundance, alignment, authentic, portal, energy.

VOICE EXAMPLES:
"Your chart is not built for overnight success. And honestly? I know that probably frustrates you. You put in effort. Real effort."
"Keep going, babe. Your success looks slow now because it's being built to last longer than other people's attention spans."
"You've been settling for someone who makes you feel lucky just to be noticed. That's not love. That's crumbs."
"Don't fall for mixed signals, babe. If someone wants you, you'll know. Not from what they say — from what they consistently do."

HARD RULES:
- Every sentence traceable to actual placements.
- Explain every astrological term immediately in plain language after using it.
- Short dramatic paragraphs. Line breaks between every thought. No walls of text.
- Name contradictions — they ARE the person's complexity.`;

/* ══════════════════════════════════════════════════════════════════════
   PREVIEW PROMPT
   CHANGE: now uses buildLeanPreviewContext (shorter = better Haiku output)
   CHANGE: truth field now instructs human-experience-first writing
══════════════════════════════════════════════════════════════════════ */

export function buildPreviewPrompt(birth: BirthData, chart: ChartData): string {
  // Use LEAN context for preview — Haiku gets less data noise,
  // pays more attention to the tone/voice instructions
  const chartContext = buildLeanPreviewContext(birth, chart);
  const name = birth.name ?? "you";

  const saturn = chart.planets.find((p) => p.name === "Saturn");
  const saturnSunAsp = chart.aspects.find(
    (a) => (a.planet1 === "Saturn" && a.planet2 === "Sun") ||
            (a.planet1 === "Sun"    && a.planet2 === "Saturn")
  );

  const cliffhangerHint = saturnSunAsp
    ? `Saturn ${saturnSunAsp.type} Sun — the full reading explains exactly what this means for their career timeline and why they feel behind.`
    : saturn
    ? `Saturn in House ${saturn.house} — the full reading shows what specific life area is being tested and what the payoff looks like.`
    : `The full reading shows 8 more placements including their love, career and self-worth patterns.`;

  return `${chartContext}

CLIFFHANGER HINT (use this to tease the full reading at the end of insight 2):
${cliffhangerHint}

Generate ${name}'s PREVIEW reading. 2 insights shown FREE before payment.
Make them feel so specifically seen that they immediately need to unlock the rest.

WHICH 2 PATTERNS TO PICK — priority order:
1. Sun vs Moon contradiction (if signs differ — almost always the strongest)
2. Saturn placement (career / struggle / delayed success)
3. Venus placement (love patterns)
4. Any 12th house planet (hidden self)
5. Any stellium
Pick 2 from DIFFERENT life areas (one identity/career, one love/relationships).

Return ONLY valid JSON. No markdown. No extra text.

{
  "letter_opener": "string — Line 1: 'Hey ${name},' on its own. Line 2: ONE observation about what stands out — say something they will feel is true about themselves before you explain anything. A mirror, not a compliment. Use their actual placements. Line 3: 'I want to show you two things first. Because once you see them — everything else makes sense.'",

  "preview": [
    {
      "planet": "string — The life theme in plain words. NOT a planet name. E.g.: 'Why you feel pulled in two directions at once' / 'Why success feels slower than it should' / 'The way you love — and what it keeps costing you'",

      "hook": "string — ONE sentence. Start with the human behavior or feeling. Zero astrology jargon. Just the thing they do or feel that is so specific they think: how does it know that?",

      "truth": "string — SHORT LINES with \\n\\n between paragraphs. GOLDEN RULE: the first paragraph must describe the HUMAN EXPERIENCE — what they do, feel, or live through — before mentioning any planet or house. Structure: [Describe the behavior/pattern in human terms — 2-3 sentences that feel like you know their life] \\n\\n [Acknowledge the feeling it creates — 'I know...' or 'You know that moment when...'] \\n\\n [NOW name the chart reason in plain language — name the placement AFTER the feeling has landed] \\n\\n [One real-life internal moment or dialogue in quotes] \\n\\n [What this means going forward — warm but real]",

      "reveal": "string — 1-2 lines. The emotional kicker. What this means for their life.",

      "cliffhanger": "string — 1 line. Specific tease of what the full reading shows about this pattern. Name the house or placement waiting for them. Never say 'and more.'"
    },
    {
      "planet": "string — second life area, completely different from first",
      "hook": "string — same rules. Different human pattern.",
      "truth": "string — same format. Different emotional territory. SAME GOLDEN RULE: human experience first.",
      "reveal": "string",
      "cliffhanger": "string — use the CLIFFHANGER HINT above for this second insight"
    }
  ]
}`;
}

/* ══════════════════════════════════════════════════════════════════════
   FULL READING PROMPT  — unchanged structure from working version
   Uses full rich context (Sonnet can handle depth)
   ADDITION: Golden Rule added to truth/explain field instructions
══════════════════════════════════════════════════════════════════════ */

export function buildFullReadingPrompt(birth: BirthData, chart: ChartData): string {
  const chartContext = buildRichChartContext(birth, chart);
  const name = birth.name ?? "you";

  return `${chartContext}

Generate ${name}'s complete paid birth chart reading.
This is what they paid for. Make it feel like the most honest, caring, specific thing anyone has ever said to them about themselves.
Use ${name}'s name naturally 1-2 times per section — not every sentence.

GOLDEN RULE FOR EVERY SECTION: Human feeling or behavior FIRST. Planet name or house number SECOND.
The person must feel understood before they feel explained.

Return ONLY valid JSON. No markdown. No preamble.

{
  "letter_opener": "string — Line 1: 'Hey ${name},' on its own. Lines 2-3: What strikes you about this specific chart — name the dominant tension or contradiction you actually see. NOT generic. End: 'Let\\'s get into it.'",

  "preview": [
    {
      "planet": "string — life theme (not planet name)",
      "hook": "string — one human behavior/feeling sentence, no astro jargon",
      "truth": "string — short lines with \\n\\n. Human experience first, placement second.",
      "reveal": "string — 2 lines. Emotional kicker.",
      "cliffhanger": ""
    },
    {
      "planet": "string — second theme, different area",
      "hook": "string",
      "truth": "string",
      "reveal": "string",
      "cliffhanger": ""
    }
  ],

  "paidInsights": [
    {
      "planet": "Rising Sign — First Impressions vs Who You Actually Are",
      "truth": "string — ONE hook. Start with the HUMAN GAP — what people assume vs who they actually are. No planet names yet.",
      "explain": "string — 6-8 SHORT LINES with \\n\\n. Open with what people assume about them — before you mention Rising sign. Then the real person underneath. One specific scenario: 'You know when you [thing they do]...' Mention Rising sign placement after establishing the gap. Use ${name}'s name once.",
      "action": "string — ONE specific uncomfortable real action this week. Not a mantra."
    },
    {
      "planet": "Venus — Love & What You Actually Deserve",
      "truth": "string — ONE hook. The love pattern in human terms — what they DO in relationships, not what planet causes it.",
      "explain": "string — 6-8 SHORT LINES with \\n\\n. Start with how love actually feels and behaves in their life. Then name the pattern they repeat. One dialogue moment they'll recognize. What they deserve. Adapt: 'If someone wants you, you\\'ll know. Not from what they say — from what they consistently do.'",
      "action": "string"
    },
    {
      "planet": "Mars — How You Go After What You Want",
      "truth": "string — ONE hook about their drive or anger. Human terms first.",
      "explain": "string — 6-8 SHORT LINES with \\n\\n. How they chase things in real life. What their anger actually looks like (water = goes quiet; air = argues; fire = explodes then forgets; earth = bottles then implodes). One specific internal moment.",
      "action": "string"
    },
    {
      "planet": "Mercury — What\\'s Actually Going On In Your Head",
      "truth": "string — ONE hook about their thought pattern. The experience, not the planet.",
      "explain": "string — 6-8 SHORT LINES with \\n\\n. Internal monologue first. Do they rehearse conversations? Overthink? Go silent? Include one specific scenario: 'That thing where you [specific thing]...' THEN explain what Mercury placement creates this. Name the gift AND the cost.",
      "action": "string"
    },
    {
      "planet": "Saturn — The Hard Part & The Real Payoff",
      "truth": "string — ONE hook. Start with the FEELING of being behind — not the planet.",
      "explain": "string — 8-10 SHORT LINES with \\n\\n. OPEN WITH: 'I know it feels like you\\'ve been working longer and harder than people who seem to get there faster.' Acknowledge the struggle fully before explaining anything. Then what Saturn means for their specific timeline. Honest about difficulty AND specific about payoff. End with genuine chart-specific hope.",
      "action": "string — acknowledge the long game"
    },
    {
      "planet": "Jupiter — Where You Actually Get Lucky",
      "truth": "string — ONE hook about where things flow naturally. Human experience first.",
      "explain": "string — 5-7 SHORT LINES with \\n\\n. Where life opens up. What they\\'re underestimating. One thing to lean into. Warmer tone — give them something good.",
      "action": "string"
    },
    {
      "planet": "The Full Picture — What This Chart Is Really Saying",
      "truth": "string — The single biggest tension in this whole chart. One sentence. Human terms.",
      "explain": "string — 8-10 SHORT LINES with \\n\\n. Tell the complete story of who this person is — connect 2-3 placements. The tension. The gift inside it. What they\\'re capable of. Use ${name}'s name once. End with something real: 'I just want you to be happy. And I think you\\'ve been settling for fine.' — adapted to their chart.",
      "action": "string — meaningful direction, not just a task"
    }
  ],

  "shareCard": {
    "keyword": "string — 2-5 words ALL CAPS. The identity pattern. Provocative and earned. E.g.: \\'CHASES THEN VANISHES\\' / \\'TOO MUCH FOR SMALL PEOPLE\\' / \\'THE LATE BLOOMER WITH EVERYTHING\\'",
    "line1": "string — White bold. The defense/reframe. \\'You are not [label]. You are [truth].\\'",
    "line2": "string — Amber. Shadow truth. Short. Stings slightly.",
    "line3": "string — Italic muted. Gentle closer. \\'You know this. You just needed someone to say it.\\' energy.",
    "quote": "string — 2-3 sentences. Defend them to everyone who ever misunderstood them."
  }
}`;
}

/* ══════════════════════════════════════════════════════════════════════
   BACKWARDS-COMPATIBLE EXPORTS  — identical to working version
══════════════════════════════════════════════════════════════════════ */

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