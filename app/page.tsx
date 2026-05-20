"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { PreviewReadingStage } from "@/components/PreviewReadingStage";
import { calculateChart } from "@/lib/chart-calculator";
import { geocodeBirthPlace } from "@/lib/geocode-client";
import { normalizeReadingCopy } from "@/lib/normalize-reading-copy";
import { buildGumroadCheckoutUrl } from "@/lib/gumroad-checkout";
import { persistCheckoutSession } from "@/lib/checkout-session";
import type { BirthData } from "@/lib/types";

// ─── TYPES ─────────────────────────────────────────────────────────────────────

interface Insight {
  planet: string;
  colorKey?: string;
  truth: string;
  explain?: string;
  action?: string;
}
// Preview: 2 insights only. Chart wheel, 8 paid beats + share card come after payment (webhook email).
interface ReadingData {
  preview: Insight[];
  letter_opener?: string;
}

// ─── STATIC DATA ───────────────────────────────────────────────────────────────

const REVIEWS = [
  { text: "I've used Co-Star, The Pattern, Sanctuary... none said anything I didn't already know. This one said things I hadn't told anyone. It was uncomfortable. I loved it.", name: "Michelle R.", meta: "Scorpio Sun, Cancer Moon", init: "M" },
  { text: "I was ready to roll my eyes. Three paragraphs in I had to put my phone down. It just... described me. Not my sign. Me.", name: "Rachel T.", meta: "Virgo Rising, Libra Sun", init: "R" },
  { text: "Way more accurate than Co-Star ever was. And it didn't sugarcoat the parts I wasn't ready to hear, which is the whole point.", name: "Sophie K.", meta: "Aries Sun, Pisces Moon", init: "S" },
  { text: "I felt attacked. In a good way. My therapist has been saying the same thing for six months. My birth chart said it better in one paragraph.", name: "Dani L.", meta: "Capricorn Sun, Gemini Moon", init: "D" },
  { text: "Finally astrology that doesn't sound like it was written for everyone and no one at the same time. Sent it to three friends immediately.", name: "Zara O.", meta: "Leo Sun, Scorpio Rising", init: "Z" },
  { text: "Twelve dollars. I spent two hours talking about it with my best friend. That's insane value.", name: "Chloe M.", meta: "Sagittarius Sun, Aquarius Moon", init: "C" },
];

const REVEALS = [
  { num: "01", title: "Why you attract the same type of people", body: "Your Venus placement, 7th house, and nodal axis spell out the exact pattern and why you keep repeating it." },
  { num: "02", title: "Why you procrastinate when it matters most", body: "Your chart shows the specific fear driving it. It's not laziness. It has never been laziness." },
  { num: "03", title: "What people assume about you instantly", body: "Your Rising sign is the mask you wear without knowing it. Most people never meet the real you." },
  { num: "04", title: "Your emotional triggers, mapped precisely", body: "Moon sign, 4th house, and Saturn's position tell us exactly where you're most raw and why certain things hit harder than they should." },
  { num: "05", title: "Where your real confidence comes from", body: "Not the kind you perform. The kind that actually holds. Your Sun and Mars placement show the difference." },
  { num: "06", title: "What your chart is screaming right now", body: "Current transits to your natal placements. The tension you're feeling isn't random. It's your chart, on schedule." },
];

const UPCOMING = [
  { badge: "Coming Soon", title: "Compatibility Reading", desc: "You and a partner, friend, or situationship. Brutally honest about the real tension points and why you keep having the same fight.", price: "$9" },
  { badge: "Coming Soon", title: "Year Ahead Reading", desc: "What your chart says about the next 12 months. Love, money, career, major turning points.", price: "$18" },
  { badge: "Coming Soon", title: "Gift a Reading", desc: "Buy for someone else. Birthday, bachelorette, just because. Delivered to their email with a gift message.", price: "$15" },
];

const COMPARISON = [
  { feature: "Based on your exact birth time", us: true, them: "Limited" },
  { feature: "High-precision ephemeris (Astronomy Engine)", us: true, them: "Limited" },
  { feature: "Personalised written reading",   us: true, them: false },
  { feature: "Brutally honest tone",           us: true, them: false },
  { feature: "One-time payment",               us: true, them: "Subscription" },
  { feature: "Shareable identity card",        us: true, them: false },
  { feature: "~1,500 words specific to you",   us: true, them: false },
  { feature: "Free preview before you pay",    us: true, them: false },
];

const FAQS = [
  { q: "Do I need to know my exact birth time?", a: "Yes and here's why it matters. Your birth time determines your Rising sign and all 12 house placements. Without it, we can still do a reading, but you'll miss the layer that makes it feel eerily personal. Your birth certificate almost always has it. If you genuinely can't find it, use 12:00 noon and we'll note where the reading may be less precise." },
  { q: "Is this actually based on my chart or just my Sun sign?", a: "It's based on your full natal chart. Sun, Moon, Rising, Venus, Mars, Mercury, Saturn, Jupiter, plus the house positions and aspects between them. Planet positions use a high-precision ephemeris (Astronomy Engine), the same library-grade solar system model used in serious astronomy software. Your Sun sign is one of dozens of data points we use." },
  { q: "How is this different from Co-Star or The Pattern?", a: "Co-Star gives you daily notifications and brief, often cryptic text. The Pattern gives you broad personality archetypes. BluntChart gives you one deep, specific reading around 1,500 words written to your exact placements, in plain language, with a tone that doesn't soften what the chart actually says. It's not a daily app. It's a mirror." },
  { q: "Can I get a refund if I don't like the reading?", a: "Because this is a personalized digital product generated instantly for you, we don't offer refunds after delivery. This is standard for custom digital goods. If something breaks or fails to generate, we'll fix it or refund immediately." },
  { q: "Is the reading AI-generated? Will it feel robotic?", a: "It's generated using AI, but the system behind it was built specifically to interpret your exact birth chart in a way that feels human, not generic. It's designed to sound like a brutally honest friend who actually understands you, not a horoscope app. The goal is simple. You read it and think how did it know that. Most people do." },
  { q: "Is this for entertainment or is it real?", a: "Both, honestly. Astrology is not science and we're clear about that. But the psychological patterns that good astrology surfaces are real. The reading is designed to make you think, not to predict your future. If it makes you more self-aware, that's real value regardless of how you feel about the stars." },
  { q: "Will my birth data be stored or sold?", a: "Your birth data is used solely to generate your reading. We don't sell it, share it with third parties, or use it for advertising. You can request deletion any time. Full details in our Privacy Policy." },
];

const PLANET_CREDENTIALS = [
  { icon: "☉", label: "Sun sign", desc: "Your core identity and ego expression" },
  { icon: "☽", label: "Moon sign", desc: "Your emotional wiring and hidden needs" },
  { icon: "↑",  label: "Rising sign", desc: "How others perceive you. Needs exact birth time." },
  { icon: "♀", label: "Venus placement", desc: "Why you attract who you attract" },
  { icon: "♂", label: "Mars placement", desc: "Where your energy goes and how you fight" },
  { icon: "♄", label: "Saturn lessons", desc: "The thing your chart keeps making you confront" },
];

