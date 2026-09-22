/**
 * lib/pipeline/tarot.ts
 *
 * Config-driven pipeline for tarot-based products.
 * Similar to quick.ts but draws cards instead of calculating charts.
 *
 * Flow:
 *   1. Draw cards using order-ID-seeded PRNG
 *   2. Build prompt from TarotProductConfig
 *   3. Single AI call with forced tool use
 *   4. Lightweight validation
 *   5. Retry once on fatal validation failure
 *   6. Return result
 */

import { dbError } from "@/lib/db/log";
import { drawCards, drawYesNo, type DrawnCard } from "@/lib/tarot/draw";
import { getSpread, type SpreadLayout } from "@/lib/tarot/spreads";
import {
  validateQuickReading,
  type QuickValidationResult,
  type QuickValidationConfig,
} from "./validate-quick";

/* ═════════════════════════════════════════════════════════════════
   TYPES
═════════════════════════════════════════════════════════════════ */

export interface TarotProductConfig {
  readonly model: string;
  readonly maxTokens: number;
  readonly temperature: number;
  readonly toolName: string;
  readonly toolSchema: object;
  readonly systemPrompt: string;
  readonly spreadId: string;
  readonly majorOnly?: boolean;
  readonly allowReversed?: boolean;
  readonly expectedSections: number;
  readonly minWordsPerSection: number;
  readonly maxWordsPerSection: number;
  readonly forbiddenWords?: readonly string[];
  readonly buildPrompt: TarotPromptBuilder;
}

export type TarotPromptBuilder =
  | { type: "spread"; fn: (drawn: readonly DrawnCard[], spread: SpreadLayout, question?: string) => string }
  | { type: "yesno"; fn: (drawn: DrawnCard, question: string) => string };

export interface TarotPipelineInput {
  seed: string;
  question?: string;
  customerName?: string;
}

export interface TarotPipelineResult {
  ok: boolean;
  reading: Record<string, unknown> | null;
  cards: readonly DrawnCard[] | null;
  validation: QuickValidationResult | null;
  attempts: number;
  error?: string;
}

/* ═════════════════════════════════════════════════════════════════
   ANTHROPIC API CALLER (same pattern as quick.ts)
═════════════════════════════════════════════════════════════════ */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

async function callTarotTool(
  config: TarotProductConfig,
  userPrompt: string
): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    dbError("tarot-pipeline", "Missing ANTHROPIC_API_KEY", "");
    return null;
  }

  const tool = {
    name: config.toolName,
    description: "Submit the complete tarot reading. Call this exactly once.",
    input_schema: config.toolSchema,
  };

  let res: Response;
  try {
    res = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: config.model,
        max_tokens: config.maxTokens,
        temperature: config.temperature,
        system: config.systemPrompt,
        tools: [tool],
        tool_choice: { type: "tool", name: config.toolName },
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
  } catch (err) {
    dbError(
      "tarot-pipeline",
      "Fetch threw",
      err instanceof Error ? err.message : String(err)
    );
    return null;
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    dbError("tarot-pipeline", "Anthropic error", body, { status: res.status });
    return null;
  }

  let data: any;
  try {
    data = await res.json();
  } catch (err) {
    dbError(
      "tarot-pipeline",
      "Response JSON parse failed",
      err instanceof Error ? err.message : String(err)
    );
    return null;
  }

  const content: any[] = Array.isArray(data?.content) ? data.content : [];
  const toolBlock = content.find(
    (b) => b && b.type === "tool_use" && b.name === config.toolName
  );

  if (!toolBlock?.input || typeof toolBlock.input !== "object") {
    dbError(
      "tarot-pipeline",
      "Model did not invoke tool",
      JSON.stringify(content).slice(0, 2000),
      { stop_reason: data?.stop_reason }
    );
    return null;
  }

  return toolBlock.input as Record<string, unknown>;
}

/* ═════════════════════════════════════════════════════════════════
   MAIN PIPELINE
═════════════════════════════════════════════════════════════════ */

export async function runTarotPipeline(
  input: TarotPipelineInput,
  config: TarotProductConfig
): Promise<TarotPipelineResult> {
  const spread = getSpread(config.spreadId);
  if (!spread) {
    return {
      ok: false, reading: null, cards: null,
      validation: null, attempts: 0,
      error: `Unknown spread: "${config.spreadId}"`,
    };
  }

  // Draw cards
  let drawn: DrawnCard[];
  if (config.buildPrompt.type === "yesno") {
    const result = drawYesNo(input.seed);
    drawn = [result.card];
  } else {
    drawn = drawCards({
      seed: input.seed,
      count: spread.positions.length,
      majorOnly: config.majorOnly,
      allowReversed: config.allowReversed ?? true,
      positions: spread.positions.map((p) => p.label),
    });
  }

  // Build prompt
  let userPrompt: string;
  if (config.buildPrompt.type === "yesno") {
    if (!input.question) {
      return {
        ok: false, reading: null, cards: drawn,
        validation: null, attempts: 0,
        error: "Yes/No tarot requires a question",
      };
    }
    userPrompt = config.buildPrompt.fn(drawn[0], input.question);
  } else {
    userPrompt = config.buildPrompt.fn(drawn, spread, input.question);
  }

  // Validation config (tarot readings have no chart data)
  const validationConfig: QuickValidationConfig = {
    expectedSections: config.expectedSections,
    minWordsPerSection: config.minWordsPerSection,
    maxWordsPerSection: config.maxWordsPerSection,
    customerName: input.customerName,
    forbiddenWords: config.forbiddenWords,
  };

  let lastReading: Record<string, unknown> | null = null;
  let lastValidation: QuickValidationResult | null = null;
  let attempts = 0;
  const maxAttempts = 2;
  let currentPrompt = userPrompt;

  while (attempts < maxAttempts) {
    attempts++;
    const reading = await callTarotTool(config, currentPrompt);

    if (!reading) {
      if (attempts >= maxAttempts) {
        return {
          ok: false, reading: null, cards: drawn,
          validation: null, attempts,
          error: "AI generation failed after retries",
        };
      }
      continue;
    }

    const validation = validateQuickReading(reading, validationConfig);
    lastReading = reading;
    lastValidation = validation;

    if (validation.ok) {
      return { ok: true, reading, cards: drawn, validation, attempts };
    }

    const fatalIssues = validation.issues
      .filter((i) => i.severity === "fatal")
      .map((i) => `- ${i.field}: ${i.problem}`);

    dbError(
      "tarot-pipeline",
      `Attempt ${attempts} failed validation`,
      fatalIssues.join(" | "),
      { attempts }
    );

    if (attempts < maxAttempts) {
      currentPrompt = userPrompt + "\n\n" +
        "IMPORTANT — your previous response failed quality checks. " +
        "Fix ALL of the following issues in your next response:\n" +
        fatalIssues.join("\n");
    }
  }

  return {
    ok: lastReading !== null,
    reading: lastReading,
    cards: drawn,
    validation: lastValidation,
    attempts,
  };
}
