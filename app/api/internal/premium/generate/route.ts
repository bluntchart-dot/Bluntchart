/**
 * POST /api/internal/premium/generate
 *
 * Internal-only endpoint for the hidden Premium Reading Engine.
 * Authorised by the `premium_dev_ok` cookie set at
 * /api/internal/premium/dev-login. Any request without a valid cookie is
 * rejected with 401 — there is no public entry point yet.
 *
 * Body:
 *   {
 *     name, dob, birth_time, city,
 *     email?, birth_lat?, birth_lng?, timezone?, focus_area?
 *   }
 *
 * Response:
 *   { ok: true, reading }
 * The reading is NOT persisted anywhere — this route exists purely so the
 * internal playground can iterate on the prompt without any DB side-effects.
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isDevAuthorized } from "@/lib/premium/dev-auth";
import { generatePremiumReading } from "@/lib/premium/generate-premium-reading";
import type { PremiumBirthDetails } from "@/lib/premium/generate-premium-reading";

interface Body {
  name?: string;
  email?: string;
  dob?: string;
  birth_time?: string;
  city?: string;
  birth_lat?: number;
  birth_lng?: number;
  timezone?: string;
  focus_area?: string;
}

const isValidDate  = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const isValidTime  = (s: string) => /^\d{2}:\d{2}$/.test(s);
const isValidEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (!isDevAuthorized(cookieStore)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized." },
      { status: 401 }
    );
  }

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const name       = (body.name ?? "").trim();
  const dob        = (body.dob ?? "").trim();
  const birthTime  = (body.birth_time ?? "").trim();
  const birthPlace = (body.city ?? "").trim();
  const email      = (body.email ?? "").trim().toLowerCase();
  const focusArea  = (body.focus_area ?? "").trim() || null;

  if (!name || !dob || !birthTime || !birthPlace) {
    return NextResponse.json(
      { ok: false, error: "Please fill in name, date of birth, time, and city." },
      { status: 400 }
    );
  }
  if (!isValidDate(dob)) {
    return NextResponse.json(
      { ok: false, error: "Date of birth must be YYYY-MM-DD." },
      { status: 400 }
    );
  }
  if (!isValidTime(birthTime)) {
    return NextResponse.json(
      { ok: false, error: "Birth time must be HH:mm." },
      { status: 400 }
    );
  }
  if (email && !isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Email address is not valid." },
      { status: 400 }
    );
  }

  const birth: PremiumBirthDetails = {
    name,
    email: email || undefined,
    dob,
    birth_time: birthTime,
    birth_place: birthPlace,
    birth_lat:
      typeof body.birth_lat === "number" && Number.isFinite(body.birth_lat)
        ? body.birth_lat
        : null,
    birth_lng:
      typeof body.birth_lng === "number" && Number.isFinite(body.birth_lng)
        ? body.birth_lng
        : null,
    timezone: body.timezone?.trim() || null,
    focus_area: focusArea,
  };

  const result = await generatePremiumReading(birth);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  }
  return NextResponse.json({ ok: true, reading: result.reading });
}
