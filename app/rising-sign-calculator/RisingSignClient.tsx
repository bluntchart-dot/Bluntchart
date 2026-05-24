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

/* ── Rising sign descriptions (shown after calculation) ── */
const RISING_DESCRIPTIONS: Record<string, { vibe: string; first: string; shadow: string; style: string }> = {
  Aries: {
    vibe: "Direct, energetic, competitive",
    first: "People notice your confidence first. You walk into a room and take up space without trying. You come across as bold, maybe even intimidating, but it's not intentional — that's just the energy your chart projects.",
    shadow: "You can seem impatient or aggressive before anyone gets to know the softer parts of you.",
    style: "Athletic, sharp features, moves quickly, often the first to speak",
  },
  Taurus: {
    vibe: "Calm, grounded, magnetic",
    first: "People feel safe around you immediately. You have a steadiness that others find calming, almost hypnotic. You don't rush. You don't need to prove anything. That quiet confidence is your Rising sign at work.",
    shadow: "You can seem stubborn or resistant to change, even when change is exactly what you need.",
    style: "Put-together, sensual, favors quality over quantity in appearance",
  },
  Gemini: {
    vibe: "Witty, curious, adaptable",
    first: "People notice how quickly you think. You're the one cracking jokes, asking questions, making connections between things nobody else sees. You come across as youthful and versatile, no matter your age.",
    shadow: "You can seem scattered or unreliable — like you're already thinking about the next thing before finishing this one.",
    style: "Expressive hands, animated face, often looks younger than their age",
  },
  Cancer: {
    vibe: "Nurturing, intuitive, protective",
    first: "People feel emotionally drawn to you before they understand why. You radiate warmth and sensitivity. People tell you things they don't tell anyone else, sometimes within minutes of meeting you.",
    shadow: "You can seem moody or closed off when you feel unsafe, which confuses people who just saw the warm version.",
    style: "Soft features, comforting presence, often has expressive or memorable eyes",
  },
  Leo: {
    vibe: "Warm, magnetic, dramatic",
    first: "People notice you. Period. Whether you're trying or not, your presence is felt. You have a natural warmth and generosity that draws people in, and a flair for making ordinary moments feel like events.",
    shadow: "You can seem attention-seeking or self-centered, even when you're genuinely just being yourself.",
    style: "Expressive, often has notable hair, carries themselves with visible self-assurance",
  },
  Virgo: {
    vibe: "Observant, composed, precise",
    first: "People notice your attention to detail. You come across as put-together, intelligent, and slightly reserved. You're the one who notices what everyone else missed — the typo, the shift in tone, the thing that doesn't add up.",
    shadow: "You can seem critical or overthinking, like you're silently judging even when you're just processing.",
    style: "Clean, understated, polished without being flashy",
  },
  Libra: {
    vibe: "Charming, graceful, diplomatic",
    first: "People find you easy to talk to. You have a natural elegance and social fluency that puts others at ease. You instinctively know how to make people feel included and seen.",
    shadow: "You can seem indecisive or people-pleasing, like you'd rather keep the peace than say what you actually think.",
    style: "Aesthetically aware, symmetrical features, often drawn to fashion or visual beauty",
  },
  Scorpio: {
    vibe: "Intense, magnetic, private",
    first: "People feel your presence before you say a word. There's an intensity to your energy that's impossible to ignore. You come across as deep, powerful, and slightly mysterious — like you know things other people don't.",
    shadow: "You can seem intimidating or secretive, which keeps people at a distance before they even try to get close.",
    style: "Piercing gaze, dark or striking aesthetic, quietly powerful presence",
  },
  Sagittarius: {
    vibe: "Adventurous, optimistic, blunt",
    first: "People notice your energy and enthusiasm. You come across as someone who has stories to tell, places to be, and zero interest in small talk. Your honesty is refreshing — and occasionally startling.",
    shadow: "You can seem reckless or commitment-averse, like you're always halfway out the door.",
    style: "Casual, travel-ready, often taller or takes up physical space generously",
  },
  Capricorn: {
    vibe: "Serious, ambitious, reliable",
    first: "People see someone who has it together. You come across as mature, responsible, and quietly ambitious. There's a gravity to your presence that commands respect even when you're not trying.",
    shadow: "You can seem cold or emotionally unavailable — like you're all business and no softness.",
    style: "Classic, structured, often ages in reverse (looks older young, younger old)",
  },
  Aquarius: {
    vibe: "Unique, independent, cerebral",
    first: "People notice you're different. Not in a trying-to-be-different way — in an actually-wired-differently way. You come across as friendly but detached, intellectual but unpredictable.",
    shadow: "You can seem emotionally distant or contrarian, like you're observing humanity from slightly outside of it.",
    style: "Eclectic, unconventional, often has a distinctive feature or style choice that's uniquely theirs",
  },
  Pisces: {
    vibe: "Dreamy, empathetic, ethereal",
    first: "People feel something gentle and otherworldly about you. You come across as deeply empathetic, creative, and slightly elusive — like you're partly here and partly somewhere else entirely.",
    shadow: "You can seem spacey or overly emotional, which makes people underestimate the depth of your perception.",
    style: "Soft, fluid, often has an artistic or romantic sensibility to their appearance",
  },
};

