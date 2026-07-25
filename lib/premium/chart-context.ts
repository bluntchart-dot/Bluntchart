/**
 * lib/premium/chart-context.ts
 *
 * The AI writer's single, up-front anchor to who the reader is.
 *
 * Old shape (deprecated in-place):
 *   - buildReaderOpener returned one sentence of coordinates.
 *   - buildSectionChartContext returned a coordinate list per chapter.
 *   - Result: the last thing the model read before writing each chapter
 *     was placement coordinates, so it wrote about astrology.
 *
 * New shape:
 *   - buildReaderOpener returns a rich, always-cached anchor the writer
 *     internalises ONCE at the top of the prompt:
 *       [ Reader Portrait     ]  — 3–4 sentences of prose person-sketch.
 *       [ Personality Digest  ]  — 2–3 sentences on the recurring shape.
 *       [ Core Emotional Themes] — 3–5 short lines on the through-lines.
 *       [ Silent Chart Reference ] — placement facts, labelled as reference
 *         the model may consult for accuracy but must not narrate.
 *   - buildSectionChartContext returns plain-language emotional territory
 *     for the chapter's chartInputs, NOT coordinates. Placement specifics
 *     never appear in per-chapter blocks anymore.
 *
 * The story is the product. Astrology is the engine. The AI should be
 * writing about a person, not about her Saturn.
 */

import type { ChartData, PlanetPosition } from "@/lib/types";
import type { ChartInput } from "./types";

/* ─────────────────────────────────────────────────────────────────────
   Lookup helpers
───────────────────────────────────────────────────────────────────── */

function findPlanet(chart: ChartData, name: string): PlanetPosition | null {
  return chart.planets.find((p) => p.name === name) ?? null;
}

function pronounHer(): { her: string; she: string; hers: string } {
  // We keep a single pronoun set for the anchor prose so the model sees
  // a consistent voice. The chapters themselves address the reader as
  // "you". Nothing about the reader is assumed beyond that we are
  // sketching them for a friend, so we use they/them here.
  return { her: "them", she: "they", hers: "theirs" };
}

/* ─────────────────────────────────────────────────────────────────────
   Sign → plain-language descriptor tables
   These are intentionally short and human. They are NOT trying to be
   comprehensive astrology definitions. They give the model a compact
   sketch to build a portrait from.
───────────────────────────────────────────────────────────────────── */

type Sign =
  | "Aries" | "Taurus" | "Gemini" | "Cancer" | "Leo" | "Virgo"
  | "Libra" | "Scorpio" | "Sagittarius" | "Capricorn" | "Aquarius" | "Pisces";

const SUN_CORE: Record<Sign, string> = {
  Aries:       "burns forward, hates being told to slow down",
  Taurus:      "moves at their own pace and protects what they love",
  Gemini:      "thinks in tabs, three thoughts running at once",
  Cancer:      "feels first, remembers everything, keeps track of who is safe",
  Leo:         "performs even when they don't mean to, wants to be really seen",
  Virgo:       "notices everything and quietly tries to fix it before anyone asks",
  Libra:       "reads the room before they read themselves",
  Scorpio:     "does not do surface, needs the real thing or nothing",
  Sagittarius: "keeps one foot out the door, needs a horizon to feel alive",
  Capricorn:   "builds like they are running out of time",
  Aquarius:    "watches from just outside the group, protects their strangeness",
  Pisces:      "absorbs the room, sometimes loses themselves in what other people feel",
};

const MOON_NEED: Record<Sign, string> = {
  Aries:       "to move when upset, not to sit and talk it out",
  Taurus:      "physical safety, softness, the same bed and the same coffee",
  Gemini:      "to talk it out until it makes sense",
  Cancer:      "to feel held before anything else can be asked of them",
  Leo:         "someone who sees them sad, not only their polished self",
  Virgo:       "quiet and order to feel safe enough to feel anything",
  Libra:       "harmony in the room, because tension is physically exhausting",
  Scorpio:     "proof someone will not leave, not just words",
  Sagittarius: "room to move when things get heavy",
  Capricorn:   "to be useful, even in the middle of hurting",
  Aquarius:    "privacy and distance to feel their feelings alone before sharing them",
  Pisces:      "to disappear for a little while and then come back",
};

const RISING_OPENS: Record<Sign, string> = {
  Aries:       "fast, direct, first to speak in the room",
  Taurus:      "calm and unhurried, they look like they have time",
  Gemini:      "chatty, curious, hard to pin down",
  Cancer:      "warm but guarded, reading you before letting you in",
  Leo:         "warm and visible, walks in like they were expected",
  Virgo:       "neat and alert, quietly deciding whether you are worth their time",
  Libra:       "pleasing, easy to like, difficult to say no to",
  Scorpio:     "quiet, watching, does not fill silences",
  Sagittarius: "open and easy, low-key let's get out of here energy",
  Capricorn:   "composed, older than their years",
  Aquarius:    "friendly but slightly outside the room",
  Pisces:      "gentle and a little blurry, the last person you notice and then the only one you remember",
};

