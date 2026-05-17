"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const POLL_MS = 2500;
const MAX_ATTEMPTS = 48; // ~2 minutes

function CheckoutCompleteContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id")?.trim() ?? "";

  const [message, setMessage] = useState("Confirming your payment…");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setError("Missing checkout session. Use the link from your payment email.");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      attempts += 1;
      try {
        const res = await fetch(
          `/api/checkout/status?session_id=${encodeURIComponent(sessionId)}`
        );
        const data = await res.json();

        if (cancelled) return;

        if (data.status === "ready" && data.accessUrl) {
          window.location.replace(data.accessUrl);
          return;
        }

        if (data.status === "failed") {
          setError(
            data.error ??
              "We received your payment but could not finish your reading. Email support if this persists."
          );
          return;
        }

        if (attempts >= MAX_ATTEMPTS) {
          setMessage("");
          setError(
            "Your reading is still generating. Check your inbox for your private link — it usually arrives within a minute."
          );
          return;
        }

        setMessage(
          attempts < 4
            ? "Confirming your payment…"
            : "Generating your full reading…"
        );
        setTimeout(poll, POLL_MS);
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message);
        }
      }
    };

    poll();

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <main className="min-h-screen bg-[#09090f] text-[#e8e4f0] flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        {!error ? (
          <>
            <h1 className="text-xl font-semibold mb-3">Almost there</h1>
            <p className="text-sm opacity-70">{message}</p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold mb-3">One more step</h1>
            <p className="text-sm opacity-70">{error}</p>
            <a
              href="/"
              className="inline-block mt-6 text-sm text-[#c4a8ff] underline"
            >
              Back to BluntChart
            </a>
          </>
        )}
      </div>
    </main>
  );
}

export default function CheckoutCompletePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#09090f] text-[#e8e4f0] flex items-center justify-center p-6">
          <p className="opacity-70">Loading…</p>
        </main>
      }
    >
      <CheckoutCompleteContent />
    </Suspense>
  );
}