/* ── FAQ ── */
const FAQS = [
  { q: "What is a Rising sign?", a: "Your Rising sign (also called the Ascendant) is the zodiac sign that was rising on the eastern horizon at the exact moment you were born. It determines how others perceive you, your outward personality, your physical appearance, and the first impression you make. It also sets the entire house system of your birth chart, making it one of the most important placements in astrology." },
  { q: "How do I find my Rising sign?", a: "You need three things: your birth date, your exact birth time (from your birth certificate), and your birth city. Enter these into the calculator above and it will determine which zodiac sign was on the eastern horizon at your moment of birth. Without your birth time, the Rising sign cannot be accurately calculated." },
  { q: "Can I find my Rising sign without my birth time?", a: "No. The Rising sign changes zodiac signs approximately every 2 hours throughout the day. Even a 30-minute difference in birth time can shift your Ascendant to a completely different sign. Your birth certificate almost always has your birth time recorded — check there first." },
  { q: "What's the difference between Sun sign and Rising sign?", a: "Your Sun sign is your core identity — determined by your birth date alone. Your Rising sign is your outward personality — determined by your birth time and location. Think of it this way: your Sun sign is who you are. Your Rising sign is who people think you are when they first meet you. Many people identify more strongly with their Rising sign than their Sun sign." },
  { q: "Why do I relate more to my Rising sign than my Sun sign?", a: "This is extremely common. Your Rising sign governs your outward behavior, social interactions, and how you navigate the world day-to-day. Since most social situations engage your Rising sign energy, it often feels more 'you' than your Sun sign, which represents your deeper core identity that may only show up in private or with people you trust." },
  { q: "Does my Rising sign affect my appearance?", a: "Traditional astrology holds that the Rising sign influences physical appearance and mannerisms. Aries Rising people often have sharp features and an athletic build. Taurus Rising tends toward softer, more sensual features. Leo Rising frequently has notable hair. While this isn't scientifically proven, many astrologers and enthusiasts notice consistent patterns." },
  { q: "How accurate is this Rising sign calculator?", a: "This calculator uses astronomy-engine, a high-precision astronomical computation library. It calculates the exact ecliptic longitude of the eastern horizon point (Ascendant) based on your birth time, date, and geographic coordinates. The accuracy matches professional-grade ephemeris tools like the Swiss Ephemeris." },
  { q: "What are the Big Three in astrology?", a: "The Big Three refers to your Sun sign, Moon sign, and Rising sign — the three most important placements in your birth chart. Your Sun is your core identity. Your Moon is your emotional nature. Your Rising is your outward personality. Together, they give a far more complete picture than your Sun sign alone. This calculator shows you all three." },
];

