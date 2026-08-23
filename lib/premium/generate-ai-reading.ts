/**
 * lib/premium/generate-ai-reading.ts
 *
 * V1.2 orchestration — Reader Insight Map pipeline.
 *
 * Normal path (2 AI calls):
 *   1. Chart calculation                            [TS]
 *   2. Signal extraction                            [TS]
 *   3. Selection                                    [TS]
 *   4. AI interpretation → insight map              [AI #1, Haiku]
 *   5. Deterministic validation                     [TS]
 *   6. Scheduler → chapter assignments              [TS]
 *   7. Main book generation                         [AI #2, requested model]
 *   8. QA scan (hard + soft)                        [TS]
 *   9. Assemble PremiumReading                      [TS]
 *
 * Exception paths (bounded):
 *   - Interpretation attempt 1 fails / <10 valid → retry with feedback
 *   - Retry still fails → deterministic fallback (status: "fallback")
 *   - Main generation timeout / malformed → 1 retry → return failure
 *   - QA hard-flags ≤3 chapters → regenerate flagged chapters
 *   - QA hard-flags >3 chapters → FAIL generation (do NOT deliver
 *     structurally invalid reading)
 *   - QA soft-flags ≤3 chapters, severity ≥ 0.5 → regenerate
 *
 * Idempotency: caller provides generationRequestId. NullReadingStore is
 * the default (regenerate every request); real store swaps in later.
 */

import { randomUUID } from "node:crypto";
import { calculateChart } from "@/lib/chart-calculator";
import { geocodeCity } from "@/lib/geocode-city";
import type { BirthData, ChartData } from "@/lib/types";
import { buildBuiltUsing } from "./built-using";
import type { PremiumBirthDetails } from "./build-mock-reading";
import { buildReaderAnchor, buildSectionChartContext } from "./chart-context";
import { getProduct } from "./products/registry";
import {
  READING_VERSION,
  type BlueprintSection,
  type BuiltUsingItem,
  type PremiumReading,
  type PremiumReadingDebug,
  type ReadingProduct,
  type RenderedSection,
  type RenderHints,
} from "./types";

import { AnthropicProvider } from "./ai/anthropic-provider";
import { getModelConfig } from "./ai/models";
import type {
  AiGenerationRequest,
  AiSectionRequest,
  AiTelemetry,
  AiModelId,
} from "./ai/types";
import type { ChapterPromptContext } from "./ai/prompt-builder";

import { extractAllSignals } from "./insights/extractors";
import { selectSignalsForInterpretation } from "./insights/selector";
import { interpretInsightsOnce } from "./insights/interpreter";
import { validateInsights } from "./insights/validator";
import { buildFallbackInsights } from "./insights/fallback";
import { scheduleInsights } from "./insights/scheduler";
import { Ledger, seedKnownBannedImages } from "./insights/ledger";
import type {
  InsightAssignment,
  InsightGenerationStatus,
  ReaderInsight,
  Signal,
} from "./insights/types";

import { runHardChecks, type ChapterUnderReview as HardCUR } from "./qa/hard-checks";
import { runRepetitionScan, type ChapterUnderReview as SoftCUR } from "./qa/repetition";

import type { ReadingStore } from "./store/types";
import { NullReadingStore } from "./store/null-store";
import {
  BLUEPRINT_VERSION,
  INSIGHT_ENGINE_VERSION,
  PRODUCT_VERSION,
  PROMPT_VERSION,
  getProductVersions,
} from "./versions";
import {
  emitTelemetry,
  type ErrorCategory,
  type GenerationTelemetry,
  type QaOutcome,
} from "./telemetry";

/* ─────────────────────────────────────────────────────────────────────
   Configuration constants
───────────────────────────────────────────────────────────────────── */

const AVERAGE_READING_WPM = 240;
const MIN_VIABLE_INSIGHTS = 10;    // below this we consider interpretation failed
const MAX_INTERPRETATION_ATTEMPTS = 2;
const MAX_REGEN_CHAPTERS = 3;
const SOFT_FLAG_REGEN_SEVERITY = 0.5;
const LOCK_TTL_MS = 180_000;

import type { ChapterProfile } from "./insights/types";

function partOneChapterIds(profiles: readonly ChapterProfile[]): Set<string> {
  return new Set(profiles.map((p) => p.section));
}

