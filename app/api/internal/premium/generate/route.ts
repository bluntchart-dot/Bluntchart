/**
 * POST /api/internal/premium/generate
 *
 * Internal-only endpoint for the hidden Premium Reading Engine.
 * Authorised by the `premium_dev_ok` cookie set at
 * /api/internal/premium/dev-login.
 *
 * Body:
 *   {
 *     name, dob, birth_time, city,
 *     email?, birth_lat?, birth_lng?, timezone?,
 *     model?    // "mock" | "haiku-4-5" | "sonnet-5" | "opus-4-8"
 *   }
 *
 * If `model` is "mock" (or missing and no ANTHROPIC_API_KEY is set),
 * returns the in-voice mock reading. Otherwise routes to the AI
 * generator with the requested model.
 *
 * Response:
 *   { ok: true, reading: PremiumReading, telemetry?: AiTelemetry }
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isDevAuthorized } from "@/lib/premium/dev-auth";
import { buildMockPremiumReading } from "@/lib/premium/build-mock-reading";
import type { PremiumBirthDetails } from "@/lib/premium/build-mock-reading";
import { generateAiReading } from "@/lib/premium/generate-ai-reading";
import {
  DEFAULT_MODEL,
  IMPLEMENTED_MODEL_IDS,
} from "@/lib/premium/ai/models";
import type { AiModelId } from "@/lib/premium/ai/types";

interface Body {
  name?: string;
  email?: string;
  dob?: string;
  birth_time?: string;
  city?: string;
  birth_lat?: number;
  birth_lng?: number;
  timezone?: string;
  model?: string; // "mock" | AiModelId
}

const isValidDate  = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const isValidTime  = (s: string) => /^\d{2}:\d{2}$/.test(s);
const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

function resolveModel(raw: string | undefined): "mock" | AiModelId {
  const val = (raw ?? "").trim();
  if (val === "mock") return "mock";
  if (!val) {
    // Empty → prefer AI when the key is configured, otherwise mock.
    return process.env.ANTHROPIC_API_KEY ? DEFAULT_MODEL : "mock";
  }
  if ((IMPLEMENTED_MODEL_IDS as readonly string[]).includes(val)) {
    return val as AiModelId;
  }
  // Unknown model id → mock (safe default).
  return "mock";
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (!isDevAuthorized(cookieStore)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const name       = (body.name ?? "").trim();
  const dob        = (body.dob ?? "").trim();
  const birthTime  = (body.birth_time ?? "").trim();
  const birthPlace = (body.city ?? "").trim();
  const email      = (body.email ?? "").trim().toLowerCase();
  if (!name || !dob || !birthTime || !birthPlace) {
    return NextResponse.json(
      { ok: false, error: "Please fill in name, date of birth, time, and city." },
      { status: 400 }
    );
  }
  if (!isValidDate(dob)) {
    return NextResponse.json(
      { ok: false, error: "Date of birth must be YYYY-MM-DD." },
      { status: 400 }
    );
  }
  if (!isValidTime(birthTime)) {
    return NextResponse.json(
      { ok: false, error: "Birth time must be HH:mm." },
      { status: 400 }
    );
  }
  if (email && !isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Email address is not valid." },
      { status: 400 }
    );
  }

  const birth: PremiumBirthDetails = {
    name,
    email: email || undefined,
    dob,
    birth_time: birthTime,
    birth_place: birthPlace,
    birth_lat:
      typeof body.birth_lat === "number" && Number.isFinite(body.birth_lat)
        ? body.birth_lat
        : null,
    birth_lng:
      typeof body.birth_lng === "number" && Number.isFinite(body.birth_lng)
        ? body.birth_lng
        : null,
    timezone: body.timezone?.trim() || null,
  };

  const model = resolveModel(body.model);

  if (model === "mock") {
    const result = await buildMockPremiumReading(birth);
    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
    }
    return NextResponse.json({ ok: true, reading: result.reading, source: "mock" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "ANTHROPIC_API_KEY is not configured on this server." },
      { status: 503 }
    );
  }

  const result = await generateAiReading(birth, { modelId: model });
  if (!result.ok) {
    console.error("[premium/generate] AI failed:", result.error);
    return NextResponse.json(
      { ok: false, error: result.error, telemetry: result.telemetry },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    reading: result.reading,
    telemetry: result.telemetry,
    source: model,
  });
}
