"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { readCheckoutSession } from "@/lib/checkout-session";

const POLL_MS = 2500;
const MAX_ATTEMPTS = 60; // ~2.5 minutes

function CheckoutCompleteContent() {
  const searchParams = useSearchParams();

  const { sessionId, email } = useMemo(() => {
    const fromUrl = {
      sessionId: searchParams.get("session_id")?.trim() ?? "",
      email: searchParams.get("email")?.trim().toLowerCase() ?? "",
    };
    if (fromUrl.sessionId) return fromUrl;
    const stored = readCheckoutSession();
    return {
      sessionId: stored.sessionId ?? "",
      email: fromUrl.email || stored.email || "",
    };
  }, [searchParams]);

  const [message, setMessage] = useState("Confirming your payment…");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!sessionId && !email) {
      setError(
        "We could not match your checkout. Open the link from your payment email, or return to bluntchart.com and contact support."
      );
      return;
    }

    let cancelled = false;
    let attempts = 0;

    const poll = async () => {
      attempts += 1;
      try {
        const params = new URLSearchParams();
        if (sessionId) params.set("session_id", sessionId);
        if (email) params.set("email", email);

        const res = await fetch(`/api/checkout/status?${params.toString()}`);
        const data = await res.json();

        if (cancelled) return;

        if (data.status === "ready" && data.accessUrl) {
          window.location.replace(data.accessUrl);
          return;
        }

        if (data.status === "failed") {
          setError(
            data.error ??
              "We received your payment but could not finish your reading. Check your email or contact support."
          );
          return;
        }

        if (attempts >= MAX_ATTEMPTS) {
          setMessage("");
          setError(
            "Your reading is still generating. Check your inbox for your private link — it usually arrives within a few minutes."
          );
          return;
        }

        setMessage(
          attempts < 4
            ? "Confirming your payment…"
            : "Generating your full reading, chart, and share card…"
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
  }, [sessionId, email]);

  return (
    <main className="min-h-screen bg-[#09090f] text-[#e8e4f0] flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        {!error ? (
          <>
            <h1 className="text-xl font-semibold mb-3">Almost there</h1>
            <p className="text-sm opacity-70">{message}</p>
            <p className="text-xs opacity-50 mt-4">
              Do not close this tab — we will open your reading automatically.
            </p>
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
