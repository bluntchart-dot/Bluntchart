/**
 * POST /api/internal/premium/fulfill
 *
 * Unified internal manual fulfillment endpoint. Supports four products:
 *
 *   "birth-chart-book"    → V1.2 insight-map engine (Claude) — Book product
 *   "in-depth-reading"    → V1.2 insight-map engine (Claude) — In-Depth Reading product
 *   "reading"             → $15 birth chart reading pipeline (Claude)
 *   "future-love-letter"  → love letter (Gemini)
 *
 * Same cookie gate as /api/internal/premium/generate. Runs the product's
 * generator, persists the result with a real access token (no Payments
 * row), and sends the product-specific email sequence.
 *
 * Body:
 *   {
 *     product_type,              // "birth-chart-book" | "in-depth-reading" | "reading" | "future-love-letter"
 *     name, dob, birth_time, city, email,
 *     birth_lat?, birth_lng?, timezone?,
 *     order_source,              // "etsy" | "website" | "personal-test" | "other"
 *     model?                     // AiModelId — only used by book product
 *   }
 */

import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isDevAuthorized } from "@/lib/premium/dev-auth";
import { generateAiReading } from "@/lib/premium/generate-ai-reading";
import { buildPaidReadingPayload } from "@/lib/build-paid-reading";
import { generateLoveLetter } from "@/lib/future-love-letter/generate-letter";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import {
  DEFAULT_MODEL,
  IMPLEMENTED_MODEL_IDS,
} from "@/lib/premium/ai/models";
import type { AiModelId } from "@/lib/premium/ai/types";
import type { PremiumBirthDetails } from "@/lib/premium/build-mock-reading";
import type { BirthLead } from "@/lib/db/checkout-flow";
import type { ProductType } from "@/lib/db/types";
import {
  persistManualFulfillment,
  manualReadingUrl,
  sendManualBookEmails,
  sendManualReadingEmails,
  sendManualLoveLetterEmails,
} from "@/lib/premium/manual-fulfillment";
import { isValidInternalSource } from "@/lib/premium/order-sources";
import { accessUrl } from "@/lib/products";

interface Body {
  product_type?: string;
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

const SUPPORTED_PRODUCTS: ProductType[] = ["birth-chart-book", "in-depth-reading", "reading", "future-love-letter"];

const PRODUCT_LABEL: Record<string, string> = {
  "birth-chart-book": "Birth Chart Book",
  "in-depth-reading": "In-Depth Reading",
  "reading": "Birth Chart Reading",
  "future-love-letter": "Love Letter",
};

const isValidDate  = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const isValidTime  = (s: string) => /^\d{2}:\d{2}$/.test(s);
const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

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

  const productType = (body.product_type ?? "").trim() as ProductType;
  const name       = (body.name ?? "").trim();
  const email      = (body.email ?? "").trim().toLowerCase();
  const dob        = (body.dob ?? "").trim();
  const birthTime  = (body.birth_time ?? "").trim();
  const birthPlace = (body.city ?? "").trim();
  const orderSource = (body.order_source ?? "").trim();

