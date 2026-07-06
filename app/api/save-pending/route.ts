import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import {
  startCheckout,
  loadAbandonedEmailIdsByEmail,
  saveAbandonedEmailIds,
  SITE_URL,
} from "@/lib/db/checkout-flow";
import { formatDbError } from "@/lib/db/errors";
import { dbError, dbLog } from "@/lib/db/log";
import { previewMail, abandonedOneMail, abandonedTwoMail } from "@/lib/email-templates";
import { sendEmail, cancelScheduledEmail } from "@/lib/send-email";
import { DELAY_MS, scheduledIso } from "@/lib/email-timing";

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

    /* NEW: extract coordinates from the request body */
    const birth_lat =
  body.birth_lat != null && !isNaN(Number(body.birth_lat))
    ? Number(body.birth_lat)
    : undefined;
const birth_lng =
  body.birth_lng != null && !isNaN(Number(body.birth_lng))
    ? Number(body.birth_lng)
    : undefined;
    const focus_area =
  typeof body.focus_area === "string" ? body.focus_area.trim() : undefined;

    if (!name || !email || !dob || !birth_time || !birth_place) {
      dbError(scope, "validation failed", "missing fields", { email });
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Resubmission: cancel the prior lead's still-pending scheduled nudges
    // before startCheckout wipes the row that was tracking their ids.
    const staleIds = await loadAbandonedEmailIdsByEmail(supabase, email);
    if (staleIds) {
      const { preview_email_id, abandoned_one_email_id, abandoned_two_email_id } = staleIds;
      await Promise.all(
        [preview_email_id, abandoned_one_email_id, abandoned_two_email_id]
          .filter((id): id is string => !!id)
          .map((id) => cancelScheduledEmail(id))
      );
    }

    const result = await startCheckout(supabase, {
      name,
      email,
      dob,
      birth_time,
      birth_place,
      timezone,
      birth_lat,   /* NEW: pass coordinates to startCheckout */
      birth_lng,   /* NEW: pass coordinates to startCheckout */
      focus_area,
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
      hasCoords: !!(birth_lat && birth_lng),
    });

    let emailScheduled = false;
    try {
      const firstName = name.split(" ")[0] || name;
      const readingUrl = `${SITE_URL}#try-it`;

      const [preview, abandonedOne, abandonedTwo] = await Promise.all([
        sendEmail({
          to: email,
          ...previewMail({ firstName, birthDate: dob, readingUrl }),
          scheduledAt: scheduledIso(DELAY_MS.preview),
        }),
        sendEmail({
          to: email,
          ...abandonedOneMail({ firstName, birthDate: dob, readingUrl }),
          scheduledAt: scheduledIso(DELAY_MS.abandonedOne),
        }),
        sendEmail({
          to: email,
          ...abandonedTwoMail({ firstName, readingUrl }),
          scheduledAt: scheduledIso(DELAY_MS.abandonedTwo),
        }),
      ]);

      await saveAbandonedEmailIds(supabase, email, {
        previewEmailId: preview.id,
        abandonedOneEmailId: abandonedOne.id,
        abandonedTwoEmailId: abandonedTwo.id,
      });

      emailScheduled = preview.ok && abandonedOne.ok && abandonedTwo.ok;
    } catch (mailErr) {
      dbError(scope, "abandoned sequence scheduling failed (non-fatal)", mailErr, { email });
    }

    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      paymentId: result.paymentId,
      userId: result.userId,
      emailScheduled,
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