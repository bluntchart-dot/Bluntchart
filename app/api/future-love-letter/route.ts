import { NextRequest, NextResponse } from "next/server";
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
import type { FutureLoveRequest, FutureLoveResult, LetterResponse } from "@/lib/future-love-letter/types";

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const braceMatch = text.match(/\{[\s\S]*\}/);
  if (braceMatch) return braceMatch[0];
  return text;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FutureLoveRequest;

    if (!body.name || !body.date || !body.time || !body.lat || !body.lng) {
      return NextResponse.json(
        { error: "Missing required birth data fields" },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error("[future-love-letter] GEMINI_API_KEY not configured");
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 },
      );
    }

    const timezone = body.timezone || timezoneAt(body.lat, body.lng) || "UTC";

    const birthData: BirthData = {
      name: body.name,
      date: body.date,
      time: body.time,
      lat: body.lat,
      lng: body.lng,
      timezone,
      placeName: body.placeName || "",
    };

    const chart = calculateChart(birthData);

    const brief = interpretChart(chart);

    const systemPrompt = buildLetterSystemPrompt();
    const userPrompt = buildLetterUserPrompt(body.name, brief);

    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.85,
        maxOutputTokens: 4000,
        responseMimeType: "application/json",
      },
    });

    const rawText = (response.text ?? "").trim();
    if (!rawText) {
      console.error("[future-love-letter] Empty Gemini response");
      return NextResponse.json(
        { error: "Generation produced empty response" },
        { status: 502 },
      );
    }

    const jsonStr = extractJson(rawText);
    let parsed: LetterResponse;
    try {
      parsed = JSON.parse(jsonStr) as LetterResponse;
    } catch {
      // Gemini sometimes produces JSON with unescaped newlines in string values
      try {
        const fixed = jsonStr
          .replace(/(?<=:\s*")([\s\S]*?)(?="(?:\s*[,}]))/g, (match) =>
            match.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t"),
          );
        parsed = JSON.parse(fixed) as LetterResponse;
      } catch {
        console.error("[future-love-letter] JSON parse failed:", rawText.slice(0, 800));
        return NextResponse.json(
          { error: "Generation produced invalid response" },
          { status: 502 },
        );
      }
    }

    if (!parsed.letter || typeof parsed.letter !== "string") {
      console.error("[future-love-letter] Missing letter field in response");
      return NextResponse.json(
        { error: "Generation produced incomplete response" },
        { status: 502 },
      );
    }

    const result: FutureLoveResult = {
      letter: parsed.letter,
      shareableQuotes: Array.isArray(parsed.shareableQuotes)
        ? parsed.shareableQuotes.slice(0, 3)
        : [],
      name: body.name,
    };

    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[future-love-letter] Unhandled error:", msg);

    if (msg.includes("429") || /quota/i.test(msg)) {
      return NextResponse.json(
        { error: "We're experiencing high demand. Please try again in a moment." },
        { status: 429 },
      );
    }

    return NextResponse.json(
      { error: "Something went wrong generating your letter" },
      { status: 500 },
    );
  }
}
