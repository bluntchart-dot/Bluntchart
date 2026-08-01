import { SITE_URL } from "@/lib/db/checkout-flow";
import { buildCheckoutUrl, getProduct } from "@/lib/products";

export const GUMROAD_CHECKOUT_BASE = getProduct("reading").gumroadCheckoutUrl;

export interface GumroadCheckoutParams {
  email: string;
  sessionId?: string | null;
}

export function buildGumroadCheckoutUrl(params: GumroadCheckoutParams): string {
  const sessionId = params.sessionId?.trim();
  if (sessionId) {
    return buildCheckoutUrl("reading", {
      email: params.email,
      sessionId,
    });
  }
  const url = new URL(GUMROAD_CHECKOUT_BASE);
  url.searchParams.set("wanted", "true");
  const email = params.email.trim().toLowerCase();
  if (email) url.searchParams.set("email", email);
  return url.toString();
}

export function checkoutCompleteUrl(sessionId?: string | null): string {
  const base = `${SITE_URL}/checkout/complete`;
  if (!sessionId?.trim()) return base;
  return `${base}?session_id=${encodeURIComponent(sessionId.trim())}`;
}

/** Parse session_id from Gumroad ping / webhook body (several shapes). */
export function parseGumroadSessionId(
  params: URLSearchParams
): string | undefined {
  const direct =
    params.get("custom_fields[session_id]") || params.get("session_id");

  if (direct?.trim()) {
    return direct.trim();
  }

  const rawCustom = params.get("custom_fields");
  if (rawCustom) {
    try {
      const parsed = JSON.parse(rawCustom) as Record<string, unknown>;
      const sid = parsed.session_id ?? parsed.sessionId;
      if (typeof sid === "string" && sid.trim()) {
        return sid.trim();
      }
    } catch {
      // not JSON — ignore
    }
  }

  for (const [key, value] of params.entries()) {
    if (
      value?.trim() &&
      (key === "session_id" ||
        key.endsWith("[session_id]") ||
        key.toLowerCase().includes("session_id"))
    ) {
      return value.trim();
    }
  }

  return undefined;
}
