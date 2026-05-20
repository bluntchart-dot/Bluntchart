"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { ChartData } from "@/lib/types";
import ShareCard from "@/components/ShareCard";
import type { ShareCardData } from "@/components/ShareCard";

const ChartWheel = dynamic(() => import("@/components/ChartWheel"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] flex items-center justify-center opacity-50 text-sm">
      Loading your chart…
    </div>
  ),
});

/* ─── Renders \n\n as paragraph breaks — preserves dramatic short-line format ─ */
function ReadingText({ text }: { text: string }) {
  return (
    <div className="space-y-3">
      {text.split(/\n\n+/).map((para, i) => (
        <p key={i} className="leading-relaxed">{para}</p>
      ))}
    </div>
  );
}

/* ─── Main page content ────────────────────────────────────────────────────── */
function MyReadingContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [status,  setStatus]  = useState<"loading" | "ready" | "error">("loading");
  const [error,   setError]   = useState("");
  const [reading, setReading] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setError("Missing access link. Use the link from your payment email.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res  = await fetch(`/api/reading/access?token=${encodeURIComponent(token)}`);
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
        if (!cancelled) { setStatus("error"); setError((e as Error).message); }
      }
    })();

    return () => { cancelled = true; };
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
          <a href="/" className="inline-block mt-6 text-sm text-[#c4a8ff] underline">
            Back to BluntChart
          </a>
        </div>
      </main>
    );
  }

  /* ── Parse fields from reading ── */

  const paidInsights = Array.isArray(reading?.paidInsights)
    ? (reading!.paidInsights as Array<{
        planet?:  string;
        truth?:   string;
        explain?: string;
        action?:  string;
      }>)
    : [];

  const preview = Array.isArray(reading?.preview)
    ? (reading!.preview as Array<{ planet?: string; truth?: string }>)
    : [];

  const rawCard = reading?.shareCard as Record<string, unknown> | undefined;
  const chart   = reading?.chart    as ChartData | undefined;

  /* letter_opener can be a string or { greeting, line1, line2, teaser } */
  const rawOpener = reading?.letter_opener;
  const letterOpener: string | null = (() => {
    if (!rawOpener) return null;
    if (typeof rawOpener === "string") return rawOpener;
    if (typeof rawOpener === "object") {
      const o = rawOpener as Record<string, string>;
      return [o.greeting, o.line1, o.line2, o.teaser].filter(Boolean).join("\n\n");
    }
    return null;
  })();

  /* Pull Sun/Moon/Rising from REAL chart data — not AI output */
  const sunSign    = chart?.planets?.find((p) => p.name === "Sun")?.sign;
  const moonSign   = chart?.planets?.find((p) => p.name === "Moon")?.sign;
  const risingSign = chart?.ascendant?.sign;

  /* Build ShareCard props
     Supports both:
     - NEW format:  { line1, line2, line3 }           ← from updated claude-prompt.ts
     - OLD format:  { lines: [line1, line2, line3] }  ← backwards compat
  */
  const shareCardProps: ShareCardData | null = rawCard
    ? {
        name:    (reading?.name as string) ?? "",
        keyword: (rawCard.keyword  as string) ?? "",
        line1:   (rawCard.line1    as string) ?? (rawCard.lines as string[])?.[0] ?? "",
        line2:   (rawCard.line2    as string) ?? (rawCard.lines as string[])?.[1] ?? "",
        line3:   (rawCard.line3    as string) ?? (rawCard.lines as string[])?.[2] ?? "",
        quote:   (rawCard.quote    as string) ?? "",
        sun:     sunSign,
        moon:    moonSign,
        rising:  risingSign,
      }
    : null;

  /* ── Render ── */
  return (
    <main className="min-h-screen bg-[#09090f] text-[#e8e4f0] py-12 px-4">
      <div className="max-w-2xl mx-auto">

        <p className="text-xs uppercase tracking-widest text-[#6b6585] mb-2">
          BluntChart · Your full reading
        </p>

        {/* Letter Opener */}
        {letterOpener ? (
          <section className="mb-10 text-base leading-loose">
            <ReadingText text={letterOpener} />
          </section>
        ) : (
          <h1 className="text-3xl font-serif mb-8">Saved for you</h1>
        )}

        {/* Chart Wheel */}
        {chart && (
          <section className="mb-10 flex justify-center">
            <ChartWheel chart={chart} />
          </section>
        )}

        {/* Preview Insights */}
        {preview.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-widest text-[#9b6fe8] mb-5">
              Preview insights
            </h2>
            {preview.map((ins, i) => (
              <div key={i} className="mb-6 p-6 rounded-xl border border-white/10 bg-white/[0.03]">
                {ins.planet && (
                  <div className="text-xs uppercase tracking-wider text-[#6b6585] mb-3">
                    {ins.planet}
                  </div>
                )}
                <ReadingText text={ins.truth ?? ""} />
              </div>
            ))}
          </section>
        )}

        {/* Full Reading */}
        {paidInsights.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-widest text-[#f0b84a] mb-5">
              Full reading · {paidInsights.length} insights
            </h2>
            {paidInsights.map((ins, i) => (
              <div key={i} className="mb-8 p-6 rounded-xl border border-white/10 bg-white/[0.03]">
                {ins.planet && (
                  <div className="text-xs uppercase tracking-wider text-[#6b6585] mb-3">
                    {ins.planet}
                  </div>
                )}
                {ins.truth && (
                  <p className="text-lg font-semibold leading-snug mb-4">{ins.truth}</p>
                )}
                {ins.explain && (
                  <div className="text-[#b8b0d4] mb-4 text-sm">
                    <ReadingText text={ins.explain} />
                  </div>
                )}
                {ins.action && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <span className="text-xs uppercase tracking-wider text-[#f0b84a] mr-2">
                      This week:
                    </span>
                    <span className="text-sm text-[#f0b84a]">{ins.action}</span>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Share Card — 4:5, max 420px */}
        {shareCardProps && shareCardProps.name && (
          <section className="mb-10">
            <h2 className="text-xs uppercase tracking-widest text-[#6b6585] mb-4">
              Your shareable card
            </h2>
            <ShareCard {...shareCardProps} />
          </section>
        )}

        {/* Fallback if nothing rendered */}
        {!paidInsights.length && !preview.length && (
          <pre className="text-xs overflow-auto p-4 rounded bg-black/40 border border-white/10">
            {JSON.stringify(reading, null, 2)}
          </pre>
        )}

        <div className="pt-6 border-t border-white/5 mt-6">
          <p className="text-xs text-[#6b6585] mb-1">
            For entertainment purposes only. Not medical, financial, or psychological advice.
          </p>
          <a href="/" className="text-sm text-[#c4a8ff] underline">bluntchart.com</a>
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