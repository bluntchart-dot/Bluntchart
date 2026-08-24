/**
 * In-Depth Birth Chart + Transit Reading — Blueprint
 *
 * Transit-first structure:
 *   Part I  — Your Current Season (3 transit chapters)
 *   Part II — Your Birth Chart (6 natal chapters)
 *   Closer  — Takeaways + static closing + farewell
 *
 * Total: 10 AI-authored sections.
 *
 * The reader experience: hook with "how does it know what's happening?"
 * → timing/relief → forward look → deep birth chart context → takeaways.
 *
 * The AI never touches these values. Every renderer walks this list
 * in `order` and asks the renderer for each page what to do based
 * on `pageType`.
 *
 * NEVER put prompt engineering here. Prompt fragments live in
 * prompt-fragments.ts and per-chapter direction in guidelines.ts.
 */

import type { BlueprintSection } from "@/lib/premium/types";

export const HOW_WE_READ_EXPLAINER = `No, this isn't based on your zodiac sign alone.

Your reading comes from the exact position of every planet, every house, and every degree at the moment you were born, combined with the transits affecting your chart right now.

Think of your birth chart as a snapshot of the sky the second you entered the world. Transits are the sky today, pressing against that snapshot.

Every section you're about to read combines different parts of that blueprint to explain one area of your life, why it feels the way it does right now, and what's developing next.`;

export const CHAPTER_BUILT_USING_TABLE = [
  /* ── Part I — Current Season ────────────────────────── */
  { icon: "🌙", chapter: "What's Happening Now",      builtUsing: "Current Transits • Saturn • Pluto" },
  { icon: "🌤️", chapter: "When Does It Get Better?",  builtUsing: "Jupiter & Venus Transits • Progressed Moon" },
  { icon: "⏳", chapter: "What's Coming Next",         builtUsing: "Upcoming Transits • Major Aspects" },
  /* ── Part II — Birth Chart ──────────────────────────── */
  { icon: "🌞", chapter: "Who You Are",              builtUsing: "Sun • Moon • Rising • Mercury" },
  { icon: "🎯", chapter: "Purpose & Destiny",         builtUsing: "North Node • Saturn • Chiron • Sun" },
  { icon: "💼", chapter: "Career & Success",           builtUsing: "Midheaven • Saturn • Jupiter • 10th House" },
  { icon: "❤️", chapter: "Love & Relationships",      builtUsing: "Venus • Mars • Moon • 5th & 7th Houses" },
  { icon: "💰", chapter: "Money & Wealth",             builtUsing: "Jupiter • 2nd House • Venus • Saturn" },
  { icon: "🌱", chapter: "Growth & Well-being",       builtUsing: "Saturn • Pluto • 12th House • Chiron" },
] as const;

/* ─────────────────────────────────────────────────────────────────────
   BLUEPRINT
   Ordered exactly as the reader will experience the reading.
───────────────────────────────────────────────────────────────────── */

