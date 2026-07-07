import { GoogleGenAI, Type } from "@google/genai";
import { MODELS, NATIVE_JSON_MODELS, ERROR_CODES } from "./config";

let _client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!_client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
    _client = new GoogleGenAI({ apiKey });
  }
  return _client;
}

export interface GeminiJsonOptions {
  model: string;
  prompt: string;
  schema?: Record<string, unknown>;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GeminiTextOptions {
  model: string;
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxOutputTokens?: number;
}

export interface GeminiResult<T = unknown> {
  ok: boolean;
  data?: T;
  text?: string;
  errorCode?: string;
  errorMessage?: string;
}

function classifyError(err: unknown): { code: string; message: string } {
  const msg = err instanceof Error ? err.message : String(err);

  if (msg.includes("429") || /quota/i.test(msg))
    return { code: ERROR_CODES.GEMINI_QUOTA_EXHAUSTED, message: msg.slice(0, 300) };

  if (msg.includes("404") || /not found/i.test(msg))
    return { code: ERROR_CODES.GEMINI_MODEL_UNAVAILABLE, message: msg.slice(0, 300) };

  return { code: ERROR_CODES.GEMINI_GENERATION_FAILED, message: msg.slice(0, 300) };
}

/**
 * Generate structured JSON output from Gemini.
 *
 * For models in NATIVE_JSON_MODELS, uses responseMimeType + responseSchema.
 * For thinking models (2.5+, 3.x), disables thinking to prevent preamble
 * text from breaking JSON parsing.
 */
export async function generateJson<T = unknown>(
  options: GeminiJsonOptions
): Promise<GeminiResult<T>> {
  const { model, prompt, schema, temperature = 0.2, maxOutputTokens = 2000 } = options;

  try {
    const ai = getClient();
    const useNativeSchema = NATIVE_JSON_MODELS.has(model);

    const config: Record<string, unknown> = {
      temperature,
      maxOutputTokens,
      responseMimeType: "application/json",
    };

    if (useNativeSchema && schema) {
      config.responseSchema = schema;
    } else {
      config.thinkingConfig = { thinkingBudget: 0 };
    }

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config,
    });

    const text = (response.text ?? "").trim();
    if (!text) {
      return { ok: false, errorCode: ERROR_CODES.GEMINI_INVALID_JSON, errorMessage: "Empty response" };
    }

    const jsonStr = extractJson(text);
    try {
      const data = JSON.parse(jsonStr) as T;
      return { ok: true, data, text: jsonStr };
    } catch {
      return { ok: false, errorCode: ERROR_CODES.GEMINI_INVALID_JSON, errorMessage: `Parse failed: ${text.slice(0, 200)}` };
    }
  } catch (err) {
    const { code, message } = classifyError(err);
    return { ok: false, errorCode: code, errorMessage: message };
  }
}

/**
 * Generate free-form text from Gemini (used for article writing).
 */
export async function generateText(
  options: GeminiTextOptions
): Promise<GeminiResult<string>> {
  const { model, prompt, systemInstruction, temperature = 0.7, maxOutputTokens = 8000 } = options;

  try {
    const ai = getClient();
    const config: Record<string, unknown> = { temperature, maxOutputTokens };

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config,
      ...(systemInstruction ? { systemInstruction } : {}),
    });

    const text = (response.text ?? "").trim();
    if (!text) {
      return { ok: false, errorCode: ERROR_CODES.GEMINI_GENERATION_FAILED, errorMessage: "Empty response" };
    }

    return { ok: true, data: text, text };
  } catch (err) {
    const { code, message } = classifyError(err);
    return { ok: false, errorCode: code, errorMessage: message };
  }
}

/**
 * Attempt generation with the primary model, fall back to the fallback
 * model on quota exhaustion or unavailability.
 */
export async function generateTextWithFallback(
  options: GeminiTextOptions
): Promise<GeminiResult<string>> {
  const result = await generateText(options);

  if (
    result.ok ||
    (result.errorCode !== ERROR_CODES.GEMINI_QUOTA_EXHAUSTED &&
      result.errorCode !== ERROR_CODES.GEMINI_MODEL_UNAVAILABLE)
  ) {
    return result;
  }

  if (options.model === MODELS.articleFallback) {
    return result;
  }

  return generateText({ ...options, model: MODELS.articleFallback });
}

/** Extract JSON from a string that may be wrapped in markdown fences. */
function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();

  const braceMatch = text.match(/\{[\s\S]*\}/);
  if (braceMatch) return braceMatch[0];

  const bracketMatch = text.match(/\[[\s\S]*\]/);
  if (bracketMatch) return bracketMatch[0];

  return text;
}

export { Type };
