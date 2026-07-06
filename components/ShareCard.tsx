"use client";

import { useRef, useState } from "react";

/* ─── Types ─────────────────────────────────────────────────────────────── */

export interface ShareCardData {
  name: string;

  /**
   * NEW primary field. The one bold flex statement displayed on the card.
   * If omitted, the component falls back to `line1` for backward compatibility.
   */
  flexLine?: string;

  /* ── Legacy fields kept for backward compatibility ──
     These are still accepted from the existing prompt pipeline but are no
     longer rendered on the card itself. Email templates or other downstream
     consumers can still read them. */
  keyword?: string;
  line1?: string;
  line2?: string;
  line3?: string;
  quote?: string;
  sun?: string;
  moon?: string;
  rising?: string;
}

/* ─── Subtle star dots ───────────────────────────────────────────────────── */

const STARS = [
  { x:  6, y:  7, s: 1.2, o: 0.35 },
  { x: 93, y: 10, s: 1,   o: 0.25 },
  { x: 14, y: 28, s: 0.8, o: 0.3 },
  { x: 88, y: 22, s: 1.2, o: 0.2 },
  { x:  4, y: 55, s: 1,   o: 0.25 },
  { x: 95, y: 48, s: 0.8, o: 0.3 },
  { x: 22, y: 82, s: 1.2, o: 0.2 },
  { x: 78, y: 75, s: 1,   o: 0.3 },
  { x: 50, y:  4, s: 0.8, o: 0.35 },
  { x: 36, y: 93, s: 1,   o: 0.2 },
  { x: 65, y: 90, s: 0.8, o: 0.25 },
  { x: 72, y: 16, s: 1,   o: 0.2 },
];

/* ─── Capture ────────────────────────────────────────────────────────────── */

const CAPTURE_SCALE = 3;
const CARD_RADIUS_PX = 16;