export const IN_DEPTH_READING_BLUEPRINT: readonly BlueprintSection[] = [
  /* ══════════════════════════════════════════════════════════════════
     OPENING
  ══════════════════════════════════════════════════════════════════ */

  {
    id: "cover",
    order: 1,
    part: "part-one",
    pageType: "cover",
    pageTheme: "night",
    title: "Your Reading",
    subtitle: "What your chart reveals. Why your life feels this way. What's next.",
  },

  {
    id: "welcome",
    order: 2,
    part: "part-one",
    pageType: "welcome",
    pageTheme: "neutral",
    title: "Welcome",
    subtitle: "Before we begin.",
    staticBody: `This is not a horoscope. It's not a personality quiz.

This reading was built from the exact position of every planet at the moment you were born, combined with the transits moving through your chart right now.

We're starting with what's happening in your life right now — the part you'll recognise immediately. Then we'll go deeper into why you are the way you are, and what it all means for what's coming next.

Some parts will make you pause. Those are usually the ones you needed most.

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

  /* ══════════════════════════════════════════════════════════════════
     PART I — YOUR CURRENT SEASON
  ══════════════════════════════════════════════════════════════════ */

  {
    id: "part-one-title",
    order: 5,
    part: "part-one",
    pageType: "part-title",
    pageTheme: "night",
    title: "Part I",
    subtitle: "Your Current Season",
  },

  {
    id: "whats-happening-now",
    order: 6,
    part: "part-one",
    pageType: "chapter",
    pageTheme: "night",
    title: "What's Happening Now",
    subtitle: "Why your life feels the way it does right now, and what's actually being activated.",
    chapterNumber: 1,
    chartInputs: ["current-transits", "saturn", "pluto"],
  },

  {
    id: "when-does-it-get-better",
    order: 7,
    part: "part-one",
    pageType: "chapter",
    pageTheme: "warm",
    title: "When Does It Get Better?",
    subtitle: "When the pressure eases, which area improves first, and what relief actually looks like for you.",
    chapterNumber: 2,
    chartInputs: ["current-transits", "jupiter", "venus"],
  },

  {
    id: "whats-coming-next",
    order: 8,
    part: "part-one",
    pageType: "chapter",
    pageTheme: "elevated",
    title: "What's Coming Next",
    subtitle: "The opportunities approaching, the changes to prepare for, and the windows that matter.",
    chapterNumber: 3,
    chartInputs: ["current-transits", "major-aspects"],
  },

  /* ══════════════════════════════════════════════════════════════════
     PART II — YOUR BIRTH CHART
  ══════════════════════════════════════════════════════════════════ */

  {
    id: "transition-part-two",
    order: 9,
    part: "part-two",
    pageType: "transition",
    pageTheme: "night",
    title: "Now Let's Talk About Why.",
    staticBody: `Everything you just read explains what's happening in your life right now.

But it doesn't explain why you respond the way you do. Why you keep choosing the same patterns. Why certain things hit you harder than they hit other people.

That's your birth chart.

The transits are the weather. Your birth chart is the landscape the weather moves across.

Let's look at the landscape.`,
  },

  {
    id: "part-two-title",
    order: 10,
    part: "part-two",
    pageType: "part-title",
    pageTheme: "night",
    title: "Part II",
    subtitle: "Your Birth Chart",
  },

  {
    id: "who-you-are",
    order: 11,
    part: "part-two",
    pageType: "chapter",
    pageTheme: "elevated",
    title: "Who You Are",
    subtitle: "Your hidden strengths, your real flaws, and the version of you most people never get to see.",
    chapterNumber: 1,
    chartInputs: ["sun", "moon", "rising", "mercury"],
  },

  {
    id: "purpose-and-destiny",
    order: 12,
    part: "part-two",
    pageType: "chapter",
    pageTheme: "warm",
    title: "Purpose & Destiny",
    subtitle: "What you were built for, and the lesson life keeps circling back to teach you.",
    chapterNumber: 2,
    chartInputs: ["north-node", "saturn", "chiron", "sun"],
  },

  {
    id: "career-and-success",
    order: 13,
    part: "part-two",
    pageType: "chapter",
    pageTheme: "elevated",
    title: "Career & Success",
    subtitle: "Where your natural talent actually fits, and what success looks like when you stop copying everyone else's version.",
    chapterNumber: 3,
    chartInputs: ["midheaven", "saturn", "jupiter", "house-10"],
  },

  {
    id: "love-and-relationships",
    order: 14,
    part: "part-two",
    pageType: "chapter",
    pageTheme: "warm",
    title: "Love, Relationships & Intimacy",
    subtitle: "How you love, how you need to be loved, and why it keeps going the way it goes.",
    chapterNumber: 4,
    chartInputs: ["venus", "mars", "moon", "house-5", "house-7"],
  },

  {
    id: "money-and-wealth",
    order: 15,
    part: "part-two",
    pageType: "chapter",
    pageTheme: "elevated",
    title: "Money & Wealth",
    subtitle: "Your natural relationship with money, and the wealth path your chart actually supports.",
    chapterNumber: 5,
    chartInputs: ["jupiter", "house-2", "venus", "saturn"],
  },

  {
    id: "growth-and-wellbeing",
    order: 16,
    part: "part-two",
    pageType: "chapter",
    pageTheme: "shadow",
    title: "Growth & Emotional Well-being",
    subtitle: "Your blind spots, your emotional patterns, and what actually brings you peace.",
    chapterNumber: 6,
    chartInputs: ["saturn", "pluto", "house-12", "chiron", "moon"],
  },

  /* ══════════════════════════════════════════════════════════════════
     CLOSER
  ══════════════════════════════════════════════════════════════════ */

  {
    id: "takeaways",
    order: 17,
    part: "closer",
    pageType: "chapter",
    pageTheme: "elevated",
    title: "What To Do With All of This",
    subtitle: "The short version. What matters, what to stop, what to start, and what to look forward to.",
    chapterNumber: 7,
  },

  {
    id: "final-note",
    order: 18,
    part: "closer",
    pageType: "closing",
    pageTheme: "night",
    title: "One Last Thing.",
    staticBody: `You're not broken.

You're not behind.

You're reading your life from the middle of the story instead of the ending.

Some of the things that frustrate you today are exactly the things that will make sense later.

When you catch yourself wondering, "Why am I like this?" — come back here.

Your chart already answered that question.`,
  },

  {
    id: "farewell",
    order: 19,
    part: "closer",
    pageType: "farewell",
    pageTheme: "night",
    title: "Thank you.",
    subtitle: "We'll meet again.",
  },
] as const;

export const ACTIVE_BLUEPRINT_SECTIONS: readonly BlueprintSection[] =
  IN_DEPTH_READING_BLUEPRINT.filter((s) => !s.disabled);

export const TOTAL_ACTIVE_CHAPTERS = ACTIVE_BLUEPRINT_SECTIONS.filter(
  (s) => s.pageType === "chapter"
).length;
