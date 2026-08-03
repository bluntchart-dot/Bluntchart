/**
 * lib/premium/telemetry.ts
 *
 * Structured telemetry emitted once per generation. Enough to debug a
 * specific customer's reading later without storing PII beyond what the
 * reading itself already contains.
 *
 * For MVP this just writes to console. Later a real sink (Vercel Logs,
 * Datadog, etc.) can be swapped in without changing callers.
 */

import type { InsightGenerationStatus } from "./insights/types";

export type QaOutcome = "clean" | "regenerated" | "shipped_with_warnings" | "failed";
export type ErrorCategory =
  | "INTERPRETATION_FAILED"
  | "GENERATION_FAILED"
  | "HARD_QA_FAILED"
  | "STORE_LOCK_HELD"
  | "GEO_UNRESOLVED"
  | "CHART_FAILED"
  | null;

export interface GenerationTelemetry {
  generationRequestId: string;

  productVersion: string;
  insightEngineVersion: string;
  blueprintVersion: string;
  promptVersion: string;

  modelId: string;
  provider: string;

  signalCount: number;
  insightGenerationStatus: InsightGenerationStatus;
  insightsGenerated: number;
  insightsInvalid: number;
  invalidReasons: Record<string, number>;

  qaOutcome: QaOutcome;
  qaHardFlags: number;
  qaSoftFlags: number;
  regeneratedChapters: string[];

  totalAiCalls: number;
  tokens: {
    input: number;
    output: number;
    cacheRead: number;
    cacheCreation: number;
  };
  latencyMs: {
    interpret: number;
    generate: number;
    total: number;
  };

  errorCategory: ErrorCategory;
  errorMessage?: string;
}

export function emitTelemetry(t: GenerationTelemetry): void {
  try {
    // Single structured line. Downstream log processors can parse.
    // eslint-disable-next-line no-console
    console.log(`[premium/telemetry] ${JSON.stringify(t)}`);
  } catch {
    /* telemetry must never break generation */
  }
}
