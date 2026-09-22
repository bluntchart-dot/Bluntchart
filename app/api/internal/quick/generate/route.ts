/**
 * POST /api/internal/quick/generate
 *
 * Internal-only endpoint for testing Quick pipeline products.
 * Authorised by the same premium_dev_ok cookie as the Premium endpoint.
 *
 * Body:
 *   {
 *     product: ReadingProduct,  // e.g. "brutally-honest-reading"
 *     name: string,
 *     dob: string,              // YYYY-MM-DD
 *     birth_time: string,       // HH:mm
 *     birth_place: string,
 *     birth_lat?: number,
 *     birth_lng?: number,
 *     timezone?: string,
 *     focus_area?: string,
 *   }
 *
 * Response:
 *   {
 *     ok: boolean,
 *     reading: object | null,
 *     chart: ChartData | null,
 *     validation: QuickValidationResult | null,
 *     attempts: number,
 *     error?: string,
 *     product: string,
 *     tier: string,
 *   }
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isDevAuthorized } from "@/lib/premium/dev-auth";
import { routeToGeneration } from "@/lib/pipeline/router";
import type { ReadingProduct } from "@/lib/premium/types";
import { getProductOrNull } from "@/lib/premium/products/registry";

interface PersonInput {
  name?: string;
  dob?: string;
  birth_time?: string;
  birth_place?: string;
  birth_lat?: number;
  birth_lng?: number;
  timezone?: string;
  birth_time_unknown?: boolean;
}

interface Body extends PersonInput {
  product?: string;
  focus_area?: string;
  // Tarot-specific fields
  question?: string;
  seed?: string;
  // Compatibility: second person
  person2?: PersonInput;
}

const isValidDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s);
const isValidTime = (s: string) => /^\d{2}:\d{2}$/.test(s);

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (!isDevAuthorized(cookieStore)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Use /api/internal/premium/dev-login first." },
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

  const product = (body.product ?? "").trim();

  if (!product) {
    return NextResponse.json(
      { ok: false, error: "Required field: product." },
      { status: 400 }
    );
  }

  const definition = getProductOrNull(product as ReadingProduct);
  if (!definition) {
    return NextResponse.json(
      { ok: false, error: `Product "${product}" is not registered or not implemented.` },
      { status: 400 }
    );
  }

  if (definition.pipelineTier !== "quick") {
    return NextResponse.json(
      {
        ok: false,
        error: `Product "${product}" uses the "${definition.pipelineTier}" pipeline. Use /api/internal/premium/generate for Premium products.`,
      },
      { status: 400 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "ANTHROPIC_API_KEY is not configured." },
      { status: 503 }
    );
  }

  const isTarot = definition.tarotConfig != null;

  // Tarot products need a seed (and optionally a question)
  if (isTarot) {
    const seed = (body.seed ?? body.name ?? "test").trim();
    const question = body.question?.trim();

    if (product === "yes-no-tarot" && !question) {
      return NextResponse.json(
        { ok: false, error: "yes-no-tarot requires a 'question' field." },
        { status: 400 }
      );
    }

    const result = await routeToGeneration({
      product: product as ReadingProduct,
      tarot: { seed, question, customerName: body.name?.trim() },
    });

    if (result.tier === "tarot") {
      return NextResponse.json({
        ok: result.ok,
        reading: result.reading,
        cards: result.cards,
        validation: result.validation,
        attempts: result.attempts,
        error: result.error,
        product,
        tier: "tarot",
      });
    }
    return NextResponse.json(
      { ok: false, error: "error" in result ? result.error : "Unexpected tier", product, tier: result.tier },
      { status: 500 }
    );
  }

  // Compatibility products need two people
  const isCompat = definition.compatConfig != null;
  if (isCompat) {
    const p1 = body;
    const p2 = body.person2;
    if (!p2) {
      return NextResponse.json(
        { ok: false, error: "Compatibility product requires a 'person2' object with name, dob, birth_time, birth_place." },
        { status: 400 }
      );
    }
    const n1 = (p1.name ?? "").trim();
    const d1 = (p1.dob ?? "").trim();
    const bp1 = (p1.birth_place ?? "").trim();
    const bt1u = p1.birth_time_unknown === true;
    const bt1 = bt1u ? "12:00" : (p1.birth_time ?? "").trim();
    const n2 = (p2.name ?? "").trim();
    const d2 = (p2.dob ?? "").trim();
    const bp2 = (p2.birth_place ?? "").trim();
    const bt2u = p2.birth_time_unknown === true;
    const bt2 = bt2u ? "12:00" : (p2.birth_time ?? "").trim();

    if (!n1 || !d1 || !bp1 || !bt1 || !n2 || !d2 || !bp2 || !bt2) {
      return NextResponse.json(
        { ok: false, error: "Both persons require: name, dob (YYYY-MM-DD), birth_time (HH:mm), birth_place." },
        { status: 400 }
      );
    }

    const result = await routeToGeneration({
      product: product as ReadingProduct,
      birth: {
        name: n1, dob: d1, birth_time: bt1, birth_place: bp1,
        birth_lat: typeof p1.birth_lat === "number" ? p1.birth_lat : null,
        birth_lng: typeof p1.birth_lng === "number" ? p1.birth_lng : null,
        timezone: p1.timezone?.trim() || null,
        birth_time_approximate: bt1u,
      },
      birth2: {
        name: n2, dob: d2, birth_time: bt2, birth_place: bp2,
        birth_lat: typeof p2.birth_lat === "number" ? p2.birth_lat : null,
        birth_lng: typeof p2.birth_lng === "number" ? p2.birth_lng : null,
        timezone: p2.timezone?.trim() || null,
        birth_time_approximate: bt2u,
      },
    });

    if (result.tier === "compat") {
      return NextResponse.json({
        ok: result.ok,
        reading: result.reading,
        synastryScore: result.synastryScore,
        validation: result.validation,
        attempts: result.attempts,
        error: result.error,
        product,
        tier: "compat",
      });
    }
    return NextResponse.json(
      { ok: false, error: "error" in result ? result.error : "Unexpected tier", product, tier: result.tier },
      { status: 500 }
    );
  }

  // Birth-chart-based products need full birth data
  const name = (body.name ?? "").trim();
  const dob = (body.dob ?? "").trim();
  const birthPlace = (body.birth_place ?? "").trim();
  const birthTimeUnknown = body.birth_time_unknown === true;
  const birthTime = birthTimeUnknown ? "12:00" : (body.birth_time ?? "").trim();

  if (!name || !dob || !birthPlace) {
    return NextResponse.json(
      { ok: false, error: "Required fields: name, dob (YYYY-MM-DD), birth_place." },
      { status: 400 }
    );
  }

  if (!birthTimeUnknown && !birthTime) {
    return NextResponse.json(
      { ok: false, error: "Required: birth_time (HH:mm) or birth_time_unknown: true." },
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

  const result = await routeToGeneration({
    product: product as ReadingProduct,
    birth: {
      name,
      dob,
      birth_time: birthTime,
      birth_place: birthPlace,
      birth_lat: typeof body.birth_lat === "number" ? body.birth_lat : null,
      birth_lng: typeof body.birth_lng === "number" ? body.birth_lng : null,
      timezone: body.timezone?.trim() || null,
      focus_area: body.focus_area?.trim() || null,
      birth_time_approximate: birthTimeUnknown,
    },
  });

  if (result.tier === "quick") {
    return NextResponse.json({
      ok: result.ok,
      reading: result.reading,
      validation: result.validation,
      attempts: result.attempts,
      error: result.error,
      product,
      tier: "quick",
    });
  }

  return NextResponse.json(
    { ok: false, error: "error" in result ? result.error : "Unexpected tier", product, tier: result.tier },
    { status: 500 }
  );
}
