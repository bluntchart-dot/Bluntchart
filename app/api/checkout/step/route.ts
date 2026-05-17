import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { updateCheckoutStep } from "@/lib/db/checkout-flow";
import { dbError, dbLog } from "@/lib/db/log";
import type { CheckoutStep } from "@/lib/db/types";

/**
 * POST /api/checkout/step
 * Updates abandoned_checkouts.step_reached (preview seen, clicked pay, etc.)
 */
export async function POST(req: NextRequest) {
  const scope = "checkout-step";

  try {
    const body = await req.json();
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const step = body.step as CheckoutStep;

    const allowed: CheckoutStep[] = [
      "form_submitted",
      "preview_generated",
      "clicked_pay",
    ];

    if (!email || !allowed.includes(step)) {
      return NextResponse.json(
        { success: false, error: "Invalid email or step" },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();
    const result = await updateCheckoutStep(supabase, email, step);

    if (!result.ok) {
      dbError(scope, "update failed", result.error, { email, step });
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    dbLog(scope, "ok", { email, step });
    return NextResponse.json({ success: true });
  } catch (err) {
    dbError(scope, "unexpected", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
