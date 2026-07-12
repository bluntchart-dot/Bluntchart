import type { Metadata } from "next";
import MercuryStatusHero from "./statushero";

// ─── SEO METADATA ──────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Is Mercury Retrograde Right Now? | 2026–2030 Dates & Status | BluntChart",
  description:
    "Check if Mercury is retrograde right now. Live status, countdown timer, all retrograde dates from 2026 to 2030 with shadow periods, and what it actually means for your natal chart.",
  keywords: [
    "is mercury retrograde",
    "is mercury retrograde right now",
    "is mercury in retrograde",
    "mercury retrograde today",
    "mercury retrograde status",
    "when is the next mercury retrograde",
    "mercury retrograde dates",
    "mercury retrograde 2026",
    "mercury retrograde 2027",
    "mercury retrograde 2028",
    "mercury retrograde calendar",
    "mercury retrograde countdown",
    "mercury retrograde shadow period",
    "mercury rx",
  ],
  alternates: {
    canonical: "https://bluntchart.com/is-mercury-retrograde",
  },
  openGraph: {
    title: "Is Mercury Retrograde Right Now? | Live Status & Countdown | BluntChart",
    description:
      "Live Mercury retrograde status checker with countdown timer. All retrograde dates 2026–2030, shadow periods, and what your natal chart says about how retrograde hits you.",
    url: "https://bluntchart.com/is-mercury-retrograde",
    siteName: "BluntChart",
    type: "website",
    images: [
      {
        url: "https://bluntchart.com/og-mercury-retrograde-2026.png",
        width: 1200,
        height: 630,
        alt: "Is Mercury Retrograde Right Now? — BluntChart Status Checker",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Is Mercury Retrograde Right Now? | BluntChart",
    description:
      "Live status, countdown, all dates 2026–2030, shadow periods. Check if Mercury is retrograde right now.",
    images: ["https://bluntchart.com/og-mercury-retrograde-2026.png"],
  },
  robots: { index: true, follow: true },
};

// ─── JSON-LD STRUCTURED DATA ───────────────────────────────────────────────────

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Is Mercury Retrograde Right Now?",
  description: "Live Mercury retrograde status checker with countdown timer and complete dates from 2026 to 2030.",
  url: "https://bluntchart.com/is-mercury-retrograde",
  isPartOf: { "@type": "WebSite", name: "BluntChart", url: "https://bluntchart.com" },
  about: {
    "@type": "Thing",
    name: "Mercury retrograde",
    description: "An astrological transit period when Mercury appears to move backward in the sky.",
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
      { "@type": "ListItem", position: 2, name: "Is Mercury Retrograde?", item: "https://bluntchart.com/is-mercury-retrograde" },
    ],
  },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is Mercury retrograde right now?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "This page shows the live status of Mercury — whether it's retrograde, in its shadow period, or moving direct. It updates automatically based on the current date. Mercury goes retrograde roughly three times per year for about three weeks each time.",
      },
    },
    {
      "@type": "Question",
      name: "When is the next Mercury retrograde?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The next Mercury retrograde depends on the current date. In 2026, the retrograde periods are February 26 – March 20 (Pisces), June 29 – July 23 (Cancer), and October 24 – November 13 (Scorpio). This page includes a live countdown to the next retrograde start date.",
      },
    },
    {
      "@type": "Question",
      name: "What is a Mercury retrograde shadow period?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The shadow period (also called retroshade) extends Mercury retrograde's influence by about two weeks on each side. The pre-shadow begins when Mercury crosses the degree where it will later station direct — retrograde themes start building. The post-shadow ends when Mercury passes the degree where it originally stationed retrograde — full clarity returns.",
      },
    },
    {
      "@type": "Question",
      name: "How often does Mercury go retrograde?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Mercury goes retrograde three to four times per year, for approximately three weeks each time (19–24 days). Mercury retrogrades more frequently than any other planet because of its short orbital period — it takes just 88 Earth days to orbit the Sun.",
      },
    },
    {
      "@type": "Question",
      name: "Does Mercury retrograde affect everyone the same way?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. How Mercury retrograde affects you depends on your full natal chart — specifically where the retrograde falls in your houses and which of your natal planets it aspects. About 19% of people were born during Mercury retrograde and may actually find these periods more comfortable than direct motion.",
      },
    },
    {
      "@type": "Question",
      name: "What should you avoid during Mercury retrograde?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Traditional astrological advice suggests avoiding signing major contracts, making large purchases, launching new projects, and sending important communications without double-checking them. These periods are better suited for activities starting with 're-': review, revise, reconnect, reconsider, and repair.",
      },
    },
  ],
};

