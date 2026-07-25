"use client";

/**
 * PremiumBook — the full book reader.
 *
 * Owns:
 *   - Horizontal swipe navigation (native CSS scroll-snap)
 *   - Keyboard nav (← →)
 *   - "Continue Your Story →" CTAs (goToNext)
 *   - Subtle chapter progress header ("Understanding You · Chapter 4 of 13")
 *   - Persist last viewed page to localStorage; resume on reopen
 *   - Book chrome (progress bar, PDF download button, close, settings)
 *
 * Does NOT own:
 *   - How each page is drawn (delegated to PremiumBookPage / PremiumBookCover)
 *   - The reading itself (parent generates and hands it in)
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { PremiumReading } from "@/lib/premium/types";
import PremiumBookCover from "./PremiumBookCover";
import PremiumBookPage, { partDisplayNames } from "./PremiumBookPage";

const DownloadPdfButton = dynamic(() => import("./PremiumBookPDFButton"), {
  ssr: false,
});

const STORAGE_KEY = "bluntchart_book_position_v1";

interface StoredPosition {
  readingSignature: string;
  index: number;
  updatedAt: string;
}

/** A stable identifier for a reading so we only resume the same book. */
function readingSignature(reading: PremiumReading): string {
  const m = reading.meta;
  return `${m.name}|${m.dob}|${m.birthTime}|${m.birthPlace}|${m.readingVersion}`;
}

interface Props {
  reading: PremiumReading;
  onClose?: () => void;
}

