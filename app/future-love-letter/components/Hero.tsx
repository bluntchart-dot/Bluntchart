"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";

const LABEL = "Future Husband";

interface Props {
  onCta: () => void;
}

export default function Hero({ onCta }: Props) {
  const imgRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!imgRef.current || window.innerWidth < 768) return;
      const rect = imgRef.current.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      imgRef.current.style.transform = `rotateY(${dx * 4}deg) rotateX(${-dy * 3}deg)`;
    },
    [],
  );

  const handlePointerLeave = useCallback(() => {
    if (imgRef.current) imgRef.current.style.transform = "";
  }, []);

  return (
    <section
      className="fll-hero"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="fll-hero-inner">
        {/* Copy column */}
        <div className="fll-hero-copy-col">
          <p className="fll-eyebrow">
            PERSONALIZED FROM YOUR BIRTH CHART
          </p>
          <h1 className="fll-h1">
            A letter from the person
            <br />
            <span className="fll-h1-accent">
              your chart&apos;s been waiting for.
            </span>
          </h1>
          <div className="fll-hero-body">
            <p>
              Apparently, your future husband has a few things to
              say.
            </p>
            <p>About the way you love.</p>
            <p>The things you pretend you don&rsquo;t need.</p>
            <p>
              What gets your attention&hellip;
              <br />
              and what actually keeps it.
            </p>
            <p className="fll-hero-punch">
              So we gave him the notes.
              <br />
              You get the letter.
            </p>
          </div>
          <button className="fll-cta" onClick={onCta} type="button">
            I NEED TO READ THIS
          </button>
          <p className="fll-cta-micro">
            <span className="fll-price-old">$9.99</span>{" "}
            <span className="fll-price-now">$4.99</span>{" "}
            &mdash; launch price, limited time
          </p>
        </div>

        {/* Envelope column */}
        <div className="fll-hero-env-col">
          <div className="fll-hero-env-glow" />
          <div className="fll-hero-env-float" ref={imgRef}>
            <Image
              src="/Premium envelope.png"
              alt="A premium ivory envelope addressed to you, from your future husband"
              width={1536}
              height={1024}
              priority
              className="fll-hero-env-img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
