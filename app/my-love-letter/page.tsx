"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import VibrantStarBackground from "./VibrantStarBackground";

interface LetterData {
  letter: string;
  shareableQuotes?: string[];
  meta?: { name?: string; dob?: string; birth_place?: string };
}

const FUTURE_PERSON_LABEL = "Future Husband";
const SIGNATURE = "Someone worth waiting for";

const SEGMENTS = [
  { value: "single", label: "No one. I'm extremely single." },
  { value: "someone", label: "...there might be someone." },
  { value: "partner", label: "My boyfriend / partner." },
  { value: "husband", label: "My husband." },
] as const;

type SegmentValue = (typeof SEGMENTS)[number]["value"];

function LoveLetterContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LetterData | null>(null);
  const [copiedQuote, setCopiedQuote] = useState<number | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [segment, setSegment] = useState<SegmentValue | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("No access token provided. Check your email for the correct link.");
      setLoading(false);
      return;
    }

    fetch(`/api/reading/access?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.error) {
          setError(res.error);
        } else if (res.reading) {
          setData(res.reading as LetterData);
        } else {
          setError("Letter not found.");
        }
      })
      .catch(() => setError("Failed to load your letter."))
      .finally(() => setLoading(false));
  }, [token]);

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return (
      <div className="mll-loading">
        <p>Loading your letter...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mll-error">
        <h2 className="fll-reading-h1">Reading unavailable</h2>
        <p>{error || "Something went wrong."}</p>
        <Link href="/future-love-letter" className="fll-cta">
          GET YOUR LETTER
        </Link>
      </div>
    );
  }

  const paragraphs = data.letter
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !/^my\s+love[,.]?\s*$/i.test(p))
    .filter((p) => !/^my\s+dear[,.]?\s*$/i.test(p));

  const quotes = data.shareableQuotes ?? [];

  const handleDownloadPdf = async () => {
    if (pdfBusy) return;
    setPdfBusy(true);
    try {
      const [{ pdf }, { default: LoveLetterPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/components/LoveLetterPDF"),
      ]);
      const blob = await pdf(
        <LoveLetterPDF
          letter={data.letter}
          name={data.meta?.name}
          date={today}
        />,
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const safeName = (data.meta?.name || "love-letter")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      a.download = `bluntchart-love-letter-${safeName}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2_000);
    } catch (err) {
      console.error("[love-letter-pdf] download failed:", err);
      alert("Could not generate the PDF. Please try again.");
    } finally {
      setPdfBusy(false);
    }
  };

  return (
      <div className="fll-reading-container">
        <div className="fll-reading-logo">
          <Link href="/">
            <Image src="/mascot.png" alt="BluntChart" width={24} height={24} style={{ borderRadius: "50%", opacity: 0.6 }} />
          </Link>
        </div>

        <div className="fll-reading-header">
          <p className="fll-reading-eyebrow">A LOVE LETTER</p>
          <h1 className="fll-reading-h1">FROM YOUR {FUTURE_PERSON_LABEL.toUpperCase()}</h1>
        </div>

        {/* Beige paper letter */}
        <div className="fll-paper">
          <div className="fll-paper-inner">
            <p className="fll-paper-date">{today}</p>
            <p className="fll-paper-salutation">My love,</p>
            {paragraphs.map((p, i) => {
              if (p.startsWith("Yours,") || p === SIGNATURE || p === "♥") {
                return <p key={i} className="fll-paper-closing">{p}</p>;
              }
              return <p key={i} className="fll-paper-body">{p}</p>;
            })}
          </div>
        </div>

        {/* Download PDF */}
        <div className="mll-download-wrap">
          <button
            className="mll-download-btn"
            onClick={handleDownloadPdf}
            disabled={pdfBusy}
            type="button"
          >
            {pdfBusy ? "Preparing your letter..." : "Download as PDF"}
          </button>
        </div>

        {/* Feedback */}
        <div className="fll-feedback-section">
          <h2 className="fll-section-heading">
            BE HONEST.<br />DID HE GET YOU?
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
                onClick={() => setFeedback(opt.value)}
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>
          {feedback && !feedbackSent && (
            <div className="fll-feedback-text-wrap">
              <p className="fll-feedback-prompt">What line made you stop scrolling?</p>
              <textarea
                className="fll-feedback-textarea"
                placeholder="Paste the line that hit different..."
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={3}
              />
              <button
                className="fll-btn-secondary"
                onClick={() => setFeedbackSent(true)}
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

        {/* Shareable quotes */}
        {quotes.length > 0 && (
          <div className="fll-share-section">
            <h2 className="fll-section-heading">KEEP THE PART THAT GOT YOU.</h2>
            <p className="fll-share-sub">
              You don&rsquo;t have to expose the entire emotional damage report.<br />
              Pick one line. Tap to copy.
            </p>
            <div className="fll-share-quotes">
              {quotes.map((q, i) => (
                <button
                  key={i}
                  className={`fll-share-card ${selectedQuote === i ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedQuote(i);
                    const text = `"${q}"\n\n— A Love Letter From My ${FUTURE_PERSON_LABEL}\nbluntchart.com/future-love-letter`;
                    navigator.clipboard.writeText(text).then(() => {
                      setCopiedQuote(i);
                      setTimeout(() => setCopiedQuote(null), 2000);
                    });
                  }}
                  type="button"
                >
                  <span className="fll-share-card-quote">&ldquo;{q}&rdquo;</span>
                  <span className="fll-share-card-attr">A Love Letter From My {FUTURE_PERSON_LABEL}</span>
                  <span className="fll-share-card-brand">bluntchart.com</span>
                  <span className="fll-share-card-copy">
                    {copiedQuote === i ? "Copied!" : "Tap to copy"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Segmentation + upsell */}
        <div className="fll-segment-section">
          <h2 className="fll-section-heading">
            OKAY, ONE QUESTION&hellip;<br />
            WHO WERE YOU THINKING ABOUT<br />
            WHILE READING THAT?
          </h2>
          <div className="fll-segment-options">
            {SEGMENTS.map((opt) => (
              <button
                key={opt.value}
                className={`fll-segment-btn ${segment === opt.value ? "active" : ""}`}
                onClick={() => setSegment(opt.value)}
                type="button"
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="fll-segment-micro">No names. We&rsquo;re just nosy.</p>

          {segment === "single" && (
            <div className="fll-upsell">
              <h3 className="fll-upsell-heading">
                HE TOLD YOU HOW HE&rsquo;LL LOVE YOU.<br />
                NOW FIND OUT WHY YOU NEED<br />
                LOVE THAT WAY IN THE FIRST PLACE.
              </h3>
              <p className="fll-upsell-body">
                The letter only explored a slice of your chart. Go deeper into the patterns,
                contradictions, emotional needs and parts of yourself that don&rsquo;t fit
                neatly into a zodiac-sign description.
              </p>
              <Link href="/in-depth-birth-chart" className="fll-cta">
                GO DEEPER INTO MY CHART &rarr;
              </Link>
            </div>
          )}

          {segment === "someone" && (
            <div className="fll-upsell">
              <h3 className="fll-upsell-heading">
                OH.<br />SO THERE IS A SUSPECT.
              </h3>
              <p className="fll-upsell-body">
                Your letter started with your chart. If you have their birth details,
                we can put both charts on the table.
              </p>
              <Link href="/#waitlist" className="fll-cta">
                CHECK OUR COMPATIBILITY &rarr;
              </Link>
              <p className="fll-upsell-alt">
                Or{" "}
                <Link href="/in-depth-birth-chart" className="fll-link">
                  go deeper into your own chart &rarr;
                </Link>
              </p>
            </div>
          )}

          {segment === "partner" && (
            <div className="fll-upsell">
              <h3 className="fll-upsell-heading">
                YOU HAD SOMEONE IN MIND,<br />DIDN&rsquo;T YOU?
              </h3>
              <p className="fll-upsell-body">
                A letter can explore your relationship patterns. Two birth charts
                let us explore what happens when yours meets theirs.
              </p>
              <Link href="/#waitlist" className="fll-cta">
                READ OUR COMPATIBILITY &rarr;
              </Link>
            </div>
          )}

          {segment === "husband" && (
            <div className="fll-upsell">
              <h3 className="fll-upsell-heading">OH, SO YOU BROUGHT RECEIPTS.</h3>
              <p className="fll-upsell-body">
                You&rsquo;ve already got the husband. Now put both charts on the table
                and see how the relationship looks astrologically.
              </p>
              <Link href="/#waitlist" className="fll-cta">
                READ OUR COMPATIBILITY &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="fll-disclaimer-box">
          <p>
            One little note: this isn&rsquo;t literally a letter from your future husband.
            He&rsquo;s a fictional character created from the relationship themes in your chart,
            imagined as someone who knows how to love you well.
          </p>
          <p>
            For a deeper look at your potential spouse and partnership themes, explore our{" "}
            <Link href="/in-depth-birth-chart" className="fll-link">
              Future Spouse Reading
            </Link>.
          </p>
        </div>
      </div>
  );
}

function Nav() {
  return (
    <nav className="fll-nav-static">
      <Link href="/" className="fll-nav-logo-link">
        <Image src="/mascot.png" alt="BluntChart" width={28} height={28} style={{ borderRadius: "50%" }} />
        <span className="fll-nav-logo-label">BluntChart</span>
      </Link>
    </nav>
  );
}

export default function MyLoveLetterPage() {
  return (
    <div className="fll-page">
      <style>{styles}</style>
      <Nav />
      <VibrantStarBackground />
      <Suspense fallback={<div className="mll-loading"><p>Loading...</p></div>}>
        <LoveLetterContent />
      </Suspense>
    </div>
  );
}

const styles = `
.fll-page {
  position: relative;
  min-height: 100vh;
  background: #07070d;
  color: #e8e4f0;
  overflow-x: hidden;
  font-family: var(--font-body, 'DM Sans', system-ui, sans-serif);
}

/* Nav */
.fll-nav-static {
  position: relative;
  z-index: 10;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.fll-nav-logo-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}
.fll-nav-logo-label {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-size: 1.1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f0b84a, #d4537e, #6b2fd4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Loading / Error */
.mll-loading, .mll-error {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  gap: 24px;
  color: rgba(232,228,240,0.5);
}

/* Reading container */
.fll-reading-container {
  position: relative;
  z-index: 1;
  padding: 96px 24px 80px;
  max-width: 720px;
  margin: 0 auto;
}
.fll-reading-logo {
  position: absolute;
  top: 96px;
  right: 24px;
  z-index: 10;
}
.fll-reading-header {
  text-align: center;
  margin-bottom: 48px;
}
.fll-reading-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  color: rgba(232,228,240,0.6);
  margin-bottom: 12px;
}
.fll-reading-h1 {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-size: clamp(28px, 6vw, 44px);
  font-weight: 400;
  color: #F0B84A;
  margin: 0 0 16px;
}

/* Beige paper */
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
  font-size: 12px;
  color: #9a8a6a;
  margin-bottom: 28px;
}
.fll-paper-salutation {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-style: italic;
  font-size: 20px;
  color: #3a3428;
  margin-bottom: 24px;
}
.fll-paper-body {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-size: clamp(15px, 2.5vw, 17px);
  line-height: 1.85;
  color: #3a3428;
  margin-bottom: 18px;
}
.fll-paper-closing {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-style: italic;
  font-size: 17px;
  color: #5a4e3a;
  margin-bottom: 8px;
  margin-top: 32px;
}

/* Download button */
.mll-download-wrap {
  text-align: center;
  margin-top: 28px;
}
.mll-download-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: rgba(255,255,255,0.08);
  border: 0.5px solid rgba(240,184,74,0.3);
  border-radius: 50px;
  color: rgba(240,184,74,0.85);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.25s;
}
.mll-download-btn:hover {
  background: rgba(240,184,74,0.08);
  border-color: rgba(240,184,74,0.4);
  color: #F0B84A;
}
.mll-download-btn:disabled {
  opacity: 0.5;
  cursor: wait;
}

/* Section heading */
.fll-section-heading {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-size: clamp(24px, 4.5vw, 36px);
  font-weight: 400;
  line-height: 1.25;
  color: #f0e9dc;
  margin-bottom: 20px;
}

/* Feedback */
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
  background: rgba(255,255,255,0.08);
  border: 0.5px solid rgba(255,255,255,0.18);
  border-radius: 50px;
  color: rgba(232,228,240,0.85);
  font-family: var(--font-body);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.fll-feedback-btn:hover {
  background: rgba(255,255,255,0.12);
  border-color: rgba(240,184,74,0.35);
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
  background: rgba(255,255,255,0.08);
  border: 0.5px solid rgba(255,255,255,0.18);
  border-radius: 50px;
  color: rgba(232,228,240,0.85);
  font-family: var(--font-body);
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}
.fll-btn-secondary:hover { background: rgba(255,255,255,0.1); }

/* Share */
.fll-share-section {
  margin-top: 80px;
  text-align: center;
}
.fll-share-sub {
  font-size: 14px;
  color: rgba(232,228,240,0.65);
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
  background: linear-gradient(170deg, rgba(250,246,238,0.08) 0%, rgba(240,184,74,0.05) 100%);
  border: 0.5px solid rgba(255,255,255,0.15);
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
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
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
  color: rgba(240,184,74,0.65);
  margin-bottom: 3px;
}
.fll-share-card-brand {
  font-size: 10px;
  color: rgba(232,228,240,0.4);
}
.fll-share-card-copy {
  display: block;
  margin-top: 10px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: rgba(240,184,74,0.7);
  transition: color 0.2s;
}
.fll-share-card:hover .fll-share-card-copy { color: rgba(240,184,74,0.8); }
.fll-share-card.selected .fll-share-card-copy { color: #F0B84A; }

/* Segmentation */
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
  background: rgba(255,255,255,0.08);
  border: 0.5px solid rgba(255,255,255,0.18);
  border-radius: 50px;
  color: rgba(232,228,240,0.85);
  font-family: var(--font-body);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}
.fll-segment-btn:hover {
  background: rgba(255,255,255,0.12);
  border-color: rgba(240,184,74,0.35);
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

/* Upsell */
.fll-upsell {
  margin-top: 48px;
  padding: 36px 28px;
  background: rgba(240,184,74,0.03);
  border: 0.5px solid rgba(240,184,74,0.1);
  border-radius: 20px;
  animation: fll-fade-in 0.5s ease-out;
}
@keyframes fll-fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.fll-upsell-heading {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
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

/* CTA */
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

.fll-link {
  color: rgba(240,184,74,0.5);
  text-decoration: underline;
  text-underline-offset: 2px;
}

/* Disclaimer */
.fll-disclaimer-box {
  text-align: center;
  font-size: 12px;
  line-height: 1.7;
  color: rgba(232,228,240,0.25);
  padding-top: 40px;
  margin-top: 60px;
  border-top: 0.5px solid rgba(255,255,255,0.06);
}
.fll-disclaimer-box p {
  margin-bottom: 8px;
}
`;
