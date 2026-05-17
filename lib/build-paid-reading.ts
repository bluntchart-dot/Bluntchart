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

  const geo = await geocodeCity(lead.birth_place);
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
    } catch (err) {
      console.warn("[build-paid-reading] chart failed:", (err as Error).message);
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
