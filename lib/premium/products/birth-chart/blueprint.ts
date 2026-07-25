/**
 * Birth Chart — Blueprint
 *
 * This file is the product. It contains only static content.
 *
 * The AI never touches these values. Every renderer (interactive book,
 * PDF, email, future mobile) walks this same list in `order` and asks
 * the renderer for each page what to do based on `pageType`.
 *
 * NEVER put prompt engineering here. Prompt fragments live in
 * prompt-fragments.ts and per-chapter direction in guidelines.ts.
 */

import type { BlueprintSection } from "@/lib/premium/types";

/**
 * The one static explainer shown on the "How We Read Your Chart" page.
 * Extracted here so the renderer can also access the table (below) if it
 * wants to render it as structured cards rather than prose.
 */
export const HOW_WE_READ_EXPLAINER = `No, this isn't based on your zodiac sign alone.

Your reading comes from the exact position of every planet, every house, and every degree at the moment you were born.

Think of your birth chart as a snapshot of the sky the second you entered the world.

Every section you're about to read combines different parts of that blueprint to explain one area of your life.`;

/**
 * The Chapter → Built-Using mapping shown on the "How We Read" page as
 * a table. Displayed once, up-front, to set the trust frame for the
 * per-chapter Built Using cards that appear later.
 *
 * IMPORTANT: keep in sync with the actual chapters below. Every chapter
 * with pageType: "chapter" belongs here. Chapters that weave multiple
 * placements simply say "Combined".
 */
export const CHAPTER_BUILT_USING_TABLE = [
  /* ── Part I ─────────────────────────────────────────── */
  { icon: "✨", chapter: "Before We Begin",           builtUsing: "Sun • Moon • Rising" },
  { icon: "🌞", chapter: "The Real You",              builtUsing: "Sun • Moon • Rising" },
  { icon: "⚔️", chapter: "Your Inner Fighter",         builtUsing: "Mars • Sun" },
  { icon: "🫥", chapter: "Your Blind Spot",           builtUsing: "Saturn • 12th House" },
  { icon: "❤️", chapter: "Love Patterns",              builtUsing: "Venus • Mars • 5th & 7th Houses" },
  { icon: "🌑", chapter: "Your Shadow",               builtUsing: "Pluto • Saturn • 12th House" },
  { icon: "🌱", chapter: "Your Growth Lesson",        builtUsing: "Saturn • North Node • Chiron" },
  { icon: "💼", chapter: "Your Work & Success Story", builtUsing: "Midheaven • Saturn • Jupiter" },
  { icon: "✦",  chapter: "Your Hidden Gift",          builtUsing: "Jupiter • Sun" },
  { icon: "🏡", chapter: "Your Safe Place",           builtUsing: "Moon • IC • 2nd House" },
  { icon: "🎬", chapter: "Your Life Story",           builtUsing: "Combined — the whole chart" },
  /* ── Part II ────────────────────────────────────────── */
  { icon: "🌙", chapter: "A Different Season",        builtUsing: "Current Transits" },
  { icon: "🔄", chapter: "Love, Career, Money",       builtUsing: "Combined — transits + Venus, Midheaven, Jupiter" },
  { icon: "⏳", chapter: "Your Timing",                builtUsing: "Combined — active transits + major aspects" },
] as const;

/* ─────────────────────────────────────────────────────────────────────
   BLUEPRINT
   Ordered exactly as the reader will experience the book.
   Part II sections are declared with `disabled: true` so the product
   structure is intact but nothing renders until transits ship.
───────────────────────────────────────────────────────────────────── */

