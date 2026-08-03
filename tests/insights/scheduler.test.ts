/**
 * tests/insights/scheduler.test.ts
 *
 * Run: npx tsx tests/insights/scheduler.test.ts
 *
 * Verifies that the coverage-first scheduler:
 *   1. Gives every priority chapter at least one owned insight when
 *      insight yield ≥ number of priority chapters.
 *   2. Before-we-begin only PREVIEWS (never owns).
 *   3. Preview references leave insights available for later ownership.
 *   4. Life Story runs its climax pass after standard chapters.
 *   5. When yield is genuinely too low, records underfilled but does
 *      NOT crash and does NOT manufacture insights.
 */

import assert from "node:assert/strict";
import { scheduleInsights } from "@/lib/premium/insights/scheduler";
import { BIRTH_CHART_CHAPTER_PROFILES } from "@/lib/premium/products/birth-chart/chapter-profiles";
import type {
  ReaderInsight,
  InsightCategory,
  Domain,
  EmotionalTone,
} from "@/lib/premium/insights/types";
import type { SectionId } from "@/lib/premium/types";

let passed = 0;
let failed = 0;
function testCase(name: string, fn: () => void): void {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.log(`  ✗ ${name}`);
    console.log("    ", err instanceof Error ? err.message : String(err));
    failed++;
  }
}

function mockInsight(
  id: string,
  category: InsightCategory,
  strength: number,
  bestChapters: SectionId[] = [],
  tone: EmotionalTone = "quiet",
  domains: Domain[] = ["private-thoughts"],
): ReaderInsight {
  return {
    id,
    pattern: `you have some quiet pattern about ${id}`,
    evidence: { primary: `sig_${id}`, supporting: [] },
    strength,
    category,
    behavioralDomains: domains,
    emotionalTone: tone,
    bestChapters,
    origin: "ai",
  };
}

console.log("Scheduler coverage tests");

/* Test 1: 12 insights, every priority chapter gets ≥1 owned */
testCase("12 insights → every priority chapter has ≥1 owned", () => {
  const insights: ReaderInsight[] = [
    mockInsight("i1", "contradiction", 0.9),
    mockInsight("i2", "strength", 0.85),
    mockInsight("i3", "pattern", 0.8),
    mockInsight("i4", "pattern", 0.78),
    mockInsight("i5", "desire", 0.75),
    mockInsight("i6", "shadow", 0.72),
    mockInsight("i7", "fear", 0.7),
    mockInsight("i8", "growth-edge", 0.68),
    mockInsight("i9", "gift", 0.65),
    mockInsight("i10", "restoration", 0.6),
    mockInsight("i11", "strength", 0.58),
    mockInsight("i12", "shadow", 0.55),
  ];
  const { assignments } = scheduleInsights(insights, BIRTH_CHART_CHAPTER_PROFILES);

  const priorityChapters: SectionId[] = [
    "real-you","inner-fighter","blind-spot","love-patterns","shadow",
    "growth-lesson","career","hidden-gift","safe-place",
  ];
  for (const chap of priorityChapters) {
    const list = assignments.assignments[chap] ?? [];
    const ownedCount = list.filter((a) => a.kind === "owns").length;
    assert.ok(
      ownedCount >= 1,
      `${chap} owns=${ownedCount} (expected ≥1). full=${JSON.stringify(list.map(l => l.kind))}`
    );
  }
});

/* Test 2: BWB previews only, never owns */
testCase("before-we-begin has previews, never owns", () => {
  const insights: ReaderInsight[] = Array.from({ length: 12 }, (_, i) =>
    mockInsight(`i${i}`, "contradiction", 1 - i * 0.05)
  );
  const { assignments } = scheduleInsights(insights, BIRTH_CHART_CHAPTER_PROFILES);
  const bwb = assignments.assignments["before-we-begin"] ?? [];
  assert.ok(bwb.length > 0, "BWB should have some assignments");
  for (const a of bwb) {
    assert.equal(a.kind, "preview", `BWB assignment kind should be "preview", got ${a.kind}`);
  }
});