export default function RisingSignClient() {
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
      setErr("Please fill in your email, date of birth, birth time, and city.");
      return;
    }
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email.trim())) {
      setErr("Please enter a valid email address.");
      return;
    }
    setErr(""); setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      let geo: { lat: number; lng: number; timezone: string } | null = null;
      if (cityGeo) {
        const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
        geo = { lat: cityGeo.lat, lng: cityGeo.lng, timezone: browserTz };
      } else {
        geo = await geocodeBirthPlace(city.trim());
      }
      if (!geo) throw new Error("Could not locate your city. Try adding country (e.g. Mumbai, India).");

      const birth: BirthData = {
        name: fname.trim() || "You",
        date: dob, time: btime,
        lat: geo.lat, lng: geo.lng, timezone: geo.timezone,
        placeName: city.trim(),
      };

      const chartData = calculateChart(birth);
      setChart(chartData);

      try {
        await fetch("/api/save-pending", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: fname.trim() || "Rising Sign User",
            email: normalizedEmail, dob, birth_time: btime,
            city: city.trim(), birth_lat: geo.lat, birth_lng: geo.lng,
            timezone: geo.timezone, source: "rising-sign-calculator",
          }),
        });
      } catch { /* don't block chart */ }

      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 200);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Derived values from chart ── */
  const risingSign = chart?.ascendant?.sign ?? null;
  const risingDeg = chart?.ascendant?.degree ?? 0;
  const sunSign = chart?.planets?.find(p => p.name === "Sun")?.sign ?? null;
  const sunDeg = chart?.planets?.find(p => p.name === "Sun")?.degree ?? 0;
  const moonSign = chart?.planets?.find(p => p.name === "Moon")?.sign ?? null;
  const moonDeg = chart?.planets?.find(p => p.name === "Moon")?.degree ?? 0;
  const risingInfo = risingSign ? RISING_DESCRIPTIONS[risingSign] : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--font-display:'Playfair Display',Georgia,serif;--font-body:'DM Sans',system-ui,sans-serif;--bg:#09090f;--card:#12121e;--border:rgba(255,255,255,0.08);--white:#e8e4f0;--dim:rgba(232,228,240,0.55);--gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);--purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5}
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--white);font-family:var(--font-body);-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .rs-c{max-width:1100px;margin:0 auto;padding:0 24px}
        .rs-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;transition:all .3s}
        .rs-nav.on{background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
        .rs-logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:10px}
        .rs-logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .rs-inp{width:100%;background:rgba(255,255,255,0.04);border:0.5px solid rgba(255,255,255,0.1);border-radius:10px;padding:13px 14px;font-size:14px;color:#e8e4f0;font-family:inherit;outline:none}
        .rs-inp:focus{border-color:rgba(107,47,212,0.5)}
        .rs-lbl{display:block;font-size:11px;font-weight:600;color:#6b6585;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:6px}
        .rs-btn{width:100%;background:linear-gradient(135deg,#6b2fd4,#d4537e);color:#fff;border:none;border-radius:12px;padding:16px 20px;font-size:15px;font-weight:600;font-family:inherit;cursor:pointer;transition:opacity .2s}
        .rs-btn:hover{opacity:.88}
        .rs-btn:disabled{opacity:.5;cursor:not-allowed}
        .rs-cta{display:block;width:100%;max-width:480px;margin:0 auto;background:linear-gradient(135deg,#f0b84a,#e8854a);color:#0d0800;border:none;border-radius:12px;padding:18px 24px;font-size:16px;font-weight:700;font-family:inherit;cursor:pointer;text-align:center;text-decoration:none;transition:opacity .2s,transform .15s}
        .rs-cta:hover{opacity:.88;transform:translateY(-1px)}
        @media(max-width:768px){.rs-nav-links{display:none!important}}
      `}</style>

      {/* NAV */}
      <nav className={`rs-nav${scrolled?" on":""}`}>
        <div className="rs-c" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Link href="/" className="rs-logo">
            <Image src="/mascot.png" alt="BluntChart" width={34} height={34} style={{ borderRadius:"50%" }}/>
            <span className="g">BluntChart</span>
          </Link>
          <div className="rs-nav-links" style={{ display:"flex", alignItems:"center", gap:24 }}>
            <Link href="/free-birth-chart" style={{ fontSize:13, color:"rgba(232,228,240,0.55)", textDecoration:"none", fontWeight:500 }}>Free Birth Chart</Link>
            <Link href="/#try-it" style={{ fontSize:13, color:"#F0B84A", textDecoration:"none", fontWeight:600, border:"1px solid rgba(240,184,74,0.18)", padding:"6px 15px", borderRadius:4 }}>Full Reading $15</Link>
          </div>
        </div>
      </nav>

      {/* HERO + FORM */}
      <section style={{ paddingTop:120, paddingBottom:64, position:"relative" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 50% -10%,rgba(107,47,212,.08) 0%,transparent 50%)", pointerEvents:"none" }}/>
        <div className="rs-c" style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:12, color:"rgba(232,228,240,0.3)", marginBottom:24 }}>
            <Link href="/" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>BluntChart</Link>
            <span style={{ margin:"0 8px" }}>/</span>
            <span style={{ color:"rgba(232,228,240,0.5)" }}>Rising Sign Calculator</span>
          </div>

          <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:11, fontWeight:700,
              letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"#F0B84A",
              padding:"5px 14px", border:"1px solid rgba(240,184,74,0.18)", borderRadius:100,
              background:"rgba(240,184,74,0.06)", marginBottom:24 }}>
              ✦ Free tool · No signup required
            </div>
            <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.2rem,5.5vw,3.6rem)",
              fontWeight:900, lineHeight:1.08, letterSpacing:"-0.02em", marginBottom:14 }}>
              Rising Sign<br/>
              <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                Calculator</em>
            </h1>
            <p style={{ fontSize:16, color:"rgba(232,228,240,0.55)", lineHeight:1.72, maxWidth:540, margin:"0 auto 12px" }}>
              Your Rising sign is the version of you the world meets first. Enter your birth details to find your
              Ascendant — plus your Sun, Moon, and complete Big Three. Requires exact birth time.
            </p>
            <p style={{ fontSize:13, color:"rgba(232,228,240,0.3)", marginBottom:40 }}>
              Free, instant, no account needed. Birth time required for Rising sign accuracy.
            </p>
          </div>

          {/* FORM */}
          <div style={{ maxWidth:600, margin:"0 auto", background:"rgba(255,255,255,0.03)",
            border:"0.5px solid rgba(255,255,255,0.08)", borderRadius:18, padding:32 }}>
            {err && (
              <div style={{ background:"rgba(212,83,126,0.08)", border:"0.5px solid rgba(212,83,126,0.3)",
                borderRadius:10, padding:"11px 14px", fontSize:13, color:"#f0a0b8", marginBottom:14 }}>{err}</div>
            )}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              <div>
                <label className="rs-lbl">First name <span style={{ color:"#3a3858", fontWeight:400 }}>(optional)</span></label>
                <input className="rs-inp" value={fname} onChange={e=>setFname(e.target.value)} placeholder="e.g. Sarah"/>
              </div>
              <div>
                <label className="rs-lbl">Email address *</label>
                <input type="email" className="rs-inp" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@email.com"/>
                <small style={{ fontSize:11, color:"#3a3858", marginTop:4, display:"block" }}>We&apos;ll send your result here too</small>
              </div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              <div>
                <label className="rs-lbl">Date of birth *</label>
                <input type="date" className="rs-inp" value={dob} onChange={e=>setDob(e.target.value)}/>
              </div>
              <div>
                <label className="rs-lbl">Exact birth time *</label>
                <input type="time" className="rs-inp" value={btime} onChange={e=>setBtime(e.target.value)}/>
                <small style={{ fontSize:11, color:"#3a3858", marginTop:4, display:"block" }}>Essential for Rising sign — check birth certificate</small>
              </div>
            </div>
            <div style={{ marginBottom:24 }}>
              <label className="rs-lbl">City &amp; country of birth *</label>
              <LocationPicker value={city} onChange={(loc, raw) => { setCityGeo(loc); setCity(raw); }}
                placeholder="e.g. New York, USA or London, UK"/>
            </div>
            <button className="rs-btn" onClick={handleCalculate} disabled={loading}>
              {loading ? "Calculating your Rising sign…" : "Find My Rising Sign — Free ↑"}
            </button>
            <p style={{ fontSize:11, color:"#2e2c3e", textAlign:"center", marginTop:12 }}>
              Your data is used to calculate your chart. We may send your reading offer — no spam, ever.
            </p>
          </div>

          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:20, marginTop:24, flexWrap:"wrap" }}>
            {["Exact birth time required", "High-precision ephemeris", "Shows Big Three", "Instant result"].map((t,i) => (
              <span key={i} style={{ fontSize:12, color:"rgba(232,228,240,0.35)", display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ color:"#5dcaa5", fontWeight:700 }}>✓</span>{t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* RESULT */}
      {chart && risingSign && risingInfo && (
        <section ref={resultRef} style={{ paddingBottom:80 }}>
          <div className="rs-c">
            {/* Divider */}
            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:40 }}>
              <span style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.06)" }}/>
              <span style={{ fontSize:10, fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase" as const, color:"#3a3858" }}>Your Rising Sign</span>
              <span style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.06)" }}/>
            </div>

            {/* Rising Sign hero result */}
            <div style={{ textAlign:"center", marginBottom:48 }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"#F0B84A", marginBottom:12 }}>
                {fname ? `${fname}'s` : "Your"} Rising sign is
              </p>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(3rem,8vw,5rem)", fontWeight:900, lineHeight:1, marginBottom:8 }}>
                <span style={{ background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text",
                  WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                  {risingSign}
                </span>
              </h2>
              <p style={{ fontSize:16, color:"rgba(232,228,240,0.5)", fontFamily:"var(--font-display)", fontStyle:"italic" }}>
                Ascendant at {risingDeg.toFixed(1)}° {risingSign}
              </p>
            </div>

            {/* Big Three cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14, maxWidth:640, margin:"0 auto 40px" }}>
              {[
                { label:"Sun Sign", sign:sunSign, deg:sunDeg, icon:"☉", desc:"Your core identity" },
                { label:"Moon Sign", sign:moonSign, deg:moonDeg, icon:"☽", desc:"Your emotional nature" },
                { label:"Rising Sign", sign:risingSign, deg:risingDeg, icon:"↑", desc:"How others see you" },
              ].map((item,i) => (
                <div key={i} style={{ background:"var(--card)", border: i===2 ? "1px solid rgba(240,184,74,0.3)" : "0.5px solid var(--border)",
                  borderRadius:14, padding:"20px 16px", textAlign:"center" }}>
                  <span style={{ fontSize:24, display:"block", marginBottom:6, color:"#F0B84A", fontFamily:"serif" }}>{item.icon}</span>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const,
                    color:"rgba(232,228,240,0.4)", marginBottom:6 }}>{item.label}</div>
                  <div style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:800, marginBottom:4 }}>{item.sign}</div>
                  <div style={{ fontSize:12, color:"rgba(232,228,240,0.35)" }}>{item.deg.toFixed(1)}°</div>
                  <div style={{ fontSize:11, color:"rgba(232,228,240,0.3)", marginTop:6 }}>{item.desc}</div>
                </div>
              ))}
            </div>

            {/* Rising sign description */}
            <div style={{ maxWidth:640, margin:"0 auto 48px", background:"rgba(107,47,212,0.04)",
              border:"0.5px solid rgba(107,47,212,0.2)", borderRadius:18, padding:"28px 28px 24px" }}>
              <h3 style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:700, marginBottom:6 }}>
                {risingSign} Rising
              </h3>
              <p style={{ fontSize:13, color:"rgba(232,228,240,0.4)", marginBottom:20, fontStyle:"italic" }}>
                {risingInfo.vibe}
              </p>
              <div style={{ fontSize:14, color:"rgba(232,228,240,0.65)", lineHeight:1.75, marginBottom:18 }}>
                <p style={{ marginBottom:14 }}><strong style={{ color:"#e8e4f0" }}>First impression:</strong> {risingInfo.first}</p>
                <p style={{ marginBottom:14 }}><strong style={{ color:"#e8e4f0" }}>The shadow side:</strong> {risingInfo.shadow}</p>
                <p><strong style={{ color:"#e8e4f0" }}>Appearance &amp; style:</strong> {risingInfo.style}</p>
              </div>
            </div>

            {/* CTA */}
            <div style={{ background:"rgba(255,255,255,0.02)", border:"0.5px solid rgba(255,255,255,0.08)",
              borderRadius:20, padding:"40px 32px", textAlign:"center", marginBottom:48 }}>
              <p style={{ fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"#F0B84A", marginBottom:12 }}>
                This is just the surface
              </p>
              <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.4rem,3.5vw,2rem)", fontWeight:800, lineHeight:1.1, marginBottom:14 }}>
                Your Rising sign is the mask.<br/>
                <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)",
                  WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                  Want to see what&apos;s underneath?</em>
              </h2>
              <p style={{ fontSize:14, color:"rgba(232,228,240,0.55)", lineHeight:1.72, maxWidth:480, margin:"0 auto 24px" }}>
                A BluntChart reading goes beyond your Big Three. 10 brutally honest insights across all your
                placements — Venus, Mars, Saturn, houses, aspects. ~1,500 words that feel like they were
                written by someone who actually knows you.
              </p>
              <Link href="/#try-it" className="rs-cta">Get My Full Reading · $15 ✦</Link>
              <p style={{ fontSize:12, color:"#3a3858", marginTop:12 }}>One-time · No subscription · Emailed instantly</p>
            </div>

            {/* Chart Wheel */}
            <div style={{ marginBottom:48 }}>
              <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, marginBottom:16, textAlign:"center" }}>
                {fname ? `${fname}'s` : "Your"} full natal chart
              </h3>
              <ChartWheel chart={chart}/>
            </div>

            {/* Second CTA */}
            <div style={{ textAlign:"center", padding:"32px 0", borderTop:"0.5px solid rgba(255,255,255,0.06)" }}>
              <p style={{ fontSize:15, color:"rgba(232,228,240,0.55)", marginBottom:16, fontFamily:"var(--font-display)", fontStyle:"italic" }}>
                &ldquo;Your chart already knows why you&apos;re like this. BluntChart just says it out loud.&rdquo;
              </p>
              <Link href="/#try-it" style={{ display:"inline-flex", alignItems:"center", gap:8,
                padding:"14px 30px", background:"linear-gradient(135deg,#6b2fd4,#d4537e)", color:"#fff",
                fontWeight:700, fontSize:14, letterSpacing:"0.04em", textTransform:"uppercase" as const,
                textDecoration:"none", borderRadius:10 }}>
                Get My Full Reading — $15 ✨
              </Link>
            </div>
          </div>
        </section>
      )}


      {/* SEO CONTENT */}
      <section style={{ padding:"80px 0", background:"#0d0d18", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
        <div className="rs-c" style={{ maxWidth:760 }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:24 }}>
            What is a <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Rising sign?</em>
          </h2>
          <div style={{ fontSize:15, color:"rgba(232,228,240,0.6)", lineHeight:1.78 }}>
            <p style={{ marginBottom:20 }}>
              Your Rising sign — also called the Ascendant — is the zodiac sign that was ascending on the eastern
              horizon at the exact moment and location of your birth. While your Sun sign represents your core
              identity and your Moon sign reveals your emotional nature, your Rising sign shapes how the world
              perceives you. It governs your outward personality, physical appearance, social behavior, and the
              first impression you make on others.
            </p>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"#e8e4f0", marginBottom:12 }}>
              Why your birth time is essential
            </h3>
            <p style={{ marginBottom:20 }}>
              The Rising sign changes zodiac signs approximately every two hours as the Earth rotates. This means
              someone born at 6 AM and someone born at 10 AM on the same day in the same city will have completely
              different Rising signs — and therefore different house placements across their entire chart. This is
              why astrologers always ask for your exact birth time, and why a chart without one is considered incomplete.
              Your birth certificate almost always records the time of birth.
            </p>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"#e8e4f0", marginBottom:12 }}>
              Rising sign vs Sun sign
            </h3>
            <p style={{ marginBottom:20 }}>
              Many people find they relate more to their Rising sign than their Sun sign. This makes sense: your
              Rising sign governs how you interact with the world on a daily basis — your social behavior, your
              reactions in new situations, the energy you project in conversations. Your Sun sign represents your
              deeper core self, which may only emerge in private or with people you deeply trust. If you have ever
              read your horoscope and thought &ldquo;that doesn&apos;t sound like me at all,&rdquo; try reading for your
              Rising sign instead.
            </p>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"#e8e4f0", marginBottom:12 }}>
              The Big Three: Sun, Moon, and Rising
            </h3>
            <p style={{ marginBottom:20 }}>
              Together, your Sun, Moon, and Rising signs form your &ldquo;Big Three&rdquo; — the three most important
              placements in your birth chart. Your Sun is who you are. Your Moon is how you feel. Your Rising is how
              you appear. When someone asks &ldquo;what&apos;s your sign?&rdquo; they mean your Sun sign. But astrologers
              know that your Rising sign often tells a more accurate story about how you actually move through the world.
            </p>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"#e8e4f0", marginBottom:12 }}>
              About this calculator
            </h3>
            <p>
              This free Rising sign calculator uses astronomy-engine, a high-precision astronomical computation
              library. It determines the exact ecliptic longitude of the Ascendant point — the intersection of the
              ecliptic with the eastern horizon — based on your birth date, time, and geographic coordinates. The
              result matches professional-grade tools like the Swiss Ephemeris. In addition to your Rising sign,
              this calculator also shows your complete Big Three (Sun, Moon, Rising) and generates a full natal
              chart wheel with all planetary positions, houses, and aspects.
            </p>
          </div>
        </div>
      </section>


      {/* ── REVIEWS ── */}
      <section style={{ padding:"80px 0" }}>
        <div className="rs-c">
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <span style={{ width:22, height:1, background:"#F0B84A" }}/>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"#F0B84A" }}>What people say</span>
          </div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:12 }}>
            People keep sending it<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>to their friends.</em>
          </h2>
          <p style={{ fontSize:15, color:"var(--dim)", maxWidth:440, lineHeight:1.72, marginBottom:36 }}>
            Real responses from our beta readers. Unfiltered, because that&apos;s the whole point.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
            {[
              { text:"I've used Co-Star, The Pattern, Sanctuary... none said anything I didn't already know. This one said things I hadn't told anyone.", name:"Michelle R.", meta:"Scorpio Sun · Cancer Moon · Leo Rising", init:"M" },
              { text:"I was ready to roll my eyes. Three paragraphs in I had to put my phone down. It just... described me. Not my sign. Me.", name:"Rachel T.", meta:"Virgo Rising · Libra Sun · Aries Moon", init:"R" },
              { text:"Way more accurate than Co-Star ever was. And it didn't sugarcoat the parts I wasn't ready to hear.", name:"Sophie K.", meta:"Aries Sun · Pisces Moon · Gemini Rising", init:"S" },
              { text:"I felt attacked. In a good way. My therapist has been saying the same thing for six months. My chart said it better.", name:"Dani L.", meta:"Capricorn Sun · Gemini Moon · Scorpio Rising", init:"D" },
              { text:"Finally astrology that doesn't sound like it was written for everyone and no one at the same time.", name:"Zara O.", meta:"Leo Sun · Scorpio Rising · Aquarius Moon", init:"Z" },
              { text:"Twelve dollars. I spent two hours talking about it with my best friend. That's insane value.", name:"Chloe M.", meta:"Sagittarius Sun · Aquarius Moon · Taurus Rising", init:"C" },
            ].map((r, i) => (
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
            <Link href="/#try-it" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"14px 30px", background:"linear-gradient(135deg,#6b2fd4,#d4537e)", color:"#fff", fontWeight:700, fontSize:14, letterSpacing:"0.04em", textTransform:"uppercase" as const, textDecoration:"none", borderRadius:10 }}>
              Get My Full Reading — $15 ✨
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding:"80px 0" }}>
        <div className="rs-c" style={{ maxWidth:760 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <span style={{ width:22, height:1, background:"#F0B84A" }}/>
            <span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"#F0B84A" }}>Common questions</span>
          </div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:32 }}>
            Rising sign <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>FAQ</em>
          </h2>
          {FAQS.map((f,i) => (
            <details key={i} style={{ borderBottom:"0.5px solid rgba(255,255,255,0.08)" }}>
              <summary style={{ padding:"20px 0", fontSize:15, fontWeight:600, color:"#e8e4f0",
                cursor:"pointer", listStyle:"none", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                {f.q}
                <span style={{ color:"#6b2fd4", fontSize:18, fontWeight:700, flexShrink:0, marginLeft:16 }}>+</span>
              </summary>
              <p style={{ fontSize:14, color:"rgba(232,228,240,0.6)", lineHeight:1.78, paddingBottom:20, paddingRight:40 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ padding:"64px 0", background:"#0d0d18", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
        <div className="rs-c" style={{ textAlign:"center" }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:800, marginBottom:14 }}>
            Your Rising sign is the mask.<br/>
            <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              A full reading shows the face behind it.</em>
          </h2>
          <p style={{ fontSize:14, color:"rgba(232,228,240,0.55)", maxWidth:460, margin:"0 auto 24px", lineHeight:1.72 }}>
            10 brutally honest insights. Venus, Mars, Saturn, houses, aspects — everything your chart says
            about you, in plain language.
          </p>
          <Link href="/#try-it" className="rs-cta" style={{ maxWidth:360 }}>Get My Full Reading · $15 ✦</Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.08)", padding:"36px 0" }}>
        <div className="rs-c" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:16 }}>
          <div>
            <Link href="/" className="rs-logo" style={{ marginBottom:6 }}><span className="g">BluntChart</span></Link>
            <p style={{ fontSize:12, color:"rgba(232,228,240,0.25)", maxWidth:400, lineHeight:1.55, marginTop:8 }}>For entertainment purposes only. Not a substitute for professional advice.</p>
          </div>
          <div style={{ display:"flex", gap:20, fontSize:13 }}>
            <Link href="/free-birth-chart" style={{ color:"rgba(232,228,240,0.35)", textDecoration:"none" }}>Free Birth Chart</Link>
            <Link href="/terms" style={{ color:"rgba(232,228,240,0.35)", textDecoration:"none" }}>Terms</Link>
            <Link href="/privacy" style={{ color:"rgba(232,228,240,0.35)", textDecoration:"none" }}>Privacy</Link>
          </div>
        </div>
      </footer>
    </>
  );
}