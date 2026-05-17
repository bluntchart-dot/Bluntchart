import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { isMissingTableError } from "@/lib/db/errors";

const TABLES = ["users", "payments", "abandoned_checkouts", "readings"] as const;

/**
 * GET /api/health/db
 * Verifies required Supabase tables exist (for deploy checks).
 */
export async function GET() {
  try {
    const supabase = createSupabaseAdmin();
    const missing: string[] = [];

    for (const table of TABLES) {
      const { error } = await supabase.from(table).select("id").limit(1);
      if (error && isMissingTableError(error.message)) {
        missing.push(table);
      } else if (error) {
        return NextResponse.json(
          {
            ok: false,
            error: error.message,
            table,
          },
          { status: 500 }
        );
      }
    }

    if (missing.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          missingTables: missing,
          hint: "Run supabase/migrations/20250517000000_initial_schema.sql in the Supabase SQL editor.",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true, tables: [...TABLES] });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