/* Test 3: Previewed insights are still available for ownership by later chapters */
testCase("previewed insights can still be owned by later chapters", () => {
  const insights: ReaderInsight[] = Array.from({ length: 12 }, (_, i) =>
    mockInsight(`i${i}`, "contradiction", 1 - i * 0.05)
  );
  const { assignments } = scheduleInsights(insights, BIRTH_CHART_CHAPTER_PROFILES);
  const bwbPreviewIds = new Set(
    (assignments.assignments["before-we-begin"] ?? [])
      .filter((a) => a.kind === "preview")
      .map((a) => a.insight.id)
  );
  // At least one of BWB's previews must be owned by a later chapter.
  let foundOwnership = false;
  for (const [sec, list] of Object.entries(assignments.assignments)) {
    if (sec === "before-we-begin" || !list) continue;
    for (const a of list) {
      if (a.kind === "owns" && bwbPreviewIds.has(a.insight.id)) {
        foundOwnership = true;
        break;
      }
    }
    if (foundOwnership) break;
  }
  assert.ok(
    foundOwnership,
    `At least one previewed insight (from ${JSON.stringify([...bwbPreviewIds])}) should be owned by a non-BWB chapter`
  );
});

/* Test 4: Life Story runs climax pass (owns unowned OR transformed-arc) */
testCase("life-story receives target-count via own or transformed-arc", () => {
  const insights: ReaderInsight[] = Array.from({ length: 12 }, (_, i) =>
    mockInsight(`i${i}`, "contradiction", 1 - i * 0.05)
  );
  const { assignments } = scheduleInsights(insights, BIRTH_CHART_CHAPTER_PROFILES);
  const ls = assignments.assignments["life-story"] ?? [];
  assert.ok(ls.length > 0, "life-story should get at least one insight");
  for (const a of ls) {
    assert.ok(
      a.kind === "owns" || a.kind === "transformed-arc",
      `life-story insight kind should be owns/transformed-arc, got ${a.kind}`
    );
  }
});

/* Test 5: Very low yield → underfilled but no crash */
testCase("insight yield of 3 → underfilled reported, no crash", () => {
  const insights: ReaderInsight[] = [
    mockInsight("i1", "contradiction", 0.9),
    mockInsight("i2", "strength", 0.7),
    mockInsight("i3", "pattern", 0.5),
  ];
  const { assignments } = scheduleInsights(insights, BIRTH_CHART_CHAPTER_PROFILES);
  assert.ok(
    assignments.underfilled.length > 0,
    "underfilled should be non-empty when yield is 3"
  );
});

/* Test 6: Insights count matches ownerships (no double-ownership) */
testCase("no insight is owned by two chapters", () => {
  const insights: ReaderInsight[] = Array.from({ length: 15 }, (_, i) =>
    mockInsight(`i${i}`, i % 2 === 0 ? "pattern" : "shadow", 1 - i * 0.04)
  );
  const { assignments } = scheduleInsights(insights, BIRTH_CHART_CHAPTER_PROFILES);
  const owners = new Map<string, string>();
  for (const [sec, list] of Object.entries(assignments.assignments)) {
    for (const a of list ?? []) {
      if (a.kind === "owns") {
        assert.ok(!owners.has(a.insight.id), `${a.insight.id} owned by both ${owners.get(a.insight.id)} and ${sec}`);
        owners.set(a.insight.id, sec);
      }
    }
  }
});

/* Test 7: Coverage fallback — a priority chapter that has no strict-fit category still gets an insight when possible */
testCase("coverage fallback assigns when no strict-fit exists", () => {
  // 9 priority chapters. Give ONLY 'pattern' and 'strength' categories,
  // but there are chapters that want 'restoration' or 'gift' — coverage
  // fallback should still assign them the strongest remaining anyway.
  const insights: ReaderInsight[] = Array.from({ length: 12 }, (_, i) =>
    mockInsight(`i${i}`, i % 2 === 0 ? "pattern" : "strength", 1 - i * 0.05)
  );
  const { assignments } = scheduleInsights(insights, BIRTH_CHART_CHAPTER_PROFILES);
  const gift = (assignments.assignments["hidden-gift"] ?? [])
    .filter((a) => a.kind === "owns");
  const restoration = (assignments.assignments["safe-place"] ?? [])
    .filter((a) => a.kind === "owns");
  assert.ok(gift.length >= 1, "hidden-gift should still get an owned insight via loose fit");
  assert.ok(restoration.length >= 1, "safe-place should still get an owned insight via loose fit");
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
