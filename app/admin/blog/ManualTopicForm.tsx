"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ManualTopicForm() {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [keywordsRaw, setKeywordsRaw] = useState("");
  const [result, setResult] = useState<{
    kind: "ok" | "err";
    text: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const keywords = keywordsRaw
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      const res = await fetch("/api/admin/manual-topic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), keywords }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setResult({ kind: "ok", text: `Queued (id ${String(json.post?.id).slice(0, 8)}…)` });
        setTopic("");
        setKeywordsRaw("");
        router.refresh();
      } else {
        setResult({
          kind: "err",
          text: `${json.errorCode ?? "ERROR"}: ${json.errorMessage ?? "Failed"}`,
        });
      }
    } catch {
      setResult({ kind: "err", text: "Network error" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{
        background: "#0f131c",
        border: "1px solid #1a1e28",
        borderRadius: 8,
        padding: 16,
      }}
    >
      <label style={labelStyle}>Topic</label>
      <input
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Why do I lose feelings when someone likes me back?"
        maxLength={240}
        required
        style={inputStyle}
      />
      <label style={labelStyle}>Associated keywords (optional, comma-separated)</label>
      <input
        value={keywordsRaw}
        onChange={(e) => setKeywordsRaw(e.target.value)}
        placeholder="lose feelings when they like me, venus attachment, birth chart relationships"
        style={inputStyle}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          type="submit"
          disabled={submitting || !topic.trim()}
          style={{
            padding: "8px 14px",
            fontSize: 13,
            background: submitting || !topic.trim() ? "#232838" : "#3b6ef4",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: submitting || !topic.trim() ? "default" : "pointer",
          }}
        >
          {submitting ? "Queuing…" : "Queue topic"}
        </button>
        {result && (
          <span
            style={{
              fontSize: 13,
              color: result.kind === "ok" ? "#22c55e" : "#ef4444",
            }}
          >
            {result.text}
          </span>
        )}
        <span style={{ fontSize: 11, opacity: 0.5, marginLeft: "auto" }}>
          Manual topics enter the pipeline ahead of Gemini-discovered ones.
        </span>
      </div>
    </form>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  opacity: 0.6,
  marginBottom: 4,
  textTransform: "uppercase" as const,
  letterSpacing: 0.5,
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  fontSize: 13,
  background: "#151923",
  border: "1px solid #232838",
  borderRadius: 6,
  color: "#e8ebf1",
  marginBottom: 12,
  boxSizing: "border-box" as const,
};
