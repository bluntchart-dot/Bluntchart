/**
 * reading-tool.ts
 *
 * Wraps the Anthropic Messages API with tool use, forcing the model to
 * return the reading as a structured JSON object that matches the schema
 * defined here. This is the durable fix for "format drifts between calls"
 * or "shape breaks over time".
 *
 * Uses fetch() directly to match the existing pattern in
 * generate-full-reading.ts. No SDK dependency.
 *
 * USAGE:
 *   import { generateFullReading } from "@/lib/reading-tool";
 *   const reading = await generateFullReading(birth, chart, focusArea);
 *   if (!reading) {
 *     // dbError already logged. Handle the failure however build-paid-reading wants.
 *   }
 */

import { dbError } from "@/lib/db/log";
import type { BirthData, ChartData } from "./types";
import {
  buildFullReadingPrompt,
  buildPreviewPrompt,
  FULL_SYSTEM_PROMPT,
  PREVIEW_SYSTEM_PROMPT,
  normalizeFocusArea,
  expectedPaidInsightCount,
  FocusAreaKey,
  AlreadyRevealedInsight,
} from "./claude-prompt";

/* ─────────────────────────────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────────────────────────────── */

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const ANTHROPIC_VERSION = "2023-06-01";

/**
 * Pinned model versions. Do NOT use "claude-sonnet-latest" or similar.
 * Pinning means Anthropic cannot swap models on you silently.
 */
export const FULL_READING_MODEL = "claude-sonnet-4-6";
export const PREVIEW_MODEL = "claude-haiku-4-5";

/* ─────────────────────────────────────────────────────────────────────
   TYPE SHAPES
   These match the JSON schemas below 1:1.
───────────────────────────────────────────────────────────────────── */

export interface PreviewInsight {
  planet: string;
  hook: string;
  truth: string;
  reveal: string;
  cliffhanger: string;
}

export interface PaidInsight {
  planet: string;
  truth: string;
  explain: string;
  action: string;
}

export interface ShareCardPayload {
  flexLine: string;
  line1: string;
  keyword: string;
  line2: string;
  line3: string;
  quote: string;
}

export interface FullReading {
  letter_opener: string;
  preview: PreviewInsight[];
  paidInsights: PaidInsight[];   // always 8 items
  shareCard: ShareCardPayload;
}

export interface PreviewReading {
  letter_opener: string;
  preview: PreviewInsight[];
}

/* ─────────────────────────────────────────────────────────────────────
   PREVIEW TOOL SCHEMA
───────────────────────────────────────────────────────────────────── */

const PREVIEW_TOOL = {
  name: "submit_preview_reading",
  description:
    "Submit the single free discovery for the user's birth chart. " +
    "Call this exactly once to deliver the discovery.",
  input_schema: {
    type: "object" as const,
    required: ["letter_opener", "preview"],
    properties: {
      letter_opener: { type: "string" },
      preview: {
        type: "array",
        minItems: 1,
        maxItems: 1,
        items: {
          type: "object",
          required: ["planet", "hook", "truth", "reveal", "cliffhanger"],
          properties: {
            planet: { type: "string" },
            hook: { type: "string" },
            truth: { type: "string" },
            reveal: { type: "string" },
            cliffhanger: { type: "string" },
          },
        },
      },
    },
  },
};

/* ─────────────────────────────────────────────────────────────────────
   FULL READING TOOL SCHEMA
   Always exactly 8 paid insights + 2 preview insights = 10 total.
───────────────────────────────────────────────────────────────────── */

function buildReadingToolSchema(_expectedCount: 8) {
  const standardExplainMinChars = 1100;   // ~210 words floor

  return {
    name: "submit_birth_chart_reading",
    description:
      `Submit the complete paid birth chart reading. Must include exactly 8 ` +
      `paid insights in the order specified, a letter_opener, the 2 preview insights, ` +
      `and a shareCard. Call this exactly once.`,
    input_schema: {
      type: "object" as const,
      required: ["letter_opener", "preview", "paidInsights", "shareCard"],
      properties: {
        letter_opener: { type: "string" },

        preview: {
          type: "array",
          minItems: 2,
          maxItems: 2,
          items: {
            type: "object",
            required: ["planet", "hook", "truth", "reveal", "cliffhanger"],
            properties: {
              planet: { type: "string" },
              hook: { type: "string" },
              truth: { type: "string" },
              reveal: { type: "string" },
              cliffhanger: { type: "string" },
            },
          },
        },

        paidInsights: {
          type: "array" as const,
          minItems: 8,
          maxItems: 8,
          items: {
            type: "object",
            required: ["planet", "truth", "explain", "action"],
            properties: {
              planet: { type: "string" },
              truth: { type: "string" },
              explain: { type: "string", minLength: standardExplainMinChars },
              action: { type: "string" },
            },
          },
        },

        shareCard: {
          type: "object",
          required: ["flexLine", "line1", "keyword", "line2", "line3", "quote"],
          properties: {
            flexLine: { type: "string", minLength: 90 },
            line1: { type: "string" },
            keyword: { type: "string" },
            line2: { type: "string" },
            line3: { type: "string" },
            quote: { type: "string" },
          },
        },
      },
    },
  };
}

