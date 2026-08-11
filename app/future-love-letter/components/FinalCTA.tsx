"use client";

import Image from "next/image";

interface Props {
  onCta: () => void;
}

export default function FinalCTA({ onCta }: Props) {
  return (
    <section className="fll-final">
      <div className="fll-final-env-wrap">
        <div className="fll-final-env-glow" />
        <Image
          src="/Premium envelope.png"
          alt="Your letter is waiting"
          width={1536}
          height={1024}
          className="fll-final-env-img"
        />
      </div>
      <h2 className="fll-section-heading">
        THERE&rsquo;S ONLY ONE LETTER
        <br />
        WE HAVEN&rsquo;T OPENED YET.
      </h2>
      <p className="fll-final-sub">Yours.</p>
      <button className="fll-cta" onClick={onCta} type="button">
        WRITE MY LETTER
      </button>
      <p className="fll-cta-micro">
        <span className="fll-price-old">$9.99</span>{" "}
        <span className="fll-price-now">$4.99</span>{" "}
        &mdash; launch price
      </p>
    </section>
  );
}