/**
 * A compact recurring situation for each Sun sign. Feeds the Core
 * Emotional Themes block so the model can build scenes off it.
 * Written as "keeps doing X" behaviours the writer can dramatise, NOT
 * as aphorisms. If a line here sounds like it belongs on Pinterest,
 * rewrite it.
 */
const SUN_THROUGHLINE: Record<Sign, string> = {
  Aries:       "keeps moving fast, then realising later they hurt someone by moving that fast",
  Taurus:      "keeps being told they're slow by people who don't see how much they're actually holding",
  Gemini:      "keeps talking around what they actually feel because they can name eleven things but not the real one",
  Cancer:      "keeps carrying everyone's emotional weather and then wondering why they're tired",
  Leo:         "keeps performing when they wanted to be met, and doesn't clock the difference until after",
  Virgo:       "keeps solving other people's problems and forgetting they were allowed to just have an evening",
  Libra:       "keeps being the reasonable one, then quietly resenting being the reasonable one",
  Scorpio:     "keeps clocking what nobody in the room is saying, then feeling too tired to explain how they know",
  Sagittarius: "keeps making the exit strategy first and the plans second",
  Capricorn:   "keeps proving they've earned things nobody actually asked them to earn",
  Aquarius:    "keeps being told they're the interesting one, and quietly wanting to be the loved one",
  Pisces:      "keeps absorbing whoever is in the room, then getting home and not knowing which feelings were theirs",
};

const MOON_THROUGHLINE: Record<Sign, string> = {
  Aries:       "goes for a walk when they should probably just cry",
  Taurus:      "confuses safety with everything staying exactly where it already was",
  Gemini:      "explains a feeling three ways before letting themselves have it",
  Cancer:      "gives away all the softness and then wonders why they feel hard",
  Leo:         "wants to be loved on the bad days without having to be pretty about it",
  Virgo:       "flinches when someone offers to help without them asking",
  Libra:       "says 'I don't mind, you pick' when they minded",
  Scorpio:     "half-waits for the person to leave before the person has done anything",
  Sagittarius: "packs a mental bag every time things get too close",
  Capricorn:   "acts like they don't need what they very obviously need",
  Aquarius:    "explains their feelings from a slight distance, like the feelings belong to someone else",
  Pisces:      "picks up other people's moods and thinks they are their own",
};

/* ─────────────────────────────────────────────────────────────────────
   Small builders — each returns one section of the anchor
───────────────────────────────────────────────────────────────────── */

function asSign(s: string | undefined): Sign | null {
  const known: Sign[] = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
  ];
  return (known as string[]).includes(s ?? "") ? (s as Sign) : null;
}

function buildReaderPortrait(chart: ChartData, name: string): string {
  const p = pronounHer();
  const sun = findPlanet(chart, "Sun");
  const moon = findPlanet(chart, "Moon");
  const rising = chart.ascendant?.sign;

  const sunSign = asSign(sun?.sign);
  const moonSign = asSign(moon?.sign);
  const risingSign = asSign(rising);

  const sunLine = sunSign
    ? `At the core, ${p.she} ${SUN_CORE[sunSign]}.`
    : "";
  const moonLine = moonSign
    ? `Underneath that, what ${p.she} actually need${p.she === "they" ? "" : "s"} to feel safe is ${MOON_NEED[moonSign]}.`
    : "";
  const risingLine = risingSign
    ? `And from the outside, ${p.she} walk${p.she === "they" ? "" : "s"} in ${RISING_OPENS[risingSign]}.`
    : "";

  const closing =
    "Write to the underneath. That's who's actually here.";

  const opener = `This book is for ${name}. Hold ${p.her} in mind while you write. Not as a chart. As a friend you have known for years.`;

  return [opener, "", sunLine, moonLine, risingLine, "", closing]
    .filter((s) => s.length > 0 || s === "")
    .join("\n")
    .trim();
}

function buildPersonalityDigest(chart: ChartData): string {
  const sun = asSign(findPlanet(chart, "Sun")?.sign);
  const moon = asSign(findPlanet(chart, "Moon")?.sign);
  const rising = asSign(chart.ascendant?.sign);

  const lines: string[] = [];

  if (sun && moon && sun !== moon) {
    lines.push(
      `There is a real gap between who they are at the surface and what they need underneath. The surface wants to ${surfaceWant(sun)}. Underneath wants ${undergroundWant(moon)}. Write to the underneath.`
    );
  } else if (sun) {
    lines.push(
      `Surface and interior line up more than most for this one. They ${surfaceWant(sun)}, and that is also what holds them.`
    );
  }

  if (rising && sun && rising !== sun) {
    lines.push(
      `The first version of them people meet is not the version doing the actual work. ${risingImpression(rising)} That first impression hides how much they are carrying inside.`
    );
  }

  if (lines.length === 0) {
    lines.push(
      "Everything about this one lives underneath the surface. Write to the underneath."
    );
  }

  return lines.join("\n\n");
}

