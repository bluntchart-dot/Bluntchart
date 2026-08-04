/**
 * lib/db/reading-lifecycle.ts
 *
 * Durable generation queue backed by the Payments table.
 *
 * The Gumroad webhook marks a payment as paid and sets
 * reading_status = 'queued'. A cron worker claims queued orders,
 * runs the V1.2 generation engine, and persists the result in the
 * existing readings table.
 *
 * Lifecycle:
 *   NULL        → (not a generated product, or legacy row)
 *   'queued'    → payment confirmed, awaiting generation
 *   'generating'→ worker claimed, AI pipeline running
 *   'completed' → reading persisted in readings.reading_json
 *   'failed'    → generation failed after max attempts
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { dbError, dbLog } from "./log";
import { DB } from "./tables";
import type { BirthInputs, ProductType, ReadingStatus } from "./types";
import { ensureUser } from "./users";

const STALE_THRESHOLD_MS = 10 * 60 * 1000; // 10 minutes
const DEFAULT_MAX_ATTEMPTS = 3;

/* ─────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────── */

export interface AcknowledgePaymentParams {
  email: string;
  sessionId?: string;
  gumroadPaymentId: string;
  amountCents: number;
  productType: ProductType;
  birthInputs: BirthInputs;
  orderSource?: string;
  userName: string;
}

export interface ClaimedOrder {
  id: string;
  email: string;
  productType: ProductType;
  birthInputs: BirthInputs;
  accessToken: string;
  userId: string | null;
  generationAttempts: number;
}

/* ─────────────────────────────────────────────────────────────────────
   Webhook: acknowledge payment + queue generation
───────────────────────────────────────────────────────────────────── */

export async function acknowledgePayment(
  supabase: SupabaseClient,
  params: AcknowledgePaymentParams
): Promise<{ ok: boolean; paymentId?: string; duplicate?: boolean; error?: string }> {
  const scope = "reading-lifecycle";
  const email = params.email.trim().toLowerCase();

  // Idempotency: already processed this Gumroad transaction
  if (params.gumroadPaymentId) {
    const { data: existing } = await supabase
      .from(DB.payments)
      .select("id, payment_status, reading_status")
      .eq("gumroad_payment_id", params.gumroadPaymentId)
      .neq("payment_status", "pending")
      .maybeSingle();

    if (existing) {
      dbLog(scope, "duplicate transaction — already acknowledged", {
        email,
        gumroadPaymentId: params.gumroadPaymentId,
        paymentStatus: existing.payment_status,
        readingStatus: existing.reading_status,
      });
      return { ok: true, paymentId: existing.id, duplicate: true };
    }
  }

  const { user, error: userError } = await ensureUser(supabase, email, params.userName);
  if (userError || !user) {
    return { ok: false, error: userError ?? "User ensure failed" };
  }

  // Find the pending Payment row created by startCheckout
  let paymentId: string | null = null;

  if (params.sessionId) {
    const { data: bySession } = await supabase
      .from(DB.payments)
      .select("id")
      .eq("session_id", params.sessionId)
      .eq("payment_status", "pending")
      .maybeSingle();
    paymentId = bySession?.id ?? null;
  }

  if (!paymentId) {
    const { data: byEmail } = await supabase
      .from(DB.payments)
      .select("id")
      .eq("email", email)
      .eq("payment_status", "pending")
      .eq("product_type", params.productType)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    paymentId = byEmail?.id ?? null;
  }

  const patch = {
    email,
    user_id: user.id,
    payment_status: "paid",
    payment_provider: "gumroad",
    gumroad_payment_id: params.gumroadPaymentId,
    amount: String(params.amountCents),
    product_type: params.productType,
    order_source: params.orderSource ?? "gumroad",
    reading_status: "queued" as ReadingStatus,
    birth_inputs: params.birthInputs,
    generation_attempts: 0,
    generation_started_at: null,
    generation_error: null,
    delivery_sent_at: null,
    updated_at: new Date().toISOString(),
  };

  if (paymentId) {
    const { error: updateErr } = await supabase
      .from(DB.payments)
      .update(patch)
      .eq("id", paymentId);

    if (updateErr) {
      dbError(scope, "payment update failed", updateErr, { paymentId });
      return { ok: false, error: updateErr.message };
    }
  } else {
    // No pending row found — insert a new paid row directly
    const { data: inserted, error: insertErr } = await supabase
      .from(DB.payments)
      .insert([{ ...patch, session_id: params.sessionId ?? null }])
      .select("id")
      .single();

    if (insertErr || !inserted) {
      dbError(scope, "payment insert failed", insertErr);
      return { ok: false, error: insertErr?.message ?? "Payment insert failed" };
    }
    paymentId = inserted.id;
  }

  dbLog(scope, "payment acknowledged — generation queued", {
    paymentId,
    email,
    productType: params.productType,
  });

  return { ok: true, paymentId: paymentId! };
}

