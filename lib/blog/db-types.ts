import type { PipelineStage, ContentCluster, TargetProduct } from "./config";

export interface BlogRunRow {
  id: string;
  run_date: string;
  dry_run: boolean;
  status: string;
  topics_discovered: number;
  posts_published: number;
  last_error: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPostRow {
  id: string;
  run_id: string;
  source: "gemini" | "manual";

  primary_keyword: string;
  normalized_topic: string;
  secondary_keywords: string[] | null;
  search_intent: string | null;
  content_cluster: ContentCluster | null;
  target_product: TargetProduct | null;
  product_status: string;
  conversion_angle: string | null;
  cta_destination: string | null;
  opportunity_score: number | null;
  dedup_hash: string;

  content_brief: Record<string, unknown> | null;

  title: string | null;
  slug: string | null;
  article_html: string | null;
  meta_description: string | null;
  faq_data: Record<string, unknown>[] | null;
  generation_model: string | null;

  qa_model: string | null;
  qa_score: Record<string, unknown> | null;
  qa_feedback: string | null;
  revision_count: number;

  image_prompt: string | null;
  image_alt: string | null;
  image_url: string | null;

  blogger_post_id: string | null;
  blogger_url: string | null;
  scheduled_publish_at: string | null;
  labels: string[] | null;

  pipeline_stage: PipelineStage | string;
  publishing_status: string;
  last_error_code: string | null;
  last_error_message: string | null;

  cta_backfill_status: string | null;
  cta_backfilled_at: string | null;

  created_at: string;
  updated_at: string;
  published_at: string | null;
}
