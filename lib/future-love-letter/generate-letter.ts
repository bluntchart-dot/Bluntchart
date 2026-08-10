import { GoogleGenAI } from "@google/genai";
import { calculateChart } from "@/lib/chart-calculator";
import { timezoneAt } from "@/lib/geocode-city";
import { interpretChart } from "@/lib/future-love-letter/interpret-chart";
import {
  buildLetterSystemPrompt,
  buildLetterUserPrompt,
} from "@/lib/future-love-letter/letter-prompt";
import { GEMINI_MODEL } from "@/lib/future-love-letter/config";
import type { BirthData } from "@/lib/types";
import type { LetterResponse } from "@/lib/future-love-letter/types";

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const braceMatch = text.match(/\{[\s\S]*\}/);
  if (braceMatch) return braceMatch[0];
  return text;
}

function repairJsonString(raw: string): string {
  let result = "";
  let inString = false;
  let escaped = false;

  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];

    if (escaped) {
      result += ch;
      escaped = false;
      continue;
    }

    if (ch === "\\") {
      escaped = true;
      result += ch;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      result += ch;
      continue;
    }

    if (inString) {
      if (ch === "\n") { result += "\\n"; continue; }
      if (ch === "\r") { result += "\\r"; continue; }
      if (ch === "\t") { result += "\\t"; continue; }
    }

    result += ch;
  }

  return result;
}

export interface GenerateLetterInput {
  name: string;
  date: string;
  time: string;
  lat: number;
  lng: number;
  placeName?: string;
  timezone?: string;
}

export interface GenerateLetterResult {
  ok: boolean;
  letter?: string;
  shareableQuotes?: string[];
  error?: string;
  rateLimited?: boolean;
}

export async function generateLoveLetter(
  input: GenerateLetterInput,
): Promise<GenerateLetterResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "GEMINI_API_KEY not configured" };
  }

  const timezone = input.timezone || timezoneAt(input.lat, input.lng) || "UTC";

  const birthData: BirthData = {
    name: input.name,
    date: input.date,
    time: input.time,
    lat: input.lat,
    lng: input.lng,
    timezone,
    placeName: input.placeName || "",
  };

  const chart = calculateChart(birthData);
  const brief = interpretChart(chart);
  const systemPrompt = buildLetterSystemPrompt();
  const userPrompt = buildLetterUserPrompt(input.name, brief);

  const ai = new GoogleGenAI({ apiKey });

  const geminiConfig = {
    systemInstruction: systemPrompt,
    temperature: 0.85,
    maxOutputTokens: 4000,
    responseMimeType: "application/json" as const,
    responseSchema: {
      type: "object" as const,
      properties: {
        letter: { type: "string" as const, description: "The full love letter text" },
        shareableQuotes: {
          type: "array" as const,
          items: { type: "string" as const },
          description: "3 screenshot-worthy lines from the letter",
        },
      },
      required: ["letter", "shareableQuotes"],
    },
  };

  const MAX_ATTEMPTS = 2;
  let parsed: LetterResponse | null = null;
  let lastError = "";

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const config = attempt === 1
        ? geminiConfig
        : { ...geminiConfig, temperature: 0.6 };

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: userPrompt,
        config,
      });

      const rawText = (response.text ?? "").trim();
      if (!rawText) {
        lastError = "Empty Gemini response";
        continue;
      }

      const jsonStr = extractJson(rawText);
      let candidate: LetterResponse;
      try {
        candidate = JSON.parse(jsonStr) as LetterResponse;
      } catch {
        try {
          candidate = JSON.parse(repairJsonString(jsonStr)) as LetterResponse;
        } catch (repairErr) {
          lastError = repairErr instanceof Error ? repairErr.message : String(repairErr);
          console.error(`[generate-letter] Attempt ${attempt} parse failed`);
          continue;
        }
      }

      if (!candidate.letter || typeof candidate.letter !== "string") {
        lastError = "Missing letter field";
        continue;
      }

      parsed = candidate;
      break;
    } catch (genErr) {
      lastError = genErr instanceof Error ? genErr.message : String(genErr);
      const errStr = typeof genErr === "object" ? JSON.stringify(genErr) : lastError;
      if (errStr.includes("429") || /quota|RESOURCE_EXHAUSTED/i.test(errStr)) {
        return { ok: false, error: "Rate limited", rateLimited: true };
      }
    }
  }

  if (!parsed) {
    return { ok: false, error: lastError || "Generation failed" };
  }

  return {
    ok: true,
    letter: parsed.letter,
    shareableQuotes: Array.isArray(parsed.shareableQuotes)
      ? parsed.shareableQuotes.slice(0, 3)
      : [],
  };
}
