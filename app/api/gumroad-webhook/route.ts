import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { sendEmail } from "@/lib/send-email";
import {
  paidConfirmationMail,
  fullReadingDeliveryMail,
} from "@/lib/email-templates";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bluntchart.com";

// ── Full reading prompt ───────────────────────────────────────────────────────

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
  "locked": [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ],
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

// ── Generate full reading ────────────────────────────────────────────────────

async function generateFullReading(
  name: string,
  dob: string,
  birth_time: string,
  city: string
): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error("[webhook] Missing ANTHROPIC_API_KEY");
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
    console.error("[webhook] Anthropic error:", res.status, await res.text());
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
        console.error("[webhook] JSON parse failed");
        return null;
      }
    }

    console.error("[webhook] No JSON found");
    return null;
  }
}

// ── Gumroad webhook handler ──────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    // ── Parse Gumroad payload ────────────────────────────────────────────────
    const raw = await req.text();
    const params = new URLSearchParams(raw);

    const email =
      params.get("email") || params.get("purchaser_email") || "";

    const paymentId =
      params.get("sale_id") || params.get("id") || "";

    const productId =
      params.get("product_id") ||
      params.get("product_permalink") ||
      "";

    const amount = Number(params.get("price") || "1500");

    if (!email) {
      console.error("[webhook] Missing email");
      return Response.json(
        { error: "Missing email" },
        { status: 400 }
      );
    }

    // ── Find pending row ────────────────────────────────────────────────────
    const { data: pending, error: pendingError } = await supabase
      .from("pending_readings")
      .select("*")
      .eq("email", email)
      .single();

    if (pendingError || !pending) {
      console.error(
        "[webhook] No pending data found:",
        email,
        pendingError
      );

      // IMPORTANT:
      // Return 200 so Gumroad does NOT retry forever.
      return Response.json(
        { error: "No pending data found" },
        { status: 200 }
      );
    }

    const { name, dob, birth_time, city } = pending as {
      name: string;
      dob: string;
      birth_time: string;
      city: string;
    };

    // ── Upsert user ─────────────────────────────────────────────────────────
    const { data: user, error: userError } = await supabase
      .from("users")
      .upsert([{ email, name }], { onConflict: "email" })
      .select()
      .single();

    if (userError || !user) {
      console.error("[webhook] User upsert failed:", userError);

      return Response.json(
        { error: userError?.message || "User save failed" },
        { status: 500 }
      );
    }

    // ── Send payment confirmation email ─────────────────────────────────────
    try {
    const paymentTemplate = paidConfirmationMail({
  firstName: name,
  birthDate: dob,
});

await sendEmail({
  to: email,
  subject: paymentTemplate.subject,
  html: paymentTemplate.html,
  text: paymentTemplate.text,
});
    } catch (mailErr) {
      console.error(
        "[webhook] Payment confirmation email failed:",
        mailErr
      );
    }

    // ── Generate full reading ───────────────────────────────────────────────
    const readingJson = await generateFullReading(
      name,
      dob,
      birth_time,
      city
    );

    if (!readingJson) {
      console.error("[webhook] Reading generation failed");

      await supabase.from("payments").insert([
        {
          user_id: user.id,
          gumroad_payment_id: paymentId,
          product_id: productId,
          amount,
          status: "paid_generation_failed",
        },
      ]);

      return Response.json(
        { error: "Reading generation failed" },
        { status: 500 }
      );
    }

    // ── Save reading ────────────────────────────────────────────────────────
    const { error: readingError } = await supabase
      .from("readings")
      .insert([
        {
          user_id: user.id,
          dob,
          birth_time,
          city,
          reading_json: readingJson,
        },
      ]);

    if (readingError) {
      console.error("[webhook] Reading save failed:", readingError);
    }

    // ── Save payment ────────────────────────────────────────────────────────
    const { error: paymentError } = await supabase
      .from("payments")
      .insert([
        {
          user_id: user.id,
          gumroad_payment_id: paymentId,
          product_id: productId,
          amount,
          status: "paid",
        },
      ]);

    if (paymentError) {
      console.error("[webhook] Payment save failed:", paymentError);
    }

    // ── Delete pending row ──────────────────────────────────────────────────
    await supabase
      .from("pending_readings")
      .delete()
      .eq("email", email);

    // ── Send final delivery email ───────────────────────────────────────────
    try {
      const deliveryTemplate = fullReadingDeliveryMail({
  firstName: name,
  birthDate: dob,
  readingUrl: SITE_URL,
  cardUrl: SITE_URL,
});

await sendEmail({
  to: email,
  subject: deliveryTemplate.subject,
  html: deliveryTemplate.html,
  text: deliveryTemplate.text,
});
    } catch (mailErr) {
      console.error("[webhook] Delivery email failed:", mailErr);
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("[webhook] Unexpected error:", err);

    return Response.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}