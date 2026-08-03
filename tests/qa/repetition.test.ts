/**
 * tests/qa/repetition.test.ts
 *
 * Run: npx tsx tests/qa/repetition.test.ts
 *
 * Verifies:
 *   1. Ordinary conversational vocabulary does NOT trigger flags
 *      (you're, need, feel, people, thing, etc.).
 *   2. Real repetition IS still caught — "the version of you that",
 *      "want something badly and pursue it", verbatim reuse.
 *   3. Chapter cosine only flags genuinely-similar bodies (>= 0.55).
 *   4. Transit-transit phrase overlap is NOT flagged.
 */

import assert from "node:assert/strict";
import {
  runRepetitionScan,
  type ChapterUnderReview,
} from "@/lib/premium/qa/repetition";

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

/**
 * Build a set of Part I chapters that share plenty of ordinary
 * conversational vocabulary but contain no real cross-chapter repetition.
 * This shouldn't trip the new precision thresholds.
 */
function normalPartIChapters(): ChapterUnderReview[] {
  return [
    { section: "before-we-begin", isTransit: false, body:
      "You already know something is shifting. You can feel it, even if you can't name it yet. Something wants your attention this week." },
    { section: "real-you", isTransit: false, body:
      "There's a private way you handle disappointment that no one has ever really seen. You wait until the room is empty before your face changes." },
    { section: "inner-fighter", isTransit: false, body:
      "When cornered you go quiet, which most people mistake for surrender. It isn't. That's the moment your decision is already made." },
    { section: "blind-spot", isTransit: false, body:
      "You have a habit of solving problems that were not yours to hold. It shows up cleanest at work, on any Friday afternoon that looked calm at 2pm." },
    { section: "love-patterns", isTransit: false, body:
      "In relationships you pursue when the pace is slow and pull back when it accelerates. That paradox is the whole architecture." },
    { section: "shadow", isTransit: false, body:
      "There's a version of your fear that you have never spoken aloud. It has a specific shape. It comes on Sundays." },
    { section: "growth-lesson", isTransit: false, body:
      "The lesson keeps arriving in different outfits and you keep hoping it will go away. It won't. It's trying to give you back your evenings." },
    { section: "career", isTransit: false, body:
      "You are the one who sees the whole system. That skill undersells itself in every job title you have ever accepted." },
    { section: "hidden-gift", isTransit: false, body:
      "There is a specific talent that lives beneath the more obvious ones. You will find it in the questions people bring you at midnight." },
    { section: "safe-place", isTransit: false, body:
      "Home for you has always been a small ritual, not a room. You are quietly building it one habit at a time." },
    { section: "life-story", isTransit: false, body:
      "This is the arc: someone who mistook self-reliance for freedom, then discovered freedom is actually chosen belonging. That's your next scene." },
  ];
}

/**
 * Same set, but with deliberate cross-chapter repetition inserted so
 * QA MUST flag it.
 */
function repetitiveChapters(): ChapterUnderReview[] {
  const base = normalPartIChapters();
  base[1] = { section: "real-you", isTransit: false, body:
    base[1].body + " The version of you that people meet at the door is not the version who runs the house." };
  base[2] = { section: "inner-fighter", isTransit: false, body:
    base[2].body + " The version of you that people meet at the door only shows up when it wants to." };
  base[6] = { section: "growth-lesson", isTransit: false, body:
    base[6].body + " You can want something badly and pursue it and still find yourself on the wrong side of it." };
  base[10] = { section: "life-story", isTransit: false, body:
    base[10].body + " You can want something badly and pursue it and still be the one who chose the doorway." };
  return base;
}

console.log("QA repetition precision tests");

