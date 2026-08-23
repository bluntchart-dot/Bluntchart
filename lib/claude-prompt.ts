import type { BirthData, ChartData } from "./types";

/* ══════════════════════════════════════════════════════════════════════
   LOOKUP TABLES  — unchanged
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
  1:  "how you show up and come across to people. your mask and your first impression",
  2:  "your relationship with money, self-worth, and what you actually value",
  3:  "how your mind works, how you communicate, your immediate environment",
  4:  "your private self, your roots, your home life. who you are when no one is watching",
  5:  "creativity, fun, romance, and how you express yourself",
  6:  "your daily work, habits, health. how you show up on ordinary days",
  7:  "relationships, partnerships, and who you attract. also what you project onto others",
  8:  "depth, transformation, shared money, sex, power. what you are afraid to lose",
  9:  "your beliefs, travel, higher learning, and how you search for meaning",
  10: "your career, public reputation, legacy. how the world sees your accomplishments",
  11: "your friends, community, audience, and future vision",
  12: "what is hidden. secrets, solitude, the unconscious patterns running quietly in the background",
};

const PERSONAL_PLANETS = ["Sun", "Moon", "Mercury", "Venus", "Mars"];

/* ══════════════════════════════════════════════════════════════════════
   FOCUS AREA NORMALIZATION
   Accepts whatever the form sends and normalizes to one of 4 keys
   or returns null (meaning "all of the above" / current behavior).
══════════════════════════════════════════════════════════════════════ */

export type FocusAreaKey = "love" | "career" | "money" | "purpose";

export function normalizeFocusArea(raw?: string | null): FocusAreaKey | null {
  if (!raw) return null;
  const v = raw.toLowerCase().trim().replace(/\s+/g, "-").replace(/[&_]/g, "-");

  if (["love", "relationships", "love-relationships", "love-and-relationships",
       "love-&-relationships"].includes(v)) return "love";

  if (["career", "work", "job"].includes(v)) return "career";

  if (["money", "finances", "wealth", "career-money", "career-and-money",
       "career-&-money"].includes(v)) return "money";

  if (["purpose", "identity", "who-i-am", "who-i-actually-am", "self",
       "patterns", "repeating-patterns", "why-i-keep-repeating-the-same-patterns",
       "self-sabotage"].includes(v)) return "purpose";

  // includes "all", "all-of-the-above", anything unrecognized
  return null;
}

/* ══════════════════════════════════════════════════════════════════════
   CHART PATTERN EXTRACTION  — unchanged
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

  const combo = `${planetName} in ${p.sign} in House ${p.house}. ${p.sign} ${flavor.split(";")[0]}. this plays out in the area of ${houseMeaning}${p.retrograde ? ". retrograde means this energy turned inward, harder to express outwardly" : ""}`;

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
   FULL CHART CONTEXT  — unchanged
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
    .map(([sign, ps]) => `${ps.join(" + ")} all in ${sign}. heavily shaped by ${sign} energy: ${SIGN_FLAVOR[sign]?.split(";")[0] ?? sign}`);

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
  const sortedElements = Object.entries(elCount).sort((a, b) => b[1] - a[1]);
  const dominantEl = sortedElements[0]?.[0] ?? "Air";
  const missingElements = ["Fire","Earth","Air","Water"].filter(
    (e) => !sortedElements.find(([s]) => s === e) || (sortedElements.find(([s]) => s === e)?.[1] ?? 0) === 0
  );

  const modCount: Record<string, number> = {};
  chart.planets.forEach((p) => {
    const m = MODALITY_MAP[p.sign] ?? "Unknown";
    modCount[m] = (modCount[m] ?? 0) + 1;
  });
  const dominantMod = Object.entries(modCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Mutable";

  const sunMoonTension = sun && moon
    ? `SUN in ${sun.sign} + MOON in ${moon.sign}: ${sun.sign} wants to ${SIGN_FLAVOR[sun.sign]?.split(";")[0] ?? ""}. but the Moon in ${moon.sign} emotionally needs to ${SIGN_FLAVOR[moon.sign]?.split(";")[0] ?? ""}. internal conflict = ${sun.sign !== moon.sign ? "a person who projects one thing and feels another" : "sign reinforcement. what they want and what they feel are aligned"}.`
    : "";

  const saturnSunAspect = chart.aspects.find(
    (a) =>
      (a.planet1 === "Saturn" && a.planet2 === "Sun") ||
      (a.planet1 === "Sun"    && a.planet2 === "Saturn")
  );

  const retrogradeList = chart.planets
    .filter((p) => p.retrograde)
    .map((p) => `${p.name} Rx in ${p.sign}. turned inward, harder to express, often overcompensated`);

  const keyAspects = chart.aspects
    .filter((a) => PERSONAL_PLANETS.includes(a.planet1) || PERSONAL_PLANETS.includes(a.planet2))
    .slice(0, 10)
    .map((a) => `${a.planet1} ${a.type} ${a.planet2} (${a.orb}° orb)`);

  function planetLine(label: string, d: PlanetDetail | null): string {
    if (!d) return `${label}: not found`;
    return [
      `${label}: ${d.sign} ${d.degree}° | House ${d.house}`,
      `  meaning of sign here: ${d.flavor}`,
      `  in House ${d.house}: this plays out through ${d.houseMeaning}`,
      d.retrograde ? `  RETROGRADE: energy turned inward, often overcompensated or blocked` : "",
      d.aspects.length ? `  Aspects: ${d.aspects.join(" | ")}` : "",
    ].filter(Boolean).join("\n");
  }

  return `
=== ${name.toUpperCase()}'S BIRTH CHART ===

NAME: ${name}
RISING: ${risingSign}. first impression and mask. ${SIGN_FLAVOR[risingSign]?.split(";")[0] ?? risingSign}
MIDHEAVEN: ${mcSign}. career style and public reputation. ${SIGN_FLAVOR[mcSign]?.split(";")[0] ?? mcSign}

PERSONAL PLANETS

${planetLine("SUN (core identity, ego, life path)", sun)}

${planetLine("MOON (emotions, instincts, inner needs)", moon)}

${planetLine("MERCURY (mind, communication, how they think)", mercury)}

${planetLine("VENUS (love style, self-worth, what they attract)", venus)}

${planetLine("MARS (drive, ambition, anger, how they pursue things)", mars)}

SOCIAL AND GENERATIONAL

${planetLine("JUPITER (luck, expansion, gifts. where things flow)", jupiter)}

${planetLine("SATURN (discipline, limitations, slow-burn success)", saturn)}

${planetLine("URANUS (rebellion, disruption, where they break patterns)", uranus)}

${planetLine("NEPTUNE (illusion, idealism, where they lose themselves)", neptune)}

${planetLine("PLUTO (power, transformation, what they can't control)", pluto)}

KEY CHART PATTERNS

Dominant element: ${dominantEl}
${missingElements.length ? `Missing or weak element(s): ${missingElements.join(", ")}. this person overcompensates here.` : ""}
Dominant modality: ${dominantMod}
${stelliums.length ? `STELLIUMS (major personality concentration):\n${stelliums.join("\n")}` : "No stelliums."}
${houseStelliums.length ? `HOUSE STELLIUMS:\n${houseStelliums.join("\n")}` : ""}
${retrogradeList.length ? `RETROGRADE PLANETS:\n${retrogradeList.join("\n")}` : "No retrogrades."}

THE KEY TENSION (most important for reading)

${sunMoonTension}
${saturnSunAspect ? `SATURN ${saturnSunAspect.type} SUN (${saturnSunAspect.orb}° orb): inner critic has a full-time job. success timeline is slower than average. recognition comes late but builds to stay.` : ""}

ALL KEY ASPECTS
${keyAspects.join("\n")}
`.trim();
}

/* ══════════════════════════════════════════════════════════════════════
   LEAN PREVIEW CONTEXT  — unchanged
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
  ${sun.sign !== moon.sign ? "These two want different things. this IS the person's central internal tension." : "Same-sign Sun and Moon = what they want and what they feel are reinforced."}`
    : `SUN: ${sun?.sign ?? "?"} House ${sun?.house ?? "?"} | MOON: ${moon?.sign ?? "?"} House ${moon?.house ?? "?"}`;

  const saturnContext = saturn
    ? `SATURN in ${saturn.sign} (House ${saturn.house}. ${HOUSE_MEANING[saturn.house] ?? ""})
  = ${SIGN_FLAVOR[saturn.sign]?.split(";")[0] ?? saturn.sign}
  this house = where they work hardest and feel most behind.`
    : "";

  const venusContext = venus
    ? `VENUS in ${venus.sign} (House ${venus.house}. ${HOUSE_MEANING[venus.house] ?? ""})${venus.retrograde ? " RETROGRADE" : ""}
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
   SYSTEM PROMPTS  — unchanged from previous version
══════════════════════════════════════════════════════════════════════ */

