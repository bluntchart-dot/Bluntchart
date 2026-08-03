/**
 * lib/premium/store/types.ts
 *
 * ReadingStore — persistence + idempotency seam for the generation
 * pipeline. Today only NullReadingStore is used. Later, when payment
 * ships, a real KV/DB implementation drops in without changing
 * generatePremiumReading or its callers.
 *
 * generationRequestId is an opaque string chosen by the caller:
 *   - Today (internal): a UUID minted per request.
 *   - Later (payment):  the order/payment ID from Gumroad/Stripe.
 *
 * The generation function never derives meaning from it.
 */

import type { PremiumReading } from "@/lib/premium/types";

export interface ReadingStore {
  /** Return the previously stored reading for this id, or null if none. */
  get(id: string): Promise<PremiumReading | null>;

  /**
   * Attempt to acquire a lock for this id with the given TTL.
   * Returns true if acquired, false if another writer holds it.
   * Concurrent duplicate requests should be prevented by this lock.
   */
  tryLock(id: string, ttlMs: number): Promise<boolean>;

  /** Persist the completed reading for this id. */
  save(id: string, reading: PremiumReading): Promise<void>;

  /** Release any lock held for this id. Safe to call even if no lock. */
  releaseLock(id: string): Promise<void>;
}
