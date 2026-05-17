-- BluntChart — schema notes (run in Supabase SQL editor if needed)
-- Your tables: users, payments, readings, abandoned_checkouts

-- 1) users.id and payments.id and readings.id should be PRIMARY KEY (uuid default gen_random_uuid())

-- 2) Recommended: unique index on users.email for faster lookups (not a FK target)
-- CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON public.users (email);

-- 3) readings.user_id should reference users(id), NOT payments(user_id)
-- If you have a bad FK, drop it:
-- ALTER TABLE public.readings DROP CONSTRAINT IF EXISTS readings_user_id_fkey;
-- ALTER TABLE public.readings
--   ADD CONSTRAINT readings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

-- 4) readings.payment_id → payments(id)
-- ALTER TABLE public.readings
--   ADD CONSTRAINT readings_payment_id_fkey FOREIGN KEY (payment_id) REFERENCES public.payments(id);

-- 5) payments.user_id → users(id)
-- ALTER TABLE public.payments
--   ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

-- 6) abandoned_checkouts.user_id → users(id) (optional)
-- ALTER TABLE public.abandoned_checkouts
--   ADD CONSTRAINT abandoned_checkouts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);

-- 7) Enable RLS but add policies OR use SUPABASE_SERVICE_ROLE_KEY in API routes (recommended for server writes)

-- 8) Drop legacy table if it still exists
-- DROP TABLE IF EXISTS public.pending_readings;

-- 9) Optional: index for access links
-- CREATE UNIQUE INDEX IF NOT EXISTS payments_access_token_unique ON public.payments (access_token) WHERE access_token IS NOT NULL;
-- CREATE INDEX IF NOT EXISTS payments_session_id_idx ON public.payments (session_id);
-- CREATE INDEX IF NOT EXISTS abandoned_checkouts_email_idx ON public.abandoned_checkouts (email);