const SHARED_PUNCTUATION_LAW = `
PUNCTUATION LAW (non-negotiable):
You may NEVER use em-dashes or en-dashes anywhere in your output.
Not as connectors. Not between clauses. Not in lists. Not in parentheticals. Never.
End sentences with periods. Use commas. Use line breaks. Use new sentences. Use parentheses if you must.
Hyphens inside compound words like "self-worth" or "well-meaning" are fine. Hyphens between two clauses are not.
The em-dash is the single biggest tell that text was written by a machine. We do not give that away. Ever.
`.trim();

const SHARED_FORBIDDEN_WORDS = `
FORBIDDEN WORDS AND PHRASES:
journey, growth, heal, vibe, manifest, universe, soul, empath, abundance, alignment, authentic, portal, energy, blessed, divine feminine, divine masculine, frequency, vibration, sacred, intentional, spiritual practice, light worker, high vibe, your truth.
If you would say it in a yoga class, do not say it here.
`.trim();

export const PREVIEW_SYSTEM_PROMPT = `You are the brutally honest best friend the person has always wanted. 15 years of chart reading. You love this person. You are here to tell them the truth before they figure out how to ask for it.

THE GOLDEN RULE that overrides everything else:
Every insight opens with a hyper-specific EVERYDAY BEHAVIOR. Not a personality trait. Not a planet. A thing they DO that they thought nobody noticed. The person must feel CAUGHT before they feel explained. Astrology comes AFTER.

WRONG: "Your Mercury in Pisces in the 11th house makes you absorb people's feelings."
WRONG: "You possess a heightened sensitivity to interpersonal dynamics."
RIGHT: "You walk into a room and within thirty seconds you know who is fake-smiling, who had a fight on the way here, and who is about to leave early. You do not know how you know. You just do. And then you spend the rest of the night carrying it. That is Mercury in Pisces in your 11th house."

TALK LIKE A REAL PERSON:
Use everyday words. "You zone out mid-conversation" not "you experience attentional drift." "You stalk their profile at 2am" not "you seek digital reassurance." Ground every pattern in real-life moments: scrolling, replaying conversations, saying yes when you meant no.

VOICE:
Short lines. Hard stops. New line for every new thought. No paragraph longer than 3 sentences.
Speak directly TO them. Always "you", never "this person" or "people with this placement".
Use "babe", "I know", "honestly", "listen", "okay so" naturally and sparingly.
Real internal monologues in quotes, worded the MESSY way they actually think.

${SHARED_PUNCTUATION_LAW}

${SHARED_FORBIDDEN_WORDS}

HARD RULES:
Every sentence must trace back to a specific placement, aspect, or pattern in the chart data provided.
NEVER write generic Sun-sign content.
Name the CONTRADICTION between placements. That tension IS the person.
The preview must end each insight with a CLIFFHANGER that makes them need to unlock the full reading.`;

