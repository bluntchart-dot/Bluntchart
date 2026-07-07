-- Blog automation tables for the SEO/AEO content engine.
-- Completely isolated from the existing reading/payment schema.

CREATE TABLE blog_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_date date NOT NULL,
  dry_run boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'STARTED',
  topics_discovered integer DEFAULT 0,
  posts_published integer DEFAULT 0,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(run_date, dry_run)
);

ALTER TABLE blog_runs ENABLE ROW LEVEL SECURITY;

CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id uuid NOT NULL REFERENCES blog_runs(id),

  -- Discovery
  primary_keyword text NOT NULL,
  normalized_topic text NOT NULL,
  secondary_keywords text[],
  search_intent text,
  content_cluster text,
  target_product text,
  product_status text NOT NULL DEFAULT 'live',
  conversion_angle text,
  cta_destination text,
  opportunity_score integer,
  dedup_hash text NOT NULL UNIQUE,

  -- Brief
  content_brief jsonb,

  -- Article
  title text,
  slug text,
  article_html text,
  meta_description text,
  faq_data jsonb,
  generation_model text,

  -- QA
  qa_model text,
  qa_score jsonb,
  qa_feedback text,
  revision_count integer NOT NULL DEFAULT 0,

  -- Image
  image_prompt text,
  image_alt text,
  image_url text,

  -- Blogger
  blogger_post_id text,
  blogger_url text,
  scheduled_publish_at timestamptz,
  labels text[],

  -- Pipeline
  pipeline_stage text NOT NULL DEFAULT 'TOPIC_SELECTED',
  publishing_status text NOT NULL DEFAULT 'pending',
  last_error_code text,
  last_error_message text,

  -- CTA backfill
  cta_backfill_status text,
  cta_backfilled_at timestamptz,

  -- Timestamps
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE INDEX blog_posts_run_id_idx ON blog_posts(run_id);
CREATE INDEX blog_posts_pipeline_stage_idx ON blog_posts(pipeline_stage);
CREATE INDEX blog_posts_target_product_idx ON blog_posts(target_product);
CREATE INDEX blog_posts_publishing_status_idx ON blog_posts(publishing_status);
CREATE INDEX blog_posts_dedup_hash_idx ON blog_posts(dedup_hash);

NOTIFY pgrst, 'reload schema';
