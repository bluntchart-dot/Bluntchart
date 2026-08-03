/**
 * lib/premium/manual-fulfillment.ts
 *
 * Simplified manual fulfillment for /internal/premium (Personal / Test /
 * Etsy / Other).
 *
 * Manual fulfillment is an internal delivery mechanism, NOT a payment.
 * This module writes ONE row into `readings` and nothing else:
 *
 *   readings.access_token   ← permanent recovery key (used by /my-book?token=)
 *   readings.order_source   ← where this reading came from
 *   readings.email          ← quick admin lookup, no join required
 *   readings.reading_json   ← the PremiumReading itself
 *
 * Payments is not touched. No fabricated payment id, session id, amount,
 * or status. Fewer failure surfaces than the previous design.
 *
 * The /my-book?token=... reader falls back to readings.access_token when
 * no matching Payments row exists — see loadReadingByAccessToken in
 * lib/db/fulfillment.ts. The Gumroad write path (fulfillPaidOrder) is
 * untouched.
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
  readonly readingId?: string;
  readonly accessToken?: string;
  readonly error?: string;
}

/**
 * Persist a manual book fulfillment. Writes a single readings row with
 * a permanent access_token — no Payments row is created.
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

  // Ensure the user row exists so admin queries can join on user_id.
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
        // payment_id stays NULL — this reading was never paid for through
        // our checkout. FK on readings.payment_id is `ON DELETE SET NULL`
        // (see initial_schema.sql), so NULL is explicitly allowed.
        payment_id: null,
        birth_time: params.birth.birth_time,
        birth_place: params.birth.birth_place,
        timezone: params.birth.timezone,
        reading_json: params.reading as unknown as Record<string, unknown>,
        reading_status: "complete",
        product_type: "birth-chart-book",
        access_token: accessToken,
        order_source: params.orderSource,
        email,
      },
    ])
    .select("id")
    .single();

  if (insert.error || !insert.data) {
    dbError(scope, "readings insert failed", insert.error, { email });
    return {
      ok: false,
      error: insert.error?.message ?? "Reading insert failed",
    };
  }

  const readingId: string = insert.data.id;
  dbLog(scope, "reading saved", {
    readingId,
    email,
    orderSource: params.orderSource,
  });

  return { ok: true, readingId, accessToken };
}

/* ─────────────────────────────────────────────────────────────────────
   Email orchestration for manual fulfillment
   Uses the same book delivery + follow-up templates as Gumroad, plus a
   manual-flavoured confirmation that never says "payment received".
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

  // 2. Delivery (same template as Gumroad)
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
