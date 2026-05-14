import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { previewMail } from "@/lib/email-templates";
import { sendEmail } from "@/lib/send-email";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bluntchart.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const dob = typeof body.dob === "string" ? body.dob.trim() : "";
    const birth_time =
      typeof body.birth_time === "string" ? body.birth_time.trim() : "";
    const city = typeof body.city === "string" ? body.city.trim() : "";

    if (!name || !email || !dob || !birth_time || !city) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Keep one pending row per email
    await supabase.from("pending_readings").delete().eq("email", email);

    const { data, error } = await supabase
      .from("pending_readings")
      .insert([
        {
          name,
          email,
          dob,
          birth_time,
          city,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let emailSent = false;

    try {
      await sendEmail(
        email,
        previewMail({
          firstName: name,
          birthDate: dob,
          readingUrl: `${SITE_URL}#try-it`,
        })
      );
      emailSent = true;
    } catch (mailErr) {
      console.error("[save-pending] Preview email failed:", mailErr);
    }

    return NextResponse.json({
      success: true,
      data,
      emailSent,
    });
  } catch (err) {
    console.error("[save-pending] Unexpected error:", err);
    return NextResponse.json(
      {
        error: "Internal server error",
        detail: (err as Error).message,
      },
      { status: 500 }
    );
  }
}