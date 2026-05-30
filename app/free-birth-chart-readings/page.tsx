"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import Link from "next/link";
import type { Metadata } from "next";

// ─── SEO METADATA (export from a separate metadata.ts or layout.ts) ──────────
// Export this from your page's metadata file:
// export const metadata: Metadata = {
//   title: "Free Birth Chart Calculator — Accurate Natal Chart with Degrees & Placements | BluntChart",
//   description: "Get your free birth chart with exact degrees, planet placements, and house positions. Plus a brutally honest personalized reading and shareable identity card. No signup required.",
//   keywords: "free birth chart, birth chart calculator, natal chart, free natal chart, natal chart calculator, birth chart reading, astrology chart free, sun moon rising calculator, birth chart with houses, personalized birth chart, accurate birth chart online, birth chart interpretation, free astrology chart, astrology birth chart calculator, rising sign calculator, moon sign calculator, big three astrology",
//   openGraph: {
//     title: "Free Birth Chart Calculator — Accurate Natal Chart | BluntChart",
//     description: "Get your free birth chart with exact degrees and placements. Plus a brutally honest personalized reading that actually sounds like you.",
//     url: "https://bluntchart.com/free-birth-chart",
//     siteName: "BluntChart",
//     type: "website",
//   },
//   alternates: { canonical: "https://bluntchart.com/free-birth-chart" },
// };

// ─── STATIC DATA ───────────────────────────────────────────────────────────────

const WHAT_YOU_GET = [
  {
    num: "01",
    icon: "🪐",
    title: "Your Full Natal Chart — Exact Degrees & Placements",
    body: "We calculate your complete birth chart using a high-precision ephemeris (Astronomy Engine) — the same library-grade solar system model used in professional astronomy software. Every planet, every house cusp, every degree. Your Sun, Moon, Rising, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, and Pluto — all placed in the correct signs, houses, and degrees specific to your exact birth moment.",
    tag: "FREE",
  },
  {
    num: "02",
    icon: "🔮",
    title: "10 Brutally Honest Personalized Insights",
    body: "Not generic horoscope fluff. Not \"you're creative and sensitive.\" Ten deep, specific insights written to YOUR exact chart placements — the kind that make you put your phone down and stare at the ceiling. Two are free. The other eight? They're the ones that say what no one else will.",
    tag: "2 FREE + 8 PAID",
  },
  {
    num: "03",
    icon: "✦",
    title: "Your Shareable Identity Card",
    body: "A beautifully designed card with your name, your sign, and one truth your chart picked specifically for you. Made to screenshot. Made to post. Made to send to that friend who needs to hear it too.",
    tag: "WITH FULL READING",
  },
];

const PLANET_BREAKDOWN = [
  { glyph: "☉", name: "Sun Sign", meaning: "Your core identity — who you are when no one is performing", color: "#F0B84A" },
  { glyph: "☽", name: "Moon Sign", meaning: "Your emotional blueprint — what you need but rarely ask for", color: "#c4a8ff" },
  { glyph: "↑", name: "Rising Sign (Ascendant)", meaning: "The mask the world sees — before you even open your mouth", color: "#d4537e" },
  { glyph: "☿", name: "Mercury", meaning: "How your mind works — and how it trips you up", color: "#5dcaa5" },
  { glyph: "♀", name: "Venus", meaning: "Who you attract, what you crave, and why you keep choosing it", color: "#f0a0b8" },
  { glyph: "♂", name: "Mars", meaning: "Where your energy goes — and what makes you snap", color: "#e8854a" },
  { glyph: "♃", name: "Jupiter", meaning: "Where your luck lives — and why you keep looking in the wrong place", color: "#F0B84A" },
  { glyph: "♄", name: "Saturn", meaning: "The lesson your chart keeps forcing you to learn", color: "#8a7fad" },
];

