import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { readingAccessUrl } from "@/lib/db/checkout-flow";
import { dbError, dbLog } from "@/lib/db/log";
import { DB } from "@/lib/db/tables";

function isPaidStatus(status: string | null | undefined): boolean {
  return (status ?? "").trim().toLowerCase() === "paid";
}

function isFailedStatus(status: string | null | undefined): boolean {
  return (status ?? "").trim().toLowerCase() === "paid_generation_failed";
}

/**
 * GET /api/checkout/status?session_id=...&email=...
 * Poll after Gumroad payment — returns access link when webhook fulfillment completes.
 */
export async function GET(req: NextRequest) {
  const scope = "checkout-status";
  const sessionId = req.nextUrl.searchParams.get("session_id")?.trim();
  const email = req.nextUrl.searchParams.get("email")?.trim().toLowerCase();

  if (!sessionId && !email) {
    return NextResponse.json(
      { success: false, error: "Missing session_id or email" },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseAdmin();

    let payment: {
      id: string;
      payment_status: string | null;
      access_token: string | null;
    } | null = null;

    if (sessionId) {
      const { data, error } = await supabase
        .from(DB.payments)
        .select("id, payment_status, access_token")
        .eq("session_id", sessionId)
        .maybeSingle();

      if (error) {
        dbError(scope, "payments lookup failed", error, { sessionId });
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }
      payment = data;
    }

    if (!payment && email) {
      const { data, error } = await supabase
        .from(DB.payments)
        .select("id, payment_status, access_token")
        .eq("email", email)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        dbError(scope, "payments lookup by email failed", error, { email });
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }
      payment = data;
    }

    if (!payment) {
      dbLog(scope, "no payment row yet", { sessionId, email });
      return NextResponse.json({
        success: true,
        status: "pending",
      });
    }

    if (isFailedStatus(payment.payment_status)) {
      dbLog(scope, "generation failed", { sessionId, email });
      return NextResponse.json({
        success: true,
        status: "failed",
        error: "Reading generation failed. Check your email or contact support.",
      });
    }

    if (isPaidStatus(payment.payment_status) && payment.access_token) {
      const { data: readingRow, error: readingError } = await supabase
        .from(DB.readings)
        .select("id, reading_status")
        .eq("payment_id", payment.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (readingError) {
        dbError(scope, "readings lookup failed", readingError, {
          paymentId: payment.id,
        });
        return NextResponse.json(
          { success: false, error: readingError.message },
          { status: 500 }
        );
      }

      if (readingRow?.id) {
        const accessUrl = readingAccessUrl(payment.access_token);
        dbLog(scope, "reading ready", { sessionId, email, accessUrl });
        return NextResponse.json({
          success: true,
          status: "ready",
          accessToken: payment.access_token,
          accessUrl,
        });
      }
    }

    return NextResponse.json({
      success: true,
      status: "pending",
    });
  } catch (err) {
    dbError(scope, "unexpected", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
