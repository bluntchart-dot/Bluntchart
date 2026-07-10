import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import {
  attachAdminSessionCookie,
  clearAdminSessionCookie,
} from "@/lib/blog/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeStringEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

/**
 * POST /api/admin/session
 * Body: { secret: string }
 * Verifies the plaintext BLOG_ADMIN_SECRET and, on success, attaches an
 * HMAC-based httpOnly session cookie so subsequent /admin/blog page
 * loads and admin API calls authenticate without a Bearer header.
 */
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.BLOG_ADMIN_SECRET;
    if (!secret) {
      return NextResponse.json(
        { ok: false, error: "BLOG_ADMIN_SECRET is not configured" },
        { status: 500 }
      );
    }

    let body: { secret?: string } = {};
    try {
      body = await req.json();
    } catch {
      // empty body — treat as unauthorized
    }

    const provided = typeof body.secret === "string" ? body.secret : "";
    if (!provided || !safeStringEqual(provided, secret)) {
      // Small artificial delay would slow brute force but the route is
      // rate-limited by BLOG_ADMIN_SECRET length in practice; skip it
      // to avoid coupling to Vercel timing.
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    attachAdminSessionCookie(res);
    return res;
  } catch (err) {
    console.error("[session POST] unhandled:", err instanceof Error ? err.stack ?? err.message : err);
    return NextResponse.json(
      { ok: false, errorCode: "ROUTE_UNHANDLED_EXCEPTION" },
      { status: 500 }
    );
  }
}

/** DELETE /api/admin/session — clears the cookie (logout). */
export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearAdminSessionCookie(res);
  return res;
}
