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
        .nc-c{max-width:1100px;margin:0 auto;padding:0 24px}
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

      {/* SEO CONTENT */}
      <section style={{ padding:"80px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}>
        <div className="nc-c" style={{ maxWidth:760 }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:24 }}>
            How to interpret your <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>natal chart</em>
          </h2>
          <div style={{ fontSize:15, color:"rgba(232,228,240,0.6)", lineHeight:1.78 }}>
            <p style={{ marginBottom:20 }}>A natal chart is more than a list of zodiac signs. It&apos;s a complex, interconnected system where every placement influences every other. Reading one requires understanding three layers: planets (what energy), signs (how it expresses), and houses (where it plays out). Together, these three dimensions create the full picture of your astrological profile.</p>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"#e8e4f0", marginBottom:12 }}>Planets: the characters in your story</h3>
            <p style={{ marginBottom:20 }}>Each planet in your natal chart represents a fundamental drive. The Sun is your conscious identity — the self you project and the person you&apos;re becoming. The Moon is your emotional core — the private self that surfaces in intimacy and under stress. Mercury governs your mind and communication style. Venus reveals your approach to love, beauty, and values. Mars drives your ambition, desire, and conflict style. Jupiter expands whatever it touches, bringing growth and opportunity. Saturn contracts and tests, revealing your deepest challenges and the discipline required to overcome them.</p>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"#e8e4f0", marginBottom:12 }}>Signs: the style of expression</h3>
            <p style={{ marginBottom:20 }}>When a planet falls in a zodiac sign, the sign colors how that planet&apos;s energy manifests. Venus in Aries loves passionately and impulsively. Venus in Capricorn loves cautiously and practically. Same planet, same fundamental drive — but the expression is completely different. This is why two people with Venus in the same house but different signs will approach relationships in radically different ways.</p>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"#e8e4f0", marginBottom:12 }}>Houses: the stage of life</h3>
            <p style={{ marginBottom:20 }}>The twelve houses of your natal chart represent twelve domains of life. A planet in the 7th house (partnerships) plays out differently than the same planet in the 10th house (career). The houses are determined by your exact birth time and location — they rotate based on the Earth&apos;s position relative to the zodiac. This is why birth time matters so much: it sets the entire stage on which your planetary drama unfolds.</p>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"#e8e4f0", marginBottom:12 }}>Aspects: the conversations between planets</h3>
            <p style={{ marginBottom:20 }}>Aspects are the angular relationships between planets. A conjunction (0°) merges two energies into one. A trine (120°) creates ease and natural flow. A square (90°) creates tension and challenge. An opposition (180°) creates a push-pull dynamic. Your aspect pattern reveals the internal conversations happening in your psyche — where you feel internal harmony and where you experience friction, indecision, or compulsion.</p>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"#e8e4f0", marginBottom:12 }}>Beyond the natal chart: getting a reading</h3>
            <p>Your natal chart is the raw data. An interpretation is where the meaning lives. While the chart above shows you exactly where every planet sits, understanding what those placements mean for your specific life — your relationships, your blind spots, your strengths — requires deeper analysis. A BluntChart reading takes your exact natal chart and translates it into plain language, covering ten key areas of your personality and life patterns. No vague horoscope language. No sugarcoating. Just what your chart actually says about who you are.</p>
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
        <div className="nc-c" style={{ maxWidth:760 }}>
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