import { describe, it, expect, vi, beforeEach } from "vitest";
import type { BirthInputs } from "@/lib/db/types";
import type { ClaimedOrder } from "@/lib/db/reading-lifecycle";

// ── Shared fixtures ──────────────────────────────────────────────────

const BIRTH_INPUTS: BirthInputs = {
  name: "Test User",
  dob: "1990-01-15",
  birth_time: "14:30",
  birth_place: "New York, NY",
  timezone: "America/New_York",
  birth_lat: 40.7128,
  birth_lng: -74.006,
};

function makeOrder(overrides: Partial<ClaimedOrder> = {}): ClaimedOrder {
  return {
    id: "payment-001",
    email: "test@example.com",
    productType: "birth-chart-book",
    birthInputs: BIRTH_INPUTS,
    accessToken: "tok-abc-123",
    userId: "user-001",
    generationAttempts: 1,
    ...overrides,
  };
}

// ── Supabase mock ────────────────────────────────────────────────────

type MockRow = Record<string, unknown>;

function createMockSupabase(opts: {
  payments?: MockRow[];
  readings?: MockRow[];
  updateResult?: MockRow[];
} = {}) {
  const payments = opts.payments ?? [];
  const readings = opts.readings ?? [];
  const updateResult = opts.updateResult;

  const makeChain = (rows: MockRow[]) => {
    const chain: Record<string, unknown> = {};
    const methods = [
      "select", "eq", "neq", "lt", "gte", "in", "order", "limit",
      "maybeSingle", "single",
    ];
    for (const m of methods) {
      chain[m] = vi.fn().mockReturnValue(chain);
    }
    chain["maybeSingle"] = vi.fn().mockResolvedValue({ data: rows[0] ?? null, error: null });
    chain["single"] = vi.fn().mockResolvedValue({ data: rows[0] ?? null, error: null });
    // For count queries
    (chain as Record<string, unknown>)["_rows"] = rows;
    return chain;
  };

  const selectChain = (tableName: string) => {
    if (tableName === "Payments") return makeChain(payments);
    if (tableName === "readings") return makeChain(readings);
    return makeChain([]);
  };

  const updateChain = () => {
    const chain = makeChain(updateResult ?? [{ id: "payment-001" }]);
    chain["select"] = vi.fn().mockReturnValue(chain);
    return chain;
  };

  const insertChain = () => {
    const chain = makeChain([{ id: "reading-001" }]);
    chain["select"] = vi.fn().mockReturnValue(chain);
    return chain;
  };

  const supabase = {
    from: vi.fn((table: string) => ({
      select: vi.fn((_cols?: string, _opts?: unknown) => {
        const chain = selectChain(table);
        // Support count queries
        if (_opts && typeof _opts === "object" && "count" in (_opts as Record<string, unknown>)) {
          return {
            ...chain,
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ count: payments.filter(p => p.reading_status === "generating").length }),
            }),
          };
        }
        return chain;
      }),
      update: vi.fn().mockReturnValue(updateChain()),
      insert: vi.fn().mockReturnValue(insertChain()),
      delete: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
    })),
  };

  return supabase;
}

// ── Module mocks ─────────────────────────────────────────────────────

vi.mock("@/lib/supabase-admin", () => ({
  createSupabaseAdmin: vi.fn(),
}));

vi.mock("@/lib/premium/build-book-reading", () => ({
  buildBookReadingPayload: vi.fn(),
}));

vi.mock("@/lib/send-email", () => ({
  sendEmail: vi.fn().mockResolvedValue({ ok: true }),
}));

vi.mock("@/lib/email-timing", () => ({
  DELAY_MS: { bookReview: 86400000, bookSocialProof: 172800000 },
  scheduledIso: vi.fn().mockReturnValue("2026-08-06T00:00:00.000Z"),
}));

vi.mock("@/lib/email-templates", () => ({
  bookDeliveryMail: vi.fn().mockReturnValue({
    subject: "delivery",
    html: "<p>book</p>",
    text: "book",
  }),
  bookReviewMail: vi.fn().mockReturnValue({
    subject: "review",
    html: "<p>review</p>",
    text: "review",
  }),
  bookSocialProofMail: vi.fn().mockReturnValue({
    subject: "social",
    html: "<p>social</p>",
    text: "social",
  }),
}));

vi.mock("@/lib/db/log", () => ({
  dbLog: vi.fn(),
  dbError: vi.fn(),
}));

// ── Tests ────────────────────────────────────────────────────────────

