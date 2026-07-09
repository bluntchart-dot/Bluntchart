import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/blog/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { createOrGetTodayRun, updateRunStatus } from "@/lib/blog/run-manager";
import { discoverTopics } from "@/lib/blog/topic-discovery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
  const authError = requireAdmin(req);
  if (authError) return authError;

  let body: { count?: number; dryRun?: boolean } = {};
  try {
    body = await req.json();
  } catch {
    // empty body — use defaults
  }

  const count = Math.min(Math.max(body.count ?? 4, 1), 12);
  const dryRun = body.dryRun ?? false;

  const supabase = createSupabaseAdmin();

  const runResult = await createOrGetTodayRun(supabase, dryRun);
  if (!runResult.ok || !runResult.run) {
    return NextResponse.json(
      { ok: false, error: runResult.error ?? "Failed to create run" },
      { status: 500 }
    );
  }

  const run = runResult.run;

  const discovery = await discoverTopics(supabase, run.id, { count, dryRun });

  if (discovery.ok) {
    await updateRunStatus(supabase, run.id, {
      topics_discovered: (run.topics_discovered ?? 0) + discovery.inserted,
      status: discovery.inserted > 0 ? "TOPICS_DISCOVERED" : run.status,
    });
  } else {
    // Preserve stage on Gemini quota exhaustion — no fallback, no paid switch.
    // Record the error code so the operator can see the run stopped safely.
    await updateRunStatus(supabase, run.id, {
      status: "ERROR",
      last_error: `${discovery.errorCode}: ${discovery.errorMessage}`,
    });
  }

  const status = discovery.ok ? 200 : 502;
  return NextResponse.json(
    {
      ok: discovery.ok,
      dryRun: discovery.dryRun,
      runId: run.id,
      inserted: discovery.inserted,
      skippedDuplicates: discovery.skippedDuplicates,
      topics: discovery.topics,
      ...(discovery.errorCode
        ? { errorCode: discovery.errorCode, errorMessage: discovery.errorMessage }
        : {}),
    },
    { status }
  );
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ok: false,
        errorCode: "ROUTE_UNHANDLED_EXCEPTION",
        errorMessage: msg.slice(0, 500),
      },
      { status: 500 }
    );
  }
}
