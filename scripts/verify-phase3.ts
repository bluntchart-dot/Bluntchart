/**
 * Phase 3 end-to-end verification script.
 * Run with: npx tsx scripts/verify-phase3.ts
 */

import { getProduct, getProductOrNull, isTarotProduct } from "@/lib/premium/products/registry";
import type { ReadingProduct } from "@/lib/premium/types";
import { getBundle, getBundleProducts, isBundle } from "@/lib/pipeline/bundles";
import { calculateChart } from "@/lib/chart-calculator";
import type { BirthData } from "@/lib/types";
import { getTransitSnapshot, getTransitWindowContext, findSignIngresses, findStations } from "@/lib/transit/engine";
import { getTransitAspectsForDate, findTransitAspectWindows, formatTransitContext } from "@/lib/transit/aspects";

const ALL_PRODUCTS: ReadingProduct[] = [
  "birth-chart", "in-depth-reading", "compatibility", "year-ahead",
  "gift-reading", "brutally-honest-reading", "love-reading", "career-reading",
  "shadow-reading", "three-card-tarot", "yes-no-tarot", "daily-tarot",
  "saturn-return", "moon-reading", "money-reading", "monthly-transit",
  "soulmate-reading", "hidden-feelings", "ex-love-reading", "blunt-love",
  "blunt-career", "big-three-mini", "life-purpose", "personality-decoded",
  "blind-reading",
];

let passed = 0;
let failed = 0;

function check(label: string, ok: boolean, detail?: string) {
  if (ok) {
    console.log(`  ✓ ${label}`);
    passed++;
  } else {
    console.log(`  ✗ ${label}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
}

// 1. Registry completeness
console.log("\n1. Registry completeness (25 products)");
for (const p of ALL_PRODUCTS) {
  const def = getProductOrNull(p);
  check(`${p} registered`, def !== null);
}
check("Total products = 25", ALL_PRODUCTS.length === 25);

// 2. Pipeline tier assignments
console.log("\n2. Pipeline tier assignments");
const premiumProducts = ["birth-chart", "in-depth-reading"];
const tarotProducts = ["three-card-tarot", "yes-no-tarot", "daily-tarot"];
const compatProducts = ["compatibility"];
const quickProducts = ALL_PRODUCTS.filter(
  p => !premiumProducts.includes(p) && !tarotProducts.includes(p) && !compatProducts.includes(p)
);

for (const p of premiumProducts) {
  const def = getProduct(p as ReadingProduct);
  check(`${p} → premium`, def.pipelineTier === "premium");
}
for (const p of tarotProducts) {
  const def = getProduct(p as ReadingProduct);
  check(`${p} has tarotConfig`, def.tarotConfig != null);
}
for (const p of compatProducts) {
  const def = getProduct(p as ReadingProduct);
  check(`${p} has compatConfig`, def.compatConfig != null);
}
for (const p of quickProducts) {
  const def = getProduct(p as ReadingProduct);
  check(`${p} has quickConfig`, def.quickConfig != null);
}

// 3. Transit engine
console.log("\n3. Transit engine (Task 3.1)");
const testBirth: BirthData = {
  name: "Test",
  date: "1995-03-15",
  time: "14:30",
  lat: 28.6139,
  lng: 77.209,
  timezone: "Asia/Kolkata",
  placeName: "New Delhi, India",
};

try {
  const chart = calculateChart(testBirth);
  check("calculateChart succeeds", chart != null);

  const now = new Date();
  const snapshot = getTransitSnapshot(now);
  check("getTransitSnapshot returns positions", snapshot.positions.length > 0);
  check("snapshot has 12 bodies", snapshot.positions.length === 12);

  const windowCtx = getTransitWindowContext(now, 12);
  check("getTransitWindowContext has currentPositions", windowCtx.currentPositions.positions.length > 0);
  check("getTransitWindowContext has monthlySnapshots", windowCtx.monthlySnapshots.length === 12);
  check("ingresses array exists", Array.isArray(windowCtx.ingresses));
  check("stations array exists", Array.isArray(windowCtx.stations));

  const transitAspects = getTransitAspectsForDate(chart, now);
  check("getTransitAspectsForDate returns array", Array.isArray(transitAspects));

  const formatted = formatTransitContext(chart, now, 6, { includeWindows: true, maxAspects: 15 });
  check("formatTransitContext returns string", typeof formatted === "string");
  check("formatTransitContext has content", formatted.length > 0);

  const endDate = new Date(now.getTime() + 180 * 86400000);
  const windows = findTransitAspectWindows(chart, now, endDate);
  check("findTransitAspectWindows returns array", Array.isArray(windows));
} catch (err) {
  check("transit engine calculation", false, String(err));
}

// 4. Monthly transit product uses transit engine
console.log("\n4. Monthly transit product (Task 3.3)");
const mtDef = getProduct("monthly-transit");
check("monthly-transit registered", mtDef != null);
check("monthly-transit has quickConfig", mtDef.quickConfig != null);
if (mtDef.quickConfig) {
  const chart = calculateChart(testBirth);
  const prompt = mtDef.quickConfig.buildUserPrompt(testBirth, chart);
  check("buildUserPrompt includes CURRENT SKY", prompt.includes("CURRENT SKY"));
  check("buildUserPrompt includes TRANSIT ASPECTS", prompt.includes("TRANSIT ASPECTS"));
  check("buildUserPrompt includes STATIONS", prompt.includes("STATIONS"));
}

// 5. Year-ahead upgrade (Task 3.4)
console.log("\n5. Year-ahead transit data (Task 3.4)");
const yaDef = getProduct("year-ahead");
check("year-ahead registered", yaDef != null);
if (yaDef.quickConfig) {
  const chart = calculateChart(testBirth);
  const prompt = yaDef.quickConfig.buildUserPrompt(testBirth, chart);
  check("year-ahead prompt includes REAL TRANSIT DATA", prompt.includes("REAL TRANSIT DATA"));
  check("year-ahead prompt includes PLANETARY STATIONS", prompt.includes("PLANETARY STATIONS"));
  check("year-ahead prompt includes SIGN INGRESSES", prompt.includes("SIGN INGRESSES"));
  check("year-ahead prompt includes TRANSIT ASPECTS", prompt.includes("TRANSIT ASPECTS"));
}

// 6. Blind reading uses transit engine
console.log("\n6. Blind reading transit data");
const blindDef = getProduct("blind-reading");
check("blind-reading registered", blindDef != null);
if (blindDef.quickConfig) {
  const chart = calculateChart(testBirth);
  const prompt = blindDef.quickConfig.buildUserPrompt(testBirth, chart);
  check("blind-reading prompt includes CURRENT TRANSITS", prompt.includes("CURRENT TRANSITS"));
}

// 7. Bundle integrity
console.log("\n7. Bundle integrity");
const ALL_BUNDLES = [
  "self-discovery-bundle", "love-bundle", "career-money-bundle", "full-reading-bundle",
];
for (const b of ALL_BUNDLES) {
  check(`${b} exists`, isBundle(b));
  const products = getBundleProducts(b);
  check(`${b} has products`, products != null && products.length > 0);
}

// Summary
console.log(`\n${"=".repeat(50)}`);
console.log(`PHASE 3 VERIFICATION: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log("ALL CHECKS PASSED ✓");
} else {
  console.log("SOME CHECKS FAILED ✗");
  process.exit(1);
}
