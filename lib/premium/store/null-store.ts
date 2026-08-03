/**
 * lib/premium/store/null-store.ts
 *
 * Default in-memory-noop ReadingStore.
 *
 * `get` always returns null (no cache). `tryLock` always succeeds.
 * `save` and `releaseLock` are no-ops.
 *
 * This preserves current behaviour (regenerate every request) while
 * putting the idempotency seam in place. When we ship a real store
 * (Vercel KV, Postgres, etc.) the pipeline changes zero lines.
 */

import type { PremiumReading } from "@/lib/premium/types";
import type { ReadingStore } from "./types";

export class NullReadingStore implements ReadingStore {
  async get(_id: string): Promise<PremiumReading | null> {
    return null;
  }
  async tryLock(_id: string, _ttlMs: number): Promise<boolean> {
    return true;
  }
  async save(_id: string, _reading: PremiumReading): Promise<void> {
    /* noop */
  }
  async releaseLock(_id: string): Promise<void> {
    /* noop */
  }
}
