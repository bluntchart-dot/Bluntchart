-- BluntChart checkout + readings schema
-- Run once in Supabase: SQL Editor → New query → paste → Run
-- Or: supabase db push (if using Supabase CLI linked to this project)

-- ── users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON public.users (lower(email));

-- ── payments ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid,
  email text,
  user_id uuid REFERENCES public.users (id) ON DELETE SET NULL,
  gumroad_payment_id text,
  amount text,
  payment_status text NOT NULL DEFAULT 'pending',
  payment_provider text,
  access_token uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS payments_session_id_unique
  ON public.payments (session_id)
  WHERE session_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS payments_access_token_unique
  ON public.payments (access_token)
  WHERE access_token IS NOT NULL;

CREATE INDEX IF NOT EXISTS payments_email_status_idx
  ON public.payments (lower(email), payment_status);

-- ── abandoned_checkouts ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.abandoned_checkouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  name text,
  dob text,
  birth_time text,
  birth_place text,
  timezone text,
  step_reached text,
  utm_source text,
  user_id uuid REFERENCES public.users (id) ON DELETE SET NULL,
  abandoned_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS abandoned_checkouts_email_idx
  ON public.abandoned_checkouts (lower(email));

CREATE INDEX IF NOT EXISTS abandoned_checkouts_created_at_idx
  ON public.abandoned_checkouts (created_at DESC);

-- ── readings ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users (id) ON DELETE SET NULL,
  payment_id uuid REFERENCES public.payments (id) ON DELETE SET NULL,
  birth_time text,
  birth_place text,
  timezone text,
  reading_json jsonb,
  reading_status text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS readings_payment_id_idx
  ON public.readings (payment_id);

-- ── RLS (API uses service role; blocks direct anon access) ────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.abandoned_checkouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.readings ENABLE ROW LEVEL SECURITY;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
