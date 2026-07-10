-- Adds a source column to distinguish Gemini-discovered topics from
-- topics injected manually by the admin via the Blog Control dashboard.
--
-- Manual topics still enter the SAME existing pipeline (topic → brief →
-- article → QA → image → Blogger). Queue priority is expressed via the
-- existing opportunity_score column (manual topics are seeded at 1000,
-- which is guaranteed above Gemini's clamped 1-100 range), so no route
-- ordering logic needs to change.
--
-- Additive only: existing rows default to 'gemini', which matches reality.

ALTER TABLE blog_posts
  ADD COLUMN source text NOT NULL DEFAULT 'gemini'
    CHECK (source IN ('gemini', 'manual'));

NOTIFY pgrst, 'reload schema';