/* ─────────────────────────────────────────────────────────────────────
   CORE CALLER
   Returns null on any failure. Logs to dbError before returning null.
   Matches the pattern used in generate-full-reading.ts.
───────────────────────────────────────────────────────────────────── */

interface ToolCallOpts {
  model: string;
  system: string;
  userPrompt: string;
  tool: { name: string; description: string; input_schema: object };
  maxTokens: number;
  temperature: number;
  context: string;  // used in dbError category for log filtering
}

async function callClaudeWithTool<T>(opts: ToolCallOpts): Promise<T | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    dbError(opts.context, "Missing ANTHROPIC_API_KEY", "");
    return null;
  }

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
        model: opts.model,
        max_tokens: opts.maxTokens,
        temperature: opts.temperature,
        system: opts.system,
        tools: [opts.tool],
        tool_choice: { type: "tool", name: opts.tool.name },
        messages: [{ role: "user", content: opts.userPrompt }],
      }),
    });
  } catch (err) {
    dbError(
      opts.context,
      "Fetch threw",
      err instanceof Error ? err.message : String(err)
    );
    return null;
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    dbError(opts.context, "Anthropic error", body, { status: res.status });
    return null;
  }

  let data: any;
  try {
    data = await res.json();
  } catch (err) {
    dbError(
      opts.context,
      "Response JSON parse failed",
      err instanceof Error ? err.message : String(err)
    );
    return null;
  }

  // Find the tool_use block.
  const content: any[] = Array.isArray(data?.content) ? data.content : [];
  const toolBlock = content.find(
    (b) => b && b.type === "tool_use" && b.name === opts.tool.name
  );

  if (!toolBlock || !toolBlock.input || typeof toolBlock.input !== "object") {
    dbError(
      opts.context,
      "Model did not invoke tool",
      JSON.stringify(content).slice(0, 2000),
      { stop_reason: data?.stop_reason }
    );
    return null;
  }

  return toolBlock.input as T;
}

/* ─────────────────────────────────────────────────────────────────────
   PUBLIC API
───────────────────────────────────────────────────────────────────── */

export async function generateFullReading(
  birth: BirthData,
  chart: ChartData,
  focusArea?: string | null,
  existingPreview?: AlreadyRevealedInsight[] | null
): Promise<FullReading | null> {
  const expectedCount = expectedPaidInsightCount(focusArea);
  const tool = buildReadingToolSchema(expectedCount);

  return callClaudeWithTool<FullReading>({
    model: FULL_READING_MODEL,
    system: FULL_SYSTEM_PROMPT,
    userPrompt: buildFullReadingPrompt(birth, chart, focusArea, existingPreview),
    tool,
    maxTokens: 8192,
    temperature: 0.9,
    context: "reading-tool:full",
  });
}

export async function generatePreviewReading(
  birth: BirthData,
  chart: ChartData,
  focusArea?: string | null
): Promise<PreviewReading | null> {
  return callClaudeWithTool<PreviewReading>({
    model: PREVIEW_MODEL,
    system: PREVIEW_SYSTEM_PROMPT,
    userPrompt: buildPreviewPrompt(birth, chart, focusArea),
    tool: PREVIEW_TOOL,
    maxTokens: 900,
    temperature: 0.9,
    context: "reading-tool:preview",
  });
}

/* ─────────────────────────────────────────────────────────────────────
   Re-exports so callers can import everything from one place.
───────────────────────────────────────────────────────────────────── */

export { normalizeFocusArea, expectedPaidInsightCount };
export type { FocusAreaKey };