/**
 * lib/premium/ai/models.ts
 *
 * Registry of AI models the Premium Reading Engine can call.
 *
 * Each entry maps a stable local id (e.g. `haiku-4-5`) to its provider
 * and provider-native model string. This is the only place model strings
 * live — nothing else in the engine hardcodes them.
 */

import type { AiModelConfig, AiModelId } from "./types";

const REGISTRY: Record<AiModelId, AiModelConfig> = {
  "haiku-4-5": {
    id: "haiku-4-5",
    provider: "anthropic",
    upstreamId: "claude-haiku-4-5",
    label: "Claude Haiku 4.5",
    maxOutputTokens: 24000,
    costPerMTokIn: 1,
    costPerMTokOut: 5,
  },
  "sonnet-5": {
    id: "sonnet-5",
    provider: "anthropic",
    upstreamId: "claude-sonnet-5",
    label: "Claude Sonnet 5",
    maxOutputTokens: 32000,
    costPerMTokIn: 3,
    costPerMTokOut: 15,
  },
  "opus-4-8": {
    id: "opus-4-8",
    provider: "anthropic",
    upstreamId: "claude-opus-4-8",
    label: "Claude Opus 4.8",
    maxOutputTokens: 32000,
    costPerMTokIn: 5,
    costPerMTokOut: 25,
  },
  "gemini-flash": {
    id: "gemini-flash",
    provider: "google",
    upstreamId: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    maxOutputTokens: 32000,
    costPerMTokIn: 0.30,
    costPerMTokOut: 2.50,
  },
  "gemini-pro": {
    id: "gemini-pro",
    provider: "google",
    upstreamId: "gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
    maxOutputTokens: 32000,
    costPerMTokIn: 1.25,
    costPerMTokOut: 10,
  },
};

export const DEFAULT_MODEL: AiModelId = "haiku-4-5";

export function getModelConfig(id: AiModelId): AiModelConfig {
  const cfg = REGISTRY[id];
  if (!cfg) throw new Error(`[ai/models] Unknown model id: ${id}`);
  return cfg;
}

export function listModels(): readonly AiModelConfig[] {
  return Object.values(REGISTRY);
}

/** Only the ids for models whose provider is implemented today. */
export const IMPLEMENTED_MODEL_IDS: readonly AiModelId[] = [
  "haiku-4-5",
  "sonnet-5",
  "opus-4-8",
];
