import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin, getSupabaseConfig } from "@/lib/supabase-admin";
import { isMissingTableError } from "@/lib/db/errors";
import { DB } from "@/lib/db/tables";

/** Logical tables required by the app (see lib/db/tables.ts). */
const REQUIRED_TABLES = [
  DB.users,
  DB.payments,
  DB.abandonedCheckouts,
  DB.readings,
] as const;

/** TEMP: remove when production DB health is verified — enable with ?debug=1 */
const ENABLE_DEBUG_QUERY = true;

function envPresence() {
  return {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    SUPABASE_URL: Boolean(process.env.SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
  };
}

function isConnectionConfigError(message: string): boolean {
  return (
    /invalid path specified in request url/i.test(message) ||
    /fetch failed/i.test(message) ||
    /ENOTFOUND|ECONNREFUSED|network/i.test(message) ||
    /invalid supabase url/i.test(message)
  );
}

/**
 * Tables exposed to the Data API (PostgREST OpenAPI).
 * Aligns with information_schema tables that are in the API schema cache.
 */
async function fetchPublicSchemaTableNames(
  baseUrl: string,
  apiKey: string
): Promise<{ names: string[]; error: string | null; status: number | null }> {
  try {
    const res = await fetch(`${baseUrl}/rest/v1/`, {
      headers: {
        apikey: apiKey,
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/openapi+json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const body = await res.text();
      return {
        names: [],
        error: `OpenAPI introspection HTTP ${res.status}: ${body.slice(0, 200)}`,
        status: res.status,
      };
    }

    const spec = (await res.json()) as {
      paths?: Record<string, unknown>;
    };

    const names = Object.keys(spec.paths ?? {})
      .map((path) => path.replace(/^\//, "").split("?")[0])
      .filter((name) => name.length > 0 && !name.includes("/"))
      .sort((a, b) => a.localeCompare(b));

    return { names, error: null, status: res.status };
  } catch (err) {
    return {
      names: [],
      error: (err as Error).message,
      status: null,
    };
  }
}

/** Match required table name to an exposed PostgREST table (case-insensitive). */
function resolveExposedTableName(
  required: string,
  exposed: string[]
): string | null {
  if (exposed.includes(required)) return required;

  const lower = required.toLowerCase();
  const match = exposed.find((name) => name.toLowerCase() === lower);
  return match ?? null;
}

/**
 * GET /api/health/db
 * Verifies required Supabase tables exist and are reachable via the Data API.
 */
export async function GET(req: NextRequest) {
  const debug =
    ENABLE_DEBUG_QUERY && req.nextUrl.searchParams.get("debug") === "1";

  try {
    const config = getSupabaseConfig();

    if (!config.url || !config.apiKey) {
      return NextResponse.json(
        {
          ok: false,
          error: "Supabase URL or API key missing in environment",
          ...(debug
            ? {
                debug: {
                  projectHost: config.projectHost,
                  env: envPresence(),
                },
              }
            : {}),
        },
        { status: 500 }
      );
    }

    const { names: exposedTables, error: introspectError } =
      await fetchPublicSchemaTableNames(config.url, config.apiKey);

    console.log("[health/db] PostgREST exposed tables:", exposedTables);

    if (introspectError) {
      console.error("[health/db] schema introspection failed:", introspectError);
      return NextResponse.json(
        {
          ok: false,
          error: "Could not reach Supabase Data API",
          connectionError: introspectError,
          projectHost: config.projectHost,
          hint: "Check NEXT_PUBLIC_SUPABASE_URL points at the correct project (https://<ref>.supabase.co).",
          ...(debug
            ? {
                debug: {
                  projectHost: config.projectHost,
                  env: envPresence(),
                  informationSchemaTables: [],
                  introspectionError: introspectError,
                },
              }
            : {}),
        },
        { status: 502 }
      );
    }

    const supabase = createSupabaseAdmin();
    const missing: string[] = [];
    const errors: Array<{
      table: string;
      resolved: string | null;
      message: string;
      code?: string;
    }> = [];
    const probes: Array<{
      required: string;
      resolved: string | null;
      ok: boolean;
      message: string | null;
    }> = [];

    for (const required of REQUIRED_TABLES) {
      const resolved = resolveExposedTableName(required, exposedTables);

      if (!resolved) {
        missing.push(required);
        probes.push({
          required,
          resolved: null,
          ok: false,
          message: "Not listed in PostgREST schema (information_schema / API cache)",
        });
        continue;
      }

      const { error } = await supabase.from(resolved).select("id").limit(1);

      if (!error) {
        probes.push({ required, resolved, ok: true, message: null });
        continue;
      }

      const message = error.message ?? "unknown";
      const code = (error as { code?: string }).code;

      probes.push({ required, resolved, ok: false, message });

      if (isConnectionConfigError(message)) {
        errors.push({ table: required, resolved, message, code });
      } else if (isMissingTableError(message)) {
        missing.push(required);
      } else {
        errors.push({ table: required, resolved, message, code });
      }
    }

    const detectedTables = probes
      .filter((p) => p.ok && p.resolved)
      .map((p) => p.resolved as string);

    console.log("[health/db] detected tables (probes ok):", detectedTables);

    if (errors.length > 0) {
      const needsServiceRole = errors.some((e) =>
        /permission denied|row-level security|RLS/i.test(e.message)
      );

      return NextResponse.json(
        {
          ok: false,
          errors,
          projectHost: config.projectHost,
          hint: needsServiceRole
            ? "Set SUPABASE_SERVICE_ROLE_KEY in Vercel, then redeploy."
            : "Supabase URL or API configuration may be wrong for this deployment.",
          ...(debug
            ? {
                debug: {
                  projectHost: config.projectHost,
                  env: envPresence(),
                  informationSchemaTables: exposedTables,
                  probes,
                },
              }
            : {}),
        },
        { status: 500 }
      );
    }

    if (missing.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          missingTables: missing,
          projectHost: config.projectHost,
          exposedTables,
          hint: "Required tables must exist in public schema and be exposed to the Data API. Names are case-sensitive in PostgREST.",
          ...(debug
            ? {
                debug: {
                  projectHost: config.projectHost,
                  env: envPresence(),
                  informationSchemaTables: exposedTables,
                  probes,
                },
              }
            : {}),
        },
        { status: 503 }
      );
    }

    return NextResponse.json({
      ok: true,
      tables: detectedTables,
      projectHost: config.projectHost,
      serviceRoleConfigured: Boolean(config.serviceKey),
      ...(debug
        ? {
            debug: {
              projectHost: config.projectHost,
              env: envPresence(),
              informationSchemaTables: exposedTables,
              probes,
            },
          }
        : {}),
    });
  } catch (err) {
    console.error("[health/db] unexpected:", err);
    return NextResponse.json(
      { ok: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}
