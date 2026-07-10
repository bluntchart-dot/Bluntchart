import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const SESSION_COOKIE = "bc_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

/**
 * Deterministic HMAC of the admin secret. If the secret rotates, all
 * existing cookies invalidate automatically — no session store needed.
 * The cookie value never contains the raw secret.
 */
function computeSessionValue(secret: string): string {
  return createHmac("sha256", secret).update("blog-admin-session-v1").digest("hex");
}

function safeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

/**
 * Validates admin access for blog automation POST routes.
 *
 * Accepts EITHER:
 * - Authorization: Bearer <BLOG_ADMIN_SECRET>  (curl / cron)
 * - Cookie: bc_admin_session=<HMAC(secret)>    (browser dashboard)
 *
 * Link-clickable admin flows (Blogger OAuth authorize) do their own
 * inline ?key= check and are unaffected. The query-string form is not
 * accepted here to keep the secret out of logs, referrers, and history.
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

  if (bearerToken && safeStringEqual(bearerToken, secret)) return null;

  const cookieToken = req.cookies.get(SESSION_COOKIE)?.value;
  if (cookieToken && safeStringEqual(cookieToken, computeSessionValue(secret))) {
    return null;
  }

  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
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

// ── Server-side session helpers (used by /admin/blog server components) ──

/**
 * Server-only: verify the incoming request has a valid admin session
 * cookie. Used by the dashboard server components to gate rendering.
 * Never call from a Client Component. Never send the return value to
 * the client — the boolean is the only thing safe to leak.
 */
export async function hasAdminSession(): Promise<boolean> {
  const secret = process.env.BLOG_ADMIN_SECRET;
  if (!secret) return false;
  const store = await cookies();
  const cookieToken = store.get(SESSION_COOKIE)?.value;
  if (!cookieToken) return false;
  return safeStringEqual(cookieToken, computeSessionValue(secret));
}

/**
 * Attaches the admin session cookie to a NextResponse. Called from the
 * /api/admin/session POST handler after verifying the Bearer secret.
 */
export function attachAdminSessionCookie(res: NextResponse): void {
  const secret = process.env.BLOG_ADMIN_SECRET;
  if (!secret) return;
  res.cookies.set({
    name: SESSION_COOKIE,
    value: computeSessionValue(secret),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function clearAdminSessionCookie(res: NextResponse): void {
  res.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

export const ADMIN_SESSION_COOKIE_NAME = SESSION_COOKIE;
