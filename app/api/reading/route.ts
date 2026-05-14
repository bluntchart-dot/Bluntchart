import { NextRequest, NextResponse } from "next/server";
import { buildClaudePrompt } from "@/lib/claude-prompt";

type Tier = "preview" | "full";

const MODEL_CONFIG: Record<Tier, { model: string; max_tokens: number }> = {
  preview: {
    model: "claude-haiku-4-5-20251001",
    max_tokens: 900,
  },
  full: {
    model: "claude-sonnet-4-6",
    max_tokens: 2800,
  },
};

function extractJsonFromText(raw: string) {
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  const fallback = {
    planets: {},
    preview: [],
    shareCard: {
      sign: "",
      keyword: "CHART READING",
      lines: ["Your chart knows more than you think."],
      quote: "",
    },
  };

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        console.error("[reading] JSON parse failed after extraction");
        return fallback;
      }
    }

    console.error("[reading] No JSON found in model response");
    return fallback;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const tier: Tier =
      body.model === "preview" || body.mode === "preview" ? "preview" : "full";

    let prompt: string;

    if (typeof body.prompt === "string" && body.prompt.trim().length > 0) {
      prompt = body.prompt.trim();
    } else if (body.birth && body.chartData) {
      prompt = buildClaudePrompt(body.birth, body.chartData, body.insight ?? {});
    } else {
      return NextResponse.json(
        { error: "Missing prompt or birth/chartData" },
        { status: 400 }
      );
    }

    const { model, max_tokens } = MODEL_CONFIG[tier];

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[reading] Anthropic error:", response.status, errText);
      return NextResponse.json(
        { error: `Anthropic API error: ${response.status}`, detail: errText },
        { status: response.status }
      );
    }

  const data = await response.json();
const text = data?.content?.[0]?.text ?? "";

if (!text) {
  console.error("[reading] Empty response from Anthropic:", data);
  return NextResponse.json(
    { error: "Empty response from Anthropic" },
    { status: 500 }
  );
}

const parsed = extractJsonFromText(text);

return NextResponse.json({
  success: true,
  data: parsed,
});
  } catch (err) {
    console.error("[reading] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error", detail: (err as Error).message },
      { status: 500 }
    );
  }
}