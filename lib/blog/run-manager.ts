import type { SupabaseClient } from "@supabase/supabase-js";
import { DB } from "../db/tables";
import type { BlogRunRow } from "./db-types";

export async function createOrGetTodayRun(
  supabase: SupabaseClient,
  dryRun = false
): Promise<{ ok: boolean; run?: BlogRunRow; error?: string }> {
  const today = new Date().toISOString().slice(0, 10);

  const { data: existing, error: selectError } = await supabase
    .from(DB.blogRuns)
    .select("*")
    .eq("run_date", today)
    .eq("dry_run", dryRun)
    .maybeSingle();

  if (selectError) return { ok: false, error: selectError.message };
  if (existing) return { ok: true, run: existing as BlogRunRow };

  // Race-safe: if a concurrent caller inserted the row after our SELECT,
  // ignoreDuplicates=true no-ops instead of clobbering status back to STARTED.
  // Relies on UNIQUE(run_date, dry_run) in migration 20260707000000_blog_automation.sql.
  const { error: upsertError } = await supabase
    .from(DB.blogRuns)
    .upsert(
      { run_date: today, dry_run: dryRun, status: "STARTED" },
      { onConflict: "run_date,dry_run", ignoreDuplicates: true }
    );

  if (upsertError) return { ok: false, error: upsertError.message };

  const { data, error: fetchError } = await supabase
    .from(DB.blogRuns)
    .select("*")
    .eq("run_date", today)
    .eq("dry_run", dryRun)
    .single();

  if (fetchError) return { ok: false, error: fetchError.message };
  return { ok: true, run: data as BlogRunRow };
}

export async function updateRunStatus(
  supabase: SupabaseClient,
  runId: string,
  updates: Partial<
    Pick<BlogRunRow, "status" | "topics_discovered" | "posts_published" | "last_error">
  >
): Promise<void> {
  await supabase
    .from(DB.blogRuns)
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", runId);
}
