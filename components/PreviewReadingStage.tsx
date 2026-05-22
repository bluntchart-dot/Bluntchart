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
  return index === 0 ? "sun" : "moon";
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export function PreviewReadingStage({
  fname,
  preview,
  letterOpener,
  onUnlock,          // ← passed from app/page.tsx; triggers payment flow
}: {
  fname:         string;
  preview:       PreviewInsight[];
  letterOpener?: string;
  onUnlock:      () => void;
}) {
  const displayName = fname.trim() || "You";

  const beats = preview.slice(0, 2).map((ins, i) => ({
    ...ins,
    colorKey: ins.colorKey?.trim() || inferColorKey(ins.planet, i),
    truth:    normalizeReadingCopy(ins.truth),
    explain:  ins.explain ? normalizeReadingCopy(ins.explain) : "",
    action:   ins.action?.trim() ?? "",
  }));

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
          <p className="preview-eyebrow">Your chart · free preview</p>
          <h2 className="preview-name">{displayName}</h2>
        </div>
        <p className="preview-count">2 of 10 insights</p>
      </header>

      {/* ── Two-panel grid ── */}
      <div className="preview-grid">
        {beats.map((ins, i) => {
          const accent = DOT_COLORS[ins.colorKey] || "#EC96B4";

          const plainExplain = ins.explain.includes("In simple words:")
            ? ins.explain.split("In simple words:")[1]?.trim() ?? ins.explain
            : ins.explain;

          /* ════════════════════════════════════════
             INSIGHT 1 — full, no restrictions
          ════════════════════════════════════════ */
          if (i === 0) {
            return (
              <article
                key={i}
                className="preview-panel"
                style={{ borderColor: `${accent}33` }}
              >
                <p className="preview-theme" style={{ color: accent }}>
                  {ins.planet}
                </p>

                <div className="preview-truth">
                  <ReadingText text={ins.truth} />
                </div>

                {plainExplain ? (
                  <div className="preview-explain">
                    <span className="preview-explain-label">In simple words</span>
                    <ReadingText text={plainExplain} />
                  </div>
                ) : null}

                {ins.action ? (
                  <p className="preview-action">
                    <span>This week</span>
                    {ins.action}
                  </p>
                ) : null}
              </article>
            );
          }

          /* ════════════════════════════════════════
             INSIGHT 2 — blurs at line ~5, paywall CTA
             The content renders in full so the blur
             reveals tantalizingly partial text.
          ════════════════════════════════════════ */
          return (
            <article
              key={i}
              className="preview-panel"
              style={{
                borderColor: `${accent}33`,
                position:    "relative",
                overflow:    "hidden",
                /* Enough height so gradient has room to work */
                minHeight:   "420px",
              }}
            >
              {/* ── Actual content (gets blurred at bottom) ── */}
              <p className="preview-theme" style={{ color: accent }}>
                {ins.planet}
              </p>

              <div className="preview-truth">
                <ReadingText text={ins.truth} />
              </div>

              {/* Render explain + action — they'll sit behind the blur,
                  creating visible-but-unreadable text that adds to curiosity */}
              {plainExplain ? (
                <div className="preview-explain">
                  <span className="preview-explain-label">In simple words</span>
                  <ReadingText text={plainExplain} />
                </div>
              ) : null}

              {ins.action ? (
                <p className="preview-action">
                  <span>This week</span>
                  {ins.action}
                </p>
              ) : null}

              {/* ── Gradient fade — starts at 45%, fully opaque at 75% ── */}
              <div
                aria-hidden="true"
                style={{
                  position:   "absolute",
                  bottom:     0,
                  left:       0,
                  right:      0,
                  height:     "72%",
                  background: "linear-gradient(to bottom, transparent 0%, rgba(9,9,15,0.85) 45%, #09090f 70%)",
                  pointerEvents: "none",
                  zIndex:     1,
                }}
              />

              {/* ── Paywall CTA — sits on top of the gradient ── */}
              <div
                style={{
                  position:        "absolute",
                  bottom:          0,
                  left:            0,
                  right:           0,
                  padding:         "20px 16px 24px",
                  display:         "flex",
                  flexDirection:   "column",
                  alignItems:      "center",
                  gap:             "10px",
                  zIndex:          2,
                  textAlign:       "center",
                }}
              >
                {/* Cliffhanger line */}
                {ins.cliffhanger ? (
                  <p
                    style={{
                      color:      "#c4a8ff",
                      fontSize:   "12px",
                      lineHeight: 1.5,
                      maxWidth:   "240px",
                      opacity:    0.9,
                    }}
                  >
                    🔒 {ins.cliffhanger}
                  </p>
                ) : (
                  <p style={{ color: "#c4a8ff", fontSize: "12px", opacity: 0.9 }}>
                    🔒 This is where it gets specific to you
                  </p>
                )}

                {/* Unlock button */}
                <button
                  onClick={onUnlock}
                  style={{
                    background:    "#f59e0b",
                    color:         "#000",
                    fontWeight:    700,
                    padding:       "13px 0",
                    borderRadius:  "999px",
                    fontSize:      "14px",
                    border:        "none",
                    cursor:        "pointer",
                    width:         "100%",
                    maxWidth:      "260px",
                    letterSpacing: "0.01em",
                    transition:    "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    ((e.target as HTMLButtonElement).style.background = "#fbbf24")
                  }
                  onMouseLeave={(e) =>
                    ((e.target as HTMLButtonElement).style.background = "#f59e0b")
                  }
                >
                  Unlock Full Reading — $15
                </button>

                {/* Sub-label */}
                <p
                  style={{
                    color:          "#6b6585",
                    fontSize:       "10px",
                    letterSpacing:  "0.06em",
                    textTransform:  "uppercase",
                  }}
                >
                  10 insights · shareable card · one-time payment
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}