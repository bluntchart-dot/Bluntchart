"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CompetitorCard, type CompetitorCardData } from "@/components/AlternativePageShell";

const CARDS: CompetitorCardData[] = [
  {
    slug: "co-star",
    name: "Co-Star",
    image: "/co-star.png",
    imageAlt: "Co-Star astrology app logo — Co-Star alternative comparison on BluntChart",
    angle: "Depth, not a notification",
    hook: "Co-Star's daily one-liner is a habit. BluntChart is one deep, honest reading — planets, houses and aspects, ~1,500 words, one-time $15. The Co-Star alternative for people who want the whole chart, not a screenshot.",
  },
  {
    slug: "the-pattern",
    name: "The Pattern",
    image: "/The pattern.png",
    imageAlt: "The Pattern astrology app logo — The Pattern alternative comparison on BluntChart",
    angle: "Names the placement",
    hook: "The Pattern says you have a wall. BluntChart says: it's your Saturn in the 4th, here's the fear it's protecting. The Pattern alternative that actually shows you the astrology behind each pattern.",
  },
  {
    slug: "chani",
    name: "CHANI",
    image: "/chani.png",
    imageAlt: "CHANI astrology app logo — CHANI alternative comparison on BluntChart",
    angle: "A mirror, not a hug",
    hook: "CHANI is affirming and gentle. BluntChart is the opposite: one honest reading, no affirmations, no subscription, $15 and done. The CHANI alternative for when the soft version has stopped landing.",
  },
  {
    slug: "sanctuary",
    name: "Sanctuary",
    image: "/Sanctuary.png",
    imageAlt: "Sanctuary astrology app logo — Sanctuary alternative comparison on BluntChart",
    angle: "No per-minute meter",
    hook: "Sanctuary bills live readers by the minute. BluntChart is a full written reading at a flat $15 you know before you start — yours forever, no clock running. The Sanctuary alternative that skips the meter and keeps the depth.",
  },
  {
    slug: "nebula",
    name: "Nebula",
    image: "/Nebula.png",
    imageAlt: "Nebula astrology app logo — Nebula alternative comparison on BluntChart",
    angle: "No subscription trap",
    hook: "Nebula's free trial converts to auto-renewing billing. BluntChart is a flat one-time $15 — no trial, no stored card, nothing to cancel. The Nebula alternative for people done with subscription roulette.",
  },
];

