"use client";

/**
 * PremiumReadingApp — /internal/premium admin form.
 *
 * Unified manual-fulfillment + quick-test workflow for all products:
 *   Premium pipeline (DB + emails): Book, In-Depth, Reading, Love Letter
 *   Moon products: A1/A2/B1/B2
 *   Quick pipeline (generate only): 19 natal, 3 tarot, 1 compatibility
 */

import { useEffect, useState } from "react";
import LocationPicker from "@/components/LocationPicker";
import type { SelectedLocation } from "@/components/LocationPicker";
import {
  INTERNAL_SELECTABLE_SOURCES,
  ORDER_SOURCE_LABEL,
  type OrderSource,
} from "@/lib/premium/order-sources";
import MoonPhasePanel from "@/components/MoonPhasePanel";
import type { MoonProduct } from "@/components/MoonPhasePanel";

/* ─── Types ─────────────────────────────────────────────────────── */

type PremiumProductType =
  | "birth-chart-book"
  | "in-depth-reading"
  | "reading"
  | "future-love-letter";

type MoonProductKey = "moon-a1" | "moon-a2" | "moon-b1" | "moon-b2";

const MOON_PRODUCT_MAP: Record<string, MoonProduct> = {
  "moon-a1": "a1",
  "moon-a2": "a2",
  "moon-b1": "b1",
  "moon-b2": "b2",
};

/* ─── Product catalogs ─────────────────────────────────────────── */

interface QuickProductOption {
  value: string;
  label: string;
  tier: "mini" | "medium" | "long";
}

const PREMIUM_PRODUCTS: {
  value: PremiumProductType;
  label: string;
  price: string;
}[] = [
  { value: "birth-chart-book", label: "Birth Chart Book", price: "$24" },
  { value: "in-depth-reading", label: "In-Depth Reading", price: "$24" },
  { value: "reading", label: "Birth Chart Reading", price: "$15" },
  { value: "future-love-letter", label: "Love Letter", price: "$4.99" },
];

const MOON_PRODUCTS_LIST: {
  value: MoonProductKey;
  label: string;
  price: string;
}[] = [
  { value: "moon-a1", label: "Soulmate Moon", price: "A1" },
  { value: "moon-a2", label: "Moon Match", price: "A2" },
  { value: "moon-b1", label: "Astrology Compatibility", price: "B1" },
  { value: "moon-b2", label: "Astrology Match", price: "B2" },
];

const NATAL_READINGS: QuickProductOption[] = [
  { value: "big-three-mini", label: "Big Three Mini", tier: "mini" },
  { value: "blind-reading", label: "Blind Reading", tier: "mini" },
  { value: "gift-reading", label: "Gift Reading", tier: "mini" },
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
  { value: "situationship-reality-check", label: "Situationship Reality Check", tier: "medium" },
  { value: "life-purpose", label: "Life Purpose", tier: "medium" },
  {
    value: "brutally-honest-reading",
    label: "Brutally Honest",
    tier: "medium",
  },
  { value: "personality-decoded", label: "Personality Decoded", tier: "long" },
  { value: "year-ahead", label: "Year Ahead", tier: "long" },
];

const TAROT_READINGS: QuickProductOption[] = [
  { value: "daily-tarot", label: "Daily Tarot", tier: "mini" },
  { value: "three-card-tarot", label: "Three Card Tarot", tier: "mini" },
  { value: "yes-no-tarot", label: "Yes/No Tarot", tier: "mini" },
];

const TIER_BADGE: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  mini: { bg: "rgba(122,214,153,0.12)", text: "#a7f0c1", label: "MINI" },
  medium: { bg: "rgba(107,47,212,0.12)", text: "#b8a0e0", label: "MEDIUM" },
  long: { bg: "rgba(212,83,126,0.12)", text: "#f0a0b8", label: "LONG" },
};

const PREMIUM_SET = new Set<string>(PREMIUM_PRODUCTS.map((p) => p.value));
const MOON_SET = new Set<string>(MOON_PRODUCTS_LIST.map((p) => p.value));
const NATAL_SET = new Set<string>(NATAL_READINGS.map((p) => p.value));
const TAROT_SET = new Set<string>(TAROT_READINGS.map((p) => p.value));

const PRODUCT_LABEL: Record<string, string> = {
  "birth-chart-book": "Book",
  "in-depth-reading": "In-Depth Reading",
  reading: "Reading",
  "future-love-letter": "Love Letter",
  "moon-a1": "Soulmate Moon",
  "moon-a2": "Moon Match",
  "moon-b1": "Astrology Compatibility",
  "moon-b2": "Astrology Match",
  ...Object.fromEntries(NATAL_READINGS.map((p) => [p.value, p.label])),
  ...Object.fromEntries(TAROT_READINGS.map((p) => [p.value, p.label])),
  compatibility: "Compatibility Reading",
};

