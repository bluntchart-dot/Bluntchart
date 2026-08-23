"use client";

import { ReadingText } from "@/components/ReadingText";
import { normalizeReadingCopy } from "@/lib/normalize-reading-copy";

/* ─── Types ─────────────────────────────────────────────────────────────── */

export interface PreviewInsight {
  planet:    string;
  colorKey?: string;
  truth:     string;
  hook?:     string;
  explain?:  string;
  action?:   string;
  reveal?:   string;
  cliffhanger?: string;
}

/* ─── Color mapping ─────────────────────────────────────────────────────── */

const DOT_COLORS: Record<string, string> = {
  sun:     "#F4C878",
  moon:    "#C8B8EC",
  rising:  "#B898EC",
  venus:   "#EC96B4",
  mars:    "#F0A87A",
  mercury: "#82DCBA",
  saturn:  "#AAA4C8",
  jupiter: "#F0E09A",
};

function inferColorKey(
  planetOrTheme: string | undefined,
  index: number
): string {
  if (!planetOrTheme)
    return Object.keys(DOT_COLORS)[index % Object.keys(DOT_COLORS).length] ?? "sun";
  const t = planetOrTheme.toLowerCase();
  for (const k of Object.keys(DOT_COLORS)) {
    if (t.includes(k)) return k;
  }
  return index === 0 ? "venus" : "sun";
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export function PreviewReadingStage({
  fname,
  preview,
  letterOpener,
  onUnlock,
}: {
  fname:         string;
  preview:       PreviewInsight[];
  letterOpener?: string;
  onUnlock:      () => void;
}) {
  const displayName = fname.trim() || "You";

  const ins = preview[0];
  if (!ins) return null;

  const colorKey = ins.colorKey?.trim() || inferColorKey(ins.planet, 0);
  const accent = DOT_COLORS[colorKey] || "#EC96B4";
  const truth = normalizeReadingCopy(ins.truth);

  return (
    <div className="preview-landscape">

      {/* ── Letter opener ── */}
      {letterOpener ? (
        <div className="preview-letter">
          <ReadingText text={normalizeReadingCopy(letterOpener)} />
        </div>
      ) : null}

      {/* ── Header ── */}
      <header className="preview-header">
        <div>
          <p className="preview-eyebrow">Your chart · free discovery</p>
          <h2 className="preview-name">{displayName}</h2>
        </div>
      </header>

      {/* ── Single discovery card ── */}
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <article
          className="preview-panel"
          style={{ borderColor: `${accent}33` }}
        >
          <p className="preview-theme" style={{ color: accent }}>
            {ins.planet}
          </p>

          {ins.hook ? (
            <p style={{
              fontSize: 15,
              color: "rgba(232,228,240,0.7)",
              fontStyle: "italic",
              lineHeight: 1.6,
              marginBottom: 16,
            }}>
              {ins.hook}
            </p>
          ) : null}

          <div className="preview-truth">
            <ReadingText text={truth} />
          </div>

          {ins.reveal ? (
            <div style={{
              marginTop: 16,
              paddingTop: 16,
              borderTop: "0.5px solid rgba(255,255,255,0.06)",
            }}>
              <ReadingText text={normalizeReadingCopy(ins.reveal)} />
            </div>
          ) : null}

          {/* ── Curiosity gap + CTA ── */}
          <div style={{
            marginTop: 28,
            paddingTop: 24,
            borderTop: "0.5px solid rgba(255,255,255,0.08)",
            textAlign: "center",
          }}>
            {ins.cliffhanger ? (
              <p style={{
                color: "#c4a8ff",
                fontSize: 13,
                lineHeight: 1.6,
                maxWidth: 360,
                margin: "0 auto 20px",
                opacity: 0.9,
              }}>
                {ins.cliffhanger}
              </p>
            ) : null}

            <button
              onClick={onUnlock}
              style={{
                display: "block",
                width: "100%",
                maxWidth: 360,
                margin: "0 auto",
                background: "linear-gradient(135deg,#f0b84a,#e8854a)",
                color: "#0d0800",
                fontWeight: 700,
                padding: "16px 20px",
                borderRadius: 12,
                fontSize: 15,
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.2px",
                fontFamily: "inherit",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLButtonElement).style.opacity = "0.9")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLButtonElement).style.opacity = "1")
              }
            >
              Show Me The Full Pattern →
            </button>

            <p style={{
              color: "#6b6585",
              fontSize: 11,
              letterSpacing: "0.04em",
              marginTop: 12,
            }}>
              10 complete insights · Personalized to your chart · One-time payment
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}
