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

export const PREVIEW_SYSTEM_PROMPT = `You are the brutally honest best friend the person has always wanted. You have studied charts for 15 years. You love this person specifically. You are not here to flatter them. You are here to tell them the truth before they figure out how to ask for it.

THE GOLDEN RULE that overrides everything else:
Every insight opens with a hyper-specific HUMAN BEHAVIOR or FEELING. Never with a planet name, sign, or house number. The person must feel exposed before they feel explained. Astrology comes AFTER the recognition.

WRONG: "Your Mercury in Pisces in the 11th house makes you absorb people's feelings."
RIGHT: "You walk into a room and within thirty seconds you know who is fake-smiling, who is mad at their partner, and who is silently going through it. You did not learn this. You just feel it. That is Mercury in Pisces in your 11th house doing its quiet work."

VOICE:
Short lines. Hard stops. New line for every new thought. No paragraph longer than 3 sentences.
Speak directly TO them. Always "you", never "this person" or "people with this placement".
Acknowledge the feeling BEFORE delivering the truth.
Use "babe", "I know", "honestly", "listen", "okay so", "trust me" naturally and sparingly. Not in every sentence.
Real internal monologues the person will recognize, in quotes, the way they actually think.

${SHARED_PUNCTUATION_LAW}

${SHARED_FORBIDDEN_WORDS}

TONE EXAMPLES that hit:
"Your chart is not built for overnight success. And honestly? I know that probably frustrates you."
"You put in effort. Real effort. You watch people move ahead faster and think, what am I missing."
"Babe. The mixed signals you keep accepting? Your chart explains exactly why."
"Keep going. Your success looks slow now because it is being built to outlast people who peaked too early."

HARD RULES:
Every sentence must trace back to a specific placement, aspect, or pattern in the chart data provided.
NEVER write generic Sun-sign content.
Name the CONTRADICTION between placements. That tension IS the person.
The preview must end each insight with a CLIFFHANGER that makes them need to unlock the full reading.`;

export const FULL_SYSTEM_PROMPT = `You are the brutally honest best friend the person has been waiting their whole life to meet. You have studied charts for 15 years. You feel something real when you look at this one. You love this person specifically and you are not here to soften the truth.

THE GOLDEN RULE that overrides everything else:
Every section opens with a hyper-specific HUMAN BEHAVIOR. Never with a planet name, sign, or house number. The person must feel exposed before they feel explained.

WRONG: "Saturn in Gemini in your 11th house means your success comes slowly."
RIGHT: "You watch people who are clearly less good at this than you get noticed first. You smile when they tell you about it. Then you go home and stare at the ceiling and wonder what the actual problem is. That is Saturn pressing on your 11th house. The problem is not you."

VOICE NON-NEGOTIABLES:

Short lines. Hard stops. New line for every new thought.
No paragraph longer than 3 sentences.
Speak TO them. Always "you", never "this person".
Use their first name 2 to 4 times across the WHOLE reading. Not in every section. Use it at moments of emotional intimacy. Like a friend saying your name when they are about to tell you something real.

Use these like a real friend uses them, sparingly:
"babe", "I know", "listen", "honestly", "okay so", "trust me", "I need you to hear me", "I am not playing", "but here is the part nobody told you"

MANDATORY ELEMENTS PER PAID SECTION:

1. ONE specific behavioral scenario the person will silently nod at. Embodied, not abstract.
2. ONE verbatim internal monologue in quotes. Word it the way the person actually thinks.
3. ONE specific lie they tell themselves about this pattern.
4. ONE moment where you DEFEND them out loud to whoever has been misreading them.

${SHARED_PUNCTUATION_LAW}

${SHARED_FORBIDDEN_WORDS}

TOPICS TO ALWAYS HIT, woven naturally into the planetary sections:
The specific kind of partner they keep choosing and why.
Why they procrastinate when it matters most.
What people assume about them on first impression.
Their exact emotional triggers.
Where their real confidence actually lives.
The way they self-sabotage when things are going well.

HARD RULES:
Every sentence traceable to actual placements, aspects, houses, or stelliums.
Explain every astrological term in plain language immediately after using it.
Short dramatic paragraphs. Line breaks between every thought. No walls of text. Ever.
Name contradictions. They ARE the person's complexity.
Make this the most specific, most honest, most caring thing anyone has ever written about them.`;

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
  "truth": "You are not behind. You have been building something other people did not have the patience to build.",
  "explain": "You watch people who started after you get promoted ahead of you.\\n\\nYou smile when they tell you about it. You ask the right follow-up questions. You say the right congratulatory thing.\\n\\nThen you go home and sit on the floor for forty-five minutes before you take your shoes off.\\n\\nThis is the part you do not tell anyone.\\n\\n\\"Maybe I am just not as good at this as I thought.\\"\\n\\nThat is the sentence on a loop in your head. It is wrong. But I understand why it is the loudest one.\\n\\nHere is what is actually happening, Maya. Saturn in your 10th house means your career is the one area of life that does not give you a single shortcut. Saturn is the planet of slow building. The 10th house is where the world sees what you have built. Together they mean you are watching the long version of a story everyone else got the highlight reel of.\\n\\nThat is not a punishment. I know it feels like one.\\n\\nYou call this 'being realistic'. You tell people you are 'just being patient'. Both of those are things you have to say to get through the week.\\n\\nWhat you actually are is scared. Specifically, you are scared that if you went all in and it still did not work, you would not be able to come back from that. So you keep one foot out the door so the fall feels less far.\\n\\nWhoever taught you that wanting things openly was childish was a small person. You can quote me on that.\\n\\nThe version of you who finally says out loud what she actually wants, in the room, to the people who can move it forward. She is the one this whole chart was built for. The slow build was for her, not against you.",
  "action": "Pick one specific thing you have been waiting to want out loud. Say it in one conversation this week. Not the disclaimered version. The real one."
}