// Hardcoded teasers shown in the lock wall — no API call needed for these
const LOCKED_TEASERS = [
  "Venus: why you attract who you attract, and why you keep repeating the pattern",
  "Mars: where your energy actually goes vs where you think it goes",
  "Rising: the version of you the world meets before you say a word",
  "Jupiter: where your luck lives and why you keep looking in the wrong place",
  "Mercury: why your brain works the way it does and how it trips you up",
  "Your self-sabotage pattern: named and mapped from your exact chart",
  "The 12th house shadow: what you hide from everyone including yourself",
  "Your core life pattern: the one your chart has been pointing to for years",
];

const LOADING_MSGS = ["Reading the stars…","Consulting your planets…","Finding your truth…","Almost there…"];

// ─── STYLE HELPERS ─────────────────────────────────────────────────────────────

const inp: React.CSSProperties = {
  width:"100%", background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(255,255,255,0.1)",
  borderRadius:10, padding:"13px 14px", fontSize:14, color:"#e8e4f0", fontFamily:"inherit", outline:"none",
};
const lbl: React.CSSProperties = {
  display:"block", fontSize:11, fontWeight:600, color:"#6b6585",
  letterSpacing:"1.2px", textTransform:"uppercase", marginBottom:6,
};

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:32 }}>
      <span style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.06)", display:"block" }}/>
      <span style={{ fontSize:10, fontWeight:700, letterSpacing:"2.5px",
        textTransform:"uppercase" as const, color:"#3a3858", whiteSpace:"nowrap" }}>
        {label}
      </span>
      <span style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.06)", display:"block" }}/>
    </div>
  );
}

// ─── READING APP ───────────────────────────────────────────────────────────────

