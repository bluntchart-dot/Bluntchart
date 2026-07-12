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

/* ── Moon sign descriptions (blunt voice) ── */
const MOON_DESC: Record<string, { need: string; shadow: string; love: string; stress: string }> = {
  Aries: {
    need: "You need action, independence, and the freedom to feel things fast and move on. Sitting with emotions makes you restless. You'd rather do something about it than talk about it.",
    shadow: "You explode quickly and forget just as fast — but the people around you don't forget. Your emotional impulsiveness can leave burns you don't notice.",
    love: "You need a partner who can match your energy and won't punish you for being intense. Boredom in a relationship is your dealbreaker.",
    stress: "Under pressure, you fight. Not always people — sometimes projects, sometimes yourself. You channel anxiety into action, which works until it doesn't.",
  },
  Taurus: {
    need: "You need stability, physical comfort, and a life that doesn't change without warning. Routine isn't boring to you — it's safety. You need to know the ground isn't going to shift.",
    shadow: "You hold on to things and people long past their expiration date because letting go feels like losing yourself. Stubbornness is your emotional armor.",
    love: "You need consistency. Grand gestures mean nothing if they're followed by silence. You'd rather have someone who shows up every day than someone who dazzles you once.",
    stress: "Under pressure, you freeze. You go quiet, retreat into comfort, and refuse to engage until you feel ready — which can take longer than anyone else is willing to wait.",
  },
  Gemini: {
    need: "You need to talk about your feelings to understand them. If you can't articulate it, it doesn't feel real. You process emotions through conversation, writing, and mental reframing.",
    shadow: "You intellectualize feelings to avoid actually sitting in them. You can describe your pain perfectly while being completely disconnected from it.",
    love: "You need a partner who can keep up mentally. Emotional connection for you starts with intellectual stimulation. If they bore you, you can't feel close to them.",
    stress: "Under pressure, you scatter. Too many tabs open, too many plans, nervous energy everywhere. You talk faster and listen less.",
  },
  Cancer: {
    need: "You need emotional safety above everything. You need to know that the people you love aren't going to leave, and that your home — physical or emotional — is secure.",
    shadow: "You remember every emotional injury with perfect clarity and hold it close, sometimes weaponizing old wounds in present arguments. Letting go is your hardest lesson.",
    love: "You need someone who chooses you actively, not passively. You can sense emotional distance instantly and it devastates you even when you don't show it.",
    stress: "Under pressure, you withdraw into your shell. You get quiet, moody, and hypersensitive. You test people to see if they'll come find you.",
  },
  Leo: {
    need: "You need to feel special to the people who matter to you. Not ego — belonging. If you feel unseen or unappreciated by someone you love, it cuts deeper than anyone realizes.",
    shadow: "When you feel insecure, you perform harder — louder, funnier, more generous — hoping the external validation fills the internal gap. It never quite does.",
    love: "You need admiration and affection expressed openly. You don't do subtle. If your partner loves you but doesn't show it, it doesn't count in your emotional system.",
    stress: "Under pressure, you either take over completely or shut down and sulk. There's no middle ground. Your pride won't let you ask for help easily.",
  },
  Virgo: {
    need: "You need to feel useful and in control of your environment. Chaos in your external world creates chaos in your internal world. You calm yourself by organizing, fixing, solving.",
    shadow: "You criticize yourself more harshly than anyone else ever could. Your inner monologue would make your best friend cry if they could hear it.",
    love: "You show love through acts of service and attention to detail. You remember their coffee order, their appointment, their mood shift. You just struggle to say the words.",
    stress: "Under pressure, you spiral into anxiety and overthinking. You make lists, clean things, and try to control every variable because sitting with uncertainty feels unbearable.",
  },
  Libra: {
    need: "You need harmony in your relationships to feel emotionally stable. Conflict disrupts your entire nervous system. You need beauty, balance, and the sense that people around you are okay.",
    shadow: "You suppress your own needs to keep the peace, then resent the people you bent for. You've confused being accommodating with being loved.",
    love: "You need a partnership that feels equal and fair. You keep emotional scorecards even when you pretend you don't. Imbalance makes you quietly miserable.",
    stress: "Under pressure, you become indecisive and passive-aggressive. You smile while you're furious because showing anger feels uglier than holding it in.",
  },
  Scorpio: {
    need: "You need depth, honesty, and emotional truth. Surface-level interactions drain you. You want to know what people really think, really feel, really are — including yourself.",
    shadow: "You test people's loyalty constantly without telling them they're being tested. When they fail, you cut them off with surgical precision and feel justified doing it.",
    love: "You need all-or-nothing connection. You don't do casual feelings. If you love someone, it's consuming — and if they betray you, the wound doesn't heal, it transforms.",
    stress: "Under pressure, you go silent and watchful. You pull all your emotions inward, process them alone, and emerge either resolved or resentful. There's rarely a middle outcome.",
  },
  Sagittarius: {
    need: "You need freedom, meaning, and the belief that things will work out. Emotional confinement — whether it's a relationship, a city, or a job — makes you physically restless.",
    shadow: "You run from emotional pain by reframing it as a lesson, a joke, or an adventure. You're so busy finding the silver lining that you never let yourself actually feel the loss.",
    love: "You need a partner who gives you space without making it conditional. You love deeply, but you need to choose to come back — not be forced to stay.",
    stress: "Under pressure, you escape. New plan, new trip, new idea, anything to avoid sitting in the uncomfortable feeling. You outrun emotions until they catch up.",
  },
  Capricorn: {
    need: "You need to feel competent and in control. Emotional vulnerability feels like weakness to you, even though you know intellectually that it isn't. You earn love by achieving.",
    shadow: "You suppress emotions until they become physical — headaches, tension, exhaustion. You've convinced yourself that feeling things is a luxury you can't afford.",
    love: "You show love through reliability, provision, and presence — not words. You might not say it, but you'll be there at 3 AM without being asked. That's your love language.",
    stress: "Under pressure, you double down on work. You isolate, grind harder, and refuse to admit you're struggling until something breaks — usually your body, not your will.",
  },
  Aquarius: {
    need: "You need mental space and the freedom to feel things on your own terms. You process emotions differently than most people and you've known this your entire life.",
    shadow: "You detach from feelings so effectively that people mistake it for not caring. You do care — you just experience emotions at a distance, like watching weather through a window.",
    love: "You need a partner who respects your independence and doesn't interpret your need for space as rejection. Emotional clingyness suffocates you faster than anything.",
    stress: "Under pressure, you intellectualize everything. You analyze the emotion instead of feeling it, explain the pattern instead of sitting in the pain.",
  },
  Pisces: {
    need: "You need to feel connected to something bigger than yourself — art, spirituality, love, nature. Without that sense of meaning, you feel adrift and overwhelmed by the ordinary.",
    shadow: "You absorb everyone else's emotions and sometimes can't tell which feelings are yours. Your boundaries are so porous that you lose yourself in other people's pain.",
    love: "You love with your entire being and idealize the people you care about. When they turn out to be human, the disappointment is crushing because you saw their potential, not their reality.",
    stress: "Under pressure, you escape into fantasy, sleep, substances, or creative projects. You check out of the painful reality and build a softer one in your mind.",
  },
};