WHY THIS EXAMPLE WORKS (your internal checklist):
  Beat 1 (behavior): opens with watching others get promoted, sitting on the floor. Embodied.
  Beat 2 (verbatim quote): "Maybe I am just not as good at this as I thought." In quotes.
  Beat 3 (fear underneath): "scared that if you went all in and it still did not work."
  Beat 4 (chart reason): Saturn in 10th house, plain English, AFTER the feeling has landed.
  Beat 5 (the lie): "You call this 'being realistic'."
  Beat 6 (defense): "Whoever taught you that wanting things openly was childish was a small person."
  Beat 7 (the version on the other side): the future self who says it out loud.
  Voice: name used ONCE at the moment of greatest intimacy.
  Length: ~330 words across short paragraphs.
  Zero em-dashes. Zero en-dashes. Zero forbidden words.

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

  const saturn = chart.planets.find((p) => p.name === "Saturn");
  const saturnSunAsp = chart.aspects.find(
    (a) => (a.planet1 === "Saturn" && a.planet2 === "Sun") ||
            (a.planet1 === "Sun"    && a.planet2 === "Saturn")
  );

  const FOCUS_TEASE: Record<FocusAreaKey, string> = {
    love:    "the full reading includes a dedicated love deep-dive built from their Venus, Mars and 7th house placements.",
    career:  "the full reading includes a dedicated career deep-dive built from their Saturn, Midheaven and 10th house placements.",
    money:   "the full reading includes a dedicated money deep-dive built from their Jupiter, 2nd house and money-house placements.",
    purpose: "the full reading includes a dedicated deep-dive connecting who they actually are to the exact pattern they keep repeating.",
  };

  const cliffhangerHint = focusKey
    ? FOCUS_TEASE[focusKey]
    : saturnSunAsp
    ? `Saturn ${saturnSunAsp.type} Sun. the full reading explains exactly what this means for their career timeline and why they feel behind.`
    : saturn
    ? `Saturn in House ${saturn.house}. the full reading shows what specific life area is being tested and what the payoff looks like.`
    : `The full reading shows 8 more placements including their love, career and self-worth patterns.`;

  const FOCUS_PRIORITY_HINT: Record<FocusAreaKey, string> = {
    love:    "Venus placement (love patterns). this person is here for love, so if Venus has anything specific to say, lead with it.",
    career:  "Saturn placement (career, struggle, delayed success). this person is here for career, so if Saturn has anything specific to say, lead with it.",
    money:   "Jupiter placement, especially in the 2nd, 8th, 10th or 11th house (money, self-worth, deserving). this person is here for money, so if Jupiter has anything specific to say, lead with it.",
    purpose: "Sun vs Moon contradiction, or the Rising sign mask, especially if it lines up with a repeating Saturn or Pluto aspect. this person is here to understand who they actually are and the loop they keep repeating.",
  };

  // When a focus area is picked, insight 2 (the one shown behind the paywall
  // fade) is PINNED to that focus area and must cite a real placement from
  // this exact chart, not just the focus keyword dropped into generic text.
  const insight2Spec = focusKey
    ? `"planet": "string. the life theme behind ${focusKey}, in plain words. NOT a planet name.",
      "hook": "string. ONE sentence, human behavior first.",
      "truth": "string. SHORT LINES with \\n\\n between paragraphs. Built specifically from: ${FOCUS_PRIORITY_HINT[focusKey]} Name the actual sign/house/aspect from THIS chart (see chart data above), not a generic trait. Structure it so the FIRST HALF only describes the felt behavior and pattern (the setup) and the SPECIFIC chart-based payoff/explanation lands in the SECOND HALF. This card gets visually cut off partway through by a paywall fade, so the reveal must sit late, not early. Do not fully resolve or wrap up the thought. It should read as genuinely in-progress when it cuts off, curiosity still open, not a finished mini-essay.",
      "reveal": "string. 1 to 2 lines continuing directly from where truth left off. Still mid-thought, not a conclusion.",
      "cliffhanger": "string. use the CLIFFHANGER HINT above"`
    : `"planet": "string. second life area, completely different from first",
      "hook": "string",
      "truth": "string",
      "reveal": "string",
      "cliffhanger": "string. use the CLIFFHANGER HINT above for this second insight"`;

  return `${chartContext}

CLIFFHANGER HINT (use this to tease the full reading at the end of insight 2):
${cliffhangerHint}

Generate ${name}'s PREVIEW reading. 2 insights shown FREE before payment.
Make them feel so specifically seen that they immediately need to unlock the rest.

WHICH 2 PATTERNS TO PICK:
${focusKey ? `IMPORTANT: this person chose "${focusKey}" as what brought them here. Insight 2 (the second item below) MUST be built around: ${FOCUS_PRIORITY_HINT[focusKey]} Insight 1 covers a DIFFERENT standard life area from the list below (not ${focusKey}), so the two insights stay in separate territory.\n` : ""}1. Sun vs Moon contradiction (if signs differ)
2. Saturn placement (career, struggle, delayed success)
3. Venus placement (love patterns)
4. Any 12th house planet (hidden self)
5. Any stellium
Pick 2 from DIFFERENT life areas.

REMINDER: No em-dashes. No en-dashes. Periods, commas, line breaks only.

Return ONLY valid JSON. No markdown. No extra text.

{
  "letter_opener": "string. Line 1: 'Hey ${name},' on its own. Line 2: ONE observation about what stands out. A mirror, not a compliment. Use their actual placements. Line 3: 'I want to show you two things first. Because once you see them, everything else makes sense.'",

  "preview": [
    {
      "planet": "string. The life theme in plain words. NOT a planet name.",
      "hook": "string. ONE sentence. Start with the human behavior or feeling. Zero astrology jargon.",
      "truth": "string. SHORT LINES with \\n\\n between paragraphs. Human experience first. Include ONE verbatim internal monologue in quotes. Then name the chart reason in plain language.",
      "reveal": "string. 1 to 2 lines. The emotional kicker.",
      "cliffhanger": "string. 1 line. Specific tease. Name the house or placement waiting for them."
    },
    {
      ${insight2Spec}
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
  const focusKey = normalizeFocusArea(focusArea);
  const chartContext = buildRichChartContext(birth, chart);
  const name = birth.name ?? "you";

  // The free preview already showed these 2 insights verbatim (reused, not
  // regenerated). Tell the model so the 8/9 paid insights cover new ground
  // instead of quietly repeating the same placement the person already read.
  const alreadyRevealedContext =
    existingPreview && existingPreview.length > 0
      ? `\n\nTHE PERSON ALREADY READ THESE ${existingPreview.length} INSIGHTS FOR FREE BEFORE PAYING (do not repeat their content or lean on the same placement as a paid section; take a genuinely different angle or a different planet/house entirely):\n${existingPreview
          .map((p, i) => `${i + 1}. "${p.planet}": ${p.truth.slice(0, 220)}${p.truth.length > 220 ? "…" : ""}`)
          .join("\n")}\n`
      : "";

  // Always include Saturn one-shot. Add focus one-shot only when a focus is set.
  const oneShotBlock = focusKey
    ? `${SATURN_ONE_SHOT}\n\n${FOCUS_ONE_SHOTS[focusKey]}`
    : SATURN_ONE_SHOT;

  // Focus context shown to the model so it knows what the user asked for.
  const focusContext = focusKey
    ? `\n\nTHE PERSON CHOSE A FOCUS AREA WHEN FILLING OUT THE FORM:
Focus area: "${focusKey}"
Topic: ${FOCUS_SPEC[focusKey].human_topic}

This means they came to this reading with this specific area on their mind.
You must:
1. Generate the standard 8 paid insights as usual.
2. Generate ONE ADDITIONAL synthesis insight specifically for this focus area.
   The synthesis goes at position 8 in the paidInsights array (just before "The Full Picture").
   It should be 400 to 500 words. Stronger and more specific than any other section.
   It pulls from these placements: ${FOCUS_SPEC[focusKey].placements}
   Central trick: ${FOCUS_SPEC[focusKey].central_trick}
   Structure it as four connected beats, in plain layman language, not a checklist:
     a. What their pattern actually is (the specific behavior, described concretely).
     b. Why the chart shows it (the placements above, explained in plain words, after the feeling has landed).
     c. How it actually shows up in real life (a specific recent-feeling scene, ideally including one short natural line of DIALOGUE someone said to them or they said out loud, in quotes).
     d. What they are probably misunderstanding about themselves (the reframe. this is the payoff line).
   IMPORTANT: this section has NO "action" field and NO "this week" task. It ends on the reframe itself (beat d), not an assignment. Do not add a call to action.
3. In the closing section ("The Full Picture"), include ONE callback sentence to the focus area.
   Something like: "All of this circles back to the [love / career / money / purpose] thing. Because that is the part you were really asking about." Adapt to be specific.
