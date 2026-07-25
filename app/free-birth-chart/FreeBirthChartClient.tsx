"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef } from "react";
import { calculateChart } from "@/lib/chart-calculator";
import type { BirthData, ChartData } from "@/lib/types";
import LocationPicker from "@/components/LocationPicker";
import type { SelectedLocation } from "@/components/LocationPicker";
import { geocodeBirthPlace } from "@/lib/geocode-client";

const ChartWheel = dynamic(() => import("@/components/ChartWheel"), {
  ssr: false,
  loading: () => (
    <div className="h-[320px] flex items-center justify-center opacity-50 text-sm">
      Drawing your chart…
    </div>
  ),
});

/* ── Planet symbols ── */
const PLANET_SYMBOLS: Record<string, string> = {
  Sun:"☉", Moon:"☽", Mercury:"☿", Venus:"♀", Mars:"♂",
  Jupiter:"♃", Saturn:"♄", Uranus:"♅", Neptune:"♆", Pluto:"♇",
};

/* ── SEO FAQ data (rendered as HTML too) ── */
const FAQS = [
  {
    q: "What is a birth chart?",
    a: "A birth chart (natal chart) is a map of exactly where every planet was at the moment you were born. It's calculated from your birth date, exact birth time, and birth location. Unlike a horoscope that only uses your Sun sign, a birth chart shows the positions of the Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, and Pluto across the 12 zodiac signs and 12 houses. No two are the same — yours is as unique as a fingerprint.",
  },
  {
    q: "Can I get a birth chart without my birth time?",
    a: "Yes, partially. Your Sun, Mercury, Venus, Mars, Jupiter, Saturn and outer planet signs will be accurate. What you lose is your Rising sign, all twelve house placements, the Midheaven, and — if the Moon changed signs that day — your Moon sign. Run your chart at noon to get everything else, and check your birth certificate long-form (the short form usually omits time).",
  },
  {
    q: "What house system does this calculator use?",
    a: "BluntChart uses Equal House from the Ascendant. Astronomical calculations for planets, the Ascendant degree and all aspects match professional tools to arc-second precision. Only the house cusps differ from a Placidus chart, which usually means one or two planets landing in an adjacent house. No house system has been demonstrated to be more correct than another — Placidus, Whole Sign, Equal and Koch are all legitimate.",
  },
  {
    q: "Is a birth chart the same as a natal chart?",
    a: "Yes — birth chart and natal chart are two names for the same thing. 'Natal' is the technical term; 'birth chart' is more common. There is no difference in calculation, accuracy or meaning. A horoscope, by contrast, is not the same thing: it's a forecast comparing current planetary positions against your birth chart, and a daily horoscope uses only your Sun sign.",
  },
  {
    q: "How accurate is this birth chart calculator?",
    a: "The calculator uses astronomy-engine, a high-precision astronomical library. Planetary longitudes are accurate to arc-second and match the Swiss Ephemeris used by professional astrologers. The Ascendant is computed from the historical timezone for your birth date and location. You can check any placement against an independent source and it will agree — the only variable is house system.",
  },
  {
    q: "What is a chart ruler?",
    a: "Your chart ruler is the planet that rules your Rising sign — Aries Rising is ruled by Mars, Taurus and Libra Rising by Venus, and so on. Wherever that planet sits in your chart describes the overall direction and flavour of your life. Two people with the same Rising sign can have completely different lives if their chart ruler sits in different houses.",
  },
  {
    q: "What is a stellium?",
    a: "A stellium is three or more planets in the same sign or the same house. When you have one, that area of your chart dominates you. A Capricorn stellium makes ambition and structure the water you swim in; a 5th-house stellium makes creativity and romance the organising principle of your life. Stelliums are also why some people don't relate to their Sun sign — the stellium is louder.",
  },
  {
    q: "What are aspects in astrology?",
    a: "Aspects are the angles between planets in your chart, showing how different parts of your personality interact. The five major aspects are conjunction (0°, merged), sextile (60°, opportunity), square (90°, tension), trine (120°, ease), and opposition (180°, push-pull). Tighter orbs are stronger. Squares are the aspects most productive achievers have plenty of — tension is what makes people build things.",
  },
  {
    q: "Can AI read my birth chart?",
    a: "Increasingly, yes — but the calculation still has to come from a real ephemeris, not from the language model. A well-built AI reading works from your whole chart at once and can register that your Venus in Scorpio sits in the 8th house, squares Saturn, and is ruled by a Pluto conjunct your Ascendant. That synthesis is what template reports have never managed. Ask a general chatbot to compute a chart and it will often invent placements and interpret them confidently.",
  },
  {
    q: "What is the difference between a birth chart and a daily horoscope?",
    a: "A birth chart is a permanent, one-time calculation unique to your exact moment of birth. A daily horoscope is a general forecast based only on your Sun sign — one of 12 possibilities — applied to roughly one twelfth of the human population at once. Your birth chart contains dozens of data points that make it specific to you alone.",
  },
];

