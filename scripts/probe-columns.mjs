import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

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

const userId = "ba48d7d0-9c59-469e-b75d-735cf81fdc7d";

const paymentRow = {
  session_id: "00000000-0000-4000-8000-000000000002",
  email: "probe-test@example.com",
  user_id: userId,
  amount: "15",
  payment_status: "pending",
  payment_provider: "gumroad",
  gumroad_payment_id: "pending",
  access_token: "41bedbea-0afc-4692-984e-0348bbd1b6a7",
};

const res = await fetch(`${url}/rest/v1/Payments`, {
  method: "POST",
  headers,
  body: JSON.stringify(paymentRow),
});
console.log("Payments insert", res.status, (await res.text()).slice(0, 400));
