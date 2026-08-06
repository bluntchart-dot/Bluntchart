"use client";

const FRAGMENTS = [
  "I’m going to need you to stop calling emotional unavailability “mysterious.”",
  "Yes, I’ll text back. Please try to act normal about it.",
  "You can tell me you don’t need reassurance. I’m probably going to give it to you anyway.",
];

export default function EmotionalTease() {
  return (
    <section className="fll-tease">
      <h2 className="fll-section-heading">
        SO&hellip; APPARENTLY HE ALREADY
        <br />
        KNOWS YOUR TYPE.
      </h2>
      <p className="fll-tease-sub">
        Unfortunately, he also knows how that&rsquo;s been going.
      </p>

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
        A taste of the experience — your actual letter is written from
        your own chart.
      </p>
    </section>
  );
}
