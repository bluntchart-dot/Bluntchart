"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });
      if (res.ok) {
        router.replace("/admin/blog");
        router.refresh();
        return;
      }
      setError(res.status === 401 ? "Invalid secret" : `Failed (${res.status})`);
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 380, margin: "10vh auto" }}>
      <h1 style={{ fontSize: 20, marginBottom: 6 }}>Blog Control</h1>
      <p style={{ fontSize: 13, opacity: 0.6, marginBottom: 24 }}>
        Admin-only. Sign in with your BLOG_ADMIN_SECRET.
      </p>
      <form onSubmit={onSubmit}>
        <input
          type="password"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          autoFocus
          placeholder="BLOG_ADMIN_SECRET"
          autoComplete="off"
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: 14,
            background: "#151923",
            border: "1px solid #232838",
            borderRadius: 6,
            color: "#e8ebf1",
            marginBottom: 12,
          }}
        />
        <button
          type="submit"
          disabled={loading || !secret}
          style={{
            width: "100%",
            padding: "10px 12px",
            fontSize: 14,
            background: loading || !secret ? "#232838" : "#3b6ef4",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: loading || !secret ? "default" : "pointer",
          }}
        >
          {loading ? "Verifying…" : "Sign in"}
        </button>
        {error && (
          <p style={{ color: "#ff6b6b", fontSize: 13, marginTop: 12 }}>{error}</p>
        )}
      </form>
    </div>
  );
}