/* ── Reviews ── */
const REVIEWS = [
  { text: "I've used Co-Star, The Pattern, Sanctuary... none said anything I didn't already know. This one said things I hadn't told anyone.", name: "Michelle R.", meta: "Scorpio Sun · Cancer Moon", init: "M" },
  { text: "Three paragraphs in I had to put my phone down. It described me. Not my sign. Me.", name: "Rachel T.", meta: "Libra Sun · Aries Moon", init: "R" },
  { text: "Way more accurate than Co-Star. It didn't sugarcoat the parts I wasn't ready to hear.", name: "Sophie K.", meta: "Aries Sun · Pisces Moon", init: "S" },
  { text: "My therapist has been saying the same thing for six months. My chart said it better in one paragraph.", name: "Dani L.", meta: "Capricorn Sun · Gemini Moon", init: "D" },
  { text: "Finally astrology that doesn't sound like it was written for everyone and no one at the same time.", name: "Zara O.", meta: "Leo Sun · Scorpio Moon", init: "Z" },
  { text: "Twelve dollars. I spent two hours talking about it with my best friend. Insane value.", name: "Chloe M.", meta: "Sagittarius Sun · Aquarius Moon", init: "C" },
];

/* ── FAQ ── */
const FAQS = [
  { q: "What is a Moon sign?", a: "Your Moon sign is the zodiac sign the Moon occupied at the exact moment of your birth. It represents your emotional core — how you process feelings, what you need to feel secure, your instinctive reactions, and the parts of yourself that only emerge in private or under stress. It's considered one of the three most important placements in your birth chart, alongside your Sun and Rising signs." },
  { q: "How do I find my Moon sign?", a: "Enter your birth date, birth time, and birth city into the calculator above. The Moon changes signs every 2 to 2.5 days. If you were born in the middle of a lunar transit, your date alone is enough. If you were born near a sign change, your birth time is needed for accuracy." },
  { q: "Do I need my birth time for my Moon sign?", a: "Not always. The Moon stays in each zodiac sign for about 2.5 days. If the Moon was in the same sign all day on your birthday, the date alone is sufficient. But if the Moon changed signs on your birthday, your birth time determines which side of the change you fall on. Using your birth time always gives the most accurate result." },
  { q: "Why do I feel more like my Moon sign than my Sun sign?", a: "This is very common. Your Moon sign governs your emotional baseline — the feelings, needs, and reactions that run beneath your conscious personality. In intimate relationships, under stress, or when you're alone, your Moon sign energy dominates. Your Sun sign is who you're becoming; your Moon sign is who you already are underneath." },
  { q: "Does my Moon sign affect my relationships?", a: "Significantly. Your Moon sign determines what you need emotionally in a relationship — how you want to be loved, what triggers your insecurities, and how you nurture others. Moon sign compatibility often predicts relationship satisfaction more accurately than Sun sign compatibility, because it governs the emotional undercurrent of the partnership." },
  { q: "How accurate is this Moon sign calculator?", a: "This calculator uses astronomy-engine, a high-precision astronomical computation library. It calculates the Moon's geocentric ecliptic longitude at your exact moment of birth, accurate to arc-second precision. The result matches professional ephemeris tools. For births near a lunar sign change, providing your exact birth time ensures accuracy." },
  { q: "What's the difference between Moon sign and Rising sign?", a: "Your Moon sign is your inner emotional world — private, instinctive, often hidden. Your Rising sign is your outer social personality — public, visible, and the first impression you give. Moon is how you feel; Rising is how you appear. Both require birth time for accuracy, but they reveal completely different dimensions of your personality." },
];

