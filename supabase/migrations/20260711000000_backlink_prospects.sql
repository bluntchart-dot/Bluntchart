-- Backlink outreach prospect table.
--
-- Populated by admin (URL + freeform context notes), scored by Gemini,
-- then triaged by the operator. Completely separate from the article
-- pipeline — no foreign key to blog_posts or blog_runs.

CREATE TABLE backlink_prospects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Input
  url text NOT NULL UNIQUE,
  domain text NOT NULL,
  submitted_context text,   -- freeform admin notes

  -- Gemini scoring output
  relevance_score integer,           -- 1-10
  domain_authority_estimate integer, -- 1-10, model-estimated
  outreach_worthiness integer,       -- 1-10 composite
  suggested_angle text,              -- one-line pitch angle
  scoring_notes text,
  scoring_model text,

  -- Status
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'scored', 'contacted', 'rejected', 'landed')),
  last_error_code text,
  last_error_message text,

  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  scored_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE backlink_prospects ENABLE ROW LEVEL SECURITY;

CREATE INDEX backlink_prospects_status_idx ON backlink_prospects(status);
CREATE INDEX backlink_prospects_domain_idx ON backlink_prospects(domain);
CREATE INDEX backlink_prospects_score_idx
  ON backlink_prospects(outreach_worthiness DESC NULLS LAST);

NOTIFY pgrst, 'reload schema';