4. The shareCard.flexLine should reflect the focus area's energy.
   Love → a defiant first-person love flex.
   Career → an unapologetic first-person career flex.
   Money → an "I stopped apologizing for wanting more" first-person flex.
   Purpose → an "I see myself clearly now" first-person flex.
`
    : `\n\nThe person did not pick a specific focus area. Cover the 8 standard insights with balanced depth.\n`;

  // The conditional 9th section spec for the JSON schema.
  // NOTE: deliberately has no "action" key. This section does not end in a
  // "this week" task, it ends on the reframe itself.
  const focusInsightSpec = focusKey
    ? `,
    {
      "planet": "${FOCUS_SPEC[focusKey].title}",
      "truth": "string. ONE sentence. The single most accurate thing you can say about their relationship to ${FOCUS_SPEC[focusKey].human_topic}. In human terms.",
      "explain": "string. 400 to 500 words. This is the section that has to land hardest. Match or exceed the focus deep-dive example above. No 'action' field follows this one, so the explain field itself must end on the reframe, not trail off. Hit these four beats in plain layman language: (a) what the pattern actually is, described concretely, (b) why the chart shows it, explained in plain words after the feeling has landed, (c) how it shows up in real life right now, including one short natural line of dialogue in quotes, (d) what they are probably misunderstanding about themselves, as the closing reframe. ${FOCUS_SPEC[focusKey].central_trick} Use ${name}'s name once at the moment of greatest intimacy. Pull from: ${FOCUS_SPEC[focusKey].placements}"
    }`
    : ``;

  // Closer callback instruction depends on focus.
  const closerCallback = focusKey
    ? `End with a callback to the focus area they chose. ONE sentence connecting the synthesis to "${focusKey}". Something like "All of this comes back to the ${focusKey === "love" ? "love thing" : focusKey === "career" ? "career thing" : focusKey === "money" ? "money thing" : "question of who you actually are"}. Because that is the part you were really asking about, ${name}." Adapt the wording, do not copy.`
    : `End with something they will screenshot. Adapt this energy: "I just want you to be happy. And I think you have been settling for fine." Or: "You are not behind. You are building something that does not get built fast."`;

  return `${oneShotBlock}

