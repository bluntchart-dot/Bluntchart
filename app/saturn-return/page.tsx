import type { Metadata } from "next";
import Link from "next/link";
import SaturnCalculator from "../saturn-return-calculator/SaturnCalculator";

export const metadata: Metadata = {
  title: "Saturn Return: What It Is, When It Hits & How to Survive It | BluntChart",
  description:
    "What is a Saturn Return? The complete guide: meaning, ages, exact dates by sign, what happens during it, and how to survive the life audit that hits between 27–30. Free calculator included.",
  keywords: [
    "saturn return","what is a saturn return","saturn return meaning","when is my saturn return",
    "saturn return age","saturn return in aries","saturn return in aries 2026","saturn return 2026",
    "how long does saturn return last","second saturn return","saturn return calculator",
    "saturn return crisis","saturn return relationships","saturn return career change",
    "saturn return breakup","what happens during saturn return","saturn return survival guide",
    "first saturn return","saturn return 27","saturn return 28","saturn return 29",
    "saturn return by sign","saturn return in pisces","saturn return in taurus",
    "saturn return in gemini","saturn return ages","when is saturn return",
  ],
  alternates: { canonical: "https://bluntchart.com/saturn-return" },
  openGraph: {
    title: "Saturn Return: The Complete Guide | BluntChart",
    description:
      "What a Saturn Return is, when yours hits, how long it lasts, and what it actually does — sign by sign. Free calculator + brutally honest breakdown.",
    url: "https://bluntchart.com/saturn-return",
    siteName: "BluntChart",
    type: "article",
    images: [{ url: "https://bluntchart.com/og-mercury-retrograde-2026.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saturn Return: The Complete Guide | BluntChart",
    description: "What a Saturn Return is, when yours hits, and how to survive it. Sign-by-sign breakdown + free calculator.",
    images: ["https://bluntchart.com/og-mercury-retrograde-2026.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ── JSON-LD ─────────────────────────────────────────────────────────────────── */

const jsonLdArticle = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Saturn Return: What It Is, When It Hits & How to Survive It",
  description: "The complete guide to Saturn Return — meaning, ages, dates by sign, and a brutally honest survival framework.",
  url: "https://bluntchart.com/saturn-return",
  image: "https://bluntchart.com/og-mercury-retrograde-2026.png",
  datePublished: "2026-09-13T00:00:00+00:00",
  dateModified: "2026-09-14T00:00:00+00:00",
  author: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
  publisher: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com", logo: { "@type": "ImageObject", url: "https://bluntchart.com/mascot.png" } },
  mainEntityOfPage: { "@type": "WebPage", "@id": "https://bluntchart.com/saturn-return" },
  about: {
    "@type": "Thing",
    name: "Saturn return",
    description: "An astrological transit occurring approximately every 29.5 years when Saturn returns to the zodiac position it occupied at the time of a person's birth, traditionally associated with major life transitions and restructuring between ages 27–30.",
  },
};

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "At what age is your Saturn Return?", acceptedAnswer: { "@type": "Answer", text: "Your first Saturn Return happens between ages 27 and 30. Saturn takes 29.5 years to orbit the Sun, so it returns to your birth position around age 29. The window typically opens at 27 as Saturn enters your natal sign and closes around 30 when it moves on. Your second return hits between 56 and 60, and a rare third return can occur around 85–88." } },
    { "@type": "Question", name: "What signs are most affected by Saturn Return in 2026?", acceptedAnswer: { "@type": "Answer", text: "Saturn is in Aries from February 2026 through April 2028. People born between April 1996 and June 1998 (with natal Saturn in Aries) are in their first Saturn Return right now. Those born March 1967 to April 1969 are experiencing their second. Saturn in Aries tests independence, identity, leadership, and whether you've been living on your own terms." } },
    { "@type": "Question", name: "Why is Saturn Return so difficult?", acceptedAnswer: { "@type": "Answer", text: "Saturn is the planet of structure, discipline, and consequence. When it returns to its natal position, it audits everything — career, relationships, identity, living situation. Whatever was built on someone else's expectations or avoidance rather than authentic choice gets tested, and what fails that test collapses. It feels like a crisis because it is one — a necessary demolition before honest reconstruction." } },
    { "@type": "Question", name: "How long does a Saturn Return last?", acceptedAnswer: { "@type": "Answer", text: "The broad window is 2–3 years, because Saturn spends roughly 2.5 years in each sign. The most intense period — when Saturn crosses the exact degree it held at your birth — lasts about 6–12 months within that window. Retrograde passes can extend the exact-degree transit to three separate hits over the course of a year." } },
    { "@type": "Question", name: "Does everyone have a Saturn Return?", acceptedAnswer: { "@type": "Answer", text: "Yes. Saturn Return is not a special placement — it's an astronomical event. Every person alive past age 27 has experienced or is experiencing their first Saturn Return. It's universal. What differs is the sign (which determines what's being tested) and the house placement in your natal chart (which determines which area of life gets hit)." } },
    { "@type": "Question", name: "Can you avoid your Saturn Return?", acceptedAnswer: { "@type": "Answer", text: "No. Saturn orbits whether you track it or not. People who 'skipped' their Saturn Return usually had structures that held — they'd already done the work. The transit still happened; there was just less to demolish. The people who feel it hardest are the ones with the largest gap between the life they built and the life that's actually theirs." } },
    { "@type": "Question", name: "Does Saturn Return affect relationships?", acceptedAnswer: { "@type": "Answer", text: "Almost always. Relationships built on genuine connection and honest communication tend to deepen during Saturn Return. Relationships maintained by habit, fear, codependence, or avoiding difficult conversations tend to end. Saturn doesn't destroy good relationships — it reveals which ones were never as solid as you thought." } },
    { "@type": "Question", name: "Do I need my birth time for Saturn Return?", acceptedAnswer: { "@type": "Answer", text: "Not for the sign — Saturn's sign is determined by birth date alone, and that's what this guide and the calculator use. But to know which house Saturn occupies (which life area gets hit hardest), you need your exact birth time. A full birth chart reading maps both." } },
  ],
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
    { "@type": "ListItem", position: 2, name: "Saturn Return Guide", item: "https://bluntchart.com/saturn-return" },
  ],
};

