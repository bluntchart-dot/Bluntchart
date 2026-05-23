"use client";

import { useEffect, useRef, useState } from "react";

/* ─── Types ─────────────────────────────────────────────────────────────── */

export interface ShareCardData {
  name:     string;
  keyword:  string;
  line1:    string;
  line2:    string;
  line3:    string;
  quote:    string;
  sun?:     string;
  moon?:    string;
  rising?:  string;
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

async function captureCard(el: HTMLDivElement): Promise<HTMLCanvasElement> {
  const { default: html2canvas } = await import("html2canvas");
  return html2canvas(el, {
    scale: 3,
    backgroundColor: "#09090f",
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

  const placements = [
    sun    && `☉ ${sun}`,
    moon   && `☽ ${moon}`,
    rising && `↑ ${rising}`,
  ].filter(Boolean).join("  ·  ");

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
          title: "My BluntChart Reading",
          text:  `${keyword} — bluntchart.com`,
        });
      } else if (typeof navigator.share === "function") {
        await navigator.share({ title: "My BluntChart", text: line1, url: window.location.href });
      } else {
        await handleDownload();
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError" && (err as Error).name !== "NotAllowedError") {
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
    } catch { /* ignore */ }
  }

  return (
    <div className="mx-auto w-full max-w-[420px]">

      {/* ═══════════════════════════════════════════════
          THE CARD — matches bluntchart.com dark theme
          Aspect ratio 4:5 with proper padding to prevent cutoff
      ═══════════════════════════════════════════════ */}
      <div
        ref={cardRef}
        style={{
          width:         "100%",
          aspectRatio:   "4 / 5",
          background:    "#09090f",
          position:      "relative",
          overflow:      "hidden",
          display:       "flex",
          flexDirection: "column",
          borderRadius:  "16px",
          border:        "1px solid rgba(196,168,255,0.15)",
        }}
      >
        {/* Subtle top-left purple glow */}
        <div style={{
          position:"absolute", top:"-20%", left:"-15%",
          width:"55%", height:"50%",
          background:"radial-gradient(circle, rgba(107,47,212,0.1) 0%, transparent 65%)",
          pointerEvents:"none",
        }} />

        {/* Subtle bottom-right amber glow */}
        <div style={{
          position:"absolute", bottom:"-15%", right:"-10%",
          width:"50%", height:"40%",
          background:"radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 60%)",
          pointerEvents:"none",
        }} />

        {/* Stars */}
        {STARS.map((st, i) => (
          <div key={i} style={{
            position:"absolute", left:`${st.x}%`, top:`${st.y}%`,
            width:`${st.s}px`, height:`${st.s}px`,
            borderRadius:"50%", background:"#fff", opacity:st.o, pointerEvents:"none",
          }} />
        ))}

        {/* Content */}
        <div style={{
          position:"relative", zIndex:10, flex:1,
          display:"flex", flexDirection:"column",
          justifyContent:"space-between",
          padding:"8% 8% 6%",
          color:"#e8e4f0",
        }}>

          {/* ── Top section ── */}
          <div>
            {/* Logo */}
            <div style={{
              display:"flex", alignItems:"center", gap:"6px",
              marginBottom:"8%",
            }}>
              <span style={{ color:"#f59e0b", fontSize:"12px" }}>✦</span>
              <span style={{
                fontSize:"12px", fontWeight:700, letterSpacing:"0.08em",
                fontFamily:"system-ui, -apple-system, sans-serif",
                color:"#e8e4f0",
              }}>BluntChart</span>
            </div>

            {/* Name */}
            <div style={{ marginBottom:"7%" }}>
              <h1 style={{
                fontSize:"clamp(42px, 15vw, 76px)",
                fontWeight:900,
                letterSpacing:"-0.01em",
                lineHeight:0.92,
                fontFamily:"Georgia, 'Times New Roman', serif",
                color:"#ffffff",
                marginBottom:"0",
              }}>
                {name}
              </h1>
            </div>

            {/* Thin divider — site gradient */}
            <div style={{
              width:"40px", height:"2px",
              background:"linear-gradient(90deg, #f59e0b, #ec4899, #8b5cf6)",
              marginBottom:"7%",
              borderRadius:"1px",
            }} />

            {/* Line 1 — bold truth */}
            {line1 && (
              <p style={{
                fontSize:"clamp(14px, 3.8vw, 18px)",
                fontWeight:600,
                lineHeight:1.35,
                fontFamily:"system-ui, -apple-system, sans-serif",
                color:"#e8e4f0",
                marginBottom:"12px",
              }}>{line1}</p>
            )}

            {/* Line 2 — gradient accent (matches site hero gradient) */}
            {line2 && (
              <p style={{
                fontSize:"clamp(12px, 3.2vw, 15px)",
                lineHeight:1.4,
                fontFamily:"Georgia, 'Times New Roman', serif",
                fontWeight:500,
                fontStyle:"italic",
                background:"linear-gradient(90deg, #fbbf24, #f472b6, #d8b4fe)",
                WebkitBackgroundClip:"text",
                WebkitTextFillColor:"transparent",
                backgroundClip:"text",
                marginBottom:"12px",
              }}>{line2}</p>
            )}

            {/* Line 3 — soft italic */}
            {line3 && (
              <p style={{
                fontSize:"clamp(11px, 2.8vw, 14px)",
                lineHeight:1.5,
                fontFamily:"Georgia, 'Times New Roman', serif",
                fontStyle:"italic",
                color:"rgba(232,228,240,0.5)",
              }}>{line3}</p>
            )}
          </div>

          {/* ── Middle section ── */}
          <div style={{ textAlign:"center", padding:"0 2%" }}>
            {/* Keyword badge */}
            {keyword && (
              <div style={{ marginBottom:"14px" }}>
                <span style={{
                  display:"inline-block",
                  background:"rgba(107,47,212,0.2)",
                  border:"1px solid rgba(196,168,255,0.15)",
                  borderRadius:"999px",
                  padding:"6px 18px",
                  fontSize:"9px",
                  letterSpacing:"0.18em",
                  fontWeight:700,
                  fontFamily:"system-ui, -apple-system, sans-serif",
                  color:"#c4a8ff",
                  textTransform:"uppercase",
                }}>{keyword}</span>
              </div>
            )}

            {/* Quote */}
            {quote && (
              <p style={{
                fontSize:"clamp(10px, 2.6vw, 13px)",
                fontStyle:"italic",
                color:"rgba(232,228,240,0.45)",
                lineHeight:1.65,
                fontFamily:"Georgia, 'Times New Roman', serif",
              }}>&ldquo;{quote}&rdquo;</p>
            )}
          </div>

          {/* ── Footer ── */}
          <div>
            {/* Thin separator */}
            <div style={{
              height:"1px",
              background:"rgba(255,255,255,0.06)",
              marginBottom:"12px",
            }} />

            <div style={{
              display:"flex",
              justifyContent:"space-between",
              alignItems:"flex-end",
            }}>
              <div>
                {placements && (
                  <p style={{
                    fontSize:"9px",
                    color:"rgba(232,228,240,0.35)",
                    fontFamily:"system-ui, -apple-system, sans-serif",
                    letterSpacing:"0.04em",
                    marginBottom:"3px",
                  }}>{placements}</p>
                )}
                <p style={{
                  fontSize:"8px",
                  color:"rgba(232,228,240,0.2)",
                  fontFamily:"system-ui, -apple-system, sans-serif",
                  letterSpacing:"0.03em",
                }}>your chart picked you specifically</p>
              </div>
              <p style={{
                fontSize:"9px",
                color:"rgba(232,228,240,0.3)",
                fontFamily:"system-ui, -apple-system, sans-serif",
                letterSpacing:"0.06em",
                fontWeight:600,
              }}>bluntchart.com</p>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          ACTION BUTTONS — bright, clear CTAs
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
            <span className="text-green-400">✓ Copied!</span>
          ) : (
            <>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Copy Link
            </>
          )}
        </button>
      </div>

      <p className="mt-3 text-center text-[12px] font-semibold tracking-wide">
        <a href="https://bluntchart.com" target="_blank" rel="noopener noreferrer"
           className="text-[#c4a8ff] hover:text-[#d4bfff] transition">
          Send this to someone who needs their chart read →
        </a>
      </p>
      <p className="mt-1.5 text-center text-[11px] text-[#c4a8ff]/60 italic">
        dare your friends to get read too ✦
      </p>
    </div>
  );
}