function getZodiacSign(dob: string): string {
  const d = new Date(dob + "T12:00:00");
  const month = d.getMonth() + 1;
  const day = d.getDate();
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

const PRODUCT_TAGLINES: Record<string, [string, string]> = {
  "love-reading": ["What your heart already knows.", "Written in your Venus."],
  "career-reading": ["Your ambition, decoded.", "The career your chart demands."],
  "shadow-reading": ["The parts you hide from everyone.", "Your chart sees everything."],
  "moon-reading": ["Your emotional blueprint, exposed.", "What your Moon truly needs."],
  "money-reading": ["Your relationship with money.", "Decoded from your chart."],
  "saturn-return": ["The reckoning you needed.", "Growth disguised as chaos."],
  "soulmate-reading": ["Who your chart is looking for.", "The connection that changes everything."],
  "hidden-feelings": ["What you won't say out loud.", "Your chart already knows."],
  "ex-love-reading": ["What really happened between you.", "The closure your chart can give."],
  "blunt-love": ["No sugarcoating your love life.", "The honest truth, finally."],
  "blunt-career": ["Your career wake-up call.", "What you've been avoiding."],
  "monthly-transit": ["What this month is bringing.", "The energy you need to know."],
  "life-purpose": ["Why you're actually here.", "Your chart has the answer."],
  "brutally-honest-reading": ["The truth you didn't ask for.", "Your chart holds nothing back."],
  "personality-decoded": ["Every layer of who you are.", "Decoded from the stars."],
  "year-ahead": ["What's coming for you.", "Your roadmap for the year."],
  "big-three-mini": ["Sun. Moon. Rising.", "The three that define you."],
  "blind-reading": ["No expectations. No filters.", "Just your chart, raw."],
  "gift-reading": ["A reading, personally gifted.", "Written in their stars."],
  compatibility: ["Two charts. One truth.", "What's really between you."],
  "daily-tarot": ["One card. One message.", "What today needs you to hear."],
  "three-card-tarot": ["Past. Present. Future.", "The cards lay it out."],
  "yes-no-tarot": ["One question. One card.", "The answer you needed."],
  "situationship-reality-check": ["Name it or leave it.", "Your chart won't let you hide."],
};

const PREMIUM_LOADING_MSGS: Record<PremiumProductType, string[]> = {
  "birth-chart-book": [
    "Calculating chart…",
    "Extracting insight signals…",
    "Interpreting with Claude…",
    "Writing the book…",
    "Running QA…",
    "Saving to database…",
    "Sending emails…",
  ],
  "in-depth-reading": [
    "Calculating chart…",
    "Extracting insight signals…",
    "Interpreting with Claude…",
    "Writing the reading…",
    "Running QA…",
    "Saving to database…",
    "Sending emails…",
  ],
  reading: [
    "Geocoding birth location…",
    "Calculating chart…",
    "Generating reading with Claude…",
    "Validating output…",
    "Saving to database…",
    "Sending emails…",
  ],
  "future-love-letter": [
    "Calculating chart…",
    "Interpreting placements…",
    "Writing with Gemini…",
    "Saving to database…",
    "Sending emails…",
  ],
};

/* ─── Style tokens ──────────────────────────────────────────────── */

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

/* ─── Result shapes ─────────────────────────────────────────────── */

interface EmailStatus {
  sent: boolean;
  id: string | null;
  error: string | null;
}
interface FulfillmentResult {
  ok: true;
  productType: PremiumProductType;
  productLabel: string;
  customer: { name: string; email: string; firstName: string };
  orderSource: OrderSource;
  accessToken: string;
  readingUrl: string;
  readingId: string;
  model: string;
  emailStatus: {
    confirmation: EmailStatus;
    delivery: EmailStatus;
    reviewScheduled: EmailStatus;
    socialProofScheduled: EmailStatus;
  };
}

interface ReadingSection {
  title: string;
  body: string;
}
interface QuickReadingResult {
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

/* ─── Main component ────────────────────────────────────────────── */

interface Props {
  eyebrow?: string;
}

export default function PremiumReadingApp({ eyebrow }: Props) {
  const [screen, setScreen] = useState<"form" | "loading" | "done">("form");
  const [premiumResult, setPremiumResult] =
    useState<FulfillmentResult | null>(null);
  const [quickResult, setQuickResult] =
    useState<QuickReadingResult | null>(null);

  const [product, setProduct] = useState("");

  // Shared fields
  const [fname, setFname] = useState("");
  const [dob, setDob] = useState("");
  const [btime, setBtime] = useState("");
  const [city, setCity] = useState("");
  const [cityGeo, setCityGeo] = useState<SelectedLocation | null>(null);

  // Premium-only
  const [email, setEmail] = useState("");
  const [orderSource, setOrderSource] = useState<OrderSource | "">("");
  const [model, setModel] = useState<string>("sonnet-5");

  // Quick-only
  const [btimeUnknown, setBtimeUnknown] = useState(false);

  // Compatibility person 2
  const [name2, setName2] = useState("");
  const [dob2, setDob2] = useState("");
  const [btime2, setBtime2] = useState("");
  const [btime2Unknown, setBtime2Unknown] = useState(false);
  const [city2, setCity2] = useState("");
  const [cityGeo2, setCityGeo2] = useState<SelectedLocation | null>(null);

  // Tarot
  const [question, setQuestion] = useState("");
  const [seed, setSeed] = useState("");

  const [err, setErr] = useState("");
  const [loadMsg, setLoadMsg] = useState("");
  const [elapsed, setElapsed] = useState(0);

  // Derive mode from product
  const isPremium = PREMIUM_SET.has(product);
  const isMoon = MOON_SET.has(product);
  const isNatal = NATAL_SET.has(product);
  const isTarot = TAROT_SET.has(product);
  const isCompat = product === "compatibility";
  const isQuick = isNatal || isTarot || isCompat;

  useEffect(() => {
    if (screen !== "loading" || !product) return;
    if (isPremium) {
      const msgs = PREMIUM_LOADING_MSGS[product as PremiumProductType];
      let i = 0;
      setLoadMsg(msgs[0]);
      const t = setInterval(() => {
        i = (i + 1) % msgs.length;
        setLoadMsg(msgs[i]);
      }, 2200);
      return () => clearInterval(t);
    }
    const msgs = [
      "Calculating chart…",
      "Building prompt…",
      "Generating with Claude…",
      "Running QA validation…",
    ];
    let i = 0;
    setLoadMsg(msgs[0]);
    const t = setInterval(() => {
      i = (i + 1) % msgs.length;
      setLoadMsg(msgs[i]);
    }, 3000);
    return () => clearInterval(t);
  }, [screen, product, isPremium]);

  useEffect(() => {
    if (screen !== "loading" || !isQuick) return;
    setElapsed(0);
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [screen, isQuick]);

  const fullReset = () => {
    setScreen("form");
    setPremiumResult(null);
    setQuickResult(null);
    setProduct("");
    setFname("");
    setEmail("");
    setDob("");
    setBtime("");
    setCity("");
    setCityGeo(null);
    setOrderSource("");
    setBtimeUnknown(false);
    setName2("");
    setDob2("");
    setBtime2("");
    setBtime2Unknown(false);
    setCity2("");
    setCityGeo2(null);
    setQuestion("");
    setSeed("");
    setErr("");
  };

  const quickRetry = () => {
    setScreen("form");
    setQuickResult(null);
    setErr("");
  };

  const submit = async () => {
    if (!product) {
      setErr("Please select a product.");
      return;
    }

    if (isPremium) {
      if (
        !fname.trim() ||
        !email.trim() ||
        !dob ||
        !btime ||
        !city.trim()
      ) {
        setErr(
          "Please fill in name, email, date of birth, exact birth time, and city."
        );
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        setErr("Please enter a valid email address.");
        return;
      }
      if (!orderSource) {
        setErr("Please choose an order source.");
        return;
      }
    } else if (isTarot) {
      if (product === "yes-no-tarot" && !question.trim()) {
        setErr("Yes/No Tarot requires a question.");
        return;
      }
    } else if (isNatal || isCompat) {
      if (!fname.trim() || !dob) {
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
          setErr(
            "Please enter Person 2's birth time or check 'Birth time unknown'."
          );
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

    if (isPremium) {
      const browserTz =
        Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
      const payload: Record<string, unknown> = {
        product_type: product,
        name: fname.trim(),
        email: email.trim().toLowerCase(),
        dob,
        birth_time: btime,
        city: city.trim(),
        timezone: browserTz,
        order_source: orderSource,
      };
      if (
        product === "birth-chart-book" ||
        product === "in-depth-reading"
      ) {
        payload.model = model;
      }
      if (cityGeo) {
        payload.birth_lat = cityGeo.lat;
        payload.birth_lng = cityGeo.lng;
      }

      try {
        const res = await fetch("/api/internal/premium/fulfill", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok || !data.ok) {
          throw new Error(data.error ?? `Server error ${res.status}`);
        }
        setPremiumResult(data as FulfillmentResult);
        setScreen("done");
      } catch (e) {
        setScreen("form");
        setErr(
          e instanceof Error
            ? e.message
            : "Something went wrong. Please try again."
        );
      }
    } else {
      const payload: Record<string, unknown> = { product };

      if (isTarot) {
        payload.seed = seed.trim() || "test";
        payload.name = fname.trim() || undefined;
        if (question.trim()) payload.question = question.trim();
      } else {
        payload.name = fname.trim();
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
            ...(cityGeo2
              ? { birth_lat: cityGeo2.lat, birth_lng: cityGeo2.lng }
              : {}),
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
        setQuickResult(data as QuickReadingResult);
        setScreen("done");
      } catch (e) {
        setScreen("form");
        setErr(
          e instanceof Error ? e.message : "Something went wrong."
        );
      }
    }
  };

  /* ── LOADING ──────────────────────────────────────────────────── */
  if (screen === "loading") {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <span style={{ fontSize: 60, display: "block" }}>
          {isTarot ? "\u{1F0CF}" : "\u{1F319}"}
        </span>
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 22,
            margin: "16px 0 8px",
            color: "#e8e4f0",
          }}
        >
          {loadMsg}
        </div>
        <div style={{ fontSize: 13, color: "#4a4560" }}>
          {isPremium
            ? product === "birth-chart-book" ||
              product === "in-depth-reading"
              ? "This can take 90–180 seconds."
              : "This can take 30–60 seconds."
            : `${elapsed}s elapsed`}
        </div>
      </div>
    );
  }

  /* ── PREMIUM DONE ─────────────────────────────────────────────── */
  if (screen === "done" && premiumResult) {
    return <PremiumResultPanel result={premiumResult} onNew={fullReset} />;
  }

  /* ── QUICK DONE ───────────────────────────────────────────────── */
  if (screen === "done" && quickResult) {
    return (
      <QuickResultViewer
        result={quickResult}
        onRetry={quickRetry}
        onNew={fullReset}
        customerName={fname}
        customerDob={dob}
      />
    );
  }

  /* ── MOON PRODUCTS ────────────────────────────────────────────── */
  if (isMoon) {
    return (
      <MoonPhasePanel
        initialProduct={MOON_PRODUCT_MAP[product]}
        onBack={() => setProduct("")}
      />
    );
  }

  /* ── FORM ─────────────────────────────────────────────────────── */
  const showModelSelector =
    product === "birth-chart-book" || product === "in-depth-reading";
  const selectedNatal = NATAL_READINGS.find((p) => p.value === product);
  const selectedTarot = TAROT_READINGS.find((p) => p.value === product);
  const selectedQuickInfo =
    selectedNatal ??
    selectedTarot ??
    (isCompat
      ? ({
          value: "compatibility",
          label: "Compatibility Reading",
          tier: "long",
        } as const)
      : null);

  const buttonLabel = product
    ? isPremium
      ? `Generate & Send ${PRODUCT_LABEL[product]} →`
      : `Generate ${PRODUCT_LABEL[product] ?? product}`
    : "Select a product above →";

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", width: "100%" }}>
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.2em] text-[#6b6585] mb-3">
          {eyebrow}
        </p>
      )}
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
          Manual fulfillment
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#6b6585",
            lineHeight: 1.6,
            marginBottom: 28,
          }}
        >
          Select a product, enter birth details. Premium products save to
          Supabase and send emails. Quick products generate only.
        </div>

        {/* ── Product selector ─────────────────────────────────────── */}
        <ProductSelector product={product} setProduct={setProduct} />

        {/* ── Tier badge for quick products ─────────────────────── */}
        {selectedQuickInfo && (
          <div
            style={{
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                display: "inline-block",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                padding: "2px 8px",
                borderRadius: 4,
                background: TIER_BADGE[selectedQuickInfo.tier].bg,
                color: TIER_BADGE[selectedQuickInfo.tier].text,
              }}
            >
              {TIER_BADGE[selectedQuickInfo.tier].label}
            </span>
            <span style={{ fontSize: 12, color: "#4a4560" }}>
              {selectedQuickInfo.tier === "mini"
                ? "3 sections, 5-7 insights"
                : selectedQuickInfo.tier === "medium"
                  ? "5-6 sections, 7-9 insights"
                  : "7-8 sections, 12-14 insights"}
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 10,
                fontWeight: 600,
                color: "#6b6585",
                letterSpacing: "0.08em",
                background: "rgba(255,255,255,0.04)",
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              QUICK PIPELINE
            </span>
          </div>
        )}

        {/* ── Tarot fields ──────────────────────────────────────── */}
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
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
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
            {(product === "yes-no-tarot" ||
              product === "three-card-tarot") && (
              <div style={{ marginBottom: 20 }}>
                <label style={lbl}>
                  Question
                  {product === "yes-no-tarot"
                    ? " (required)"
                    : " (optional)"}
                </label>
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder={
                    product === "yes-no-tarot"
                      ? "e.g. Will I get the job?"
                      : "e.g. What should I focus on today?"
                  }
                  style={inp}
                />
              </div>
            )}
          </>
        )}

        {/* ── Premium birth fields ──────────────────────────────── */}
        {isPremium && product && (
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
                <label style={lbl}>Customer name</label>
                <input
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
                  placeholder="e.g. Sarah"
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Customer email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
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
                <label style={lbl}>Date of birth</label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  style={inp}
                />
              </div>
              <div>
                <label style={lbl}>Exact birth time</label>
                <input
                  type="time"
                  value={btime}
                  onChange={(e) => setBtime(e.target.value)}
                  style={inp}
                />
                <small
                  style={{
                    fontSize: 11,
                    color: "#3a3858",
                    marginTop: 4,
                    display: "block",
                  }}
                >
                  From birth certificate
                </small>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={lbl}>City &amp; country of birth</label>
              <LocationPicker
                value={city}
                onChange={(location, rawText) => {
                  setCityGeo(location);
                  setCity(rawText);
                }}
                placeholder="e.g. New York, USA or London, UK"
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={lbl}>Order source</label>
              <select
                value={orderSource}
                onChange={(e) =>
                  setOrderSource(e.target.value as OrderSource | "")
                }
                style={{
                  ...inp,
                  appearance: "none",
                  cursor: "pointer",
                  color: orderSource
                    ? "#e8e4f0"
                    : "rgba(232,228,240,0.4)",
                }}
              >
                <option value="" style={{ background: "#12121e" }}>
                  Choose one&hellip;
                </option>
                {INTERNAL_SELECTABLE_SOURCES.map((src) => (
                  <option
                    key={src}
                    value={src}
                    style={{ background: "#12121e", color: "#e8e4f0" }}
                  >
                    {ORDER_SOURCE_LABEL[src]}
                  </option>
                ))}
              </select>
            </div>

            {showModelSelector && (
              <div style={{ marginBottom: 24 }}>
                <label style={lbl}>Generator model</label>
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  style={{
                    ...inp,
                    appearance: "none",
                    cursor: "pointer",
                  }}
                >
                  <option
                    value="haiku-4-5"
                    style={{ background: "#12121e", color: "#e8e4f0" }}
                  >
                    Claude Haiku 4.5 (fast, cheap)
                  </option>
                  <option
                    value="sonnet-5"
                    style={{ background: "#12121e", color: "#e8e4f0" }}
                  >
                    Claude Sonnet 5 (matches Gumroad book)
                  </option>
                  <option
                    value="opus-4-8"
                    style={{ background: "#12121e", color: "#e8e4f0" }}
                  >
                    Claude Opus 4.8 (highest quality)
                  </option>
                </select>
                <small
                  style={{
                    fontSize: 11,
                    color: "#3a3858",
                    marginTop: 4,
                    display: "block",
                  }}
                >
                  Sonnet 5 is what real paying customers get. Haiku is
                  faster for internal tests.
                </small>
              </div>
            )}

            {product === "future-love-letter" && (
              <div
                style={{
                  background: "rgba(107,47,212,0.08)",
                  border: "0.5px solid rgba(107,47,212,0.2)",
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: 12,
                  color: "#9b8bb8",
                  marginBottom: 20,
                  lineHeight: 1.6,
                }}
              >
                Love Letter uses Google Gemini. Make sure to select a
                city from the dropdown (coordinates required).
              </div>
            )}
          </>
        )}

        {/* ── Quick natal/compat birth fields ───────────────────── */}
        {(isNatal || isCompat) && product && (
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
                  value={fname}
                  onChange={(e) => setFname(e.target.value)}
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
                        onChange={(e) =>
                          setBtime2Unknown(e.target.checked)
                        }
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
          }}
        >
          {buttonLabel}
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
        {isPremium
          ? "Manual fulfillment · real Supabase persistence · real customer emails"
          : isQuick
            ? "Quick pipeline test · no database writes · no emails"
            : "Select a product to begin"}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Product selector