/* ─────────────────────────────────────────────────────────────────────
   Result types
───────────────────────────────────────────────────────────────────── */

export interface GenerateAiResult {
  ok: true;
  reading: PremiumReading;
  telemetry: AiTelemetry & { insight?: GenerationTelemetry };
}
export interface GenerateAiFailure {
  ok: false;
  error: string;
  errorCategory: ErrorCategory;
  telemetry?: Partial<AiTelemetry> & { insight?: GenerationTelemetry };
}

export interface GenerateAiOptions {
  readonly modelId: AiModelId;
  readonly product?: ReadingProduct;
  readonly generationRequestId?: string;
  readonly store?: ReadingStore;
}

/* ─────────────────────────────────────────────────────────────────────
   Small utilities
───────────────────────────────────────────────────────────────────── */

function estimateReadingMinutes(sections: RenderedSection[]): number {
  const totalWords = sections.reduce(
    (acc, s) => acc + s.body.trim().split(/\s+/).filter(Boolean).length,
    0
  );
  const raw = totalWords / AVERAGE_READING_WPM;
  return Math.max(5, Math.round(raw / 5) * 5);
}

function pageBackgroundForTheme(
  theme: BlueprintSection["pageTheme"]
): RenderHints["pageBackground"] {
  switch (theme) {
    case "warm":     return "warm-glow";
    case "night":    return "starfield";
    case "shadow":   return "plain";
    case "elevated": return "gradient";
    case "neutral":
    default:         return "gradient";
  }
}

async function resolveGeo(
  birth: PremiumBirthDetails
): Promise<{ lat: number; lng: number; timezone: string } | null> {
  if (birth.birth_lat != null && birth.birth_lng != null) {
    return {
      lat: birth.birth_lat,
      lng: birth.birth_lng,
      timezone: birth.timezone ?? "UTC",
    };
  }
  if (birth.birth_place) {
    const geocoded = await geocodeCity(birth.birth_place);
    if (geocoded) return geocoded;
  }
  return null;
}