/* ── SIGN DATA ───────────────────────────────────────────────────────────────── */

const SIGNS: { sign: string; symbol: string; theme: string; dates1st: string; dates2nd: string; tests: string }[] = [
  { sign: "Aries", symbol: "♈", theme: "Identity & independence", dates1st: "Apr 1996 – Jun 1998", dates2nd: "Mar 1967 – Apr 1969", tests: "Whether you've been living on your own terms or performing someone else's version of strength. Saturn in Aries strips away borrowed courage and demands the real thing — your own direction, your own fight, your own identity." },
  { sign: "Taurus", symbol: "♉", theme: "Security & self-worth", dates1st: "Jun 1998 – Apr 2001", dates2nd: "Apr 1969 – Jun 1971", tests: "Whether your sense of security is rooted in something real or in comfort you're afraid to lose. Saturn in Taurus tests your relationship with money, possessions, and whether what you own actually sustains you." },
  { sign: "Gemini", symbol: "♊", theme: "Communication & honesty", dates1st: "Apr 2001 – Jun 2003", dates2nd: "Jun 1971 – Aug 1973", tests: "Whether you say what you mean or perform cleverness to avoid being pinned down. Saturn in Gemini demands intellectual integrity — stop hedging, stop people-pleasing with your words, commit to a position." },
  { sign: "Cancer", symbol: "♋", theme: "Home & emotional foundations", dates1st: "Jun 2003 – Jul 2005", dates2nd: "Aug 1973 – Jan 1976", tests: "Whether your emotional foundations are solid or whether you've been confusing caretaking with control. Saturn in Cancer restructures family dynamics, living situations, and your relationship with vulnerability." },
  { sign: "Leo", symbol: "♌", theme: "Creative authority & ego", dates1st: "Jul 2005 – Sep 2007", dates2nd: "Jan 1976 – Jan 1978", tests: "Whether your need for recognition serves your actual work or whether you've been performing for validation. Saturn in Leo tests whether your creative expression and leadership are authentic or a bid for applause." },
  { sign: "Virgo", symbol: "♍", theme: "Service & self-improvement", dates1st: "Sep 2007 – Oct 2009", dates2nd: "Jan 1978 – Sep 1980", tests: "Whether your perfectionism is productive or self-punishing. Saturn in Virgo tests your relationship with work, health, daily routines, and whether your standards are in service of growth or avoidance of good enough." },
  { sign: "Libra", symbol: "♎", theme: "Relationships & fairness", dates1st: "Oct 2009 – Oct 2012", dates2nd: "Sep 1980 – May 1983", tests: "Whether your partnerships are balanced or whether you've been sacrificing yourself to keep the peace. Saturn in Libra tests every relationship where you traded honesty for harmony." },
  { sign: "Scorpio", symbol: "♏", theme: "Power & transformation", dates1st: "Oct 2012 – Dec 2014", dates2nd: "May 1983 – Nov 1985", tests: "Whether you control or are controlled. Saturn in Scorpio tests power dynamics, intimacy, shared resources, and the emotional patterns you've never examined because looking was too terrifying." },
  { sign: "Sagittarius", symbol: "♐", theme: "Belief systems & freedom", dates1st: "Dec 2014 – Dec 2017", dates2nd: "Nov 1985 – Feb 1988", tests: "Whether your worldview is genuinely yours or borrowed from whichever authority felt safest. Saturn in Sagittarius tests faith, education, travel, and whether your philosophy of life can withstand real pressure." },
  { sign: "Capricorn", symbol: "♑", theme: "Ambition & authority", dates1st: "Dec 2017 – Dec 2020", dates2nd: "Feb 1988 – Feb 1991", tests: "Whether the structures you've built serve who you are or a version of success that was never yours. Saturn in Capricorn tests career, public image, ambition, and whether you've been climbing the right mountain." },
  { sign: "Aquarius", symbol: "♒", theme: "Community & individuality", dates1st: "Mar 2020 – Mar 2023", dates2nd: "Feb 1991 – May 1993", tests: "Whether you belong to your community or are hiding in it. Saturn in Aquarius tests group identity, social ideals, and whether your rebellion is authentic or performative." },
  { sign: "Pisces", symbol: "♓", theme: "Spirituality & surrender", dates1st: "Mar 2023 – Feb 2026", dates2nd: "May 1993 – Apr 1996", tests: "Whether your spiritual life and creative vision are grounded or escapist. Saturn in Pisces tests faith, addiction, boundaries, and the dissolution of identities that were never solid." },
];

