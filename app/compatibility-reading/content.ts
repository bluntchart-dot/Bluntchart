/**
 * Copy + config for /compatibility-reading.
 * Kept separate from the client so page.tsx can build JSON-LD from the same source.
 */

/** Display price in USD. Change here and it updates the page, CTAs and JSON-LD. */
export const COMPAT_PRICE = "14.99";

/**
 * Gumroad checkout link for the compatibility reading.
 * Empty until the product is live — the pay button shows an error instead of redirecting.
 */
export const COMPAT_CHECKOUT_URL = process.env.NEXT_PUBLIC_COMPAT_CHECKOUT_URL ?? "";

export const COMPAT_CHAPTERS = [
  {
    n: "01",
    title: "Where This Connection Is Right Now",
    planets: "Current transits × both charts",
    line: "What's being tested between you this season, and why it suddenly feels louder.",
  },
  {
    n: "02",
    title: "The Magnetism",
    planets: "Venus–Mars · Sun–Venus",
    line: "The exact thing one of you does that the other can't look away from.",
  },
  {
    n: "03",
    title: "How You Love Differently",
    planets: "Venus–Venus · Moon–Moon",
    line: "What one of you needs, what the other actually gives, and where it misses.",
  },
  {
    n: "04",
    title: "The Fight You Keep Having",
    planets: "Mars–Mars · Sun–Sun",
    line: "What the argument looks like on the surface, and what it's really about.",
  },
  {
    n: "05",
    title: "How You Talk Past Each Other",
    planets: "Mercury cross-aspects",
    line: "How each of you processes, where the misunderstanding lives, how to bridge it.",
  },
  {
    n: "06",
    title: "What You Heal and What You Trigger",
    planets: "Chiron · Moon cross-aspects",
    line: "The tender spot one of you keeps pressing, and why it keeps happening.",
  },
  {
    n: "07",
    title: "What This Connection Is Asking of You",
    planets: "North Node · Saturn",
    line: "Comfort or growth. The long-term picture, and what makes or breaks it.",
  },
] as const;

/** The 7 cross-chart connections the synastry engine measures (lib/astro-compat.ts). */
export const COMPAT_DIMENSIONS = [
  { label: "Chemistry", pair: "Venus × Mars" },
  { label: "Emotional wavelength", pair: "Moon × Moon" },
  { label: "Feeling cared for", pair: "Sun × Moon" },
  { label: "Love language", pair: "Venus × Venus" },
  { label: "Core identity", pair: "Sun × Sun" },
  { label: "Conflict style", pair: "Mars × Mars" },
  { label: "Appreciation", pair: "Sun × Venus" },
] as const;

export const COMPAT_COMPARE = {
  columns: ["Free calculators", "Typical Etsy / PDF report", "BluntChart"],
  rows: [
    { label: "Uses both full birth charts", values: ["Sun signs only", "Sometimes", "Yes, all planets"] },
    { label: "Written to you both by name", values: ["No", "Template text", "Yes, every chapter"] },
    { label: "Names the friction, not just the sweet parts", values: ["Rarely", "Rarely", "That's the point"] },
    { label: "Includes what's happening right now (transits)", values: ["No", "No", "Yes"] },
    { label: "Delivery", values: ["Instant, but generic", "24–72 hours", "Minutes"] },
    { label: "Price", values: ["Free", "$9–$55", `$${COMPAT_PRICE}`] },
  ],
} as const;

