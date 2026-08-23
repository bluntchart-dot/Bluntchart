/**
 * lib/premium/types.ts
 *
 * The single source of truth for the shape of a Premium Reading.
 *
 * These types intentionally live in isolation from the live website — every
 * layer of the Premium engine (Product / Astrology / AI / Rendering) reads
 * from this file and nothing else.
 *
 * Any change to the shape of a stored PremiumReading MUST bump the
 * READING_VERSION constant below so renderers can degrade gracefully for
 * older stored readings.
 */

import type { ChartData } from "@/lib/types";

/* ─────────────────────────────────────────────────────────────────────
   VERSION — bumped by hand whenever the shape of PremiumReading changes.
───────────────────────────────────────────────────────────────────── */

export const READING_VERSION = "premium-1.0.0" as const;

/* ─────────────────────────────────────────────────────────────────────
   PRODUCT REGISTRY
   Multiple reading products (birth-chart, compatibility, year-ahead …)
   plug in by adding to this union and to the products/registry.ts file.
───────────────────────────────────────────────────────────────────── */

export type ReadingProduct =
  | "birth-chart"
  | "in-depth-reading"
  | "compatibility"     // reserved, not implemented
  | "year-ahead"        // reserved, not implemented
  | "gift-reading";     // reserved, not implemented

/* ─────────────────────────────────────────────────────────────────────
   SECTION IDENTITY
   Every page/section has a stable id. Adding or removing = code change,
   never a silent drift. Keep this union in the same order as the reader
   experience.
───────────────────────────────────────────────────────────────────── */

export type SectionId =
  // Part I — static intro
  | "cover"
  | "part-one-title"
  | "welcome"
  | "natal-chart"
  | "how-we-read-your-chart"
  | "before-we-begin"
  // Part I — AI chapters
  | "real-you"
  | "inner-fighter"
  | "blind-spot"
  | "love-patterns"
  | "shadow"
  | "growth-lesson"
  | "career"
  | "mask-vs-real"
  | "pattern"
  | "hidden-gift"
  | "safe-place"
  | "life-story"
  // Part II — declared for future transit engine, NOT rendered today
  | "part-two-title"
  | "transition-part-two"
  | "transit-intro"
  | "transit-why-different"
  | "transit-lesson-returning"
  | "transit-what-leaves"
  | "transit-what-enters"
  | "transit-love"
  | "transit-career"
  | "transit-money"
  | "transit-opportunity"
  | "transit-mistake"
  | "transit-timing"
  | "transit-season"
  | "transit-life-areas"
  // In-Depth Reading — Part I chapters
  | "who-you-are"
  | "purpose-and-destiny"
  | "career-and-success"
  | "love-and-relationships"
  | "money-and-wealth"
  | "growth-and-wellbeing"
  // In-Depth Reading — Part II chapters
  | "whats-happening-now"
  | "when-does-it-get-better"
  | "whats-coming-next"
  // In-Depth Reading — closer
  | "takeaways"
  // Closer
  | "farewell"
  | "final-note";

/**
 * Which part of the book a page belongs to.
 * The reader UI groups pages by part for the progress header.
 */
export type Part = "part-one" | "part-two" | "closer";

/**
 * The visual archetype of a page. The renderer picks a layout based on this.
 * Adding a new kind = code change in every renderer that cares.
 */
export type PageType =
  | "cover"           // brand + reader name + reading time
  | "welcome"         // gentle intro copy
  | "chart"           // natal chart wheel + big three
  | "education"       // "How we read your chart" style explainer
  | "part-title"      // big dark hero page announcing a Part
  | "chapter"         // AI-authored body under a fixed title
  | "transition"      // static bridge between parts
  | "closing"         // final reflective note
  | "farewell";       // signed-off "thank you, see you again" page

/**
 * A visual/emotional theme hint. The renderer may map these to background
 * treatments, accent colors, or reading-mode variants. Ignore-able —
 * every renderer has a sane default.
 */
export type PageTheme =
  | "neutral"
  | "warm"       // warmer palette, e.g. for love / safe place
  | "shadow"     // deeper palette, e.g. for shadow / blind spot
  | "elevated"   // brighter, e.g. for hidden gift / life story
  | "night";     // deep-space feel for cover / closing

