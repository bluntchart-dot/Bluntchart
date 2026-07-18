import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About BluntChart | Birth Charts, Astrology & Honest Zodiac Guides",
  description:
    "Learn why BluntChart exists, how our birth chart readings work, why birth time matters, and why we explain astrology in simple, honest language without the jargon.",
  keywords: [
    "about bluntchart",
    "bluntchart astrology",
    "honest astrology",
    "birth chart readings",
    "personalized natal chart",
    "swiss ephemeris astrology",
    "no daily horoscope",
    "astrology in plain english",
  ],
  alternates: { canonical: "https://bluntchart.com/about" },
  openGraph: {
    title: "About BluntChart — Honest Birth Chart Readings, No Jargon",
    description:
      "Why BluntChart exists, why birth time actually matters, and why we explain your natal chart in plain, honest English instead of vague daily horoscopes.",
    url: "https://bluntchart.com/about",
    siteName: "BluntChart",
    type: "website",
    locale: "en_US",
    images: [
      { url: "/og-image.png", width: 1200, height: 630, alt: "BluntChart" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About BluntChart — Honest Birth Chart Readings, No Jargon",
    description:
      "Personalized birth chart readings in plain English. No fear tactics, no fluff, no daily horoscopes.",
    images: ["/og-image.png"],
  },
};

const ABOUT_FAQS = [
  {
    q: "What is BluntChart?",
    a: "BluntChart is a personalized birth chart reading platform that explains your natal chart in plain, honest English. It uses high-precision astronomical calculations from Swiss Ephemeris and none of the jargon that usually makes astrology confusing.",
  },
  {
    q: "Does BluntChart publish daily horoscopes?",
    a: "No. BluntChart does not publish generic daily horoscope predictions. Every reading is generated from your own birth chart — your date, time, and place of birth — so it is specific to you, not the millions of others born under the same Sun sign.",
  },
  {
    q: "Why does BluntChart ask for exact birth time?",
    a: "Because your birth time determines your Rising sign and all twelve house placements. Even people born on the same day can have very different charts if they were born a few hours apart, so the more accurate your birth time, the more meaningful your reading becomes.",
  },
  {
    q: "What is the Swiss Ephemeris?",
    a: "The Swiss Ephemeris is a high-precision astronomical calculation system used by professional astrologers worldwide. It provides the exact planetary positions needed to build an accurate natal chart before any interpretation begins.",
  },
  {
    q: "Is a birth chart the same as a horoscope?",
    a: "No. A birth chart is a unique map of the sky at your exact moment of birth, combining the Sun, Moon, planets, signs, and houses into one complete picture of your personality. A daily horoscope is a broad prediction based on your Sun sign alone and shared by millions of people.",
  },
  {
    q: "Is BluntChart's astrology personalized?",
    a: "Yes. Every BluntChart reading begins with your own birth details — date, exact time, and place of birth — and interprets your unique combination of placements. No two readings are the same, because no two birth charts are the same.",
  },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AboutPage",
        "@id": "https://bluntchart.com/about#aboutpage",
        url: "https://bluntchart.com/about",
        name: "About BluntChart",
        description:
          "Why BluntChart exists, how our birth chart readings work, why birth time matters, and why we explain astrology in simple, honest language without the jargon.",
        inLanguage: "en-US",
        isPartOf: { "@id": "https://bluntchart.com/#website" },
        about: { "@id": "https://bluntchart.com/#organization" },
        mainEntity: { "@id": "https://bluntchart.com/#organization" },
        breadcrumb: { "@id": "https://bluntchart.com/about#breadcrumb" },
      },
      {
        "@type": "Organization",
        "@id": "https://bluntchart.com/#organization",
        name: "BluntChart",
        url: "https://bluntchart.com",
        logo: "https://bluntchart.com/mascot.png",
        description:
          "BluntChart is a personalized birth chart reading platform that explains your natal chart in plain, honest English using Swiss Ephemeris calculations.",
        founder: { "@id": "https://bluntchart.com/founder#person" },
        sameAs: [
          "https://www.instagram.com/bluntchart/",
          "https://www.tiktok.com/@bluntchart",
          "https://www.youtube.com/@BluntChart",
        ],
      },
      {
        "@type": "WebSite",
        "@id": "https://bluntchart.com/#website",
        url: "https://bluntchart.com",
        name: "BluntChart",
        publisher: { "@id": "https://bluntchart.com/#organization" },
        inLanguage: "en-US",
      },
      {
        "@type": "FAQPage",
        "@id": "https://bluntchart.com/about#faq",
        mainEntity: ABOUT_FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://bluntchart.com/about#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "About", item: "https://bluntchart.com/about" },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <style>{`
        .ab-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;background:rgba(9,9,15,.72);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,0.06)}
        .ab-c{max-width:1100px;margin:0 auto;padding:0 24px}
        .ab-nav-i{display:flex;align-items:center;justify-content:space-between}
        .ab-logo{display:flex;align-items:center;gap:10px;font-family:var(--font-display),Georgia,serif;font-size:1.3rem;font-weight:700;text-decoration:none;letter-spacing:.02em;color:#e8e4f0}
        .ab-logo-g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .ab-nl{display:flex;align-items:center;gap:28px;list-style:none;padding:0;margin:0}
        .ab-nl a{font-size:.83rem;font-weight:500;color:rgba(232,228,240,0.55);text-decoration:none;letter-spacing:.04em;text-transform:uppercase;transition:color .2s}
        .ab-nl a:hover{color:#e8e4f0}
        .ab-nl a.on{color:#e8e4f0}
        .ab-ncta{color:#F0B84A!important;border:1px solid rgba(240,184,74,0.18);padding:6px 15px;border-radius:4px}
        .ab-ncta:hover{background:rgba(240,184,74,0.18)}

        /* HERO with video bg */
        .ab-hero{position:relative;min-height:92vh;display:flex;align-items:center;justify-content:center;padding:140px 24px 80px;overflow:hidden;text-align:center}
        .ab-hero-video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:0}
        .ab-hero-veil{position:absolute;inset:0;z-index:1;background:linear-gradient(180deg,rgba(9,9,15,0.55) 0%,rgba(9,9,15,0.70) 40%,rgba(9,9,15,0.92) 100%),radial-gradient(ellipse 70% 50% at 50% 20%,rgba(107,47,212,0.18) 0%,transparent 60%)}
        .ab-hero-inner{position:relative;z-index:2;max-width:820px;margin:0 auto}
        .ab-crumb{font-size:.78rem;color:rgba(232,228,240,0.55);margin-bottom:22px}
        .ab-crumb a{color:rgba(232,228,240,0.55);text-decoration:none}
        .ab-crumb a:hover{color:#F0B84A}
        .ab-ey{display:inline-flex;align-items:center;gap:8px;font-size:.73rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#F0B84A;margin-bottom:24px;padding:5px 14px;border:1px solid rgba(240,184,74,0.24);border-radius:100px;background:rgba(240,184,74,.08);backdrop-filter:blur(6px)}
        .ab-h1{font-family:var(--font-display),Georgia,serif;font-size:clamp(2.2rem,5.5vw,3.9rem);font-weight:900;line-height:1.08;letter-spacing:-.02em;color:#f4efe8;text-shadow:0 4px 40px rgba(0,0,0,0.4);margin:0 0 18px}
        .ab-h1 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .ab-hsh{font-family:var(--font-display),Georgia,serif;font-size:clamp(1.1rem,2vw,1.35rem);font-style:italic;color:rgba(232,228,240,0.82);margin:0 auto;max-width:640px;line-height:1.55}

        /* PROSE */
        .ab-sec{padding:88px 0;position:relative;z-index:1}
        .ab-sec.dk{background:#0d0d18;border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06)}
        .ab-wrap{max-width:820px;margin:0 auto;padding:0 24px}
        .ab-label{display:flex;align-items:center;gap:10px;margin-bottom:14px}
        .ab-label::before{content:'';display:block;width:22px;height:1px;background:#F0B84A}
        .ab-label span{font-size:.7rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#F0B84A}
        .ab-h2{font-family:var(--font-display),Georgia,serif;font-size:clamp(1.75rem,3.6vw,2.4rem);font-weight:800;line-height:1.15;letter-spacing:-.015em;margin:0 0 22px;color:#f0ece8}
        .ab-h2 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .ab-lede{font-family:var(--font-display),Georgia,serif;font-size:1.15rem;line-height:1.6;color:rgba(232,228,240,0.85);font-style:italic;margin:0 0 24px;padding-left:14px;border-left:2px solid rgba(240,184,74,0.35)}
        .ab-line{font-size:1.02rem;line-height:1.72;color:rgba(232,228,240,0.78);margin:0 0 18px}
        .ab-line em{color:#f0d5b5;font-style:italic}
        .ab-line strong{color:#f0ece8;font-weight:600}
        .ab-group{margin:0 0 22px}
        .ab-group .ab-line{margin-bottom:6px}
        .ab-group .ab-line:last-child{margin-bottom:0}

        .ab-definition{margin:34px auto 0;max-width:820px;padding:24px 26px;border-radius:16px;background:linear-gradient(165deg,rgba(107,47,212,0.10),rgba(212,83,126,0.06));border:0.5px solid rgba(240,184,74,0.28);font-size:1.02rem;line-height:1.7;color:rgba(232,228,240,0.9)}
        .ab-definition strong{color:#f0ece8;font-weight:700}
        .ab-def-label{display:block;font-size:.7rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#F0B84A;margin-bottom:10px}

        /* Sub-list styled lines (grouped short lines) */
        .ab-stack{display:flex;flex-direction:column;gap:6px;margin:0 0 22px}
        .ab-stack .ab-line{margin:0}

        /* Internal-link callouts */
        .ab-links{margin-top:36px;padding-top:24px;border-top:0.5px solid rgba(255,255,255,0.06);display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .ab-links a{display:block;padding:16px 18px;border-radius:12px;background:rgba(255,255,255,0.03);border:0.5px solid rgba(255,255,255,0.08);text-decoration:none;transition:border-color .2s,background .2s}
        .ab-links a:hover{border-color:rgba(107,47,212,0.35);background:rgba(107,47,212,0.06)}
        .ab-links a strong{display:block;font-size:.85rem;color:#e8e4f0;margin-bottom:4px;font-weight:600}
        .ab-links a span{display:block;font-size:.78rem;color:rgba(232,228,240,0.5);line-height:1.5}

        /* FAQ */
        .ab-faq{max-width:820px;margin:0 auto;padding:0 24px}
        .ab-faq details{border-bottom:0.5px solid rgba(255,255,255,0.08)}
        .ab-faq details summary{list-style:none;cursor:pointer;padding:22px 0;display:flex;align-items:center;justify-content:space-between;gap:16px;font-size:.97rem;font-weight:600;color:#e8e4f0;line-height:1.45}
        .ab-faq details summary::-webkit-details-marker{display:none}
        .ab-faq details summary::after{content:'+';width:26px;height:26px;border-radius:50%;border:0.5px solid rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;color:#6b2fd4;font-weight:700;transition:all .2s}
        .ab-faq details[open] summary::after{content:'−';background:rgba(107,47,212,0.12)}
        .ab-faq details summary:focus-visible{outline:2px solid rgba(240,184,74,0.55);outline-offset:4px;border-radius:4px}
        .ab-faq details p{font-size:.9rem;color:rgba(232,228,240,0.66);line-height:1.78;padding:0 40px 22px 0;margin:0}

        /* CTA */
        .ab-cta{max-width:640px;margin:0 auto;text-align:center;padding:0 24px}
        .ab-cta h2{margin-bottom:14px}
        .ab-cta p{font-size:1rem;color:rgba(232,228,240,0.6);line-height:1.72;margin:0 auto 28px;max-width:520px}
        .ab-bp{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;background:linear-gradient(135deg,#6b2fd4,#d4537e);color:#fff;font-family:inherit;font-size:.88rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;border:none;border-radius:10px;cursor:pointer;transition:opacity .2s,transform .15s}
        .ab-bp:hover{opacity:.9;transform:translateY(-1px)}
        .ab-bp:focus-visible{outline:2px solid #F0B84A;outline-offset:3px}

        @media (max-width:768px){
          .ab-nl{display:none}
          .ab-hero{min-height:82vh;padding-top:110px;padding-bottom:64px}
          .ab-sec{padding:64px 0}
          .ab-links{grid-template-columns:1fr}
          .ab-lede{font-size:1.05rem}
        }
      `}</style>

      <nav className="ab-nav" aria-label="Primary">
        <div className="ab-c ab-nav-i">
          <Link href="/" className="ab-logo">
            <Image src="/mascot.png" alt="BluntChart mascot" width={34} height={34} style={{ borderRadius: "50%" }} priority />
            <span className="ab-logo-g">BluntChart</span>
          </Link>
          <ul className="ab-nl">
            <li><Link href="/#try-it">Try Free</Link></li>
            <li><Link href="/free-birth-chart-readings">How It Works</Link></li>
            <li><Link href="/zodiac-signs">Zodiac Signs</Link></li>
            <li><Link href="/about" className="on">About</Link></li>
            <li><Link className="ab-ncta" href="/#try-it">Get Reading $15</Link></li>
          </ul>
        </div>
      </nav>

      <main>
        {/* ── HERO with autoplaying Planets video ── */}
        <section className="ab-hero" aria-labelledby="about-h1">
          <video
            className="ab-hero-video"
            src="/Planets.mp4"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
          />
          <div className="ab-hero-veil" aria-hidden="true" />
          <div className="ab-hero-inner">
            <nav className="ab-crumb" aria-label="Breadcrumb">
              <Link href="/">BluntChart</Link> &nbsp;/&nbsp; <span>About</span>
            </nav>
            <div className="ab-ey">✦ About BluntChart</div>
            <h1 id="about-h1" className="ab-h1">
              Why We Built BluntChart<br />
              <em>(And Why Astrology Doesn&apos;t Have to Be Confusing)</em>
            </h1>
            <p className="ab-hsh">
              Astrology should help you understand yourself... not confuse you.
            </p>
          </div>
        </section>

        {/* ── INTRO ── */}
        <section className="ab-sec">
          <article className="ab-wrap">
            <div className="ab-label"><span>Our Story</span></div>
            <h2 className="ab-h2">Welcome to <em>BluntChart</em>.</h2>

            <p className="ab-line">This started with one simple thought:</p>

            <p className="ab-line" style={{ fontStyle: "italic", color: "#f0d5b5" }}>
              Why is so much astrology either impossible to understand, or so vague that it could apply to almost anyone?
            </p>

            <p className="ab-line">
              If you&apos;ve ever searched for your birth chart, you&apos;ve probably seen pages full of unfamiliar terms, long explanations, and predictions that somehow seem to fit everyone.
            </p>

            <p className="ab-line">That&apos;s not what we&apos;re here to do.</p>

            <p className="ab-line">
              BluntChart is a place for people who want astrology explained in a way that actually makes sense.
            </p>

            <div className="ab-stack">
              <p className="ab-line">No confusing jargon.</p>
              <p className="ab-line">No fear tactics.</p>
              <p className="ab-line">No sugarcoated &ldquo;everything happens for a reason.&rdquo;</p>
            </div>

            <p className="ab-line">
              Just clear, honest explanations of your birth chart, zodiac signs, planets, houses, compatibility, and the patterns that make you who you are.
            </p>

            <p className="ab-line">
              Whether you&apos;re completely new to astrology or you&apos;ve been reading about it for years, our goal is always the same:
            </p>

            <p className="ab-line" style={{ fontFamily: "var(--font-display),Georgia,serif", fontStyle: "italic", fontSize: "1.12rem", color: "#f0ece8" }}>
              Help you understand yourself a little better than you did yesterday.
            </p>

            {/* Quotable one-line definition for LLMs / AEO */}
            <aside className="ab-definition" aria-label="What is BluntChart">
              <span className="ab-def-label">What is BluntChart?</span>
              <strong>BluntChart</strong> is a personalized birth chart reading platform that
              explains your natal chart in plain, honest English — using high-precision
              astronomical calculations from <strong>Swiss Ephemeris</strong> and none of the
              jargon that usually makes astrology confusing.
            </aside>
          </article>
        </section>

        {/* ── WHY BIRTH TIME ── */}
        <section className="ab-sec dk">
          <article className="ab-wrap">
            <h2 className="ab-h2">Why your birth time <em>actually matters</em></h2>
            <p className="ab-lede">
              Your birth time matters because it determines your Rising sign and every
              house placement in your chart — the layers that make it uniquely yours.
            </p>

            <p className="ab-line">Your zodiac sign is only one small part of your birth chart.</p>
            <p className="ab-line">
              The exact time and place you were born determine your Rising sign, your house placements, and the position of every planet at that moment.
            </p>
            <p className="ab-line">
              Even people born on the same day can have very different charts if they&apos;re born a few hours apart.
            </p>
            <p className="ab-line">That&apos;s why we ask for your birth time whenever possible.</p>
            <p className="ab-line">The more accurate your chart is, the more meaningful your reading becomes.</p>
          </article>
        </section>

        {/* ── CHART VS HOROSCOPE ── */}
        <section className="ab-sec">
          <article className="ab-wrap">
            <h2 className="ab-h2">Birth charts are <em>different from horoscopes</em></h2>
            <p className="ab-lede">
              A birth chart is a personalized map of the sky at your exact moment of birth;
              a horoscope is a broad prediction based only on your Sun sign.
            </p>

            <p className="ab-line">
              Daily horoscopes treat millions of people with the same zodiac sign as if they&apos;re living the same life.
            </p>
            <p className="ab-line">Real astrology doesn&apos;t work like that.</p>
            <p className="ab-line">A birth chart is unique to you.</p>
            <p className="ab-line">
              It combines the positions of the Sun, Moon, planets, signs, and houses into one complete picture of your personality, strengths, blind spots, relationships, career patterns, and emotional habits.
            </p>
            <p className="ab-line">That&apos;s why two Virgos can feel completely different.</p>
          </article>
        </section>

        {/* ── NO DAILY HOROSCOPES ── */}
        <section className="ab-sec dk">
          <article className="ab-wrap">
            <h2 className="ab-h2">Why we don&apos;t publish endless <em>daily horoscope predictions</em></h2>
            <p className="ab-lede">
              Because your birth chart explains the patterns behind your life — not whether
              Tuesday will be lucky.
            </p>

            <p className="ab-line">
              We&apos;re more interested in helping you understand <em>why</em> you think, react, love, and make decisions the way you do... than telling you whether Tuesday will be lucky.
            </p>
            <p className="ab-line">Your birth chart doesn&apos;t predict every event in your life.</p>
            <p className="ab-line">It helps explain the patterns behind them.</p>
            <p className="ab-line">
              And those patterns tend to stay with you much longer than tomorrow&apos;s horoscope.
            </p>
          </article>
        </section>

        {/* ── SWISS EPHEMERIS ── */}
        <section className="ab-sec">
          <article className="ab-wrap">
            <h2 className="ab-h2">Why we use <em>Swiss Ephemeris</em></h2>
            <p className="ab-lede">
              We use Swiss Ephemeris because it is the most trusted astronomical
              calculation system in professional astrology — giving us the exact
              planetary positions your chart depends on.
            </p>

            <p className="ab-line">Every birth chart starts with accurate astronomical calculations.</p>
            <p className="ab-line">
              That&apos;s why we use Swiss Ephemeris — the same calculation system trusted by professional astrologers around the world.
            </p>
            <p className="ab-line">
              It gives us the exact planetary positions needed to create your natal chart before anything is explained.
            </p>
            <p className="ab-line">
              Because without an accurate chart, even the best interpretation doesn&apos;t really mean much.
            </p>
          </article>
        </section>

        {/* ── EVERY READING STARTS WITH YOUR CHART ── */}
        <section className="ab-sec dk">
          <article className="ab-wrap">
            <h2 className="ab-h2">Every reading starts with your chart <em>— not a template</em></h2>
            <p className="ab-lede">
              Every BluntChart reading is generated from your own birth details, not a
              generic personality template.
            </p>

            <p className="ab-line">No two birth charts are exactly the same.</p>
            <p className="ab-line">That&apos;s why every reading begins with your own birth details.</p>
            <p className="ab-line">
              Instead of forcing everyone into the same personality type, we look at how different placements work together to create something that&apos;s uniquely yours.
            </p>
            <p className="ab-line">Because astrology becomes far more useful when it feels personal.</p>

            {/* Contextual internal links */}
            <div className="ab-links">
              <Link href="/free-birth-chart">
                <strong>Free Birth Chart Calculator</strong>
                <span>Calculate your natal chart with Swiss Ephemeris precision.</span>
              </Link>
              <Link href="/zodiac-signs">
                <strong>Zodiac Signs Guide</strong>
                <span>Honest, jargon-free breakdowns of all twelve signs.</span>
              </Link>
              <Link href="/#try-it">
                <strong>Get Your Reading</strong>
                <span>Two free personalized insights, then the full reading for $15.</span>
              </Link>
              <Link href="/founder">
                <strong>Meet the Founder</strong>
                <span>The story behind why BluntChart exists.</span>
              </Link>
            </div>
          </article>
        </section>

        {/* ── FAQ ── */}
        <section className="ab-sec" aria-labelledby="about-faq-h2">
          <div className="ab-wrap" style={{ paddingBottom: 12 }}>
            <div className="ab-label"><span>Frequently Asked</span></div>
            <h2 id="about-faq-h2" className="ab-h2">Common questions <em>about BluntChart</em></h2>
          </div>
          <div className="ab-faq">
            {ABOUT_FAQS.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="ab-sec dk">
          <div className="ab-cta">
            <h2 className="ab-h2">Ready to read <em>your own chart?</em></h2>
            <p>
              Two personalized insights, free. The full reading — with your natal chart wheel,
              eight more insights, and your shareable identity card — is a one-time $15.
            </p>
            <Link className="ab-bp" href="/#try-it">
              Get My Free Preview ✨
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
