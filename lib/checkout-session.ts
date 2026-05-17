export const CHECKOUT_SESSION_KEY = "bluntchart_checkout_session";
export const CHECKOUT_EMAIL_KEY = "bluntchart_checkout_email";
export const CHECKOUT_STORAGE_KEY = "bluntchart_session";

export interface StoredCheckout {
  fname?: string;
  email?: string;
  dob?: string;
  btime?: string;
  city?: string;
  sessionId?: string;
}

export function persistCheckoutSession(sessionId: string, email: string) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CHECKOUT_SESSION_KEY, sessionId);
    sessionStorage.setItem(CHECKOUT_EMAIL_KEY, email);
  } catch {
    /* ignore */
  }
}

export function readCheckoutSession(): {
  sessionId: string | null;
  email: string | null;
} {
  if (typeof window === "undefined") {
    return { sessionId: null, email: null };
  }

  let sessionId: string | null = null;
  let email: string | null = null;

  try {
    sessionId = sessionStorage.getItem(CHECKOUT_SESSION_KEY);
    email = sessionStorage.getItem(CHECKOUT_EMAIL_KEY);
  } catch {
    /* ignore */
  }

  if (!sessionId) {
    try {
      const raw = localStorage.getItem(CHECKOUT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredCheckout;
        sessionId = parsed.sessionId ?? null;
        email = email ?? parsed.email ?? null;
      }
    } catch {
      /* ignore */
    }
  }

  return { sessionId, email };
}