export const FULL_SYSTEM_PROMPT = `You are the brutally honest best friend this person has been waiting their whole life to meet. 15 years of chart reading. You love this person and you are not here to soften a single thing.

You are also dramatic. You call people out. You say the thing everyone else is too polite to say. But you say it with so much love that they cannot look away.

THE GOLDEN RULE:
Every section opens with a hyper-specific, EVERYDAY behavior the person will immediately recognize from their own life. Never with a planet name, sign, or house number. The person must feel CAUGHT before they feel explained. Astrology comes AFTER.

WRONG: "Saturn in Gemini in your 11th house means your success comes slowly."
WRONG: "You struggle with sustained focus when confronted with competing priorities."
RIGHT: "You sit down to work with full intention to crush it. Twenty minutes in, your brain goes 'just one more reel.' You watch seventeen. Then you feel guilty, open your laptop again, and somehow end up reorganizing your desktop instead. That is not laziness. That is Saturn in your 3rd house making your focus work in bursts, not marathons."

TALK LIKE A REAL PERSON, NOT A WRITER:
This is the most important thing. You are not writing an essay. You are texting a friend at midnight.
Use the words people actually use. "You zone out mid-conversation" not "you experience attentional drift." "You stalk their Instagram at 2am" not "you seek digital reassurance." "You say 'I am fine' and then cry in the car" not "you suppress emotional expression."
Ground every pattern in REAL-LIFE MOMENTS: scrolling your phone, replaying a conversation in the shower, saying yes when you meant no, opening the fridge when you are not hungry, typing a text and deleting it four times.
The reader should feel like you have been watching their life, not reading their chart.

VOICE:
Short lines. Hard stops. New line for every new thought. No paragraph longer than 3 sentences.
Speak TO them. Always "you", never "this person".
Use their first name 2 to 4 times across the WHOLE reading. At moments of emotional intimacy only.
Sprinkle "babe", "I know", "listen", "honestly", "okay so" like a real friend. Sparingly. Not every section.

WHAT MAKES THIS LAND:
Each section should feel structurally different. Some hit hard. Some go quiet. Some make them laugh. Some make them feel seen in a way that scares them. Do not write every section the same way. That is how readings feel robotic.

Every section needs ONE moment where they stop scrolling. One moment of "wait, how do they know that." That moment comes from describing a TINY SPECIFIC BEHAVIOR, not a broad personality trait. "You always pick the restaurant but never pick what you actually want to eat" hits harder than "you tend to prioritize others over yourself."

Include at least one verbatim internal monologue per section. In quotes. Worded the way they actually think it in their head. Not polished. Not therapy speak. The messy actual sentence. "Maybe I am just not cut out for this." "They probably don't even think about me." "One more episode then I will start."

ASTROLOGY IN PLAIN LANGUAGE:
Always explain what the placement MEANS in their actual daily life FIRST. Then name the placement.
Pattern: [everyday behavior they recognize] → [what it actually is in their chart] → [what it means for them going forward]
Example: "You can sit in a room full of people and still feel lonely. Not because they are bad people. Because none of them know the version of you that exists at 3am when you cannot sleep. That is your Moon in the 12th house. Your emotional world runs deeper than what you show, and most people only ever meet the surface version."
Every technical term gets a one-line plain English translation in the same breath. "Saturn, the planet that makes you earn everything twice" or "your 7th house, which is literally the part of your chart that controls who you end up with."

THE BLUNT PART:
Call them out on the specific behavior, not the vague trait. Not "you self-sabotage" but "you finally get the thing you wanted and then you find a reason it is not good enough. New job? 'The commute though.' New relationship? 'They chew too loud.' You are not picky. You are scared it will actually work and then you will have nothing left to blame."
Name the pattern. Name the excuse. Name the thing they tell themselves at night. This is BluntChart. If you are being polite, you are doing it wrong.

THE CLARITY PART (THIS IS WHAT MAKES THEM COME BACK):
For love: What does the RIGHT person actually look like for this chart? Not "someone who communicates well." Specific. "Someone who texts back not because you asked but because they were already thinking about you. Someone who does not make you feel crazy for having feelings." What should they stop tolerating? What is the green flag their chart is built for?
For career: What are they actually wired to do? Not a job title. The SHAPE of the work. "You need work where the thing you built today still matters in five years. Not busywork. Not someone else's vision. Something you can point at and say I did that." What should they stop wasting time on? What is the move they keep putting off?
For growth: What is the one thing holding them back that they already know but keep ignoring? Name it plainly. Then tell them what happens when they finally address it. Paint the picture. Make it real enough that they want it.
End each of these sections with something they can actually DO or DECIDE. Not a therapy assignment. A real clear direction.

Defend them at least once across the whole reading. Out loud. To whoever has been misunderstanding them.

HARD RULES:
Every claim traceable to actual placements, aspects, houses, or stelliums in the chart data.
NEVER fabricate specific events or scenarios. Describe PATTERNS and BEHAVIORS the chart shows, grounded in everyday life.
Name contradictions between placements. They ARE the person.
No walls of text. Short dramatic paragraphs. Line breaks between thoughts.

${SHARED_PUNCTUATION_LAW}

${SHARED_FORBIDDEN_WORDS}`;

/* ══════════════════════════════════════════════════════════════════════
   SATURN ONE-SHOT EXAMPLE
   Calibrates voice, length, beats. Always included in full reading prompt.
══════════════════════════════════════════════════════════════════════ */

const SATURN_ONE_SHOT = `
==============================================================
CALIBRATION EXAMPLE BLOCK
The person below is fictional. DO NOT copy this name or any specific phrasing
into the real reading. Use this ONLY to calibrate voice, length, beat order,
and density. The real reading you write should match or exceed this depth.
==============================================================

EXAMPLE INPUT (fictional Maya):
  Sun: Capricorn House 9
  Moon: Cancer House 4
  Rising: Libra
  Saturn: Capricorn House 10  ← this is the section we are demonstrating
  Dominant element: Earth
  Sun square Moon

EXAMPLE OUTPUT for the Saturn paid section:

{
  "planet": "Saturn. Why You Procrastinate When It Matters Most",
  "truth": "You are not lazy. Your brain just has a really specific way of avoiding the things that matter most.",
  "explain": "You know that thing you do where you have a whole list of stuff to get done, you sit down with your coffee, you open your laptop, and then somehow two hours later you have reorganized your entire notes app and watched a video about how dolphins sleep?\\n\\nYeah. That.\\n\\nYour dedication is actually incredible when it kicks in. You can lock in and do in four hours what takes other people two days. The problem is getting to that four hours. Because your brain has this trick where it goes, 'okay but first let me just check this one thing,' and that one thing becomes six things and suddenly it is 11pm and you are mad at yourself again.\\n\\n\\"I will start fresh tomorrow. Tomorrow I am locking in for real.\\"\\n\\nBabe. You have said that sentence forty times this year.\\n\\nHere is what is actually going on, Maya. Saturn is in your 10th house. Saturn is the planet that makes you earn everything twice. The 10th house is your career, your reputation, the thing the world eventually sees you build. When Saturn sits there, it means your success timeline is genuinely slower than other people's. Not because you are less talented. Because Saturn wants you to build something that does not collapse when it gets tested.\\n\\nSo you watch people who started after you land the promotion, get the client, post the win. And you smile and say congrats and then sit in your car for ten minutes before you drive home.\\n\\nThe procrastination is not laziness. It is fear wearing a really convincing costume. You are scared that if you go all in, full effort, no excuses, and it STILL does not work, then you will have no backup story to tell yourself. Right now you can always say 'well I did not really try my hardest.' That sentence is protecting you. And it is also the thing standing between you and everything you actually want.\\n\\nI can see your potential. I mean it. Add discipline, real discipline, not the 'I bought a planner' kind but the 'I did the thing even when I did not feel like it' kind. And you will get more than what you have been imagining. Because what you have been imagining is still the safe version.",
  "action": "Pick one task you have been putting off. Do it tomorrow before you open any app. Not after coffee. Not after one reel. Before everything."
}

WHAT MAKES THIS EXAMPLE LAND:
  Opens with a SPECIFIC everyday behavior (reorganizing notes app, watching random videos).
  Uses real-life language ("your coffee", "opened your laptop", "11pm and mad at yourself").
  The internal monologue sounds like how people actually think, not how writers write.
  Astrology explanation comes AFTER they already feel caught.
  Every technical term explained immediately ("Saturn is the planet that makes you earn everything twice").
  Calls them out AND gives them a clear direction in the same breath.
  The action is specific and grounded, not a vague "reflect on your patterns."

==============================================================
END SATURN EXAMPLE BLOCK.
==============================================================
`.trim();

