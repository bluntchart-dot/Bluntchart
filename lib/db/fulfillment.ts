import { randomUUID } from "crypto";
import type { SupabaseClient } from "@supabase/supabase-js";
import { dbError, dbLog } from "./log";
import { DB } from "./tables";
import { ensureUser } from "./users";
import type { BirthLead } from "./checkout-flow";

/**
 * After Gumroad payment: attach reading to payments + readings, issue access_token.
 */
export async function fulfillPaidOrder(
  supabase: SupabaseClient,
  params: {
    email: string;
    gumroadPaymentId: string;
    amountCents: number;
    sessionId?: string;
    lead: BirthLead;
    readingJson: Record<string, unknown>;
  }
): Promise<{
  ok: boolean;
  accessToken?: string;
  paymentId?: string;
  readingId?: string;
  error?: string;
}> {
  const email = params.email.trim().toLowerCase();
  const accessToken = randomUUID();

  const { user, error: userError } = await ensureUser(
    supabase,
    email,
    params.lead.name
  );
  if (userError || !user) {
    return { ok: false, error: userError ?? "User ensure failed" };
  }

  const userId = params.lead.user_id ?? user.id;

  // Resolve pending payment row
  let paymentId: string | null = null;

  if (params.sessionId) {
    const { data: bySession } = await supabase
      .from(DB.payments)
      .select("id")
      .eq("session_id", params.sessionId)
      .maybeSingle();
    paymentId = bySession?.id ?? null;
  }

  if (!paymentId) {
    const { data: pendingRows } = await supabase
      .from(DB.payments)
      .select("id")
      .eq("email", email)
      .eq("payment_status", "pending")
      .order("created_at", { ascending: false })
      .limit(1);
    paymentId = pendingRows?.[0]?.id ?? null;
  }

  const paymentPatch = {
    email,
    user_id: userId,
    gumroad_payment_id: params.gumroadPaymentId,
    amount: String(params.amountCents),
    payment_status: "paid",
    payment_provider: "gumroad",
    access_token: accessToken,
    session_id: params.sessionId ?? undefined,
    updated_at: new Date().toISOString(),
  };

  if (paymentId) {
    const { error: updatePayError } = await supabase
      .from(DB.payments)
      .update(paymentPatch)
      .eq("id", paymentId);

    if (updatePayError) {
      dbError("fulfillment", "payment update failed", updatePayError, {
        paymentId,
      });
      return { ok: false, error: updatePayError.message };
    }
  } else {
    const { data: inserted, error: insertPayError } = await supabase
      .from(DB.payments)
      .insert([
        {
          ...paymentPatch,
          session_id: params.sessionId ?? randomUUID(),
        },
      ])
      .select("id")
      .single();

    if (insertPayError || !inserted) {
      dbError("fulfillment", "payment insert failed", insertPayError);
      return {
        ok: false,
        error: insertPayError?.message ?? "Payment insert failed",
      };
    }
    paymentId = inserted.id;
  }

  dbLog("fulfillment", "payment marked paid", { paymentId, accessToken });

  const readingPayload = {
    ...params.readingJson,
    meta: {
      dob: params.lead.dob,
      name: params.lead.name,
      birth_place: params.lead.birth_place,
    },
  };

  const { data: reading, error: readingError } = await supabase
    .from(DB.readings)
    .insert([
      {
        user_id: userId,
        payment_id: paymentId,
        birth_time: params.lead.birth_time,
        birth_place: params.lead.birth_place,
        timezone: params.lead.timezone,
        reading_json: readingPayload,
        reading_status: "complete",
      },
    ])
    .select("id")
    .single();

  if (readingError || !reading) {
    dbError("fulfillment", "readings insert failed", readingError, { paymentId });
    return {
      ok: false,
      error: readingError?.message ?? "Reading insert failed",
    };
  }

  dbLog("fulfillment", "reading saved", {
    readingId: reading.id,
    paymentId,
  });

  // Paid — remove from abandoned leads
  const { error: abandonDeleteError } = await supabase
    .from(DB.abandonedCheckouts)
    .delete()
    .eq("email", email);

  if (abandonDeleteError) {
    dbError("fulfillment", "abandoned_checkouts delete failed", abandonDeleteError, {
      email,
    });
  } else {
    dbLog("fulfillment", "abandoned_checkouts cleared after payment", { email });
  }

  if (!paymentId) {
    return { ok: false, error: "Payment id missing after fulfillment" };
  }

  return {
    ok: true,
    accessToken,
    paymentId,
    readingId: reading.id,
  };
}

export async function markPaymentFailed(
  supabase: SupabaseClient,
  email: string,
  gumroadPaymentId: string,
  sessionId?: string
) {
  const patch = {
    payment_status: "paid_generation_failed",
    gumroad_payment_id: gumroadPaymentId,
    updated_at: new Date().toISOString(),
  };

  if (sessionId) {
    await supabase.from(DB.payments).update(patch).eq("session_id", sessionId);
  } else {
    await supabase
      .from(DB.payments)
      .update(patch)
      .eq("email", email.trim().toLowerCase())
      .eq("payment_status", "pending");
  }
}

export async function loadReadingByAccessToken(
  supabase: SupabaseClient,
  accessToken: string
): Promise<{
  reading: Record<string, unknown> | null;
  birth_time: string | null;
  birth_place: string | null;
  error: string | null;
}> {
  const { data: payment, error: payError } = await supabase
    .from(DB.payments)
    .select("id, payment_status, access_token")
    .eq("access_token", accessToken)
    .in("payment_status", ["paid", "completed"])
    .maybeSingle();

  if (payError) {
    dbError("fulfillment", "payment lookup by token failed", payError);
    return { reading: null, birth_time: null, birth_place: null, error: payError.message };
  }

  if (!payment) {
    return {
      reading: null,
      birth_time: null,
      birth_place: null,
      error: "Invalid or expired link",
    };
  }

  const { data: readingRow, error: readError } = await supabase
    .from(DB.readings)
    .select("reading_json, birth_time, birth_place, reading_status")
    .eq("payment_id", payment.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (readError) {
    dbError("fulfillment", "reading lookup failed", readError);
    return {
      reading: null,
      birth_time: null,
      birth_place: null,
      error: readError.message,
    };
  }

  if (!readingRow?.reading_json) {
    return {
      reading: null,
      birth_time: null,
      birth_place: null,
      error: "Reading not found for this payment",
    };
  }

  return {
    reading: readingRow.reading_json as Record<string, unknown>,
    birth_time: readingRow.birth_time,
    birth_place: readingRow.birth_place,
    error: null,
  };
}