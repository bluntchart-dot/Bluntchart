"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

interface Props {
  onCta: () => void;
}

export default function FutureHusbandVisual({ onCta }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced) return;

    function onScroll() {
      if (!sectionRef.current || !imgRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const vh = window.innerHeight;
      if (rect.top < vh && rect.bottom > 0) {
        const progress = (vh - rect.top) / (vh + rect.height);
        imgRef.current.style.transform = `translateY(${(progress - 0.5) * -30}px)`;
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="fll-husband" ref={sectionRef}>
      <div className="fll-husband-inner">
        <div className="fll-husband-img-col">
          <div className="fll-husband-img-glow" />
          <div className="fll-husband-img-wrap" ref={imgRef}>
            <Image
              src="/Mysterious handsome-man cutout.png"
              alt="A mysterious silhouette representing the idea of a future partner"
              width={1024}
              height={1536}
              className="fll-husband-img"
            />
          </div>
        </div>
        <div className="fll-husband-copy-col">
          <h2 className="fll-section-heading">
            SO&hellip; WHO ARE YOU PICTURING
            <br />
            RIGHT NOW?
          </h2>
          <p className="fll-husband-sub">
            Don&rsquo;t tell us.
          </p>
          <div className="fll-husband-body">
            <p>Maybe someone immediately came to mind.</p>
            <p>Maybe absolutely no one did.</p>
            <p>
              Maybe you&rsquo;re reading this next to someone and
              trying very hard not to look suspicious.
            </p>
            <p>
              Either way, we&rsquo;re not here to tell you WHO your
              future husband is.
            </p>
            <p>
              We&rsquo;re exploring something much more personal:
            </p>
            <p className="fll-husband-highlight">
              What does loving you well actually look like?
            </p>
            <p className="fll-dim">
              He can keep the mystery. Your chart has enough to say.
            </p>
          </div>
          <button className="fll-cta" onClick={onCta} type="button">
            LET HIM WRITE
          </button>
        </div>
      </div>
    </section>
  );
}