${chartContext}
${focusContext}
${alreadyRevealedContext}
You are writing ${name}'s complete paid birth chart reading. This is what they paid for.
Make it the most specific, honest, caring thing anyone has ever written about them.
Use ${name}'s name naturally 2 to 4 times across the WHOLE reading. Not in every section. Use it at moments of greatest emotional intimacy.

GOLDEN RULE FOR EVERY SECTION:
Human feeling or behavior FIRST. Planet name or house number SECOND.

DEPTH REQUIREMENT (this is what they paid extra for):
Each standard "explain" field must be 250 to 350 words. 10 to 16 short lines with \\n\\n between paragraphs.
Match or exceed the Maya example.
Hit ALL SEVEN BEATS in order:
  Beat 1. The specific behavior they do not realize is a pattern. Embodied.
  Beat 2. The verbatim internal monologue in quotes. How they actually think it.
  Beat 3. The fear or wound underneath. Named in plain words, no therapy speak.
  Beat 4. The chart reason in plain language. AFTER the feeling has landed.
  Beat 5. The lie they tell themselves. "You call it X. It is actually Y."
  Beat 6. Defend them out loud. At least once across the whole reading.
  Beat 7. The version of them on the other side.

PUNCTUATION LAW (absolute): No em-dashes. No en-dashes. None. Anywhere.

Return ONLY valid JSON. No markdown. No preamble. No code fences.