function surfaceWant(sign: Sign): string {
  const map: Record<Sign, string> = {
    Aries:       "move, decide, act",
    Taurus:      "build slowly and hold what they have built",
    Gemini:      "think out loud and keep options open",
    Cancer:      "care for the people they love",
    Leo:         "matter to someone visibly",
    Virgo:       "make things work, quietly, for everyone",
    Libra:       "keep the peace and be liked",
    Scorpio:     "go deep with a few and stay far from the rest",
    Sagittarius: "keep the horizon open",
    Capricorn:   "achieve something that outlasts them",
    Aquarius:    "understand things other people miss",
    Pisces:      "feel the whole room and translate it",
  };
  return map[sign];
}

function undergroundWant(sign: Sign): string {
  const map: Record<Sign, string> = {
    Aries:       "to not be told to sit down with feelings that are still moving",
    Taurus:      "to know things aren't about to change without warning",
    Gemini:      "to be understood, not asked to explain themselves again",
    Cancer:      "to be held first and asked questions later",
    Leo:         "to be loved on the bad days, not just the good ones",
    Virgo:       "to be allowed to stop being useful for one evening",
    Libra:       "to be allowed to have a preference and say it out loud",
    Scorpio:     "certainty that the person isn't going to leave",
    Sagittarius: "to stay put somewhere without feeling stuck",
    Capricorn:   "to be loved before they have earned it",
    Aquarius:    "to be close to someone and still feel like themselves",
    Pisces:      "to stop absorbing everyone else for a minute",
  };
  return map[sign];
}

function risingImpression(sign: Sign): string {
  const map: Record<Sign, string> = {
    Aries:       "People read them as confident and fast.",
    Taurus:      "People read them as steady and unbothered.",
    Gemini:      "People read them as light, quick, easy.",
    Cancer:      "People read them as kind and safe.",
    Leo:         "People read them as bright and self-possessed.",
    Virgo:       "People read them as capable and put-together.",
    Libra:       "People read them as easy to be around.",
    Scorpio:     "People read them as private and a little intimidating.",
    Sagittarius: "People read them as open and low-maintenance.",
    Capricorn:   "People read them as competent and grown.",
    Aquarius:    "People read them as interesting but distant.",
    Pisces:      "People read them as gentle and forgiving.",
  };
  return map[sign];
}

function buildCoreEmotionalThemes(chart: ChartData): string {
  const sun = asSign(findPlanet(chart, "Sun")?.sign);
  const moon = asSign(findPlanet(chart, "Moon")?.sign);

  const themes: string[] = [];
  if (sun) themes.push(`- ${SUN_THROUGHLINE[sun]}`);
  if (moon) themes.push(`- ${MOON_THROUGHLINE[moon]}`);

  // A universal-through-line so we never emit an empty block for readers
  // with unusual charts. Kept short and honest.
  themes.push(
    "- the specific shape of how they hide what they need and still hope someone will notice"
  );

  return themes.join("\n");
}

/* ─────────────────────────────────────────────────────────────────────
   Silent chart reference
   The raw placement facts, presented as a reference block the model may
   consult for accuracy. Explicitly framed as "not for narration."
───────────────────────────────────────────────────────────────────── */

function factLine(chart: ChartData, name: string): string | null {
  const p = findPlanet(chart, name);
  if (!p) return null;
  const deg = Math.floor(p.degree);
  const retro = p.retrograde ? " (retrograde)" : "";
  return `- ${name}: ${p.sign} ${deg}°, house ${p.house}${retro}`;
}

function angleFact(
  chart: ChartData,
  key: "ascendant" | "midheaven" | "imumCoeli",
  label: string
): string | null {
  const a = chart[key];
  if (!a?.sign) return null;
  const deg = Math.floor(a.degree ?? 0);
  return `- ${label}: ${a.sign} ${deg}°`;
}

function houseFact(chart: ChartData, num: number): string | null {
  const h = chart.houses.find((x) => x.number === num);
  if (!h) return null;
  return `- House ${num} cusp: ${h.sign}`;
}

