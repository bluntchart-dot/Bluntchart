"use client";

import { useRef, useState } from "react";

/* ─── Types ─────────────────────────────────────────────────────────────── */

export interface ShareCardData {
  name:     string;
  keyword:  string;
  line1:    string;   // white bold  — the defense / reframe
  line2:    string;   // amber       — shadow truth
  line3:    string;   // italic muted — gentle closer
  quote:    string;   // bottom quote — the shareable truth
  sun?:     string;   // e.g. "Gemini"
  moon?:    string;   // e.g. "Virgo"
  rising?:  string;   // e.g. "Leo"
}

/* ─── Star seed (fixed positions for consistent look) ────────────────────── */

const STARS = [
  { x:  7, y:  5, s: 2,   o: 0.45 },
  { x: 91, y: 11, s: 1.5, o: 0.30 },
  { x: 14, y: 33, s: 1,   o: 0.50 },
  { x: 84, y: 26, s: 2,   o: 0.35 },
  { x:  4, y: 62, s: 1.5, o: 0.30 },
  { x: 95, y: 52, s: 1,   o: 0.45 },
  { x: 22, y: 80, s: 2,   o: 0.25 },
  { x: 76, y: 76, s: 1.5, o: 0.40 },
  { x: 50, y:  4, s: 1,   o: 0.50 },
  { x: 34, y: 91, s: 2,   o: 0.30 },
  { x: 66, y: 88, s: 1,   o: 0.35 },
  { x: 88, y: 41, s: 1.5, o: 0.25 },
  { x: 42, y: 18, s: 1,   o: 0.40 },
  { x: 60, y: 60, s: 1.5, o: 0.20 },
  { x: 28, y: 48, s: 1,   o: 0.28 },
  { x: 72, y: 15, s: 2,   o: 0.25 },
];

/* ─── Helpers ────────────────────────────────────────────────────────────── */

