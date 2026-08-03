"use client";

/**
 * PremiumReadingApp — /internal/premium admin form.
 *
 * Manual-fulfillment workflow. Runs the current V1.2 insight-map engine,
 * persists the reading in Supabase with a real access token, and sends
 * the customer email sequence (confirmation → delivery → scheduled
 * review + social-proof). Behind the existing password gate.
 *
 * On success shows the admin panel: customer email, order source,
 * payment/reading IDs, access token, full /my-book?token=... URL with
 * copy button, and email delivery statuses.
 */

import { useEffect, useState } from "react";
import LocationPicker from "@/components/LocationPicker";
import type { SelectedLocation } from "@/components/LocationPicker";
import {
  INTERNAL_SELECTABLE_SOURCES,
  ORDER_SOURCE_LABEL,
  type OrderSource,
} from "@/lib/premium/order-sources";

/* ─── Small style tokens ─────────────────────────────────────────── */
const inp: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "0.5px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "13px 14px",
  fontSize: 14,
  color: "#e8e4f0",
  fontFamily: "inherit",
  outline: "none",
};
const lbl: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "#6b6585",
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  marginBottom: 6,
};

const LOADING_MSGS = [
  "Calculating chart…",
  "Extracting insight signals…",
  "Interpreting with Claude…",
  "Writing the book…",
  "Running QA…",
  "Saving to database…",
  "Sending emails…",
];

/* ─── Shape of the /fulfill response the admin panel renders ─────── */
interface EmailStatus {
  sent: boolean;
  id: string | null;
  error: string | null;
}
interface FulfillmentResult {
  ok: true;
  customer: { name: string; email: string; firstName: string };
  orderSource: OrderSource;
  accessToken: string;
  readingUrl: string;
  readingId: string;
  model: string;
  emailStatus: {
    confirmation: EmailStatus;
    delivery: EmailStatus;
    reviewScheduled: EmailStatus;
    socialProofScheduled: EmailStatus;
  };
}

interface Props {
  eyebrow?: string;
}

