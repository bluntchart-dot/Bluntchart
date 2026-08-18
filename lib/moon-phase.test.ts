/**
 * Moon Phase Compatibility — Stage 1 Validation Suite
 *
 * 1. Analytic vs numerical coverage validation (30 phase combinations)
 * 2. Explicit edge cases (10+ specific scenarios)
 * 3. Score distribution across 200 random birth-date pairs
 *
 * Run: npx tsx lib/moon-phase.test.ts
 */

import {
  getMoonPhase,
  combinedCoverage,
  numericalCoverage,
  calculateCompatibility,
  phaseAngularDistance,
  scoreBand,
} from "./moon-phase";

/* -------------------------------------------------------------------------- */
/*                         HELPERS                                            */
/* -------------------------------------------------------------------------- */

function fmt(n: number, decimals = 1): string {
  return n.toFixed(decimals);
}

function padR(s: string, len: number): string {
  return s.length >= len ? s : s + " ".repeat(len - s.length);
}

function padL(s: string, len: number): string {
  return s.length >= len ? s : " ".repeat(len - s.length) + s;
}

/* -------------------------------------------------------------------------- */
/*       1. ANALYTIC vs NUMERICAL VALIDATION (30 phase combinations)          */
/* -------------------------------------------------------------------------- */

console.log("═══════════════════════════════════════════════════════════════");
console.log("  1. ANALYTIC vs NUMERICAL COVERAGE VALIDATION");
console.log("     Comparing formula output to pixel-sampled ground truth");
console.log("     (500×500 sample grid per test)");
console.log("═══════════════════════════════════════════════════════════════\n");

const VALIDATION_PAIRS: { label: string; phi1: number; phi2: number }[] = [
  // Identical phases
  { label: "New + New (0° + 0°)",           phi1: 0,    phi2: 0 },
  { label: "Full + Full (180° + 180°)",     phi1: 180,  phi2: 180 },
  { label: "Q1 + Q1 (90° + 90°)",          phi1: 90,   phi2: 90 },
  { label: "Q3 + Q3 (270° + 270°)",        phi1: 270,  phi2: 270 },
  // Perfect complements
  { label: "New + Full (0° + 180°)",        phi1: 0,    phi2: 180 },
  { label: "Q1 + Q3 (90° + 270°)",         phi1: 90,   phi2: 270 },
  // Crescents same side
  { label: "WxCrescent + WxCrescent (30° + 60°)", phi1: 30,  phi2: 60 },
  { label: "WnCrescent + WnCrescent (300° + 330°)", phi1: 300, phi2: 330 },
  // Crescents opposite sides
  { label: "WxCrescent + WnCrescent (45° + 315°)", phi1: 45,  phi2: 315 },
  { label: "WxCrescent + WnCrescent (30° + 330°)", phi1: 30,  phi2: 330 },
  // Gibbous same side
  { label: "WxGibbous + WxGibbous (135° + 150°)", phi1: 135, phi2: 150 },
  { label: "WnGibbous + WnGibbous (210° + 240°)", phi1: 210, phi2: 240 },
  // Gibbous opposite sides
  { label: "WxGibbous + WnGibbous (135° + 225°)", phi1: 135, phi2: 225 },
  { label: "WxGibbous + WnGibbous (150° + 210°)", phi1: 150, phi2: 210 },
  // Mixed: crescent + gibbous
  { label: "WxCrescent + WnGibbous (45° + 225°)", phi1: 45,  phi2: 225 },
  { label: "WnCrescent + WxGibbous (315° + 135°)", phi1: 315, phi2: 135 },
  // Quarter + full
  { label: "Q1 + Full (90° + 180°)",       phi1: 90,   phi2: 180 },
  { label: "Q3 + Full (270° + 180°)",      phi1: 270,  phi2: 180 },
  // Quarter + new
  { label: "Q1 + New (90° + 0°)",          phi1: 90,   phi2: 0 },
  { label: "Q3 + New (270° + 0°)",         phi1: 270,  phi2: 0 },
  // Adjacent phases
  { label: "Adjacent waxing (80° + 100°)", phi1: 80,   phi2: 100 },
  { label: "Adjacent waning (260° + 280°)", phi1: 260, phi2: 280 },
  // Near-symmetric
  { label: "Near-Q1 + Near-Q3 (85° + 275°)", phi1: 85,  phi2: 275 },
  { label: "Slight-wax + Slight-wan (10° + 350°)", phi1: 10, phi2: 350 },
  // Specific interesting angles
  { label: "60° + 300° (sextile distance)", phi1: 60,  phi2: 300 },
  { label: "120° + 240° (trine distance)", phi1: 120,  phi2: 240 },
  { label: "45° + 135° (same side, spread)", phi1: 45, phi2: 135 },
  { label: "200° + 340° (same side waning)", phi1: 200, phi2: 340 },
  // Edge boundary
  { label: "Exact 180° boundary (179° + 181°)", phi1: 179, phi2: 181 },
  { label: "Full + near-full (180° + 170°)", phi1: 180, phi2: 170 },
];