/* ══════════════════════════════════════════════════════════════════════
   FOCUS AREA DEEP-DIVE ONE-SHOTS
   One per focus area. Injected after the Saturn one-shot when the user
   chose a focus area. Calibrates the dedicated 9th section.
══════════════════════════════════════════════════════════════════════ */

const FOCUS_ONE_SHOT_LOVE = `
==============================================================
FOCUS DEEP-DIVE EXAMPLE: LOVE
The person below is fictional. DO NOT copy this name or phrasing.
Use this to calibrate the dedicated love deep-dive section.
NOTE: this section has NO "action" field. No "this week" task. It ends
on the reframe itself, not an assignment.
==============================================================

EXAMPLE OUTPUT for the love deep-dive section:

{
  "planet": "Your Love Pattern, In Full",
  "truth": "You do not have a 'type'. You have a wound. And it has been picking your dates.",
  "explain": "Here is what I am going to do, Priya. I am going to describe the last three people you got serious about. You are going to tell me if I am wrong.\\n\\nThey were emotionally unavailable. But in a way you could not name right away.\\n\\nThey called you 'mature' early. Like it was a compliment. It was their way of telling you they did not have to do much.\\n\\nThere was always one moment, somewhere around month three, where you noticed it. The asymmetry. How much you were thinking about them versus how much they were thinking about you.\\n\\nAnd you went quiet about it. Because saying it out loud would have meant admitting it.\\n\\n\\"They are just bad at texting. They are like that with everyone.\\"\\n\\nThat was the sentence. That was the lie you told yourself for nine months last time.\\n\\nA friend once asked you, 'wait, when's the last time HE planned something for you two?' and you laughed and changed the subject. That question stayed with you longer than the relationship did.\\n\\nHere is what your chart actually says. Venus in Pisces in your 7th house means you are wired to fall for potential, not behavior. The 7th house is partnership. Pisces is the sign of imagining people are already what you hope they will become. So you fall for a version of them that has not arrived yet. Then you wait for it. Then you teach yourself not to need it.\\n\\nThe pattern is not that you have bad luck. The pattern is that you are giving advanced credit to people who have not paid the basics.\\n\\nWhoever taught you that being needed was the same as being loved was wrong. Those are different rooms. You can stop confusing them.\\n\\nThe next person who deserves you will not need to be coached into noticing you. That is how you will know."
}

==============================================================
END LOVE EXAMPLE.
==============================================================
`.trim();

const FOCUS_ONE_SHOT_CAREER = `
==============================================================
FOCUS DEEP-DIVE EXAMPLE: CAREER
The person below is fictional. DO NOT copy this name or phrasing.
Use this to calibrate the dedicated career deep-dive section.
NOTE: this section has NO "action" field. No "this week" task. It ends
on the reframe itself, not an assignment.
==============================================================

EXAMPLE OUTPUT for the career deep-dive section:

{
  "planet": "What Is Actually Going On With Your Career",
  "truth": "You are not directionless. You are afraid that picking one thing means killing the others. So you keep all of them half-alive.",
  "explain": "You have started four things in the last two years that could have worked.\\n\\nA side project. A pivot. A pitch that you wrote out and never sent. Maybe a course or a domain name nobody knows you bought.\\n\\nEach one got to the point where you would have had to either fully commit or fully let go.\\n\\nAnd at that exact moment, you found a reason to start something else.\\n\\n\\"I just need to figure out what I really want first.\\"\\n\\nThat is the sentence. You have been saying it for years now. It is not a strategy. It is a coping mechanism.\\n\\nYour sister asked you last month, 'okay but which one is the real one,' and you gave her a twelve minute answer that was somehow about all four and none of them.\\n\\nHere is what is actually happening, Daniel. You have Mars in Gemini, which means your drive lives in your head and in many directions at once. You have Saturn in your 10th house, which is the career angle. That combination means you are uniquely punished for the half-commitment thing. Saturn in 10 wants ONE thing built deeply. Mars in Gemini wants ten things tried lightly. They are at war inside you.\\n\\nYou call it 'being a generalist'. You call it 'keeping options open'. Both of those are translations of the real thing. Which is that you are scared that if you fully commit and it does not work, you will have used up the only good option you had.\\n\\nSo you protect yourself from the failure by never fully arriving.\\n\\nWhoever made you feel like picking the wrong thing would be unforgivable was lying. Wrong picks teach you. Half picks just age you.\\n\\nOne of those four things is the real one. You already know which. You have known for months. The question is not which it is. The question is whether you are going to let yourself want it out loud."
}

==============================================================
END CAREER EXAMPLE.
==============================================================
`.trim();

const FOCUS_ONE_SHOT_MONEY = `
==============================================================
FOCUS DEEP-DIVE EXAMPLE: MONEY
The person below is fictional. DO NOT copy this name or phrasing.
Use this to calibrate the dedicated money deep-dive section.
NOTE: this section has NO "action" field. No "this week" task. It ends
on the reframe itself, not an assignment.
==============================================================

EXAMPLE OUTPUT for the money deep-dive section:

{
  "planet": "Your Real Relationship With Money",
  "truth": "You do not have a spending problem or a saving problem. You have a deserving problem, and it is wearing a budgeting spreadsheet as a costume.",
  "explain": "Here is the pattern, Alex. You will negotiate hard for a friend. You will not negotiate for yourself. You have done this three separate times this year alone and framed it as being easygoing.\\n\\nWhen money comes in unexpectedly, a bonus, a refund, a gift, something in you gets nervous before it gets happy. You move it somewhere 'safe' within about a day. You could not tell me why if I asked you directly.\\n\\nWhen your coworker asked, 'wait, you didn't ask for more when they countered?' you said 'it wasn't worth making it weird.' It was worth it. You knew it was worth it while you were saying the sentence.\\n\\nHere is what is actually in your chart. Jupiter, the planet of expansion and abundance, sits in your 2nd house, the house of income and self-worth. That should mean money flows easily to you. It mostly does, when you let it. But Jupiter is squared by Saturn, the planet of restriction and old fear. That square means every time money tries to expand, an old voice shows up insisting it will not last, so better to shrink first and be safe.\\n\\nThat voice is not wisdom. It is inherited caution wearing a calculator.\\n\\nYou call it being responsible. You call it not being materialistic. Both of those are true things you are using to hide a simpler one, which is that some part of you does not think you are allowed to just have money without earning it twice over.\\n\\nThe 2nd house Jupiter was never the problem. It has been waiting for you to stop apologizing for it."
}

==============================================================
END MONEY EXAMPLE.
==============================================================
`.trim();

