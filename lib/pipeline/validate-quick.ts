/**
 * lib/pipeline/validate-quick.ts
 *
 * Product-config-driven lightweight validator for Quick pipeline readings.
 * Checks structural integrity, word counts, zodiac accuracy, forbidden
 * content, and voice quality. Used with retry-once pattern.
 *
 * This validator is intentionally separate from validate-reading.ts which
 * is hardcoded to the $15 reading's 8-insight shape. This one reads its
 * expectations from QuickValidationConfig so adding a new product never
 * requires changing the validator.
 */

import type { ChartData, PlanetPosition } from "@/lib/types";

/* ═════════════════════════════════════════════════════════════════
   CONFIG
═════════════════════════════════════════════════════════════════ */

const SHARED_FORBIDDEN_WORDS = [
  "journey", "manifest", "universe", "soul", "empath", "abundance",
  "alignment", "authentic", "portal", "energy", "vibration", "divine",
  "sacred", "awakening", "ascension", "twin flame", "lightworker",
  "starseed", "higher self", "spiritual awakening", "cosmic energy",
];

const FORBIDDEN_CLAIMS_PATTERNS = [
  /\bmedical\s+advice\b/i,
  /\bdiagnos/i,
  /\bsee\s+a\s+doctor\b/i,
  /\bsee\s+a\s+therapist\b/i,
  /\binvest\s+in\b/i,
  /\bbuy\s+(stocks?|crypto|bitcoin|ethereum)\b/i,
  /\blegal\s+advice\b/i,
  /\bprescri/i,
];

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

/* ═════════════════════════════════════════════════════════════════
   TYPES
═════════════════════════════════════════════════════════════════ */

export interface QuickValidationConfig {
  expectedSections: number;
  minWordsPerSection: number;
  maxWordsPerSection: number;
  chart?: ChartData;
  customerName?: string;
  forbiddenWords?: readonly string[];
  requireVoiceAnchors?: boolean;
  sectionField?: string;
}

export interface QuickValidationIssue {
  field: string;
  problem: string;
  severity: "fatal" | "warning";
}

