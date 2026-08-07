"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const REACTIONS = [
  { value: "smiled", emoji: "😊", label: "Smiled" },
  { value: "cried", emoji: "🥹", label: "Cried a little" },
  { value: "called-out", emoji: "😳", label: "Felt called out" },
  { value: "butterflies", emoji: "🦋", label: "Butterflies" },
  { value: "all-of-it", emoji: "💀", label: "All of the above" },
];

const ZODIAC_SIGNS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

type Step = "reaction" | "best-line" | "rating" | "zodiac" | "final" | "done";

export default function ReviewClient() {
  const [step, setStep] = useState<Step>("reaction");
  const [reaction, setReaction] = useState<string | null>(null);
  const [bestLine, setBestLine] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [zodiac, setZodiac] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [testimonial, setTestimonial] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!rating || !reaction) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_type: "future-love-letter",
          rating,
          zodiac_sign: zodiac?.toLowerCase() || null,
          emotional_reaction: reaction,
          best_line: bestLine.trim() || null,
          name: name.trim() || null,
          testimonial: testimonial.trim() || null,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit");
      setStep("done");
    } catch {
      setError("Something went wrong. Try again?");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="rv-page">
        <nav className="rv-nav">
          <Link href="/" className="rv-nav-logo">
            <Image src="/mascot.png" alt="BluntChart" width={28} height={28} style={{ borderRadius: "50%" }} />
            <span className="rv-nav-logo-text">BluntChart</span>
          </Link>
        </nav>

        <div className="rv-container">
          {/* Progress */}
          {step !== "done" && (
            <div className="rv-progress">
              {["reaction", "best-line", "rating", "zodiac", "final"].map((s, i) => (
                <div
                  key={s}
                  className={`rv-progress-dot ${
                    ["reaction", "best-line", "rating", "zodiac", "final"].indexOf(step) >= i
                      ? "active"
                      : ""
                  }`}
                />
              ))}
            </div>
          )}

          {/* Step 1: Emotional reaction */}
          {step === "reaction" && (
            <div className="rv-step">
              <p className="rv-eyebrow">STEP 1 OF 5</p>
              <h1 className="rv-heading">WHAT DID THIS LETTER<br />MAKE YOU FEEL?</h1>
              <p className="rv-sub">Be honest. He can take it.</p>
              <div className="rv-reactions">
                {REACTIONS.map((r) => (
                  <button
                    key={r.value}
                    className={`rv-reaction-btn ${reaction === r.value ? "active" : ""}`}
                    onClick={() => setReaction(r.value)}
                    type="button"
                  >
                    <span className="rv-reaction-emoji">{r.emoji}</span>
                    <span className="rv-reaction-label">{r.label}</span>
                  </button>
                ))}
              </div>
              <button
                className="rv-next-btn"
                disabled={!reaction}
                onClick={() => setStep("best-line")}
                type="button"
              >
                NEXT
              </button>
            </div>
          )}

          {/* Step 2: Best line */}
          {step === "best-line" && (
            <div className="rv-step">
              <p className="rv-eyebrow">STEP 2 OF 5</p>
              <h1 className="rv-heading">WHICH LINE GOT YOU?</h1>
              <p className="rv-sub">The one you screenshotted. Or wanted to.</p>
              <textarea
                className="rv-textarea"
                placeholder="Paste or type the line that hit different..."
                value={bestLine}
                onChange={(e) => setBestLine(e.target.value)}
                rows={4}
              />
              <div className="rv-step-btns">
                <button className="rv-back-btn" onClick={() => setStep("reaction")} type="button">BACK</button>
                <button
                  className="rv-next-btn"
                  onClick={() => setStep("rating")}
                  type="button"
                >
                  {bestLine.trim() ? "NEXT" : "SKIP"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Star rating */}
          {step === "rating" && (
            <div className="rv-step">
              <p className="rv-eyebrow">STEP 3 OF 5</p>
              <h1 className="rv-heading">HOW WELL DID HE<br />KNOW YOU?</h1>
              <p className="rv-sub">1 = generic pickup line. 5 = how does he know I do that.</p>
              <div className="rv-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`rv-star ${star <= (hoverRating || rating) ? "filled" : ""}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    type="button"
                    aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="rv-star-label">
                  {rating === 1 && "He needs work."}
                  {rating === 2 && "Getting warmer."}
                  {rating === 3 && "Okay, he's paying attention."}
                  {rating === 4 && "Annoyingly accurate."}
                  {rating === 5 && "I feel seen and slightly attacked."}
                </p>
              )}
              <div className="rv-step-btns">
                <button className="rv-back-btn" onClick={() => setStep("best-line")} type="button">BACK</button>
                <button
                  className="rv-next-btn"
                  disabled={!rating}
                  onClick={() => setStep("zodiac")}
                  type="button"
                >
                  NEXT
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Zodiac sign */}
          {step === "zodiac" && (
            <div className="rv-step">
              <p className="rv-eyebrow">STEP 4 OF 5</p>
              <h1 className="rv-heading">WHAT&rsquo;S YOUR<br />SUN SIGN?</h1>
              <p className="rv-sub">Helps us understand which signs feel seen the most.</p>
              <div className="rv-zodiac-grid">
                {ZODIAC_SIGNS.map((sign) => (
                  <button
                    key={sign}
                    className={`rv-zodiac-btn ${zodiac === sign ? "active" : ""}`}
                    onClick={() => setZodiac(sign)}
                    type="button"
                  >
                    {sign}
                  </button>
                ))}
              </div>
              <div className="rv-step-btns">
                <button className="rv-back-btn" onClick={() => setStep("rating")} type="button">BACK</button>
                <button
                  className="rv-next-btn"
                  onClick={() => setStep("final")}
                  type="button"
                >
                  {zodiac ? "NEXT" : "SKIP"}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Optional name + testimonial */}
          {step === "final" && (
            <div className="rv-step">
              <p className="rv-eyebrow">STEP 5 OF 5</p>
              <h1 className="rv-heading">ANYTHING ELSE<br />YOU WANT TO SAY?</h1>
              <p className="rv-sub">Optional. But we&rsquo;d love to quote you.</p>
              <div className="rv-final-fields">
                <input
                  className="rv-input"
                  type="text"
                  placeholder="First name (optional)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <textarea
                  className="rv-textarea"
                  placeholder="One line about the experience..."
                  value={testimonial}
                  onChange={(e) => setTestimonial(e.target.value)}
                  rows={3}
                />
              </div>
              {error && <p className="rv-error">{error}</p>}
              <div className="rv-step-btns">
                <button className="rv-back-btn" onClick={() => setStep("zodiac")} type="button">BACK</button>
                <button
                  className="rv-next-btn rv-submit-btn"
                  onClick={handleSubmit}
                  disabled={submitting}
                  type="button"
                >
                  {submitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
                </button>
              </div>
            </div>
          )}

          {/* Done */}
          {step === "done" && (
            <div className="rv-step rv-done">
              <div className="rv-done-emoji">💌</div>
              <h1 className="rv-heading">THANK YOU.</h1>
              <p className="rv-sub">
                Your review means a lot. Seriously.
                <br />
                He&rsquo;ll try to keep living up to it.
              </p>
              <div className="rv-done-links">
                <Link href="/future-love-letter" className="rv-next-btn">
                  GET ANOTHER LETTER
                </Link>
                <Link href="/reviews" className="rv-back-btn">
                  SEE ALL REVIEWS
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const styles = `
.rv-page {
  min-height: 100vh;
  background: #07070d;
  color: #e8e4f0;
  font-family: var(--font-body, 'DM Sans', system-ui, sans-serif);
}
.rv-nav {
  padding: 18px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.rv-nav-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}
.rv-nav-logo-text {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-size: 1.1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f0b84a, #d4537e, #6b2fd4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.rv-container {
  max-width: 580px;
  margin: 0 auto;
  padding: 48px 24px 96px;
}
.rv-progress {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 48px;
}
.rv-progress-dot {
  width: 32px;
  height: 3px;
  border-radius: 3px;
  background: rgba(255,255,255,0.08);
  transition: background 0.3s;
}
.rv-progress-dot.active {
  background: #F0B84A;
}
.rv-step {
  text-align: center;
  animation: rvFadeIn 0.4s ease;
}
@keyframes rvFadeIn {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
.rv-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2px;
  color: rgba(232,228,240,0.3);
  margin-bottom: 16px;
}
.rv-heading {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-size: clamp(24px, 5vw, 36px);
  font-weight: 400;
  line-height: 1.2;
  color: #f0e9dc;
  margin: 0 0 12px;
}
.rv-sub {
  font-size: 15px;
  color: rgba(232,228,240,0.5);
  margin-bottom: 36px;
  line-height: 1.6;
}
.rv-reactions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-bottom: 36px;
}
.rv-reaction-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 90px;
  color: #e8e4f0;
  font-family: inherit;
}
.rv-reaction-btn:hover {
  border-color: rgba(240,184,74,0.3);
  background: rgba(240,184,74,0.04);
}
.rv-reaction-btn.active {
  border-color: #F0B84A;
  background: rgba(240,184,74,0.08);
}
.rv-reaction-emoji { font-size: 28px; }
.rv-reaction-label { font-size: 12px; color: rgba(232,228,240,0.55); }
.rv-stars {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
}
.rv-star {
  font-size: 40px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.12);
  cursor: pointer;
  transition: color 0.15s, transform 0.15s;
  padding: 0;
  line-height: 1;
}
.rv-star:hover { transform: scale(1.15); }
.rv-star.filled { color: #F0B84A; }
.rv-star-label {
  font-size: 14px;
  color: rgba(240,184,74,0.7);
  margin-bottom: 36px;
  font-style: italic;
}
.rv-zodiac-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-bottom: 36px;
}
@media (max-width: 480px) {
  .rv-zodiac-grid { grid-template-columns: repeat(3, 1fr); }
}
.rv-zodiac-btn {
  padding: 12px 8px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  color: rgba(232,228,240,0.6);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.rv-zodiac-btn:hover {
  border-color: rgba(240,184,74,0.3);
  color: #e8e4f0;
}
.rv-zodiac-btn.active {
  border-color: #F0B84A;
  background: rgba(240,184,74,0.08);
  color: #F0B84A;
}
.rv-textarea, .rv-input {
  width: 100%;
  background: rgba(255,255,255,0.04);
  border: 0.5px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 14px;
  color: #e8e4f0;
  font-family: inherit;
  outline: none;
  resize: vertical;
  transition: border-color 0.2s;
}
.rv-textarea:focus, .rv-input:focus {
  border-color: rgba(240,184,74,0.4);
}
.rv-textarea { margin-bottom: 16px; }
.rv-final-fields {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
  text-align: left;
}
.rv-step-btns {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 8px;
}
.rv-next-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 32px;
  background: linear-gradient(135deg, #6b2fd4, #d4537e);
  color: #fff;
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
}
.rv-next-btn:hover { opacity: 0.88; transform: translateY(-1px); }
.rv-next-btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
.rv-submit-btn { min-width: 180px; }
.rv-back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  background: transparent;
  color: rgba(232,228,240,0.5);
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.rv-back-btn:hover { border-color: rgba(255,255,255,0.18); color: #e8e4f0; }
.rv-error {
  color: #d4537e;
  font-size: 13px;
  margin-bottom: 12px;
}
.rv-done { padding-top: 48px; }
.rv-done-emoji { font-size: 56px; margin-bottom: 24px; }
.rv-done-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  margin-top: 16px;
}
`;