async function captureCard(el: HTMLDivElement): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import("html2canvas");
  const raw = await html2canvas(el, {
    scale: CAPTURE_SCALE,
    backgroundColor: "#09090f",
    logging: false,
    useCORS: true,
    allowTaint: true,
  });

  // html2canvas does not reliably apply the captured element's own
  // border-radius to the exported canvas (well documented limitation:
  // it clips descendants relative to their ancestors, but the root
  // capture target itself comes out as a plain rectangle). Re-clip the
  // raw capture to a rounded rect ourselves so the download always has
  // rounded corners regardless of what html2canvas did internally.
  const radius = CARD_RADIUS_PX * CAPTURE_SCALE;
  const rounded = document.createElement("canvas");
  rounded.width = raw.width;
  rounded.height = raw.height;
  const ctx = rounded.getContext("2d");
  if (!ctx) return raw;

  ctx.beginPath();
  ctx.moveTo(radius, 0);
  ctx.arcTo(rounded.width, 0, rounded.width, rounded.height, radius);
  ctx.arcTo(rounded.width, rounded.height, 0, rounded.height, radius);
  ctx.arcTo(0, rounded.height, 0, 0, radius);
  ctx.arcTo(0, 0, rounded.width, 0, radius);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(raw, 0, 0);
  return rounded;
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function ShareCard(props: ShareCardData) {
  const { name } = props;

  // Primary content: prefer new flexLine, fall back to legacy line1.
  // Strip any em-dashes or en-dashes the model might still slip in.
  const rawFlex = (props.flexLine || props.line1 || "").trim();
  const flexLine = rawFlex.replace(/[\u2013\u2014]/g, ".").replace(/\s+\./g, ".");

  const cardRef = useRef<HTMLDivElement>(null);
  const [dlState, setDlState] = useState<"idle" | "busy">("idle");
  const [shrState, setShrState] = useState<"idle" | "busy">("idle");
  const [copied, setCopied] = useState(false);

  const slug = name.toLowerCase().replace(/\s+/g, "-");

  async function handleDownload() {
    if (!cardRef.current || dlState === "busy") return;
    setDlState("busy");
    try {
      const canvas = await captureCard(cardRef.current);
      const link = document.createElement("a");
      link.download = `bluntchart-${slug}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("[ShareCard] download error:", err);
      alert("Download failed. Try long-pressing the card and saving the image.");
    } finally {
      setDlState("idle");
    }
  }

  async function handleShare() {
    if (!cardRef.current || shrState === "busy") return;
    setShrState("busy");
    try {
      const canvas = await captureCard(cardRef.current);
      const blob: Blob = await new Promise((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/png")
      );
      const file = new File([blob], `bluntchart-${slug}.png`, { type: "image/png" });

      if (
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: "My BluntChart",
          text: flexLine ? `${flexLine}  ·  bluntchart.com` : "bluntchart.com",
        });
      } else if (typeof navigator.share === "function") {
        await navigator.share({
          title: "My BluntChart",
          text: flexLine,
          url: window.location.href,
        });
      } else {
        await handleDownload();
      }
    } catch (err) {
      const e = err as Error;
      if (e.name !== "AbortError" && e.name !== "NotAllowedError") {
        console.error("[ShareCard] share error:", err);
        await handleDownload();
      }
    } finally {
      setShrState("idle");
    }
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="mx-auto w-full max-w-[420px]">

      {/* ═══════════════════════════════════════════════
          THE CARD. Flex statement only.
          4:5 aspect ratio. Dark cosmic theme.

          NOTE: sized via the padding-percentage trick, not the CSS
          `aspect-ratio` property. html2canvas (used by Share/Save below)
          does not reliably measure `aspect-ratio`-sized boxes, so the
          captured canvas ends up a different height than the live DOM.
          That mismatch shifts the negatively-offset glow divs and the
          border-radius clip relative to where they render on screen,
          which is why the download looked different from the live card.
          Padding-percentage resolves to real pixels everywhere, so the
          capture matches the live card exactly.
      ═══════════════════════════════════════════════ */}
      <div style={{ position: "relative", width: "100%", paddingTop: "125%" }}>
      <div
        ref={cardRef}
        style={{
          position: "absolute",
          inset: 0,
          background: "#09090f",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          borderRadius: "16px",
          border: "1px solid rgba(196,168,255,0.15)",
        }}
      >
        {/* Subtle top-left purple glow */}
        <div style={{
          position: "absolute", top: "-20%", left: "-15%",
          width: "55%", height: "50%",
          background: "radial-gradient(circle, rgba(107,47,212,0.12) 0%, transparent 65%)",
          pointerEvents: "none",
        }} />

        {/* Subtle bottom-right amber glow */}
        <div style={{
          position: "absolute", bottom: "-15%", right: "-10%",
          width: "55%", height: "45%",
          background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 60%)",
          pointerEvents: "none",
        }} />

        {/* Stars */}
        {STARS.map((st, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: `${st.s}px`,
            height: `${st.s}px`,
            borderRadius: "50%",
            background: "#fff",
            opacity: st.o,
            pointerEvents: "none",
          }} />
        ))}

        {/* Content layout */}
        <div style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "9% 9% 7%",
          color: "#e8e4f0",
        }}>

          {/* Logo */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}>
            <span style={{ color: "#f59e0b", fontSize: "13px" }}>✦</span>
            <span style={{
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              fontFamily: "system-ui, -apple-system, sans-serif",
              color: "#e8e4f0",
            }}>BluntChart</span>
          </div>

          {/* Flex block. Pushed toward visual center. */}
          <div style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: "6%",
          }}>
            {/* Name */}
            <h1 style={{
              fontSize: "clamp(46px, 16vw, 84px)",
              fontWeight: 900,
              letterSpacing: "-0.015em",
              lineHeight: 0.92,
              fontFamily: "Georgia, 'Times New Roman', serif",
              color: "#ffffff",
              marginBottom: "6%",
            }}>
              {name}
            </h1>

            {/* Thin gradient divider */}
            <div style={{
              width: "48px",
              height: "2px",
              // Explicit percentage stops: html2canvas has a known gap
              // parsing multi-stop gradients that omit stop positions,
              // which can render as blank/missing in the exported image.
              background: "linear-gradient(90deg, #f59e0b 0%, #ec4899 50%, #8b5cf6 100%)",
              marginBottom: "7%",
              borderRadius: "1px",
            }} />

            {/* THE FLEX LINE */}
            {flexLine && (
              <p style={{
                fontSize: "clamp(17px, 4.6vw, 24px)",
                fontWeight: 500,
                lineHeight: 1.32,
                fontFamily: "Georgia, 'Times New Roman', serif",
                color: "#ffffff",
                letterSpacing: "-0.005em",
              }}>
                {flexLine}
              </p>
            )}
          </div>

          {/* Footer */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: "4%",
          }}>
            <span style={{
              fontSize: "10px",
              color: "rgba(232,228,240,0.35)",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.05em",
              fontStyle: "italic",
            }}>read on bluntchart.com</span>
            <span style={{
              fontSize: "10px",
              color: "rgba(232,228,240,0.5)",
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "0.12em",
              fontWeight: 700,
              textTransform: "uppercase",
            }}>my chart</span>
          </div>

        </div>
      </div>
      </div>

      {/* ═══════════════════════════════════════════════
          ACTION BUTTONS. Functional UI, not on the card.
      ═══════════════════════════════════════════════ */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <button
          onClick={handleShare}
          disabled={shrState === "busy"}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-[#6b2fd4] py-3.5 text-xs font-bold text-white transition hover:bg-[#7c3aed] active:scale-[0.97] disabled:opacity-50"
        >
          {shrState === "busy" ? "Sharing…" : (
            <>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Share
            </>
          )}
        </button>

        <button
          onClick={handleDownload}
          disabled={dlState === "busy"}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-[#f59e0b] py-3.5 text-xs font-bold text-black transition hover:bg-amber-400 active:scale-[0.97] disabled:opacity-50"
        >
          {dlState === "busy" ? "Saving…" : (
            <>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Save
            </>
          )}
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.06] py-3.5 text-xs font-bold text-white/70 transition hover:bg-white/[0.1] active:scale-[0.97]"
        >
          {copied ? (
            <span className="text-green-400">✓ Copied</span>
          ) : (
            <>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
    </div>
  );
}