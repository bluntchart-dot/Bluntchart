import { Resend } from "resend";
 
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) console.warn("[Resend] RESEND_API_KEY is missing");
 
const resend = apiKey ? new Resend(apiKey) : null;
 
interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}
 
interface SendEmailResult {
  ok: boolean;
  error?: string;
}
 
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  if (!resend) {
    console.error("[Resend] Client not initialised — RESEND_API_KEY missing");
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }
 
  const from =
    process.env.RESEND_FROM_EMAIL || "BluntChart <hello@bluntchart.com>";
 
  try {
    const { error } = await resend.emails.send({
      from,
      to:      options.to,
      subject: options.subject,
      html:    options.html,
      text:    options.text,
    });
 
    if (error) {
      console.error("[Resend] Send error:", error);
      return { ok: false, error: error.message };
    }
 
    return { ok: true };
  } catch (err) {
    const msg = (err as Error).message;
    console.error("[Resend] Unexpected error:", msg);
    return { ok: false, error: msg };
  }
}