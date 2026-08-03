-- Restore readings.payment_id to nullable, matching the original schema
-- declaration (initial_schema.sql:72) and the ON DELETE SET NULL
-- foreign-key semantics.
--
-- Background: production DB had a NOT NULL constraint on this column
-- that was NOT in the repo migrations (added out-of-band, likely via
-- the Supabase Table Editor). That NOT NULL made the FK's ON DELETE
-- SET NULL unreachable (any parent delete would fail with a NOT NULL
-- violation) and blocked the manual-fulfillment flow, which correctly
-- writes NULL payment_id for readings that were never paid for through
-- our checkout.
--
-- This statement is metadata-only: no data is rewritten, the FK is
-- unaffected, the readings_payment_id_idx index is unaffected, and
-- every existing Gumroad row's payment_id value is preserved.

ALTER TABLE readings
  ALTER COLUMN payment_id DROP NOT NULL;
