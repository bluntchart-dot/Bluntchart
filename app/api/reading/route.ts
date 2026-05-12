import { NextRequest, NextResponse } from "next/server";
import { buildClaudePrompt } from "@/lib/claude-prompt";

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

    // ── Resolve the prompt ──────────────────────────────────────────────────
    // Two calling paths:
    //   A) page.tsx sends { prompt: string }  — legacy direct path, still works
    //   B) Future: sends { birth, chartData, insight } — uses buildClaudePrompt
    let prompt: string;

    if (typeof body.prompt === "string" && body.prompt.trim().length > 0) {
      // Path A — page.tsx already built the prompt, use it as-is
      prompt = body.prompt;
    } else if (body.birth && body.chartData) {
      // Path B — structured data, build the prompt server-side
      prompt = buildClaudePrompt(body.birth, body.chartData, body.insight ?? {});
    } else {
      return NextResponse.json(
        { error: "Missing prompt or birth/chartData" },
        { status: 400 }
      );
    }

    // ── Call Claude ─────────────────────────────────────────────────────────
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 3500,           // bumped from 2500 — richer readings need room
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      return NextResponse.json(
        { error: `Anthropic API error: ${response.status}`, detail: errText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error", detail: (err as Error).message },
      { status: 500 }
    );
  }
}