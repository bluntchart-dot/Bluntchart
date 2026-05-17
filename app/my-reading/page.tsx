"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { ChartData } from "@/lib/types";

const ChartWheel = dynamic(() => import("@/components/ChartWheel"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] flex items-center justify-center opacity-50 text-sm">
      Loading your chart…
    </div>
  ),
});

function MyReadingContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";

  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
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

  const paidInsights = Array.isArray(reading?.paidInsights)
    ? (reading!.paidInsights as Array<{
        planet?: string;
        truth?: string;
        explain?: string;
        action?: string;
      }>)
    : [];

  const preview = Array.isArray(reading?.preview)
    ? (reading!.preview as Array<{ planet?: string; truth?: string }>)
    : [];

  const shareCard = reading?.shareCard as
    | { keyword?: string; lines?: string[]; quote?: string }
    | undefined;

  const chart = reading?.chart as ChartData | undefined;

  return (
    <main className="min-h-screen bg-[#09090f] text-[#e8e4f0] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-[#6b6585] mb-2">
          BluntChart · Your full reading
        </p>
        <h1 className="text-3xl font-serif mb-8">Saved for you</h1>

        {chart && (
          <section className="mb-10 flex justify-center">
            <ChartWheel chart={chart} />
          </section>
        )}

        {preview.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm uppercase tracking-wider text-[#9b6fe8] mb-4">
              Preview insights
            </h2>
            {preview.map((ins, i) => (
              <div
                key={i}
                className="mb-6 p-5 rounded-xl border border-white/10 bg-white/[0.03]"
              >
                <div className="text-xs text-[#6b6585] mb-2">{ins.planet}</div>
                <p className="leading-relaxed whitespace-pre-line">{ins.truth}</p>
              </div>
            ))}
          </section>
        )}

        {paidInsights.length > 0 && (
          <section className="mb-10">
            <h2 className="text-sm uppercase tracking-wider text-[#f0b84a] mb-4">
              Full reading · 8 insights
            </h2>
            {paidInsights.map((ins, i) => (
              <div
                key={i}
                className="mb-6 p-5 rounded-xl border border-white/10 bg-white/[0.03]"
              >
                <div className="text-xs text-[#6b6585] mb-2">{ins.planet}</div>
                <p className="leading-relaxed mb-3 whitespace-pre-line">
                  {ins.truth}
                </p>
                {ins.explain && (
                  <p className="text-sm text-[#b8b0d4] mb-2">{ins.explain}</p>
                )}
                {ins.action && (
                  <p className="text-sm text-[#f0b84a]">This week: {ins.action}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {shareCard && (
          <section className="mb-10 p-6 rounded-xl border border-[#6b2fd4]/30 bg-[#6b2fd4]/10 text-center">
            {shareCard.keyword && (
              <p className="text-xs uppercase tracking-widest text-[#c4a8ff] mb-3">
                {shareCard.keyword}
              </p>
            )}
            {shareCard.lines?.map((line, i) => (
              <p key={i} className="mb-2 font-serif text-lg">
                {line}
              </p>
            ))}
            {shareCard.quote && (
              <p className="text-sm italic opacity-70 mt-4">
                &ldquo;{shareCard.quote}&rdquo;
              </p>
            )}
          </section>
        )}

        {!paidInsights.length && !preview.length && (
          <pre className="text-xs overflow-auto p-4 rounded bg-black/40 border border-white/10">
            {JSON.stringify(reading, null, 2)}
          </pre>
        )}

        <a href="/" className="text-sm text-[#c4a8ff] underline">
          bluntchart.com
        </a>
      </div>
    </main>
  );
}

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