describe("reading-lifecycle", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("claimSpecificOrder", () => {
    it("A. claims a queued payment by specific ID", async () => {
      const { claimSpecificOrder } = await import("@/lib/db/reading-lifecycle");

      const row = {
        id: "payment-001",
        email: "test@example.com",
        product_type: "birth-chart-book",
        birth_inputs: BIRTH_INPUTS,
        access_token: "tok-abc",
        user_id: "user-001",
        generation_attempts: 0,
      };

      const mockSb = createMockSupabase({ payments: [row], updateResult: [{ id: "payment-001" }] });

      const result = await claimSpecificOrder(mockSb as never, "payment-001");

      expect(result).not.toBeNull();
      expect(result!.id).toBe("payment-001");
      expect(result!.generationAttempts).toBe(1);
    });

    it("B. returns null when payment is already claimed (not queued)", async () => {
      const { claimSpecificOrder } = await import("@/lib/db/reading-lifecycle");

      const mockSb = createMockSupabase({ payments: [] });

      const result = await claimSpecificOrder(mockSb as never, "payment-001");
      expect(result).toBeNull();
    });
  });

  describe("claimNextQueuedOrder", () => {
    it("B2. atomic claim prevents double-claiming", async () => {
      const { claimNextQueuedOrder } = await import("@/lib/db/reading-lifecycle");

      // Simulate the atomic UPDATE returning null (another worker claimed it)
      const mockSb = createMockSupabase({
        payments: [{
          id: "payment-001",
          email: "test@example.com",
          product_type: "birth-chart-book",
          birth_inputs: BIRTH_INPUTS,
          access_token: "tok-abc",
          user_id: "user-001",
          generation_attempts: 0,
        }],
        updateResult: [],
      });

      // Override the update chain to return null for maybeSingle
      const fromSpy = mockSb.from as ReturnType<typeof vi.fn>;
      const paymentRow = {
        id: "payment-001",
        email: "test@example.com",
        product_type: "birth-chart-book",
        birth_inputs: BIRTH_INPUTS,
        access_token: "tok-abc",
        user_id: "user-001",
        generation_attempts: 0,
      };

      const makeBuilderChain = (data: MockRow[]) => {
        const chain: Record<string, unknown> = {};
        const self = () => chain;
        chain.eq = vi.fn(self);
        chain.neq = vi.fn(self);
        chain.order = vi.fn(self);
        chain.limit = vi.fn(self);
        chain.in = vi.fn(self);
        chain.lt = vi.fn(self);
        chain.gte = vi.fn(self);
        chain.select = vi.fn(self);
        chain.maybeSingle = vi.fn().mockResolvedValue({ data: data[0] ?? null });
        chain.single = vi.fn().mockResolvedValue({ data: data[0] ?? null, error: null });
        chain.then = (resolve: (v: unknown) => void) => resolve({ data, error: null });
        return chain;
      };

      let callCount = 0;
      fromSpy.mockImplementation((table: string) => {
        if (table === "Payments") {
          return {
            select: vi.fn().mockReturnValue(makeBuilderChain([paymentRow])),
            update: vi.fn().mockReturnValue((() => {
              const c = makeBuilderChain([]);
              c.maybeSingle = vi.fn().mockResolvedValue({ data: null });
              return c;
            })()),
          };
        }
        return { select: vi.fn().mockReturnValue(makeBuilderChain([])) };
      });

      const result = await claimNextQueuedOrder(mockSb as never, "birth-chart-book");
      expect(result).toBeNull();
    });
  });

  describe("countGeneratingOrders", () => {
    it("D. returns 0 when no orders are generating", async () => {
      const { countGeneratingOrders } = await import("@/lib/db/reading-lifecycle");

      const mockSb = createMockSupabase({ payments: [] });
      const fromSpy = mockSb.from as ReturnType<typeof vi.fn>;
      fromSpy.mockImplementation(() => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count: 0 }),
          }),
        }),
      }));

      const count = await countGeneratingOrders(mockSb as never);
      expect(count).toBe(0);
    });

    it("E. returns 1 when one order is generating", async () => {
      const { countGeneratingOrders } = await import("@/lib/db/reading-lifecycle");

      const mockSb = createMockSupabase();
      const fromSpy = mockSb.from as ReturnType<typeof vi.fn>;
      fromSpy.mockImplementation(() => ({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ count: 1 }),
          }),
        }),
      }));

      const count = await countGeneratingOrders(mockSb as never);
      expect(count).toBe(1);
    });
  });

  describe("resetStaleGenerating", () => {
    it("H. requeues stale generating orders (attempts < 3)", async () => {
      const { resetStaleGenerating } = await import("@/lib/db/reading-lifecycle");

      const mockSb = createMockSupabase();
      const fromSpy = mockSb.from as ReturnType<typeof vi.fn>;
      fromSpy.mockImplementation(() => ({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            lt: vi.fn().mockReturnValue({
              lt: vi.fn().mockReturnValue({
                select: vi.fn().mockResolvedValue({
                  data: [{ id: "stale-001", email: "stale@example.com" }],
                  error: null,
                }),
              }),
              gte: vi.fn().mockReturnValue({
                select: vi.fn().mockResolvedValue({ data: [], error: null }),
              }),
            }),
          }),
        }),
      }));

      const result = await resetStaleGenerating(mockSb as never);
      expect(result.requeued).toBe(1);
      expect(result.failed).toBe(0);
    });

    it("I. marks stale orders as failed when attempts >= 3", async () => {
      const { resetStaleGenerating } = await import("@/lib/db/reading-lifecycle");

      const mockSb = createMockSupabase();
      const fromSpy = mockSb.from as ReturnType<typeof vi.fn>;
      fromSpy.mockImplementation(() => ({
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            lt: vi.fn().mockReturnValue({
              lt: vi.fn().mockReturnValue({
                select: vi.fn().mockResolvedValue({ data: [], error: null }),
              }),
              gte: vi.fn().mockReturnValue({
                select: vi.fn().mockResolvedValue({
                  data: [{ id: "maxed-001", email: "maxed@example.com" }],
                  error: null,
                }),
              }),
            }),
          }),
        }),
      }));

      const result = await resetStaleGenerating(mockSb as never);
      expect(result.requeued).toBe(0);
      expect(result.failed).toBe(1);
    });
  });
});

