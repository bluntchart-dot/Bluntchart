"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState, Component } from "react";
import type { ReactNode } from "react";
import ShareCard from "@/components/ShareCard";
import type { ChartData } from "@/lib/types";
import type { ShareCardData } from "@/components/ShareCard";
import { ReadingText } from "@/components/ReadingText";
import { getChartHighlights } from "@/lib/chart-calculator";
import ChartHighlightBoxes from "@/components/ChartHighlightBoxes";
import FunFactBoxes from "@/components/FunFactBoxes";

const SECTION_TAGS: Record<string, string> = {
  rising: "PERSONALITY",
  moon: "EMOTIONS",
  venus: "LOVE",
  mars: "DRIVE & AMBITION",
  mercury: "MIND",
  saturn: "CAREER & GROWTH",
  jupiter: "CONFIDENCE",
  "the full picture": "YOUR LIFE NOW",
  "your love pattern": "LOVE",
  "what is actually going on with your career": "CAREER",
  "your real relationship with money": "MONEY",
  "who you actually are": "IDENTITY & PURPOSE",
};

function getSectionTag(planet: string): string | null {
  const lower = planet.toLowerCase();
  for (const [key, tag] of Object.entries(SECTION_TAGS)) {
    if (lower.includes(key)) return tag;
  }
  return null;
}

const ChartWheel = dynamic(() => import("@/components/ChartWheel"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] flex items-center justify-center opacity-50 text-sm">
      Loading your chart…
    </div>
  ),
});

/* ─── Error boundary so ShareCard / ChartWheel can't crash the whole page ── */
class SafeRender extends Component<
  { fallback?: ReactNode; label?: string; children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error(`[SafeRender:${this.props.label}]`, error);
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback ?? (
          <div className="p-4 rounded-lg border border-red-500/30 bg-red-500/5 text-sm text-red-300">
            {this.props.label ?? "Component"} failed to render:{" "}
            {this.state.error.message}
          </div>
        )
      );
    }
    return this.props.children;
  }
}

/* ─── Main page content ────────────────────────────────────────────────────── */
function MyReadingContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    "loading"
  );
  const [error, setError] = useState("");
  const [reading, setReading] = useState<Record<string, unknown> | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Missing access link. Use the link from your payment email.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `/api/reading/access?token=${encodeURIComponent(token)}`
        );
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok || !data.success) {
          setStatus("error");
          setError(data.error ?? "Could not load your reading.");
          return;
        }

        setReading(data.reading);
        setStatus("ready");
      } catch (e) {
        if (!cancelled) {
          setStatus("error");
          setError((e as Error).message);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  /* ── Loading / Error states ── */
  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#09090f] text-[#e8e4f0] flex items-center justify-center p-6">
        <p className="text-center opacity-70">Loading your reading…</p>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main className="min-h-screen bg-[#09090f] text-[#e8e4f0] flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <h1 className="text-xl font-semibold mb-3">Reading unavailable</h1>
          <p className="text-sm opacity-70">{error}</p>
          <a
            href="/"
            className="inline-block mt-6 text-sm text-[#c4a8ff] underline"
          >
            Back to BluntChart
          </a>
        </div>
      </main>
    );
  }

  /* ── Parse fields from reading ── */

  const paidInsights = Array.isArray(reading?.paidInsights)
    ? (reading!.paidInsights as Array<{
        planet?: string;
        truth?: string;
        explain?: string;
        action?: string;
      }>)
    : [];

  const preview = Array.isArray(reading?.preview)
    ? (reading!.preview as Array<{
        planet?: string;
        hook?: string;
        truth?: string;
        reveal?: string;
        cliffhanger?: string;
      }>)
    : [];

  const rawCard = reading?.shareCard as Record<string, unknown> | undefined;
  const chart = reading?.chart as ChartData | undefined;