export const BIRTH_CHART_BLUEPRINT: readonly BlueprintSection[] = [
  /* ══════════════════════════════════════════════════════════════════
     PART I — UNDERSTANDING YOU
  ══════════════════════════════════════════════════════════════════ */

  {
    id: "cover",
    order: 1,
    part: "part-one",
    pageType: "cover",
    pageTheme: "night",
    title: "Your Story",
    subtitle: "Some stories are written by life. This one was written by the sky.",
  },

  {
    id: "welcome",
    order: 2,
    part: "part-one",
    pageType: "welcome",
    pageTheme: "neutral",
    title: "Welcome",
    subtitle: "Before we begin.",
    staticBody: `You didn't stumble here by accident.

Something inside you wanted to be seen. Not flattered. Not fixed. Just seen.

That's what this book is for.

The pages ahead aren't a horoscope. They aren't a personality quiz. They're a slow, honest look at the person your chart says you already are — the one who shows up when nobody's watching, the one you sometimes hide, and the one you're quietly becoming.

Take your time with it. Read it in one sitting or come back to it in pieces. Notice the parts that make you pause. Those are usually the ones you needed most.

Ready when you are.`,
  },

  {
    id: "natal-chart",
    order: 3,
    part: "part-one",
    pageType: "chart",
    pageTheme: "night",
    title: "Your Natal Chart",
    subtitle: "The sky at the exact moment you arrived.",
    chartInputs: [
      "sun", "moon", "rising",
      "venus", "mars", "mercury", "jupiter", "saturn",
      "midheaven",
    ],
  },

  {
    id: "how-we-read-your-chart",
    order: 4,
    part: "part-one",
    pageType: "education",
    pageTheme: "neutral",
    title: "How We Read Your Chart",
    subtitle: "So… how did we figure all of this out?",
    staticBody: HOW_WE_READ_EXPLAINER,
  },

  /* ─── Part I hero title ───────────────────────────────────────── */

  {
    id: "part-one-title",
    order: 5,
    part: "part-one",
    pageType: "part-title",
    pageTheme: "night",
    title: "Part I",
    subtitle: "Understanding You",
  },

  /* ─── Part I chapters ─────────────────────────────────────────── */

  {
    id: "before-we-begin",
    order: 6,
    part: "part-one",
    pageType: "chapter",
    pageTheme: "warm",
    title: "Before We Begin",
    subtitle: "I already know something about you…",
    chapterNumber: 1,
    chartInputs: ["sun", "moon", "rising"],
  },

  {
    id: "real-you",
    order: 7,
    part: "part-one",
    pageType: "chapter",
    pageTheme: "elevated",
    title: "The Real You",
    subtitle: "Who you really are when nobody's watching.",
    chapterNumber: 2,
    chartInputs: ["sun", "moon", "rising"],
  },

  {
    id: "inner-fighter",
    order: 7,
    part: "part-one",
    pageType: "chapter",
    pageTheme: "shadow",
    title: "Your Inner Fighter",
    subtitle: "The fire that shows up when life gets hard.",
    chapterNumber: 3,
    chartInputs: ["mars", "sun", "major-aspects"],
  },

  {
    id: "blind-spot",
    order: 8,
    part: "part-one",
    pageType: "chapter",
    pageTheme: "shadow",
    title: "Your Blind Spot",
    subtitle: "The habit that's secretly making life harder.",
    chapterNumber: 4,
    chartInputs: ["saturn", "house-12", "major-aspects"],
  },

  {
    id: "love-patterns",
    order: 9,
    part: "part-one",
    pageType: "chapter",
    pageTheme: "warm",
    title: "Love Patterns",
    subtitle: "Why love keeps feeling so confusing.",
    chapterNumber: 5,
    chartInputs: ["venus", "mars", "house-5", "house-7"],
  },

  {
    id: "shadow",
    order: 10,
    part: "part-one",
    pageType: "chapter",
    pageTheme: "shadow",
    title: "Your Shadow",
    subtitle: "The habit that's secretly running your life.",
    chapterNumber: 6,
    chartInputs: ["pluto", "saturn", "house-12"],
  },

  {
    id: "growth-lesson",
    order: 11,
    part: "part-one",
    pageType: "chapter",
    pageTheme: "warm",
    title: "Your Growth Lesson",
    subtitle: "Life keeps teaching you this… until you finally listen.",
    chapterNumber: 7,
    chartInputs: ["saturn", "north-node", "chiron"],
  },

  {
    id: "career",
    order: 12,
    part: "part-one",
    pageType: "chapter",
    pageTheme: "elevated",
    title: "Your Work & Success Story",
    subtitle: "Where you're meant to shine.",
    chapterNumber: 8,
    chartInputs: ["midheaven", "saturn", "jupiter", "house-10"],
  },

  {
    id: "hidden-gift",
    order: 13,
    part: "part-one",
    pageType: "chapter",
    pageTheme: "elevated",
    title: "Your Hidden Gift",
    subtitle: "The thing you're underestimating about yourself.",
    chapterNumber: 9,
    chartInputs: ["jupiter", "sun", "major-aspects"],
  },

  {
    id: "safe-place",
    order: 14,
    part: "part-one",
    pageType: "chapter",
    pageTheme: "warm",
    title: "Your Safe Place",
    subtitle: "What your soul actually needs to feel at home.",
    chapterNumber: 10,
    chartInputs: ["moon", "ic", "house-2"],
  },

  {
    id: "life-story",
    order: 15,
    part: "part-one",
    pageType: "chapter",
    pageTheme: "night",
    title: "Your Life Story",
    subtitle: "If your life were a movie…",
    chapterNumber: 11,
    chartInputs: ["sun", "moon", "rising", "north-node", "major-aspects"],
  },

  /* ══════════════════════════════════════════════════════════════════
     PART II — YOUR STORY DOESN'T END HERE
     One static bridge + three compact chapters that consolidate what
     used to be ten separate transit sub-pages. Real transit data will
     replace the mock bodies once the transit engine ships; the chart
     inputs stay the same.
  ══════════════════════════════════════════════════════════════════ */

  {
    id: "transition-part-two",
    order: 16,
    part: "part-two",
    pageType: "transition",
    pageTheme: "night",
    title: "Your Story Doesn't End Here…",
    staticBody: `Everything you've read so far explains who you've always been.

But people aren't static.

We grow. We lose people. We change careers. We fall in love. We break. We heal.

Your birth chart stays the same.

Your current chapter doesn't.

Let's see what the sky is asking of you right now.`,
  },

  /* ─── Part II hero title ──────────────────────────────────────── */

  {
    id: "part-two-title",
    order: 18,
    part: "part-two",
    pageType: "part-title",
    pageTheme: "night",
    title: "Part II",
    subtitle: "Your Current Season",
  },

  {
    id: "transit-season",
    order: 17,
    part: "part-two",
    pageType: "chapter",
    pageTheme: "night",
    title: "You're Entering A Different Season",
    subtitle: "What wants to leave. What wants to enter.",
    chapterNumber: 1,
    chartInputs: ["current-transits", "saturn"],
  },
  {
    id: "transit-life-areas",
    order: 18,
    part: "part-two",
    pageType: "chapter",
    pageTheme: "warm",
    title: "Love, Career, Money — This Season",
    subtitle: "How the sky is moving through the areas of your life that matter most.",
    chapterNumber: 2,
    chartInputs: ["current-transits", "venus", "midheaven", "jupiter", "house-2"],
  },
  {
    id: "transit-timing",
    order: 19,
    part: "part-two",
    pageType: "chapter",
    pageTheme: "elevated",
    title: "Your Timing",
    subtitle: "The opportunity to take. The mistake to avoid. The window.",
    chapterNumber: 3,
    chartInputs: ["current-transits", "major-aspects"],
  },

  /* ══════════════════════════════════════════════════════════════════
     CLOSER
  ══════════════════════════════════════════════════════════════════ */

  {
    id: "final-note",
    order: 20,
    part: "closer",
    pageType: "closing",
    pageTheme: "night",
    title: "One Last Thing Before You Go…",
    staticBody: `You're not broken.

You're not behind.

You're just reading your life from the middle of the story instead of the ending.

Some of the things that frustrate you today are exactly the things that will make sense later.

So when you catch yourself wondering, "Why am I like this?" — come back here.

Because your chart has already answered that question.`,
  },

  /* ─── Farewell — final dark hero page ─────────────────────────── */

  {
    id: "farewell",
    order: 23,
    part: "closer",
    pageType: "farewell",
    pageTheme: "night",
    title: "Thank you.",
    subtitle: "We'll meet again.",
  },
] as const;

/**
 * All sections that will be rendered today. Excludes disabled Part II
 * pages. Order preserved.
 */
export const ACTIVE_BLUEPRINT_SECTIONS: readonly BlueprintSection[] =
  BIRTH_CHART_BLUEPRINT.filter((s) => !s.disabled);

/** Total AI-authored chapters that ship today. Feeds "Chapter N of M". */
export const TOTAL_ACTIVE_CHAPTERS = ACTIVE_BLUEPRINT_SECTIONS.filter(
  (s) => s.pageType === "chapter"
).length;