───────────────────────────────────────────────────────────────── */

function ProductSelector({
  product,
  setProduct,
}: {
  product: string;
  setProduct: (v: string) => void;
}) {
  const renderBtn = (p: {
    value: string;
    label: string;
    price: string;
  }) => {
    const selected = product === p.value;
    return (
      <button
        key={p.value}
        type="button"
        onClick={() => setProduct(p.value)}
        style={{
          background: selected
            ? "linear-gradient(135deg,rgba(107,47,212,0.25),rgba(212,83,126,0.25))"
            : "rgba(255,255,255,0.04)",
          border: selected
            ? "1px solid rgba(212,83,126,0.5)"
            : "0.5px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          padding: "14px 10px",
          cursor: "pointer",
          textAlign: "center",
          fontFamily: "inherit",
          transition: "all 0.15s ease",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: selected ? "#e8e4f0" : "#8b8599",
          }}
        >
          {p.label}
        </div>
        <div
          style={{
            fontSize: 11,
            color: selected ? "#d4537e" : "#4a4560",
            marginTop: 2,
          }}
        >
          {p.price}
        </div>
      </button>
    );
  };

  const natalValue =
    NATAL_SET.has(product) || product === "compatibility" ? product : "";
  const tarotValue = TAROT_SET.has(product) ? product : "";

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Premium products */}
      <label style={lbl}>Premium products</label>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 8,
          marginBottom: 14,
        }}
      >
        {PREMIUM_PRODUCTS.map(renderBtn)}
      </div>

      {/* Moon products */}
      <label style={lbl}>Moon products</label>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gap: 8,
          marginBottom: 14,
        }}
      >
        {MOON_PRODUCTS_LIST.map(renderBtn)}
      </div>

      {/* Divider */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          margin: "18px 0 16px",
        }}
      />

      {/* Natal + Tarot dropdowns */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
        }}
      >
        <div>
          <label style={lbl}>Natal readings</label>
          <select
            value={natalValue}
            onChange={(e) => setProduct(e.target.value || "")}
            style={{
              ...inp,
              appearance: "none",
              cursor: "pointer",
              color: natalValue
                ? "#e8e4f0"
                : "rgba(232,228,240,0.4)",
            }}
          >
            <option value="" style={{ background: "#12121e" }}>
              Choose a reading&hellip;
            </option>
            <optgroup
              label="MINI (3 sections)"
              style={{ background: "#12121e", color: "#a7f0c1" }}
            >
              {NATAL_READINGS.filter((p) => p.tier === "mini").map(
                (p) => (
                  <option
                    key={p.value}
                    value={p.value}
                    style={{
                      background: "#12121e",
                      color: "#e8e4f0",
                    }}
                  >
                    {p.label}
                  </option>
                ),
              )}
            </optgroup>
            <optgroup
              label="MEDIUM (5-6 sections)"
              style={{ background: "#12121e", color: "#b8a0e0" }}
            >
              {NATAL_READINGS.filter((p) => p.tier === "medium").map(
                (p) => (
                  <option
                    key={p.value}
                    value={p.value}
                    style={{
                      background: "#12121e",
                      color: "#e8e4f0",
                    }}
                  >
                    {p.label}
                  </option>
                ),
              )}
            </optgroup>
            <optgroup
              label="LONG (7-8 sections)"
              style={{ background: "#12121e", color: "#f0a0b8" }}
            >
              {NATAL_READINGS.filter((p) => p.tier === "long").map(
                (p) => (
                  <option
                    key={p.value}
                    value={p.value}
                    style={{
                      background: "#12121e",
                      color: "#e8e4f0",
                    }}
                  >
                    {p.label}
                  </option>
                ),
              )}
            </optgroup>
            <optgroup
              label="COMPATIBILITY"
              style={{ background: "#12121e", color: "#e8c86b" }}
            >
              <option
                value="compatibility"
                style={{ background: "#12121e", color: "#e8e4f0" }}
              >
                Compatibility Reading
              </option>
            </optgroup>
          </select>
        </div>
        <div>
          <label style={lbl}>Tarot readings</label>
          <select
            value={tarotValue}
            onChange={(e) => setProduct(e.target.value || "")}
            style={{
              ...inp,
              appearance: "none",
              cursor: "pointer",
              color: tarotValue
                ? "#e8e4f0"
                : "rgba(232,228,240,0.4)",
            }}
          >
            <option value="" style={{ background: "#12121e" }}>
              Choose a reading&hellip;
            </option>
            {TAROT_READINGS.map((p) => (
              <option
                key={p.value}
                value={p.value}
                style={{ background: "#12121e", color: "#e8e4f0" }}
              >
                {p.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Premium result panel
───────────────────────────────────────────────────────────────── */

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        background: ok
          ? "rgba(122,214,153,0.10)"
          : "rgba(212,83,126,0.10)",
        border: `0.5px solid ${ok ? "rgba(122,214,153,0.32)" : "rgba(212,83,126,0.32)"}`,
        color: ok ? "#a7f0c1" : "#f0a0b8",
        borderRadius: 100,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.06em",
      }}
    >
      {ok ? "✓" : "✗"} {label}
    </span>
  );
}

