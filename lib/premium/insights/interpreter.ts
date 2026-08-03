/**
 * lib/premium/insights/interpreter.ts
 *
 * The one small AI call in the insight pipeline. Structured tool-use,
 * validated deterministically afterwards.
 *
 * Contract with the model:
 *   - You are given ONLY the pre-extracted signals. You never see the
 *     raw chart. You cannot invent aspects/houses/degrees.
 *   - Every insight you return must cite `evidence.primary` (a supplied
 *     signal ID) and may optionally cite `evidence.supporting` (more IDs).
 *   - The `pattern` text must be plain-language psychology, no astrology
 *     vocabulary, second person, 6-40 words.
 *   - Return between 12 and 20 distinct insights, balanced across
 *     categories.
 *
 * The model is called through the AiProvider abstraction so future
 * provider swaps do not require changes here.
 */

import type { AiProvider } from "@/lib/premium/ai/types";
import type {
  InsightRejection,
  ReaderInsight,
  Signal,
} from "./types";

export interface InterpreterResult {
  readonly ok: boolean;
  readonly insights: readonly ReaderInsight[];
  readonly rejections: readonly InsightRejection[];
  readonly telemetry: {
    readonly attempts: number;
    readonly wallMs: number;
    readonly inputTokens: number;
    readonly outputTokens: number;
    readonly cacheReadTokens: number;
    readonly cacheCreationTokens: number;
    readonly finishReason: string | null;
    readonly errorMessage?: string;
  };
}

const INTERPRETER_TOOL_NAME = "submit_reader_insight_map";

export const INTERPRETER_SYSTEM_PROMPT = `You are a psychological interpreter. You compose plain-language reader insights from a supplied list of astrology signals.

Non-negotiable rules:
- Every insight you return must cite \`evidence.primary\` — a signal ID from my supplied list. You may add more signals via \`evidence.supporting\`.
- Do NOT invent signals. Do NOT reference placements, aspects, houses, degrees, or any astrology vocabulary that isn't already implicit in the supplied signals.
- The \`pattern\` text is plain-language psychology. Second person ("you", "your"). Between 6 and 40 words. Emotionally intelligent, not clinical. No aphorisms. No universal maxims. No "the universe" / "trust the process" / "you are enough" style lines.
- Never mention: sun, moon, mercury, venus, mars, jupiter, saturn, uranus, neptune, pluto, chiron, aries, taurus, gemini, cancer, leo, virgo, libra, scorpio, sagittarius, capricorn, aquarius, pisces, ascendant, midheaven, descendant, imum coeli, house, houses, degree, degrees, conjunct, square, trine, sextile, opposition, aspect, orb, retrograde, placement, zodiac, cosmic, horoscope.
- Insights must be DISTINCT. Do not restate the same idea in different words. If two signals point to the same psychological pattern, combine them into one insight with both in evidence.
- Combine 2–3 supplied signals into one insight when they reinforce the same pattern. This is the point of your role.

Return between 12 and 20 insights. Category balance target: at least 2 of "strength", at least 2 of "shadow" or "fear", at least 2 of "pattern", at least 1 of "gift", at least 1 of "desire", at least 1 of "contradiction". Not every category has to be filled — quality over quota.

The reader identity, chart facts, and voice are handled elsewhere. Your only job is the interpretation map.`;

interface InsightMapPayload {
  readonly insights: readonly {
    id?: string;
    pattern: string;
    evidence: {
      primary: string;
      supporting?: string[];
    };
    strength?: number;
    category: string;
    behavioralDomains?: string[];
    emotionalTone?: string;
    bestChapters?: string[];
  }[];
}

function buildInterpreterUserPrompt(
  readerName: string,
  signals: readonly Signal[],
  attemptFeedback?: string
): string {
  const parts: string[] = [];
  parts.push(`# Reader`);
  parts.push(`Name: ${readerName}`);
  parts.push("");
  parts.push(`# Supplied signals (${signals.length})`);
  parts.push("Only these are real. Any signal ID not in this list does not exist.");
  parts.push("");
  for (const s of signals) {
    parts.push(
      `- id: ${s.id}`
    );
    parts.push(`  kind: ${s.kind}`);
    parts.push(`  strength: ${s.strength.toFixed(2)}`);
    parts.push(`  description: ${s.description}`);
  }
  parts.push("");
  parts.push(
    `# Chapters this reader will encounter (advisory, for your bestChapters hints)`
  );
  parts.push(
    `before-we-begin, real-you, inner-fighter, blind-spot, love-patterns, shadow, growth-lesson, career, hidden-gift, safe-place, life-story`
  );
  if (attemptFeedback) {
    parts.push("");
    parts.push(`# Feedback from previous attempt`);
    parts.push(attemptFeedback);
  }
  parts.push("");
  parts.push(
    `Return the insight map now using the ${INTERPRETER_TOOL_NAME} tool.`
  );
  return parts.join("\n");
}

/**
 * Defensive enum whitelists — belt & braces even though the tool schema
 * enforces the same enums at the provider level. If any unknown value
 * slips through it is silently dropped (domain) or coerced to a safe
 * default (category / tone).
 */
const CATEGORY_WHITELIST = new Set([
  "strength","shadow","pattern","gift","fear","desire","contradiction",
  "restoration","growth-edge",
]);
const DOMAIN_WHITELIST = new Set([
  "work","love","friendships","family","money","decisions","communication",
  "routines","social-situations","private-thoughts","desire","conflict",
]);
const TONE_WHITELIST = new Set([
  "fiery","tender","protective","playful","vulnerable","hungry","quiet",
]);
const CHAPTER_WHITELIST = new Set([
  "before-we-begin","real-you","inner-fighter","blind-spot","love-patterns",
  "shadow","growth-lesson","career","hidden-gift","safe-place","life-story",
]);

