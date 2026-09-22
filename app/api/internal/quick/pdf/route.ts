/**
 * POST /api/internal/quick/pdf
 *
 * Internal-only endpoint for testing PDF rendering of Quick readings.
 * Dev-auth gated. Accepts a reading JSON + product type, returns a PDF.
 *
 * Body:
 *   {
 *     product: ReadingProduct,
 *     name: string,
 *     reading: object,        // The reading JSON from /api/internal/quick/generate
 *     question?: string,      // For yes-no-tarot
 *   }
 *
 * Response: application/pdf binary
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isDevAuthorized } from "@/lib/premium/dev-auth";
import { renderReadingPdf } from "@/lib/pdf/server-render";
import type { ReadingProduct } from "@/lib/premium/types";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  if (!isDevAuthorized(cookieStore)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized. Use /api/internal/premium/dev-login first." },
      { status: 401 }
    );
  }

  let body: { product?: string; name?: string; reading?: Record<string, unknown>; question?: string; zodiacSign?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body." },
      { status: 400 }
    );
  }

  const product = (body.product ?? "").trim();
  const name = (body.name ?? "Reader").trim();
  const reading = body.reading;

  if (!product || !reading || typeof reading !== "object") {
    return NextResponse.json(
      { ok: false, error: "Required fields: product, name, reading (object)." },
      { status: 400 }
    );
  }

  const result = await renderReadingPdf({
    product: product as ReadingProduct,
    customerName: name,
    reading,
    question: body.question,
    zodiacSign: body.zodiacSign,
  });

  if (!result.ok || !result.buffer) {
    return NextResponse.json(
      { ok: false, error: result.error ?? "PDF rendering failed" },
      { status: 500 }
    );
  }

  return new NextResponse(new Uint8Array(result.buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${result.filename}"`,
      "Content-Length": String(result.buffer.length),
    },
  });
}
