/** Map Supabase/PostgREST errors to safe user-facing messages. */
export function formatDbError(message: string | undefined | null): string {
  const msg = (message ?? "").trim();
  if (!msg) {
    return "Something went wrong saving your details. Please try again.";
  }

  if (
    /could not find the table/i.test(msg) ||
    /relation .* does not exist/i.test(msg) ||
    /schema cache/i.test(msg)
  ) {
    return "Checkout database is not set up yet. Run supabase/migrations/20250517000000_initial_schema.sql in your Supabase SQL editor, then try again.";
  }

  if (/permission denied|row-level security|RLS/i.test(msg)) {
    return "Server cannot write to the database. Set SUPABASE_SERVICE_ROLE_KEY in your deployment environment.";
  }

  if (/duplicate key|unique constraint/i.test(msg)) {
    return "We already have a checkout in progress for this email. Refresh and try again.";
  }

  return msg;
}

export function isMissingTableError(message: string | undefined | null): boolean {
  const msg = message ?? "";
  return (
    /could not find the table/i.test(msg) ||
    /relation .* does not exist/i.test(msg) ||
    /schema cache/i.test(msg)
  );
}
