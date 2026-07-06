/** Row shapes aligned with your Supabase schema (see dashboard ERD). */

export type CheckoutStep =
  | "form_submitted"
  | "preview_generated"
  | "clicked_pay";

export interface UserRow {
  id: string;
  email: string;
  name: string | null;
  created_at?: string;
}

export interface PaymentRow {
  id: string;
  session_id: string | null;
  email: string | null;
  gumroad_payment_id: string | null;
  amount: string | null;
  payment_status: string | null;
  payment_provider: string | null;
  access_token: string | null;
  user_id: string | null;
  created_at?: string;
  updated_at?: string;
}

/** Exact shape saved from the free preview generation, reused verbatim on the paid page. */
export interface StoredPreviewInsight {
  planet: string;
  hook?: string;
  truth: string;
  reveal?: string;
  cliffhanger?: string;
}

export interface StoredPreview {
  letter_opener: string;
  preview: StoredPreviewInsight[];
}

export interface AbandonedCheckoutRow {
  id: string;
  email: string;
  name: string | null;
  dob: string | null;
  birth_time: string | null;
  birth_place: string | null;
  timezone: string | null;
  birth_lat: number | null;
  birth_lng: number | null;
  focus_area: string | null;
  preview_json: StoredPreview | null;
  step_reached: string | null;
  utm_source: string | null;
  user_id: string | null;
  abandoned_at?: string;
  created_at?: string;
}

export interface ReadingRow {
  id: string;
  user_id: string | null;
  payment_id: string | null;
  birth_time: string | null;
  birth_place: string | null;
  timezone: string | null;
  reading_json: Record<string, unknown> | null;
  reading_status: string | null;
  created_at?: string;
}

export interface CheckoutStartPayload {
  name: string;
  email: string;
  dob: string;
  birth_time: string;
  birth_place: string;
  timezone?: string;
  birth_lat?: number;
  birth_lng?: number;
  focus_area?: string;
  step_reached?: CheckoutStep;
  utm_source?: string;
}