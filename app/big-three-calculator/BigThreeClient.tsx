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

/* ── Sign one-liners (blunt voice) ── */
const SIGN_BLURBS: Record<string, { sun: string; moon: string; rising: string }> = {
  Aries: { sun: "Your identity runs on confidence and urgency. You lead before you're asked.", moon: "You process emotions by doing something about them — immediately, impulsively, loudly.", rising: "People see boldness first. You walk in and take up space without trying." },
  Taurus: { sun: "Your identity is built on stability. You know what you want and you don't apologize for it.", moon: "You need comfort, routine, and physical security to feel safe. Change terrifies you more than you admit.", rising: "People see calm confidence. You seem grounded, dependable, and impossible to rush." },
  Gemini: { sun: "Your identity lives in your mind. You're always thinking, always connecting, always one conversation away from a new obsession.", moon: "You process feelings by talking about them — or by not talking about them and overthinking instead.", rising: "People see someone quick, witty, and hard to pin down. You seem younger than you are." },
  Cancer: { sun: "Your identity is tied to who you take care of. You feel things before you understand them.", moon: "You need emotional safety more than anything. When you feel secure, you're the warmest person alive.", rising: "People feel drawn to you emotionally. They tell you things they don't tell anyone else." },
  Leo: { sun: "Your identity needs to be seen. Not for ego — for existence. If no one notices, did it even happen?", moon: "You need admiration and appreciation to feel loved. Silence from the people you care about is devastating.", rising: "People see warmth and presence. You light up a room whether you mean to or not." },
  Virgo: { sun: "Your identity is built on being useful and precise. You notice what everyone else misses.", moon: "You process emotions by analyzing them. Feelings are problems to be solved — which is itself the problem.", rising: "People see someone composed and intelligent. They assume you have it together, even when you don't." },
  Libra: { sun: "Your identity exists in relation to others. You define yourself through partnerships and connections.", moon: "You need harmony to feel safe. Conflict makes you physically uncomfortable — so you avoid it until you can't.", rising: "People see charm and grace. You make everyone feel included, even when you're falling apart inside." },
  Scorpio: { sun: "Your identity runs on intensity. You don't do anything halfway — especially the things that hurt.", moon: "You feel everything at maximum volume but show almost nothing. Trust is earned in inches.", rising: "People sense intensity before you speak. You seem powerful, private, and slightly dangerous." },
  Sagittarius: { sun: "Your identity needs freedom and meaning. You'd rather be wrong and honest than safe and quiet.", moon: "You process emotions by escaping them — travel, philosophy, humor, anything but sitting still with the feeling.", rising: "People see energy and bluntness. You seem like you have somewhere better to be." },
  Capricorn: { sun: "Your identity is built on achievement. You measure yourself by what you've done, not who you are.", moon: "You suppress emotions until they become physical symptoms. Vulnerability feels like weakness to you.", rising: "People see authority and composure. They respect you before they like you." },
  Aquarius: { sun: "Your identity is built on being different. Not for attention — because you genuinely see things other people don't.", moon: "You intellectualize feelings to avoid actually feeling them. Detachment is your defense mechanism.", rising: "People see someone friendly but unreachable. You seem present and absent at the same time." },
  Pisces: { sun: "Your identity is fluid. You absorb everything around you and sometimes lose where you end and others begin.", moon: "You feel everything — yours, theirs, the room's. Boundaries are a concept you understand but can't enforce.", rising: "People sense something gentle and otherworldly about you. You seem like you're partly somewhere else." },
};

