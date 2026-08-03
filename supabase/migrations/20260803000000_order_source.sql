-- Manual fulfillment tracking
--
-- Adds `order_source` column to Payments so we can distinguish where each
-- reading was fulfilled from. Extensible TEXT column — new channels are
-- added in application constants (lib/premium/order-sources.ts), no
-- schema change required.
--
-- Values used by the app today:
--   'gumroad'        — automatic, existing Gumroad webhook path
--   'personal-test'  — internal test/friend fulfillments via /internal/premium
--   'etsy'           — manual Etsy fulfillment via /internal/premium
--   'other'          — anything else via /internal/premium
--
-- Nullable, DEFAULT NULL to preserve backward compatibility with all
-- existing rows. Application code writes the appropriate value on each
-- new insert; the code also handles the case where this migration has
-- not yet been applied (falls back to omitting the column with a warning).

ALTER TABLE "Payments"
  ADD COLUMN IF NOT EXISTS order_source TEXT DEFAULT NULL;

CREATE INDEX IF NOT EXISTS idx_payments_order_source
  ON "Payments" (order_source);