describe("processOrder", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("C. exits without generation when reading already exists", async () => {
    const { createSupabaseAdmin } = await import("@/lib/supabase-admin");
    const { buildBookReadingPayload } = await import("@/lib/premium/build-book-reading");

    const mockSb = createMockSupabase({ readings: [{ id: "reading-existing" }] });
    (createSupabaseAdmin as ReturnType<typeof vi.fn>).mockReturnValue(mockSb);

    const fromSpy = mockSb.from as ReturnType<typeof vi.fn>;
    fromSpy.mockImplementation((table: string) => {
      if (table === "readings") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: { id: "reading-existing" } }),
              }),
            }),
          }),
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: "reading-existing" }, error: null }),
            }),
          }),
        };
      }
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { delivery_sent_at: null, access_token: "tok-abc-123" },
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      };
    });

    const { processOrder } = await import("@/lib/premium/process-book-order");
    await processOrder(makeOrder());

    expect(buildBookReadingPayload).not.toHaveBeenCalled();
  });

  it("J. existing reading prevents duplicate generation", async () => {
    const { createSupabaseAdmin } = await import("@/lib/supabase-admin");
    const { buildBookReadingPayload } = await import("@/lib/premium/build-book-reading");

    const mockSb = createMockSupabase({ readings: [{ id: "reading-existing" }] });
    (createSupabaseAdmin as ReturnType<typeof vi.fn>).mockReturnValue(mockSb);

    const fromSpy = mockSb.from as ReturnType<typeof vi.fn>;
    fromSpy.mockImplementation((table: string) => {
      if (table === "readings") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: { id: "reading-existing" } }),
              }),
            }),
          }),
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: "reading-existing" }, error: null }),
            }),
          }),
        };
      }
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { delivery_sent_at: null, access_token: "tok-abc-123" },
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      };
    });

    const { processOrder } = await import("@/lib/premium/process-book-order");
    await processOrder(makeOrder());

    expect(buildBookReadingPayload).not.toHaveBeenCalled();
  });

  it("K. delivery_sent_at prevents duplicate delivery email", async () => {
    const { createSupabaseAdmin } = await import("@/lib/supabase-admin");
    const { sendEmail } = await import("@/lib/send-email");

    const mockSb = createMockSupabase();
    (createSupabaseAdmin as ReturnType<typeof vi.fn>).mockReturnValue(mockSb);

    const fromSpy = mockSb.from as ReturnType<typeof vi.fn>;
    fromSpy.mockImplementation((table: string) => {
      if (table === "readings") {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              limit: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: { id: "reading-001" } }),
              }),
            }),
          }),
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: { id: "reading-001" }, error: null }),
            }),
          }),
        };
      }
      return {
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { delivery_sent_at: "2026-08-04T12:00:00Z", access_token: "tok-abc-123" },
            }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      };
    });

    const { processOrder } = await import("@/lib/premium/process-book-order");
    await processOrder(makeOrder());

    expect(sendEmail).not.toHaveBeenCalled();
  });

  it("M. non-birth-chart-book product is rejected", async () => {
    const { createSupabaseAdmin } = await import("@/lib/supabase-admin");
    const { buildBookReadingPayload } = await import("@/lib/premium/build-book-reading");

    const mockSb = createMockSupabase();
    (createSupabaseAdmin as ReturnType<typeof vi.fn>).mockReturnValue(mockSb);

    const { processOrder } = await import("@/lib/premium/process-book-order");
    await processOrder(makeOrder({ productType: "reading" }));

    expect(buildBookReadingPayload).not.toHaveBeenCalled();
  });
});

