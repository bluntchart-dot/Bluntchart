"use client";

import { useEffect, useState } from "react";
import LocationPicker from "@/components/LocationPicker";
import type { SelectedLocation } from "@/components/LocationPicker";

/* ─── Product catalog ─────────────────────────────────────────── */

interface ProductOption {
  value: string;
  label: string;
  tier: "mini" | "medium" | "long";
}

const NATAL_READINGS: ProductOption[] = [
  // Mini
  { value: "big-three-mini", label: "Big Three Mini", tier: "mini" },
  { value: "blind-reading", label: "Blind Reading", tier: "mini" },
  { value: "gift-reading", label: "Gift Reading", tier: "mini" },
  // Medium
  { value: "love-reading", label: "Love Reading", tier: "medium" },
  { value: "career-reading", label: "Career Reading", tier: "medium" },
  { value: "shadow-reading", label: "Shadow Reading", tier: "medium" },
  { value: "moon-reading", label: "Moon Reading", tier: "medium" },
  { value: "money-reading", label: "Money Reading", tier: "medium" },
  { value: "saturn-return", label: "Saturn Return", tier: "medium" },
  { value: "soulmate-reading", label: "Soulmate Reading", tier: "medium" },
  { value: "hidden-feelings", label: "Hidden Feelings", tier: "medium" },
  { value: "ex-love-reading", label: "Ex-Love Reading", tier: "medium" },
  { value: "blunt-love", label: "Blunt Love", tier: "medium" },
  { value: "blunt-career", label: "Blunt Career", tier: "medium" },
  { value: "monthly-transit", label: "Monthly Transit", tier: "medium" },
  { value: "life-purpose", label: "Life Purpose", tier: "medium" },
  { value: "brutally-honest-reading", label: "Brutally Honest", tier: "medium" },
  // Long
  { value: "personality-decoded", label: "Personality Decoded", tier: "long" },
  { value: "year-ahead", label: "Year Ahead", tier: "long" },
];

const TAROT_READINGS: ProductOption[] = [
  { value: "daily-tarot", label: "Daily Tarot", tier: "mini" },
  { value: "three-card-tarot", label: "Three Card Tarot", tier: "mini" },
  { value: "yes-no-tarot", label: "Yes/No Tarot", tier: "mini" },
];

const COMPATIBILITY_READINGS: ProductOption[] = [
  { value: "compatibility", label: "Compatibility Reading", tier: "long" },
];

const TIER_BADGE: Record<string, { bg: string; text: string; label: string }> = {
  mini: { bg: "rgba(122,214,153,0.12)", text: "#a7f0c1", label: "MINI" },
  medium: { bg: "rgba(107,47,212,0.12)", text: "#b8a0e0", label: "MEDIUM" },
  long: { bg: "rgba(212,83,126,0.12)", text: "#f0a0b8", label: "LONG" },
};

/* ─── Styles ──────────────────────────────────────────────────── */

const inp: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "0.5px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "13px 14px",
  fontSize: 14,
  color: "#e8e4f0",
  fontFamily: "inherit",
  outline: "none",
};
const lbl: React.CSSProperties = {
  display: "block",
  fontSize: 11,
  fontWeight: 600,
  color: "#6b6585",
  letterSpacing: "1.2px",
  textTransform: "uppercase",
  marginBottom: 6,
};

/* ─── Types ───────────────────────────────────────────────────── */

type ProductCategory = "natal" | "tarot" | "compatibility";

interface ReadingSection {
  title: string;
  body: string;
}

interface ReadingResult {
  ok: boolean;
  reading: {
    opener?: string;
    sections?: ReadingSection[];
    final_word?: string;
    [key: string]: unknown;
  } | null;
  validation: {
    valid: boolean;
    errors: string[];
    warnings: string[];
  } | null;
  attempts: number;
  error?: string;
  product: string;
  tier: string;
  cards?: unknown;
  synastryScore?: number;
}

/* ─── Component ───────────────────────────────────────────────── */

