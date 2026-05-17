import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { isMissingTableError } from "@/lib/db/errors";
import { DB } from "@/lib/db/tables";

const TABLES = [
  DB.users,
  DB.payments,
  DB.abandonedCheckouts,
  DB.readings,
] as const;

/**
 * GET /api/health/db
 * Verifies required Supabase tables exist (for deploy checks).
 */
export async function GET() {
  try {
    const supabase = createSupabaseAdmin();
    const missing: string[] = [];
    const errors: Array<{ table: string; message: string; code?: string }> = [];

    for (const table of TABLES) {
      const { error } = await supabase.from(table).select("id").limit(1);

      if (!error) continue;

      const message = error.message ?? "unknown";
      const code = (error as { code?: string }).code;

      if (isMissingTableError(message)) {
        missing.push(table);
      } else {
        errors.push({ table, message, code });
      }
    }

    if (errors.length > 0) {
      const needsServiceRole = errors.some((e) =>
        /permission denied|row-level security|RLS/i.test(e.message)
      );

      return NextResponse.json(
        {
          ok: false,
          errors,
          hint: needsServiceRole
            ? "Set SUPABASE_SERVICE_ROLE_KEY in Vercel (Settings → Environment Variables), then redeploy."
            : "Check Supabase table names: Users, Payments, abandoned_checkouts, readings.",
        },
        { status: 500 }
      );
    }

    if (missing.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          missingTables: missing,
          hint: "Tables must be named Users and Payments (PascalCase) plus abandoned_checkouts and readings. See supabase/migrations/.",
        },
        { status: 503 }
      );
    }

    const projectHost = process.env.NEXT_PUBLIC_SUPABASE_URL
      ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
      : null;

    return NextResponse.json({
      ok: true,
      tables: [...TABLES],
      projectHost,
      serviceRoleConfigured: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
