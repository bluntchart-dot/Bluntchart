/**
 * lib/premium/ai/types.ts
 *
 * Provider-agnostic types for the AI layer.
 *
 * The Premium Reading Engine calls one of several providers (Anthropic
 * Haiku today; Sonnet, Opus, and Gemini later) through a single common
 * interface. Every provider maps its own SDK shape onto this contract so
 * the orchestrator and the rest of the engine don't have to know which
 * model is running.
 *
 * When adding a new provider:
 *   1. Add the model id to `AiModelId` below.
 *   2. Register the model in `lib/premium/ai/models.ts`.
 *   3. Implement the `AiProvider` interface in a new file.
 *   4. Wire the provider into `lib/premium/generate-ai-reading.ts`.
 * Nothing else in the engine should need to change.
 */

import type { SectionGuideline, SectionId } from "@/lib/premium/types";

/* ─── Model identifiers ───────────────────────────────────────────── */

export type AiModelId =
  | "haiku-4-5"
  | "sonnet-5"
  | "opus-4-8"
  | "gemini-flash"
  | "gemini-pro";

export type AiProviderId = "anthropic" | "google";

/* ─── Registered model config ─────────────────────────────────────── */

export interface AiModelConfig {
  readonly id: AiModelId;
  readonly provider: AiProviderId;
  /** The provider-native model name to call. */
  readonly upstreamId: string;
  /** Human label shown in the internal UI. */
  readonly label: string;
  /** Enough headroom for 14 chapters of prose. Streamed. */
  readonly maxOutputTokens: number;
  /** Rough per-1M USD cost for internal telemetry only. */
  readonly costPerMTokIn: number;
  readonly costPerMTokOut: number;
}

/* ─── Request / response shape passed through the interface ──────── */

export interface AiSectionRequest {
  readonly id: SectionId;
  readonly title: string;
  readonly subtitle?: string;
  readonly narrativeForm: SectionGuideline["narrativeForm"];
  readonly emotionalObjective: string;
  readonly tone: string;
  readonly desiredReaderFeeling: string;
  readonly writingStyle: string;
  readonly transitionGoal: string;
  readonly approxWords: readonly [number, number];
  /** Prose digest for this chapter's declared chartInputs. */
  readonly chartContext: string;
}

export interface AiGenerationRequest {
  readonly readerName: string;
  readerOpener: string;              // 1–2 sentence "reader identity" block
  readonly sections: readonly AiSectionRequest[];
}

export interface AiGenerationBody {
  /** One entry per section id, containing the chapter body. */
  readonly bodies: Record<string, string>;
}

export interface AiTelemetry {
  readonly provider: AiProviderId;
  readonly modelId: AiModelId;
  readonly upstreamId: string;
  readonly inputTokens: number;
  readonly outputTokens: number;
  readonly cacheReadTokens: number;
  readonly cacheCreationTokens: number;
  readonly wallMs: number;
  readonly finishReason: string;
}

export type AiGenerationResult =
  | { ok: true;  body: AiGenerationBody; telemetry: AiTelemetry }
  | { ok: false; error: string; telemetry?: Partial<AiTelemetry> };

/* ─── Provider contract ───────────────────────────────────────────── */

export interface AiProvider {
  readonly id: AiProviderId;
  /**
   * Generate the whole book in a single call. Implementations may stream
   * internally but must resolve with the full body once complete.
   */
  generate(
    request: AiGenerationRequest,
    model: AiModelConfig
  ): Promise<AiGenerationResult>;
}
