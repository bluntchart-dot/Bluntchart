import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client (API routes, webhooks).
 * Prefer SUPABASE_SERVICE_ROLE_KEY so inserts are not blocked by RLS.
 * Falls back to the anon key only if service role is missing (logged as a warning).
 */
export function createSupabaseAdmin(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url) {
    throw new Error(
      "[supabase-admin] Missing NEXT_PUBLIC_SUPABASE_URL in environment"
    );
  }

  const key = serviceKey || anonKey;
  if (!key) {
    throw new Error(
      "[supabase-admin] Missing SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  if (!serviceKey) {
    const msg =
      "[supabase-admin] SUPABASE_SERVICE_ROLE_KEY not set — using anon key. Writes may fail if RLS is enabled.";
    if (process.env.NODE_ENV === "production") {
      console.error(msg);
    } else {
      console.warn(msg);
    }
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
