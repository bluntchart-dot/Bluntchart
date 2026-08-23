/**
 * scripts/generate-book-worker.ts
 *
 * Standalone worker executed by GitHub Actions (both dispatch and watchdog).
 * Runs outside Vercel — no 300-second function limit.
 *
 * Modes:
 *   PAYMENT_ID env var set → dispatch mode: process that specific payment
 *   PAYMENT_ID not set     → watchdog mode: claim up to CONCURRENCY queued orders
 *
 * Usage:
 *   npx tsx scripts/generate-book-worker.ts
 */

import { createSupabaseAdmin } from "@/lib/supabase-admin";
import {
  resetStaleGenerating,
  countGeneratingOrders,
  claimNextQueuedOrder,
  claimSpecificOrder,
  failGeneration,
  type ClaimedOrder,
} from "@/lib/db/reading-lifecycle";
import { processOrder } from "@/lib/premium/process-book-order";

const CONCURRENCY = Number(process.env.BOOK_GENERATION_CONCURRENCY ?? "2");

async function runDispatch(paymentId: string): Promise<void> {
  const supabase = createSupabaseAdmin();

  console.log(`[dispatch] processing specific payment: ${paymentId}`);

  // Check global capacity
  const generating = await countGeneratingOrders(supabase);
  if (generating >= CONCURRENCY) {
    console.log(
      `[dispatch] capacity full (${generating}/${CONCURRENCY}) — payment stays queued, watchdog will recover`
    );
    process.exit(0);
  }

  // Claim this specific payment
  const order = await claimSpecificOrder(supabase, paymentId);
  if (!order) {
    console.log(`[dispatch] payment ${paymentId} not claimable (already processed or not queued)`);
    process.exit(0);
  }

  console.log(
    `[dispatch] claimed payment ${order.id} (attempt ${order.generationAttempts})`
  );

  try {
    await processOrder(order);
    console.log(`[dispatch] payment ${order.id} processed successfully`);
  } catch (err) {
    console.error(`[dispatch] unhandled error processing ${order.id}:`, err);
    await failGeneration(supabase, order.id, String(err));
    process.exit(1);
  }
}

async function runWatchdog(): Promise<void> {
  const supabase = createSupabaseAdmin();

  console.log("[watchdog] starting recovery sweep");

  // Reset stale generating orders
  const stale = await resetStaleGenerating(supabase);
  if (stale.requeued > 0 || stale.failed > 0) {
    console.log(`[watchdog] stale recovery: requeued=${stale.requeued}, failed=${stale.failed}`);
  }

  // Check global capacity
  const generating = await countGeneratingOrders(supabase);
  const availableSlots = Math.max(0, CONCURRENCY - generating);

  if (availableSlots === 0) {
    console.log(`[watchdog] no available slots (${generating}/${CONCURRENCY})`);
    process.exit(0);
  }

  // Claim queued orders (books + in-depth readings)
  const claimed: ClaimedOrder[] = [];
  const queuedProductTypes = ["birth-chart-book", "in-depth-reading"] as const;
  for (let i = 0; i < availableSlots; i++) {
    let order: ClaimedOrder | null = null;
    for (const pt of queuedProductTypes) {
      order = await claimNextQueuedOrder(supabase, pt);
      if (order) break;
    }
    if (!order) break;
    claimed.push(order);
  }

  if (claimed.length === 0) {
    console.log("[watchdog] no queued orders to process");
    process.exit(0);
  }

  console.log(
    `[watchdog] claimed ${claimed.length} order(s): ${claimed.map((o) => o.id).join(", ")}`
  );

  // Process in parallel
  const results = await Promise.allSettled(
    claimed.map((order) => processOrder(order))
  );

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.status === "rejected") {
      console.error(
        `[watchdog] unhandled error processing ${claimed[i].id}:`,
        result.reason
      );
      await failGeneration(supabase, claimed[i].id, String(result.reason));
    } else {
      console.log(`[watchdog] payment ${claimed[i].id} processed successfully`);
    }
  }

  console.log(`[watchdog] sweep complete: processed ${claimed.length} order(s)`);
}

async function main(): Promise<void> {
  const paymentId = process.env.PAYMENT_ID;

  if (paymentId) {
    await runDispatch(paymentId);
  } else {
    await runWatchdog();
  }
}

main().catch((err) => {
  console.error("[worker] fatal error:", err);
  process.exit(1);
});
