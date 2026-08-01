-- Add product_type to Payments and readings so we can distinguish
-- which product generated each row (birth-chart reading vs birth-chart-book
-- vs future compatibility / transit products).
-- Default 'reading' preserves backward compatibility for all existing rows.

ALTER TABLE "Payments"
  ADD COLUMN IF NOT EXISTS product_type text NOT NULL DEFAULT 'reading';

ALTER TABLE readings
  ADD COLUMN IF NOT EXISTS product_type text NOT NULL DEFAULT 'reading';

ALTER TABLE abandoned_checkouts
  ADD COLUMN IF NOT EXISTS product_type text NOT NULL DEFAULT 'reading';

-- Coordinates from LocationPicker
ALTER TABLE abandoned_checkouts
  ADD COLUMN IF NOT EXISTS birth_lat double precision;

ALTER TABLE abandoned_checkouts
  ADD COLUMN IF NOT EXISTS birth_lng double precision;

-- 4th abandoned-cart email ID (book product uses 4 emails)
ALTER TABLE abandoned_checkouts
  ADD COLUMN IF NOT EXISTS abandoned_three_email_id text;

-- Index for filtering by product in admin / analytics queries
CREATE INDEX IF NOT EXISTS idx_payments_product_type ON "Payments" (product_type);
CREATE INDEX IF NOT EXISTS idx_readings_product_type ON readings (product_type);
