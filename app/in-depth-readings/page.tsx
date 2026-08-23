"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import type { PremiumReading } from "@/lib/premium/types";

const PremiumBook = dynamic(() => import("@/components/premium/PremiumBook"), {
  ssr: false,
  loading: () => (
    <main className="min-h-screen bg-[#09090f] text-[#e8e4f0] flex items-center justify-center">
      Loading your reading…
    </main>
  ),
});

function InDepthReadingContent() {
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

  if (status === "error" || !reading) {
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

  return <PremiumBook reading={reading as unknown as PremiumReading} />;
}

export default function InDepthReadingsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#09090f] text-[#e8e4f0] flex items-center justify-center">
          Loading…
        </main>
      }
    >
      <InDepthReadingContent />
    </Suspense>
  );
}
