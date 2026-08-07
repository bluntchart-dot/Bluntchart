"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { trackEvent } from "@/lib/future-love-letter/analytics";
import type { FutureLoveResult } from "@/lib/future-love-letter/types";
import Link from "next/link";
import Image from "next/image";

import StarBackground from "./components/StarBackground";
import Hero from "./components/Hero";
import TeaseAndForm from "./components/TeaseAndForm";
import FutureHusbandVisual from "./components/FutureHusbandVisual";
import InteractiveSampleLetter from "./components/InteractiveSampleLetter";
import AstrologyTrustSection from "./components/AstrologyTrustSection";
import FinalCTA from "./components/FinalCTA";
import FAQ from "./components/FAQ";

const FUTURE_PERSON_LABEL = "Future Husband";
const SIGNATURE = "Someone worth waiting for";

/* ─── NAVBAR ─────────────────────────────────────────────────────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fll-nav${scrolled ? " fll-nav-scrolled" : ""}`}>
      <div className="fll-nav-inner">
        <Link href="/" className="fll-nav-logo">
          <Image src="/mascot.png" alt="BluntChart" width={30} height={30} style={{ borderRadius: "50%" }} />
          <span className="fll-nav-logo-text">BluntChart</span>
        </Link>
        <button
          className="fll-nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          type="button"
        >
          <span className={`fll-nav-ham-line${menuOpen ? " open" : ""}`} />
          <span className={`fll-nav-ham-line${menuOpen ? " open" : ""}`} />
          <span className={`fll-nav-ham-line${menuOpen ? " open" : ""}`} />
        </button>
        <ul className={`fll-nav-links${menuOpen ? " fll-nav-links-open" : ""}`}>
          <li><Link href="/#try-it" onClick={() => setMenuOpen(false)}>Try Free</Link></li>
          <li><Link href="/free-birth-chart-readings" onClick={() => setMenuOpen(false)}>How It Works</Link></li>
          <li><Link href="/zodiac-signs" onClick={() => setMenuOpen(false)}>Zodiac Signs</Link></li>
          <li><Link href="/future-love-letter" onClick={() => setMenuOpen(false)}>Love-letter</Link></li>
          <li><Link href="/#try-it" className="fll-nav-cta" onClick={() => setMenuOpen(false)}>Get Reading $15</Link></li>
        </ul>
      </div>
    </nav>
  );
}

/* ─── GENERATION MESSAGES ────────────────────────────────────────────── */

const GEN_MESSAGES = [
  "Checking what you call a 'type'...",
  "Reading what actually makes you feel safe...",
  "Looking at what you fall for versus what you actually need...",
  "Giving your future husband a very detailed briefing...",
  "He's writing...",
  "Okay. This got personal.",
];

/* ─── SEGMENTATION OPTIONS ───────────────────────────────────────────── */

const SEGMENTS = [
  { value: "single", label: "No one. I'm extremely single." },
  { value: "someone", label: "...there might be someone." },
  { value: "partner", label: "My boyfriend / partner." },
  { value: "husband", label: "My husband." },
] as const;

type SegmentValue = (typeof SEGMENTS)[number]["value"];

/* ─── MAIN COMPONENT ─────────────────────────────────────────────────── */

