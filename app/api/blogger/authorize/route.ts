import { NextRequest, NextResponse } from "next/server";
import {
  BLOGGER_OAUTH_REDIRECT_URI,
  BLOGGER_OAUTH_SCOPE,
} from "@/lib/blog/blogger-oauth";

/**
 * GET /api/blogger/authorize?key=<BLOG_ADMIN_SECRET>
 *
 * One-time manual step to grant the "BluntChart Blogger Automation" OAuth
 * client write access to Blogger. Gated by BLOG_ADMIN_SECRET (a
 * site-owner-only secret, reused later for the /admin dashboard) so a
 * stray request can't trigger a real OAuth consent grant.
 *
 * The secret is passed through as `state` and re-checked in the callback —
 * this flow needs no session/database, since it's a single-admin, one-time
 * action.
 */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  const adminSecret = process.env.BLOG_ADMIN_SECRET;

  if (!adminSecret) {
    return NextResponse.json(
      { ok: false, error: "BLOG_ADMIN_SECRET is not configured" },
      { status: 500 }
    );
  }

  if (!key || key !== adminSecret) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 403 }
    );
  }

  const clientId = process.env.BLOGGER_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { ok: false, error: "BLOGGER_CLIENT_ID is not configured" },
      { status: 500 }
    );
  }

  // Temporary diagnostic mode for the "access_denied: unverified app" OAuth
  // issue — reveals only non-secret shape info about the client ID actually
  // loaded in this runtime, never the full client ID or secret. Remove once
  // the project/client mismatch is confirmed and OAuth succeeds.
  if (req.nextUrl.searchParams.get("diag") === "1") {
    return NextResponse.json({
      ok: true,
      clientIdExists: true,
      clientIdLength: clientId.length,
      clientIdLast20: clientId.slice(-20),
      endsWithGoogleUserContent: clientId.endsWith(
        ".apps.googleusercontent.com"
      ),
      // The leading numeric segment of a Google OAuth client ID is that
      // client's GCP *project number* — safe to reveal (it's already
      // visible in plaintext in the public authorize URL below), and it's
      // the fastest way to confirm this client belongs to the same GCP
      // project as the consent screen / test-user list you configured.
      // Compare this against the "Project number" shown in Cloud Console
      // for "Default Gemini Project" (gen-lang-client-0271974646).
      gcpProjectNumberPrefix: clientId.split("-")[0],
      redirectUri: BLOGGER_OAUTH_REDIRECT_URI,
      requestedScope: BLOGGER_OAUTH_SCOPE,
    });
  }

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", BLOGGER_OAUTH_REDIRECT_URI);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", BLOGGER_OAUTH_SCOPE);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "consent");
  authUrl.searchParams.set("state", adminSecret);

  return NextResponse.redirect(authUrl.toString());
}
