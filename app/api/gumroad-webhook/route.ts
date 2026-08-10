import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { buildPaidReadingPayload } from "@/lib/build-paid-reading";
import { loadBirthLeadByEmail } from "@/lib/db/checkout-flow";
import { fulfillPaidOrder, markPaymentFailed } from "@/lib/db/fulfillment";
import { acknowledgePayment } from "@/lib/db/reading-lifecycle";
import { parseGumroadSessionId } from "@/lib/gumroad-checkout";
import { generateLoveLetter } from "@/lib/future-love-letter/generate-letter";
import { dbError, dbLog } from "@/lib/db/log";
import { DB } from "@/lib/db/tables";
import type { BirthInputs, ProductType } from "@/lib/db/types";
import {
  accessUrl,
  detectProductByPermalink,
  isKnownProduct,
  getProduct,
} from "@/lib/products";
import { sendEmail, cancelScheduledEmail } from "@/lib/send-email";
import { DELAY_MS, scheduledIso } from "@/lib/email-timing";
import {
  paidConfirmationMail,
  fullReadingDeliveryMail,
  shareReminderOneMail,
  shareReminderTwoMail,
  bookConfirmationMail,
  loveLetterConfirmationMail,
  loveLetterDeliveryMail,
  loveLetterReviewMail,
} from "@/lib/email-templates";

function isPaidStatus(status: string | null | undefined): boolean {
  return (status ?? "").trim().toLowerCase() === "paid";
}

function detectProductTypeFromWebhook(params: URLSearchParams): ProductType | null {
  const permalink =
    params.get("permalink") ??
    params.get("product_permalink") ??
    params.get("short_product_id") ??
    "";
  const byPermalink = detectProductByPermalink(permalink);
  if (byPermalink) return byPermalink.type;

  const productName = params.get("product_name") ?? "";
  if (productName.toLowerCase().includes("in-depth") || productName.toLowerCase().includes("birth chart book")) {
    return "birth-chart-book";
  }

  return null;
}

/**
 * POST /api/gumroad-webhook
 *
 * Gumroad sale → validate → route by product type:
 *
 *   birth-chart-book → mark paid + queue generation → return 200 fast
 *                      (cron worker handles generation asynchronously)
 *
 *   all other products → legacy synchronous path
 *                        (generate → persist → deliver → return 200)
 *
 * Product type resolution:
 *   1. Lead's product_type (set by the website form) is the SOURCE OF TRUTH.
 *   2. Webhook fields are secondary validation — mismatch = stop + log.
 *   3. No lead = stop fulfillment (website buyers must submit the form first).
 *   4. Unknown product = stop fulfillment (never silently default to "reading").
 */
