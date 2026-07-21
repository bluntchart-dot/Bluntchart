/**
 * POST /api/internal/premium/dev-login
 *
 * Verifies the internal password for the hidden Premium Reading Engine.
 * On match, sets an httpOnly cookie so /internal/premium and
 * /api/internal/premium/generate treat this browser as authorized until
 * the cookie is cleared.
 *
 * The password lives in PREMIUM_DEV_PASSWORD (env var, same value in
 * .env.local and in Vercel). If the env var is unset the endpoint is
 * closed so an unconfigured deployment cannot be brute-forced.
 */

import { NextRequest, NextResponse } from "next/server";
import { PREMIUM_DEV_COOKIE, cookieOptions } from "@/lib/premium/dev-auth";

export async function POST(req: NextRequest) {
  const expected = process.env.PREMIUM_DEV_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { ok: false, error: "Premium engine is not configured on this server." },
      { status: 503 }
    );
  }

  let body: { password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 }
    );
  }

  const provided = (body.password ?? "").trim();
  if (!provided || provided !== expected) {
    // Deliberate small delay would go here in prod. For an internal-only
    // tool with an unpredictable password, a plain 401 is sufficient.
    return NextResponse.json(
      { ok: false, error: "Incorrect password." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(PREMIUM_DEV_COOKIE, expected, cookieOptions());
  return res;
}
