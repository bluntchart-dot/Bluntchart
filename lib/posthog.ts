import posthog from "posthog-js";

type TrackingEvent =
  | "reading_form_started"
  | "reading_form_submitted"
  | "reading_preview_viewed"
  | "checkout_started"
  | "checkout_step_reached"
  | "purchase_completed"
  | "reading_accessed"
  | "compatibility_started"
  | "compatibility_form_submitted"
  | "moon_phase_preview_viewed"
  | "moon_phase_purchased"
  | "free_tool_used"
  | "future_love_form_started"
  | "future_love_form_submitted"
  | "future_love_generated"
  | "future_love_completed"
  | "future_love_upsell_clicked"
  | "cta_clicked";

type EventProperties = Record<string, string | number | boolean | null>;

export function track(event: TrackingEvent, properties?: EventProperties) {
  if (typeof window === "undefined") return;

  try {
    posthog.capture(event, properties);
  } catch {
    // analytics should never break the experience
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[posthog] ${event}`, properties || "");
  }
}

export function identifyUser(email: string, properties?: EventProperties) {
  if (typeof window === "undefined") return;
  try {
    posthog.identify(email, properties);
  } catch {
    // best-effort
  }
}