export default function PremiumBook({ reading, onClose }: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<Array<HTMLDivElement | null>>([]);
  const suppressPersistRef = useRef(false);

  /* The cover gets its own dedicated slot (index 0). Every other
     section becomes a content slot starting at index 1. */
  const pages = useMemo(
    () => reading.sections.filter((s) => s.pageType !== "cover"),
    [reading]
  );
  const totalPages = pages.length + 1; // + cover
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);

  const signature = useMemo(() => readingSignature(reading), [reading]);

  /* ─── Restore last position ──────────────────────────────────────── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as StoredPosition;
        if (saved.readingSignature === signature && typeof saved.index === "number") {
          const clamped = Math.max(0, Math.min(saved.index, totalPages - 1));
          suppressPersistRef.current = true;
          setIndex(clamped);
          requestAnimationFrame(() => scrollToIndex(clamped, /* smooth */ false));
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    // Delay first paint until after restore so we never flash the cover
    // when the reader had already advanced past it.
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  /* ─── Persist current position ───────────────────────────────────── */
  useEffect(() => {
    if (!ready) return;
    if (suppressPersistRef.current) {
      suppressPersistRef.current = false;
      return;
    }
    try {
      const payload: StoredPosition = {
        readingSignature: signature,
        index,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* ignore */
    }
  }, [index, ready, signature]);

  /* ─── Scroll helpers ─────────────────────────────────────────────── */
  const scrollToIndex = useCallback((i: number, smooth: boolean = true) => {
    const scroller = scrollerRef.current;
    const target = pageRefs.current[i];
    if (!scroller || !target) return;
    scroller.scrollTo({
      left: target.offsetLeft,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  const goToIndex = useCallback((i: number) => {
    const clamped = Math.max(0, Math.min(i, totalPages - 1));
    setIndex(clamped);
    scrollToIndex(clamped);
  }, [scrollToIndex, totalPages]);

  const goNext = useCallback(() => goToIndex(index + 1), [goToIndex, index]);
  const goPrev = useCallback(() => goToIndex(index - 1), [goToIndex, index]);

  /* ─── Track current page from scroll position ─────────────────────
     Uses a scroll listener + IntersectionObserver together. Scroll gives
     us fast updates during touch swipe; IO catches the settle. We query
     slots from the DOM so this is resilient to ref-array staleness across
     re-renders. */
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const readIndex = () => {
      const w = scroller.clientWidth;
      if (w === 0) return;
      const i = Math.round(scroller.scrollLeft / w);
      setIndex((prev) => (prev === i ? prev : i));
    };

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(readIndex);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });

    // Poll once shortly after mount to catch programmatic scrolls that
    // happen before the listener attaches (e.g. restore-from-localStorage).
    const settleTimer = window.setTimeout(readIndex, 60);

    return () => {
      scroller.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      window.clearTimeout(settleTimer);
    };
  }, [totalPages]);

  /* ─── Keyboard nav ───────────────────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); goNext(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); goPrev(); }
      else if (e.key === "Escape" && onClose) { onClose(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goNext, goPrev, onClose]);

  /* ─── Chrome data ────────────────────────────────────────────────── */
  const currentSection = index === 0 ? null : pages[index - 1] ?? null;

  /* Chapters per part — lets us show "Chapter 2 of 3" for Part II
     instead of continuing the Part I counter. */
  const partChapterTotals = useMemo(() => {
    const totals: Record<string, number> = {};
    for (const s of pages) {
      if (s.pageType === "chapter") {
        totals[s.part] = (totals[s.part] ?? 0) + 1;
      }
    }
    return totals;
  }, [pages]);

  const chapterHeader = (() => {
    if (!currentSection) return null;
    if (currentSection.pageType !== "chapter") return null;
    if (!currentSection.chapterNumber) return null;
    const partName = partDisplayNames[currentSection.part] ?? "";
    const partTotal = partChapterTotals[currentSection.part] ?? reading.meta.totalChapters;
    return `${partName} · Chapter ${currentSection.chapterNumber} of ${partTotal}`;
  })();

  const progressPct = totalPages > 1 ? (index / (totalPages - 1)) * 100 : 0;
  const readingComplete = index === totalPages - 1;

  return (
    <div className="premium-book-root">
      <style jsx global>{`
        :root { --pb-fg:#efe9dc; --pb-fg-dim:rgba(239,233,220,0.62); --pb-fg-faint:rgba(239,233,220,0.34); --pb-bg:#0a0910; --pb-panel:#141020; --pb-accent:#c4a8ff; --pb-gold:#f0b84a; --pb-warm:#f5c99e; --pb-serif: 'Playfair Display', Georgia, 'Times New Roman', serif; --pb-sans: 'DM Sans', system-ui, -apple-system, Segoe UI, sans-serif; }
        .premium-book-root { position:fixed; inset:0; z-index:80; background:var(--pb-bg); color:var(--pb-fg); font-family:var(--pb-sans); overflow:hidden; display:flex; flex-direction:column; }
        .premium-book-topbar { display:flex; align-items:center; justify-content:space-between; padding:16px 22px 10px; z-index:2; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; color:var(--pb-fg-faint); }
        .premium-book-topbar-progress { color:var(--pb-fg-dim); text-align:center; flex:1; padding:0 12px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .premium-book-topbar button { background:transparent; border:none; color:var(--pb-fg-dim); cursor:pointer; font-size:11px; letter-spacing:0.14em; text-transform:uppercase; font-family:inherit; padding:6px 10px; border-radius:6px; }
        .premium-book-topbar button:hover { color:var(--pb-fg); background:rgba(255,255,255,0.05); }
        .premium-book-progressbar { height:1.5px; width:100%; background:rgba(255,255,255,0.05); }
        .premium-book-progressbar-fill { height:100%; background:linear-gradient(90deg, var(--pb-warm), var(--pb-accent)); transition:width 0.3s ease; }
        .premium-book-scroller { flex:1; display:flex; overflow-x:auto; overflow-y:hidden; scroll-snap-type:x mandatory; scrollbar-width:none; -ms-overflow-style:none; scroll-behavior:smooth; }
        .premium-book-scroller::-webkit-scrollbar { display:none; }
        .premium-book-slot { flex:0 0 100%; width:100%; height:100%; scroll-snap-align:center; scroll-snap-stop:always; overflow-y:auto; overflow-x:hidden; -webkit-overflow-scrolling:touch; overscroll-behavior:contain; }
        .premium-book-page { min-height:100%; display:flex; align-items:flex-start; justify-content:center; padding:36px 24px 96px; }
        .premium-page-inner { width:100%; max-width:640px; }
        .premium-page-eyebrow { font-size:10px; letter-spacing:0.24em; text-transform:uppercase; color:var(--pb-accent); margin-bottom:14px; opacity:0.85; }
        .premium-page-title { font-family:var(--pb-serif); font-weight:700; font-size:clamp(2rem, 5vw, 2.8rem); line-height:1.1; letter-spacing:-0.01em; color:var(--pb-fg); margin:0 0 12px; }
        .premium-page-subtitle { font-size:15px; line-height:1.6; color:var(--pb-fg-dim); margin:0 0 28px; }
        .premium-page-subtitle-italic { font-family:var(--pb-serif); font-style:italic; font-size:17px; color:var(--pb-fg-dim); }
        .premium-page-body { font-size:16.5px; line-height:1.78; color:var(--pb-fg); }
        .premium-page-body p { margin:0 0 18px; }
        .premium-page-body p:last-child { margin-bottom:0; }
        .premium-page-cta { margin-top:40px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.06); }
        /* Cover */
        .premium-page-cover { min-height:100%; padding:0; display:flex; align-items:center; justify-content:center; background:radial-gradient(ellipse 90% 60% at 50% 0%, rgba(107,47,212,0.18), transparent 55%), radial-gradient(ellipse 60% 50% at 50% 100%, rgba(212,83,126,0.12), transparent 55%), #0a0910; }
        .premium-cover-inner { width:100%; max-width:520px; padding:60px 28px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:44px; }
        .premium-cover-brand { font-size:11px; letter-spacing:0.38em; color:rgba(240,184,74,0.75); font-weight:600; }
        .premium-cover-title-block { display:flex; flex-direction:column; gap:18px; }
        .premium-cover-title { font-family:var(--pb-serif); font-weight:900; font-size:clamp(3.4rem, 10vw, 5.2rem); line-height:1; letter-spacing:-0.02em; margin:0; background:linear-gradient(180deg, #ffe9c6 0%, #f5c99e 55%, #d4a8ff 100%); -webkit-background-clip:text; background-clip:text; color:transparent; }
        .premium-cover-subtitle { font-family:var(--pb-serif); font-style:italic; font-size:17px; line-height:1.55; color:rgba(239,233,220,0.7); margin:0; }
        .premium-cover-prepared { display:flex; flex-direction:column; gap:6px; }
        .premium-cover-prepared-label { font-size:10px; letter-spacing:0.28em; text-transform:uppercase; color:var(--pb-fg-faint); }
        .premium-cover-prepared-name { font-family:var(--pb-serif); font-size:22px; color:var(--pb-fg); }
        .premium-cover-actions { display:flex; flex-direction:column; gap:14px; align-items:center; margin-top:8px; }
        .premium-cover-begin { background:linear-gradient(135deg, #f5c99e 0%, #d4a8ff 100%); color:#1a0a2a; border:none; border-radius:100px; padding:15px 34px; font-size:14px; font-weight:700; font-family:inherit; letter-spacing:0.06em; cursor:pointer; box-shadow:0 20px 60px -20px rgba(212,168,255,0.5); transition:transform 0.2s, box-shadow 0.2s; }
        .premium-cover-begin:hover { transform:translateY(-1px); box-shadow:0 24px 60px -18px rgba(212,168,255,0.6); }
        .premium-cover-time { font-size:12px; letter-spacing:0.12em; color:var(--pb-fg-faint); }
        /* Chart page */
        .premium-chart-wrap { margin:22px 0 24px; display:flex; justify-content:center; }
        .premium-chart-meta { display:flex; gap:32px; flex-wrap:wrap; padding-top:18px; border-top:1px solid rgba(255,255,255,0.06); font-size:13px; }
        .premium-chart-meta > div { display:flex; flex-direction:column; gap:3px; }
        .premium-chart-meta-label { font-size:10px; letter-spacing:0.22em; text-transform:uppercase; color:var(--pb-fg-faint); }
        .premium-chart-meta-value { color:var(--pb-fg); }
        /* Education page */
        .premium-attribution-table { margin-top:32px; padding:22px 24px; border-radius:14px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.06); }
        .premium-attribution-heading { font-size:11px; letter-spacing:0.16em; text-transform:uppercase; color:var(--pb-fg-dim); margin-bottom:16px; }
        .premium-attribution-table ul { list-style:none; margin:0; padding:0; }
        .premium-attribution-table li { display:grid; grid-template-columns:24px 1fr auto; align-items:center; gap:12px; padding:11px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:13.5px; }
        .premium-attribution-table li:last-child { border-bottom:none; }
        .premium-attribution-icon { font-size:16px; }
        .premium-attribution-chapter { color:var(--pb-fg); }
        .premium-attribution-inputs { color:var(--pb-fg-dim); font-size:12px; text-align:right; }
        /* Closing */
        .premium-page-closing { padding-top:60px; }
        .premium-page-title-closing { font-size:clamp(2rem, 4.5vw, 2.6rem); }
        .premium-page-body-closing { font-family:var(--pb-serif); font-size:19px; line-height:1.75; color:var(--pb-fg); }
        .premium-page-closing-signature { margin-top:40px; font-size:12px; letter-spacing:0.28em; text-transform:uppercase; color:var(--pb-fg-faint); padding-bottom:32px; }
        /* Transition (Part II bridge) */
        .premium-page-transition { padding-top:60px; }
        .premium-page-transition .premium-page-body { font-family:var(--pb-serif); font-size:18px; line-height:1.75; }
        /* Part title (dark hero: "Part I" / "Part II") */
        .premium-page-part-title, .premium-page-farewell {
          min-height:100%; padding:0;
          display:flex; align-items:center; justify-content:center;
          background:
            radial-gradient(ellipse 90% 60% at 50% 0%, rgba(107,47,212,0.18), transparent 55%),
            radial-gradient(ellipse 60% 50% at 50% 100%, rgba(212,83,126,0.12), transparent 55%),
            #0a0910;
        }
        .premium-part-inner {
          width:100%; max-width:520px;
          padding:60px 28px;
          text-align:center;
          display:flex; flex-direction:column; align-items:center; gap:24px;
        }
        .premium-part-eyebrow {
          font-size:11px; letter-spacing:0.38em; color:rgba(240,184,74,0.75); font-weight:600;
          margin-bottom:8px;
        }
        .premium-part-title {
          font-family:var(--pb-serif); font-weight:900;
          font-size:clamp(3.4rem, 10vw, 5.2rem); line-height:1;
          letter-spacing:-0.02em; margin:0;
          background:linear-gradient(180deg, #ffe9c6 0%, #f5c99e 55%, #d4a8ff 100%);
          -webkit-background-clip:text; background-clip:text; color:transparent;
        }
        .premium-part-title-farewell {
          font-size:clamp(2.6rem, 7vw, 3.8rem);
        }
        .premium-part-subtitle {
          font-family:var(--pb-serif); font-style:italic;
          font-size:19px; line-height:1.55; color:rgba(239,233,220,0.8);
          margin:0;
        }
        .premium-part-subtitle-italic {
          font-size:17px;
        }
        .premium-part-cta { margin-top:32px; }
        .premium-part-signature {
          margin-top:36px; font-size:11px; letter-spacing:0.32em;
          text-transform:uppercase; color:rgba(239,233,220,0.35);
        }
        /* Bottom nav */
        .premium-book-bottom { display:flex; align-items:center; gap:14px; justify-content:center; padding:14px 20px calc(14px + env(safe-area-inset-bottom, 0px)); background:linear-gradient(180deg, transparent, rgba(10,9,16,0.85)); }
        .premium-book-arrow { background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); color:var(--pb-fg-dim); width:38px; height:38px; border-radius:100px; display:flex; align-items:center; justify-content:center; font-size:14px; cursor:pointer; transition:all 0.2s; }
        .premium-book-arrow:hover { background:rgba(255,255,255,0.08); color:var(--pb-fg); }
        .premium-book-arrow:disabled { opacity:0.25; cursor:not-allowed; }
        .premium-book-dots { font-size:11px; letter-spacing:0.14em; color:var(--pb-fg-faint); min-width:70px; text-align:center; }
        @media (max-width: 640px) {
          .premium-book-topbar { padding:12px 16px 8px; font-size:10px; }
          .premium-book-page { padding:24px 20px 88px; }
          .premium-page-body { font-size:15.5px; line-height:1.72; }
          .premium-cover-inner { gap:36px; padding:40px 22px; }
        }
      `}</style>

      <div className="premium-book-topbar">
        <button
          onClick={onClose}
          aria-label="Close book"
          type="button"
        >
          Close
        </button>
        <div className="premium-book-topbar-progress">
          {chapterHeader ?? (index === 0 ? "" : " ")}
        </div>
        <DownloadPdfButton reading={reading} />
      </div>
      <div className="premium-book-progressbar">
        <div
          className="premium-book-progressbar-fill"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div
        ref={scrollerRef}
        className="premium-book-scroller"
        role="region"
        aria-label="Premium reading"
      >
        {/* Cover */}
        <div
          className="premium-book-slot"
          ref={(el) => { pageRefs.current[0] = el; }}
        >
          <PremiumBookCover reading={reading} onBegin={goNext} />
        </div>

        {/* Content pages */}
        {pages.map((section, i) => {
          const pageIdx = i + 1;
          const isLast = pageIdx === totalPages - 1;
          return (
            <div
              key={section.id}
              className="premium-book-slot"
              ref={(el) => { pageRefs.current[pageIdx] = el; }}
            >
              <PremiumBookPage
                section={section}
                reading={reading}
                isChapter={section.pageType === "chapter"}
                onContinue={goNext}
                isLast={isLast}
              />
            </div>
          );
        })}
      </div>

      <div className="premium-book-bottom">
        <button
          type="button"
          className="premium-book-arrow"
          onClick={goPrev}
          disabled={index === 0}
          aria-label="Previous page"
        >
          ←
        </button>
        <div className="premium-book-dots">
          {readingComplete ? "Fin" : `${index} of ${totalPages - 1}`}
        </div>
        <button
          type="button"
          className="premium-book-arrow"
          onClick={goNext}
          disabled={index >= totalPages - 1}
          aria-label="Next page"
        >
          →
        </button>
      </div>
    </div>
  );
}
