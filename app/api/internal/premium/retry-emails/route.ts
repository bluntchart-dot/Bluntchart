/**
 * POST /api/internal/premium/retry-emails
 *
 * Re-sends ONLY the delivery email for an already-generated reading.
 * Does NOT regenerate the product. Does NOT resend confirmation or
 * scheduled follow-ups — those were already dispatched on first
 * fulfillment and cannot be safely deduplicated (no per-email status
 * tracking in the DB).
 *
 * Body: { readingId: string }
 *
 * Looks up the reading row, resolves product_type, and sends the
 * delivery email with the product link. Same cookie gate as /fulfill.
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isDevAuthorized } from "@/lib/premium/dev-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { DB } from "@/lib/db/tables";
import type { ProductType } from "@/lib/db/types";
import { accessUrl } from "@/lib/products";
import { sendEmail } from "@/lib/send-email";
import {
  bookDeliveryMail,
  fullReadingDeliveryMail,
  loveLetterDeliveryMail,
} from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (!isDevAuthorized(cookieStore)) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }

  let body: { readingId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 });
  }

  const readingId = (body.readingId ?? "").trim();
  if (!readingId) {
    return NextResponse.json({ ok: false, error: "readingId is required." }, { status: 400 });
  }

  const supabase = createSupabaseAdmin();

  const { data: reading, error: readErr } = await supabase
    .from(DB.readings)
    .select("id, email, access_token, product_type, reading_json, birth_time, birth_place")
    .eq("id", readingId)
    .maybeSingle();

  if (readErr || !reading) {
    return NextResponse.json(
      { ok: false, error: readErr?.message ?? "Reading not found." },
      { status: 404 }
    );
  }

  if (!reading.access_token || !reading.email) {
    return NextResponse.json(
      { ok: false, error: "Reading is missing access_token or email." },
      { status: 400 }
    );
  }

  const productType = (reading.product_type as ProductType) ?? "reading";
  const readingUrl = accessUrl(reading.access_token, productType);
  const readingJson = reading.reading_json as Record<string, unknown> | null;
  const meta = (readingJson?.meta ?? {}) as Record<string, unknown>;
  const customerName = (meta.name as string) ?? "";
  const firstName = customerName.split(/\s+/)[0] || "there";
  const birthDate = (meta.dob as string) ?? "";

  let tpl;
  if (productType === "birth-chart-book") {
    tpl = bookDeliveryMail({ firstName, birthDate, readingUrl });
  } else if (productType === "reading") {
    tpl = fullReadingDeliveryMail({ firstName, birthDate, readingUrl, cardUrl: readingUrl });
  } else if (productType === "future-love-letter") {
    tpl = loveLetterDeliveryMail({ firstName, readingUrl });
  } else {
    return NextResponse.json(
      { ok: false, error: `Unsupported product type: ${productType}` },
      { status: 400 }
    );
  }

  const delivery = await sendEmail({
    to: reading.email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
  });

  return NextResponse.json({
    ok: delivery.ok,
    readingId,
    productType,
    readingUrl,
    delivery: {
      sent: delivery.ok,
      id: delivery.id ?? null,
      error: delivery.error ?? null,
    },
  });
}