const FAQS_BIRTH_CHART = [
  {
    q: "What is a birth chart?",
    a: "A birth chart (also called a natal chart or astrology chart) is a map of exactly where every planet was at the precise moment and place you were born. It's calculated using your date of birth, exact time of birth, and city of birth. Unlike your Sun sign alone, your birth chart includes your Moon sign, Rising sign (Ascendant), and the positions of Mercury, Venus, Mars, Jupiter, Saturn, and more — each in a specific zodiac sign and house. It's the most personal tool in astrology.",
  },
  {
    q: "How is a birth chart different from a horoscope?",
    a: "A horoscope is based only on your Sun sign — one of twelve options shared by millions of people. A birth chart is calculated using your exact birth time, date, and location, making it unique to you. Your birth chart shows the degree and house placement of every planet, and the angular relationships (aspects) between them. It's the difference between reading a fortune cookie and reading a map drawn specifically for your life.",
  },
  {
    q: "Why do I need my exact birth time for an accurate birth chart?",
    a: "Your birth time determines your Rising sign (Ascendant) and all twelve house placements. The Ascendant changes roughly every two hours, so even siblings born on the same day can have completely different charts. Without your birth time, we lose the most personal layer of your chart. Your birth certificate almost always has it. If you genuinely can't find it, enter 12:00 noon — but know that the Rising sign and house positions may be off.",
  },
  {
    q: "What's included in BluntChart's free birth chart?",
    a: "You get your complete natal chart calculated with a high-precision ephemeris (Astronomy Engine), showing all planetary positions with exact degrees and house placements. You also get two free personalized reading insights — not generic descriptions, but specific truths your chart wants you to hear. The full reading (8 more insights, natal chart wheel, and your shareable identity card) is $15 one-time.",
  },
  {
    q: "Is the BluntChart birth chart calculator accurate?",
    a: "Yes. We use Astronomy Engine, a high-precision ephemeris — the same library-grade solar system model used in serious astronomy software. Planet positions are calculated to arc-minute precision for your exact birth time and coordinates. We geocode your birth city to exact latitude and longitude, and resolve the correct timezone historically. This is not a lookup table. It's a real-time astronomical calculation.",
  },
  {
    q: "What are the 'Big Three' in astrology?",
    a: "Your Big Three are your Sun sign, Moon sign, and Rising sign (Ascendant). Your Sun sign represents your core identity. Your Moon sign reveals your emotional inner world. Your Rising sign is how others perceive you at first glance. Together, they form the foundation of your birth chart and personality. BluntChart calculates all three with exact degrees as part of your free birth chart.",
  },
  {
    q: "How is BluntChart different from Co-Star or Cafe Astrology?",
    a: "Co-Star gives you brief, often cryptic daily notifications. Cafe Astrology gives you raw chart data with textbook interpretations. BluntChart gives you a deep, personalized reading — around 1,500 words — written in plain language with a tone that doesn't sugarcoat what your chart actually says. It's not a daily app. It's one honest conversation with your chart, plus a shareable identity card you'll actually want to post.",
  },
  {
    q: "Can I get a birth chart without creating an account?",
    a: "Yes. BluntChart requires no account, no app download, and no subscription. Enter your birth details, get your free preview instantly. If you want the full reading, it's a one-time $15 payment — delivered to your email immediately. No strings.",
  },
];

const REVIEWS_SHORT = [
  { text: "I've used Co-Star, The Pattern, Sanctuary... none said anything I didn't already know. This one said things I hadn't told anyone.", name: "Michelle R.", meta: "Scorpio Sun, Cancer Moon", init: "M" },
  { text: "Way more accurate than Co-Star ever was. And it didn't sugarcoat the parts I wasn't ready to hear.", name: "Sophie K.", meta: "Aries Sun, Pisces Moon", init: "S" },
  { text: "I felt attacked. In a good way. My therapist has been saying the same thing for six months. My birth chart said it better in one paragraph.", name: "Dani L.", meta: "Capricorn Sun, Gemini Moon", init: "D" },
];

// ─── FAQ COMPONENT ─────────────────────────────────────────────────────────────

function FAQSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      {FAQS_BIRTH_CHART.map((f, i) => (
        <div key={i} style={{ borderBottom: "0.5px solid rgba(255,255,255,0.08)" }}>
          <button
            onClick={() => setOpen((p) => (p === i ? null : i))}
            style={{
              width: "100%", background: "transparent", border: "none", padding: "22px 0",
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
              cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            }}
          >
            <span style={{ fontSize: "0.97rem", fontWeight: 600, color: "#e8e4f0", lineHeight: 1.45, flex: 1 }}>
              {f.q}
            </span>
            <span
              style={{
                width: 26, height: 26, borderRadius: "50%",
                border: "0.5px solid rgba(255,255,255,0.12)", display: "flex", alignItems: "center",
                justifyContent: "center", flexShrink: 0, fontSize: 14, color: "#6b2fd4", fontWeight: 700,
                background: open === i ? "rgba(107,47,212,0.12)" : "transparent", transition: "all .2s",
              }}
            >
              {open === i ? "−" : "+"}
            </span>
          </button>
          <div
            style={{
              maxHeight: open === i ? 500 : 0, overflow: "hidden",
              transition: "max-height .35s cubic-bezier(.4,0,.2,1)",
            }}
          >
            <p style={{ fontSize: "0.89rem", color: "rgba(232,228,240,0.65)", lineHeight: 1.78, paddingBottom: 22, paddingRight: 40 }}>
              {f.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── SECTION DIVIDER ───────────────────────────────────────────────────────────

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <span style={{ display: "block", width: 22, height: 1, background: "#F0B84A" }} />
      <span style={{ fontSize: ".7rem", fontWeight: 700, letterSpacing: ".16em", textTransform: "uppercase" as const, color: "#F0B84A" }}>
        {label}
      </span>
    </div>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────

export default function FreeBirthChartPage() {
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
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:.5;transform:translate(-50%,-55%) scale(1)}50%{opacity:1;transform:translate(-50%,-55%) scale(1.03)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        .c{max-width:1100px;margin:0 auto;padding:0 24px}
        section{position:relative;z-index:1}

        /* NAV */
        .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;transition:all .3s}
        .nav.on{background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
        .nav-i{display:flex;align-items:center;justify-content:space-between}
        .logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;letter-spacing:.02em}
        .logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .nl{display:flex;align-items:center;gap:28px;list-style:none}
        .nl a{font-size:.83rem;font-weight:500;color:var(--dim);text-decoration:none;letter-spacing:.04em;text-transform:uppercase;transition:color .2s}
        .nl a:hover{color:var(--white)}
        .ncta{color:var(--gold)!important;border:1px solid var(--gold-dim);padding:6px 15px;border-radius:4px}
        .ncta:hover{background:var(--gold-dim)}

        /* BUTTONS */
        .bp{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;background:linear-gradient(135deg,#6b2fd4,#d4537e);color:#fff;font-family:inherit;font-size:.88rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;border:none;border-radius:10px;cursor:pointer;transition:opacity .2s,transform .15s}
        .bp:hover{opacity:.88;transform:translateY(-1px)}
        .bs{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;background:transparent;color:var(--white);font-family:inherit;font-size:.88rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;border:1px solid var(--border2);border-radius:10px;cursor:pointer;transition:all .2s}
        .bs:hover{border-color:rgba(255,255,255,.22);background:var(--faint);transform:translateY(-1px)}

        /* HERO */
        .fbc-hero{min-height:80vh;display:flex;align-items:center;padding-top:110px;padding-bottom:80px;overflow:hidden;position:relative}
        .fbc-hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% -10%,rgba(107,47,212,.12) 0%,transparent 50%),radial-gradient(ellipse 40% 40% at 80% 70%,rgba(212,83,126,.06) 0%,transparent 60%);pointer-events:none}
        .fbc-hero-orb{position:absolute;top:50%;left:50%;transform:translate(-50%,-55%);width:480px;height:480px;border-radius:50%;border:1px solid rgba(107,47,212,.08);background:radial-gradient(circle,rgba(107,47,212,.04) 0%,transparent 50%);animation:pulse 8s ease-in-out infinite;pointer-events:none}
        .fbc-hero-inner{position:relative;z-index:1;max-width:820px;margin:0 auto;text-align:center}

        h1{font-family:var(--font-display);font-size:clamp(2.6rem,6.5vw,4.6rem);font-weight:900;line-height:1.08;letter-spacing:-.02em;animation:fadeUp .6s .1s ease both}
        h1 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        h2{font-family:var(--font-display);font-size:clamp(2rem,4.5vw,3.1rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:12px}
        h2 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        h3{font-family:var(--font-display);font-size:1.4rem;font-weight:700;line-height:1.2;margin-bottom:8px}
        .sub{font-size:1rem;color:var(--dim);max-width:540px;line-height:1.72}

        .sec{padding:96px 0}
        .dk{background:#0d0d18;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}

        /* BREADCRUMB */
        .breadcrumb{font-size:.78rem;color:rgba(232,228,240,0.35);margin-bottom:24px;animation:fadeUp .5s ease both}
        .breadcrumb a{color:rgba(232,228,240,0.45);text-decoration:none;transition:color .2s}
        .breadcrumb a:hover{color:var(--gold)}

        /* TRUST BAR */
        .trust-bar{display:flex;align-items:center;justify-content:center;gap:28px;flex-wrap:wrap;margin-top:36px;animation:fadeUp .6s .35s ease both}
        .trust-item{display:flex;align-items:center;gap:8px;font-size:.82rem;color:var(--dim)}
        .trust-item strong{color:var(--white)}
        .trust-dot{width:3px;height:3px;border-radius:50%;background:rgba(240,184,74,.3)}

        /* WHAT YOU GET CARDS */
        .wyg-grid{display:grid;grid-template-columns:1fr;gap:24px;margin-top:48px}
        .wyg-card{position:relative;background:linear-gradient(165deg,rgba(12,10,22,0.95),rgba(18,12,32,0.88));border:0.5px solid rgba(107,47,212,0.2);border-radius:20px;padding:36px 32px;overflow:hidden;transition:border-color .3s,transform .2s}
        .wyg-card:hover{border-color:rgba(107,47,212,0.45);transform:translateY(-2px)}
        .wyg-card-tag{position:absolute;top:20px;right:20px;font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;padding:4px 12px;border-radius:100px}
        .wyg-card-tag.free{color:#1a0a00;background:var(--gold)}
        .wyg-card-tag.mixed{color:#5dcaa5;background:rgba(93,202,165,0.12);border:0.5px solid rgba(93,202,165,0.3)}
        .wyg-card-tag.paid{color:var(--rose);background:rgba(212,83,126,0.1);border:0.5px solid rgba(212,83,126,0.25)}
        .wyg-num{font-family:var(--font-display);font-size:3rem;font-weight:900;color:rgba(107,47,212,0.15);line-height:1;margin-bottom:8px}
        .wyg-icon{font-size:28px;margin-bottom:12px;display:block}
        .wyg-title{font-family:var(--font-display);font-size:1.25rem;font-weight:700;color:#f0ece8;margin-bottom:12px;line-height:1.3}
        .wyg-body{font-size:.92rem;color:rgba(232,228,240,0.6);line-height:1.72}

        /* PLANET GRID */
        .planet-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:40px}
        .planet-card{display:flex;align-items:flex-start;gap:14px;padding:18px 20px;background:var(--card);border:0.5px solid var(--border);border-radius:14px;transition:border-color .2s,transform .2s}
        .planet-card:hover{border-color:rgba(107,47,212,0.3);transform:translateY(-1px)}
        .planet-glyph{font-size:22px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:10px;flex-shrink:0;font-family:serif}
        .planet-name{font-size:.85rem;font-weight:700;color:var(--white);margin-bottom:2px}
        .planet-meaning{font-size:.8rem;color:rgba(232,228,240,0.4);line-height:1.5}

        /* EMOTIONAL CTA SECTION */
        .emo-cta{position:relative;overflow:hidden;border-radius:24px;padding:56px 40px;text-align:center;margin-top:64px;background:linear-gradient(165deg,rgba(107,47,212,0.08),rgba(212,83,126,0.06));border:0.5px solid rgba(107,47,212,0.2)}
        .emo-cta::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 60% 50% at 50% 0%,rgba(240,184,74,0.04) 0%,transparent 60%);pointer-events:none}
        .emo-cta h2{margin-bottom:16px}
        .emo-cta p{font-size:1.05rem;color:rgba(232,228,240,0.6);line-height:1.75;max-width:560px;margin:0 auto 32px}

        /* IMAGES SHOWCASE */
        .showcase-grid{display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:center;margin-top:56px}
        .showcase-img{border-radius:18px;overflow:hidden;border:0.5px solid rgba(107,47,212,0.2);box-shadow:0 20px 60px rgba(0,0,0,0.4)}
        .showcase-img img{width:100%;height:auto;display:block}
        .showcase-text h3{font-size:1.5rem;margin-bottom:12px;color:#f0ece8}
        .showcase-text p{font-size:.93rem;color:rgba(232,228,240,0.55);line-height:1.72;margin-bottom:16px}

        /* REVIEWS */
        .rev-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:48px}
        .rev-card{background:var(--card);border:0.5px solid var(--border);border-radius:14px;padding:26px;transition:border-color .2s,transform .2s;position:relative;overflow:hidden}
        .rev-card::before{content:'"';position:absolute;top:-12px;right:18px;font-family:var(--font-display);font-size:5rem;color:rgba(107,47,212,.1);line-height:1;pointer-events:none}
        .rev-card:hover{border-color:rgba(107,47,212,.3);transform:translateY(-2px)}

        /* HOW IT WORKS */
        .hiw-steps{display:grid;grid-template-columns:repeat(3,1fr);gap:24px;margin-top:48px}
        .hiw-step{text-align:center;padding:28px 22px;background:var(--card);border:0.5px solid var(--border);border-radius:16px;transition:border-color .2s}
        .hiw-step:hover{border-color:rgba(107,47,212,0.25)}
        .hiw-num{font-family:var(--font-display);font-size:2.5rem;font-weight:900;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1;margin-bottom:12px}
        .hiw-title{font-size:.95rem;font-weight:700;color:var(--white);margin-bottom:6px}
        .hiw-desc{font-size:.83rem;color:var(--dim);line-height:1.6}

        /* SEO CONTENT */
        .seo-content{max-width:760px;margin:0 auto}
        .seo-content h2{font-size:clamp(1.6rem,3vw,2.2rem);margin-bottom:16px;margin-top:48px}
        .seo-content h2:first-child{margin-top:0}
        .seo-content p{font-size:.93rem;color:rgba(232,228,240,0.55);line-height:1.78;margin-bottom:16px}
        .seo-content strong{color:rgba(232,228,240,0.8)}

        /* FOOTER */
        .footer{border-top:1px solid var(--border);padding:48px 0 30px;position:relative;z-index:1}
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

        /* SCHEMA STRUCTURED DATA STYLING */
        .schema-hidden{display:none}

        @media(max-width:900px){
          .showcase-grid{grid-template-columns:1fr;gap:40px}
          .planet-grid{grid-template-columns:1fr}
          .rev-grid{grid-template-columns:1fr}
          .hiw-steps{grid-template-columns:1fr}
        }
        @media(max-width:768px){
          .nl{display:none}
          .fbc-hero{padding-top:90px;padding-bottom:64px}
          .fbc-hero-orb{width:280px;height:280px}
          .trust-bar{flex-direction:column;gap:10px}
          .fi{flex-direction:column;gap:28px}
          .fb2{flex-direction:column;align-items:flex-start}
          .emo-cta{padding:40px 24px}
        }
        @media(max-width:480px){
          .sec{padding:72px 0}
          .c{padding:0 16px}
          .wyg-card{padding:28px 22px}
        }
      `}</style>

      {/* ── JSON-LD STRUCTURED DATA ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS_BIRTH_CHART.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "BluntChart Free Birth Chart Calculator",
            url: "https://bluntchart.com/free-birth-chart",
            applicationCategory: "LifestyleApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              description: "Free birth chart calculation with 2 personalized reading insights",
            },
          }),
        }}
      />

      {/* ── NAV ── */}
      <nav className={`nav${scrolled ? " on" : ""}`}>
        <div className="c nav-i">
          <Link className="logo" href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Image src="/mascot.png" alt="BluntChart mascot" width={34} height={34} style={{ borderRadius: "50%" }} />
            <span className="g">BluntChart</span>
          </Link>
          <ul className="nl">
            <li><Link href="/#try-it">Try Free</Link></li>
            <li><Link href="/#reveals">What We Reveal</Link></li>
            <li><Link href="/#reviews">Reviews</Link></li>
            <li><Link href="/#compare">vs Co-Star</Link></li>
            <li><Link className="ncta" href="/#try-it">Get Reading $15</Link></li>
          </ul>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO — Primary H1 keyword: "Free Birth Chart"
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="fbc-hero">
        <div className="fbc-hero-bg" />
        <div className="fbc-hero-orb" />
        <div className="c">
          <div className="fbc-hero-inner">
            <div className="breadcrumb">
              <Link href="/">BluntChart</Link> &nbsp;/&nbsp; Free Birth Chart Calculator
            </div>
            <div style={{ marginBottom: 20 }}>
              <Image src="/mascot.png" alt="BluntChart cosmic cat mascot" width={100} height={100} priority
                style={{ margin: "0 auto", filter: "drop-shadow(0 0 25px rgba(107,47,212,.35))" }} />
            </div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, fontSize: ".73rem", fontWeight: 700,
              letterSpacing: ".14em", textTransform: "uppercase" as const, color: "#F0B84A", marginBottom: 24,
              padding: "5px 14px", border: "1px solid rgba(240,184,74,0.18)", borderRadius: 100,
              background: "rgba(240,184,74,.06)", animation: "fadeUp .6s ease both",
            }}>
              ✦ 100% Free · No signup · Instant results
            </div>

            <h1>
              Free Birth Chart<br />
              <em>Calculator</em>
            </h1>

            <p style={{
              fontFamily: "var(--font-display)", fontSize: "clamp(1.2rem,2.5vw,1.6rem)",
              fontStyle: "italic", color: "var(--dim)", margin: "10px 0 18px",
              animation: "fadeUp .6s .15s ease both",
            }}>
              Your natal chart, calculated to the degree. Your truth, written without a filter.
            </p>

            <p style={{
              fontSize: "1.05rem", color: "var(--dim)", maxWidth: 560, margin: "0 auto 32px",
              lineHeight: 1.72, animation: "fadeUp .6s .2s ease both",
            }}>
              Enter your birth date, exact time, and place of birth. Get your complete natal chart with
              precise planetary positions, house placements, and two free personalized insights that
              tell you what your chart <em>actually</em> says — not what you want to hear.
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14, flexWrap: "wrap", animation: "fadeUp .6s .25s ease both" }}>
              <Link className="bp" href="/#try-it">Calculate My Free Birth Chart ✨</Link>
              <a className="bs" href="#what-you-get">See What You Get ↓</a>
            </div>

            <div className="trust-bar">
              <span className="trust-item"><strong>Astronomy Engine</strong>&nbsp;precision</span>
              <span className="trust-dot" />
              <span className="trust-item">No account needed</span>
              <span className="trust-dot" />
              <span className="trust-item">2 free personalized insights</span>
              <span className="trust-dot" />
              <span className="trust-item">Full reading <strong>$15</strong> one-time</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WHAT YOU GET — Three offerings
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="sec dk" id="what-you-get">
        <div className="c">
          <SectionLabel label="What your free birth chart includes" />
          <h2>Not just a chart.<br /><em>A wake-up call.</em></h2>
          <p className="sub">
            Most free birth chart calculators give you a wheel and leave you to figure it out.
            We give you the chart, the reading, and the truth — in plain language you&apos;ll actually feel.
          </p>

          <div className="wyg-grid">
            {WHAT_YOU_GET.map((item) => (
              <div className="wyg-card" key={item.num}>
                <span className={`wyg-card-tag ${item.tag === "FREE" ? "free" : item.tag.includes("FREE") ? "mixed" : "paid"}`}>
                  {item.tag}
                </span>
                <div className="wyg-num">{item.num}</div>
                <span className="wyg-icon">{item.icon}</span>
                <div className="wyg-title">{item.title}</div>
                <div className="wyg-body">{item.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SHOWCASE — Images of reading + shareable card
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="sec" id="preview">
        <div className="c">
          <SectionLabel label="See what it looks like" />
          <h2>Your reading.<br /><em>Your card.</em></h2>
          <p className="sub">
            A real reading for a real chart. Not a paragraph copied from a Sun sign book.
            And a card you&apos;ll actually want to share.
          </p>

          <div className="showcase-grid">
            <div>
              <div className="showcase-img">
                <Image
                  src="/readings-bluntchart.png"
                  alt="BluntChart personalized birth chart reading showing brutally honest insights for Sun, Moon, Venus, and Saturn placements"
                  width={600}
                  height={700}
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
            <div className="showcase-text">
              <h3 style={{ fontFamily: "var(--font-display)" }}>
                10 insights that hit different
              </h3>
              <p>
                Each insight is written to your <strong style={{ color: "rgba(232,228,240,0.85)" }}>exact planetary placements</strong> — not your Sun sign, not your zodiac stereotype.
                Your Mercury in the 12th house. Your Venus in Capricorn. Your Saturn return.
              </p>
              <p>
                Two insights are free. The other eight say the things you already know but haven&apos;t
                admitted yet. The thing about the partner you keep choosing. The reason you
                self-sabotage when things are going well. The pattern you thought no one noticed.
              </p>
              <p style={{ color: "rgba(240,184,74,0.85)", fontStyle: "italic", fontSize: ".9rem" }}>
                &ldquo;My therapist has been saying the same thing for six months. My birth chart said it better in one paragraph.&rdquo;
              </p>

              <div style={{ marginTop: 32 }}>
                <div className="showcase-img" style={{ maxWidth: 320 }}>
                  <Image
                    src="/shareable-card.png"
                    alt="BluntChart shareable identity card showing personalized astrology insight with zodiac sign"
                    width={400}
                    height={460}
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
                <p style={{ marginTop: 14, fontSize: ".85rem", color: "rgba(232,228,240,0.4)" }}>
                  Your shareable identity card — screenshot it, story it, send it.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          PLANET BREAKDOWN — Keywords: sun sign, moon sign, rising sign, etc.
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="sec dk" id="planets">
        <div className="c">
          <SectionLabel label="Every planet in your birth chart" />
          <h2>Your chart reads<br /><em>all of you.</em></h2>
          <p className="sub">
            Your Sun sign is one data point. Your birth chart has dozens. Here&apos;s what we calculate
            and what each placement actually means for you.
          </p>

          <div className="planet-grid">
            {PLANET_BREAKDOWN.map((p, i) => (
              <div className="planet-card" key={i}>
                <div className="planet-glyph" style={{ background: `${p.color}15`, color: p.color }}>
                  {p.glyph}
                </div>
                <div>
                  <div className="planet-name">{p.name}</div>
                  <div className="planet-meaning">{p.meaning}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 32, padding: "18px 22px", background: "var(--card)",
            border: "0.5px solid var(--border)", borderRadius: 14,
            display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
          }}>
            <span style={{ fontSize: 13, color: "rgba(232,228,240,0.45)" }}>
              <span style={{ color: "#5dcaa5", fontWeight: 700 }}>✓</span> Plus: Uranus, Neptune, Pluto, North Node, house cusps, and major aspects — all calculated to exact degrees
            </span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          HOW IT WORKS
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="sec" id="how-it-works">
        <div className="c">
          <SectionLabel label="How it works" />
          <h2>Three steps.<br /><em>Two minutes.</em></h2>
          <p className="sub">
            No account. No app. No subscription. Just your birth details and
            a reading that actually says something.
          </p>

          <div className="hiw-steps">
            <div className="hiw-step">
              <div className="hiw-num">1</div>
              <div className="hiw-title">Enter your birth details</div>
              <div className="hiw-desc">
                Date of birth, exact time (from your birth certificate), and city of birth.
                We geocode your location to exact coordinates and resolve the historical timezone.
              </div>
            </div>
            <div className="hiw-step">
              <div className="hiw-num">2</div>
              <div className="hiw-title">We calculate your real chart</div>
              <div className="hiw-desc">
                Using Astronomy Engine — a high-precision ephemeris used in professional
                astronomy software. Every planet, every house cusp, every degree. Instantly.
              </div>
            </div>
            <div className="hiw-step">
              <div className="hiw-num">3</div>
              <div className="hiw-title">Read your free preview</div>
              <div className="hiw-desc">
                Two brutally honest insights based on your exact placements. No generic
                copy. If the preview alone makes you pause, imagine what the full reading does.
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 48 }}>
            <Link className="bp" href="/#try-it">
              Calculate My Birth Chart — Free ✨
            </Link>
            <div style={{ fontSize: 12, color: "#3a3858", marginTop: 10 }}>
              Full reading: $15 one-time · Emailed instantly · No subscription
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          EMOTIONAL CTA — Conversion section for the paid reading
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="sec dk">
        <div className="c">
          <div className="emo-cta">
            <div style={{ position: "relative", zIndex: 1 }}>
              <div style={{
                display: "inline-block", fontSize: ".65rem", fontWeight: 700,
                letterSpacing: ".12em", textTransform: "uppercase" as const,
                color: "#1a0a00", background: "var(--gold)", padding: "4px 12px",
                borderRadius: 100, marginBottom: 20,
              }}>
                The part that changes things
              </div>
              <h2>The two free insights<br /><em>are just the door.</em></h2>
              <p>
                You&apos;ll read your free preview and feel something shift. A quiet recognition.
                The feeling of being seen by something that shouldn&apos;t know you that well.
              </p>
              <p style={{ maxWidth: 520, margin: "0 auto 8px", fontSize: ".95rem", color: "rgba(232,228,240,0.5)", lineHeight: 1.75 }}>
                The full reading goes deeper. Eight more insights that name your patterns,
                your blind spots, the thing you do in relationships that you swore you&apos;d stop doing.
                Your natal chart wheel — calculated with precision you can actually trust.
                And your identity card — the one your friends will screenshot before you do.
              </p>
              <p style={{ maxWidth: 480, margin: "0 auto 28px", fontSize: ".92rem", color: "rgba(240,184,74,0.8)", fontStyle: "italic", lineHeight: 1.7 }}>
                This isn&apos;t a daily horoscope notification you&apos;ll forget by lunch.
                It&apos;s one conversation with your chart that stays with you.
              </p>

              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 900, color: "var(--gold)" }}>
                  $15
                </span>
                <span style={{ fontSize: ".78rem", color: "rgba(232,228,240,0.35)" }}>
                  One-time · Emailed instantly · Yours forever
                </span>
              </div>

              <div style={{ marginTop: 28, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
                <Link className="bp" href="/#try-it" style={{ textDecoration: "none", fontSize: ".9rem", padding: "16px 36px" }}>
                  Start with my free preview ✨
                </Link>
                <span style={{ fontSize: ".76rem", color: "rgba(232,228,240,0.3)" }}>
                  Free preview first — no payment until you&apos;re ready
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          REVIEWS
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="sec" id="reviews">
        <div className="c">
          <SectionLabel label="What people say" />
          <h2>Readings people<br /><em>actually share.</em></h2>
          <p className="sub">Real reactions from beta readers who tried BluntChart&apos;s birth chart reading.</p>

          <div className="rev-grid">
            {REVIEWS_SHORT.map((r) => (
              <div className="rev-card" key={r.name}>
                <div style={{ display: "flex", gap: 2, marginBottom: 12 }}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: "#F0B84A", fontSize: 13 }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: ".91rem", color: "var(--white)", lineHeight: 1.68, marginBottom: 18, fontStyle: "italic" }}>
                  &ldquo;{r.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "linear-gradient(135deg,#6b2fd4,#d4537e)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)", fontSize: ".9rem", fontWeight: 700, color: "#fff", flexShrink: 0,
                  }}>
                    {r.init}
                  </div>
                  <div>
                    <div style={{ fontSize: ".83rem", fontWeight: 600, color: "var(--dim)" }}>{r.name}</div>
                    <div style={{ fontSize: ".73rem", color: "rgba(232,228,240,.3)" }}>{r.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          SEO CONTENT — Long-form for keyword depth
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="sec dk">
        <div className="c">
          <div className="seo-content">
            <SectionLabel label="Understanding your birth chart" />

            <h2>What Is a Birth Chart<br /><em>and Why Does It Matter?</em></h2>
            <p>
              A <strong>birth chart</strong> — also called a <strong>natal chart</strong> or <strong>astrology chart</strong> — is a
              snapshot of the sky at the exact moment you were born. It maps the positions of the Sun, Moon,
              and all major planets across the twelve zodiac signs and twelve astrological houses. Unlike a
              daily horoscope based only on your Sun sign, your birth chart is completely unique to you.
              No two charts are identical unless two people are born at the exact same second, in the exact same location.
            </p>
            <p>
              Your natal chart reveals patterns in your personality, emotional tendencies, communication style,
              relationship dynamics, career strengths, and the recurring themes you keep encountering in life.
              It doesn&apos;t predict the future — it shows you the operating system you were born with.
            </p>

            <h2>How Does a Birth Chart<br /><em>Calculator Work?</em></h2>
            <p>
              A <strong>birth chart calculator</strong> takes three inputs: your <strong>date of birth</strong>,
              your <strong>exact time of birth</strong>, and your <strong>place of birth</strong>. Using an astronomical
              ephemeris — a database of precise planetary positions over time — it calculates exactly where every
              celestial body was at your birth moment, as seen from your birth location.
            </p>
            <p>
              BluntChart uses <strong>Astronomy Engine</strong>, a high-precision ephemeris that provides
              library-grade astronomical calculations. Your birth city is geocoded to exact latitude and longitude,
              and the historical timezone is resolved automatically. The result is a natal chart with planetary
              positions accurate to the arc-minute — the same precision professional astrologers rely on.
            </p>

            <h2>What Are the Big Three<br /><em>in Astrology?</em></h2>
            <p>
              Your <strong>Big Three</strong> are the three most important placements in your birth chart:
              your <strong>Sun sign</strong>, <strong>Moon sign</strong>, and <strong>Rising sign</strong> (also called
              your Ascendant). Together they form the foundation of how you experience yourself and how others experience you.
            </p>
            <p>
              Your <strong>Sun sign</strong> represents your core identity — your ego, your will, the way you
              shine. Your <strong>Moon sign</strong> governs your emotional world — your instincts, your needs,
              the feelings you don&apos;t post about. Your <strong>Rising sign</strong> is the version of you that walks
              into a room first — the immediate impression you make before anyone knows your name.
            </p>
            <p>
              Most free birth chart calculators tell you these three placements and stop there. BluntChart goes further:
              we tell you what they actually mean together, and how they create the specific tensions and gifts that make
              you <em>you</em>.
            </p>

            <h2>Why Birth Time Matters<br /><em>for Your Natal Chart</em></h2>
            <p>
              Your birth time is the single most important detail for an accurate birth chart. It determines your
              <strong> Rising sign</strong>, which changes roughly every two hours and controls the entire house
              system of your chart — which areas of life each planet influences. Without it, your chart is
              missing its most personal layer.
            </p>
            <p>
              Your birth time is almost always recorded on your <strong>birth certificate</strong>. In many countries
              it&apos;s a standard field. If you can&apos;t find yours, hospital records or family members may have it.
              As a last resort, entering 12:00 noon will give you a chart where the planet positions in signs are
              correct, but the house placements and Rising sign may not be.
            </p>

            <h2>BluntChart vs Other<br /><em>Free Birth Chart Calculators</em></h2>
            <p>
              There are dozens of free birth chart calculators online — Cafe Astrology, Co-Star, Astro-Seek, Chani,
              and more. Most of them do a good job showing you the data: what sign each planet is in, what house it&apos;s
              in, what aspects it makes.
            </p>
            <p>
              BluntChart does that too. But the difference is what comes after the calculation. Where other tools
              give you textbook descriptions or leave you with raw data, <strong>BluntChart writes you a personalized
              reading</strong> — around 1,500 words — that tells you what your chart actually means for your life,
              in a tone that doesn&apos;t soften the uncomfortable parts.
            </p>
            <p>
              Two of those insights are completely free. The full reading — all ten insights, your natal chart wheel,
              and your shareable identity card — is a one-time $15 payment, delivered to your email instantly.
              No account. No subscription. No app to download.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FAQ — Schema-rich, keyword-dense
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="sec">
        <div className="c">
          <SectionLabel label="Birth chart FAQ" />
          <h2>Everything you need to know<br /><em>about birth charts.</em></h2>
          <p className="sub" style={{ marginBottom: 48 }}>
            Common questions about birth charts, natal chart calculators, and what makes
            BluntChart different from every other astrology tool online.
          </p>
          <FAQSection />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FINAL CTA
          ══════════════════════════════════════════════════════════════════════ */}
      <section className="sec dk" style={{ textAlign: "center" }}>
        <div className="c">
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <Image src="/mascot.png" alt="BluntChart mascot" width={80} height={80}
              style={{ margin: "0 auto 20px", filter: "drop-shadow(0 0 20px rgba(107,47,212,.3))" }} />
            <h2>Your chart already knows.<br /><em>It&apos;s time you did too.</em></h2>
            <p style={{ fontSize: "1rem", color: "var(--dim)", lineHeight: 1.72, margin: "16px auto 32px", maxWidth: 480 }}>
              Enter your birth details. Get your natal chart with exact degrees and placements.
              Read two truths your chart picked for you — completely free.
            </p>
            <Link className="bp" href="/#try-it" style={{ textDecoration: "none" }}>
              Get My Free Birth Chart ✨
            </Link>
            <div style={{ marginTop: 12, fontSize: ".78rem", color: "#3a3858" }}>
              No signup · No payment · Instant results
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="c">
          <div className="fi">
            <div className="fb">
              <Link className="logo" href="/"><span className="g">BluntChart</span></Link>
              <p>Brutally honest birth chart readings. Real astrology, zero filter, no subscription.</p>
              <div className="slinks">
                <a className="sl2" href="https://www.tiktok.com/@bluntchart" target="_blank" rel="noopener noreferrer">Tk</a>
                <a className="sl2" href="https://www.instagram.com/bluntchart/" target="_blank" rel="noopener noreferrer">In</a>
                <a className="sl2" href="https://www.youtube.com/@BluntChart" target="_blank" rel="noopener noreferrer">Yt</a>
              </div>
            </div>
            <div className="fl">
              <h4>Readings</h4>
              <ul>
                <li><Link href="/#try-it">Birth Chart · $15</Link></li>
                <li><Link href="/#waitlist">Compatibility · Coming Soon</Link></li>
                <li><Link href="/#waitlist">Year Ahead · Coming Soon</Link></li>
                <li><Link href="/#waitlist">Gift a Reading · Coming Soon</Link></li>
              </ul>
            </div>
            <div className="fl">
              <h4>Free Tools</h4>
              <ul>
                <li><Link href="/free-birth-chart"><strong style={{ color: "var(--gold)" }}>Free Birth Chart</strong></Link></li>
                <li><Link href="/natal-chart">Natal Chart</Link></li>
                <li><Link href="/big-three-calculator">Big Three Calculator</Link></li>
                <li><Link href="/moon-sign-calculator">Moon Sign Calculator</Link></li>
                <li><Link href="/rising-sign-calculator">Rising Sign Calculator</Link></li>
                <li><Link href="/zodiac-signs">Zodiac Signs</Link></li>
              </ul>
            </div>
            <div className="fl">
              <h4>Legal</h4>
              <ul>
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/refunds">Refund Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="fb2">
            <p className="disc">
              For entertainment purposes only. BluntChart readings are not a substitute for
              medical, psychological, financial, or legal advice. Do not make major life
              decisions based solely on astrological content.
            </p>
            <p className="copy">© 2026 BluntChart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}