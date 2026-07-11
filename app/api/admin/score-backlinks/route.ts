import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/blog/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import {
  extractDomain,
  isCompetitorProspect,
  scoreBacklinkProspect,
} from "@/lib/blog/backlink-scorer";
import { ERROR_CODES } from "@/lib/blog/config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const TABLE = "backlink_prospects";
const MAX_INPUTS = 10;

interface InputProspect {
  url?: string;
  context?: string;
}

export async function POST(req: NextRequest) {
  try {
    const authError = requireAdmin(req);
    if (authError) return authError;

    let body: { prospects?: InputProspect[]; dryRun?: boolean } = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        {
          ok: false,
          errorCode: "INVALID_BODY",
          errorMessage: "Body must be JSON with a `prospects` array.",
        },
        { status: 400 }
      );
    }

    const raw = Array.isArray(body.prospects) ? body.prospects : [];
    if (raw.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          errorCode: "MISSING_PROSPECTS",
          errorMessage: "At least one prospect is required.",
        },
        { status: 400 }
      );
    }
    const dryRun = body.dryRun ?? false;

    // Normalize + dedupe by URL
    const prospects: { url: string; context: string; domain: string }[] = [];
    const seenUrls = new Set<string>();
    for (const p of raw.slice(0, MAX_INPUTS)) {
      const url = (p.url ?? "").trim();
      if (!url) continue;
      const domain = extractDomain(url);
      if (!domain) continue;
      if (seenUrls.has(url)) continue;
      seenUrls.add(url);
      prospects.push({
        url,
        context: (p.context ?? "").trim().slice(0, 500),
        domain,
      });
    }

    if (prospects.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          errorCode: "NO_VALID_URLS",
          errorMessage: "None of the submitted URLs parsed.",
        },
        { status: 400 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Fetch existing rows so we can UPDATE-in-place instead of erroring
    // on the UNIQUE(url) constraint.
    const { data: existingRows } = await supabase
      .from(TABLE)
      .select("id, url, status")
      .in("url", prospects.map((p) => p.url));
    const existingByUrl = new Map<string, { id: string; status: string }>();
    for (const r of existingRows ?? []) {
      existingByUrl.set(r.url as string, {
        id: r.id as string,
        status: r.status as string,
      });
    }

    const results: Array<Record<string, unknown>> = [];
    let quotaHit = false;

    for (const p of prospects) {
      if (quotaHit) break;

      const existing = existingByUrl.get(p.url);
      const nowIso = new Date().toISOString();

      if (isCompetitorProspect({ url: p.url, submitted_context: p.context })) {
        results.push({
          url: p.url,
          skipped: true,
          reason: "competitor_domain",
        });
        if (!dryRun && !existing) {
          await supabase.from(TABLE).insert({
            url: p.url,
            domain: p.domain,
            submitted_context: p.context || null,
            status: "rejected",
            scoring_notes: "auto-rejected: competitor domain / context",
            updated_at: nowIso,
          });
        }
        continue;
      }

      const scored = await scoreBacklinkProspect({
        url: p.url,
        submitted_context: p.context,
      });

      if (!scored.ok || !scored.score) {
        results.push({
          url: p.url,
          ok: false,
          errorCode: scored.errorCode,
          errorMessage: scored.errorMessage,
        });
        if (scored.errorCode === ERROR_CODES.GEMINI_QUOTA_EXHAUSTED) {
          quotaHit = true;
        }
        if (!dryRun) {
          const payload = {
            url: p.url,
            domain: p.domain,
            submitted_context: p.context || null,
            last_error_code: scored.errorCode ?? "SCORING_FAILED",
            last_error_message: (scored.errorMessage ?? "").slice(0, 500),
            updated_at: nowIso,
          };
          if (existing) {
            await supabase.from(TABLE).update(payload).eq("id", existing.id);
          } else {
            await supabase.from(TABLE).insert({ ...payload, status: "new" });
          }
        }
        continue;
      }

      const s = scored.score;

      if (dryRun) {
        results.push({
          url: p.url,
          ok: true,
          dryRun: true,
          domain: p.domain,
          ...s,
        });
        continue;
      }

      const payload = {
        url: p.url,
        domain: p.domain,
        submitted_context: p.context || null,
        relevance_score: s.relevance_score,
        domain_authority_estimate: s.domain_authority_estimate,
        outreach_worthiness: s.outreach_worthiness,
        suggested_angle: s.suggested_angle,
        scoring_notes: s.scoring_notes,
        scoring_model: "gemini-3.1-flash-lite",
        status: "scored",
        scored_at: nowIso,
        updated_at: nowIso,
        last_error_code: null,
        last_error_message: null,
      };

      if (existing) {
        const { error: upErr } = await supabase
          .from(TABLE)
          .update(payload)
          .eq("id", existing.id);
        if (upErr) {
          results.push({
            url: p.url,
            ok: false,
            errorCode: "DB_UPDATE_FAILED",
            errorMessage: upErr.message,
          });
          continue;
        }
        results.push({ url: p.url, ok: true, updated: true, ...s });
      } else {
        const { error: insErr } = await supabase
          .from(TABLE)
          .insert(payload);
        if (insErr) {
          results.push({
            url: p.url,
            ok: false,
            errorCode: "DB_INSERT_FAILED",
            errorMessage: insErr.message,
          });
          continue;
        }
        results.push({ url: p.url, ok: true, inserted: true, ...s });
      }
    }

    const anyOk = results.some((r) => r.ok);
    return NextResponse.json(
      {
        ok: anyOk,
        dryRun,
        processed: results.length,
        quotaExhausted: quotaHit,
        results,
      },
      { status: anyOk ? 200 : 502 }
    );
  } catch (err) {
    console.error(
      "[score-backlinks] unhandled:",
      err instanceof Error ? err.stack ?? err.message : err
    );
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