export default function FreeBirthChartClient() {
  const [fname, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob]     = useState("");
  const [btime, setBtime] = useState("");
  const [city, setCity]   = useState("");
  const [cityGeo, setCityGeo] = useState<SelectedLocation | null>(null);
  const [err, setErr]     = useState("");
  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState<ChartData | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  /* Scroll listener for nav */
  if (typeof window !== "undefined") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useState(() => {
      const fn = () => setScrolled(window.scrollY > 40);
      window.addEventListener("scroll", fn, { passive: true });
    });
  }

  const handleCalculate = async () => {
    if (!email.trim() || !dob || !btime || !city.trim()) {
      setErr("Please fill in your email, date of birth, birth time, and city.");
      return;
    }
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email.trim())) {
      setErr("Please enter a valid email address.");
      return;
    }
    setErr("");
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      let geo: { lat: number; lng: number; timezone: string } | null = null;

      if (cityGeo) {
        const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
        geo = { lat: cityGeo.lat, lng: cityGeo.lng, timezone: browserTz };
      } else {
        geo = await geocodeBirthPlace(city.trim());
      }

      if (!geo) {
        throw new Error("Could not locate your city. Try adding country (e.g. Mumbai, India).");
      }

      const birth: BirthData = {
        name: fname.trim() || "You",
        date: dob,
        time: btime,
        lat: geo.lat,
        lng: geo.lng,
        timezone: geo.timezone,
        placeName: city.trim(),
      };

      const chartData = calculateChart(birth);
      setChart(chartData);

      /* Save lead to database for follow-ups */
      try {
        await fetch("/api/save-pending", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fname.trim() || "Free Chart User",
            email: normalizedEmail,
            dob,
            birth_time: btime,
            city: city.trim(),
            birth_lat: geo.lat,
            birth_lng: geo.lng,
            timezone: geo.timezone,
            source: "free-birth-chart",
          }),
        });
      } catch {
        /* Don't block the chart if save fails */
      }

      // Scroll to result
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --font-display:'Playfair Display',Georgia,serif;
          --font-body:'DM Sans',system-ui,sans-serif;
          --bg:#09090f;--card:#12121e;
          --border:rgba(255,255,255,0.08);
          --white:#e8e4f0;--dim:rgba(232,228,240,0.55);
          --gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);
          --purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--white);font-family:var(--font-body);-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .fbc-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;transition:all .3s}
        .fbc-nav.on{background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
        .fbc-c{max-width:1280px;margin:0 auto;padding:0 40px}
        @media(max-width:768px){.fbc-c{padding:0 20px}}
        .fbc-logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:10px}
        .fbc-logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .fbc-inp{width:100%;background:rgba(255,255,255,0.04);border:0.5px solid rgba(255,255,255,0.1);border-radius:10px;padding:13px 14px;font-size:14px;color:#e8e4f0;font-family:inherit;outline:none}
        .fbc-inp:focus{border-color:rgba(107,47,212,0.5)}
        .fbc-lbl{display:block;font-size:11px;font-weight:600;color:#6b6585;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:6px}
        .fbc-btn{width:100%;background:linear-gradient(135deg,#6b2fd4,#d4537e);color:#fff;border:none;border-radius:12px;padding:16px 20px;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;letter-spacing:0.2px;transition:opacity .2s}
        .fbc-btn:hover{opacity:0.88}
        .fbc-btn:disabled{opacity:0.5;cursor:not-allowed}
        .fbc-cta-btn{display:block;width:100%;max-width:480px;margin:0 auto;background:linear-gradient(135deg,#f0b84a,#e8854a);color:#0d0800;border:none;border-radius:12px;padding:18px 24px;font-size:16px;font-weight:700;font-family:inherit;cursor:pointer;text-align:center;text-decoration:none;letter-spacing:0.3px;transition:opacity .2s,transform .15s}
        .fbc-cta-btn:hover{opacity:0.88;transform:translateY(-1px)}
        @media(max-width:768px){.fbc-nav-links{display:none!important}.fbc-cmp-row,.fbc-cmp-head{grid-template-columns:1fr 90px 90px!important}}
      `}</style>

      {/* ── NAV ── */}
      <nav className={`fbc-nav${scrolled ? " on" : ""}`}>
        <div className="fbc-c" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Link href="/" className="fbc-logo">
            <Image src="/mascot.png" alt="BluntChart" width={34} height={34} style={{ borderRadius:"50%" }} />
            <span className="g">BluntChart</span>
          </Link>
          <div className="fbc-nav-links" style={{ display:"flex", alignItems:"center", gap:24 }}>
            <Link href="/#try-it" style={{ fontSize:13, color:"rgba(232,228,240,0.55)", textDecoration:"none", fontWeight:500 }}>
              Get Full Reading
            </Link>
            <Link href="/" style={{ fontSize:13, color:"#F0B84A", textDecoration:"none", fontWeight:600,
              border:"1px solid rgba(240,184,74,0.18)", padding:"6px 15px", borderRadius:4 }}>
              Full Reading $15
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO + FORM ── */}
      <section style={{ paddingTop:120, paddingBottom:64, position:"relative" }}>
        {/* Background glow */}
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 50% -10%,rgba(107,47,212,.08) 0%,transparent 50%)", pointerEvents:"none" }} />

        <div className="fbc-c" style={{ position:"relative", zIndex:1 }}>
          {/* Breadcrumb */}
          <div style={{ fontSize:12, color:"rgba(232,228,240,0.3)", marginBottom:24 }}>
            <Link href="/" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>BluntChart</Link>
            <span style={{ margin:"0 8px" }}>/</span>
            <span style={{ color:"rgba(232,228,240,0.5)" }}>Free Birth Chart</span>
          </div>

          <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center" }}>
            {/* Eyebrow */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:11, fontWeight:700,
              letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"#F0B84A",
              padding:"5px 14px", border:"1px solid rgba(240,184,74,0.18)", borderRadius:100,
              background:"rgba(240,184,74,0.06)", marginBottom:24 }}>
              ✦ Free tool · No signup required
            </div>

            <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.2rem,5.5vw,3.6rem)",
              fontWeight:900, lineHeight:1.08, letterSpacing:"-0.02em", marginBottom:14 }}>
              Free Birth Chart<br/>
              <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                Calculator
              </em>
            </h1>

            <p style={{ fontSize:16, color:"rgba(232,228,240,0.55)", lineHeight:1.72, maxWidth:540,
              margin:"0 auto 12px" }}>
              Enter your birth date, time, and place. Get your complete natal chart with exact planetary positions,
              house placements, and aspects — calculated using high-precision astronomical ephemeris.
            </p>
            <p style={{ fontSize:13, color:"rgba(232,228,240,0.3)", marginBottom:40 }}>
              Free, instant, no account needed.
            </p>
          </div>

          {/* ── FORM ── */}
          <div style={{ maxWidth:600, margin:"0 auto", background:"rgba(255,255,255,0.03)",
            border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:18, padding:32 }}>

            {err && (
              <div style={{ background:"rgba(212,83,126,0.08)", border:"0.5px solid rgba(212,83,126,0.3)",
                borderRadius:10, padding:"11px 14px", fontSize:13, color:"#f0a0b8", marginBottom:14 }}>
                {err}
              </div>
            )}

            {/* Name + Email row */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              <div>
                <label className="fbc-lbl">First name <span style={{ color:"#3a3858", fontWeight:400 }}>(optional)</span></label>
                <input className="fbc-inp" value={fname} onChange={e => setFname(e.target.value)}
                  placeholder="e.g. Sarah" />
              </div>
              <div>
                <label className="fbc-lbl">Email address *</label>
                <input type="email" className="fbc-inp" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com" />
                <small style={{ fontSize:11, color:"#3a3858", marginTop:4, display:"block" }}>
                  We'll send your chart here too
                </small>
              </div>
            </div>

            {/* DOB + Time */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              <div>
                <label className="fbc-lbl">Date of birth *</label>
                <input type="date" className="fbc-inp" value={dob} onChange={e => setDob(e.target.value)} />
              </div>
              <div>
                <label className="fbc-lbl">Time of birth *</label>
                <input type="time" className="fbc-inp" value={btime} onChange={e => setBtime(e.target.value)} />
                <small style={{ fontSize:11, color:"#3a3858", marginTop:4, display:"block" }}>
                  From your birth certificate
                </small>
              </div>
            </div>

            {/* City */}
            <div style={{ marginBottom:24 }}>
              <label className="fbc-lbl">City &amp; country of birth *</label>
              <LocationPicker
                value={city}
                onChange={(location, rawText) => { setCityGeo(location); setCity(rawText); }}
                placeholder="e.g. New York, USA or Mumbai, India"
              />
            </div>

            <button className="fbc-btn" onClick={handleCalculate} disabled={loading}>
              {loading ? "Calculating your chart…" : "Calculate My Birth Chart — Free ✨"}
            </button>

            <p style={{ fontSize:11, color:"#2e2c3e", textAlign:"center", marginTop:12 }}>
              Your data is used to calculate your chart. We may send you your reading offer — no spam, ever.
            </p>
          </div>

          {/* Trust signals */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:20, marginTop:24,
            flexWrap:"wrap" }}>
            {["High-precision ephemeris", "Geocentric positions", "Equal house system", "Instant result"].map((t, i) => (
              <span key={i} style={{ fontSize:12, color:"rgba(232,228,240,0.35)", display:"flex",
                alignItems:"center", gap:6 }}>
                <span style={{ color:"#5dcaa5", fontWeight:700 }}>✓</span>{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHART RESULT ── */}
      {chart && (
        <section ref={resultRef} style={{ paddingBottom:80 }}>
          <div className="fbc-c">
            {/* Divider */}
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:40 }}>
              <span style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.06)" }} />
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:"2.5px",
                textTransform:"uppercase" as const, color:"#3a3858" }}>
                {fname ? `${fname}'s natal chart` : "Your natal chart"}
              </span>
              <span style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.06)" }} />
            </div>

            {/* Chart Wheel */}
            <div style={{ marginBottom:48 }}>
              <ChartWheel chart={chart} />
            </div>

            {/* ── CTA: Get Full Reading ── */}
            <div style={{ background:"rgba(107,47,212,0.04)", border:"0.5px solid rgba(107,47,212,0.2)",
              borderRadius:20, padding:"40px 32px", textAlign:"center", marginBottom:48 }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const,
                color:"#F0B84A", marginBottom:12 }}>
                Your chart is calculated — now hear what it actually means
              </p>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.4rem,3.5vw,2rem)",
                fontWeight:800, lineHeight:1.1, marginBottom:14 }}>
                Want the <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                  brutally honest</em> version?
              </h2>
              <p style={{ fontSize:14, color:"rgba(232,228,240,0.55)", lineHeight:1.72, maxWidth:480,
                margin:"0 auto 24px" }}>
                Your natal chart is a map. BluntChart reads it out loud — no sugarcoating, no vague
                horoscope language. 10 specific insights written to your exact placements. ~1,500 words
                that feel like they were written by someone who actually knows you.
              </p>
              <Link href="/#try-it" className="fbc-cta-btn">
                Get My Full Reading · $15 ✦
              </Link>
              <p style={{ fontSize:12, color:"#3a3858", marginTop:12 }}>
                One-time payment · No subscription · Emailed instantly · Includes shareable card
              </p>
            </div>

            {/* Aspects table */}
            {chart.aspects.length > 0 && (
              <div style={{ marginBottom:48 }}>
                <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700,
                  marginBottom:16 }}>
                  Aspects in your chart
                </h3>
                <p style={{ fontSize:14, color:"rgba(232,228,240,0.45)", marginBottom:20, maxWidth:560, lineHeight:1.65 }}>
                  Aspects are the angles between planets. They reveal how different parts of your personality
                  interact — where you flow easily and where you face friction.
                </p>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(240px, 1fr))",
                  gap:8 }}>
                  {chart.aspects.slice(0, 15).map((asp, i) => (
                    <div key={i} style={{ background:"var(--card)", border:"0.5px solid var(--border)",
                      borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center",
                      justifyContent:"space-between", fontSize:13 }}>
                      <span style={{ color:"rgba(232,228,240,0.7)" }}>
                        {PLANET_SYMBOLS[asp.planet1] ?? asp.planet1} {asp.planet1}
                        <span style={{ color:"rgba(232,228,240,0.3)", margin:"0 6px" }}>—</span>
                        {PLANET_SYMBOLS[asp.planet2] ?? asp.planet2} {asp.planet2}
                      </span>
                      <span style={{ fontSize:11, color: asp.type === "trine" || asp.type === "sextile"
                        ? "#6090e0" : asp.type === "conjunction" ? "#8cc88c" : "#e07070",
                        fontWeight:600, textTransform:"capitalize" }}>
                        {asp.type} ({asp.orb}°)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Second CTA */}
            <div style={{ textAlign:"center", padding:"32px 0", borderTop:"0.5px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize:15, color:"rgba(232,228,240,0.55)", marginBottom:16, fontFamily:"var(--font-display)",
                fontStyle:"italic" }}>
                "Your chart already knows why you're like this. BluntChart just says it out loud."
              </p>
              <Link href="/#try-it" style={{ display:"inline-flex", alignItems:"center", gap:8,
                padding:"14px 30px", background:"linear-gradient(135deg,#6b2fd4,#d4537e)", color:"#fff",
                fontWeight:700, fontSize:14, letterSpacing:"0.04em", textTransform:"uppercase" as const,
                textDecoration:"none", borderRadius:10, transition:"opacity .2s" }}>
                Get My Full Reading — $15 ✨
              </Link>
            </div>
          </div>
        </section>
      )}


      {/* ── SEO LONG-FORM GUIDE ── */}
      <section style={{ padding:"80px 0", background:"#0d0d18",
        borderTop:"1px solid rgba(255,255,255,0.08)" }}>
        <div className="fbc-c" style={{ maxWidth:1080 }}>

          <style>{`
            .fbc-h2{font-family:var(--font-display);font-size:clamp(1.5rem,3.2vw,2rem);font-weight:800;line-height:1.15;letter-spacing:-0.01em;color:#e8e4f0;margin:0 0 14px}
            .fbc-h2 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
            .fbc-h3{font-family:var(--font-display);font-size:18px;font-weight:700;color:#e8e4f0;margin:28px 0 12px}
            .fbc-p{font-size:15px;color:rgba(232,228,240,0.65);line-height:1.78;margin-bottom:16px}
            .fbc-p a{color:#F0B84A;text-decoration:underline;text-decoration-color:rgba(240,184,74,0.35);text-underline-offset:3px}
            .fbc-p a:hover{text-decoration-color:#F0B84A}
            .fbc-tldr{background:rgba(240,184,74,0.06);border-left:3px solid #F0B84A;border-radius:0 10px 10px 0;padding:16px 20px;margin:0 0 24px}
            .fbc-tldr-l{font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#F0B84A;margin-bottom:6px;display:block}
            .fbc-tldr-t{font-size:15px;color:#e8e4f0;line-height:1.65}
            .fbc-block{margin-bottom:56px}
            .fbc-list{margin:0 0 16px 0;padding-left:22px}
            .fbc-list li{font-size:15px;color:rgba(232,228,240,0.65);line-height:1.7;margin-bottom:8px}
            .fbc-list li strong{color:#e8e4f0;font-weight:600}
          `}</style>

          {/* Block: How to read the chart */}
          <div className="fbc-block">
            <h2 className="fbc-h2">What does your <em>birth chart actually show</em> you?</h2>
            <div className="fbc-tldr">
              <span className="fbc-tldr-l">Short answer</span>
              <p className="fbc-tldr-t">Your birth chart is the sky as seen from your exact birthplace at your exact minute of birth. The outer ring is the twelve zodiac signs, the inner divisions are the twelve houses, and the glyphs are the planets at their real positions. The lines crossing the middle are aspects — the geometric relationships between planets.</p>
            </div>
            <p className="fbc-p">Most free birth chart calculators hand you a wheel and walk away. Here is what every part of the chart you just generated is telling you, so the wheel stops being decoration and starts being readable.</p>
            <p className="fbc-p"><strong style={{ color:"#e8e4f0" }}>Read it in this order and it stops being overwhelming:</strong></p>
            <ol className="fbc-list">
              <li><strong>Find the Ascendant</strong> — the point on the left horizontal edge, at the nine o&apos;clock position. That&apos;s your Rising sign and the start of your 1st house.</li>
              <li><strong>Find the Sun, Moon and Ascendant glyphs.</strong> That&apos;s your <Link href="/big-three-calculator">Big Three</Link>, done.</li>
              <li><strong>Look at which houses are crowded.</strong> Empty houses aren&apos;t bad; crowded houses tell you where your life happens.</li>
              <li><strong>Look at the lines.</strong> Red and blue lines mean different things — tension and ease respectively.</li>
              <li><strong>Only then</strong> start reading individual placements.</li>
            </ol>

            <h3 className="fbc-h3">The four angles</h3>
            <p className="fbc-p">Four points in your chart carry more weight than everything else. They&apos;re determined entirely by your birth time and place, which is why the time matters so much.</p>
            <ul className="fbc-list">
              <li><strong>Ascendant (AC)</strong> — 1st house cusp, eastern horizon. How you show up.</li>
              <li><strong>Descendant (DC)</strong> — 7th house cusp, directly opposite. What you look for in a partner.</li>
              <li><strong>Midheaven (MC)</strong> — 10th house cusp, highest point in the sky. Your public identity, career direction, reputation.</li>
              <li><strong>Imum Coeli (IC)</strong> — 4th house cusp, lowest point. Home, roots, family, private self.</li>
            </ul>
            <p className="fbc-p">If a planet sits within a few degrees of any of these four points, it becomes one of the loudest voices in your chart. A conjunct-Midheaven planet is something everyone notices about you. A conjunct-IC planet is something almost nobody sees.</p>

            <h3 className="fbc-h3">Your chart ruler</h3>
            <p className="fbc-p">Here&apos;s a placement most free calculators never mention, and it&apos;s one of the most useful in the entire chart.</p>
            <p className="fbc-p">Your <strong style={{ color:"#e8e4f0" }}>chart ruler</strong> is the planet that rules your Rising sign. Aries Rising is ruled by Mars. Taurus and Libra Rising by Venus. Gemini and Virgo by Mercury. Cancer by the Moon. Leo by the Sun. Scorpio by Pluto (Mars in traditional astrology). Sagittarius by Jupiter. Capricorn and Aquarius by Saturn (Aquarius by Uranus in modern). Pisces by Neptune (Jupiter traditionally).</p>
            <p className="fbc-p">Wherever that planet sits — its sign, its house, its aspects — describes the overall direction and flavour of your life. A Virgo Rising with Mercury in the 10th house builds a life around communicating publicly. The same Virgo Rising with Mercury in the 12th builds a life around private, internal, behind-the-scenes thinking. Same Rising sign, completely different life.</p>

            <h3 className="fbc-h3">Stelliums, nodes, and the parts nobody teaches you</h3>
            <p className="fbc-p">A <strong style={{ color:"#e8e4f0" }}>stellium</strong> is three or more planets in the same sign or house. When you have one, that area of your chart dominates you. A 5th house stellium makes creativity and romance the organising principle of your whole life. A Capricorn stellium makes ambition and structure the water you swim in, whether you enjoy it or not. Stelliums are also why people sometimes read their <Link href="/zodiac-signs">Sun sign description</Link> and feel nothing — a Gemini Sun with four planets in Cancer is functionally a Cancer with a Gemini job title.</p>
            <p className="fbc-p">The <strong style={{ color:"#e8e4f0" }}>North Node and South Node</strong> aren&apos;t planets — they&apos;re the points where the Moon&apos;s orbit crosses the Sun&apos;s apparent path, read as a directional axis. The South Node describes what comes easily to you — patterns so familiar they&apos;re almost automatic. The North Node describes the direction that feels awkward, unnatural and slightly terrifying, and which is where growth actually lives. Most people spend their twenties living entirely at their South Node and wondering why nothing feels meaningful.</p>
          </div>

          {/* Block: Without birth time */}
          <div className="fbc-block">
            <h2 className="fbc-h2">How do I read my birth chart <em>without a birth time?</em></h2>
            <div className="fbc-tldr">
              <span className="fbc-tldr-l">Short answer</span>
              <p className="fbc-tldr-t">You&apos;re not locked out — you&apos;re working with a partial chart. Your Sun, Mercury, Venus, Mars and the outer planets stay accurate. Your Rising sign, all house placements, the Midheaven, and sometimes your Moon become unreliable or impossible. Run it at noon and know which parts to trust.</p>
            </div>
            <p className="fbc-p"><strong style={{ color:"#e8e4f0" }}>Still accurate without a birth time:</strong></p>
            <ul className="fbc-list">
              <li>Your Sun sign — always.</li>
              <li>Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune and Pluto by sign. These move slowly enough that a 24-hour window rarely changes anything.</li>
              <li>Most aspects between the slower planets.</li>
            </ul>
            <p className="fbc-p"><strong style={{ color:"#e8e4f0" }}>Unreliable or impossible without a birth time:</strong></p>
            <ul className="fbc-list">
              <li>Your <Link href="/rising-sign-calculator">Rising sign</Link>. It changes roughly every two hours, so an unknown time means twelve possible answers.</li>
              <li>All twelve house placements — because the houses are built from the Ascendant.</li>
              <li>The Midheaven and IC.</li>
              <li>Your <Link href="/moon-sign-calculator">Moon sign</Link> <em>if</em> the Moon changed signs on your birth date. The Moon moves through a sign in about 2.5 days, so roughly one birthday in three falls near a boundary.</li>
            </ul>
            <h3 className="fbc-h3">How to find your birth time</h3>
            <ol className="fbc-list">
              <li><strong>Your birth certificate.</strong> In the US, most states record it — but note that the <em>short-form</em> certificate often omits it while the <em>long-form</em> includes it. Request the long form.</li>
              <li><strong>Your mother, or anyone who was there.</strong> &ldquo;Before or after lunch&rdquo; narrows twelve possible Rising signs down to about four.</li>
              <li><strong>Hospital records.</strong> In the UK, Ireland, Australia, New Zealand and most of the EU, birth time isn&apos;t printed on the standard certificate — but the hospital&apos;s maternity register usually holds it, and records departments will search on request.</li>
              <li><strong>Baby books, birth announcements, newspaper listings.</strong> More reliable than people expect.</li>
            </ol>
            <p className="fbc-p">If you get nowhere, run your chart with a noon birth time. You&apos;ll get everything except your Rising sign and houses, and you&apos;ll know which planets to trust. Some astrologers offer <strong style={{ color:"#e8e4f0" }}>birth time rectification</strong>, which works backwards from known life events to estimate a time — it&apos;s interpretive rather than astronomical, so treat the output as a strong hypothesis rather than a fact.</p>
          </div>

          {/* Block: Which house system */}
          <div className="fbc-block">
            <h2 className="fbc-h2">Which house system do we use, <em>and why might your chart look different elsewhere?</em></h2>
            <div className="fbc-tldr">
              <span className="fbc-tldr-l">Short answer</span>
              <p className="fbc-tldr-t">BluntChart uses Equal House from the Ascendant. Astro-Seek, Cafe Astrology and Astrodienst default to Placidus. Planet positions are identical everywhere to the arc-second — it&apos;s the house <em>cusps</em> that differ, which usually means one or two planets landing in an adjacent house. No system has been demonstrated to be more correct than another.</p>
            </div>
            <p className="fbc-p">If you&apos;ve generated a chart on another site and the house placements don&apos;t match ours, you haven&apos;t found an error. You&apos;ve found a house system disagreement, and it&apos;s the most common source of confusion in beginner astrology.</p>
            <p className="fbc-p">The planets&apos; positions are astronomy — they&apos;re identical everywhere. The <strong style={{ color:"#e8e4f0" }}>houses</strong> are a convention, and astrologers have argued about the right convention for two thousand years.</p>
            <ul className="fbc-list">
              <li><strong>Placidus</strong> divides the houses by time. It&apos;s the default on most Western sites and apps. Produces houses of very unequal size and breaks down above ~66° latitude.</li>
              <li><strong>Whole Sign</strong> gives each house one entire zodiac sign, starting with your Rising sign as the 1st house. Oldest system, standard in Hellenistic astrology, revived in the last decade.</li>
              <li><strong>Equal House</strong> starts at the Ascendant degree and cuts twelve equal 30° segments from there. Mathematically clean, works at any latitude.</li>
              <li><strong>Koch, Campanus, Regiomontanus</strong> — each has advocates.</li>
            </ul>
            <p className="fbc-p">The honest position: no house system has been demonstrated to be more correct than another, because none of them are testable. Astrologers pick one and stay consistent. If your Placidus chart from another site feels more accurate to you, that&apos;s a legitimate reason to prefer it, and we&apos;d rather tell you that than pretend the question is settled.</p>
          </div>

          {/* Block: birth chart vs natal vs horoscope */}
          <div className="fbc-block">
            <h2 className="fbc-h2">Birth chart, natal chart, horoscope — <em>what&apos;s actually different?</em></h2>
            <div className="fbc-tldr">
              <span className="fbc-tldr-l">Short answer</span>
              <p className="fbc-tldr-t">Birth chart and natal chart are the same thing — two names, one object. A horoscope is not the same thing: it&apos;s a forecast made by comparing current planetary positions against your birth chart. A daily horoscope in a magazine uses only your Sun sign, which is why it feels either uncannily accurate or completely wrong.</p>
            </div>
            <p className="fbc-p">These get used interchangeably and it causes real confusion.</p>
            <p className="fbc-p"><strong style={{ color:"#e8e4f0" }}>Birth chart and natal chart are the same thing.</strong> &ldquo;Natal&rdquo; is the more technical term; &ldquo;birth chart&rdquo; is the more common one. There&apos;s no difference in the calculation, the accuracy or the meaning. If a site charges more for a &ldquo;natal chart&rdquo; than a &ldquo;birth chart,&rdquo; that&apos;s pricing, not astronomy. See the <Link href="/natal-chart">full natal chart guide</Link>.</p>
            <p className="fbc-p"><strong style={{ color:"#e8e4f0" }}>A horoscope is not the same thing.</strong> Your birth chart is fixed — one calculation, done once, never changes. A horoscope is a forecast made by comparing <em>current</em> planetary positions against your birth chart. The daily horoscope in a magazine uses only your Sun sign, which means it&apos;s written for roughly one twelfth of the human population at once.</p>
            <p className="fbc-p"><strong style={{ color:"#e8e4f0" }}>A transit chart</strong> shows where the planets are right now, layered over your birth chart. That&apos;s what a genuine forecast is built from.</p>
          </div>

          {/* Block: How accurate */}
          <div className="fbc-block">
            <h2 className="fbc-h2">How accurate is a <em>birth chart reading?</em></h2>
            <div className="fbc-tldr">
              <span className="fbc-tldr-l">Short answer</span>
              <p className="fbc-tldr-t">The astronomy is exact and independently verifiable. The interpretation is a framework, not a measurement. Anyone claiming certainty about interpretation is overselling. A good reading is one specific enough to be uncomfortable rather than vague enough to be universally agreeable — which is the entire reason BluntChart exists.</p>
            </div>
            <p className="fbc-p">Two separate questions get bundled together here, and separating them is the honest answer.</p>
            <p className="fbc-p"><strong style={{ color:"#e8e4f0" }}>Is the calculation accurate?</strong> Yes, and this is verifiable. BluntChart uses a high-precision astronomical ephemeris. Planetary longitudes are accurate to arc-seconds and match the Swiss Ephemeris. You can check any placement against an independent source and it will agree.</p>
            <p className="fbc-p"><strong style={{ color:"#e8e4f0" }}>Is the interpretation accurate?</strong> That&apos;s a different kind of claim, and anyone selling you certainty here is selling you something. Astrology has no accepted mechanism and no controlled study has demonstrated predictive validity. What it demonstrably <em>is</em> good at is providing structured, specific language for patterns in personality and behaviour — a vocabulary for things people often struggle to articulate.</p>
            <p className="fbc-p">Our position is straightforward: the astronomy is exact, the interpretation is a framework, and a good reading is one that describes you specifically enough to be uncomfortable rather than vaguely enough to be universally agreeable. That second part is where most astrology fails, and it&apos;s the entire reason BluntChart exists.</p>
          </div>

          {/* Block: AI + astrology */}
          <div className="fbc-block">
            <h2 className="fbc-h2">Can AI read a <em>birth chart?</em></h2>
            <div className="fbc-tldr">
              <span className="fbc-tldr-l">Short answer</span>
              <p className="fbc-tldr-t">Increasingly, yes. Calculating a chart has never required AI — that&apos;s deterministic astronomy. What AI changes is the interpretation layer: a well-built AI reading works from the whole chart at once and can synthesize interactions between placements that template reports never could. The catch: the calculation must come from a real ephemeris, not from the language model.</p>
            </div>
            <p className="fbc-p">A traditional automated report works by looking up pre-written paragraphs: Venus in Scorpio returns paragraph 47, Moon in the 8th returns paragraph 112, and they&apos;re stapled together. The result reads disjointed because it <em>is</em> disjointed — nothing in it accounts for how those two placements interact.</p>
            <p className="fbc-p">A well-built AI reading works from the whole chart at once. It can register that your Venus in Scorpio sits in the 8th house, squares Saturn, and is ruled by a Pluto that&apos;s conjunct your Ascendant — and describe what that combination does to how you attach to people. That synthesis is what a human astrologer does and what template reports have never managed.</p>
            <p className="fbc-p">The limitation is equally real. AI will not tell you it doesn&apos;t know. Ask a general-purpose chatbot to read your chart and it will frequently calculate the placements incorrectly and then interpret the wrong chart with total confidence. The calculation has to come from a real ephemeris, not from the language model.</p>
            <p className="fbc-p">That&apos;s how BluntChart is built: exact astronomical calculation first, then interpretation over the complete chart. And it&apos;s written to say the thing a paid astrologer would soften. <Link href="/#try-it">Your chart is above — what it actually means is a different question →</Link></p>
          </div>

        </div>
      </section>


      {/* ── COMPARISON ── */}
      <section style={{ padding:"80px 0", background:"#0d0d18", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
        <div className="fbc-c">
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <span style={{ width:22, height:1, background:"#F0B84A" }}/>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"#F0B84A" }}>Why BluntChart</span>
          </div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:12 }}>
            BluntChart vs <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>other birth chart tools</em>
          </h2>
          <p style={{ fontSize:15, color:"rgba(232,228,240,0.55)", maxWidth:500, lineHeight:1.72, marginBottom:36 }}>
            Free charts are everywhere. What happens after you see it — that&apos;s where we&apos;re different.
          </p>
          <div style={{ border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden", maxWidth:720 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 140px 140px", background:"#0d0d18", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ padding:"16px 20px", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"rgba(232,228,240,0.55)" }}>Feature</div>
              <div style={{ padding:"16px 20px", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"#F0B84A" }}>BluntChart</div>
              <div style={{ padding:"16px 20px", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"rgba(232,228,240,0.55)" }}>Others</div>
            </div>
            {[
              { feature:"Based on exact birth time & place", us:true, them:"Limited" },
              { feature:"High-precision ephemeris (Astronomy Engine)", us:true, them:"Approximate" },
              { feature:"Personalized written reading", us:true, them:false },
              { feature:"Brutally honest, specific insights", us:true, them:false },
              { feature:"One-time payment, no subscription", us:true, them:"Subscription" },
              { feature:"Shareable identity card", us:true, them:false },
              { feature:"~1,500 words specific to your chart", us:true, them:"Generic text" },
              { feature:"Free preview before you pay", us:true, them:false },
            ].map((row, i, arr) => (
              <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 140px 140px", borderBottom: i < arr.length-1 ? "0.5px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ padding:"15px 20px", fontSize:14, color:"#e8e4f0", fontWeight:500 }}>{row.feature}</div>
                <div style={{ padding:"15px 20px", display:"flex", alignItems:"center" }}>
                  {row.us === true ? <span style={{ color:"#5dcaa5", fontWeight:700 }}>✓</span> : <span style={{ color:"rgba(212,83,126,0.6)" }}>✗</span>}
                </div>
                <div style={{ padding:"15px 20px", display:"flex", alignItems:"center" }}>
                  {row.them === true ? <span style={{ color:"#5dcaa5" }}>✓</span>
                   : row.them === false ? <span style={{ color:"rgba(212,83,126,0.6)" }}>✗</span>
                   : <span style={{ color:"#6b6585", fontStyle:"italic", fontSize:13 }}>{row.them}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section style={{ padding:"80px 0" }}>
        <div className="fbc-c">
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <span style={{ width:22, height:1, background:"#F0B84A" }}/>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"#F0B84A" }}>What people say</span>
          </div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:12 }}>
            People keep sending it<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>to their friends.</em>
          </h2>
          <p style={{ fontSize:15, color:"rgba(232,228,240,0.55)", maxWidth:440, lineHeight:1.72, marginBottom:36 }}>
            Real responses from our beta readers. Unfiltered, because that&apos;s the whole point.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
            {[
              { text:"I've used Co-Star, The Pattern, Sanctuary... none said anything I didn't already know. This one said things I hadn't told anyone.", name:"Michelle R.", meta:"Scorpio Sun · Cancer Moon", init:"M" },
              { text:"I was ready to roll my eyes. Three paragraphs in I had to put my phone down. It just... described me.", name:"Rachel T.", meta:"Virgo Rising · Libra Sun", init:"R" },
              { text:"Way more accurate than Co-Star ever was. And it didn't sugarcoat the parts I wasn't ready to hear.", name:"Sophie K.", meta:"Aries Sun · Pisces Moon", init:"S" },
              { text:"I felt attacked. In a good way. My therapist has been saying the same thing for six months. My chart said it better.", name:"Dani L.", meta:"Capricorn Sun · Gemini Moon", init:"D" },
              { text:"Finally astrology that doesn't sound like it was written for everyone and no one at the same time.", name:"Zara O.", meta:"Leo Sun · Scorpio Rising", init:"Z" },
              { text:"Twelve dollars. I spent two hours talking about it with my best friend. That's insane value.", name:"Chloe M.", meta:"Sagittarius Sun · Aquarius Moon", init:"C" },
            ].map((r, i) => (
              <div key={i} style={{ background:"#12121e", border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:14, padding:24, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-12, right:18, fontFamily:"var(--font-display)", fontSize:"5rem", color:"rgba(107,47,212,0.1)", lineHeight:1, pointerEvents:"none" }}>&ldquo;</div>
                <div style={{ display:"flex", gap:2, marginBottom:12 }}>{Array.from({length:5}).map((_,j) => <span key={j} style={{ color:"#F0B84A", fontSize:13 }}>★</span>)}</div>
                <p style={{ fontSize:14, color:"#e8e4f0", lineHeight:1.68, marginBottom:18, fontStyle:"italic" }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#6b2fd4,#d4537e)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontSize:14, fontWeight:700, color:"#fff" }}>{r.init}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"rgba(232,228,240,0.55)" }}>{r.name}</div>
                    <div style={{ fontSize:11, color:"rgba(232,228,240,0.3)" }}>{r.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:32 }}>
            <Link href="/#try-it" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"14px 30px", background:"linear-gradient(135deg,#6b2fd4,#d4537e)", color:"#fff", fontWeight:700, fontSize:14, letterSpacing:"0.04em", textTransform:"uppercase" as const, textDecoration:"none", borderRadius:10 }}>
              Get My Full Reading — $15 ✨
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding:"80px 0" }}>
        <div className="fbc-c" style={{ maxWidth:900 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <span style={{ width:22, height:1, background:"#F0B84A" }} />
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em",
              textTransform:"uppercase" as const, color:"#F0B84A" }}>
              Common questions
            </span>
          </div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)",
            fontWeight:800, lineHeight:1.1, marginBottom:32 }}>
            Birth chart <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              FAQ</em>
          </h2>

          {FAQS.map((f, i) => (
            <details key={i} style={{ borderBottom:"0.5px solid rgba(255,255,255,0.08)" }}>
              <summary style={{ padding:"20px 0", fontSize:15, fontWeight:600, color:"#e8e4f0",
                cursor:"pointer", listStyle:"none", display:"flex", alignItems:"center",
                justifyContent:"space-between" }}>
                {f.q}
                <span style={{ color:"#6b2fd4", fontSize:18, fontWeight:700, flexShrink:0, marginLeft:16 }}>+</span>
              </summary>
              <p style={{ fontSize:14, color:"rgba(232,228,240,0.6)", lineHeight:1.78,
                paddingBottom:20, paddingRight:40 }}>
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ padding:"64px 0", background:"#0d0d18",
        borderTop:"1px solid rgba(255,255,255,0.08)" }}>
        <div className="fbc-c" style={{ textAlign:"center" }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.4rem,3vw,2rem)",
            fontWeight:800, marginBottom:14 }}>
            Your chart is more than a map.<br/>
            <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              It's a mirror.</em>
          </h2>
          <p style={{ fontSize:14, color:"rgba(232,228,240,0.55)", maxWidth:460, margin:"0 auto 24px",
            lineHeight:1.72 }}>
            The chart above shows you where everything is. A BluntChart reading tells you what it
            actually means — in plain language, no sugarcoating.
          </p>
          <Link href="/#try-it" className="fbc-cta-btn" style={{ maxWidth:360 }}>
            Get My Full Reading · $15 ✦
          </Link>
        </div>
      </section>
</>
  );
}