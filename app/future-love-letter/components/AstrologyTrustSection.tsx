"use client";

export default function AstrologyTrustSection() {
  return (
    <section className="fll-trust">
      <h2 className="fll-section-heading">
        OKAY, BUT IS THIS JUST AI
        <br />
        FLIRTING WITH ME?
      </h2>
      <p className="fll-trust-answer">
        Nope. There&rsquo;s actually your birth chart behind the
        flirting.
      </p>
      <p className="fll-section-copy">
        Before the letter is written, we calculate your birth chart
        from date, exact birth time and birthplace.
      </p>

      {/* Orbit visualization */}
      <div className="fll-orbit">
        <svg
          viewBox="0 0 400 400"
          className="fll-orbit-svg"
          aria-hidden
        >
          {/* Orbital rings */}
          <circle
            cx="200"
            cy="200"
            r="170"
            className="fll-orbit-ring"
            style={{ animationDuration: "90s" }}
          />
          <circle
            cx="200"
            cy="200"
            r="130"
            className="fll-orbit-ring"
            style={{ animationDuration: "70s" }}
          />
          <circle
            cx="200"
            cy="200"
            r="90"
            className="fll-orbit-ring"
            style={{ animationDuration: "55s" }}
          />

          {/* Connector lines */}
          <line x1="200" y1="30" x2="200" y2="155" className="fll-orbit-line" />
          <line x1="362" y1="145" x2="245" y2="175" className="fll-orbit-line" />
          <line x1="362" y1="255" x2="245" y2="225" className="fll-orbit-line" />
          <line x1="200" y1="370" x2="200" y2="245" className="fll-orbit-line" />
          <line x1="38" y1="200" x2="155" y2="200" className="fll-orbit-line" />
        </svg>

        {/* Center — the letter */}
        <div className="fll-orbit-center">
          <div className="fll-orbit-center-glow" />
          <span className="fll-orbit-center-label">YOUR<br />LETTER</span>
        </div>

        {/* Planet nodes */}
        <div className="fll-orbit-node fll-orbit-n1">
          <span className="fll-orbit-node-name">MOON</span>
          <span className="fll-orbit-node-desc">emotional needs</span>
        </div>
        <div className="fll-orbit-node fll-orbit-n2">
          <span className="fll-orbit-node-name">VENUS</span>
          <span className="fll-orbit-node-desc">affection &amp; attraction</span>
        </div>
        <div className="fll-orbit-node fll-orbit-n3">
          <span className="fll-orbit-node-name">MARS</span>
          <span className="fll-orbit-node-desc">desire &amp; pursuit</span>
        </div>
        <div className="fll-orbit-node fll-orbit-n4">
          <span className="fll-orbit-node-name">7TH HOUSE</span>
          <span className="fll-orbit-node-desc">partnership themes</span>
        </div>
        <div className="fll-orbit-node fll-orbit-n5">
          <span className="fll-orbit-node-name">ASPECTS</span>
          <span className="fll-orbit-node-desc">how those needs interact</span>
        </div>
      </div>

      <div className="fll-trust-result">
        <p className="fll-trust-result-heading">
          WE READ THE CHART. HE GETS THE NOTES. YOU GET THE LETTER.
        </p>
        <p>Your chart becomes a relationship brief.</p>
        <p>That brief becomes your letter.</p>
        <p className="fll-dim">
          Astrology happens backstage. You get the interesting part.
        </p>
      </div>
    </section>
  );
}