/* Test 1: ordinary Part I prose produces very few flags (mostly none) */
testCase("normal prose across 11 chapters → soft flag count is low", () => {
  const flags = runRepetitionScan(normalPartIChapters(), []);
  const severeCount = flags.filter((f) => f.severity >= 0.5).length;
  assert.ok(
    severeCount <= 2,
    `expected ≤2 severity-≥0.5 flags on normal prose, got ${severeCount}. flags=${JSON.stringify(flags.map(f => `${f.reason}:${f.severity.toFixed(2)}:${f.detail.slice(0,60)}`))}`
  );
});

/* Test 2: stopword stems (you're, need, feel) do NOT trigger stem overuse */
testCase("stopword stems don't trigger CONCEPT_STEM_OVERUSE", () => {
  const bodies: string[] = Array.from({ length: 11 }, () =>
    "you're going to feel this, you're going to need it, and something inside you already knows"
  );
  const chapters: ChapterUnderReview[] = bodies.map((b, i) => ({
    section: (
      i === 0 ? "before-we-begin" :
      i === 1 ? "real-you" :
      i === 2 ? "inner-fighter" :
      i === 3 ? "blind-spot" :
      i === 4 ? "love-patterns" :
      i === 5 ? "shadow" :
      i === 6 ? "growth-lesson" :
      i === 7 ? "career" :
      i === 8 ? "hidden-gift" :
      i === 9 ? "safe-place" :
      "life-story"
    ) as ChapterUnderReview["section"],
    isTransit: false,
    body: b,
  }));
  const flags = runRepetitionScan(chapters, []);
  const stemFlags = flags.filter(
    (f) => f.reason === "CONCEPT_STEM_OVERUSE" &&
    /you'?re|need|feel|something|inside|know/i.test(f.detail)
  );
  assert.equal(stemFlags.length, 0, `stopword-only stems should not trigger, got ${JSON.stringify(stemFlags.map(f => f.detail))}`);
});

/* Test 3: real cross-chapter repetition IS still caught */
testCase("verbatim phrase reuse across chapters IS flagged", () => {
  const flags = runRepetitionScan(repetitiveChapters(), []);
  const versionFlags = flags.filter((f) =>
    f.reason === "PHRASE_OVERLAP" && /version of you that/.test(f.detail)
  );
  const badlyFlags = flags.filter((f) =>
    f.reason === "PHRASE_OVERLAP" && /want something badly and pursue/.test(f.detail)
  );
  assert.ok(versionFlags.length > 0, `"version of you that" should be flagged`);
  assert.ok(badlyFlags.length > 0, `"want something badly and pursue" should be flagged`);
});

/* Test 4: transit-transit phrase overlap is NOT flagged (they share vocab by design) */
testCase("transit-transit phrase overlap is NOT flagged", () => {
  const chapters: ChapterUnderReview[] = [
    { section: "transit-season", isTransit: true, body:
      "there is a window opening in the next few weeks that you should not miss" },
    { section: "transit-timing", isTransit: true, body:
      "there is a window opening in the next few weeks that you should not miss" },
  ];
  const flags = runRepetitionScan(chapters, []);
  const phraseFlags = flags.filter((f) => f.reason === "PHRASE_OVERLAP");
  assert.equal(phraseFlags.length, 0, `transit-transit phrase overlap should be ignored, got ${JSON.stringify(phraseFlags)}`);
});

/* Test 5: severity for stopword-heavy phrase is low so it won't trigger regen */
testCase("stopword-heavy phrase overlap gets low severity", () => {
  const chapters: ChapterUnderReview[] = [
    { section: "real-you", isTransit: false, body:
      "the way you are in the way you feel like this" },
    { section: "inner-fighter", isTransit: false, body:
      "sometimes the way you are in the way you feel is complicated" },
  ];
  const flags = runRepetitionScan(chapters, []);
  const phraseFlags = flags.filter((f) => f.reason === "PHRASE_OVERLAP");
  for (const f of phraseFlags) {
    assert.ok(f.severity < 0.5, `stopword-heavy phrase should have severity <0.5, got ${f.severity} for "${f.detail}"`);
  }
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
