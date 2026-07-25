"use client";

/**
 * PremiumReadingApp — birth-details form → premium book preview.
 *
 * Used only by /internal/premium (internal playground). Authorization is
 * handled server-side via the `premium_dev_ok` cookie; this component
 * assumes it is already past the gate.
 *
 * On submit, it POSTs to /api/internal/premium/generate which today
 * returns a mock PremiumReading (real chart + in-voice mock chapters).
 * The reading is handed to <PremiumBook /> for the full book experience.
 */

import { useEffect, useState } from "react";
import LocationPicker from "@/components/LocationPicker";
import type { SelectedLocation } from "@/components/LocationPicker";
import PremiumBook from "@/components/premium/PremiumBook";
import type { PremiumReading } from "@/lib/premium/types";

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
  "Calculating your chart…",
  "Laying out your book…",
  "Setting the type…",
  "Almost there…",
];

interface Props {
  eyebrow?: string;
}

export default function PremiumReadingApp({ eyebrow }: Props) {
  const [screen, setScreen] = useState<"form" | "loading" | "book">("form");
  const [reading, setReading] = useState<PremiumReading | null>(null);

  const [fname,     setFname]     = useState("");
  const [email,     setEmail]     = useState("");
  const [dob,       setDob]       = useState("");
  const [btime,     setBtime]     = useState("");
  const [city,      setCity]      = useState("");
  const [cityGeo,   setCityGeo]   = useState<SelectedLocation | null>(null);
  const [focusArea, setFocusArea] = useState<string>("");
  const [model,     setModel]     = useState<string>("haiku-4-5");
  const [err,       setErr]       = useState("");
  const [loadMsg,   setLoadMsg]   = useState(LOADING_MSGS[0]);

  useEffect(() => {
    if (screen !== "loading") return;
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % LOADING_MSGS.length;
      setLoadMsg(LOADING_MSGS[i]);
    }, 1400);
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
      model,
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
      setReading(data.reading as PremiumReading);
      setScreen("book");
    } catch (e) {
      setScreen("form");
      setErr(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    }
  };

  /* ── BOOK ─────────────────────────────────────────────────────── */
  if (screen === "book" && reading) {
    return (
      <PremiumBook
        reading={reading}
        onClose={() => {
          setScreen("form");
          setReading(null);
        }}
      />
    );
  }

  /* ── LOADING ──────────────────────────────────────────────────── */
  if (screen === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <span style={{ fontSize: 60, display: "block" }}>🌙</span>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 22, margin: "16px 0 8px", color: "#e8e4f0" }}>
          {loadMsg}
        </div>
        <div style={{ fontSize: 13, color: "#4a4560" }}>
          Building your book…
        </div>
      </div>
    );
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
          Your birth details
        </div>
        <div style={{ fontSize: 13, color: "#6b6585", lineHeight: 1.6, marginBottom: 28 }}>
          The chart is real. The chapter bodies are in-voice placeholders until we wire the AI in.
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

        <div style={{ marginBottom: 24 }}>
          <label style={lbl}>Generator</label>
          <select
            value={model}
            onChange={e => setModel(e.target.value)}
            style={{ ...inp, appearance: "none", cursor: "pointer" }}
          >
            <option value="haiku-4-5" style={{ background: "#12121e", color: "#e8e4f0" }}>
              Claude Haiku 4.5 (fast, cheap)
            </option>
            <option value="sonnet-5" style={{ background: "#12121e", color: "#e8e4f0" }}>
              Claude Sonnet 5 (balanced)
            </option>
            <option value="opus-4-8" style={{ background: "#12121e", color: "#e8e4f0" }}>
              Claude Opus 4.8 (highest quality, slowest)
            </option>
            <option value="mock" style={{ background: "#12121e", color: "#e8e4f0" }}>
              Mock content (no AI call)
            </option>
          </select>
          <small style={{ fontSize: 11, color: "#3a3858", marginTop: 4, display: "block" }}>
            Real AI can take 45–120 seconds. Mock is instant.
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
          Preview my book ✦
        </button>
      </div>
      <div style={{ fontSize: 11, color: "#2e2c3e", textAlign: "center", marginTop: 14 }}>
        Internal preview · in-voice mock content · real chart data
      </div>
    </div>
  );
}
