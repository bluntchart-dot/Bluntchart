import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { DB } from "@/lib/db/tables";

const VALID_ZODIAC = [
  "aries","taurus","gemini","cancer","leo","virgo",
  "libra","scorpio","sagittarius","capricorn","aquarius","pisces",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const rating = Number(body.rating);
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    const productType = typeof body.product_type === "string"
      ? body.product_type.trim()
      : "future-love-letter";

    const zodiac = typeof body.zodiac_sign === "string" && VALID_ZODIAC.includes(body.zodiac_sign.toLowerCase())
      ? body.zodiac_sign.toLowerCase()
      : null;

    const supabase = createSupabaseAdmin();

    const { error: insertError } = await supabase.from(DB.reviews).insert([
      {
        product_type: productType,
        rating,
        zodiac_sign: zodiac,
        emotional_reaction: typeof body.emotional_reaction === "string" ? body.emotional_reaction.slice(0, 200) : null,
        best_line: typeof body.best_line === "string" ? body.best_line.slice(0, 500) : null,
        name: typeof body.name === "string" ? body.name.trim().slice(0, 100) : null,
        testimonial: typeof body.testimonial === "string" ? body.testimonial.trim().slice(0, 1000) : null,
      },
    ]);

    if (insertError) {
      console.error("[reviews] Insert failed:", insertError);
      return NextResponse.json({ error: "Failed to save review" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[reviews] Unhandled error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productType = searchParams.get("product") || "future-love-letter";
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);

    const supabase = createSupabaseAdmin();

    const { data, error } = await supabase
      .from(DB.reviews)
      .select("id, product_type, rating, zodiac_sign, emotional_reaction, best_line, name, testimonial, created_at")
      .eq("product_type", productType)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("[reviews] Fetch failed:", error);
      return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
    }

    return NextResponse.json({ reviews: data ?? [] });
  } catch (err) {
    console.error("[reviews] Unhandled error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