function buildSilentChartReference(chart: ChartData): string {
  const parts: string[] = [];

  const planets = [
    "Sun", "Moon", "Mercury", "Venus", "Mars",
    "Jupiter", "Saturn", "Pluto",
  ];
  for (const name of planets) {
    const l = factLine(chart, name);
    if (l) parts.push(l);
  }

  const asc = angleFact(chart, "ascendant", "Rising");
  const mc = angleFact(chart, "midheaven", "Midheaven");
  const ic = angleFact(chart, "imumCoeli", "IC");
  if (asc) parts.push(asc);
  if (mc) parts.push(mc);
  if (ic) parts.push(ic);

  for (const num of [2, 5, 7, 10, 12]) {
    const l = houseFact(chart, num);
    if (l) parts.push(l);
  }

  const strongest =
    chart.aspects.find((a) => a.type === "trine" || a.type === "square") ??
    chart.aspects.find((a) => a.type === "conjunction") ??
    chart.aspects[0];
  if (strongest) {
    parts.push(
      `- Defining aspect: ${strongest.planet1} ${strongest.type} ${strongest.planet2}`
    );
  }

  const header = [
    "SILENT CHART REFERENCE — for accuracy only.",
    "The reader will never see this block. The book does not narrate these.",
    "Do not name planets, houses, degrees, or aspects in the chapters unless",
    "the sentence is genuinely stronger with the mention than without it.",
    "The technical \"why we're saying this\" card is generated separately by",
    "the app and lives outside the story.",
  ].join("\n");

  if (parts.length === 0) return header;
  return `${header}\n\n${parts.join("\n")}`;
}

/* ─────────────────────────────────────────────────────────────────────
   Public: the anchor and the per-section pointer
───────────────────────────────────────────────────────────────────── */

/**
 * The single anchor read once at the top of the user prompt. Composes
 * portrait, personality digest, core emotional themes, and the silent
 * chart reference into one block. The signature is unchanged; only the
 * output has grown.
 */
export function buildReaderOpener(chart: ChartData, name: string): string {
  const portrait = buildReaderPortrait(chart, name);
  const digest = buildPersonalityDigest(chart);
  const themes = buildCoreEmotionalThemes(chart);
  const reference = buildSilentChartReference(chart);

  return [
    "# Reader Portrait",
    portrait,
    "",
    "# Personality Digest",
    digest,
    "",
    "# Core Emotional Themes",
    themes,
    "",
    "# " + reference.split("\n")[0], // "SILENT CHART REFERENCE — …"
    reference.split("\n").slice(1).join("\n").trim(),
  ]
    .join("\n")
    .trim();
}

/* ─────────────────────────────────────────────────────────────────────
   Per-chapter emotional territory
   Replaces the old per-chapter placement digest. Same signature, but the
   output is plain-language territory labels, not coordinates. The point
   is that the LAST thing the model reads before writing a chapter is
   emotional direction, never astrology.
───────────────────────────────────────────────────────────────────── */

const TERRITORY: Record<ChartInput, string> = {
  "sun":               "who they are at the core, and what they quietly want",
  "moon":              "what they need to feel safe, and how they hide it",
  "mercury":           "how their mind moves, and where it gets stuck",
  "venus":             "what they love, how they attract, what they reach for",
  "mars":              "how they fight, pursue, and protect themselves",
  "jupiter":           "where luck lands for them, and how they expand",
  "saturn":            "the lesson life keeps giving them",
  "pluto":             "what runs deep and quietly transforms them",
  "rising":            "how they open a door, and what people meet first",
  "midheaven":         "their public path and long-term work",
  "ic":                "their private roots and their safe place",
  "house-2":           "how they build worth, money, and safety",
  "house-5":           "how they play, create, and take romantic risks",
  "house-7":           "the partnership their chart is drawn to",
  "house-10":          "their public shape and long career arc",
  "house-12":          "the parts of them that live behind closed doors",
  "major-aspects":     "the defining tension or flow inside them",
  "north-node":        "the direction their chart is quietly pulling them",
  "south-node":        "the pattern their chart is quietly pulling them away from",
  "chiron":            "the wound they keep circling",
  "current-transits":  "the sky moving across their chart right this season",
};

/**
 * Return plain-language emotional territory for the chapter's declared
 * chartInputs. The model gets a pointer to WHERE inside the reader this
 * chapter lives, not a coordinate list. Specific placements are already
 * up top in the silent chart reference and must not be re-narrated.
 */
export function buildSectionChartContext(
  chart: ChartData,
  inputs: readonly ChartInput[]
): string {
  // `chart` intentionally unused — placements live in the anchor now.
  void chart;

  const territories: string[] = [];
  for (const input of inputs) {
    const t = TERRITORY[input];
    if (t) territories.push(`- ${t}`);
  }

  if (territories.length === 0) {
    return "This chapter is a synthesis chapter. Draw on the reader's overall shape from the anchor above.";
  }

  return [
    "Emotional territory this chapter draws on:",
    territories.join("\n"),
    "",
    "Specific placements are in the silent chart reference in the anchor above. Do not narrate them here.",
  ].join("\n");
}