export default function QuickTestApp() {
  const [category, setCategory] = useState<ProductCategory>("natal");
  const [product, setProduct] = useState("");
  const [screen, setScreen] = useState<"form" | "loading" | "done">("form");
  const [result, setResult] = useState<ReadingResult | null>(null);
  const [err, setErr] = useState("");
  const [loadMsg, setLoadMsg] = useState("Generating reading...");
  const [elapsed, setElapsed] = useState(0);

  // Person 1 fields
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [btime, setBtime] = useState("");
  const [btimeUnknown, setBtimeUnknown] = useState(false);
  const [city, setCity] = useState("");
  const [cityGeo, setCityGeo] = useState<SelectedLocation | null>(null);

  // Person 2 fields (compatibility)
  const [name2, setName2] = useState("");
  const [dob2, setDob2] = useState("");
  const [btime2, setBtime2] = useState("");
  const [btime2Unknown, setBtime2Unknown] = useState(false);
  const [city2, setCity2] = useState("");
  const [cityGeo2, setCityGeo2] = useState<SelectedLocation | null>(null);

  // Tarot fields
  const [question, setQuestion] = useState("");
  const [seed, setSeed] = useState("");

  // Timer
  useEffect(() => {
    if (screen !== "loading") return;
    setElapsed(0);
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [screen]);

  // Loading messages
  useEffect(() => {
    if (screen !== "loading") return;
    const msgs = [
      "Calculating chart...",
      "Building prompt...",
      "Generating with Claude...",
      "Running QA validation...",
    ];
    let i = 0;
    setLoadMsg(msgs[0]);
    const t = setInterval(() => {
      i = (i + 1) % msgs.length;
      setLoadMsg(msgs[i]);
    }, 3000);
    return () => clearInterval(t);
  }, [screen]);

  const isTarot = category === "tarot";
  const isCompat = category === "compatibility";
  const needsBirthData = !isTarot;
  const needsQuestion = product === "yes-no-tarot";

  const currentList =
    category === "natal"
      ? NATAL_READINGS
      : category === "tarot"
        ? TAROT_READINGS
        : COMPATIBILITY_READINGS;

  const reset = () => {
    setScreen("form");
    setResult(null);
    setErr("");
  };

  const fullReset = () => {
    reset();
    setProduct("");
    setName("");
    setDob("");
    setBtime("");
    setBtimeUnknown(false);
    setCity("");
    setCityGeo(null);
    setName2("");
    setDob2("");
    setBtime2("");
    setBtime2Unknown(false);
    setCity2("");
    setCityGeo2(null);
    setQuestion("");
    setSeed("");
  };

  const submit = async () => {
    if (!product) {
      setErr("Please select a product.");
      return;
    }

    if (isTarot) {
      if (needsQuestion && !question.trim()) {
        setErr("Yes/No Tarot requires a question.");
        return;
      }
    } else {
      if (!name.trim() || !dob) {
        setErr("Please fill in name and date of birth.");
        return;
      }
      if (!btimeUnknown && !btime) {
        setErr("Please enter birth time or check 'Birth time unknown'.");
        return;
      }
      if (!city.trim()) {
        setErr("Please enter birth city.");
        return;
      }
      if (isCompat) {
        if (!name2.trim() || !dob2) {
          setErr("Please fill in Person 2's name and date of birth.");
          return;
        }
        if (!btime2Unknown && !btime2) {
          setErr("Please enter Person 2's birth time or check 'Birth time unknown'.");
          return;
        }
        if (!city2.trim()) {
          setErr("Please enter Person 2's birth city.");
          return;
        }
      }
    }

    setErr("");
    setScreen("loading");

    const payload: Record<string, unknown> = { product };

    if (isTarot) {
      payload.seed = seed.trim() || "test";
      payload.name = name.trim() || undefined;
      if (question.trim()) payload.question = question.trim();
    } else {
      payload.name = name.trim();
      payload.dob = dob;
      payload.birth_time = btimeUnknown ? "12:00" : btime;
      payload.birth_place = city.trim();
      payload.birth_time_unknown = btimeUnknown;
      if (cityGeo) {
        payload.birth_lat = cityGeo.lat;
        payload.birth_lng = cityGeo.lng;
      }

      if (isCompat) {
        payload.person2 = {
          name: name2.trim(),
          dob: dob2,
          birth_time: btime2Unknown ? "12:00" : btime2,
          birth_place: city2.trim(),
          birth_time_unknown: btime2Unknown,
          ...(cityGeo2 ? { birth_lat: cityGeo2.lat, birth_lng: cityGeo2.lng } : {}),
        };
      }
    }

    try {
      const res = await fetch("/api/internal/quick/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      setResult(data as ReadingResult);
      setScreen("done");
    } catch (e) {
      setScreen("form");
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  /* ── Loading ─────────────────────────────────────────────────── */
  if (screen === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>
          {isTarot ? "\u{1F0CF}" : "\u{2728}"}
        </div>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            color: "#e8e4f0",
            marginBottom: 8,
          }}
        >
          {loadMsg}
        </div>
        <div style={{ fontSize: 13, color: "#4a4560" }}>
          {elapsed}s elapsed
        </div>
      </div>
    );
  }

  /* ── Result ──────────────────────────────────────────────────── */
  if (screen === "done" && result) {
    return (
      <ResultViewer result={result} onNew={reset} onFullReset={fullReset} />
    );
  }

  /* ── Form ────────────────────────────────────────────────────── */
  const selectedProduct = currentList.find((p) => p.value === product);

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", width: "100%" }}>
      {err && (
        <div
          style={{
            background: "rgba(212,83,126,0.08)",
            border: "0.5px solid rgba(212,83,126,0.3)",
            borderRadius: 10,
            padding: "11px 14px",
            fontSize: 13,
            color: "#f0a0b8",
            marginBottom: 14,
          }}
        >
          {err}
        </div>
      )}

      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: 18,
          padding: 32,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            marginBottom: 6,
            color: "#e8e4f0",
          }}
        >
          Quick Product Tester
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#6b6585",
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          Test any reading product. Generates the reading via the Quick pipeline
          and shows the raw output with validation results. No database writes,
          no emails.
        </div>

        {/* ── Category tabs ──────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
          }}
        >
          {(
            [
              { key: "natal", label: "Natal Readings", count: NATAL_READINGS.length },
              { key: "tarot", label: "Tarot Readings", count: TAROT_READINGS.length },
              { key: "compatibility", label: "Compatibility", count: COMPATIBILITY_READINGS.length },
            ] as const
          ).map((tab) => {
            const active = category === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setCategory(tab.key);
                  setProduct("");
                }}
                style={{
                  flex: 1,
                  background: active
                    ? "linear-gradient(135deg,rgba(107,47,212,0.2),rgba(212,83,126,0.2))"
                    : "rgba(255,255,255,0.04)",
                  border: active
                    ? "1px solid rgba(212,83,126,0.4)"
                    : "0.5px solid rgba(255,255,255,0.1)",
                  borderRadius: 10,
                  padding: "12px 8px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: active ? "#e8e4f0" : "#6b6585",
                  }}
                >
                  {tab.label}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: active ? "#d4537e" : "#4a4560",
                    marginTop: 2,
                  }}
                >
                  {tab.count} products
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Product dropdown ───────────────────────────────────── */}
        <div style={{ marginBottom: 20 }}>
          <label style={lbl}>Select product</label>
          <select
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            style={{
              ...inp,
              appearance: "none",
              cursor: "pointer",
              color: product ? "#e8e4f0" : "rgba(232,228,240,0.4)",
            }}
          >
            <option value="" style={{ background: "#12121e" }}>
              Choose a reading...
            </option>
            {category === "natal" && (
              <>
                <optgroup
                  label="MINI (3 sections, ~800-1200 words)"
                  style={{ background: "#12121e", color: "#a7f0c1" }}
                >
                  {NATAL_READINGS.filter((p) => p.tier === "mini").map((p) => (
                    <option
                      key={p.value}
                      value={p.value}
                      style={{ background: "#12121e", color: "#e8e4f0" }}
                    >
                      {p.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup
                  label="MEDIUM (5-6 sections, ~1500-2000 words)"
                  style={{ background: "#12121e", color: "#b8a0e0" }}
                >
                  {NATAL_READINGS.filter((p) => p.tier === "medium").map(
                    (p) => (
                      <option
                        key={p.value}
                        value={p.value}
                        style={{ background: "#12121e", color: "#e8e4f0" }}
                      >
                        {p.label}
                      </option>
                    )
                  )}
                </optgroup>
                <optgroup
                  label="LONG (7-8 sections, ~2500-3500 words)"
                  style={{ background: "#12121e", color: "#f0a0b8" }}
                >
                  {NATAL_READINGS.filter((p) => p.tier === "long").map((p) => (
                    <option
                      key={p.value}
                      value={p.value}
                      style={{ background: "#12121e", color: "#e8e4f0" }}
                    >
                      {p.label}
                    </option>
                  ))}
                </optgroup>
              </>
            )}
            {category === "tarot" &&
              TAROT_READINGS.map((p) => (
                <option
                  key={p.value}
                  value={p.value}
                  style={{ background: "#12121e", color: "#e8e4f0" }}
                >
                  {p.label}
                </option>
              ))}
            {category === "compatibility" &&
              COMPATIBILITY_READINGS.map((p) => (
                <option
                  key={p.value}
                  value={p.value}
                  style={{ background: "#12121e", color: "#e8e4f0" }}
                >
                  {p.label}
                </option>
              ))}
          </select>
          {selectedProduct && (
            <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
              <span
                style={{
                  display: "inline-block",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  padding: "2px 8px",
                  borderRadius: 4,
                  background: TIER_BADGE[selectedProduct.tier].bg,
                  color: TIER_BADGE[selectedProduct.tier].text,
                }}
              >
                {TIER_BADGE[selectedProduct.tier].label}
              </span>
              <span style={{ fontSize: 12, color: "#4a4560" }}>
                {selectedProduct.tier === "mini"
                  ? "3 sections, 5-7 insights"
                  : selectedProduct.tier === "medium"
                    ? "5-6 sections, 7-9 insights"
                    : "7-8 sections, 12-14 insights"}
              </span>
            </div>
          )}
        </div>

        {/* ── Tarot fields ───────────────────────────────────────── */}
        {isTarot && product && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <label style={lbl}>Name (optional)</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah"
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Seed (for card draw)</label>
                <input
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder="any text (default: test)"
                  style={inp}
                />
              </div>
            </div>
            {(needsQuestion || product === "three-card-tarot") && (
              <div style={{ marginBottom: 20 }}>
                <label style={lbl}>
                  Question{needsQuestion ? " (required)" : " (optional)"}
                </label>
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={
                    needsQuestion
                      ? "e.g. Will I get the job?"
                      : "e.g. What should I focus on today?"
                  }
                  style={inp}
                />
              </div>
            )}
          </>
        )}

        {/* ── Birth data fields (natal + compatibility) ──────────── */}
        {needsBirthData && product && (
          <>
            {isCompat && (
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#d4537e",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  marginBottom: 10,
                }}
              >
                Person 1
              </div>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <label style={lbl}>Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah"
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Date of birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  style={inp}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <div>
                <label style={lbl}>Birth time</label>
                <input
                  type="time"
                  value={btime}
                  onChange={(e) => setBtime(e.target.value)}
                  disabled={btimeUnknown}
                  style={{
                    ...inp,
                    opacity: btimeUnknown ? 0.4 : 1,
                  }}
                />
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 12,
                    color: "#6b6585",
                    marginTop: 6,
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={btimeUnknown}
                    onChange={(e) => setBtimeUnknown(e.target.checked)}
                  />
                  Birth time unknown
                </label>
              </div>
              <div>
                <label style={lbl}>Birth city</label>
                <LocationPicker
                  value={city}
                  onChange={(location, rawText) => {
                    setCityGeo(location);
                    setCity(rawText);
                  }}
                  placeholder="e.g. New York, USA"
                />
              </div>
            </div>

            {/* ── Person 2 (compatibility only) ───────────────────── */}
            {isCompat && (
              <>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#6b2fd4",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginTop: 20,
                    marginBottom: 10,
                    paddingTop: 16,
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  Person 2
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <label style={lbl}>Name</label>
                    <input
                      value={name2}
                      onChange={(e) => setName2(e.target.value)}
                      placeholder="e.g. Alex"
                      style={inp}
                    />
                  </div>
                  <div>
                    <label style={lbl}>Date of birth</label>
                    <input
                      type="date"
                      value={dob2}
                      onChange={(e) => setDob2(e.target.value)}
                      style={inp}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 12,
                    marginBottom: 16,
                  }}
                >
                  <div>
                    <label style={lbl}>Birth time</label>
                    <input
                      type="time"
                      value={btime2}
                      onChange={(e) => setBtime2(e.target.value)}
                      disabled={btime2Unknown}
                      style={{
                        ...inp,
                        opacity: btime2Unknown ? 0.4 : 1,
                      }}
                    />
                    <label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: 12,
                        color: "#6b6585",
                        marginTop: 6,
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={btime2Unknown}
                        onChange={(e) => setBtime2Unknown(e.target.checked)}
                      />
                      Birth time unknown
                    </label>
                  </div>
                  <div>
                    <label style={lbl}>Birth city</label>
                    <LocationPicker
                      value={city2}
                      onChange={(location, rawText) => {
                        setCityGeo2(location);
                        setCity2(rawText);
                      }}
                      placeholder="e.g. London, UK"
                    />
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {/* ── Submit ──────────────────────────────────────────────── */}
        <button
          onClick={submit}
          disabled={!product}
          style={{
            width: "100%",
            background: product
              ? "linear-gradient(135deg,#6b2fd4,#d4537e)"
              : "rgba(255,255,255,0.06)",
            color: product ? "#fff" : "#4a4560",
            border: "none",
            borderRadius: 12,
            padding: "16px 20px",
            fontSize: 15,
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: product ? "pointer" : "not-allowed",
            letterSpacing: "0.2px",
            marginTop: 8,
          }}
        >
          {product
            ? `Generate ${selectedProduct?.label ?? product}`
            : "Select a product above"}
        </button>
      </div>

      <div
        style={{
          fontSize: 11,
          color: "#2e2c3e",
          textAlign: "center",
          marginTop: 14,
        }}
      >
        Quick pipeline test · no database writes · no emails
      </div>
    </div>
  );
}

/* ─── Result viewer ───────────────────────────────────────────── */

function ResultViewer({
  result,
  onNew,
  onFullReset,
}: {
  result: ReadingResult;
  onNew: () => void;
  onFullReset: () => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showRaw, setShowRaw] = useState(false);

  if (!result.ok) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div
          style={{
            background: "rgba(212,83,126,0.08)",
            border: "0.5px solid rgba(212,83,126,0.3)",
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "#f0a0b8",
              marginBottom: 6,
            }}
          >
            Generation failed
          </div>
          <div style={{ fontSize: 13, color: "#c87090" }}>
            {result.error ?? "Unknown error"}
          </div>
          <div style={{ fontSize: 12, color: "#6b6585", marginTop: 8 }}>
            Product: {result.product} | Tier: {result.tier} | Attempts:{" "}
            {result.attempts}
          </div>
        </div>
        <button
          onClick={onNew}
          style={{
            width: "100%",
            background: "transparent",
            border: "0.5px solid rgba(255,255,255,0.15)",
            color: "#e8e4f0",
            borderRadius: 12,
            padding: "14px 20px",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Try again
        </button>
      </div>
    );
  }

  const reading = result.reading;
  const sections = reading?.sections ?? [];
  const validation = result.validation;

  const wordCount = [
    reading?.opener ?? "",
    ...sections.map((s) => s.body),
    reading?.final_word ?? "",
  ]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              color: "#e8e4f0",
            }}
          >
            {result.product}
          </div>
          <div style={{ fontSize: 12, color: "#6b6585", marginTop: 4 }}>
            {sections.length} sections | ~{wordCount} words | {result.attempts}{" "}
            attempt{result.attempts > 1 ? "s" : ""} | tier: {result.tier}
            {result.synastryScore != null &&
              ` | synastry: ${result.synastryScore}/100`}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {validation && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: 11,
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: 100,
                background: validation.valid
                  ? "rgba(122,214,153,0.1)"
                  : "rgba(212,83,126,0.1)",
                color: validation.valid ? "#a7f0c1" : "#f0a0b8",
                border: `0.5px solid ${validation.valid ? "rgba(122,214,153,0.3)" : "rgba(212,83,126,0.3)"}`,
              }}
            >
              {validation.valid ? "PASSED" : "FAILED"} QA
            </span>
          )}
        </div>
      </div>

      {/* Validation details */}
      {validation &&
        (validation.errors.length > 0 || validation.warnings.length > 0) && (
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: "12px 16px",
              marginBottom: 16,
              fontSize: 12,
            }}
          >
            {validation.errors.map((e, i) => (
              <div key={`e${i}`} style={{ color: "#f0a0b8", marginBottom: 4 }}>
                Error: {e}
              </div>
            ))}
            {validation.warnings.map((w, i) => (
              <div key={`w${i}`} style={{ color: "#e8c86b", marginBottom: 4 }}>
                Warning: {w}
              </div>
            ))}
          </div>
        )}

      {/* Opener */}
      {reading?.opener && (
        <div
          style={{
            background: "rgba(107,47,212,0.06)",
            border: "0.5px solid rgba(107,47,212,0.2)",
            borderRadius: 14,
            padding: "16px 20px",
            marginBottom: 16,
            fontSize: 14,
            color: "#c8b8e8",
            lineHeight: 1.7,
            fontStyle: "italic",
          }}
        >
          {reading.opener}
        </div>
      )}

      {/* Sections */}
      {sections.map((section, i) => {
        const isExpanded = expanded === i;
        const sectionWords = section.body.split(/\s+/).filter(Boolean).length;
        return (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: 14,
              marginBottom: 10,
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setExpanded(isExpanded ? null : i)}
              style={{
                width: "100%",
                background: "none",
                border: "none",
                padding: "14px 18px",
                cursor: "pointer",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontFamily: "inherit",
              }}
            >
              <div style={{ textAlign: "left" }}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#6b6585",
                    fontWeight: 600,
                    marginRight: 8,
                  }}
                >
                  {i + 1}/{sections.length}
                </span>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#e8e4f0",
                  }}
                >
                  {section.title}
                </span>
              </div>
              <span style={{ fontSize: 11, color: "#4a4560" }}>
                {sectionWords}w {isExpanded ? "▲" : "▼"}
              </span>
            </button>
            {isExpanded && (
              <div
                style={{
                  padding: "0 18px 18px",
                  fontSize: 14,
                  color: "#c8c0d8",
                  lineHeight: 1.8,
                  whiteSpace: "pre-wrap",
                }}
              >
                {section.body}
              </div>
            )}
          </div>
        );
      })}

      {/* Final word */}
      {reading?.final_word && (
        <div
          style={{
            background: "rgba(212,83,126,0.06)",
            border: "0.5px solid rgba(212,83,126,0.2)",
            borderRadius: 14,
            padding: "16px 20px",
            marginTop: 16,
            fontSize: 14,
            color: "#e8a0c0",
            lineHeight: 1.7,
            fontStyle: "italic",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: "#6b6585",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            Final word
          </div>
          {reading.final_word}
        </div>
      )}

      {/* Raw JSON toggle */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => setShowRaw(!showRaw)}
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "0.5px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            padding: "8px 14px",
            fontSize: 12,
            color: "#6b6585",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {showRaw ? "Hide" : "Show"} raw JSON
        </button>
        {showRaw && (
          <pre
            style={{
              marginTop: 10,
              background: "rgba(0,0,0,0.3)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: 10,
              padding: 16,
              fontSize: 11,
              color: "#8b8599",
              overflow: "auto",
              maxHeight: 400,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>

      {/* Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginTop: 20,
        }}
      >
        <button
          onClick={onNew}
          style={{
            background: "linear-gradient(135deg,#6b2fd4,#d4537e)",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "14px 20px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Regenerate same product
        </button>
        <button
          onClick={onFullReset}
          style={{
            background: "transparent",
            border: "0.5px solid rgba(255,255,255,0.15)",
            color: "#e8e4f0",
            borderRadius: 12,
            padding: "14px 20px",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          New product
        </button>
      </div>
    </div>
  );
}
