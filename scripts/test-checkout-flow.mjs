/**
 * End-to-end checkout DB smoke test (no API server).
 * Run: node scripts/test-checkout-flow.mjs
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { randomUUID } from "crypto";

const envPath = resolve(process.cwd(), ".env.local");
if (existsSync(envPath)) {
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i < 1) continue;
    const key = trimmed.slice(0, i).trim();
    let val = trimmed.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

async function post(table, row) {
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers,
    body: JSON.stringify(row),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`${table} ${res.status}: ${body}`);
  return JSON.parse(body)[0];
}

const email = `flow-test-${Date.now()}@example.com`;
const sessionId = randomUUID();

console.log("1. Users");
const user = await post("Users", { email, name: "Flow Test" });

console.log("2. Payments");
const payment = await post("Payments", {
  session_id: sessionId,
  email,
  user_id: user.id,
  amount: "15",
  payment_status: "pending",
  payment_provider: "gumroad",
  gumroad_payment_id: `pending-${sessionId}`,
  access_token: randomUUID(),
});

console.log("3. abandoned_checkouts");
await post("abandoned_checkouts", {
  email,
  name: "Flow Test",
  dob: "1990-01-01",
  birth_time: "12:00",
  birth_place: "London, UK",
  step_reached: "form_submitted",
  user_id: user.id,
  abandoned_at: new Date().toISOString(),
});

console.log("OK", { userId: user.id, paymentId: payment.id, sessionId });
