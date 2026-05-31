"use client";

import { useState, useEffect, useMemo } from "react";

// ─── RETROGRADE DATA 2025 → 2030 ──────────────────────────────────────────────

interface RetrogradePeriod {
  year: number;
  start: string;      // ISO date  yyyy-mm-dd
  end: string;
  sign: string;
  preShadow: string;
  postShadow: string;
}

const RETROGRADES: RetrogradePeriod[] = [
  // 2025 — past, needed for post-shadow context
  { year: 2025, start: "2025-03-14", end: "2025-04-07", sign: "Aries ♈", preShadow: "2025-02-25", postShadow: "2025-04-28" },
  { year: 2025, start: "2025-07-18", end: "2025-08-11", sign: "Leo ♌", preShadow: "2025-06-30", postShadow: "2025-08-31" },
  { year: 2025, start: "2025-11-09", end: "2025-11-29", sign: "Sagittarius ♐", preShadow: "2025-10-22", postShadow: "2025-12-15" },
  // 2026
  { year: 2026, start: "2026-02-26", end: "2026-03-20", sign: "Pisces ♓", preShadow: "2026-02-11", postShadow: "2026-04-09" },
  { year: 2026, start: "2026-06-29", end: "2026-07-23", sign: "Cancer ♋", preShadow: "2026-06-12", postShadow: "2026-08-06" },
  { year: 2026, start: "2026-10-24", end: "2026-11-13", sign: "Scorpio ♏", preShadow: "2026-10-04", postShadow: "2026-11-29" },
  // 2027
  { year: 2027, start: "2027-02-09", end: "2027-03-03", sign: "Pisces/Aquarius ♓♒", preShadow: "2027-01-26", postShadow: "2027-03-18" },
  { year: 2027, start: "2027-06-10", end: "2027-07-04", sign: "Cancer/Gemini ♋♊", preShadow: "2027-05-25", postShadow: "2027-07-20" },
  { year: 2027, start: "2027-10-07", end: "2027-10-28", sign: "Scorpio/Libra ♏♎", preShadow: "2027-09-17", postShadow: "2027-11-13" },
  // 2028
  { year: 2028, start: "2028-01-24", end: "2028-02-14", sign: "Aquarius ♒", preShadow: "2028-01-08", postShadow: "2028-03-01" },
  { year: 2028, start: "2028-05-21", end: "2028-06-13", sign: "Gemini ♊", preShadow: "2028-05-06", postShadow: "2028-06-30" },
  { year: 2028, start: "2028-09-19", end: "2028-10-11", sign: "Libra ♎", preShadow: "2028-09-01", postShadow: "2028-10-25" },
  // 2029
  { year: 2029, start: "2029-01-07", end: "2029-01-27", sign: "Aquarius/Capricorn ♒♑", preShadow: "2028-12-22", postShadow: "2029-02-12" },
  { year: 2029, start: "2029-05-01", end: "2029-05-25", sign: "Taurus ♉", preShadow: "2029-04-15", postShadow: "2029-06-09" },
  { year: 2029, start: "2029-09-02", end: "2029-09-24", sign: "Libra/Virgo ♎♍", preShadow: "2029-08-13", postShadow: "2029-10-09" },
  { year: 2029, start: "2029-12-22", end: "2030-01-11", sign: "Capricorn ♑", preShadow: "2029-12-04", postShadow: "2030-01-27" },
  // 2030
  { year: 2030, start: "2030-04-12", end: "2030-05-06", sign: "Taurus/Aries ♉♈", preShadow: "2030-03-27", postShadow: "2030-05-22" },
  { year: 2030, start: "2030-08-15", end: "2030-09-08", sign: "Virgo/Leo ♍♌", preShadow: "2030-07-30", postShadow: "2030-09-23" },
  { year: 2030, start: "2030-12-05", end: "2030-12-25", sign: "Capricorn/Sagittarius ♑♐", preShadow: "2030-11-18", postShadow: "2031-01-10" },
];