/* ─────────────────────────────────────────────────────────────────────
   Worker: reset stale generating orders
───────────────────────────────────────────────────────────────────── */

export async function resetStaleGenerating(
  supabase: SupabaseClient
): Promise<{ requeued: number; failed: number }> {
  const scope = "reading-lifecycle";
  const cutoff = new Date(Date.now() - STALE_THRESHOLD_MS).toISOString();

  // Re-queue orders that haven't exceeded max attempts
  const { data: requeueable, error: reqErr } = await supabase
    .from(DB.payments)
    .update({
      reading_status: "queued" as ReadingStatus,
      generation_started_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq("reading_status", "generating")
    .lt("generation_started_at", cutoff)
    .lt("generation_attempts", DEFAULT_MAX_ATTEMPTS)
    .select("id, email");

  if (reqErr) {
    dbError(scope, "stale requeue failed", reqErr);
  }

  const requeued = requeueable?.length ?? 0;
  if (requeued > 0) {
    dbLog(scope, "stale orders requeued", {
      count: requeued,
      ids: requeueable!.map((r) => r.id),
    });
  }

  // Permanently fail orders that exceeded max attempts
  const { data: failableRows, error: failErr } = await supabase
    .from(DB.payments)
    .update({
      reading_status: "failed" as ReadingStatus,
      generation_error: "Max generation attempts exceeded",
      updated_at: new Date().toISOString(),
    })
    .eq("reading_status", "generating")
    .lt("generation_started_at", cutoff)
    .gte("generation_attempts", DEFAULT_MAX_ATTEMPTS)
    .select("id, email");

  if (failErr) {
    dbError(scope, "stale fail-marking failed", failErr);
  }

  const failed = failableRows?.length ?? 0;
  if (failed > 0) {
    dbLog(scope, "stale orders marked failed (max attempts)", {
      count: failed,
      ids: failableRows!.map((r) => r.id),
    });
  }

  return { requeued, failed };
}

/* ─────────────────────────────────────────────────────────────────────
   Worker: claim next queued order
───────────────────────────────────────────────────────────────────── */

export async function claimNextQueuedOrder(
  supabase: SupabaseClient,
  productType?: ProductType
): Promise<ClaimedOrder | null> {
  const scope = "reading-lifecycle";

  let query = supabase
    .from(DB.payments)
    .select("id, email, product_type, birth_inputs, access_token, user_id, generation_attempts")
    .eq("payment_status", "paid")
    .eq("reading_status", "queued")
    .order("created_at", { ascending: true })
    .limit(1);

  if (productType) {
    query = query.eq("product_type", productType);
  }

  const { data: candidates } = await query;

  if (!candidates?.length) return null;

  const row = candidates[0];

  if (!row.birth_inputs || !row.access_token) {
    dbError(scope, "queued order missing birth_inputs or access_token", "", {
      paymentId: row.id,
    });
    await supabase
      .from(DB.payments)
      .update({
        reading_status: "failed" as ReadingStatus,
        generation_error: "Missing birth_inputs or access_token",
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.id);
    return null;
  }

  // Atomically claim — the guard prevents double-claiming
  const { data: claimed } = await supabase
    .from(DB.payments)
    .update({
      reading_status: "generating" as ReadingStatus,
      generation_started_at: new Date().toISOString(),
      generation_attempts: row.generation_attempts + 1,
      generation_error: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", row.id)
    .eq("reading_status", "queued")
    .select("id")
    .maybeSingle();

  if (!claimed) {
    dbLog(scope, "claim race — another worker got it", { paymentId: row.id });
    return null;
  }

  dbLog(scope, "order claimed for generation", {
    paymentId: row.id,
    email: row.email,
    attempt: row.generation_attempts + 1,
  });

  return {
    id: row.id,
    email: row.email,
    productType: row.product_type,
    birthInputs: row.birth_inputs as BirthInputs,
    accessToken: row.access_token,
    userId: row.user_id,
    generationAttempts: row.generation_attempts + 1,
  };
}

/* ─────────────────────────────────────────────────────────────────────
   Worker: persist completed reading
───────────────────────────────────────────────────────────────────── */

export async function completeGeneration(
  supabase: SupabaseClient,
  paymentId: string,
  params: {
    userId: string | null;
    birthInputs: BirthInputs;
    readingJson: Record<string, unknown>;
    productType: ProductType;
  }
): Promise<{ ok: boolean; readingId?: string; error?: string }> {
  const scope = "reading-lifecycle";

  // Idempotency: check if reading already exists for this payment
  const { data: existingReading } = await supabase
    .from(DB.readings)
    .select("id")
    .eq("payment_id", paymentId)
    .limit(1)
    .maybeSingle();

  let readingId: string;

  if (existingReading) {
    dbLog(scope, "reading already exists — skipping insert", {
      paymentId,
      readingId: existingReading.id,
    });
    readingId = existingReading.id;
  } else {
    const readingPayload = {
      ...params.readingJson,
      meta: {
        ...(params.readingJson.meta as Record<string, unknown> ?? {}),
        dob: params.birthInputs.dob,
        name: params.birthInputs.name,
        birth_place: params.birthInputs.birth_place,
      },
    };

    const { data: reading, error: readErr } = await supabase
      .from(DB.readings)
      .insert([
        {
          user_id: params.userId,
          payment_id: paymentId,
          birth_time: params.birthInputs.birth_time,
          birth_place: params.birthInputs.birth_place,
          timezone: params.birthInputs.timezone,
          reading_json: readingPayload,
          reading_status: "complete",
          product_type: params.productType,
        },
      ])
      .select("id")
      .single();

    if (readErr || !reading) {
      dbError(scope, "reading insert failed", readErr, { paymentId });
      return { ok: false, error: readErr?.message ?? "Reading insert failed" };
    }
    readingId = reading.id;
  }

  // Mark generation as completed on the Payment row
  const { error: updateErr } = await supabase
    .from(DB.payments)
    .update({
      reading_status: "completed" as ReadingStatus,
      generation_error: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", paymentId);

  if (updateErr) {
    dbError(scope, "payment completion update failed", updateErr, { paymentId });
    return { ok: false, error: updateErr.message };
  }

  dbLog(scope, "generation completed", { paymentId, readingId });
  return { ok: true, readingId };
}

/* ─────────────────────────────────────────────────────────────────────
   Worker: mark generation failed
───────────────────────────────────────────────────────────────────── */

export async function failGeneration(
  supabase: SupabaseClient,
  paymentId: string,
  error: string
): Promise<void> {
  const scope = "reading-lifecycle";

  const { error: updateErr } = await supabase
    .from(DB.payments)
    .update({
      reading_status: "failed" as ReadingStatus,
      generation_error: error,
      updated_at: new Date().toISOString(),
    })
    .eq("id", paymentId);

  if (updateErr) {
    dbError(scope, "fail-marking failed", updateErr, { paymentId });
  } else {
    dbLog(scope, "generation marked failed", { paymentId, error });
  }
}

/* ─────────────────────────────────────────────────────────────────────
   Worker: record successful delivery
───────────────────────────────────────────────────────────────────── */

export async function recordDelivery(
  supabase: SupabaseClient,
  paymentId: string
): Promise<void> {
  await supabase
    .from(DB.payments)
    .update({
      delivery_sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", paymentId);
}

/* ─────────────────────────────────────────────────────────────────────
   Admin: retry a failed order
───────────────────────────────────────────────────────────────────── */

export async function retryGeneration(
  supabase: SupabaseClient,
  paymentId: string
): Promise<{ ok: boolean; error?: string }> {
  const { data, error } = await supabase
    .from(DB.payments)
    .update({
      reading_status: "queued" as ReadingStatus,
      generation_started_at: null,
      generation_error: null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", paymentId)
    .in("reading_status", ["failed"])
    .select("id")
    .maybeSingle();

  if (error) return { ok: false, error: error.message };
  if (!data) return { ok: false, error: "Payment not found or not in failed state" };
  return { ok: true };
}

/* ─────────────────────────────────────────────────────────────────────
   Admin: check if a reading exists (for delivery retry)
───────────────────────────────────────────────────────────────────── */

export async function hasCompletedReading(
  supabase: SupabaseClient,
  paymentId: string
): Promise<boolean> {
  const { data } = await supabase
    .from(DB.readings)
    .select("id")
    .eq("payment_id", paymentId)
    .limit(1)
    .maybeSingle();
  return !!data;
}
