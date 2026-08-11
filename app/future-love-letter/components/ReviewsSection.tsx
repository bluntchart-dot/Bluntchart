"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Review {
  id: string;
  rating: number;
  zodiac_sign: string | null;
  emotional_reaction: string | null;
  best_line: string | null;
  name: string | null;
  testimonial: string | null;
  created_at: string;
}

const REACTION_LABELS: Record<string, string> = {
  smiled: "Smiled",
  impressed: "Didn't expect it to be this good",
  "called-out": "Felt called out",
  butterflies: "Butterflies / Blushed",
  "all-of-it": "All of the above",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="fll-rv-stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={s <= rating ? "fll-rv-star-filled" : "fll-rv-star-empty"}>
          ★
        </span>
      ))}
    </span>
  );
}

export default function ReviewsSection({ onCta }: { onCta: () => void }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews?product=future-love-letter&limit=6")
      .then((r) => r.json())
      .then((data) => {
        if (data.reviews) setReviews(data.reviews);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const displayReviews = reviews.filter(
    (r) => r.testimonial || r.best_line || r.emotional_reaction,
  );

  if (loading || displayReviews.length === 0) return null;

  return (
    <section className="fll-reviews">
      <p className="fll-eyebrow">REAL REACTIONS</p>
      <h2 className="fll-section-heading">
        DON&rsquo;T TAKE OUR WORD FOR IT.
        <br />
        TAKE THEIRS.
      </h2>

      <Link href="/reviews" className="fll-rv-scroll-wrap">
        <div className="fll-rv-track">
          {[...displayReviews.slice(0, 8), ...displayReviews.slice(0, 8)].map((review, i) => (
            <div key={`${review.id}-${i}`} className="fll-rv-card">
              <StarRating rating={review.rating} />
              {review.testimonial && (
                <p className="fll-rv-testimonial">
                  &ldquo;{review.testimonial}&rdquo;
                </p>
              )}
              {!review.testimonial && review.best_line && (
                <p className="fll-rv-bestline">
                  Line that got them: &ldquo;{review.best_line}&rdquo;
                </p>
              )}
              {!review.testimonial && !review.best_line && review.emotional_reaction && (
                <p className="fll-rv-reaction">
                  {REACTION_LABELS[review.emotional_reaction] || review.emotional_reaction}
                </p>
              )}
              <div className="fll-rv-meta">
                {review.name && <span className="fll-rv-name">{review.name}</span>}
                {review.zodiac_sign && (
                  <span className="fll-rv-zodiac">
                    {review.zodiac_sign.charAt(0).toUpperCase() + review.zodiac_sign.slice(1)}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Link>
      <p className="fll-rv-hint">Tap to see all reviews</p>

      <div className="fll-rv-actions">
        <button className="fll-cta" onClick={onCta} type="button">
          GET YOUR LETTER &rarr;
        </button>
        <Link href="/reviews/love-letter" className="fll-rv-all-link">
          Leave a review &rarr;
        </Link>
      </div>
    </section>
  );
}