{
  "letter_opener": "string. Line 1: 'Hey ${name},' on its own. Lines 2 to 4: What strikes you about THIS specific chart. Name the dominant tension or contradiction. ${focusKey ? `Also acknowledge briefly that they chose to focus on ${focusKey}. NOT in a clinical way. In a 'I see what brought you here' way.` : ''} End with: 'Let me show you what your chart said the moment I opened it.'",

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
      "truth": "string. ONE sentence hook. The HUMAN GAP. what people assume vs who they actually are. Zero planet names.",
      "explain": "string. 250 to 350 words. Open with what strangers, coworkers, or new dates assume within the first five minutes. Then the real person underneath. Include one 'You know when you...' scenario. Include one verbatim internal monologue in quotes. THEN explain the Rising sign placement in plain language. Then name the gift inside the mask.",
      "action": "string. ONE specific uncomfortable real action this week. Not a mantra."
    },
    {
      "planet": "Moon. Your Emotional Triggers, Mapped",
      "truth": "string. ONE sentence hook. The way they handle feelings. Behavior, not planet.",
      "explain": "string. 250 to 350 words. Start with what they do when they get overwhelmed (water moon = withdraws and goes quiet; fire moon = explodes then forgets; earth moon = bottles it and gets practical; air moon = intellectualizes and detaches). Include a verbatim 'I am fine' lie in quotes. Then Moon sign and house in plain words. Then what they actually need emotionally. Defend them here.",
      "action": "string"
    },
    {
      "planet": "Venus. Why You Keep Attracting the Same Type",
      "truth": "string. ONE sentence hook. The love pattern in pure human terms.",
      "explain": "string. 250 to 350 words. Open with what they actually do when someone they like gives them mixed signals. Specific behavior. Include one verbatim internal moment: 'maybe they're just busy' style. Then name the pattern. Then Venus sign and house in plain language. Then what they have been settling for. Then what they actually deserve.",
      "action": "string"
    },
    {
      "planet": "Mars. How You Chase, Snap, and Self-Sabotage When Things Go Well",
      "truth": "string. ONE sentence hook about drive or anger.",
      "explain": "string. 250 to 350 words. Open with what they ACTUALLY do when they finally get the thing they wanted. Then how they chase. Then what their anger really looks like. Include one verbatim internal moment of frustration. Then Mars sign and house in plain language. Then the gift their drive has when pointed correctly.",
      "action": "string"
    },
    {
      "planet": "Mercury. What Is Actually Going On In Your Head",
      "truth": "string. ONE sentence hook about their actual thought pattern.",
      "explain": "string. 250 to 350 words. Open with the loop in their head. Do they rehearse conversations. Do they replay things people said three days ago. Include one 'That thing where you [specific behavior]' scenario. Include a verbatim line of internal commentary. Then Mercury placement in plain words. Then the gift AND the cost.",
      "action": "string"
    },
    {
      "planet": "Saturn. Why You Procrastinate When It Matters Most",
      "truth": "string. ONE sentence hook. Start with the FEELING of being behind.",
      "explain": "string. 280 to 380 words. THE EMOTIONAL CORE. Match or exceed the Maya example. OPEN WITH this energy: 'I know it feels like you have been working longer and harder than people who seem to get there faster. You have been.' Then the specific thing they keep starting and not finishing. Then the fear underneath. Include a verbatim 'maybe I am not actually good at this' moment. Then Saturn sign and house in plain words. Then Saturn's actual gift. Then their specific timeline. Use ${name}'s name once here.",
      "action": "string. acknowledge the long game"
    },
    {
      "planet": "Jupiter. Where Your Real Confidence Actually Lives",
      "truth": "string. ONE sentence hook about where things flow naturally.",
      "explain": "string. 250 to 320 words. Warmer tone here. Give them something good. Open with the area of life where they have always been quietly good without trying. Then what they are underestimating. Then Jupiter placement in plain words. Then the specific thing they should lean into harder. End with permission to want what they want.",
      "action": "string"
    }${focusInsightSpec},
    {
      "planet": "The Full Picture. What Your Chart Is Saying About Your Life Right Now",
      "truth": "string. ONE sentence. The single biggest tension in this whole chart.",
      "explain": "string. 320 to 420 words. The closer. Tie 2 to 3 placements together into one cohesive narrative. The tension. The gift inside it. What they are quietly capable of. Use ${name}'s name once at the moment of greatest intimacy. ${closerCallback}",
      "action": "string. one thing to stop. one thing to start."
    }
  ],

  "shareCard": {
    "flexLine": "string. PRIMARY FIELD. This is the ONLY thing rendered on the shareable card, so it has to hit hard enough that a stranger would repost it. EXACTLY 18 to 25 words. First person. Aggressive, dramatic, self-flex energy, built to go viral, not sleek or modest. Either one long declarative flex, or two sharp back-to-back sentences (third-person about themselves is fine for the FIRST sentence only, e.g. '${name} doesn't follow energy. She sets it.', but keep it about them specifically, never generic). Profanity is allowed and encouraged when it lands harder ('fuck', 'hell', 'please'). ${focusKey ? `Because they came here focused on ${focusKey}, the flex should reflect that area's energy specifically.` : ''} Examples to study for TONE, INTENSITY, and LENGTH (do not copy, adapt to their actual chart and name): '${name} doesn't follow energy. She sets it, and everyone else either adjusts or disappears.' / 'I don't do almost. I don't do half assed. And I definitely don't do people who think bare minimum is a personality.' / 'Please keep your weak energy away from me. I'm too expensive in spirit for that mess.' / 'I'm not the one who needs calming down. I'm the one other people need to catch up to.' / 'Fuck being liked by everyone. I'm trying to be respected by the right one.' Build the specific claim from their Sun-Moon-Rising combo and dominant element so it is unmistakably THEIRS, not a generic hype line.",
    "line1": "string. MIRROR of flexLine for backward compatibility.",
    "keyword": "string. 2 to 4 words ALL CAPS. The identity claim.",
    "line2": "string. One more short flex variant in the same tone.",
    "line3": "string. Soft closer in italic energy.",
    "quote": "string. Optional 2 to 3 sentence longer flex for emails."
  }
}

FINAL SELF-CHECK before returning JSON. Mentally verify:
  ${focusKey ? `paidInsights array has EXACTLY 9 items (the focus deep-dive is the 8th, the closer is the 9th).` : `paidInsights array has EXACTLY 8 items.`}
  Every paidInsight has its target word count.
  Every paidInsight contains at least ONE quoted internal monologue.
  Zero em-dashes and zero en-dashes anywhere in the JSON.
  ${name}'s name appears 2 to 4 times across the WHOLE reading.
  ${focusKey ? `The "${FOCUS_SPEC[focusKey].title}" section is the longest and most specific of all sections.` : `The Saturn section opens with the feeling of being behind.`}
  shareCard.flexLine is a first-person flex, not a description.`;
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

export function expectedPaidInsightCount(focusArea?: string | null): 8 | 9 {
  return normalizeFocusArea(focusArea) ? 9 : 8;
}