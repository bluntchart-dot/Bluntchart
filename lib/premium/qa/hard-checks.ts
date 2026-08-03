/**
 * lib/premium/qa/hard-checks.ts
 *
 * Structural / correctness QA. Any HARD flag is treated as a real bug
 * in the generated chapter — the orchestrator will regenerate that
 * chapter (bounded), and if >3 chapters hard-fail after regeneration
 * the whole generation FAILS (per approved plan). A paid customer is
 * never knowingly delivered a structurally invalid reading.
 *
 * Hard categories:
 *   - EMPTY_BODY              chapter body missing or whitespace-only
 *   - DUPLICATED_BODY         two chapter bodies are identical / near-identical
 *   - ASTROLOGY_LEAKAGE       excessive placement mentions (>2 per chapter)
 *   - APHORISM_CLOSER         chapter ends on a banned aphorism
 *   - MALFORMED_STRUCTURE     paragraphs missing, or single-line output
 */

import type { SectionId } from "@/lib/premium/types";
import { APHORISM_PATTERNS, ASTROLOGY_VOCAB } from "@/lib/premium/insights/signals";

export type HardFlagReason =
  | "EMPTY_BODY"
  | "DUPLICATED_BODY"
  | "ASTROLOGY_LEAKAGE"
  | "APHORISM_CLOSER"
  | "MALFORMED_STRUCTURE";

export interface HardFlag {
  readonly section: SectionId;
  readonly reason: HardFlagReason;
  readonly detail: string;
}

const ASTROLOGY_REGEX = new RegExp(
  `\\b(${ASTROLOGY_VOCAB.map(escapeRegExp).join("|")})\\b`,
  "gi"
);

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface ChapterUnderReview {
  readonly section: SectionId;
  readonly body: string;
}

function normalisedForDupeCheck(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

function shingles(s: string, size = 6): Set<string> {
  const tokens = normalisedForDupeCheck(s).split(" ");
  const out = new Set<string>();
  for (let i = 0; i <= tokens.length - size; i++) {
    out.add(tokens.slice(i, i + size).join(" "));
  }
  return out;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  const union = a.size + b.size - inter;
  return union === 0 ? 0 : inter / union;
}

/**
 * Run all hard checks across the book. Returns all flags found.
 * Duplicate-body check runs across pairs; other checks per chapter.
 */
export function runHardChecks(
  chapters: readonly ChapterUnderReview[]
): HardFlag[] {
  const flags: HardFlag[] = [];

  // Per-chapter checks
  for (const c of chapters) {
    const body = c.body ?? "";
    const trimmed = body.trim();

    if (trimmed.length === 0) {
      flags.push({ section: c.section, reason: "EMPTY_BODY", detail: "body is empty" });
      continue;
    }

    // Paragraph count sanity — a real chapter has ≥2 paragraphs.
    const paragraphs = trimmed.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    if (paragraphs.length < 2 && trimmed.length < 300) {
      flags.push({
        section: c.section,
        reason: "MALFORMED_STRUCTURE",
        detail: `body has ${paragraphs.length} paragraph(s) and ${trimmed.length} chars`,
      });
    }

    // Astrology leakage — cap at 2 mentions per chapter.
    const matches = trimmed.match(ASTROLOGY_REGEX) ?? [];
    if (matches.length > 2) {
      flags.push({
        section: c.section,
        reason: "ASTROLOGY_LEAKAGE",
        detail: `${matches.length} placement mentions: ${matches.slice(0, 5).join(", ")}`,
      });
    }

    // Aphorism closer — check the final ~200 chars for known aphorism patterns.
    const tail = trimmed.slice(-200);
    for (const pat of APHORISM_PATTERNS) {
      if (pat.test(tail)) {
        flags.push({
          section: c.section,
          reason: "APHORISM_CLOSER",
          detail: `closer matches ${pat.source}`,
        });
        break;
      }
    }
  }

  // Cross-chapter duplicate check (pairwise, high threshold)
  const shingleCache = new Map<SectionId, Set<string>>();
  for (const c of chapters) {
    shingleCache.set(c.section, shingles(c.body ?? ""));
  }
  const sections = chapters.map((c) => c.section);
  for (let i = 0; i < sections.length; i++) {
    for (let j = i + 1; j < sections.length; j++) {
      const a = shingleCache.get(sections[i]);
      const b = shingleCache.get(sections[j]);
      if (!a || !b) continue;
      const sim = jaccard(a, b);
      if (sim > 0.6) {
        flags.push({
          section: sections[j],
          reason: "DUPLICATED_BODY",
          detail: `~${Math.round(sim * 100)}% shingle overlap with ${sections[i]}`,
        });
      }
    }
  }

  return flags;
}
