/**
 * lib/etsy/client.ts
 *
 * Etsy API v3 client. Handles OAuth token management and common
 * API operations needed for order fulfillment.
 *
 * Token refresh: Etsy OAuth tokens expire after 3600s. This client
 * refreshes automatically when a 401 is received.
 *
 * Env vars required:
 *   ETSY_API_KEY        - Etsy API key (keystring)
 *   ETSY_SHARED_SECRET  - Etsy OAuth shared secret
 *   ETSY_SHOP_ID        - Your Etsy shop ID
 *   ETSY_ACCESS_TOKEN   - OAuth access token (persisted, refreshed)
 *   ETSY_REFRESH_TOKEN  - OAuth refresh token (persisted, refreshed)
 */

import { dbError } from "@/lib/db/log";

const ETSY_API_BASE = "https://openapi.etsy.com/v3";

interface EtsyTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

/* ═════════════════════════════════════════════════════════════════
   TOKEN MANAGEMENT
═════════════════════════════════════════════════════════════════ */

let cachedAccessToken: string | null = null;
let tokenExpiresAt = 0;

function getAccessToken(): string {
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }
  return process.env.ETSY_ACCESS_TOKEN ?? "";
}

export async function refreshTokens(): Promise<EtsyTokens | null> {
  const apiKey = process.env.ETSY_API_KEY;
  const refreshToken = process.env.ETSY_REFRESH_TOKEN;

  if (!apiKey || !refreshToken) {
    dbError("etsy/client", "Missing ETSY_API_KEY or ETSY_REFRESH_TOKEN", "");
    return null;
  }

  try {
    const res = await fetch("https://api.etsy.com/v3/public/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: apiKey,
        refresh_token: refreshToken,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      dbError("etsy/client", "Token refresh failed", body, { status: res.status });
      return null;
    }

    const data = await res.json() as EtsyTokens;
    cachedAccessToken = data.access_token;
    tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;
    return data;
  } catch (err) {
    dbError("etsy/client", "Token refresh threw", err instanceof Error ? err.message : String(err));
    return null;
  }
}

/* ═════════════════════════════════════════════════════════════════
   API CALLER
═════════════════════════════════════════════════════════════════ */

async function etsyFetch(
  path: string,
  options: RequestInit = {},
  retried = false
): Promise<any | null> {
  const apiKey = process.env.ETSY_API_KEY;
  const token = getAccessToken();

  if (!apiKey) {
    dbError("etsy/client", "Missing ETSY_API_KEY", "");
    return null;
  }

  const url = `${ETSY_API_BASE}${path}`;
  const headers: Record<string, string> = {
    "x-api-key": apiKey,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> ?? {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });

    if (res.status === 401 && !retried) {
      const refreshed = await refreshTokens();
      if (refreshed) {
        return etsyFetch(path, options, true);
      }
      return null;
    }

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      dbError("etsy/client", `API ${res.status}`, body, { path });
      return null;
    }

    return await res.json();
  } catch (err) {
    dbError("etsy/client", "Fetch threw", err instanceof Error ? err.message : String(err), { path });
    return null;
  }
}

/* ═════════════════════════════════════════════════════════════════
   RECEIPT (ORDER) OPERATIONS
═════════════════════════════════════════════════════════════════ */

export interface EtsyReceipt {
  receipt_id: number;
  buyer_email: string;
  buyer_user_id: number;
  name: string;
  status: string;
  is_paid: boolean;
  create_timestamp: number;
  update_timestamp: number;
  transactions: EtsyTransaction[];
}

export interface EtsyTransaction {
  transaction_id: number;
  listing_id: number;
  title: string;
  quantity: number;
  price: { amount: number; divisor: number; currency_code: string };
  variations: EtsyVariation[];
}

export interface EtsyVariation {
  property_id: number;
  value_id: number;
  formatted_name: string;
  formatted_value: string;
}

export async function getShopReceipts(options?: {
  was_paid?: boolean;
  min_created?: number;
  limit?: number;
}): Promise<EtsyReceipt[] | null> {
  const shopId = process.env.ETSY_SHOP_ID;
  if (!shopId) {
    dbError("etsy/client", "Missing ETSY_SHOP_ID", "");
    return null;
  }

  const params = new URLSearchParams();
  if (options?.was_paid !== undefined) params.set("was_paid", String(options.was_paid));
  if (options?.min_created) params.set("min_created", String(options.min_created));
  params.set("limit", String(options?.limit ?? 25));

  const data = await etsyFetch(
    `/application/shops/${shopId}/receipts?${params.toString()}`
  );
  return data?.results ?? null;
}

export async function getReceipt(receiptId: number): Promise<EtsyReceipt | null> {
  const shopId = process.env.ETSY_SHOP_ID;
  if (!shopId) return null;

  return await etsyFetch(`/application/shops/${shopId}/receipts/${receiptId}`);
}

/* ═════════════════════════════════════════════════════════════════
   MESSAGING
═════════════════════════════════════════════════════════════════ */

export async function sendMessage(
  buyerUserId: number,
  message: string
): Promise<boolean> {
  const shopId = process.env.ETSY_SHOP_ID;
  if (!shopId) return false;

  const result = await etsyFetch(
    `/application/shops/${shopId}/conversations`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to_user_id: buyerUserId,
        body: message,
      }),
    }
  );

  return result !== null;
}
