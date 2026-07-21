"use client";

/**
 * PremiumReadingApp — birth-details form → generate → render reading.
 *
 * Used only by /internal/premium (internal playground). Authorization is
 * handled server-side via the `premium_dev_ok` cookie; this component
 * assumes it is already past the gate and simply POSTs to
 * /api/internal/premium/generate.
 *
 * Intentionally does NOT reference Gumroad, /my-reading,
 * abandoned_checkouts, or any part of the live paid flow.
 */

import { Component, useEffect, useState } from "react";
import type { ReactNode } from "react";
import dynamic from "next/dynamic";
import LocationPicker from "@/components/LocationPicker";
import type { SelectedLocation } from "@/components/LocationPicker";
import { ReadingText } from "@/components/ReadingText";
import ChartHighlightBoxes from "@/components/ChartHighlightBoxes";
import FunFactBoxes from "@/components/FunFactBoxes";
import ShareCard from "@/components/ShareCard";
import type { ShareCardData } from "@/components/ShareCard";
import type { ChartData } from "@/lib/types";
import type { ChartHighlights } from "@/lib/chart-calculator";

const ChartWheel = dynamic(() => import("@/components/ChartWheel"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] flex items-center justify-center opacity-50 text-sm">
      Loading your chart…
    </div>
  ),
});

/* ─── Types ─────────────────────────────────────────────────────────── */

interface PaidInsight {
  planet?: string;
  truth?: string;
  explain?: string;
  action?: string;
}

interface ReadingShape {
  letter_opener?: string;
  paidInsights?: PaidInsight[];
  preview?: Array<{ planet?: string; truth?: string }>;
  chart?: ChartData;
  highlights?: ChartHighlights;
  shareCard?: {
    keyword?: string;
    lines?: string[];
    quote?: string;
    line1?: string;
    line2?: string;
    line3?: string;
  };
  meta?: {
    name?: string;
    dob?: string;
    birth_place?: string;
    birth_time?: string;
  };
}

interface Props {
  /** Optional heading eyebrow above the form / reading. */
  eyebrow?: string;
}

/* ─── Small error boundary (mirrors the pattern in /my-reading) ────── */

