-- Dedicated table for Etsy orders — fully decoupled from the Payments table.
--
-- Contains all Etsy-specific data: receipt IDs, buyer info, personalization,
-- delivery URL + access token, and the generated reading.
--
-- DB-level idempotency via UNIQUE constraint on etsy_receipt_id.

CREATE TABLE IF NOT EXISTS public.etsy_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Etsy identifiers
  etsy_receipt_id bigint NOT NULL,
  buyer_email text,
  buyer_user_id bigint,
  listing_id bigint,

  -- Product
  product text NOT NULL,
  amount_cents integer NOT NULL DEFAULT 0,

  -- Status lifecycle: awaiting_info → queued → generating → complete | error
  status text NOT NULL DEFAULT 'awaiting_info',

  -- Buyer-provided personalization
  raw_personalization jsonb NOT NULL DEFAULT '{}',
  birth_data jsonb DEFAULT NULL,
  question text DEFAULT NULL,

  -- Delivery
  access_token uuid NOT NULL DEFAULT gen_random_uuid(),
  delivery_url text DEFAULT NULL,

  -- Generation
  reading_json jsonb DEFAULT NULL,
  reading_id uuid REFERENCES public.readings (id) ON DELETE SET NULL,
  generation_attempts integer NOT NULL DEFAULT 0,
  generation_error text DEFAULT NULL,

  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Idempotency: one row per Etsy receipt
CREATE UNIQUE INDEX IF NOT EXISTS idx_etsy_orders_receipt_id
  ON public.etsy_orders (etsy_receipt_id);

-- Queue processing: oldest queued order first
CREATE INDEX IF NOT EXISTS idx_etsy_orders_queue
  ON public.etsy_orders (created_at ASC)
  WHERE status = 'queued';

-- Access token lookup for reading delivery
CREATE UNIQUE INDEX IF NOT EXISTS idx_etsy_orders_access_token
  ON public.etsy_orders (access_token);

-- Status monitoring
CREATE INDEX IF NOT EXISTS idx_etsy_orders_status
  ON public.etsy_orders (status);

-- Stale detection: generating orders older than threshold
CREATE INDEX IF NOT EXISTS idx_etsy_orders_generating
  ON public.etsy_orders (created_at ASC)
  WHERE status = 'generating';

ALTER TABLE public.etsy_orders ENABLE ROW LEVEL SECURITY;

-- Also create the etsy_state table for poll timestamp tracking
-- (referenced by etsy-poll but never formally migrated)
CREATE TABLE IF NOT EXISTS public.etsy_state (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.etsy_state ENABLE ROW LEVEL SECURITY;

NOTIFY pgrst, 'reload schema';
