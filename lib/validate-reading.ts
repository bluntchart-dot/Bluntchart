/**
 * validate-reading.ts
 *
 * Server-side validation for a generated reading. Catches generations where
 * the model misses a beat, ships a thin section, sneaks in an em-dash,
 * or forgets a verbatim quote.
 *
 * USAGE (manual):
 *   const reading = await generateFullReading(birth, chart, focusArea);
 *   if (!reading) { ... handle null ... }
 *   const result = validateReading(reading, focusArea);
 *   if (!result.ok) console.warn(result.issues);
 *
 * USAGE (auto-retry):
 *   const { reading, validation, attempts } =
 *     await generateFullReadingValidated(birth, chart, focusArea);
 *   if (!reading) { ... API call failed, dbError already logged ... }
 */

import { dbError } from "@/lib/db/log";
import type { BirthData, ChartData } from "./types";
import {
  generateFullReading,
  FullReading,
  PaidInsight,
} from "./reading-tool";
import {
  normalizeFocusArea,
  expectedPaidInsightCount,
  AlreadyRevealedInsight,
  FOCUS_SPEC,
} from "./claude-prompt";

/* ═════════════════════════════════════════════════════════════════
   CONFIG. Tune these floors to taste.
═════════════════════════════════════════════════════════════════ */

const MIN_WORDS_PER_INSIGHT = 220;
const SATURN_MIN_WORDS = 250;
const CLOSER_MIN_WORDS = 300;
const FOCUS_DEEP_DIVE_MIN_WORDS = 350;

// Target length for the shareable card's flex line (its only rendered
// content). Below the floor it's rejected outright; outside the target
// window it's a warning so a slightly long flex doesn't burn a retry.
const FLEX_LINE_MIN_WORDS = 12;
const FLEX_LINE_TARGET_MIN_WORDS = 18;
const FLEX_LINE_TARGET_MAX_WORDS = 25;

const VOICE_ANCHORS = [
  "i know", "honestly", "listen", "babe", "trust me", "okay so",
  "you know", "look,", "real talk", "i need you to", "i am not",
];

/* ═════════════════════════════════════════════════════════════════
   TYPES
═════════════════════════════════════════════════════════════════ */

export interface ValidationIssue {
  section: string;
  field: string;
  problem: string;
  severity: "fatal" | "warning";
}

export interface ValidationResult {
  ok: boolean;
  issues: ValidationIssue[];
  metrics: {
    totalWords: number;
    paidInsightCount: number;
    expectedPaidInsightCount: 8 | 9;
    perSectionWords: number[];
    hasEmDashes: boolean;
    hasEnDashes: boolean;
  };
}

/* ═════════════════════════════════════════════════════════════════
   HELPERS
═════════════════════════════════════════════════════════════════ */

function wordCount(s: string): number {
  if (!s) return 0;
  return s.trim().split(/\s+/).length;
}

function hasEmDash(s: string): boolean {
  return /\u2014/.test(s);
}

function hasEnDash(s: string): boolean {
  return /\u2013/.test(s);
}

