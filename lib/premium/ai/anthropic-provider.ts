/**
 * lib/premium/ai/anthropic-provider.ts
 *
 * Anthropic implementation of the AiProvider contract.
 *
 * Design decisions:
 *   - One big call. The user chose continuity over modular generation.
 *   - Tool-use for structured output. Every section's body must return
 *     under a stable key, so we force the model into a submit_reading
 *     tool whose input schema declares exactly the section ids we asked
 *     for. The generator then assembles the book by mapping ids to
 *     titles from the blueprint.
 *   - Streaming. Haiku 4.5 at max_tokens ≥ 24k needs streaming to avoid
 *     HTTP timeouts. The SDK's stream() + finalMessage() handles it.
 *   - Prompt caching. The system prompt + the (long) blueprint header
 *     of the user prompt are constant across every reader. We put a
 *     cache_control breakpoint after the header so the tail (chart
 *     placements per chapter) is the only uncached bit — ~90% saving on
 *     input tokens after the first reading in a 5-minute window.
 */

import Anthropic from "@anthropic-ai/sdk";
import {
  AiGenerationRequest,
  AiGenerationResult,
  AiModelConfig,
  AiProvider,
  AiTelemetry,
} from "./types";
import { buildSystemPrompt, buildUserPrompt } from "./prompt-builder";

const TOOL_NAME = "submit_birth_chart_reading";

function buildTool(sectionIds: readonly string[]) {
  const properties: Record<string, unknown> = {};
  for (const id of sectionIds) {
    properties[id] = {
      type: "string",
      description: `Full chapter body for section id "${id}". Plain prose, paragraphs separated by a blank line. No headings, no lists.`,
    };
  }
  return {
    name: TOOL_NAME,
    description:
      "Submit the finished book by returning one body per requested section id.",
    input_schema: {
      type: "object" as const,
      properties,
      required: [...sectionIds],
      additionalProperties: false,
    },
  };
}

export class AnthropicProvider implements AiProvider {
  readonly id = "anthropic" as const;

  private client: Anthropic;

  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey ?? process.env.ANTHROPIC_API_KEY,
    });
  }

  async generate(
    request: AiGenerationRequest,
    model: AiModelConfig
  ): Promise<AiGenerationResult> {
    const started = Date.now();
    const sectionIds = request.sections.map((s) => s.id);
    const tool = buildTool(sectionIds);

    try {
      const stream = this.client.messages.stream({
        model: model.upstreamId,
        max_tokens: model.maxOutputTokens,
        tools: [tool],
        tool_choice: { type: "tool", name: TOOL_NAME },
        system: [
          {
            type: "text",
            text: buildSystemPrompt(),
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: buildUserPrompt(request),
                cache_control: { type: "ephemeral" },
              },
            ],
          },
        ],
      });

      const final = await stream.finalMessage();
      const wallMs = Date.now() - started;

      const toolBlock = final.content.find((b) => b.type === "tool_use");
      if (!toolBlock || toolBlock.type !== "tool_use") {
        return {
          ok: false,
          error: `Model did not return the ${TOOL_NAME} tool. finish_reason=${final.stop_reason ?? "unknown"}`,
        };
      }

      const rawInput = toolBlock.input as Record<string, unknown>;
      const bodies: Record<string, string> = {};
      const missing: string[] = [];
      for (const id of sectionIds) {
        const v = rawInput[id];
        if (typeof v === "string" && v.trim().length > 0) {
          bodies[id] = v;
        } else {
          missing.push(id);
        }
      }

      if (missing.length > 0) {
        return {
          ok: false,
          error: `Missing chapter bodies for: ${missing.join(", ")}`,
          telemetry: {
            provider: this.id,
            modelId: model.id,
            upstreamId: model.upstreamId,
            inputTokens: final.usage.input_tokens,
            outputTokens: final.usage.output_tokens,
            cacheReadTokens: final.usage.cache_read_input_tokens ?? 0,
            cacheCreationTokens: final.usage.cache_creation_input_tokens ?? 0,
            wallMs,
            finishReason: String(final.stop_reason ?? "unknown"),
          },
        };
      }

      const telemetry: AiTelemetry = {
        provider: this.id,
        modelId: model.id,
        upstreamId: model.upstreamId,
        inputTokens: final.usage.input_tokens,
        outputTokens: final.usage.output_tokens,
        cacheReadTokens: final.usage.cache_read_input_tokens ?? 0,
        cacheCreationTokens: final.usage.cache_creation_input_tokens ?? 0,
        wallMs,
        finishReason: String(final.stop_reason ?? "unknown"),
      };

      return { ok: true, body: { bodies }, telemetry };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[ai/anthropic] generation failed:", msg);
      return {
        ok: false,
        error: `Anthropic call failed: ${msg}`,
        telemetry: {
          provider: this.id,
          modelId: model.id,
          upstreamId: model.upstreamId,
          wallMs: Date.now() - started,
        },
      };
    }
  }
}
