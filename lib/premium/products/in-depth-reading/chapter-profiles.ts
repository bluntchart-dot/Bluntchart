/**
 * In-Depth Reading — Chapter Profiles
 *
 * Per-chapter scheduler input for Part I. Transits are NOT listed here —
 * they keep their existing generation path entirely.
 *
 * 6 chapters, each combining related questions into strong themes.
 * Coverage-first: every chapter is priority and must receive at least
 * one owned insight in Phase 1.
 */

import type { ChapterProfile } from "@/lib/premium/insights/types";

export const IN_DEPTH_READING_CHAPTER_PROFILES: readonly ChapterProfile[] = [
  {
    section: "who-you-are",
    wantsCategories: ["contradiction", "strength", "pattern", "shadow"],
    domainPalette: [
      "social-situations", "communication", "private-thoughts", "friendships",
    ],
    targetInsightCount: 2,
    kind: "standard",
    priority: true,
  },
  {
    section: "purpose-and-destiny",
    wantsCategories: ["growth-edge", "pattern", "gift", "fear"],
    domainPalette: [
      "decisions", "work", "private-thoughts", "conflict",
    ],
    targetInsightCount: 2,
    kind: "standard",
    priority: true,
  },
  {
    section: "career-and-success",
    wantsCategories: ["strength", "gift", "pattern"],
    domainPalette: ["work", "decisions", "communication", "money"],
    targetInsightCount: 2,
    kind: "standard",
    priority: true,
  },
  {
    section: "love-and-relationships",
    wantsCategories: ["desire", "pattern", "contradiction", "shadow", "fear"],
    domainPalette: ["love", "desire", "communication", "conflict", "family"],
    targetInsightCount: 3,
    kind: "standard",
    priority: true,
  },
  {
    section: "money-and-wealth",
    wantsCategories: ["pattern", "strength", "fear", "gift"],
    domainPalette: ["money", "work", "decisions"],
    targetInsightCount: 1,
    kind: "standard",
    priority: true,
  },
  {
    section: "growth-and-wellbeing",
    wantsCategories: ["shadow", "fear", "pattern", "growth-edge", "restoration"],
    domainPalette: [
      "private-thoughts", "conflict", "routines", "love", "family",
    ],
    targetInsightCount: 2,
    kind: "standard",
    priority: true,
  },
];