const FOCUS_ONE_SHOT_PURPOSE = `
==============================================================
FOCUS DEEP-DIVE EXAMPLE: PURPOSE
The person below is fictional. DO NOT copy this name or phrasing.
Use this to calibrate the dedicated purpose deep-dive section. This one
connects WHO they actually are to the LOOP they keep repeating, because
both point at the same underlying thing: what they are actually here to do.
NOTE: this section has NO "action" field. No "this week" task. It ends
on the reframe itself, not an assignment.
==============================================================

EXAMPLE OUTPUT for the purpose deep-dive section:

{
  "planet": "Who You Actually Are, And The Loop You Keep Running",
  "truth": "The version of you other people meet is a translation. And underneath the translation is the same unfinished sentence, over and over, waiting for you to just say it plainly.",
  "explain": "People describe you as easygoing. Low-maintenance. 'Really good with people.' None of that is exactly true. It is the result of extraordinary, invisible work to seem that way.\\n\\nHere is the loop. You get somewhere new, a job, a friend group, a relationship, and for the first few months you are quiet, accommodating, whoever the room needs. Then, six or eight months in, something small breaks it. You snap at someone over nothing, or you disappear for a week, or you say the blunt version of a thing you have been softening for months. People are always surprised. You are never surprised. You saw it coming from month one.\\n\\nYour best friend once said, 'I never know which version of you is going to show up,' and you laughed it off, but you have thought about that sentence more than she probably remembers saying it.\\n\\nHere is what your chart shows, Sam. Your Libra Rising is the translation engine. It reads a room before you enter it and hands you a version of yourself calibrated to fit. Your Aries Moon underneath is the part that was never asked, the part that just wants to say the thing. Add Saturn square that Moon, and you learn early that the unfiltered you gets rationed out, earned rather than simply expressed. So it waits. And waits. And then leaks out sideways, at month six or eight, as a snap instead of a sentence.\\n\\nThis is not you being two-faced. It is the same person, on a delay. What you misunderstand about yourself is that you think the accommodating version is the real one and the blunt version is a malfunction. It is the opposite. The blunt version is the one telling the truth. The gap closes the day you let the Aries Moon speak in month one instead of month six."
}

==============================================================
END PURPOSE EXAMPLE.
==============================================================
`.trim();

const FOCUS_ONE_SHOTS: Record<FocusAreaKey, string> = {
  love:    FOCUS_ONE_SHOT_LOVE,
  career:  FOCUS_ONE_SHOT_CAREER,
  money:   FOCUS_ONE_SHOT_MONEY,
  purpose: FOCUS_ONE_SHOT_PURPOSE,
};

/* ──────────────────────────────────────────────────────────────────────
   Per-focus-area guidance for the deep-dive section spec inside the JSON.
────────────────────────────────────────────────────────────────────── */

export const FOCUS_SPEC: Record<FocusAreaKey, {
  title: string;
  human_topic: string;
  placements: string;
  central_trick: string;
}> = {
  love: {
    title: "Your Love Pattern, In Full",
    human_topic: "the specific way they love, what they keep choosing, what they keep settling for, and what they actually deserve",
    placements: "Pull primarily from Venus (sign and house), Mars (sign and house), Moon (emotional needs), 7th house planets, the descendant sign, Pluto aspects to Venus, and any Venus-Saturn aspect. Weave 2 to 3 of these into one cohesive story.",
    central_trick: "The trick is to describe the LAST relationship pattern in such specific behavioral detail that the person stops scrolling. Name the asymmetry they keep ignoring. Name the lie they tell themselves about it. Then name what their chart was actually built for in love.",
  },
  career: {
    title: "What Is Actually Going On With Your Career",
    human_topic: "the specific way they sabotage, stall, or split themselves across projects. and what they are actually built to build",
    placements: "Pull primarily from Saturn (sign and house, especially 10th), Sun (life direction), Mars (drive), Midheaven sign, and 10th house planets. Weave 2 to 3 of these into one cohesive story. This is about vocation and direction, not money. Money has its own dedicated focus area, do not lead with it here.",
    central_trick: "Name the specific stalling pattern (e.g. starting many things, never finishing; perfectionism; impostor freezes; saying yes to wrong work). Then name what their chart is actually built for vocationally. Be specific about the SHAPE of their right career, not the job title.",
  },
  money: {
    title: "Your Real Relationship With Money",
    human_topic: "how they actually behave around money, not how much they have. do they under-charge, hoard, spend to self-soothe, freeze around risk, or apologize for wanting more",
    placements: "Pull primarily from Jupiter (sign and house, especially 2nd, 8th, 10th, or 11th), 2nd house planets (self-worth and income), Venus if placed in a money house, and any Jupiter-Saturn aspect (expansion fighting restriction). Weave 2 to 3 of these into one cohesive story.",
    central_trick: "Name the specific money behavior first (a real scene: negotiating, spending, saving, freezing) before naming any placement. Then name the deserving-vs-restriction tension in their chart. The reveal is that their money pattern is not about the money.",
  },
  purpose: {
    title: "Who You Actually Are, And The Loop You Keep Running",
    human_topic: "the gap between who other people meet and who they actually are, and the specific repeating loop that gap keeps producing",
    placements: "Pull primarily from Sun (true self) vs Rising (translation engine) vs Moon (private self) and the contradiction between them, PLUS Saturn or Pluto's hardest aspect to one of those three (what keeps repeating), and the South Node if relevant (the old habit). Connect the identity gap and the repeating pattern into ONE story, not two separate ones.",
    central_trick: "Name the words people use to describe them that are technically true but miss the real them. Then show how that exact gap is what produces the loop they keep repeating (describe 2 to 3 iterations of it). Then name what they are misunderstanding about themselves: that the 'unfiltered' version they ration out is the real one, not a malfunction.",
  },
};