let maxDeviation = 0;
let passCount = 0;

console.log(
  padR("Phase Combination", 42) +
  padL("Analytic", 10) +
  padL("Numerical", 10) +
  padL("Δ", 8) +
  "  Status"
);
console.log("─".repeat(76));

for (const { label, phi1, phi2 } of VALIDATION_PAIRS) {
  const analytic = combinedCoverage(phi1, phi2);
  const numerical = numericalCoverage(phi1, phi2, 500);
  const deviation = Math.abs(analytic - numerical);
  maxDeviation = Math.max(maxDeviation, deviation);

  const pass = deviation < 0.02;
  if (pass) passCount++;

  console.log(
    padR(label, 42) +
    padL(fmt(analytic * 100) + "%", 10) +
    padL(fmt(numerical * 100) + "%", 10) +
    padL(fmt(deviation * 100, 2) + "%", 8) +
    (pass ? "  ✓" : "  ✗ FAIL")
  );
}

console.log("─".repeat(76));
console.log(
  `Results: ${passCount}/${VALIDATION_PAIRS.length} passed (<2% deviation)`
);
console.log(`Max deviation: ${fmt(maxDeviation * 100, 3)}%\n`);

/* -------------------------------------------------------------------------- */
/*       2. EXPLICIT EDGE CASES (real dates)                                  */
/* -------------------------------------------------------------------------- */

console.log("═══════════════════════════════════════════════════════════════");
console.log("  2. EXPLICIT EDGE CASES (real birth dates)");
console.log("═══════════════════════════════════════════════════════════════\n");

const EDGE_CASES: { label: string; date1: string; date2: string; expectedScenario: string }[] = [
  {
    label: "New + New",
    date1: "2000-01-06",  // Known new moon (Jan 6, 2000)
    date2: "2000-07-01",  // Another new moon
    expectedScenario: "Both new moons → near-zero score",
  },
  {
    label: "New + Full",
    date1: "2000-01-06",  // New moon
    date2: "2000-01-21",  // Full moon (~15 days later)
    expectedScenario: "New + full → near-100 score",
  },
  {
    label: "Full + Full",
    date1: "2000-01-21",  // Full moon
    date2: "2000-07-16",  // Another full moon
    expectedScenario: "Both full → 100 score",
  },
  {
    label: "Q1 + Q1",
    date1: "2000-01-14",  // First quarter
    date2: "2000-06-09",  // Another first quarter
    expectedScenario: "Both Q1 (same side) → ~50 score",
  },
  {
    label: "Q1 + Q3",
    date1: "2000-01-14",  // First quarter
    date2: "2000-01-28",  // Third quarter
    expectedScenario: "Q1 + Q3 (opposite sides) → near-100",
  },
  {
    label: "Wax Crescent + Wax Crescent",
    date1: "2000-01-09",  // ~3 days after new
    date2: "2000-02-08",  // ~3 days after next new
    expectedScenario: "Both thin crescents same side → low score",
  },
  {
    label: "Opposite Crescents",
    date1: "2000-01-09",  // Waxing crescent
    date2: "2000-02-02",  // Waning crescent
    expectedScenario: "Thin crescents opposite sides → low-moderate",
  },
  {
    label: "Wax Gibbous + Wan Gibbous",
    date1: "2000-01-18",  // Waxing gibbous (~2 days before full)
    date2: "2000-01-24",  // Waning gibbous (~3 days after full)
    expectedScenario: "Both gibbous opposite sides → high score",
  },
  {
    label: "Same Date (same phase)",
    date1: "1998-06-14",
    date2: "1998-06-14",
    expectedScenario: "Identical → score = illumination of that phase",
  },
  {
    label: "Adjacent Dates",
    date1: "1998-06-14",
    date2: "1998-06-15",
    expectedScenario: "1 day apart → nearly identical phases → very similar",
  },
  {
    label: "Original defaults (Emma + Jake)",
    date1: "1998-06-14",
    date2: "1996-03-02",
    expectedScenario: "The original demo dates",
  },
  {
    label: "Far apart dates (different eras)",
    date1: "1965-03-15",
    date2: "2002-11-22",
    expectedScenario: "Widely separated birth years",
  },
];

