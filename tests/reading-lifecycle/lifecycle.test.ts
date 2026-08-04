/**
 * tests/reading-lifecycle/lifecycle.test.ts
 *
 * Run: npx tsx tests/reading-lifecycle/lifecycle.test.ts
 *
 * Tests the reading-lifecycle queue: acknowledgePayment, claimNextQueuedOrder,
 * completeGeneration, failGeneration, resetStaleGenerating, and the cron
 * worker's scope (birth-chart-book only).
 *
 * Uses an in-memory mock of the Supabase client that simulates the query
 * builder chain (.from().select().eq().update() etc.) including the WHERE-
 * clause guard that PostgreSQL uses for optimistic locking.
 */

import assert from "node:assert/strict";

/* ─────────────────────────────────────────────────────────────────────
   In-memory Supabase mock
───────────────────────────────────────────────────────────────────── */

type Row = Record<string, unknown>;

class MockDB {
  tables: Record<string, Row[]> = {};

  seed(table: string, rows: Row[]): void {
    this.tables[table] = rows.map((r) => ({ ...r }));
  }

  getRows(table: string): Row[] {
    return this.tables[table] ?? [];
  }
}

function matchesFilters(row: Row, filters: Filter[]): boolean {
  return filters.every((f) => {
    const val = row[f.column];
    switch (f.op) {
      case "eq":
        return val === f.value;
      case "neq":
        return val !== f.value;
      case "lt":
        return typeof val === "number"
          ? val < (f.value as number)
          : typeof val === "string"
            ? val < (f.value as string)
            : false;
      case "gte":
        return typeof val === "number"
          ? val >= (f.value as number)
          : typeof val === "string"
            ? val >= (f.value as string)
            : false;
      case "in":
        return Array.isArray(f.value) && (f.value as unknown[]).includes(val);
      default:
        return true;
    }
  });
}

interface Filter {
  column: string;
  op: "eq" | "neq" | "lt" | "gte" | "in";
  value: unknown;
}

interface QueryState {
  table: string;
  selectCols: string;
  filters: Filter[];
  orderCol?: string;
  orderAsc?: boolean;
  limitN?: number;
  updateData?: Row;
  insertData?: Row[];
  deleteMode?: boolean;
  countMode?: boolean;
  headMode?: boolean;
}

function createMockQueryBuilder(db: MockDB, state: QueryState): any {
  const builder: any = {};

  const addFilter = (op: Filter["op"]) => (column: string, value: unknown) => {
    state.filters.push({ column, op, value });
    return createMockQueryBuilder(db, state);
  };

  builder.eq = addFilter("eq");
  builder.neq = addFilter("neq");
  builder.lt = addFilter("lt");
  builder.gte = addFilter("gte");
  builder.in = (column: string, values: unknown[]) => {
    state.filters.push({ column, op: "in", value: values });
    return createMockQueryBuilder(db, state);
  };

  builder.order = (column: string, opts?: { ascending?: boolean }) => {
    state.orderCol = column;
    state.orderAsc = opts?.ascending ?? true;
    return createMockQueryBuilder(db, state);
  };

  builder.limit = (n: number) => {
    state.limitN = n;
    return createMockQueryBuilder(db, state);
  };

  builder.select = (cols?: string) => {
    state.selectCols = cols ?? "*";
    return createMockQueryBuilder(db, state);
  };

  builder.single = () => {
    if (state.updateData) {
      const result = executeUpdate(db, state);
      const row = result.data?.[0] ?? null;
      if (!row) return { data: null, error: { message: "No rows found" } };
      return { data: projectRow(row, state.selectCols), error: null };
    }
    const rows = getFilteredRows(db, state);
    const row = rows[0] ?? null;
    if (!row) return { data: null, error: { message: "No rows found" } };
    return { data: projectRow(row, state.selectCols), error: null };
  };

  builder.maybeSingle = () => {
    if (state.updateData) {
      const result = executeUpdate(db, state);
      const row = result.data?.[0] ?? null;
      return { data: row ? projectRow(row, state.selectCols) : null, error: null };
    }
    const rows = getFilteredRows(db, state);
    const row = rows[0] ?? null;
    return { data: row ? projectRow(row, state.selectCols) : null, error: null };
  };

  // For terminal operations without single/maybeSingle — returns array or count
  builder.then = (resolve: (val: any) => void) => {
    if (state.headMode && state.countMode) {
      const rows = getFilteredRows(db, state);
      resolve({ count: rows.length, data: null, error: null });
    } else if (state.updateData) {
      const result = executeUpdate(db, state);
      resolve(result);
    } else if (state.deleteMode) {
      const result = executeDelete(db, state);
      resolve(result);
    } else {
      const rows = getFilteredRows(db, state);
      resolve({ data: rows.map((r) => projectRow(r, state.selectCols)), error: null });
    }
  };

  return builder;
}