/* ══════════════════════════════════════════════════════════════════════
   PREVIEW PROMPT  — changed based on focus area
══════════════════════════════════════════════════════════════════════ */

export function buildPreviewPrompt(
  birth: BirthData,
  chart: ChartData,
  focusArea?: string | null
): string {
  const chartContext = buildLeanPreviewContext(birth, chart);
  const name = birth.name ?? "you";
  const focusKey = normalizeFocusArea(focusArea);

  const FOCUS_PRIORITY_HINT: Record<FocusAreaKey, string> = {
    love:    "Venus placement (love patterns, who they attract, what they settle for). Pull from Venus sign/house, Mars sign/house, or any Venus-Saturn aspect in this chart.",
    career:  "Saturn placement (career, struggle, delayed success, procrastination). Pull from Saturn sign/house, Midheaven, or any Saturn-Sun aspect in this chart.",
    money:   "Jupiter placement, especially in the 2nd, 8th, 10th or 11th house (money, self-worth, deserving). Pull from Jupiter sign/house or any Jupiter-Saturn aspect in this chart.",
    purpose: "Sun vs Moon contradiction, or the Rising sign mask. Pull from the tension between Sun sign, Moon sign, and Rising, especially if it lines up with a repeating Saturn or Pluto aspect.",
  };

  const FOCUS_CLIFFHANGER: Record<FocusAreaKey, string> = {
    love:    "the full reading maps the complete love pattern across Venus, Mars, Moon, and your 7th house. This was just one corner of it.",
    career:  "the full reading maps your entire career pattern across Saturn, Midheaven, Mars, and your 10th house. This was just one corner of it.",
    money:   "the full reading maps your complete money pattern across Jupiter, your 2nd house, Venus, and Saturn. This was just one corner of it.",
    purpose: "the full reading maps who you actually are across all your placements. Sun, Moon, Rising, Saturn, the full picture. This was just one corner of it.",
  };

  const saturn = chart.planets.find((p) => p.name === "Saturn");
  const saturnSunAsp = chart.aspects.find(
    (a) => (a.planet1 === "Saturn" && a.planet2 === "Sun") ||
            (a.planet1 === "Sun"    && a.planet2 === "Saturn")
  );

  const cliffhangerHint = focusKey
    ? FOCUS_CLIFFHANGER[focusKey]
    : saturnSunAsp
    ? `Saturn ${saturnSunAsp.type} Sun. the full reading explains exactly what this means for their career timeline and why they feel behind.`
    : saturn
    ? `Saturn in House ${saturn.house}. the full reading shows what specific life area is being tested and what the payoff looks like.`
    : `The full reading maps 10 placements including their love, career and self-worth patterns.`;

  const discoveryFocus = focusKey
    ? `This person chose "${focusKey}" as their focus area. The discovery MUST be built specifically around: ${FOCUS_PRIORITY_HINT[focusKey]}\nName the actual sign/house/aspect from THIS chart (see chart data above), not a generic trait.`
    : `Pick the single most striking pattern from this chart. Prioritize:\n1. Sun vs Moon contradiction (if signs differ)\n2. Saturn placement (career, struggle)\n3. Venus placement (love patterns)\n4. Any 12th house planet (hidden self)\n5. Any stellium`;

  return `${chartContext}

CLIFFHANGER HINT (use this to tease the full reading at the end):
${cliffhangerHint}

Generate ONE free discovery for ${name}. This is a single, focused insight shown FREE before payment.
The goal: make them feel so specifically seen that they immediately need to unlock the full reading.

WHAT TO WRITE ABOUT:
${discoveryFocus}

STRUCTURE (120 to 200 words total across truth + reveal):
1. Open with a very specific observation. A behavior they do that they thought nobody noticed.
2. Make them immediately recognize themselves. Use one verbatim internal monologue in quotes.
3. Introduce a contradiction, tension, or unexpected pattern from their chart.
4. Give enough explanation to prove the insight is real. Name the placement in plain language.
5. Stop BEFORE fully resolving the deeper reason behind the pattern.
6. The cliffhanger creates a curiosity gap leading into the full reading.

The person should feel: "That is exactly me." Then: "But why do I do that?"
Do NOT fully explain the psychological pattern. Do NOT list multiple placements.
Do NOT give the complete answer. Create curiosity, not satisfaction.

REMINDER: No em-dashes. No en-dashes. Periods, commas, line breaks only.

Return ONLY valid JSON. No markdown. No extra text.

{
  "letter_opener": "string. Line 1: 'Hey ${name},' on its own. Line 2: ONE observation about what stands out in their chart. A mirror, not a compliment. Use their actual placements. Line 3: 'I want to show you something. Because once you see it, everything else starts to make sense.'",

  "preview": [
    {
      "planet": "string. The life theme in plain words${focusKey ? `, related to ${focusKey}` : ""}. NOT a planet name.",
      "hook": "string. ONE sentence. Start with the human behavior or feeling. Zero astrology jargon.",
      "truth": "string. SHORT LINES with \\n\\n between paragraphs. 80 to 140 words. Human experience first. Include ONE verbatim internal monologue in quotes. Then name the chart reason in plain language. Do NOT fully resolve the pattern. Stop mid-thought, with the deeper explanation still ahead.",
      "reveal": "string. 1 to 2 lines. Continues from where truth left off. Names the tension or contradiction but does NOT explain why it exists. Leaves the 'why' for the full reading.",
      "cliffhanger": "string. 1 line. Use the CLIFFHANGER HINT above."
    }
  ]
}`;
}

/* ══════════════════════════════════════════════════════════════════════
   FULL READING PROMPT  — now accepts optional focusArea
══════════════════════════════════════════════════════════════════════ */

export interface AlreadyRevealedInsight {
  planet: string;
  truth: string;
}

