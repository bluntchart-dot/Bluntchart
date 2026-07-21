"use client";

/**
 * PremiumDevLogin — password gate for the internal /internal/premium playground.
 *
 * Posts to /api/internal/premium/dev-login. On 200 the server sets the
 * `premium_dev_ok` cookie; we reload the page and the server component
 * renders the playground.
 */

import { useState } from "react";

export default function PremiumDevLogin() {
  const [pw,      setPw]      = useState("");
  const [busy,    setBusy]    = useState(false);
  const [err,     setErr]     = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pw.trim()) return;
    setBusy(true);
    setErr("");
    try {
      const res = await fetch("/api/internal/premium/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setErr(data.error ?? `Login failed (${res.status})`);
        setBusy(false);
        return;
      }
      // Cookie is set; reload so the server component renders the playground.
      window.location.reload();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Login failed.");
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", paddingTop: 40 }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 28, marginBottom: 8, color: "#e8e4f0" }}>
        Enter password
      </div>
      <p style={{ fontSize: 13, color: "#6b6585", lineHeight: 1.6, marginBottom: 24 }}>
        This is a private area. Provide the internal password to continue.
      </p>

      {err && (
        <div style={{
          background: "rgba(212,83,126,0.08)",
          border: "0.5px solid rgba(212,83,126,0.3)",
          borderRadius: 10,
          padding: "11px 14px",
          fontSize: 13,
          color: "#f0a0b8",
          marginBottom: 14,
        }}>
          {err}
        </div>
      )}

      <form onSubmit={submit}>
        <input
          autoFocus
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          placeholder="Password"
          style={{
            width: "100%",
            background: "rgba(255,255,255,0.04)",
            border: "0.5px solid rgba(255,255,255,0.1)",
            borderRadius: 10,
            padding: "13px 14px",
            fontSize: 14,
            color: "#e8e4f0",
            fontFamily: "inherit",
            outline: "none",
            marginBottom: 16,
          }}
        />
        <button
          type="submit"
          disabled={busy}
          style={{
            width: "100%",
            background: "linear-gradient(135deg,#6b2fd4,#d4537e)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "14px 20px",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: busy ? "wait" : "pointer",
            letterSpacing: "0.2px",
            opacity: busy ? 0.7 : 1,
          }}
        >
          {busy ? "Checking…" : "Unlock playground"}
        </button>
      </form>
    </div>
  );
}