/* ─────────────────────────────────────────────────────────────────────
   CHART INPUTS
   Closed union of every placement / structure a section can reference.
   Guarantees no silent drift between blueprint / built-using / prompt.
───────────────────────────────────────────────────────────────────── */

export type ChartInput =
  | "sun" | "moon" | "rising"
  | "venus" | "mars" | "mercury" | "jupiter" | "saturn" | "pluto"
  | "north-node" | "south-node" | "chiron"
  | "midheaven" | "ic"
  | "house-2" | "house-5" | "house-7" | "house-10" | "house-12"
  | "major-aspects"
  | "current-transits";

/* ─────────────────────────────────────────────────────────────────────
   BLUEPRINT SECTION — static description of one page in the product.
   Blueprint entries never contain any per-user content.
───────────────────────────────────────────────────────────────────── */

export interface BlueprintSection {
  readonly id: SectionId;
  readonly order: number;
  readonly part: Part;
  readonly pageType: PageType;
  readonly pageTheme: PageTheme;
  readonly title: string;
  readonly subtitle?: string;

  /**
   * Static prose for pages the AI never touches (cover, welcome,
   * transitions, closer, education pages). Ignored for `chapter` pages
   * whose bodies come from the AI (or mock content in preview mode).
   */
  readonly staticBody?: string;

  /**
   * Which placements this section draws on. Drives:
   *   - Built Using card generation (built-using.ts)
   *   - The chart context slice fed to Claude (chart-context.ts)
   */
  readonly chartInputs?: readonly ChartInput[];

  /**
   * If true, the section is intentionally omitted from generation AND
   * rendering. Used today for Part II transit pages, which are declared
   * in the blueprint so the product structure is complete but disabled
   * until the transit engine ships.
   */
  readonly disabled?: boolean;

  /**
   * Optional chapter number within the AI-chapter sequence. Used by the
   * subtle "Chapter X of N" progress header on chapter pages.
   */
  readonly chapterNumber?: number;
}

/* ─────────────────────────────────────────────────────────────────────
   SECTION GUIDELINE — private direction for the AI writer.
   Never exposed to users. Never included in the rendered book.
───────────────────────────────────────────────────────────────────── */

/**
 * The OPENING MOVE of a chapter — the shape of the first few sentences
 * only, never the genre of the whole chapter. The rest of every chapter
 * continues in the book's single continuous voice.
 *
 * (Repurposed from the earlier per-chapter genre palette. The old palette
 * asked each chapter to be a fresh performance, which is what made the
 * book read like fourteen essays instead of one conversation.)
 *
 * The master prompt enforces variety: the same move never appears in two
 * consecutive chapters, and the specific execution differs even when the
 * same move recurs across the book.
 */
export type NarrativeForm =
  | "confession"      // you admit something on the reader's behalf they haven't said out loud
  | "scene"           // a small concrete moment, three or four sentences, present tense
  | "guess"           // a small specific guess about their day or their week
  | "observation"     // you name a tiny recurring habit of theirs, plainly
  | "quiet-question"  // a whispered question, not asked for an answer
  | "challenge"       // a friendly dare the reader can't help checking
  | "dialogue"        // a two-voice exchange (brain/heart, you-then/you-now, you-them)
  | "memory";         // a specific kind of moment from their life without naming which one

export interface SectionGuideline {
  readonly id: SectionId;
  readonly narrativeForm: NarrativeForm;
  readonly emotionalObjective: string;
  readonly tone: string;
  readonly desiredReaderFeeling: string;
  readonly writingStyle: string;
  readonly approxWords: readonly [number, number];
  readonly transitionGoal: string;
  readonly astrologyInputs: readonly ChartInput[];
}

/* ─────────────────────────────────────────────────────────────────────
   BUILT USING — trust card populated by the app, never by the AI.
───────────────────────────────────────────────────────────────────── */

export interface BuiltUsingItem {
  /** A short glyph shown on the card. Emoji or astrology symbol. */
  readonly symbol: string;
  /** The placement label, e.g. "Sun in Aries (14°)" or "Sun trine Jupiter". */
  readonly label: string;
  /** One line explaining what this placement contributes to the section. */
  readonly meaning: string;
}

