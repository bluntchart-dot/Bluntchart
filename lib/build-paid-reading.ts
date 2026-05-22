import { calculateChart } from "@/lib/chart-calculator";
import type { BirthLead } from "@/lib/db/checkout-flow";
import { geocodeCity } from "@/lib/geocode-city";
import { generateFullReadingJson } from "@/lib/generate-full-reading";
import type { BirthData, ChartData } from "@/lib/types";

export interface PaidReadingPayload extends Record<string, unknown> {
  chart?: ChartData;
  meta: {
    dob: string;
    name: string;
    birth_place: string;
    birth_time: string;
    geo?: { lat: number; lng: number; timezone: string };
  };
}

/** Claude full reading + ephemeris chart + share card payload for DB + email. */
export async function buildPaidReadingPayload(
  lead: BirthLead
): Promise<PaidReadingPayload | null> {
  const reading = await generateFullReadingJson(
    lead.name,
    lead.dob,
    lead.birth_time,
    lead.birth_place
  );

  if (!reading) return null;

  /* ──────────────────────────────────────────────────────────────────────────
     USE STORED LAT/LNG FROM LOCATION PICKER FIRST.
     Only fall back to geocoding if the user typed a place manually
     (old flow or picker unavailable).
     ────────────────────────────────────────────────────────────────────────── */
  let geo: { lat: number; lng: number; timezone: string } | null = null;

  if (lead.birth_lat && lead.birth_lng) {
    // Coordinates came from the LocationPicker — always accurate
    console.log("[build-paid-reading] using stored coordinates for:", lead.birth_place);

    // Determine timezone from stored value or try to resolve it
    let tz = lead.timezone ?? "UTC";

    // If we have geo-tz available, we could resolve timezone from coords here.
    // For now, rely on the timezone stored during checkout.

    geo = { lat: lead.birth_lat, lng: lead.birth_lng, timezone: tz };
  } else {
    // Legacy flow: no coordinates stored, try geocoding the city name
    console.log("[build-paid-reading] no stored coords, geocoding:", lead.birth_place);
    const geocoded = await geocodeCity(lead.birth_place);
    if (geocoded) {
      geo = geocoded;
    } else {
      console.warn(
        "[build-paid-reading] geocode FAILED for:",
        lead.birth_place,
        "- chart will be missing for this reading"
      );
    }
  }

  let chart: ChartData | undefined;

  if (geo) {
    const birth: BirthData = {
      name: lead.name,
      date: lead.dob,
      time: lead.birth_time,
      lat: geo.lat,
      lng: geo.lng,
      timezone: lead.timezone ?? geo.timezone,
      placeName: lead.birth_place,
    };
    try {
      chart = calculateChart(birth);
      console.log("[build-paid-reading] chart OK for:", lead.birth_place);
    } catch (err) {
      console.warn("[build-paid-reading] chart calculation failed:", (err as Error).message);
    }
  }

  return {
    ...reading,
    ...(chart ? { chart } : {}),
    meta: {
      dob: lead.dob,
      name: lead.name,
      birth_place: lead.birth_place,
      birth_time: lead.birth_time,
      ...(geo
        ? { geo: { lat: geo.lat, lng: geo.lng, timezone: geo.timezone } }
        : {}),
    },
  };
}