console.log(
  padR("Scenario", 32) +
  padR("Date 1", 13) +
  padR("Date 2", 13) +
  padL("Score", 7) +
  "  " +
  padR("Band", 16) +
  "Phase 1 / Phase 2"
);
console.log("─".repeat(115));

for (const { label, date1, date2, expectedScenario } of EDGE_CASES) {
  const result = calculateCompatibility(date1, date2);
  console.log(
    padR(label, 32) +
    padR(date1, 13) +
    padR(date2, 13) +
    padL(result.score + "%", 7) +
    "  " +
    padR(result.scoreBandLabel, 16) +
    `${result.person1.phaseName} (${result.person1.illuminationPercent}%) / ` +
    `${result.person2.phaseName} (${result.person2.illuminationPercent}%)`
  );
}

console.log("");
console.log("Expected scenario check:");
for (const { label, date1, date2, expectedScenario } of EDGE_CASES) {
  const result = calculateCompatibility(date1, date2);
  console.log(`  ${padR(label, 30)} → ${result.score}%  [${expectedScenario}]`);
}

/* -------------------------------------------------------------------------- */
/*       3. SCORE DISTRIBUTION (200 random date pairs)                        */
/* -------------------------------------------------------------------------- */

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("  3. SCORE DISTRIBUTION (200 random birth-date pairs)");
console.log("     Dates uniformly sampled from 1960-01-01 to 2006-12-31");
console.log("═══════════════════════════════════════════════════════════════\n");

