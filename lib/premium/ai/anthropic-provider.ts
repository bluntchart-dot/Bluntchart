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
  AiRawToolCall,
  AiRawToolCallResult,
  AiTelemetry,
} from "./types";
import { buildSystemPrompt, buildUserPrompt } from "./prompt-builder";
import { getModelConfig } from "./models";

const DEFAULT_TOOL_NAME = "submit_birth_chart_reading";

function buildTool(sectionIds: readonly string[], toolName?: string) {
  const name = toolName ?? DEFAULT_TOOL_NAME;
  const properties: Record<string, unknown> = {};
  for (const id of sectionIds) {
    properties[id] = {
      type: "string",
      description: `Full chapter body for section id "${id}". Plain prose, paragraphs separated by a blank line. No headings, no lists.`,
    };
  }
  return {
    name,
    description:
      "Submit the finished reading by returning one body per requested section id.",
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
    const toolName = request.productReadingToolName ?? DEFAULT_TOOL_NAME;
    const tool = buildTool(sectionIds, toolName);

    try {
      const stream = this.client.messages.stream({
        model: model.upstreamId,
        max_tokens: model.maxOutputTokens,
        tools: [tool],
        tool_choice: { type: "tool", name: toolName },
        system: [
          {
            type: "text",
            text: buildSystemPrompt(request),
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
          error: `Model did not return the ${toolName} tool. finish_reason=${final.stop_reason ?? "unknown"}`,
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

  /**
   * One-shot structured tool call used by the insight interpreter and
   * any other auxiliary AI work. Uses `messages.create` (not stream)
   * because auxiliary payloads are small enough. Prompt-cached on both
   * system and user blocks.
   */
  async rawToolCall(call: AiRawToolCall): Promise<AiRawToolCallResult> {
    const started = Date.now();
    // Default to the cheapest fast model for interpretation work.
    const model = getModelConfig(call.modelId ?? "haiku-4-5");
    try {
      const response = await this.client.messages.create({
        model: model.upstreamId,
        max_tokens: call.maxTokens ?? 6000,
        tools: [call.tool as unknown as Anthropic.Tool],
        tool_choice:
          call.forceTool === false
            ? { type: "auto" }
            : { type: "tool", name: call.tool.name },
        system: [
          {
            type: "text",
            text: call.systemPrompt,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: call.userPrompt,
                cache_control: { type: "ephemeral" },
              },
            ],
          },
        ],
      });

      const wallMs = Date.now() - started;
      const toolBlock = response.content.find((b) => b.type === "tool_use");
      if (!toolBlock || toolBlock.type !== "tool_use") {
        return {
          ok: false,
          error: `Model did not call tool ${call.tool.name}. finish_reason=${response.stop_reason}`,
          telemetry: {
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
            cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
            cacheCreationTokens: response.usage.cache_creation_input_tokens ?? 0,
            wallMs,
            finishReason: String(response.stop_reason ?? "unknown"),
          },
        };
      }

      return {
        ok: true,
        body: toolBlock.input as unknown,
        telemetry: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
          cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
          cacheCreationTokens: response.usage.cache_creation_input_tokens ?? 0,
          wallMs,
          finishReason: String(response.stop_reason ?? "unknown"),
          upstreamId: model.upstreamId,
        },
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[ai/anthropic] rawToolCall failed:", msg);
      return {
        ok: false,
        error: `Anthropic tool call failed: ${msg}`,
        telemetry: {
          wallMs: Date.now() - started,
        },
      };
    }
  }
}