export default function PremiumReadingApp({ eyebrow }: Props) {
  const [screen, setScreen] = useState<"form" | "loading" | "done">("form");
  const [result, setResult] = useState<FulfillmentResult | null>(null);

  const [fname,     setFname]     = useState("");
  const [email,     setEmail]     = useState("");
  const [dob,       setDob]       = useState("");
  const [btime,     setBtime]     = useState("");
  const [city,      setCity]      = useState("");
  const [cityGeo,   setCityGeo]   = useState<SelectedLocation | null>(null);
  const [orderSource, setOrderSource] = useState<OrderSource | "">("");
  const [model,     setModel]     = useState<string>("sonnet-5");
  const [err,       setErr]       = useState("");
  const [loadMsg,   setLoadMsg]   = useState(LOADING_MSGS[0]);

  useEffect(() => {
    if (screen !== "loading") return;
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % LOADING_MSGS.length;
      setLoadMsg(LOADING_MSGS[i]);
    }, 2200);
    return () => clearInterval(t);
  }, [screen]);

  const reset = () => {
    setScreen("form");
    setResult(null);
    setFname(""); setEmail(""); setDob(""); setBtime("");
    setCity(""); setCityGeo(null); setOrderSource(""); setErr("");
  };

  const submit = async () => {
    if (!fname.trim() || !email.trim() || !dob || !btime || !city.trim()) {
      setErr("Please fill in name, email, date of birth, exact birth time, and city.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErr("Please enter a valid email address.");
      return;
    }
    if (!orderSource) {
      setErr("Please choose an order source.");
      return;
    }
    setErr("");
    setScreen("loading");

    const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    const payload: Record<string, unknown> = {
      name: fname.trim(),
      email: email.trim().toLowerCase(),
      dob,
      birth_time: btime,
      city: city.trim(),
      timezone: browserTz,
      model,
      order_source: orderSource,
    };
    if (cityGeo) {
      payload.birth_lat = cityGeo.lat;
      payload.birth_lng = cityGeo.lng;
    }

    try {
      const res = await fetch("/api/internal/premium/fulfill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? `Server error ${res.status}`);
      }
      setResult(data as FulfillmentResult);
      setScreen("done");
    } catch (e) {
      setScreen("form");
      setErr(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  };

  /* ── LOADING ──────────────────────────────────────────────────── */
  if (screen === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <span style={{ fontSize: 60, display: "block" }}>🌙</span>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: "16px 0 8px", color: "#e8e4f0" }}>
          {loadMsg}
        </div>
        <div style={{ fontSize: 13, color: "#4a4560" }}>
          This can take 60–120 seconds.
        </div>
      </div>
    );
  }

  /* ── DONE / ADMIN RESULT PANEL ────────────────────────────────── */
  if (screen === "done" && result) {
    return <ResultPanel result={result} onNew={reset} />;
  }

  /* ── FORM ─────────────────────────────────────────────────────── */
  return (
    <div style={{ maxWidth: 640, margin: "0 auto", width: "100%" }}>
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.2em] text-[#6b6585] mb-3">{eyebrow}</p>
      )}
      {err && (
        <div style={{
          background: "rgba(212,83,126,0.08)",
          border: "0.5px solid rgba(212,83,126,0.3)",
          borderRadius: 10, padding: "11px 14px",
          fontSize: 13, color: "#f0a0b8", marginBottom: 14,
        }}>{err}</div>
      )}

      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: 18, padding: 32,
      }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, marginBottom: 6, color: "#e8e4f0" }}>
          Manual fulfillment
        </div>
        <div style={{ fontSize: 13, color: "#6b6585", lineHeight: 1.6, marginBottom: 28 }}>
          Enter customer birth details. This will generate the reading with the current V1.2 engine, save it to Supabase, and send the customer confirmation + delivery emails.
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={lbl}>Customer name</label>
            <input value={fname} onChange={e => setFname(e.target.value)} placeholder="e.g. Sarah" style={inp} />
          </div>
          <div>
            <label style={lbl}>Customer email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" style={inp} />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
          <div>
            <label style={lbl}>Date of birth</label>
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} style={inp} />
          </div>
          <div>
            <label style={lbl}>Exact birth time</label>
            <input type="time" value={btime} onChange={e => setBtime(e.target.value)} style={inp} />
            <small style={{ fontSize: 11, color: "#3a3858", marginTop: 4, display: "block" }}>
              From birth certificate
            </small>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={lbl}>City &amp; country of birth</label>
          <LocationPicker
            value={city}
            onChange={(location, rawText) => { setCityGeo(location); setCity(rawText); }}
            placeholder="e.g. New York, USA or London, UK"
          />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={lbl}>Order source</label>
          <select
            value={orderSource}
            onChange={e => setOrderSource(e.target.value as OrderSource | "")}
            style={{ ...inp, appearance: "none", cursor: "pointer", color: orderSource ? "#e8e4f0" : "rgba(232,228,240,0.4)" }}
          >
            <option value="" style={{ background: "#12121e" }}>Choose one…</option>
            {INTERNAL_SELECTABLE_SOURCES.map(src => (
              <option key={src} value={src} style={{ background: "#12121e", color: "#e8e4f0" }}>
                {ORDER_SOURCE_LABEL[src]}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={lbl}>Generator model</label>
          <select
            value={model}
            onChange={e => setModel(e.target.value)}
            style={{ ...inp, appearance: "none", cursor: "pointer" }}
          >
            <option value="haiku-4-5" style={{ background: "#12121e", color: "#e8e4f0" }}>
              Claude Haiku 4.5 (fast, cheap)
            </option>
            <option value="sonnet-5" style={{ background: "#12121e", color: "#e8e4f0" }}>
              Claude Sonnet 5 (matches Gumroad book)
            </option>
            <option value="opus-4-8" style={{ background: "#12121e", color: "#e8e4f0" }}>
              Claude Opus 4.8 (highest quality)
            </option>
          </select>
          <small style={{ fontSize: 11, color: "#3a3858", marginTop: 4, display: "block" }}>
            Sonnet 5 is what real paying customers get. Haiku is faster for internal tests.
          </small>
        </div>

        <button onClick={submit} style={{
          width: "100%",
          background: "linear-gradient(135deg,#6b2fd4,#d4537e)",
          color: "#fff", border: "none",
          borderRadius: 12, padding: "16px 20px",
          fontSize: 15, fontWeight: 600,
          fontFamily: "inherit", cursor: "pointer", letterSpacing: "0.2px",
        }}>
          Generate &amp; Send Book →
        </button>
      </div>
      <div style={{ fontSize: 11, color: "#2e2c3e", textAlign: "center", marginTop: 14 }}>
        Manual fulfillment · V1.2 engine · real Supabase persistence · real customer emails
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Admin result panel — shown after a successful fulfillment. Displays
   the access token and full URL so support can rebuild the link if
   email ever fails.
───────────────────────────────────────────────────────────────── */

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: ok ? "rgba(122,214,153,0.10)" : "rgba(212,83,126,0.10)",
      border: `0.5px solid ${ok ? "rgba(122,214,153,0.32)" : "rgba(212,83,126,0.32)"}`,
      color: ok ? "#a7f0c1" : "#f0a0b8",
      borderRadius: 100, padding: "3px 10px",
      fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
    }}>
      {ok ? "✓" : "✗"} {label}
    </span>
  );
}

