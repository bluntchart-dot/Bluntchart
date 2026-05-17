import { SITE_URL } from "@/lib/db/checkout-flow";

/** Gumroad product permalink — direct checkout, not the public product listing. */
export const GUMROAD_CHECKOUT_BASE =
  process.env.NEXT_PUBLIC_GUMROAD_CHECKOUT_URL ??
  "https://bluntchart.gumroad.com/l/bluntchart-reading";

export interface GumroadCheckoutParams {
  email: string;
  sessionId?: string | null;
}

/**
 * Build a Gumroad URL that opens the payment form directly (`wanted=true`).
 * Passes purchaser email and session_id via supported URL parameters.
 */
export function buildGumroadCheckoutUrl(params: GumroadCheckoutParams): string {
  const url = new URL(GUMROAD_CHECKOUT_BASE);

  // Skip product listing / description page — land on checkout form
  url.searchParams.set("wanted", "true");

  const email = params.email.trim().toLowerCase();
  if (email) {
    url.searchParams.set("email", email);
  }

  const sessionId = params.sessionId?.trim();
  if (sessionId) {
    // Gumroad echoes custom_fields in the sale webhook when configured on the product
    url.searchParams.set("custom_fields[session_id]", sessionId);
    // Also pass as plain query param for products that surface it without custom field UI
    url.searchParams.set("session_id", sessionId);

    // Gumroad may ignore these — also set redirect in Gumroad product settings:
    // Content → After purchase → https://bluntchart.com/checkout/complete
    const returnUrl = `${SITE_URL}/checkout/complete?session_id=${encodeURIComponent(sessionId)}`;
    url.searchParams.set("redirect_url", returnUrl);
    url.searchParams.set("return_url", returnUrl);
  }

  return url.toString();
}

/** URL buyers should land on after payment (also set in Gumroad product settings). */
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
