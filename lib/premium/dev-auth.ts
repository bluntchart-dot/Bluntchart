/**
 * dev-auth.ts
 *
 * Shared helpers for the /internal/premium password gate.
 * Server-only. Never import this from client code.
 */

import type { cookies } from "next/headers";

export const PREMIUM_DEV_COOKIE = "premium_dev_ok";

/** Options for the auth cookie. Path='/' so /api/internal/premium/* sees it too. */
export function cookieOptions() {
  return {
    httpOnly: true as const,
    sameSite: "lax" as const,
    path: "/",
    // 30 days — long enough for uninterrupted iteration, short enough that
    // a stolen laptop cookie eventually expires.
    maxAge: 60 * 60 * 24 * 30,
    // Don't set `secure`, so local dev (http) works too. Prod is https and
    // browsers will transmit the cookie there regardless.
  };
}

/**
 * True if this browser has presented the correct password cookie.
 * Accepts either a resolved cookie store OR `next/headers`' cookies()
 * function so both server components and route handlers can use it.
 */
export function isDevAuthorized(
  cookieStore: Awaited<ReturnType<typeof cookies>>
): boolean {
  const expected = process.env.PREMIUM_DEV_PASSWORD;
  if (!expected) return false;
  return cookieStore.get(PREMIUM_DEV_COOKIE)?.value === expected;
}