function getFilteredRows(db: MockDB, state: QueryState): Row[] {
  let rows = db.getRows(state.table).filter((r) => matchesFilters(r, state.filters));

  if (state.orderCol) {
    const col = state.orderCol;
    const asc = state.orderAsc ?? true;
    rows.sort((a, b) => {
      const va = a[col] as string | number;
      const vb = b[col] as string | number;
      if (va < vb) return asc ? -1 : 1;
      if (va > vb) return asc ? 1 : -1;
      return 0;
    });
  }

  if (state.limitN != null) {
    rows = rows.slice(0, state.limitN);
  }

  return rows;
}

function executeUpdate(db: MockDB, state: QueryState): { data: Row[] | null; error: null } {
  const table = db.tables[state.table] ?? [];
  const matched: Row[] = [];

  for (const row of table) {
    if (matchesFilters(row, state.filters)) {
      Object.assign(row, state.updateData);
      matched.push(row);
    }
  }

  if (state.selectCols) {
    return { data: matched.map((r) => projectRow(r, state.selectCols)), error: null };
  }
  return { data: matched, error: null };
}

function executeDelete(db: MockDB, state: QueryState): { data: Row[] | null; error: null } {
  const table = db.tables[state.table] ?? [];
  const remaining: Row[] = [];
  const deleted: Row[] = [];

  for (const row of table) {
    if (matchesFilters(row, state.filters)) {
      deleted.push(row);
    } else {
      remaining.push(row);
    }
  }

  db.tables[state.table] = remaining;
  return { data: deleted, error: null };
}

function projectRow(row: Row, cols: string): Row {
  if (!cols || cols === "*") return { ...row };
  const keys = cols.split(",").map((c) => c.trim());
  const out: Row = {};
  for (const k of keys) {
    if (k in row) out[k] = row[k];
  }
  return out;
}

function createMockSupabase(db: MockDB): any {
  return {
    from: (table: string) => {
      const state: QueryState = { table, selectCols: "*", filters: [] };
      return {
        select: (cols?: string, opts?: { count?: string; head?: boolean }) => {
          state.selectCols = cols ?? "*";
          if (opts?.count === "exact") state.countMode = true;
          if (opts?.head) state.headMode = true;
          return createMockQueryBuilder(db, state);
        },
        update: (data: Row) => {
          state.updateData = data;
          return createMockQueryBuilder(db, state);
        },
        insert: (rows: Row[]) => {
          const ids: string[] = [];
          for (const row of rows) {
            const id = row.id ?? `mock-${Math.random().toString(36).slice(2, 10)}`;
            const inserted = { ...row, id };
            if (!db.tables[table]) db.tables[table] = [];
            db.tables[table].push(inserted);
            ids.push(id as string);
          }
          state.selectCols = "*";
          // For .select().single() after insert, filter to inserted rows
          state.filters.push({ column: "id", op: "in", value: ids });
          return createMockQueryBuilder(db, state);
        },
        delete: () => {
          state.deleteMode = true;
          return createMockQueryBuilder(db, state);
        },
      };
    },
  };
}

/* ─────────────────────────────────────────────────────────────────────
   Import the functions under test
───────────────────────────────────────────────────────────────────── */

import {
  acknowledgePayment,
  claimNextQueuedOrder,
  completeGeneration,
  failGeneration,
  resetStaleGenerating,
  recordDelivery,
} from "@/lib/db/reading-lifecycle";
import type { BirthInputs } from "@/lib/db/types";

/* ─────────────────────────────────────────────────────────────────────
   Test fixtures
───────────────────────────────────────────────────────────────────── */

const BIRTH_INPUTS: BirthInputs = {
  name: "Test User",
  dob: "1990-01-15",
  birth_time: "14:30",
  birth_place: "New York, NY",
  timezone: "America/New_York",
  birth_lat: 40.7128,
  birth_lng: -74.006,
};

