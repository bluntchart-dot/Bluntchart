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
  { q: "Is your birthday sign your Rising sign?", a: "No. Your birthday sign is your Sun sign, determined by date alone. Your Rising sign is determined by the time and place you were born. They're two entirely different measurements — the Sun's position tells you where Earth is in its orbit; the Ascendant tells you which direction your birthplace was facing at that minute. They coincide only if you were born close to sunrise (roughly 1 in 12 people)." },
  { q: "How do you calculate your Ascendant manually?", a: "The traditional method uses a Table of Houses: convert your birth time to Local Mean Time (correcting for historical daylight saving), find Sidereal Time at Greenwich for noon on your birth date from an ephemeris, adjust for elapsed time and longitude to get Local Sidereal Time, then look up LST and your latitude in the table. The underlying formula is trigonometric. The calculator above resolves it from a high-precision ephemeris." },
  { q: "Can I find my Rising sign without my birth time?", a: "No — this is the one placement that genuinely cannot be derived without a time. The Ascendant changes signs every 2 hours, so an unknown time means twelve candidates. Anyone offering a Rising sign without birth time is guessing or running a personality quiz. Request the long-form birth certificate; the hospital maternity register often has the time; a rough window from someone present narrows twelve to about four." },
  { q: "What is a chart ruler?", a: "Your chart ruler is the planet that rules your Rising sign — Aries Rising is ruled by Mars, Taurus and Libra by Venus, Cancer by the Moon, Leo by the Sun, Sagittarius by Jupiter, and so on. Its sign, house, and aspects describe the overall trajectory of your life more accurately than almost any single placement." },
  { q: "What is my Descendant sign?", a: "Your Descendant is the sign opposite your Rising — always 180° away, on the western horizon. It's the cusp of your 7th house of partnership, and describes the quality you don't experience as your own and therefore keep meeting in other people. The pattern 'I always attract the same type' is very often the Descendant." },
  { q: "Does my Rising sign affect my appearance?", a: "Traditional astrology says yes; controlled evidence for it doesn't exist. Appearance is genetics. What likely happens is that the Rising sign genuinely governs presentation — posture, expression, mannerism, eye contact — and those things change how a face reads. It's a reasonable framework for the part of appearance that's actually behaviour, not for bone structure." },
  { q: "Which Rising sign is rarest?", a: "It depends on your latitude. Signs don't rise at equal rates: at mid-northern latitudes, Aries, Pisces, Aquarius and Capricorn Rising are genuinely less common, while Libra, Scorpio and Virgo Rising are over-represented. The effect intensifies further north and reverses in the southern hemisphere. Articles claiming a single 'rarest' answer haven't accounted for latitude." },
  { q: "Is any Rising sign the luckiest?", a: "No. The Ascendant alone carries no fortune. Sagittarius and Pisces Rising are Jupiter-ruled by tradition, which is why some claim it — but a Sagittarius Rising with Jupiter in fall in Capricorn, buried in the 12th, is not having an easier life than a Capricorn Rising with a well-placed Saturn. What matters is the condition of your chart ruler." },
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
        .rs-c{max-width:1280px;margin:0 auto;padding:0 40px}
        @media(max-width:768px){.rs-c{padding:0 20px}}
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


      {/* SEO LONG-FORM GUIDE */}
      <section style={{ padding:"80px 0", background:"#0d0d18", borderTop:"1px solid rgba(255,255,255,0.08)" }}>
        <div className="rs-c" style={{ maxWidth:1080 }}>

          <style>{`
            .rs-h2{font-family:var(--font-display);font-size:clamp(1.5rem,3.2vw,2rem);font-weight:800;line-height:1.15;letter-spacing:-0.01em;color:#e8e4f0;margin:0 0 14px}
            .rs-h2 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
            .rs-h3{font-family:var(--font-display);font-size:18px;font-weight:700;color:#e8e4f0;margin:24px 0 10px}
            .rs-p{font-size:15px;color:rgba(232,228,240,0.65);line-height:1.78;margin-bottom:16px}
            .rs-p a{color:#F0B84A;text-decoration:underline;text-decoration-color:rgba(240,184,74,0.35);text-underline-offset:3px}
            .rs-p a:hover{text-decoration-color:#F0B84A}
            .rs-tldr{background:rgba(240,184,74,0.06);border-left:3px solid #F0B84A;border-radius:0 10px 10px 0;padding:16px 20px;margin:0 0 24px}
            .rs-tldr-l{font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#F0B84A;margin-bottom:6px;display:block}
            .rs-tldr-t{font-size:15px;color:#e8e4f0;line-height:1.65}
            .rs-block{margin-bottom:56px}
            .rs-list{margin:0 0 16px 0;padding-left:22px}
            .rs-list li{font-size:15px;color:rgba(232,228,240,0.65);line-height:1.7;margin-bottom:8px}
            .rs-list li strong{color:#e8e4f0;font-weight:600}
            .rs-table-wrap{overflow-x:auto;margin:8px 0 24px;-webkit-overflow-scrolling:touch}
            .rs-table{width:100%;border-collapse:collapse;font-size:14px;min-width:420px}
            .rs-table th,.rs-table td{padding:10px 14px;text-align:left;border-bottom:0.5px solid rgba(255,255,255,0.06);color:rgba(232,228,240,0.7);line-height:1.5}
            .rs-table th{color:#F0B84A;font-weight:700;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;background:rgba(255,255,255,0.02)}
            .rs-table td:first-child{color:#e8e4f0;font-weight:600;white-space:nowrap}
            .rs-formula{background:rgba(255,255,255,0.03);border-left:2px solid rgba(240,184,74,0.4);padding:14px 18px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:13px;color:rgba(232,228,240,0.7);line-height:1.7;border-radius:0 6px 6px 0;margin-bottom:14px;overflow-x:auto}
          `}</style>

          {/* Is birthday sign my Rising sign */}
          <div className="rs-block">
            <h2 className="rs-h2">Is your birthday sign <em>your Rising sign?</em></h2>
            <div className="rs-tldr">
              <span className="rs-tldr-l">Short answer</span>
              <p className="rs-tldr-t">No. Your birthday sign is your Sun sign, determined by date alone. Your Rising sign is determined by the time and place you were born — it&apos;s the zodiac sign that was climbing over the eastern horizon at that exact moment. They&apos;re two entirely different measurements. Two people born on the same day in the same hospital, four hours apart, share a Sun sign and have completely different Rising signs.</p>
            </div>
            <p className="rs-p">This is the most common misunderstanding in beginner astrology, so it&apos;s worth being precise about it.</p>
            <p className="rs-p">Your <strong style={{ color:"#e8e4f0" }}>birthday sign</strong> is your Sun sign. It&apos;s determined by the date alone, because the Sun takes about a month to move through each zodiac sign. When someone asks &ldquo;what&apos;s your sign?&rdquo;, this is what they mean.</p>
            <p className="rs-p">Your <strong style={{ color:"#e8e4f0" }}>Rising sign</strong> is determined by the time and place you were born, not the date. It&apos;s the zodiac sign that was climbing over the eastern horizon at that exact moment.</p>
            <p className="rs-p">They&apos;re two entirely different measurements. The Sun&apos;s position tells you where Earth is in its orbit. The Ascendant tells you which direction your birthplace was facing at that minute. Two people born on the same day in the same hospital, four hours apart, share a Sun sign and have completely different Rising signs — and therefore completely different house structures across their entire charts. They coincide only if you were born close to sunrise, which puts the Sun on the eastern horizon by definition. That&apos;s roughly 1 in 12 people.</p>
          </div>

          {/* How to calculate Ascendant manually */}
          <div className="rs-block">
            <h2 className="rs-h2">How do you calculate your <em>Ascendant manually?</em></h2>
            <div className="rs-tldr">
              <span className="rs-tldr-l">Short answer</span>
              <p className="rs-tldr-t">You don&apos;t need to, but the mechanism is worth understanding. Your Ascendant is the degree of the ecliptic crossing the eastern horizon at your birth moment, seen from your birth coordinates. The traditional method uses a Table of Houses with Local Sidereal Time and latitude; the underlying formula is trigonometric. The calculator above resolves it directly from a high-precision ephemeris.</p>
            </div>
            <p className="rs-p"><strong style={{ color:"#e8e4f0" }}>The concept.</strong> The ecliptic — the Sun&apos;s apparent annual path, which is also the line the zodiac sits on — is tilted about 23.4° relative to Earth&apos;s equator. As Earth rotates once every 24 hours, that tilted circle appears to sweep past your local horizon. Your Ascendant is simply the degree of the ecliptic that is crossing the eastern horizon at your birth moment, seen from your birth coordinates. Because the whole zodiac passes over in 24 hours, all twelve signs rise in a single day — roughly two hours each.</p>
            <h3 className="rs-h3">The traditional manual method (Table of Houses)</h3>
            <ol className="rs-list">
              <li><strong>Convert your birth time to Local Mean Time</strong>, correcting for time zone and any daylight saving in force on that date.</li>
              <li><strong>Find the Sidereal Time at Greenwich</strong> for noon on your birth date, from an ephemeris.</li>
              <li><strong>Adjust for your birth time</strong> — add roughly 10 seconds of sidereal time per hour elapsed.</li>
              <li><strong>Adjust for your longitude</strong> — 4 minutes of time per degree east or west of Greenwich.</li>
              <li>That gives you <strong>Local Sidereal Time (LST)</strong>.</li>
              <li><strong>Look up your LST and your latitude</strong> in a Table of Houses. The intersection gives you the Ascendant degree and sign.</li>
            </ol>
            <h3 className="rs-h3">The underlying formula</h3>
            <div className="rs-formula">tan(ASC) = cos(LST) / −(sin(LST) × cos(ε) + tan(φ) × sin(ε))<br/><br/>where LST = Local Sidereal Time, ε = obliquity of the ecliptic (~23.44°), φ = geographic latitude.</div>
            <p className="rs-p"><strong style={{ color:"#e8e4f0" }}>Why we don&apos;t ask you to do this:</strong> the table method requires interpolation between latitude bands and small errors compound quickly. The formula is exact but needs the correct historical time zone offset, which is where most manual attempts go wrong — daylight saving rules have changed repeatedly, and using today&apos;s offset for a 1987 birth produces a systematically wrong answer.</p>
            <p className="rs-p">The calculator above resolves the ecliptic longitude of the ascending point directly from a high-precision ephemeris, using the historical offset for your specific birth date and location. But the mechanism is exactly the one described here — no black box, just arithmetic done properly.</p>
          </div>

          {/* Chart ruler */}
          <div className="rs-block">
            <h2 className="rs-h2">What is your <em>chart ruler?</em></h2>
            <div className="rs-tldr">
              <span className="rs-tldr-l">Short answer</span>
              <p className="rs-tldr-t">Your chart ruler is the planet that rules your Rising sign — it&apos;s the most useful thing your Rising sign gives you and almost no free calculator mentions it. Wherever that planet sits — its sign, its house, its aspects — describes the overall trajectory of your life more accurately than almost any single placement.</p>
            </div>
            <div className="rs-table-wrap">
              <table className="rs-table">
                <thead><tr><th>Rising sign</th><th>Chart ruler (modern)</th><th>Traditional ruler</th></tr></thead>
                <tbody>
                  <tr><td>Aries</td><td>Mars</td><td>Mars</td></tr>
                  <tr><td>Taurus</td><td>Venus</td><td>Venus</td></tr>
                  <tr><td>Gemini</td><td>Mercury</td><td>Mercury</td></tr>
                  <tr><td>Cancer</td><td>Moon</td><td>Moon</td></tr>
                  <tr><td>Leo</td><td>Sun</td><td>Sun</td></tr>
                  <tr><td>Virgo</td><td>Mercury</td><td>Mercury</td></tr>
                  <tr><td>Libra</td><td>Venus</td><td>Venus</td></tr>
                  <tr><td>Scorpio</td><td>Pluto</td><td>Mars</td></tr>
                  <tr><td>Sagittarius</td><td>Jupiter</td><td>Jupiter</td></tr>
                  <tr><td>Capricorn</td><td>Saturn</td><td>Saturn</td></tr>
                  <tr><td>Aquarius</td><td>Uranus</td><td>Saturn</td></tr>
                  <tr><td>Pisces</td><td>Neptune</td><td>Jupiter</td></tr>
                </tbody>
              </table>
            </div>
            <p className="rs-p"><strong style={{ color:"#e8e4f0" }}>How to use it:</strong> find your chart ruler in your <Link href="/free-birth-chart">birth chart</Link>, and read the house it&apos;s in. That house is where your life story concentrates.</p>
            <p className="rs-p">Scorpio Rising with Mars in the 9th house builds a life around travel, belief, or the pursuit of meaning — usually confrontationally. Scorpio Rising with Mars in the 4th builds it around family and home, often around a conflict there that took decades to resolve. Same Rising sign, same intensity, entirely different life.</p>
          </div>

          {/* Descendant */}
          <div className="rs-block">
            <h2 className="rs-h2">What is the <em>Descendant sign?</em></h2>
            <div className="rs-tldr">
              <span className="rs-tldr-l">Short answer</span>
              <p className="rs-tldr-t">Your Descendant is your Ascendant&apos;s opposite point — 180° away, on the western horizon, the cusp of your 7th house of partnership. It describes the quality you don&apos;t experience as your own, and therefore keep meeting in other people. The pattern &ldquo;I always attract the same type&rdquo; is very often the Descendant.</p>
            </div>
            <p className="rs-p">Your Descendant sign is always the sign opposite your Rising sign: Aries Rising has a Libra Descendant, Taurus Rising has Scorpio, and so on.</p>
            <p className="rs-p">What it describes is the quality you don&apos;t experience as your own, and therefore keep meeting in other people. Aries Rising — direct, self-starting, impatient — has a Libra Descendant and repeatedly ends up with diplomatic, balance-seeking, indecisive partners. Capricorn Rising, guarded and self-sufficient, has a Cancer Descendant and keeps attracting people who want emotional closeness they find difficult to reciprocate.</p>
            <p className="rs-p">The pattern people describe as &ldquo;I always attract the same type&rdquo; is very often the Descendant. It&apos;s not a curse. It&apos;s the half of the axis you outsourced. If that pattern rings true, the full breakdown is here: <Link href="/why-you-attract-the-wrong-person">why do I attract emotionally unavailable people?</Link></p>
          </div>

          {/* Appearance */}
          <div className="rs-block">
            <h2 className="rs-h2">Does your Rising sign <em>affect your appearance?</em></h2>
            <div className="rs-tldr">
              <span className="rs-tldr-l">Short answer</span>
              <p className="rs-tldr-t">Traditional astrology says yes; the honest assessment is that there&apos;s no controlled evidence for it, and appearance is genetics. What is likely happening is that the Rising sign genuinely governs presentation — posture, expression, mannerism, eye contact — and those things change how a face reads. The Rising sign probably doesn&apos;t determine your bone structure. It&apos;s a reasonable framework for the part of appearance that&apos;s actually behaviour.</p>
            </div>
            <p className="rs-p">The traditional attributions are consistent across centuries of texts: Aries Rising with sharp features and a forward-leaning posture; Taurus Rising with a fuller, softer face and a distinctive voice; Leo Rising with notable hair and an upright carriage; Scorpio Rising with an intense, fixed gaze; Pisces Rising with soft, slightly unfocused eyes.</p>
            <p className="rs-p"><strong style={{ color:"#e8e4f0" }}>The honest assessment: there is no controlled evidence for this, and the mechanism by which it would work doesn&apos;t exist.</strong> Appearance is genetics. Studies looking for correlations between birth data and physical traits haven&apos;t found them.</p>
            <p className="rs-p">What is likely happening is a combination of two things. First, these descriptions are loose enough to fit a wide range of faces — &ldquo;sharp features&rdquo; applies to a lot of people. Second, and more interestingly, the Rising sign is genuinely about <em>presentation</em> — posture, expression, mannerism, how much space you take up, how quickly you make eye contact. Those things are behavioural, they&apos;re highly visible, and they change how a face reads. Someone who carries themselves with Leo Rising confidence looks different from someone who doesn&apos;t, and no genetics are required for that.</p>
          </div>

          {/* Rarest / luckiest */}
          <div className="rs-block">
            <h2 className="rs-h2">Which Rising sign is <em>rarest? And which is luckiest?</em></h2>
            <div className="rs-tldr">
              <span className="rs-tldr-l">Short answer</span>
              <p className="rs-tldr-t">On rarity: signs don&apos;t rise at equal rates, and the effect depends on your latitude. In the northern hemisphere, Aries, Pisces, Aquarius and Capricorn Rising are genuinely less common; Libra, Scorpio and Virgo Rising are over-represented. The effect reverses in the southern hemisphere. On luck: there isn&apos;t a luckiest Rising sign — the Ascendant alone carries no fortune. What matters is the condition of your chart ruler.</p>
            </div>
            <p className="rs-p"><strong style={{ color:"#e8e4f0" }}>On rarity — there&apos;s a real astronomical answer, and it&apos;s more interesting than the usual one.</strong> Signs do not rise at equal rates. Because the ecliptic is tilted relative to the celestial equator, some signs cross the horizon quickly and others slowly, and the effect depends entirely on your latitude.</p>
            <p className="rs-p">At mid-northern latitudes, the signs from Cancer through Sagittarius are signs of <em>long ascension</em>: they take considerably more than two hours to rise. Capricorn through Gemini are signs of <em>short ascension</em> and rise fast. At 50°N, Libra can take over three hours to clear the horizon while Aries takes barely one.</p>
            <p className="rs-p">The practical consequence: at northern latitudes, <strong style={{ color:"#e8e4f0" }}>Aries, Pisces, Aquarius and Capricorn Rising are genuinely less common</strong>, and Libra, Scorpio and Virgo Rising are over-represented. The effect intensifies further north and reverses in the southern hemisphere. In Australia or Argentina the rare Rising signs are the opposite set.</p>
            <p className="rs-p">So the honest answer to &ldquo;what&apos;s the rarest Rising sign&rdquo; is: it depends where you were born, and most articles claiming to answer it have not accounted for that at all.</p>
            <p className="rs-p"><strong style={{ color:"#e8e4f0" }}>On luck — there isn&apos;t a luckiest Rising sign.</strong> The traditional idea is that Sagittarius and Pisces Rising are Jupiter-ruled, and Jupiter is the classical benefic associated with expansion and good fortune. But the Ascendant on its own carries no fortune. What matters is the condition of your chart ruler — is it well-placed in a sign it functions well in, angular, and receiving supportive aspects? A Sagittarius Rising with Jupiter in Capricorn (its sign of fall), buried in the 12th house and squared by Saturn, is not having an easier life than a Capricorn Rising with a well-placed Saturn.</p>
          </div>

          {/* Without birth time */}
          <div className="rs-block">
            <h2 className="rs-h2">What if your birth time is <em>wrong or unknown?</em></h2>
            <div className="rs-tldr">
              <span className="rs-tldr-l">Short answer</span>
              <p className="rs-tldr-t">The Rising sign is the one placement that genuinely cannot be derived without a time. Request the long-form birth certificate; ask the hospital records department; ask anyone who was present for a rough window. If you have an approximate time, run the calculator at both ends — if the Rising sign is the same at both, you have your answer with certainty regardless of the imprecision.</p>
            </div>
            <p className="rs-p"><strong style={{ color:"#e8e4f0" }}>If you have no time at all:</strong></p>
            <ul className="rs-list">
              <li>Request the <strong>long-form</strong> birth certificate. Short-form versions usually omit the time; long-form usually includes it.</li>
              <li>Outside the US, the certificate often won&apos;t have it — but the <strong>hospital maternity register</strong> frequently does. Records departments will usually search on request.</li>
              <li>Ask anyone who was present. A rough window is enormously useful: &ldquo;before breakfast&rdquo; reduces twelve possibilities to about two.</li>
              <li>Check baby books, birth announcements, and local newspaper birth listings.</li>
            </ul>
            <p className="rs-p"><strong style={{ color:"#e8e4f0" }}>If you have an approximate time:</strong> run the calculator at both ends of your window. If the Rising sign is the same at both, you have your answer with certainty regardless of the imprecision. If it differs, you have two candidates and you can read both.</p>
            <p className="rs-p"><strong style={{ color:"#e8e4f0" }}>If your recorded time might be wrong:</strong> hospital-recorded times are often rounded to the nearest five or fifteen minutes, and occasionally record the time the paperwork was completed rather than the birth. A five-minute error is almost never material. It matters only if your Ascendant sits within a degree or two of a sign boundary — and the calculator above will show you your exact Ascendant degree, so you can check.</p>
            <p className="rs-p"><strong style={{ color:"#e8e4f0" }}>A note on rectification:</strong> birth time rectification works backwards from documented life events to estimate an unknown time. It&apos;s legitimate but interpretive, not astronomical — treat the result as a well-reasoned hypothesis, not a fact.</p>
          </div>

          {/* Next steps */}
          <div className="rs-block">
            <h2 className="rs-h2">Next <em>steps</em></h2>
            <ul className="rs-list">
              <li><Link href="/moon-sign-calculator"><strong>Moon sign calculator</strong></Link> — how you feel, versus how you appear.</li>
              <li><Link href="/big-three-calculator"><strong>Big Three calculator</strong></Link> — Sun, Moon and Rising together.</li>
              <li><Link href="/free-birth-chart"><strong>Free birth chart</strong></Link> — the full wheel, including your chart ruler&apos;s house.</li>
              <li><Link href="/natal-chart"><strong>How to read a natal chart</strong></Link> — the complete step-by-step guide.</li>
              <li><Link href="/zodiac-signs"><strong>All 12 zodiac signs</strong></Link> — traits for every Rising sign.</li>
            </ul>
            <p className="rs-p"><Link href="/#try-it"><strong>Your Rising sign is the mask. A full reading shows the face behind it →</strong></Link></p>
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
        <div className="rs-c" style={{ maxWidth:900 }}>
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
</>
  );
}