/* ── FAQS (visible on page) ──────────────────────────────────────────────────── */

const FAQS = [
  { q: "At what age does your Saturn Return happen?", a: "Your first Saturn Return starts around age 27 and peaks near 29, when Saturn completes its 29.5-year orbit and returns to its natal position. The window is roughly 27–30. Your second return hits 56–60. A rare third return can occur at 85–88 — it's why some astrologers call that age 'the elder's crown.'" },
  { q: "Which signs are in their Saturn Return in 2026?", a: "Saturn entered Aries in February 2026 and stays until April 2028. If you were born between approximately April 1996 and June 1998 (natal Saturn in Aries), you're in your first return now. Those born March 1967 to April 1969 are in their second. Saturn in Pisces people (born 1993–1996) have just finished theirs." },
  { q: "Why does Saturn Return feel like everything is falling apart?", a: "Because Saturn's job is demolition before renovation. It tests the structures in your life — career, relationships, identity, living situation — and whatever was built on avoidance, obligation, or someone else's expectations fails the test. The collapse feels devastating in the moment. It looks like clearing space in hindsight." },
  { q: "How long does a Saturn Return last?", a: "The broad transit is 2–3 years (Saturn spends ~2.5 years per sign). The most intense window — when Saturn crosses the exact degree it held at your birth — is about 6–12 months. Retrograde motion can create three exact passes within that window, extending the peak intensity." },
  { q: "Can you prepare for your Saturn Return?", a: "Yes, but not by avoiding it. Preparation means auditing your own life honestly before Saturn does it for you. Where are you staying out of fear? Which structures would you dismantle if you weren't afraid of the fallout? Saturn rewards honesty and punishes avoidance. The people who fare best already started the work." },
  { q: "Does Saturn Return affect relationships?", a: "Almost always. Relationships built on genuine connection and honest communication tend to deepen during Saturn Return. Relationships maintained by habit, fear, codependence, or avoiding difficult conversations tend to end. Saturn doesn't destroy good relationships — it reveals which ones were never as solid as you thought." },
  { q: "What is a second Saturn Return?", a: "Your second Saturn Return occurs between ages 56–60 when Saturn completes its second full orbit. It's a renegotiation of authority, legacy, and purpose for the next phase. Where the first return asks 'is this life actually mine?', the second asks 'was the life I built worth it, and what do I want for the time that's left?'" },
  { q: "Do I need my birth time for Saturn Return?", a: "Not for the sign — Saturn's sign is determined by birth date alone, and that's what this guide and the calculator use. But to know which house Saturn occupies (which life area gets hit hardest), you need your exact birth time. A full birth chart reading maps both." },
];

/* ── PAGE COMPONENT ──────────────────────────────────────────────────────────── */

