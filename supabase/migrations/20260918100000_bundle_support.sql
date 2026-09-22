-- Allow multiple products per Etsy receipt (for bundles).
-- Old: UNIQUE on (etsy_receipt_id) alone
-- New: UNIQUE on (etsy_receipt_id, product)

DROP INDEX IF EXISTS idx_etsy_orders_receipt_id;

CREATE UNIQUE INDEX idx_etsy_orders_receipt_product
  ON public.etsy_orders (etsy_receipt_id, product);

-- Track which bundle an order belongs to (null for single products)
ALTER TABLE public.etsy_orders
  ADD COLUMN IF NOT EXISTS bundle_id text DEFAULT NULL;

NOTIFY pgrst, 'reload schema';