  if (!productType || !SUPPORTED_PRODUCTS.includes(productType)) {
    return NextResponse.json(
      { ok: false, error: "Please select a product (Book, In-Depth Reading, Reading, or Love Letter)." },
      { status: 400 }
    );
  }
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
      { ok: false, error: "Please choose an order source." },
      { status: 400 }
    );
  }

  const birthLat =
    typeof body.birth_lat === "number" && Number.isFinite(body.birth_lat)
      ? body.birth_lat
      : null;
  const birthLng =
    typeof body.birth_lng === "number" && Number.isFinite(body.birth_lng)
      ? body.birth_lng
      : null;
  const timezone = body.timezone?.trim() || null;

  /* ═══════════════════════════════════════════════════════════════════
     GENERATION — branch by product type
  ═══════════════════════════════════════════════════════════════════ */

  let readingJson: Record<string, unknown>;
  let model = "";

  if (productType === "birth-chart-book") {
    /* ── Book: V1.2 insight-map engine (Claude) ─────────────────────── */
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "ANTHROPIC_API_KEY is not configured on this server." },
        { status: 503 }
      );
    }

    model = resolveModel(body.model);
    const birth: PremiumBirthDetails = {
      name, email, dob, birth_time: birthTime,
      birth_place: birthPlace,
      birth_lat: birthLat, birth_lng: birthLng,
      timezone,
    };

    const generationRequestId = randomUUID();
    const genResult = await generateAiReading(birth, {
      modelId: model as AiModelId,
      generationRequestId,
    });
    if (!genResult.ok) {
      console.error("[premium/fulfill] book generation failed:", genResult.error, genResult.errorCategory);
      return NextResponse.json(
        { ok: false, error: genResult.error, errorCategory: genResult.errorCategory },
        { status: 500 }
      );
    }
    readingJson = genResult.reading as unknown as Record<string, unknown>;

  } else if (productType === "in-depth-reading") {
    /* ── In-Depth Reading: V1.2 insight-map engine (Claude) ────────── */
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "ANTHROPIC_API_KEY is not configured on this server." },
        { status: 503 }
      );
    }

    model = resolveModel(body.model);
    const birth: PremiumBirthDetails = {
      name, email, dob, birth_time: birthTime,
      birth_place: birthPlace,
      birth_lat: birthLat, birth_lng: birthLng,
      timezone,
    };

    const generationRequestId = randomUUID();
    const genResult = await generateAiReading(birth, {
      modelId: model as AiModelId,
      generationRequestId,
      product: "in-depth-reading",
    });
    if (!genResult.ok) {
      console.error("[premium/fulfill] in-depth reading generation failed:", genResult.error, genResult.errorCategory);
      return NextResponse.json(
        { ok: false, error: genResult.error, errorCategory: genResult.errorCategory },
        { status: 500 }
      );
    }
    readingJson = genResult.reading as unknown as Record<string, unknown>;

  } else if (productType === "reading") {
    /* ── $15 Reading: Claude prompt pipeline ─────────────────────────── */
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "ANTHROPIC_API_KEY is not configured on this server." },
        { status: 503 }
      );
    }

    const syntheticLead: BirthLead = {
      name,
      email,
      dob,
      birth_time: birthTime,
      birth_place: birthPlace,
      birth_lat: birthLat,
      birth_lng: birthLng,
      timezone,
      focus_area: null,
      preview_json: null,
      user_id: null,
      product_type: "reading",
      preview_email_id: null,
      abandoned_one_email_id: null,
      abandoned_two_email_id: null,
      abandoned_three_email_id: null,
    };

    const payload = await buildPaidReadingPayload(syntheticLead);
    if (!payload) {
      return NextResponse.json(
        { ok: false, error: "Reading generation failed. Check geocoding and chart calculation." },
        { status: 500 }
      );
    }
    readingJson = payload as unknown as Record<string, unknown>;
    model = "claude-reading-pipeline";

  } else {
    /* ── Love Letter: Gemini ─────────────────────────────────────────── */
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { ok: false, error: "GEMINI_API_KEY is not configured on this server." },
        { status: 503 }
      );
    }

    if (!birthLat || !birthLng) {
      return NextResponse.json(
        { ok: false, error: "Love letter requires coordinates. Please select a city from the location picker." },
        { status: 400 }
      );
    }

    const letterResult = await generateLoveLetter({
      name,
      date: dob,
      time: birthTime,
      lat: birthLat,
      lng: birthLng,
      placeName: birthPlace,
      timezone: timezone ?? undefined,
    });

    if (!letterResult.ok || !letterResult.letter) {
      return NextResponse.json(
        { ok: false, error: letterResult.error ?? "Love letter generation failed." },
        { status: 500 }
      );
    }

    readingJson = {
      letter: letterResult.letter,
      shareableQuotes: letterResult.shareableQuotes ?? [],
      meta: { name, dob, birth_place: birthPlace },
    };
    model = "gemini";
  }

  /* ═══════════════════════════════════════════════════════════════════
     PERSISTENCE — same for all products
  ═══════════════════════════════════════════════════════════════════ */

  const supabase = createSupabaseAdmin();
  const persist = await persistManualFulfillment(supabase, {
    birth: {
      name, email, dob, birth_time: birthTime,
      birth_place: birthPlace, timezone,
    },
    readingJson,
    productType,
    orderSource: orderSource as "etsy" | "website" | "personal-test" | "other",
  });

  if (!persist.ok || !persist.accessToken) {
    return NextResponse.json(
      { ok: false, error: persist.error ?? "Persistence failed" },
      { status: 500 }
    );
  }

  const readingUrl = manualReadingUrl(persist.accessToken, productType);
  const firstName = name.split(/\s+/)[0] || name;

  /* ═══════════════════════════════════════════════════════════════════
     EMAILS — product-specific sequences
  ═══════════════════════════════════════════════════════════════════ */

  let emails;
  if (productType === "birth-chart-book" || productType === "in-depth-reading") {
    emails = await sendManualBookEmails({ email, firstName, birthDate: dob, readingUrl });
  } else if (productType === "reading") {
    emails = await sendManualReadingEmails({ email, firstName, birthDate: dob, readingUrl });
  } else {
    emails = await sendManualLoveLetterEmails({ email, firstName, readingUrl });
  }

  /* ═══════════════════════════════════════════════════════════════════
     RESPONSE — everything the admin needs
  ═══════════════════════════════════════════════════════════════════ */

  return NextResponse.json({
    ok: true,
    productType,
    productLabel: PRODUCT_LABEL[productType] ?? productType,
    customer: { name, email, firstName },
    orderSource,
    accessToken: persist.accessToken,
    readingUrl,
    readingId: persist.readingId,
    model,
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