function ReadingApp({ onResultChange }: { onResultChange?: (v: boolean) => void }) {
  const [screen, setScreen]   = useState<"form"|"loading"|"result">("form");
  const [fname,  setFname]    = useState("");
  const [email,  setEmail]    = useState("");   // NEW — collected with birth details
  const [dob,    setDob]      = useState("");
  const [btime,  setBtime]    = useState("");
  const [city,   setCity]     = useState("");
  const [err,    setErr]      = useState("");
  const [loadMsg, setLoadMsg] = useState(LOADING_MSGS[0]);
  const [data,   setData]     = useState<ReadingData|null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const msgIdx = useRef(0);
  const rotTimer = useRef<ReturnType<typeof setInterval>|null>(null);

  // Keep session_id stable if user refreshes on the preview screen
  useEffect(() => {
    if (sessionId) return;
    try {
      const raw = localStorage.getItem("bluntchart_session");
      if (!raw) return;
      const saved = JSON.parse(raw) as { sessionId?: string };
      if (saved.sessionId) setSessionId(saved.sessionId);
    } catch {
      /* ignore corrupt storage */
    }
  }, [sessionId]);

  const startRot = () => {
    rotTimer.current = setInterval(() => {
      msgIdx.current = (msgIdx.current + 1) % LOADING_MSGS.length;
      setLoadMsg(LOADING_MSGS[msgIdx.current]);
    }, 2000);
  };
  const stopRot = () => { if (rotTimer.current) clearInterval(rotTimer.current); };

  // ── Submit: save lead → generate preview (Haiku, ~$0.003) ────────────────
  const submit = async () => {
    if (!fname.trim() || !email.trim() || !dob || !city.trim()) {
      setErr("Please fill in your name, email, date of birth, and city."); return;
    }
    if (!btime) {
      setErr("Exact birth time is needed for your Rising sign. Check your birth certificate."); return;
    }
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRx.test(email.trim())) {
      setErr("Please enter a valid email address."); return;
    }

    setErr(""); setScreen("loading"); startRot();

    const normalizedEmail = email.trim().toLowerCase();

    // Save checkout to Supabase (users + payments pending + abandoned_checkouts)
    let checkoutSessionId: string | null = null;
    try {
      const saveRes = await fetch("/api/save-pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fname.trim(),
          email: normalizedEmail,
          dob,
          birth_time: btime,
          city: city.trim(),
        }),
      });
      const saveText = await saveRes.text();
      let saveJson: {
        success?: boolean;
        error?: string;
        sessionId?: string;
      } = {};
      try {
        saveJson = saveText ? JSON.parse(saveText) : {};
      } catch {
        console.error("[checkout] save-pending non-JSON:", saveText.slice(0, 200));
      }
      if (!saveRes.ok || !saveJson.success) {
        console.error("[checkout] save-pending failed:", saveJson, saveRes.status);
        throw new Error(
          saveJson.error || `Could not save your details (${saveRes.status}). Please try again.`
        );
      }
      checkoutSessionId = saveJson.sessionId ?? null;
      setSessionId(checkoutSessionId);
    } catch (saveErr) {
      stopRot();
      setScreen("form");
      setErr((saveErr as Error).message);
      return;
    }

    // Geocode + ephemeris chart → chart-synthesized preview (claude-prompt.ts)
    try {
      const geo = await geocodeBirthPlace(city.trim());
      if (!geo) {
        throw new Error(
          "Could not locate your birth city. Try adding country (e.g. Mumbai, India)."
        );
      }

      const birth: BirthData = {
        name: fname.trim(),
        date: dob,
        time: btime,
        lat: geo.lat,
        lng: geo.lng,
        timezone: geo.timezone,
        placeName: city.trim(),
      };

      const chartData = calculateChart(birth);

      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "preview",
          birth,
          chartData,
          insight: {},
        }),
      });
      stopRot();

      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || `Server error ${res.status}`);
      }

      const result = await res.json();

      if (!result.success || !result.data) {
        throw new Error(result.error || "Invalid reading response");
      }

      const raw = result.data as ReadingData & {
        preview?: Insight[];
        letter_opener?: string;
      };
      const previewList = (Array.isArray(raw.preview) ? raw.preview : [])
        .slice(0, 2)
        .map((ins) => ({
          ...ins,
          truth: normalizeReadingCopy(ins.truth ?? ""),
          explain: ins.explain ? normalizeReadingCopy(ins.explain) : "",
        }));
      const letterOpener =
        typeof raw.letter_opener === "string"
          ? normalizeReadingCopy(raw.letter_opener)
          : "";

      const parsed: ReadingData = {
        preview: previewList,
        ...(letterOpener ? { letter_opener: letterOpener } : {}),
      };

      if (parsed.preview.length === 0) {
        throw new Error("No preview generated");
      }

      setData(parsed);
      setScreen("result");
      onResultChange?.(true);

      fetch("/api/checkout/step", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          step: "preview_generated",
        }),
      }).catch((e) => console.warn("[checkout] step update failed:", e));

      try {
        localStorage.setItem(
          "bluntchart_session",
          JSON.stringify({
            fname: fname.trim(),
            email: normalizedEmail,
            dob,
            btime,
            city: city.trim(),
            preview: parsed.preview,
            letter_opener: parsed.letter_opener,
            sessionId: checkoutSessionId,
            previewSource: "chart",
          })
        );
      } catch { /* ignore */ }

    } catch (e) {
      stopRot();
      setScreen("form");
      setErr("Something went wrong. Please try again. (" + (e as Error).message + ")");
    }
  };

  // ── Unlock: direct Gumroad checkout (wanted=true); session_id links webhook ─
  const handleUnlock = () => {
    const normalizedEmail = email.trim().toLowerCase();
    let checkoutSessionId = sessionId;

    if (!checkoutSessionId) {
      try {
        const raw = localStorage.getItem("bluntchart_session");
        if (raw) {
          checkoutSessionId =
            (JSON.parse(raw) as { sessionId?: string }).sessionId ?? null;
        }
      } catch {
        /* ignore */
      }
    }

    if (!checkoutSessionId) {
      console.error("[checkout] pay clicked without session_id");
      setErr("Checkout session expired. Submit the form again to continue.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setErr("");

    fetch("/api/checkout/step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail, step: "clicked_pay" }),
    }).catch((e) => console.warn("[checkout] clicked_pay step failed:", e));

    const checkoutUrl = buildGumroadCheckoutUrl({
      email: normalizedEmail,
      sessionId: checkoutSessionId,
    });

    persistCheckoutSession(checkoutSessionId, normalizedEmail);

    console.log("[checkout] redirecting to Gumroad direct checkout", {
      sessionId: checkoutSessionId,
    });
    window.location.href = checkoutUrl;
  };

  const reset = () => {
    setScreen("form"); setData(null); setSessionId(null);
    setFname(""); setEmail(""); setDob(""); setBtime(""); setCity(""); setErr("");
    onResultChange?.(false);
  };

  // ── FORM ────────────────────────────────────────────────────────────────────
  if (screen === "form") return (
    <div style={{ maxWidth:640, margin:"0 auto", width:"100%" }}>
      {err && (
        <div style={{ background:"rgba(212,83,126,0.08)", border:"0.5px solid rgba(212,83,126,0.3)",
          borderRadius:10, padding:"11px 14px", fontSize:13, color:"#f0a0b8", marginBottom:14 }}>
          {err}
        </div>
      )}
      <div style={{ background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(255,255,255,0.08)",
        borderRadius:18, padding:32 }}>
        <div style={{ fontFamily:"var(--font-display)", fontSize:22, marginBottom:6, color:"#e8e4f0" }}>
          Get your free preview
        </div>
        <div style={{ fontSize:13, color:"#6b6585", lineHeight:1.6, marginBottom:28 }}>
          Your exact birth time is what makes this specific to you, not just anyone born that day.
        </div>

        {/* Name + Email row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
          <div>
            <label style={lbl}>First name</label>
            <input value={fname} onChange={e=>setFname(e.target.value)} placeholder="e.g. Sarah" style={inp}/>
          </div>
          <div>
            <label style={lbl}>Email address</label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="you@email.com" style={inp}/>
            <small style={{ fontSize:11, color:"#3a3858", marginTop:4, display:"block" }}>
              Your reading is sent here after payment
            </small>
          </div>
        </div>

        {/* DOB + Time row */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
          <div>
            <label style={lbl}>Date of birth</label>
            <input type="date" value={dob} onChange={e=>setDob(e.target.value)} style={inp}/>
          </div>
          <div>
            <label style={lbl}>Time of birth</label>
            <input type="time" value={btime} onChange={e=>setBtime(e.target.value)} style={inp}/>
            <small style={{ fontSize:11, color:"#3a3858", marginTop:4, display:"block" }}>
              From birth certificate
            </small>
          </div>
        </div>

        {/* City */}
        <div style={{ marginBottom:24 }}>
          <label style={lbl}>City &amp; country of birth</label>
          <input value={city} onChange={e=>setCity(e.target.value)}
            placeholder="e.g. New York, USA or London, UK" style={inp}/>
        </div>

        <button onClick={submit} style={{ width:"100%",
          background:"linear-gradient(135deg,#6b2fd4,#d4537e)", color:"#fff", border:"none",
          borderRadius:12, padding:"16px 20px", fontSize:15, fontWeight:600,
          fontFamily:"inherit", cursor:"pointer", letterSpacing:"0.2px" }}>
          Read my chart — free preview ✨
        </button>
      </div>
      <div style={{ fontSize:11, color:"#2e2c3e", textAlign:"center", marginTop:14 }}>
        For entertainment purposes only · Not professional advice
      </div>
    </div>
  );

  // ── LOADING ──────────────────────────────────────────────────────────────────
  if (screen === "loading") return (
    <div style={{ textAlign:"center", padding:"80px 0" }}>
      <span style={{ fontSize:60, display:"block", animation:"bob 1.8s ease-in-out infinite" }}>🌙</span>
      <div style={{ fontFamily:"var(--font-display)", fontSize:22, margin:"16px 0 8px", color:"#e8e4f0" }}>
        {loadMsg}
      </div>
      <div style={{ fontSize:13, color:"#4a4560" }}>Calculating your chart and writing your preview…</div>
    </div>
  );

  // ── RESULT ───────────────────────────────────────────────────────────────────
  if (screen === "result" && data) {
    const { preview } = data;

    return (
      <div className="reading-stage">
        {err && (
          <div style={{ background:"rgba(212,83,126,0.08)", border:"0.5px solid rgba(212,83,126,0.3)",
            borderRadius:10, padding:"11px 14px", fontSize:13, color:"#f0a0b8", marginBottom:14 }}>
            {err}
          </div>
        )}
        <SectionDivider label="Free preview · 2 of 10" />
        <p style={{ textAlign:"center", fontSize:15, color:"rgba(232,228,240,0.48)",
          marginBottom:28, fontFamily:"var(--font-display)", fontStyle:"italic", lineHeight:1.65,
          maxWidth:560, marginLeft:"auto", marginRight:"auto" }}>
          Your real placements. Two truths your chart wanted you to hear before you unlock the rest.
        </p>
        <PreviewReadingStage
          fname={fname}
          preview={preview}
          letterOpener={data.letter_opener}
        />

        {/* ── LOCK WALL ── */}
        <div style={{ background:"rgba(255,255,255,0.02)", border:"0.5px solid rgba(255,255,255,0.06)",
          borderRadius:20, overflow:"hidden", marginBottom:28 }}>
          <div style={{ padding:"8px 0", position:"relative" }}>
            {LOCKED_TEASERS.map((l, i) => (
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12,
                padding:"14px 28px",
                borderBottom: i < LOCKED_TEASERS.length-1 ? "0.5px solid rgba(255,255,255,0.05)" : "none",
                filter: i >= 4 ? "blur(3px)" : "none" }}>
                <div style={{ width:7, height:7, borderRadius:"50%",
                  background:"rgba(107,47,212,0.45)", flexShrink:0, marginTop:4 }}/>
                <div style={{ fontSize:13, color:"rgba(232,228,240,0.45)", flex:1, lineHeight:1.55 }}>
                  {l}
                </div>
                <span style={{ fontSize:13, color:"rgba(155,111,232,0.35)", flexShrink:0 }}>🔒</span>
              </div>
            ))}
            <div style={{ position:"absolute", bottom:0, left:0, right:0, height:80,
              background:"linear-gradient(to bottom,transparent,rgba(9,9,15,0.9))", pointerEvents:"none" }}/>
          </div>
          <div style={{ background:"rgba(107,47,212,0.04)", borderTop:"0.5px solid rgba(107,47,212,0.1)",
            padding:"32px 28px 28px", textAlign:"center" }}>
            <div style={{ fontFamily:"var(--font-display)", fontSize:20, marginBottom:10, color:"#e8e4f0" }}>
              8 more insights waiting
            </div>
            <p style={{ fontSize:14, color:"#6b6585", lineHeight:1.75, maxWidth:380,
              margin:"0 auto 24px" }}>
              Natal chart wheel (high-precision ephemeris, Astronomy Engine), eight deeper cuts, these two previews again in one thread,
              plus your shareable identity card. In your inbox the moment you pay. Yours forever.
            </p>
            <button onClick={handleUnlock}
              style={{ display:"block", width:"100%",
                background:"linear-gradient(135deg,#f0b84a,#e8854a)",
                color:"#0d0800", border:"none", borderRadius:12, padding:"17px 20px",
                fontSize:15, fontWeight:700, fontFamily:"inherit", cursor:"pointer",
                letterSpacing:"0.2px" }}>
              Unlock full reading · $15 ✦
            </button>
            <div style={{ fontSize:11, color:"#3a3858", marginTop:10 }}>
              One-time · No subscription · Full reading emailed instantly after payment
            </div>
          </div>
        </div>

        <button onClick={reset} style={{ width:"100%", background:"transparent", border:"none",
          padding:"18px", fontSize:13, color:"#4a4560", cursor:"pointer", fontFamily:"inherit", marginTop:8 }}>
          ← Read a different chart
        </button>
        <div style={{ fontSize:11, color:"#2a2840", textAlign:"center", marginTop:4, lineHeight:1.5 }}>
          For entertainment purposes only · Not psychological or medical advice
        </div>
      </div>
    );
  }
  return null;
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number|null>(null);
  return (
    <div style={{ marginTop:48, maxWidth:720, margin:"48px auto 0" }}>
      {FAQS.map((f, i) => (
        <div key={i} style={{ borderBottom:"0.5px solid rgba(255,255,255,0.08)" }}>
          <button onClick={() => setOpen(p => p===i ? null : i)}
            style={{ width:"100%", background:"transparent", border:"none", padding:"22px 0",
              display:"flex", alignItems:"center", justifyContent:"space-between", gap:16,
              cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
            <span style={{ fontSize:"0.97rem", fontWeight:600, color:"#e8e4f0", lineHeight:1.45, flex:1 }}>
              {f.q}
            </span>
            <span style={{ width:26, height:26, borderRadius:"50%",
              border:"0.5px solid rgba(255,255,255,0.12)", display:"flex", alignItems:"center",
              justifyContent:"center", flexShrink:0, fontSize:14, color:"#6b2fd4", fontWeight:700,
              background:open===i?"rgba(107,47,212,0.12)":"transparent", transition:"all .2s" }}>
              {open===i?"−":"+"}
            </span>
          </button>
          <div style={{ maxHeight:open===i?400:0, overflow:"hidden",
            transition:"max-height .35s cubic-bezier(.4,0,.2,1)" }}>
            <p style={{ fontSize:"0.89rem", color:"rgba(232,228,240,0.65)",
              lineHeight:1.78, paddingBottom:22, paddingRight:40 }}>{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [wlName,    setWlName]    = useState("");
  const [wlEmail,   setWlEmail]   = useState("");
  const [reason,    setReason]    = useState("Compatibility Reading");
  const [submitted, setSubmitted] = useState(false);
  const [wlLoading, setWlLoading] = useState(false);
  const [scrolled,  setScrolled]  = useState(false);
  const [resultShowing, setResultShowing] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wlName || !wlEmail) return;
    setWlLoading(true);
    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbwgxIPG-QmNI89GEMqeV6GA83STXCncvc77fsqH6bAK3AatSO3pfi96TzGNSB6ZvxGIMA/exec",
        { method:"POST", mode:"no-cors", headers:{"Content-Type":"application/json"},
          body:JSON.stringify({ name:wlName, email:wlEmail, reason, source:"Website Waitlist" }) }
      );
      setSubmitted(true); setWlName(""); setWlEmail(""); setReason("Compatibility Reading");
    } catch { alert("Something went wrong."); }
    setWlLoading(false);
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
          --border:rgba(255,255,255,0.08);--border2:rgba(255,255,255,0.12);
          --white:#e8e4f0;--dim:rgba(232,228,240,0.55);--faint:rgba(232,228,240,0.08);
          --gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);
          --purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--white);font-family:var(--font-body);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:.5;transform:translate(-50%,-55%) scale(1)}50%{opacity:1;transform:translate(-50%,-55%) scale(1.03)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        .c{max-width:1100px;margin:0 auto;padding:0 24px}
        section{position:relative;z-index:1}
        .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;transition:all .3s}
        .nav.on{background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
        .nav-i{display:flex;align-items:center;justify-content:space-between}
        .logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;letter-spacing:.02em}
        .logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .nl{display:flex;align-items:center;gap:28px;list-style:none}
        .nl a{font-size:.83rem;font-weight:500;color:var(--dim);text-decoration:none;letter-spacing:.04em;text-transform:uppercase;transition:color .2s}
        .nl a:hover{color:var(--white)}
        .ncta{color:var(--gold)!important;border:1px solid var(--gold-dim);padding:6px 15px;border-radius:4px}
        .ncta:hover{background:var(--gold-dim)}
        .hero{min-height:100vh;display:flex;align-items:center;padding-top:96px;padding-bottom:80px;overflow:hidden}
        .hbg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% -10%,rgba(107,47,212,.1) 0%,transparent 50%),radial-gradient(ellipse 40% 40% at 85% 60%,rgba(212,83,126,.06) 0%,transparent 60%);pointer-events:none}
        .horb{position:absolute;top:50%;left:50%;transform:translate(-50%,-55%);width:560px;height:560px;border-radius:50%;border:1px solid rgba(107,47,212,.08);background:radial-gradient(circle,rgba(107,47,212,.04) 0%,transparent 50%);animation:pulse 8s ease-in-out infinite;pointer-events:none}
        .hi{position:relative;z-index:1;text-align:center;max-width:860px;margin:0 auto}
        .ey{display:inline-flex;align-items:center;gap:8px;font-size:.73rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:28px;padding:5px 14px;border:1px solid var(--gold-dim);border-radius:100px;background:rgba(240,184,74,.06);animation:fadeUp .6s ease both}
        h1{font-family:var(--font-display);font-size:clamp(2.8rem,7vw,5.2rem);font-weight:900;line-height:1.06;letter-spacing:-.02em;animation:fadeUp .6s .1s ease both}
        h1 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .hsh{font-family:var(--font-display);font-size:clamp(1.3rem,2.8vw,1.8rem);font-style:italic;color:var(--dim);margin:10px 0 18px;animation:fadeUp .6s .15s ease both}
        .hb{font-size:1.05rem;color:var(--dim);max-width:540px;margin:0 auto 36px;line-height:1.72;animation:fadeUp .6s .2s ease both}
        .hctas{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;animation:fadeUp .6s .25s ease both}
        .htr{margin-top:44px;display:flex;align-items:center;justify-content:center;gap:18px;flex-wrap:wrap;animation:fadeUp .6s .3s ease both;font-size:.82rem;color:var(--dim)}
        .htr strong{color:var(--white)}
        .dot{width:3px;height:3px;border-radius:50%;background:rgba(240,184,74,.3)}
        .bp{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;background:linear-gradient(135deg,#6b2fd4,#d4537e);color:#fff;font-family:inherit;font-size:.88rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;border:none;border-radius:10px;cursor:pointer;transition:opacity .2s,transform .15s}
        .bp:hover{opacity:.88;transform:translateY(-1px)}
        .bs{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;background:transparent;color:var(--white);font-family:inherit;font-size:.88rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;border:1px solid var(--border2);border-radius:10px;cursor:pointer;transition:all .2s}
        .bs:hover{border-color:rgba(255,255,255,.22);background:var(--faint);transform:translateY(-1px)}
        .sec{padding:96px 0}
        .dk{background:#0d0d18;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
        .sl{display:flex;align-items:center;gap:10px;margin-bottom:14px}
        .sl::before{content:'';display:block;width:22px;height:1px;background:var(--gold)}
        .sl span{font-size:.7rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--gold)}
        h2{font-family:var(--font-display);font-size:clamp(2rem,4.5vw,3.1rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:12px}
        h2 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .sub{font-size:1rem;color:var(--dim);max-width:500px;line-height:1.72}
        .try-sec{padding:96px 0}
        .cred-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:36px;max-width:800px}
        .cred-item{display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--card);border:0.5px solid var(--border);border-radius:12px;transition:border-color .2s}
        .cred-item:hover{border-color:rgba(107,47,212,.3)}
        .cred-icon{font-size:18px;width:28px;text-align:center;flex-shrink:0;color:var(--gold);font-family:serif}
        .cred-label{font-size:12px;font-weight:700;color:var(--white);letter-spacing:.03em;margin-bottom:1px}
        .cred-desc{font-size:11px;color:rgba(232,228,240,.35)}
        .form-wrap{margin-top:64px;padding-top:56px;border-top:0.5px solid rgba(255,255,255,0.06);max-width:min(1100px,96vw);margin-left:auto;margin-right:auto;width:100%}
        .reading-stage{width:100%;max-width:min(1100px,96vw);margin:0 auto}
        .preview-landscape{width:100%;margin-bottom:40px}
        .preview-letter{max-width:100%;margin-bottom:28px;padding:22px 26px;border-radius:16px;background:rgba(107,47,212,0.06);border:0.5px solid rgba(107,47,212,0.2);font-size:clamp(0.95rem,1.6vw,1.08rem);line-height:1.75;color:rgba(220,214,235,0.88);text-align:left}
        .preview-header{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:28px;flex-wrap:wrap}
        .preview-eyebrow{font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:rgba(155,111,232,0.65);margin-bottom:6px}
        .preview-name{font-family:var(--font-display);font-size:clamp(1.75rem,4vw,2.5rem);font-weight:800;color:#f0ece8;line-height:1.05;margin:0}
        .preview-count{font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:rgba(232,228,240,0.35);white-space:nowrap}
        .preview-grid{display:grid;grid-template-columns:1fr;gap:22px;width:100%}
        @media(min-width:900px){.preview-grid{grid-template-columns:1fr 1fr;gap:28px}}
        .preview-panel{text-align:left;padding:26px 28px;border-radius:18px;background:linear-gradient(165deg,rgba(12,10,22,0.95),rgba(18,12,32,0.88));border:0.5px solid rgba(107,47,212,0.22);box-shadow:0 20px 50px rgba(0,0,0,0.25)}
        .preview-theme{font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;margin:0 0 18px;line-height:1.4}
        .preview-truth{font-family:var(--font-display);font-size:clamp(1rem,1.8vw,1.15rem);line-height:1.6;color:#f0ece8}
        .preview-truth p{margin-bottom:14px}
        .preview-truth p:last-child{margin-bottom:0}
        .preview-explain{margin-top:20px;padding:16px 18px;border-radius:12px;background:rgba(0,0,0,0.25);border:0.5px solid rgba(107,47,212,0.15);font-size:0.9rem;line-height:1.7;color:rgba(200,192,228,0.9)}
        .preview-explain-label{display:block;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#c4a8ff;margin-bottom:10px}
        .preview-action{margin-top:18px;padding-top:16px;border-top:0.5px solid rgba(240,184,74,0.2);font-size:0.88rem;line-height:1.6;color:rgba(240,184,74,0.92)}
        .preview-action span{display:block;font-size:10px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:6px;opacity:0.85}
        .rg{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-top:48px}
        .ri{background:var(--card);padding:30px;transition:background .2s}
        .ri:hover{background:#1a1a2e}
        .rn{font-family:var(--font-display);font-size:2.2rem;font-weight:900;color:rgba(107,47,212,.22);line-height:1;margin-bottom:10px}
        .rt{font-size:.93rem;font-weight:600;margin-bottom:8px}
        .rb{font-size:.83rem;color:var(--dim);line-height:1.65}
        .price-main{background:linear-gradient(135deg,var(--card) 0%,rgba(107,47,212,.08) 100%);border:1px solid rgba(240,184,74,.4);border-radius:18px;padding:36px 32px;position:relative;overflow:hidden}
        .price-main::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(107,47,212,.06) 0%,transparent 60%);pointer-events:none}
        .price-badge-main{display:inline-block;font-size:.65rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#1a0a00;background:var(--gold);padding:4px 12px;border-radius:100px;margin-bottom:18px}
        .price-title{font-family:var(--font-display);font-size:1.6rem;font-weight:800;margin-bottom:12px;color:var(--white)}
        .price-desc{font-size:.9rem;color:var(--dim);line-height:1.72;margin-bottom:24px}
        .price-num{font-family:var(--font-display);font-size:3rem;font-weight:900;color:var(--gold);line-height:1}
        .price-sub{font-size:.8rem;color:rgba(232,228,240,.35);margin-top:4px;margin-bottom:28px}
        .price-includes{list-style:none;display:flex;flex-direction:column;gap:9px;margin-bottom:28px}
        .price-includes li{font-size:.86rem;color:var(--dim);display:flex;align-items:center;gap:10px}
        .price-includes li::before{content:'✓';color:var(--teal);font-weight:700;flex-shrink:0}
        .upcoming-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:32px}
        .uc{background:var(--card);border:0.5px solid var(--border);border-radius:14px;padding:26px 22px;display:flex;flex-direction:column;position:relative;overflow:hidden}
        .uc::after{content:'';position:absolute;inset:0;background:rgba(9,9,15,.35);pointer-events:none}
        .uc-badge{display:inline-block;font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#4a4560;background:rgba(255,255,255,.05);padding:3px 10px;border-radius:100px;margin-bottom:14px;width:fit-content}
        .uc-title{font-family:var(--font-display);font-size:1.1rem;font-weight:700;margin-bottom:8px;color:rgba(232,228,240,.5)}
        .uc-desc{font-size:.82rem;color:rgba(232,228,240,.28);line-height:1.65;flex:1;margin-bottom:18px}
        .uc-price{font-family:var(--font-display);font-size:1.6rem;font-weight:900;color:#2e2c3e}
        .uc-soon{display:inline-block;font-size:.72rem;font-weight:600;color:#4a4560;border:0.5px solid rgba(255,255,255,.08);border-radius:6px;padding:4px 12px;margin-top:10px}
        .cmp-wrap{margin-top:48px;border:1px solid var(--border);border-radius:16px;overflow:hidden}
        .cmp-head{display:grid;grid-template-columns:1fr 140px 140px;background:#0d0d18;border-bottom:1px solid var(--border)}
        .cmp-head-cell{padding:16px 20px;font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--dim)}
        .cmp-head-cell.hl{color:var(--gold)}
        .cmp-row{display:grid;grid-template-columns:1fr 140px 140px;border-bottom:0.5px solid rgba(255,255,255,.05);transition:background .15s}
        .cmp-row:last-child{border-bottom:none}
        .cmp-row:hover{background:rgba(107,47,212,.04)}
        .cmp-cell{padding:15px 20px;font-size:.88rem;color:var(--dim);display:flex;align-items:center}
        .cmp-cell.feat{color:var(--white);font-weight:500}
        .cmp-yes{color:var(--teal);font-size:1rem}
        .cmp-no{color:rgba(212,83,126,.6);font-size:.82rem}
        .cmp-partial{color:#6b6585;font-size:.82rem;font-style:italic}
        .cmp-sub{color:rgba(212,83,126,.7);font-size:.82rem;font-style:italic}
        .cmp-cta{text-align:center;padding:28px;background:#0d0d18;border-top:1px solid var(--border)}
        .revg{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;margin-top:48px}
        .revc{background:var(--card);border:0.5px solid var(--border);border-radius:14px;padding:26px;transition:border-color .2s,transform .2s;position:relative;overflow:hidden}
        .revc::before{content:'"';position:absolute;top:-12px;right:18px;font-family:var(--font-display);font-size:5rem;color:rgba(107,47,212,.1);line-height:1;pointer-events:none}
        .revc:hover{border-color:rgba(107,47,212,.3);transform:translateY(-2px)}
        .revt{font-size:.91rem;color:var(--white);line-height:1.68;margin-bottom:18px;font-style:italic}
        .reva{display:flex;align-items:center;gap:10px}
        .revav{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#6b2fd4,#d4537e);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:.9rem;font-weight:700;color:#fff;flex-shrink:0}
        .revn{font-size:.83rem;font-weight:600;color:var(--dim)}
        .revm{font-size:.73rem;color:rgba(232,228,240,.3)}
        .waitlist-sec{padding:96px 0;position:relative;overflow:hidden;background:#0d0d18;border-top:1px solid var(--border)}
        .wbg{position:absolute;inset:0;background:radial-gradient(ellipse 50% 50% at 50% 50%,rgba(107,47,212,.05) 0%,transparent 50%);pointer-events:none}
        .wi{position:relative;z-index:1;max-width:600px;margin:0 auto;text-align:center}
        .ei{width:100%;background:var(--faint);border:0.5px solid var(--border);border-radius:10px;padding:13px 16px;color:var(--white);font-family:inherit;font-size:.88rem;outline:none;transition:border-color .2s}
        .ei:focus{border-color:rgba(107,47,212,.5)}
        .ei::placeholder{color:rgba(232,228,240,.25)}
        .fn{font-size:.76rem;color:rgba(232,228,240,.28)}
        .fs{padding:14px 22px;background:rgba(93,202,165,.1);border:0.5px solid rgba(93,202,165,.3);border-radius:10px;color:var(--teal);font-size:.88rem;font-weight:500;max-width:420px;margin:0 auto}
        .wl-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:40px}
        .wl-card{background:var(--card);border:0.5px solid var(--border);border-radius:12px;padding:20px 18px;text-align:left}
        .wl-card-badge{font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#4a4560;margin-bottom:8px}
        .wl-card-title{font-family:var(--font-display);font-size:1rem;font-weight:700;color:rgba(232,228,240,.55);margin-bottom:6px}
        .wl-card-price{font-family:var(--font-display);font-size:1.4rem;font-weight:900;color:#2e2c3e}
        .footer{border-top:1px solid var(--border);padding:48px 0 30px;position:relative;z-index:1}
        .fi{display:flex;align-items:flex-start;justify-content:space-between;gap:36px;flex-wrap:wrap;margin-bottom:36px}
        .fb p{font-size:.82rem;color:var(--dim);max-width:240px;line-height:1.6;margin-top:8px}
        .fl h4{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--dim);margin-bottom:14px}
        .fl ul{list-style:none;display:flex;flex-direction:column;gap:10px}
        .fl a{font-size:.83rem;color:rgba(232,228,240,.35);text-decoration:none;transition:color .2s}
        .fl a:hover{color:var(--white)}
        .slinks{display:flex;gap:10px;margin-top:14px}
        .sl2{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:0.5px solid var(--border);border-radius:8px;color:var(--dim);text-decoration:none;font-size:.82rem;font-weight:700;transition:all .2s}
        .sl2:hover{border-color:rgba(107,47,212,.4);color:var(--gold);background:rgba(107,47,212,.1)}
        .fb2{border-top:1px solid var(--border);padding-top:22px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
        .disc{font-size:.73rem;color:rgba(232,228,240,.25);max-width:520px;line-height:1.55}
        .copy{font-size:.73rem;color:rgba(232,228,240,.2)}
        @media(max-width:900px){.cred-grid{grid-template-columns:1fr 1fr}.upcoming-grid,.wl-cards{grid-template-columns:1fr}.cmp-head,.cmp-row{grid-template-columns:1fr 110px 110px}}
        @media(max-width:768px){.nl{display:none}.hero{padding-top:90px;padding-bottom:64px}.horb{width:300px;height:300px}.hctas{flex-direction:column;align-items:center}.bp,.bs{width:100%;max-width:300px;justify-content:center}.htr{flex-direction:column;gap:10px}.rg{grid-template-columns:1fr}.fi{flex-direction:column;gap:28px}.fb2{flex-direction:column;align-items:flex-start}.revg{grid-template-columns:1fr}.cmp-head,.cmp-row{grid-template-columns:1fr 90px 90px}.cred-grid{grid-template-columns:1fr}}
        @media(max-width:480px){.sec,.try-sec,.waitlist-sec{padding:72px 0}.c{padding:0 16px}.price-main{padding:24px 20px}.upcoming-grid,.wl-cards{grid-template-columns:1fr}}
      `}</style>

      {/* NAV */}
      <nav className={`nav${scrolled?" on":""}`}>
        <div className="c nav-i">
          <a className="logo" href="#" style={{ display:"flex", alignItems:"center", gap:10 }}>
            <Image src="/mascot.png" alt="BluntChart mascot" width={34} height={34} style={{ borderRadius:"50%" }}/>
            <span className="g">BluntChart</span>
          </a>
          <ul className="nl">
            <li><a href="#try-it">Try Free</a></li>
            <li><a href="#reveals">What We Reveal</a></li>
            <li><a href="#reviews">Reviews</a></li>
            <li><a href="#compare">vs Co-Star</a></li>
            <li><a className="ncta" href="#try-it">Get Reading $15</a></li>
          </ul>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hbg"/><div className="horb"/>
        <div className="c">
          <div className="hi">
            <div style={{ marginBottom:24 }}>
              <Image src="/mascot.png" alt="BluntChart cosmic cat mascot" width={130} height={130} priority
                style={{ margin:"0 auto", filter:"drop-shadow(0 0 30px rgba(107,47,212,.35))" }}/>
            </div>
            <div className="ey">✦ Brutally honest birth chart readings</div>
            <h1>Your chart already knows<br/><em>why you&apos;re like this.</em></h1>
            <p className="hsh">It&apos;s time you did too.</p>
            <p className="hb">BluntChart takes your birth date, time, and place. Calculates your real natal chart and delivers a reading that tells you the truth in plain language, no sugarcoating.</p>
            <div className="hctas">
              <a className="bp" href="#try-it">Get My Free Preview ✨</a>
              <a className="bs" href="#reveals">See What We Reveal ↓</a>
            </div>
            <div className="htr">
              <span><strong>$15</strong>&nbsp;one-time. No subscription.</span>
              <span className="dot"/>
              <span>Real chart calculation</span>
              <span className="dot"/>
              <span>~1,500 words specific to <em>your</em> chart</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRY IT ── */}
      <section className="try-sec" id="try-it">
        <div className="c">
          {!resultShowing && (
            <>
              <div className="sl"><span>Real natal chart · High-precision ephemeris (Astronomy Engine)</span></div>
              <h2 style={{ maxWidth:640 }}>Two answers,<br/><em>completely free.</em></h2>
              <p className="sub">No account. No payment. Enter your birth details and we&apos;ll tell you what your chart actually says. Not your sign. <em>Your chart.</em></p>
              <div className="cred-grid">
                {PLANET_CREDENTIALS.map((item, i) => (
                  <div className="cred-item" key={i}>
                    <span className="cred-icon">{item.icon}</span>
                    <div>
                      <div className="cred-label">{item.label}</div>
                      <div className="cred-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:20, marginTop:28, padding:"14px 20px",
                background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:12,
                maxWidth:800, flexWrap:"wrap" }}>
                {["No account needed","Real chart calculation","Instant result","Full reading emailed after payment"].map((t,i) => (
                  <span key={i} style={{ fontSize:12, color:"rgba(232,228,240,0.45)", display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ color:"#5dcaa5", fontWeight:700 }}>✓</span>{t}
                  </span>
                ))}
              </div>
            </>
          )}
          <div className="form-wrap" style={resultShowing ? { borderTop:"none", marginTop:0, paddingTop:0 } : {}}>
            {!resultShowing && (
              <div style={{ textAlign:"center", marginBottom:40 }}>
                <div style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.4rem,3vw,2rem)",
                  fontWeight:700, color:"#e8e4f0", marginBottom:8 }}>
                  Enter your birth details below
                </div>
                <p style={{ fontSize:14, color:"#6b6585", maxWidth:480, margin:"0 auto" }}>
                  Your email is where we send your full reading after payment.
                </p>
              </div>
            )}
            <ReadingApp onResultChange={setResultShowing}/>
          </div>
        </div>
      </section>

      {/* ── WHAT WE REVEAL ── */}
      <section className="sec dk" id="reveals">
        <div className="c">
          <div className="sl"><span>What we actually say</span></div>
          <h2>The parts other apps<br/><em>won&apos;t touch.</em></h2>
          <p className="sub">Generic readings tell you you&apos;re creative and sensitive. We tell you why you text back immediately and then resent yourself for it.</p>
          <div className="rg">
            {REVEALS.map(r => (
              <div className="ri" key={r.num}>
                <div className="rn">{r.num}</div>
                <div className="rt">{r.title}</div>
                <div className="rb">{r.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="sec" id="readings">
        <div className="c">
          <div className="sl"><span>Readings</span></div>
          <h2>One-time. No subscription.<br/><em>No trap.</em></h2>
          <p className="sub">Pay once, get your reading. Delivered to your email instantly, yours forever.</p>
          <div className="price-main" style={{ maxWidth:560, marginTop:48 }}>
            <div style={{ position:"relative", zIndex:1 }}>
              <div className="price-badge-main">⭐ Most Popular</div>
              <div className="price-title">Full Birth Chart Reading</div>
              <p className="price-desc">10 brutally honest insights across all your planets, houses, and key life areas. Emailed to you the moment payment goes through.</p>
              <div className="price-num">$15</div>
              <p className="price-sub">One-time · Emailed instantly · Yours forever</p>
              <ul className="price-includes">
                <li>2 free preview beats before you pay (no chart, no card)</li>
                <li>8 deeper paid insights plus natal chart wheel + share card in your inbox</li>
                <li>High-precision ephemeris (Astronomy Engine) for planet positions in the full delivery</li>
                <li>No account required</li>
              </ul>
              <a className="bp" href="#try-it" style={{ display:"block", textAlign:"center", textDecoration:"none" }}>
                Get My Free Preview First ✨
              </a>
            </div>
          </div>
          <div style={{ marginTop:56 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
              <div style={{ width:22, height:1, background:"rgba(255,255,255,.15)" }}/>
              <span style={{ fontSize:".7rem", fontWeight:700, letterSpacing:".16em",
                textTransform:"uppercase" as const, color:"#4a4560" }}>
                More readings coming
              </span>
            </div>
            <div className="upcoming-grid">
              {UPCOMING.map(u => (
                <div className="uc" key={u.title}>
                  <div className="uc-badge">{u.badge}</div>
                  <div className="uc-title">{u.title}</div>
                  <p className="uc-desc">{u.desc}</p>
                  <div className="uc-price">{u.price}</div>
                  <div className="uc-soon">Launching Soon</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="sec dk" id="reviews">
        <div className="c">
          <div className="sl"><span>Beta reader reactions</span></div>
          <h2>People keep sending it<br/><em>to their friends.</em></h2>
          <p className="sub">Real responses from our closed beta. Unfiltered, because that&apos;s the whole point.</p>
          <div className="revg">
            {REVIEWS.map(r => (
              <div className="revc" key={r.name}>
                <div style={{ display:"flex", gap:2, marginBottom:12 }}>
                  {Array.from({length:5}).map((_,i) => <span key={i} style={{ color:"#F0B84A", fontSize:13 }}>★</span>)}
                </div>
                <p className="revt">&ldquo;{r.text}&rdquo;</p>
                <div className="reva">
                  <div className="revav">{r.init}</div>
                  <div>
                    <div className="revn">{r.name}</div>
                    <div className="revm">{r.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="sec" id="compare">
        <div className="c">
          <div className="sl"><span>Co-Star alternative</span></div>
          <h2>Why people are<br/><em>leaving Co&#8209;Star.</em></h2>
          <p className="sub">Less vague quotes. More specific truths.</p>
          <div className="cmp-wrap">
            <div className="cmp-head">
              <div className="cmp-head-cell">Feature</div>
              <div className="cmp-head-cell hl">BluntChart</div>
              <div className="cmp-head-cell">Co&#8209;Star</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div className="cmp-row" key={i}>
                <div className="cmp-cell feat">{row.feature}</div>
                <div className="cmp-cell">
                  {row.us === true ? <span className="cmp-yes">✓</span> : <span className="cmp-no">✗</span>}
                </div>
                <div className="cmp-cell">
                  {row.them === true  ? <span className="cmp-yes">✓</span>
                   : row.them === false ? <span className="cmp-no">✗</span>
                   : row.them === "Subscription" ? <span className="cmp-sub">Subscription</span>
                   : <span className="cmp-partial">{row.them}</span>}
                </div>
              </div>
            ))}
            <div className="cmp-cta">
              <p style={{ fontSize:".87rem", color:"var(--dim)", marginBottom:16, maxWidth:440, margin:"0 auto 18px" }}>
                Co-Star is built for daily engagement. BluntChart is built for one honest conversation with your chart.
              </p>
              <a className="bp" href="#try-it" style={{ textDecoration:"none", display:"inline-flex" }}>
                Try BluntChart Free ✨
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="sec dk">
        <div className="c">
          <div className="sl"><span>Common questions</span></div>
          <h2>Everything you&apos;re<br/><em>wondering about.</em></h2>
          <p className="sub">The questions people ask before they get their reading and after they realise it was more accurate than they expected.</p>
          <FAQ/>
        </div>
      </section>

      {/* ── WAITLIST ── */}
      <section className="waitlist-sec" id="waitlist">
        <div className="wbg"/>
        <div className="c">
          <div className="wi">
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:".8rem",
              color:"var(--dim)", padding:"6px 14px", background:"var(--faint)",
              borderRadius:"100px", marginBottom:24 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--teal)",
                animation:"blink 2s ease-in-out infinite", display:"block" }}/>
              More readings are coming
            </div>
            <h2 style={{ marginBottom:14 }}>Join <em>1,000+ waitlist</em><br/>members for first access.</h2>
            <p className="sub" style={{ margin:"0 auto 36px", textAlign:"center" }}>
              Compatibility readings, Year Ahead reports, and Gift readings are in development.
              Waitlist members get launch pricing before anyone else.
            </p>
            <div className="wl-cards">
              {UPCOMING.map(u => (
                <div className="wl-card" key={u.title}>
                  <div className="wl-card-badge">Coming Soon</div>
                  <div className="wl-card-title">{u.title}</div>
                  <div className="wl-card-price">{u.price}</div>
                </div>
              ))}
            </div>
            {!submitted ? (
              <form onSubmit={handleWaitlist}
                style={{ maxWidth:"460px", margin:"0 auto", display:"grid", gap:"12px" }}>
                <input className="ei" placeholder="First name" value={wlName}
                  onChange={e=>setWlName(e.target.value)} required/>
                <input className="ei" type="email" placeholder="Email address" value={wlEmail}
                  onChange={e=>setWlEmail(e.target.value)} required/>
                <select className="ei"
                  style={{ background:"#12121e", color:"rgba(232,228,240,0.8)", appearance:"none" }}
                  value={reason} onChange={e=>setReason(e.target.value)}>
                  <option value="Compatibility Reading">Compatibility Reading</option>
                  <option value="Year Ahead Reading">Year Ahead Reading</option>
                  <option value="Gift a Reading">Gift a Reading</option>
                  <option value="All of the above">All of the above</option>
                </select>
                <button className="bp" type="submit" style={{ width:"100%", justifyContent:"center" }}>
                  {wlLoading ? "Joining…" : "Join 1,000+ Waitlist Members →"}
                </button>
                <p className="fn" style={{ textAlign:"center" }}>No spam. Launch pricing ends soon.</p>
              </form>
            ) : (
              <div className="fs">✓ You&apos;re in. Watch your inbox. You&apos;ll be first when it launches.</div>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="c">
          <div className="fi">
            <div className="fb">
              <a className="logo" href="#"><span className="g">BluntChart</span></a>
              <p>Brutally honest birth chart readings. Real astrology, zero filter, no subscription.</p>
              <div className="slinks">
                <a className="sl2" href="https://www.tiktok.com/@bluntchart" target="_blank" rel="noopener noreferrer">Tk</a>
                <a className="sl2" href="https://www.instagram.com/bluntchart/" target="_blank" rel="noopener noreferrer">In</a>
                <a className="sl2" href="https://www.youtube.com/@BluntChart" target="_blank" rel="noopener noreferrer">Yt</a>
              </div>
            </div>
            <div className="fl">
              <h4>Readings</h4>
              <ul>
                <li><a href="#try-it">Birth Chart · $15</a></li>
                <li><a href="#waitlist">Compatibility · Coming Soon</a></li>
                <li><a href="#waitlist">Year Ahead · Coming Soon</a></li>
                <li><a href="#waitlist">Gift a Reading · Coming Soon</a></li>
              </ul>
            </div>
            <div className="fl">
              <h4>Legal</h4>
              <ul>
                <li><a href="/terms">Terms of Service</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/refunds">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="fb2">
            <p className="disc">
              For entertainment purposes only. BluntChart readings are not a substitute for
              medical, psychological, financial, or legal advice. Do not make major life
              decisions based solely on astrological content.
            </p>
            <p className="copy">© 2026 BluntChart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}