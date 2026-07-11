/**
 * Curated BluntChart writing corpus — the register in miniature.
 *
 * These are STYLE REFERENCES, not templates. The article writer reads
 * them to calibrate sentence rhythm, level of psychological specificity,
 * and absence of astrology-publication filler. It must never copy the
 * examples verbatim, and the topics here are deliberately NOT Saturn
 * Return so the model doesn't over-fit any single article.
 *
 * Add / retire examples freely — this file has no coupling to writer
 * logic beyond its shape.
 *
 * When adding a new snippet, hold to:
 *  - 2-4 sentences, no more.
 *  - A concrete behaviour or feeling, not a summary.
 *  - Second-person "you".
 *  - Zero cosmic / mystical / publication phrasing.
 *  - Would a friend recognise themselves? If not, cut it.
 */

export type StyleKind = "opening" | "observation" | "cta_bridge" | "anti_pattern";

export interface StyleSnippet {
  kind: StyleKind;
  topic: string;
  text: string;
}

export const STYLE_EXAMPLES: StyleSnippet[] = [
  // ── OPENINGS: recognition hook in the first 3-4 sentences ────────────
  {
    kind: "opening",
    topic: "moon in scorpio",
    text: "There is a thing you do where someone finally starts being consistent and you just… stop responding. Not on purpose. You want to want it. But something in you goes quiet the second it stops feeling risky.",
  },
  {
    kind: "opening",
    topic: "venus square",
    text: "You're not confused about him. You knew by week two. You keep pretending you don't so you don't have to be the one who ends it.",
  },
  {
    kind: "opening",
    topic: "12th house",
    text: "You've been called 'a lot' by people who couldn't handle a fraction of what you actually feel. You learned early to make yourself smaller in rooms, then wondered why you felt invisible in them.",
  },
  {
    kind: "opening",
    topic: "mercury retrograde",
    text: "You didn't lose the file. You had three arguments in five days that all traced back to something someone said two years ago you thought you were over.",
  },

  // ── OBSERVATIONS: specific behaviour, not abstract summary ──────────
  {
    kind: "observation",
    topic: "attachment pattern",
    text: "The pattern isn't that you attract emotionally unavailable people. The pattern is that when someone shows up for you consistently for six weeks, your nervous system reads it as boring and your brain reads it as suspicious.",
  },
  {
    kind: "observation",
    topic: "career transit",
    text: "In astrology, this transit often shows up as the job you defended for years starting to feel like a costume. Not a crisis — a mismatch. You're not burning out. You're outgrowing the container.",
  },
  {
    kind: "observation",
    topic: "moon sign",
    text: "That thing where you seem calm on the outside and are running six simulations of the argument on the inside — that's the moon sign, not the sun. Sun is who you decide to be. Moon is who you are when nobody's looking.",
  },

  // ── CTA BRIDGES: specific insight → tool, never a generic pivot ─────
  {
    kind: "cta_bridge",
    topic: "saturn placement",
    text: "Whether this shows up in your career, your family, or something you haven't named yet depends on the sign and house Saturn is sitting in. Same transit, three different lives. Yours is at [link].",
  },
  {
    kind: "cta_bridge",
    topic: "big three",
    text: "If any of this made you think 'okay but which part of me is that' — that is the birth chart's whole job. Three specific placements in yours are doing most of the work.",
  },
  {
    kind: "cta_bridge",
    topic: "moon sign",
    text: "This is where the article ends and your chart takes over. Because the moon in Scorpio does something very different than the moon in Libra with the same rising sign.",
  },

  // ── ANTI-PATTERNS: publication voice ✗  →  BluntChart voice ✓ ───────
  {
    kind: "anti_pattern",
    topic: "framing",
    text: "✗ 'Saturn is the stern teacher of the zodiac, testing your resilience.'  ✓ 'Astrologers read Saturn as the placement where you've been getting away with something and time catches up. Not punishment. The check comes due.'",
  },
  {
    kind: "anti_pattern",
    topic: "close",
    text: "✗ 'Embrace transformative growth and emerge more authentically you.'  ✓ 'You'll either do the thing you've been talking about for two years, or you won't, and it will come back around in six years harder.'",
  },
  {
    kind: "anti_pattern",
    topic: "cta",
    text: "✗ 'Ready to unlock powerful insights about your chart?'  ✓ 'This is where general astrology stops being useful — because Saturn in the 10th house means something very different than Saturn in the 4th.'",
  },
];

/**
 * Format the corpus into a compact prompt block. Called by
 * article-writer.buildArticlePrompt. Kept in this file so evolving the
 * examples never requires touching the writer logic.
 */
export function formatStyleExamplesForPrompt(): string {
  const byKind: Record<StyleKind, StyleSnippet[]> = {
    opening: [],
    observation: [],
    cta_bridge: [],
    anti_pattern: [],
  };
  for (const ex of STYLE_EXAMPLES) byKind[ex.kind].push(ex);

  const section = (label: string, items: StyleSnippet[]) =>
    items.length === 0
      ? ""
      : `${label}\n${items.map((s) => `  • ${s.text}`).join("\n")}`;

  return [
    "STYLE REFERENCES — this is BluntChart's register in miniature. Do NOT copy any of these; they are a compass, not a template. Do not reuse their topics, phrasings, or examples. Match sentence rhythm, level of psychological specificity, and the absence of cosmic / publication filler.",
    "",
    section("Openings (recognition hook, second-person, concrete):", byKind.opening),
    "",
    section("Body observations (specific behaviour, not abstract summary):", byKind.observation),
    "",
    section("CTA bridges (from a specific insight to the tool, never a generic pivot):", byKind.cta_bridge),
    "",
    section("Anti-patterns (publication voice → BluntChart voice):", byKind.anti_pattern),
  ].join("\n");
}