export default function MoonSignClient() {
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
    if (!email.trim() || !dob || !city.trim()) { setErr("Please fill in your email, date of birth, and city."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) { setErr("Please enter a valid email address."); return; }
    setErr(""); setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();
    try {
      let geo: { lat: number; lng: number; timezone: string } | null = null;
      if (cityGeo) { geo = { lat: cityGeo.lat, lng: cityGeo.lng, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? "" }; }
      else { geo = await geocodeBirthPlace(city.trim()); }
      if (!geo) throw new Error("Could not locate your city. Try adding country.");
      const birth: BirthData = { name: fname.trim() || "You", date: dob, time: btime || "12:00", lat: geo.lat, lng: geo.lng, timezone: geo.timezone, placeName: city.trim() };
      const chartData = calculateChart(birth);
      setChart(chartData);
      try { await fetch("/api/save-pending", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ name: fname.trim() || "Moon Sign User", email: normalizedEmail, dob, birth_time: btime || "12:00", city: city.trim(), birth_lat: geo.lat, birth_lng: geo.lng, timezone: geo.timezone, source: "moon-sign-calculator" }) }); } catch {}
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior:"smooth", block:"start" }), 200);
    } catch (e) { setErr(e instanceof Error ? e.message : "Something went wrong."); }
    finally { setLoading(false); }
  };

  const moonSign = chart?.planets?.find(p => p.name === "Moon")?.sign ?? null;
  const moonDeg = chart?.planets?.find(p => p.name === "Moon")?.degree ?? 0;
  const sunSign = chart?.planets?.find(p => p.name === "Sun")?.sign ?? null;
  const risingSign = chart?.ascendant?.sign ?? null;
  const moonInfo = moonSign ? MOON_DESC[moonSign] : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--font-display:'Playfair Display',Georgia,serif;--font-body:'DM Sans',system-ui,sans-serif;--bg:#09090f;--card:#12121e;--border:rgba(255,255,255,0.08);--white:#e8e4f0;--dim:rgba(232,228,240,0.55);--gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);--purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5;--moon:#c4a8ff}
        html{scroll-behavior:smooth}body{background:var(--bg);color:var(--white);font-family:var(--font-body);-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .ms-c{max-width:1100px;margin:0 auto;padding:0 24px}
        .ms-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;transition:all .3s}
        .ms-nav.on{background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
        .ms-logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:10px}
        .ms-logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .ms-inp{width:100%;background:rgba(255,255,255,0.04);border:0.5px solid rgba(255,255,255,0.1);border-radius:10px;padding:13px 14px;font-size:14px;color:#e8e4f0;font-family:inherit;outline:none}
        .ms-inp:focus{border-color:rgba(107,47,212,0.5)}
        .ms-lbl{display:block;font-size:11px;font-weight:600;color:#6b6585;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:6px}
        .ms-btn{width:100%;background:linear-gradient(135deg,#6b2fd4,#d4537e);color:#fff;border:none;border-radius:12px;padding:16px 20px;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;transition:opacity .2s}
        .ms-btn:hover{opacity:.88}.ms-btn:disabled{opacity:.5;cursor:not-allowed}
        .ms-cta{display:block;width:100%;max-width:480px;margin:0 auto;background:linear-gradient(135deg,#f0b84a,#e8854a);color:#0d0800;border:none;border-radius:12px;padding:18px 24px;font-size:16px;font-weight:700;font-family:inherit;cursor:pointer;text-align:center;text-decoration:none;transition:opacity .2s,transform .15s}
        .ms-cta:hover{opacity:.88;transform:translateY(-1px)}
        @media(max-width:768px){.ms-nav-links{display:none!important}.ms-detail-grid{grid-template-columns:1fr 1fr!important}}
      `}</style>

      {/* NAV */}
      <nav className={`ms-nav${scrolled?" on":""}`}>
        <div className="ms-c" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Link href="/" className="ms-logo"><Image src="/mascot.png" alt="BluntChart" width={34} height={34} style={{ borderRadius:"50%" }}/><span className="g">BluntChart</span></Link>
          <div className="ms-nav-links" style={{ display:"flex", alignItems:"center", gap:24 }}>
            <Link href="/free-birth-chart" style={{ fontSize:13, color:"var(--dim)", textDecoration:"none" }}>Birth Chart</Link>
            <Link href="/rising-sign-calculator" style={{ fontSize:13, color:"var(--dim)", textDecoration:"none" }}>Rising Sign</Link>
            <Link href="/#try-it" style={{ fontSize:13, color:"#F0B84A", textDecoration:"none", fontWeight:600, border:"1px solid var(--gold-dim)", padding:"6px 15px", borderRadius:4 }}>Full Reading $15</Link>
          </div>
        </div>
      </nav>

      {/* HERO + FORM */}
      <section style={{ paddingTop:120, paddingBottom:64, position:"relative" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 50% -10%,rgba(196,168,255,.06) 0%,transparent 50%)", pointerEvents:"none" }}/>
        <div className="ms-c" style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:12, color:"rgba(232,228,240,0.3)", marginBottom:24 }}>
            <Link href="/" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>BluntChart</Link><span style={{ margin:"0 8px" }}>/</span><span style={{ color:"rgba(232,228,240,0.5)" }}>Moon Sign Calculator</span>
          </div>
          <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"var(--moon)", padding:"5px 14px", border:"1px solid rgba(196,168,255,0.2)", borderRadius:100, background:"rgba(196,168,255,0.06)", marginBottom:24 }}>☽ Free tool · No signup required</div>
            <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.2rem,5.5vw,3.6rem)", fontWeight:900, lineHeight:1.08, letterSpacing:"-0.02em", marginBottom:14 }}>
              Moon Sign<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#c4a8ff,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Calculator</em>
            </h1>
            <p style={{ fontSize:16, color:"var(--dim)", lineHeight:1.72, maxWidth:560, margin:"0 auto 12px" }}>
              Your Sun sign is who you are. Your Moon sign is how you <em>feel</em>. Find your lunar sign
              to understand your emotional patterns, hidden needs, and what you look like when nobody&apos;s watching.
            </p>
            <p style={{ fontSize:13, color:"rgba(232,228,240,0.3)", marginBottom:40 }}>Free, instant, no account needed. Birth time recommended but not required.</p>
          </div>

          {/* FORM */}
          <div style={{ maxWidth:600, margin:"0 auto", background:"rgba(255,255,255,0.03)", border:"0.5px solid var(--border)", borderRadius:18, padding:32 }}>
            {err && <div style={{ background:"rgba(212,83,126,0.08)", border:"0.5px solid rgba(212,83,126,0.3)", borderRadius:10, padding:"11px 14px", fontSize:13, color:"#f0a0b8", marginBottom:14 }}>{err}</div>}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              <div><label className="ms-lbl">First name <span style={{ color:"#3a3858", fontWeight:400 }}>(optional)</span></label><input className="ms-inp" value={fname} onChange={e=>setFname(e.target.value)} placeholder="e.g. Sarah"/></div>
              <div><label className="ms-lbl">Email address *</label><input type="email" className="ms-inp" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com"/><small style={{ fontSize:11, color:"#3a3858", marginTop:4, display:"block" }}>We&apos;ll send your Moon sign result here</small></div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              <div><label className="ms-lbl">Date of birth *</label><input type="date" className="ms-inp" value={dob} onChange={e=>setDob(e.target.value)}/></div>
              <div><label className="ms-lbl">Time of birth <span style={{ color:"#3a3858", fontWeight:400 }}>(recommended)</span></label><input type="time" className="ms-inp" value={btime} onChange={e=>setBtime(e.target.value)}/><small style={{ fontSize:11, color:"#3a3858", marginTop:4, display:"block" }}>Helps if Moon changed signs on your birthday</small></div>
            </div>
            <div style={{ marginBottom:24 }}><label className="ms-lbl">City &amp; country of birth *</label><LocationPicker value={city} onChange={(loc,raw) => { setCityGeo(loc); setCity(raw); }} placeholder="e.g. New York, USA or Mumbai, India"/></div>
            <button className="ms-btn" onClick={handleCalculate} disabled={loading}>{loading ? "Finding your Moon sign…" : "Find My Moon Sign — Free ☽"}</button>
            <p style={{ fontSize:11, color:"#2e2c3e", textAlign:"center", marginTop:12 }}>Your data is used to calculate your chart. We may send your reading offer — no spam, ever.</p>
          </div>
        </div>
      </section>

      {/* RESULT */}
      {chart && moonSign && moonInfo && (
        <section ref={resultRef} style={{ paddingBottom:80 }}>
          <div className="ms-c">
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:40 }}>
              <span style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.06)" }}/>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase" as const, color:"#3a3858" }}>{fname ? `${fname}'s` : "Your"} Moon Sign</span>
              <span style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.06)" }}/>
            </div>

            {/* Moon Sign hero */}
            <div style={{ textAlign:"center", marginBottom:48 }}>
              <span style={{ fontSize:48, display:"block", marginBottom:8 }}>☽</span>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"var(--moon)", marginBottom:12 }}>{fname ? `${fname}'s` : "Your"} Moon sign is</p>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3rem,8vw,5rem)", fontWeight:900, lineHeight:1, marginBottom:8 }}>
                <span style={{ background:"linear-gradient(135deg,#c4a8ff,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>{moonSign}</span>
              </h2>
              <p style={{ fontSize:16, color:"rgba(232,228,240,0.5)", fontFamily:"var(--font-display)", fontStyle:"italic" }}>Moon at {moonDeg.toFixed(1)}° {moonSign}</p>
              {sunSign && risingSign && btime && (
                <p style={{ fontSize:13, color:"rgba(232,228,240,0.3)", marginTop:12 }}>Big Three: ☉ {sunSign} · ☽ {moonSign} · ↑ {risingSign}</p>
              )}
            </div>

            {/* Moon sign description cards */}
            <div className="ms-detail-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, maxWidth:720, margin:"0 auto 48px" }}>
              {[
                { label:"What you need", text:moonInfo.need, icon:"🌙", border:"rgba(196,168,255,0.3)" },
                { label:"Your shadow side", text:moonInfo.shadow, icon:"🌑", border:"rgba(212,83,126,0.3)" },
                { label:"How you love", text:moonInfo.love, icon:"💜", border:"rgba(196,168,255,0.2)" },
                { label:"Under stress", text:moonInfo.stress, icon:"⚡", border:"rgba(240,184,74,0.3)" },
              ].map((item,i) => (
                <div key={i} style={{ background:"var(--card)", border:`0.5px solid ${item.border}`, borderRadius:14, padding:"22px 20px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
                    <span style={{ fontSize:16 }}>{item.icon}</span>
                    <span style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"var(--moon)" }}>{item.label}</span>
                  </div>
                  <p style={{ fontSize:13, color:"rgba(232,228,240,0.6)", lineHeight:1.65 }}>{item.text}</p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div style={{ background:"rgba(196,168,255,0.04)", border:"0.5px solid rgba(196,168,255,0.15)", borderRadius:20, padding:"40px 32px", textAlign:"center", marginBottom:48 }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"var(--gold)", marginBottom:12 }}>Your Moon sign is just one layer</p>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.4rem,3.5vw,2rem)", fontWeight:800, lineHeight:1.1, marginBottom:14 }}>
                Your emotions have a <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#c4a8ff,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>whole chart behind them.</em>
              </h2>
              <p style={{ fontSize:14, color:"var(--dim)", lineHeight:1.72, maxWidth:480, margin:"0 auto 24px" }}>
                A BluntChart reading analyzes your Moon alongside Venus, Mars, Saturn, houses, and aspects — revealing
                why you attract who you attract, why you sabotage what you build, and what your chart says you actually need.
              </p>
              <Link href="/#try-it" className="ms-cta">Get My Full Reading · $15 ✦</Link>
              <p style={{ fontSize:12, color:"#3a3858", marginTop:12 }}>One-time · No subscription · Emailed instantly · ~1,500 words</p>
            </div>

            {/* Chart wheel */}
            {btime && (
              <div style={{ marginBottom:48 }}>
                <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, marginBottom:16, textAlign:"center" }}>{fname ? `${fname}'s` : "Your"} full natal chart</h3>
                <ChartWheel chart={chart}/>
              </div>
            )}
          </div>
        </section>
      )}

      {/* SEO CONTENT */}
      <section style={{ padding:"80px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}>
        <div className="ms-c" style={{ maxWidth:900 }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:24 }}>
            Understanding your <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#c4a8ff,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Moon sign</em>
          </h2>
          <div style={{ fontSize:15, color:"rgba(232,228,240,0.6)", lineHeight:1.78 }}>
            <p style={{ marginBottom:20 }}>In astrology, your Moon sign is the zodiac sign the Moon occupied at the moment you were born. While your Sun sign represents your conscious identity — the self you project — your Moon sign reveals the emotional undercurrent running beneath everything you do. It governs your instincts, your comfort needs, your childhood conditioning, and the way you experience intimacy.</p>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"#e8e4f0", marginBottom:12 }}>Why the Moon sign matters</h3>
            <p style={{ marginBottom:20 }}>The Moon moves through all twelve zodiac signs in approximately 28 days, spending about 2.5 days in each sign. This rapid movement is why two people born just days apart can have completely different emotional makeups. Your Moon sign is the private you — the version that surfaces when you're tired, stressed, in love, or alone. It's the part of you that your partner, your family, and your therapist know best, even if the rest of the world only sees your Sun sign.</p>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"#e8e4f0", marginBottom:12 }}>Moon sign vs Sun sign</h3>
            <p style={{ marginBottom:20 }}>Your Sun sign is who you're becoming — your life purpose, your ego, the identity you grow into over time. Your Moon sign is who you already are underneath — the emotional patterns established in childhood that you carry through life. If your Sun sign is your resume, your Moon sign is your diary. Many people relate more to their Moon sign than their Sun sign because it describes their internal experience with uncanny accuracy.</p>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"#e8e4f0", marginBottom:12 }}>Moon signs in relationships</h3>
            <p style={{ marginBottom:20 }}>In relationship astrology, Moon sign compatibility is often more predictive of long-term happiness than Sun sign compatibility. Your Moon sign determines what makes you feel loved, what triggers your deepest insecurities, and how you behave in emotional conflict. Two people with compatible Moon signs tend to feel emotionally "at home" with each other, even if their Sun signs suggest tension.</p>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"#e8e4f0", marginBottom:12 }}>About this calculator</h3>
            <p>This free Moon sign calculator uses astronomy-engine, a high-precision astronomical library that computes the Moon's geocentric ecliptic longitude at your exact moment of birth. The Moon's position is accurate to arc-second precision. If you don't know your exact birth time, the calculator defaults to noon, which is accurate for most births — but if the Moon changed signs on your birthday, your birth time may affect the result.</p>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding:"80px 0" }}>
        <div className="ms-c">
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><span style={{ width:22, height:1, background:"#F0B84A" }}/><span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"#F0B84A" }}>What people say</span></div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:12 }}>People keep sending it <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#c4a8ff,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>to their friends.</em></h2>
          <p style={{ fontSize:15, color:"var(--dim)", maxWidth:440, lineHeight:1.72, marginBottom:36 }}>Real responses from beta readers. Unfiltered, because that&apos;s the whole point.</p>
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
        <div className="ms-c" style={{ maxWidth:900 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><span style={{ width:22, height:1, background:"var(--moon)" }}/><span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"var(--moon)" }}>Common questions</span></div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:32 }}>Moon sign <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#c4a8ff,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>FAQ</em></h2>
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
        <div className="ms-c" style={{ textAlign:"center" }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:800, marginBottom:14 }}>
            Your Moon sign is how you feel.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#c4a8ff,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>A full reading tells you why.</em>
          </h2>
          <p style={{ fontSize:14, color:"var(--dim)", maxWidth:460, margin:"0 auto 24px", lineHeight:1.72 }}>10 brutally honest insights. Venus, Mars, Saturn, houses, aspects — every pattern, named and explained.</p>
          <Link href="/#try-it" className="ms-cta" style={{ maxWidth:360 }}>Get My Full Reading · $15 ✦</Link>
        </div>
      </section>
</>
  );
}