"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Shared shell for /why-* "pattern" cluster pages.
 * Provides nav, article layout, and reusable content primitives.
 *
 * Editorial guardrails baked in (see cluster architecture doc):
 *  - Named author byline (link to /founder) for E-E-A-T
 *  - SupportNote must appear in body (not as legal footer)
 *  - CTA framed as "language for the pattern", not treatment
 */

export type FAQ = { q: string; a: string };
export type RelatedLink = { href: string; title: string; note?: string };

export function PatternPageShell({
  breadcrumb,
  h1,
  intro,
  publishedIso = "2026-07-25",
  children,
}: {
  breadcrumb: string;
  h1: React.ReactNode;
  intro: React.ReactNode;
  publishedIso?: string;
  children: React.ReactNode;
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const publishedDisplay = new Date(publishedIso).toLocaleDateString("en-GB", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--font-display:'Playfair Display',Georgia,serif;--font-body:'DM Sans',system-ui,sans-serif;--bg:#09090f;--card:#12121e;--border:rgba(255,255,255,0.08);--white:#e8e4f0;--dim:rgba(232,228,240,0.55);--gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);--purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5}
        html{scroll-behavior:smooth}body{background:var(--bg);color:var(--white);font-family:var(--font-body);-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .pp-c{max-width:1280px;margin:0 auto;padding:0 40px}
        @media(max-width:768px){.pp-c{padding:0 20px}}
        .pp-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;transition:all .3s}
        .pp-nav.on{background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
        .pp-logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:10px;color:var(--white)}
        .pp-logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .pp-nav-links{display:flex;align-items:center;gap:24px}
        .pp-nav-links a{font-size:13px;color:var(--dim);text-decoration:none}
        .pp-nav-links .pp-cta{color:#F0B84A;font-weight:600;border:1px solid var(--gold-dim);padding:6px 15px;border-radius:4px}
        @media(max-width:768px){.pp-nav-links a:not(.pp-cta){display:none}}
        .pp-crumb{font-size:12px;color:rgba(232,228,240,0.3);margin-bottom:20px}
        .pp-crumb a{color:rgba(232,228,240,0.3);text-decoration:none}
        .pp-crumb a:hover{color:var(--dim)}
        .pp-crumb .sep{margin:0 8px}
        .pp-crumb .here{color:rgba(232,228,240,0.5)}
        .pp-hero{padding-top:120px;padding-bottom:36px;position:relative}
        .pp-hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% -10%,rgba(107,47,212,.08) 0%,transparent 50%);pointer-events:none}
        .pp-article{max-width:820px;margin:0 auto}
        .pp-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#F0B84A;padding:5px 14px;border:1px solid var(--gold-dim);border-radius:100px;background:rgba(240,184,74,0.06);margin-bottom:20px}
        .pp-h1{font-family:var(--font-display);font-size:clamp(2.1rem,5vw,3.4rem);font-weight:900;line-height:1.08;letter-spacing:-0.02em;margin-bottom:22px}
        .pp-h1 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .pp-byline{font-size:13px;color:rgba(232,228,240,0.5);margin-bottom:32px;display:flex;flex-wrap:wrap;gap:6px 14px;align-items:center}
        .pp-byline a{color:#F0B84A;text-decoration:none}
        .pp-byline a:hover{text-decoration:underline}
        .pp-byline .dot{color:rgba(232,228,240,0.2)}
        .pp-intro{font-family:var(--font-display);font-size:1.25rem;line-height:1.55;color:var(--white);margin-bottom:8px;font-style:italic;opacity:0.9}
        .pp-body{padding:24px 0 48px}
        .pp-body h2{font-family:var(--font-display);font-size:clamp(1.5rem,3vw,1.95rem);font-weight:800;line-height:1.2;letter-spacing:-0.01em;color:var(--white);margin:40px 0 16px}
        .pp-body h2 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .pp-body h3{font-family:var(--font-display);font-size:18px;font-weight:700;color:var(--white);margin:26px 0 10px;letter-spacing:-0.005em}
        .pp-body p{font-size:16px;color:rgba(232,228,240,0.72);line-height:1.78;margin-bottom:18px}
        .pp-body p a{color:#F0B84A;text-decoration:underline;text-decoration-color:rgba(240,184,74,0.35);text-underline-offset:3px}
        .pp-body p a:hover{text-decoration-color:#F0B84A}
        .pp-body p strong{color:var(--white);font-weight:600}
        .pp-body ul,.pp-body ol{margin:0 0 18px 0;padding-left:22px}
        .pp-body li{font-size:16px;color:rgba(232,228,240,0.72);line-height:1.7;margin-bottom:8px}
        .pp-body li strong{color:var(--white);font-weight:600}
        .pp-body li em{color:var(--white);font-style:italic}
        .pp-body em{color:rgba(232,228,240,0.9);font-style:italic}
        .pp-support{background:rgba(93,202,165,0.04);border-left:3px solid var(--teal);border-radius:0 12px 12px 0;padding:20px 24px;margin:32px 0}
        .pp-support-l{font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--teal);margin-bottom:8px;display:block}
        .pp-support p{font-size:15px;color:rgba(232,228,240,0.78);line-height:1.7;margin:0}
        .pp-support p a{color:var(--teal);text-decoration:underline;text-decoration-color:rgba(93,202,165,0.4);text-underline-offset:3px}
        .pp-cta-block{background:rgba(107,47,212,0.05);border:0.5px solid rgba(107,47,212,0.22);border-radius:16px;padding:28px 26px;margin:32px 0;text-align:center}
        .pp-cta-block h3{font-family:var(--font-display);font-size:1.4rem;font-weight:800;color:var(--white);margin:0 0 10px}
        .pp-cta-block p{font-size:14.5px;color:rgba(232,228,240,0.65);line-height:1.7;margin:0 auto 18px;max-width:520px}
        .pp-cta-btn{display:inline-block;background:linear-gradient(135deg,#f0b84a,#e8854a);color:#0d0800;font-weight:700;font-size:15px;padding:14px 26px;border-radius:12px;text-decoration:none;letter-spacing:0.02em;transition:opacity .2s,transform .15s}
        .pp-cta-btn:hover{opacity:.88;transform:translateY(-1px)}
        .pp-inline-cta{display:inline-block;color:#F0B84A;font-weight:600;text-decoration:none;border-bottom:1.5px solid rgba(240,184,74,0.4);padding-bottom:1px}
        .pp-inline-cta:hover{border-color:#F0B84A}
        .pp-rule{border:0;height:1px;background:rgba(255,255,255,0.08);margin:44px 0}
        .pp-faq-sec{padding:48px 0 24px;border-top:1px solid var(--border);background:#0d0d18}
        .pp-faq-hd{display:flex;align-items:center;gap:10px;margin-bottom:14px}
        .pp-faq-hd span:first-child{width:22px;height:1px;background:#F0B84A;display:inline-block}
        .pp-faq-hd span:last-child{font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#F0B84A}
        .pp-faq h2{font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2rem);font-weight:800;line-height:1.15;margin-bottom:22px}
        .pp-faq h2 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .pp-faq details{border-bottom:0.5px solid rgba(255,255,255,0.08)}
        .pp-faq summary{padding:18px 0;font-size:15px;font-weight:600;color:var(--white);cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between;gap:16px}
        .pp-faq summary::-webkit-details-marker{display:none}
        .pp-faq summary .plus{color:var(--purple);font-size:18px;font-weight:700;flex-shrink:0}
        .pp-faq details[open] summary .plus{transform:rotate(45deg)}
        .pp-faq p{font-size:14.5px;color:rgba(232,228,240,0.62);line-height:1.78;padding:0 40px 20px 0;margin:0}
        .pp-related{padding:48px 0 56px}
        .pp-related h3{font-family:var(--font-display);font-size:1.25rem;font-weight:700;color:var(--white);margin-bottom:16px;letter-spacing:-0.01em}
        .pp-related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px}
        .pp-related-card{background:var(--card);border:0.5px solid var(--border);border-radius:12px;padding:18px 20px;text-decoration:none;display:block;transition:border-color .2s}
        .pp-related-card:hover{border-color:rgba(240,184,74,0.3)}
        .pp-related-card .t{font-size:14.5px;font-weight:600;color:var(--white);margin-bottom:4px}
        .pp-related-card .n{font-size:13px;color:rgba(232,228,240,0.5);line-height:1.5}
      `}</style>

      <nav className={`pp-nav${scrolled ? " on" : ""}`}>
        <div className="pp-c" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="pp-logo">
            <Image src="/mascot.png" alt="BluntChart" width={34} height={34} style={{ borderRadius: "50%" }} />
            <span className="g">BluntChart</span>
          </Link>
          <div className="pp-nav-links">
            <Link href="/free-birth-chart">Birth Chart</Link>
            <Link href="/moon-sign-calculator">Moon Sign</Link>
            <Link href="/#try-it" className="pp-cta">Full Reading $15</Link>
          </div>
        </div>
      </nav>

      <section className="pp-hero">
        <div className="pp-hero-bg" />
        <div className="pp-c" style={{ position: "relative", zIndex: 1 }}>
          <div className="pp-article">
            <div className="pp-crumb">
              <Link href="/">BluntChart</Link>
              <span className="sep">/</span>
              <Link href="/#patterns">Patterns</Link>
              <span className="sep">/</span>
              <span className="here">{breadcrumb}</span>
            </div>
            <span className="pp-eyebrow">✦ Pattern · Psychology + your chart</span>
            <h1 className="pp-h1">{h1}</h1>
            <div className="pp-byline">
              <span>Written by <Link href="/founder">Ishika, BluntChart founder</Link></span>
              <span className="dot">·</span>
              <span>Published {publishedDisplay}</span>
              <span className="dot">·</span>
              <span>~8 min read</span>
            </div>
            <div className="pp-intro">{intro}</div>
          </div>
        </div>
      </section>

      <section className="pp-body">
        <div className="pp-c">
          <div className="pp-article">{children}</div>
        </div>
      </section>
    </>
  );
}

/* ── Reusable content primitives ── */

export function SupportNote({ children }: { children: React.ReactNode }) {
  return (
    <aside className="pp-support">
      <span className="pp-support-l">If this goes deeper than a birth chart</span>
      <p>{children}</p>
    </aside>
  );
}

export function ChartCTA({
  headline,
  body,
}: {
  headline: string;
  body: string;
}) {
  return (
    <div className="pp-cta-block">
      <h3>{headline}</h3>
      <p>{body}</p>
      <Link href="/#try-it" className="pp-cta-btn">Get my reading — $15 ✦</Link>
    </div>
  );
}

export function FAQBlock({ faqs, title = "Common questions" }: { faqs: FAQ[]; title?: string }) {
  return (
    <section className="pp-faq-sec">
      <div className="pp-c">
        <div className="pp-article pp-faq">
          <div className="pp-faq-hd"><span /><span>{title}</span></div>
          <h2>Frequently <em>asked</em></h2>
          {faqs.map((f, i) => (
            <details key={i}>
              <summary>{f.q}<span className="plus">+</span></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function RelatedBlock({ related }: { related: RelatedLink[] }) {
  return (
    <section className="pp-related">
      <div className="pp-c">
        <div className="pp-article">
          <h3>Related patterns &amp; tools</h3>
          <div className="pp-related-grid">
            {related.map((r, i) => (
              <Link key={i} href={r.href} className="pp-related-card">
                <div className="t">{r.title}</div>
                {r.note && <div className="n">{r.note}</div>}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
