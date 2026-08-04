/**
 * GET /api/cron/generate-book
 *
 * Worker cron that processes queued birth-chart-book orders ONLY.
 *
 * On each tick:
 *   1. Reset stale "generating" orders (worker died / Vercel timeout)
 *   2. Claim up to CONCURRENCY queued birth-chart-book orders
 *   3. Generate each book via the V1.2 engine (unchanged)
 *   4. Persist reading in the existing readings table
 *   5. Send delivery + follow-up emails
 *
 * Each step is idempotent. A reading that already exists for a
 * payment_id is not regenerated. Delivery is only sent once
 * (checked via delivery_sent_at).
 *
 * Non-book products are NOT processed here — they use the legacy
 * synchronous path in the Gumroad webhook.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireCronSecret } from "@/lib/blog/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { buildBookReadingPayload } from "@/lib/premium/build-book-reading";
import type { BirthLead } from "@/lib/db/checkout-flow";
import {
  resetStaleGenerating,
  claimNextQueuedOrder,
  completeGeneration,
  failGeneration,
  recordDelivery,
  type ClaimedOrder,
} from "@/lib/db/reading-lifecycle";
import { DB } from "@/lib/db/tables";
import type { BirthInputs } from "@/lib/db/types";
import { accessUrl } from "@/lib/products";
import { sendEmail } from "@/lib/send-email";
import { DELAY_MS, scheduledIso } from "@/lib/email-timing";
import {
  bookDeliveryMail,
  bookReviewMail,
  bookSocialProofMail,
} from "@/lib/email-templates";
import { dbError, dbLog } from "@/lib/db/log";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const CONCURRENCY = Number(process.env.BOOK_GENERATION_CONCURRENCY ?? "2");

function birthInputsToLead(inputs: BirthInputs, email: string): BirthLead {
  return {
    name: inputs.name,
    email,
    dob: inputs.dob,
    birth_time: inputs.birth_time,
    birth_place: inputs.birth_place,
    timezone: inputs.timezone,
    user_id: null,
    birth_lat: inputs.birth_lat,
    birth_lng: inputs.birth_lng,
    focus_area: null,
    product_type: "birth-chart-book",
    preview_json: null,
    preview_email_id: null,
    abandoned_one_email_id: null,
    abandoned_two_email_id: null,
    abandoned_three_email_id: null,
  };
}

async function processOrder(order: ClaimedOrder): Promise<void> {
  const scope = "generate-book-worker";
  const supabase = createSupabaseAdmin();

  if (order.productType !== "birth-chart-book") {
    dbError(scope, "unexpected non-book order in queue — skipping", "", {
      paymentId: order.id,
      productType: order.productType,
    });
    await failGeneration(supabase, order.id, "Non-book product in book queue");
    return;
  }

  dbLog(scope, "processing order", {
    paymentId: order.id,
    email: order.email,
    productType: order.productType,
    attempt: order.generationAttempts,
  });

  // ── Check if reading already exists (previous worker persisted but died after) ──
  const { data: existingReading } = await supabase
    .from(DB.readings)
    .select("id")
    .eq("payment_id", order.id)
    .limit(1)
    .maybeSingle();

  let readingId: string | undefined;

  if (existingReading) {
    dbLog(scope, "reading already exists — skipping generation", {
      paymentId: order.id,
      readingId: existingReading.id,
    });
    readingId = existingReading.id;

    // Mark completed (may have been stuck in generating)
    const complete = await completeGeneration(supabase, order.id, {
      userId: order.userId,
      birthInputs: order.birthInputs,
      readingJson: {},
      productType: order.productType,
    });
    if (!complete.ok) {
      dbError(scope, "completeGeneration failed for existing reading", complete.error, {
        paymentId: order.id,
      });
    }
  } else {
    // ── Generate book reading ──
    const lead = birthInputsToLead(order.birthInputs, order.email);
    const bookReading = await buildBookReadingPayload(lead);
    const readingJson = bookReading
      ? (bookReading as unknown as Record<string, unknown>)
      : null;

    if (!readingJson) {
      dbError(scope, "generation returned null", "", {
        paymentId: order.id,
        email: order.email,
        productType: order.productType,
      });
      await failGeneration(supabase, order.id, "Reading generation returned null");
      return;
    }

    dbLog(scope, "generation succeeded", {
      paymentId: order.id,
      email: order.email,
    });

    // ── Persist reading ──
    const complete = await completeGeneration(supabase, order.id, {
      userId: order.userId,
      birthInputs: order.birthInputs,
      readingJson,
      productType: order.productType,
    });

    if (!complete.ok) {
      dbError(scope, "completeGeneration failed", complete.error, {
        paymentId: order.id,
      });
      await failGeneration(supabase, order.id, complete.error ?? "Persistence failed");
      return;
    }

    readingId = complete.readingId;
  }

  // ── Check if delivery was already sent ──
  const { data: payment } = await supabase
    .from(DB.payments)
    .select("delivery_sent_at, access_token")
    .eq("id", order.id)
    .single();

  if (payment?.delivery_sent_at) {
    dbLog(scope, "delivery already sent — skipping emails", { paymentId: order.id });
    return;
  }

  const readingUrl = accessUrl(order.accessToken, order.productType);
  const firstName = order.birthInputs.name.split(" ")[0] || order.birthInputs.name;

  // ── Delivery email ──
  try {
    const template = bookDeliveryMail({ firstName, readingUrl });

    await sendEmail({
      to: order.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    await recordDelivery(supabase, order.id);
    dbLog(scope, "delivery email sent", { paymentId: order.id, email: order.email });
  } catch (mailErr) {
    dbError(scope, "delivery email failed (reading is safe)", mailErr, {
      paymentId: order.id,
      email: order.email,
    });
  }

  // ── Follow-up emails (non-fatal) ──
  try {
    await Promise.all([
      sendEmail({
        to: order.email,
        ...bookReviewMail({ firstName }),
        scheduledAt: scheduledIso(DELAY_MS.bookReview),
      }),
      sendEmail({
        to: order.email,
        ...bookSocialProofMail({ firstName, cardUrl: readingUrl }),
        scheduledAt: scheduledIso(DELAY_MS.bookSocialProof),
      }),
    ]);
    dbLog(scope, "follow-up emails scheduled", { paymentId: order.id });
  } catch (mailErr) {
    dbError(scope, "follow-up scheduling failed (non-fatal)", mailErr, {
      paymentId: order.id,
    });
  }

  dbLog(scope, "order fully processed", {
    paymentId: order.id,
    readingId,
    email: order.email,
    readingUrl,
  });
}

export async function GET(req: NextRequest) {
  const scope = "generate-book-cron";

  const authError = requireCronSecret(req);
  if (authError) return authError;

  const supabase = createSupabaseAdmin();

  // ── 1. Reset stale generating orders ──
  const stale = await resetStaleGenerating(supabase);
  if (stale.requeued > 0 || stale.failed > 0) {
    dbLog(scope, "stale recovery", stale);
  }

  // ── 2. Claim up to CONCURRENCY orders ──
  const claimed: ClaimedOrder[] = [];
  for (let i = 0; i < CONCURRENCY; i++) {
    const order = await claimNextQueuedOrder(supabase, "birth-chart-book");
    if (!order) break;
    claimed.push(order);
  }

  if (claimed.length === 0) {
    return NextResponse.json({ ok: true, processed: 0 });
  }

  dbLog(scope, `claimed ${claimed.length} order(s)`, {
    ids: claimed.map((o) => o.id),
  });

  // ── 3. Process in parallel ──
  const results = await Promise.allSettled(
    claimed.map((order) => processOrder(order))
  );

  const summary = results.map((r, i) => ({
    paymentId: claimed[i].id,
    status: r.status,
    error: r.status === "rejected" ? String(r.reason) : undefined,
  }));

  // Mark any unhandled rejections as failed
  for (const result of summary) {
    if (result.status === "rejected") {
      const supabaseForError = createSupabaseAdmin();
      await failGeneration(
        supabaseForError,
        result.paymentId,
        result.error ?? "Unhandled worker error"
      );
    }
  }

  dbLog(scope, "tick complete", { processed: claimed.length, summary });

  return NextResponse.json({
    ok: true,
    processed: claimed.length,
    results: summary,
  });
}
