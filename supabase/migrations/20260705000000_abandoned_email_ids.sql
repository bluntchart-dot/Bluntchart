-- Track Resend scheduled-email ids on the lead row so the gumroad webhook
-- can cancel the not-yet-sent abandoned-cart nudges the moment a lead pays.
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.

ALTER TABLE public.abandoned_checkouts
  ADD COLUMN IF NOT EXISTS preview_email_id text,
  ADD COLUMN IF NOT EXISTS abandoned_one_email_id text,
  ADD COLUMN IF NOT EXISTS abandoned_two_email_id text;

NOTIFY pgrst, 'reload schema';
