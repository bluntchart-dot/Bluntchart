import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type SupabaseConfig = {
  url: string;
  serviceKey: string | undefined;
  anonKey: string | undefined;
  /** Key used for API calls (service role preferred). */
  apiKey: string;
  projectHost: string | null;
};

/** Normalized Supabase URL + keys (server-only). */
export function getSupabaseConfig(): SupabaseConfig {
  const rawUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const url = rawUrl.replace(/\/+$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const apiKey = serviceKey || anonKey || "";

  let projectHost: string | null = null;
  if (url) {
    try {
      projectHost = new URL(url).hostname;
    } catch {
      projectHost = null;
    }
  }

  return { url, serviceKey, anonKey, apiKey, projectHost };
}

/**
 * Server-only Supabase client (API routes, webhooks).
 * Prefer SUPABASE_SERVICE_ROLE_KEY so inserts are not blocked by RLS.
 * Falls back to the anon key only if service role is missing (logged as a warning).
 */
export function createSupabaseAdmin(): SupabaseClient {
  const { url, serviceKey, anonKey, apiKey: key } = getSupabaseConfig();

  if (!url) {
    throw new Error(
      "[supabase-admin] Missing NEXT_PUBLIC_SUPABASE_URL in environment"
    );
  }

  if (!/^https?:\/\//i.test(url)) {
    throw new Error(
      "[supabase-admin] NEXT_PUBLIC_SUPABASE_URL must be an absolute https URL"
    );
  }

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
