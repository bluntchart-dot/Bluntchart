/**
 * Supabase table names (must match the project schema exactly).
 * This project uses PascalCase for Users/Payments (Supabase dashboard default).
 */
export const DB = {
  users: "Users",
  payments: "Payments",
  abandonedCheckouts: "abandoned_checkouts",
  readings: "readings",
} as const;

/** Placeholder until Gumroad webhook provides the real sale id (unique per checkout). */
export function pendingGumroadId(sessionId: string): string {
  return `pending-${sessionId}`;
}
