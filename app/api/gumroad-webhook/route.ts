import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import {
  loadBirthLeadByEmail,
  SITE_URL,
} from "@/lib/db/checkout-flow";
import { fulfillPaidOrder, markPaymentFailed } from "@/lib/db/fulfillment";
import { readingAccessUrl } from "@/lib/db/checkout-flow";
import { parseGumroadSessionId } from "@/lib/gumroad-checkout";
import { dbError, dbLog } from "@/lib/db/log";
import { sendEmail } from "@/lib/send-email";
import {
  paidConfirmationMail,
  fullReadingDeliveryMail,
} from "@/lib/email-templates";

// ── Full reading prompt (unchanged generation logic) ─────────────────────────

function makeFullPrompt(
  name: string,
  dob: string,
  time: string,
  city: string
): string {
  return `You are BluntChart. You are the brutally honest friend everyone needs but nobody has. You speak like that one person who actually tells the truth at the dinner table. Warm but unfiltered. Specific but not mean. The kind of advice that makes someone go quiet for a second because you nailed it.

Birth details: Name: ${name}, Date: ${dob}, Time: ${time}, City: ${city}

TONE EXAMPLES — write like this, not like a horoscope:
"You keep picking partners who are basically just your therapy project. You are not a rehab center."
"You do not need a partner. You need to stop falling in love with the version of people you invented in your head."
"You are brilliant at starting things and terrible at finishing them and somewhere deep down you already know this."

ABSOLUTE RULES:
- Address ${name} by first name at least once per insight
- No dashes, no em dashes, no hyphens used as separators
- No bullet points, no numbered lists inside insight text
- No wellness speak, no "universe", no "journey", no "healing"
- Write like a person texting their friend the truth, not like a report
- Every line must feel written for THIS specific person
- Short punchy sentences. Mix short with medium.
- Show the strength AND how that same strength is the problem

Return ONLY valid JSON. No markdown. No code blocks. No backticks.

{
  "planets": {
    "sun": "",
    "moon": "",
    "rising": "",
    "venus": "",
    "mars": "",
    "mercury": "",
    "saturn": "",
    "jupiter": ""
  },
  "sunDates": "",
  "preview": [
    {
      "planet": "",
      "colorKey": "sun",
      "truth": "",
      "explain": "",
      "action": ""
    },
    {
      "planet": "",
      "colorKey": "moon",
      "truth": "",
      "explain": "",
      "action": ""
    }
  ],
  "paidInsights": [
    {
      "planet": "",
      "colorKey": "",
      "truth": "",
      "explain": "",
      "action": ""
    }
  ],
  "locked": ["", "", "", "", "", "", "", ""],
  "shareCard": {
    "sign": "",
    "keyword": "",
    "lines": ["", "", ""],
    "quote": ""
  }
}

IMPORTANT:
Generate EXACTLY 8 paidInsights.
Each insight must feel deeply personal and specific.`;
}

async function generateFullReading(
  name: string,
  dob: string,
  birth_time: string,
  city: string
): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    dbError("webhook", "Missing ANTHROPIC_API_KEY", "");
    return null;
  }

  const prompt = makeFullPrompt(name, dob, birth_time, city);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2800,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    dbError("webhook", "Anthropic error", await res.text(), {
      status: res.status,
    });
    return null;
  }

  const data = await res.json();
  const raw: string = data?.content?.[0]?.text ?? "";

  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        dbError("webhook", "JSON parse failed", "");
        return null;
      }
    }
    dbError("webhook", "No JSON in model response", "");
    return null;
  }
}

/**
 * POST /api/gumroad-webhook
 *
 * Gumroad sale → load lead from abandoned_checkouts → generate reading →
 * payments (paid + access_token) + readings → clear abandoned_checkouts.
 *
 * Links checkout via custom_fields[session_id] or latest pending payment by email.
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
      // Return 200 so Gumroad does not retry forever; log for manual fix
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

    const readingJson = await generateFullReading(
      lead.name,
      lead.dob,
      lead.birth_time,
      lead.birth_place
    );

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
