"use client";

/**
 * PremiumBookPage — renders one RenderedSection.
 *
 * Switches on pageType. Every page fills a full swipe slot (width: 100%,
 * scroll-snap-align: center). Vertical scrolling within a page is fine
 * for long chapters; horizontal navigation goes to the next section.
 */

import dynamic from "next/dynamic";
import type { PremiumReading, RenderedSection } from "@/lib/premium/types";
import {
  CHAPTER_BUILT_USING_TABLE,
  HOW_WE_READ_EXPLAINER,
} from "@/lib/premium/products/birth-chart/blueprint";
import PremiumBookBuiltUsing from "./PremiumBookBuiltUsing";

const ChartWheel = dynamic(() => import("@/components/ChartWheel"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] flex items-center justify-center opacity-50 text-sm">
      Loading your chart…
    </div>
  ),
});

interface Props {
  section: RenderedSection;
  reading: PremiumReading;
  isChapter: boolean;
  chapterPositionLabel?: string; // e.g. "Chapter 4 of 13"
  partLabel?: string;            // e.g. "Understanding You"
  onContinue: () => void;
  isLast: boolean;
}

const partDisplayNames: Record<string, string> = {
  "part-one": "Understanding You",
  "part-two": "Your Current Season",
  closer: "One Last Thing",
};

