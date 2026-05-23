import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { loadReadingByAccessToken } from "@/lib/db/fulfillment";
import { dbError, dbLog } from "@/lib/db/log";
import { calculateChart } from "@/lib/chart-calculator";
import { geocodeCity } from "@/lib/geocode-city";
import type { BirthData } from "@/lib/types";

/**
 * GET /api/reading/access?token=...
 * Returns the paid reading JSON for a private access_token (from payments table).
 */
export async function GET(req: NextRequest) {
  const scope = "reading-access";

  const token = req.nextUrl.searchParams.get("token")?.trim();

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Missing token" },
      { status: 400 }
    );
  }

  try {
    const supabase = createSupabaseAdmin();
    const { reading, birth_time, birth_place, error } =
      await loadReadingByAccessToken(supabase, token);

    if (error || !reading) {
      dbLog(scope, "not found", { error });
      return NextResponse.json(
        { success: false, error: error ?? "Not found" },
        { status: 404 }
      );
    }

    /* ── Fallback: generate chart on-the-fly if missing ── */
    if (!reading.chart) {
      dbLog(scope, "chart missing, attempting on-the-fly generation");

      try {
        const meta = reading.meta as Record<string, unknown> | undefined;
        const geo = meta?.geo as
          | { lat: number; lng: number; timezone: string }
          | undefined;

        let lat: number | undefined = geo?.lat;
        let lng: number | undefined = geo?.lng;
        let timezone: string | undefined = geo?.timezone;

        // If no stored coordinates, try geocoding the birth place
        const place =
          (meta?.birth_place as string) || birth_place || "";

        if ((lat === undefined || lng === undefined) && place) {
          dbLog(scope, "no stored coords, geocoding", { place });
          const geocoded = await geocodeCity(place);
          if (geocoded) {
            lat = geocoded.lat;
            lng = geocoded.lng;
            timezone = geocoded.timezone;
          }
        }

        const dob = (meta?.dob as string) || "";
        const time =
          (meta?.birth_time as string) || birth_time || "";

        if (lat !== undefined && lng !== undefined && dob && time) {
          const birthData: BirthData = {
            name: (meta?.name as string) || "",
            date: dob,
            time: time,
            lat,
            lng,
            timezone: timezone || "UTC",
            placeName: place,
          };

          const chart = calculateChart(birthData);
          (reading as Record<string, unknown>).chart = chart;
          dbLog(scope, "on-the-fly chart generated successfully");
        } else {
          dbLog(scope, "cannot generate chart, missing birth data", {
            hasLat: lat !== undefined,
            hasLng: lng !== undefined,
            hasDob: !!dob,
            hasTime: !!time,
          });
        }
      } catch (chartErr) {
        dbError(scope, "on-the-fly chart generation failed", chartErr);
        // Continue without chart — reading still works, just no wheel
      }
    }

    dbLog(scope, "ok");
    return NextResponse.json({
      success: true,
      reading,
      birth_time,
      birth_place,
    });
  } catch (err) {
    dbError(scope, "unexpected", err);
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}