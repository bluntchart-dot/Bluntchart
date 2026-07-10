"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  async function onClick() {
    await fetch("/api/admin/session", { method: "DELETE" });
    startTransition(() => {
      router.replace("/admin/blog/login");
      router.refresh();
    });
  }

  return (
    <button
      onClick={onClick}
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
      {pending ? "Signing out…" : "Sign out"}
    </button>
  );
}
