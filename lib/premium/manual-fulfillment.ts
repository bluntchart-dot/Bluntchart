/**
 * lib/premium/manual-fulfillment.ts
 *
 * Unified manual fulfillment for /internal/premium (Etsy / Website /
 * Personal / Test / Other).
 *
 * Manual fulfillment is an internal delivery mechanism, NOT a payment.
 * This module writes ONE row into `readings` and nothing else:
 *
 *   readings.access_token   ← permanent recovery key
 *   readings.order_source   ← where this reading came from
 *   readings.email          ← quick admin lookup, no join required
 *   readings.reading_json   ← the generated product content
 *   readings.product_type   ← which product was fulfilled
 *
 * Payments is not touched. No fabricated payment id, session id, amount,
 * or status. Fewer failure surfaces than the previous design.
 *
 * Reader pages (/my-book, /my-reading, /my-love-letter) all fall back to
 * readings.access_token when no matching Payments row exists — see
 * loadReadingByAccessToken in lib/db/fulfillment.ts. The Gumroad write
 * path (fulfillPaidOrder) is untouched.
 */

import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { dbError, dbLog } from "@/lib/db/log";
import { DB } from "@/lib/db/tables";
import { ensureUser } from "@/lib/db/users";
import type { ProductType } from "@/lib/db/types";
import type { OrderSource } from "./order-sources";
import { sendEmail } from "@/lib/send-email";
import { DELAY_MS, scheduledIso } from "@/lib/email-timing";
import { accessUrl } from "@/lib/products";
import {
  manualBookConfirmationMail,
  manualReadingConfirmationMail,
  bookDeliveryMail,
  bookReviewMail,
  bookSocialProofMail,
  fullReadingDeliveryMail,
  shareReminderOneMail,
  shareReminderTwoMail,
  loveLetterConfirmationMail,
  loveLetterDeliveryMail,
  loveLetterReviewMail,
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
  readonly readingId?: string;
  readonly accessToken?: string;
  readonly error?: string;
}

/**
 * Persist a manual fulfillment for any product. Writes a single readings
 * row with a permanent access_token — no Payments row is created.
 */
export async function persistManualFulfillment(
  supabase: SupabaseClient,
  params: {
    readonly birth: ManualBirth;
    readonly readingJson: Record<string, unknown>;
    readonly productType: ProductType;
    readonly orderSource: OrderSource;
  }
): Promise<ManualPersistResult> {
  const scope = "manual-fulfillment";
  const email = params.birth.email.trim().toLowerCase();
  const accessToken = randomUUID();

  const { user, error: userErr } = await ensureUser(
    supabase,
    email,
    params.birth.name
  );
  if (userErr || !user) {
    return { ok: false, error: userErr ?? "User ensure failed" };
  }

  const insert = await supabase
    .from(DB.readings)
    .insert([
      {
        user_id: user.id,
        payment_id: null,
        birth_time: params.birth.birth_time,
        birth_place: params.birth.birth_place,
        timezone: params.birth.timezone,
        reading_json: params.readingJson,
        reading_status: "complete",
        product_type: params.productType,
        access_token: accessToken,
        order_source: params.orderSource,
        email,
      },
    ])
    .select("id")
    .single();

  if (insert.error || !insert.data) {
    dbError(scope, "readings insert failed", insert.error, { email, productType: params.productType });
    return {
      ok: false,
      error: insert.error?.message ?? "Reading insert failed",
    };
  }

  const readingId: string = insert.data.id;
  dbLog(scope, "reading saved", {
    readingId,
    email,
    productType: params.productType,
    orderSource: params.orderSource,
  });

  return { ok: true, readingId, accessToken };
}

/**
 * @deprecated Use persistManualFulfillment with productType: "birth-chart-book".
 * Kept for backwards compatibility with any code that imports it directly.
 */
export async function persistManualBookFulfillment(
  supabase: SupabaseClient,
  params: {
    readonly birth: ManualBirth;
    readonly reading: Record<string, unknown>;
    readonly orderSource: OrderSource;
  }
): Promise<ManualPersistResult> {
  return persistManualFulfillment(supabase, {
    birth: params.birth,
    readingJson: params.reading as Record<string, unknown>,
    productType: "birth-chart-book",
    orderSource: params.orderSource,
  });
}

/* ─────────────────────────────────────────────────────────────────────
   Email orchestration — product-specific sequences
   Each mirrors the Gumroad webhook email flow for that product, with
   manual-flavoured confirmation templates (no "payment received" wording).
───────────────────────────────────────────────────────────────────── */

