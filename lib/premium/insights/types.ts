/**
 * lib/premium/insights/types.ts
 *
 * Reader Insight Map — shared types.
 *
 * Astrology calculations remain deterministic upstream (chart-calculator).
 * Signal extraction is deterministic (extractors.ts).
 * Interpretation is done ONCE by a small structured AI call, then validated
 * deterministically before it is allowed to influence the book.
 *
 * The AI never composes freely from the chart — it only composes psychology
 * from a supplied list of extracted signals. The validator enforces that.
 */

import type { SectionId } from "@/lib/premium/types";

/* ─────────────────────────────────────────────────────────────────────
   SIGNAL — deterministic chart fact produced by an extractor.
───────────────────────────────────────────────────────────────────── */

export type SignalKind =
  | "tight_aspect"
  | "angular_planet"
  | "element_balance"
  | "element_missing"
  | "modality_balance"
  | "modality_missing"
  | "personal_planet_placement"
  | "contradiction_sun_moon_element"
  | "contradiction_venus_mars_mode";

export interface Signal {
  /** Stable slug used as evidence reference. */
  readonly id: string;
  readonly kind: SignalKind;
  /** One-line human description shown to the AI interpreter. */
  readonly description: string;
  /** 0..1 confidence based on tightness / prominence / balance thresholds. */
  readonly strength: number;
  /** Structured metadata about the signal, used by validator + fallback. */
  readonly raw: Record<string, unknown>;
}

/* ─────────────────────────────────────────────────────────────────────
   INSIGHT — plain-language psychological pattern that survived validation.
───────────────────────────────────────────────────────────────────── */

export type InsightCategory =
  | "strength"
  | "shadow"
  | "pattern"
  | "gift"
  | "fear"
  | "desire"
  | "contradiction"
  | "restoration"
  | "growth-edge";

export type Domain =
  | "work"
  | "love"
  | "friendships"
  | "family"
  | "money"
  | "decisions"
  | "communication"
  | "routines"
  | "social-situations"
  | "private-thoughts"
  | "desire"
  | "conflict";

export type EmotionalTone =
  | "fiery"
  | "tender"
  | "protective"
  | "playful"
  | "vulnerable"
  | "hungry"
  | "quiet";

export interface ReaderInsight {
  /** Stable slug. AI-generated for AI-origin insights, hand-generated for fallback. */
  readonly id: string;
  /**
   * Plain-language conclusion, best-friend voice, no astrology vocabulary.
   * The whole product depends on this being human, not clinical.
   */
  readonly pattern: string;
  readonly evidence: {
    /** Primary signal ID this insight rests on. */
    readonly primary: string;
    /** Additional signal IDs that reinforce it. May be empty. */
    readonly supporting: readonly string[];
  };
  /** Overridden by our own scoring; the AI's number is never trusted. */
  readonly strength: number;
  readonly category: InsightCategory;
  /** Plausible territories — NOT mandatory scene templates. */
  readonly behavioralDomains: readonly Domain[];
  readonly emotionalTone: EmotionalTone;
  /**
   * Ranked chapter candidates for the scheduler. Best-fit first. The
   * scheduler is not required to honour this; it's a hint.
   */
  readonly bestChapters: readonly SectionId[];
  /**
   * How this insight came to be. Fallback insights are rule-derived from
   * signals when the AI interpreter fails/returns too few valid entries.
   */
  readonly origin: "ai" | "fallback";
  /**
   * Set by the scheduler. The chapter that OWNS the explanation of this
   * insight. Other chapters may reference the consequence but must not
   * re-explain it.
   */
  usedIn?: SectionId;
}

/* ─────────────────────────────────────────────────────────────────────
   COMPATIBILITY MATRIX — per SignalKind, what categories/domains/tones
   this signal can plausibly ground. Used by validator (primary check)
   and by fallback (rule keys).
───────────────────────────────────────────────────────────────────── */

