/**
 * lib/premium/order-sources.ts
 *
 * Where an order/reading originated. Metadata only — never affects
 * generation, prompts, or the reading itself. Stored in Payments.order_source.
 *
 * Adding a new channel = one line in ORDER_SOURCES + one line in
 * INTERNAL_SELECTABLE_SOURCES (if it should appear in the admin dropdown).
 * No DB migration required.
 */

export type OrderSource =
  | "gumroad"        // automatic — set by the Gumroad webhook
  | "personal-test"  // internal test/friend fulfillment via /internal/premium
  | "etsy"           // manual Etsy fulfillment via /internal/premium
  | "website"        // manual website fulfillment via /internal/premium
  | "other";         // manual fallback via /internal/premium

export const ORDER_SOURCES: readonly OrderSource[] = [
  "gumroad",
  "etsy",
  "website",
  "personal-test",
  "other",
];

/**
 * The subset the internal admin UI offers. Customers never see this
 * dropdown — Gumroad is set programmatically only. Etsy first since
 * it's the primary manual-fulfillment use case.
 */
export const INTERNAL_SELECTABLE_SOURCES: readonly OrderSource[] = [
  "etsy",
  "website",
  "personal-test",
  "other",
];

/**
 * Human-readable label used in the internal admin dropdown.
 */
export const ORDER_SOURCE_LABEL: Record<OrderSource, string> = {
  "gumroad": "Gumroad (automatic)",
  "etsy": "Etsy",
  "website": "Website",
  "personal-test": "Personal / Test",
  "other": "Other",
};

export function isValidInternalSource(s: string | undefined): s is OrderSource {
  return !!s && (INTERNAL_SELECTABLE_SOURCES as readonly string[]).includes(s);
}
