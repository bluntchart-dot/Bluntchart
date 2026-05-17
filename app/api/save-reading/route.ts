import { NextResponse } from "next/server";
import { dbLog } from "@/lib/db/log";

/**
 * Deprecated: readings are created by /api/gumroad-webhook after payment.
 * Kept so old test links return a clear message instead of 404.
 */
export async function POST() {
  dbLog("save-reading", "deprecated endpoint called");
  return NextResponse.json(
    {
      success: false,
      error:
        "This endpoint is deprecated. Use /api/save-pending then Gumroad webhook.",
    },
    { status: 410 }
  );
}
