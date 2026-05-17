import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { buildPaidReadingPayload } from "@/lib/build-paid-reading";
import {
  loadBirthLeadByEmail,
  readingAccessUrl,
  SITE_URL,
} from "@/lib/db/checkout-flow";
import { fulfillPaidOrder, markPaymentFailed } from "@/lib/db/fulfillment";
import { parseGumroadSessionId } from "@/lib/gumroad-checkout";
import { dbError, dbLog } from "@/lib/db/log";
import { DB } from "@/lib/db/tables";
import { sendEmail } from "@/lib/send-email";
import {
  paidConfirmationMail,
  fullReadingDeliveryMail,
} from "@/lib/email-templates";

function isPaidStatus(status: string | null | undefined): boolean {
  return (status ?? "").trim().toLowerCase() === "paid";
}

/**
 * POST /api/gumroad-webhook
 *
 * Gumroad sale → load lead → generate reading + chart → save → email private link.
 */
export async function POST(req: Request) {
  const scope = "gumroad-webhook";

  try {
    const raw = await req.text();
    const params = new URLSearchParams(raw);

    const email = (
      params.get("email") ||
      params.get("purchaser_email") ||
      ""
    )
      .trim()
      .toLowerCase();

    const gumroadPaymentId =
      params.get("sale_id") || params.get("id") || "";

    const amountCents = Number(params.get("price") || "1500");

    const sessionId = parseGumroadSessionId(params);

    dbLog(scope, "webhook received", {
      email,
      gumroadPaymentId,
      sessionId: sessionId ?? null,
    });

    if (!email) {
      dbError(scope, "missing email", "");
      return Response.json({ error: "Missing email" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();

    // Idempotent: already fulfilled for this sale
    if (gumroadPaymentId) {
      const { data: existingSale } = await supabase
        .from(DB.payments)
        .select("id, access_token, payment_status")
        .eq("gumroad_payment_id", gumroadPaymentId)
        .maybeSingle();

      if (
        existingSale &&
        isPaidStatus(existingSale.payment_status) &&
        existingSale.access_token
      ) {
        const accessUrl = readingAccessUrl(existingSale.access_token);
        dbLog(scope, "duplicate webhook — already fulfilled", { email });
        return Response.json({ success: true, accessUrl, duplicate: true });
      }
    }

    const { lead, error: leadError } = await loadBirthLeadByEmail(
      supabase,
      email
    );

    if (leadError) {
      dbError(scope, "load lead failed", leadError, { email });
      return Response.json({ error: leadError }, { status: 500 });
    }

    if (!lead || !lead.birth_time || !lead.dob) {
      dbError(scope, "no abandoned_checkouts row for purchaser", "", { email });
      return Response.json(
        {
          error:
            "No checkout data found. User must submit the form before paying.",
          email,
        },
        { status: 200 }
      );
    }

    const firstName = lead.name.split(" ")[0] || lead.name;

    try {
      const paymentTemplate = paidConfirmationMail({
        firstName,
        birthDate: lead.dob,
      });
      await sendEmail({
        to: email,
        subject: paymentTemplate.subject,
        html: paymentTemplate.html,
        text: paymentTemplate.text,
      });
    } catch (mailErr) {
      dbError(scope, "confirmation email failed (non-fatal)", mailErr);
    }

    const readingJson = await buildPaidReadingPayload(lead);

    if (!readingJson) {
      await markPaymentFailed(supabase, email, gumroadPaymentId, sessionId);
      return Response.json(
        { error: "Reading generation failed" },
        { status: 500 }
      );
    }

    const fulfilled = await fulfillPaidOrder(supabase, {
      email,
      gumroadPaymentId,
      amountCents,
      sessionId,
      lead,
      readingJson,
    });

    if (!fulfilled.ok || !fulfilled.accessToken) {
      dbError(scope, "fulfillPaidOrder failed", fulfilled.error ?? "", { email });
      return Response.json(
        { error: fulfilled.error ?? "Fulfillment failed" },
        { status: 500 }
      );
    }

    const accessUrl = readingAccessUrl(fulfilled.accessToken);

    dbLog(scope, "fulfillment complete", {
      email,
      paymentId: fulfilled.paymentId,
      readingId: fulfilled.readingId,
      accessUrl,
    });

    try {
      const deliveryTemplate = fullReadingDeliveryMail({
        firstName,
        birthDate: lead.dob,
        readingUrl: accessUrl,
        cardUrl: SITE_URL,
      });

      await sendEmail({
        to: email,
        subject: deliveryTemplate.subject,
        html: deliveryTemplate.html,
        text: deliveryTemplate.text,
      });
    } catch (mailErr) {
      dbError(scope, "delivery email failed (non-fatal)", mailErr);
    }

    return Response.json({
      success: true,
      accessUrl,
    });
  } catch (err) {
    dbError(scope, "unexpected", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
