import { Resend } from "resend";
 
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) console.warn("[Resend] RESEND_API_KEY is missing");
 
const resend = apiKey ? new Resend(apiKey) : null;
 
interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  /** ISO 8601 timestamp — if set, Resend holds the email and sends it at this time. */
  scheduledAt?: string;
}

interface SendEmailResult {
  ok: boolean;
  error?: string;
  /** Resend email id — needed to cancel a scheduled (not-yet-sent) email later. */
  id?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  if (!resend) {
    console.error("[Resend] Client not initialised — RESEND_API_KEY missing");
    return { ok: false, error: "RESEND_API_KEY not configured" };
  }

  const from =
    process.env.RESEND_FROM_EMAIL || "BluntChart <hello@bluntchart.com>";

  try {
    const { data, error } = await resend.emails.send({
      from,
      to:          options.to,
      subject:     options.subject,
      html:        options.html,
      text:        options.text,
      scheduledAt: options.scheduledAt,
    });

    if (error) {
      console.error("[Resend] Send error:", error);
      return { ok: false, error: error.message };
    }

    return { ok: true, id: data?.id };
  } catch (err) {
    const msg = (err as Error).message;
    console.error("[Resend] Unexpected error:", msg);
    return { ok: false, error: msg };
  }
}

/** Cancels a scheduled (not-yet-sent) email. Non-fatal by design — errors are logged, never thrown. */
export async function cancelScheduledEmail(id: string): Promise<void> {
  if (!resend) return;

  try {
    const { error } = await resend.emails.cancel(id);
    if (error) {
      console.warn("[Resend] Cancel warning (likely already sent):", id, error.message);
    }
  } catch (err) {
    console.warn("[Resend] Cancel unexpected error:", id, (err as Error).message);
  }
}