/**
 * GET /api/cron/generate-book
 *
 * Vercel-hosted endpoint kept for manual curl testing and as a
 * thin fallback. Real generation runs on GitHub Actions via
 * processOrder() in lib/premium/process-book-order.ts.
 *
 * On each call:
 *   1. Reset stale "generating" orders (worker died / timed out)
 *   2. Enforce global concurrency limit
 *   3. Claim up to CONCURRENCY queued birth-chart-book orders
 *   4. Process each via the shared processOrder()
 *
 * Each step is idempotent. A reading that already exists for a
 * payment_id is not regenerated. Delivery is only sent once
 * (checked via delivery_sent_at).
 */

import { NextRequest, NextResponse } from "next/server";
import { requireCronSecret } from "@/lib/blog/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import {
  resetStaleGenerating,
  claimNextQueuedOrder,
  countGeneratingOrders,
  failGeneration,
  type ClaimedOrder,
} from "@/lib/db/reading-lifecycle";
import { dbLog } from "@/lib/db/log";
import { processOrder } from "@/lib/premium/process-book-order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300;

const CONCURRENCY = Number(process.env.BOOK_GENERATION_CONCURRENCY ?? "2");

export async function GET(req: NextRequest) {
  const scope = "generate-book-cron";

  const authError = requireCronSecret(req);
  if (authError) return authError;

  const supabase = createSupabaseAdmin();

  // ── 1. Reset stale generating orders ──
  const stale = await resetStaleGenerating(supabase);
  if (stale.requeued > 0 || stale.failed > 0) {
    dbLog(scope, "stale recovery", stale);
  }

  // ── 2. Enforce global concurrency limit ──
  const currentlyGenerating = await countGeneratingOrders(supabase);
  const availableSlots = Math.max(0, CONCURRENCY - currentlyGenerating);

  if (availableSlots === 0) {
    dbLog(scope, "no available slots", { currentlyGenerating, concurrency: CONCURRENCY });
    return NextResponse.json({ ok: true, processed: 0, currentlyGenerating });
  }

  // ── 3. Claim up to availableSlots orders ──
  const claimed: ClaimedOrder[] = [];
  for (let i = 0; i < availableSlots; i++) {
    const order = await claimNextQueuedOrder(supabase, "birth-chart-book");
    if (!order) break;
    claimed.push(order);
  }

  if (claimed.length === 0) {
    return NextResponse.json({ ok: true, processed: 0, currentlyGenerating });
  }

  dbLog(scope, `claimed ${claimed.length} order(s)`, {
    ids: claimed.map((o) => o.id),
  });

  // ── 4. Process in parallel ──
  const results = await Promise.allSettled(
    claimed.map((order) => processOrder(order))
  );

  const summary = results.map((r, i) => ({
    paymentId: claimed[i].id,
    status: r.status,
    error: r.status === "rejected" ? String(r.reason) : undefined,
  }));

  for (const result of summary) {
    if (result.status === "rejected") {
      const supabaseForError = createSupabaseAdmin();
      await failGeneration(
        supabaseForError,
        result.paymentId,
        result.error ?? "Unhandled worker error"
      );
    }
  }

  dbLog(scope, "tick complete", { processed: claimed.length, summary });

  return NextResponse.json({
    ok: true,
    processed: claimed.length,
    results: summary,
  });
}
