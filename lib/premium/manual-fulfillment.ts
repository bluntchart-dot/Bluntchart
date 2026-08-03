/**
 * lib/premium/manual-fulfillment.ts
 *
 * Isolated persistence + email path for MANUAL book fulfillments driven
 * from /internal/premium (Personal / Test / Etsy / Other).
 *
 * Deliberately NOT sharing code with lib/db/fulfillment.ts.
 * Isolation > cleanliness — the Gumroad webhook must keep behaving
 * identically. This module writes to the same tables (Payments, readings,
 * Users) with backward-compatible shapes so the resulting rows work with
 * the existing /my-book?token= reader and PDF path unchanged.
 *
 * Differences from the Gumroad path:
 *   - No gumroad_payment_id (null)
 *   - payment_provider = "manual"
 *   - order_source     = "personal-test" | "etsy" | "other"
 *   - amount           = "0"
 *   - session_id       = "manual-<uuid>" (uniqueness only; never used elsewhere)
 *   - No abandoned-cart lead lookup / deletion
 *   - No confirmation email that says "payment" (uses manualBookConfirmationMail)
 *
 * If the DB has not yet had the 20260803000000_order_source migration
 * applied, the payment insert automatically retries WITHOUT the
 * order_source column and logs a warning. The reading still saves and
 * the access token still works — only the source metadata is missing.
 */

import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { dbError, dbLog } from "@/lib/db/log";
import { DB } from "@/lib/db/tables";
import { ensureUser } from "@/lib/db/users";
import type { PremiumReading } from "./types";
import type { OrderSource } from "./order-sources";
import { sendEmail } from "@/lib/send-email";
import { DELAY_MS, scheduledIso } from "@/lib/email-timing";
import { accessUrl } from "@/lib/products";
import {
  manualBookConfirmationMail,
  bookDeliveryMail,
  bookReviewMail,
  bookSocialProofMail,
} from "@/lib/email-templates";

export interface ManualBirth {
  readonly name: string;
  readonly email: string;
  readonly dob: string;         // YYYY-MM-DD
  readonly birth_time: string;  // HH:mm
  readonly birth_place: string;
  readonly timezone: string | null;
}

export interface ManualPersistResult {
  readonly ok: boolean;
  readonly paymentId?: string;
  readonly readingId?: string;
  readonly accessToken?: string;
  readonly orderSourcePersisted: boolean;
  readonly error?: string;
}

/**
 * Persist a manually-fulfilled book. Writes a Payments row + a readings
 * row with an access_token compatible with /my-book?token=.
 */
export async function persistManualBookFulfillment(
  supabase: SupabaseClient,
  params: {
    readonly birth: ManualBirth;
    readonly reading: PremiumReading;
    readonly orderSource: OrderSource;
  }
): Promise<ManualPersistResult> {
  const scope = "manual-fulfillment";
  const email = params.birth.email.trim().toLowerCase();
  const accessToken = randomUUID();
  const sessionId = `manual-${randomUUID()}`;

  const { user, error: userErr } = await ensureUser(
    supabase,
    email,
    params.birth.name
  );
  if (userErr || !user) {
    return {
      ok: false,
      orderSourcePersisted: false,
      error: userErr ?? "User ensure failed",
    };
  }

  const paymentBase = {
    email,
    user_id: user.id,
    session_id: sessionId,
    gumroad_payment_id: null,
    amount: "0",
    payment_status: "paid",
    payment_provider: "manual",
    access_token: accessToken,
    product_type: "birth-chart-book" as const,
    updated_at: new Date().toISOString(),
  };

  // Attempt insert with order_source. If the column doesn't exist yet
  // (migration not applied), retry without it — no silent failure.
  let orderSourcePersisted = true;
  let paymentInsert = await supabase
    .from(DB.payments)
    .insert([{ ...paymentBase, order_source: params.orderSource }])
    .select("id")
    .single();

  if (paymentInsert.error && /order_source/i.test(paymentInsert.error.message)) {
    dbError(
      scope,
      "order_source column missing — apply migration 20260803000000_order_source.sql",
      paymentInsert.error.message,
      { email }
    );
    orderSourcePersisted = false;
    paymentInsert = await supabase
      .from(DB.payments)
      .insert([paymentBase])
      .select("id")
      .single();
  }

  if (paymentInsert.error || !paymentInsert.data) {
    dbError(scope, "payment insert failed", paymentInsert.error, { email });
    return {
      ok: false,
      orderSourcePersisted: false,
      error: paymentInsert.error?.message ?? "Payment insert failed",
    };
  }

  const paymentId: string = paymentInsert.data.id;
  dbLog(scope, "payment inserted", { paymentId, orderSource: params.orderSource });

  // Insert readings row with the full PremiumReading JSON.
  const readingInsert = await supabase
    .from(DB.readings)
    .insert([
      {
        user_id: user.id,
        payment_id: paymentId,
        birth_time: params.birth.birth_time,
        birth_place: params.birth.birth_place,
        timezone: params.birth.timezone,
        reading_json: params.reading as unknown as Record<string, unknown>,
        reading_status: "complete",
        product_type: "birth-chart-book",
      },
    ])
    .select("id")
    .single();

  if (readingInsert.error || !readingInsert.data) {
    dbError(scope, "reading insert failed", readingInsert.error, { paymentId });
    return {
      ok: false,
      orderSourcePersisted,
      error: readingInsert.error?.message ?? "Reading insert failed",
    };
  }

  const readingId: string = readingInsert.data.id;
  dbLog(scope, "reading saved", { paymentId, readingId });

  return { ok: true, paymentId, readingId, accessToken, orderSourcePersisted };
}