export default function AlternativesHubClient() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--font-display:'Playfair Display',Georgia,serif;--font-body:'DM Sans',system-ui,sans-serif;--bg:#09090f;--card:#12121e;--raised:#171130;--border:rgba(255,255,255,0.08);--line:#2a2145;--white:#e8e4f0;--dim:rgba(232,228,240,0.55);--gold:#F0B84A;--purple:#6b2fd4;--violet:#a78bfa;--violet-bright:#c9b8ff;--good:#5fe3a1;--bad:#e06a7d}
        html{scroll-behavior:smooth}body{background:var(--bg);color:var(--white);font-family:var(--font-body);-webkit-font-smoothing:antialiased;overflow-x:hidden;background-image:radial-gradient(900px 500px at 80% -8%,rgba(139,92,246,.16),transparent 60%),radial-gradient(700px 500px at 5% 8%,rgba(243,210,122,.05),transparent 55%);background-attachment:fixed}
        .ah-c{max-width:1280px;margin:0 auto;padding:0 40px}
        @media(max-width:768px){.ah-c{padding:0 20px}}
        .ah-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:16px 0;transition:all .3s}
        .ah-nav.on{background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
        .ah-logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:10px;color:var(--white)}
        .ah-logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .ah-nav-links{display:flex;align-items:center;gap:22px;font-size:14px}
        .ah-nav-links a{color:var(--dim);text-decoration:none}
        .ah-nav-links a:hover{color:var(--white)}
        .ah-cta{color:#fff !important;font-weight:600;padding:9px 16px;border-radius:999px;background:linear-gradient(135deg,var(--purple),var(--violet))}
        @media(max-width:768px){.ah-nav-links a:not(.ah-cta){display:none}}
        .ah-crumb{font-size:12px;color:rgba(232,228,240,0.3);margin-bottom:20px}
        .ah-crumb a{color:rgba(232,228,240,0.3);text-decoration:none}
        .ah-crumb .sep{margin:0 8px}
        .ah-crumb .here{color:rgba(232,228,240,0.5)}
        .ah-hero{padding-top:110px;padding-bottom:40px;text-align:center}
        .ah-eyebrow{display:inline-flex;gap:8px;align-items:center;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--violet);font-weight:700;margin-bottom:22px}
        .ah-h1{font-family:var(--font-display);font-size:clamp(2.4rem,6vw,4.2rem);font-weight:800;line-height:1.05;letter-spacing:-0.02em;max-width:20ch;margin:0 auto 22px}
        .ah-h1 em{font-style:italic;background:linear-gradient(135deg,#c9b8ff,#f0b84a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .ah-sub{font-size:clamp(1.05rem,2vw,1.24rem);color:rgba(232,228,240,0.72);max-width:64ch;margin:0 auto 28px;line-height:1.68}
        .ah-cta-row{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-bottom:22px}
        .ah-btn{display:inline-flex;align-items:center;gap:9px;font-weight:600;font-size:15px;padding:14px 26px;border-radius:999px;border:0;cursor:pointer;text-decoration:none;transition:transform .15s,box-shadow .2s}
        .ah-btn-primary{background:linear-gradient(135deg,var(--purple),var(--violet));color:#fff;box-shadow:0 10px 34px -10px rgba(139,92,246,.5)}
        .ah-btn-primary:hover{transform:translateY(-2px);box-shadow:0 16px 40px -10px rgba(139,92,246,.7)}
        .ah-btn-ghost{color:var(--dim);border:1px solid var(--border);background:transparent;padding:13px 22px}
        .ah-btn-ghost:hover{border-color:var(--violet);color:var(--white)}
        .ah-answer{background:linear-gradient(160deg,var(--raised),var(--card));border:1px solid var(--line);border-left:3px solid var(--gold);border-radius:18px;padding:26px 28px;max-width:840px;margin:0 auto}
        .ah-answer-tag{font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--gold);font-weight:700;margin-bottom:10px}
        .ah-answer p{margin:0;font-size:1.08rem;color:var(--white);line-height:1.65}
        .ah-answer strong{color:var(--violet-bright)}
        .ah-sec{padding:52px 0}
        .ah-divider{display:flex;align-items:center;gap:16px;color:var(--purple);opacity:.6;margin-bottom:14px}
        .ah-divider::before,.ah-divider::after{content:"";height:1px;background:var(--border);flex:1}
        .ah-kicker{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--violet);font-weight:700;margin-bottom:12px}
        .ah-h2{font-family:var(--font-display);font-size:clamp(1.7rem,3.8vw,2.6rem);font-weight:800;line-height:1.12;letter-spacing:-0.01em;max-width:24ch;margin-bottom:16px}
        .ah-h2 em{font-style:italic;background:linear-gradient(135deg,#c9b8ff,#f0b84a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .ah-lede{color:rgba(232,228,240,0.72);max-width:64ch;font-size:1.05rem;line-height:1.68;margin-bottom:28px}
        .ah-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:18px}
        .ah-glance{overflow-x:auto;-webkit-overflow-scrolling:touch;border:1px solid var(--line);border-radius:18px;background:var(--card);margin-bottom:28px}
        .ah-glance table{width:100%;border-collapse:collapse;min-width:640px}
        .ah-glance th,.ah-glance td{padding:14px 16px;text-align:left;border-bottom:1px solid var(--border);font-size:.95rem;color:rgba(232,228,240,0.75)}
        .ah-glance thead th{font-family:var(--font-display);font-weight:700;color:var(--white);background:rgba(255,255,255,0.02);font-size:.98rem}
        .ah-glance tbody td:first-child{color:var(--white);font-weight:600;white-space:nowrap}
        .ah-glance tr:last-child td{border-bottom:0}
        .ah-glance .yes{color:var(--good);font-weight:700}
        .ah-glance .no{color:var(--bad)}
        .ah-hero-img{max-width:900px;margin:36px auto 0;border-radius:20px;overflow:hidden;border:1px solid var(--line);box-shadow:0 40px 100px -50px rgba(139,92,246,.5)}
        .ah-hero-img img{width:100%;height:auto;display:block}
        .ah-copy{max-width:820px;margin:0 auto}
        .ah-copy p{color:rgba(232,228,240,0.75);line-height:1.75;margin-bottom:16px;font-size:1.02rem}
        .ah-copy a{color:var(--violet-bright)}
        .ah-copy h3{font-family:var(--font-display);font-size:1.2rem;font-weight:700;margin:24px 0 10px;color:var(--white)}
        .ah-faq{max-width:820px;margin:24px auto 0;display:flex;flex-direction:column;gap:12px}
        .ah-faq details{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:4px 20px}
        .ah-faq summary{cursor:pointer;list-style:none;padding:16px 0;font-family:var(--font-display);font-size:1.1rem;color:var(--white);display:flex;justify-content:space-between;align-items:center;gap:14px}
        .ah-faq summary::-webkit-details-marker{display:none}
        .ah-faq summary::after{content:"+";color:var(--violet);font-size:1.5rem;transition:transform .2s}
        .ah-faq details[open] summary::after{transform:rotate(45deg)}
        .ah-faq details p{margin:0 0 18px;color:rgba(232,228,240,0.72);line-height:1.68}
        .ah-band{background:linear-gradient(150deg,rgba(107,47,212,.18),var(--card));border:1px solid var(--line);border-radius:22px;padding:48px 32px;text-align:center;max-width:900px;margin:0 auto}
        .ah-band h2{font-family:var(--font-display);font-size:clamp(1.7rem,3.6vw,2.5rem);font-weight:800;margin-bottom:14px}
        .ah-band h2 em{font-style:italic;background:linear-gradient(135deg,#c9b8ff,#f0b84a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .ah-band p{color:rgba(232,228,240,0.72);max-width:48ch;margin:0 auto 24px}
      `}</style>

      <nav className={`ah-nav${scrolled ? " on" : ""}`}>
        <div className="ah-c" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" className="ah-logo">
            <Image src="/mascot.png" alt="BluntChart logo" width={34} height={34} style={{ borderRadius: "50%" }} />
            <span className="g">BluntChart</span>
          </Link>
          <div className="ah-nav-links">
            <Link href="/free-birth-chart">Free birth chart</Link>
            <a href="#glance">Compare</a>
            <a href="#faq">FAQ</a>
            <Link href="/#try-it" className="ah-cta">Get reading · $15</Link>
          </div>
        </div>
      </nav>

      <header className="ah-hero">
        <div className="ah-c">
          <div className="ah-crumb">
            <Link href="/">BluntChart</Link>
            <span className="sep">/</span>
            <span className="here">Astrology app alternatives</span>
          </div>
          <div className="ah-eyebrow">✦ Best astrology app alternatives · 2026</div>
          <h1 className="ah-h1">The best <em>astrology app alternatives</em> in 2026</h1>
          <p className="ah-sub">
            The honest comparison to Co-Star, The Pattern, CHANI, Nebula and Sanctuary. Same accurate sky, completely
            different job: one deep natal chart reading, ~1,500 words in plain language, a flat one-time <b>$15</b>, no subscription trap.
          </p>
          <div className="ah-cta-row">
            <Link href="/#try-it" className="ah-btn ah-btn-primary">Get my free preview ✨</Link>
            <a href="#glance" className="ah-btn ah-btn-ghost">Compare all 5 at a glance ↓</a>
          </div>

          <div className="ah-hero-img">
            <Image
              src="/bluntchart-mockup.png"
              alt="BluntChart brutally honest natal chart reading — the astrology app alternative preview mockup"
              width={900}
              height={600}
              priority
            />
          </div>
        </div>
      </header>

      {/* AEO ANSWER */}
      <section className="ah-sec" style={{ paddingTop: 20 }}>
        <div className="ah-c">
          <div className="ah-answer">
            <div className="ah-answer-tag">The short answer</div>
            <p>
              If you&apos;re looking for the <strong>best astrology app alternative in 2026</strong>, it depends what you&apos;re leaving.
              For <strong>depth over daily notifications</strong>, BluntChart is the strongest Co-Star and The Pattern alternative.
              For a <strong>brutally honest reading with no subscription trap</strong>, it&apos;s the leading Nebula and CHANI alternative.
              For the depth of a real reading <strong>without a per-minute meter</strong>, it&apos;s the top Sanctuary alternative.
              One full ~1,500-word natal chart reading, flat one-time <strong>$15</strong>, no auto-renewal, nothing to cancel.
            </p>
          </div>
        </div>
      </section>

      {/* THE 5 CARDS */}
      <section className="ah-sec">
        <div className="ah-c">
          <div className="ah-divider">✦</div>
          <div className="ah-kicker">The alternatives</div>
          <h2 className="ah-h2">Pick the app you&apos;re <em>leaving</em></h2>
          <p className="ah-lede">
            Each comparison is written specifically for the app you&apos;re switching from — its actual strengths, its actual paywall,
            and what you get from BluntChart instead. If we skipped the strengths, we&apos;d be doing exactly what the vague apps do.
          </p>
          <div className="ah-grid">
            {CARDS.map((c) => <CompetitorCard key={c.slug} card={c} />)}
          </div>
        </div>
      </section>

      {/* AT-A-GLANCE COMPARISON */}
      <section className="ah-sec" id="glance">
        <div className="ah-c">
          <div className="ah-divider">✦</div>
          <div className="ah-kicker">At a glance</div>
          <h2 className="ah-h2">All 5 astrology apps, <em>side by side</em></h2>
          <p className="ah-lede">
            The high-level differences. Every &ldquo;yes,&rdquo; &ldquo;no&rdquo; and pricing note below is expanded on the individual comparison page.
          </p>
          <div className="ah-glance">
            <table>
              <thead>
                <tr>
                  <th>App</th>
                  <th>Pricing model</th>
                  <th>Reading format</th>
                  <th>Subscription trap</th>
                  <th>Best for</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>BluntChart</td>
                  <td><span className="yes">Flat $15</span>, one-time</td>
                  <td>~1,500-word written reading</td>
                  <td><span className="yes">None</span></td>
                  <td>One honest reading of your whole chart</td>
                </tr>
                <tr>
                  <td>Co-Star</td>
                  <td>Free tier + Co-Star Plus (~$15/mo)</td>
                  <td>Short daily notifications</td>
                  <td>Monthly sub for depth</td>
                  <td>Daily habit, friend charts</td>
                </tr>
                <tr>
                  <td>The Pattern</td>
                  <td>Recurring subscription</td>
                  <td>Bite-size sections, no astrology shown</td>
                  <td>Yes</td>
                  <td>Psychology-style relationship reading</td>
                </tr>
                <tr>
                  <td>CHANI</td>
                  <td>~$11.99/mo subscription</td>
                  <td>Weekly written, human astrologers</td>
                  <td>Yes</td>
                  <td>Gentle, values-driven wellness</td>
                </tr>
                <tr>
                  <td>Sanctuary</td>
                  <td>~$4.99 intro then per-minute</td>
                  <td>Live human readings on the clock</td>
                  <td>Variable-cost meter</td>
                  <td>Ask-anything live sessions</td>
                </tr>
                <tr>
                  <td>Nebula</td>
                  <td>Free trial → auto-renewing sub + credit packs</td>
                  <td>Bundle: astrology, tarot, numerology, psychics</td>
                  <td>Yes (free-trial → billing)</td>
                  <td>All-in-one spiritual bundle</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p style={{ color: "rgba(232,228,240,0.35)", fontSize: 12.5 }}>
            App pricing, subscription terms and paywall structure vary by platform and region and change over time. Figures reflect publicly reported terms at time of writing.
            Always verify current App Store terms before subscribing to any app.
          </p>
        </div>
      </section>

      {/* WHY THIS EXISTS */}
      <section className="ah-sec">
        <div className="ah-c">
          <div className="ah-divider">✦</div>
          <div className="ah-kicker">Why this hub exists</div>
          <h2 className="ah-h2" style={{ margin: "0 auto 20px" }}>Why the market <em>needed</em> another astrology app — and why it looks like this</h2>
          <div className="ah-copy">
            <p>
              Most astrology apps in 2026 fall into one of three traps. The <strong>daily-notification apps</strong> (Co-Star) trained a whole generation
              on 30-word insights and never delivered the full chart. The <strong>bundle apps</strong> (Nebula) stack tarot, numerology and paid psychic
              chats behind a free trial that quietly converts to an auto-renewing subscription. The <strong>wellness apps</strong> (CHANI, The Pattern) do
              deeper work but frame it in soft, affirming, subscription-gated language that avoids the parts of a chart you actually needed to hear.
            </p>
            <p>
              BluntChart is the alternative to all three: one focused product, one flat price, one long reading of your <em>whole</em> chart —
              planets, houses and aspects — written in plain, brutally honest language, with none of the parts other apps won&apos;t touch.
              No trial to cancel, no card taken for the free preview, nothing renews.
            </p>
            <h3>What every page in this hub has in common</h3>
            <p>
              Each comparison page includes: an honest &ldquo;credit where it&apos;s due&rdquo; section for the incumbent, a full head-to-head table,
              a genuine sample of the reading you&apos;d get, a &ldquo;honestly, some people should stay on X&rdquo; note, an FAQ built from the
              actual questions people ask before switching, and a founder note. If any of it reads as unfair to the competitor, tell us and we&apos;ll fix it.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="ah-sec" id="faq">
        <div className="ah-c">
          <div className="ah-divider">✦</div>
          <div className="ah-kicker">Common questions</div>
          <h2 className="ah-h2">Alternatives, <em>answered</em></h2>
          <div className="ah-faq">
            <details open>
              <summary>What is the best astrology app alternative in 2026?</summary>
              <p>It depends what you&apos;re leaving. For depth over daily notifications, BluntChart is the strongest <Link href="/co-star-alternative">Co-Star alternative</Link> and <Link href="/the-pattern-alternative">The Pattern alternative</Link>. For an honest reading with no subscription trap, it&apos;s the leading <Link href="/nebula-alternative">Nebula alternative</Link> and <Link href="/chani-alternative">CHANI alternative</Link>. For the depth of a real reading without a per-minute meter, it&apos;s the top <Link href="/sanctuary-alternative">Sanctuary alternative</Link>.</p>
            </details>
            <details>
              <summary>Is BluntChart really no subscription?</summary>
              <p>Yes. BluntChart is a single one-time $15 charge. No free trial that converts to billing, no stored card, no auto-renewal, and nothing to cancel. You pay once, receive your full natal chart reading by email, and it&apos;s yours forever.</p>
            </details>
            <details>
              <summary>How is BluntChart different from Co-Star, CHANI, The Pattern, Nebula and Sanctuary?</summary>
              <p>Co-Star is a daily notification; BluntChart is one deep reading. CHANI is affirming and gentle; BluntChart is brutally honest. The Pattern hides the astrology; BluntChart shows the placement behind each pattern. Nebula bundles tarot, palmistry and psychic chats on a subscription; BluntChart does one thing — your full natal chart, read straight, for a flat $15. Sanctuary bills live readers by the minute; BluntChart is a written reading at a fixed price you know before you start.</p>
            </details>
            <details>
              <summary>Which astrology app has no auto-renewal or free-trial trap?</summary>
              <p>BluntChart doesn&apos;t take a card for the free preview and never auto-renews. It&apos;s a flat one-time $15 with nothing to cancel — the honest alternative to any astrology app with a subscription that quietly renews after a free trial.</p>
            </details>
            <details>
              <summary>Can I try any of these alternatives free before paying?</summary>
              <p>Yes — BluntChart gives you two free preview insights with no account and no card. You only pay the flat one-time $15 for the full reading with all deeper insights, your natal chart wheel and a shareable card.</p>
            </details>
            <details>
              <summary>Is BluntChart AI-generated?</summary>
              <p>Yes. The chart itself is calculated from a high-precision astronomical ephemeris (same data class as professional astrologers use), then interpreted by AI built specifically to read your exact placements in plain, brutally honest language — not template horoscope text.</p>
            </details>
            <details>
              <summary>Which astrology app is most accurate?</summary>
              <p>For raw planet positions, most reputable apps use high-precision astronomical data, so the numbers are close. The real difference is interpretation. BluntChart reads your whole chart — planets, houses and aspects — in ~1,500 words specific to you, rather than short daily fragments.</p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className="ah-sec">
        <div className="ah-c">
          <div className="ah-band">
            <h2>One reading. One time. <em>Fifteen dollars.</em></h2>
            <p>Two free insights, no account, no card. If it reads you, the full thing is $15 — once. No subscription, no auto-renewal, nothing to cancel.</p>
            <Link href="/#try-it" className="ah-btn ah-btn-primary">Read my chart — free preview ✨</Link>
            <p style={{ marginTop: 18, fontSize: 13, color: "rgba(232,228,240,0.4)" }}>
              For entertainment purposes only · Not professional advice
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
