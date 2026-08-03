/**
 * lib/premium/insights/scheduler.ts
 *
 * Coverage-first, depth-second assignment.
 *
 *   Phase 0 — HOOK PREVIEW (before-we-begin)
 *     Pick top N (previewCount, default 3) hook-worthy insights from the
 *     highest-strength candidates. They are added to before-we-begin
 *     as kind="preview" — NOT owned. Ownership stays available for a
 *     later chapter to claim.
 *
 *   Phase 1 — COVERAGE
 *     For every priority chapter in reader order, greedily reserve ONE
 *     owned insight. First tries a category match; if none exists among
 *     unowned insights, falls back to strongest-fit-regardless-of-category
 *     to guarantee coverage. Never manufactures insights.
 *
 *   Phase 2 — DEPTH
 *     Distribute remaining unowned insights to chapters whose
 *     targetInsightCount > current owned count. Standard fit scoring.
 *     Never adds more insights to hook chapters (they're preview only).
 *
 *   Phase 3 — CLIMAX (life-story)
 *     Picks its own insights. Prefers unowned; falls back to
 *     transformed-arc from already-owned strong insights.
 *
 * Never generates fallback content just to fill slots. If insight yield
 * is genuinely too low, a chapter may still end up empty and is recorded
 * in `underfilled`. The orchestrator can log this; it is not fatal.
 */

import type { SectionId } from "@/lib/premium/types";
import type {
  ChapterAssignments,
  ChapterProfile,
  InsightAssignment,
  ReaderInsight,
} from "./types";
import { Ledger } from "./ledger";

/* ─────────────────────────────────────────────────────────────────────
   Scoring
───────────────────────────────────────────────────────────────────── */

/**
 * Score an insight for a specific chapter's profile.
 * Higher = better fit.
 * Returns -Infinity if the insight's category is NOT in the chapter's
 * wantsCategories. Coverage fallback ignores this rejection.
 */
function fitScore(
  insight: ReaderInsight,
  profile: ChapterProfile
): number {
  const catIndex = profile.wantsCategories.indexOf(insight.category);
  if (catIndex === -1) return -Infinity;

  const categoryBonus = 1 - catIndex * 0.15;
  const hintBonus = insight.bestChapters.includes(profile.section) ? 0.5 : 0;
  const domainOverlap =
    insight.behavioralDomains.filter((d) =>
      profile.domainPalette.includes(d)
    ).length;
  const domainBonus = Math.min(0.3, domainOverlap * 0.1);

  return insight.strength * categoryBonus + hintBonus + domainBonus;
}

/** Score ignoring the category gate — used only for coverage fallback. */
function looseFitScore(
  insight: ReaderInsight,
  profile: ChapterProfile
): number {
  const hintBonus = insight.bestChapters.includes(profile.section) ? 0.5 : 0;
  const domainOverlap =
    insight.behavioralDomains.filter((d) =>
      profile.domainPalette.includes(d)
    ).length;
  const domainBonus = Math.min(0.3, domainOverlap * 0.1);
  // Small penalty vs strict fit so strict wins when both possible.
  return insight.strength * 0.6 + hintBonus + domainBonus;
}

/* ─────────────────────────────────────────────────────────────────────
   Small helpers
───────────────────────────────────────────────────────────────────── */

function pickBest(
  candidates: readonly ReaderInsight[],
  profile: ChapterProfile,
  { loose }: { loose: boolean }
): ReaderInsight | null {
  const scored = candidates
    .map((i) => ({
      insight: i,
      score: loose ? looseFitScore(i, profile) : fitScore(i, profile),
    }))
    .filter(({ score }) => score > -Infinity)
    .sort((a, b) => b.score - a.score);
  return scored.length > 0 ? scored[0].insight : null;
}

function addAssignment(
  assignments: Partial<Record<SectionId, InsightAssignment[]>>,
  section: SectionId,
  assignment: InsightAssignment
): void {
  const list = assignments[section] ?? [];
  list.push(assignment);
  assignments[section] = list;
}

function countOwned(
  assignments: Partial<Record<SectionId, InsightAssignment[]>>,
  section: SectionId
): number {
  return (assignments[section] ?? []).filter((a) => a.kind === "owns").length;
}

/* ─────────────────────────────────────────────────────────────────────
   Main scheduler
───────────────────────────────────────────────────────────────────── */