console.log("[DEBUG] chart data:", chart ? "YES" : "NO", JSON.stringify(chart)?.slice(0, 200));
const meta = reading?.meta as Record<string, unknown> | undefined;

  /* Big 3 + key planet highlight boxes. Computed once here from the
     same chart object ChartWheel already uses. Null-safe. */
  const highlights = chart ? getChartHighlights(chart) : null;

  /* letter_opener can be a string or { greeting, line1, line2, teaser } */
  const rawOpener = reading?.letter_opener;
  const letterOpener: string | null = (() => {
    if (!rawOpener) return null;
    if (typeof rawOpener === "string") return rawOpener;
    if (typeof rawOpener === "object") {
      const o = rawOpener as Record<string, string>;
      return [o.greeting, o.line1, o.line2, o.teaser]
        .filter(Boolean)
        .join("\n\n");
    }
    return null;
  })();

  const resolvedName =
    (reading?.name as string) ?? (meta?.name as string) ?? "";

  const handleDownloadPdf = async () => {
    if (pdfBusy) return;
    setPdfBusy(true);
    try {
      const [{ pdf }, { default: ReadingPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/ReadingPDF"),
      ]);
      const blob = await pdf(
        <ReadingPDF
          name={resolvedName || "you"}
          letterOpener={letterOpener}
          preview={preview}
          paidInsights={paidInsights}
        />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeName = (resolvedName || "reading")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      a.download = `bluntchart-reading-${safeName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2_000);
    } catch (err) {
      console.error("[reading-pdf] download failed:", err);
      alert("Could not generate the PDF. Please try again.");
    } finally {
      setPdfBusy(false);
    }
  };

  /* Pull Sun/Moon/Rising from REAL chart data OR fall back to AI planets */
  const aiPlanets = reading?.planets as Record<string, string> | undefined;
  const sunSign =
    chart?.planets?.find((p) => p.name === "Sun")?.sign ?? aiPlanets?.sun;
  const moonSign =
    chart?.planets?.find((p) => p.name === "Moon")?.sign ?? aiPlanets?.moon;
  const risingSign =
    chart?.ascendant?.sign ?? aiPlanets?.rising;


  /* Build ShareCard props
     Supports both:
     - NEW format:  { line1, line2, line3 }           ← from updated claude-prompt.ts
     - OLD format:  { lines: [line1, line2, line3] }  ← backwards compat
  */
  const lines = rawCard?.lines as string[] | undefined;

  const shareCardProps: ShareCardData | null =
    rawCard && resolvedName
      ? {
          name: resolvedName,
          keyword: (rawCard.keyword as string) ?? "",
          line1: (rawCard.line1 as string) ?? lines?.[0] ?? "",
          line2: (rawCard.line2 as string) ?? lines?.[1] ?? "",
          line3: (rawCard.line3 as string) ?? lines?.[2] ?? "",
          quote: (rawCard.quote as string) ?? "",
          sun: sunSign,
          moon: moonSign,
          rising: risingSign,
        }
      : null;

  /* ── Render ── */
  return (
    <main className="min-h-screen bg-[#09090f] text-[#e8e4f0] py-12 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto w-full">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-[0.2em] text-[#6b6585]">
            BluntChart · Your full reading
          </p>
          <button
            onClick={handleDownloadPdf}
            disabled={pdfBusy}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 active:scale-[0.97]"
            style={{
              background: "linear-gradient(135deg, #6b2fd4, #d4537e, #f0b84a)",
            }}
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {pdfBusy ? "Preparing..." : "Download PDF"}
          </button>
        </div>

        {/* Letter Opener */}
        {letterOpener ? (
          <section className="mb-12 text-base sm:text-lg leading-relaxed text-[#d8d2ec] max-w-3xl">
            <ReadingText text={letterOpener} className="space-y-4" />
          </section>
        ) : (
          <h1 className="text-3xl sm:text-4xl font-serif mb-10 tracking-tight">
            Saved for you
          </h1>
        )}

        {/* Big 3 + key planet highlight boxes, shown above the wheel */}
        {highlights && (
          <section className="mb-8 flex justify-center">
            <SafeRender label="ChartHighlightBoxes">
              <div className="w-full max-w-[960px]">
                <ChartHighlightBoxes highlights={highlights} />
              </div>
            </SafeRender>
          </section>
        )}

        {/* Chart Wheel */}
        {chart && (
          <section className="mb-10 flex justify-center">
            <SafeRender label="ChartWheel">
              <ChartWheel chart={chart} />
            </SafeRender>
          </section>
        )}

        {/* Compatibility snapshot, shown after the chart wheel */}
        {chart && (
          <section className="mb-10 flex justify-center">
            <SafeRender label="FunFactBoxes">
              <div className="w-full max-w-[960px]">
                <FunFactBoxes chart={chart} />
              </div>
            </SafeRender>
          </section>
        )}

        {/* Full Reading */}
        {paidInsights.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xs uppercase tracking-[0.2em] text-[#f0b84a] mb-7">
              Full reading · {paidInsights.length} insights
            </h2>
            {paidInsights.map((ins, i) => (
              <article
                key={i}
                className="mb-10 p-7 sm:p-9 rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                {ins.planet && getSectionTag(ins.planet) && (
                  <span className="inline-block text-[10px] uppercase tracking-[0.18em] text-[#f0b84a] bg-[#f0b84a]/10 px-3 py-1 rounded-md mb-3 font-semibold">
                    {getSectionTag(ins.planet!)}
                  </span>
                )}
                {ins.planet && (
                  <div className="text-xs uppercase tracking-[0.14em] text-[#6b6585] mb-5 font-semibold">
                    {ins.planet}
                  </div>
                )}
                {ins.truth && (
                  <p className="text-xl sm:text-2xl font-serif font-semibold leading-snug mb-6 text-[#f0ece8]">
                    {ins.truth}
                  </p>
                )}
                {ins.explain && (
                  <div className="text-[#b8b0d4] mb-6 text-base sm:text-[1.05rem] leading-relaxed max-w-3xl">
                    <ReadingText text={ins.explain} className="space-y-4" />
                  </div>
                )}
                {ins.action && (
                  <div className="mt-6 pt-5 border-t border-white/8">
                    <span className="text-[10px] uppercase tracking-[0.14em] text-[#f0b84a] block mb-2">
                      This week
                    </span>
                    <p className="text-sm sm:text-base text-[#f0b84a] leading-relaxed">
                      {ins.action}
                    </p>
                  </div>
                )}
              </article>
            ))}
          </section>
        )}

        {/* Share Card */}
        {shareCardProps && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-widest text-[#6b6585] mb-4">
              Your shareable card
            </h2>
            <SafeRender label="ShareCard">
              <ShareCard {...shareCardProps} />
            </SafeRender>
          </section>
        )}

        {/* Fallback if nothing rendered */}
        {!paidInsights.length && (
          <pre className="text-xs overflow-auto p-4 rounded bg-black/40 border border-white/10">
            {JSON.stringify(reading, null, 2)}
          </pre>
        )}

        <div className="pt-6 border-t border-white/5 mt-6">
          <p className="text-xs text-[#6b6585] mb-1">
            For entertainment purposes only. Not medical, financial, or
            psychological advice.
          </p>
          <a href="/" className="text-sm text-[#c4a8ff] underline">
            bluntchart.com
          </a>
        </div>
      </div>
    </main>
  );
}

/* ─── Page wrapper with Suspense ─────────────────────────────────────────── */
export default function MyReadingPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#09090f] text-[#e8e4f0] flex items-center justify-center">
          Loading…
        </main>
      }
    >
      <MyReadingContent />
    </Suspense>
  );
}