export interface SignalKindMetadata {
  readonly compatibleCategories: readonly InsightCategory[];
  readonly compatibleDomains: readonly Domain[];
  readonly compatibleTones: readonly EmotionalTone[];
  /**
   * Small hand-authored list of concept anchors. Used as a CONFIDENCE
   * signal by the validator, NOT as a hard gate. An insight that lacks
   * anchor matches is not rejected on that basis alone.
   */
  readonly anchorKeywords: readonly string[];
}

/* ─────────────────────────────────────────────────────────────────────
   VALIDATION OUTCOME — what the validator returns to the orchestrator.
───────────────────────────────────────────────────────────────────── */

export type InsightRejectionReason =
  | "SIGNAL_ID_NOT_FOUND"
  | "CATEGORY_INCOMPATIBLE"
  | "DOMAIN_INCOMPATIBLE"
  | "TONE_INCOMPATIBLE"
  | "ASTROLOGY_VOCAB"
  | "STRUCTURAL_FAIL";

export interface InsightRejection {
  readonly insightId: string;
  readonly reason: InsightRejectionReason;
  readonly detail?: string;
}

export interface ValidationOutcome {
  readonly valid: readonly ReaderInsight[];
  readonly rejected: readonly InsightRejection[];
}

/* ─────────────────────────────────────────────────────────────────────
   CHAPTER PROFILE — per-chapter scheduler input.
───────────────────────────────────────────────────────────────────── */

export interface ChapterProfile {
  readonly section: SectionId;
  /** Categories this chapter naturally wants. Ordered by preference. */
  readonly wantsCategories: readonly InsightCategory[];
  /** Domains that fit the chapter's territory. Advisory only. */
  readonly domainPalette: readonly Domain[];
  /**
   * Target number of OWNED insights for this chapter. May be 0 for hook
   * chapters (which use previewCount instead — they preview but don't own).
   * Actual assigned count may be less if insight yield is low.
   */
  readonly targetInsightCount: number;
  /**
   * For hook chapters (kind === "hook"): number of PREVIEW references
   * to include. Preview references do not consume ownership — the
   * insight is still available to be owned/explained by a later chapter.
   */
  readonly previewCount?: number;
  /** Special-case flag for chapters with bespoke prompt scaffolding. */
  readonly kind: "standard" | "hook" | "climax";
  /**
   * When true, the scheduler must guarantee this chapter has at least
   * one owned insight, even if the strongest remaining insight is a
   * loose category fit. Set for the core Part I chapters that carry
   * the reader's core personalization.
   */
  readonly priority?: boolean;
}

/* ─────────────────────────────────────────────────────────────────────
   INSIGHT ASSIGNMENT — what the scheduler hands the prompt-builder.
───────────────────────────────────────────────────────────────────── */

export interface InsightAssignment {
  readonly insight: ReaderInsight;
  /**
   * "owns"                → this chapter explains the insight
   * "may-reference-consequence" → an earlier chapter owned it; this chapter
   *   may reference a NEW consequence only, must not re-explain
   * "transformed-arc"     → Life Story reframes an earlier insight as a
   *   protagonist beat
   * "preview"             → hook chapters (Before We Begin) tease/hint at
   *   the insight without explaining it; the insight is still available
   *   to be OWNED by a later chapter that will explain it fully
   */
  readonly kind: "owns" | "may-reference-consequence" | "transformed-arc" | "preview";
}

export interface ChapterAssignments {
  readonly assignments: Partial<Record<SectionId, InsightAssignment[]>>;
  /** Chapters that couldn't be filled to target count. Logged, not fatal. */
  readonly underfilled: readonly SectionId[];
}

/* ─────────────────────────────────────────────────────────────────────
   INSIGHT GENERATION STATUS — reported in telemetry + reading meta.
───────────────────────────────────────────────────────────────────── */

export type InsightGenerationStatus =
  | "normal"
  | "retry_recovered"
  | "fallback";
