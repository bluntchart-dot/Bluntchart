type EventName =
  | "future_love_page_view"
  | "future_love_hero_cta"
  | "future_love_cta_clicked"
  | "future_love_form_started"
  | "future_love_form_submitted"
  | "future_love_generation_started"
  | "future_love_generation_success"
  | "future_love_generation_failed"
  | "future_love_generated"
  | "future_love_sample_opened"
  | "future_love_completed"
  | "future_love_letter_reached_end"
  | "future_love_feedback_positive"
  | "future_love_feedback_partial"
  | "future_love_feedback_negative"
  | "future_love_feedback_text_submitted"
  | "future_love_share_started"
  | "future_love_quote_selected"
  | "future_love_segment_selected"
  | "future_love_upsell_clicked"
  | "future_love_waitlisted";

type EventProperties = Record<string, string | number | boolean>;

export function trackEvent(name: EventName, properties?: EventProperties) {
  if (typeof window === "undefined") return;

  try {
    const va = (window as unknown as Record<string, unknown>).va;
    if (typeof va === "function") {
      va("event", { name, ...properties });
    }
  } catch {
    // analytics should never break the experience
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[analytics] ${name}`, properties || "");
  }
}
