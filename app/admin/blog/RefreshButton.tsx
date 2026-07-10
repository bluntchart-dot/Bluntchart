"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

export default function RefreshButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [tick, setTick] = useState(0);

  return (
    <button
      onClick={() => {
        setTick((n) => n + 1);
        startTransition(() => router.refresh());
      }}
      disabled={pending}
      style={{
        padding: "6px 12px",
        fontSize: 12,
        background: "#232838",
        color: "#e8ebf1",
        border: "1px solid #2f3547",
        borderRadius: 6,
        cursor: pending ? "default" : "pointer",
      }}
    >
      {pending ? "Refreshing…" : `Refresh${tick > 0 ? ` (${tick})` : ""}`}
    </button>
  );
}
