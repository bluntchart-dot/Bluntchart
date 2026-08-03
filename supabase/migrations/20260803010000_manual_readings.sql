-- Simplified manual fulfillment
--
-- Enables /internal/premium manual fulfillment to persist directly to
-- readings with its own access_token — no Payments row required. Manual
-- fulfillment is an internal delivery mechanism, not a payment flow.
--
-- All three columns are nullable and default NULL. Existing rows written
-- through the Gumroad path (which stores the access_token on Payments,
-- not on readings) are unaffected. No constraints on existing columns
-- are modified.
--
-- The partial unique index guarantees no duplicate access_tokens across
-- manual rows while allowing every Gumroad reading (access_token IS NULL
-- on readings) to coexist.
--
-- After this migration, the reader `loadReadingByAccessToken` uses two
-- paths, in order:
--   1. Existing Gumroad path: Payments → readings.payment_id
--   2. New manual path:       readings.access_token direct lookup

ALTER TABLE readings
  ADD COLUMN IF NOT EXISTS access_token TEXT DEFAULT NULL;

ALTER TABLE readings
  ADD COLUMN IF NOT EXISTS order_source TEXT DEFAULT NULL;

ALTER TABLE readings
  ADD COLUMN IF NOT EXISTS email TEXT DEFAULT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_readings_access_token_unique
  ON readings (access_token) WHERE access_token IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_readings_order_source
  ON readings (order_source);