function PremiumResultPanel({
  result,
  onNew,
}: {
  result: FulfillmentResult;
  onNew: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [retryResult, setRetryResult] = useState<string | null>(null);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(result.readingUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const retryEmails = async () => {
    setRetrying(true);
    setRetryResult(null);
    try {
      const res = await fetch("/api/internal/premium/retry-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readingId: result.readingId }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setRetryResult(`Failed: ${data.error ?? "Unknown error"}`);
      } else {
        setRetryResult(
          data.delivery.sent
            ? "Delivery email resent successfully."
            : `Delivery failed: ${data.delivery.error ?? "Unknown"}`,
        );
      }
    } catch (e) {
      setRetryResult(
        `Error: ${e instanceof Error ? e.message : "Unknown"}`,
      );
    } finally {
      setRetrying(false);
    }
  };

  const productLabel =
    result.productLabel ??
    PRODUCT_LABEL[result.productType] ??
    result.productType;
  const linkLabel = `Copy ${productLabel} Link`;
  const hasEmailFailure =
    !result.emailStatus.confirmation.sent ||
    !result.emailStatus.delivery.sent ||
    !result.emailStatus.reviewScheduled.sent;

  const row: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "160px 1fr",
    gap: 12,
    padding: "11px 0",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    fontSize: 13,
    alignItems: "center",
  };
  const rowLabel: React.CSSProperties = {
    fontSize: 10.5,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "#6b6585",
    fontWeight: 600,
  };
  const rowValue: React.CSSProperties = {
    color: "#e8e4f0",
    wordBreak: "break-all",
  };
  const tokenMono: React.CSSProperties = {
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 12.5,
    color: "#efe9dc",
    background: "rgba(255,255,255,0.04)",
    padding: "8px 10px",
    borderRadius: 8,
    border: "0.5px solid rgba(255,255,255,0.08)",
    display: "block",
  };

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", width: "100%" }}>
      <div
        style={{
          background: "rgba(122,214,153,0.06)",
          border: "0.5px solid rgba(122,214,153,0.28)",
          borderRadius: 14,
          padding: "12px 16px",
          color: "#a7f0c1",
          fontSize: 13,
          fontWeight: 600,
          marginBottom: 20,
          letterSpacing: "0.02em",
        }}
      >
        &#10003; {productLabel} generated and saved. Customer emails
        dispatched below.
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: 18,
          padding: 28,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 20,
            marginBottom: 14,
            color: "#e8e4f0",
          }}
        >
          Fulfillment record
        </div>

        <div style={row}>
          <span style={rowLabel}>Product</span>
          <span style={rowValue}>{productLabel}</span>
        </div>
        <div style={row}>
          <span style={rowLabel}>Customer</span>
          <span style={rowValue}>
            {result.customer.name} &middot; {result.customer.email}
          </span>
        </div>
        <div style={row}>
          <span style={rowLabel}>Order source</span>
          <span style={rowValue}>
            {ORDER_SOURCE_LABEL[result.orderSource]}
          </span>
        </div>
        <div style={row}>
          <span style={rowLabel}>Model / Engine</span>
          <span style={rowValue}>{result.model}</span>
        </div>
        <div style={row}>
          <span style={rowLabel}>Reading ID</span>
          <span style={rowValue}>{result.readingId}</span>
        </div>

        <div
          style={{
            ...row,
            borderBottom: "none",
            gridTemplateColumns: "160px 1fr",
            alignItems: "start",
          }}
        >
          <span style={rowLabel}>Access token</span>
          <span style={tokenMono}>{result.accessToken}</span>
        </div>

        <div style={{ marginTop: 18 }}>
          <label style={lbl}>
            Full URL (safe to send to customer)
          </label>
          <div style={{ display: "flex", gap: 10 }}>
            <input
              readOnly
              value={result.readingUrl}
              onFocus={(e) => e.currentTarget.select()}
              style={{
                ...inp,
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, monospace",
                fontSize: 12.5,
              }}
            />
            <button
              onClick={copyUrl}
              style={{
                background: copied
                  ? "#a7f0c1"
                  : "linear-gradient(135deg,#6b2fd4,#d4537e)",
                color: copied ? "#0b0b0b" : "#fff",
                border: "none",
                borderRadius: 10,
                padding: "0 18px",
                fontSize: 13,
                fontWeight: 600,
                whiteSpace: "nowrap",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {copied ? "Copied" : linkLabel}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 22 }}>
          <label style={lbl}>Email delivery</label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <StatusPill
              ok={result.emailStatus.confirmation.sent}
              label="confirmation"
            />
            <StatusPill
              ok={result.emailStatus.delivery.sent}
              label="delivery"
            />
            <StatusPill
              ok={result.emailStatus.reviewScheduled.sent}
              label="review scheduled"
            />
            <StatusPill
              ok={result.emailStatus.socialProofScheduled.sent}
              label="social-proof scheduled"
            />
          </div>
          {(() => {
            const errors: Array<[string, string]> = [];
            const s = result.emailStatus;
            if (s.confirmation.error)
              errors.push(["confirmation", s.confirmation.error]);
            if (s.delivery.error)
              errors.push(["delivery", s.delivery.error]);
            if (s.reviewScheduled.error)
              errors.push(["review", s.reviewScheduled.error]);
            if (s.socialProofScheduled.error)
              errors.push([
                "social-proof",
                s.socialProofScheduled.error,
              ]);
            if (errors.length === 0) return null;
            return (
              <div
                style={{
                  marginTop: 12,
                  fontSize: 12,
                  color: "#f0a0b8",
                }}
              >
                {errors.map(([elabel, msg]) => (
                  <div key={elabel}>
                    <b>{elabel}:</b> {msg}
                  </div>
                ))}
              </div>
            );
          })()}
        </div>

        {(hasEmailFailure || true) && (
          <div style={{ marginTop: 18 }}>
            <button
              onClick={retryEmails}
              disabled={retrying}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "0.5px solid rgba(255,255,255,0.15)",
                color: "#e8e4f0",
                borderRadius: 10,
                padding: "10px 16px",
                fontSize: 13,
                fontWeight: 500,
                cursor: retrying ? "wait" : "pointer",
                fontFamily: "inherit",
                opacity: retrying ? 0.5 : 1,
              }}
            >
              {retrying ? "Resending…" : "Resend Delivery Email"}
            </button>
            {retryResult && (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: retryResult.startsWith("All")
                    ? "#a7f0c1"
                    : "#f0a0b8",
                }}
              >
                {retryResult}
              </div>
            )}
          </div>
        )}
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
          marginTop: 18,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Fulfill another order
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Quick result viewer
───────────────────────────────────────────────────────────────── */