function cleanBody(body: string): string {
  return body
    .replace(/—/g, ",")
    .replace(/–/g, ",")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* ─────────────────────────────────────────────────────────────────────
   Interpretation with retry + fallback
───────────────────────────────────────────────────────────────────── */

interface InterpretationOutcome {
  status: InsightGenerationStatus;
  insights: ReaderInsight[];
  invalidReasonCounts: Record<string, number>;
  latencyMs: number;
  tokens: { input: number; output: number; cacheRead: number; cacheCreation: number };
  attempts: number;
  errorMessage?: string;
}

async function interpretWithRetryAndFallback(
  provider: AnthropicProvider,
  readerName: string,
  selectedSignals: Signal[]
): Promise<InterpretationOutcome> {
  const tokenAccum = { input: 0, output: 0, cacheRead: 0, cacheCreation: 0 };
  let totalLatency = 0;
  let attempts = 0;
  const invalidReasons: Record<string, number> = {};
  let lastError: string | undefined;

  for (let attempt = 1; attempt <= MAX_INTERPRETATION_ATTEMPTS; attempt++) {
    attempts = attempt;
    const feedback = attempt === 2
      ? `Previous attempt produced too few valid insights. Rejection reasons observed: ${JSON.stringify(invalidReasons)}. Please cite ONLY the supplied signal IDs, respect category compatibility, keep patterns 6–40 words with second-person address, and avoid astrology vocabulary.`
      : undefined;

    const result = await interpretInsightsOnce(provider, readerName, selectedSignals, feedback);
    totalLatency += result.telemetry.wallMs;
    tokenAccum.input += result.telemetry.inputTokens;
    tokenAccum.output += result.telemetry.outputTokens;
    tokenAccum.cacheRead += result.telemetry.cacheReadTokens;
    tokenAccum.cacheCreation += result.telemetry.cacheCreationTokens;

    if (!result.ok) {
      lastError = result.telemetry.errorMessage;
      continue;
    }

    const validation = validateInsights(result.insights, selectedSignals);
    for (const r of validation.rejected) {
      invalidReasons[r.reason] = (invalidReasons[r.reason] ?? 0) + 1;
    }

    if (validation.valid.length >= MIN_VIABLE_INSIGHTS) {
      return {
        status: attempt === 1 ? "normal" : "retry_recovered",
        insights: [...validation.valid],
        invalidReasonCounts: invalidReasons,
        latencyMs: totalLatency,
        tokens: tokenAccum,
        attempts,
      };
    }
  }

  // Retry loop exhausted — fall back to deterministic rule table.
  const fallbackInsights = buildFallbackInsights(selectedSignals);
  return {
    status: "fallback",
    insights: fallbackInsights,
    invalidReasonCounts: invalidReasons,
    latencyMs: totalLatency,
    tokens: tokenAccum,
    attempts,
    errorMessage: lastError,
  };
}

/* ─────────────────────────────────────────────────────────────────────
   Build the main generation request from blueprint + assignments
───────────────────────────────────────────────────────────────────── */

interface BuildRequestParams {
  chart: ChartData;
  name: string;
  product: ReadingProduct;
  assignments: Partial<Record<string, InsightAssignment[]>>;
  ledger: Ledger;
  regenGuidance?: Record<string, string>;
}

function buildAiRequest(params: BuildRequestParams): AiGenerationRequest {
  const { chart, name, product, assignments, ledger, regenGuidance } = params;
  const def = getProduct(product);
  const guidelines = def.guidelines;
  const anchor = buildReaderAnchor(chart, name);
  const chapterProfiles = def.chapterProfiles;
  const PART_ONE_CHAPTER_IDS = partOneChapterIds(chapterProfiles);

  const sections: AiSectionRequest[] = [];
  const chapterContexts: Record<string, ChapterPromptContext> = {};

  const profileBySection = new Map(
    chapterProfiles.map((p) => [p.section, p])
  );

  for (const section of def.activeSections) {
    if (section.pageType !== "chapter") continue;
    const g = guidelines[section.id];
    if (!g) continue;
    const inputs = section.chartInputs ?? [];

    sections.push({
      id: section.id,
      title: section.title,
      subtitle: section.subtitle,
      narrativeForm: g.narrativeForm,
      emotionalObjective: g.emotionalObjective,
      tone: g.tone,
      desiredReaderFeeling: g.desiredReaderFeeling,
      writingStyle: g.writingStyle,
      transitionGoal: g.transitionGoal,
      approxWords: g.approxWords,
      // Legacy field used only by transit chapters.
      chartContext:
        inputs.length > 0
          ? buildSectionChartContext(chart, inputs)
          : "(this chapter is a synthesis chapter — draw on the reader's overall shape from the anchor above)",
    });

    // Part I chapters get the new insight-map context.
    if (PART_ONE_CHAPTER_IDS.has(section.id)) {
      const profile = profileBySection.get(section.id);
      const assignedInsights = assignments[section.id] ?? [];

      // "Previously owned by other chapters" ledger note.
      const previouslyOwned: { id: string; ownedBy: BlueprintSection["id"]; pattern: string }[] = [];
      const snap = ledger.snapshot();
      for (const [insightId, ownerChapter] of Object.entries(snap.ownedBy)) {
        if (ownerChapter === section.id) continue;
        // find pattern text from any assignment where this insight appears
        const patternText = findInsightPattern(assignments, insightId);
        if (patternText) {
          previouslyOwned.push({
            id: insightId,
            ownedBy: ownerChapter,
            pattern: patternText,
          });
        }
      }

      chapterContexts[section.id] = {
        assignments: assignedInsights,
        domainPalette: profile?.domainPalette ?? [],
        previouslyOwned,
        bannedImages: ledger.bannedImagesForChapter(section.id),
        kind: profile?.kind ?? "standard",
        regenerationGuidance: regenGuidance?.[section.id],
      };
    } else if (regenGuidance?.[section.id]) {
      // Transit chapter being regenerated with guidance.
      chapterContexts[section.id] = {
        regenerationGuidance: regenGuidance[section.id],
      };
    }
  }

  const readerOpener = [
    "# Reader Anchor",
    anchor.leanPortrait,
    "",
    anchor.silentReference,
  ].join("\n");

  const req: AiGenerationRequest = {
    readerName: name,
    readerOpener,
    sections,
    chapterContexts,
    productSystemPrompt: def.systemPrompt,
    productContractReminder: def.contractReminder,
    productReadingToolName: def.readingToolName,
  };
  return req;
}

function findInsightPattern(
  assignments: Partial<Record<string, InsightAssignment[]>>,
  insightId: string
): string | null {
  for (const list of Object.values(assignments)) {
    if (!list) continue;
    const found = list.find((a) => a.insight.id === insightId);
    if (found) return found.insight.pattern;
  }
  return null;
}

/* ─────────────────────────────────────────────────────────────────────
   Section rendering
───────────────────────────────────────────────────────────────────── */

function renderSectionsFromBodies(
  chart: ChartData,
  bodies: Record<string, string>,
  product: ReadingProduct
): RenderedSection[] {
  const def = getProduct(product);
  return def.activeSections.map((section) => {
    const body =
      section.pageType === "chapter"
        ? cleanBody(bodies[section.id] ?? "")
        : (section.staticBody ?? "");
    const chartInputs = section.chartInputs ?? [];
    const builtUsing: BuiltUsingItem[] | undefined =
      chartInputs.length > 0 ? buildBuiltUsing(chart, chartInputs) : undefined;
    const renderHints: RenderHints = {
      pageBackground: pageBackgroundForTheme(section.pageTheme),
    };
    return {
      id: section.id,
      order: section.order,
      part: section.part,
      pageType: section.pageType,
      pageTheme: section.pageTheme,
      title: section.title,
      subtitle: section.subtitle,
      body,
      builtUsing: builtUsing && builtUsing.length > 0 ? builtUsing : undefined,
      renderHints,
      chapterNumber: section.chapterNumber,
    };
  });
}

/* ─────────────────────────────────────────────────────────────────────
   QA execution
───────────────────────────────────────────────────────────────────── */

interface QaResult {
  hardFlags: ReturnType<typeof runHardChecks>;
  softFlags: ReturnType<typeof runRepetitionScan>;
}

function runQa(
  sections: RenderedSection[],
  ledger: Ledger,
  partOneIds: Set<string>
): QaResult {
  const chapters = sections.filter((s) => s.pageType === "chapter");
  const hardInput: HardCUR[] = chapters.map((c) => ({
    section: c.id,
    body: c.body,
  }));
  const softInput: SoftCUR[] = chapters.map((c) => ({
    section: c.id,
    body: c.body,
    isTransit: !partOneIds.has(c.id),
  }));
  return {
    hardFlags: runHardChecks(hardInput),
    softFlags: runRepetitionScan(softInput, ledger.snapshot().bannedImages),
  };
}

/* ─────────────────────────────────────────────────────────────────────
   Public entry
───────────────────────────────────────────────────────────────────── */

export async function generateAiReading(
  birth: PremiumBirthDetails,
  opts: GenerateAiOptions
): Promise<GenerateAiResult | GenerateAiFailure> {
  const started = Date.now();
  const product: ReadingProduct = opts.product ?? "birth-chart";
  const generationRequestId = opts.generationRequestId ?? randomUUID();
  const store: ReadingStore = opts.store ?? new NullReadingStore();

  const model = getModelConfig(opts.modelId);
  const provider = new AnthropicProvider();

  // Idempotency: return cached if present.
  const cached = await store.get(generationRequestId);
  if (cached) {
    return { ok: true, reading: cached, telemetry: cached.debug?.telemetry as never };
  }

  const acquired = await store.tryLock(generationRequestId, LOCK_TTL_MS);
  if (!acquired) {
    return {
      ok: false,
      error: "GENERATION_IN_PROGRESS",
      errorCategory: "STORE_LOCK_HELD",
    };
  }

  const productDef = getProduct(product);
  const chapterProfiles = productDef.chapterProfiles;
  const PART_ONE_CHAPTER_IDS = partOneChapterIds(chapterProfiles);
  const pv = getProductVersions(product);

  const invalidReasonCounts: Record<string, number> = {};
  const tokenAccum = { input: 0, output: 0, cacheRead: 0, cacheCreation: 0 };
  let interpretMs = 0;
  let generateMs = 0;
  let totalAiCalls = 0;
  let insightStatus: InsightGenerationStatus = "normal";
  let qaOutcome: QaOutcome = "clean";
  let hardFlagCount = 0;
  let softFlagCount = 0;
  const regeneratedChapters: string[] = [];

  const emit = (
    errorCategory: ErrorCategory,
    errorMessage?: string
  ): void => {
    const telemetry: GenerationTelemetry = {
      generationRequestId,
      productVersion: pv.productVersion,
      insightEngineVersion: pv.insightEngineVersion,
      blueprintVersion: pv.blueprintVersion,
      promptVersion: pv.promptVersion,
      modelId: model.id,
      provider: "anthropic",
      signalCount: 0,
      insightGenerationStatus: insightStatus,
      insightsGenerated: 0,
      insightsInvalid: 0,
      invalidReasons: invalidReasonCounts,
      qaOutcome: errorCategory ? "failed" : qaOutcome,
      qaHardFlags: hardFlagCount,
      qaSoftFlags: softFlagCount,
      regeneratedChapters,
      totalAiCalls,
      tokens: tokenAccum,
      latencyMs: {
        interpret: interpretMs,
        generate: generateMs,
        total: Date.now() - started,
      },
      errorCategory,
      errorMessage,
    };
    emitTelemetry(telemetry);
  };

  try {
    /* Step 1: geo + chart */
    const geo = await resolveGeo(birth);
    if (!geo) {
      await store.releaseLock(generationRequestId);
      emit("GEO_UNRESOLVED", "Could not resolve birth city");
      return {
        ok: false,
        error: "Could not locate the birth city. Please include the country name.",
        errorCategory: "GEO_UNRESOLVED",
      };
    }

    const birthData: BirthData = {
      name: birth.name,
      date: birth.dob,
      time: birth.birth_time,
      lat: geo.lat,
      lng: geo.lng,
      timezone: birth.timezone ?? geo.timezone,
      placeName: birth.birth_place,
    };

    let chart: ChartData;
    try {
      chart = calculateChart(birthData);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      await store.releaseLock(generationRequestId);
      emit("CHART_FAILED", msg);
      return {
        ok: false,
        error: `Chart calculation failed: ${msg}`,
        errorCategory: "CHART_FAILED",
      };
    }

    /* Step 2-3: extract + select signals */
    const allSignals = extractAllSignals(chart);
    const selectedSignals = selectSignalsForInterpretation(allSignals);

    /* Step 4-5: interpret + validate + fallback */
    const interp = await interpretWithRetryAndFallback(
      provider,
      birth.name,
      selectedSignals
    );
    totalAiCalls += interp.attempts;
    interpretMs = interp.latencyMs;
    tokenAccum.input += interp.tokens.input;
    tokenAccum.output += interp.tokens.output;
    tokenAccum.cacheRead += interp.tokens.cacheRead;
    tokenAccum.cacheCreation += interp.tokens.cacheCreation;
    insightStatus = interp.status;
    for (const [k, v] of Object.entries(interp.invalidReasonCounts)) {
      invalidReasonCounts[k] = v;
    }
    const validInsights = interp.insights;

    /* Step 6: schedule */
    const { assignments, ledger } = scheduleInsights(
      validInsights,
      chapterProfiles
    );
    seedKnownBannedImages(ledger);

    /* Step 7: main book generation */
    const aiRequest = buildAiRequest({
      chart,
      name: birth.name,
      product,
      assignments: assignments.assignments,
      ledger,
    });

    const genStarted = Date.now();
    const genResult = await provider.generate(aiRequest, model);
    generateMs = Date.now() - genStarted;
    totalAiCalls += 1;

    if (!genResult.ok) {
      // One retry for main generation
      const retryStarted = Date.now();
      const retry = await provider.generate(aiRequest, model);
      generateMs += Date.now() - retryStarted;
      totalAiCalls += 1;

      if (!retry.ok) {
        await store.releaseLock(generationRequestId);
        emit("GENERATION_FAILED", retry.error);
        return {
          ok: false,
          error: retry.error,
          errorCategory: "GENERATION_FAILED",
          telemetry: retry.telemetry,
        };
      }
      Object.assign(genResult, retry);
    }

    // Accumulate main gen tokens
    if (genResult.ok) {
      tokenAccum.input += genResult.telemetry.inputTokens;
      tokenAccum.output += genResult.telemetry.outputTokens;
      tokenAccum.cacheRead += genResult.telemetry.cacheReadTokens;
      tokenAccum.cacheCreation += genResult.telemetry.cacheCreationTokens;
    }

    if (!genResult.ok) {
      await store.releaseLock(generationRequestId);
      emit("GENERATION_FAILED", "Post-retry generation still failed");
      return {
        ok: false,
        error: "Generation failed after retry",
        errorCategory: "GENERATION_FAILED",
      };
    }

    let bodies = { ...genResult.body.bodies };
    let sections = renderSectionsFromBodies(chart, bodies, product);

    /* Step 8: QA */
    let qa = runQa(sections, ledger, PART_ONE_CHAPTER_IDS);
    hardFlagCount = qa.hardFlags.length;
    softFlagCount = qa.softFlags.length;

    // Hard-QA gate — >3 hard flags = fail generation.
    if (qa.hardFlags.length > MAX_REGEN_CHAPTERS) {
      qaOutcome = "failed";
      await store.releaseLock(generationRequestId);
      emit("HARD_QA_FAILED", `${qa.hardFlags.length} hard flags`);
      return {
        ok: false,
        error: `Structural QA failed on ${qa.hardFlags.length} chapters. Not delivering.`,
        errorCategory: "HARD_QA_FAILED",
      };
    }

    // Identify chapters to regenerate, prioritised by highest meaningful
    // severity rather than encounter order.
    //
    // Hard flags always count and are treated as severity 1.0.
    // Soft flags count only when they meet SOFT_FLAG_REGEN_SEVERITY.
    // If more chapters are eligible than MAX_REGEN_CHAPTERS, the highest-
    // severity chapters win — earlier code walked flags in FIFO order,
    // which meant a lower-severity flag could grab a regen slot before
    // a higher-severity one and crowd it out. Ties fall back to first-
    // encountered chapter.
    const chapterMaxSeverity = new Map<string, number>();
    for (const f of qa.hardFlags) {
      const cur = chapterMaxSeverity.get(f.section) ?? 0;
      if (1.0 > cur) chapterMaxSeverity.set(f.section, 1.0);
    }
    for (const f of qa.softFlags) {
      if (f.severity < SOFT_FLAG_REGEN_SEVERITY) continue;
      const cur = chapterMaxSeverity.get(f.section) ?? 0;
      if (f.severity > cur) chapterMaxSeverity.set(f.section, f.severity);
    }
    const rankedForRegen = [...chapterMaxSeverity.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_REGEN_CHAPTERS)
      .map(([section]) => section);
    const toRegen = new Set<string>(rankedForRegen);

    if (toRegen.size > 0) {
      // Build regen guidance per flagged chapter.
      const guidance: Record<string, string> = {};
      for (const s of toRegen) {
        const notes: string[] = [];
        for (const f of qa.hardFlags) {
          if (f.section === s) notes.push(`HARD (${f.reason}): ${f.detail}`);
        }
        for (const f of qa.softFlags) {
          if (f.section === s) notes.push(`SOFT (${f.reason}): ${f.detail}`);
        }
        guidance[s] = `This chapter failed QA. Fix these before rewriting:\n- ${notes.join("\n- ")}`;
      }

      const regenRequest = buildAiRequest({
        chart,
        name: birth.name,
        product,
        assignments: assignments.assignments,
        ledger,
        regenGuidance: guidance,
      });
      const regenStarted = Date.now();
      const regenResult = await provider.generate(regenRequest, model);
      generateMs += Date.now() - regenStarted;
      totalAiCalls += 1;

      if (regenResult.ok) {
        tokenAccum.input += regenResult.telemetry.inputTokens;
        tokenAccum.output += regenResult.telemetry.outputTokens;
        tokenAccum.cacheRead += regenResult.telemetry.cacheReadTokens;
        tokenAccum.cacheCreation += regenResult.telemetry.cacheCreationTokens;
        // Replace only the flagged chapters' bodies.
        for (const s of toRegen) {
          if (regenResult.body.bodies[s]) {
            bodies[s] = regenResult.body.bodies[s];
            regeneratedChapters.push(s);
          }
        }
        sections = renderSectionsFromBodies(chart, bodies, product);
        // Re-scan; we do NOT loop again — one pass max.
        qa = runQa(sections, ledger, PART_ONE_CHAPTER_IDS);
        hardFlagCount = qa.hardFlags.length;
        softFlagCount = qa.softFlags.length;
        qaOutcome = "regenerated";
        // If regeneration still leaves hard flags AND >3 remain — fail.
        if (qa.hardFlags.length > MAX_REGEN_CHAPTERS) {
          await store.releaseLock(generationRequestId);
          emit("HARD_QA_FAILED", `Post-regen still ${qa.hardFlags.length} hard flags`);
          return {
            ok: false,
            error: "Structural QA still failed after regeneration.",
            errorCategory: "HARD_QA_FAILED",
          };
        }
        if (qa.hardFlags.length > 0) {
          qaOutcome = "shipped_with_warnings";
        }
      } else {
        // Regen call itself failed. If we still had valid initial output,
        // ship what we have with a warning marker.
        qaOutcome = "shipped_with_warnings";
      }
    }

    /* Step 9: assemble */
    const def = productDef;
    const debug: PremiumReadingDebug = {
      insightMap: validInsights,
      chapterAssignments: Object.fromEntries(
        Object.entries(assignments.assignments).map(([sec, list]) => [
          sec,
          (list ?? []).map((a) => `${a.kind}:${a.insight.id}`),
        ])
      ),
      qaFlags: {
        hard: qa.hardFlags,
        soft: qa.softFlags,
        underfilledChapters: assignments.underfilled,
      },
    };

    const reading: PremiumReading = {
      meta: {
        readingVersion: READING_VERSION,
        product,
        name: birth.name,
        dob: birth.dob,
        birthTime: birth.birth_time,
        birthPlace: birth.birth_place,
        generatedAt: new Date().toISOString(),
        estimatedReadingMinutes: estimateReadingMinutes(sections),
        totalChapters: def.totalChapters,
        generationSource: model.id.startsWith("haiku")
          ? "haiku"
          : model.id.startsWith("sonnet")
            ? "sonnet"
            : model.id.startsWith("opus")
              ? "opus"
              : "unknown",
        productVersion: pv.productVersion,
        insightEngineVersion: pv.insightEngineVersion,
        promptVersion: pv.promptVersion,
        blueprintVersion: pv.blueprintVersion,
        modelId: model.id,
        provider: "anthropic",
        generationRequestId,
        insightGenerationStatus: insightStatus,
        qaOutcome,
      },
      chart,
      sections,
      debug,
    };

    await store.save(generationRequestId, reading);
    await store.releaseLock(generationRequestId);

    const genTelemetry: GenerationTelemetry = {
      generationRequestId,
      productVersion: pv.productVersion,
      insightEngineVersion: pv.insightEngineVersion,
      blueprintVersion: pv.blueprintVersion,
      promptVersion: pv.promptVersion,
      modelId: model.id,
      provider: "anthropic",
      signalCount: selectedSignals.length,
      insightGenerationStatus: insightStatus,
      insightsGenerated: validInsights.length,
      insightsInvalid: Object.values(invalidReasonCounts).reduce((a, b) => a + b, 0),
      invalidReasons: invalidReasonCounts,
      qaOutcome,
      qaHardFlags: hardFlagCount,
      qaSoftFlags: softFlagCount,
      regeneratedChapters,
      totalAiCalls,
      tokens: tokenAccum,
      latencyMs: {
        interpret: interpretMs,
        generate: generateMs,
        total: Date.now() - started,
      },
      errorCategory: null,
    };
    emitTelemetry(genTelemetry);

    // Compose the outer telemetry shape callers of generate-ai-reading
    // still expect (AiTelemetry). We wrap the insight telemetry.
    const outerTelemetry: AiTelemetry = {
      provider: "anthropic",
      modelId: model.id,
      upstreamId: model.upstreamId,
      inputTokens: tokenAccum.input,
      outputTokens: tokenAccum.output,
      cacheReadTokens: tokenAccum.cacheRead,
      cacheCreationTokens: tokenAccum.cacheCreation,
      wallMs: Date.now() - started,
      finishReason: "insight_pipeline",
    };

    return {
      ok: true,
      reading,
      telemetry: Object.assign(outerTelemetry, { insight: genTelemetry }),
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await store.releaseLock(generationRequestId);
    emit("GENERATION_FAILED", msg);
    return {
      ok: false,
      error: msg,
      errorCategory: "GENERATION_FAILED",
    };
  }
}
