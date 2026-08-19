import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/send-email";
import { moonPhaseDeliveryMail } from "@/lib/email-templates";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bluntchart.com";

export async function POST(req: NextRequest) {
  const { email, name1, name2, token } = (await req.json()) as {
    email: string;
    name1: string;
    name2: string;
    token: string;
  };

  if (!email || !name1 || !name2 || !token) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const deliveryUrl = `${SITE_URL}/moon-phase/delivery?t=${encodeURIComponent(token)}`;
  const { subject, html, text } = moonPhaseDeliveryMail({
    name1,
    name2,
    deliveryUrl,
  });

  const result = await sendEmail({ to: email, subject, html, text });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error || "Failed to send email" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, id: result.id });
}
