"use client";

import { useState, useCallback, forwardRef } from "react";
import LocationPicker from "@/components/LocationPicker";
import type { SelectedLocation } from "@/components/LocationPicker";
import Link from "next/link";

interface FormValues {
  name: string;
  email: string;
  dob: string;
  time: string;
  place: string;
  lat?: number;
  lng?: number;
}

interface Props {
  form: FormValues;
  onFormChange: (updates: Partial<FormValues>) => void;
  onSubmit: (e: React.FormEvent) => void;
  canSubmit: boolean;
  error: string | null;
  onFormTouch: () => void;
}

const FRAGMENTS = [
  "You can say you don't need reassurance. Doesn't mean I'm going to believe you.",
  "I'll give you space. Reasonable amounts. Don't get ambitious.",
  "And apparently I need to learn the difference between 'I'm fine' and actually fine. Noted.",
];

const TeaseAndForm = forwardRef<HTMLDivElement, Props>(function TeaseAndForm(
  { form, onFormChange, onSubmit, canSubmit, error, onFormTouch },
  ref,
) {
  const [showTimeInfo, setShowTimeInfo] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const handleLocationChange = useCallback(
    (loc: SelectedLocation | null, rawText: string) => {
      onFormTouch();
      onFormChange({
        place: rawText,
        lat: loc?.lat,
        lng: loc?.lng,
      });
    },
    [onFormChange, onFormTouch],
  );

  const handleInput = useCallback(
    (field: keyof FormValues, value: string) => {
      onFormTouch();
      onFormChange({ [field]: value });
    },
    [onFormChange, onFormTouch],
  );

  return (
    <section className="fll-tease-form" ref={ref}>
      <div className="fll-tease-form-inner">
        {/* Left: tease fragments */}
        <div className="fll-tease-col">
          <h2 className="fll-section-heading">
            SO&hellip; APPARENTLY HE ALREADY
            <br />
            KNOWS YOUR TYPE.
          </h2>
          <p className="fll-tease-sub">
            Your birth chart had some things to say.
          </p>

          <p className="fll-tease-taste">A little taste &darr;</p>

          <div className="fll-tease-fragments">
            {FRAGMENTS.map((text, i) => (
              <div
                key={i}
                className="fll-tease-note"
                style={{ animationDelay: `${i * 0.35}s` }}
              >
                <span className="fll-tease-note-text">
                  &ldquo;{text}&rdquo;
                </span>
              </div>
            ))}
          </div>

          <p className="fll-tease-label">
            Examples only. Your letter is personalized from your chart.
          </p>
        </div>

        {/* Right: form */}
        <div className="fll-form-col">
          <h3 className="fll-form-heading">YOUR LETTER STARTS HERE</h3>

          {error && (
            <div className="fll-error">
              <p>Something went wrong generating your letter.</p>
              <p className="fll-dim">{error}</p>
            </div>
          )}

          <form className="fll-form" onSubmit={onSubmit}>
            <div className="fll-form-group">
              <label className="fll-label">First name</label>
              <input
                className="fll-input"
                type="text"
                placeholder="Just your first name"
                value={form.name}
                onChange={(e) => handleInput("name", e.target.value)}
                autoComplete="given-name"
              />
            </div>
            <div className="fll-form-group">
              <label className="fll-label">Email</label>
              <input
                className="fll-input"
                type="email"
                placeholder="Where should we send a copy?"
                value={form.email}
                onChange={(e) => handleInput("email", e.target.value)}
                autoComplete="email"
              />
              <span className="fll-input-hint">We&rsquo;ll send your letter here. No spam.</span>
            </div>
            <div className="fll-form-group">
              <label className="fll-label">Date of birth</label>
              <input
                className="fll-input"
                type="date"
                value={form.dob}
                onChange={(e) => handleInput("dob", e.target.value)}
              />
            </div>
            <div className="fll-form-group">
              <label className="fll-label">Exact birth time</label>
              <input
                className="fll-input"
                type="time"
                value={form.time}
                onChange={(e) => handleInput("time", e.target.value)}
              />
              <button
                type="button"
                className="fll-time-info-btn"
                onClick={() => setShowTimeInfo(!showTimeInfo)}
              >
                Why do you need my birth time?
              </button>
              {showTimeInfo && (
                <div className="fll-time-info">
                  <p>
                    Birth time helps calculate the Ascendant, houses and
                    relationship axis, making the reading more specific
                    than Sun-sign astrology.
                  </p>
                  <p>
                    If you don&rsquo;t know your exact time, your best
                    estimate still helps.
                  </p>
                </div>
              )}
            </div>
            <div className="fll-form-group">
              <label className="fll-label">Birthplace</label>
              <LocationPicker
                value={form.place}
                onChange={handleLocationChange}
                placeholder="Start typing your birth city..."
              />
            </div>
            <button
              className="fll-cta fll-cta-submit"
              type="submit"
              disabled={!canSubmit}
            >
              LET MY FUTURE HUSBAND TALK
            </button>
            <div className="fll-form-micro">
              <p>
                <span className="fll-price-old">$9.99</span>{" "}
                <span className="fll-price-now">$4.99</span>{" "}
                &mdash; launch offer
              </p>
              <p className="fll-dim">
                Emotional consequences are between you and your birth
                chart.
              </p>
            </div>

            {/* Trust / privacy expandable */}
            <div className="fll-form-privacy">
              <button
                type="button"
                className="fll-privacy-toggle"
                onClick={() => setShowPrivacy(!showPrivacy)}
              >
                ✦ Why do you need my exact birth details?
              </button>
              {showPrivacy && (
                <div className="fll-privacy-panel">
                  <p>
                    Your birth time and birthplace help calculate your
                    Ascendant, houses and relationship axis — making this
                    more personal than a generic zodiac-sign letter.
                  </p>
                  <p>
                    Your birth details are processed server-side to
                    calculate your chart. A structured relationship brief
                    (not your raw birth data) is then sent to an AI model
                    to write your letter. We don&rsquo;t sell your data.
                  </p>
                  <p>
                    <Link href="/privacy" className="fll-link">
                      Privacy Policy &rarr;
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
});

export default TeaseAndForm;