/* ── Reviews ── */
const REVIEWS = [
  { text: "I've used Co-Star, The Pattern, Sanctuary... none said anything I didn't already know. This one said things I hadn't told anyone. It was uncomfortable. I loved it.", name: "Michelle R.", meta: "Scorpio Sun · Cancer Moon · Leo Rising", init: "M" },
  { text: "I was ready to roll my eyes. Three paragraphs in I had to put my phone down. It just... described me. Not my sign. Me.", name: "Rachel T.", meta: "Virgo Rising · Libra Sun · Aries Moon", init: "R" },
  { text: "Way more accurate than Co-Star ever was. And it didn't sugarcoat the parts I wasn't ready to hear.", name: "Sophie K.", meta: "Aries Sun · Pisces Moon · Gemini Rising", init: "S" },
  { text: "I felt attacked. In a good way. My therapist has been saying the same thing for six months. My chart said it better in one paragraph.", name: "Dani L.", meta: "Capricorn Sun · Gemini Moon · Scorpio Rising", init: "D" },
  { text: "Finally astrology that doesn't sound like it was written for everyone and no one at the same time.", name: "Zara O.", meta: "Leo Sun · Scorpio Rising · Aquarius Moon", init: "Z" },
  { text: "Twelve dollars. I spent two hours talking about it with my best friend. That's insane value.", name: "Chloe M.", meta: "Sagittarius Sun · Aquarius Moon · Taurus Rising", init: "C" },
];

/* ── Comparison ── */
const COMPARISON = [
  { feature: "Based on exact birth time & place", us: true, them: "Sun sign only" },
  { feature: "Explains what your Big Three actually mean for YOU", us: true, them: false },
  { feature: "High-precision ephemeris (Astronomy Engine)", us: true, them: "Approximate" },
  { feature: "Brutally honest, specific insights", us: true, them: false },
  { feature: "Full natal chart wheel included", us: true, them: false },
  { feature: "No account or subscription required", us: true, them: "Account required" },
  { feature: "Shareable identity card", us: true, them: false },
  { feature: "~1,500 words specific to your chart", us: true, them: "Generic paragraphs" },
];

/* ── FAQ ── */
const FAQS = [
  { q: "What are the Big Three in astrology?", a: "The Big Three refers to your Sun sign, Moon sign, and Rising sign — the three most important placements in your birth chart. Your Sun is your core identity (who you are). Your Moon is your emotional nature (how you feel). Your Rising is your outward personality (how the world sees you). Together, they create a far more accurate and personal picture than your Sun sign alone." },
  { q: "How do I find my Big Three?", a: "You need your birth date, your exact birth time (check your birth certificate), and your birth city. Enter these into the calculator above. Your Sun sign is determined by your birth date. Your Moon sign requires date and time. Your Rising sign requires exact time and location — it changes every 2 hours." },
  { q: "Why do I relate more to my Rising sign than my Sun sign?", a: "This is extremely common. Your Rising sign governs your day-to-day social behavior — how you interact with strangers, react in new situations, and present yourself. Since most of your daily life engages Rising sign energy, it often feels more 'you' than your Sun sign, which represents your deeper core that only emerges with people you trust." },
  { q: "Can I find my Big Three without my birth time?", a: "Partially. Your Sun sign only requires your birth date. Your Moon sign is usually accurate with just the date (though it changes signs every 2.5 days, so births near a sign change need the time). Your Rising sign absolutely requires your exact birth time — it changes signs every ~2 hours." },
  { q: "What if my Sun, Moon, and Rising are all the same sign?", a: "This is called a 'stellium' in that sign and it's quite rare. It means that sign's energy dominates your personality intensely — you are very much that sign, inside and out. There's less internal conflict between different energies, but also less range. You are who you are, unapologetically." },
  { q: "How is this different from reading my daily horoscope?", a: "A daily horoscope is based only on your Sun sign — one of 12 options, shared with ~600 million people. Your Big Three narrows that to thousands of unique combinations. A full BluntChart reading goes even further, analyzing Venus, Mars, Saturn, houses, and aspects to create insights specific to you alone." },
  { q: "What does each Big Three placement control?", a: "Sun = your ego, life purpose, conscious identity, and how you express your core self. Moon = your emotions, instincts, comfort needs, childhood patterns, and what you need to feel safe. Rising = your social mask, first impressions, physical appearance, and how you navigate the external world." },
];