// ─── FAQ DATA ──────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "What does it mean when Mercury is retrograde?",
    a: "Mercury retrograde is the period — roughly three weeks, three to four times a year — when Mercury appears to reverse direction in the sky as seen from Earth. It's an optical illusion caused by orbital speed differences, but in astrological tradition, these periods are associated with disruptions in communication, technology, travel, and contracts. Emails get misunderstood, flights get delayed, and ex-partners text you at 2am. It's also considered a powerful time for reflection, revision, and finishing unfinished business.",
  },
  {
    q: "What is the Mercury retrograde shadow period?",
    a: "The shadow period (also called retroshade) extends retrograde's influence by about two weeks on each side. The pre-shadow begins when Mercury first crosses the degree where it will later station direct — you start noticing retrograde themes building. The post-shadow ends when Mercury passes the degree where it originally stationed retrograde — full clarity returns. Many astrologers consider these periods nearly as significant as the retrograde itself. When you include shadows, roughly 24 weeks of 2026 are influenced by retrograde energy.",
  },
  {
    q: "How often does Mercury go retrograde?",
    a: "Mercury goes retrograde three to four times per year, for approximately 19 to 24 days each time. It retrogrades more often than any other planet because of its short orbit — just 88 Earth days around the Sun. In 2026, there are three retrogrades. In some years there are four.",
  },
  {
    q: "Does Mercury retrograde affect everyone the same way?",
    a: "No — and this is the part most retrograde guides skip. How retrograde affects you depends on your full natal chart. Where the retrograde falls in your houses, which natal planets it aspects, and whether you were born during retrograde yourself (about 19% of people were) all determine the impact. Someone with Mercury, Sun, or Moon in a water sign will feel the 2026 water-sign retrogrades far more intensely. A personalized birth chart reading shows exactly which life areas each retrograde activates for you.",
  },
  {
    q: "Can I still sign contracts during Mercury retrograde?",
    a: "Traditional astrological advice says avoid it. The reasoning: retrograde periods correlate with miscommunication, overlooked details, and changing circumstances. But life doesn't pause. If you must sign, read everything twice, expect potential revisions, and try to wait until after the post-shadow clears for the clearest judgment. Awareness is always more useful than avoidance.",
  },
  {
    q: "Is Mercury retrograde scientifically real?",
    a: "The apparent retrograde motion is real — Mercury genuinely appears to move backward across the sky from Earth's perspective due to orbital speed differences. The astrological interpretation of retrograde as influencing human behavior is not scientifically supported. BluntChart is clear about this: astrology is not science, but the psychological patterns it surfaces can be genuinely useful for self-reflection.",
  },
];

// ─── PAGE COMPONENT ────────────────────────────────────────────────────────────

