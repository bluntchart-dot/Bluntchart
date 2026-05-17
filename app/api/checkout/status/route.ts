import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { readingAccessUrl } from "@/lib/db/checkout-flow";
import { dbError, dbLog } from "@/lib/db/log";
import { DB } from "@/lib/db/tables";

/**
 * GET /api/checkout/status?session_id=...
 * Poll after Gumroad payment — returns access link when webhook fulfillment completes.
 */
export async function GET(req: NextRequest) {
  const scope = "checkout-status";
  const sessionId = req.nextUrl.searchParams.get("session_id")?.trim();

  if (!sessionId) {
    return NextResponse.json(
      { success: false, error: "Missing session_id" },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseAdmin();

    const { data: payment, error } = await supabase
      .from(DB.payments)
      .select("payment_status, access_token")
      .eq("session_id", sessionId)
      .maybeSingle();

    if (error) {
      dbError(scope, "payments lookup failed", error, { sessionId });
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!payment) {
      dbLog(scope, "no payment row yet", { sessionId });
      return NextResponse.json({
        success: true,
        status: "pending",
      });
    }

    if (payment.payment_status === "paid_generation_failed") {
      dbLog(scope, "generation failed for session", { sessionId });
      return NextResponse.json({
        success: true,
        status: "failed",
        error: "Reading generation failed. Check your email or contact support.",
      });
    }

    if (payment.payment_status === "paid" && payment.access_token) {
      const accessUrl = readingAccessUrl(payment.access_token);
      dbLog(scope, "reading ready", { sessionId });
      return NextResponse.json({
        success: true,
        status: "ready",
        accessToken: payment.access_token,
        accessUrl,
      });
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
