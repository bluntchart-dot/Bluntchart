/**
 * lib/premium/insights/validator.ts
 *
 * Deterministic grounding validation for AI-generated ReaderInsights.
 *
 * Hard gates (drop the insight):
 *   1. Every cited signal ID must exist in the supplied signals.
 *   2. At least one cited signal's SignalKind must be compatible with
 *      the insight's category. (Primary grounding check.)
 *   3. The pattern text must not contain astrology vocabulary.
 *   4. Structural sanity — word count, must contain "you|your", not an
 *      aphorism, must not be a stub.
 *
 * Confidence signal (never a hard gate):
 *   5. Anchor keyword match — noted for telemetry only. An insight is
 *      NOT rejected merely because it lacks a literal anchor keyword.
 *      We considered that but decided against it because it would
 *      accidentally recreate template language via the validator.
 *
 * Always applied:
 *   6. Strength is overridden from our own signal-based scoring. The
 *      AI's `strength` field is never trusted.
 *
 * Domain/tone compatibility from the metadata is checked SOFTLY —
 * incompatible domains/tones are stripped from the insight, but the
 * insight itself survives if its category is compatible.
 */

import type {
  Domain,
  EmotionalTone,
  InsightRejection,
  ReaderInsight,
  Signal,
  SignalKind,
  ValidationOutcome,
} from "./types";
import {
  APHORISM_PATTERNS,
  ASTROLOGY_VOCAB,
  SIGNAL_KIND_METADATA,
} from "./signals";

const ASTROLOGY_REGEX = new RegExp(
  `\\b(${ASTROLOGY_VOCAB.map(escapeRegExp).join("|")})\\b`,
  "i"
);

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* ─────────────────────────────────────────────────────────────────────
   Structural sanity heuristics
───────────────────────────────────────────────────────────────────── */

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function isAphorism(s: string): boolean {
  return APHORISM_PATTERNS.some((r) => r.test(s));
}

function structuralPass(pattern: string): { ok: boolean; detail?: string } {
  const wc = wordCount(pattern);
  if (wc < 6) return { ok: false, detail: `too short (${wc} words)` };
  if (wc > 40) return { ok: false, detail: `too long (${wc} words)` };
  if (!/\byou(r|rs|rself)?\b/i.test(pattern)) {
    return { ok: false, detail: "no second-person address" };
  }
  if (isAphorism(pattern)) {
    return { ok: false, detail: "aphorism / universal maxim" };
  }
  return { ok: true };
}

/* ─────────────────────────────────────────────────────────────────────
   Category / domain / tone compatibility (from the metadata table)
───────────────────────────────────────────────────────────────────── */

function citedKinds(
  insight: ReaderInsight,
  supplied: Map<string, Signal>
): SignalKind[] {
  const ids = [insight.evidence.primary, ...insight.evidence.supporting];
  const kinds: SignalKind[] = [];
  for (const id of ids) {
    const sig = supplied.get(id);
    if (sig) kinds.push(sig.kind);
  }
  return kinds;
}

function categoryCompatible(insight: ReaderInsight, kinds: SignalKind[]): boolean {
  for (const k of kinds) {
    const meta = SIGNAL_KIND_METADATA[k];
    if (!meta) continue;
    if ((meta.compatibleCategories as readonly string[]).includes(insight.category)) {
      return true;
    }
  }
  return false;
}

/** Returns only the domains that are compatible with at least one cited signal. */
function filterDomains(insight: ReaderInsight, kinds: SignalKind[]): Domain[] {
  const allowed = new Set<Domain>();
  for (const k of kinds) {
    const meta = SIGNAL_KIND_METADATA[k];
    if (!meta) continue;
    for (const d of meta.compatibleDomains) allowed.add(d);
  }
  return insight.behavioralDomains.filter((d) => allowed.has(d));
}

/** Returns the insight's tone if compatible with any cited signal, else first compatible tone as fallback. */
function reconcileTone(
  insight: ReaderInsight,
  kinds: SignalKind[]
): EmotionalTone {
  const allowedTones = new Set<EmotionalTone>();
  for (const k of kinds) {
    const meta = SIGNAL_KIND_METADATA[k];
    if (!meta) continue;
    for (const t of meta.compatibleTones) allowedTones.add(t);
  }
  if (allowedTones.has(insight.emotionalTone)) return insight.emotionalTone;
  // Fall back to a safe compatible tone; if none, keep whatever it had.
  const first = allowedTones.values().next().value;
  return first ?? insight.emotionalTone;
}

