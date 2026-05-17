import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { startCheckout } from "@/lib/db/checkout-flow";
import { formatDbError } from "@/lib/db/errors";
import { dbError, dbLog } from "@/lib/db/log";
import { previewMail } from "@/lib/email-templates";
import { sendEmail } from "@/lib/send-email";
import { SITE_URL } from "@/lib/db/checkout-flow";

/**
 * POST /api/save-pending
 *
 * Legacy route name kept for the frontend.
 * Saves checkout to Supabase:
 *   - users
 *   - payments (pending, session_id)
 *   - abandoned_checkouts (incomplete lead)
 *
 * Does NOT write to pending_readings.
 */
export async function POST(req: NextRequest) {
  const scope = "save-pending";

  try {
    const body = await req.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const dob = typeof body.dob === "string" ? body.dob.trim() : "";
    const birth_time =
      typeof body.birth_time === "string" ? body.birth_time.trim() : "";
    const birth_place =
      typeof body.city === "string"
        ? body.city.trim()
        : typeof body.birth_place === "string"
          ? body.birth_place.trim()
          : "";
    const timezone =
      typeof body.timezone === "string" ? body.timezone.trim() : undefined;

    if (!name || !email || !dob || !birth_time || !birth_place) {
      dbError(scope, "validation failed", "missing fields", { email });
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    const result = await startCheckout(supabase, {
      name,
      email,
      dob,
      birth_time,
      birth_place,
      timezone,
      step_reached: "form_submitted",
    });

    if (!result.ok) {
      dbError(scope, "startCheckout failed", result.error ?? "unknown", {
        email,
      });
      return NextResponse.json(
        {
          success: false,
          error: formatDbError(result.error ?? "Database save failed"),
        },
        { status: 500 }
      );
    }

    dbLog(scope, "checkout saved", {
      email,
      sessionId: result.sessionId,
      paymentId: result.paymentId,
    });

    let emailSent = false;
    try {
      const template = previewMail({
        firstName: name.split(" ")[0] || name,
        birthDate: dob,
        readingUrl: `${SITE_URL}#try-it`,
      });

      await sendEmail({
        to: email,
        subject: template.subject,
        html: template.html,
        text: template.text,
      });
      emailSent = true;
    } catch (mailErr) {
      dbError(scope, "preview email failed (non-fatal)", mailErr, { email });
    }

    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      paymentId: result.paymentId,
      userId: result.userId,
      emailSent,
    });
  } catch (err) {
    dbError(scope, "unexpected error", err);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        detail: (err as Error).message,
      },
      { status: 500 }
    );
  }
}
