"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Review {
  id: string;
  product_type: string;
  rating: number;
  zodiac_sign: string | null;
  emotional_reaction: string | null;
  best_line: string | null;
  name: string | null;
  testimonial: string | null;
  created_at: string;
}

const REACTION_LABELS: Record<string, string> = {
  smiled: "😊 Smiled",
  impressed: "🤯 Didn't expect it to be this good",
  "called-out": "😳 Felt called out",
  butterflies: "🦋 Butterflies / Blushed",
  "all-of-it": "💀 All of the above",
};

export default function ReviewsHub() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews?product=future-love-letter&limit=50")
      .then((r) => r.json())
      .then((data) => setReviews(data.reviews ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <>
      <style>{styles}</style>
      <div className="rvh-page">
        <nav className="rvh-nav">
          <Link href="/" className="rvh-nav-logo">
            <Image src="/mascot.png" alt="BluntChart" width={28} height={28} style={{ borderRadius: "50%" }} />
            <span className="rvh-nav-logo-text">BluntChart</span>
          </Link>
        </nav>

        <div className="rvh-container">
          <p className="rvh-eyebrow">REVIEWS</p>
          <h1 className="rvh-heading">WHAT PEOPLE FELT.</h1>
          <p className="rvh-sub">Real reactions from real birth charts.</p>

          {avgRating && (
            <div className="rvh-stats">
              <div className="rvh-stat">
                <span className="rvh-stat-num">{avgRating}</span>
                <span className="rvh-stat-label">avg rating</span>
              </div>
              <div className="rvh-stat">
                <span className="rvh-stat-num">{reviews.length}</span>
                <span className="rvh-stat-label">reviews</span>
              </div>
            </div>
          )}

          {/* Product sections */}
          <div className="rvh-product-section">
            <div className="rvh-product-header">
              <h2 className="rvh-product-title">Future Love Letter</h2>
              <Link href="/reviews/love-letter" className="rvh-leave-review">
                Leave a review &rarr;
              </Link>
            </div>

            {loading && <p className="rvh-loading">Loading reviews...</p>}

            {!loading && reviews.length === 0 && (
              <div className="rvh-empty">
                <p>No reviews yet. Be the first.</p>
                <Link href="/reviews/love-letter" className="rvh-cta">
                  LEAVE A REVIEW
                </Link>
              </div>
            )}

            {!loading && reviews.length > 0 && (
              <div className="rvh-grid">
                {reviews.map((review) => (
                  <div key={review.id} className="rvh-card">
                    <div className="rvh-card-top">
                      <div className="rvh-card-stars">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                      {review.zodiac_sign && (
                        <span className="rvh-card-zodiac">
                          {review.zodiac_sign}
                        </span>
                      )}
                    </div>
                    {review.emotional_reaction && (
                      <p className="rvh-card-reaction">
                        {REACTION_LABELS[review.emotional_reaction] || review.emotional_reaction}
                      </p>
                    )}
                    {review.best_line && (
                      <p className="rvh-card-line">
                        &ldquo;{review.best_line}&rdquo;
                      </p>
                    )}
                    {review.testimonial && (
                      <p className="rvh-card-testimonial">{review.testimonial}</p>
                    )}
                    <div className="rvh-card-footer">
                      {review.name && <span className="rvh-card-name">{review.name}</span>}
                      <span className="rvh-card-date">
                        {new Date(review.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const styles = `
.rvh-page {
  min-height: 100vh;
  background: #07070d;
  color: #e8e4f0;
  font-family: var(--font-body, 'DM Sans', system-ui, sans-serif);
}
.rvh-nav {
  padding: 18px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.rvh-nav-logo {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}
.rvh-nav-logo-text {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-size: 1.1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #f0b84a, #d4537e, #6b2fd4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.rvh-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 64px 24px 96px;
}
.rvh-eyebrow {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 2.5px;
  color: #F0B84A;
  margin-bottom: 14px;
}
.rvh-heading {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-size: clamp(28px, 5vw, 44px);
  font-weight: 400;
  line-height: 1.15;
  color: #f0e9dc;
  margin: 0 0 12px;
}
.rvh-sub {
  font-size: 15px;
  color: rgba(232,228,240,0.45);
  margin-bottom: 40px;
}
.rvh-stats {
  display: flex;
  gap: 32px;
  margin-bottom: 48px;
}
.rvh-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.rvh-stat-num {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-size: 32px;
  font-weight: 700;
  color: #F0B84A;
}
.rvh-stat-label {
  font-size: 12px;
  color: rgba(232,228,240,0.35);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.rvh-product-section {
  margin-bottom: 64px;
}
.rvh-product-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 12px;
}
.rvh-product-title {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-size: 1.3rem;
  font-weight: 700;
  color: #f0e9dc;
  margin: 0;
}
.rvh-leave-review {
  font-size: 13px;
  color: #F0B84A;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.2s;
}
.rvh-leave-review:hover { opacity: 0.75; }
.rvh-loading { color: rgba(232,228,240,0.3); font-size: 14px; }
.rvh-empty {
  text-align: center;
  padding: 48px 24px;
  border: 1px dashed rgba(255,255,255,0.08);
  border-radius: 16px;
}
.rvh-empty p { color: rgba(232,228,240,0.35); margin-bottom: 20px; }
.rvh-cta {
  display: inline-flex;
  padding: 12px 28px;
  background: linear-gradient(135deg, #6b2fd4, #d4537e);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  border-radius: 8px;
  transition: opacity 0.2s;
}
.rvh-cta:hover { opacity: 0.85; }
.rvh-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}
.rvh-card {
  background: rgba(255,255,255,0.025);
  border: 0.5px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  padding: 24px;
  transition: border-color 0.2s;
}
.rvh-card:hover { border-color: rgba(107,47,212,0.25); }
.rvh-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.rvh-card-stars {
  font-size: 16px;
  color: #F0B84A;
  letter-spacing: 2px;
}
.rvh-card-zodiac {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(232,228,240,0.3);
  background: rgba(255,255,255,0.04);
  padding: 4px 10px;
  border-radius: 6px;
}
.rvh-card-reaction {
  font-size: 13px;
  color: rgba(232,228,240,0.5);
  margin-bottom: 10px;
}
.rvh-card-line {
  font-family: var(--font-display, 'Playfair Display', Georgia, serif);
  font-size: 14px;
  font-style: italic;
  color: rgba(232,228,240,0.7);
  line-height: 1.6;
  margin-bottom: 10px;
}
.rvh-card-testimonial {
  font-size: 14px;
  color: rgba(232,228,240,0.55);
  line-height: 1.6;
  margin-bottom: 10px;
}
.rvh-card-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  padding-top: 12px;
  border-top: 0.5px solid rgba(255,255,255,0.06);
}
.rvh-card-name {
  font-size: 12px;
  font-weight: 600;
  color: rgba(232,228,240,0.5);
}
.rvh-card-date {
  font-size: 11px;
  color: rgba(232,228,240,0.2);
  margin-left: auto;
}
`;
