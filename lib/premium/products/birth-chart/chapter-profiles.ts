/**
 * Birth Chart — Chapter Profiles
 *
 * Per-chapter scheduler input for Part I. Transits are NOT listed here —
 * they keep their existing generation path entirely.
 *
 * Coverage-first policy:
 *   - Chapters marked `priority: true` MUST receive at least one owned
 *     insight in Phase 1 (the scheduler falls back to loose category
 *     matching if needed to guarantee coverage).
 *   - Before We Begin has `kind: "hook"` — it does NOT own insights.
 *     Instead it PREVIEWS 2–3 hook-worthy insights that later chapters
 *     will own and explain.
 *   - Life Story has `kind: "climax"` — it runs after Part I and may
 *     transform previously-owned insights into protagonist beats.
 */

import type { ChapterProfile } from "@/lib/premium/insights/types";

export const BIRTH_CHART_CHAPTER_PROFILES: readonly ChapterProfile[] = [
  {
    section: "before-we-begin",
    wantsCategories: ["contradiction", "pattern", "strength", "desire"],
    domainPalette: [
      "private-thoughts", "decisions", "social-situations",
      "communication", "desire",
    ],
    // Hook chapters do not OWN insights — they preview them.
    targetInsightCount: 0,
    previewCount: 3,
    kind: "hook",
    // Not marked priority because coverage guarantee applies to chapters
    // that OWN insights; BWB references without owning.
  },
  {
    section: "real-you",
    wantsCategories: ["contradiction", "strength", "pattern"],
    domainPalette: [
      "private-thoughts", "social-situations", "work", "communication",
    ],
    targetInsightCount: 2,
    kind: "standard",
    priority: true,
  },
  {
    section: "inner-fighter",
    wantsCategories: ["strength", "pattern", "shadow"],
    domainPalette: ["conflict", "decisions", "work", "communication"],
    targetInsightCount: 2,
    kind: "standard",
    priority: true,
  },
  {
    section: "blind-spot",
    wantsCategories: ["pattern", "growth-edge", "shadow"],
    domainPalette: [
      "decisions", "communication", "conflict", "work", "friendships",
    ],
    targetInsightCount: 1,
    kind: "standard",
    priority: true,
  },
  {
    section: "love-patterns",
    wantsCategories: ["desire", "pattern", "contradiction", "shadow"],
    domainPalette: ["love", "desire", "communication", "conflict"],
    targetInsightCount: 2,
    kind: "standard",
    priority: true,
  },
  {
    section: "shadow",
    wantsCategories: ["fear", "shadow", "pattern"],
    domainPalette: [
      "private-thoughts", "love", "family", "conflict",
    ],
    targetInsightCount: 2,
    kind: "standard",
    priority: true,
  },
  {
    section: "growth-lesson",
    wantsCategories: ["growth-edge", "pattern"],
    domainPalette: [
      "decisions", "love", "work", "private-thoughts", "conflict",
    ],
    targetInsightCount: 1,
    kind: "standard",
    priority: true,
  },
  {
    section: "career",
    wantsCategories: ["strength", "gift", "pattern"],
    domainPalette: ["work", "decisions", "communication"],
    targetInsightCount: 2,
    kind: "standard",
    priority: true,
  },
  {
    section: "hidden-gift",
    wantsCategories: ["gift", "strength"],
    domainPalette: [
      "work", "friendships", "communication", "social-situations",
    ],
    targetInsightCount: 1,
    kind: "standard",
    priority: true,
  },
  {
    section: "safe-place",
    wantsCategories: ["restoration", "desire", "pattern"],
    domainPalette: ["routines", "private-thoughts", "family", "love"],
    targetInsightCount: 1,
    kind: "standard",
    priority: true,
  },
  {
    section: "life-story",
    wantsCategories: [
      "desire", "contradiction", "growth-edge", "gift", "strength",
    ],
    domainPalette: [
      "private-thoughts", "desire", "love", "work", "decisions",
    ],
    targetInsightCount: 4,
    kind: "climax",
  },
];