export default function IsMercuryRetrogradePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --font-display:'Playfair Display',Georgia,serif;
          --font-body:'DM Sans',system-ui,sans-serif;
          --bg:#09090f;--card:#12121e;
          --border:rgba(255,255,255,0.08);--border2:rgba(255,255,255,0.12);
          --white:#e8e4f0;--dim:rgba(232,228,240,0.55);--faint:rgba(232,228,240,0.08);
          --gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);
          --purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--white);font-family:var(--font-body);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .c{max-width:1200px;margin:0 auto;padding:0 32px}

        /* NAV */
        .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
        .nav-i{display:flex;align-items:center;justify-content:space-between}
        .logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;letter-spacing:.02em;display:flex;align-items:center;gap:10px}
        .logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .nav-links{display:flex;align-items:center;gap:20px}
        .nav-links a{font-size:.82rem;font-weight:500;color:var(--dim);text-decoration:none;letter-spacing:.04em;text-transform:uppercase;transition:color .2s}
        .nav-links a:hover{color:var(--white)}
        .ncta{color:var(--gold)!important;border:1px solid var(--gold-dim);padding:6px 15px;border-radius:4px}
        .ncta:hover{background:var(--gold-dim)}

        /* BREADCRUMB */
        .breadcrumb{padding:88px 0 0;font-size:.82rem;color:var(--dim)}
        .breadcrumb a{color:var(--dim);text-decoration:none;transition:color .2s}
        .breadcrumb a:hover{color:var(--gold)}

        /* HERO */
        .status-hero{padding:36px 0 56px;position:relative;overflow:hidden}
        .status-hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(107,47,212,.06) 0%,transparent 50%);pointer-events:none}

        /* PROSE */
        .prose{font-size:1rem;color:rgba(232,228,240,0.78);line-height:1.82}
        .prose p{margin-bottom:22px}
        .prose strong{color:var(--white);font-weight:600}
        .prose a{color:var(--gold);text-decoration:underline;text-decoration-color:rgba(240,184,74,.3);transition:text-decoration-color .2s}.prose a.bp,.prose a.bs{color:#fff;text-decoration:none}
        .prose a:hover{text-decoration-color:var(--gold)}
        .prose h2{font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2rem);font-weight:800;line-height:1.15;letter-spacing:-.01em;margin:56px 0 18px;color:var(--white)}
        .prose h2 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}

        /* CTA */
        .cta-section{background:linear-gradient(165deg,rgba(107,47,212,.06),rgba(212,83,126,.04));border:1px solid rgba(107,47,212,.2);border-radius:20px;padding:48px 36px;text-align:center;margin:56px 0}
        .cta-section h2{font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2rem);font-weight:800;margin-bottom:14px;color:var(--white)}
        .cta-section h2 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .cta-section p{font-size:1rem;color:var(--dim);max-width:520px;margin:0 auto 28px;line-height:1.72}
        .bp{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;background:linear-gradient(135deg,#6b2fd4,#d4537e);color:#fff;font-family:inherit;font-size:.88rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;border:none;border-radius:10px;cursor:pointer;transition:opacity .2s,transform .15s}
        .bp:hover{opacity:.88;transform:translateY(-1px)}

        /* RELATED LINKS */
        .related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;margin:32px 0 48px}
        .related-card{background:var(--card);border:0.5px solid var(--border);border-radius:12px;padding:18px 16px;text-decoration:none;transition:border-color .2s,transform .15s}
        .related-card:hover{border-color:rgba(107,47,212,.3);transform:translateY(-2px)}
        .related-card-title{font-family:var(--font-display);font-size:.95rem;font-weight:700;color:var(--white);margin-bottom:4px}
        .related-card-desc{font-size:.8rem;color:var(--dim);line-height:1.5}

        /* FAQ */
        .faq-item{border-bottom:0.5px solid rgba(255,255,255,0.08)}
        .faq-q{width:100%;background:transparent;border:none;padding:22px 0;display:flex;align-items:center;justify-content:space-between;gap:16px;cursor:pointer;font-family:inherit;text-align:left}
        .faq-q span.qt{font-size:.97rem;font-weight:600;color:#e8e4f0;line-height:1.45;flex:1}
        .faq-q span.qi{width:26px;height:26px;border-radius:50%;border:0.5px solid rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:14px;color:#6b2fd4;font-weight:700;transition:all .2s}
        .faq-a{font-size:.89rem;color:rgba(232,228,240,.65);line-height:1.78;padding-bottom:22px;padding-right:40px}

        /* FOOTER */
        .footer{border-top:1px solid var(--border);padding:48px 0 30px;margin-top:64px}
        .fi{display:flex;align-items:flex-start;justify-content:space-between;gap:36px;flex-wrap:wrap;margin-bottom:36px}
        .fb p{font-size:.82rem;color:var(--dim);max-width:240px;line-height:1.6;margin-top:8px}
        .fl h4{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--dim);margin-bottom:14px}
        .fl ul{list-style:none;display:flex;flex-direction:column;gap:10px}
        .fl a{font-size:.83rem;color:rgba(232,228,240,.35);text-decoration:none;transition:color .2s}
        .fl a:hover{color:var(--white)}
        .slinks{display:flex;gap:10px;margin-top:14px}
        .sl2{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:0.5px solid var(--border);border-radius:8px;color:var(--dim);text-decoration:none;font-size:.82rem;font-weight:700;transition:all .2s}
        .sl2:hover{border-color:rgba(107,47,212,.4);color:var(--gold);background:rgba(107,47,212,.1)}
        .fb2{border-top:1px solid var(--border);padding-top:22px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
        .disc{font-size:.73rem;color:rgba(232,228,240,.25);max-width:520px;line-height:1.55}
        .copy{font-size:.73rem;color:rgba(232,228,240,.2)}
        .last-updated{font-size:.78rem;color:rgba(232,228,240,.3);margin-top:48px;text-align:center}

        @media(max-width:768px){.nav-links{display:none}.fi{flex-direction:column;gap:28px}.fb2{flex-direction:column;align-items:flex-start}.related-grid{grid-template-columns:1fr}.c{padding:0 16px}}
        @media(max-width:480px){.cta-section{padding:36px 20px}}
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="c nav-i">
          <a className="logo" href="/">
            <img src="/mascot.png" alt="BluntChart" width={34} height={34} style={{ borderRadius: "50%" }} />
            <span className="g">BluntChart</span>
          </a>
          <div className="nav-links">
            <a href="/#try-it">Get Reading</a>
            <a href="/free-birth-chart">Free Chart</a>
            <a href="/mercury-retrograde-2026">2026 Dates</a>
            <a className="ncta" href="/#try-it">Full Reading $15</a>
          </div>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="c">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <a href="/">BluntChart</a>
          <span style={{ margin: "0 8px", opacity: .4 }}>/</span>
          <span style={{ color: "var(--white)" }}>Is Mercury Retrograde?</span>
        </nav>
      </div>

      {/* STATUS HERO */}
      <section className="status-hero">
        <div className="status-hero-bg" />
        <div className="c">
          <MercuryStatusHero />
        </div>
      </section>

      {/* ARTICLE CONTENT */}
      <main>
        <div className="c">
          <article className="prose">
            <h2>What does Mercury retrograde <em>actually mean?</em></h2>
            <p>
              Mercury retrograde is the period — roughly three weeks, three to four times a year —
              when Mercury appears to reverse its direction across the sky as seen from Earth.
              It&apos;s an optical illusion caused by the difference in orbital speed between Earth
              and Mercury. The planet never actually moves backward. But in astrological tradition,
              these periods have been tracked for thousands of years as times when communication,
              technology, travel, and contracts tend to glitch, stall, or circle back to unfinished business.
            </p>
            <p>
              Mercury rules how you think, speak, negotiate, and process information.
              When it&apos;s retrograde, those functions slow down. Emails get misunderstood.
              Flights get delayed. Ex-partners text at 2am. Contracts need revising.
              These aren&apos;t cosmic punishments — they&apos;re invitations to pause, double-check,
              and finish what you started before rushing into new commitments.
            </p>

            <h2>How often does Mercury <em>go retrograde?</em></h2>
            <p>
              Mercury retrogrades three to four times per year, for approximately 19 to 24 days each time.
              It retrogrades more frequently than any other planet because its orbit is so short — just
              88 Earth days around the Sun. Each retrograde moves through specific zodiac signs, which
              shapes the themes and life areas most affected. In 2026, all three retrogrades occur in
              water signs (Pisces, Cancer, Scorpio) — creating a year focused on emotional processing
              and confronting hidden feelings. For a detailed breakdown of all three{" "}
              <a href="/mercury-retrograde-2026">2026 Mercury retrograde periods</a>, including
              sign-by-sign effects, see our full guide.
            </p>

            <h2>What is the Mercury retrograde <em>shadow period?</em></h2>
            <p>
              The shadow period (also called &ldquo;retroshade&rdquo;) extends retrograde&apos;s influence
              by about two weeks on each side. The <strong>pre-shadow</strong> begins when Mercury first
              crosses the degree where it will later station direct — retrograde themes start building,
              miscommunications begin, and you may notice the topics that will define the retrograde
              emerging in your life. The <strong>post-shadow</strong> ends when Mercury passes the degree
              where it originally stationed retrograde — full clarity returns and stalled projects start
              moving forward again.
            </p>
            <p>
              Many astrologers consider the shadow periods nearly as significant as the retrograde itself.
              When you include shadows, roughly 24 weeks of any given year are influenced by retrograde
              energy. The table above includes shadow dates for every retrograde through 2030.
            </p>

            <h2>Does Mercury retrograde affect <em>everyone the same way?</em></h2>
            <p>
              No — and this is the part most retrograde trackers skip. A generic &ldquo;Mercury is
              retrograde&rdquo; status tells you the weather. Your{" "}
              <a href="/free-birth-chart">natal chart</a> tells you which rooms in your house the
              storm hits.
            </p>
            <p>
              How retrograde affects you depends on where the retrograde falls in your houses, which
              natal planets it aspects, and whether you were born during a retrograde yourself (about
              19% of people were, and they often find retrograde periods <em>more</em> comfortable
              than direct ones). Someone with a Cancer Rising will experience the June 2026
              retrograde in their 1st house — identity and self-expression. Someone with a Capricorn
              Rising will experience it in their 7th house — relationships and partnerships. Same
              retrograde, completely different experience.
            </p>

            {/* CTA */}
            <div className="cta-section">
              <h2>Find out how retrograde <em>actually hits your chart.</em></h2>
              <p>
                Generic retrograde advice gives everyone the same checklist. Your natal chart shows
                which houses are activated, which planets are aspected, and which life areas are
                under real pressure. That&apos;s what a BluntChart reading tells you — specific to
                your exact birth time and place.
              </p>
              <a className="bp" href="/#try-it">Get My Free Preview ✨</a>
              <div style={{ fontSize: ".78rem", color: "rgba(232,228,240,.35)", marginTop: 12 }}>
                Two free insights before you pay. $15 one-time for the full reading.
              </div>
            </div>

            <h2>What should you do — and avoid — during <em>Mercury retrograde?</em></h2>
            <p>
              Retrograde periods aren&apos;t inherently bad. They&apos;re review periods, best used
              for activities starting with &ldquo;re-&rdquo;: review, revise, reconnect, reconsider,
              repair. The problems come when you try to force new beginnings during a period designed
              for reflection. Worth doing: revisiting old projects, reconnecting with people you&apos;ve
              lost touch with, reviewing contracts and finances, journaling, backing up your devices.
              Worth avoiding if you can: signing major contracts, launching new products, making
              permanent decisions while emotions run high, and sending important messages without
              re-reading them first.
            </p>

            <h2>Explore more <em>free tools</em></h2>
            <p>
              Mercury&apos;s position is one piece of the puzzle. Here are the free tools to map the rest.
            </p>
          </article>

          <div className="related-grid">
            <a className="related-card" href="/mercury-retrograde-2026">
              <div className="related-card-title">Mercury Retrograde 2026</div>
              <div className="related-card-desc">All three 2026 dates, shadow periods, cazimis, and sign-by-sign effects.</div>
            </a>
            <a className="related-card" href="/free-birth-chart">
              <div className="related-card-title">Free Birth Chart</div>
              <div className="related-card-desc">Full natal chart with all planetary positions, houses, and aspects.</div>
            </a>
            <a className="related-card" href="/rising-sign-calculator">
              <div className="related-card-title">Rising Sign Calculator</div>
              <div className="related-card-desc">Your Ascendant determines which houses each retrograde activates.</div>
            </a>
            <a className="related-card" href="/moon-sign-calculator">
              <div className="related-card-title">Moon Sign Calculator</div>
              <div className="related-card-desc">Your emotional wiring — critical during water-sign retrogrades.</div>
            </a>
            <a className="related-card" href="/big-three-calculator">
              <div className="related-card-title">Big Three Calculator</div>
              <div className="related-card-desc">Sun, Moon, Rising — the three placements that define you.</div>
            </a>
            <a className="related-card" href="/zodiac-signs">
              <div className="related-card-title">Zodiac Signs Guide</div>
              <div className="related-card-desc">Deep dives into all 12 signs and what they mean in your chart.</div>
            </a>
          </div>

          {/* FAQ */}
          <section style={{ maxWidth: 780, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 22, height: 1, background: "var(--gold)" }} />
              <span style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase" as const, color: "var(--gold)" }}>
                Common questions
              </span>
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.5rem,3vw,2rem)", fontWeight: 800, lineHeight: 1.15, marginBottom: 24, color: "var(--white)" }}>
              Mercury retrograde <em style={{ fontStyle: "italic", background: "linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>FAQ</em>
            </h2>
            <FaqSection />
          </section>

          <div className="last-updated">
            Retrograde data covers 2026–2030 · Auto-updates daily · For entertainment purposes only
          </div>
        </div>
      </main>
</>
  );
}

// ─── FAQ (Client Component inline) ─────────────────────────────────────────────
// Needs to be a separate client component for toggle state

function FaqSection() {
  return (
    <FaqClient faqs={FAQS} />
  );
}

// We define FaqClient inline — it will be a client component imported separately
// For now, using a simple non-interactive FAQ (details/summary) for SSR compatibility:
function FaqClient({ faqs }: { faqs: typeof FAQS }) {
  return (
    <div>
      {faqs.map((f, i) => (
        <details key={i} className="faq-item" style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
          <summary style={{
            padding: "22px 0", cursor: "pointer", listStyle: "none",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
            fontSize: ".97rem", fontWeight: 600, color: "#e8e4f0", lineHeight: 1.45,
          }}>
            <span style={{ flex: 1 }}>{f.q}</span>
            <span style={{
              width: 26, height: 26, borderRadius: "50%", border: "0.5px solid rgba(255,255,255,.12)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              fontSize: 14, color: "#6b2fd4", fontWeight: 700,
            }}>+</span>
          </summary>
          <p style={{
            fontSize: ".89rem", color: "rgba(232,228,240,.65)",
            lineHeight: 1.78, paddingBottom: 22, paddingRight: 40,
          }}>{f.a}</p>
        </details>
      ))}
    </div>
  );
}