/**
 * POST /api/internal/premium/fulfill
 *
 * Internal-only manual fulfillment endpoint. Same cookie gate as
 * /api/internal/premium/generate. Runs the current V1.2 insight-map
 * engine, persists the reading with a real access token, and sends the
 * customer email sequence (manual confirmation → delivery → scheduled
 * review + social-proof follow-ups).
 *
 * Body:
 *   {
 *     name, dob, birth_time, city, email,
 *     birth_lat?, birth_lng?, timezone?,
 *     order_source,          // "personal-test" | "etsy" | "other"
 *     model?                 // AiModelId (default: sonnet-5 to match Gumroad path)
 *   }
 *
 * Success response includes the customer book URL AND the raw access
 * token so the admin can rebuild the URL from Supabase if email delivery
 * ever fails.
 */

import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isDevAuthorized } from "@/lib/premium/dev-auth";
import { generateAiReading } from "@/lib/premium/generate-ai-reading";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import {
  DEFAULT_MODEL,
  IMPLEMENTED_MODEL_IDS,
} from "@/lib/premium/ai/models";
import type { AiModelId } from "@/lib/premium/ai/types";
import type { PremiumBirthDetails } from "@/lib/premium/build-mock-reading";
import {
  persistManualBookFulfillment,
  sendManualBookEmails,
  manualReadingUrl,
} from "@/lib/premium/manual-fulfillment";
import { isValidInternalSource } from "@/lib/premium/order-sources";

interface Body {
  name?: string;
  email?: string;
  dob?: string;
  birth_time?: string;
  city?: string;
  birth_lat?: number;
  birth_lng?: number;
  timezone?: string;
  order_source?: string;
  model?: string;
}

const isValidDate  = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const isValidTime  = (s: string) => /^\d{2}:\d{2}$/.test(s);
const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

// Manual fulfillment defaults to Sonnet 5 to match the Gumroad-book model,
// so the reading a friend sees matches what a paying customer would see.
const DEFAULT_MANUAL_MODEL: AiModelId = "sonnet-5";

function resolveModel(raw: string | undefined): AiModelId {
  const val = (raw ?? "").trim();
  if ((IMPLEMENTED_MODEL_IDS as readonly string[]).includes(val)) {
    return val as AiModelId;
  }
  return process.env.ANTHROPIC_API_KEY ? DEFAULT_MANUAL_MODEL : DEFAULT_MODEL;
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (!isDevAuthorized(cookieStore)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const name       = (body.name ?? "").trim();
  const email      = (body.email ?? "").trim().toLowerCase();
  const dob        = (body.dob ?? "").trim();
  const birthTime  = (body.birth_time ?? "").trim();
  const birthPlace = (body.city ?? "").trim();
  const orderSource = (body.order_source ?? "").trim();

  if (!name || !email || !dob || !birthTime || !birthPlace) {
    return NextResponse.json(
      { ok: false, error: "Please fill in name, email, date of birth, time, and city." },
      { status: 400 }
    );
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: false, error: "Email address is not valid." }, { status: 400 });
  }
  if (!isValidDate(dob)) {
    return NextResponse.json({ ok: false, error: "Date of birth must be YYYY-MM-DD." }, { status: 400 });
  }
  if (!isValidTime(birthTime)) {
    return NextResponse.json({ ok: false, error: "Birth time must be HH:mm." }, { status: 400 });
  }
  if (!isValidInternalSource(orderSource)) {
    return NextResponse.json(
      { ok: false, error: "Please choose an order source (Personal / Test, Etsy, or Other)." },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "ANTHROPIC_API_KEY is not configured on this server." },
      { status: 503 }
    );
  }

  const model = resolveModel(body.model);

  const birth: PremiumBirthDetails = {
    name,
    email,
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

  /* ── 1. Generate reading via V1.2 engine ────────────────────────── */
  const generationRequestId = randomUUID();
  const genResult = await generateAiReading(birth, {
    modelId: model,
    generationRequestId,
  });
  if (!genResult.ok) {
    console.error("[premium/fulfill] generation failed:", genResult.error, genResult.errorCategory);
    return NextResponse.json(
      {
        ok: false,
        error: genResult.error,
        errorCategory: genResult.errorCategory,
      },
      { status: 500 }
    );
  }

  /* ── 2. Persist in Supabase (isolated path — Gumroad flow untouched) ── */
  const supabase = createSupabaseAdmin();
  const persist = await persistManualBookFulfillment(supabase, {
    birth: {
      name,
      email,
      dob,
      birth_time: birthTime,
      birth_place: birthPlace,
      timezone: birth.timezone,
    },
    reading: genResult.reading,
    orderSource: orderSource as ReturnType<typeof isValidInternalSource> extends true
      ? never
      : "personal-test" | "etsy" | "other",
  });

  if (!persist.ok || !persist.accessToken) {
    return NextResponse.json(
      { ok: false, error: persist.error ?? "Persistence failed" },
      { status: 500 }
    );
  }

  const readingUrl = manualReadingUrl(persist.accessToken);
  const firstName = name.split(/\s+/)[0] || name;

  /* ── 3. Send emails (all non-fatal — return statuses to admin UI) ── */
  const emails = await sendManualBookEmails({
    email,
    firstName,
    birthDate: dob,
    readingUrl,
  });

  /* ── 4. Return everything the admin needs, INCLUDING access token ── */
  return NextResponse.json({
    ok: true,
    customer: {
      name,
      email,
      firstName,
    },
    orderSource,
    accessToken: persist.accessToken,
    readingUrl,
    readingId: persist.readingId,
    model,
    generationTelemetry: genResult.telemetry,
    emailStatus: {
      confirmation: {
        sent: emails.confirmation.ok,
        id: emails.confirmation.id ?? null,
        error: emails.confirmation.error ?? null,
      },
      delivery: {
        sent: emails.delivery.ok,
        id: emails.delivery.id ?? null,
        error: emails.delivery.error ?? null,
      },
      reviewScheduled: {
        sent: emails.reviewScheduled.ok,
        id: emails.reviewScheduled.id ?? null,
        error: emails.reviewScheduled.error ?? null,
      },
      socialProofScheduled: {
        sent: emails.socialProofScheduled.ok,
        id: emails.socialProofScheduled.id ?? null,
        error: emails.socialProofScheduled.error ?? null,
      },
    },
  });
}
