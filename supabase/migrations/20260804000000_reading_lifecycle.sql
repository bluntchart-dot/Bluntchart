-- Decouple payment acknowledgement from AI reading generation.
--
-- Previously the Gumroad webhook ran the full V1.2 generation pipeline
-- synchronously, causing Vercel function timeouts. This migration adds
-- the columns needed for the Payments table to act as a durable generation
-- queue: the webhook marks the payment paid and queues generation; a
-- separate cron worker claims queued orders and runs the AI pipeline.
--
-- reading_status lifecycle:
--   NULL        existing rows / products without generation
--   'queued'    payment confirmed, awaiting generation
--   'generating' worker claimed, AI pipeline running
--   'completed' reading persisted in readings.reading_json
--   'failed'    generation failed after max attempts
--
-- birth_inputs: JSONB snapshot of the exact birth details at payment time.
-- Decouples generation from the mutable abandoned_checkouts table.

ALTER TABLE "Payments"
  ADD COLUMN IF NOT EXISTS reading_status TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS birth_inputs JSONB DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS generation_started_at TIMESTAMPTZ DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS generation_attempts INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS generation_error TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS delivery_sent_at TIMESTAMPTZ DEFAULT NULL;

-- Worker picks up the oldest queued order. Partial index keeps the scan
-- over only the handful of rows that are actually waiting.
CREATE INDEX IF NOT EXISTS idx_payments_reading_queue
  ON "Payments" (created_at ASC)
  WHERE reading_status = 'queued';

-- Admin / monitoring queries filter by reading_status.
CREATE INDEX IF NOT EXISTS idx_payments_reading_status
  ON "Payments" (reading_status)
  WHERE reading_status IS NOT NULL;

-- Stale-detection query: generating + old started_at.
CREATE INDEX IF NOT EXISTS idx_payments_reading_generating
  ON "Payments" (generation_started_at ASC)
  WHERE reading_status = 'generating';

NOTIFY pgrst, 'reload schema';