/** Capture the card div as a high-res canvas. */
async function captureCard(el: HTMLDivElement): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import("html2canvas");
  return html2canvas(el, {
    scale: 3,                     // 3× → crisp on retina + Instagram quality
    backgroundColor: "#0e0c2e",  // matches card bg; avoids transparent bleed
    logging: false,
    useCORS: true,
    allowTaint: true,
  });
}

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function ShareCard({
  name,
  keyword,
  line1,
  line2,
  line3,
  quote,
  sun,
  moon,
  rising,
}: ShareCardData) {
  const cardRef   = useRef<HTMLDivElement>(null);
  const [dlState,  setDlState]  = useState<"idle" | "busy">("idle");
  const [shrState, setShrState] = useState<"idle" | "busy">("idle");
  const [copied,   setCopied]   = useState(false);

  const slug = name.toLowerCase().replace(/\s+/g, "-");

  const chartLine = [
    sun    && `☉ ${sun}`,
    moon   && `☽ ${moon}`,
    rising && `↑ ${rising}`,
  ]
    .filter(Boolean)
    .join("  ·  ");

  /* ── Download as PNG ── */
  async function handleDownload() {
    if (!cardRef.current || dlState === "busy") return;
    setDlState("busy");
    try {
      const canvas = await captureCard(cardRef.current);
      const link   = document.createElement("a");
      link.download = `bluntchart-${slug}.png`;
      link.href     = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("[ShareCard] download error:", err);
      alert("Download failed. Try long-pressing the card and saving the image.");
    } finally {
      setDlState("idle");
    }
  }

  /* ── Share via native sheet (WhatsApp / Instagram / etc.) ── */
  async function handleShare() {
    if (!cardRef.current || shrState === "busy") return;
    setShrState("busy");
    try {
      const canvas = await captureCard(cardRef.current);

      // canvas → Blob
      const blob: Blob = await new Promise((res, rej) =>
        canvas.toBlob((b) => (b ? res(b) : rej(new Error("toBlob failed"))), "image/png")
      );

      const file = new File([blob], `bluntchart-${slug}.png`, { type: "image/png" });

      if (
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        // Mobile: opens native share sheet → WhatsApp, Instagram, iMessage, etc.
        await navigator.share({
          files: [file],
          title: "My BluntChart Reading",
          text:  `${keyword} — bluntchart.com`,
        });
      } else if (typeof navigator.share === "function") {
        // Desktop browsers that support share but not file-share
        await navigator.share({
          title: "My BluntChart Reading",
          text:  line1,
          url:   window.location.href,
        });
      } else {
        // Last resort: just download
        await handleDownload();
      }
    } catch (err) {
      // User cancelled = AbortError — silently ignore
      if ((err as Error).name !== "AbortError" && (err as Error).name !== "NotAllowedError") {
        console.error("[ShareCard] share error:", err);
        await handleDownload(); // fall back to download
      }
    } finally {
      setShrState("idle");
    }
  }

  /* ── Copy reading link ── */
  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* ignore */
    }
  }

  /* ── Render ── */
  return (
    <div className="mx-auto w-full max-w-[420px]">

      {/* ════════════════════════════════════════════
          THE CARD — inline styles only so html2canvas
          captures it faithfully
      ════════════════════════════════════════════ */}
      <div
        ref={cardRef}
        style={{
          width:        "100%",
          aspectRatio:  "4 / 5",
          background:   "linear-gradient(160deg,#0e0c2e 0%,#14113b 30%,#1a0f3c 65%,#200d3a 100%)",
          position:     "relative",
          overflow:     "hidden",
          display:      "flex",
          flexDirection:"column",
          fontFamily:   "Georgia, 'Times New Roman', serif",
          borderRadius: "16px",
        }}
      >
        {/* Rainbow top border */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "3px",
          background: "linear-gradient(90deg,#f59e0b 0%,#ec4899 25%,#8b5cf6 50%,#3b82f6 75%,#06b6d4 100%)",
        }} />

        {/* Purple glow — bottom right */}
        <div style={{
          position:"absolute", bottom:"-8%", right:"-12%",
          width:"65%", height:"55%",
          background:"radial-gradient(circle,rgba(139,92,246,0.28) 0%,transparent 68%)",
          borderRadius:"50%", pointerEvents:"none",
        }} />

        {/* Pink glow — mid left */}
        <div style={{
          position:"absolute", top:"28%", left:"-18%",
          width:"55%", height:"45%",
          background:"radial-gradient(circle,rgba(236,72,153,0.13) 0%,transparent 68%)",
          borderRadius:"50%", pointerEvents:"none",
        }} />

        {/* Stars */}
        {STARS.map((st, i) => (
          <div key={i} style={{
            position:"absolute", left:`${st.x}%`, top:`${st.y}%`,
            width:`${st.s}px`, height:`${st.s}px`,
            borderRadius:"50%", background:"white", opacity:st.o, pointerEvents:"none",
          }} />
        ))}

        {/* Content */}
        <div style={{
          position:"relative", zIndex:10, flex:1,
          display:"flex", flexDirection:"column",
          padding:"5.5% 7.5%", color:"#e8e4f0",
        }}>

          {/* Logo */}
          <div style={{ display:"flex", alignItems:"center", gap:"7px", marginBottom:"5%" }}>
            <span style={{ color:"#f59e0b", fontSize:"clamp(11px,2.8vw,15px)" }}>✦</span>
            <span style={{
              fontSize:"clamp(12px,3vw,16px)", fontWeight:800,
              letterSpacing:"0.04em", fontFamily:"system-ui,sans-serif", color:"#e8e4f0",
            }}>BluntChart</span>
            <span style={{
              color:"#6b6585", fontSize:"clamp(9px,2.2vw,12px)",
              fontFamily:"system-ui,sans-serif", marginLeft:"2px",
            }}>· your chart read you first.</span>
          </div>

          {/* Name */}
          <div style={{ textAlign:"center", marginBottom:"4%" }}>
            <h1 style={{
              fontSize:"clamp(36px,13vw,80px)", fontWeight:900,
              letterSpacing:"-0.02em", lineHeight:1,
              fontFamily:"Georgia,serif", color:"#f0eaf8", marginBottom:"10px",
            }}>
              {name.toUpperCase()}
            </h1>
            {/* Gold underline */}
            <div style={{
              width:"38%", height:"2px", margin:"0 auto",
              background:"linear-gradient(90deg,transparent,#f59e0b 30%,#f59e0b 70%,transparent)",
            }} />
          </div>

          {/* 3 content lines */}
          <div style={{ textAlign:"center", padding:"0 3%", marginBottom:"4%" }}>
            {line1 && (
              <p style={{
                fontSize:"clamp(13px,3.4vw,18px)", fontWeight:700, lineHeight:1.35,
                marginBottom:"8px", fontFamily:"system-ui,sans-serif", color:"#f0eaf8",
              }}>{line1}</p>
            )}
            {line2 && (
              <p style={{
                fontSize:"clamp(12px,3.1vw,16px)", lineHeight:1.4,
                marginBottom:"7px", color:"#f59e0b",
                fontFamily:"system-ui,sans-serif", fontWeight:500,
              }}>{line2}</p>
            )}
            {line3 && (
              <p style={{
                fontSize:"clamp(11px,2.8vw,15px)", lineHeight:1.4,
                color:"rgba(232,228,240,0.7)", fontStyle:"italic",
                fontFamily:"Georgia,serif",
              }}>{line3}</p>
            )}
          </div>

          {/* Keyword badge */}
          {keyword && (
            <div style={{ display:"flex", justifyContent:"center", marginBottom:"4%" }}>
              <span style={{
                background:"rgba(107,47,212,0.38)",
                border:"1px solid rgba(196,168,255,0.28)",
                borderRadius:"999px",
                padding:"clamp(5px,1.5vw,8px) clamp(14px,4vw,24px)",
                fontSize:"clamp(8px,2vw,11px)", letterSpacing:"0.18em",
                fontWeight:700, fontFamily:"system-ui,sans-serif", color:"#c4a8ff",
              }}>{keyword}</span>
            </div>
          )}

          {/* Divider */}
          <div style={{ borderTop:"1px solid rgba(255,255,255,0.07)", marginBottom:"3.5%" }} />

          {/* Quote */}
          {quote && (
            <div style={{ textAlign:"center", padding:"0 2%", marginBottom:"3.5%" }}>
              <p style={{
                fontSize:"clamp(10px,2.6vw,14px)", fontStyle:"italic",
                color:"rgba(232,228,240,0.65)", lineHeight:1.65,
                fontFamily:"Georgia,serif",
              }}>&ldquo;{quote}&rdquo;</p>
            </div>
          )}

          {/* Spacer */}
          <div style={{ flex:1 }} />

          {/* Footer */}
          <div style={{
            borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:"3%",
            display:"flex", justifyContent:"space-between", alignItems:"flex-end",
          }}>
            <div>
              <p style={{
                fontSize:"clamp(7px,1.7vw,9px)", color:"#6b6585",
                fontFamily:"system-ui,sans-serif", letterSpacing:"0.05em", marginBottom:"3px",
              }}>your chart picked you specifically.</p>
              {chartLine && (
                <p style={{
                  fontSize:"clamp(7px,1.7vw,9px)", color:"#6b6585",
                  fontFamily:"system-ui,sans-serif", letterSpacing:"0.04em",
                }}>{chartLine}</p>
              )}
            </div>
            <p style={{
              fontSize:"clamp(8px,1.9vw,10px)", color:"#6b6585",
              fontFamily:"system-ui,sans-serif", letterSpacing:"0.1em",
            }}>bluntchart.com</p>
          </div>

        </div>{/* /content */}
      </div>{/* /card */}

      {/* ════════════════════════════════════════════
          ACTION BUTTONS
      ════════════════════════════════════════════ */}
      <div className="mt-4 grid grid-cols-3 gap-2">

        {/* Share — opens native sheet on mobile */}
        <button
          onClick={handleShare}
          disabled={shrState === "busy"}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-[#6b2fd4] py-3 text-xs font-semibold text-white transition hover:bg-[#7c3aed] disabled:opacity-50"
        >
          {shrState === "busy" ? (
            <span className="opacity-70">Sharing…</span>
          ) : (
            <>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Share
            </>
          )}
        </button>

        {/* Download */}
        <button
          onClick={handleDownload}
          disabled={dlState === "busy"}
          className="flex items-center justify-center gap-1.5 rounded-lg bg-[#f59e0b] py-3 text-xs font-semibold text-black transition hover:bg-amber-400 disabled:opacity-50"
        >
          {dlState === "busy" ? (
            <span className="opacity-70">Saving…</span>
          ) : (
            <>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Save
            </>
          )}
        </button>

        {/* Copy link */}
        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/5 py-3 text-xs font-semibold text-white/70 transition hover:bg-white/10"
        >
          {copied ? (
            <>
              <svg width="13" height="13" fill="none" stroke="#4ade80" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Copy Link
            </>
          )}
        </button>

      </div>

      {/* Platform hint */}
      <p className="mt-2 text-center text-[10px] text-[#6b6585]">
        Share opens WhatsApp, Instagram & more · Save downloads PNG
      </p>
    </div>
  );
}