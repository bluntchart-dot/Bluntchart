import type { SupabaseClient } from "@supabase/supabase-js";
import { dbError, dbLog } from "./log";
import type { UserRow } from "./types";

/**
 * Ensure a row in `users` for this email.
 * Uses select-then-insert (email is not required to be a FK target elsewhere).
 * If you add UNIQUE(email) on users, you can switch to upsert onConflict.
 */
export async function ensureUser(
  supabase: SupabaseClient,
  email: string,
  name: string
): Promise<{ user: UserRow | null; error: string | null }> {
  const normalizedEmail = email.trim().toLowerCase();

  const { data: existing, error: findError } = await supabase
    .from("users")
    .select("id, email, name, created_at")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (findError) {
    dbError("users", "lookup failed", findError, { email: normalizedEmail });
    return { user: null, error: findError.message };
  }

  if (existing) {
    const { data: updated, error: updateError } = await supabase
      .from("users")
      .update({ name: name.trim() })
      .eq("id", existing.id)
      .select("id, email, name, created_at")
      .single();

    if (updateError) {
      dbError("users", "update name failed", updateError, { id: existing.id });
      return { user: existing as UserRow, error: null };
    }

    dbLog("users", "existing user updated", { userId: existing.id });
    return { user: (updated ?? existing) as UserRow, error: null };
  }

  const { data: created, error: insertError } = await supabase
    .from("users")
    .insert([{ email: normalizedEmail, name: name.trim() }])
    .select("id, email, name, created_at")
    .single();

  if (insertError || !created) {
    dbError("users", "insert failed", insertError, { email: normalizedEmail });
    return { user: null, error: insertError?.message ?? "User insert failed" };
  }

  dbLog("users", "user created", { userId: created.id });
  return { user: created as UserRow, error: null };
}
