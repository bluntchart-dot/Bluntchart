-- Add focus_area (already used by app code, missing from tracked schema)
-- and preview_json (new: persists the exact free-preview content so the
-- paid page can reuse it verbatim instead of a re-generated one).
-- Run once in Supabase: SQL Editor -> New query -> paste -> Run.

ALTER TABLE public.abandoned_checkouts
  ADD COLUMN IF NOT EXISTS focus_area text,
  ADD COLUMN IF NOT EXISTS preview_json jsonb;

NOTIFY pgrst, 'reload schema';