export default function SaturnReturnGuidePage() {
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
        .prose{font-size:1rem;color:rgba(232,228,240,0.78);line-height:1.82;max-width:780px}.prose p{margin-bottom:22px}.prose strong{color:var(--white);font-weight:600}.prose a{color:var(--gold);text-decoration:underline;text-decoration-color:rgba(240,184,74,.3)}.prose a:hover{text-decoration-color:var(--gold)}.prose h2{font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2rem);font-weight:800;line-height:1.15;margin:56px 0 18px;color:var(--white)}.prose h2 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.prose h3{font-family:var(--font-display);font-size:1.15rem;font-weight:700;margin:36px 0 10px;color:var(--white)}.prose ul,.prose ol{margin:0 0 22px 20px;color:rgba(232,228,240,0.78)}.prose li{margin-bottom:8px}
        .cta-box{background:linear-gradient(135deg,rgba(107,47,212,.12),rgba(212,83,126,.08));border:0.5px solid rgba(107,47,212,.25);border-radius:16px;padding:36px 32px;text-align:center;margin:48px 0;max-width:780px}.cta-box h3{font-family:var(--font-display);font-size:1.4rem;font-weight:800;margin:0 0 10px;color:var(--white)}.cta-box p{font-size:.93rem;color:var(--dim);line-height:1.65;margin:0 0 22px;max-width:520px;display:inline-block}.cta-btn{display:inline-block;padding:14px 32px;background:linear-gradient(135deg,var(--purple),var(--rose));color:#fff;font-weight:600;font-size:.95rem;border-radius:8px;text-decoration:none;transition:opacity .2s,transform .15s}.cta-btn:hover{opacity:.9;transform:translateY(-1px)}
        .sign-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:16px;margin:32px 0 48px;max-width:780px}.sign-card{background:var(--card);border:0.5px solid var(--border);border-radius:14px;padding:22px 20px;transition:border-color .2s}.sign-card:hover{border-color:rgba(107,47,212,.3)}.sign-hdr{display:flex;align-items:center;gap:10px;margin-bottom:10px}.sign-sym{font-size:1.5rem;width:40px;height:40px;display:flex;align-items:center;justify-content:center;border-radius:10px;background:rgba(107,47,212,.12);border:0.5px solid rgba(107,47,212,.2)}.sign-name{font-family:var(--font-display);font-weight:700;font-size:1.05rem}.sign-theme{font-size:.78rem;color:var(--gold);font-weight:600;letter-spacing:.03em;margin-bottom:8px}.sign-dates{font-size:.78rem;color:var(--dim);margin-bottom:8px;line-height:1.5}.sign-text{font-size:.87rem;color:rgba(232,228,240,.65);line-height:1.65}
        .toc{background:var(--card);border:0.5px solid var(--border);border-radius:14px;padding:24px 28px;margin:0 0 48px;max-width:780px}.toc h4{font-family:var(--font-display);font-weight:700;font-size:.9rem;margin:0 0 14px;color:var(--white)}.toc ol{margin:0;padding-left:20px;list-style:decimal}.toc li{margin-bottom:6px}.toc a{font-size:.88rem;color:var(--dim);text-decoration:none;transition:color .2s}.toc a:hover{color:var(--gold)}
        .related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;margin:32px 0 48px}.related-card{background:var(--card);border:0.5px solid var(--border);border-radius:12px;padding:18px 16px;text-decoration:none;transition:border-color .2s,transform .15s}.related-card:hover{border-color:rgba(107,47,212,.3);transform:translateY(-2px)}.related-card-title{font-family:var(--font-display);font-size:.95rem;font-weight:700;color:var(--white);margin-bottom:4px}.related-card-desc{font-size:.8rem;color:var(--dim);line-height:1.5}
        .timeline{max-width:780px;margin:24px 0 32px;position:relative;padding-left:28px}.timeline::before{content:'';position:absolute;left:8px;top:4px;bottom:4px;width:2px;background:linear-gradient(to bottom,var(--purple),var(--rose),var(--gold))}.tl-item{position:relative;margin-bottom:24px}.tl-dot{position:absolute;left:-24px;top:5px;width:12px;height:12px;border-radius:50%;background:var(--purple);border:2px solid var(--bg)}.tl-age{font-family:var(--font-display);font-weight:700;font-size:1rem;color:var(--white);margin-bottom:2px}.tl-desc{font-size:.89rem;color:rgba(232,228,240,.65);line-height:1.65}
        @media(max-width:768px){.nav-links{display:none}.sign-grid{grid-template-columns:1fr}.related-grid{grid-template-columns:1fr}.c{padding:0 16px}.cta-box{padding:28px 20px}}
      `}</style>

      {/* ── NAV ─────────────────────────────────────────────────────────────────── */}
      <nav className="nav">
        <div className="c nav-i">
          <Link className="logo" href="/">
            <img src="/mascot.png" alt="BluntChart" width={34} height={34} style={{ borderRadius: "50%" }} />
            <span className="g">BluntChart</span>
          </Link>
          <div className="nav-links">
            <Link href="/free-birth-chart">Free Chart</Link>
            <Link href="/saturn-return-calculator">Saturn Calculator</Link>
            <Link href="/#try-it">Get Reading</Link>
            <Link className="ncta" href="/in-depth-birth-chart">In-Depth Reading $24</Link>
          </div>
        </div>
      </nav>

      {/* ── BREADCRUMB ──────────────────────────────────────────────────────────── */}
      <div className="c">
        <nav className="breadcrumb" aria-label="Breadcrumb">
          <Link href="/">BluntChart</Link>
          <span style={{ margin: "0 8px", opacity: .4 }}>/</span>
          <span style={{ color: "var(--white)" }}>Saturn Return Guide</span>
        </nav>
      </div>

      {/* ── HERO ────────────────────────────────────────────────────────────────── */}
      <header className="hero">
        <div className="hero-bg" />
        <div className="c">
          <div className="eyebrow">♄ The Complete Saturn Return Guide</div>
          <h1>Saturn Return:<br /><em>The Life Audit You Can&apos;t Skip</em></h1>
          <p className="hero-sub">
            Between ages 27 and 30, Saturn returns to the exact position it held when you were born.
            Everything you&apos;ve built gets tested. What&apos;s real survives. What isn&apos;t, won&apos;t.
            This is the complete guide to understanding what&apos;s happening, when it hits your sign,
            and how to get through it without losing yourself.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" as const }}>
            <Link className="cta-btn" href="#calculator">Find Your Saturn Return Dates →</Link>
            <Link className="cta-btn-s" href="/in-depth-birth-chart" style={{ display: "inline-block", padding: "14px 28px", background: "transparent", border: "1px solid rgba(240,184,74,0.3)", color: "var(--gold)", fontWeight: 600, fontSize: ".95rem", borderRadius: 8, textDecoration: "none", transition: "all .2s" }}>Full Chart Reading — $24</Link>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────────── */}
      <main>
        <div className="c">

          {/* TABLE OF CONTENTS */}
          <nav className="toc">
            <h4>In This Guide</h4>
            <ol>
              <li><a href="#what-is">What is a Saturn Return?</a></li>
              <li><a href="#when">When is your Saturn Return? (Ages & timeline)</a></li>
              <li><a href="#2026">Who is in their Saturn Return in 2026?</a></li>
              <li><a href="#by-sign">Saturn Return by sign — all 12</a></li>
              <li><a href="#how-long">How long does it last?</a></li>
              <li><a href="#what-happens">What actually happens during Saturn Return</a></li>
              <li><a href="#second">The second Saturn Return (ages 56–60)</a></li>
              <li><a href="#survive">How to survive your Saturn Return</a></li>
              <li><a href="#calculator">Free Saturn Return calculator</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ol>
          </nav>

          {/* ── SECTION: WHAT IS ───────────────────────────────────────────────── */}
          <article className="prose">
            <h2 id="what-is">What is a Saturn Return — <em>and why does it matter?</em></h2>
            <p>A <strong>Saturn Return</strong> is the astrological transit that occurs when the planet Saturn completes its orbit and returns to the exact zodiac position it occupied at the moment of your birth. Saturn takes approximately 29.5 years to orbit the Sun, so your first Saturn Return hits between ages 27 and 30.</p>
            <p>In astrological tradition, Saturn is the planet of <strong>structure, discipline, accountability, and time</strong>. It rules the things you can&apos;t shortcut: the consequences of your choices, the integrity of your foundations, and the gap between who you pretend to be and who you actually are. When Saturn returns to its natal position, it audits all of it.</p>
            <p>This is why the late twenties are statistically associated with career changes, divorces, quarter-life crises, therapy intake forms, and the uncomfortable question <em>is this actually my life or did I just end up here?</em> Saturn doesn&apos;t care about your comfort. It cares about your integrity.</p>
            <p>The Saturn Return isn&apos;t punishment. It&apos;s renovation. What survives the audit is genuinely yours. What doesn&apos;t was never going to last. Saturn just accelerates the timeline.</p>

            {/* ── SECTION: WHEN ──────────────────────────────────────────────────── */}
            <h2 id="when">When is your Saturn Return? <em>Ages & timeline</em></h2>
            <p>Saturn&apos;s 29.5-year orbit creates a predictable life-stage pattern. Every person experiences the same sequence — the timing is universal, only the sign changes.</p>
          </article>

          <div className="timeline">
            <div className="tl-item"><div className="tl-dot" /><div className="tl-age">Ages 27–30: First Saturn Return</div><div className="tl-desc">The big one. The transition from inherited identity to chosen identity. Career upheavals, relationship reckonings, the end of &quot;figuring it out&quot; as a permanent life strategy. This is the return that TikTok won&apos;t stop talking about — and for good reason.</div></div>
            <div className="tl-item"><div className="tl-dot" style={{ background: "var(--rose)" }} /><div className="tl-age">Ages 56–60: Second Saturn Return</div><div className="tl-desc">The authority audit. After 30 years of building, Saturn asks whether the life you constructed was worth it — and what you want for the time that remains. Legacy, retirement, purpose beyond productivity.</div></div>
            <div className="tl-item"><div className="tl-dot" style={{ background: "var(--gold)" }} /><div className="tl-age">Ages 85–88: Third Saturn Return</div><div className="tl-desc">Rare, but real. The elder&apos;s crown. A review of an entire life&apos;s worth of Saturn lessons. Those who reach it have survived two full cycles of demolition and reconstruction.</div></div>
          </div>

          <article className="prose">
            <p>To find your <strong>exact Saturn Return dates</strong> based on your birth date, use the <Link href="/saturn-return-calculator">free Saturn Return calculator</Link>. It identifies your Saturn sign, your return windows, and what Saturn is testing in your case.</p>

            {/* ── SECTION: 2026 ──────────────────────────────────────────────────── */}
            <h2 id="2026">Who is in their Saturn Return <em>right now in 2026?</em></h2>
            <p><strong>Saturn entered Aries in February 2026</strong> and remains there until April 2028. This means:</p>
            <ul>
              <li><strong>First Saturn Return (ages 27–30):</strong> Everyone born between approximately <strong>April 1996 and June 1998</strong> — with natal Saturn in Aries. If your life has recently felt like it&apos;s being dismantled and reassembled without your permission, now you know why.</li>
              <li><strong>Second Saturn Return (ages 56–60):</strong> Those born between <strong>March 1967 and April 1969</strong> are in their second return — a mid-life review of leadership, independence, and whether the authority they&apos;ve built serves who they actually are.</li>
            </ul>
            <p><strong>Saturn in Aries</strong> tests identity, independence, courage, and initiative. It asks: are you leading your own life, or following someone else&apos;s script? Are you acting from genuine conviction, or performing strength to avoid looking weak? Aries demands authenticity of action — and Saturn demands proof.</p>
            <p>Meanwhile, those born 1993–1996 (Saturn in Pisces) have just completed their first return. If you survived a spiritual crisis, an addiction reckoning, or a fundamental dissolution of your old identity between 2023 and early 2026, that was Saturn in Pisces. You made it through. Now build on what&apos;s left.</p>

            {/* ── SECTION: BY SIGN ──────────────────────────────────────────────── */}
            <h2 id="by-sign">Saturn Return by sign: <em>what each one tests</em></h2>
            <p>Your <strong>Saturn sign</strong> determines the theme of your return — what area of life gets audited. The sign is set by your birth date (you don&apos;t need a birth time for this). Find your birth year range below, or use the <Link href="/saturn-return-calculator">calculator</Link> for exact dates.</p>
          </article>

          <div className="sign-grid">
            {SIGNS.map((s) => (
              <div className="sign-card" key={s.sign}>
                <div className="sign-hdr">
                  <div className="sign-sym">{s.symbol}</div>
                  <div className="sign-name">Saturn in {s.sign}</div>
                </div>
                <div className="sign-theme">{s.theme}</div>
                <div className="sign-dates">1st return births: {s.dates1st} · 2nd return births: {s.dates2nd}</div>
                <div className="sign-text">{s.tests}</div>
              </div>
            ))}
          </div>

          {/* CTA BOX — conversion to in-depth reading */}
          <div className="cta-box">
            <h3>Your Saturn sign is one data point. Your chart tells the full story.</h3>
            <p>Saturn&apos;s sign tells you <em>what</em> is being tested. But which house Saturn occupies determines <em>where</em> in your life it lands — career, love, family, identity. A full natal chart reading maps all of it: your Saturn house, aspects, and how this transit interacts with your Sun, Moon, and Rising.</p>
            <Link className="cta-btn" href="/in-depth-birth-chart">Get Your Full Birth Chart Reading →</Link>
            <div style={{ fontSize: ".78rem", color: "rgba(232,228,240,.35)", marginTop: 12 }}>8 chapters · ~49 pages · Delivered in under 10 minutes · $24</div>
          </div>

          <article className="prose">
            {/* ── SECTION: HOW LONG ─────────────────────────────────────────────── */}
            <h2 id="how-long">How long does a Saturn Return <em>actually last?</em></h2>
            <p>Saturn spends roughly <strong>2.5 years in each zodiac sign</strong>, so the broad return window is 2–3 years. But the intensity isn&apos;t uniform:</p>
            <ul>
              <li><strong>Pre-return (6–12 months before):</strong> Saturn enters your natal sign. Themes begin surfacing. Cracks appear in structures that aren&apos;t solid. You start questioning things you previously accepted.</li>
              <li><strong>Exact return (6–12 months):</strong> Saturn crosses the precise degree it held at your birth. This is the peak. Retrograde motion can create up to three exact passes — three waves of intensity within one year.</li>
              <li><strong>Integration (6–12 months after):</strong> Saturn moves past your natal degree. The demolition is over. You&apos;re rebuilding — often from a surprisingly clear foundation.</li>
            </ul>
            <p>Total duration: about 2.5 years from first rumblings to settled reconstruction. The part that feels like a crisis is usually the middle 12 months.</p>

            {/* ── SECTION: WHAT HAPPENS ─────────────────────────────────────────── */}
            <h2 id="what-happens">What actually happens <em>during Saturn Return</em></h2>
            <p>Saturn Return manifests differently depending on your sign and house placement, but certain patterns recur across nearly every case:</p>
            <h3>Career & ambition</h3>
            <p>The career you chose at 22 gets re-evaluated at 28. If it was chosen from genuine passion, it deepens. If it was chosen from parental expectation, financial fear, or &quot;I didn&apos;t know what else to do,&quot; it collapses — sometimes through burnout, sometimes through layoff, sometimes through the quiet realization that you dread Monday more than you enjoy Friday.</p>
            <h3>Relationships</h3>
            <p>Saturn Return is the leading astrological correlate of breakups and divorces in the late twenties. But it doesn&apos;t destroy good relationships — it reveals which relationships were held together by convenience, fear of being alone, or unexamined codependence. Partnerships built on honest communication and genuine compatibility tend to <em>strengthen</em> during this transit.</p>
            <h3>Identity & self-concept</h3>
            <p>Who you were at 22 is not who you are at 29. Saturn Return forces you to close the gap between your performed self and your actual self. The friend group, the aesthetic, the personality you assembled in college — if it&apos;s not genuinely you, it starts to feel suffocating.</p>
            <h3>Living situation</h3>
            <p>Moves are extremely common during Saturn Return. The city you landed in, the roommate situation you accepted, the apartment that was &quot;temporary&quot; four years ago — Saturn says it&apos;s time to live somewhere that reflects who you actually are, not who you were when you signed the lease.</p>

            {/* ── SECTION: SECOND RETURN ────────────────────────────────────────── */}
            <h2 id="second">The second Saturn Return <em>(ages 56–60)</em></h2>
            <p>The second Saturn Return is less discussed but equally powerful. Where the first return asks <em>is this life actually mine?</em>, the second asks <em>was the life I built worth it — and what do I want for the time that&apos;s left?</em></p>
            <p>Common themes of the second return:</p>
            <ul>
              <li><strong>Authority renegotiation:</strong> Retirement planning, career legacy, transitioning from building to mentoring.</li>
              <li><strong>Relationship deepening or release:</strong> Long marriages either recommit at a deeper level or face truths postponed for decades.</li>
              <li><strong>Health as structure:</strong> The body&apos;s structures demand the same honesty Saturn demands everywhere else. Deferred health patterns surface.</li>
              <li><strong>Legacy questions:</strong> What did I contribute? What will I leave? Was the sacrifice worth the outcome?</li>
            </ul>
            <p>The second return carries less existential panic than the first — you&apos;ve survived this before. But it can be equally transformative, especially for those who avoided the first return&apos;s lessons.</p>

            {/* ── SECTION: SURVIVE ──────────────────────────────────────────────── */}
            <h2 id="survive">How to survive <em>your Saturn Return</em></h2>
            <p>Saturn rewards honesty, discipline, and accountability. It punishes avoidance, shortcuts, and performance. With that framework:</p>
            <h3>1. Audit before Saturn does</h3>
            <p>Look at every major structure in your life — career, relationships, living situation, identity, health — and ask: <em>if I weren&apos;t afraid of the consequences, would I keep this?</em> Anything you answer &quot;no&quot; to is what Saturn will test first.</p>
            <h3>2. Stop performing</h3>
            <p>The version of yourself that exists for other people&apos;s comfort is the first thing Saturn dismantles. Start being honest about what you want, even when it&apos;s inconvenient. Especially when it&apos;s inconvenient.</p>
            <h3>3. Accept the timeline</h3>
            <p>Saturn Return lasts 2–3 years. You cannot rush it. The people who fare worst are the ones who try to bypass the process — jumping into a new relationship before finishing the old reckoning, or quitting a job without understanding why they chose it in the first place.</p>
            <h3>4. Build from what survives</h3>
            <p>The point of Saturn Return isn&apos;t destruction. It&apos;s clearing space. Whatever is still standing after the transit — the relationship that deepened, the career that refocused, the identity that simplified — is your foundation. Build on it.</p>
            <h3>5. Get your full chart read</h3>
            <p>Your Saturn sign tells you <em>what</em> gets tested. Your house placement tells you <em>where</em> in your life it lands. Your aspects tell you <em>how intense</em> it will be. A <Link href="/in-depth-birth-chart">full birth chart reading</Link> maps all three — 8 chapters covering your identity, career, relationships, growth edges, and current transits (including your Saturn Return). Delivered in under 10 minutes. No sugarcoating.</p>

            {/* ── SECTION: CALCULATOR ──────────────────────────────────────────── */}
            <h2 id="calculator">Free Saturn Return <em>calculator</em></h2>
            <p>Enter your birth date to find your Saturn sign, your exact return dates, and a no-nonsense interpretation of what Saturn is confronting you with — in the same brutally honest voice BluntChart is known for.</p>
          </article>

          <SaturnCalculator />

          {/* ── FAQ ───────────────────────────────────────────────────────────────── */}
          <article className="prose">
            <h2 id="faq">Saturn Return <em>FAQ</em></h2>
          </article>

          <div style={{ maxWidth: 780, marginBottom: 48 }}>
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

          {/* ── CONVERSION: IN-DEPTH READING ─────────────────────────────────────── */}
          <div className="cta-box" style={{ maxWidth: 780 }}>
            <div style={{ fontSize: ".68rem", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase" as const, color: "var(--gold)", marginBottom: 14 }}>The next step after Saturn Return</div>
            <h3>Your Saturn Return told you something is off. Your birth chart tells you exactly what.</h3>
            <p>This guide covers the universal pattern. A BluntChart reading covers <em>yours</em>. It maps your Saturn house placement, the aspects it makes to your other planets, and how this transit interacts with your entire natal chart. 8 chapters, ~49 pages, delivered in under 10 minutes.</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, margin: "20px auto 24px", maxWidth: 520, textAlign: "left" as const }}>
              <div style={{ fontSize: ".82rem", color: "rgba(232,228,240,.6)", lineHeight: 1.55 }}>✦ Saturn house &amp; aspects<br/>✦ Career &amp; money patterns<br/>✦ Relationship blueprint<br/>✦ Current transits (incl. Saturn)</div>
              <div style={{ fontSize: ".82rem", color: "rgba(232,228,240,.6)", lineHeight: 1.55 }}>✦ Identity &amp; purpose<br/>✦ Growth edges &amp; blind spots<br/>✦ Actionable takeaways<br/>✦ PDF + online book format</div>
            </div>
            <Link className="cta-btn" href="/in-depth-birth-chart">Get Your In-Depth Reading — $24 →</Link>
            <div style={{ fontSize: ".78rem", color: "rgba(232,228,240,.35)", marginTop: 12 }}>One-time payment · No subscription · Delivered instantly</div>
          </div>

          {/* ── RELATED TOOLS ─────────────────────────────────────────────────────── */}
          <article className="prose"><h2>Related <em>free tools & guides</em></h2></article>
          <div className="related-grid">
            <Link className="related-card" href="/in-depth-birth-chart" style={{ borderColor: "rgba(107,47,212,.25)", background: "linear-gradient(135deg,rgba(107,47,212,.08),rgba(212,83,126,.04))" }}><div className="related-card-title">In-Depth Birth Chart Reading</div><div className="related-card-desc">8 chapters, ~49 pages. Your Saturn house, aspects, transits, and full chart — $24.</div></Link>
            <Link className="related-card" href="/saturn-return-calculator"><div className="related-card-title">Saturn Return Calculator</div><div className="related-card-desc">Find your Saturn sign and exact return dates. Free, instant.</div></Link>
            <Link className="related-card" href="/free-birth-chart"><div className="related-card-title">Free Birth Chart</div><div className="related-card-desc">Full natal chart — see your Saturn house placement and aspects.</div></Link>
            <Link className="related-card" href="/rising-sign-calculator"><div className="related-card-title">Rising Sign Calculator</div><div className="related-card-desc">Your Ascendant determines which house Saturn occupies.</div></Link>
            <Link className="related-card" href="/big-three-calculator"><div className="related-card-title">Big Three Calculator</div><div className="related-card-desc">Sun, Moon, Rising — the three placements that define you.</div></Link>
            <Link className="related-card" href="/mercury-retrograde-2026"><div className="related-card-title">Mercury Retrograde 2026</div><div className="related-card-desc">All three retrograde windows, shadow periods, and sign effects.</div></Link>
            <Link className="related-card" href="/is-mercury-retrograde"><div className="related-card-title">Is Mercury Retrograde?</div><div className="related-card-desc">Live status checker with countdown timer.</div></Link>
          </div>

          <div style={{ fontSize: ".78rem", color: "rgba(232,228,240,.3)", textAlign: "center", marginTop: 48 }}>
            For entertainment purposes only · Not professional advice · Saturn sign dates are approximate due to retrograde motion
          </div>
        </div>
      </main>
    </>
  );
}