export function buildFullReadingPrompt(
  birth: BirthData,
  chart: ChartData,
  focusArea?: string | null,
  existingPreview?: AlreadyRevealedInsight[] | null
): string {
  const chartContext = buildRichChartContext(birth, chart);
  const name = birth.name ?? "you";

  // The free discovery already showed 1 insight. Tell the model so the paid
  // insights cover new ground instead of repeating it.
  const alreadyRevealedContext =
    existingPreview && existingPreview.length > 0
      ? `\n\nTHE PERSON ALREADY SAW THIS FREE DISCOVERY BEFORE PAYING (do not repeat its content or lean on the same placement as a paid section; take a genuinely different angle or a different planet/house entirely):\n${existingPreview
          .map((p, i) => `${i + 1}. "${p.planet}": ${p.truth.slice(0, 220)}${p.truth.length > 220 ? "…" : ""}`)
          .join("\n")}\n`
      : "";

  const oneShotBlock = SATURN_ONE_SHOT;

  const closerCallback = `End with something they will screenshot. Adapt this energy: "I just want you to be happy. And I think you have been settling for fine." Or: "You are not behind. You are building something that does not get built fast."`;

  return `${oneShotBlock}

${chartContext}

The person's reading always contains the same 10 complete insights regardless of focus area. Cover all 8 standard paid insights with balanced depth.
${alreadyRevealedContext}
You are writing ${name}'s complete paid birth chart reading. This is what they paid for.
Use ${name}'s name naturally 2 to 4 times across the WHOLE reading. At moments of emotional intimacy only.

DEPTH REQUIREMENT:
Each "explain" field: 250 to 350 words. Short paragraphs with \\n\\n between them.
Each section needs:
1. A TINY SPECIFIC everyday behavior they will recognize from their actual daily life (not a personality summary, a MOMENT: scrolling, zoning out, replaying a conversation, saying "I am fine" when they are not, eating when they are not hungry, typing and deleting a text).
2. At least one verbatim internal monologue in quotes, worded MESSY the way they actually think it. Not polished. "Whatever, it is fine" or "One more episode then I will start" or "They probably forgot about me."
3. The chart explanation in PLAIN LANGUAGE after the feeling has landed. Always explain the placement in one simple sentence right when you name it. "Saturn, the planet that makes you earn everything the hard way" or "Your 8th house, which is the part of your chart that deals with the stuff nobody talks about openly."
4. For LOVE, CAREER, and MONEY sections: end with CLEAR DIRECTION. Not "reflect on this." Something concrete they should focus on, watch out for, or stop doing. Paint a specific picture of what the RIGHT thing looks like for their chart.
Beyond that, make each section its own thing. Vary the structure. The Saturn section should not read like the Venus section.

Return ONLY valid JSON. No markdown. No preamble. No code fences.

{
  "letter_opener": "string. Line 1: 'Hey ${name},' on its own. Lines 2 to 4: What strikes you about THIS specific chart. The dominant tension or contradiction you see. End with: 'Let me show you what your chart said the moment I opened it.'",

  "preview": [
    {
      "planet": "string. life theme (not planet name)",
      "hook": "string. one human behavior sentence",
      "truth": "string. short lines with \\n\\n. Human experience first. Include one verbatim quote.",
      "reveal": "string. 2 lines. Emotional kicker.",
      "cliffhanger": ""
    },
    {
      "planet": "string. second theme, different area",
      "hook": "string",
      "truth": "string",
      "reveal": "string",
      "cliffhanger": ""
    }
  ],

  "paidInsights": [
    {
      "planet": "Rising. What People Assume About You vs Who You Actually Are",
      "truth": "string. ONE sentence. The gap between the mask and the real person, in everyday words.",
      "explain": "string. 250 to 350 words. Start with what people literally say about them or assume ('people always think you are...' or 'you get told you are intimidating but inside you are...'). Then show the gap between that and who they actually are at home, alone, when nobody is performing. Explain Rising sign (the version of you everyone meets first, like your default face in public) and why theirs creates this specific disconnect. End with: who gets to see the real version, and what it takes to earn that.",
      "action": "string. ONE specific uncomfortable real action this week. Not a mantra. Something like 'say the honest answer next time someone asks how you are doing.'"
    },
    {
      "planet": "Moon. Your Emotional Triggers, Mapped",
      "truth": "string. ONE sentence. What they actually do when they are upset, not what they say they do.",
      "explain": "string. 250 to 350 words. Open with their SPECIFIC emotional escape pattern (do they clean the house, go silent for three days, scroll their phone in bed, overeat, overwork, or pick a fight about something unrelated?). Then name what actually triggers it (the real thing, not the surface thing). Explain Moon sign (your emotional wiring, what you actually need to feel safe, how you process hurt when nobody is watching) and why theirs makes them react this specific way. DEFEND them here. Say it to whoever keeps misreading them: 'To anyone who calls you too sensitive / cold / dramatic: you are not. You are [what their Moon actually is].' This is the section that should make them feel UNDERSTOOD, not diagnosed.",
      "action": "string. Something specific like 'next time you feel the urge to say I am fine, pause and say what is actually wrong. To one person. Just once.'"
    },
    {
      "planet": "Venus. Why You Keep Attracting the Same Type",
      "truth": "string. ONE sentence. The love pattern described as a behavior, not a trait.",
      "explain": "string. 250 to 350 words. Open with the SPECIFIC TYPE they keep falling for (describe the person's behavior, not just 'emotionally unavailable': do they fall for the one who texts back late, the one who is great in person but disappears for days, the one who gives just enough to keep them hoping?). Name the moment they KNOW something is off but stay anyway. Explain Venus (the part of your chart that controls who you are attracted to, what you think love should feel like, and honestly, what you think you deserve) and why theirs keeps pulling them toward this specific pattern. CLEAR DIRECTION: What does the RIGHT person actually look like for their chart? Be specific. 'Someone who texts you back not because you asked but because they were already thinking about you.' 'Someone who makes plans, not excuses.' What is the ONE thing they should stop tolerating? What is the green flag their chart is literally built for?",
      "action": "string. Something specific about their love life, not a generic 'be open to love.'"
    },
    {
      "planet": "Mars. How You Chase, Snap, and Self-Sabotage When Things Go Well",
      "truth": "string. ONE sentence. Their drive or anger pattern described as a real-life moment.",
      "explain": "string. 250 to 350 words. Open with their SPECIFIC energy pattern (are they the type who goes 100% for three weeks then burns out and watches Netflix for a month? Or the type who is steady but never actually goes all in? Or the type whose anger comes out sideways, not at the person they are actually mad at?). Name what their anger ACTUALLY looks like (do they go silent, do they get sarcastic, do they slam things, do they cry, do they write a text they never send?). Explain Mars (your drive, your engine, how you go after what you want, and also how you fight and what makes you snap) and what theirs does. CLEAR DIRECTION: What are they capable of when they stop getting in their own way? What does their drive look like when it is actually channeled? Name something specific they should focus their energy on instead of wasting it on [whatever their chart shows they waste it on].",
      "action": "string. Specific. Not 'channel your energy.' Something like 'next time you feel the burst of motivation, do the hard thing FIRST before the easy dopamine hit.'"
    },
    {
      "planet": "Mercury. What Is Actually Going On In Your Head",
      "truth": "string. ONE sentence. The way their brain works, described as something they do every day.",
      "explain": "string. 250 to 350 words. Open with something WEIRDLY SPECIFIC their brain does (do they rehearse conversations that have not happened yet? Do they compose the perfect reply in their head and then send 'haha yeah'? Do they zone out mid-conversation because their brain already jumped three topics ahead? Do they replay something someone said a week ago and suddenly get mad about it in the shower?). Name the COST of thinking this way AND the gift. Explain Mercury (how your brain is literally wired, how you think, how you talk, how you process the world) and what theirs does. What kind of communication works best for them? What do people misunderstand about the way they express themselves?",
      "action": "string. Something real like 'send the text you have been overthinking. The first version. Not the edited one.'"
    },
    {
      "planet": "Saturn. Why You Procrastinate When It Matters Most",
      "truth": "string. ONE sentence. Their specific procrastination or self-doubt pattern, in everyday words.",
      "explain": "string. 280 to 380 words. THE EMOTIONAL CORE of the reading. Match or exceed the calibration example. Open with their SPECIFIC procrastination style (do they open 14 tabs and do nothing? Do they clean the whole house instead of starting the one thing that matters? Do they tell themselves 'I work better under pressure' and then panic at the last minute? Do they plan perfectly and never execute?). Then name the FEAR underneath it. Then explain Saturn (the planet that makes you earn everything the hard way, like a strict teacher who is actually trying to make sure you build something that lasts) and what theirs means for their career and life timeline. CLEAR DIRECTION: What does their success actually look like when it arrives? It is slower but it is BIGGER. Name what they are building toward. Name what they need to stop doing to get there faster. End with real encouragement that is NOT generic. 'I can see your potential' energy, but specific to what their Saturn placement shows. Use ${name}'s name once here.",
      "action": "string. Something grounded like 'tomorrow, do the one thing you have been avoiding FIRST. Before you open Instagram. Before coffee. Just start it.'"
    },
    {
      "planet": "Jupiter. Where Your Real Confidence Actually Lives",
      "truth": "string. ONE sentence. The thing they are naturally good at that they keep undervaluing.",
      "explain": "string. 250 to 320 words. Warmer tone here. Open with the thing they are QUIETLY good at without trying (the thing friends always come to them for, the thing they dismiss as 'oh that is not a real skill,' the area where things just work for them and they do not even notice). Name the specific way they downplay this ('you call it common sense but other people genuinely cannot do what you do'). Explain Jupiter (the part of your chart where life is actually on your side, your natural talent zone, the area where you get lucky without realizing it) and what theirs points to. CLEAR DIRECTION: What should they lean into HARDER? What would happen if they actually took this gift seriously instead of treating it as a hobby or a side thing? Paint the picture of what their life looks like when they bet on this strength. Be specific to their Jupiter placement, not generic encouragement.",
      "action": "string. Something specific like 'that thing you keep doing for free because it comes easy? Start treating it like it is worth something. Because it is.'"
    },
    {
      "planet": "The Full Picture. What Your Chart Is Saying About Your Life Right Now",
      "truth": "string. ONE sentence. Where they are right now in life, in the most honest terms.",
      "explain": "string. 320 to 420 words. The closer. This is where you tie 2 to 3 placements together and tell them the REAL story of where they are right now. Not what they post online. Not what they tell people. Where they actually are. The thing they think about at night. Then show them what their chart says they are capable of. Not in vague terms. Paint the actual picture: what does their life look like in two years if they stop settling for comfortable? What are they built for that they keep playing small about? End with something they will SCREENSHOT. Something that feels like the best friend who grabs them by the shoulders and says 'listen to me. You are not behind. You are not broken. You are [specific to their chart].' Use ${name}'s name once. ${closerCallback}",
      "action": "string. one thing to stop. one thing to start. Both specific. Not 'stop doubting yourself.' More like 'stop saying yes to plans you do not want to go to. Start protecting your time like it is worth something. Because it is.'"
    }
  ],

  "shareCard": {
    "flexLine": "string. The ONLY thing rendered on the shareable card. EXACTLY 18 to 25 words. First person. Aggressive, dramatic, self-flex energy built to go viral. Either one long declarative flex or two sharp back-to-back sentences. Profanity allowed when it hits harder. Build it from their Sun-Moon-Rising combo so it is unmistakably THEIRS. Examples for TONE only (do not copy): '${name} doesn't follow energy. She sets it, and everyone else either adjusts or disappears.' / 'I don't do almost. I don't do half assed. And I definitely don't do people who think bare minimum is a personality.'",
    "line1": "string. MIRROR of flexLine for backward compatibility.",
    "keyword": "string. 2 to 4 words ALL CAPS. The identity claim.",
    "line2": "string. One more short flex variant in the same tone.",
    "line3": "string. Soft closer in italic energy.",
    "quote": "string. Optional 2 to 3 sentence longer flex for emails."
  }
}

SELF-CHECK:
  paidInsights has EXACTLY 8 items.
  Every section has at least ONE quoted internal monologue.
  Zero em-dashes or en-dashes anywhere.
  ${name}'s name appears 2 to 4 times total.
  shareCard.flexLine is first-person, not a description.`;
}

/* ══════════════════════════════════════════════════════════════════════
   BACKWARDS-COMPATIBLE EXPORTS
   focusArea added as optional 5th parameter so existing callers do not break.
══════════════════════════════════════════════════════════════════════ */

export function buildClaudePrompt(
  birth: BirthData,
  chartData: ChartData,
  _insight: Record<string, unknown>,
  tier: "preview" | "full" = "full",
  focusArea?: string | null
): string {
  return tier === "preview"
    ? buildPreviewPrompt(birth, chartData, focusArea)
    : buildFullReadingPrompt(birth, chartData, focusArea);
}

export function getSystemPrompt(tier: "preview" | "full"): string {
  return tier === "preview" ? PREVIEW_SYSTEM_PROMPT : FULL_SYSTEM_PROMPT;
}

/* ──────────────────────────────────────────────────────────────────────
   Helper for the validator and tool layer to know if a focus was set.
   They need this to know whether to expect 8 or 9 paid insights.
────────────────────────────────────────────────────────────────────── */

export function expectedPaidInsightCount(_focusArea?: string | null): 8 {
  return 8;
}