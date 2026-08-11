"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface LetterData {
  letter: string;
  shareableQuotes?: string[];
  meta?: { name?: string; dob?: string; birth_place?: string };
}

function LoveLetterContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LetterData | null>(null);
  const [copiedQuote, setCopiedQuote] = useState<number | null>(null);

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

  const name = data?.meta?.name ?? "";

  if (loading) {
    return (
      <div className="mll-page">
        <style>{styles}</style>
        <Nav />
        <div className="mll-loading">
          <p>Loading your letter...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mll-page">
        <style>{styles}</style>
        <Nav />
        <div className="mll-error">
          <p>{error || "Something went wrong."}</p>
          <Link href="/future-love-letter" className="mll-cta">
            GET YOUR LETTER
          </Link>
        </div>
      </div>
    );
  }

  const paragraphs = data.letter
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !/^my\s+love[,.]?\s*$/i.test(p))
    .filter((p) => !/^my\s+dear[,.]?\s*$/i.test(p));

  return (
    <div className="mll-page">
      <style>{styles}</style>
      <Nav />

      <div className="mll-container">
        <div className="mll-logo-corner">
          <Link href="/">
            <Image src="/mascot.png" alt="BluntChart" width={24} height={24} style={{ borderRadius: "50%", opacity: 0.6 }} />
          </Link>
        </div>

        <div className="mll-header">
          <p className="mll-eyebrow">A LOVE LETTER</p>
          <h1 className="mll-h1">FROM YOUR FUTURE HUSBAND</h1>
        </div>

        <div className="mll-paper">
          <div className="mll-paper-inner">
            <p className="mll-paper-date">{today}</p>
            <p className="mll-paper-salutation">My love,</p>
            {paragraphs.map((p, i) => {
              if (p.startsWith("Yours,") || p === "Someone worth waiting for" || p === "♥") {
                return <p key={i} className="mll-paper-closing">{p}</p>;
              }
              return <p key={i} className="mll-paper-body">{p}</p>;
            })}
          </div>
        </div>

        {data.shareableQuotes && data.shareableQuotes.length > 0 && (
          <div className="mll-share-section">
            <h2 className="mll-section-heading">KEEP THE PART THAT GOT YOU.</h2>
            <p className="mll-share-sub">Pick one line. Tap to copy.</p>
            <div className="mll-share-quotes">
              {data.shareableQuotes.map((q, i) => (
                <button
                  key={i}
                  className="mll-share-card"
                  onClick={() => {
                    const text = `"${q}"\n\n— A Love Letter From My Future Husband\nbluntchart.com/future-love-letter`;
                    navigator.clipboard.writeText(text).then(() => {
                      setCopiedQuote(i);
                      setTimeout(() => setCopiedQuote(null), 2000);
                    });
                  }}
                  type="button"
                >
                  <span className="mll-share-card-quote">&ldquo;{q}&rdquo;</span>
                  <span className="mll-share-card-attr">A Love Letter From My Future Husband</span>
                  <span className="mll-share-card-brand">bluntchart.com</span>
                  <span className="mll-share-card-copy">
                    {copiedQuote === i ? "Copied!" : "Tap to copy"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mll-review-section">
          <h2 className="mll-section-heading">DID HE GET YOU?</h2>
          <Link href="/reviews/love-letter" className="mll-cta">
            LEAVE A REVIEW &rarr;
          </Link>
        </div>

        <div className="mll-disclaimer">
          <p>
            One little note: this isn&rsquo;t literally a letter from your future husband.
            He&rsquo;s a fictional character created from the relationship themes in your chart,
            imagined as someone who knows how to love you well.
          </p>
          <p>
            For a deeper look at your potential spouse and partnership themes, explore our{" "}
            <Link href="/in-depth-birth-chart" className="mll-disclaimer-link">
              Future Spouse Reading
            </Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <nav className="mll-nav">
      <Link href="/" className="mll-nav-logo">
        <Image src="/mascot.png" alt="BluntChart" width={28} height={28} style={{ borderRadius: "50%" }} />
        <span className="mll-nav-logo-text">BluntChart</span>
      </Link>
    </nav>
  );
}

export default function MyLoveLetterPage() {
  return (
    <Suspense fallback={<div className="mll-page"><style>{styles}</style><Nav /><div className="mll-loading"><p>Loading...</p></div></div>}>
      <LoveLetterContent />
    </Suspense>
  );
}

const styles = `
.mll-page {
  min-height: 100vh;
  background: #07070d;
  color: #e8e4f0;
  font-family: var(--font-body, 'DM Sans', system-ui, sans-serif);
}
.mll-nav {
  padding: 18px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.mll-nav-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}
.mll-nav-logo-text {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-size: 1.1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f0b84a, #d4537e, #6b2fd4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.mll-container {
  max-width: 680px;
  margin: 0 auto;
  padding: 48px 24px 96px;
  position: relative;
}
.mll-logo-corner {
  position: absolute;
  top: 48px;
  right: 24px;
}
.mll-loading, .mll-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  gap: 24px;
  color: rgba(232,228,240,0.5);
}
.mll-header {
  text-align: center;
  margin-bottom: 48px;
}
.mll-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  color: #F0B84A;
  margin-bottom: 14px;
}
.mll-h1 {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-size: clamp(24px, 5vw, 36px);
  font-weight: 400;
  color: #f0e9dc;
  margin: 0;
  line-height: 1.2;
}
.mll-paper {
  background: rgba(255,255,255,0.02);
  border: 0.5px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  padding: 40px 32px;
  margin-bottom: 48px;
}
@media (max-width: 600px) {
  .mll-paper { padding: 28px 20px; }
}
.mll-paper-inner {
  max-width: 560px;
  margin: 0 auto;
}
.mll-paper-date {
  font-size: 12px;
  color: rgba(232,228,240,0.25);
  margin-bottom: 20px;
}
.mll-paper-salutation {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-style: italic;
  font-size: 18px;
  color: rgba(232,228,240,0.7);
  margin-bottom: 20px;
}
.mll-paper-body {
  font-size: 15px;
  line-height: 1.9;
  color: rgba(232,228,240,0.72);
  margin-bottom: 16px;
}
.mll-paper-closing {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-style: italic;
  font-size: 16px;
  color: rgba(232,228,240,0.55);
  margin-top: 28px;
}
.mll-section-heading {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-size: clamp(18px, 3.5vw, 24px);
  font-weight: 400;
  color: #f0e9dc;
  text-align: center;
  margin: 0 0 20px;
}
.mll-share-section {
  margin-bottom: 48px;
  text-align: center;
}
.mll-share-sub {
  font-size: 14px;
  color: rgba(232,228,240,0.4);
  margin-bottom: 24px;
}
.mll-share-quotes {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.mll-share-card {
  background: rgba(255,255,255,0.025);
  border: 0.5px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.2s;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.mll-share-card:hover {
  border-color: rgba(212,83,126,0.3);
}
.mll-share-card-quote {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-style: italic;
  font-size: 15px;
  color: rgba(232,228,240,0.75);
  line-height: 1.7;
}
.mll-share-card-attr {
  font-size: 11px;
  color: rgba(232,228,240,0.3);
  font-weight: 600;
  letter-spacing: 0.04em;
}
.mll-share-card-brand {
  font-size: 11px;
  color: rgba(240,184,74,0.5);
}
.mll-share-card-copy {
  font-size: 11px;
  font-weight: 600;
  color: #d4537e;
  letter-spacing: 0.04em;
}
.mll-review-section {
  text-align: center;
  margin-bottom: 48px;
}
.mll-cta {
  display: inline-flex;
  padding: 14px 32px;
  background: linear-gradient(135deg, #6b2fd4, #d4537e);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}
.mll-cta:hover { opacity: 0.85; }
.mll-disclaimer {
  text-align: center;
  font-size: 12px;
  line-height: 1.7;
  color: rgba(232,228,240,0.25);
  padding-top: 24px;
  border-top: 0.5px solid rgba(255,255,255,0.06);
}
.mll-disclaimer p {
  margin-bottom: 8px;
}
.mll-disclaimer-link {
  color: rgba(240,184,74,0.5);
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s;
}
.mll-disclaimer-link:hover {
  color: #F0B84A;
}
`;
