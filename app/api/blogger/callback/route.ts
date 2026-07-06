import { NextRequest, NextResponse } from "next/server";
import {
  BLOGGER_BLOG_URL,
  BLOGGER_OAUTH_REDIRECT_URI,
} from "@/lib/blog/blogger-oauth";

interface GoogleTokenResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
}

interface BloggerBlogResponse {
  id?: string;
  error?: { message?: string };
}

/**
 * GET /api/blogger/callback
 *
 * Exchanges the OAuth `code` for tokens, resolves the Blogger blog ID for
 * blog.bluntchart.com, and displays the refresh token + blog ID ONCE for
 * manual copy into env vars.
 *
 * Nothing here is logged or persisted to Supabase — this route is
 * stateless by design, per the requirement that the refresh token must
 * never be logged or stored anywhere but the environment.
 */
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const oauthError = req.nextUrl.searchParams.get("error");

  if (oauthError) {
    return htmlResponse(
      `<h1>Blogger authorization failed</h1><p>Google returned: ${escapeHtml(
        oauthError
      )}</p>`,
      400
    );
  }

  const adminSecret = process.env.BLOG_ADMIN_SECRET;

  if (!adminSecret || !state || state !== adminSecret) {
    return htmlResponse(
      `<h1>Unauthorized</h1><p>Missing or invalid state.</p>`,
      403
    );
  }

  if (!code) {
    return htmlResponse(`<h1>Missing authorization code</h1>`, 400);
  }

  const clientId = process.env.BLOGGER_CLIENT_ID;
  const clientSecret = process.env.BLOGGER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return htmlResponse(
      `<h1>Server misconfigured</h1><p>BLOGGER_CLIENT_ID / BLOGGER_CLIENT_SECRET missing.</p>`,
      500
    );
  }

  let tokenJson: GoogleTokenResponse;

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: BLOGGER_OAUTH_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    });

    tokenJson = (await tokenRes.json()) as GoogleTokenResponse;

    if (!tokenRes.ok) {
      console.error(
        "[blogger/callback] token exchange failed:",
        tokenJson.error
      );
      return htmlResponse(
        `<h1>Token exchange failed</h1><p>${escapeHtml(
          tokenJson.error_description ?? tokenJson.error ?? "unknown error"
        )}</p>`,
        502
      );
    }
  } catch (err) {
    console.error(
      "[blogger/callback] token exchange request failed:",
      (err as Error).message
    );
    return htmlResponse(`<h1>Token exchange request failed</h1>`, 502);
  }

  const refreshToken = tokenJson.refresh_token;
  const accessToken = tokenJson.access_token;

  if (!refreshToken) {
    return htmlResponse(
      `<h1>No refresh token returned</h1>
       <p>Google only issues a refresh token on the first consent grant (or when
       <code>prompt=consent</code> forces re-consent).</p>
       <p>Revoke "BluntChart Blogger Automation" access at
       <a href="https://myaccount.google.com/permissions">myaccount.google.com/permissions</a>
       and try again.</p>`,
      400
    );
  }

  if (!accessToken) {
    return htmlResponse(`<h1>No access token returned</h1>`, 502);
  }

  let blogId: string | null = null;
  let blogLookupError: string | null = null;

  try {
    const blogRes = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/byurl?url=${encodeURIComponent(
        BLOGGER_BLOG_URL
      )}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      }
    );
    const blogJson = (await blogRes.json()) as BloggerBlogResponse;

    if (!blogRes.ok) {
      blogLookupError = blogJson.error?.message ?? `HTTP ${blogRes.status}`;
    } else {
      blogId = blogJson.id ?? null;
    }
  } catch (err) {
    blogLookupError = (err as Error).message;
  }

  return htmlResponse(`
    <h1>Blogger authorization complete</h1>
    <p><strong>Copy these into your environment variables now &mdash; this page will not show them again:</strong></p>
    <p>BLOGGER_REFRESH_TOKEN=<code>${escapeHtml(refreshToken)}</code></p>
    ${
      blogId
        ? `<p>BLOGGER_BLOG_ID=<code>${escapeHtml(blogId)}</code></p>`
        : `<p style="color:#b00020"><strong>Could not resolve BLOGGER_BLOG_ID automatically:</strong> ${escapeHtml(
            blogLookupError ?? "unknown error"
          )}. Find it manually in the Blogger dashboard for ${escapeHtml(
            BLOGGER_BLOG_URL
          )}, or retry once BLOGGER_REFRESH_TOKEN is set and this route can use the refresh token instead.</p>`
    }
    <p>Save both to <code>.env.local</code> and your Vercel project's environment variables, then close this tab.</p>
  `);
}

function htmlResponse(body: string, status = 200) {
  return new NextResponse(
    `<!doctype html><html><body style="font-family: system-ui, sans-serif; max-width: 640px; margin: 40px auto; line-height: 1.6;">${body}</body></html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
