-- Lead attribution: where each lead / checkout came from.
--
-- attribution  jsonb  { first: Touch, last: Touch } from the bc_attr cookie
--                     (lib/attribution.ts). Touch = source, medium, campaign,
--                     content, term, referrer, landing, at.
-- utm_source   text   last-touch source for quick grouping (first touch if
--                     the last visit was direct). Already exists on
--                     abandoned_checkouts; added to Payments.
-- lead_source  text   where the lead was captured: a free tool slug
--                     (big-three-calculator, natal-chart, ...) or the
--                     product type for checkout forms.
--
-- Nullable with no default, so existing rows are unaffected. The app retries
-- inserts without these columns if this migration has not been applied yet.

ALTER TABLE abandoned_checkouts
  ADD COLUMN IF NOT EXISTS lead_source TEXT,
  ADD COLUMN IF NOT EXISTS attribution JSONB;

ALTER TABLE "Payments"
  ADD COLUMN IF NOT EXISTS utm_source TEXT,
  ADD COLUMN IF NOT EXISTS lead_source TEXT,
  ADD COLUMN IF NOT EXISTS attribution JSONB;

CREATE INDEX IF NOT EXISTS idx_abandoned_checkouts_utm_source ON abandoned_checkouts (utm_source);
CREATE INDEX IF NOT EXISTS idx_abandoned_checkouts_lead_source ON abandoned_checkouts (lead_source);
CREATE INDEX IF NOT EXISTS idx_payments_utm_source ON "Payments" (utm_source);

-- Refresh PostgREST's schema cache so the API sees the new columns immediately.
NOTIFY pgrst, 'reload schema';