function QuickResultViewer({
  result,
  onRetry,
  onNew,
  customerName,
  customerDob,
}: {
  result: QuickReadingResult;
  onRetry: () => void;
  onNew: () => void;
  customerName?: string;
  customerDob?: string;
}) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [showRaw, setShowRaw] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const zodiac = customerDob ? getZodiacSign(customerDob) : null;
  const tagline = PRODUCT_TAGLINES[result.product];
  const productTitle =
    PRODUCT_LABEL[result.product] ?? result.product;
  const isMediumOrLong =
    result.tier === "medium" || result.tier === "long";

  const downloadPdf = async () => {
    if (!result.reading) return;
    setDownloading(true);
    try {
      const res = await fetch("/api/internal/quick/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: result.product,
          name: customerName || "Reader",
          reading: result.reading,
          zodiacSign: zodiac,
        }),
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bluntchart-${result.product}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      /* silent — button shows state */
    } finally {
      setDownloading(false);
    }
  };

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
          <div
            style={{
              fontSize: 12,
              color: "#6b6585",
              marginTop: 8,
            }}
          >
            Product: {result.product} | Tier: {result.tier} |
            Attempts: {result.attempts}
          </div>
        </div>
        <button
          onClick={onRetry}
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
            {PRODUCT_LABEL[result.product] ?? result.product}
          </div>
          <div
            style={{ fontSize: 12, color: "#6b6585", marginTop: 4 }}
          >
            {sections.length} sections | ~{wordCount} words |{" "}
            {result.attempts} attempt
            {result.attempts > 1 ? "s" : ""} | tier: {result.tier}
            {result.synastryScore != null &&
              ` | synastry: ${result.synastryScore}/100`}
          </div>
        </div>
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

      {validation &&
        (validation.errors.length > 0 ||
          validation.warnings.length > 0) && (
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
              <div
                key={`e${i}`}
                style={{ color: "#f0a0b8", marginBottom: 4 }}
              >
                Error: {e}
              </div>
            ))}
            {validation.warnings.map((w, i) => (
              <div
                key={`w${i}`}
                style={{ color: "#e8c86b", marginBottom: 4 }}
              >
                Warning: {w}
              </div>
            ))}
          </div>
        )}

      {/* ── Booklet cover preview (medium/long) ──────────────── */}
      {isMediumOrLong && result.ok && (
        <div
          style={{
            display: "flex",
            gap: 20,
            marginBottom: 20,
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              flex: "0 0 200px",
              background:
                "linear-gradient(180deg, #0a0910 0%, #12101e 100%)",
              borderRadius: 12,
              padding: "28px 20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              border: "0.5px solid rgba(240,184,74,0.15)",
              minHeight: 260,
            }}
          >
            <div
              style={{
                fontSize: 8,
                letterSpacing: 4,
                color: "#f0b84a",
                fontWeight: 700,
                marginBottom: 20,
              }}
            >
              BLUNTCHART
            </div>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: "#f5c99e",
                lineHeight: 1.2,
                marginBottom: 10,
              }}
            >
              {productTitle}
            </div>
            {tagline && (
              <div
                style={{
                  fontSize: 10,
                  color: "#c4bdb2",
                  fontStyle: "italic",
                  lineHeight: 1.5,
                  marginBottom: 16,
                }}
              >
                {tagline[0]}
                <br />
                {tagline[1]}
              </div>
            )}
            <div
              style={{
                fontSize: 7,
                letterSpacing: 3,
                color: "#7a736a",
                fontWeight: 600,
                marginBottom: 4,
              }}
            >
              PREPARED FOR
            </div>
            <div
              style={{
                fontSize: 14,
                color: "#efe9dc",
                marginBottom: 4,
              }}
            >
              {customerName || "Reader"}
            </div>
            {zodiac && (
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: 3,
                  color: "#f0b84a",
                  marginTop: 2,
                }}
              >
                {zodiac.toUpperCase()}
              </div>
            )}
          </div>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#e8e4f0",
                marginBottom: 8,
              }}
            >
              PDF Booklet Ready
            </div>
            <div
              style={{
                fontSize: 12,
                color: "#6b6585",
                lineHeight: 1.6,
                marginBottom: 16,
              }}
            >
              Download the formatted booklet with cover page,
              all {(reading?.sections ?? []).length} sections, and
              closing page.
            </div>
            <button
              onClick={downloadPdf}
              disabled={downloading}
              style={{
                background:
                  "linear-gradient(135deg,#6b2fd4,#d4537e)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "12px 20px",
                fontSize: 13,
                fontWeight: 600,
                cursor: downloading ? "wait" : "pointer",
                fontFamily: "inherit",
                opacity: downloading ? 0.6 : 1,
                alignSelf: "flex-start",
              }}
            >
              {downloading
                ? "Generating PDF…"
                : "Download PDF Booklet"}
            </button>
          </div>
        </div>
      )}

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

      {sections.map((section, i) => {
        const isExp = expanded === i;
        const sectionWords = section.body
          .split(/\s+/)
          .filter(Boolean).length;
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
              onClick={() => setExpanded(isExp ? null : i)}
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
                {sectionWords}w {isExp ? "▲" : "▼"}
              </span>
            </button>
            {isExp && (
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
          marginTop: 20,
        }}
      >
        <button
          onClick={onRetry}
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
          onClick={onNew}
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
