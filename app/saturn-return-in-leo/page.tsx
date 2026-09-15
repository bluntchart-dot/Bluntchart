import type { Metadata } from "next";
import Link from "next/link";
import SaturnCalculator from "../saturn-return-calculator/SaturnCalculator";

export const metadata: Metadata = {
  title: "Saturn Return in Leo: Creative Authority, Ego & The Performance Test | BluntChart",
  description:
    "Saturn Return in Leo tests whether your confidence is earned or performed. Born 2005-2007? Your return is ahead. Complete meaning, dates, survival guide + free calculator.",
  keywords: [
    "saturn return in leo","saturn return in leo meaning","saturn return in leo 2034",
    "saturn in leo return","saturn in leo saturn return","second saturn return in leo",
    "saturn return in leo 7th house","saturn return in leo 10th house","saturn return in leo 4th house",
    "saturn return leo","saturn leo return dates","saturn return ego crisis",
    "saturn in leo transit","saturn return creativity","saturn return confidence",
    "when is saturn return in leo","how long saturn return leo",
  ],
  alternates: { canonical: "https://bluntchart.com/saturn-return-in-leo" },
  openGraph: {
    title: "Saturn Return in Leo: The Performance Test (2034-2036) | BluntChart",
    description: "Saturn in Leo tests whether your confidence is earned or performed. Born 2005-2007? Here's what's coming, when it peaks, and how to survive it.",
    url: "https://bluntchart.com/saturn-return-in-leo",
    siteName: "BluntChart",
    type: "article",
    images: [{ url: "https://bluntchart.com/og-mercury-retrograde-2026.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saturn Return in Leo: The Performance Test (2034-2036)",
    description: "Saturn in Leo tests creative authority, ego, and whether your confidence has substance. Full breakdown + free calculator.",
    images: ["https://bluntchart.com/og-mercury-retrograde-2026.png"],
  },
  robots: { index: true, follow: true },
};

const jsonLdArticle = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Saturn Return in Leo: Creative Authority, Ego & The Performance Test",
  description: "Complete guide to Saturn Return in Leo — what it means, when it hits, what it tests, and how to survive the ego reckoning that defines this transit.",
  url: "https://bluntchart.com/saturn-return-in-leo",
  image: "https://bluntchart.com/og-mercury-retrograde-2026.png",
  datePublished: "2026-09-15T00:00:00+00:00",
  dateModified: "2026-09-15T00:00:00+00:00",
  author: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
  publisher: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com", logo: { "@type": "ImageObject", url: "https://bluntchart.com/mascot.png" } },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://bluntchart.com/saturn-return-in-leo" },
  about: { "@type": "Thing", name: "Saturn return in Leo", description: "An astrological transit occurring when Saturn returns to Leo in a person's natal chart, testing creative authority, ego, confidence, and authentic self-expression. Next active from 2034 to 2036." },
};

const FAQS = [
  { q: "What does Saturn Return in Leo mean?", a: "Saturn Return in Leo means Saturn has completed its 29.5-year orbit and returned to the sign it occupied when you were born — Leo. This transit puts everything related to ego, creative authority, confidence, and self-expression under intense scrutiny. Leo is ruled by the Sun, the center of our solar system, and Saturn Return in Leo asks whether you've earned your place at the center of your own life — or whether you've been performing a role that looks impressive but feels hollow. The core question isn't whether you're talented or confident. It's whether that talent and confidence have substance behind them, or whether you've been coasting on charisma, approval, and applause." },
  { q: "When is Saturn Return in Leo? What are the exact dates?", a: "Saturn is projected to enter Leo around August 2034 and remain there until approximately October 2036. If you were born between July 2005 and September 2007, your first Saturn Return will fall within this window. Those born between January 1976 and January 1978 will experience their second Saturn Return in Leo during this period. The most intense phase is when Saturn crosses the exact degree it occupied at your birth — usually a 6-to-12-month peak within the broader transit. Retrograde motion can create up to three exact passes over your natal Saturn degree, extending the pressure." },
  { q: "How does the Sun's influence shape Saturn Return in Leo?", a: "Leo is the only sign ruled by the Sun — the source of light, warmth, and life in our solar system. The Sun governs identity, vitality, creative force, and the drive to be seen. When Saturn returns to Leo, it tests whether your relationship with being seen is healthy or addictive. Are you shining because you have something genuine to offer, or because being invisible terrifies you? Saturn under the Sun's domain asks you to examine whether your creative output, your leadership style, and your public persona are authentic expressions — or elaborate performances designed to earn love you don't believe you deserve on your own." },
  { q: "Does Saturn Return in Leo affect creativity?", a: "Profoundly. Leo is the sign of creative expression, and Saturn Return in Leo forces a confrontation between creative ambition and creative reality. If you've been dreaming about creative work but never committing to the discipline it requires, Saturn demands you either commit or stop pretending. If you've been producing work for validation rather than truth, the applause starts feeling empty. The positive side: Saturn Return in Leo is one of the most powerful transits for creative maturation. Artists, musicians, writers, and performers who survive this return often produce their most honest and enduring work — not because they became more talented, but because they stopped performing and started creating from genuine self-expression." },
  { q: "How does Saturn Return in Leo affect romance and relationships?", a: "Saturn in Leo tests romantic relationships through the lens of ego and admiration. Leo needs to be adored — that's not a flaw, it's the sign's emotional fuel. But Saturn asks whether your need for adoration has become a dependency. Relationships where one partner exists primarily to validate the other get exposed. Partnerships built on mutual admiration — where both people genuinely celebrate each other — tend to deepen. The romantic crisis often looks like this: realizing the person you've been performing for doesn't actually know you, or discovering that the love you've been receiving was for a character you play, not the person you are." },
  { q: "What's the difference between ego and confidence during this transit?", a: "This is Saturn in Leo's central exam. Confidence is quiet — it doesn't need external validation to exist. It comes from knowing what you're capable of because you've done the work. Ego is loud — it requires constant feeding, collapses when criticized, and measures itself against others rather than against its own potential. Saturn Return in Leo systematically strips away ego protections to test what's underneath. If you've built genuine competence and self-knowledge, what remains after Saturn is done is real confidence. If you've been substituting applause for self-worth, the silence that follows the stripping feels devastating — but it's the beginning of building something real." },
  { q: "Can Saturn Return in Leo affect leadership and career?", a: "Yes — directly. Leo is associated with leadership, authority, and the desire to be recognized for excellence. Saturn Return in Leo tests whether your leadership serves the people you lead or primarily serves your need to feel important. Career crises during this transit often involve being passed over for recognition you expected, losing a platform you took for granted, or realizing that the role you've been performing at work doesn't match your actual capabilities. The leaders who emerge stronger from Saturn in Leo are the ones who learn to lead from substance rather than charisma — who become the kind of authority that earns respect through competence, not personality." },
  { q: "How do I survive Saturn Return in Leo?", a: "Stop performing and start building. Saturn in Leo rewards authenticity and punishes pretense. Practical steps: (1) Identify where you've been seeking validation instead of doing the work — the applause you've been chasing is masking an insecurity Saturn will find, (2) Commit to a creative or professional project that scares you — one where the outcome depends on skill, not charm, (3) Practice receiving criticism without collapsing — your work is not your worth, (4) Examine your relationships for mutual admiration vs. one-sided worship, (5) Accept that being ordinary at something is not failure — it's the starting point of genuine mastery, (6) Get your full birth chart read to understand which house Saturn occupies and what specific life area is being restructured." },
];

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map(f => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
    { "@type": "ListItem", position: 2, name: "Saturn Return Guide", item: "https://bluntchart.com/saturn-return" },
    { "@type": "ListItem", position: 3, name: "Saturn Return in Leo", item: "https://bluntchart.com/saturn-return-in-leo" },
  ],
};