class SafeRender extends Component<
  { fallback?: ReactNode; label?: string; children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error) {
    console.error(`[SafeRender:${this.props.label}]`, error);
  }
  render() {
    if (this.state.error) {
      return this.props.fallback ?? (
        <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5 text-sm text-red-300">
          {this.props.label ?? "Component"} failed to render: {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}

/* ─── Form styles (matches the existing app aesthetic) ─────────────── */

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

const FOCUS_AREAS = [
  { value: "love",    label: "Love" },
  { value: "career",  label: "Career" },
  { value: "money",   label: "Money" },
  { value: "purpose", label: "Purpose" },
];

const LOADING_MSGS = [
  "Reading the stars…",
  "Calculating your chart…",
  "Writing your premium reading…",
  "Almost there…",
];

/* ─── Component ────────────────────────────────────────────────────── */

export default function PremiumReadingApp({ eyebrow }: Props) {
  const [screen, setScreen] = useState<"form" | "loading" | "reading">("form");
  const [reading, setReading] = useState<ReadingShape | null>(null);

  const [fname,     setFname]     = useState("");
  const [email,     setEmail]     = useState("");
  const [dob,       setDob]       = useState("");
  const [btime,     setBtime]     = useState("");
  const [city,      setCity]      = useState("");
  const [cityGeo,   setCityGeo]   = useState<SelectedLocation | null>(null);
  const [focusArea, setFocusArea] = useState<string>("");
  const [err,       setErr]       = useState("");
  const [loadMsg,   setLoadMsg]   = useState(LOADING_MSGS[0]);

  useEffect(() => {
    if (screen !== "loading") return;
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % LOADING_MSGS.length;
      setLoadMsg(LOADING_MSGS[i]);
    }, 2000);
    return () => clearInterval(t);
  }, [screen]);

  const submit = async () => {
    if (!fname.trim() || !dob || !city.trim() || !btime) {
      setErr("Please fill in name, date of birth, exact birth time, and city.");
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErr("Please enter a valid email address (or leave it blank).");
      return;
    }
    setErr("");
    setScreen("loading");

    const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";

    const payload: Record<string, unknown> = {
      name: fname.trim(),
      email: email.trim() || undefined,
      dob,
      birth_time: btime,
      city: city.trim(),
      timezone: browserTz,
      focus_area: focusArea || undefined,
    };
    if (cityGeo) {
      payload.birth_lat = cityGeo.lat;
      payload.birth_lng = cityGeo.lng;
    }

    try {
      const res = await fetch("/api/internal/premium/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? `Server error ${res.status}`);
      }
      setReading(data.reading as ReadingShape);
      setScreen("reading");
    } catch (e) {
      setScreen("form");
      setErr(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  };

  /* ── FORM ─────────────────────────────────────────────────────── */
  if (screen === "form") {
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
            Your birth details
          </div>
          <div style={{ fontSize: 13, color: "#6b6585", lineHeight: 1.6, marginBottom: 28 }}>
            Your exact birth time is what makes this specific to you, not just anyone born that day.
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={lbl}>First name</label>
              <input value={fname} onChange={e => setFname(e.target.value)} placeholder="e.g. Sarah" style={inp} />
            </div>
            <div>
              <label style={lbl}>Email address (optional)</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com" style={inp} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            <div>
              <label style={lbl}>Date of birth</label>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)} style={inp} />
            </div>
            <div>
              <label style={lbl}>Time of birth</label>
              <input type="time" value={btime} onChange={e => setBtime(e.target.value)} style={inp} />
              <small style={{ fontSize: 11, color: "#3a3858", marginTop: 4, display: "block" }}>
                From birth certificate
              </small>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={lbl}>City &amp; country of birth</label>
            <LocationPicker
              value={city}
              onChange={(location, rawText) => { setCityGeo(location); setCity(rawText); }}
              placeholder="e.g. New York, USA or London, UK"
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={lbl}>
              What part of your life brought you here?{" "}
              <span style={{ color: "#4a4560", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
                (optional)
              </span>
            </label>
            <select
              value={focusArea}
              onChange={e => setFocusArea(e.target.value)}
              style={{ ...inp, appearance: "none", cursor: "pointer", color: focusArea ? "#e8e4f0" : "rgba(232,228,240,0.4)" }}
            >
              <option value="" style={{ background: "#12121e" }}>Select one (optional)</option>
              {FOCUS_AREAS.map(opt => (
                <option key={opt.value} value={opt.value} style={{ background: "#12121e", color: "#e8e4f0" }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button onClick={submit} style={{
            width: "100%",
            background: "linear-gradient(135deg,#6b2fd4,#d4537e)",
            color: "#fff", border: "none",
            borderRadius: 12, padding: "16px 20px",
            fontSize: 15, fontWeight: 600,
            fontFamily: "inherit", cursor: "pointer", letterSpacing: "0.2px",
          }}>
            Generate my premium reading ✦
          </button>
        </div>
        <div style={{ fontSize: 11, color: "#2e2c3e", textAlign: "center", marginTop: 14 }}>
          For entertainment purposes only · Not professional advice
        </div>
      </div>
    );
  }

  /* ── LOADING ─────────────────────────────────────────────────── */
  if (screen === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <span style={{ fontSize: 60, display: "block" }}>🌙</span>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: "16px 0 8px", color: "#e8e4f0" }}>
          {loadMsg}
        </div>
        <div style={{ fontSize: 13, color: "#4a4560" }}>
          Calculating your chart and writing your premium reading…
        </div>
      </div>
    );
  }

  /* ── READING ─────────────────────────────────────────────────── */
  if (screen === "reading" && reading) {
    return <RenderReading reading={reading} />;
  }
  return null;
}

/* ─── Render helper. Mirrors the /my-reading layout to reuse the same
   visual language, but without any Gumroad / unlock chrome. ────────── */

function RenderReading({ reading }: { reading: ReadingShape }) {
  const paidInsights = Array.isArray(reading.paidInsights) ? reading.paidInsights : [];
  const chart        = reading.chart;
  const highlights   = reading.highlights;
  const rawCard      = reading.shareCard;
  const meta         = reading.meta;

  const shareCardProps: ShareCardData | null =
    rawCard && meta?.name
      ? {
          name:    meta.name,
          keyword: rawCard.keyword ?? "",
          line1:   rawCard.line1 ?? rawCard.lines?.[0] ?? "",
          line2:   rawCard.line2 ?? rawCard.lines?.[1] ?? "",
          line3:   rawCard.line3 ?? rawCard.lines?.[2] ?? "",
          quote:   rawCard.quote ?? "",
          sun:     chart?.planets?.find(p => p.name === "Sun")?.sign,
          moon:    chart?.planets?.find(p => p.name === "Moon")?.sign,
          rising:  chart?.ascendant?.sign,
        }
      : null;

  return (
    <div className="max-w-6xl mx-auto w-full">
      <p className="text-xs uppercase tracking-[0.2em] text-[#6b6585] mb-3">
        BluntChart · Premium reading
      </p>

      {reading.letter_opener && (
        <section className="mb-12 text-base sm:text-lg leading-relaxed text-[#d8d2ec] max-w-3xl">
          <ReadingText text={reading.letter_opener} className="space-y-4" />
        </section>
      )}

      {highlights && (
        <section className="mb-8 flex justify-center">
          <SafeRender label="ChartHighlightBoxes">
            <div className="w-full max-w-[960px]">
              <ChartHighlightBoxes highlights={highlights} />
            </div>
          </SafeRender>
        </section>
      )}

      {chart && (
        <section className="mb-10 flex justify-center">
          <SafeRender label="ChartWheel">
            <ChartWheel chart={chart} />
          </SafeRender>
        </section>
      )}

      {chart && (
        <section className="mb-10 flex justify-center">
          <SafeRender label="FunFactBoxes">
            <div className="w-full max-w-[960px]">
              <FunFactBoxes chart={chart} />
            </div>
          </SafeRender>
        </section>
      )}

      {paidInsights.length > 0 && (
        <section className="mb-12">
          <h2 className="text-xs uppercase tracking-[0.2em] text-[#f0b84a] mb-7">
            Full reading · {paidInsights.length} insights
          </h2>
          {paidInsights.map((ins, i) => (
            <article
              key={i}
              className="mb-10 p-7 sm:p-9 rounded-2xl border border-white/10 bg-white/[0.03]"
            >
              {ins.planet && (
                <div className="text-xs uppercase tracking-[0.14em] text-[#6b6585] mb-5 font-semibold">
                  {ins.planet}
                </div>
              )}
              {ins.truth && (
                <p className="text-xl sm:text-2xl font-serif font-semibold leading-snug mb-6 text-[#f0ece8]">
                  {ins.truth}
                </p>
              )}
              {ins.explain && (
                <div className="text-[#b8b0d4] mb-6 text-base sm:text-[1.05rem] leading-relaxed max-w-3xl">
                  <ReadingText text={ins.explain} className="space-y-4" />
                </div>
              )}
              {ins.action && (
                <div className="mt-6 pt-5 border-t border-white/8">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[#f0b84a] block mb-2">
                    This week
                  </span>
                  <p className="text-sm sm:text-base text-[#f0b84a] leading-relaxed">
                    {ins.action}
                  </p>
                </div>
              )}
            </article>
          ))}
        </section>
      )}

      {shareCardProps && (
        <section className="mb-10">
          <h2 className="text-xs uppercase tracking-widest text-[#6b6585] mb-4">
            Your shareable card
          </h2>
          <SafeRender label="ShareCard">
            <ShareCard {...shareCardProps} />
          </SafeRender>
        </section>
      )}

      <div className="pt-6 border-t border-white/5 mt-6">
        <p className="text-xs text-[#6b6585]">
          For entertainment purposes only. Not medical, financial, or psychological advice.
        </p>
      </div>
    </div>
  );
}
