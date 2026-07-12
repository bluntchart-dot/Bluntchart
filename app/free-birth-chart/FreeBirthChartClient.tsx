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
    a: "A birth chart (also called a natal chart) is a map of exactly where every planet was at the moment you were born. It's calculated from your birth date, exact birth time, and birth location. Unlike a simple horoscope that only uses your Sun sign, a birth chart shows the positions of the Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, and Pluto across the 12 zodiac signs and 12 astrological houses. No two birth charts are the same — yours is as unique as a fingerprint.",
  },
  {
    q: "Do I need my exact birth time?",
    a: "Your exact birth time is critical for two things: your Rising sign (Ascendant) and your house placements. The Rising sign changes roughly every 2 hours, so even a 30-minute difference can shift it to a different zodiac sign. Without your birth time, we can still calculate your Sun, Moon, and planetary signs accurately — but your Rising sign and house positions may be off. Your birth certificate almost always has the time listed.",
  },
  {
    q: "What is a Rising sign (Ascendant)?",
    a: "Your Rising sign, also called the Ascendant, is the zodiac sign that was rising on the eastern horizon at the exact moment and location of your birth. It's often called the 'mask' you wear — the first impression you give to others. While your Sun sign represents your core identity and your Moon sign your emotional inner world, your Rising sign shapes how you appear to the outside world. It also determines the layout of all 12 houses in your chart.",
  },
  {
    q: "What are the 'Big Three' in astrology?",
    a: "The Big Three refers to your Sun sign, Moon sign, and Rising sign. Your Sun sign is your core identity — the essence of who you are. Your Moon sign is your emotional nature — how you process feelings, what you need to feel safe. Your Rising sign is your outward personality — how people perceive you before they really know you. Together, these three placements give a much more complete picture than your Sun sign alone.",
  },
  {
    q: "How accurate is this birth chart calculator?",
    a: "This calculator uses astronomy-engine, a high-precision astronomical computation library. It calculates geocentric planetary positions (as seen from Earth), which is the standard for Western astrology. Planet longitudes are accurate to arc-second precision. House cusps are calculated using the Equal house system from the Ascendant. The results match professional-grade ephemeris tools like the Swiss Ephemeris.",
  },
  {
    q: "What is the difference between a birth chart and a daily horoscope?",
    a: "A birth chart is a permanent, one-time calculation unique to your exact moment of birth. A daily horoscope is a general forecast based only on your Sun sign — one of 12 possibilities — and applies to roughly 600 million people at once. Your birth chart contains dozens of data points (planet positions, house placements, aspects between planets) that make it specific to you alone.",
  },
  {
    q: "What do the houses mean in a birth chart?",
    a: "The 12 houses in a birth chart represent different areas of life. The 1st house is self and appearance. The 7th house is partnerships and relationships. The 10th house is career and public reputation. Each planet falls in a specific house, showing where its energy plays out in your life. For example, Venus in the 7th house suggests love and partnership are central themes, while Venus in the 10th house might mean your career involves beauty, art, or diplomacy.",
  },
  {
    q: "What are aspects in astrology?",
    a: "Aspects are the angles between planets in your birth chart. They show how different parts of your personality interact. The five major aspects are: conjunction (0°, planets merged), sextile (60°, harmonious), square (90°, tension), trine (120°, flowing ease), and opposition (180°, push-pull). Tighter aspects (smaller orb) are stronger. Your chart's aspect pattern reveals your internal dynamics — where you flow easily and where you face friction.",
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
        .fbc-c{max-width:1100px;margin:0 auto;padding:0 24px}
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


      {/* ── SEO CONTENT ── */}
      <section style={{ padding:"80px 0", background:"#0d0d18",
        borderTop:"1px solid rgba(255,255,255,0.08)" }}>
        <div className="fbc-c" style={{ maxWidth:900 }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)",
            fontWeight:800, lineHeight:1.1, marginBottom:24 }}>
            How to read your <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              birth chart</em>
          </h2>

          <div style={{ fontSize:15, color:"rgba(232,228,240,0.6)", lineHeight:1.78 }}>
            <p style={{ marginBottom:20 }}>
              Your birth chart is a map of the sky at the exact moment you took your first breath. It captures
              the positions of the Sun, Moon, and every planet in our solar system — placed across the
              twelve zodiac signs and twelve astrological houses. Each placement means something different
              about your personality, emotional patterns, relationships, career drive, and the challenges
              you're likely to face.
            </p>

            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700,
              color:"#e8e4f0", marginBottom:12 }}>
              The planets in your natal chart
            </h3>
            <p style={{ marginBottom:20 }}>
              Each planet represents a different dimension of who you are. The Sun is your core identity — your
              ego and sense of self. The Moon is your emotional nature — what makes you feel safe and what
              triggers you. Mercury governs how you think and communicate. Venus shows how you love and what
              you find beautiful. Mars reveals your drive, ambition, and how you handle conflict. Jupiter
              points to where you experience luck and growth. Saturn reveals your greatest challenges and the
              lessons you're here to learn. Uranus, Neptune, and Pluto are generational planets that shape
              broader patterns in your psyche.
            </p>

            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700,
              color:"#e8e4f0", marginBottom:12 }}>
              The twelve houses
            </h3>
            <p style={{ marginBottom:20 }}>
              The houses are like a stage — they show where in your life each planet's energy expresses itself.
              The 1st house is self and identity. The 2nd house governs money and values. The 4th house is
              home and family. The 7th house rules partnerships and marriage. The 10th house shapes your
              career and public reputation. The 12th house holds your subconscious, hidden fears, and
              spiritual nature. When a planet falls in a specific house, that area of life becomes a major
              theme for you.
            </p>

            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700,
              color:"#e8e4f0", marginBottom:12 }}>
              Why your birth time matters
            </h3>
            <p style={{ marginBottom:20 }}>
              Your birth time determines your Rising sign (Ascendant), which changes approximately every
              two hours. The Rising sign sets the entire house system of your chart — meaning a difference
              of even 30 minutes can shift planets into different houses and change the interpretation
              significantly. This is why professional astrologers always ask for your exact birth time, and
              why a chart calculated without one is incomplete. Check your birth certificate — the time is
              almost always recorded there.
            </p>

            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700,
              color:"#e8e4f0", marginBottom:12 }}>
              About this calculator
            </h3>
            <p>
              This free birth chart calculator uses astronomy-engine, a high-precision astronomical
              computation library. It calculates geocentric planetary positions (the standard for
              Western astrology), uses the Equal house system from the Ascendant, and computes all five
              major aspects (conjunction, sextile, square, trine, opposition) between planets. The
              chart wheel above displays the zodiac signs, house cusps, planet glyphs at their exact
              ecliptic positions, and aspect lines color-coded by type.
            </p>
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