/* ─────────────────────────────────────────────────────────────────────
   Email orchestration for manual fulfillment
   Uses the same book delivery + follow-up templates as Gumroad, plus a
   new manual-flavoured confirmation that never says "payment received".
───────────────────────────────────────────────────────────────────── */

export interface ManualEmailResult {
  readonly confirmation: { ok: boolean; id?: string; error?: string };
  readonly delivery:     { ok: boolean; id?: string; error?: string };
  readonly reviewScheduled:      { ok: boolean; id?: string; error?: string };
  readonly socialProofScheduled: { ok: boolean; id?: string; error?: string };
}

export async function sendManualBookEmails(params: {
  readonly email: string;
  readonly firstName: string;
  readonly birthDate: string;
  readonly readingUrl: string;
}): Promise<ManualEmailResult> {
  const { email, firstName, birthDate, readingUrl } = params;
  const scope = "manual-fulfillment";

  // 1. Confirmation (manual-flavoured — no payment wording)
  const confTpl = manualBookConfirmationMail({ firstName, birthDate });
  const confirmation = await sendEmail({
    to: email,
    subject: confTpl.subject,
    html: confTpl.html,
    text: confTpl.text,
  });
  if (!confirmation.ok) {
    dbError(scope, "confirmation email failed (non-fatal)", confirmation.error, { email });
  }

  // 2. Delivery (same book delivery template as Gumroad)
  const delTpl = bookDeliveryMail({ firstName, birthDate, readingUrl });
  const delivery = await sendEmail({
    to: email,
    subject: delTpl.subject,
    html: delTpl.html,
    text: delTpl.text,
  });
  if (!delivery.ok) {
    dbError(scope, "delivery email failed (non-fatal)", delivery.error, { email });
  }

  // 3. Review follow-up (scheduled)
  const revTpl = bookReviewMail({ firstName });
  const reviewScheduled = await sendEmail({
    to: email,
    subject: revTpl.subject,
    html: revTpl.html,
    text: revTpl.text,
    scheduledAt: scheduledIso(DELAY_MS.bookReview),
  });
  if (!reviewScheduled.ok) {
    dbError(scope, "review email schedule failed (non-fatal)", reviewScheduled.error, { email });
  }

  // 4. Social-proof follow-up (scheduled)
  const spTpl = bookSocialProofMail({ firstName, cardUrl: readingUrl });
  const socialProofScheduled = await sendEmail({
    to: email,
    subject: spTpl.subject,
    html: spTpl.html,
    text: spTpl.text,
    scheduledAt: scheduledIso(DELAY_MS.bookSocialProof),
  });
  if (!socialProofScheduled.ok) {
    dbError(scope, "social-proof email schedule failed (non-fatal)", socialProofScheduled.error, { email });
  }

  return { confirmation, delivery, reviewScheduled, socialProofScheduled };
}

/* Small helper the route uses to compose the reader URL from an access token. */
export function manualReadingUrl(accessToken: string): string {
  return accessUrl(accessToken, "birth-chart-book");
}
