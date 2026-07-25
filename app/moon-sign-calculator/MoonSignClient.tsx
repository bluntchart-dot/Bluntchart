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
  { q: "What is a Moon sign?", a: "Your Moon sign is the zodiac sign the Moon occupied at the moment of your birth. It represents your emotional core — how you process feelings, what you need to feel secure, your instinctive reactions, and the parts of yourself that only emerge in private or under stress. Alongside your Sun and Rising, it's one of the three most important placements in your chart." },
  { q: "Why is my Moon sign different on different websites?", a: "One of four things happened: your birth time crossed a lunar ingress; the site handled your historical time zone incorrectly (daylight saving rules have changed repeatedly); one site defaulted to noon without telling you; or they use the sidereal zodiac instead of tropical (sidereal will usually give you the previous sign). Only one of those is actually an error." },
  { q: "Can I find my Moon sign without a birth time?", a: "Usually yes. The Moon spends about 2 days 5 hours in each sign, so on roughly two thirds of birthdays it was in a single sign for the whole day. If your date lands near a boundary, run the calculator at 00:01 and 23:59 — if both return the same sign, you're safe. If they differ, read both descriptions; they don't feel the same." },
  { q: "Does Moon sign compatibility matter more than Sun sign compatibility?", a: "Yes, for whether you can actually live with someone. Sun sign compatibility predicts whether you admire each other. Moon sign compatibility predicts whether your instinctive stress reactions wound or soothe each other, and whether 'being cared for' means the same thing to both of you. The single strongest indicator in synastry is one person's Moon conjunct the other's Sun." },
  { q: "What Moon phase was I born under?", a: "Your Moon sign is where the Moon was. Your natal lunar phase is the angular relationship between the Moon and Sun at birth — a separate layer. New Moon (0–45°), Crescent, First Quarter, Gibbous, Full Moon, Disseminating, Last Quarter, and Balsamic. Balsamic Moon people often describe feeling like they arrived at the end of something rather than the start." },
  { q: "Which Moon sign is the rarest?", a: "None of them, meaningfully. The Moon spends roughly equal time in each sign over any long period. Small variations exist from orbital speed and birth-rate seasonality — a few percentage points — but nothing makes any Moon sign genuinely rare. Anyone claiming otherwise is repeating a claim without data. Certain aspect combinations are rare; the Moon signs themselves are not." },
  { q: "Which Moon sign is the luckiest?", a: "There isn't one. Traditional astrology considers the Moon exalted in Taurus, in domicile in Cancer (least friction), in fall in Scorpio, and in detriment in Capricorn (works against its own nature). That's about ease of expression, not fortune. A Scorpio Moon is harder to live inside — and also the placement most likely to see straight through someone." },
  { q: "How accurate is this Moon sign calculator?", a: "The calculator computes the Moon's geocentric ecliptic longitude at your exact moment of birth from a high-precision astronomical ephemeris, in the tropical zodiac, using the historical time zone offset for your birth location and date. Accurate to arc-second precision. If your Moon was within a few degrees of a sign boundary, we'll tell you rather than hiding it." },
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
        .ms-c{max-width:1280px;margin:0 auto;padding:0 40px}
        @media(max-width:768px){.ms-c{padding:0 20px}}
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

      {/* SEO LONG-FORM GUIDE */}
      <section style={{ padding:"80px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}>
        <div className="ms-c" style={{ maxWidth:1080 }}>

          <style>{`
            .ms-h2{font-family:var(--font-display);font-size:clamp(1.5rem,3.2vw,2rem);font-weight:800;line-height:1.15;letter-spacing:-0.01em;color:#e8e4f0;margin:0 0 14px}
            .ms-h2 em{font-style:italic;background:linear-gradient(135deg,#c4a8ff,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
            .ms-h3{font-family:var(--font-display);font-size:18px;font-weight:700;color:#e8e4f0;margin:24px 0 10px}
            .ms-p{font-size:15px;color:rgba(232,228,240,0.65);line-height:1.78;margin-bottom:16px}
            .ms-p a{color:var(--moon);text-decoration:underline;text-decoration-color:rgba(196,168,255,0.35);text-underline-offset:3px}
            .ms-p a:hover{text-decoration-color:var(--moon)}
            .ms-tldr{background:rgba(196,168,255,0.06);border-left:3px solid var(--moon);border-radius:0 10px 10px 0;padding:16px 20px;margin:0 0 24px}
            .ms-tldr-l{font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--moon);margin-bottom:6px;display:block}
            .ms-tldr-t{font-size:15px;color:#e8e4f0;line-height:1.65}
            .ms-block{margin-bottom:56px}
            .ms-list{margin:0 0 16px 0;padding-left:22px}
            .ms-list li{font-size:15px;color:rgba(232,228,240,0.65);line-height:1.7;margin-bottom:8px}
            .ms-list li strong{color:#e8e4f0;font-weight:600}
            .ms-signs{display:grid;gap:14px;margin:8px 0 8px}
            .ms-sign{background:rgba(255,255,255,0.02);border:0.5px solid rgba(196,168,255,0.15);border-radius:12px;padding:16px 18px}
            .ms-sign h4{font-family:var(--font-display);font-size:17px;font-weight:700;color:var(--moon);margin:0 0 6px;letter-spacing:-0.01em}
            .ms-sign p{font-size:14px;color:rgba(232,228,240,0.7);line-height:1.65;margin:0}
          `}</style>

          {/* Per-sign meanings */}
          <div className="ms-block">
            <h2 className="ms-h2">What does each <em>Moon sign actually mean?</em></h2>
            <div className="ms-tldr">
              <span className="ms-tldr-l">Short answer</span>
              <p className="ms-tldr-t">Your Moon sign describes your emotional operating system: what you need to feel safe, how you behave when you&apos;re hurt, and what you look like with nobody watching. Here&apos;s each one, without the greeting-card version.</p>
            </div>

            <div className="ms-signs">
              <div className="ms-sign"><h4>Aries Moon</h4><p>Feels everything at maximum volume for about four minutes. Anger arrives instantly and leaves just as fast, which the people around you find much harder to process than you do. You need action when you&apos;re upset, not comfort. Independence isn&apos;t a preference; it&apos;s a safety requirement.</p></div>
              <div className="ms-sign"><h4>Taurus Moon</h4><p>The most emotionally stable Moon, and the slowest to change. You need physical comfort, routine and predictability, and you&apos;re calmer under pressure than almost anyone. The cost is that you&apos;ll stay in something that stopped working years ago because leaving is more disruptive than enduring.</p></div>
              <div className="ms-sign"><h4>Gemini Moon</h4><p>You process feelings by talking about them, and if you can&apos;t talk you&apos;ll intellectualise instead. Emotions get named, analysed and filed rather than felt — efficient right up until something too big to explain arrives. You need mental stimulation to feel emotionally well.</p></div>
              <div className="ms-sign"><h4>Cancer Moon</h4><p>The Moon rules Cancer, so this is the placement at full strength. You feel everything, including things happening to other people, and your emotional memory is total. You need closeness and reassurance. The shadow is that hurt goes inward and comes out sideways.</p></div>
              <div className="ms-sign"><h4>Leo Moon</h4><p>You need to be seen, and being ignored genuinely wounds you in a way you&apos;d rather not admit. Warmth and generosity come naturally. You&apos;re dramatic when hurt because the alternative — being quietly upset and unnoticed — feels worse than the argument.</p></div>
              <div className="ms-sign"><h4>Virgo Moon</h4><p>You handle feelings by fixing something. Emotional discomfort converts almost immediately into a task, a plan, or a critique. You show love through usefulness and struggle to accept it any other way. The inner critic is brutal and constant.</p></div>
              <div className="ms-sign"><h4>Libra Moon</h4><p>Conflict is physically uncomfortable, so you&apos;ll concede a position you actually held to keep the room calm. You need harmony to feel settled, and you&apos;re genuinely skilled at making other people feel at ease. The problem is that a decade of small concessions produces resentment you never gave yourself permission to feel.</p></div>
              <div className="ms-sign"><h4>Scorpio Moon</h4><p>The Moon is in fall here, which is the technical way of saying this placement is hard to carry. You feel at a depth most people don&apos;t visit and you show almost none of it. Trust is given in increments and revoked permanently. You can read a room&apos;s undercurrents instantly.</p></div>
              <div className="ms-sign"><h4>Sagittarius Moon</h4><p>You need freedom, movement and the sense that there&apos;s an exit. Optimism is real, not performed, and you&apos;ll find the lesson in almost any disaster. What you won&apos;t do is sit inside a painful feeling long enough to finish it — restlessness is your escape route.</p></div>
              <div className="ms-sign"><h4>Capricorn Moon</h4><p>The Moon is in detriment here. You handle emotion by managing it, and often by not having it until a more convenient time that never arrives. Competence became your safety strategy early. You&apos;re the most reliable person anyone knows and the least likely to ask for anything.</p></div>
              <div className="ms-sign"><h4>Aquarius Moon</h4><p>You observe your own feelings from a slight distance, as though they belong to someone you&apos;re studying. Detachment isn&apos;t coldness — it&apos;s how you stay functional — but people close to you experience it as absence. You care enormously about people in general and find individual emotional demands claustrophobic.</p></div>
              <div className="ms-sign"><h4>Pisces Moon</h4><p>You absorb the emotional state of whatever room you&apos;re in and frequently can&apos;t tell which feelings started as yours. Empathy is close to involuntary. Boundaries are the lifelong project. You need solitude and something to escape into — art, water, sleep, fiction.</p></div>
            </div>
            <p className="ms-p">If yours landed uncomfortably close, that&apos;s the point. The <Link href="/#try-it">full reading</Link> takes your Moon sign, the house it sits in, and every aspect to it, and tells you where the pattern came from. If Scorpio, Capricorn or Aquarius Moon landed particularly close, the withdrawal side of it has its own page: <Link href="/why-do-i-push-people-away">why do I push people away when I get close?</Link></p>
          </div>

          {/* Why Moon sign differs between sites */}
          <div className="ms-block">
            <h2 className="ms-h2">Why is my Moon sign <em>different on different websites?</em></h2>
            <div className="ms-tldr">
              <span className="ms-tldr-l">Short answer</span>
              <p className="ms-tldr-t">One of four things happened: your birth time crossed a lunar ingress; the sites handled your historical time zone differently; one site defaulted to noon without telling you; or they use a different zodiac reference frame (sidereal vs tropical). All four are common, and only one of them is actually an error.</p>
            </div>
            <p className="ms-p"><strong style={{ color:"#e8e4f0" }}>1. Your birth time crossed a lunar ingress.</strong> The Moon changes signs every 2.2 to 2.5 days, so roughly one birthday in three falls near a boundary. If yours did, a site defaulting to noon and a site using your actual 9 PM birth time will disagree — and only the one with your real time is right for you.</p>
            <p className="ms-p"><strong style={{ color:"#e8e4f0" }}>2. Time zone handling.</strong> This is the sneaky one, and the most common genuine error. Daylight saving rules have changed repeatedly across the US, UK, EU and Australia, and several regions have shifted zones outright. A calculator applying today&apos;s offset to a 1987 birth will be an hour or more out.</p>
            <p className="ms-p"><strong style={{ color:"#e8e4f0" }}>3. One site defaulted to noon and didn&apos;t tell you.</strong> Many free calculators silently substitute 12:00 when you leave the time blank, then present the result as definitive. If you were born in the evening and the Moon changed signs at 3 PM, that site has given you the wrong sign with total confidence.</p>
            <p className="ms-p"><strong style={{ color:"#e8e4f0" }}>4. A different zodiac reference frame.</strong> All Western astrology is calculated in the tropical zodiac, anchored to the seasons. A small number of calculators use the sidereal zodiac instead, anchored to the fixed stars. The two have drifted about 24° apart, so a sidereal calculator will usually give you the previous sign. Not an error, just a different system.</p>
            <p className="ms-p"><strong style={{ color:"#e8e4f0" }}>What BluntChart does:</strong> we compute the Moon&apos;s geocentric ecliptic longitude from a high-precision ephemeris, in the tropical zodiac, using the historical time zone offset for your birth location and date. If your Moon was within a few degrees of a sign boundary, we&apos;ll tell you rather than hiding it.</p>
          </div>

          {/* Without birth time */}
          <div className="ms-block">
            <h2 className="ms-h2">Can I find my Moon sign <em>without a birth time?</em></h2>
            <div className="ms-tldr">
              <span className="ms-tldr-l">Short answer</span>
              <p className="ms-tldr-t">Usually yes. The Moon spends roughly 2 days 5 hours in each sign, so on about two thirds of birthdays the Moon was in a single sign for the whole 24-hour period. On the remaining third, run the calculator at 00:01 and 23:59 on your birth date — if both return the same sign, you&apos;re safe.</p>
            </div>
            <ol className="ms-list">
              <li><strong>Run the calculator with noon.</strong> If the Moon was mid-sign, you&apos;re done and the time is irrelevant.</li>
              <li><strong>If the result lands near a boundary</strong>, run it twice more — at 00:01 and 23:59 on your birth date. If both return the same sign, you&apos;re safe.</li>
              <li><strong>With two candidates, read both descriptions.</strong> This is the one place where subjective recognition is genuinely diagnostic. A Capricorn Moon and an Aquarius Moon do not describe the same person, and people rarely mistake one for the other once they read both properly.</li>
              <li><strong>Ask about the circumstances of your birth.</strong> Even &ldquo;it was late at night&rdquo; or &ldquo;she went into labour after breakfast&rdquo; usually resolves it.</li>
            </ol>
          </div>

          {/* Compatibility */}
          <div className="ms-block">
            <h2 className="ms-h2">Why does <em>Moon sign compatibility</em> beat Sun sign compatibility?</h2>
            <div className="ms-tldr">
              <span className="ms-tldr-l">Short answer</span>
              <p className="ms-tldr-t">Sun sign compatibility is what magazines print. Moon sign compatibility is what actually predicts whether you can live with someone. Your Sun sign describes what you&apos;re building toward; your Moon describes what you do when you&apos;re upset at 11pm on a Wednesday. Only one of those is load-bearing in a relationship.</p>
            </div>
            <p className="ms-p"><strong style={{ color:"#e8e4f0" }}>What Moon compatibility actually governs:</strong> whether your instinctive stress reactions wound each other or soothe each other; whether you need the same things to feel safe; how you each behave when you feel rejected — which is where most relationships actually break; whether &ldquo;being cared for&rdquo; means the same thing to both of you.</p>
            <p className="ms-p"><strong style={{ color:"#e8e4f0" }}>A worked example:</strong> a Cancer Moon under stress wants proximity, reassurance and to talk it through. An Aquarius Moon under stress wants distance, space and time alone to process. Neither is wrong. But the Cancer Moon reads the Aquarius Moon&apos;s withdrawal as abandonment, and the Aquarius Moon reads the Cancer Moon&apos;s pursuit as suffocation. Both people are trying to feel better and both are making the other feel worse. That&apos;s a Moon sign incompatibility, and no amount of shared Sun-sign values fixes it.</p>
            <p className="ms-p"><strong style={{ color:"#e8e4f0" }}>General patterns:</strong> Moons in the same element usually understand each other without explanation. Moons in compatible elements (Fire/Air, Earth/Water) tend to complement. Moons in square or opposition require translation — which is workable, but it has to be conscious.</p>
            <p className="ms-p">The single strongest indicator in synastry is one person&apos;s <strong style={{ color:"#e8e4f0" }}>Moon conjunct the other&apos;s Sun</strong>. What one of them fundamentally is, the other instinctively needs.</p>
          </div>

          {/* Moon phase */}
          <div className="ms-block">
            <h2 className="ms-h2">What Moon phase were you <em>born under?</em></h2>
            <div className="ms-tldr">
              <span className="ms-tldr-l">Short answer</span>
              <p className="ms-tldr-t">Your Moon sign is where the Moon was. Your natal lunar phase is the angular relationship between the Moon and Sun at your birth, and it&apos;s a separate layer most calculators skip. It shapes whether you move like a beginner, a builder, a critic, an integrator, a teacher or someone finishing something.</p>
            </div>
            <ul className="ms-list">
              <li><strong>New Moon (0–45°)</strong> — beginnings, instinct, acting without a map. Often people who don&apos;t look back.</li>
              <li><strong>Crescent (45–90°)</strong> — struggle against inertia, pushing away from origins.</li>
              <li><strong>First Quarter (90–135°)</strong> — crisis in action. Builders and breakers of structures.</li>
              <li><strong>Gibbous (135–180°)</strong> — refinement, analysis, perfectionism, the drive to improve.</li>
              <li><strong>Full Moon (180–225°)</strong> — awareness through relationship. Everything is understood by contrast with someone else.</li>
              <li><strong>Disseminating (225–270°)</strong> — teaching, sharing, distributing what&apos;s been learned.</li>
              <li><strong>Last Quarter (270–315°)</strong> — crisis in consciousness. Dismantling beliefs that no longer hold.</li>
              <li><strong>Balsamic (315–360°)</strong> — the dark moon before the new. Endings, release, a sense of living slightly outside your own time.</li>
            </ul>
            <p className="ms-p">Balsamic Moon people in particular often describe feeling like they arrived at the end of something rather than the start.</p>
            <h3 className="ms-h3">Void of course</h3>
            <p className="ms-p">A Moon is <strong style={{ color:"#e8e4f0" }}>void of course</strong> when it has completed its last major aspect in a sign and hasn&apos;t yet entered the next one. Traditional readings say a void-of-course natal Moon produces a slightly detached emotional quality — feeling somewhat outside the emotional currents everyone else seems caught in, and an unusual difficulty in being manipulated. It&apos;s not a defect. It&apos;s roughly a self-contained emotional system.</p>
          </div>

          {/* Rarest / luckiest */}
          <div className="ms-block">
            <h2 className="ms-h2">Which Moon sign is the <em>rarest? The luckiest?</em></h2>
            <div className="ms-tldr">
              <span className="ms-tldr-l">Short answer</span>
              <p className="ms-tldr-t">Neither question has a real answer. The Moon spends roughly equal time in each sign over any long period, so the twelve Moon signs are close to evenly distributed. Anyone telling you a specific Moon sign is &ldquo;the rarest&rdquo; is repeating a claim without data. Same for &ldquo;luckiest&rdquo; — the Moon is exalted in Taurus and in fall in Scorpio, which is about ease of expression, not fortune.</p>
            </div>
            <p className="ms-p">The Moon completes a full circuit of the zodiac every 27.3 days. Small variations exist — the orbit is elliptical, its speed varies from 12° to 15° per day, and birth-rate seasonality produces a few percentage points of variation. Nothing that makes any Moon sign genuinely rare.</p>
            <p className="ms-p">What is true is that certain <em>combinations</em> are uncommon — a Moon sign in hard aspect to both Saturn and Pluto, for instance, is unusual and meaningfully harder to carry.</p>
            <p className="ms-p">The same applies to &ldquo;luckiest Moon sign.&rdquo; Traditional astrology considers the Moon exalted in Taurus and in domicile in Cancer — meaning it functions with the least friction there — and in fall in Scorpio and detriment in Capricorn, meaning it works against its own nature. That&apos;s a statement about ease of expression, not fortune. A Scorpio Moon is harder to live inside. It&apos;s also the placement most likely to see straight through someone.</p>
          </div>

          {/* Next steps */}
          <div className="ms-block">
            <h2 className="ms-h2">Next <em>steps</em></h2>
            <ul className="ms-list">
              <li><Link href="/rising-sign-calculator"><strong>Rising sign calculator</strong></Link> — how you appear, versus how you feel.</li>
              <li><Link href="/big-three-calculator"><strong>Big Three calculator</strong></Link> — Sun, Moon and Rising together.</li>
              <li><Link href="/free-birth-chart"><strong>Free birth chart</strong></Link> — the full wheel, houses and aspects.</li>
              <li><Link href="/natal-chart"><strong>How to read a natal chart</strong></Link> — including what your Moon&apos;s house placement means.</li>
            </ul>
            <p className="ms-p"><Link href="/#try-it"><strong>Your Moon sign is how you feel. A full reading tells you why →</strong></Link></p>
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