const OTHER_SIGNS = [
  { sign: "Aries", symbol: "♈", slug: "aries", theme: "Identity & independence" },
  { sign: "Taurus", symbol: "♉", slug: "taurus", theme: "Security & self-worth" },
  { sign: "Gemini", symbol: "♊", slug: "gemini", theme: "Communication & honesty" },
  { sign: "Cancer", symbol: "♋", slug: "cancer", theme: "Home & emotional foundations" },
  { sign: "Virgo", symbol: "♍", slug: "virgo", theme: "Service & self-improvement" },
  { sign: "Libra", symbol: "♎", slug: "libra", theme: "Relationships & fairness" },
  { sign: "Scorpio", symbol: "♏", slug: "scorpio", theme: "Power & transformation" },
  { sign: "Sagittarius", symbol: "♐", slug: "sagittarius", theme: "Belief systems & freedom" },
  { sign: "Capricorn", symbol: "♑", slug: "capricorn", theme: "Ambition & authority" },
  { sign: "Aquarius", symbol: "♒", slug: "aquarius", theme: "Community & individuality" },
  { sign: "Pisces", symbol: "♓", slug: "pisces", theme: "Spirituality & surrender" },
];

export default function SaturnReturnInLeoPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--font-display:'Playfair Display',Georgia,serif;--font-body:'DM Sans',system-ui,sans-serif;--bg:#09090f;--card:#12121e;--border:rgba(255,255,255,0.08);--white:#e8e4f0;--dim:rgba(232,228,240,0.55);--faint:rgba(232,228,240,0.08);--gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);--purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5}
        html{scroll-behavior:smooth}body{background:var(--bg);color:var(--white);font-family:var(--font-body);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .c{max-width:1200px;margin:0 auto;padding:0 32px}
        .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}.nav-i{display:flex;align-items:center;justify-content:space-between}.logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;letter-spacing:.02em;display:flex;align-items:center;gap:10px}.logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.nav-links{display:flex;align-items:center;gap:20px}.nav-links a{font-size:.82rem;font-weight:500;color:var(--dim);text-decoration:none;letter-spacing:.04em;text-transform:uppercase;transition:color .2s}.nav-links a:hover{color:var(--white)}.ncta{color:var(--gold)!important;border:1px solid var(--gold-dim);padding:6px 15px;border-radius:4px}.ncta:hover{background:var(--gold-dim)}
        .breadcrumb{padding:88px 0 0;font-size:.82rem;color:var(--dim)}.breadcrumb a{color:var(--dim);text-decoration:none}.breadcrumb a:hover{color:var(--gold)}
        .hero{padding:28px 0 48px;position:relative;overflow:hidden;text-align:center}.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(107,47,212,.08) 0%,transparent 50%);pointer-events:none}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:20px;padding:5px 14px;border:1px solid var(--gold-dim);border-radius:100px;background:rgba(240,184,74,.06)}
        h1{font-family:var(--font-display);font-size:clamp(2.2rem,5.5vw,3.8rem);font-weight:900;line-height:1.08;letter-spacing:-.02em;margin-bottom:18px}h1 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .hero-sub{font-size:1.05rem;color:var(--dim);max-width:660px;line-height:1.72;margin:0 auto 32px}
        .prose{font-size:1rem;color:rgba(232,228,240,0.78);line-height:1.82;max-width:820px;margin-left:auto;margin-right:auto}.prose p{margin-bottom:22px}.prose strong{color:var(--white);font-weight:600}.prose a{color:var(--gold);text-decoration:underline;text-decoration-color:rgba(240,184,74,.3)}.prose a:hover{text-decoration-color:var(--gold)}.prose h2{font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2rem);font-weight:800;line-height:1.15;margin:56px 0 18px;color:var(--white)}.prose h2 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.prose h3{font-family:var(--font-display);font-size:1.15rem;font-weight:700;margin:36px 0 10px;color:var(--white)}.prose ul,.prose ol{margin:0 0 22px 20px;color:rgba(232,228,240,0.78)}.prose li{margin-bottom:8px}
        .cta-box{background:linear-gradient(135deg,rgba(107,47,212,.12),rgba(212,83,126,.08));border:0.5px solid rgba(107,47,212,.25);border-radius:16px;padding:36px 32px;text-align:center;margin:48px auto;max-width:820px}.cta-box h3{font-family:var(--font-display);font-size:1.4rem;font-weight:800;margin:0 0 10px;color:var(--white)}.cta-box p{font-size:.93rem;color:var(--dim);line-height:1.65;margin:0 0 22px;max-width:520px;display:inline-block}.cta-btn{display:inline-block;padding:14px 32px;background:linear-gradient(135deg,var(--purple),var(--rose));color:#fff;font-weight:600;font-size:.95rem;border-radius:8px;text-decoration:none;transition:opacity .2s,transform .15s}.cta-btn:hover{opacity:.9;transform:translateY(-1px)}
        .sign-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px;margin:32px auto 48px;max-width:820px}.sign-card{background:var(--card);border:0.5px solid var(--border);border-radius:14px;padding:18px 16px;text-decoration:none;transition:border-color .2s,transform .15s;display:block}.sign-card:hover{border-color:rgba(107,47,212,.3);transform:translateY(-2px)}.sign-hdr{display:flex;align-items:center;gap:10px;margin-bottom:6px}.sign-sym{font-size:1.3rem;width:34px;height:34px;display:flex;align-items:center;justify-content:center;border-radius:8px;background:rgba(107,47,212,.12);border:0.5px solid rgba(107,47,212,.2)}.sign-name{font-family:var(--font-display);font-weight:700;font-size:.95rem;color:var(--white)}.sign-theme{font-size:.75rem;color:var(--gold);font-weight:600;letter-spacing:.03em}
        .toc{background:var(--card);border:0.5px solid var(--border);border-radius:14px;padding:24px 28px;margin:0 auto 48px;max-width:820px}.toc h4{font-family:var(--font-display);font-weight:700;font-size:.9rem;margin:0 0 14px;color:var(--white)}.toc ol{margin:0;padding-left:20px;list-style:decimal}.toc li{margin-bottom:6px}.toc a{font-size:.88rem;color:var(--dim);text-decoration:none;transition:color .2s}.toc a:hover{color:var(--gold)}
        .related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;margin:32px auto 48px;max-width:820px}.related-card{background:var(--card);border:0.5px solid var(--border);border-radius:12px;padding:18px 16px;text-decoration:none;transition:border-color .2s,transform .15s}.related-card:hover{border-color:rgba(107,47,212,.3);transform:translateY(-2px)}.related-card-title{font-family:var(--font-display);font-size:.95rem;font-weight:700;color:var(--white);margin-bottom:4px}.related-card-desc{font-size:.8rem;color:var(--dim);line-height:1.5}
        .info-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;margin:24px auto 32px;max-width:820px}.info-card{background:var(--card);border:0.5px solid var(--border);border-radius:12px;padding:20px 18px}.info-label{font-size:.72rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);margin-bottom:6px}.info-val{font-size:.92rem;color:rgba(232,228,240,.75);line-height:1.6}
        @media(max-width:768px){.nav-links{display:none}.sign-grid{grid-template-columns:1fr}.related-grid{grid-template-columns:1fr}.info-grid{grid-template-columns:1fr}.c{padding:0 16px}.cta-box{padding:28px 20px}}
      `}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="c nav-i">
          <Link className="logo" href="/">
            <img src="/mascot.png" alt="BluntChart" width={34} height={34} style={{ borderRadius: "50%" }} />
            <span className="g">BluntChart</span>
          </Link>
          <div className="nav-links">
            <Link href="/saturn-return">Saturn Return Guide</Link>
            <Link href="/saturn-return-calculator">Saturn Calculator</Link>
            <Link href="/free-birth-chart">Free Chart</Link>
            <Link className="ncta" href="/in-depth-birth-chart">In-Depth Reading $24</Link>
          </div>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="c">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">BluntChart</Link>
          <span style={{ margin: "0 8px", opacity: .4 }}>/</span>
          <Link href="/saturn-return">Saturn Return</Link>
          <span style={{ margin: "0 8px", opacity: .4 }}>/</span>
          <span style={{ color: "var(--white)" }}>Leo</span>
        </nav>
      </div>

      {/* HERO */}
      <header className="hero">
        <div className="hero-bg" />
        <div className="c">
          <div className="eyebrow">{"♌"} Saturn Return in Leo {"·"} 2034{"–"}2036</div>
          <h1>Saturn Return in Leo:<br /><em>The Performance Test You Can&apos;t Charm Your Way Through</em></h1>
          <p className="hero-sub">
            Saturn in Leo tests whether your confidence has substance or whether you&apos;ve been living on applause.
            Born between 2005 and 2007? Your return is ahead. Here&apos;s what Saturn will demand from your ego,
            your creativity, and your entire sense of self.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" as const }}>
            <Link className="cta-btn" href="#calculator">Calculate Your Exact Dates {"→"}</Link>
            <Link href="/in-depth-birth-chart" style={{ display: "inline-block", padding: "14px 28px", background: "transparent", border: "1px solid rgba(240,184,74,0.3)", color: "var(--gold)", fontWeight: 600, fontSize: ".95rem", borderRadius: 8, textDecoration: "none", transition: "all .2s" }}>Full Chart Reading {"—"} $24</Link>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main>
        <div className="c">

          {/* KEY INFO CARDS */}
          <div className="info-grid">
            <div className="info-card">
              <div className="info-label">Sign</div>
              <div className="info-val">{"♌"} Leo (Fixed Fire)</div>
            </div>
            <div className="info-card">
              <div className="info-label">Core Theme</div>
              <div className="info-val">Creative authority, ego, confidence, self-expression</div>
            </div>
            <div className="info-card">
              <div className="info-label">1st Return Births</div>
              <div className="info-val">July 2005 {"–"} September 2007 (ages 27{"–"}30)</div>
            </div>
            <div className="info-card">
              <div className="info-label">2nd Return Births</div>
              <div className="info-val">January 1976 {"–"} January 1978 (ages 56{"–"}60)</div>
            </div>
            <div className="info-card">
              <div className="info-label">Return Window</div>
              <div className="info-val">August 2034 {"–"} October 2036</div>
            </div>
            <div className="info-card">
              <div className="info-label">Ruling Planet</div>
              <div className="info-val">The Sun {"—"} identity, vitality, creative force</div>
            </div>
          </div>

          {/* TOC */}
          <nav className="toc">
            <h4>In This Guide</h4>
            <ol>
              <li><a href="#meaning">What Saturn Return in Leo means</a></li>
              <li><a href="#who">Who is affected (birth years & dates)</a></li>
              <li><a href="#tests">What Saturn in Leo actually tests</a></li>
              <li><a href="#lesson">The lesson Saturn is teaching you</a></li>
              <li><a href="#crisis">The crisis {"—"} what it looks like in real life</a></li>
              <li><a href="#relationships">How it affects relationships</a></li>
              <li><a href="#career">Career and creativity during Saturn in Leo</a></li>
              <li><a href="#survive">How to survive your Saturn Return in Leo</a></li>
              <li><a href="#second">The second Saturn Return in Leo</a></li>
              <li><a href="#calculator">Free Saturn Return calculator</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ol>
          </nav>

          {/* CONTENT */}
          <article className="prose">
            <h2 id="meaning">What Saturn Return in Leo <em>actually means</em></h2>
            <p>A <strong>Saturn Return in Leo</strong> happens when Saturn completes its 29.5-year orbit and returns to the sign of Leo {"—"} the sign it occupied the day you were born. If your natal Saturn sits in Leo, this transit is <em>your</em> reckoning with everything you&apos;ve built your confidence on, and it will test whether that foundation is stone or stage paint.</p>
            <p>Leo is the fifth sign of the zodiac {"—"} the sign of <strong>creative self-expression, personal authority, romance, and the ego</strong>. It&apos;s fixed fire: the sustained blaze that doesn&apos;t just ignite but demands to be witnessed. Leo is ruled by the Sun, the literal center of our solar system, and Leo energy carries that same gravitational pull. It wants to shine. It needs an audience. It creates with the expectation of recognition.</p>
            <p>Saturn, meanwhile, is the planet of <strong>accountability, structure, discipline, and limits</strong>. When Saturn returns to Leo, it creates a clash between the part of you that craves recognition and the part that demands you earn it. Saturn doesn&apos;t care about your charisma. It cares whether the confidence backing that charisma has been <strong>built through genuine effort or manufactured through performance</strong>.</p>
            <p>This is the transit that separates people who <em>are</em> exceptional from people who <em>need to be seen as</em> exceptional. If you&apos;ve spent your twenties building an identity around being special {"—"} the talented one, the leader, the creative force {"—"} Saturn in Leo is where that identity gets its structural inspection. And Saturn isn&apos;t interested in your highlight reel. It wants the raw footage.</p>

            <h2 id="who">Who is in their Saturn Return in Leo <em>right now?</em></h2>
            <p><strong>Saturn is projected to enter Leo around August 2034</strong> and remain there until approximately <strong>October 2036</strong>. Retrograde periods may create brief exits and re-entries into the preceding sign. This means two groups will experience their Saturn Return in Leo during this window:</p>
            <h3>First Saturn Return (ages 27{"–"}30)</h3>
            <p>If you were born between approximately <strong>July 2005 and September 2007</strong>, your natal Saturn is in Leo, and your first Saturn Return will activate within this window. This is the big audition {"—"} the one where Saturn decides whether the persona you constructed in your early twenties is a real person or a character. The version of yourself that collected compliments, curated an image, and measured your worth by how much attention you received is about to face the question it&apos;s been avoiding: <em>who are you when nobody is watching?</em></p>
            <h3>Second Saturn Return (ages 56{"–"}60)</h3>
            <p>If you were born between <strong>January 1976 and January 1978</strong>, you&apos;ll experience your second Saturn Return in Leo. Where the first return asked <em>is my confidence real?</em>, the second asks <em>did I create something that will outlast me?</em> This is a reckoning with legacy, creative fulfillment, and whether the recognition you accumulated over decades actually reflected work you&apos;re proud of {"—"} or just work that was applauded.</p>
            <p>Not sure if your Saturn is in Leo? Use the <a href="#calculator">free calculator below</a> {"—"} enter your birth date and it&apos;ll confirm your Saturn sign and exact return window.</p>

            <h2 id="tests">What Saturn in Leo <em>actually tests</em></h2>
            <p>Every Saturn Return has a central audit. In Leo, the audit is about <strong>ego, creative authority, and whether your confidence is earned or borrowed</strong>. Here&apos;s what that examination looks like in practice:</p>
            <h3>Earned confidence vs. performed confidence</h3>
            <p>Leo radiates confidence naturally {"—"} it&apos;s the sign&apos;s native language. But Saturn in Leo draws a brutal distinction between confidence that comes from genuine competence and confidence that comes from never being tested. If you&apos;ve been skating on charm, talent that was never refined through discipline, or the assumption that being naturally gifted is the same as being skilled, Saturn exposes the gap. <strong>Natural talent is a starting advantage. It is not a finished product.</strong> Saturn wants to see the work.</p>
            <h3>Creation vs. performance</h3>
            <p>There&apos;s a difference between creating something because it needs to exist and performing because you need to be seen. Saturn in Leo tests which one drives you. If your creative life has been oriented around audience reaction {"—"} likes, applause, recognition {"—"} rather than the integrity of the work itself, this transit pulls the audience away and asks: <em>do you still create when no one is watching?</em> The answer reveals everything.</p>
            <h3>Generosity vs. spectacle</h3>
            <p>Leo at its best is magnificently generous {"—"} warm, encouraging, genuinely invested in lifting others up. But Leo&apos;s shadow can turn generosity into a performance: the person who gives loudly so everyone sees how generous they are. Saturn in Leo asks whether your warmth is about the other person or about how being warm makes you look. This isn&apos;t a small distinction. It&apos;s the difference between being loved and being admired.</p>
            <h3>Leadership vs. spotlight-seeking</h3>
            <p>Leo gravitates toward positions of visibility and authority. Saturn asks: are you leading because you have something to offer, or because being in front feels safer than being in the crowd? Leaders who serve survive Saturn in Leo. People who need the title more than the responsibility find that the crown gets heavy when it&apos;s welded to your head.</p>
            <h3>Romance vs. worship</h3>
            <p>Leo loves grand romance {"—"} the sweep, the passion, the being adored. Saturn in Leo tests whether your romantic relationships are genuine partnerships or mutual admiration societies. Can you love someone who doesn&apos;t worship you? Can you be loved by someone who sees your flaws? Saturn doesn&apos;t destroy romance in Leo. It destroys the <strong>fantasy</strong> of romance and asks whether what remains is enough.</p>

            <h2 id="lesson">The lesson Saturn is <em>teaching you</em></h2>
            <p>Saturn in Leo is teaching you the difference between <strong>being seen and being known</strong>. The Sun illuminates everything, but light that only bounces off the surface doesn&apos;t warm anything. Saturn wants your light to come from depth, not from polish.</p>
            <p>Every time you chased validation instead of doing the work {"—"} the project you abandoned because it wasn&apos;t getting attention fast enough, the relationship where you needed to be adored more than you needed to be understood, the creative risk you didn&apos;t take because failure would dent the image {"—"} that&apos;s Saturn&apos;s curriculum. Not that wanting recognition is wrong. That <strong>needing it to function</strong> is a dependency, and dependencies make you fragile.</p>
            <p>The lesson isn&apos;t to stop shining. It&apos;s to shine from <em>substance</em>. Saturn wants you to become the kind of person whose confidence doesn&apos;t collapse when the audience leaves the room. Whose creative work matters because of what it says, not how loudly it was received. Whose leadership is remembered for what was built, not for how impressive it looked at the time.</p>
            <p>Real authority {"—"} the Leo word Saturn actually respects {"—"} comes from substance, not applause. Learning that distinction is the entire point of this return.</p>

            <h2 id="crisis">The crisis: <em>what it looks like in real life</em></h2>
            <p>Saturn Return in Leo typically manifests as an <strong>ego crisis</strong> {"—"} the moment when the persona you&apos;ve been projecting stops generating the response it used to. The applause gets quieter. The recognition dries up. And suddenly you&apos;re face-to-face with the question of whether you exist without it. Here&apos;s what that looks like in practice:</p>
            <h3>The creative reckoning</h3>
            <p>The creative project you&apos;ve been planning, performing, or half-pursuing reaches a crossroads. Either you commit to it fully {"—"} with the discipline, the vulnerability, and the risk of producing something genuinely yours {"—"} or you let it die. Saturn doesn&apos;t accept perpetual potential. The album you&apos;ve been &quot;working on&quot; for five years, the novel that exists only as an idea you mention at parties, the career pivot you talk about but never execute: Saturn in Leo says <em>do it or stop claiming it</em>.</p>
            <h3>The romantic crisis</h3>
            <p>Relationships where one partner exists primarily as an audience for the other get exposed. If you&apos;ve chosen partners who worship you rather than challenge you, Saturn strips away the worship and asks what&apos;s left. Conversely, if you&apos;ve been playing a role in your relationship {"—"} the charming one, the fun one, the impressive one {"—"} the mask becomes exhausting. The relationships that survive are the ones where both people know and accept the unperformed version of each other.</p>
            <h3>The validation withdrawal</h3>
            <p>Saturn in Leo often engineers scenarios where external validation disappears. You get overlooked for a promotion. Your social media following flatlines. A creative project is rejected or ignored. The mentor who always praised you stops calling. This isn&apos;t punishment {"—"} it&apos;s a controlled experiment. Saturn is removing the external source of confidence to find out whether you have an internal one. If you do, this period is uncomfortable but manageable. If you don&apos;t, it feels like an existential emergency {"—"} and <em>that feeling is the lesson</em>.</p>
            <h3>The authority confrontation</h3>
            <p>Leo often positions itself as an authority, and Saturn tests whether that authority is substantive. You might be challenged by someone younger, more qualified, or simply more honest. You might be asked to lead something genuinely difficult {"—"} not the kind of leadership that comes with a title and a round of applause, but the kind that requires sacrifice, unpopular decisions, and no recognition. Your response reveals whether you lead for service or for spectacle.</p>

            <h2 id="relationships">How Saturn Return in Leo <em>affects relationships</em></h2>
            <p>Saturn Return in Leo hits relationships through the lens of <strong>ego, admiration, and whether both people are allowed to shine</strong>. It&apos;s not testing whether the relationship is loving {"—"} it&apos;s testing whether the relationship has room for two complete people in it.</p>
            <p><strong>Relationships that survive:</strong> The ones built on mutual admiration where neither partner needs to dim themselves for the other to feel bright. Where both people can succeed without the other feeling threatened. Where love is expressed through genuine attention, not through grand gestures designed to impress. These partnerships often become more vibrant during Saturn in Leo because the pressure forces both people to show up as themselves rather than as the characters they&apos;ve been playing.</p>
            <p><strong>Relationships that don&apos;t:</strong> The ones where one person is the star and the other is the audience. Where love has been confused with admiration. Where one partner&apos;s ego requires constant feeding and the other has been quietly starving. Saturn in Leo doesn&apos;t break these relationships {"—"} it reveals that they were already broken. The audience member walks out, or the performer realizes they&apos;ve been on stage so long they&apos;ve forgotten how to be a person.</p>
            <p>If you&apos;re single during your Saturn Return in Leo, the test is: <em>can you tolerate being ordinary long enough to build something real?</em> Saturn in Leo often delays romantic connection until you can enter a relationship without needing it to complete your self-image. The goal isn&apos;t partnership as performance. It&apos;s partnership as foundation.</p>

            <h2 id="career">Career and creativity <em>during Saturn in Leo</em></h2>
            <p>Saturn in Leo reshapes your relationship with recognition and creative ambition. The career or creative path you chose in your early twenties {"—"} often based on what generated the most visibility, praise, or sense of specialness {"—"} gets a reality check.</p>
            <p>Common career patterns during Saturn Return in Leo:</p>
            <ul>
              <li><strong>The discipline reckoning:</strong> Talent without craft catches up with you. The thing you&apos;ve been good at &quot;naturally&quot; now requires real work to advance, and the people who were less talented but more disciplined start passing you. Saturn in Leo rewards the artist who practices, not the prodigy who coasts.</li>
              <li><strong>The visibility crisis:</strong> The platform, audience, or recognition you built in your twenties stalls or disappears. This forces a confrontation: were you in this for the work, or for the applause? The answer determines what you build next.</li>
              <li><strong>The creative commitment:</strong> Saturn demands you commit to one creative direction and do the unglamorous work of mastering it. No more dabbling. No more &quot;exploring options.&quot; Choose a thing. Get good at it. Accept that mastery requires years, not moments.</li>
              <li><strong>The humility project:</strong> Being asked to do work that offers no recognition {"—"} supporting someone else&apos;s project, contributing without credit, building infrastructure nobody will see. Saturn in Leo teaches that the work matters more than who gets the standing ovation.</li>
            </ul>
            <p>The through-line: Saturn in Leo doesn&apos;t want you to stop being creative or ambitious. It wants you to be ambitious about <em>the work</em>, not the reception. The artist who creates for truth survives this return. The performer who creates for applause has a harder road.</p>
          </article>

          {/* MID-PAGE CTA */}
          <div className="cta-box">
            <h3>Your Saturn sign tells you what&apos;s being tested. Your chart tells you where.</h3>
            <p>Saturn in Leo tests ego and creative authority {"—"} but which life area gets hit hardest depends on which <em>house</em> Saturn occupies in your natal chart. Career? Relationships? Family? A full birth chart reading maps all of it.</p>
            <Link className="cta-btn" href="/in-depth-birth-chart">Get Your Full Birth Chart Reading {"→"}</Link>
            <div style={{ fontSize: ".78rem", color: "rgba(232,228,240,.35)", marginTop: 12 }}>8 chapters {"·"} ~49 pages {"·"} Delivered in under 10 minutes {"·"} $24</div>
          </div>

          <article className="prose">
            <h2 id="survive">How to survive <em>Saturn Return in Leo</em></h2>
            <p>Saturn rewards substance and punishes pretense {"—"} in every sign. But in Leo, it specifically rewards <strong>authentic self-expression</strong> and punishes <strong>performance as a substitute for identity</strong>. Here&apos;s a practical framework:</p>

            <h3>1. Detach your worth from the response</h3>
            <p>The Leo instinct is to measure success by applause. During your Saturn Return, that metric becomes unreliable {"—"} sometimes the best work gets the least recognition, and the work that gets praised is the work you know is shallow. Practice creating, leading, and contributing without checking the scoreboard. The discomfort of unrecognized effort is Saturn&apos;s stress test for genuine motivation.</p>

            <h3>2. Commit to craft over talent</h3>
            <p>If you&apos;ve been relying on natural ability, Saturn in Leo is where that strategy expires. Talent gets you in the door. Discipline builds the house. Start the apprenticeship you&apos;ve been avoiding {"—"} the boring, repetitive, unglamorous work of getting genuinely good at something instead of being naturally decent at everything. Mastery requires the part of the process that nobody sees and nobody applauds.</p>

            <h3>3. Learn to celebrate others without performing generosity</h3>
            <p>One of Leo&apos;s deepest lessons is learning to shine light on others without expecting that light to bounce back. During your Saturn Return, practice genuine, quiet support. Encourage someone without posting about it. Help without being seen helping. This isn&apos;t about becoming invisible {"—"} it&apos;s about discovering that your warmth is real even when no one is keeping score.</p>

            <h3>4. Sit with being ordinary</h3>
            <p>This is the hardest one for Leo. Saturn will engineer moments where you feel average, unremarkable, indistinguishable from the crowd. The panic this creates reveals how much of your identity is built on being special. And here&apos;s the paradox: <strong>the willingness to be ordinary is what eventually produces extraordinary work</strong>. It&apos;s the removal of the pressure to perform that frees you to create.</p>

            <h3>5. Rebuild confidence from the inside</h3>
            <p>External validation is a renewable resource with an expiration date. Internal validation {"—"} knowing what you&apos;re capable of because you&apos;ve tested it against reality {"—"} compounds over time. Saturn in Leo is asking you to switch power sources. Keep a private record of genuine accomplishments. Set goals that matter to you regardless of whether anyone else notices. Build the kind of confidence that doesn&apos;t need an audience to exist.</p>

            <h3>6. Get your full chart read</h3>
            <p>Your Saturn sign tells you <em>what</em> gets tested. Your house placement tells you <em>where</em>. Your aspects tell you <em>how intense</em>. A <Link href="/in-depth-birth-chart">full birth chart reading</Link> maps all three {"—"} 8 chapters covering identity, career, relationships, growth edges, and current transits including your Saturn Return. Delivered in under 10 minutes. No sugarcoating.</p>

            <h2 id="second">The second Saturn Return in Leo <em>(ages 56{"–"}60)</em></h2>
            <p>If you were born between January 1976 and January 1978, your <strong>second Saturn Return in Leo</strong> will arrive around 2034{"–"}2036. The second return carries different weight than the first.</p>
            <p>Where the first return asks <em>is my confidence real?</em>, the second asks <em>what did I create that was worth creating?</em> Did you use your creative gifts in service of something meaningful, or did you spend three decades chasing the next round of applause? Did the recognition you accumulated reflect your best work, or your most palatable work? Did you lead with integrity, or did you lead with personality?</p>
            <p>The second Saturn Return in Leo often triggers:</p>
            <ul>
              <li><strong>Legacy audit:</strong> Looking back at your body of work {"—"} creative, professional, personal {"—"} and assessing whether it reflects genuine self-expression or a lifetime of performing what was expected. This can be deeply satisfying or deeply unsettling, depending on the gap.</li>
              <li><strong>Creative renaissance:</strong> Many people experience a surge of creative honesty during the second Leo return. The need to impress fades with age, and what replaces it is often the most authentic creative output of their lives. The novel that tells the truth. The project that serves the work rather than the resume.</li>
              <li><strong>Generational passing:</strong> Moving from being the center of a creative or professional community to mentoring the next generation. Saturn asks whether you can pass the spotlight willingly, or whether relevance is the last form of validation you&apos;re clinging to.</li>
              <li><strong>Ego integration:</strong> For those who never resolved the first return&apos;s ego crisis, the second return is a second chance. The ego doesn&apos;t need to be destroyed {"—"} it needs to be right-sized. A healthy ego knows its value without needing to announce it. An unhealthy one at 58 looks the same as it did at 28, just more desperate.</li>
            </ul>
            <p>The second return is less shocking than the first {"—"} you&apos;ve been here before. But it can be equally transformative, especially if the creative risks you avoided at 29 have been quietly accumulating interest.</p>

            <h2 id="calculator">Calculate your Saturn Return <em>dates</em></h2>
            <p>Enter your birth date below to confirm your Saturn sign and find your exact return windows. The calculator identifies when Saturn entered and leaves your natal sign, so you know precisely when the pressure is highest.</p>
          </article>

          <SaturnCalculator />

          {/* FAQ */}
          <article className="prose">
            <h2 id="faq">Saturn Return in Leo: <em>FAQ</em></h2>
          </article>

          <div style={{ maxWidth: 820, margin: "0 auto 48px" }}>
            {FAQS.map((f, i) => (
              <details key={i} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
                <summary style={{ padding: "22px 0", cursor: "pointer", listStyle: "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, fontSize: ".97rem", fontWeight: 600, color: "#e8e4f0", lineHeight: 1.45 }}>
                  <span style={{ flex: 1 }}>{f.q}</span>
                  <span style={{ width: 26, height: 26, borderRadius: "50%", border: "0.5px solid rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, color: "#6b2fd4", fontWeight: 700 }}>+</span>
                </summary>
                <p style={{ fontSize: ".89rem", color: "rgba(232,228,240,.65)", lineHeight: 1.78, paddingBottom: 22, paddingRight: 40 }}>{f.a}</p>
              </details>
            ))}
          </div>

          {/* FINAL CTA */}
          <div className="cta-box" style={{ maxWidth: 780 }}>
            <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" as const, color: "var(--gold)", marginBottom: 14 }}>Go deeper than your Saturn sign</div>
            <h3>Saturn in Leo tells you the theme. Your birth chart tells you the full story.</h3>
            <p>This guide covers the Leo pattern. A BluntChart reading covers <em>yours</em> {"—"} your Saturn house, aspects, and how this transit interacts with your entire natal chart.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, margin: "20px auto 24px", maxWidth: 520, textAlign: "left" as const }}>
              <div style={{ fontSize: ".82rem", color: "rgba(232,228,240,.6)", lineHeight: 1.55 }}>{"✦"} Saturn house &amp; aspects<br/>{"✦"} Career &amp; money patterns<br/>{"✦"} Relationship blueprint<br/>{"✦"} Current transits (incl. Saturn)</div>
              <div style={{ fontSize: ".82rem", color: "rgba(232,228,240,.6)", lineHeight: 1.55 }}>{"✦"} Identity &amp; purpose<br/>{"✦"} Growth edges &amp; blind spots<br/>{"✦"} Actionable takeaways<br/>{"✦"} PDF + online book format</div>
            </div>
            <Link className="cta-btn" href="/in-depth-birth-chart">Get Your In-Depth Reading {"—"} $24 {"→"}</Link>
            <div style={{ fontSize: ".78rem", color: "rgba(232,228,240,.35)", marginTop: 12 }}>One-time payment {"·"} No subscription {"·"} Delivered instantly</div>
          </div>

          {/* OTHER SIGNS */}
          <article className="prose"><h2>Saturn Return in <em>other signs</em></h2><p>Each Saturn sign has its own theme and tests. Find your sign {"—"} or read about your friends&apos; and partners&apos;.</p></article>
          <div className="sign-grid">
            {OTHER_SIGNS.map((s) => (
              <Link className="sign-card" href={`/saturn-return-in-${s.slug}`} key={s.sign}>
                <div className="sign-hdr">
                  <div className="sign-sym">{s.symbol}</div>
                  <div className="sign-name">Saturn in {s.sign}</div>
                </div>
                <div className="sign-theme">{s.theme}</div>
              </Link>
            ))}
          </div>

          {/* RELATED */}
          <article className="prose"><h2>Related <em>free tools & guides</em></h2></article>
          <div className="related-grid">
            <Link className="related-card" href="/in-depth-birth-chart" style={{ borderColor: "rgba(107,47,212,.25)", background: "linear-gradient(135deg,rgba(107,47,212,.08),rgba(212,83,126,.04))" }}><div className="related-card-title">In-Depth Birth Chart Reading</div><div className="related-card-desc">8 chapters, ~49 pages. Your Saturn house, aspects, transits {"—"} $24.</div></Link>
            <Link className="related-card" href="/saturn-return"><div className="related-card-title">Saturn Return Guide</div><div className="related-card-desc">The complete guide: all 12 signs, timeline, survival framework.</div></Link>
            <Link className="related-card" href="/saturn-return-calculator"><div className="related-card-title">Saturn Return Calculator</div><div className="related-card-desc">Find your Saturn sign and exact return dates. Free, instant.</div></Link>
            <Link className="related-card" href="/free-birth-chart"><div className="related-card-title">Free Birth Chart</div><div className="related-card-desc">Full natal chart with Saturn house placement and aspects.</div></Link>
          </div>

          <div style={{ fontSize: ".78rem", color: "rgba(232,228,240,.3)", textAlign: "center", marginTop: 48 }}>
            For entertainment purposes only {"·"} Not professional advice {"·"} Saturn sign dates are approximate due to retrograde motion
          </div>
        </div>
      </main>
    </>
  );
}