/* ─────────────────────────────────────────────────────────────────────
   RENDER HINTS — optional metadata for renderers.
   Any renderer may ignore any hint. Adding new hints does not require a
   blueprint version bump because they are all optional.
───────────────────────────────────────────────────────────────────── */

export interface RenderHints {
  readonly pageBackground?: "starfield" | "gradient" | "plain" | "warm-glow";
  readonly transitionIn?: "fade" | "slide" | "none";
  readonly pullQuote?: string;
  /** For chapter pages: the "N of M" position label the reader may see. */
  readonly progressLabel?: string;
}

/* ─────────────────────────────────────────────────────────────────────
   RENDERED SECTION — one entry in the final PremiumReading.sections[].
───────────────────────────────────────────────────────────────────── */

export interface RenderedSection {
  readonly id: SectionId;
  readonly order: number;
  readonly part: Part;
  readonly pageType: PageType;
  readonly pageTheme: PageTheme;
  readonly title: string;
  readonly subtitle?: string;

  /**
   * The full body text for this page.
   *   - Static pages: exactly the blueprint's staticBody.
   *   - Chapter pages: the AI-generated (or mock) narrative body.
   * May contain paragraph breaks as double newlines. Never contains
   * headings — those live in `title` / `subtitle`.
   */
  readonly body: string;

  readonly builtUsing?: readonly BuiltUsingItem[];
  readonly renderHints?: RenderHints;

  /** Chapter number for the "Chapter N of M" strip on chapter pages. */
  readonly chapterNumber?: number;
}

/* ─────────────────────────────────────────────────────────────────────
   PREMIUM READING — the object every renderer consumes.
───────────────────────────────────────────────────────────────────── */

export interface PremiumReadingMeta {
  readonly readingVersion: string;   // e.g. "premium-1.0.0"
  readonly product: ReadingProduct;

  readonly name: string;
  readonly dob: string;
  readonly birthTime: string;
  readonly birthPlace: string;

  /** ISO timestamp when the object was assembled. */
  readonly generatedAt: string;

  /** Rounded minutes, shown on the cover ("about 32 min"). */
  readonly estimatedReadingMinutes: number;

  /** Total AI-authored chapters — feeds the progress header. */
  readonly totalChapters: number;

  /**
   * How this reading was produced. Lets the UI or future analytics tell
   * mock previews apart from real Claude generations.
   */
  readonly generationSource: "mock" | "haiku" | "sonnet" | "opus" | "unknown";

  /* ─── V1.2 additions (all optional so old stored readings still parse) ─ */

  /** Product code + semver, e.g. "birth-chart-1.1.0". */
  readonly productVersion?: string;
  /** Insight engine semver — bumped when insight extraction changes. */
  readonly insightEngineVersion?: string;
  /** Prompt hash — auto-changes if SYSTEM_PROMPT edits. */
  readonly promptVersion?: string;
  /** Blueprint hash — auto-changes if blueprint edits. */
  readonly blueprintVersion?: string;
  /** Model identifier used to write the book. */
  readonly modelId?: string;
  /** Provider identifier ("anthropic" today). */
  readonly provider?: string;
  /** Opaque idempotency key chosen by the caller. */
  readonly generationRequestId?: string;
  /**
   * How the insight map came to exist. "fallback" is set when the AI
   * interpreter failed and the deterministic rule-table was used.
   */
  readonly insightGenerationStatus?: "normal" | "retry_recovered" | "fallback";
  /** Whether QA passed clean, regenerated, or shipped with warnings. */
  readonly qaOutcome?: "clean" | "regenerated" | "shipped_with_warnings";
}

/**
 * Debug metadata — never rendered in the UI. Persisted so a reading can
 * be inspected later (customer support / quality audit) without needing
 * to regenerate or reinterpret anything.
 */
export interface PremiumReadingDebug {
  /** The insight map that fed generation. */
  readonly insightMap?: unknown;
  /** Chapter → insight IDs assigned. */
  readonly chapterAssignments?: Record<string, string[]>;
  /** QA flags produced during generation. */
  readonly qaFlags?: unknown;
  /** Full generation telemetry snapshot. */
  readonly telemetry?: unknown;
}

export interface PremiumReading {
  readonly meta: PremiumReadingMeta;
  readonly chart: ChartData;
  readonly sections: readonly RenderedSection[];
  readonly debug?: PremiumReadingDebug;
}