function randomDate(startYear: number, endYear: number, seed: number): string {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  const t = start + (seed % 1) * (end - start);
  const d = new Date(t);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// Seeded pseudo-random (Mulberry32)
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(42);
const SAMPLE_COUNT = 200;
const scores: number[] = [];

const bandCounts: Record<string, number> = {
  "extraordinary (90-100)": 0,
  "strong (70-89)": 0,
  "complementary (45-69)": 0,
  "contrasting (20-44)": 0,
  "independent (0-19)": 0,
};

for (let i = 0; i < SAMPLE_COUNT; i++) {
  const d1 = randomDate(1960, 2006, rng());
  const d2 = randomDate(1960, 2006, rng());
  const result = calculateCompatibility(d1, d2);
  scores.push(result.score);

  const band = result.scoreBand;
  if (band === "extraordinary") bandCounts["extraordinary (90-100)"]++;
  else if (band === "strong") bandCounts["strong (70-89)"]++;
  else if (band === "complementary") bandCounts["complementary (45-69)"]++;
  else if (band === "contrasting") bandCounts["contrasting (20-44)"]++;
  else bandCounts["independent (0-19)"]++;
}

scores.sort((a, b) => a - b);
const sum = scores.reduce((a, b) => a + b, 0);
const mean = sum / scores.length;
const median = scores.length % 2 === 0
  ? (scores[scores.length / 2 - 1] + scores[scores.length / 2]) / 2
  : scores[Math.floor(scores.length / 2)];

const variance = scores.reduce((acc, s) => acc + (s - mean) ** 2, 0) / scores.length;
const stdDev = Math.sqrt(variance);

console.log("Summary Statistics:");
console.log(`  Min:      ${scores[0]}%`);
console.log(`  Max:      ${scores[scores.length - 1]}%`);
console.log(`  Mean:     ${fmt(mean)}%`);
console.log(`  Median:   ${fmt(median)}%`);
console.log(`  Std Dev:  ${fmt(stdDev)}%`);
console.log(`  P10:      ${scores[Math.floor(scores.length * 0.1)]}%`);
console.log(`  P25:      ${scores[Math.floor(scores.length * 0.25)]}%`);
console.log(`  P75:      ${scores[Math.floor(scores.length * 0.75)]}%`);
console.log(`  P90:      ${scores[Math.floor(scores.length * 0.9)]}%`);

console.log("\nScore Band Distribution:");
const maxBar = 40;
const maxCount = Math.max(...Object.values(bandCounts));
for (const [band, count] of Object.entries(bandCounts)) {
  const pct = ((count / SAMPLE_COUNT) * 100).toFixed(1);
  const barLen = Math.round((count / maxCount) * maxBar);
  const bar = "█".repeat(barLen);
  console.log(`  ${padR(band, 24)} ${padL(String(count), 4)} (${padL(pct, 5)}%)  ${bar}`);
}

// Histogram (10-point buckets)
console.log("\nHistogram (10-point buckets):");
const buckets: number[] = new Array(10).fill(0);
for (const s of scores) {
  const idx = Math.min(9, Math.floor(s / 10));
  buckets[idx]++;
}
const maxBucket = Math.max(...buckets);
for (let i = 0; i < 10; i++) {
  const lo = i * 10;
  const hi = lo + 9;
  const barLen = Math.round((buckets[i] / maxBucket) * maxBar);
  const bar = "█".repeat(barLen);
  console.log(
    `  ${padL(String(lo), 3)}-${padL(String(hi), 3)}%  ${padL(String(buckets[i]), 4)}  ${bar}`
  );
}

/* -------------------------------------------------------------------------- */
/*       4. SAMPLE REAL-WORLD PAIRS                                           */
/* -------------------------------------------------------------------------- */

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("  4. SAMPLE REAL-WORLD DATE PAIRS (for review)");
console.log("═══════════════════════════════════════════════════════════════\n");

const SAMPLE_PAIRS: { label: string; d1: string; d2: string }[] = [
  { label: "Couple A (90s kids)", d1: "1994-02-14", d2: "1995-08-22" },
  { label: "Couple B (millennial)", d1: "1998-06-14", d2: "1997-11-03" },
  { label: "Couple C (Gen X)", d1: "1975-12-25", d2: "1978-04-10" },
  { label: "Best friends", d1: "2001-03-08", d2: "2001-09-15" },
  { label: "Parent & child", d1: "1968-07-20", d2: "1998-01-15" },
  { label: "Siblings", d1: "1992-05-12", d2: "1995-05-12" },
  { label: "Wide age gap", d1: "1955-10-28", d2: "2000-06-01" },
  { label: "Same month diff year", d1: "1990-04-15", d2: "1993-04-15" },
  { label: "Valentine's Day pair", d1: "1996-02-14", d2: "1998-02-14" },
  { label: "New Year's pair", d1: "1985-01-01", d2: "2000-01-01" },
];

console.log(
  padR("Label", 26) +
  padR("Date 1", 13) +
  padR("Date 2", 13) +
  padL("Score", 7) +
  "  " +
  padR("Band", 16) +
  padR("Phase 1", 20) +
  padR("Phase 2", 20) +
  "  Δ°"
);
console.log("─".repeat(125));

for (const { label, d1, d2 } of SAMPLE_PAIRS) {
  const r = calculateCompatibility(d1, d2);
  console.log(
    padR(label, 26) +
    padR(d1, 13) +
    padR(d2, 13) +
    padL(r.score + "%", 7) +
    "  " +
    padR(r.scoreBandLabel, 16) +
    padR(`${r.person1.phaseName} (${r.person1.illuminationPercent}%)`, 20) +
    padR(`${r.person2.phaseName} (${r.person2.illuminationPercent}%)`, 20) +
    "  " + fmt(r.angularDistance, 0) + "°"
  );
}

console.log("\n═══════════════════════════════════════════════════════════════");
console.log("  STAGE 1 COMPLETE — Review results above before Stage 2");
console.log("═══════════════════════════════════════════════════════════════");
