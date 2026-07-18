import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Why I Built this best Astrology Website for personalized birth charts?",
  description:
    "The personal story behind why I started explaining birth charts in plain, honest English and why I focus on personalized natal chart readings instead of vague daily horoscope predictions.",
  keywords: [
    "bluntchart founder",
    "ishika bluntchart",
    "personalized birth chart founder",
    "honest astrology founder",
    "best astrology website",
    "affordable birth chart",
    "ai birth chart",
    "swiss ephemeris astrology",
  ],
  alternates: { canonical: "https://bluntchart.com/founder" },
  openGraph: {
    title: "Meet the Founder — The Story Behind BluntChart",
    description:
      "Why Ishika built BluntChart to explain birth charts in plain, honest English — and why every reading starts with your actual natal chart, not a template.",
    url: "https://bluntchart.com/founder",
    siteName: "BluntChart",
    type: "profile",
    locale: "en_US",
    images: [
      { url: "/founder.jpeg", width: 800, height: 800, alt: "Ishika — Founder of BluntChart" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Meet the Founder — The Story Behind BluntChart",
    description:
      "Why I built BluntChart to explain birth charts in plain, honest English.",
    images: ["/founder.jpeg"],
  },
};

const FOUNDER_FAQS = [
  {
    q: "Who founded BluntChart?",
    a: "BluntChart was founded by Ishika. She built it to explain birth charts in plain, honest English instead of the vague or overly complicated tone most astrology sites use.",
  },
  {
    q: "Does BluntChart use AI?",
    a: "Yes. Some parts of BluntChart use AI to help explain complex birth chart patterns in clear, everyday language. Every reading still begins with your actual birth chart, calculated using Swiss Ephemeris — the AI helps translate, it does not invent your chart or replace the astrology behind it.",
  },
  {
    q: "Why is BluntChart affordable?",
    a: "BluntChart is priced low on purpose. Most people arrive at astrology in the middle of something real — a confusing relationship, a hard decision, a season where nothing quite fits — and the goal has always been to be genuinely useful rather than to charge what the market allows.",
  },
];

export default function FounderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": "https://bluntchart.com/founder#profilepage",
        url: "https://bluntchart.com/founder",
        name: "Meet the Founder — BluntChart",
        description:
          "The personal story behind why Ishika started BluntChart and why she focuses on personalized natal chart readings instead of vague daily horoscope predictions.",
        inLanguage: "en-US",
        isPartOf: { "@id": "https://bluntchart.com/#website" },
        mainEntity: { "@id": "https://bluntchart.com/founder#person" },
        breadcrumb: { "@id": "https://bluntchart.com/founder#breadcrumb" },
      },
      {
        "@type": "Person",
        "@id": "https://bluntchart.com/founder#person",
        name: "Ishika",
        jobTitle: "Founder",
        worksFor: { "@id": "https://bluntchart.com/#organization" },
        url: "https://bluntchart.com/founder",
        image: "https://bluntchart.com/founder.jpeg",
        description:
          "Ishika is the founder of BluntChart, a personalized birth chart reading platform that explains natal charts in plain, honest English using Swiss Ephemeris calculations.",
        sameAs: [
          "https://www.instagram.com/bluntchart/",
          "https://www.tiktok.com/@bluntchart",
          "https://www.youtube.com/@BluntChart",
        ],
      },
      {
        "@type": "Organization",
        "@id": "https://bluntchart.com/#organization",
        name: "BluntChart",
        url: "https://bluntchart.com",
        logo: "https://bluntchart.com/mascot.png",
        founder: { "@id": "https://bluntchart.com/founder#person" },
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
        "@id": "https://bluntchart.com/founder#faq",
        mainEntity: FOUNDER_FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://bluntchart.com/founder#breadcrumb",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
          { "@type": "ListItem", position: 2, name: "Founder", item: "https://bluntchart.com/founder" },
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
        .fd-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;background:rgba(9,9,15,.72);backdrop-filter:blur(14px);border-bottom:1px solid rgba(255,255,255,0.06)}
        .fd-c{max-width:1100px;margin:0 auto;padding:0 24px}
        .fd-nav-i{display:flex;align-items:center;justify-content:space-between}
        .fd-logo{display:flex;align-items:center;gap:10px;font-family:var(--font-display),Georgia,serif;font-size:1.3rem;font-weight:700;text-decoration:none;letter-spacing:.02em;color:#e8e4f0}
        .fd-logo-g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .fd-nl{display:flex;align-items:center;gap:28px;list-style:none;padding:0;margin:0}
        .fd-nl a{font-size:.83rem;font-weight:500;color:rgba(232,228,240,0.55);text-decoration:none;letter-spacing:.04em;text-transform:uppercase;transition:color .2s}
        .fd-nl a:hover{color:#e8e4f0}
        .fd-nl a.on{color:#e8e4f0}
        .fd-ncta{color:#F0B84A!important;border:1px solid rgba(240,184,74,0.18);padding:6px 15px;border-radius:4px}
        .fd-ncta:hover{background:rgba(240,184,74,0.18)}

        /* HERO */
        .fd-hero{position:relative;padding:140px 24px 72px;overflow:hidden}
        .fd-hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% -10%,rgba(107,47,212,.12) 0%,transparent 55%),radial-gradient(ellipse 40% 40% at 85% 60%,rgba(212,83,126,.06) 0%,transparent 60%);pointer-events:none}
        .fd-hero-inner{position:relative;z-index:1;max-width:920px;margin:0 auto;display:flex;flex-direction:column;align-items:center;text-align:center;gap:26px}
        .fd-crumb{font-size:.78rem;color:rgba(232,228,240,0.55)}
        .fd-crumb a{color:rgba(232,228,240,0.55);text-decoration:none}
        .fd-crumb a:hover{color:#F0B84A}
        .fd-avatar-wrap{position:relative;width:172px;height:172px;border-radius:50%;padding:3px;background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);box-shadow:0 12px 40px rgba(107,47,212,0.28)}
        .fd-avatar{width:100%;height:100%;border-radius:50%;overflow:hidden;background:#12121e}
        .fd-avatar img{width:100%;height:100%;object-fit:cover;object-position:center 50%;display:block}
        .fd-ey{display:inline-flex;align-items:center;gap:8px;font-size:.73rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#F0B84A;padding:5px 14px;border:1px solid rgba(240,184,74,0.24);border-radius:100px;background:rgba(240,184,74,.06)}
        .fd-h1{font-family:var(--font-display),Georgia,serif;font-size:clamp(2.1rem,5vw,3.6rem);font-weight:900;line-height:1.1;letter-spacing:-.02em;color:#f4efe8;margin:0;max-width:820px}
        .fd-h1 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .fd-hsh{font-family:var(--font-display),Georgia,serif;font-size:clamp(1.05rem,1.8vw,1.25rem);font-style:italic;color:rgba(232,228,240,0.72);margin:0;max-width:600px;line-height:1.55}

        /* PROSE */
        .fd-sec{padding:80px 0;position:relative;z-index:1}
        .fd-sec.dk{background:#0d0d18;border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06)}
        .fd-wrap{max-width:820px;margin:0 auto;padding:0 24px}
        .fd-label{display:flex;align-items:center;gap:10px;margin-bottom:14px}
        .fd-label::before{content:'';display:block;width:22px;height:1px;background:#F0B84A}
        .fd-label span{font-size:.7rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#F0B84A}
        .fd-h2{font-family:var(--font-display),Georgia,serif;font-size:clamp(1.6rem,3.4vw,2.25rem);font-weight:800;line-height:1.15;letter-spacing:-.015em;margin:0 0 20px;color:#f0ece8}
        .fd-h2 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .fd-lede{font-family:var(--font-display),Georgia,serif;font-size:1.12rem;line-height:1.6;color:rgba(232,228,240,0.85);font-style:italic;margin:0 0 22px;padding-left:14px;border-left:2px solid rgba(240,184,74,0.35)}
        .fd-line{font-size:1.02rem;line-height:1.72;color:rgba(232,228,240,0.78);margin:0 0 18px}
        .fd-line em{color:#f0d5b5;font-style:italic}
        .fd-line strong{color:#f0ece8;font-weight:600}
        .fd-stack{display:flex;flex-direction:column;gap:6px;margin:0 0 22px}
        .fd-stack .fd-line{margin:0}
        .fd-quote{font-family:var(--font-display),Georgia,serif;font-style:italic;font-size:1.1rem;line-height:1.6;color:#f0d5b5;margin:0 0 22px}
        .fd-signoff{font-family:var(--font-display),Georgia,serif;font-style:italic;font-size:1.15rem;color:#F0B84A;margin-top:22px}

        /* Internal links */
        .fd-links{margin-top:32px;padding-top:22px;border-top:0.5px solid rgba(255,255,255,0.06);display:grid;grid-template-columns:1fr 1fr;gap:14px}
        .fd-links a{display:block;padding:16px 18px;border-radius:12px;background:rgba(255,255,255,0.03);border:0.5px solid rgba(255,255,255,0.08);text-decoration:none;transition:border-color .2s,background .2s}
        .fd-links a:hover{border-color:rgba(107,47,212,0.35);background:rgba(107,47,212,0.06)}
        .fd-links a strong{display:block;font-size:.85rem;color:#e8e4f0;margin-bottom:4px;font-weight:600}
        .fd-links a span{display:block;font-size:.78rem;color:rgba(232,228,240,0.5);line-height:1.5}

        /* FAQ */
        .fd-faq{max-width:820px;margin:0 auto;padding:0 24px}
        .fd-faq details{border-bottom:0.5px solid rgba(255,255,255,0.08)}
        .fd-faq details summary{list-style:none;cursor:pointer;padding:22px 0;display:flex;align-items:center;justify-content:space-between;gap:16px;font-size:.97rem;font-weight:600;color:#e8e4f0;line-height:1.45}
        .fd-faq details summary::-webkit-details-marker{display:none}
        .fd-faq details summary::after{content:'+';width:26px;height:26px;border-radius:50%;border:0.5px solid rgba(255,255,255,0.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;color:#6b2fd4;font-weight:700;transition:all .2s}
        .fd-faq details[open] summary::after{content:'−';background:rgba(107,47,212,0.12)}
        .fd-faq details summary:focus-visible{outline:2px solid rgba(240,184,74,0.55);outline-offset:4px;border-radius:4px}
        .fd-faq details p{font-size:.9rem;color:rgba(232,228,240,0.66);line-height:1.78;padding:0 40px 22px 0;margin:0}

        /* CTA */
        .fd-cta{max-width:640px;margin:0 auto;text-align:center;padding:0 24px}
        .fd-cta h2{margin-bottom:14px}
        .fd-cta p{font-size:1rem;color:rgba(232,228,240,0.6);line-height:1.72;margin:0 auto 28px;max-width:520px}
        .fd-bp{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;background:linear-gradient(135deg,#6b2fd4,#d4537e);color:#fff;font-family:inherit;font-size:.88rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;border:none;border-radius:10px;cursor:pointer;transition:opacity .2s,transform .15s}
        .fd-bp:hover{opacity:.9;transform:translateY(-1px)}
        .fd-bp:focus-visible{outline:2px solid #F0B84A;outline-offset:3px}

        @media (max-width:768px){
          .fd-nl{display:none}
          .fd-hero{padding-top:110px;padding-bottom:56px}
          .fd-avatar-wrap{width:148px;height:148px}
          .fd-sec{padding:60px 0}
          .fd-links{grid-template-columns:1fr}
        }
      `}</style>

      <nav className="fd-nav" aria-label="Primary">
        <div className="fd-c fd-nav-i">
          <Link href="/" className="fd-logo">
            <Image src="/mascot.png" alt="BluntChart mascot" width={34} height={34} style={{ borderRadius: "50%" }} priority />
            <span className="fd-logo-g">BluntChart</span>
          </Link>
          <ul className="fd-nl">
            <li><Link href="/#try-it">Try Free</Link></li>
            <li><Link href="/free-birth-chart-readings">How It Works</Link></li>
            <li><Link href="/zodiac-signs">Zodiac Signs</Link></li>
            <li><Link href="/about" className="on">About</Link></li>
            <li><Link className="fd-ncta" href="/#try-it">Get Reading $15</Link></li>
          </ul>
        </div>
      </nav>

      <main>
        {/* ── HERO ── */}
        <section className="fd-hero" aria-labelledby="founder-h1">
          <div className="fd-hero-bg" aria-hidden="true" />
          <div className="fd-hero-inner">
            <nav className="fd-crumb" aria-label="Breadcrumb">
              <Link href="/">BluntChart</Link> &nbsp;/&nbsp; <span>Founder</span>
            </nav>
            <div className="fd-avatar-wrap">
              <div className="fd-avatar">
                <Image
                  src="/founder.jpeg"
                  alt="Ishika, founder of BluntChart"
                  width={344}
                  height={344}
                  priority
                />
              </div>
            </div>
            <div className="fd-ey">✦ Meet the Founder</div>
            <h1 id="founder-h1" className="fd-h1">
              The Story Behind BluntChart<br />
              <em>(And Why I Do Astrology Differently)</em>
            </h1>
            <p className="fd-hsh">
              Hi, I&apos;m Ishika — the person behind BluntChart.
            </p>
          </div>
        </section>

        {/* ── INTRO ── */}
        <section className="fd-sec">
          <article className="fd-wrap">
            <p className="fd-line">I didn&apos;t grow up planning to build an astrology website.</p>
            <p className="fd-line">I simply kept running into the same problem.</p>
            <p className="fd-line">
              The more I read about astrology, the more I felt like I needed to learn an entirely new language just to understand myself.
            </p>
            <p className="fd-line">
              Everything seemed either incredibly complicated... or so relentlessly positive that it stopped feeling honest.
            </p>
            <p className="fd-line">Neither felt useful.</p>
            <p className="fd-line">I wanted something I&apos;d actually send to a friend.</p>

            <div className="fd-stack">
              <p className="fd-line">Something simple.</p>
              <p className="fd-line">Something specific.</p>
              <p className="fd-line">
                Something willing to say, <em>&ldquo;This part of you is amazing... and this part might be quietly getting in your own way.&rdquo;</em>
              </p>
            </div>

            <p className="fd-line">That&apos;s how BluntChart began.</p>
          </article>
        </section>

        {/* ── WHAT I'M OBSESSED WITH ── */}
        <section className="fd-sec dk">
          <article className="fd-wrap">
            <h2 className="fd-h2">What I&apos;m <em>obsessed with</em></h2>
            <p className="fd-lede">
              I&apos;m obsessed with the patterns astrology reveals about how people think,
              love, and quietly repeat themselves.
            </p>

            <p className="fd-line">I&apos;m fascinated by patterns.</p>
            <p className="fd-line">Why do some people keep choosing the same kind of relationships?</p>
            <p className="fd-line">Why do certain careers feel natural to one person and completely draining to another?</p>
            <p className="fd-line">Why do some people overthink every small thing while others jump first and think later?</p>
            <p className="fd-line">Astrology doesn&apos;t answer every question in life.</p>
            <p className="fd-line">
              But I&apos;ve found that a well-read birth chart often explains patterns people have quietly been noticing about themselves for years.
            </p>
            <p className="fd-line">That&apos;s the part I actually love.</p>
            <p className="fd-line">Not predicting the future.</p>
            <p className="fd-line" style={{ fontFamily: "var(--font-display),Georgia,serif", fontStyle: "italic", color: "#f0ece8", fontSize: "1.12rem" }}>
              Understanding people.
            </p>
          </article>
        </section>

        {/* ── WHY I USE TECHNOLOGY ── */}
        <section className="fd-sec">
          <article className="fd-wrap">
            <h2 className="fd-h2">Why I use <em>technology</em></h2>
            <p className="fd-lede">
              I use technology because a well-read birth chart involves thousands of
              possible combinations — and clarity depends on connecting them accurately.
            </p>

            <p className="fd-line">Every birth chart contains thousands of possible combinations.</p>
            <p className="fd-line">
              Technology helps connect those pieces faster and more consistently than doing everything by hand.
            </p>
            <p className="fd-line">But speed isn&apos;t the goal.</p>
            <p className="fd-line">Clarity is.</p>
            <p className="fd-line">
              The goal has always been to take something that feels overwhelming and explain it in plain English — while keeping every reading grounded in your own chart, and not a generic template.
            </p>
          </article>
        </section>

        {/* ── AI NOTE ── */}
        <section className="fd-sec dk">
          <article className="fd-wrap">
            <h2 className="fd-h2">A quick note <em>about AI</em></h2>
            <p className="fd-lede">
              Yes — BluntChart uses AI to help explain complex birth chart patterns in plain
              English, but every reading begins with your actual, calculated natal chart.
            </p>

            <p className="fd-line">I want to be upfront about this, because I&apos;d rather you know than wonder.</p>
            <p className="fd-line">
              Some parts of BluntChart use AI to help explain complex birth chart patterns in clear, everyday language.
            </p>
            <p className="fd-line">
              But every reading begins with your actual birth chart, calculated using professional astronomical data.
            </p>
            <p className="fd-line">AI helps make the explanations more personal and easier to understand.</p>
            <p className="fd-line">It doesn&apos;t invent your chart, and it doesn&apos;t replace the astrology behind it.</p>
          </article>
        </section>

        {/* ── WHY SWISS EPHEMERIS ── */}
        <section className="fd-sec">
          <article className="fd-wrap">
            <h2 className="fd-h2">Why <em>Swiss Ephemeris</em></h2>
            <p className="fd-lede">
              I use Swiss Ephemeris because accuracy has to come before interpretation —
              if the chart isn&apos;t right, nothing built on top of it will be either.
            </p>

            <p className="fd-line">Before anything is interpreted, the chart itself has to be accurate.</p>
            <p className="fd-line">
              That&apos;s why every reading starts with Swiss Ephemeris — one of the most trusted astronomical calculation systems used in professional astrology.
            </p>
            <p className="fd-line">If the chart isn&apos;t right, nothing built on top of it will be either.</p>
            <p className="fd-line">Accuracy comes first.</p>
            <p className="fd-line" style={{ fontFamily: "var(--font-display),Georgia,serif", fontStyle: "italic", color: "#f0ece8", fontSize: "1.12rem" }}>
              Always.
            </p>
          </article>
        </section>

        {/* ── PSYCHOLOGY ── */}
        <section className="fd-sec dk">
          <article className="fd-wrap">
            <h2 className="fd-h2">Why psychology interests me <em>just as much as astrology</em></h2>
            <p className="fd-lede">
              Psychology interests me because astrology, at its best, explains the patterns
              you&apos;ve quietly been noticing about yourself for years.
            </p>

            <p className="fd-line">The best astrology doesn&apos;t tell you who you are.</p>
            <p className="fd-line">It helps explain the patterns you&apos;ve probably been noticing your whole life.</p>

            <div className="fd-stack">
              <p className="fd-line">The way you handle conflict.</p>
              <p className="fd-line">The relationships you&apos;re drawn toward.</p>
              <p className="fd-line">The habits you repeat without realizing.</p>
              <p className="fd-line">The strengths you quietly underestimate.</p>
            </div>

            <p className="fd-line">
              That&apos;s why I spend just as much time thinking about human behavior as I do about astrology.
            </p>
            <p className="fd-line">Because people are always more than their zodiac sign.</p>
          </article>
        </section>

        {/* ── HONESTY ── */}
        <section className="fd-sec">
          <article className="fd-wrap">
            <h2 className="fd-h2">Why <em>honesty matters</em></h2>
            <p className="fd-lede">
              Honesty matters because pretending every placement is a gift doesn&apos;t help
              anyone actually understand themselves.
            </p>

            <p className="fd-line">
              One thing you&apos;ll notice around here is that I don&apos;t believe every placement is secretly a gift.
            </p>
            <p className="fd-line">Some parts of our personalities genuinely make life harder.</p>
            <p className="fd-line">Ignoring them doesn&apos;t make them disappear.</p>
            <p className="fd-line">
              But understanding them can help us work <em>with</em> them instead of against them.
            </p>
            <p className="fd-line">That&apos;s the kind of astrology I believe in.</p>

            <div className="fd-stack">
              <p className="fd-line">Honest.</p>
              <p className="fd-line">Practical.</p>
              <p className="fd-line" style={{ fontFamily: "var(--font-display),Georgia,serif", fontStyle: "italic", color: "#f0ece8", fontSize: "1.12rem" }}>
                Human.
              </p>
            </div>
          </article>
        </section>

        {/* ── AFFORDABLE ── */}
        <section className="fd-sec dk">
          <article className="fd-wrap">
            <h2 className="fd-h2">Why I&apos;ve kept BluntChart <em>affordable</em></h2>
            <p className="fd-lede">
              I keep BluntChart affordable because most people arrive here in the middle of
              something real — and cost shouldn&apos;t stand between them and a little clarity.
            </p>

            <p className="fd-line">Most people don&apos;t come to astrology just for fun.</p>
            <p className="fd-line">They usually arrive somewhere in the middle of something real.</p>

            <div className="fd-stack">
              <p className="fd-line">A relationship that&apos;s slowly confusing them.</p>
              <p className="fd-line">A decision they&apos;ve been sitting with for months.</p>
              <p className="fd-line">A season of life where nothing quite feels right, and they can&apos;t fully explain why.</p>
            </div>

            <p className="fd-line">I know that... because I&apos;ve been one of those people myself.</p>
            <p className="fd-line">
              Behind every birth chart is a real person, with real feelings and real questions they&apos;re trying to work through.
            </p>
            <p className="fd-line">And once you truly understand that, the pricing has to reflect it.</p>
            <p className="fd-line">That&apos;s why I&apos;ve always kept BluntChart affordable.</p>
            <p className="fd-line">
              When someone is genuinely trying to understand themselves, the last thing they need is a heavy price tag standing between them and a little clarity.
            </p>
            <p className="fd-line">This has never really been about charging what the market allows.</p>
            <p className="fd-line">It&apos;s about being genuinely useful to the person on the other side of the screen.</p>
            <p className="fd-line">
              If you leave BluntChart with even one honest insight about yourself, that&apos;s what I actually care about.
            </p>
            <p className="fd-line" style={{ fontFamily: "var(--font-display),Georgia,serif", fontStyle: "italic", color: "#f0ece8", fontSize: "1.12rem" }}>
              Not the transaction.
            </p>
          </article>
        </section>

        {/* ── THANK YOU ── */}
        <section className="fd-sec">
          <article className="fd-wrap">
            <h2 className="fd-h2">Thank you <em>for being here</em></h2>

            <p className="fd-line">
              Whether you&apos;re reading your very first birth chart or you&apos;ve been interested in astrology for years... I hope BluntChart helps you understand yourself a little more clearly.
            </p>
            <p className="fd-line">That&apos;s always been the goal.</p>
            <p className="fd-signoff">— Ishika</p>

            <div className="fd-links">
              <Link href="/about">
                <strong>About BluntChart</strong>
                <span>Why we built this, and how our readings work.</span>
              </Link>
              <Link href="/free-birth-chart">
                <strong>Free Birth Chart</strong>
                <span>Calculate your natal chart with Swiss Ephemeris precision.</span>
              </Link>
              <Link href="/free-birth-chart-readings">
                <strong>How Readings Work</strong>
                <span>What&apos;s inside a BluntChart birth chart reading.</span>
              </Link>
              <Link href="/zodiac-signs">
                <strong>Zodiac Signs Guide</strong>
                <span>Honest, jargon-free breakdowns of all twelve signs.</span>
              </Link>
            </div>
          </article>
        </section>

        {/* ── FAQ ── */}
        <section className="fd-sec dk" aria-labelledby="founder-faq-h2">
          <div className="fd-wrap" style={{ paddingBottom: 12 }}>
            <div className="fd-label"><span>Frequently Asked</span></div>
            <h2 id="founder-faq-h2" className="fd-h2">Questions about <em>the founder &amp; BluntChart</em></h2>
          </div>
          <div className="fd-faq">
            {FOUNDER_FAQS.map((f, i) => (
              <details key={i}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="fd-sec">
          <div className="fd-cta">
            <h2 className="fd-h2">Read your chart <em>the honest way</em></h2>
            <p>
              Two personalized insights, free. The full reading — with your natal chart wheel,
              eight more insights, and your shareable identity card — is a one-time $15.
            </p>
            <Link className="fd-bp" href="/#try-it">
              Get My Free Preview ✨
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