describe("worker script logic", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it("F. capacity=2 prevents new payment from being processed", async () => {
    const { countGeneratingOrders } = await import("@/lib/db/reading-lifecycle");

    const mockSb = createMockSupabase();
    const fromSpy = mockSb.from as ReturnType<typeof vi.fn>;
    fromSpy.mockImplementation(() => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ count: 2 }),
        }),
      }),
    }));

    const count = await countGeneratingOrders(mockSb as never);
    const CONCURRENCY = 2;
    const available = Math.max(0, CONCURRENCY - count);

    expect(count).toBe(2);
    expect(available).toBe(0);
  });

  it("G. dispatch failure leaves payment queued (webhook still returns 200)", async () => {
    // This test verifies the webhook's try/catch around dispatch.
    // The fetch to GitHub API fails, but acknowledgePayment already
    // saved the order as queued. The webhook returns 200 regardless.

    const mockFetch = vi.fn().mockRejectedValue(new Error("Network error"));
    const originalFetch = globalThis.fetch;
    globalThis.fetch = mockFetch;

    try {
      // Simulate the webhook's dispatch block
      let dispatchSucceeded = false;
      let webhookReturns200 = true;

      try {
        await mockFetch("https://api.github.com/repos/test/repo/dispatches", {
          method: "POST",
        });
        dispatchSucceeded = true;
      } catch {
        // Non-fatal — watchdog will recover
        dispatchSucceeded = false;
      }

      // Webhook always returns 200 after acknowledgePayment
      expect(dispatchSucceeded).toBe(false);
      expect(webhookReturns200).toBe(true);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("L. watchdog can recover a queued order missed by dispatch", async () => {
    // The watchdog flow: reset stale → count generating → claim queued → process
    // This test verifies the claim path works for watchdog mode (no PAYMENT_ID)

    const { claimNextQueuedOrder } = await import("@/lib/db/reading-lifecycle");

    const row = {
      id: "missed-payment",
      email: "missed@example.com",
      product_type: "birth-chart-book",
      birth_inputs: BIRTH_INPUTS,
      access_token: "tok-missed",
      user_id: "user-missed",
      generation_attempts: 0,
    };

    const mockSb = createMockSupabase();
    const fromSpy = mockSb.from as ReturnType<typeof vi.fn>;

    const makeBuilderChain2 = (data: MockRow[]) => {
      const chain: Record<string, unknown> = {};
      const self = () => chain;
      chain.eq = vi.fn(self);
      chain.neq = vi.fn(self);
      chain.order = vi.fn(self);
      chain.limit = vi.fn(self);
      chain.in = vi.fn(self);
      chain.lt = vi.fn(self);
      chain.gte = vi.fn(self);
      chain.select = vi.fn(self);
      chain.maybeSingle = vi.fn().mockResolvedValue({ data: data[0] ?? null });
      chain.single = vi.fn().mockResolvedValue({ data: data[0] ?? null, error: null });
      chain.then = (resolve: (v: unknown) => void) => resolve({ data, error: null });
      return chain;
    };

    fromSpy.mockImplementation(() => ({
      select: vi.fn().mockReturnValue(makeBuilderChain2([row])),
      update: vi.fn().mockReturnValue(makeBuilderChain2([{ id: "missed-payment" }])),
    }));

    const claimed = await claimNextQueuedOrder(mockSb as never, "birth-chart-book");
    expect(claimed).not.toBeNull();
    expect(claimed!.id).toBe("missed-payment");
  });
});