export const COMPAT_FAQ = [
  {
    q: "What is a compatibility reading?",
    a: "A compatibility reading (also called a synastry reading) compares two birth charts to show how two people interact: what draws you together, how you each love, where you clash, and how you communicate. It goes far beyond Sun sign compatibility because it looks at where every planet sat for both of you, including the Moon, Venus, Mars, Mercury, Saturn and Chiron.",
  },
  {
    q: "What do I need to get one?",
    a: "Both people's first name, date of birth, and city of birth. Birth time is strongly recommended because it pins down the Moon and the houses, but it's optional. If you don't know one of the birth times, tick \"I don't know\" and we use a midday chart. Everything that doesn't depend on the exact hour stays accurate.",
  },
  {
    q: "My partner doesn't know I'm doing this. Is that okay?",
    a: "Yes. You only need their birth details, not their email or an account. Plenty of people use it on a crush, a situationship, an ex, or before a first big conversation. It also works for friends, siblings, or a business partner.",
  },
  {
    q: "Is this written by a person or by AI?",
    a: "Both charts and every cross-aspect are calculated from real astronomical positions for your exact dates, times and places. That data is then written up by AI working inside an interpretive framework and rules we built ourselves: every claim must trace to an actual aspect between your charts, nothing is invented, and the friction gets named as honestly as the chemistry. No two couples get the same reading.",
  },
  {
    q: "How long is it and how is it delivered?",
    a: "About 2,000 words across 7 chapters, plus an opening line and a final word. It's ready within minutes of checkout and the link is emailed to you, so you can read it on your phone and come back to it anytime.",
  },
  {
    q: "Will it tell us if we're meant to be?",
    a: "No reading can promise that, and we won't pretend otherwise. What it will do is show the real dynamic between you, the good and the hard, so you understand why things feel the way they do and what this connection asks of both of you.",
  },
  {
    q: "Can I get a refund?",
    a: "Because every reading is generated for two specific people, we don't offer refunds once it's delivered. If anything goes wrong (a typo in a birth date, a link that won't open, a reading that never arrives) email us and we'll fix it or regenerate it. You'll always get your reading.",
  },
  {
    q: "What happens to our birth details?",
    a: "They're used to calculate your charts and write your reading. We don't sell them, and we don't share them with anyone. The other person's details are never used to contact them.",
  },
] as const;

/* ─── Sun-sign teaser (free, shown in the form) ─────────────────────── */

const SIGNS = [
  { name: "Capricorn", el: "earth", end: [1, 19] },
  { name: "Aquarius", el: "air", end: [2, 18] },
  { name: "Pisces", el: "water", end: [3, 20] },
  { name: "Aries", el: "fire", end: [4, 19] },
  { name: "Taurus", el: "earth", end: [5, 20] },
  { name: "Gemini", el: "air", end: [6, 20] },
  { name: "Cancer", el: "water", end: [7, 22] },
  { name: "Leo", el: "fire", end: [8, 22] },
  { name: "Virgo", el: "earth", end: [9, 22] },
  { name: "Libra", el: "air", end: [10, 22] },
  { name: "Scorpio", el: "water", end: [11, 21] },
  { name: "Sagittarius", el: "fire", end: [12, 21] },
] as const;

export type Element = "fire" | "earth" | "air" | "water";

/** Approximate tropical Sun sign from a YYYY-MM-DD date (cusp days can vary by a day). */
export function sunSignFromDate(dob: string): { name: string; el: Element } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dob);
  if (!m) return null;
  const month = Number(m[2]);
  const day = Number(m[3]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return null;
  for (const s of SIGNS) {
    if (month === s.end[0] && day <= s.end[1]) return { name: s.name, el: s.el };
  }
  // Past the cut-off: the sign is the one that ends next month.
  const next = SIGNS.find((s) => s.end[0] === (month % 12) + 1)!;
  return { name: next.name, el: next.el };
}

const PAIR_LINES: Record<string, string> = {
  "fire+fire": "Two lit matches. Fast chemistry, faster arguments, and neither of you wants to back down first.",
  "earth+earth": "Steady and loyal. The risk isn't fighting. It's getting comfortable and slowly going quiet.",
  "air+air": "You can talk for hours. The real question is whether either of you says what you actually feel.",
  "water+water": "You feel each other before anyone speaks. Beautiful, until you both absorb the same bad mood.",
  "earth+fire": "One wants to move now, one wants a plan. Magnetic at first, exhausting if nobody names it.",
  "air+fire": "Air feeds fire. Big ideas, big laughs, and a habit of skipping the boring conversations that matter.",
  "fire+water": "Steam. A real pull, and real hurt feelings. One of you reacts fast, the other remembers.",
  "air+earth": "One lives in the practical, one in the hypothetical. You either balance each other or talk past each other.",
  "earth+water": "Naturally protective of each other. The danger is avoiding hard talks just to keep the peace.",
  "air+water": "One processes by thinking, one by feeling. The fight is rarely about the topic. It's about tone.",
};

export function pairLine(a: Element, b: Element): string {
  const key = [a, b].sort().join("+");
  return PAIR_LINES[key] ?? "";
}
