import { find as findTimezonesAt } from "geo-tz";

export interface GeoResult {
  lat: number;
  lng: number;
  timezone: string;
  displayName: string;
}

function timezoneAt(lat: number, lng: number): string | null {
  try {
    const zones = findTimezonesAt(lat, lng);
    return zones[0] ?? null;
  } catch {
    return null;
  }
}

/** Resolve birth city to coordinates (Nominatim / OpenStreetMap). */
export async function geocodeCity(
  place: string
): Promise<GeoResult | null> {
  const q = place.trim();
  if (!q) return null;

  try {
    const params = new URLSearchParams({
      q,
      format: "json",
      limit: "1",
    });

    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          "User-Agent": "BluntChart/1.0 (bluntchart.com; checkout)",
        },
        next: { revalidate: 86400 },
      }
    );

    if (!res.ok) return null;

    const rows = (await res.json()) as Array<{
      lat: string;
      lon: string;
      display_name: string;
    }>;

    if (!rows?.length) return null;

    const lat = Number(rows[0].lat);
    const lng = Number(rows[0].lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    const timezone = timezoneAt(lat, lng) ?? "UTC";

    return {
      lat,
      lng,
      timezone,
      displayName: rows[0].display_name,
    };
  } catch (err) {
    console.warn("[geocode] failed:", (err as Error).message);
    return null;
  }
}