export function scheduleInsights(
  insights: readonly ReaderInsight[],
  profiles: readonly ChapterProfile[]
): { assignments: ChapterAssignments; ledger: Ledger } {
  const ledger = new Ledger();
  const assignments: Partial<Record<SectionId, InsightAssignment[]>> = {};
  const underfilled: SectionId[] = [];

  const hookProfiles = profiles.filter((p) => p.kind === "hook");
  const standardProfiles = profiles.filter((p) => p.kind === "standard");
  const climaxProfiles = profiles.filter((p) => p.kind === "climax");

  /* ─── Phase 0: HOOK PREVIEW ────────────────────────────────────── */
  // Preview references do not consume ownership. The insight stays
  // available for a later chapter (Phase 1) to properly own.
  for (const profile of hookProfiles) {
    const previewCount = profile.previewCount ?? 3;
    // Rank all insights by strength × strict-fit bonus; take top-N.
    const rankedForHook = [...insights]
      .map((i) => {
        const fit = fitScore(i, profile);
        const score = fit === -Infinity
          ? i.strength * 0.5 // loose acceptance for hook too
          : fit;
        return { insight: i, score };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, previewCount);

    for (const { insight } of rankedForHook) {
      addAssignment(assignments, profile.section, { insight, kind: "preview" });
    }
    if (rankedForHook.length < previewCount) {
      underfilled.push(profile.section);
    }
  }

  /* ─── Phase 1: COVERAGE (one owned insight per priority chapter) ── */
  const priorityChapters = standardProfiles.filter((p) => p.priority);
  const nonPriorityChapters = standardProfiles.filter((p) => !p.priority);

  for (const profile of priorityChapters) {
    const available = insights.filter((i) => !ledger.isOwned(i.id));
    if (available.length === 0) {
      underfilled.push(profile.section);
      continue;
    }
    // Strict category fit first.
    let pick = pickBest(available, profile, { loose: false });
    // Coverage fallback: if no strict match, pick strongest loose fit.
    if (!pick) pick = pickBest(available, profile, { loose: true });
    if (!pick) {
      underfilled.push(profile.section);
      continue;
    }
    addAssignment(assignments, profile.section, { insight: pick, kind: "owns" });
    ledger.markOwned(pick.id, profile.section);
  }

  // Non-priority standard chapters, if any, also get one strict-fit
  // insight in coverage phase — no loose fallback because they are less
  // load-bearing. (Currently the profile table has none, but keep the
  // slot for future flexibility.)
  for (const profile of nonPriorityChapters) {
    const available = insights.filter((i) => !ledger.isOwned(i.id));
    if (available.length === 0) continue;
    const pick = pickBest(available, profile, { loose: false });
    if (pick) {
      addAssignment(assignments, profile.section, { insight: pick, kind: "owns" });
      ledger.markOwned(pick.id, profile.section);
    }
  }

  /* ─── Phase 2: DEPTH (top up chapters that want more than 1) ────── */
  // Iterate chapters by remaining hunger (target - current), preferring
  // priority chapters when tied.
  const depthOrder = [...priorityChapters, ...nonPriorityChapters].filter(
    (p) => countOwned(assignments, p.section) < p.targetInsightCount
  );
  // We may loop until we've placed all remaining or every remaining
  // chapter is at target.
  let progress = true;
  while (progress) {
    progress = false;
    for (const profile of depthOrder) {
      const currentCount = countOwned(assignments, profile.section);
      if (currentCount >= profile.targetInsightCount) continue;
      const available = insights.filter((i) => !ledger.isOwned(i.id));
      if (available.length === 0) break;
      const pick = pickBest(available, profile, { loose: false });
      if (!pick) continue; // no strict-fit insight left for this chapter
      addAssignment(assignments, profile.section, { insight: pick, kind: "owns" });
      ledger.markOwned(pick.id, profile.section);
      progress = true;
    }
  }

  // Record any priority chapter that ended up under target as underfilled
  // (still might have 1 from Phase 1 — that's fine, target of 2 not met).
  for (const profile of priorityChapters) {
    if (countOwned(assignments, profile.section) < profile.targetInsightCount) {
      // Only add to underfilled once
      if (!underfilled.includes(profile.section)) {
        underfilled.push(profile.section);
      }
    }
  }

  /* ─── Phase 3: CLIMAX (Life Story) ─────────────────────────────── */
  for (const profile of climaxProfiles) {
    const picks: InsightAssignment[] = [];

    // Try unowned insights first for fresh material.
    const unownedScored = insights
      .filter((i) => !ledger.isOwned(i.id))
      .map((i) => ({ insight: i, score: fitScore(i, profile) }))
      .filter(({ score }) => score > -Infinity)
      .sort((a, b) => b.score - a.score);

    for (const { insight } of unownedScored) {
      if (picks.length >= profile.targetInsightCount) break;
      picks.push({ insight, kind: "owns" });
      ledger.markOwned(insight.id, profile.section);
    }

    // Top up with transformed-arc references from already-owned insights.
    if (picks.length < profile.targetInsightCount) {
      const ownedScored = insights
        .filter((i) => ledger.isOwned(i.id) && ledger.ownerOf(i.id) !== profile.section)
        .map((i) => {
          const strict = fitScore(i, profile);
          return {
            insight: i,
            score: strict === -Infinity ? i.strength * 0.7 : strict,
          };
        })
        .sort((a, b) => b.score - a.score);
      for (const { insight } of ownedScored) {
        if (picks.length >= profile.targetInsightCount) break;
        picks.push({ insight, kind: "transformed-arc" });
        ledger.markReferenced(insight.id, profile.section);
      }
    }

    if (picks.length < profile.targetInsightCount) {
      underfilled.push(profile.section);
    }
    assignments[profile.section] = picks;
  }

  return {
    assignments: { assignments, underfilled },
    ledger,
  };
}
