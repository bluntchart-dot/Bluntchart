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
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { ensureUser } from "@/lib/db/users";
import { DB } from "@/lib/db/tables";
import type { BirthData } from "@/lib/types";
import type { FutureLoveRequest, FutureLoveResult, LetterResponse } from "@/lib/future-love-letter/types";

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
      try {
        parsed = JSON.parse(repairJsonString(jsonStr)) as LetterResponse;
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

    // Save email + letter to Supabase (non-blocking — don't fail the response)
    if (body.email) {
      try {
        const supabase = createSupabaseAdmin();
        const { user } = await ensureUser(supabase, body.email, body.name);

        if (user) {
          await supabase.from(DB.readings).insert([
            {
              user_id: user.id,
              payment_id: null,
              birth_time: body.time,
              birth_place: body.placeName || null,
              timezone,
              reading_json: {
                letter: parsed.letter,
                shareableQuotes: parsed.shareableQuotes,
                meta: { name: body.name, dob: body.date, birth_place: body.placeName },
              },
              reading_status: "complete",
              product_type: "future-love-letter",
            },
          ]);
        }
      } catch (dbErr) {
        console.error("[future-love-letter] DB save failed (non-fatal):", dbErr);
      }
    }

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
