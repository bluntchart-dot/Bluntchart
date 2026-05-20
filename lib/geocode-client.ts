/** Browser-safe geocoding (no geo-tz / Node fs). Used by the preview form on the homepage. */

export interface ClientGeoResult {
  lat: number;
  lng: number;
  timezone: string;
  displayName: string;
}

async function resolveTimezone(lat: number, lng: number): Promise<string> {
  try {
    const res = await fetch(
      `https://timeapi.io/api/TimeZone/coordinate?latitude=${lat}&longitude=${lng}`
    );
    if (res.ok) {
      const data = (await res.json()) as { timeZone?: string };
      if (data.timeZone?.trim()) return data.timeZone.trim();
    }
  } catch {
    /* fall through */
  }
  return "Etc/UTC";
}

/** Resolve birth city to coordinates (Nominatim). Safe for client components. */
export async function geocodeBirthPlace(
  place: string
): Promise<ClientGeoResult | null> {
  const q = place.trim();
  if (!q) return null;

  try {
    const params = new URLSearchParams({ q, format: "json", limit: "1" });
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        headers: {
          "User-Agent": "BluntChart/1.0 (bluntchart.com; preview)",
        },
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

    const timezone = await resolveTimezone(lat, lng);

    return {
      lat,
      lng,
      timezone,
      displayName: rows[0].display_name,
    };
  } catch (err) {
    console.warn("[geocode-client] failed:", (err as Error).message);
    return null;
  }
}
