import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/blog/admin-auth";
import { submitToIndexNow } from "@/lib/indexnow";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Manual IndexNow submission for a controlled list of bluntchart.com
 * URLs — call this after publishing, meaningfully updating, or
 * deleting a page. Not wired to deploys or the blog pipeline: see
 * lib/indexnow.ts for why.
 */
export async function POST(req: NextRequest) {
  const authError = requireAdmin(req);
  if (authError) return authError;

  let body: { urls?: string[] | string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "expected JSON body with a urls field" },
      { status: 400 }
    );
  }

  if (!body.urls || (Array.isArray(body.urls) && body.urls.length === 0)) {
    return NextResponse.json(
      { ok: false, error: "urls (string or non-empty string[]) is required" },
      { status: 400 }
    );
  }

  const result = await submitToIndexNow(body.urls);
  return NextResponse.json(result, { status: result.ok ? 200 : 502 });
}