export interface ManualEmailResult {
  readonly confirmation:          { ok: boolean; id?: string; error?: string };
  readonly delivery:              { ok: boolean; id?: string; error?: string };
  readonly reviewScheduled:       { ok: boolean; id?: string; error?: string };
  readonly socialProofScheduled:  { ok: boolean; id?: string; error?: string };
}

export async function sendManualBookEmails(params: {
  readonly email: string;
  readonly firstName: string;
  readonly birthDate: string;
  readonly readingUrl: string;
}): Promise<ManualEmailResult> {
  const { email, firstName, birthDate, readingUrl } = params;
  const scope = "manual-fulfillment";

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

export async function sendManualReadingEmails(params: {
  readonly email: string;
  readonly firstName: string;
  readonly birthDate: string;
  readonly readingUrl: string;
}): Promise<ManualEmailResult> {
  const { email, firstName, birthDate, readingUrl } = params;
  const scope = "manual-fulfillment";

  const confTpl = manualReadingConfirmationMail({ firstName, birthDate });
  const confirmation = await sendEmail({
    to: email,
    subject: confTpl.subject,
    html: confTpl.html,
    text: confTpl.text,
  });
  if (!confirmation.ok) {
    dbError(scope, "reading confirmation email failed (non-fatal)", confirmation.error, { email });
  }

  const delTpl = fullReadingDeliveryMail({ firstName, birthDate, readingUrl, cardUrl: readingUrl });
  const delivery = await sendEmail({
    to: email,
    subject: delTpl.subject,
    html: delTpl.html,
    text: delTpl.text,
  });
  if (!delivery.ok) {
    dbError(scope, "reading delivery email failed (non-fatal)", delivery.error, { email });
  }

  const rem1 = shareReminderOneMail({ firstName, cardUrl: readingUrl });
  const reviewScheduled = await sendEmail({
    to: email,
    subject: rem1.subject,
    html: rem1.html,
    text: rem1.text,
    scheduledAt: scheduledIso(DELAY_MS.shareReminderOne),
  });
  if (!reviewScheduled.ok) {
    dbError(scope, "reading share-reminder-1 schedule failed (non-fatal)", reviewScheduled.error, { email });
  }

  const rem2 = shareReminderTwoMail({ firstName, cardUrl: readingUrl });
  const socialProofScheduled = await sendEmail({
    to: email,
    subject: rem2.subject,
    html: rem2.html,
    text: rem2.text,
    scheduledAt: scheduledIso(DELAY_MS.shareReminderTwo),
  });
  if (!socialProofScheduled.ok) {
    dbError(scope, "reading share-reminder-2 schedule failed (non-fatal)", socialProofScheduled.error, { email });
  }

  return { confirmation, delivery, reviewScheduled, socialProofScheduled };
}

export async function sendManualLoveLetterEmails(params: {
  readonly email: string;
  readonly firstName: string;
  readonly readingUrl: string;
}): Promise<ManualEmailResult> {
  const { email, firstName, readingUrl } = params;
  const scope = "manual-fulfillment";

  const confTpl = loveLetterConfirmationMail({ firstName });
  const confirmation = await sendEmail({
    to: email,
    subject: confTpl.subject,
    html: confTpl.html,
    text: confTpl.text,
  });
  if (!confirmation.ok) {
    dbError(scope, "love-letter confirmation email failed (non-fatal)", confirmation.error, { email });
  }

  const delTpl = loveLetterDeliveryMail({ firstName, readingUrl });
  const delivery = await sendEmail({
    to: email,
    subject: delTpl.subject,
    html: delTpl.html,
    text: delTpl.text,
  });
  if (!delivery.ok) {
    dbError(scope, "love-letter delivery email failed (non-fatal)", delivery.error, { email });
  }

  const revTpl = loveLetterReviewMail({ firstName, cardUrl: "https://bluntchart.com/reviews/love-letter" });
  const reviewScheduled = await sendEmail({
    to: email,
    subject: revTpl.subject,
    html: revTpl.html,
    text: revTpl.text,
    scheduledAt: scheduledIso(DELAY_MS.loveLetterReview),
  });
  if (!reviewScheduled.ok) {
    dbError(scope, "love-letter review email schedule failed (non-fatal)", reviewScheduled.error, { email });
  }

  // Love letter has no social-proof follow-up — return a no-op result
  const socialProofScheduled = { ok: true, id: undefined, error: undefined };

  return { confirmation, delivery, reviewScheduled, socialProofScheduled };
}

/** Compose the reader URL from an access token and product type. */
export function manualReadingUrl(accessToken: string, productType: ProductType = "birth-chart-book"): string {
  return accessUrl(accessToken, productType);
}
