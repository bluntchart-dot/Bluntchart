"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Shared shell for the /*-alternative competitor pages.
 * Every section from the source HTML drafts, structured for reuse.
 *
 * All 5 subpages consume this shell and pass their unique data through props.
 * Editorial guardrails: honest credit-where-due block, "stay on X if..." fairness note.
 */

export type ComparisonRow = {
  feature: string;
  bluntchart: { text: string; kind?: "yes" | "no" | "lim" };
  competitor: { text: string; kind?: "yes" | "no" | "lim" };
};

export type FAQ = { q: string; a: string };
export type ReadingExcerpt = { placement: string; text: string };
export type TrustBadge = { icon: string; title: string; note: string };

export type AlternativePageData = {
  competitor: string;
  competitorSlug: string;
  competitorImage: string;   // /co-star.png etc
  competitorImageAlt: string;
  breadcrumb: string;
  h1: React.ReactNode;
  subtitle: string;
  trustRow: string[];           // small pill row under CTA
  answerBox: React.ReactNode;   // AEO short answer
  creditPros: string[];         // "what competitor gets right"
  creditCons: string[];         // "where it leaves you wanting"
  comparisonLede: string;
  comparison: ComparisonRow[];
  comparisonFootnote: string;
  differenceH2: React.ReactNode;
  differenceLede: string;
  sampleH2: React.ReactNode;
  sampleLede: string;
  sampleExcerpts: ReadingExcerpt[];
  sampleLocked: string;
  stayTitle: string;
  stayBody: React.ReactNode;
  faqs: FAQ[];
  founderBubbles: React.ReactNode[];
  trustBadges: TrustBadge[];
  ctaBandH2: React.ReactNode;
  ctaBandBody: string;
};

const FEATURES = [
  { ic: "♀", h: "Why you attract the same people", p: "Your Venus placement, 7th house and nodal axis spell out the exact pattern — and why you keep repeating it." },
  { ic: "♄", h: "Why you procrastinate when it matters", p: "Your chart shows the specific fear driving it. It's not laziness. It has never been laziness." },
  { ic: "↑", h: "What people assume instantly", p: "Your Rising sign is the mask you wear without knowing it. Most people never meet the real you." },
  { ic: "☽", h: "Your emotional triggers, mapped", p: "Moon sign, 4th house and Saturn tell us exactly where you're most raw — and why certain things hit harder." },
  { ic: "☉", h: "Where real confidence comes from", p: "Not the performed kind — the kind that holds. Your Sun and Mars show the difference." },
  { ic: "✦", h: "What your chart is screaming now", p: "Current transits to your natal placements. The tension you feel isn't random — it's your chart, on schedule." },
];