function coerceInsight(
  raw: InsightMapPayload["insights"][number],
  index: number
): ReaderInsight {
  const category = raw.category && CATEGORY_WHITELIST.has(raw.category)
    ? (raw.category as ReaderInsight["category"])
    : "pattern";
  const tone = raw.emotionalTone && TONE_WHITELIST.has(raw.emotionalTone)
    ? (raw.emotionalTone as ReaderInsight["emotionalTone"])
    : "quiet";
  const domains = (raw.behavioralDomains ?? []).filter((d) =>
    DOMAIN_WHITELIST.has(d)
  ) as ReaderInsight["behavioralDomains"];
  const bestChapters = (raw.bestChapters ?? []).filter((c) =>
    CHAPTER_WHITELIST.has(c)
  ) as ReaderInsight["bestChapters"];
  return {
    id: raw.id ?? `ai_${index}`,
    pattern: raw.pattern,
    evidence: {
      primary: raw.evidence.primary,
      supporting: raw.evidence.supporting ?? [],
    },
    strength: typeof raw.strength === "number" ? raw.strength : 0.7,
    category,
    behavioralDomains: domains,
    emotionalTone: tone,
    bestChapters,
    origin: "ai",
  };
}

/**
 * Public entry — orchestrator calls this. Handles ONE attempt.
 * The orchestrator decides whether to retry (with feedback) or fall back.
 */
export async function interpretInsightsOnce(
  provider: AiProvider,
  readerName: string,
  signals: readonly Signal[],
  attemptFeedback?: string
): Promise<InterpreterResult> {
  const started = Date.now();

  // Enum-constrained schema. Category / domain / tone MUST be from our
  // taxonomy — the AI can no longer invent values like "self-actualization".
  // bestChapters is enum-constrained to actual Part I section ids.
  const CATEGORY_ENUM = [
    "strength", "shadow", "pattern", "gift", "fear",
    "desire", "contradiction", "restoration", "growth-edge",
  ];
  const DOMAIN_ENUM = [
    "work", "love", "friendships", "family", "money", "decisions",
    "communication", "routines", "social-situations", "private-thoughts",
    "desire", "conflict",
  ];
  const TONE_ENUM = [
    "fiery", "tender", "protective", "playful",
    "vulnerable", "hungry", "quiet",
  ];
  const CHAPTER_ENUM = [
    "before-we-begin", "real-you", "inner-fighter", "blind-spot",
    "love-patterns", "shadow", "growth-lesson", "career", "hidden-gift",
    "safe-place", "life-story",
  ];

  const tool = {
    name: INTERPRETER_TOOL_NAME,
    description:
      "Submit the reader insight map. Cite only supplied signal IDs as evidence. Choose category/domain/tone from the allowed enums only — do not invent values.",
    input_schema: {
      type: "object" as const,
      properties: {
        insights: {
          type: "array",
          minItems: 8,
          maxItems: 24,
          items: {
            type: "object",
            required: ["pattern", "evidence", "category"],
            properties: {
              id: { type: "string" },
              pattern: { type: "string" },
              evidence: {
                type: "object",
                required: ["primary"],
                properties: {
                  primary: { type: "string" },
                  supporting: { type: "array", items: { type: "string" } },
                },
              },
              strength: { type: "number" },
              category: { type: "string", enum: CATEGORY_ENUM },
              behavioralDomains: {
                type: "array",
                items: { type: "string", enum: DOMAIN_ENUM },
              },
              emotionalTone: { type: "string", enum: TONE_ENUM },
              bestChapters: {
                type: "array",
                items: { type: "string", enum: CHAPTER_ENUM },
              },
            },
          },
        },
      },
      required: ["insights"],
      additionalProperties: false,
    },
  };

  const result = await provider.rawToolCall({
    systemPrompt: INTERPRETER_SYSTEM_PROMPT,
    userPrompt: buildInterpreterUserPrompt(readerName, signals, attemptFeedback),
    tool,
    forceTool: true,
    maxTokens: 6000,
  });

  const wallMs = Date.now() - started;

  if (!result.ok) {
    return {
      ok: false,
      insights: [],
      rejections: [],
      telemetry: {
        attempts: 1,
        wallMs,
        inputTokens: result.telemetry?.inputTokens ?? 0,
        outputTokens: result.telemetry?.outputTokens ?? 0,
        cacheReadTokens: result.telemetry?.cacheReadTokens ?? 0,
        cacheCreationTokens: result.telemetry?.cacheCreationTokens ?? 0,
        finishReason: result.telemetry?.finishReason ?? null,
        errorMessage: result.error,
      },
    };
  }

  const payload = result.body as InsightMapPayload;
  const rawItems = payload?.insights ?? [];
  const insights = rawItems.map(coerceInsight);

  return {
    ok: true,
    insights,
    rejections: [],
    telemetry: {
      attempts: 1,
      wallMs,
      inputTokens: result.telemetry?.inputTokens ?? 0,
      outputTokens: result.telemetry?.outputTokens ?? 0,
      cacheReadTokens: result.telemetry?.cacheReadTokens ?? 0,
      cacheCreationTokens: result.telemetry?.cacheCreationTokens ?? 0,
      finishReason: result.telemetry?.finishReason ?? null,
    },
  };
}
