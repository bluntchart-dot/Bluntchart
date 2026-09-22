import { NextRequest, NextResponse } from "next/server";
import { requireCronSecret } from "@/lib/blog/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { DB } from "@/lib/db/tables";
import { dbLog, dbError } from "@/lib/db/log";
import { getShopReceipts, sendMessage } from "@/lib/etsy/client";
import {
  parseEtsyOrder,
  parseEtsyOrderOrBundle,
  buildMissingDataMessage,
} from "@/lib/etsy/order-parser";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Polls Etsy for new paid receipts since last check.
 * For each new order:
 *   1. Parse birth data from personalization fields
 *   2. If complete → insert into etsy_orders (status: "queued")
 *   3. If missing fields → send Etsy message, insert as "awaiting_info"
 *
 * Idempotent: DB-level UNIQUE on etsy_receipt_id rejects duplicates.
 */
export async function GET(req: NextRequest) {
  const startedAt = Date.now();

  try {
    const authError = requireCronSecret(req);
    if (authError) return authError;

    const supabase = createSupabaseAdmin();

    const lastPollTs = await getLastPollTimestamp(supabase);
    const receipts = await getShopReceipts({
      was_paid: true,
      min_created: lastPollTs,
      limit: 25,
    });

    if (!receipts || receipts.length === 0) {
      return NextResponse.json({
        ok: true,
        elapsed_ms: Date.now() - startedAt,
        processed: 0,
        message: "No new receipts",
      });
    }

    const results: Array<Record<string, unknown>> = [];

    for (const receipt of receipts) {
      const parsed = parseEtsyOrderOrBundle(receipt);
      if (!parsed) {
        results.push({
          receiptId: receipt.receipt_id,
          skipped: true,
          reason: "unrecognized product",
        });
        continue;
      }

      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bluntchart.com";

      if (parsed.type === "bundle") {
        const b = parsed.bundle;
        const alreadyExists = await checkDuplicate(supabase, b.receiptId, b.products[0]);
        if (alreadyExists) {
          results.push({ receiptId: b.receiptId, skipped: true, reason: "already processed" });
          continue;
        }

        if (b.missingFields.length > 0) {
          const msg = buildMissingDataMessage(b.birthData?.name ?? receipt.name, b.missingFields);
          const sent = await sendMessage(b.buyerUserId, msg);
          for (const product of b.products) {
            await insertEtsyOrder(supabase, {
              receiptId: b.receiptId, buyerEmail: b.buyerEmail, buyerUserId: b.buyerUserId,
              listingId: b.listingId, product, amountCents: Math.round(b.amountCents / b.products.length),
              status: "awaiting_info", rawPersonalization: b.rawPersonalization,
              birthData: null, question: null, siteUrl, bundleId: b.bundleId,
            });
          }
          results.push({ receiptId: b.receiptId, bundleId: b.bundleId, status: "awaiting_info", missingFields: b.missingFields, messageSent: sent });
          continue;
        }

        for (const product of b.products) {
          await insertEtsyOrder(supabase, {
            receiptId: b.receiptId, buyerEmail: b.buyerEmail, buyerUserId: b.buyerUserId,
            listingId: b.listingId, product, amountCents: Math.round(b.amountCents / b.products.length),
            status: "queued", rawPersonalization: b.rawPersonalization,
            birthData: b.birthData!, question: b.rawPersonalization.question ?? b.rawPersonalization.focus_area ?? null,
            siteUrl, bundleId: b.bundleId,
          });
        }
        results.push({ receiptId: b.receiptId, bundleId: b.bundleId, products: [...b.products], status: "queued" });
        continue;
      }

      // Single product
      const order = parsed.order;
      const alreadyExists = await checkDuplicate(supabase, order.receiptId, order.product);
      if (alreadyExists) {
        results.push({ receiptId: order.receiptId, skipped: true, reason: "already processed" });
        continue;
      }

      if (order.missingFields.length > 0) {
        const msg = buildMissingDataMessage(order.birthData?.name ?? receipt.name, order.missingFields);
        const sent = await sendMessage(order.buyerUserId, msg);
        await insertEtsyOrder(supabase, {
          receiptId: order.receiptId, buyerEmail: order.buyerEmail, buyerUserId: order.buyerUserId,
          listingId: order.listingId, product: order.product, amountCents: order.amountCents,
          status: "awaiting_info", rawPersonalization: order.rawPersonalization,
          birthData: null, question: order.rawPersonalization.question ?? null, siteUrl,
        });
        results.push({ receiptId: order.receiptId, product: order.product, status: "awaiting_info", missingFields: order.missingFields, messageSent: sent });
        continue;
      }

      await insertEtsyOrder(supabase, {
        receiptId: order.receiptId, buyerEmail: order.buyerEmail, buyerUserId: order.buyerUserId,
        listingId: order.listingId, product: order.product, amountCents: order.amountCents,
        status: "queued", rawPersonalization: order.rawPersonalization,
        birthData: order.birthData!,
        question: order.rawPersonalization.question ?? order.rawPersonalization.focus_area ?? null, siteUrl,
      });
      results.push({ receiptId: order.receiptId, product: order.product, status: "queued" });
    }

    await setLastPollTimestamp(supabase, Math.floor(Date.now() / 1000));

    return NextResponse.json({
      ok: true,
      elapsed_ms: Date.now() - startedAt,
      processed: results.length,
      results,
    });
  } catch (err) {
    console.error(
      "[cron/etsy-poll] unhandled:",
      err instanceof Error ? err.stack ?? err.message : err
    );
    return NextResponse.json(
      {
        ok: false,
        elapsed_ms: Date.now() - startedAt,
        error: (err instanceof Error ? err.message : String(err)).slice(
          0,
          500
        ),
      },
      { status: 500 }
    );
  }
}

