import { NextRequest, NextResponse } from "next/server";

/**
 * Validates admin access for blog automation POST routes.
 *
 * Requires Authorization: Bearer <BLOG_ADMIN_SECRET>. The query-string
 * form is deliberately not accepted here to keep the secret out of logs,
 * referrers, and history. Link-clickable admin flows (e.g. Blogger
 * OAuth authorize) do their own inline ?key= check and are unaffected.
 *
 * Returns null if authorized, or a 401/500 NextResponse to return.
 */
export function requireAdmin(req: NextRequest): NextResponse | null {
  const secret = process.env.BLOG_ADMIN_SECRET;

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "BLOG_ADMIN_SECRET is not configured" },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!bearerToken || bearerToken !== secret) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return null;
}

/**
 * Validates CRON_SECRET for automated cron routes.
 * Returns null if authorized, or a 401 NextResponse to return.
 */
export function requireCronSecret(req: NextRequest): NextResponse | null {
  const secret = process.env.CRON_SECRET;

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "CRON_SECRET is not configured" },
      { status: 500 }
    );
  }

  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (bearerToken !== secret) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  return null;
}