export default function FutureLoveLetterClient() {
  const [stage, setStage] = useState<"funnel" | "generating" | "reading">(
    "funnel",
  );
  const [form, setForm] = useState({
    name: "",
    email: "",
    dob: "",
    time: "",
    place: "",
    lat: undefined as number | undefined,
    lng: undefined as number | undefined,
  });
  const [result, setResult] = useState<FutureLoveResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [genMessageIdx, setGenMessageIdx] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<number | null>(null);
  const [copiedQuote, setCopiedQuote] = useState<number | null>(null);
  const [formTouched, setFormTouched] = useState(false);
  const [segment, setSegment] = useState<SegmentValue | null>(null);

  const formRef = useRef<HTMLDivElement>(null);
  const readingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    trackEvent("future_love_page_view");
  }, []);

  const scrollToForm = useCallback(() => {
    trackEvent("future_love_cta_clicked");
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleFormChange = useCallback(
    (updates: Partial<typeof form>) => {
      setForm((f) => ({ ...f, ...updates }));
    },
    [],
  );

  const handleFormTouch = useCallback(() => {
    if (!formTouched) {
      setFormTouched(true);
      trackEvent("future_love_form_started");
    }
  }, [formTouched]);

  const canSubmit =
    form.name.trim().length > 0 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
    form.dob.length > 0 &&
    form.time.length > 0 &&
    form.lat !== undefined &&
    form.lng !== undefined;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    trackEvent("future_love_form_submitted");
    setStage("generating");
    setError(null);
    setGenMessageIdx(0);
    window.scrollTo({ top: 0, behavior: "smooth" });

    const msgInterval = setInterval(() => {
      setGenMessageIdx((i) =>
        i < GEN_MESSAGES.length - 1 ? i + 1 : i,
      );
    }, 3500);

    trackEvent("future_love_generation_started");

    try {
      const res = await fetch("/api/future-love-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          date: form.dob,
          time: form.time,
          lat: form.lat,
          lng: form.lng,
          placeName: form.place,
        }),
      });

      clearInterval(msgInterval);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          (data as { error?: string }).error || "Something went wrong",
        );
      }

      const data = (await res.json()) as FutureLoveResult;
      setResult(data);
      setStage("reading");
      trackEvent("future_love_generation_success");
      trackEvent("future_love_generated");

      setTimeout(() => {
        readingRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } catch (err) {
      clearInterval(msgInterval);
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
      setStage("funnel");
      trackEvent("future_love_generation_failed");
    }
  }

  function handleFeedback(value: string) {
    setFeedback(value);
    const eventMap: Record<string, Parameters<typeof trackEvent>[0]> = {
      positive: "future_love_feedback_positive",
      partial: "future_love_feedback_partial",
      negative: "future_love_feedback_negative",
    };
    if (eventMap[value]) trackEvent(eventMap[value]);
    trackEvent("future_love_completed");
  }

  function handleSegment(value: SegmentValue) {
    setSegment(value);
    trackEvent("future_love_segment_selected", { segment: value });
  }

  function handleUpsellClick(destination: string) {
    trackEvent("future_love_upsell_clicked", { destination, segment: segment || "none" });
  }

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /* ─── GENERATING ─────────────────────────────────────────────────── */

  if (stage === "generating") {
    return (
      <div className="fll-page">
        <Navbar />
        <StarBackground />
        <style>{styles}</style>
        <div className="fll-gen-container">
          <div className="fll-gen-env-wrap">
            <div className="fll-gen-glow" />
            <img
              src="/Premium envelope.png"
              alt=""
              className="fll-gen-env-img"
            />
          </div>
          <p className="fll-gen-message" key={genMessageIdx}>
            {GEN_MESSAGES[genMessageIdx]}
          </p>
        </div>
      </div>
    );
  }

  /* ─── READING ────────────────────────────────────────────────────── */

  if (stage === "reading" && result) {
    const paragraphs = result.letter
      .split("\n")
      .map((p) => p.trim())
      .filter(Boolean)
      .filter((p) => !/^my\s+love[,.]?\s*$/i.test(p))
      .filter((p) => !/^my\s+dear[,.]?\s*$/i.test(p));

    return (
      <div className="fll-page" ref={readingRef}>
        <Navbar />
        <StarBackground />
        <style>{styles}</style>

        <div className="fll-reading-container">
          <div className="fll-reading-logo">
            <Link href="/">
              <Image src="/mascot.png" alt="BluntChart" width={24} height={24} style={{ borderRadius: "50%", opacity: 0.6 }} />
            </Link>
          </div>
          <div className="fll-reading-header">
            <p className="fll-reading-eyebrow">A LOVE LETTER</p>
            <h1 className="fll-reading-h1">
              FROM YOUR {FUTURE_PERSON_LABEL.toUpperCase()}
            </h1>
          </div>

          <div className="fll-paper">
            <div className="fll-paper-inner">
              <p className="fll-paper-date">{today}</p>
              <p className="fll-paper-salutation">My love,</p>
              {paragraphs.map((p, i) => {
                if (
                  p.startsWith("Yours,") ||
                  p === SIGNATURE ||
                  p === "♥"
                ) {
                  return (
                    <p key={i} className="fll-paper-closing">
                      {p}
                    </p>
                  );
                }
                return (
                  <p key={i} className="fll-paper-body">
                    {p}
                  </p>
                );
              })}
            </div>
          </div>

          {/* Feedback */}
          <div className="fll-feedback-section">
            <h2 className="fll-section-heading">
              BE HONEST.
              <br />
              DID HE GET YOU?
            </h2>
            <div className="fll-feedback-options">
              {[
                { value: "positive", label: "Annoyingly, yes." },
                { value: "partial", label: "A little too much." },
                { value: "negative", label: "He's got work to do." },
              ].map((opt) => (
                <button
                  key={opt.value}
                  className={`fll-feedback-btn ${feedback === opt.value ? "active" : ""}`}
                  onClick={() => handleFeedback(opt.value)}
                  type="button"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            {feedback && !feedbackSent && (
              <div className="fll-feedback-text-wrap">
                <p className="fll-feedback-prompt">
                  What line made you stop scrolling?
                </p>
                <textarea
                  className="fll-feedback-textarea"
                  placeholder="Paste the line that hit different..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  rows={3}
                />
                <button
                  className="fll-btn-secondary"
                  onClick={() => {
                    if (feedbackText.trim()) {
                      trackEvent("future_love_feedback_text_submitted");
                    }
                    setFeedbackSent(true);
                  }}
                  type="button"
                >
                  {feedbackText.trim() ? "Send" : "Skip"}
                </button>
              </div>
            )}
            {feedbackSent && (
              <p className="fll-feedback-thanks">Thanks. He&rsquo;ll try to keep it up.</p>
            )}

            {feedback && (
              <Link href="/reviews/love-letter" className="fll-review-link">
                Leave a review &rarr;
              </Link>
            )}
          </div>

          {/* Share */}
          {result.shareableQuotes.length > 0 && (
            <div className="fll-share-section">
              <h2 className="fll-section-heading">
                KEEP THE PART THAT GOT YOU.
              </h2>
              <p className="fll-share-sub">
                You don&rsquo;t have to expose the entire emotional damage
                report.
                <br />
                Pick one line. Tap to copy.
              </p>
              <div className="fll-share-quotes">
                {result.shareableQuotes.map((q, i) => (
                  <button
                    key={i}
                    className={`fll-share-card ${selectedQuote === i ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedQuote(i);
                      trackEvent("future_love_quote_selected");
                      const text = `"${q}"\n\n— A Love Letter From My ${FUTURE_PERSON_LABEL}\nbluntchart.com/future-love-letter`;
                      navigator.clipboard.writeText(text).then(() => {
                        setCopiedQuote(i);
                        setTimeout(() => setCopiedQuote(null), 2000);
                      });
                    }}
                    type="button"
                  >
                    <span className="fll-share-card-quote">
                      &ldquo;{q}&rdquo;
                    </span>
                    <span className="fll-share-card-attr">
                      A Love Letter From My {FUTURE_PERSON_LABEL}
                    </span>
                    <span className="fll-share-card-brand">
                      bluntchart.com
                    </span>
                    <span className="fll-share-card-copy">
                      {copiedQuote === i ? "Copied!" : "Tap to copy"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Post-letter segmentation */}
          <div className="fll-segment-section">
            <h2 className="fll-section-heading">
              OKAY, ONE QUESTION&hellip;
              <br />
              WHO WERE YOU THINKING ABOUT
              <br />
              WHILE READING THAT?
            </h2>
            <div className="fll-segment-options">
              {SEGMENTS.map((opt) => (
                <button
                  key={opt.value}
                  className={`fll-segment-btn ${segment === opt.value ? "active" : ""}`}
                  onClick={() => handleSegment(opt.value)}
                  type="button"
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="fll-segment-micro">
              No names. We&rsquo;re just nosy.
            </p>

            {/* Contextual upsell based on segment */}
            {segment === "single" && (
              <div className="fll-upsell">
                <h3 className="fll-upsell-heading">
                  HE TOLD YOU HOW HE&rsquo;LL LOVE YOU.
                  <br />
                  NOW FIND OUT WHY YOU NEED
                  <br />
                  LOVE THAT WAY IN THE FIRST PLACE.
                </h3>
                <p className="fll-upsell-body">
                  The letter only explored a slice of your chart. Go
                  deeper into the patterns, contradictions, emotional
                  needs and parts of yourself that don&rsquo;t fit neatly
                  into a zodiac-sign description.
                </p>
                <Link
                  href="/in-depth-birth-chart"
                  className="fll-cta"
                  onClick={() => handleUpsellClick("in-depth")}
                >
                  GO DEEPER INTO MY CHART &rarr;
                </Link>
              </div>
            )}

            {segment === "someone" && (
              <div className="fll-upsell">
                <h3 className="fll-upsell-heading">
                  OH.
                  <br />
                  SO THERE IS A SUSPECT.
                </h3>
                <p className="fll-upsell-body">
                  Your letter started with your chart. If you have their
                  birth details, we can put both charts on the table.
                </p>
                <Link
                  href="/#waitlist"
                  className="fll-cta"
                  onClick={() => handleUpsellClick("compatibility")}
                >
                  CHECK OUR COMPATIBILITY &rarr;
                </Link>
                <p className="fll-upsell-alt">
                  Or{" "}
                  <Link
                    href="/in-depth-birth-chart"
                    className="fll-link"
                    onClick={() => handleUpsellClick("in-depth")}
                  >
                    go deeper into your own chart &rarr;
                  </Link>
                </p>
              </div>
            )}

            {segment === "partner" && (
              <div className="fll-upsell">
                <h3 className="fll-upsell-heading">
                  YOU HAD SOMEONE IN MIND,
                  <br />
                  DIDN&rsquo;T YOU?
                </h3>
                <p className="fll-upsell-body">
                  A letter can explore your relationship patterns. Two
                  birth charts let us explore what happens when yours
                  meets theirs.
                </p>
                <Link
                  href="/#waitlist"
                  className="fll-cta"
                  onClick={() => handleUpsellClick("compatibility")}
                >
                  READ OUR COMPATIBILITY &rarr;
                </Link>
              </div>
            )}

            {segment === "husband" && (
              <div className="fll-upsell">
                <h3 className="fll-upsell-heading">
                  OH, SO YOU BROUGHT RECEIPTS.
                </h3>
                <p className="fll-upsell-body">
                  You&rsquo;ve already got the husband. Now put both
                  charts on the table and see how the relationship looks
                  astrologically.
                </p>
                <Link
                  href="/#waitlist"
                  className="fll-cta"
                  onClick={() => handleUpsellClick("compatibility")}
                >
                  READ OUR COMPATIBILITY &rarr;
                </Link>
              </div>
            )}
          </div>

          <p className="fll-disclaimer">
            Created from your birth chart for reflection and entertainment.
          </p>
        </div>
      </div>
    );
  }

  /* ─── FUNNEL ─────────────────────────────────────────────────────── */

  return (
    <div className="fll-page">
      <Navbar />
      <StarBackground />
      <style>{styles}</style>

      <Hero onCta={scrollToForm} />
      <TeaseAndForm
        ref={formRef}
        form={form}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
        canSubmit={canSubmit}
        error={error}
        onFormTouch={handleFormTouch}
      />
      <FutureHusbandVisual onCta={scrollToForm} />
      <InteractiveSampleLetter onCta={scrollToForm} />
      <AstrologyTrustSection />
      <FinalCTA onCta={scrollToForm} />
      <FAQ />

      <p className="fll-disclaimer">
        Created from your birth chart for reflection and entertainment.
      </p>
    </div>
  );
}

/* ─── ALL STYLES ───────────────────────────────────────────────────── */

const styles = `
/* ══════════════════════════════════════════════════════════════════════
   NAVBAR
   ══════════════════════════════════════════════════════════════════════ */
.fll-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 16px 0;
  transition: all 0.3s;
}
.fll-nav-scrolled {
  background: rgba(7,7,13,0.92);
  border-bottom: 1px solid rgba(255,255,255,0.08);
  backdrop-filter: blur(16px);
}
.fll-nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.fll-nav-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}
.fll-nav-logo-text {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f0b84a, #d4537e, #6b2fd4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.fll-nav-links {
  display: flex;
  align-items: center;
  gap: 28px;
  list-style: none;
  margin: 0;
  padding: 0;
}
.fll-nav-links a {
  font-size: 0.83rem;
  font-weight: 500;
  color: rgba(232,228,240,0.55);
  text-decoration: none;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  transition: color 0.2s;
}
.fll-nav-links a:hover { color: #e8e4f0; }
.fll-nav-cta {
  color: #F0B84A !important;
  border: 1px solid rgba(240,184,74,0.18);
  padding: 6px 15px;
  border-radius: 4px;
}
.fll-nav-cta:hover { background: rgba(240,184,74,0.18); }
.fll-nav-hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
}
.fll-nav-ham-line {
  display: block;
  width: 22px;
  height: 2px;
  background: rgba(232,228,240,0.6);
  border-radius: 2px;
  transition: all 0.25s;
}
.fll-nav-ham-line.open:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.fll-nav-ham-line.open:nth-child(2) { opacity: 0; }
.fll-nav-ham-line.open:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

@media (max-width: 768px) {
  .fll-nav-hamburger { display: flex; }
  .fll-nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: rgba(7,7,13,0.96);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 20px 24px;
    gap: 16px;
    backdrop-filter: blur(16px);
  }
  .fll-nav-links-open { display: flex; }
  .fll-nav-links a { font-size: 0.9rem; }
}

/* ══════════════════════════════════════════════════════════════════════
   READING LOGO (top-right on letter page)
   ══════════════════════════════════════════════════════════════════════ */
.fll-reading-logo {
  position: absolute;
  top: 96px;
  right: 24px;
  z-index: 10;
}
.fll-reading-logo a {
  display: flex;
  align-items: center;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.fll-reading-logo a:hover { opacity: 1; }

/* ══════════════════════════════════════════════════════════════════════
   BASE
   ══════════════════════════════════════════════════════════════════════ */
.fll-page {
  position: relative;
  min-height: 100vh;
  background: #07070d;
  color: #e8e4f0;
  overflow-x: hidden;
}

/* ══════════════════════════════════════════════════════════════════════
   TYPOGRAPHY RESETS
   ══════════════════════════════════════════════════════════════════════ */
.fll-eyebrow {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  color: rgba(232,228,240,0.4);
  margin-bottom: 20px;
}
.fll-h1 {
  font-family: var(--font-display);
  font-size: clamp(36px, 7vw, 64px);
  font-weight: 400;
  line-height: 1.12;
  letter-spacing: -0.5px;
  color: #f0e9dc;
  margin: 0 0 20px;
}
.fll-h1-accent { color: #F0B84A; }
.fll-section-heading {
  font-family: var(--font-display);
  font-size: clamp(24px, 4.5vw, 36px);
  font-weight: 400;
  line-height: 1.25;
  color: #f0e9dc;
  margin-bottom: 20px;
}
.fll-section-copy {
  font-size: 15px;
  line-height: 1.75;
  color: rgba(232,228,240,0.68);
  margin-bottom: 14px;
}
.fll-dim { color: rgba(232,228,240,0.35); }

/* ══════════════════════════════════════════════════════════════════════
   CTA BUTTONS
   ══════════════════════════════════════════════════════════════════════ */
.fll-cta {
  display: inline-block;
  padding: 18px 48px;
  background: linear-gradient(135deg, #F0B84A 0%, #d4a03c 100%);
  color: #1a1408;
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  text-decoration: none;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}
.fll-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(240,184,74,0.35);
}
.fll-cta:disabled {
  opacity: 0.35;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.fll-cta-submit { width: 100%; margin-top: 8px; }
.fll-cta-micro {
  font-size: 12px;
  color: rgba(232,228,240,0.3);
  margin-top: 14px;
}
.fll-cta-ghost {
  display: inline-block;
  padding: 12px 32px;
  background: transparent;
  border: 1px solid rgba(240,184,74,0.3);
  color: #F0B84A;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.2s;
}
.fll-cta-ghost:hover {
  background: rgba(240,184,74,0.08);
  border-color: rgba(240,184,74,0.5);
}

/* ══════════════════════════════════════════════════════════════════════
   HERO
   ══════════════════════════════════════════════════════════════════════ */
.fll-hero {
  position: relative;
  z-index: 1;
  padding: 96px 24px 40px;
  max-width: 1200px;
  margin: 0 auto;
}
.fll-hero-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}
.fll-hero-copy-col { text-align: left; }
.fll-hero-body {
  font-size: 16px;
  line-height: 1.85;
  color: rgba(232,228,240,0.65);
  margin-bottom: 36px;
}
.fll-hero-body p { margin-bottom: 12px; }
.fll-hero-punch {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 18px;
  color: #f0e9dc;
}

/* Envelope column */
.fll-hero-env-col {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 380px;
}
.fll-hero-env-glow {
  position: absolute;
  width: 90%;
  height: 80%;
  top: 10%;
  left: 5%;
  background: radial-gradient(ellipse, rgba(240,184,74,0.14) 0%, transparent 70%);
  filter: blur(40px);
  pointer-events: none;
}
.fll-hero-env-float {
  position: relative;
  z-index: 1;
  transition: transform 0.15s ease-out;
  animation: fll-float 7s ease-in-out infinite;
  perspective: 800px;
}
.fll-hero-env-img {
  width: 100%;
  max-width: 580px;
  height: auto;
  filter: drop-shadow(0 20px 50px rgba(0,0,0,0.5));
}

@keyframes fll-float {
  0%, 100% { transform: translateY(0) rotate(-0.5deg); }
  50% { transform: translateY(-14px) rotate(0.5deg); }
}

/* ══════════════════════════════════════════════════════════════════════
   COMBINED TEASE + FORM
   ══════════════════════════════════════════════════════════════════════ */
.fll-tease-form {
  position: relative;
  z-index: 1;
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
}
.fll-tease-form-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 64px;
  align-items: start;
}

/* Left: tease */
.fll-tease-col {
  text-align: left;
}
.fll-tease-sub {
  font-size: 15px;
  color: rgba(232,228,240,0.45);
  margin-bottom: 28px;
}
.fll-tease-taste {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(240,184,74,0.4);
  margin-bottom: 20px;
}
.fll-tease-fragments {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 28px;
}
.fll-tease-note {
  position: relative;
  background: linear-gradient(155deg, rgba(250,244,230,0.06) 0%, rgba(240,184,74,0.03) 100%);
  border: 0.5px solid rgba(240,184,74,0.12);
  border-radius: 4px;
  padding: 20px 24px;
  text-align: left;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  animation: fll-note-in 0.6s ease-out both;
}
.fll-tease-note:nth-child(1) { transform: rotate(-1.2deg); }
.fll-tease-note:nth-child(2) { transform: rotate(0.8deg); margin-left: 12px; }
.fll-tease-note:nth-child(3) { transform: rotate(-0.4deg); margin-left: 4px; }
.fll-tease-note-text {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 15px;
  line-height: 1.65;
  color: #f0e9dc;
}
@keyframes fll-note-in {
  from { opacity: 0; transform: translateY(16px) rotate(-1deg); }
  to { opacity: 1; }
}
.fll-tease-label {
  font-size: 12px;
  color: rgba(232,228,240,0.22);
}

/* Right: form */
.fll-form-col {
  background: #111118;
  border: 0.5px solid rgba(255,255,255,0.1);
  border-radius: 20px;
  padding: 36px 32px;
}
.fll-form-heading {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(232,228,240,0.5);
  margin-bottom: 24px;
  text-align: center;
}
.fll-form {
  text-align: left;
}
.fll-form-group { margin-bottom: 20px; }
.fll-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(232,228,240,0.5);
  margin-bottom: 8px;
}
.fll-input {
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 0.5px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 13px 14px;
  font-size: 14px;
  color: #e8e4f0;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}
.fll-input:focus {
  border-color: rgba(240,184,74,0.45);
}
.fll-input-hint {
  display: block;
  margin-top: 5px;
  font-size: 11px;
  color: rgba(232,228,240,0.3);
}
.fll-time-info-btn {
  display: inline-block;
  margin-top: 6px;
  background: none;
  border: none;
  color: rgba(240,184,74,0.55);
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 2px;
  font-family: inherit;
  padding: 0;
}
.fll-time-info {
  margin-top: 10px;
  padding: 14px 16px;
  background: rgba(240,184,74,0.04);
  border: 0.5px solid rgba(240,184,74,0.12);
  border-radius: 10px;
}
.fll-time-info p {
  font-size: 13px;
  line-height: 1.6;
  color: rgba(232,228,240,0.55);
  margin-bottom: 6px;
}
.fll-form-micro {
  text-align: center;
  margin-top: 16px;
}
.fll-form-micro p {
  font-size: 13px;
  color: rgba(232,228,240,0.4);
  margin-bottom: 2px;
}

/* Privacy expandable */
.fll-form-privacy {
  margin-top: 20px;
  text-align: center;
}
.fll-privacy-toggle {
  background: none;
  border: none;
  color: rgba(240,184,74,0.5);
  font-size: 12px;
  font-family: inherit;
  cursor: pointer;
  padding: 0;
  letter-spacing: 0.3px;
  transition: color 0.2s;
}
.fll-privacy-toggle:hover {
  color: rgba(240,184,74,0.75);
}
.fll-privacy-panel {
  margin-top: 14px;
  padding: 16px 18px;
  background: rgba(255,255,255,0.02);
  border: 0.5px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  text-align: left;
}
.fll-privacy-panel p {
  font-size: 13px;
  line-height: 1.6;
  color: rgba(232,228,240,0.5);
  margin-bottom: 8px;
}
.fll-link {
  color: rgba(240,184,74,0.5);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.fll-error {
  background: rgba(220,60,60,0.08);
  border: 0.5px solid rgba(220,60,60,0.2);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  text-align: center;
}
.fll-error p {
  font-size: 14px;
  color: rgba(232,228,240,0.7);
  margin-bottom: 4px;
}

/* ══════════════════════════════════════════════════════════════════════
   FUTURE HUSBAND VISUAL
   ══════════════════════════════════════════════════════════════════════ */
.fll-husband {
  position: relative;
  z-index: 1;
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
}
.fll-husband-inner {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
}
.fll-husband-img-col {
  position: relative;
  display: flex;
  justify-content: center;
}
.fll-husband-img-glow {
  position: absolute;
  width: 70%;
  height: 60%;
  top: 5%;
  right: 5%;
  background: radial-gradient(ellipse, rgba(191,151,90,0.14) 0%, transparent 70%);
  filter: blur(50px);
  pointer-events: none;
}
.fll-husband-img-wrap {
  position: relative;
  z-index: 1;
  transition: transform 0.4s ease-out;
}
.fll-husband-img {
  width: 100%;
  max-width: 440px;
  height: auto;
  mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
}
.fll-husband-copy-col {
  text-align: left;
}
.fll-husband-sub {
  font-size: 16px;
  color: rgba(232,228,240,0.5);
  margin-bottom: 28px;
}
.fll-husband-body {
  font-size: 15px;
  line-height: 1.8;
  color: rgba(232,228,240,0.65);
  margin-bottom: 32px;
}
.fll-husband-body p { margin-bottom: 10px; }
.fll-husband-highlight {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 19px;
  color: #F0B84A;
  margin-top: 4px;
}

/* ══════════════════════════════════════════════════════════════════════
   INTERACTIVE SAMPLE LETTER
   ══════════════════════════════════════════════════════════════════════ */
.fll-sample {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 80px 24px;
  max-width: 720px;
  margin: 0 auto;
}
.fll-sample-sub {
  font-size: 15px;
  color: rgba(232,228,240,0.45);
  margin-bottom: 40px;
}

/* Envelope */
.fll-sample-env {
  position: relative;
  max-width: 560px;
  margin: 0 auto;
  perspective: 600px;
}
.fll-sample-env-body {
  position: relative;
  background: linear-gradient(160deg, #f5ede0 0%, #e8dcc8 100%);
  border-radius: 6px;
  padding: 60px 40px;
  box-shadow: 0 16px 50px rgba(0,0,0,0.35);
  z-index: 1;
}
.fll-sample-env-label {
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 3px;
  color: #6a5e4a;
  text-align: center;
}
.fll-sample-env-hint {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 12px;
  color: #9a8a6a;
  text-align: center;
  margin-top: 10px;
}

/* Flap */
.fll-sample-env-flap {
  position: absolute;
  top: -1px;
  left: 0;
  right: 0;
  height: 70px;
  background: linear-gradient(180deg, #ede4d3 0%, #e2d8c4 100%);
  clip-path: polygon(0 0, 50% 100%, 100% 0);
  z-index: 3;
  transform-origin: top center;
  transition: transform 0.7s ease-in-out;
}
.fll-sample-env.open .fll-sample-env-flap {
  transform: rotateX(180deg);
}
.fll-sample-env.open .fll-sample-env-body {
  box-shadow: 0 8px 30px rgba(0,0,0,0.2);
}

/* Paper */
.fll-sample-paper {
  position: relative;
  z-index: 2;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.8s ease-in-out 0.5s;
}
.fll-sample-env.open .fll-sample-paper {
  max-height: 600px;
}
.fll-sample-paper-inner {
  background: linear-gradient(170deg, #faf6ee 0%, #f2eadb 100%);
  border-radius: 0 0 4px 4px;
  padding: 32px 28px 80px;
  text-align: left;
}
.fll-sample-paper-line {
  font-family: var(--font-display);
  font-size: 15px;
  line-height: 1.75;
  color: #3a3428;
  margin-bottom: 0;
}
.fll-sample-paper-break { height: 14px; }
.fll-sample-paper-fade {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 130px;
  background: linear-gradient(transparent, #f2eadb);
  pointer-events: none;
}
.fll-sample-overlay {
  margin-top: 24px;
  animation: fll-fade-in 0.5s ease-out 1.2s both;
}
.fll-sample-overlay-title {
  font-family: var(--font-display);
  font-size: clamp(20px, 4vw, 28px);
  font-weight: 400;
  color: #f0e9dc;
  margin-bottom: 20px;
  line-height: 1.3;
}
.fll-sample-note {
  font-size: 11px;
  color: rgba(232,228,240,0.25);
  margin-top: 16px;
}
@keyframes fll-fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ══════════════════════════════════════════════════════════════════════
   ASTROLOGY TRUST / ORBIT
   ══════════════════════════════════════════════════════════════════════ */
.fll-trust {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 80px 24px;
  max-width: 720px;
  margin: 0 auto;
}
.fll-trust-answer {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 17px;
  color: rgba(232,228,240,0.6);
  margin-bottom: 12px;
}

/* Orbit visualization */
.fll-orbit {
  position: relative;
  width: 100%;
  max-width: 420px;
  margin: 48px auto;
  aspect-ratio: 1;
}
.fll-orbit-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}
.fll-orbit-ring {
  fill: none;
  stroke: rgba(240,184,74,0.22);
  stroke-width: 1;
  stroke-dasharray: 6 10;
  transform-origin: center;
  animation: fll-orbit-spin linear infinite;
}
@keyframes fll-orbit-spin {
  to { transform: rotate(360deg); }
}
.fll-orbit-line {
  stroke: rgba(240,184,74,0.18);
  stroke-width: 0.8;
  stroke-dasharray: 4 8;
}

/* Center */
.fll-orbit-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}
.fll-orbit-center-glow {
  position: absolute;
  inset: -24px;
  background: radial-gradient(circle, rgba(240,184,74,0.25) 0%, transparent 70%);
  border-radius: 50%;
  animation: fll-glow-pulse 4s ease-in-out infinite;
}
@keyframes fll-glow-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.1); }
}
.fll-orbit-center-label {
  position: relative;
  z-index: 1;
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #F0B84A;
  text-align: center;
  line-height: 1.4;
}

/* Nodes */
.fll-orbit-node {
  position: absolute;
  text-align: center;
  z-index: 2;
}
.fll-orbit-node-name {
  display: block;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: #F0B84A;
  margin-bottom: 4px;
}
.fll-orbit-node-desc {
  display: block;
  font-size: 12px;
  color: rgba(232,228,240,0.55);
  line-height: 1.4;
  max-width: 130px;
}
.fll-orbit-n1 { top: -6px; left: 50%; transform: translateX(-50%); }
.fll-orbit-n2 { top: 22%; right: -16px; text-align: right; }
.fll-orbit-n3 { bottom: 16%; right: -16px; text-align: right; }
.fll-orbit-n4 { bottom: -6px; left: 50%; transform: translateX(-50%); }
.fll-orbit-n5 { top: 38%; left: -16px; text-align: left; }

.fll-trust-result {
  margin-top: 48px;
  padding: 32px 28px;
  background: rgba(240,184,74,0.04);
  border: 0.5px solid rgba(240,184,74,0.12);
  border-radius: 16px;
}
.fll-trust-result-heading {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #F0B84A;
  margin-bottom: 14px;
}
.fll-trust-result p {
  font-size: 15px;
  line-height: 1.7;
  color: rgba(232,228,240,0.6);
  margin-bottom: 5px;
}

/* ══════════════════════════════════════════════════════════════════════
   FINAL CTA
   ══════════════════════════════════════════════════════════════════════ */
.fll-final {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 80px 24px;
  max-width: 720px;
  margin: 0 auto;
}
.fll-final-env-wrap {
  position: relative;
  margin-bottom: 36px;
}
.fll-final-env-glow {
  position: absolute;
  inset: -30px;
  background: radial-gradient(ellipse, rgba(240,184,74,0.12) 0%, transparent 65%);
  filter: blur(30px);
  pointer-events: none;
}
.fll-final-env-img {
  position: relative;
  width: 100%;
  max-width: 420px;
  height: auto;
  margin: 0 auto;
  display: block;
  filter: drop-shadow(0 14px 40px rgba(0,0,0,0.4));
  animation: fll-float 8s ease-in-out infinite;
}
.fll-final-sub {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 18px;
  color: rgba(232,228,240,0.5);
  margin-bottom: 28px;
}

/* ══════════════════════════════════════════════════════════════════════
   FAQ
   ══════════════════════════════════════════════════════════════════════ */
.fll-faq {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 60px 24px 40px;
  max-width: 660px;
  margin: 0 auto;
}
.fll-faq-list {
  text-align: left;
  margin-top: 32px;
}
.fll-faq-item {
  border-bottom: 0.5px solid rgba(255,255,255,0.06);
}
.fll-faq-q {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 18px 0;
  background: none;
  border: none;
  color: rgba(232,228,240,0.75);
  font-family: var(--font-body);
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  gap: 16px;
}
.fll-faq-icon {
  flex-shrink: 0;
  font-size: 18px;
  color: rgba(240,184,74,0.5);
}
.fll-faq-a {
  padding: 0 0 18px;
}
.fll-faq-a p {
  font-size: 14px;
  line-height: 1.7;
  color: rgba(232,228,240,0.5);
}

/* ══════════════════════════════════════════════════════════════════════
   GENERATION STATE
   ══════════════════════════════════════════════════════════════════════ */
.fll-gen-container {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 24px;
}
.fll-gen-env-wrap {
  position: relative;
  margin-bottom: 48px;
}
.fll-gen-glow {
  position: absolute;
  inset: -40px;
  background: radial-gradient(ellipse, rgba(240,184,74,0.15) 0%, transparent 65%);
  animation: fll-glow-pulse 3s ease-in-out infinite;
}
.fll-gen-env-img {
  position: relative;
  width: 320px;
  height: auto;
  filter: drop-shadow(0 16px 40px rgba(0,0,0,0.5));
  animation: fll-float 5s ease-in-out infinite;
}
.fll-gen-message {
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(16px, 3.5vw, 20px);
  color: rgba(232,228,240,0.55);
  text-align: center;
  animation: fll-fade-in 0.5s ease-out;
}

/* ══════════════════════════════════════════════════════════════════════
   READING STATE
   ══════════════════════════════════════════════════════════════════════ */
.fll-reading-container {
  position: relative;
  z-index: 1;
  padding: 96px 24px 80px;
  max-width: 720px;
  margin: 0 auto;
}
.fll-reading-header {
  text-align: center;
  margin-bottom: 48px;
}
.fll-reading-eyebrow {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  color: rgba(232,228,240,0.35);
  margin-bottom: 12px;
}
.fll-reading-h1 {
  font-family: var(--font-display);
  font-size: clamp(28px, 6vw, 44px);
  font-weight: 400;
  color: #F0B84A;
  margin: 0 0 16px;
}

/* Physical letter */
.fll-paper {
  position: relative;
  background: linear-gradient(170deg, #faf6ee 0%, #f2eadb 60%, #ede4d3 100%);
  border-radius: 3px;
  padding: 4px;
  box-shadow:
    0 2px 8px rgba(0,0,0,0.12),
    0 20px 60px rgba(0,0,0,0.3),
    0 0 80px rgba(240,184,74,0.05);
}
.fll-paper::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 3px;
  background: repeating-linear-gradient(
    0deg, transparent, transparent 28px,
    rgba(180,160,130,0.05) 28px, rgba(180,160,130,0.05) 29px
  );
  pointer-events: none;
}
.fll-paper-inner {
  padding: clamp(32px, 6vw, 56px) clamp(28px, 5vw, 48px);
}
.fll-paper-date {
  font-family: var(--font-body);
  font-size: 12px;
  color: #9a8a6a;
  margin-bottom: 28px;
}
.fll-paper-salutation {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 20px;
  color: #3a3428;
  margin-bottom: 24px;
}
.fll-paper-body {
  font-family: var(--font-display);
  font-size: clamp(15px, 2.5vw, 17px);
  line-height: 1.85;
  color: #3a3428;
  margin-bottom: 18px;
}
.fll-paper-closing {
  font-family: var(--font-display);
  font-style: italic;
  font-size: 17px;
  color: #5a4e3a;
  margin-bottom: 8px;
  margin-top: 32px;
}

/* ══════════════════════════════════════════════════════════════════════
   FEEDBACK
   ══════════════════════════════════════════════════════════════════════ */
.fll-feedback-section {
  margin-top: 80px;
  text-align: center;
}
.fll-feedback-options {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
  margin-top: 24px;
}
.fll-feedback-btn {
  padding: 12px 24px;
  background: rgba(255,255,255,0.04);
  border: 0.5px solid rgba(255,255,255,0.1);
  border-radius: 50px;
  color: rgba(232,228,240,0.65);
  font-family: var(--font-body);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.fll-feedback-btn:hover {
  background: rgba(255,255,255,0.07);
  border-color: rgba(240,184,74,0.25);
}
.fll-feedback-btn.active {
  background: rgba(240,184,74,0.1);
  border-color: rgba(240,184,74,0.35);
  color: #F0B84A;
}
.fll-feedback-text-wrap {
  margin-top: 24px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}
.fll-feedback-prompt {
  font-size: 14px;
  color: rgba(232,228,240,0.5);
  margin-bottom: 12px;
}
.fll-feedback-textarea {
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 0.5px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 12px 14px;
  font-size: 14px;
  color: #e8e4f0;
  font-family: inherit;
  outline: none;
  resize: vertical;
  margin-bottom: 12px;
}
.fll-feedback-textarea:focus {
  border-color: rgba(240,184,74,0.35);
}
.fll-feedback-thanks {
  font-size: 14px;
  color: rgba(240,184,74,0.6);
  font-style: italic;
  margin-top: 16px;
}
.fll-review-link {
  display: inline-block;
  margin-top: 20px;
  font-size: 13px;
  color: #F0B84A;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}
.fll-review-link:hover { opacity: 0.7; }
.fll-btn-secondary {
  padding: 10px 28px;
  background: rgba(255,255,255,0.06);
  border: 0.5px solid rgba(255,255,255,0.1);
  border-radius: 50px;
  color: rgba(232,228,240,0.65);
  font-family: var(--font-body);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.fll-btn-secondary:hover { background: rgba(255,255,255,0.1); }

/* ══════════════════════════════════════════════════════════════════════
   SHARE
   ══════════════════════════════════════════════════════════════════════ */
.fll-share-section {
  margin-top: 80px;
  text-align: center;
}
.fll-share-sub {
  font-size: 14px;
  color: rgba(232,228,240,0.4);
  margin-bottom: 28px;
  line-height: 1.6;
}
.fll-share-quotes {
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 440px;
  margin: 0 auto;
}
.fll-share-card {
  position: relative;
  background: linear-gradient(170deg, rgba(250,246,238,0.05) 0%, rgba(240,184,74,0.03) 100%);
  border: 0.5px solid rgba(255,255,255,0.07);
  border-radius: 14px;
  padding: 24px 22px 18px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}
.fll-share-card:hover {
  border-color: rgba(240,184,74,0.2);
}
.fll-share-card.selected {
  border-color: rgba(240,184,74,0.35);
  box-shadow: 0 0 28px rgba(240,184,74,0.06);
}
.fll-share-card-quote {
  display: block;
  font-family: var(--font-display);
  font-style: italic;
  font-size: 15px;
  line-height: 1.6;
  color: #f0e9dc;
  margin-bottom: 14px;
}
.fll-share-card-attr {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(240,184,74,0.45);
  margin-bottom: 3px;
}
.fll-share-card-brand {
  font-size: 10px;
  color: rgba(232,228,240,0.2);
}
.fll-share-card-copy {
  display: block;
  margin-top: 10px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: rgba(240,184,74,0.5);
  transition: color 0.2s;
}
.fll-share-card:hover .fll-share-card-copy { color: rgba(240,184,74,0.8); }
.fll-share-card.selected .fll-share-card-copy { color: #F0B84A; }

/* ══════════════════════════════════════════════════════════════════════
   POST-LETTER SEGMENTATION
   ══════════════════════════════════════════════════════════════════════ */
.fll-segment-section {
  margin-top: 80px;
  text-align: center;
}
.fll-segment-options {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 360px;
  margin: 24px auto 0;
}
.fll-segment-btn {
  padding: 14px 24px;
  background: rgba(255,255,255,0.03);
  border: 0.5px solid rgba(255,255,255,0.08);
  border-radius: 50px;
  color: rgba(232,228,240,0.6);
  font-family: var(--font-body);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}
.fll-segment-btn:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(240,184,74,0.2);
}
.fll-segment-btn.active {
  background: rgba(240,184,74,0.1);
  border-color: rgba(240,184,74,0.35);
  color: #F0B84A;
}
.fll-segment-micro {
  font-size: 12px;
  color: rgba(232,228,240,0.25);
  margin-top: 14px;
}

/* Upsell cards */
.fll-upsell {
  margin-top: 48px;
  padding: 36px 28px;
  background: rgba(240,184,74,0.03);
  border: 0.5px solid rgba(240,184,74,0.1);
  border-radius: 20px;
  animation: fll-fade-in 0.5s ease-out;
}
.fll-upsell-heading {
  font-family: var(--font-display);
  font-size: clamp(20px, 4vw, 28px);
  font-weight: 400;
  line-height: 1.3;
  color: #f0e9dc;
  margin-bottom: 16px;
}
.fll-upsell-body {
  font-size: 15px;
  line-height: 1.7;
  color: rgba(232,228,240,0.55);
  margin-bottom: 24px;
}
.fll-upsell-alt {
  font-size: 13px;
  color: rgba(232,228,240,0.35);
  margin-top: 14px;
}

/* ══════════════════════════════════════════════════════════════════════
   DISCLAIMER
   ══════════════════════════════════════════════════════════════════════ */
.fll-disclaimer {
  text-align: center;
  font-size: 11px;
  color: rgba(232,228,240,0.18);
  padding: 40px 24px 60px;
  position: relative;
  z-index: 1;
}

/* ══════════════════════════════════════════════════════════════════════
   RESPONSIVE
   ══════════════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .fll-hero { padding: 80px 20px 32px; }
  .fll-hero-inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .fll-hero-copy-col { text-align: center; }
  .fll-hero-env-col { min-height: 220px; }
  .fll-hero-env-img { max-width: 380px; }

  .fll-tease-form { padding: 60px 20px; }
  .fll-tease-form-inner {
    grid-template-columns: 1fr;
    gap: 48px;
  }
  .fll-tease-col { text-align: center; }
  .fll-tease-fragments { max-width: 100%; }
  .fll-form-col { padding: 28px 22px; }

  .fll-husband { padding: 60px 20px; }
  .fll-husband-inner {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .fll-husband-img-col { order: -1; }
  .fll-husband-img { max-width: 300px; }
  .fll-husband-copy-col { text-align: center; }

  .fll-sample, .fll-trust, .fll-final, .fll-faq {
    padding: 60px 20px;
  }

  .fll-sample-env-body { padding: 44px 28px; }

  .fll-orbit {
    max-width: 340px;
  }
  .fll-orbit-node-desc {
    font-size: 11px;
    max-width: 100px;
  }
}

@media (max-width: 480px) {
  .fll-hero-env-img { max-width: 300px; }
  .fll-husband-img { max-width: 240px; }
  .fll-orbit { max-width: 290px; }
  .fll-orbit-n2, .fll-orbit-n3 { right: -24px; }
  .fll-orbit-n5 { left: -24px; }
}

/* ══════════════════════════════════════════════════════════════════════
   REDUCED MOTION
   ══════════════════════════════════════════════════════════════════════ */
@media (prefers-reduced-motion: reduce) {
  .fll-hero-env-float,
  .fll-gen-env-img,
  .fll-final-env-img,
  .fll-orbit-ring,
  .fll-orbit-center-glow,
  .fll-tease-note {
    animation: none !important;
  }
  .fll-sample-env-flap,
  .fll-sample-paper {
    transition: none !important;
  }
}
`;
