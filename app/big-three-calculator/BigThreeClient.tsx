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
  { q: "What are the Big Three in astrology?", a: "The Big Three refers to your Sun sign, Moon sign, and Rising sign — the three most important placements in your birth chart. Sun is core identity, Moon is emotional nature, Rising is social interface. Together they give a far more accurate picture than your Sun sign alone. Your Sun is the film, your Moon is the audience reaction, your Rising is the poster." },
  { q: "Which of the Big Three is most important?", a: "There isn't a single answer — anyone who gives one is picking a tradition without telling you. Modern Western astrology treats the Sun as primary. Traditional astrology treats the Ascendant as primary. Psychological astrology tends to weight the Moon most heavily. The practical answer: read the Rising for first impressions, the Moon for intimacy, the Sun for long-term direction." },
  { q: "Can I find my Big Three without my birth time?", a: "Partially. Your Sun sign is always available from your birth date. Your Moon sign is usually available, though roughly one birthday in three falls near an ingress and needs a time. Your Rising sign is genuinely not available — the Ascendant moves through all twelve signs in 24 hours. Anyone offering a 'Rising sign without birth time' calculator is guessing." },
  { q: "Why don't I relate to my Sun sign?", a: "Usually because your Rising and Moon are doing more visible work. The Rising governs day-to-day social behaviour and often feels more 'you' than the Sun. If you have a stellium in another sign, that sign dominates — a Gemini Sun with four planets in Cancer is functionally a Cancer with a Gemini job title." },
  { q: "What if my Sun and Rising are the same sign?", a: "You were born near sunrise — the Sun was on the eastern horizon, so it was rising as you were. What you see is what you get: very little gap between internal identity and external presentation. The trade-off is a lack of range — you can't easily code-switch. If all three are the same sign, that's a stellium: enormous consistency and almost no built-in counterweight to that sign's shadow." },
  { q: "Which Big Three combinations are rarest?", a: "There are 1,728 possible combinations, and Rising sign distribution is very uneven — it depends on your latitude. In the northern hemisphere at mid-latitudes, Pisces and Aries Rising are genuinely uncommon, and Libra or Scorpio Rising are over-represented. The effect reverses in the southern hemisphere. Claims about a single 'rarest' combination without reference to latitude are meaningless." },
  { q: "Does Big Three compatibility predict relationships?", a: "Each placement predicts something different. Sun–Sun compatibility predicts whether you admire each other. Moon–Moon predicts whether you feel safe — the most predictive of the three for long-term relationships. Rising–Rising predicts initial attraction and says almost nothing about month six. For romantic compatibility specifically, Venus and Mars matter more than any of the Big Three." },
  { q: "What is the Big Six?", a: "The Big Six is your Big Three plus Mercury (how you think), Venus (what you love) and Mars (what drives you). It covers all five personal planets plus the Ascendant — the complete set of fast-moving, genuinely individual placements in a chart. Everything beyond it is increasingly shared with everyone born around the same time as you." },
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
        .b3-c{max-width:1280px;margin:0 auto;padding:0 40px}
        @media(max-width:768px){.b3-c{padding:0 20px}}
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
              Your Big 3 —<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>and what each one actually means.</em>
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


      {/* SEO LONG-FORM GUIDE */}
      <section style={{ padding:"80px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}>
        <div className="b3-c" style={{ maxWidth:1080 }}>

          <style>{`
            .b3-h2{font-family:var(--font-display);font-size:clamp(1.5rem,3.2vw,2rem);font-weight:800;line-height:1.15;letter-spacing:-0.01em;color:#e8e4f0;margin:0 0 14px}
            .b3-h2 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
            .b3-h3{font-family:var(--font-display);font-size:18px;font-weight:700;color:#e8e4f0;margin:24px 0 10px}
            .b3-p{font-size:15px;color:rgba(232,228,240,0.65);line-height:1.78;margin-bottom:16px}
            .b3-p a{color:#F0B84A;text-decoration:underline;text-decoration-color:rgba(240,184,74,0.35);text-underline-offset:3px}
            .b3-p a:hover{text-decoration-color:#F0B84A}
            .b3-tldr{background:rgba(240,184,74,0.06);border-left:3px solid #F0B84A;border-radius:0 10px 10px 0;padding:16px 20px;margin:0 0 24px}
            .b3-tldr-l{font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#F0B84A;margin-bottom:6px;display:block}
            .b3-tldr-t{font-size:15px;color:#e8e4f0;line-height:1.65}
            .b3-block{margin-bottom:56px}
            .b3-list{margin:0 0 16px 0;padding-left:22px}
            .b3-list li{font-size:15px;color:rgba(232,228,240,0.65);line-height:1.7;margin-bottom:8px}
            .b3-list li strong{color:#e8e4f0;font-weight:600}
            .b3-table-wrap{overflow-x:auto;margin:8px 0 24px;-webkit-overflow-scrolling:touch}
            .b3-table{width:100%;border-collapse:collapse;font-size:13.5px;min-width:520px}
            .b3-table th,.b3-table td{padding:10px 12px;text-align:left;border-bottom:0.5px solid rgba(255,255,255,0.06);color:rgba(232,228,240,0.7);line-height:1.5;vertical-align:top}
            .b3-table th{color:#F0B84A;font-weight:700;font-size:11px;letter-spacing:0.06em;text-transform:uppercase;background:rgba(255,255,255,0.02)}
            .b3-table td:first-child,.b3-table th:first-child{color:#e8e4f0;font-weight:600}
          `}</style>

          {/* Sun vs Moon vs Rising */}
          <div className="b3-block">
            <h2 className="b3-h2">Sun vs Moon vs Rising: <em>what&apos;s the difference?</em></h2>
            <div className="b3-tldr">
              <span className="b3-tldr-l">Short answer</span>
              <p className="b3-tldr-t">Your Sun is the film, your Moon is the audience reaction, your Rising is the poster. Sun = core identity, seen by people who know you well. Moon = emotional nature, seen by people who live with you. Rising = social interface, seen by everyone immediately.</p>
            </div>
            <div className="b3-table-wrap">
              <table className="b3-table">
                <thead><tr><th></th><th>Sun</th><th>Moon</th><th>Rising</th></tr></thead>
                <tbody>
                  <tr><td>What it is</td><td>Core identity</td><td>Emotional nature</td><td>Social interface</td></tr>
                  <tr><td>Determined by</td><td>Birth date</td><td>Date + time</td><td>Time + place</td></tr>
                  <tr><td>Changes every</td><td>~30 days</td><td>~2.5 days</td><td>~2 hours</td></tr>
                  <tr><td>Who sees it</td><td>People who know you well</td><td>People who live with you</td><td>Everyone, immediately</td></tr>
                  <tr><td>Shows up when</td><td>You&apos;re yourself on purpose</td><td>You&apos;re tired, stressed, in love</td><td>You walk into a room</td></tr>
                  <tr><td>The question it answers</td><td>What am I here to do?</td><td>What do I need to feel safe?</td><td>What do people meet first?</td></tr>
                </tbody>
              </table>
            </div>
            <p className="b3-p">The Big Three get explained badly more often than almost anything in astrology. The cleanest way to hold the difference: <strong style={{ color:"#e8e4f0" }}>your Sun is the film, your Moon is the audience reaction, your Rising is the poster.</strong></p>
          </div>

          {/* Which is most important */}
          <div className="b3-block">
            <h2 className="b3-h2">Which of the Big Three is <em>most important?</em></h2>
            <div className="b3-tldr">
              <span className="b3-tldr-l">Short answer</span>
              <p className="b3-tldr-t">There isn&apos;t one — anyone who gives a single answer is picking a tradition without telling you. Read the Rising for first impressions, the Moon for intimacy, the Sun for long-term direction. If your Sun sign has never felt like you, it&apos;s usually because your Rising and Moon are doing more visible work.</p>
            </div>
            <p className="b3-p"><strong style={{ color:"#e8e4f0" }}>Modern Western astrology</strong> treats the Sun as primary. It&apos;s the identity placement, the one horoscopes are written for, and the one that describes your conscious direction.</p>
            <p className="b3-p"><strong style={{ color:"#e8e4f0" }}>Traditional and Hellenistic astrology</strong> treats the Ascendant as primary. The Rising sign sets the entire house structure of the chart — change the Ascendant and every planet lands in a different house. In this framework the Sun is one planet among seven, and the Ascendant is the chart&apos;s foundation.</p>
            <p className="b3-p"><strong style={{ color:"#e8e4f0" }}>Psychological and evolutionary astrology</strong> — the strand most modern readings draw from — tends to weight the Moon most heavily, on the reasoning that emotional conditioning drives more behaviour than conscious identity does.</p>
            <p className="b3-p"><strong style={{ color:"#e8e4f0" }}>The practical answer:</strong> if you want to know how someone comes across, read the <Link href="/rising-sign-calculator">Rising</Link>. If you want to know what they need in a relationship, read the <Link href="/moon-sign-calculator">Moon</Link>. If you want to know what they&apos;re building toward, read the Sun.</p>
          </div>

          {/* Without birth time */}
          <div className="b3-block">
            <h2 className="b3-h2">Can you find your Big Three <em>without a birth time?</em></h2>
            <div className="b3-tldr">
              <span className="b3-tldr-l">Short answer</span>
              <p className="b3-tldr-t">Partially. Sun is always available from your date. Moon is usually available (but roughly one birthday in three falls near an ingress and needs a time). Rising is genuinely not available — the Ascendant moves through all twelve signs in 24 hours. Anyone offering a &ldquo;rising sign without birth time&rdquo; calculator is guessing or running a personality quiz.</p>
            </div>
            <p className="b3-p"><strong style={{ color:"#e8e4f0" }}>Sun sign — always available.</strong> Your birth date is enough. Only edge case: cusp dates (roughly the 19th–23rd of any month), when the Sun changes signs mid-day and you need a time to be certain.</p>
            <p className="b3-p"><strong style={{ color:"#e8e4f0" }}>Moon sign — usually available, sometimes not.</strong> The Moon spends about 2.5 days in a sign, so on most birthdays it was in one sign the entire day. Roughly one birthday in three falls near an ingress — then the birth time decides. Our calculator will tell you when your date lands near a boundary rather than silently guessing.</p>
            <p className="b3-p"><strong style={{ color:"#e8e4f0" }}>Rising sign — genuinely not available.</strong> The Ascendant moves through all twelve signs in 24 hours. Without a birth time you have twelve candidates and no way to narrow them astronomically. Anyone offering you a &ldquo;rising sign without birth time&rdquo; calculator is either guessing or asking you personality questions and reverse-engineering an answer, which is a personality quiz wearing astrology&apos;s clothes.</p>
            <p className="b3-p"><strong style={{ color:"#e8e4f0" }}>What you can actually do:</strong> get a rough window from someone who was there (&ldquo;morning&rdquo; cuts twelve options to about four); request the long-form birth certificate; contact the hospital records department; or if you&apos;re within a two-hour window, run the chart at both ends — if the Rising sign is the same at both, you have your answer regardless.</p>
          </div>

          {/* Sun and Rising same */}
          <div className="b3-block">
            <h2 className="b3-h2">What if my Sun and Rising are <em>the same sign?</em></h2>
            <div className="b3-tldr">
              <span className="b3-tldr-l">Short answer</span>
              <p className="b3-tldr-t">You were born near sunrise — the Sun was literally on the eastern horizon, so it was rising as you were. It&apos;s sometimes called a &ldquo;sunrise chart&rdquo; or a double placement. What you see is what you get: very little gap between internal identity and external presentation. The trade-off is a lack of range.</p>
            </div>
            <p className="b3-p">People describe you accurately on first meeting. You don&apos;t have a social mask that differs from your core, so you can&apos;t easily code-switch, and you can come across as intense or one-note in situations that call for adaptability.</p>
            <p className="b3-p">If all three are the same sign, that&apos;s rarer still and functions as a <strong style={{ color:"#e8e4f0" }}>stellium</strong>. That sign&apos;s energy runs everything: identity, emotion, and presentation all singing the same note. Enormous consistency, minimal internal contradiction, and almost no built-in counterweight to that sign&apos;s shadow. A triple Scorpio has no light setting.</p>
          </div>

          {/* Rare combinations */}
          <div className="b3-block">
            <h2 className="b3-h2">Which Big Three combinations are <em>the rarest?</em></h2>
            <div className="b3-tldr">
              <span className="b3-tldr-l">Short answer</span>
              <p className="b3-tldr-t">There are 12 × 12 × 12 = 1,728 possible combinations, and they aren&apos;t evenly distributed. Rising sign distribution is very uneven and depends on your latitude — Pisces and Aries Rising are genuinely uncommon in Europe or North America, and Libra/Scorpio Rising are over-represented. The effect reverses in the southern hemisphere.</p>
            </div>
            <p className="b3-p">The Sun spends unequal time in each sign — the Earth&apos;s orbit is elliptical, so the Sun moves faster through some signs. It spends about 30.5 days in Cancer and about 29.5 days in Capricorn. Small, but real.</p>
            <p className="b3-p">The <strong style={{ color:"#e8e4f0" }}>Rising sign distribution</strong> is much more uneven, and this is the part almost nobody explains. The rate at which signs rise depends on your latitude. In the northern hemisphere at mid-latitudes, signs from Cancer through Sagittarius rise slowly (they&apos;re &ldquo;long ascension&rdquo;) and Capricorn through Gemini rise quickly (&ldquo;short ascension&rdquo;). That means in Europe or North America, Pisces and Aries Rising are genuinely uncommon, and Libra or Scorpio Rising are over-represented. The effect reverses in the southern hemisphere.</p>
            <p className="b3-p">Add birth-rate seasonality — births are not evenly distributed across the year — and the distribution skews further. Claims that a specific combination is &ldquo;the rarest&rdquo; are usually made without reference to latitude or hemisphere, which makes them close to meaningless. Rarity also isn&apos;t a ranking — a rare combination isn&apos;t a better one.</p>
          </div>

          {/* Compatibility */}
          <div className="b3-block">
            <h2 className="b3-h2">Big Three compatibility: <em>what each placement predicts</em></h2>
            <div className="b3-tldr">
              <span className="b3-tldr-l">Short answer</span>
              <p className="b3-tldr-t">Sun–Sun compatibility predicts whether you admire each other. Moon–Moon predicts whether you feel safe — the most predictive for long-term relationships. Rising–Rising predicts initial attraction and says almost nothing about month six. For romantic compatibility specifically, Venus and Mars matter more than any of the Big Three.</p>
            </div>
            <p className="b3-p"><strong style={{ color:"#e8e4f0" }}>Sun–Sun compatibility</strong> predicts whether you <em>admire</em> each other. Same-element Suns tend to recognise each other&apos;s direction and priorities. This matters for long-term respect, and it&apos;s largely irrelevant to whether you&apos;ll actually get along day to day.</p>
            <p className="b3-p"><strong style={{ color:"#e8e4f0" }}>Moon–Moon compatibility</strong> predicts whether you feel <em>safe</em> with each other, and it&apos;s the most predictive of the three for long-term relationships. Compatible Moons mean your instinctive reactions to stress don&apos;t wound each other. Two people with clashing Suns and harmonious Moons usually last. The reverse usually doesn&apos;t.</p>
            <p className="b3-p"><strong style={{ color:"#e8e4f0" }}>Rising–Rising compatibility</strong> predicts <em>initial attraction</em>. It governs first impressions, physical presence, and whether there&apos;s chemistry in the first ten minutes. It says almost nothing about month six.</p>
            <p className="b3-p">The cross-aspects matter more than the like-for-like. Your Moon conjunct their Sun is one of the strongest indicators of a durable bond in synastry — one person&apos;s emotional needs align directly with the other&apos;s core identity. Your Rising conjunct their Descendant is the classic &ldquo;I felt like I&apos;d known them already&rdquo; signature.</p>
            <p className="b3-p">And none of this beats Venus and Mars for romantic compatibility specifically. Venus describes what you&apos;re drawn to; Mars describes how you pursue and how you fight. The Big Three tells you who two people are. Venus and Mars tell you what happens when they&apos;re alone together.</p>
          </div>

          {/* Big Three vs Big Six */}
          <div className="b3-block">
            <h2 className="b3-h2">Big Three vs Big Six: <em>what comes next?</em></h2>
            <div className="b3-tldr">
              <span className="b3-tldr-l">Short answer</span>
              <p className="b3-tldr-t">The Big Six is your Big Three plus Mercury (how you think), Venus (what you love) and Mars (what drives you). It covers all five personal planets plus the Ascendant — the complete set of fast-moving, genuinely individual placements in a chart. Everything beyond it is increasingly shared with everyone born around the same time as you.</p>
            </div>
            <ul className="b3-list">
              <li><strong>Mercury</strong> — how you think, process information and communicate. Explains why some people need to talk through a decision and others need silence to reach the same conclusion.</li>
              <li><strong>Venus</strong> — what you find beautiful, what you value, and how you love and want to be loved.</li>
              <li><strong>Mars</strong> — your drive, your anger, your sex drive, and your conflict style.</li>
            </ul>
            <p className="b3-p">If the Big Three is a headline, the Big Six is the article. Your <Link href="/free-birth-chart">full chart</Link> is the book.</p>
          </div>

          {/* Read others */}
          <div className="b3-block">
            <h2 className="b3-h2">How do you read <em>someone else&apos;s Big Three?</em></h2>
            <div className="b3-tldr">
              <span className="b3-tldr-l">Short answer</span>
              <p className="b3-tldr-t">When they surprise you, check the Moon. When your first impression turns out to be wrong, that&apos;s the Rising. When they seem to be pulling in two directions, look for a Sun–Moon square or opposition. When someone tells you their sign and nothing lines up, ask for their birth time — you&apos;re reading a Sun sign for someone whose Rising and Moon are running the show.</p>
            </div>
            <p className="b3-p"><strong style={{ color:"#e8e4f0" }}>When they surprise you</strong>, check the Moon. Behaviour that seems out of character for their Sun sign is almost always a Moon sign expression — it surfaces under stress, in intimacy, and when they&apos;re exhausted.</p>
            <p className="b3-p"><strong style={{ color:"#e8e4f0" }}>When your first impression turns out to be wrong</strong>, that&apos;s the Rising sign. You met the interface, not the operating system. A Capricorn Rising with a Leo Sun reads as reserved and serious for three months and then turns out to be the loudest person in the group.</p>
            <p className="b3-p"><strong style={{ color:"#e8e4f0" }}>When they seem to be pulling in two directions at once</strong>, look for a Sun–Moon square or opposition. That&apos;s a genuine internal conflict: what they want and what they need are not the same thing, and they know it.</p>
            <p className="b3-p"><strong style={{ color:"#e8e4f0" }}>When someone tells you their sign and you feel nothing lines up</strong>, ask for their birth time. Nine times out of ten the mismatch is because you&apos;re reading a Sun sign description for someone whose Rising and Moon are running the show.</p>
          </div>

          {/* Next steps */}
          <div className="b3-block">
            <h2 className="b3-h2">Next <em>steps</em></h2>
            <ul className="b3-list">
              <li><Link href="/rising-sign-calculator"><strong>Rising sign calculator</strong></Link> — your Ascendant plus your chart ruler.</li>
              <li><Link href="/moon-sign-calculator"><strong>Moon sign calculator</strong></Link> — your emotional baseline, and what each of the twelve Moon signs actually means.</li>
              <li><Link href="/free-birth-chart"><strong>Free birth chart</strong></Link> — the full wheel with houses and aspects.</li>
              <li><Link href="/natal-chart"><strong>How to read a natal chart</strong></Link> — the step-by-step guide.</li>
              <li><Link href="/zodiac-signs"><strong>All 12 zodiac signs</strong></Link> — traits, dates, elements and rulers.</li>
            </ul>
            <p className="b3-p"><Link href="/#try-it"><strong>Or skip the learning curve — get your Big Three read out loud →</strong></Link></p>
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