function hasVerbatimQuote(s: string): boolean {
  const matches = s.match(/["\u201C\u201D]([^"\u201C\u201D]{8,})["\u201C\u201D]/g);
  if (!matches) return false;
  return matches.some((m) => wordCount(m) >= 3);
}

function hasVoiceAnchor(s: string): boolean {
  const lower = s.toLowerCase();
  return VOICE_ANCHORS.some((a) => lower.includes(a));
}

function isFirstPersonFlex(s: string): boolean {
  const lower = s.toLowerCase().trim();
  return (
    lower.startsWith("i ") ||
    lower.startsWith("i'") ||
    lower.startsWith("if i ") ||
    lower.startsWith("my ") ||
    /\bi am\b|\bi do not\b|\bi don't\b|\bi will\b|\bi keep\b|\bi'm\b/.test(lower)
  );
}

// Derived from FOCUS_SPEC titles (single source of truth) instead of a
// hardcoded string list, so renaming/adding a focus area can't silently
// desync this check from what the model is actually asked to title it.
const FOCUS_DEEP_DIVE_TITLES = new Set(
  Object.values(FOCUS_SPEC).map((s) => s.title.toLowerCase())
);

function isFocusDeepDive(insight: PaidInsight): boolean {
  return FOCUS_DEEP_DIVE_TITLES.has((insight.planet ?? "").toLowerCase());
}

/* ═════════════════════════════════════════════════════════════════
   PER-FIELD VALIDATORS
═════════════════════════════════════════════════════════════════ */

function validateInsight(
  insight: PaidInsight,
  index: number,
  issues: ValidationIssue[]
): number {
  const label = `paidInsights[${index}] (${(insight.planet ?? "?").slice(0, 40)})`;
  const explain = insight.explain ?? "";
  const wc = wordCount(explain);

  const planetLower = (insight.planet ?? "").toLowerCase();
  let minWords = MIN_WORDS_PER_INSIGHT;
  let sectionLabel = "standard";

  if (planetLower.includes("saturn")) {
    minWords = SATURN_MIN_WORDS;
    sectionLabel = "saturn";
  }
  if (planetLower.includes("full picture") || planetLower.includes("right now")) {
    minWords = CLOSER_MIN_WORDS;
    sectionLabel = "closer";
  }
  if (isFocusDeepDive(insight)) {
    minWords = FOCUS_DEEP_DIVE_MIN_WORDS;
    sectionLabel = "focus deep-dive";
  }

  if (wc < minWords) {
    issues.push({
      section: label,
      field: "explain",
      problem: `Too short for ${sectionLabel}: ${wc} words. Required: ${minWords}+.`,
      severity: "fatal",
    });
  }

  if (!hasVerbatimQuote(explain)) {
    issues.push({
      section: label,
      field: "explain",
      problem: "Missing verbatim internal monologue (beat 2). Need at least one quoted line of 3+ words.",
      severity: "fatal",
    });
  }

  if (!hasVoiceAnchor(explain)) {
    issues.push({
      section: label,
      field: "explain",
      problem: "Missing voice anchor (no 'I know' / 'listen' / 'honestly' etc). Voice may have flattened.",
      severity: "warning",
    });
  }

  if (hasEmDash(explain) || hasEnDash(explain)) {
    issues.push({
      section: label,
      field: "explain",
      problem: "Contains em-dash or en-dash. Punctuation law violated.",
      severity: "fatal",
    });
  }

  if (!insight.truth || insight.truth.length < 20) {
    issues.push({
      section: label,
      field: "truth",
      problem: "Truth field missing or too short.",
      severity: "fatal",
    });
  }

  // The focus deep-dive deliberately has no action/"this week" field —
  // it ends on the reframe, not an assignment.
  if (!isFocusDeepDive(insight) && (!insight.action || insight.action.length < 15)) {
    issues.push({
      section: label,
      field: "action",
      problem: "Action field missing or too short.",
      severity: "fatal",
    });
  }

  return wc;
}

function validateShareCard(card: any, issues: ValidationIssue[]): void {
  const flex = (card?.flexLine || card?.line1 || "").trim();
  const flexWords = wordCount(flex);

  if (!flex || flexWords < FLEX_LINE_MIN_WORDS) {
    issues.push({
      section: "shareCard",
      field: "flexLine",
      problem: `Flex line missing or too short (${flexWords} words, need ${FLEX_LINE_MIN_WORDS}+).`,
      severity: "fatal",
    });
    return;
  }

  if (flexWords < FLEX_LINE_TARGET_MIN_WORDS || flexWords > FLEX_LINE_TARGET_MAX_WORDS) {
    issues.push({
      section: "shareCard",
      field: "flexLine",
      problem: `Flex line is ${flexWords} words, target is ${FLEX_LINE_TARGET_MIN_WORDS} to ${FLEX_LINE_TARGET_MAX_WORDS}.`,
      severity: "warning",
    });
  }

  if (!isFirstPersonFlex(flex)) {
    issues.push({
      section: "shareCard",
      field: "flexLine",
      problem: "Flex line is not first-person. Should sound like the user posting it about themselves.",
      severity: "warning",
    });
  }

  if (hasEmDash(flex) || hasEnDash(flex)) {
    issues.push({
      section: "shareCard",
      field: "flexLine",
      problem: "Contains em-dash or en-dash.",
      severity: "fatal",
    });
  }
}

/* ═════════════════════════════════════════════════════════════════
   PUBLIC: validateReading
═════════════════════════════════════════════════════════════════ */

export function validateReading(
  reading: FullReading,
  focusArea?: string | null
): ValidationResult {
  const issues: ValidationIssue[] = [];
  const perSectionWords: number[] = [];
  const expected = expectedPaidInsightCount(focusArea);
  const focusKey = normalizeFocusArea(focusArea);

  if (!reading.letter_opener || reading.letter_opener.length < 30) {
    issues.push({
      section: "root",
      field: "letter_opener",
      problem: "Missing or too short.",
      severity: "fatal",
    });
  }

  if (!Array.isArray(reading.preview) || reading.preview.length !== 2) {
    issues.push({
      section: "root",
      field: "preview",
      problem: `Expected 2 preview insights, got ${reading.preview?.length ?? 0}.`,
      severity: "fatal",
    });
  }

  const paidCount = reading.paidInsights?.length ?? 0;
  if (paidCount !== expected) {
    issues.push({
      section: "root",
      field: "paidInsights",
      problem: `Expected ${expected} paid insights (focusArea=${focusKey ?? "none"}), got ${paidCount}.`,
      severity: "fatal",
    });
  }

  (reading.paidInsights ?? []).forEach((insight, i) => {
    perSectionWords.push(validateInsight(insight, i, issues));
  });

  if (focusKey) {
    const hasDeepDive = (reading.paidInsights ?? []).some(isFocusDeepDive);
    if (!hasDeepDive) {
      issues.push({
        section: "root",
        field: "paidInsights",
        problem: `Focus area "${focusKey}" requested but deep-dive section is missing.`,
        severity: "fatal",
      });
    }
  }

  validateShareCard(reading.shareCard, issues);

  const fullText = JSON.stringify(reading);
  const globalEm = hasEmDash(fullText);
  const globalEn = hasEnDash(fullText);

  const totalWords = perSectionWords.reduce((a, b) => a + b, 0);
  const fatalIssues = issues.filter((i) => i.severity === "fatal");

  return {
    ok: fatalIssues.length === 0,
    issues,
    metrics: {
      totalWords,
      paidInsightCount: paidCount,
      expectedPaidInsightCount: expected,
      perSectionWords,
      hasEmDashes: globalEm,
      hasEnDashes: globalEn,
    },
  };
}

/* ═════════════════════════════════════════════════════════════════
   PUBLIC: generateFullReadingValidated
   Returns reading=null if API call failed entirely (dbError already logged).
   Returns reading with validation.ok=false if API call succeeded but
   the content failed validation after all retries.
═════════════════════════════════════════════════════════════════ */

export interface ValidatedReadingResult {
  reading: FullReading | null;
  validation: ValidationResult | null;
  attempts: number;
}

export async function generateFullReadingValidated(
  birth: BirthData,
  chart: ChartData,
  focusArea?: string | null,
  options: { maxRetries?: number } = {},
  existingPreview?: AlreadyRevealedInsight[] | null
): Promise<ValidatedReadingResult> {
  const maxRetries = options.maxRetries ?? 1;

  let attempts = 0;
  let lastReading: FullReading | null = null;
  let lastValidation: ValidationResult | null = null;

  while (attempts <= maxRetries) {
    attempts++;
    const reading = await generateFullReading(birth, chart, focusArea, existingPreview);

    // API call failed entirely. dbError already logged inside generateFullReading.
    // Retry once in case it was transient.
    if (!reading) {
      if (attempts > maxRetries) {
        return { reading: null, validation: null, attempts };
      }
      continue;
    }

    const validation = validateReading(reading, focusArea);
    lastReading = reading;
    lastValidation = validation;

    if (validation.ok) {
      return { reading, validation, attempts };
    }

    dbError(
      "validate-reading",
      `Attempt ${attempts} failed validation`,
      validation.issues
        .map((i) => `${i.section}/${i.field}: ${i.problem}`)
        .join(" | "),
      { focusArea: focusKeyOrNull(focusArea), attempts }
    );
  }

  // Out of retries. Ship the last attempt. Caller decides what to do.
  return {
    reading: lastReading,
    validation: lastValidation,
    attempts,
  };
}

function focusKeyOrNull(focusArea?: string | null): string {
  return normalizeFocusArea(focusArea) ?? "none";
}