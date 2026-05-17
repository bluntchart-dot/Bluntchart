import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { dbError, dbLog } from "./log";
import { ensureUser } from "./users";
import type { CheckoutStartPayload, CheckoutStep } from "./types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bluntchart.com";

export function readingAccessUrl(accessToken: string): string {
  return `${SITE_URL}/my-reading?token=${encodeURIComponent(accessToken)}`;
}

/**
 * Step 1 of funnel: form submitted → users + payments (pending) + abandoned_checkouts.
 * Does NOT use pending_readings.
 */
export async function startCheckout(
  supabase: SupabaseClient,
  payload: CheckoutStartPayload
): Promise<{
  ok: boolean;
  sessionId?: string;
  paymentId?: string;
  userId?: string;
  error?: string;
}> {
  const email = payload.email.trim().toLowerCase();
  const sessionId = randomUUID();

  dbLog("checkout", "startCheckout", { email, sessionId });

  const { user, error: userError } = await ensureUser(
    supabase,
    email,
    payload.name
  );
  if (userError || !user) {
    return { ok: false, error: userError ?? "Could not create user" };
  }

  // Pending payment row — linked to Gumroad webhook via session_id + email
  const { data: payment, error: paymentError } = await supabase
    .from("payments")
    .insert([
      {
        session_id: sessionId,
        email,
        user_id: user.id,
        amount: "15",
        payment_status: "pending",
        payment_provider: "gumroad",
        gumroad_payment_id: null,
        access_token: null,
      },
    ])
    .select("id, session_id")
    .single();

  if (paymentError || !payment) {
    dbError("checkout", "payments insert failed", paymentError, {
      sessionId,
      userId: user.id,
    });
    return {
      ok: false,
      error: paymentError?.message ?? "Payment row insert failed",
    };
  }

  dbLog("checkout", "pending payment created", {
    paymentId: payment.id,
    sessionId,
  });

  // Incomplete lead — replaced on each new attempt for same email
  const { error: deleteAbandonedError } = await supabase
    .from("abandoned_checkouts")
    .delete()
    .eq("email", email);

  if (deleteAbandonedError) {
    dbError("checkout", "abandoned_checkouts delete warning", deleteAbandonedError, {
      email,
    });
  }

  const step: CheckoutStep = payload.step_reached ?? "form_submitted";

  const { error: abandonedError } = await supabase
    .from("abandoned_checkouts")
    .insert([
      {
        email,
        name: payload.name.trim(),
        dob: payload.dob,
        birth_time: payload.birth_time,
        birth_place: payload.birth_place,
        timezone: payload.timezone?.trim() || null,
        step_reached: step,
        utm_source: payload.utm_source?.trim() || null,
        user_id: user.id,
        abandoned_at: new Date().toISOString(),
      },
    ]);

  if (abandonedError) {
    dbError("checkout", "abandoned_checkouts insert failed", abandonedError, {
      email,
      sessionId,
    });
    return {
      ok: false,
      error: abandonedError.message ?? "Abandoned checkout insert failed",
    };
  }

  dbLog("checkout", "abandoned_checkouts saved", { email, step });

  return {
    ok: true,
    sessionId,
    paymentId: payment.id,
    userId: user.id,
  };
}

/** Update funnel step on abandoned_checkouts + optional payment session match by email. */
export async function updateCheckoutStep(
  supabase: SupabaseClient,
  email: string,
  step: CheckoutStep
): Promise<{ ok: boolean; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();

  const { error } = await supabase
    .from("abandoned_checkouts")
    .update({ step_reached: step, abandoned_at: new Date().toISOString() })
    .eq("email", normalizedEmail);

  if (error) {
    dbError("checkout", "updateCheckoutStep failed", error, {
      email: normalizedEmail,
      step,
    });
    return { ok: false, error: error.message };
  }

  dbLog("checkout", "step updated", { email: normalizedEmail, step });
  return { ok: true };
}

export interface BirthLead {
  name: string;
  email: string;
  dob: string;
  birth_time: string;
  birth_place: string;
  timezone: string | null;
  user_id: string | null;
}

/** Load birth details for paid fulfillment (abandoned_checkouts is source of truth pre-payment). */
export async function loadBirthLeadByEmail(
  supabase: SupabaseClient,
  email: string
): Promise<{ lead: BirthLead | null; error: string | null }> {
  const normalizedEmail = email.trim().toLowerCase();

  const { data, error } = await supabase
    .from("abandoned_checkouts")
    .select(
      "name, email, dob, birth_time, birth_place, timezone, user_id"
    )
    .eq("email", normalizedEmail)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    dbError("checkout", "loadBirthLeadByEmail failed", error, {
      email: normalizedEmail,
    });
    return { lead: null, error: error.message };
  }

  if (!data) {
    dbLog("checkout", "no abandoned_checkouts row for email", {
      email: normalizedEmail,
    });
    return { lead: null, error: null };
  }

  return {
    lead: {
      name: data.name ?? "",
      email: data.email,
      dob: data.dob ?? "",
      birth_time: data.birth_time ?? "",
      birth_place: data.birth_place ?? "",
      timezone: data.timezone,
      user_id: data.user_id,
    },
    error: null,
  };
}

/** Find latest pending payment for this checkout session or email. */
export async function findPendingPayment(
  supabase: SupabaseClient,
  opts: { sessionId?: string; email: string }
): Promise<{ id: string; session_id: string | null } | null> {
  const email = opts.email.trim().toLowerCase();

  if (opts.sessionId) {
    const { data, error } = await supabase
      .from("payments")
      .select("id, session_id, payment_status")
      .eq("session_id", opts.sessionId)
      .maybeSingle();

    if (!error && data) {
      return { id: data.id, session_id: data.session_id };
    }
  }

  const { data: rows, error } = await supabase
    .from("payments")
    .select("id, session_id, payment_status, created_at")
    .eq("email", email)
    .eq("payment_status", "pending")
    .order("created_at", { ascending: false })
    .limit(1);

  if (error || !rows?.length) {
    return null;
  }

  return { id: rows[0].id, session_id: rows[0].session_id };
}

export { SITE_URL };