function ResultPanel({ result, onNew }: { result: FulfillmentResult; onNew: () => void }) {
  const [copied, setCopied] = useState(false);
  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(result.readingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard unavailable — user can select the field */ }
  };

  const row: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "160px 1fr",
    gap: 12,
    padding: "11px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    fontSize: 13,
    alignItems: "center",
  };
  const rowLabel: React.CSSProperties = {
    fontSize: 10.5,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#6b6585",
    fontWeight: 600,
  };
  const rowValue: React.CSSProperties = {
    color: "#e8e4f0",
    wordBreak: "break-all",
  };
  const tokenMono: React.CSSProperties = {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 12.5,
    color: "#efe9dc",
    background: "rgba(255,255,255,0.04)",
    padding: "8px 10px",
    borderRadius: 8,
    border: "0.5px solid rgba(255,255,255,0.08)",
    display: "block",
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
      <div style={{
        background: "rgba(122,214,153,0.06)",
        border: "0.5px solid rgba(122,214,153,0.28)",
        borderRadius: 14, padding: "12px 16px",
        color: "#a7f0c1", fontSize: 13, fontWeight: 600,
        marginBottom: 20, letterSpacing: "0.02em",
      }}>
        ✓ Book generated and saved. Customer emails dispatched below.
      </div>

      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "0.5px solid rgba(255,255,255,0.08)",
        borderRadius: 18, padding: 28,
      }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 20, marginBottom: 14, color: "#e8e4f0" }}>
          Fulfillment record
        </div>

        <div style={row}>
          <span style={rowLabel}>Customer</span>
          <span style={rowValue}>{result.customer.name} · {result.customer.email}</span>
        </div>
        <div style={row}>
          <span style={rowLabel}>Order source</span>
          <span style={rowValue}>{ORDER_SOURCE_LABEL[result.orderSource]}</span>
        </div>
        <div style={row}>
          <span style={rowLabel}>Model</span>
          <span style={rowValue}>{result.model}</span>
        </div>
        <div style={row}>
          <span style={rowLabel}>Reading ID</span>
          <span style={rowValue}>{result.readingId}</span>
        </div>

        <div style={{ ...row, borderBottom: "none", gridTemplateColumns: "160px 1fr", alignItems: "start" }}>
          <span style={rowLabel}>Access token</span>
          <span style={tokenMono}>{result.accessToken}</span>
        </div>

        <div style={{ marginTop: 18 }}>
          <label style={lbl}>Full book URL (safe to send to customer)</label>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              readOnly
              value={result.readingUrl}
              onFocus={(e) => e.currentTarget.select()}
              style={{ ...inp, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12.5 }}
            />
            <button onClick={copyUrl} style={{
              background: copied ? "#a7f0c1" : "linear-gradient(135deg,#6b2fd4,#d4537e)",
              color: copied ? "#0b0b0b" : "#fff",
              border: "none", borderRadius: 10, padding: "0 18px",
              fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
              cursor: "pointer", fontFamily: "inherit",
            }}>
              {copied ? "Copied" : "Copy Book Link"}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <label style={lbl}>Email delivery</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <StatusPill ok={result.emailStatus.confirmation.sent} label="confirmation" />
            <StatusPill ok={result.emailStatus.delivery.sent} label="delivery" />
            <StatusPill ok={result.emailStatus.reviewScheduled.sent} label="review scheduled" />
            <StatusPill ok={result.emailStatus.socialProofScheduled.sent} label="social-proof scheduled" />
          </div>
          {(() => {
            const errors: Array<[string, string]> = [];
            const s = result.emailStatus;
            if (s.confirmation.error) errors.push(["confirmation", s.confirmation.error]);
            if (s.delivery.error) errors.push(["delivery", s.delivery.error]);
            if (s.reviewScheduled.error) errors.push(["review", s.reviewScheduled.error]);
            if (s.socialProofScheduled.error) errors.push(["social-proof", s.socialProofScheduled.error]);
            if (errors.length === 0) return null;
            return (
              <div style={{ marginTop: 12, fontSize: 12, color: "#f0a0b8" }}>
                {errors.map(([label, msg]) => (
                  <div key={label}><b>{label}:</b> {msg}</div>
                ))}
              </div>
            );
          })()}
        </div>
      </div>

      <button onClick={onNew} style={{
        width: "100%",
        background: "transparent",
        border: "0.5px solid rgba(255,255,255,0.15)",
        color: "#e8e4f0",
        borderRadius: 12, padding: "14px 20px",
        fontSize: 14, fontWeight: 500,
        marginTop: 18, cursor: "pointer", fontFamily: "inherit",
      }}>
        Fulfill another order
      </button>
    </div>
  );
}