// ─── HELPERS ───────────────────────────────────────────────────────────────────

function toDate(s: string) { return new Date(s + "T00:00:00"); }

function formatDate(d: Date) {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function formatShort(s: string) {
  const d = toDate(s);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

type Status = "retrograde" | "pre-shadow" | "post-shadow" | "direct";

interface StatusInfo {
  status: Status;
  current: RetrogradePeriod | null;
  next: RetrogradePeriod | null;
  daysUntilNext: number | null;
  daysRemaining: number | null;
  nextEnd: RetrogradePeriod | null;
}

function getStatus(now: Date): StatusInfo {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  for (const rx of RETROGRADES) {
    const start = toDate(rx.start);
    const end = toDate(rx.end);
    const pre = toDate(rx.preShadow);
    const post = toDate(rx.postShadow);

    // Currently retrograde
    if (today >= start && today <= end) {
      const daysRemaining = Math.ceil((end.getTime() - today.getTime()) / 86400000);
      // Find next retrograde after this one
      const nextRx = RETROGRADES.find(r => toDate(r.start) > end) ?? null;
      return { status: "retrograde", current: rx, next: nextRx, daysUntilNext: null, daysRemaining, nextEnd: null };
    }

    // Pre-shadow
    if (today >= pre && today < start) {
      const daysUntilStart = Math.ceil((start.getTime() - today.getTime()) / 86400000);
      return { status: "pre-shadow", current: rx, next: null, daysUntilNext: daysUntilStart, daysRemaining: null, nextEnd: null };
    }

    // Post-shadow
    if (today > end && today <= post) {
      const nextRx = RETROGRADES.find(r => toDate(r.start) > end) ?? null;
      const daysUntilClear = Math.ceil((post.getTime() - today.getTime()) / 86400000);
      return { status: "post-shadow", current: rx, next: nextRx, daysUntilNext: null, daysRemaining: daysUntilClear, nextEnd: null };
    }
  }

  // Direct — find next retrograde
  const next = RETROGRADES.find(r => toDate(r.start) > today) ?? null;
  const daysUntilNext = next ? Math.ceil((toDate(next.start).getTime() - today.getTime()) / 86400000) : null;
  return { status: "direct", current: null, next, daysUntilNext, daysRemaining: null, nextEnd: null };
}

// ─── COUNTDOWN COMPONENT ───────────────────────────────────────────────────────

function Countdown({ targetDate, label }: { targetDate: string; label: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!now) return null;

  const target = new Date(targetDate + "T00:00:00");
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" as const, color: "rgba(232,228,240,0.4)", marginBottom: 12 }}>
        {label}
      </div>
      <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
        {[
          { val: days, unit: "days" },
          { val: hours, unit: "hrs" },
          { val: mins, unit: "min" },
          { val: secs, unit: "sec" },
        ].map(({ val, unit }) => (
          <div key={unit} style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(1.6rem,4vw,2.4rem)", fontWeight: 900,
              color: "#e8e4f0", lineHeight: 1,
              background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: 12, padding: "16px 18px", minWidth: 64,
            }}>
              {String(val).padStart(2, "0")}
            </div>
            <div style={{ fontSize: ".68rem", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase" as const, color: "rgba(232,228,240,0.3)", marginTop: 6 }}>
              {unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STATUS HERO ───────────────────────────────────────────────────────────────

export default function MercuryStatusHero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const info = useMemo(() => {
    if (!mounted) return null;
    return getStatus(new Date());
  }, [mounted]);

  if (!info) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>☿</div>
        <div style={{ fontSize: ".9rem", color: "rgba(232,228,240,0.4)" }}>Checking Mercury&apos;s position…</div>
      </div>
    );
  }

  const { status, current, next, daysUntilNext, daysRemaining } = info;

  const isRetro = status === "retrograde";
  const isShadow = status === "pre-shadow" || status === "post-shadow";

  return (
    <div style={{ textAlign: "center" }}>
      {/* ── BIG STATUS ── */}
      <div style={{
        display: "inline-block", padding: "48px 64px", borderRadius: 28, marginBottom: 32,
        background: isRetro
          ? "linear-gradient(165deg,rgba(212,83,126,0.08),rgba(107,47,212,0.06))"
          : isShadow
            ? "linear-gradient(165deg,rgba(240,184,74,0.06),rgba(107,47,212,0.04))"
            : "linear-gradient(165deg,rgba(93,202,165,0.06),rgba(107,47,212,0.04))",
        border: `1px solid ${isRetro ? "rgba(212,83,126,0.25)" : isShadow ? "rgba(240,184,74,0.2)" : "rgba(93,202,165,0.2)"}`,
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: isRetro
            ? "linear-gradient(90deg,transparent,#d4537e,#6b2fd4,transparent)"
            : isShadow
              ? "linear-gradient(90deg,transparent,#F0B84A,#d4537e,transparent)"
              : "linear-gradient(90deg,transparent,#5dcaa5,#6b2fd4,transparent)",
        }} />
        <div style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase" as const, marginBottom: 16, color: isRetro ? "#d4537e" : isShadow ? "#F0B84A" : "#5dcaa5" }}>
          Is Mercury retrograde right now?
        </div>
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(4rem,12vw,7rem)",
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          background: isRetro
            ? "linear-gradient(135deg,#d4537e,#f0b84a)"
            : isShadow
              ? "linear-gradient(135deg,#F0B84A,#d4537e)"
              : "linear-gradient(135deg,#5dcaa5,#6b2fd4)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          {isRetro ? "YES" : "NO"}
        </div>
        {isShadow && (
          <div style={{ fontSize: ".82rem", color: "rgba(240,184,74,0.8)", marginTop: 12, fontStyle: "italic" }}>
            …but we&apos;re in the {status === "pre-shadow" ? "pre-retrograde" : "post-retrograde"} shadow
          </div>
        )}
      </div>

      {/* ── CONTEXT LINE ── */}
      <div style={{ maxWidth: 640, margin: "0 auto 8px" }}>
        {isRetro && current && (
          <>
            <p style={{ fontSize: "1.1rem", color: "#e8e4f0", lineHeight: 1.65, marginBottom: 8 }}>
              Mercury is retrograde in <strong>{current.sign}</strong> right now.
              {daysRemaining !== null && <> It goes direct in <strong>{daysRemaining} day{daysRemaining !== 1 ? "s" : ""}</strong> on {formatDate(toDate(current.end))}.</>}
            </p>
            <p style={{ fontSize: ".88rem", color: "rgba(232,228,240,0.5)", lineHeight: 1.6 }}>
              Post-shadow clears {formatDate(toDate(current.postShadow))}. Full clarity returns after that.
            </p>
            <Countdown targetDate={current.end} label="Mercury goes direct in" />
          </>
        )}

        {status === "pre-shadow" && current && (
          <>
            <p style={{ fontSize: "1.1rem", color: "#e8e4f0", lineHeight: 1.65, marginBottom: 8 }}>
              Mercury isn&apos;t technically retrograde yet, but the <strong>pre-shadow</strong> started {formatDate(toDate(current.preShadow))}.
              The retrograde in <strong>{current.sign}</strong> begins in <strong>{daysUntilNext} day{daysUntilNext !== 1 ? "s" : ""}</strong>.
            </p>
            <p style={{ fontSize: ".88rem", color: "rgba(232,228,240,0.5)", lineHeight: 1.6 }}>
              You may already be noticing the themes: miscommunication, delays, and things from the past resurfacing.
            </p>
            <Countdown targetDate={current.start} label="Retrograde officially starts in" />
          </>
        )}

        {status === "post-shadow" && current && (
          <>
            <p style={{ fontSize: "1.1rem", color: "#e8e4f0", lineHeight: 1.65, marginBottom: 8 }}>
              Mercury went direct on {formatDate(toDate(current.end))}, but we&apos;re still in the <strong>post-shadow</strong>.
              Full clarity returns in <strong>{daysRemaining} day{daysRemaining !== 1 ? "s" : ""}</strong> on {formatDate(toDate(current.postShadow))}.
            </p>
            <p style={{ fontSize: ".88rem", color: "rgba(232,228,240,0.5)", lineHeight: 1.6 }}>
              Things are clearing up, but retrograde lessons are still integrating. Don&apos;t rush big decisions just yet.
            </p>
            <Countdown targetDate={current.postShadow} label="Post-shadow clears in" />
          </>
        )}

        {status === "direct" && next && (
          <>
            <p style={{ fontSize: "1.1rem", color: "#e8e4f0", lineHeight: 1.65, marginBottom: 8 }}>
              Mercury is moving direct. Communication is flowing, contracts are safe to sign, and your emails are going
              where they&apos;re supposed to. Enjoy it.
            </p>
            <p style={{ fontSize: ".88rem", color: "rgba(232,228,240,0.5)", lineHeight: 1.6, marginBottom: 0 }}>
              Next retrograde: <strong>{next.sign}</strong> starting {formatDate(toDate(next.start))} — that&apos;s <strong>{daysUntilNext} day{daysUntilNext !== 1 ? "s" : ""}</strong> from now.
              {next.year === 2026 && <> Pre-shadow begins {formatDate(toDate(next.preShadow))}.</>}
            </p>
            <Countdown targetDate={next.start} label="Next retrograde begins in" />
          </>
        )}
      </div>

      {/* ── UPCOMING TABLE ── */}
      <div style={{ marginTop: 56, maxWidth: 900, marginLeft: "auto", marginRight: "auto" }}>
        <div style={{ fontSize: ".72rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" as const, color: "rgba(232,228,240,0.35)", marginBottom: 16 }}>
          All Mercury retrogrades · 2026 – 2030
        </div>
        <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                  {["Year", "Retrograde Period", "Sign", "Pre-Shadow", "Post-Shadow"].map(h => (
                    <th key={h} style={{
                      fontSize: ".68rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase" as const,
                      color: "rgba(232,228,240,0.4)", padding: "14px 16px", textAlign: "left",
                      borderBottom: "1px solid rgba(255,255,255,0.08)", whiteSpace: "nowrap",
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RETROGRADES.filter(r => r.year >= 2026).map((rx, i) => {
                  const now = new Date();
                  const isActive = now >= toDate(rx.start) && now <= toDate(rx.end);
                  const isPast = now > toDate(rx.end);
                  return (
                    <tr key={i} style={{
                      borderBottom: "0.5px solid rgba(255,255,255,0.04)",
                      background: isActive ? "rgba(212,83,126,0.06)" : "transparent",
                      opacity: isPast ? 0.5 : 1,
                    }}>
                      <td style={{ padding: "12px 16px", fontSize: ".88rem", color: "#e8e4f0", fontWeight: 600 }}>
                        {rx.year}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: ".86rem", color: "rgba(232,228,240,0.72)", whiteSpace: "nowrap" }}>
                        {formatShort(rx.start)} – {formatShort(rx.end)}
                        {isActive && <span style={{ marginLeft: 8, fontSize: ".65rem", fontWeight: 700, color: "#d4537e", textTransform: "uppercase" as const, letterSpacing: ".08em" }}>● ACTIVE</span>}
                        {isPast && <span style={{ marginLeft: 8, fontSize: ".65rem", color: "rgba(232,228,240,0.3)" }}>✓</span>}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: ".86rem", color: "rgba(232,228,240,0.72)" }}>
                        {rx.sign}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: ".82rem", color: "rgba(232,228,240,0.45)", whiteSpace: "nowrap" }}>
                        {formatShort(rx.preShadow)}
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: ".82rem", color: "rgba(232,228,240,0.45)", whiteSpace: "nowrap" }}>
                        {formatShort(rx.postShadow)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}