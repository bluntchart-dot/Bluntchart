import { NextRequest, NextResponse } from "next/server";
import { generateLoveLetter } from "@/lib/future-love-letter/generate-letter";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { ensureUser } from "@/lib/db/users";
import { DB } from "@/lib/db/tables";
import type { FutureLoveRequest, FutureLoveResult } from "@/lib/future-love-letter/types";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as FutureLoveRequest;

    if (!body.name || !body.date || !body.time || !body.lat || !body.lng) {
      return NextResponse.json(
        { error: "Missing required birth data fields" },
        { status: 400 },
      );
    }

    const result = await generateLoveLetter({
      name: body.name,
      date: body.date,
      time: body.time,
      lat: body.lat,
      lng: body.lng,
      placeName: body.placeName,
      timezone: body.timezone,
    });

    if (!result.ok) {
      if (result.rateLimited) {
        if (body.email) {
          try {
            const supabase = createSupabaseAdmin();
            const { user } = await ensureUser(supabase, body.email, body.name);
            if (user) {
              await supabase.from(DB.readings).insert([{
                user_id: user.id,
                payment_id: null,
                birth_time: body.time,
                birth_place: body.placeName || null,
                timezone: body.timezone || null,
                reading_json: {
                  meta: { name: body.name, dob: body.date, birth_place: body.placeName, lat: body.lat, lng: body.lng },
                },
                reading_status: "pending",
                product_type: "future-love-letter",
              }]);
            }
          } catch (dbErr) {
            console.error("[future-love-letter] Waitlist save failed:", dbErr);
          }
        }
        return NextResponse.json({ waitlisted: true }, { status: 429 });
      }
      console.error("[future-love-letter] Generation failed:", result.error);
      return NextResponse.json(
        { error: "Generation produced invalid response" },
        { status: 502 },
      );
    }

    const response: FutureLoveResult = {
      letter: result.letter!,
      shareableQuotes: result.shareableQuotes ?? [],
      name: body.name,
    };

    if (body.email) {
      try {
        const supabase = createSupabaseAdmin();
        const { user } = await ensureUser(supabase, body.email, body.name);
        if (user) {
          await supabase.from(DB.readings).insert([{
            user_id: user.id,
            payment_id: null,
            birth_time: body.time,
            birth_place: body.placeName || null,
            timezone: body.timezone || null,
            reading_json: {
              letter: result.letter,
              shareableQuotes: result.shareableQuotes,
              meta: { name: body.name, dob: body.date, birth_place: body.placeName },
            },
            reading_status: "complete",
            product_type: "future-love-letter",
          }]);
        }
      } catch (dbErr) {
        console.error("[future-love-letter] DB save failed (non-fatal):", dbErr);
      }
    }

    return NextResponse.json(response);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[future-love-letter] Unhandled error:", msg);
    return NextResponse.json(
      { error: "Something went wrong generating your letter" },
      { status: 500 },
    );
  }
}