export async function POST(req: Request) {
  const scope = "gumroad-webhook";

  try {
    const raw = await req.text();
    const params = new URLSearchParams(raw);

    const email = (
      params.get("email") ||
      params.get("purchaser_email") ||
      params.get("buyer_email") ||
      ""
    )
      .trim()
      .toLowerCase();

    const gumroadPaymentId =
      params.get("sale_id") || params.get("id") || params.get("transaction_id") || "";

    const sessionId = parseGumroadSessionId(params);
    const webhookProductType = detectProductTypeFromWebhook(params);

    const allFields: Record<string, string> = {};
    for (const [key, value] of params.entries()) {
      allFields[key] = value;
    }
    dbLog(scope, "webhook received — full payload", allFields);

    dbLog(scope, "webhook received", {
      email,
      gumroadPaymentId,
      sessionId: sessionId ?? null,
      webhookProductType: webhookProductType ?? "undetected",
      permalink: params.get("permalink") ?? "MISSING",
      product_permalink: params.get("product_permalink") ?? "MISSING",
      short_product_id: params.get("short_product_id") ?? "MISSING",
      product_name: params.get("product_name") ?? "MISSING",
    });

    if (!email) {
      dbError(scope, "missing email", "");
      return Response.json({ error: "Missing email" }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();

    // ── Load lead from Supabase — this is where product_type + birth data live ──
    const { lead, error: leadError } = await loadBirthLeadByEmail(
      supabase,
      email,
      sessionId
    );

    if (leadError) {
      dbError(scope, "load lead failed", leadError, { email, sessionId });
      return Response.json({ error: leadError }, { status: 500 });
    }

    if (!lead || !lead.birth_time || !lead.dob) {
      dbError(scope, "FULFILLMENT STOPPED — no lead found for purchaser", "", {
        email,
        sessionId,
        webhookProductType: webhookProductType ?? "undetected",
      });
      return Response.json(
        {
          error: "No checkout data found. User must submit the form before paying.",
          email,
        },
        { status: 200 }
      );
    }

    // ── Resolve product type: DATABASE IS SOURCE OF TRUTH ──
    const productType: ProductType = lead.product_type;

    if (!isKnownProduct(productType)) {
      dbError(scope, "FULFILLMENT STOPPED — unknown product type in lead", "", {
        email,
        sessionId,
        leadProductType: productType,
      });
      return Response.json(
        { error: "Unknown product type — fulfillment stopped" },
        { status: 500 }
      );
    }

    if (webhookProductType && webhookProductType !== productType) {
      dbError(scope, "FULFILLMENT STOPPED — product type mismatch between DB and webhook", "", {
        email,
        sessionId,
        dbProductType: productType,
        webhookProductType,
      });
      return Response.json(
        { error: "Product type mismatch — fulfillment stopped for safety" },
        { status: 500 }
      );
    }

    const product = getProduct(productType);
    const isBook = productType === "birth-chart-book";
    const amountCents = Number(params.get("price") || String(product.priceCents));

    dbLog(scope, "lead found — product type resolved", {
      email,
      sessionId,
      name: lead.name,
      dob: lead.dob,
      productType,
      webhookProductType: webhookProductType ?? "undetected",
      isBook,
    });

    // ── Cancel abandoned-cart emails ──
    await Promise.all(
      [lead.preview_email_id, lead.abandoned_one_email_id, lead.abandoned_two_email_id, lead.abandoned_three_email_id]
        .filter((id): id is string => !!id)
        .map((id) => cancelScheduledEmail(id))
    );

    const firstName = lead.name.split(" ")[0] || lead.name;

    // ═══════════════════════════════════════════════════════════════════
    // BOOK PATH — async queue (new architecture)
    // ═══════════════════════════════════════════════════════════════════
    if (isBook) {
      const birthInputs: BirthInputs = {
        name: lead.name,
        dob: lead.dob,
        birth_time: lead.birth_time,
        birth_place: lead.birth_place,
        timezone: lead.timezone,
        birth_lat: lead.birth_lat ?? null,
        birth_lng: lead.birth_lng ?? null,
      };

      const ack = await acknowledgePayment(supabase, {
        email,
        sessionId,
        gumroadPaymentId,
        amountCents,
        productType,
        birthInputs,
        orderSource: "gumroad",
        userName: lead.name,
      });

      if (!ack.ok) {
        dbError(scope, "acknowledgePayment failed", ack.error ?? "", { email });
        return Response.json(
          { error: ack.error ?? "Payment acknowledgement failed" },
          { status: 500 }
        );
      }

      if (ack.duplicate) {
        dbLog(scope, "duplicate webhook — already processed", { email, gumroadPaymentId });
        return Response.json({ success: true, duplicate: true });
      }

      dbLog(scope, "payment acknowledged + generation queued", {
        email,
        paymentId: ack.paymentId,
        productType,
      });

      // Confirmation email (non-fatal)
      try {
        const paymentTemplate = bookConfirmationMail({ firstName, birthDate: lead.dob });
        await sendEmail({
          to: email,
          subject: paymentTemplate.subject,
          html: paymentTemplate.html,
          text: paymentTemplate.text,
        });
        dbLog(scope, "confirmation email sent", { email, productType });
      } catch (mailErr) {
        dbError(scope, "confirmation email failed (non-fatal)", mailErr, { email });
      }

      // Trigger GitHub Actions generation for this specific payment.
      // Non-fatal: if dispatch fails, the watchdog picks up the queued order.
      try {
        const ghRepo = process.env.GITHUB_REPO;
        const ghPat = process.env.GITHUB_PAT;
        if (ghRepo && ghPat) {
          const dispatchRes = await fetch(
            `https://api.github.com/repos/${ghRepo}/dispatches`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${ghPat}`,
                Accept: "application/vnd.github+json",
                "X-GitHub-Api-Version": "2022-11-28",
              },
              body: JSON.stringify({
                event_type: "generate-book",
                client_payload: { paymentId: ack.paymentId },
              }),
            }
          );
          dbLog(scope, "GitHub dispatch attempted", {
            paymentId: ack.paymentId,
            status: dispatchRes.status,
          });
        }
      } catch (dispatchErr) {
        dbError(scope, "GitHub dispatch failed (non-fatal, watchdog will recover)", dispatchErr, {
          paymentId: ack.paymentId,
        });
      }

      return Response.json({
        success: true,
        paymentId: ack.paymentId,
        readingStatus: "queued",
      });
    }

    // ═══════════════════════════════════════════════════════════════════
    // LOVE LETTER PATH — synchronous Gemini generation
    // ═══════════════════════════════════════════════════════════════════
    if (productType === "future-love-letter") {
      // Idempotent check
      if (gumroadPaymentId) {
        const { data: existingSale } = await supabase
          .from(DB.payments)
          .select("id, access_token, payment_status, product_type")
          .eq("gumroad_payment_id", gumroadPaymentId)
          .maybeSingle();

        if (existingSale && isPaidStatus(existingSale.payment_status) && existingSale.access_token) {
          const url = accessUrl(existingSale.access_token, "future-love-letter");
          dbLog(scope, "love letter already fulfilled — duplicate webhook", { email, accessUrl: url });
          return Response.json({ success: true, accessUrl: url, duplicate: true });
        }
      }

      // Confirmation email
      try {
        const tpl = loveLetterConfirmationMail({ firstName });
        await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text });
        dbLog(scope, "love letter confirmation email sent", { email });
      } catch (mailErr) {
        dbError(scope, "love letter confirmation email failed (non-fatal)", mailErr, { email });
      }

      // Generate the letter
      dbLog(scope, "love letter generation started", { email });

      const letterResult = await generateLoveLetter({
        name: lead.name,
        date: lead.dob,
        time: lead.birth_time,
        lat: lead.birth_lat ?? 0,
        lng: lead.birth_lng ?? 0,
        placeName: lead.birth_place,
        timezone: lead.timezone,
      });

      if (!letterResult.ok || !letterResult.letter) {
        dbError(scope, "love letter generation failed", letterResult.error ?? "", { email });
        await markPaymentFailed(supabase, email, gumroadPaymentId, sessionId);
        return Response.json({ error: "Letter generation failed" }, { status: 500 });
      }

      dbLog(scope, "love letter generation success", { email });

      const readingJson = {
        letter: letterResult.letter,
        shareableQuotes: letterResult.shareableQuotes ?? [],
        meta: { name: lead.name, dob: lead.dob, birth_place: lead.birth_place },
      };

      // Fulfill order (creates reading + updates payment)
      const fulfilled = await fulfillPaidOrder(supabase, {
        email,
        gumroadPaymentId,
        amountCents,
        sessionId,
        productType: "future-love-letter",
        lead,
        readingJson,
      });

      if (!fulfilled.ok || !fulfilled.accessToken) {
        dbError(scope, "love letter fulfillment failed", fulfilled.error ?? "", { email });
        return Response.json({ error: fulfilled.error ?? "Fulfillment failed" }, { status: 500 });
      }

      const letterUrl = accessUrl(fulfilled.accessToken, "future-love-letter");
      dbLog(scope, "love letter saved", { email, accessUrl: letterUrl });

      // Delivery email
      try {
        const tpl = loveLetterDeliveryMail({ firstName, readingUrl: letterUrl });
        await sendEmail({ to: email, subject: tpl.subject, html: tpl.html, text: tpl.text });
        dbLog(scope, "love letter delivery email sent", { email, accessUrl: letterUrl });
      } catch (mailErr) {
        dbError(scope, "love letter delivery email failed (non-fatal)", mailErr, { email });
      }

      // Review email (24h later)
      try {
        await sendEmail({
          to: email,
          ...loveLetterReviewMail({ firstName, cardUrl: "https://bluntchart.com/reviews/love-letter" }),
          scheduledAt: scheduledIso(DELAY_MS.loveLetterReview),
        });
        dbLog(scope, "love letter review email scheduled", { email });
      } catch (mailErr) {
        dbError(scope, "love letter review email scheduling failed (non-fatal)", mailErr, { email });
      }

      return Response.json({ success: true, accessUrl: letterUrl });
    }

    // ═══════════════════════════════════════════════════════════════════
    // NON-BOOK PATH — legacy synchronous fulfillment (unchanged)
    // ═══════════════════════════════════════════════════════════════════

    // Idempotent: already fulfilled for this sale
    if (gumroadPaymentId) {
      const { data: existingSale } = await supabase
        .from(DB.payments)
        .select("id, access_token, payment_status, product_type")
        .eq("gumroad_payment_id", gumroadPaymentId)
        .maybeSingle();

      if (
        existingSale &&
        isPaidStatus(existingSale.payment_status) &&
        existingSale.access_token
      ) {
        const pt = (existingSale.product_type as ProductType) ?? "reading";
        const url = accessUrl(existingSale.access_token, pt);
        dbLog(scope, "already fulfilled — duplicate webhook", { email, accessUrl: url });
        return Response.json({ success: true, accessUrl: url, duplicate: true });
      }
    }

    // Confirmation email
    try {
      const paymentTemplate = paidConfirmationMail({ firstName, birthDate: lead.dob });
      await sendEmail({
        to: email,
        subject: paymentTemplate.subject,
        html: paymentTemplate.html,
        text: paymentTemplate.text,
      });
      dbLog(scope, "payment confirmation email sent", { email, productType });
    } catch (mailErr) {
      dbError(scope, "confirmation email failed (non-fatal)", mailErr, { email });
    }

    // Generate reading
    dbLog(scope, "generation started", { email, productType });

    const readingJson = await buildPaidReadingPayload(lead, lead.focus_area);

    if (!readingJson) {
      dbError(scope, "generation failed", "", { email, productType });
      await markPaymentFailed(supabase, email, gumroadPaymentId, sessionId);
      return Response.json(
        { error: "Reading generation failed" },
        { status: 500 }
      );
    }

    dbLog(scope, "generation success", { email, productType });

    // Fulfill order
    const fulfilled = await fulfillPaidOrder(supabase, {
      email,
      gumroadPaymentId,
      amountCents,
      sessionId,
      productType,
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

    const readingUrl = accessUrl(fulfilled.accessToken, productType);

    dbLog(scope, "reading saved", {
      email,
      paymentId: fulfilled.paymentId,
      readingId: fulfilled.readingId,
      productType,
      accessUrl: readingUrl,
    });

    // Delivery email
    try {
      const deliveryTemplate = fullReadingDeliveryMail({
        firstName,
        birthDate: lead.dob,
        readingUrl,
        cardUrl: readingUrl,
      });

      await sendEmail({
        to: email,
        subject: deliveryTemplate.subject,
        html: deliveryTemplate.html,
        text: deliveryTemplate.text,
      });

      dbLog(scope, "delivery email sent", { email, accessUrl: readingUrl, productType });
    } catch (mailErr) {
      dbError(scope, "delivery email failed (non-fatal)", mailErr, { email });
    }

    // Post-delivery engagement
    try {
      await Promise.all([
        sendEmail({
          to: email,
          ...shareReminderOneMail({ firstName, cardUrl: readingUrl }),
          scheduledAt: scheduledIso(DELAY_MS.shareReminderOne),
        }),
        sendEmail({
          to: email,
          ...shareReminderTwoMail({ firstName, cardUrl: readingUrl }),
          scheduledAt: scheduledIso(DELAY_MS.shareReminderTwo),
        }),
      ]);
      dbLog(scope, "share reminders scheduled", { email });
    } catch (mailErr) {
      dbError(scope, "post-delivery sequence scheduling failed (non-fatal)", mailErr, { email });
    }

    dbLog(scope, "fulfillment complete", {
      email,
      paymentId: fulfilled.paymentId,
      readingId: fulfilled.readingId,
      accessUrl: readingUrl,
      productType,
    });

    return Response.json({
      success: true,
      accessUrl: readingUrl,
      reading_url: readingUrl,
    });
  } catch (err) {
    dbError(scope, "unexpected", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
