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
  loading: () => <div className="h-[320px] flex items-center justify-center opacity-50 text-sm">Drawing your chart…</div>,
});

const PLANET_SYMBOLS: Record<string, string> = { Sun:"☉", Moon:"☽", Mercury:"☿", Venus:"♀", Mars:"♂", Jupiter:"♃", Saturn:"♄", Uranus:"♅", Neptune:"♆", Pluto:"♇" };

/* ── Brief planet-in-sign interpretations (shown after calc) ── */
const PLANET_MEANING: Record<string, string> = {
  Sun: "Your core identity and ego — the self you're growing into",
  Moon: "Your emotional nature — what you need to feel safe and how you process feelings",
  Mercury: "How you think and communicate — your mental wiring and conversation style",
  Venus: "How you love and what you find beautiful — your relationship patterns and values",
  Mars: "Your drive and aggression — how you pursue goals and handle conflict",
  Jupiter: "Where you find luck and growth — the area of life that expands naturally",
  Saturn: "Your greatest challenge — the lesson your chart keeps making you confront",
  Uranus: "Where you break rules — your need for independence and unconventional expression",
  Neptune: "Your imagination and blind spots — where you idealize, escape, or transcend",
  Pluto: "Your deepest transformation — the power dynamics and rebirth patterns in your life",
};

const REVIEWS = [
  { text: "I've used Co-Star, The Pattern, Sanctuary... none said anything I didn't already know. This one said things I hadn't told anyone.", name: "Michelle R.", meta: "Scorpio Sun · Cancer Moon", init: "M" },
  { text: "Three paragraphs in I had to put my phone down. It described me. Not my sign. Me.", name: "Rachel T.", meta: "Libra Sun · Virgo Rising", init: "R" },
  { text: "Way more accurate than Co-Star. It didn't sugarcoat the parts I wasn't ready to hear.", name: "Sophie K.", meta: "Aries Sun · Pisces Moon", init: "S" },
  { text: "My therapist has been saying the same thing for six months. My chart said it better in one paragraph.", name: "Dani L.", meta: "Capricorn Sun · Gemini Moon", init: "D" },
  { text: "Finally astrology that doesn't sound like it was written for everyone and no one at the same time.", name: "Zara O.", meta: "Leo Sun · Scorpio Rising", init: "Z" },
  { text: "Twelve dollars. I spent two hours talking about it with my best friend. Insane value.", name: "Chloe M.", meta: "Sagittarius Sun · Aquarius Moon", init: "C" },
];

const FAQS = [
  { q: "What is a natal chart?", a: "A natal chart — also called a birth chart — is a snapshot of the sky at the exact moment and location of your birth. It maps the positions of the Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, and Pluto across the twelve zodiac signs and twelve astrological houses. Think of it as your cosmic fingerprint: no two natal charts are identical unless two people were born at the same time in the same place." },
  { q: "How do I read my natal chart?", a: "Start with the Big Three: Sun sign (your identity), Moon sign (your emotions), and Rising sign (how others see you). Then examine each planet's sign and house. The sign shows HOW the energy expresses — Venus in Scorpio loves intensely and privately. The house shows WHERE — Venus in the 10th house brings love into your public life and career. Finally, aspects (angles between planets) show the internal tensions and harmonies in your personality." },
  { q: "What do the houses mean in a natal chart?", a: "The 12 houses represent different life areas. 1st: self and identity. 2nd: money and values. 3rd: communication and siblings. 4th: home and family. 5th: creativity and romance. 6th: health and daily routines. 7th: partnerships and marriage. 8th: transformation and shared resources. 9th: philosophy and travel. 10th: career and reputation. 11th: friendships and aspirations. 12th: subconscious and hidden patterns." },
  { q: "Is a natal chart the same as a horoscope?", a: "Not exactly. Your natal chart is a permanent, one-time calculation — it never changes. A horoscope is a forecast based on current planetary movements compared against your natal chart. The daily horoscopes you see in magazines only use your Sun sign. A proper astrological forecast uses your entire natal chart, which is far more specific and accurate." },
  { q: "What does each planet represent?", a: "Sun = ego and identity. Moon = emotions and instincts. Mercury = communication and thinking. Venus = love and beauty. Mars = action and desire. Jupiter = expansion and luck. Saturn = discipline and challenges. Uranus = rebellion and innovation. Neptune = dreams and illusion. Pluto = power and transformation. Each planet in a specific sign and house tells a different part of your story." },
  { q: "Can I get a natal chart without my birth time?", a: "Partially. Without your birth time, planet positions by zodiac sign are still accurate (except possibly the Moon, which changes signs every 2.5 days). However, you'll miss your Rising sign, house placements, and the precise Moon position. These are crucial for a complete reading. Check your birth certificate — the time is almost always recorded." },
  { q: "How accurate is this natal chart calculator?", a: "This calculator uses astronomy-engine, a high-precision astronomical computation library. It calculates geocentric planetary positions accurate to arc-second precision, matching professional tools like the Swiss Ephemeris. Houses are calculated using the Equal house system from the Ascendant." },
];

