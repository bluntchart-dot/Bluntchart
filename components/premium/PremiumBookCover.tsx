"use client";

/**
 * PremiumBookCover — the first page of the book.
 *
 * Renders as its own swipe slot so the reader lands on it and taps
 * "Begin Reading" to advance. On mobile they can also just swipe.
 */

import type { PremiumReading } from "@/lib/premium/types";

export default function PremiumBookCover({
  reading,
  onBegin,
}: {
  reading: PremiumReading;
  onBegin: () => void;
}) {
  const name = (reading.meta.name || "Reader").trim();
  const minutes = reading.meta.estimatedReadingMinutes;

  return (
    <article className="premium-book-page premium-page-cover">
      <div className="premium-cover-inner">
        <div className="premium-cover-brand">BLUNTCHART</div>
        <div className="premium-cover-title-block">
          <h1 className="premium-cover-title">Your Story</h1>
          <p className="premium-cover-subtitle">
            Some stories are written by life.
            <br />
            This one was written by the sky.
          </p>
        </div>
        <div className="premium-cover-prepared">
          <span className="premium-cover-prepared-label">Prepared for</span>
          <span className="premium-cover-prepared-name">{name}</span>
        </div>
        <div className="premium-cover-actions">
          <button
            type="button"
            onClick={onBegin}
            className="premium-cover-begin"
          >
            Begin Reading
            <span aria-hidden> →</span>
          </button>
          <div className="premium-cover-time">
            about {minutes} min · one sitting or in pieces
          </div>
        </div>
      </div>
    </article>
  );
}
