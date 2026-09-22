/**
 * POST /api/internal/etsy/complete-order
 *
 * Internal-only endpoint for completing awaiting_info Etsy orders.
 * When a buyer replies on Etsy with their missing birth data, the
 * shop owner reads the reply and submits it here.
 *
 * Etsy v3 has no API to read incoming messages, so this manual
 * step bridges the gap.
 *
 * Body:
 *   {
 *     etsy_receipt_id: number,
 *     name: string,
 *     dob: string,             // YYYY-MM-DD
 *     birth_time: string,      // HH:mm or "morning"/"afternoon"/etc.
 *     birth_place: string,
 *     focus_area?: string,
 *     use_noon_default?: boolean,  // explicitly opt into noon for unknown time
 *   }
 *
 * Transitions the order from "awaiting_info" → "queued".
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isDevAuthorized } from "@/lib/premium/dev-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { DB } from "@/lib/db/tables";
import { parseDate, parseTime } from "@/lib/etsy/order-parser";
import { dbLog, dbError } from "@/lib/db/log";

export const runtime = "nodejs";

interface Body {
  etsy_receipt_id?: number;
  name?: string;
  dob?: string;
  birth_time?: string;
  birth_place?: string;
  focus_area?: string;
  use_noon_default?: boolean;
}

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

  const receiptId = body.etsy_receipt_id;
  const name = (body.name ?? "").trim();
  const rawDob = (body.dob ?? "").trim();
  const rawTime = (body.birth_time ?? "").trim();
  const birthPlace = (body.birth_place ?? "").trim();

  if (!receiptId) {
    return NextResponse.json(
      { ok: false, error: "Required field: etsy_receipt_id." },
      { status: 400 }
    );
  }

  if (!name || !rawDob || !birthPlace) {
    return NextResponse.json(
      { ok: false, error: "Required fields: name, dob, birth_place." },
      { status: 400 }
    );
  }

  const parsedDate = parseDate(rawDob);
  if (!parsedDate) {
    return NextResponse.json(
      { ok: false, error: `Could not parse date of birth: "${rawDob}". Use YYYY-MM-DD or natural format.` },
      { status: 400 }
    );
  }

  let parsedTime = rawTime ? parseTime(rawTime) : null;
  if (!parsedTime && body.use_noon_default) {
    parsedTime = "12:00";
  }
  if (!parsedTime && !rawTime) {
    return NextResponse.json(
      { ok: false, error: "Required field: birth_time. If buyer doesn't know, set use_noon_default: true." },
      { status: 400 }
    );
  }
  if (!parsedTime) {
    return NextResponse.json(
      { ok: false, error: `Could not parse birth time: "${rawTime}". If unknown, set use_noon_default: true.` },
      { status: 400 }
    );
  }

  const supabase = createSupabaseAdmin();

  const { data: order } = await supabase
    .from(DB.etsyOrders)
    .select("id, status")
    .eq("etsy_receipt_id", receiptId)
    .single();

  if (!order) {
    return NextResponse.json(
      { ok: false, error: `No etsy_order found for receipt ${receiptId}.` },
      { status: 404 }
    );
  }

  if (order.status !== "awaiting_info") {
    return NextResponse.json(
      { ok: false, error: `Order is "${order.status}", not "awaiting_info". Cannot update.` },
      { status: 409 }
    );
  }

  const birthData = {
    name,
    dob: parsedDate,
    birth_time: parsedTime,
    birth_place: birthPlace,
    focus_area: body.focus_area?.trim() || undefined,
    birth_time_approximate: body.use_noon_default === true,
  };

  const { error: updateError } = await supabase
    .from(DB.etsyOrders)
    .update({
      birth_data: birthData,
      status: "queued",
      updated_at: new Date().toISOString(),
    })
    .eq("id", order.id)
    .eq("status", "awaiting_info");

  if (updateError) {
    dbError("etsy/complete-order", "update failed", updateError, { receiptId });
    return NextResponse.json(
      { ok: false, error: "Database update failed." },
      { status: 500 }
    );
  }

  dbLog("etsy/complete-order", "order completed", {
    receiptId,
    orderId: order.id,
    name,
  });

  return NextResponse.json({
    ok: true,
    orderId: order.id,
    status: "queued",
    message: "Order transitioned to queued. The next etsy-fulfill tick will generate the reading.",
  });
}