export default function NatalChartClient() {
  const [fname, setFname] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [btime, setBtime] = useState("");
  const [city, setCity] = useState("");
  const [cityGeo, setCityGeo] = useState<SelectedLocation | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [chart, setChart] = useState<ChartData | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  if (typeof window !== "undefined") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useState(() => { const fn = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", fn, { passive: true }); });
  }

  const handleCalculate = async () => {
    if (!email.trim() || !dob || !btime || !city.trim()) { setErr("Please fill in your email, date of birth, birth time, and city."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErr("Please enter a valid email address."); return; }
    setErr(""); setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    try {
      let geo: { lat: number; lng: number; timezone: string } | null = null;
      if (cityGeo) { geo = { lat: cityGeo.lat, lng: cityGeo.lng, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "" }; }
      else { geo = await geocodeBirthPlace(city.trim()); }
      if (!geo) throw new Error("Could not locate your city. Try adding country.");
      const birth: BirthData = { name: fname.trim() || "You", date: dob, time: btime, lat: geo.lat, lng: geo.lng, timezone: geo.timezone, placeName: city.trim() };
      const chartData = calculateChart(birth);
      setChart(chartData);
      try { await fetch("/api/save-pending", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ name: fname.trim() || "Natal Chart User", email: normalizedEmail, dob, birth_time: btime, city: city.trim(), birth_lat: geo.lat, birth_lng: geo.lng, timezone: geo.timezone, source: "natal-chart" }) }); } catch {}
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 200);
    } catch (e) { setErr(e instanceof Error ? e.message : "Something went wrong."); }
    finally { setLoading(false); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--font-display:'Playfair Display',Georgia,serif;--font-body:'DM Sans',system-ui,sans-serif;--bg:#09090f;--card:#12121e;--border:rgba(255,255,255,0.08);--white:#e8e4f0;--dim:rgba(232,228,240,0.55);--gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);--purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5}
        html{scroll-behavior:smooth}body{background:var(--bg);color:var(--white);font-family:var(--font-body);-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .nc-c{max-width:1280px;margin:0 auto;padding:0 40px}
        @media(max-width:768px){.nc-c{padding:0 20px}}
        .nc-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;transition:all .3s}
        .nc-nav.on{background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
        .nc-logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:10px}
        .nc-logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .nc-inp{width:100%;background:rgba(255,255,255,0.04);border:0.5px solid rgba(255,255,255,0.1);border-radius:10px;padding:13px 14px;font-size:14px;color:#e8e4f0;font-family:inherit;outline:none}
        .nc-inp:focus{border-color:rgba(107,47,212,0.5)}
        .nc-lbl{display:block;font-size:11px;font-weight:600;color:#6b6585;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:6px}
        .nc-btn{width:100%;background:linear-gradient(135deg,#6b2fd4,#d4537e);color:#fff;border:none;border-radius:12px;padding:16px 20px;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;transition:opacity .2s}
        .nc-btn:hover{opacity:.88}.nc-btn:disabled{opacity:.5;cursor:not-allowed}
        .nc-cta{display:block;width:100%;max-width:480px;margin:0 auto;background:linear-gradient(135deg,#f0b84a,#e8854a);color:#0d0800;border:none;border-radius:12px;padding:18px 24px;font-size:16px;font-weight:700;font-family:inherit;cursor:pointer;text-align:center;text-decoration:none;transition:opacity .2s,transform .15s}
        .nc-cta:hover{opacity:.88;transform:translateY(-1px)}
        @media(max-width:768px){.nc-nav-links{display:none!important}.nc-planet-grid{grid-template-columns:1fr!important}}
      `}</style>

      {/* NAV */}
      <nav className={`nc-nav${scrolled?" on":""}`}>
        <div className="nc-c" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Link href="/" className="nc-logo"><Image src="/mascot.png" alt="BluntChart" width={34} height={34} style={{ borderRadius:"50%" }}/><span className="g">BluntChart</span></Link>
          <div className="nc-nav-links" style={{ display:"flex", alignItems:"center", gap:24 }}>
            <Link href="/free-birth-chart" style={{ fontSize:13, color:"var(--dim)", textDecoration:"none" }}>Birth Chart</Link>
            <Link href="/big-three-calculator" style={{ fontSize:13, color:"var(--dim)", textDecoration:"none" }}>Big Three</Link>
            <Link href="/#try-it" style={{ fontSize:13, color:"#F0B84A", textDecoration:"none", fontWeight:600, border:"1px solid var(--gold-dim)", padding:"6px 15px", borderRadius:4 }}>Full Reading $15</Link>
          </div>
        </div>
      </nav>

      {/* HERO + FORM */}
      <section style={{ paddingTop:120, paddingBottom:64, position:"relative" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 50% -10%,rgba(107,47,212,.08) 0%,transparent 50%)", pointerEvents:"none" }}/>
        <div className="nc-c" style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:12, color:"rgba(232,228,240,0.3)", marginBottom:24 }}>
            <Link href="/" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>BluntChart</Link><span style={{ margin:"0 8px" }}>/</span><span style={{ color:"rgba(232,228,240,0.5)" }}>Free Natal Chart</span>
          </div>
          <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"#F0B84A", padding:"5px 14px", border:"1px solid var(--gold-dim)", borderRadius:100, background:"rgba(240,184,74,0.06)", marginBottom:24 }}>✦ Free natal chart · Instant reading</div>
            <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.2rem,5.5vw,3.6rem)", fontWeight:900, lineHeight:1.08, letterSpacing:"-0.02em", marginBottom:14 }}>
              Free Natal Chart<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Reading</em>
            </h1>
            <p style={{ fontSize:16, color:"var(--dim)", lineHeight:1.72, maxWidth:560, margin:"0 auto 12px" }}>
              Your natal chart is your cosmic fingerprint — a map of every planet at the moment you were born.
              Generate yours free and see what your placements reveal about your personality, emotions, and patterns.
            </p>
            <p style={{ fontSize:13, color:"rgba(232,228,240,0.3)", marginBottom:40 }}>Free, instant, no account needed. Includes planet positions, houses, and aspects.</p>
          </div>

          {/* FORM */}
          <div style={{ maxWidth:600, margin:"0 auto", background:"rgba(255,255,255,0.03)", border:"0.5px solid var(--border)", borderRadius:18, padding:32 }}>
            {err && <div style={{ background:"rgba(212,83,126,0.08)", border:"0.5px solid rgba(212,83,126,0.3)", borderRadius:10, padding:"11px 14px", fontSize:13, color:"#f0a0b8", marginBottom:14 }}>{err}</div>}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              <div><label className="nc-lbl">First name <span style={{ color:"#3a3858", fontWeight:400 }}>(optional)</span></label><input className="nc-inp" value={fname} onChange={e=>setFname(e.target.value)} placeholder="e.g. Sarah"/></div>
              <div><label className="nc-lbl">Email address *</label><input type="email" className="nc-inp" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com"/><small style={{ fontSize:11, color:"#3a3858", marginTop:4, display:"block" }}>We&apos;ll send your natal chart here</small></div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              <div><label className="nc-lbl">Date of birth *</label><input type="date" className="nc-inp" value={dob} onChange={e=>setDob(e.target.value)}/></div>
              <div><label className="nc-lbl">Exact birth time *</label><input type="time" className="nc-inp" value={btime} onChange={e=>setBtime(e.target.value)}/><small style={{ fontSize:11, color:"#3a3858", marginTop:4, display:"block" }}>From birth certificate — needed for houses &amp; Rising</small></div>
            </div>
            <div style={{ marginBottom:24 }}><label className="nc-lbl">City &amp; country of birth *</label><LocationPicker value={city} onChange={(loc,raw) => { setCityGeo(loc); setCity(raw); }} placeholder="e.g. New York, USA or Mumbai, India"/></div>
            <button className="nc-btn" onClick={handleCalculate} disabled={loading}>{loading ? "Generating your natal chart…" : "Generate My Natal Chart — Free ✨"}</button>
            <p style={{ fontSize:11, color:"#2e2c3e", textAlign:"center", marginTop:12 }}>Your data is used to calculate your chart. We may send your reading offer — no spam, ever.</p>
          </div>
        </div>
      </section>

      {/* RESULT */}
      {chart && (
        <section ref={resultRef} style={{ paddingBottom:80 }}>
          <div className="nc-c">
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:40 }}>
              <span style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.06)" }}/>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase" as const, color:"#3a3858" }}>{fname ? `${fname}'s` : "Your"} natal chart</span>
              <span style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.06)" }}/>
            </div>

            {/* Chart Wheel */}
            <div style={{ marginBottom:48 }}><ChartWheel chart={chart}/></div>

            {/* Planet placements with meanings */}
            <div style={{ marginBottom:48 }}>
              <h3 style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:700, marginBottom:8 }}>Your planetary placements</h3>
              <p style={{ fontSize:14, color:"rgba(232,228,240,0.45)", marginBottom:24, maxWidth:560, lineHeight:1.65 }}>
                Each planet in your natal chart governs a different dimension of who you are. Here&apos;s where yours fall.
              </p>
              <div className="nc-planet-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                {chart.planets.map((p) => (
                  <div key={p.name} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:12, padding:"16px 18px", display:"flex", gap:14, alignItems:"flex-start" }}>
                    <span style={{ fontSize:22, color:"#F0B84A", fontFamily:"serif", flexShrink:0, marginTop:2 }}>{PLANET_SYMBOLS[p.name] ?? p.name[0]}</span>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:"var(--white)", marginBottom:2 }}>{p.name} in {p.sign}</div>
                      <div style={{ fontSize:11, color:"rgba(232,228,240,0.35)", marginBottom:6 }}>{p.degree.toFixed(1)}° · House {p.house}{p.retrograde ? " · ℞ Retrograde" : ""}</div>
                      <p style={{ fontSize:12, color:"rgba(232,228,240,0.5)", lineHeight:1.55 }}>{PLANET_MEANING[p.name] ?? ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div style={{ background:"rgba(107,47,212,0.04)", border:"0.5px solid rgba(107,47,212,0.2)", borderRadius:20, padding:"40px 32px", textAlign:"center", marginBottom:48 }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"#F0B84A", marginBottom:12 }}>Your natal chart is calculated — now hear what it means</p>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.4rem,3.5vw,2rem)", fontWeight:800, lineHeight:1.1, marginBottom:14 }}>
                Want the <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>brutally honest interpretation?</em>
              </h2>
              <p style={{ fontSize:14, color:"var(--dim)", lineHeight:1.72, maxWidth:480, margin:"0 auto 24px" }}>
                The chart above shows WHERE everything is. A BluntChart reading tells you WHAT it means — in plain
                language, specific to your exact placements. 10 insights, ~1,500 words, zero sugarcoating.
              </p>
              <Link href="/#try-it" className="nc-cta">Get My Full Reading · $15 ✦</Link>
              <p style={{ fontSize:12, color:"#3a3858", marginTop:12 }}>One-time · No subscription · Emailed instantly</p>
            </div>

            {/* Aspects */}
            {chart.aspects.length > 0 && (
              <div style={{ marginBottom:48 }}>
                <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, marginBottom:8 }}>Aspects in your natal chart</h3>
                <p style={{ fontSize:14, color:"rgba(232,228,240,0.45)", marginBottom:20, maxWidth:560, lineHeight:1.65 }}>
                  Aspects reveal the internal dynamics of your personality — where energy flows and where it clashes.
                </p>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))", gap:8 }}>
                  {chart.aspects.slice(0,15).map((asp,i) => (
                    <div key={i} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:10, padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", fontSize:13 }}>
                      <span style={{ color:"rgba(232,228,240,0.7)" }}>{PLANET_SYMBOLS[asp.planet1]} {asp.planet1} — {PLANET_SYMBOLS[asp.planet2]} {asp.planet2}</span>
                      <span style={{ fontSize:11, fontWeight:600, textTransform:"capitalize" as const, color: asp.type==="trine"||asp.type==="sextile" ? "#6090e0" : asp.type==="conjunction" ? "#8cc88c" : "#e07070" }}>{asp.type} ({asp.orb}°)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SEO PILLAR GUIDE */}
      <section style={{ padding:"80px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}>
        <div className="nc-c" style={{ maxWidth:1080 }}>

          <style>{`
            .nc-h2{font-family:var(--font-display);font-size:clamp(1.5rem,3.2vw,2rem);font-weight:800;line-height:1.15;letter-spacing:-0.01em;color:#e8e4f0;margin:0 0 14px}
            .nc-h2 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
            .nc-h3{font-family:var(--font-display);font-size:18px;font-weight:700;color:#e8e4f0;margin:24px 0 10px}
            .nc-p{font-size:15px;color:rgba(232,228,240,0.65);line-height:1.78;margin-bottom:16px}
            .nc-p a{color:#F0B84A;text-decoration:underline;text-decoration-color:rgba(240,184,74,0.35);text-underline-offset:3px}
            .nc-p a:hover{text-decoration-color:#F0B84A}
            .nc-tldr{background:rgba(240,184,74,0.06);border-left:3px solid #F0B84A;border-radius:0 10px 10px 0;padding:16px 20px;margin:0 0 24px}
            .nc-tldr-l{font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#F0B84A;margin-bottom:6px;display:block}
            .nc-tldr-t{font-size:15px;color:#e8e4f0;line-height:1.65}
            .nc-block{margin-bottom:56px}
            .nc-list{margin:0 0 16px 0;padding-left:22px}
            .nc-list li{font-size:15px;color:rgba(232,228,240,0.65);line-height:1.7;margin-bottom:8px}
            .nc-list li strong{color:#e8e4f0;font-weight:600}
            .nc-table-wrap{overflow-x:auto;margin:8px 0 24px;-webkit-overflow-scrolling:touch}
            .nc-table{width:100%;border-collapse:collapse;font-size:14px;min-width:520px}
            .nc-table th,.nc-table td{padding:11px 14px;text-align:left;border-bottom:0.5px solid rgba(255,255,255,0.06);color:rgba(232,228,240,0.7);line-height:1.5}
            .nc-table th{color:#F0B84A;font-weight:700;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;background:rgba(255,255,255,0.02)}
            .nc-table td:first-child{color:#e8e4f0;font-weight:600;white-space:nowrap}
          `}</style>

          {/* Step-by-step */}
          <div className="nc-block">
            <h2 className="nc-h2">How do you read a <em>natal chart, step by step?</em></h2>
            <div className="nc-tldr">
              <span className="nc-tldr-l">Short answer</span>
              <p className="nc-tldr-t">Start with the Big Three, find your chart ruler, look for concentrations (stelliums, element balance), read the personal planets by sign and house, then the social and outer planets, and only then read aspects. Everyone opens their first natal chart, sees a circle covered in symbols, and closes it again — because nobody told them what order to read it in.</p>
            </div>
            <h3 className="nc-h3">Step 1 — Start with the Big Three</h3>
            <p className="nc-p">Sun, Moon, Ascendant. Identity, emotion, presentation. These three give you about 60% of the useful information in the chart for about 5% of the effort. Do not move to step two until these feel solid. If you haven&apos;t yet, run your <Link href="/big-three-calculator">Big Three</Link> first.</p>
            <h3 className="nc-h3">Step 2 — Find your chart ruler</h3>
            <p className="nc-p">The planet ruling your Rising sign is the thread the rest of the chart hangs from. Where it sits — which sign, which house — sets the overall direction of your life. Libra Rising means Venus is your chart ruler; find Venus and you&apos;ve found your chart&apos;s centre of gravity.</p>
            <h3 className="nc-h3">Step 3 — Look for concentrations</h3>
            <p className="nc-p">Scan for clusters. Three or more planets in one sign or house is a <strong style={{ color:"#e8e4f0" }}>stellium</strong>, and it will overwhelm everything around it. Also check the balance: how many planets in Fire, Earth, Air, Water? Cardinal, Fixed, Mutable? A chart with seven planets in Water signs belongs to someone who feels first and thinks second, whatever their Sun sign says.</p>
            <p className="nc-p">Note the empty houses too, but don&apos;t panic about them. An empty 7th house does not mean you&apos;ll never marry — it means partnership isn&apos;t a defining struggle of your life. The house is still ruled by a sign, and that sign&apos;s ruler is still somewhere in your chart, doing the work.</p>
            <h3 className="nc-h3">Step 4 — Read the personal planets by sign and house</h3>
            <p className="nc-p">Sun, <Link href="/moon-sign-calculator">Moon</Link>, Mercury, Venus and Mars are the <strong style={{ color:"#e8e4f0" }}>personal planets</strong>. For each one, ask two questions: what sign is it in (how the energy expresses), and what house is it in (where it plays out). Mars in Aries in the 6th house is aggressive energy aimed at daily work and routine — someone who trains hard and burns out. Mars in Aries in the 7th is the same aggressive energy aimed at partnership — someone who picks fights with the people closest to them. Same drive, different arena.</p>
            <h3 className="nc-h3">Step 5 — Then the social and outer planets</h3>
            <p className="nc-p">Jupiter and Saturn are the <strong style={{ color:"#e8e4f0" }}>social planets</strong> — shared with people born within a couple of years of you. Uranus, Neptune and Pluto are <strong style={{ color:"#e8e4f0" }}>generational</strong>, sitting in the same sign for 7 to 20 years at a time. Their sign describes your generation. Their house and aspects to your personal planets are what make them personal to you. If Pluto squares your Sun, that&apos;s yours. If Pluto is in Scorpio, that&apos;s just being born in the 1980s.</p>
            <h3 className="nc-h3">Step 6 — Read the aspects last</h3>
            <p className="nc-p">Aspects are where the chart stops being a list and starts being a personality. Look for the tight ones first — aspects within 3 degrees of exact are dramatically stronger than aspects at 8 degrees. Then look for aspects involving the Sun, Moon or Ascendant, because those hit the core.</p>
          </div>

          {/* Houses */}
          <div className="nc-block">
            <h2 className="nc-h2">What does each <em>house mean in astrology?</em></h2>
            <div className="nc-tldr">
              <span className="nc-tldr-l">Short answer</span>
              <p className="nc-tldr-t">The twelve houses represent twelve domains of life — self, money, communication, home, creativity, work, partnership, transformation, philosophy, career, community and the subconscious. Planets in a house tell you where that energy lives out in your life. Most sites give you a one-line keyword per house; here&apos;s what each one actually governs.</p>
            </div>
            <div className="nc-table-wrap">
              <table className="nc-table">
                <thead><tr><th>House</th><th>Governs</th><th>The real question it answers</th></tr></thead>
                <tbody>
                  <tr><td>1st</td><td>Self, body, appearance, approach</td><td>How do I enter a room?</td></tr>
                  <tr><td>2nd</td><td>Money, possessions, self-worth</td><td>What do I value, and what am I worth?</td></tr>
                  <tr><td>3rd</td><td>Communication, siblings, local environment</td><td>How does my mind work day to day?</td></tr>
                  <tr><td>4th</td><td>Home, family, roots, private self</td><td>Where do I come from, and what did it cost?</td></tr>
                  <tr><td>5th</td><td>Creativity, romance, play, children</td><td>What do I make when nobody&apos;s asking?</td></tr>
                  <tr><td>6th</td><td>Work, health, routine, service</td><td>What does my ordinary Tuesday look like?</td></tr>
                  <tr><td>7th</td><td>Partnership, marriage, open enemies</td><td>Who do I need, and who do I keep attracting?</td></tr>
                  <tr><td>8th</td><td>Death, sex, transformation, shared resources</td><td>What am I not willing to look at?</td></tr>
                  <tr><td>9th</td><td>Philosophy, travel, higher education, belief</td><td>What do I think it all means?</td></tr>
                  <tr><td>10th</td><td>Career, reputation, public role, authority</td><td>What am I known for?</td></tr>
                  <tr><td>11th</td><td>Friends, networks, hopes, collective causes</td><td>Where do I belong?</td></tr>
                  <tr><td>12th</td><td>Subconscious, isolation, hidden patterns</td><td>What runs me that I can&apos;t see?</td></tr>
                </tbody>
              </table>
            </div>
            <h3 className="nc-h3">Angular, succedent, cadent</h3>
            <p className="nc-p">The houses also group into three types — the layer most beginner guides skip entirely.</p>
            <p className="nc-p"><strong style={{ color:"#e8e4f0" }}>Angular houses (1, 4, 7, 10)</strong> sit on the four angles. Planets here are loud. They act. They&apos;re visible in your life whether you want them to be or not. A chart with heavy angular emphasis belongs to someone who <em>makes things happen</em>.</p>
            <p className="nc-p"><strong style={{ color:"#e8e4f0" }}>Succedent houses (2, 5, 8, 11)</strong> follow the angles. They consolidate, hold, sustain and accumulate. Planets here build slowly and don&apos;t let go.</p>
            <p className="nc-p"><strong style={{ color:"#e8e4f0" }}>Cadent houses (3, 6, 9, 12)</strong> precede the angles. They process, adapt, learn and release. Planets here are more internal, more restless, more mental. Heavy cadent emphasis often means a life spent thinking, teaching, analysing or healing rather than commanding.</p>
            <p className="nc-p">Two people can have the same planets in the same signs and completely different lives because one has them angular and the other has them cadent.</p>
          </div>

          {/* Aspects */}
          <div className="nc-block">
            <h2 className="nc-h2">What are <em>natal chart aspects</em>, and what do they mean?</h2>
            <div className="nc-tldr">
              <span className="nc-tldr-l">Short answer</span>
              <p className="nc-tldr-t">An aspect is the angular distance between two planets. Aspects describe whether two parts of your personality cooperate, compete, or refuse to acknowledge each other. The five majors are conjunction (0°), sextile (60°), square (90°), trine (120°) and opposition (180°). Squares — often feared — are also the aspects most productive high achievers have plenty of.</p>
            </div>
            <p className="nc-p"><strong style={{ color:"#e8e4f0" }}>Conjunction (0°)</strong> — two planets in the same place. Their energies fuse and become inseparable. Sun conjunct Jupiter is expansive confidence. Sun conjunct Saturn is a lifetime of feeling not-quite-enough while quietly outworking everyone.</p>
            <p className="nc-p"><strong style={{ color:"#e8e4f0" }}>Sextile (60°)</strong> — an opportunity, not a gift. Two planets that work well together <em>if you use them</em>. Sextiles are the aspects people leave on the table.</p>
            <p className="nc-p"><strong style={{ color:"#e8e4f0" }}>Square (90°)</strong> — friction. Two planets pulling in incompatible directions, generating constant internal tension. Squares are also the most productive aspects in the chart, because tension is what makes people build things.</p>
            <p className="nc-p"><strong style={{ color:"#e8e4f0" }}>Trine (120°)</strong> — natural ease. Talent that arrived without effort. The shadow of a trine is that things which come easily rarely get developed, so trines often show up as wasted potential.</p>
            <p className="nc-p"><strong style={{ color:"#e8e4f0" }}>Opposition (180°)</strong> — a push-pull. Oppositions usually get projected onto other people before they get integrated — you&apos;ll meet the other half of your opposition in your relationships until you own it.</p>
            <p className="nc-p"><strong style={{ color:"#e8e4f0" }}>Orb</strong> is the tolerance. An aspect isn&apos;t usually exact — a square at 88° still counts. The closer to exact, the more powerful. Aspects to the Sun and Moon are given wider orbs than aspects between minor planets.</p>
          </div>

          {/* Chart shape */}
          <div className="nc-block">
            <h2 className="nc-h2">What is your <em>chart shape</em>, and why does it matter?</h2>
            <div className="nc-tldr">
              <span className="nc-tldr-l">Short answer</span>
              <p className="nc-tldr-t">The overall distribution of planets around the wheel tells you something before you read a single placement. Bundle, bowl, bucket, locomotive, seesaw, splash, splay — each shape describes a different way of moving through the world. This is the layer that separates people who have looked at a chart from people who can read one.</p>
            </div>
            <ul className="nc-list">
              <li><strong>Bundle</strong> — all planets within about 120°. Intensely focused, narrow, specialist. Enormous depth, limited range.</li>
              <li><strong>Bowl</strong> — all planets in one half of the chart. A person defined by what they&apos;re missing; the empty half is a lifelong preoccupation.</li>
              <li><strong>Bucket</strong> — a bowl plus one isolated planet on the far side. That single planet becomes the handle, and the whole personality funnels through it.</li>
              <li><strong>Locomotive</strong> — planets spread across about two thirds. Self-driven, relentless, executive.</li>
              <li><strong>Seesaw</strong> — two clusters opposite each other. A life of negotiating between two incompatible commitments.</li>
              <li><strong>Splash</strong> — planets spread evenly. Interested in everything, scattered, generalist.</li>
              <li><strong>Splay</strong> — irregular clusters. Individualistic and hard to categorise.</li>
            </ul>
            <h3 className="nc-h3">Your dominant planet</h3>
            <p className="nc-p">The planet that carries the most weight in your chart — through aspects, angularity, and rulership — often describes you better than your Sun sign does. A Pisces Sun with a heavily angular, heavily aspected Saturn does not behave like a Pisces. They behave like someone who has been carrying something since childhood. If Saturn is that placement in your chart, its inner-critic dimension has its own page: <Link href="/why-am-i-so-hard-on-myself">why am I so hard on myself?</Link></p>
          </div>

          {/* Glossary */}
          <div className="nc-block">
            <h2 className="nc-h2">Natal chart <em>glossary</em></h2>
            <ul className="nc-list">
              <li><strong>Ascendant / Rising</strong> — the sign on the eastern horizon at birth. Sets the 1st house.</li>
              <li><strong>Midheaven / MC</strong> — the highest point of the chart. Career and public identity.</li>
              <li><strong>IC</strong> — opposite the Midheaven. Home and private life.</li>
              <li><strong>Descendant</strong> — opposite the Ascendant. Partnership.</li>
              <li><strong>Cusp</strong> — the dividing line between two houses or signs.</li>
              <li><strong>Retrograde</strong> — a planet appearing to move backwards from Earth. In a natal chart it turns the planet&apos;s energy inward.</li>
              <li><strong>Domicile</strong> — a planet in the sign it rules (Mars in Aries). Strongest expression.</li>
              <li><strong>Detriment</strong> — a planet opposite the sign it rules. Working against its nature.</li>
              <li><strong>Exaltation</strong> — a sign where a planet functions especially well (Sun in Aries).</li>
              <li><strong>Fall</strong> — opposite exaltation. Uncomfortable expression.</li>
              <li><strong>Ephemeris</strong> — the astronomical table of planetary positions every chart is calculated from.</li>
              <li><strong>Orb</strong> — the allowed deviation from an exact aspect.</li>
              <li><strong>Stellium</strong> — three or more planets in one sign or house.</li>
              <li><strong>Transit</strong> — a current planetary position moving over your natal chart.</li>
              <li><strong>Progression</strong> — a symbolic technique advancing the chart forward in time.</li>
              <li><strong>Tropical zodiac</strong> — the reference frame used in Western astrology, anchored to the seasons (0° Aries = the spring equinox). This is what BluntChart uses.</li>
            </ul>
          </div>

          {/* Accuracy */}
          <div className="nc-block">
            <h2 className="nc-h2">Are <em>natal charts accurate?</em></h2>
            <div className="nc-tldr">
              <span className="nc-tldr-l">Short answer</span>
              <p className="nc-tldr-t">Split the question. The astronomy is exact and independently verifiable. The interpretation is a framework, not a measurement — anyone claiming otherwise is overselling. What a natal chart reliably provides is a specific, structured vocabulary for personality, motivation and pattern.</p>
            </div>
            <p className="nc-p"><strong style={{ color:"#e8e4f0" }}>The astronomy is exact.</strong> BluntChart computes planetary positions from a high-precision ephemeris, accurate to arc-seconds, matching professional tools including the Swiss Ephemeris. Where charts differ between sites, it is almost always one of three things: a different house system, a different zodiac (tropical vs sidereal), or an incorrect time zone applied to your birth time.</p>
            <p className="nc-p"><strong style={{ color:"#e8e4f0" }}>The interpretation is a framework.</strong> There is no accepted physical mechanism by which planetary positions influence personality, and controlled studies have not demonstrated predictive validity. Anyone claiming otherwise is overselling.</p>
            <p className="nc-p">What a natal chart reliably provides is a detailed, specific, structured vocabulary for describing personality, motivation and pattern — and a framework specific enough that a good reading can say something you didn&apos;t want to hear. That&apos;s a genuinely useful thing, and it&apos;s a very different claim from &ldquo;the planets made you this way.&rdquo; We&apos;d rather say that clearly than dress it up.</p>
          </div>

          {/* Where to go from here */}
          <div className="nc-block">
            <h2 className="nc-h2">Where to go <em>from here</em></h2>
            <p className="nc-p">Your natal chart is the raw data. These are the individual pieces, if you want to take them one at a time:</p>
            <ul className="nc-list">
              <li><Link href="/free-birth-chart"><strong>Free birth chart calculator</strong></Link> — full wheel, all planets, houses and aspects.</li>
              <li><Link href="/big-three-calculator"><strong>Big Three calculator</strong></Link> — Sun, Moon and Rising in one go, if you want the fast version.</li>
              <li><Link href="/moon-sign-calculator"><strong>Moon sign calculator</strong></Link> — your emotional baseline.</li>
              <li><Link href="/rising-sign-calculator"><strong>Rising sign calculator</strong></Link> — your Ascendant and chart ruler.</li>
              <li><Link href="/zodiac-signs"><strong>The 12 zodiac signs</strong></Link> — traits, dates, elements and rulers for every sign.</li>
            </ul>
            <p className="nc-p">And if you&apos;d rather not learn to read it yourself — <Link href="/#try-it">a full reading translates the whole chart into plain language →</Link></p>
          </div>

        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding:"80px 0" }}>
        <div className="nc-c">
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><span style={{ width:22, height:1, background:"#F0B84A" }}/><span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"#F0B84A" }}>What people say about their readings</span></div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:12 }}>
            &ldquo;It said things I hadn&apos;t <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>told anyone.&rdquo;</em>
          </h2>
          <p style={{ fontSize:15, color:"var(--dim)", maxWidth:440, lineHeight:1.72, marginBottom:36 }}>Real responses from beta readers who got their natal chart interpreted by BluntChart.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
            {REVIEWS.map((r,i) => (
              <div key={i} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:14, padding:24, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-12, right:18, fontFamily:"var(--font-display)", fontSize:"5rem", color:"rgba(107,47,212,0.1)", lineHeight:1, pointerEvents:"none" }}>&ldquo;</div>
                <div style={{ display:"flex", gap:2, marginBottom:12 }}>{Array.from({length:5}).map((_,j) => <span key={j} style={{ color:"#F0B84A", fontSize:13 }}>★</span>)}</div>
                <p style={{ fontSize:14, color:"var(--white)", lineHeight:1.68, marginBottom:18, fontStyle:"italic" }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#6b2fd4,#d4537e)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontSize:14, fontWeight:700, color:"#fff" }}>{r.init}</div>
                  <div><div style={{ fontSize:13, fontWeight:600, color:"var(--dim)" }}>{r.name}</div><div style={{ fontSize:11, color:"rgba(232,228,240,0.3)" }}>{r.meta}</div></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:32 }}>
            <Link href="/#try-it" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"14px 30px", background:"linear-gradient(135deg,#6b2fd4,#d4537e)", color:"#fff", fontWeight:700, fontSize:14, letterSpacing:"0.04em", textTransform:"uppercase" as const, textDecoration:"none", borderRadius:10 }}>Get My Full Reading — $15 ✨</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding:"80px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}>
        <div className="nc-c" style={{ maxWidth:900 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><span style={{ width:22, height:1, background:"#F0B84A" }}/><span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"#F0B84A" }}>Common questions</span></div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:32 }}>Natal chart <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>FAQ</em></h2>
          {FAQS.map((f,i) => (
            <details key={i} style={{ borderBottom:"0.5px solid rgba(255,255,255,0.08)" }}>
              <summary style={{ padding:"20px 0", fontSize:15, fontWeight:600, color:"#e8e4f0", cursor:"pointer", listStyle:"none", display:"flex", alignItems:"center", justifyContent:"space-between" }}>{f.q}<span style={{ color:"var(--purple)", fontSize:18, fontWeight:700, flexShrink:0, marginLeft:16 }}>+</span></summary>
              <p style={{ fontSize:14, color:"rgba(232,228,240,0.6)", lineHeight:1.78, paddingBottom:20, paddingRight:40 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ padding:"64px 0" }}>
        <div className="nc-c" style={{ textAlign:"center" }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:800, marginBottom:14 }}>
            Your natal chart is the map.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>BluntChart reads it out loud.</em>
          </h2>
          <p style={{ fontSize:14, color:"var(--dim)", maxWidth:460, margin:"0 auto 24px", lineHeight:1.72 }}>10 brutally honest insights from your exact placements. ~1,500 words. No sugarcoating.</p>
          <Link href="/#try-it" className="nc-cta" style={{ maxWidth:360 }}>Get My Full Reading · $15 ✦</Link>
        </div>
      </section>
</>
  );
}