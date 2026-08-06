"use client";

import { useState } from "react";

interface Props {
  onCta: () => void;
}

const SAMPLE_TEXT = `My love,

I already know one thing about you that's going to drive me insane.

You'll want me to notice when something's wrong... while doing absolutely everything in your power to convince me that nothing's wrong.

Very efficient system you've created there.

Unfortunately for you, I'm paying attention.

And I'm going to learn the difference between "I'm fine" and the specific way you get quiet when you're not. The way you start tidying things. The way you text back slightly faster than normal, as if that's going to distract me.

It won't.`;

export default function InteractiveSampleLetter({ onCta }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="fll-sample">
      <h2 className="fll-section-heading">
        WE PROBABLY SHOULDN&rsquo;T SHOW YOU
        <br />
        SOMEONE ELSE&rsquo;S LETTER&hellip;
      </h2>
      <p className="fll-sample-sub">
        &hellip;but she said we could show you a little.
      </p>

      <div className={`fll-sample-env ${isOpen ? "open" : ""}`}>
        {/* Envelope body */}
        <div className="fll-sample-env-body">
          <div className="fll-sample-env-label">PRIVATE</div>
          <div className="fll-sample-env-hint">
            obviously you&rsquo;re going to open it
          </div>
        </div>

        {/* Flap */}
        <div className="fll-sample-env-flap" />

        {/* Paper */}
        <div className="fll-sample-paper">
          <div className="fll-sample-paper-inner">
            {SAMPLE_TEXT.split("\n").map((line, i) =>
              line.trim() ? (
                <p key={i} className="fll-sample-paper-line">
                  {line}
                </p>
              ) : (
                <div key={i} className="fll-sample-paper-break" />
              ),
            )}
          </div>
          <div className="fll-sample-paper-fade" />
        </div>

        {/* CTA overlay when open */}
        {isOpen && (
          <div className="fll-sample-overlay">
            <p className="fll-sample-overlay-title">
              ENOUGH SNOOPING.
              <br />
              GET YOUR OWN HUSBAND.
            </p>
            <button
              className="fll-cta"
              onClick={onCta}
              type="button"
            >
              💌 READ MY LETTER
            </button>
          </div>
        )}
      </div>

      {!isOpen && (
        <button
          className="fll-cta-ghost"
          onClick={() => setIsOpen(true)}
          type="button"
          style={{ marginTop: 24 }}
        >
          OPEN THE LETTER →
        </button>
      )}

      <p className="fll-sample-note">
        Sample letter — yours is generated from your own chart.
      </p>
    </section>
  );
}
