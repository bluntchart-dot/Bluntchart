import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { loadReadingByAccessToken } from "@/lib/db/fulfillment";
import { dbError, dbLog } from "@/lib/db/log";

/**
 * GET /api/reading/access?token=...
 * Returns the paid reading JSON for a private access_token (from payments table).
 */
export async function GET(req: NextRequest) {
  const scope = "reading-access";

  const token = req.nextUrl.searchParams.get("token")?.trim();

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing token" },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseAdmin();
    const { reading, birth_time, birth_place, error } =
      await loadReadingByAccessToken(supabase, token);

    if (error || !reading) {
      dbLog(scope, "not found", { error });
      return NextResponse.json(
        { success: false, error: error ?? "Not found" },
        { status: 404 }
      );
    }

    dbLog(scope, "ok");
    return NextResponse.json({
      success: true,
      reading,
      birth_time,
      birth_place,
    });
  } catch (err) {
    dbError(scope, "unexpected", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