export function AlternativePageShell({ data }: { data: AlternativePageData }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const kindMark = (kind?: "yes" | "no" | "lim") =>
    kind === "yes" ? <span className="alt-yes">✓</span> :
    kind === "no" ? <span className="alt-no">✕</span> :
    kind === "lim" ? <span className="alt-lim">◐</span> : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--font-display:'Playfair Display',Georgia,serif;--font-body:'DM Sans',system-ui,sans-serif;--bg:#09090f;--card:#12121e;--raised:#171130;--border:rgba(255,255,255,0.08);--line:#2a2145;--white:#e8e4f0;--dim:rgba(232,228,240,0.55);--gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);--purple:#6b2fd4;--violet:#a78bfa;--violet-bright:#c9b8ff;--rose:#d4537e;--teal:#5dcaa5;--bad:#e06a7d;--good:#5fe3a1}
        html{scroll-behavior:smooth}body{background:var(--bg);color:var(--white);font-family:var(--font-body);-webkit-font-smoothing:antialiased;overflow-x:hidden;background-image:radial-gradient(900px 500px at 80% -8%,rgba(139,92,246,.16),transparent 60%),radial-gradient(700px 500px at 5% 8%,rgba(243,210,122,.05),transparent 55%);background-attachment:fixed}
        .alt-c{max-width:1280px;margin:0 auto;padding:0 40px}
        @media(max-width:768px){.alt-c{padding:0 20px}}
        .alt-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:16px 0;transition:all .3s}
        .alt-nav.on{background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
        .alt-logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:10px;color:var(--white)}
        .alt-logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .alt-nav-links{display:flex;align-items:center;gap:22px;font-size:14px;color:var(--dim)}
        .alt-nav-links a{color:var(--dim);text-decoration:none}
        .alt-nav-links a:hover{color:var(--white)}
        .alt-nav-cta{color:#fff !important;font-weight:600;padding:9px 16px;border-radius:999px;background:linear-gradient(135deg,var(--purple),var(--violet))}
        @media(max-width:768px){.alt-nav-links a:not(.alt-nav-cta){display:none}}
        .alt-crumb{font-size:12px;color:rgba(232,228,240,0.3);margin-bottom:20px}
        .alt-crumb a{color:rgba(232,228,240,0.3);text-decoration:none}
        .alt-crumb a:hover{color:var(--dim)}
        .alt-crumb .sep{margin:0 8px}
        .alt-crumb .here{color:rgba(232,228,240,0.5)}
        .alt-hero{padding-top:110px;padding-bottom:40px;text-align:center;position:relative}
        .alt-eyebrow{display:inline-flex;gap:8px;align-items:center;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--violet);font-weight:700;margin-bottom:22px}
        .alt-h1{font-family:var(--font-display);font-size:clamp(2.2rem,5.5vw,3.8rem);font-weight:800;line-height:1.06;letter-spacing:-0.02em;max-width:20ch;margin:0 auto 22px}
        .alt-h1 em{font-style:italic;background:linear-gradient(135deg,#c9b8ff,#f0b84a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .alt-sub{font-size:clamp(1.05rem,2vw,1.22rem);color:rgba(232,228,240,0.72);max-width:60ch;margin:0 auto 28px;line-height:1.65}
        .alt-cta-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;align-items:center;margin-bottom:22px}
        .alt-btn{display:inline-flex;align-items:center;gap:9px;font-weight:600;font-size:15px;padding:14px 26px;border-radius:999px;border:0;cursor:pointer;text-decoration:none;transition:transform .15s ease,box-shadow .2s ease}
        .alt-btn-primary{background:linear-gradient(135deg,var(--purple),var(--violet));color:#fff;box-shadow:0 10px 34px -10px rgba(139,92,246,.5)}
        .alt-btn-primary:hover{transform:translateY(-2px);box-shadow:0 16px 40px -10px rgba(139,92,246,.7)}
        .alt-btn-ghost{color:var(--dim);border:1px solid var(--border);background:transparent;padding:13px 22px}
        .alt-btn-ghost:hover{border-color:var(--violet);color:var(--white)}
        .alt-trust{margin-top:6px;font-size:13.5px;color:rgba(232,228,240,0.45);display:flex;gap:8px 18px;justify-content:center;flex-wrap:wrap}
        .alt-trust b{color:rgba(232,228,240,0.75);font-weight:600}
        .alt-sec{padding:52px 0}
        .alt-divider{display:flex;align-items:center;gap:16px;color:var(--purple);opacity:.6;margin-bottom:14px}
        .alt-divider::before,.alt-divider::after{content:"";height:1px;background:var(--border);flex:1}
        .alt-kicker{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--violet);font-weight:700;margin-bottom:12px}
        .alt-h2{font-family:var(--font-display);font-size:clamp(1.7rem,3.8vw,2.5rem);font-weight:800;line-height:1.12;letter-spacing:-0.01em;max-width:22ch;margin-bottom:16px}
        .alt-h2 em{font-style:italic;background:linear-gradient(135deg,#c9b8ff,#f0b84a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .alt-lede{color:rgba(232,228,240,0.72);max-width:60ch;font-size:1.05rem;line-height:1.68}
        .alt-answer{background:linear-gradient(160deg,var(--raised),var(--card));border:1px solid var(--line);border-left:3px solid var(--gold);border-radius:18px;padding:26px 28px;max-width:820px;margin:0 auto}
        .alt-answer-tag{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);font-weight:700;margin-bottom:10px}
        .alt-answer p{margin:0;font-size:1.08rem;color:var(--white);line-height:1.65}
        .alt-answer p strong{color:var(--violet-bright)}
        .alt-hero-img{max-width:900px;margin:36px auto 0;border-radius:20px;overflow:hidden;border:1px solid var(--line);box-shadow:0 40px 100px -50px rgba(139,92,246,.5)}
        .alt-hero-img img{width:100%;height:auto;display:block}
        .alt-cols{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-top:28px}
        @media(max-width:760px){.alt-cols{grid-template-columns:1fr}}
        .alt-card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:26px}
        .alt-card h3{font-family:var(--font-display);font-size:1.2rem;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:10px}
        .alt-card ul{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:12px}
        .alt-card li{display:flex;gap:11px;color:rgba(232,228,240,0.75);font-size:.97rem;line-height:1.55}
        .alt-mark{flex:none;width:20px;height:20px;border-radius:50%;display:grid;place-items:center;font-size:12px;font-weight:800;margin-top:2px}
        .alt-mark.g{background:rgba(95,227,161,.14);color:var(--good)}
        .alt-mark.b{background:rgba(224,106,125,.14);color:var(--bad)}
        .alt-tablewrap{overflow-x:auto;border:1px solid var(--line);border-radius:18px;background:var(--card);margin-top:26px;-webkit-overflow-scrolling:touch}
        .alt-tablewrap table{width:100%;border-collapse:collapse;min-width:560px}
        .alt-tablewrap th,.alt-tablewrap td{padding:15px 18px;text-align:left;border-bottom:1px solid var(--border);font-size:.97rem}
        .alt-tablewrap thead th{font-family:var(--font-display);font-size:1.05rem;font-weight:700;color:var(--white)}
        .alt-tablewrap thead th.bc{color:var(--violet-bright)}
        .alt-tablewrap tbody td:first-child{color:rgba(232,228,240,0.55);font-weight:500}
        .alt-tablewrap td.bc{background:rgba(139,92,246,.07);color:var(--white);font-weight:500}
        .alt-tablewrap td.co{color:rgba(232,228,240,0.45)}
        .alt-tablewrap tr:last-child td{border-bottom:0}
        .alt-col-tag{display:block;font-size:10px;letter-spacing:.12em;text-transform:uppercase;font-weight:700;margin-bottom:3px}
        .alt-col-tag.bc{color:var(--gold)}
        .alt-col-tag.co{color:rgba(232,228,240,0.4)}
        .alt-yes{color:var(--good);font-weight:700}
        .alt-no{color:var(--bad)}
        .alt-lim{color:rgba(232,228,240,0.4)}
        .alt-footnote{color:rgba(232,228,240,0.35);font-size:12.5px;margin-top:12px}
        .alt-features{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:28px}
        @media(max-width:820px){.alt-features{grid-template-columns:1fr}}
        .alt-feat{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:22px}
        .alt-feat .ic{font-size:22px;margin-bottom:12px;display:block;color:var(--violet-bright)}
        .alt-feat h3{font-family:var(--font-display);font-size:1.08rem;font-weight:700;margin-bottom:8px}
        .alt-feat p{color:rgba(232,228,240,0.55);font-size:.95rem;line-height:1.55}
        .alt-reading{max-width:820px;margin:28px auto 0;background:linear-gradient(165deg,var(--raised),var(--card));border:1px solid var(--line);border-radius:20px;padding:6px;box-shadow:0 34px 90px -46px rgba(139,92,246,.5)}
        .alt-reading-bar{display:flex;align-items:center;gap:7px;padding:14px 18px 10px}
        .alt-reading-bar .d{width:10px;height:10px;border-radius:50%}
        .alt-reading-bar .r{background:#e0687d}.alt-reading-bar .y{background:#f3d27a}.alt-reading-bar .gr{background:#5fe3a1}
        .alt-reading-bar span{margin-left:8px;color:rgba(232,228,240,0.45);font-size:12.5px}
        .alt-excerpt{padding:16px 26px}
        .alt-excerpt+.alt-excerpt{border-top:1px solid var(--border)}
        .alt-excerpt .plc{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold);font-weight:700;margin-bottom:9px}
        .alt-excerpt p{margin:0;font-family:var(--font-display);font-size:1.12rem;line-height:1.55;color:var(--white)}
        .alt-locked{margin:4px 6px 6px;border-top:1px solid var(--border);padding:22px 26px;text-align:center;border-radius:0 0 16px 16px;background:rgba(139,92,246,.05)}
        .alt-locked .blur{filter:blur(5px);opacity:.55;user-select:none;font-family:var(--font-display);font-size:1.05rem;color:rgba(232,228,240,0.5);pointer-events:none;margin:0}
        .alt-locked .key{margin-top:16px;font-size:14px;color:var(--violet-bright);font-weight:600}
        .alt-locked .key b{color:var(--gold)}
        .alt-stay{background:var(--raised);border:1px dashed var(--border);border-radius:18px;padding:28px;max-width:820px;margin:0 auto}
        .alt-stay h3{font-family:var(--font-display);font-size:1.3rem;font-weight:700;margin-bottom:10px}
        .alt-stay p{color:rgba(232,228,240,0.72);line-height:1.68}
        .alt-faq{max-width:820px;margin:24px auto 0;display:flex;flex-direction:column;gap:12px}
        .alt-faq details{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:4px 20px}
        .alt-faq details[open]{border-color:var(--line)}
        .alt-faq summary{cursor:pointer;list-style:none;padding:16px 0;font-family:var(--font-display);font-size:1.1rem;color:var(--white);display:flex;justify-content:space-between;align-items:center;gap:14px}
        .alt-faq summary::-webkit-details-marker{display:none}
        .alt-faq summary::after{content:"+";color:var(--violet);font-size:1.5rem;font-weight:400;transition:transform .2s}
        .alt-faq details[open] summary::after{transform:rotate(45deg)}
        .alt-faq details p{margin:0 0 18px;color:rgba(232,228,240,0.72);line-height:1.68}
        .alt-note{max-width:820px;margin:0 auto;background:var(--card);border:1px solid var(--line);border-radius:20px;padding:28px 30px 32px}
        .alt-note-top{display:flex;align-items:center;gap:14px;margin-bottom:18px}
        .alt-avatar{width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,var(--purple),var(--violet));display:grid;place-items:center;font-family:var(--font-display);font-size:1.5rem;color:#fff;flex:none;font-weight:700}
        .alt-note-top .who b{display:block;color:var(--white);font-size:1.05rem;font-family:var(--font-display)}
        .alt-note-top .who span{color:rgba(232,228,240,0.5);font-size:13px}
        .alt-bubbles{display:flex;flex-direction:column;gap:11px}
        .alt-bubble{background:var(--raised);border:1px solid var(--border);border-radius:16px;border-top-left-radius:5px;padding:14px 18px;color:rgba(232,228,240,0.78);line-height:1.62;font-size:.99rem}
        .alt-bubble b{color:var(--white)}
        .alt-sign{margin-top:20px;font-family:var(--font-display);font-style:italic;font-size:1.05rem;color:var(--violet-bright)}
        .alt-trust-strip{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;max-width:820px;margin:24px auto 0}
        @media(max-width:720px){.alt-trust-strip{grid-template-columns:1fr 1fr}}
        .alt-tb{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:16px 12px;text-align:center}
        .alt-tb .i{font-size:19px;display:block;margin-bottom:7px}
        .alt-tb b{display:block;color:var(--white);font-size:.9rem;line-height:1.3}
        .alt-tb span{color:rgba(232,228,240,0.5);font-size:.8rem}
        .alt-band{background:linear-gradient(150deg,rgba(107,47,212,.18),var(--card));border:1px solid var(--line);border-radius:22px;padding:48px 32px;text-align:center;max-width:900px;margin:0 auto}
        .alt-band h2{font-family:var(--font-display);font-size:clamp(1.7rem,3.6vw,2.5rem);font-weight:800;margin-bottom:14px}
        .alt-band h2 em{font-style:italic;background:linear-gradient(135deg,#c9b8ff,#f0b84a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .alt-band p{color:rgba(232,228,240,0.72);max-width:48ch;margin:0 auto 24px}
        .alt-inline-img{max-width:520px;width:100%;height:auto;display:block;margin:22px auto;border-radius:14px;border:1px solid var(--border)}
        .alt-competitor-img{max-width:120px;height:auto;display:block;margin:0 auto 22px;border-radius:16px;border:1px solid var(--border)}
        .alt-mockup-frame{max-width:900px;margin:36px auto 0;padding:12px;background:linear-gradient(165deg,var(--raised),var(--card));border:1px solid var(--line);border-radius:20px;box-shadow:0 34px 90px -46px rgba(139,92,246,.4)}
        .alt-mockup-frame img{width:100%;height:auto;display:block;border-radius:12px}
      `}</style>

      <nav className={`alt-nav${scrolled ? " on" : ""}`}>
        <div className="alt-c" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="alt-logo">
            <Image src="/mascot.png" alt="BluntChart logo" width={34} height={34} style={{ borderRadius: "50%" }} />
            <span className="g">BluntChart</span>
          </Link>
          <div className="alt-nav-links">
            <Link href="/astrology-app-alternatives">All alternatives</Link>
            <Link href="/free-birth-chart">Free birth chart</Link>
            <Link href="/#try-it" className="alt-nav-cta">Get reading · $15</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="alt-hero">
        <div className="alt-c">
          <div className="alt-crumb">
            <Link href="/">BluntChart</Link>
            <span className="sep">/</span>
            <Link href="/astrology-app-alternatives">Alternatives</Link>
            <span className="sep">/</span>
            <span className="here">{data.breadcrumb}</span>
          </div>
          <Image
            src={data.competitorImage}
            alt={data.competitorImageAlt}
            width={120}
            height={120}
            className="alt-competitor-img"
          />
          <div className="alt-eyebrow">✦ {data.competitor} alternative · 2026</div>
          <h1 className="alt-h1">{data.h1}</h1>
          <p className="alt-sub">{data.subtitle}</p>
          <div className="alt-cta-row">
            <Link href="/#try-it" className="alt-btn alt-btn-primary">Get my free preview ✨</Link>
            <a href="#compare" className="alt-btn alt-btn-ghost">See the full comparison ↓</a>
          </div>
          <div className="alt-trust">
            {data.trustRow.map((t, i) => (
              <span key={i}>{i > 0 && <span style={{ opacity: 0.4, marginRight: 8 }}>·</span>}<span dangerouslySetInnerHTML={{ __html: t }} /></span>
            ))}
          </div>

          {/* Mockup image */}
          <div className="alt-mockup-frame">
            <Image
              src="/bluntchart-mockup.png"
              alt={`BluntChart brutally honest birth chart reading — the ${data.competitor} alternative preview`}
              width={900}
              height={600}
              priority={false}
            />
          </div>
        </div>
      </header>

      {/* ANSWER BOX (AEO) */}
      <section className="alt-sec" style={{ paddingTop: 20 }}>
        <div className="alt-c">
          <div className="alt-answer">
            <div className="alt-answer-tag">The short answer</div>
            {data.answerBox}
          </div>
        </div>
      </section>

      {/* CREDIT WHERE IT'S DUE */}
      <section className="alt-sec">
        <div className="alt-c">
          <div className="alt-divider">✦</div>
          <div className="alt-kicker">Credit where it's due</div>
          <h2 className="alt-h2">What {data.competitor} gets right — and where it <em>leaves you wanting</em></h2>
          <p className="alt-lede">Every competitor on this page does something well. If we skipped that, we&apos;d be doing exactly what the vague apps do.</p>
          <div className="alt-cols">
            <div className="alt-card">
              <h3>✦ What {data.competitor} gets right</h3>
              <ul>
                {data.creditPros.map((p, i) => (
                  <li key={i}><span className="alt-mark g">✓</span><span>{p}</span></li>
                ))}
              </ul>
            </div>
            <div className="alt-card">
              <h3>✦ Where it leaves you wanting</h3>
              <ul>
                {data.creditCons.map((c, i) => (
                  <li key={i}><span className="alt-mark b">✕</span><span>{c}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="alt-sec" id="compare">
        <div className="alt-c">
          <div className="alt-divider">✦</div>
          <div className="alt-kicker">Head to head</div>
          <h2 className="alt-h2">BluntChart vs <em>{data.competitor}</em></h2>
          <p className="alt-lede">{data.comparisonLede}</p>
          <div className="alt-tablewrap">
            <table>
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="bc"><span className="alt-col-tag bc">Recommended</span>BluntChart</th>
                  <th><span className="alt-col-tag co">Incumbent</span>{data.competitor}</th>
                </tr>
              </thead>
              <tbody>
                {data.comparison.map((row, i) => (
                  <tr key={i}>
                    <td>{row.feature}</td>
                    <td className="bc">{kindMark(row.bluntchart.kind)} {row.bluntchart.text}</td>
                    <td className="co">{kindMark(row.competitor.kind)} {row.competitor.text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="alt-footnote">{data.comparisonFootnote}</p>
        </div>
      </section>

      {/* DIFFERENCE FEATURES */}
      <section className="alt-sec">
        <div className="alt-c">
          <div className="alt-divider">✦</div>
          <div className="alt-kicker">The difference</div>
          <h2 className="alt-h2">{data.differenceH2}</h2>
          <p className="alt-lede">{data.differenceLede}</p>
          <div className="alt-features">
            {FEATURES.map((f, i) => (
              <div key={i} className="alt-feat">
                <span className="ic">{f.ic}</span>
                <h3>{f.h}</h3>
                <p>{f.p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SAMPLE READING with natal chart image */}
      <section className="alt-sec">
        <div className="alt-c">
          <div className="alt-divider">✦</div>
          <div className="alt-kicker">See it for yourself</div>
          <h2 className="alt-h2">{data.sampleH2}</h2>
          <p className="alt-lede">{data.sampleLede}</p>
          <Image
            src="/natal chart reading.png"
            alt={`Sample brutally honest natal chart reading from BluntChart — the ${data.competitor} alternative that names the placement`}
            width={520}
            height={400}
            className="alt-inline-img"
          />
          <div className="alt-reading">
            <div className="alt-reading-bar">
              <span className="d r" /><span className="d y" /><span className="d gr" />
              <span>Your Reading · sample excerpt</span>
            </div>
            {data.sampleExcerpts.map((ex, i) => (
              <div key={i} className="alt-excerpt">
                <div className="plc">{ex.placement}</div>
                <p>{ex.text}</p>
              </div>
            ))}
            <div className="alt-locked">
              <p className="blur">{data.sampleLocked}</p>
              <p className="key">🔒 <b>8 more insights</b> — in the full reading</p>
            </div>
          </div>
          <div style={{ textAlign: "center", marginTop: 26 }}>
            <Link href="/#try-it" className="alt-btn alt-btn-primary">Unlock my reading — free preview ✨</Link>
          </div>
        </div>
      </section>

      {/* HONEST / STAY */}
      <section className="alt-sec">
        <div className="alt-c">
          <div className="alt-stay">
            <h3>{data.stayTitle}</h3>
            <p>{data.stayBody}</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="alt-sec" id="faq">
        <div className="alt-c">
          <div className="alt-divider">✦</div>
          <div className="alt-kicker">Before you switch</div>
          <h2 className="alt-h2">Questions about a <em>{data.competitor} alternative</em></h2>
          <div className="alt-faq">
            {data.faqs.map((f, i) => (
              <details key={i} open={i === 0}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDER NOTE */}
      <section className="alt-sec">
        <div className="alt-c">
          <div className="alt-divider">✦</div>
          <div className="alt-kicker" style={{ textAlign: "center" }}>A note from the team</div>
          <div className="alt-note">
            <div className="alt-note-top">
              <div className="alt-avatar">I</div>
              <div className="who">
                <b>Ishika, BluntChart founder</b>
                <span>Answers support emails personally · <Link href="/founder" style={{ color: "var(--violet-bright)" }}>About me</Link></span>
              </div>
            </div>
            <div className="alt-bubbles">
              {data.founderBubbles.map((b, i) => <div key={i} className="alt-bubble">{b}</div>)}
            </div>
            <p className="alt-sign">— Ishika, who made this</p>
          </div>
          <div className="alt-trust-strip">
            {data.trustBadges.map((b, i) => (
              <div key={i} className="alt-tb">
                <span className="i">{b.icon}</span>
                <b>{b.title}</b>
                <span>{b.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="alt-sec">
        <div className="alt-c">
          <div className="alt-band">
            <h2>{data.ctaBandH2}</h2>
            <p>{data.ctaBandBody}</p>
            <Link href="/#try-it" className="alt-btn alt-btn-primary">Read my chart — free preview ✨</Link>
            <p style={{ marginTop: 18, fontSize: 13, color: "rgba(232,228,240,0.4)" }}>For entertainment purposes only · Not professional advice</p>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Reusable card for the hub + "other alternatives" grids ── */

export type CompetitorCardData = {
  slug: string;          // "co-star" (no /-alternative suffix)
  name: string;          // "Co-Star"
  image: string;         // "/co-star.png"
  imageAlt: string;
  hook: string;          // one-line positioning
  angle: string;         // short "why switch" pill
};

export function CompetitorCard({ card }: { card: CompetitorCardData }) {
  return (
    <Link href={`/${card.slug}-alternative`} className="cc-card">
      <style>{`
        .cc-card{display:flex;flex-direction:column;background:linear-gradient(165deg,#171130,#12121e);border:1px solid rgba(255,255,255,0.08);border-radius:20px;padding:26px 24px 22px;text-decoration:none;color:inherit;transition:transform .2s,border-color .2s,box-shadow .2s;height:100%}
        .cc-card:hover{transform:translateY(-3px);border-color:rgba(199,184,255,.4);box-shadow:0 30px 60px -30px rgba(139,92,246,.35)}
        .cc-head{display:flex;align-items:center;gap:14px;margin-bottom:14px}
        .cc-img{width:56px;height:56px;border-radius:14px;background:rgba(255,255,255,0.04);padding:6px;display:grid;place-items:center;flex:none;border:1px solid rgba(255,255,255,0.08)}
        .cc-img img{width:100%;height:100%;object-fit:contain;display:block;border-radius:8px}
        .cc-title{font-family:'Playfair Display',serif;font-size:1.28rem;font-weight:700;color:#e8e4f0;line-height:1.15;margin:0}
        .cc-sub{font-size:12px;color:#a78bfa;font-weight:600;letter-spacing:.06em;text-transform:uppercase;margin-top:3px}
        .cc-hook{font-size:14.5px;color:rgba(232,228,240,0.7);line-height:1.6;margin:0 0 14px}
        .cc-pill{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#F0B84A;background:rgba(240,184,74,.09);padding:5px 10px;border-radius:999px;margin-bottom:14px}
        .cc-link{margin-top:auto;padding-top:14px;border-top:0.5px solid rgba(255,255,255,0.06);color:#c9b8ff;font-size:13.5px;font-weight:600;display:flex;justify-content:space-between;align-items:center}
        .cc-link::after{content:"→";transition:transform .2s}
        .cc-card:hover .cc-link::after{transform:translateX(4px)}
      `}</style>
      <div className="cc-head">
        <div className="cc-img">
          <Image src={card.image} alt={card.imageAlt} width={56} height={56} />
        </div>
        <div>
          <div className="cc-sub">The {card.name} alternative</div>
          <h3 className="cc-title">Switch from {card.name}</h3>
        </div>
      </div>
      <span className="cc-pill">{card.angle}</span>
      <p className="cc-hook">{card.hook}</p>
      <span className="cc-link">Read the comparison <span /></span>
    </Link>
  );
}
