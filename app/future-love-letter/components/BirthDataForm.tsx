"use client";

import { useState, useCallback, forwardRef } from "react";
import LocationPicker from "@/components/LocationPicker";
import type { SelectedLocation } from "@/components/LocationPicker";
import Link from "next/link";

interface FormValues {
  name: string;
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

const BirthDataForm = forwardRef<HTMLDivElement, Props>(function BirthDataForm(
  { form, onFormChange, onSubmit, canSubmit, error, onFormTouch },
  ref,
) {
  const [showTimeInfo, setShowTimeInfo] = useState(false);

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
    <section className="fll-form-section" ref={ref}>
      <div className="fll-form-section-inner">
        <h2 className="fll-section-heading">
          OKAY. SHOULD WE LET HIM WRITE?
        </h2>
        <p className="fll-form-intro">
          We just need the sky you were born under.
        </p>

        {error && (
          <div className="fll-error">
            <p>The stars lost your letter for a second.</p>
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
                  estimate still helps. Some parts of the reading may
                  be less precise.
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
            💌 LET MY FUTURE HUSBAND TALK
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
          <p className="fll-form-trust">
            🔒 Your birth details are used to calculate your chart.{" "}
            <Link href="/privacy" className="fll-link">
              Privacy Policy
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
});

export default BirthDataForm;
