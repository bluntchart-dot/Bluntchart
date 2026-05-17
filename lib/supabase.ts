import { createClient } from "@supabase/supabase-js";

/**
 * Browser-safe anon client (limited by RLS).
 * Server routes should use createSupabaseAdmin() from lib/supabase-admin.ts.
 */
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);