export default function BigThreeClient() {
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
    useState(() => {
      const fn = () => setScrolled(window.scrollY > 40);
      window.addEventListener("scroll", fn, { passive: true });
    });
  }

  const handleCalculate = async () => {
    if (!email.trim() || !dob || !btime || !city.trim()) {
      setErr("Please fill in your email, date of birth, birth time, and city."); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setErr("Please enter a valid email address."); return;
    }
    setErr(""); setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    try {
      let geo: { lat: number; lng: number; timezone: string } | null = null;
      if (cityGeo) {
        geo = { lat: cityGeo.lat, lng: cityGeo.lng, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "" };
      } else { geo = await geocodeBirthPlace(city.trim()); }
      if (!geo) throw new Error("Could not locate your city. Try adding country.");

      const birth: BirthData = { name: fname.trim() || "You", date: dob, time: btime, lat: geo.lat, lng: geo.lng, timezone: geo.timezone, placeName: city.trim() };
      const chartData = calculateChart(birth);
      setChart(chartData);
      try { await fetch("/api/save-pending", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ name: fname.trim() || "Big Three User", email: normalizedEmail, dob, birth_time: btime, city: city.trim(), birth_lat: geo.lat, birth_lng: geo.lng, timezone: geo.timezone, source: "big-three-calculator" }) }); } catch {}
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 200);
    } catch (e) { setErr(e instanceof Error ? e.message : "Something went wrong."); }
    finally { setLoading(false); }
  };

  const sunSign = chart?.planets?.find(p => p.name === "Sun")?.sign ?? null;
  const sunDeg = chart?.planets?.find(p => p.name === "Sun")?.degree ?? 0;
  const moonSign = chart?.planets?.find(p => p.name === "Moon")?.sign ?? null;
  const moonDeg = chart?.planets?.find(p => p.name === "Moon")?.degree ?? 0;
  const risingSign = chart?.ascendant?.sign ?? null;
  const risingDeg = chart?.ascendant?.degree ?? 0;
  const blurbs = sunSign && moonSign && risingSign ? { sun: SIGN_BLURBS[sunSign]?.sun, moon: SIGN_BLURBS[moonSign]?.moon, rising: SIGN_BLURBS[risingSign]?.rising } : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--font-display:'Playfair Display',Georgia,serif;--font-body:'DM Sans',system-ui,sans-serif;--bg:#09090f;--card:#12121e;--border:rgba(255,255,255,0.08);--white:#e8e4f0;--dim:rgba(232,228,240,0.55);--gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);--purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5}
        html{scroll-behavior:smooth}body{background:var(--bg);color:var(--white);font-family:var(--font-body);-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .b3-c{max-width:1100px;margin:0 auto;padding:0 24px}
        .b3-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;transition:all .3s}
        .b3-nav.on{background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
        .b3-logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:10px}
        .b3-logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .b3-inp{width:100%;background:rgba(255,255,255,0.04);border:0.5px solid rgba(255,255,255,0.1);border-radius:10px;padding:13px 14px;font-size:14px;color:#e8e4f0;font-family:inherit;outline:none}
        .b3-inp:focus{border-color:rgba(107,47,212,0.5)}
        .b3-lbl{display:block;font-size:11px;font-weight:600;color:#6b6585;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:6px}
        .b3-btn{width:100%;background:linear-gradient(135deg,#6b2fd4,#d4537e);color:#fff;border:none;border-radius:12px;padding:16px 20px;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;transition:opacity .2s}
        .b3-btn:hover{opacity:.88}.b3-btn:disabled{opacity:.5;cursor:not-allowed}
        .b3-cta{display:block;width:100%;max-width:480px;margin:0 auto;background:linear-gradient(135deg,#f0b84a,#e8854a);color:#0d0800;border:none;border-radius:12px;padding:18px 24px;font-size:16px;font-weight:700;font-family:inherit;cursor:pointer;text-align:center;text-decoration:none;transition:opacity .2s,transform .15s}
        .b3-cta:hover{opacity:.88;transform:translateY(-1px)}
        @media(max-width:768px){.b3-nav-links{display:none!important}.b3-cards{grid-template-columns:1fr!important}.b3-cmp-head,.b3-cmp-row{grid-template-columns:1fr 90px 90px!important}.b3-revg{grid-template-columns:1fr!important}}
      `}</style>

      {/* NAV */}
      <nav className={`b3-nav${scrolled?" on":""}`}>
        <div className="b3-c" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Link href="/" className="b3-logo">
            <Image src="/mascot.png" alt="BluntChart" width={34} height={34} style={{ borderRadius:"50%" }}/>
            <span className="g">BluntChart</span>
          </Link>
          <div className="b3-nav-links" style={{ display:"flex", alignItems:"center", gap:24 }}>
            <Link href="/free-birth-chart" style={{ fontSize:13, color:"var(--dim)", textDecoration:"none" }}>Free Birth Chart</Link>
            <Link href="/rising-sign-calculator" style={{ fontSize:13, color:"var(--dim)", textDecoration:"none" }}>Rising Sign</Link>
            <Link href="/#try-it" style={{ fontSize:13, color:"#F0B84A", textDecoration:"none", fontWeight:600, border:"1px solid var(--gold-dim)", padding:"6px 15px", borderRadius:4 }}>Full Reading $15</Link>
          </div>
        </div>
      </nav>

      {/* HERO + FORM */}
      <section style={{ paddingTop:120, paddingBottom:64, position:"relative" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 50% -10%,rgba(107,47,212,.08) 0%,transparent 50%)", pointerEvents:"none" }}/>
        <div className="b3-c" style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:12, color:"rgba(232,228,240,0.3)", marginBottom:24 }}>
            <Link href="/" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>BluntChart</Link>
            <span style={{ margin:"0 8px" }}>/</span>
            <span style={{ color:"rgba(232,228,240,0.5)" }}>Big Three Calculator</span>
          </div>
          <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"#F0B84A", padding:"5px 14px", border:"1px solid var(--gold-dim)", borderRadius:100, background:"rgba(240,184,74,0.06)", marginBottom:24 }}>✦ Free tool · Sun · Moon · Rising</div>
            <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.2rem,5.5vw,3.6rem)", fontWeight:900, lineHeight:1.08, letterSpacing:"-0.02em", marginBottom:14 }}>
              What&apos;s Your<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Big Three?</em>
            </h1>
            <p style={{ fontSize:16, color:"var(--dim)", lineHeight:1.72, maxWidth:560, margin:"0 auto 12px" }}>
              Your Sun sign is who you are. Your Moon sign is how you feel. Your Rising sign is who people
              think you are. Find all three — plus what they actually mean for <em>you</em>, not just your sign.
            </p>
            <p style={{ fontSize:13, color:"rgba(232,228,240,0.3)", marginBottom:40 }}>Free, instant, no account needed. Birth time required for Rising sign.</p>
          </div>

          {/* FORM */}
          <div style={{ maxWidth:600, margin:"0 auto", background:"rgba(255,255,255,0.03)", border:"0.5px solid var(--border)", borderRadius:18, padding:32 }}>
            {err && <div style={{ background:"rgba(212,83,126,0.08)", border:"0.5px solid rgba(212,83,126,0.3)", borderRadius:10, padding:"11px 14px", fontSize:13, color:"#f0a0b8", marginBottom:14 }}>{err}</div>}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              <div><label className="b3-lbl">First name <span style={{ color:"#3a3858", fontWeight:400 }}>(optional)</span></label><input className="b3-inp" value={fname} onChange={e=>setFname(e.target.value)} placeholder="e.g. Sarah"/></div>
              <div><label className="b3-lbl">Email address *</label><input type="email" className="b3-inp" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com"/><small style={{ fontSize:11, color:"#3a3858", marginTop:4, display:"block" }}>We&apos;ll send your Big Three here too</small></div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              <div><label className="b3-lbl">Date of birth *</label><input type="date" className="b3-inp" value={dob} onChange={e=>setDob(e.target.value)}/></div>
              <div><label className="b3-lbl">Exact birth time *</label><input type="time" className="b3-inp" value={btime} onChange={e=>setBtime(e.target.value)}/><small style={{ fontSize:11, color:"#3a3858", marginTop:4, display:"block" }}>Required for Rising sign — check birth certificate</small></div>
            </div>
            <div style={{ marginBottom:24 }}><label className="b3-lbl">City &amp; country of birth *</label><LocationPicker value={city} onChange={(loc,raw) => { setCityGeo(loc); setCity(raw); }} placeholder="e.g. New York, USA or Mumbai, India"/></div>
            <button className="b3-btn" onClick={handleCalculate} disabled={loading}>{loading ? "Finding your Big Three…" : "Reveal My Big Three — Free ✨"}</button>
            <p style={{ fontSize:11, color:"#2e2c3e", textAlign:"center", marginTop:12 }}>Your data is used to calculate your chart. We may send your reading offer — no spam, ever.</p>
          </div>
        </div>
      </section>

      {/* RESULT */}
      {chart && sunSign && moonSign && risingSign && blurbs && (
        <section ref={resultRef} style={{ paddingBottom:80 }}>
          <div className="b3-c">
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:40 }}>
              <span style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.06)" }}/>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase" as const, color:"#3a3858" }}>{fname ? `${fname}'s` : "Your"} Big Three</span>
              <span style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.06)" }}/>
            </div>

            {/* Big Three headline */}
            <div style={{ textAlign:"center", marginBottom:12 }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"#F0B84A", marginBottom:16 }}>Sun · Moon · Rising</p>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.4rem,6vw,3.8rem)", fontWeight:900, lineHeight:1.05 }}>
                <span style={{ color:"#f5ead0" }}>{sunSign}</span>
                <span style={{ color:"rgba(232,228,240,0.2)", margin:"0 12px", fontSize:"0.5em" }}>·</span>
                <span style={{ color:"#c4a8ff" }}>{moonSign}</span>
                <span style={{ color:"rgba(232,228,240,0.2)", margin:"0 12px", fontSize:"0.5em" }}>·</span>
                <span style={{ background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{risingSign}</span>
              </h2>
            </div>

            {/* Three detail cards */}
            <div className="b3-cards" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:16, maxWidth:900, margin:"32px auto 48px" }}>
              {[
                { label:"Sun Sign", sign:sunSign, deg:sunDeg, icon:"☉", blurb:blurbs.sun, color:"#f5ead0", tagline:"Who you are" },
                { label:"Moon Sign", sign:moonSign, deg:moonDeg, icon:"☽", blurb:blurbs.moon, color:"#c4a8ff", tagline:"How you feel" },
                { label:"Rising Sign", sign:risingSign, deg:risingDeg, icon:"↑", blurb:blurbs.rising, color:"#F0B84A", tagline:"How the world sees you" },
              ].map((item,i) => (
                <div key={i} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:16, padding:"24px 22px", borderTop:`2px solid ${item.color}` }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                    <span style={{ fontSize:22, color:item.color, fontFamily:"serif" }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"rgba(232,228,240,0.4)" }}>{item.label}</div>
                      <div style={{ fontSize:11, color:"rgba(232,228,240,0.25)" }}>{item.tagline}</div>
                    </div>
                  </div>
                  <div style={{ fontFamily:"var(--font-display)", fontSize:26, fontWeight:800, color:item.color, marginBottom:4 }}>{item.sign}</div>
                  <div style={{ fontSize:12, color:"rgba(232,228,240,0.3)", marginBottom:14 }}>{item.deg.toFixed(1)}° {item.sign}</div>
                  <p style={{ fontSize:13, color:"rgba(232,228,240,0.6)", lineHeight:1.65 }}>{item.blurb}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ background:"rgba(107,47,212,0.04)", border:"0.5px solid rgba(107,47,212,0.2)", borderRadius:20, padding:"40px 32px", textAlign:"center", marginBottom:48 }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"#F0B84A", marginBottom:12 }}>Your Big Three is just the trailer</p>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.4rem,3.5vw,2rem)", fontWeight:800, lineHeight:1.1, marginBottom:14 }}>
                The full movie is <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>10 insights deep.</em>
              </h2>
              <p style={{ fontSize:14, color:"var(--dim)", lineHeight:1.72, maxWidth:480, margin:"0 auto 24px" }}>
                Venus. Mars. Saturn. Houses. Aspects. A BluntChart reading doesn&apos;t stop at the Big Three — it tells
                you what every major placement actually means for YOUR life, in plain language, no sugarcoating.
              </p>
              <Link href="/#try-it" className="b3-cta">Get My Full Reading · $15 ✦</Link>
              <p style={{ fontSize:12, color:"#3a3858", marginTop:12 }}>One-time · No subscription · Emailed instantly · ~1,500 words</p>
            </div>

            {/* Chart wheel */}
            <div style={{ marginBottom:48 }}>
              <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, marginBottom:16, textAlign:"center" }}>
                {fname ? `${fname}'s` : "Your"} full natal chart
              </h3>
              <ChartWheel chart={chart}/>
            </div>
          </div>
        </section>
      )}


      {/* SEO CONTENT */}
      <section style={{ padding:"80px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}>
        <div className="b3-c" style={{ maxWidth:900 }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:24 }}>
            Understanding your <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Big Three</em>
          </h2>
          <div style={{ fontSize:15, color:"rgba(232,228,240,0.6)", lineHeight:1.78 }}>
            <p style={{ marginBottom:20 }}>In astrology, the Big Three — your Sun sign, Moon sign, and Rising sign — are the three most important placements in your birth chart. While there are ten planets, twelve houses, and dozens of aspects that create the full picture, the Big Three captures the essence of who you are in three distinct dimensions: identity, emotion, and presentation.</p>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"#e8e4f0", marginBottom:12 }}>Sun sign: your core identity</h3>
            <p style={{ marginBottom:20 }}>Your Sun sign is determined by your birth date and represents your conscious self — your ego, your life purpose, and the energy you're growing into throughout your life. It's the sign most people know because it only requires a birth date. When someone says "I'm a Leo" or "I'm a Capricorn," they're referring to their Sun sign. But the Sun sign is just one piece of a much larger puzzle.</p>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"#e8e4f0", marginBottom:12 }}>Moon sign: your emotional blueprint</h3>
            <p style={{ marginBottom:20 }}>Your Moon sign reveals how you process emotions, what you need to feel safe, and the patterns that run beneath the surface of your personality. The Moon changes zodiac signs every 2.5 days, which is why it requires your birth date and approximate time. Your Moon sign often explains the parts of yourself that surprise you — the emotional reactions that don't match your Sun sign, the needs you can't articulate, the triggers that seem disproportionate.</p>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"#e8e4f0", marginBottom:12 }}>Rising sign: your social self</h3>
            <p style={{ marginBottom:20 }}>Your Rising sign (Ascendant) is the zodiac sign that was on the eastern horizon at your exact moment and location of birth. It changes signs every two hours, making it the most time-sensitive of the Big Three. Your Rising sign shapes your outward personality, your physical appearance, your social behavior, and the first impression you make. Many people identify more with their Rising sign than their Sun sign because it governs day-to-day interactions.</p>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"#e8e4f0", marginBottom:12 }}>Why the Big Three matters more than your Sun sign</h3>
            <p style={{ marginBottom:20 }}>Reading only your Sun sign horoscope is like describing a painting by its frame. The Big Three gives you the full canvas. It explains why two people with the same Sun sign can be completely different — a Scorpio Sun with a Pisces Moon and Cancer Rising will navigate the world entirely differently than a Scorpio Sun with an Aries Moon and Capricorn Rising. The combinations are what make you unique.</p>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"#e8e4f0", marginBottom:12 }}>Beyond the Big Three</h3>
            <p>Your Big Three is the foundation, but your full birth chart contains far more. Venus reveals how you love. Mars shows how you fight and what drives you. Saturn points to your deepest challenges. The houses show which areas of life are most emphasized. A full BluntChart reading analyzes all of these placements and tells you what they mean — in plain language, no vague horoscope speak. If your Big Three is the headline, the full reading is the article.</p>
          </div>
        </div>
      </section>


      {/* COMPARISON */}
      <section style={{ padding:"80px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}>
        <div className="b3-c">
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <span style={{ width:22, height:1, background:"#F0B84A" }}/>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"#F0B84A" }}>Why BluntChart</span>
          </div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:12 }}>
            BluntChart vs <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>generic horoscope apps</em>
          </h2>
          <p style={{ fontSize:15, color:"var(--dim)", maxWidth:500, lineHeight:1.72, marginBottom:36 }}>Your Big Three is a starting point. Here&apos;s what happens when you actually read the chart.</p>

          <div style={{ border:"1px solid var(--border)", borderRadius:16, overflow:"hidden", maxWidth:720 }}>
            <div className="b3-cmp-head" style={{ display:"grid", gridTemplateColumns:"1fr 140px 140px", background:"#0d0d18", borderBottom:"1px solid var(--border)" }}>
              <div style={{ padding:"16px 20px", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"var(--dim)" }}>Feature</div>
              <div style={{ padding:"16px 20px", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"#F0B84A" }}>BluntChart</div>
              <div style={{ padding:"16px 20px", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"var(--dim)" }}>Others</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div key={i} className="b3-cmp-row" style={{ display:"grid", gridTemplateColumns:"1fr 140px 140px", borderBottom: i < COMPARISON.length-1 ? "0.5px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ padding:"15px 20px", fontSize:14, color:"var(--white)", fontWeight:500 }}>{row.feature}</div>
                <div style={{ padding:"15px 20px", fontSize:14, display:"flex", alignItems:"center" }}>
                  {row.us === true ? <span style={{ color:"var(--teal)", fontWeight:700 }}>✓</span> : <span style={{ color:"var(--rose)" }}>✗</span>}
                </div>
                <div style={{ padding:"15px 20px", fontSize:13, display:"flex", alignItems:"center" }}>
                  {row.them === true ? <span style={{ color:"var(--teal)" }}>✓</span>
                   : row.them === false ? <span style={{ color:"rgba(212,83,126,0.6)" }}>✗</span>
                   : <span style={{ color:"#6b6585", fontStyle:"italic" }}>{row.them}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding:"80px 0" }}>
        <div className="b3-c">
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <span style={{ width:22, height:1, background:"#F0B84A" }}/>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"#F0B84A" }}>What people say</span>
          </div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:12 }}>
            People keep sending it<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>to their friends.</em>
          </h2>
          <p style={{ fontSize:15, color:"var(--dim)", maxWidth:440, lineHeight:1.72, marginBottom:36 }}>Real responses from our beta. Unfiltered, because that&apos;s the whole point.</p>
          <div className="b3-revg" style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
            {REVIEWS.map((r,i) => (
              <div key={i} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:14, padding:24, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-12, right:18, fontFamily:"var(--font-display)", fontSize:"5rem", color:"rgba(107,47,212,0.1)", lineHeight:1, pointerEvents:"none" }}>&ldquo;</div>
                <div style={{ display:"flex", gap:2, marginBottom:12 }}>{Array.from({length:5}).map((_,j) => <span key={j} style={{ color:"#F0B84A", fontSize:13 }}>★</span>)}</div>
                <p style={{ fontSize:14, color:"var(--white)", lineHeight:1.68, marginBottom:18, fontStyle:"italic" }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#6b2fd4,#d4537e)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontSize:14, fontWeight:700, color:"#fff" }}>{r.init}</div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:"var(--dim)" }}>{r.name}</div>
                    <div style={{ fontSize:11, color:"rgba(232,228,240,0.3)" }}>{r.meta}</div>
                  </div>
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
      <section style={{ padding:"80px 0" }}>
        <div className="b3-c" style={{ maxWidth:900 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><span style={{ width:22, height:1, background:"#F0B84A" }}/><span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"#F0B84A" }}>Common questions</span></div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:32 }}>Big Three <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>FAQ</em></h2>
          {FAQS.map((f,i) => (
            <details key={i} style={{ borderBottom:"0.5px solid rgba(255,255,255,0.08)" }}>
              <summary style={{ padding:"20px 0", fontSize:15, fontWeight:600, color:"#e8e4f0", cursor:"pointer", listStyle:"none", display:"flex", alignItems:"center", justifyContent:"space-between" }}>{f.q}<span style={{ color:"#6b2fd4", fontSize:18, fontWeight:700, flexShrink:0, marginLeft:16 }}>+</span></summary>
              <p style={{ fontSize:14, color:"rgba(232,228,240,0.6)", lineHeight:1.78, paddingBottom:20, paddingRight:40 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ padding:"64px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}>
        <div className="b3-c" style={{ textAlign:"center" }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:800, marginBottom:14 }}>
            Your Big Three is the headline.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>The full reading is the article.</em>
          </h2>
          <p style={{ fontSize:14, color:"var(--dim)", maxWidth:460, margin:"0 auto 24px", lineHeight:1.72 }}>10 brutally honest insights. Venus, Mars, Saturn, houses, aspects — everything, in plain language.</p>
          <Link href="/#try-it" className="b3-cta" style={{ maxWidth:360 }}>Get My Full Reading · $15 ✦</Link>
        </div>
      </section>
</>
  );
}