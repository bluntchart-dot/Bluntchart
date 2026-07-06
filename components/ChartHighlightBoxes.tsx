"use client";

import type { ChartHighlights, HighlightEntry } from "@/lib/chart-calculator";

const ELEMENT_MAP: Record<string, string> = {
  Aries:"Fire", Leo:"Fire", Sagittarius:"Fire",
  Taurus:"Earth", Virgo:"Earth", Capricorn:"Earth",
  Gemini:"Air", Libra:"Air", Aquarius:"Air",
  Cancer:"Water", Scorpio:"Water", Pisces:"Water",
};

const ELEMENT_COLOR: Record<string, string> = {
  Fire:"#f0956a", Earth:"#7ec88a", Air:"#7ab4e0", Water:"#a48ae8",
};

function signColor(sign: string): string {
  return ELEMENT_COLOR[ELEMENT_MAP[sign] ?? ""] ?? "#e8e4f0";
}

const PLANET_ICON: Record<string, string> = {
  Sun: "☉", Moon: "☽", Rising: "↑",
  Mercury: "☿", Venus: "♀", Mars: "♂",
};

/* Short description shown under each Big 3 sign name */
const BIG3_DESC: Record<string, string> = {
  Sun:    "Your core identity — who you are at your most essential.",
  Moon:   "Your emotional wiring — how you feel and what you need privately.",
  Rising: "Your first impression — how the world sees you before you say a word.",
};

interface Props {
  highlights: ChartHighlights;
  showHeading?: boolean;
}

export default function ChartHighlightBoxes({ highlights, showHeading = true }: Props) {
  const { big3, keyPlanets } = highlights;
  const big3List: HighlightEntry[] = [big3.sun, big3.moon, big3.rising];

  return (
    <div style={{ width: "100%" }}>

      {showHeading && (
        <div style={{ marginBottom: 24 }}>
          <h2 style={{
            fontFamily: "var(--font-display, 'Playfair Display', Georgia, serif)",
            fontSize: "clamp(2.4rem, 5.5vw, 3.4rem)",
            fontWeight: 800,
            color: "#f5f2fa",
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            marginBottom: 8,
          }}>
            Your Big 3
          </h2>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
            Sun · Moon · Rising — the three placements that define you most
          </p>
        </div>
      )}

      {/* ── Big 3 cards ── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 12,
        marginBottom: 12,
      }}>
        {big3List.map((entry) => {
          const color = signColor(entry.sign);
          const icon = PLANET_ICON[entry.label] ?? "";
          const desc = BIG3_DESC[entry.label] ?? "";

          return (
            <div key={entry.label} style={{
              borderRadius: 16,
              border: "0.5px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.02)",
              padding: "20px 18px",
              display: "flex",
              flexDirection: "column",
              gap: 0,
            }}>
              {/* Label row */}
              <div style={{
                display: "flex", alignItems: "center", gap: 6, marginBottom: 12,
              }}>
                <span style={{
                  fontSize: 13, color: "rgba(255,255,255,0.4)",
                  fontFamily: "Georgia, serif",
                }}>
                  {icon}
                </span>
                <span style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.35)",
                }}>
                  {entry.label}
                </span>
              </div>

              {/* Sign name — hero */}
              <div style={{
                fontSize: "clamp(1.3rem, 2.5vw, 1.6rem)",
                fontWeight: 700, color,
                letterSpacing: "-0.01em", lineHeight: 1.1,
                marginBottom: 4,
              }}>
                {entry.sign}
              </div>

              {/* Degree */}
              <div style={{
                fontSize: 11, color: "rgba(255,255,255,0.25)", marginBottom: 12,
              }}>
                {entry.degree}°
                {entry.retrograde && (
                  <span style={{ marginLeft: 4, color: "#f0a0b8", fontSize: 9, fontWeight: 700 }}>
                    Rx
                  </span>
                )}
              </div>

              {/* Short description — NEW */}
              <p style={{
                fontSize: 11.5, color: "rgba(255,255,255,0.38)",
                lineHeight: 1.55, marginTop: "auto",
                paddingTop: 10,
                borderTop: "0.5px solid rgba(255,255,255,0.05)",
              }}>
                {desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Mercury / Venus / Mars chips ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
        {keyPlanets.map((entry) => {
          const color = signColor(entry.sign);
          const icon = PLANET_ICON[entry.label] ?? "";
          return (
            <div key={entry.label} style={{
              borderRadius: 10,
              border: "0.5px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.02)",
              padding: "10px 12px",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{
                fontSize: 12, color: "rgba(255,255,255,0.3)",
                fontFamily: "Georgia, serif",
              }}>
                {icon}
              </span>
              <div>
                <div style={{
                  fontSize: 9, fontWeight: 700, letterSpacing: "0.12em",
                  textTransform: "uppercase", color: "rgba(255,255,255,0.28)",
                  marginBottom: 2,
                }}>
                  {entry.label}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color }}>
                  {entry.sign}
                  {entry.retrograde && (
                    <span style={{ marginLeft: 4, fontSize: 9, color: "#f0a0b8", fontWeight: 700 }}>
                      Rx
                    </span>
                  )}
                </div>
              </div>
              {entry.house !== null && (
                <span style={{
                  marginLeft: "auto", fontSize: 10,
                  color: "rgba(255,255,255,0.18)",
                }}>
                  H{entry.house}
                </span>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}