let passed = 0;
let failed = 0;

async function testCase(name: string, fn: () => void | Promise<void>): Promise<void> {
  try {
    await fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.error(`  ✗ ${name}`);
    console.error(`    ${err instanceof Error ? err.message : String(err)}`);
  }
}

async function runTests(): Promise<void> {
  // ═══════════════════════════════════════════════════════════════════
  // A. Duplicate Gumroad webhook
  // ═══════════════════════════════════════════════════════════════════
  console.log("\nA. Duplicate Gumroad webhook");

  await testCase("first webhook creates paid + queued payment", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-1",
        session_id: "sess-1",
        email: "test@example.com",
        payment_status: "pending",
        product_type: "birth-chart-book",
        gumroad_payment_id: null,
        reading_status: null,
        access_token: "tok-1",
        user_id: null,
        birth_inputs: null,
        generation_attempts: 0,
        generation_started_at: null,
        generation_error: null,
        delivery_sent_at: null,
        created_at: "2026-08-01T00:00:00Z",
        updated_at: "2026-08-01T00:00:00Z",
      },
    ]);
    db.seed("Users", [{ id: "user-1", email: "test@example.com", name: "Test User" }]);
    const supabase = createMockSupabase(db);

    const result = await acknowledgePayment(supabase, {
      email: "test@example.com",
      sessionId: "sess-1",
      gumroadPaymentId: "gum-sale-1",
      amountCents: 0,
      productType: "birth-chart-book",
      birthInputs: BIRTH_INPUTS,
      orderSource: "gumroad",
      userName: "Test User",
    });

    assert.equal(result.ok, true);
    assert.equal(result.duplicate, undefined);
    assert.equal(result.paymentId, "pay-1");

    const row = db.getRows("Payments")[0];
    assert.equal(row.payment_status, "paid");
    assert.equal(row.reading_status, "queued");
    assert.equal(row.gumroad_payment_id, "gum-sale-1");
    assert.deepEqual(row.birth_inputs, BIRTH_INPUTS);
  });

  await testCase("second webhook with same sale_id returns duplicate", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-1",
        session_id: "sess-1",
        email: "test@example.com",
        payment_status: "paid",
        product_type: "birth-chart-book",
        gumroad_payment_id: "gum-sale-1",
        reading_status: "queued",
        access_token: "tok-1",
        user_id: "user-1",
        birth_inputs: BIRTH_INPUTS,
        generation_attempts: 0,
      },
    ]);
    db.seed("Users", [{ id: "user-1", email: "test@example.com", name: "Test User" }]);
    const supabase = createMockSupabase(db);

    const result = await acknowledgePayment(supabase, {
      email: "test@example.com",
      sessionId: "sess-1",
      gumroadPaymentId: "gum-sale-1",
      amountCents: 0,
      productType: "birth-chart-book",
      birthInputs: BIRTH_INPUTS,
      orderSource: "gumroad",
      userName: "Test User",
    });

    assert.equal(result.ok, true);
    assert.equal(result.duplicate, true);
    assert.equal(result.paymentId, "pay-1");

    // Verify no second Payment was created
    assert.equal(db.getRows("Payments").length, 1);
  });

  // ═══════════════════════════════════════════════════════════════════
  // B. Two simultaneous workers claim same order
  // ═══════════════════════════════════════════════════════════════════
  console.log("\nB. Two simultaneous workers claim same order");

  await testCase("exactly one worker succeeds claiming the same queued order", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-1",
        email: "test@example.com",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "queued",
        access_token: "tok-1",
        user_id: "user-1",
        birth_inputs: BIRTH_INPUTS,
        generation_attempts: 0,
        generation_started_at: null,
        created_at: "2026-08-01T00:00:00Z",
      },
    ]);

    const supabase = createMockSupabase(db);

    // Worker A claims first
    const claimA = await claimNextQueuedOrder(supabase, "birth-chart-book");
    assert.notEqual(claimA, null, "Worker A should claim the order");
    assert.equal(claimA!.id, "pay-1");

    // After Worker A's claim, the row is now 'generating'
    const row = db.getRows("Payments")[0];
    assert.equal(row.reading_status, "generating");

    // Worker B tries to claim — the reading_status='queued' guard fails
    const claimB = await claimNextQueuedOrder(supabase, "birth-chart-book");
    assert.equal(claimB, null, "Worker B should get null — order already claimed");

    // Verify reading_status is still 'generating' (not double-claimed)
    assert.equal(db.getRows("Payments")[0].reading_status, "generating");
    assert.equal(db.getRows("Payments")[0].generation_attempts, 1);
  });

  await testCase("atomic claim: SELECT sees queued but UPDATE guard rejects (simulated race)", async () => {
    // Simulate the exact race condition:
    // Both workers SELECT the same row as 'queued'.
    // Worker A's UPDATE with .eq('reading_status', 'queued') succeeds.
    // Worker B's UPDATE with .eq('reading_status', 'queued') returns 0 rows
    // because A already changed it to 'generating'.

    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-race",
        email: "race@example.com",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "queued",
        access_token: "tok-race",
        user_id: null,
        birth_inputs: BIRTH_INPUTS,
        generation_attempts: 0,
        generation_started_at: null,
        created_at: "2026-08-01T00:00:00Z",
      },
    ]);

    const supabase = createMockSupabase(db);

    // Both workers see the row as queued
    const { data: selectA } = await supabase
      .from("Payments")
      .select("id, reading_status")
      .eq("reading_status", "queued")
      .eq("product_type", "birth-chart-book")
      .limit(1)
      .maybeSingle();
    assert.equal(selectA?.id, "pay-race");

    const { data: selectB } = await supabase
      .from("Payments")
      .select("id, reading_status")
      .eq("reading_status", "queued")
      .eq("product_type", "birth-chart-book")
      .limit(1)
      .maybeSingle();
    assert.equal(selectB?.id, "pay-race");

    // Worker A's UPDATE succeeds (reading_status is still 'queued')
    const { data: updateA } = await supabase
      .from("Payments")
      .update({ reading_status: "generating", generation_attempts: 1 })
      .eq("id", "pay-race")
      .eq("reading_status", "queued")
      .select("id")
      .maybeSingle();
    assert.notEqual(updateA, null, "Worker A's UPDATE should succeed");

    // Worker B's UPDATE fails (reading_status is now 'generating', not 'queued')
    const { data: updateB } = await supabase
      .from("Payments")
      .update({ reading_status: "generating", generation_attempts: 1 })
      .eq("id", "pay-race")
      .eq("reading_status", "queued")
      .select("id")
      .maybeSingle();
    assert.equal(updateB, null, "Worker B's UPDATE should return null — guard clause fails");

    // Row was only modified once
    assert.equal(db.getRows("Payments")[0].generation_attempts, 1);
  });

  // ═══════════════════════════════════════════════════════════════════
  // C. Successful generation lifecycle
  // ═══════════════════════════════════════════════════════════════════
  console.log("\nC. Successful generation lifecycle");

  await testCase("queued → generating → completed with reading_json saved once", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-gen",
        email: "gen@example.com",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "queued",
        access_token: "tok-gen",
        user_id: "user-gen",
        birth_inputs: BIRTH_INPUTS,
        generation_attempts: 0,
        generation_started_at: null,
        created_at: "2026-08-01T00:00:00Z",
      },
    ]);
    db.seed("readings", []);
    const supabase = createMockSupabase(db);

    // Step 1: Claim → generating
    const claimed = await claimNextQueuedOrder(supabase, "birth-chart-book");
    assert.notEqual(claimed, null);
    assert.equal(claimed!.id, "pay-gen");
    assert.equal(db.getRows("Payments")[0].reading_status, "generating");
    assert.equal(db.getRows("Payments")[0].generation_attempts, 1);

    // Step 2: Complete → completed + reading inserted
    const fakeReadingJson = { sections: ["intro", "sun"], meta: {} };
    const result = await completeGeneration(supabase, "pay-gen", {
      userId: "user-gen",
      birthInputs: BIRTH_INPUTS,
      readingJson: fakeReadingJson,
      productType: "birth-chart-book",
    });

    assert.equal(result.ok, true);
    assert.ok(result.readingId);
    assert.equal(db.getRows("Payments")[0].reading_status, "completed");
    assert.equal(db.getRows("readings").length, 1);
    assert.equal(db.getRows("readings")[0].payment_id, "pay-gen");
  });

  await testCase("completeGeneration is idempotent — second call reuses existing reading", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-idem",
        email: "idem@example.com",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "generating",
        access_token: "tok-idem",
        user_id: "user-idem",
        birth_inputs: BIRTH_INPUTS,
        generation_attempts: 1,
      },
    ]);
    db.seed("readings", [
      {
        id: "read-existing",
        payment_id: "pay-idem",
        reading_json: { existing: true },
        reading_status: "complete",
        product_type: "birth-chart-book",
      },
    ]);
    const supabase = createMockSupabase(db);

    const result = await completeGeneration(supabase, "pay-idem", {
      userId: "user-idem",
      birthInputs: BIRTH_INPUTS,
      readingJson: { new: true },
      productType: "birth-chart-book",
    });

    assert.equal(result.ok, true);
    assert.equal(result.readingId, "read-existing");
    // No second reading inserted
    assert.equal(db.getRows("readings").length, 1);
    // Payment marked completed
    assert.equal(db.getRows("Payments")[0].reading_status, "completed");
  });

  // ═══════════════════════════════════════════════════════════════════
  // D. Generation failure
  // ═══════════════════════════════════════════════════════════════════
  console.log("\nD. Generation failure");

  await testCase("failGeneration sets reading_status=failed and saves error", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-fail",
        email: "fail@example.com",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "generating",
        access_token: "tok-fail",
        generation_attempts: 1,
        generation_error: null,
      },
    ]);
    const supabase = createMockSupabase(db);

    await failGeneration(supabase, "pay-fail", "Anthropic API timeout");

    const row = db.getRows("Payments")[0];
    assert.equal(row.reading_status, "failed");
    assert.equal(row.generation_error, "Anthropic API timeout");
  });

  // ═══════════════════════════════════════════════════════════════════
  // E. Stale generating recovery
  // ═══════════════════════════════════════════════════════════════════
  console.log("\nE. Stale generating recovery");

  await testCase("stale order with attempts < 3 gets requeued", async () => {
    const staleTime = new Date(Date.now() - 15 * 60 * 1000).toISOString(); // 15 min ago
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-stale",
        email: "stale@example.com",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "generating",
        access_token: "tok-stale",
        generation_attempts: 1,
        generation_started_at: staleTime,
        generation_error: null,
      },
    ]);
    const supabase = createMockSupabase(db);

    const result = await resetStaleGenerating(supabase);

    assert.equal(result.requeued, 1);
    assert.equal(result.failed, 0);

    const row = db.getRows("Payments")[0];
    assert.equal(row.reading_status, "queued");
    assert.equal(row.generation_started_at, null);
  });

  // ═══════════════════════════════════════════════════════════════════
  // F. 3 failed attempts → permanently failed
  // ═══════════════════════════════════════════════════════════════════
  console.log("\nF. Max attempts enforcement");

  await testCase("stale order with attempts >= 3 is marked failed, not requeued", async () => {
    const staleTime = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-maxed",
        email: "maxed@example.com",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "generating",
        access_token: "tok-maxed",
        generation_attempts: 3,
        generation_started_at: staleTime,
        generation_error: null,
      },
    ]);
    const supabase = createMockSupabase(db);

    const result = await resetStaleGenerating(supabase);

    assert.equal(result.requeued, 0);
    assert.equal(result.failed, 1);

    const row = db.getRows("Payments")[0];
    assert.equal(row.reading_status, "failed");
    assert.equal(row.generation_error, "Max generation attempts exceeded");
  });

  await testCase("failed order is NOT picked up by claimNextQueuedOrder", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-done",
        email: "done@example.com",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "failed",
        access_token: "tok-done",
        generation_attempts: 3,
        generation_error: "Max generation attempts exceeded",
        generation_started_at: null,
        created_at: "2026-08-01T00:00:00Z",
      },
    ]);
    const supabase = createMockSupabase(db);

    const claimed = await claimNextQueuedOrder(supabase, "birth-chart-book");
    assert.equal(claimed, null, "Failed order should NOT be claimable");
  });

  await testCase("3 successive claim-fail cycles exhaust attempts correctly", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-3x",
        email: "threex@example.com",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "queued",
        access_token: "tok-3x",
        user_id: null,
        birth_inputs: BIRTH_INPUTS,
        generation_attempts: 0,
        generation_started_at: null,
        generation_error: null,
        created_at: "2026-08-01T00:00:00Z",
      },
    ]);
    const supabase = createMockSupabase(db);

    // Attempt 1: claim → fail → requeue
    let claimed = await claimNextQueuedOrder(supabase, "birth-chart-book");
    assert.notEqual(claimed, null);
    assert.equal(claimed!.generationAttempts, 1);
    await failGeneration(supabase, "pay-3x", "Attempt 1 failed");
    // Manually requeue (simulating what resetStaleGenerating does)
    db.getRows("Payments")[0].reading_status = "queued";
    db.getRows("Payments")[0].generation_started_at = null;

    // Attempt 2: claim → fail → requeue
    claimed = await claimNextQueuedOrder(supabase, "birth-chart-book");
    assert.notEqual(claimed, null);
    assert.equal(claimed!.generationAttempts, 2);
    await failGeneration(supabase, "pay-3x", "Attempt 2 failed");
    db.getRows("Payments")[0].reading_status = "queued";
    db.getRows("Payments")[0].generation_started_at = null;

    // Attempt 3: claim → fail
    claimed = await claimNextQueuedOrder(supabase, "birth-chart-book");
    assert.notEqual(claimed, null);
    assert.equal(claimed!.generationAttempts, 3);
    await failGeneration(supabase, "pay-3x", "Attempt 3 failed");

    // Now simulate stale recovery — should mark as failed, not requeue
    db.getRows("Payments")[0].reading_status = "generating";
    db.getRows("Payments")[0].generation_started_at =
      new Date(Date.now() - 15 * 60 * 1000).toISOString();
    const stale = await resetStaleGenerating(supabase);
    assert.equal(stale.requeued, 0);
    assert.equal(stale.failed, 1);
    assert.equal(db.getRows("Payments")[0].reading_status, "failed");

    // Attempt 4: should NOT be possible
    db.getRows("Payments")[0].reading_status = "failed"; // ensure state
    claimed = await claimNextQueuedOrder(supabase, "birth-chart-book");
    assert.equal(claimed, null, "No 4th attempt should be possible");
  });

  // ═══════════════════════════════════════════════════════════════════
  // G. Reading completed + delivery email fails
  // ═══════════════════════════════════════════════════════════════════
  console.log("\nG. Reading completed but delivery email fails");

  await testCase("reading_status stays completed even when delivery is not sent", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-mail",
        email: "mail@example.com",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "generating",
        access_token: "tok-mail",
        user_id: "user-mail",
        birth_inputs: BIRTH_INPUTS,
        generation_attempts: 1,
        delivery_sent_at: null,
      },
    ]);
    db.seed("readings", []);
    const supabase = createMockSupabase(db);

    // Complete the generation
    const result = await completeGeneration(supabase, "pay-mail", {
      userId: "user-mail",
      birthInputs: BIRTH_INPUTS,
      readingJson: { content: "full book" },
      productType: "birth-chart-book",
    });

    assert.equal(result.ok, true);

    // Reading was saved
    assert.equal(db.getRows("readings").length, 1);

    // Payment is completed
    const payment = db.getRows("Payments")[0];
    assert.equal(payment.reading_status, "completed");

    // Delivery was NOT sent (no recordDelivery called)
    assert.equal(payment.delivery_sent_at, null);

    // Reading is safe — reading_status stayed "completed"
    assert.equal(payment.reading_status, "completed");
  });

  await testCase("recordDelivery sets delivery_sent_at without changing reading_status", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-del",
        email: "del@example.com",
        payment_status: "paid",
        reading_status: "completed",
        delivery_sent_at: null,
      },
    ]);
    const supabase = createMockSupabase(db);

    await recordDelivery(supabase, "pay-del");

    const row = db.getRows("Payments")[0];
    assert.notEqual(row.delivery_sent_at, null);
    assert.equal(row.reading_status, "completed");
  });

  // ═══════════════════════════════════════════════════════════════════
  // H. Duplicate cron invocation after completed reading
  // ═══════════════════════════════════════════════════════════════════
  console.log("\nH. Duplicate cron invocation after completed reading");

  await testCase("completed payment is not claimed by worker", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-comp",
        email: "comp@example.com",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "completed",
        access_token: "tok-comp",
        generation_attempts: 1,
        generation_started_at: null,
        created_at: "2026-08-01T00:00:00Z",
      },
    ]);
    const supabase = createMockSupabase(db);

    const claimed = await claimNextQueuedOrder(supabase, "birth-chart-book");
    assert.equal(claimed, null, "Completed order should NOT be claimable");
  });

  await testCase("completeGeneration with existing reading does not insert duplicate", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-dup-read",
        payment_status: "paid",
        reading_status: "generating",
      },
    ]);
    db.seed("readings", [
      {
        id: "read-dup",
        payment_id: "pay-dup-read",
        reading_json: { original: true },
        reading_status: "complete",
        product_type: "birth-chart-book",
      },
    ]);
    const supabase = createMockSupabase(db);

    const result = await completeGeneration(supabase, "pay-dup-read", {
      userId: null,
      birthInputs: BIRTH_INPUTS,
      readingJson: { duplicate: true },
      productType: "birth-chart-book",
    });

    assert.equal(result.ok, true);
    assert.equal(result.readingId, "read-dup");
    assert.equal(db.getRows("readings").length, 1);
    // Original reading preserved, not overwritten
    assert.equal((db.getRows("readings")[0].reading_json as any).original, true);
  });

  // ═══════════════════════════════════════════════════════════════════
  // I. Old Payments with reading_status=NULL
  // ═══════════════════════════════════════════════════════════════════
  console.log("\nI. Old Payments with reading_status=NULL are ignored");

  await testCase("payment with reading_status=null is not claimed by worker", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-old",
        email: "old@example.com",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: null,
        access_token: "tok-old",
        generation_attempts: 0,
        generation_started_at: null,
        created_at: "2025-06-01T00:00:00Z",
      },
    ]);
    const supabase = createMockSupabase(db);

    const claimed = await claimNextQueuedOrder(supabase, "birth-chart-book");
    assert.equal(claimed, null, "Legacy payment with reading_status=null should be ignored");
  });

  await testCase("stale recovery ignores payments with reading_status=null", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-legacy",
        reading_status: null,
        generation_started_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        generation_attempts: 0,
      },
    ]);
    const supabase = createMockSupabase(db);

    const result = await resetStaleGenerating(supabase);
    assert.equal(result.requeued, 0);
    assert.equal(result.failed, 0);
    assert.equal(db.getRows("Payments")[0].reading_status, null);
  });

  // ═══════════════════════════════════════════════════════════════════
  // J. Non-birth-chart-book product scoping
  // ═══════════════════════════════════════════════════════════════════
  console.log("\nJ. Non-birth-chart-book products are not queued");

  await testCase("worker does not claim non-book queued orders", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-reading",
        email: "reading@example.com",
        payment_status: "paid",
        product_type: "reading",
        reading_status: "queued",
        access_token: "tok-reading",
        user_id: null,
        birth_inputs: BIRTH_INPUTS,
        generation_attempts: 0,
        generation_started_at: null,
        created_at: "2026-08-01T00:00:00Z",
      },
    ]);
    const supabase = createMockSupabase(db);

    // With productType filter, worker should not claim a "reading" type
    const claimed = await claimNextQueuedOrder(supabase, "birth-chart-book");
    assert.equal(claimed, null, "Non-book product should not be claimed by book worker");
    assert.equal(db.getRows("Payments")[0].reading_status, "queued");
  });

  await testCase("worker claims book order but skips non-book order in same queue", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-non-book",
        email: "nonbook@example.com",
        payment_status: "paid",
        product_type: "reading",
        reading_status: "queued",
        access_token: "tok-nb",
        user_id: null,
        birth_inputs: BIRTH_INPUTS,
        generation_attempts: 0,
        generation_started_at: null,
        created_at: "2026-08-01T00:00:00Z",
      },
      {
        id: "pay-book",
        email: "book@example.com",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "queued",
        access_token: "tok-b",
        user_id: null,
        birth_inputs: BIRTH_INPUTS,
        generation_attempts: 0,
        generation_started_at: null,
        created_at: "2026-08-01T01:00:00Z",
      },
    ]);
    const supabase = createMockSupabase(db);

    const claimed = await claimNextQueuedOrder(supabase, "birth-chart-book");
    assert.notEqual(claimed, null);
    assert.equal(claimed!.id, "pay-book");
    assert.equal(claimed!.productType, "birth-chart-book");

    // Non-book order untouched
    assert.equal(db.getRows("Payments")[0].reading_status, "queued");
    assert.equal(db.getRows("Payments")[0].product_type, "reading");
  });

  // ═══════════════════════════════════════════════════════════════════
  // K. Global concurrency capacity
  // ═══════════════════════════════════════════════════════════════════
  console.log("\nK. Global concurrency capacity enforcement");

  // Helper: simulates the capacity check from the cron worker's GET handler.
  // Returns the number of available slots given a mock DB state.
  async function getAvailableSlots(db: MockDB, concurrency: number): Promise<number> {
    const supabase = createMockSupabase(db);
    const { count } = await supabase
      .from("Payments")
      .select("id", { count: "exact", head: true })
      .eq("reading_status", "generating")
      .eq("product_type", "birth-chart-book");
    const currentlyGenerating = count ?? 0;
    return Math.max(0, concurrency - currentlyGenerating);
  }

  await testCase("0 generating → can claim up to 2", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-q1",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "queued",
        access_token: "tok-q1",
        user_id: null,
        birth_inputs: BIRTH_INPUTS,
        generation_attempts: 0,
        generation_started_at: null,
        created_at: "2026-08-01T00:00:00Z",
      },
      {
        id: "pay-q2",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "queued",
        access_token: "tok-q2",
        user_id: null,
        birth_inputs: BIRTH_INPUTS,
        generation_attempts: 0,
        generation_started_at: null,
        created_at: "2026-08-01T01:00:00Z",
      },
    ]);

    const slots = await getAvailableSlots(db, 2);
    assert.equal(slots, 2);

    const supabase = createMockSupabase(db);
    const claim1 = await claimNextQueuedOrder(supabase, "birth-chart-book");
    const claim2 = await claimNextQueuedOrder(supabase, "birth-chart-book");
    assert.notEqual(claim1, null);
    assert.notEqual(claim2, null);
    assert.notEqual(claim1!.id, claim2!.id);
  });

  await testCase("1 generating → can claim only 1", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-active",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "generating",
        generation_started_at: new Date().toISOString(),
        generation_attempts: 1,
      },
      {
        id: "pay-waiting",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "queued",
        access_token: "tok-w",
        user_id: null,
        birth_inputs: BIRTH_INPUTS,
        generation_attempts: 0,
        generation_started_at: null,
        created_at: "2026-08-01T00:00:00Z",
      },
      {
        id: "pay-waiting2",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "queued",
        access_token: "tok-w2",
        user_id: null,
        birth_inputs: BIRTH_INPUTS,
        generation_attempts: 0,
        generation_started_at: null,
        created_at: "2026-08-01T01:00:00Z",
      },
    ]);

    const slots = await getAvailableSlots(db, 2);
    assert.equal(slots, 1, "With 1 generating, only 1 slot should be available");
  });

  await testCase("2 generating → claims 0", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-gen-a",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "generating",
        generation_started_at: new Date().toISOString(),
        generation_attempts: 1,
      },
      {
        id: "pay-gen-b",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "generating",
        generation_started_at: new Date().toISOString(),
        generation_attempts: 1,
      },
      {
        id: "pay-queued-c",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "queued",
        access_token: "tok-c",
        user_id: null,
        birth_inputs: BIRTH_INPUTS,
        generation_attempts: 0,
        generation_started_at: null,
        created_at: "2026-08-01T00:00:00Z",
      },
    ]);

    const slots = await getAvailableSlots(db, 2);
    assert.equal(slots, 0, "With 2 generating, 0 slots should be available");

    // Queued order C must remain untouched
    assert.equal(db.getRows("Payments")[2].reading_status, "queued");
  });

  await testCase("completed/failed/NULL rows do not count toward active concurrency", async () => {
    const db = new MockDB();
    db.seed("Payments", [
      {
        id: "pay-completed",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "completed",
      },
      {
        id: "pay-failed",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: "failed",
      },
      {
        id: "pay-null",
        payment_status: "paid",
        product_type: "birth-chart-book",
        reading_status: null,
      },
      {
        id: "pay-reading-gen",
        payment_status: "paid",
        product_type: "reading",
        reading_status: "generating",
      },
    ]);

    const slots = await getAvailableSlots(db, 2);
    assert.equal(slots, 2, "Only generating birth-chart-book rows count — completed/failed/NULL/other products do not");
  });

  // ═══════════════════════════════════════════════════════════════════
  // Summary
  // ═══════════════════════════════════════════════════════════════════

  console.log(`\n────────────────────────────────────`);
  console.log(`  ${passed} passed, ${failed} failed`);
  console.log(`────────────────────────────────────\n`);

  if (failed > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