/* ─── Paragraph splitter (empty line = new paragraph) ─────────────── */
function toParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/* ─── Continue CTA (immersive, not "Next") ─────────────────────────── */
function ContinueCta({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-2 text-[#c4a8ff] hover:text-[#e8dcff] transition-colors text-sm tracking-wide"
    >
      <span>{label}</span>
      <span
        className="inline-block transition-transform group-hover:translate-x-1"
        aria-hidden
      >
        →
      </span>
    </button>
  );
}

export default function PremiumBookPage({
  section,
  reading,
  isChapter,
  onContinue,
  isLast,
}: Props) {
  const paragraphs = toParagraphs(section.body);
  const continueLabel = isChapter
    ? "Continue Your Story"
    : section.pageType === "welcome"
      ? "Begin"
      : section.pageType === "chart"
        ? "How we read this"
        : "Continue";

  /* ═════════ COVER — handled by PremiumBookCover, not this component ═════════ */

  /* ═════════ WELCOME ═════════ */
  if (section.pageType === "welcome") {
    return (
      <article className="premium-book-page premium-page-welcome">
        <div className="premium-page-inner">
          <p className="premium-page-eyebrow">Preface</p>
          <h1 className="premium-page-title">{section.title}</h1>
          {section.subtitle && (
            <p className="premium-page-subtitle">{section.subtitle}</p>
          )}
          <div className="premium-page-body">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {!isLast && (
            <div className="premium-page-cta">
              <ContinueCta label={continueLabel} onClick={onContinue} />
            </div>
          )}
        </div>
      </article>
    );
  }

  /* ═════════ CHART ═════════ */
  if (section.pageType === "chart") {
    return (
      <article className="premium-book-page premium-page-chart">
        <div className="premium-page-inner">
          <p className="premium-page-eyebrow">The blueprint</p>
          <h1 className="premium-page-title">{section.title}</h1>
          {section.subtitle && (
            <p className="premium-page-subtitle">{section.subtitle}</p>
          )}
          <div className="premium-chart-wrap">
            <ChartWheel chart={reading.chart} />
          </div>
          <div className="premium-chart-meta">
            <div>
              <span className="premium-chart-meta-label">Born</span>
              <span className="premium-chart-meta-value">
                {reading.meta.dob} · {reading.meta.birthTime}
              </span>
            </div>
            <div>
              <span className="premium-chart-meta-label">In</span>
              <span className="premium-chart-meta-value">
                {reading.meta.birthPlace}
              </span>
            </div>
          </div>
          {!isLast && (
            <div className="premium-page-cta">
              <ContinueCta label={continueLabel} onClick={onContinue} />
            </div>
          )}
        </div>
      </article>
    );
  }

  /* ═════════ EDUCATION (How we read your chart) ═════════ */
  if (section.pageType === "education") {
    return (
      <article className="premium-book-page premium-page-education">
        <div className="premium-page-inner">
          <p className="premium-page-eyebrow">A quick note</p>
          <h1 className="premium-page-title">{section.title}</h1>
          {section.subtitle && (
            <p className="premium-page-subtitle premium-page-subtitle-italic">
              {section.subtitle}
            </p>
          )}
          <div className="premium-page-body">
            {toParagraphs(HOW_WE_READ_EXPLAINER).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="premium-attribution-table">
            <div className="premium-attribution-heading">
              What each chapter is built on
            </div>
            <ul>
              {CHAPTER_BUILT_USING_TABLE.map((row) => (
                <li key={row.chapter}>
                  <span className="premium-attribution-icon" aria-hidden>
                    {row.icon}
                  </span>
                  <span className="premium-attribution-chapter">
                    {row.chapter}
                  </span>
                  <span className="premium-attribution-inputs">
                    {row.builtUsing}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {!isLast && (
            <div className="premium-page-cta">
              <ContinueCta label={continueLabel} onClick={onContinue} />
            </div>
          )}
        </div>
      </article>
    );
  }

  /* ═════════ CHAPTER (AI-authored body) ═════════ */
  if (section.pageType === "chapter") {
    return (
      <article className="premium-book-page premium-page-chapter">
        <div className="premium-page-inner">
          <p className="premium-page-eyebrow">
            {section.chapterNumber
              ? `Chapter ${section.chapterNumber}`
              : "Chapter"}
          </p>
          <h1 className="premium-page-title">{section.title}</h1>
          {section.subtitle && (
            <p className="premium-page-subtitle premium-page-subtitle-italic">
              {section.subtitle}
            </p>
          )}
          <div className="premium-page-body">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {section.builtUsing && (
            <PremiumBookBuiltUsing items={section.builtUsing} />
          )}
          {!isLast && (
            <div className="premium-page-cta">
              <ContinueCta label={continueLabel} onClick={onContinue} />
            </div>
          )}
        </div>
      </article>
    );
  }

  /* ═════════ CLOSING ═════════ */
  if (section.pageType === "closing") {
    return (
      <article className="premium-book-page premium-page-closing">
        <div className="premium-page-inner">
          <p className="premium-page-eyebrow">Before you go</p>
          <h1 className="premium-page-title premium-page-title-closing">
            {section.title}
          </h1>
          <div className="premium-page-body premium-page-body-closing">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <div className="premium-page-closing-signature">— BluntChart</div>
        </div>
      </article>
    );
  }

  /* ═════════ PART TITLE (big dark hero page: "Part I" / "Part II") ═════════ */
  if (section.pageType === "part-title") {
    return (
      <article className="premium-book-page premium-page-part-title">
        <div className="premium-part-inner">
          <p className="premium-part-eyebrow">BluntChart</p>
          <h1 className="premium-part-title">{section.title}</h1>
          {section.subtitle && (
            <p className="premium-part-subtitle">{section.subtitle}</p>
          )}
          {!isLast && (
            <div className="premium-part-cta">
              <ContinueCta label="Begin Part" onClick={onContinue} />
            </div>
          )}
        </div>
      </article>
    );
  }

  /* ═════════ FAREWELL (final dark hero: "Thank you. We'll meet again.") ═════════ */
  if (section.pageType === "farewell") {
    return (
      <article className="premium-book-page premium-page-farewell">
        <div className="premium-part-inner">
          <p className="premium-part-eyebrow">Fin</p>
          <h1 className="premium-part-title premium-part-title-farewell">
            {section.title}
          </h1>
          {section.subtitle && (
            <p className="premium-part-subtitle premium-part-subtitle-italic">
              {section.subtitle}
            </p>
          )}
          <div className="premium-part-signature">— BluntChart</div>
        </div>
      </article>
    );
  }

  /* ═════════ TRANSITION (Part II bridge) ═════════ */
  if (section.pageType === "transition") {
    return (
      <article className="premium-book-page premium-page-transition">
        <div className="premium-page-inner">
          <p className="premium-page-eyebrow">Part Two</p>
          <h1 className="premium-page-title">{section.title}</h1>
          <div className="premium-page-body">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {!isLast && (
            <div className="premium-page-cta">
              <ContinueCta label="Enter Part Two" onClick={onContinue} />
            </div>
          )}
        </div>
      </article>
    );
  }

  /* ═════════ FALLBACK ═════════ */
  return (
    <article className="premium-book-page">
      <div className="premium-page-inner">
        <h1 className="premium-page-title">{section.title}</h1>
        {section.subtitle && (
          <p className="premium-page-subtitle">{section.subtitle}</p>
        )}
        <div className="premium-page-body">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {!isLast && (
          <div className="premium-page-cta">
            <ContinueCta label={continueLabel} onClick={onContinue} />
          </div>
        )}
      </div>
    </article>
  );
}

export { partDisplayNames };