/* ═════════════════════════════════════════════════════════════════
   DELIVERY URL MAPPING
═════════════════════════════════════════════════════════════════ */

function getDeliveryAccessPath(product: string): string {
  switch (product) {
    case "birth-chart":      return "/my-book";
    case "in-depth-reading": return "/in-depth-readings";
    default:                 return "/my-reading";
  }
}

/* ═════════════════════════════════════════════════════════════════
   DB HELPERS
═════════════════════════════════════════════════════════════════ */

async function checkDuplicate(
  supabase: ReturnType<typeof createSupabaseAdmin>,
  etsyReceiptId: number,
  product?: string
): Promise<boolean> {
  let q = supabase
    .from(DB.etsyOrders)
    .select("id")
    .eq("etsy_receipt_id", etsyReceiptId);
  if (product) q = q.eq("product", product);
  const { data } = await q.limit(1);
  return (data?.length ?? 0) > 0;
}

async function insertEtsyOrder(
  supabase: ReturnType<typeof createSupabaseAdmin>,
  params: {
    receiptId: number;
    buyerEmail: string;
    buyerUserId: number;
    listingId: number;
    product: string;
    amountCents: number;
    status: string;
    rawPersonalization: Record<string, string>;
    birthData: {
      name: string;
      dob: string;
      birth_time: string;
      birth_place: string;
      focus_area?: string;
    } | null;
    question: string | null;
    siteUrl: string;
    bundleId?: string;
  }
): Promise<void> {
  const { data, error } = await supabase
    .from(DB.etsyOrders)
    .insert([
      {
        etsy_receipt_id: params.receiptId,
        buyer_email: params.buyerEmail,
        buyer_user_id: params.buyerUserId,
        listing_id: params.listingId,
        product: params.product,
        amount_cents: params.amountCents,
        status: params.status,
        raw_personalization: params.rawPersonalization,
        birth_data: params.birthData,
        question: params.question,
        ...(params.bundleId ? { bundle_id: params.bundleId } : {}),
      },
    ])
    .select("id, access_token")
    .single();

  if (error) {
    dbError("etsy-poll", "insert etsy_order failed", error, {
      receiptId: params.receiptId,
    });
  } else if (data) {
    const accessPath = getDeliveryAccessPath(params.product);
    const deliveryUrl = `${params.siteUrl}${accessPath}?token=${encodeURIComponent(data.access_token)}`;
    await supabase
      .from(DB.etsyOrders)
      .update({ delivery_url: deliveryUrl })
      .eq("id", data.id);

    dbLog("etsy-poll", "etsy_order inserted", {
      receiptId: params.receiptId,
      status: params.status,
      orderId: data.id,
    });
  }
}

/**
 * Uses a simple key-value approach: stores last poll timestamp
 * in a dedicated row in the etsy_state table, or falls back to
 * looking at the most recent etsy_order's created_at.
 */
async function getLastPollTimestamp(
  supabase: ReturnType<typeof createSupabaseAdmin>
): Promise<number> {
  const { data } = await supabase
    .from(DB.etsyState)
    .select("value")
    .eq("key", "last_poll_ts")
    .maybeSingle();

  if (data?.value) return parseInt(data.value, 10);

  // Fallback: look at the most recent etsy_order
  const { data: recent } = await supabase
    .from(DB.etsyOrders)
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1);

  if (recent?.[0]?.created_at) {
    return Math.floor(new Date(recent[0].created_at).getTime() / 1000);
  }

  // No prior polls — look back 24 hours
  return Math.floor(Date.now() / 1000) - 86400;
}

async function setLastPollTimestamp(
  supabase: ReturnType<typeof createSupabaseAdmin>,
  ts: number
): Promise<void> {
  const { error } = await supabase.from(DB.etsyState).upsert(
    {
      key: "last_poll_ts",
      value: String(ts),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );

  if (error) {
    dbError("etsy-poll", "failed to update last_poll_ts", error);
  }
}
