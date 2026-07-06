/**
 * Shared constants for the one-time Blogger OAuth setup flow
 * (app/api/blogger/authorize + app/api/blogger/callback).
 *
 * This is intentionally isolated from the core reading/payment pipeline —
 * it does not import or get imported by any existing lib/app file.
 */

/** Must exactly match the redirect URI registered on the Google OAuth client. */
export const BLOGGER_OAUTH_REDIRECT_URI =
  "https://bluntchart.com/api/blogger/callback";

/** Write/manage scope, as configured on the Google Auth Platform client. */
export const BLOGGER_OAUTH_SCOPE = "https://www.googleapis.com/auth/blogger";

/** The Blogger-hosted blog this automation publishes to. */
export const BLOGGER_BLOG_URL = "https://blog.bluntchart.com";
