import { NextRequest, NextResponse } from "next/server";

/**
 * Validates admin access for blog automation routes.
 *
 * Checks the BLOG_ADMIN_SECRET against either:
 * - ?key= query parameter (for simple GET requests)
 * - Authorization: Bearer header (for API calls from the dashboard)
 *
 * Returns null if authorized, or a 401/403 NextResponse to return.
 */
export function requireAdmin(req: NextRequest): NextResponse | null {
  const secret = process.env.BLOG_ADMIN_SECRET;

  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "BLOG_ADMIN_SECRET is not configured" },
      { status: 500 }
    );
  }

  const keyParam = req.nextUrl.searchParams.get("key");
  const authHeader = req.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  const provided = keyParam ?? bearerToken;

  if (!provided || provided !== secret) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 403 }
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