export interface QuickValidationResult {
  ok: boolean;
  issues: QuickValidationIssue[];
  metrics: {
    totalWords: number;
    sectionWordCounts: number[];
    hasFatalIssues: boolean;
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
  return /—/.test(s);
}

function hasEnDash(s: string): boolean {
  return /–/.test(s);
}

function buildPlanetSignMap(chart: ChartData): Map<string, string> {
  const map = new Map<string, string>();
  for (const p of chart.planets) {
    map.set(p.name.toLowerCase(), p.sign);
  }
  if (chart.ascendant) {
    map.set("rising", chart.ascendant.sign);
    map.set("ascendant", chart.ascendant.sign);
  }
  if (chart.midheaven) {
    map.set("midheaven", chart.midheaven.sign);
    map.set("mc", chart.midheaven.sign);
  }
  return map;
}

const PLACEMENT_PATTERN = /\b(Sun|Moon|Mercury|Venus|Mars|Jupiter|Saturn|Uranus|Neptune|Pluto|Rising|Ascendant|Midheaven|MC)\s+in\s+(Aries|Taurus|Gemini|Cancer|Leo|Virgo|Libra|Scorpio|Sagittarius|Capricorn|Aquarius|Pisces)\b/gi;

function checkZodiacAccuracy(
  text: string,
  chart: ChartData,
  issues: QuickValidationIssue[]
): number {
  const planetSigns = buildPlanetSignMap(chart);
  let claimsFound = 0;
  let match: RegExpExecArray | null;

  const re = new RegExp(PLACEMENT_PATTERN.source, "gi");
  while ((match = re.exec(text)) !== null) {
    claimsFound++;
    const planet = match[1].toLowerCase();
    const claimedSign = match[2];
    const actualSign = planetSigns.get(planet);

    if (actualSign && actualSign !== claimedSign) {
      issues.push({
        field: "zodiac_accuracy",
        problem: `AI says "${match[1]} in ${claimedSign}" but chart has ${match[1]} in ${actualSign}.`,
        severity: "fatal",
      });
    }
  }

  return claimsFound;
}

/* ═════════════════════════════════════════════════════════════════
   MAIN VALIDATOR
═════════════════════════════════════════════════════════════════ */

export function validateQuickReading(
  output: Record<string, unknown>,
  config: QuickValidationConfig
): QuickValidationResult {
  const issues: QuickValidationIssue[] = [];
  const sectionWordCounts: number[] = [];
  const fullText = JSON.stringify(output);

  // ── 1. Em-dash / en-dash ban ──────────────────────────────────
  if (hasEmDash(fullText)) {
    issues.push({
      field: "punctuation",
      problem: "Contains em-dash (—). Punctuation law violated.",
      severity: "fatal",
    });
  }
  if (hasEnDash(fullText)) {
    issues.push({
      field: "punctuation",
      problem: "Contains en-dash (–). Punctuation law violated.",
      severity: "fatal",
    });
  }

  // ── 2. Forbidden words ────────────────────────────────────────
  const allForbidden = [
    ...SHARED_FORBIDDEN_WORDS,
    ...(config.forbiddenWords ?? []),
  ];
  const textLower = fullText.toLowerCase();
  for (const word of allForbidden) {
    if (textLower.includes(word.toLowerCase())) {
      issues.push({
        field: "forbidden_words",
        problem: `Contains forbidden word/phrase: "${word}".`,
        severity: "fatal",
      });
    }
  }

  // ── 3. Forbidden claims (medical/legal/financial) ─────────────
  for (const pattern of FORBIDDEN_CLAIMS_PATTERNS) {
    if (pattern.test(fullText)) {
      issues.push({
        field: "forbidden_claims",
        problem: `Contains potentially dangerous claim matching: ${pattern.source}`,
        severity: "fatal",
      });
    }
  }

  // ── 4. Zodiac sign accuracy (skip if no chart, e.g. tarot products) ──
  const placementClaims = config.chart
    ? checkZodiacAccuracy(fullText, config.chart, issues)
    : 999;

  // ── 5. Generic text detection ─────────────────────────────────
  if (config.chart && placementClaims < 2) {
    issues.push({
      field: "specificity",
      problem: `Only ${placementClaims} specific placement references found. Reading may be too generic.`,
      severity: "fatal",
    });
  }

  // ── 6. Section-level checks ───────────────────────────────────
  const sections = config.sectionField
    ? extractSectionsByField(output, config.sectionField)
    : extractSections(output);

  if (config.expectedSections > 0 && sections.length !== config.expectedSections) {
    issues.push({
      field: "section_count",
      problem: `Expected ${config.expectedSections} sections, got ${sections.length}.`,
      severity: "fatal",
    });
  }

  for (let i = 0; i < sections.length; i++) {
    const wc = wordCount(sections[i]);
    sectionWordCounts.push(wc);

    if (wc < config.minWordsPerSection) {
      issues.push({
        field: `section[${i}]`,
        problem: `Too short: ${wc} words, minimum ${config.minWordsPerSection}.`,
        severity: "fatal",
      });
    }

    if (wc > config.maxWordsPerSection) {
      issues.push({
        field: `section[${i}]`,
        problem: `Too long: ${wc} words, maximum ${config.maxWordsPerSection}.`,
        severity: "warning",
      });
    }
  }

  // ── 7. Required fields check ──────────────────────────────────
  for (const [key, val] of Object.entries(output)) {
    if (val === null || val === undefined || val === "") {
      issues.push({
        field: key,
        problem: `Required field "${key}" is empty.`,
        severity: "fatal",
      });
    }
  }

  // ── 8. Name usage ─────────────────────────────────────────────
  if (config.customerName) {
    const firstName = config.customerName.split(/\s+/)[0].toLowerCase();
    const nameCount = (textLower.match(new RegExp(`\\b${escapeRegex(firstName)}\\b`, "g")) || []).length;

    if (nameCount === 0) {
      issues.push({
        field: "name_usage",
        problem: "Customer name not used anywhere in reading.",
        severity: "warning",
      });
    }
    if (nameCount > 8) {
      issues.push({
        field: "name_usage",
        problem: `Customer name used ${nameCount} times (excessive).`,
        severity: "warning",
      });
    }
  }

  const totalWords = sectionWordCounts.reduce((a, b) => a + b, 0);
  const fatalIssues = issues.filter((i) => i.severity === "fatal");

  return {
    ok: fatalIssues.length === 0,
    issues,
    metrics: {
      totalWords,
      sectionWordCounts,
      hasFatalIssues: fatalIssues.length > 0,
    },
  };
}

/* ═════════════════════════════════════════════════════════════════
   SECTION EXTRACTION
   Walks the output object looking for string fields that contain
   body text. Works for any tool-use output shape.
═════════════════════════════════════════════════════════════════ */

function extractSectionsByField(
  output: Record<string, unknown>,
  fieldName: string
): string[] {
  const sections: string[] = [];

  function walk(val: unknown): void {
    if (Array.isArray(val)) {
      for (const item of val) walk(item);
    } else if (val && typeof val === "object") {
      const obj = val as Record<string, unknown>;
      if (typeof obj[fieldName] === "string") {
        sections.push(obj[fieldName] as string);
      }
      for (const v of Object.values(obj)) {
        if (v !== obj[fieldName]) walk(v);
      }
    }
  }

  walk(output);
  return sections;
}

function extractSections(output: Record<string, unknown>): string[] {
  const sections: string[] = [];

  function walk(val: unknown): void {
    if (typeof val === "string" && val.length > 100) {
      sections.push(val);
    } else if (Array.isArray(val)) {
      for (const item of val) walk(item);
    } else if (val && typeof val === "object") {
      for (const v of Object.values(val as Record<string, unknown>)) {
        walk(v);
      }
    }
  }

  walk(output);
  return sections;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