/* ─────────────────────────────────────────────────────────────────────
   Strength override — never trust the AI's number
───────────────────────────────────────────────────────────────────── */

const CATEGORY_WEIGHT: Record<string, number> = {
  strength: 1.0,
  shadow: 1.0,
  pattern: 0.95,
  gift: 0.95,
  desire: 0.90,
  contradiction: 1.0,
  fear: 0.90,
  restoration: 0.85,
  "growth-edge": 0.90,
};

function overrideStrength(
  insight: ReaderInsight,
  supplied: Map<string, Signal>
): number {
  const ids = [insight.evidence.primary, ...insight.evidence.supporting];
  let maxSignalStrength = 0;
  for (const id of ids) {
    const sig = supplied.get(id);
    if (sig && sig.strength > maxSignalStrength) {
      maxSignalStrength = sig.strength;
    }
  }
  const catWeight = CATEGORY_WEIGHT[insight.category] ?? 0.9;
  return Math.min(1, Math.max(0, maxSignalStrength * catWeight));
}

/* ─────────────────────────────────────────────────────────────────────
   Anchor keyword — confidence signal only, never a hard gate
───────────────────────────────────────────────────────────────────── */

/**
 * Not exported into the validation outcome. Used only for telemetry /
 * debug. Not consumed by the drop decision.
 */
export function anchorKeywordScore(
  insight: ReaderInsight,
  supplied: Map<string, Signal>
): number {
  const kinds = citedKinds(insight, supplied);
  const patternLower = insight.pattern.toLowerCase();
  const anchors = new Set<string>();
  for (const k of kinds) {
    const meta = SIGNAL_KIND_METADATA[k];
    if (!meta) continue;
    for (const kw of meta.anchorKeywords) anchors.add(kw.toLowerCase());
  }
  if (anchors.size === 0) return 0;
  let matches = 0;
  for (const kw of anchors) {
    if (patternLower.includes(kw)) matches++;
  }
  return matches / anchors.size;
}

/* ─────────────────────────────────────────────────────────────────────
   PUBLIC: validate
───────────────────────────────────────────────────────────────────── */

export function validateInsights(
  candidates: readonly ReaderInsight[],
  suppliedSignals: readonly Signal[]
): ValidationOutcome {
  const supplied = new Map<string, Signal>();
  for (const s of suppliedSignals) supplied.set(s.id, s);

  const valid: ReaderInsight[] = [];
  const rejected: InsightRejection[] = [];

  for (const c of candidates) {
    // Layer 1: signal ID existence
    const ids = [c.evidence.primary, ...c.evidence.supporting];
    const missing = ids.find((id) => !supplied.has(id));
    if (missing) {
      rejected.push({
        insightId: c.id,
        reason: "SIGNAL_ID_NOT_FOUND",
        detail: `unknown signal id: ${missing}`,
      });
      continue;
    }

    // Layer 3 & 4: astrology vocab + structural sanity (run before compat
    // because they are cheaper and rule out obvious junk).
    if (ASTROLOGY_REGEX.test(c.pattern)) {
      const hit = c.pattern.match(ASTROLOGY_REGEX)?.[0] ?? "";
      rejected.push({
        insightId: c.id,
        reason: "ASTROLOGY_VOCAB",
        detail: `pattern contains "${hit}"`,
      });
      continue;
    }
    const struct = structuralPass(c.pattern);
    if (!struct.ok) {
      rejected.push({
        insightId: c.id,
        reason: "STRUCTURAL_FAIL",
        detail: struct.detail,
      });
      continue;
    }

    // Layer 2: category compatibility with at least one cited signal
    const kinds = citedKinds(c, supplied);
    if (!categoryCompatible(c, kinds)) {
      rejected.push({
        insightId: c.id,
        reason: "CATEGORY_INCOMPATIBLE",
        detail: `category "${c.category}" not compatible with cited signal kinds [${kinds.join(",")}]`,
      });
      continue;
    }

    // Layer 6: strength override
    const strength = overrideStrength(c, supplied);

    // Soft cleanup: drop incompatible domains, reconcile tone. The
    // insight survives — we're just tightening what it says it fits.
    const domains = filterDomains(c, kinds);
    const tone = reconcileTone(c, kinds);

    valid.push({
      ...c,
      strength,
      behavioralDomains: domains.length > 0 ? domains : c.behavioralDomains,
      emotionalTone: tone,
    });
  }

  return { valid, rejected };
}
