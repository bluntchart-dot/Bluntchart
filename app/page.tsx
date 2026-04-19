"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

// ─── TYPES ─────────────────────────────────────────────────────────────────────

interface PlanetMap {
  sun?: string; moon?: string; rising?: string; venus?: string;
  mars?: string; mercury?: string; saturn?: string; jupiter?: string;
}
interface Insight { planet: string; colorKey: string; truth: string; explain: string; action?: string; }
interface ShareCard { sign: string; truth: string; quote: string; }
interface ReadingData { planets: PlanetMap; sunDates?: string; preview: Insight[]; locked: string[]; shareCard: ShareCard; }

// ─── DATA ──────────────────────────────────────────────────────────────────────

const REVIEWS = [
  { text: "I've used Co-Star, The Pattern, Sanctuary... none said anything I didn't already know. This one said things I hadn't told anyone. It was uncomfortable. I loved it.", name: "Michelle R.", meta: "Scorpio Sun, Cancer Moon", init: "M" },
  { text: "I was ready to roll my eyes. Three paragraphs in I had to put my phone down. It just... described me. Not my sign. Me.", name: "Rachel T.", meta: "Virgo Rising, Libra Sun", init: "P" },
  { text: "Way more accurate than Co-Star ever was. And it didn't sugarcoat the parts I wasn't ready to hear, which is the whole point.", name: "Sophie K.", meta: "Aries Sun, Pisces Moon", init: "S" },
  { text: "I felt attacked. In a good way. My therapist has been saying the same thing for six months. My birth chart said it better in one paragraph.", name: "Dani L.", meta: "Capricorn Sun, Gemini Moon", init: "D" },
  { text: "Finally astrology that doesn't sound like it was written for everyone and no one at the same time. Sent it to three friends immediately.", name: "Zara O.", meta: "Leo Sun, Scorpio Rising", init: "Z" },
  { text: "Twelve dollars. I spent two hours talking about it with my best friend. That's insane!", name: "Chloe M.", meta: "Sagittarius Sun, Aquarius Moon", init: "C" },
];

const REVEALS = [
  { num: "01", title: "Why you attract the same type of people", body: "Your Venus placement, 7th house, and nodal axis spell out the exact pattern — and why you keep repeating it." },
  { num: "02", title: "Why you procrastinate when it matters most", body: "Your chart shows the specific fear driving it. It's not laziness. It has never been laziness." },
  { num: "03", title: "What people assume about you instantly", body: "Your Rising sign is the mask you wear without knowing it. Most people never meet the real you." },
  { num: "04", title: "Your emotional triggers — mapped precisely", body: "Moon sign, 4th house, and Saturn's position tell us exactly where you're most raw and why certain things hit harder than they should." },
  { num: "05", title: "Where your real confidence comes from", body: "Not the kind you perform. The kind that actually holds. Your Sun and Mars placement show the difference." },
  { num: "06", title: "What your chart is screaming right now", body: "Current transits to your natal placements. The tension you're feeling isn't random — it's your chart, on schedule." },
];

const OFFERINGS = [
  { badge: "Most Popular", title: "Full Birth Chart Reading", desc: "12 brutal insights across all your planets, houses, and key life areas. Sun, Moon, Rising, Venus, Mars, Saturn, 12th house shadow — all of it. ~1,500 words, specific to your exact chart.", price: "$15", featured: true },
  { badge: "Add-on", title: "Compatibility Reading", desc: "You + a partner, friend, or situationship. Brutally honest about the real tension points and why you keep having the same fight.", price: "$9", featured: false },
  { badge: "Seasonal", title: "Year Ahead Reading", desc: "What your chart says about the next 12 months — love, money, career, major turning points. High demand around January and your solar return.", price: "$18", featured: false },
  { badge: "Gift", title: "Gift a Reading", desc: "Buy for someone else — birthday, bachelorette, just because. Delivered to their email with a gift message. The gift that always lands.", price: "$15", featured: false },
];

// Proof points in question form — layman language
const PROOF_POINTS = [
  { q: "Why do I always end up with the same type of person?", tag: "Free preview" },
  { q: "Why do I self-sabotage right when things are going well?", tag: "Free preview" },
  { q: "Why do people always misread who I actually am?", tag: "Free preview" },
  { q: "What's the one thing my chart is trying to tell me right now?", tag: "Unlocked ($15)" },
];

const SIGN_SYMBOLS: Record<string, string> = {
  Aries:"♈",Taurus:"♉",Gemini:"♊",Cancer:"♋",Leo:"♌",Virgo:"♍",
  Libra:"♎",Scorpio:"♏",Sagittarius:"♐",Capricorn:"♑",Aquarius:"♒",Pisces:"♓",
};
const DOT_COLORS: Record<string, string> = {
  sun:"#F0B84A",moon:"#B8B0D4",rising:"#6B2FD4",venus:"#D4537E",
  mars:"#E8854A",mercury:"#5DCAA5",saturn:"#8A849E",jupiter:"#F0B84A",
};
const PLANET_LABELS: Record<string, string> = {
  sun:"Sun",moon:"Moon",rising:"Rising",venus:"Venus",mars:"Mars",mercury:"Mercury",saturn:"Saturn",jupiter:"Jupiter",
};
const PLANET_ORDER = ["sun","moon","rising","venus","mars","mercury","saturn","jupiter"];
const LOADING_MSGS = ["Reading the stars","Consulting the planets","Finding your truth","Almost ready"];

const makePrompt = (name: string, dob: string, time: string, city: string) =>
`You are BluntChart — a brutally honest Western astrology reading AI. Be specific, warm but unfiltered.

Birth details: Name: ${name}, Date: ${dob}, Time: ${time}, City: ${city}

TASK: Calculate Western tropical astrology placements, then write a reading.

RULES:
1. Simple everyday English — no jargon without explanation
2. Every insight: TRUTH (honest 1-2 sentence observation), EXPLAIN ("In simple words: ..."), ACTION (one thing to do this week)
3. Share card quote must be specific to their placements
4. Tone: brilliant friend who knows astrology

Return ONLY valid JSON, no markdown:
{
  "planets":{"sun":"Aries","moon":"Taurus","rising":"Taurus","venus":"Aries (retrograde)","mars":"Sagittarius","mercury":"Pisces","saturn":"Taurus","jupiter":"Gemini"},
  "sunDates":"March 21 – April 19",
  "preview":[
    {"planet":"Sun in Aries","colorKey":"sun","truth":"You dive headfirst and figure it out as you go — exciting until you've started seven things and finished zero.","explain":"In simple words: You have enormous energy for starting but struggle through the boring middle. Unfinished projects everywhere.","action":"Pick ONE thing you started but abandoned. Spend 20 minutes on it today — just 20."},
    {"planet":"Moon in Taurus","colorKey":"moon","truth":"You need stability but put yourself in chaotic situations because you hate admitting you need comfort.","explain":"In simple words: You're more sensitive than you let on. When things feel unstable you shut down emotionally even if you look fine.","action":"Do one grounding thing today. Not productive — grounded. A walk, a meal you love, a tidy space."},
    {"planet":"Saturn in Taurus","colorKey":"saturn","truth":"Your biggest challenge is believing you are enough — that you deserve things without earning them a hundred times over first.","explain":"In simple words: You work harder than everyone but it never feels like enough. Saturn is testing your self-worth, not marking you as failing.","action":"Write one achievement you've been dismissing. Read it out loud."}
  ],
  "locked":[
    "Venus in Aries (retrograde) — why you pursue people then disappear",
    "Mars in Sagittarius — your real drive vs your actual follow-through",
    "Rising in Taurus — the version of you the world sees that isn't quite you",
    "Jupiter in Gemini — where your actual luck is hiding",
    "Mercury in Pisces — how you think vs how you communicate",
    "Your self-sabotage pattern — named from your full chart",
    "The 12th house shadow — what you keep hidden even from yourself",
    "Career truth — what your chart says about your real purpose",
    "The one thing your chart is screaming at you right now"
  ],
  "shareCard":{
    "sign":"Aries",
    "truth":"You have enough fire to start a hundred things. The work is learning to stay when it gets hard — not because you lack courage, but because you've confused leaving with freedom.",
    "quote":"Stop preparing to start. The version of you that finishes things is built in the doing, not the planning."
  }
}`;

// ─── SHARED STYLE HELPERS ──────────────────────────────────────────────────────

const inp: React.CSSProperties = {
  width:"100%",background:"#1a1a2e",border:"0.5px solid rgba(255,255,255,0.1)",
  borderRadius:10,padding:"13px 14px",fontSize:14,color:"#e8e4f0",
  fontFamily:"inherit",outline:"none",
};
const lbl: React.CSSProperties = {
  display:"block",fontSize:11,fontWeight:600,color:"#6b6585",
  letterSpacing:"1.2px",textTransform:"uppercase",marginBottom:6,
};

// ─── READING APP ───────────────────────────────────────────────────────────────

function ReadingApp() {
  const [screen, setScreen] = useState<"form"|"loading"|"result">("form");
  const [fname, setFname] = useState("");
  const [dob, setDob] = useState("");
  const [btime, setBtime] = useState("");
  const [city, setCity] = useState("");
  const [err, setErr] = useState("");
  const [loadMsg, setLoadMsg] = useState(LOADING_MSGS[0]);
  const [data, setData] = useState<ReadingData|null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [copyLbl, setCopyLbl] = useState("📋 Copy quote to share");
  const msgIdx = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval>|null>(null);

  const startRot = () => { timer.current = setInterval(() => { msgIdx.current=(msgIdx.current+1)%LOADING_MSGS.length; setLoadMsg(LOADING_MSGS[msgIdx.current]); },2000); };
  const stopRot = () => { if(timer.current) clearInterval(timer.current); };

  const submit = async () => {
    if(!fname.trim()||!dob||!city.trim()){ setErr("Please fill in your name, date of birth, and city."); return; }
    if(!btime){ setErr("Exact birth time is needed for your Rising sign. Check your birth certificate."); return; }
    setErr(""); setScreen("loading"); startRot();
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2500,messages:[{role:"user",content:makePrompt(fname,dob,btime,city)}]}),
      });
      stopRot();
      if(!res.ok) throw new Error("API "+res.status);
      const resp = await res.json();
      if(!resp.content?.[0]?.text) throw new Error("Empty response");
      let txt = resp.content[0].text.trim().replace(/^```json\s*/,"").replace(/\s*```$/,"").trim();
      let parsed: ReadingData;
      try { parsed=JSON.parse(txt); } catch { const m=txt.match(/\{[\s\S]*\}/); if(m) parsed=JSON.parse(m[0]); else throw new Error("JSON parse failed"); }
      setData(parsed); setScreen("result");
    } catch(e) {
      stopRot(); setScreen("form"); setErr("Something went wrong. Please try again. ("+(e as Error).message+")");
    }
  };

  const reset = () => { setScreen("form");setData(null);setUnlocked(false);setFname("");setDob("");setBtime("");setCity("");setErr(""); };

  const copyQuote = (q: string) => {
    navigator.clipboard.writeText(`"${q}"\n\nGet your brutally honest birth chart reading → bluntchart.com`)
      .then(()=>{ setCopyLbl("✓ Copied!"); setTimeout(()=>setCopyLbl("📋 Copy quote to share"),2000); });
  };

  const sym = (sign: string) => SIGN_SYMBOLS[sign.split(" ")[0]]||"✦";

  // FORM
  if(screen==="form") return (
    <div>
      {err && <div style={{background:"rgba(212,83,126,0.1)",border:"0.5px solid rgba(212,83,126,0.3)",borderRadius:10,padding:"11px 14px",fontSize:13,color:"#f0a0b8",marginBottom:14}}>{err}</div>}
      <div style={{background:"#12121e",border:"0.5px solid rgba(255,255,255,0.1)",borderRadius:18,padding:24}}>
        <div style={{fontFamily:"var(--font-display)",fontSize:19,marginBottom:6,color:"#e8e4f0"}}>Get your reading</div>
        <div style={{fontSize:13,color:"#6b6585",lineHeight:1.55,marginBottom:22}}>Your exact birth time is what makes this specific to you — not just anyone born that day. Check your birth certificate if unsure.</div>
        <div style={{marginBottom:14}}><label style={lbl}>Your first name</label><input value={fname} onChange={e=>setFname(e.target.value)} placeholder="e.g. Ishika" style={inp}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
          <div><label style={lbl}>Date of birth</label><input type="date" value={dob} onChange={e=>setDob(e.target.value)} style={inp}/></div>
          <div><label style={lbl}>Time of birth</label><input type="time" value={btime} onChange={e=>setBtime(e.target.value)} style={inp}/><small style={{fontSize:11,color:"#2e2c3e",marginTop:4,display:"block"}}>From birth certificate</small></div>
        </div>
        <div style={{marginBottom:14}}><label style={lbl}>City &amp; country of birth</label><input value={city} onChange={e=>setCity(e.target.value)} placeholder="e.g. Mumbai, India or London, UK" style={inp}/></div>
        <button onClick={submit} style={{width:"100%",background:"linear-gradient(135deg,#6b2fd4,#d4537e)",color:"#fff",border:"none",borderRadius:12,padding:15,fontSize:15,fontWeight:600,fontFamily:"inherit",cursor:"pointer",marginTop:6,letterSpacing:"0.2px"}}>
          Read my chart — free preview ✨
        </button>
      </div>
      <div style={{fontSize:11,color:"#2e2c3e",textAlign:"center",marginTop:18}}>For entertainment purposes only · Not professional advice</div>
    </div>
  );

  // LOADING
  if(screen==="loading") return (
    <div style={{textAlign:"center",padding:"70px 0"}}>
      <span style={{fontSize:56,display:"block",animation:"bob 1.8s ease-in-out infinite"}}>🌙</span>
      <div style={{fontFamily:"var(--font-display)",fontSize:20,margin:"14px 0 6px",color:"#e8e4f0"}}>{loadMsg}</div>
      <div style={{fontSize:13,color:"#4a4560"}}>Calculating your planetary positions…</div>
    </div>
  );

  // RESULT
  if(screen==="result"&&data) {
    const { planets, sunDates, preview, locked, shareCard } = data;
    const sunSign = shareCard.sign||(planets.sun||"").split(" ")[0]||"Unknown";
    const dobFmt = new Date(dob).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"});
    return (
      <div>
        {/* Planet strip */}
        <div style={{background:"#12121e",border:"0.5px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"12px 14px",marginBottom:16,display:"flex",flexWrap:"wrap",gap:6}}>
          {PLANET_ORDER.filter(k=>planets[k as keyof PlanetMap]).map(k=>(
            <div key={k} style={{fontSize:11,color:"#6b6585",background:"rgba(255,255,255,0.04)",borderRadius:20,padding:"3px 10px",whiteSpace:"nowrap"}}>
              <b style={{color:"#e8e4f0"}}>{PLANET_LABELS[k]}:</b> {planets[k as keyof PlanetMap]}
            </div>
          ))}
        </div>
        {/* Separator */}
        <div style={{display:"flex",alignItems:"center",gap:8,margin:"20px 0 10px"}}>
          <span style={{flex:1,height:0.5,background:"rgba(255,255,255,0.07)",display:"block"}}/>
          <span style={{fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:"#4a4560"}}>Free preview — 3 insights</span>
          <span style={{flex:1,height:0.5,background:"rgba(255,255,255,0.07)",display:"block"}}/>
        </div>
        {/* Insights */}
        {preview.map((ins,i)=>{
          const col=DOT_COLORS[ins.colorKey]||"#6B2FD4";
          const parts=ins.explain.split("In simple words:");
          return (
            <div key={i} style={{background:"#12121e",border:"0.5px solid rgba(255,255,255,0.1)",borderRadius:16,overflow:"hidden",marginBottom:12}}>
              <div style={{padding:"14px 18px 10px",borderBottom:"0.5px solid rgba(255,255,255,0.07)",display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:9,height:9,borderRadius:"50%",background:col,flexShrink:0}}/>
                <div style={{fontSize:11,fontWeight:600,letterSpacing:1,textTransform:"uppercase",color:"#6b6585",flex:1}}>{ins.planet}</div>
                <div style={{fontSize:10,background:"rgba(29,158,117,0.2)",color:"#5dcaa5",padding:"2px 8px",borderRadius:20}}>Free</div>
              </div>
              <div style={{padding:"14px 18px"}}>
                <div style={{fontSize:14,lineHeight:1.7,color:"#e8e4f0",marginBottom:10,fontWeight:600}}>{ins.truth}</div>
                <div style={{background:"rgba(107,47,212,0.1)",borderLeft:"2px solid #6b2fd4",borderRadius:"0 8px 8px 0",padding:"10px 12px",fontSize:13,color:"#b8b0d4",lineHeight:1.55,marginBottom:10}}>
                  {parts.length>1?<><span style={{color:"#d4b8ff",fontWeight:500}}>In simple words:</span>{parts[1]}</>:ins.explain}
                </div>
                {ins.action&&<div style={{background:"rgba(240,184,74,0.08)",borderLeft:"2px solid #f0b84a",borderRadius:"0 8px 8px 0",padding:"9px 12px",fontSize:12,color:"#d4a83a",lineHeight:1.5}}><strong>→ This week: </strong>{ins.action}</div>}
              </div>
            </div>
          );
        })}
        {/* Paywall */}
        <div style={{background:"#12121e",border:"0.5px solid rgba(255,255,255,0.1)",borderRadius:16,overflow:"hidden",marginBottom:12}}>
          <div style={{padding:"12px 0"}}>
            {locked.map((l,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 18px",borderBottom:i<locked.length-1?"0.5px solid rgba(255,255,255,0.05)":"none"}}>
                <div style={{width:7,height:7,borderRadius:"50%",background:"#2e2c3e",flexShrink:0}}/>
                <div style={{fontSize:12,color:"#2e2c3e",flex:1}}>{l}</div>
                <div style={{fontSize:12,color:"#2e2c3e"}}>🔒</div>
              </div>
            ))}
          </div>
          <div style={{background:"#16162a",borderTop:"0.5px solid rgba(255,255,255,0.07)",padding:"20px 18px",textAlign:"center"}}>
            <div style={{fontFamily:"var(--font-display)",fontSize:17,marginBottom:6,color:"#e8e4f0"}}>{locked.length} more insights waiting</div>
            <div style={{fontSize:12,color:"#6b6585",lineHeight:1.55,marginBottom:16}}>Venus retrograde truth. Your self-sabotage pattern named. The 12th house shadow. All of it — one payment, yours forever.</div>
            <button onClick={()=>{setUnlocked(true);setTimeout(()=>document.getElementById("unlock-sec")?.scrollIntoView({behavior:"smooth"}),100);}}
              style={{display:"block",width:"100%",background:"linear-gradient(135deg,#f0b84a,#e8854a)",color:"#1a0a00",border:"none",borderRadius:12,padding:14,fontSize:15,fontWeight:700,fontFamily:"inherit",cursor:"pointer",letterSpacing:"0.3px"}}>
              Unlock full reading — $15 ✦
            </button>
            <div style={{fontSize:11,color:"#2e2c3e",marginTop:9}}>One-time · No subscription · Delivered instantly + by email</div>
          </div>
        </div>
        {/* Share card (unlocked) */}
        {unlocked&&(
          <div id="unlock-sec">
            <div style={{display:"flex",alignItems:"center",gap:8,margin:"20px 0 10px"}}>
              <span style={{flex:1,height:0.5,background:"rgba(255,255,255,0.07)",display:"block"}}/>
              <span style={{fontSize:11,fontWeight:600,letterSpacing:"1.5px",textTransform:"uppercase",color:"#4a4560"}}>Your shareable card</span>
              <span style={{flex:1,height:0.5,background:"rgba(255,255,255,0.07)",display:"block"}}/>
            </div>
            <div style={{borderRadius:20,overflow:"hidden",marginBottom:14,boxShadow:"0 0 0 0.5px rgba(107,47,212,0.5)"}}>
              <div style={{background:"linear-gradient(145deg,#1a0a2e 0%,#2d1b8e 50%,#6b2fd4 100%)",padding:"24px 22px 20px",textAlign:"center"}}>
                <span style={{fontSize:36,marginBottom:8,display:"block"}}>{sym(sunSign)}</span>
                <div style={{fontFamily:"var(--font-display)",fontSize:26,fontWeight:700,color:"#f0b84a",letterSpacing:1,textTransform:"uppercase"}}>{sunSign}</div>
                <div style={{fontSize:12,color:"rgba(255,255,255,0.5)",marginTop:3,letterSpacing:"0.5px"}}>{fname}</div>
                <div style={{fontSize:12,color:"rgba(240,184,74,0.7)",marginTop:2}}>{dobFmt}{sunDates?` · ${sunDates}`:""}</div>
              </div>
              <div style={{background:"#1a1a2e",padding:"20px 22px"}}>
                <div style={{fontSize:15,lineHeight:1.75,color:"#e8e4f0",marginBottom:18,textAlign:"center"}}>{shareCard.truth}</div>
                <hr style={{border:"none",borderTop:"0.5px solid rgba(255,255,255,0.1)",marginBottom:16}}/>
                <div style={{fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"#6b6585",marginBottom:8,textAlign:"center"}}>Your chart says</div>
                <div style={{fontFamily:"var(--font-display)",fontSize:16,fontStyle:"italic",color:"#fff",lineHeight:1.6,textAlign:"center",padding:"0 8px"}}>
                  &ldquo;{shareCard.quote}&rdquo;
                </div>
              </div>
              <div style={{background:"#12121e",padding:"12px 22px",textAlign:"center"}}>
                <div style={{fontSize:10,color:"#2e2c3e",letterSpacing:"0.5px"}}>bluntchart.com · for entertainment only</div>
              </div>
            </div>
            <button onClick={()=>copyQuote(shareCard.quote)} style={{width:"100%",background:"transparent",border:"0.5px solid rgba(255,255,255,0.12)",borderRadius:12,padding:13,fontSize:13,fontWeight:500,fontFamily:"inherit",color:"#e8e4f0",cursor:"pointer",marginBottom:8}}>{copyLbl}</button>
          </div>
        )}
        <button onClick={reset} style={{width:"100%",background:"transparent",border:"none",padding:11,fontSize:13,color:"#4a4560",cursor:"pointer",fontFamily:"inherit"}}>← Read a different chart</button>
        <div style={{fontSize:11,color:"#2e2c3e",textAlign:"center",marginTop:8,lineHeight:1.5}}>For entertainment purposes only · Not psychological or medical advice</div>
      </div>
    );
  }
  return null;
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("Love");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(()=>{
    const fn=()=>setScrolled(window.scrollY>40);
    window.addEventListener("scroll",fn,{passive:true});
    return ()=>window.removeEventListener("scroll",fn);
  },[]);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !reason) return;
    setLoading(true);
    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbwgxIPG-QmNI89GEMqeV6GA83STXCncvc77fsqH6bAK3AatSO3pfi96TzGNSB6ZvxGIMA/exec",
        {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, reason, source: "Website Waitlist" }),
        }
      );
      setSubmitted(true);
      setName(""); setEmail(""); setReason("Love");
    } catch {
      alert("Something went wrong.");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --font-display:'Playfair Display',Georgia,serif;
          --font-body:'DM Sans',system-ui,sans-serif;
          --bg:#09090f;--card:#12121e;--card2:#16162a;
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

        /* NAV */
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

        /* HERO */
        .hero{min-height:100vh;display:flex;align-items:center;padding-top:96px;padding-bottom:80px;overflow:hidden}
        .hbg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% -10%,rgba(107,47,212,.1) 0%,transparent 70%),radial-gradient(ellipse 40% 40% at 85% 60%,rgba(212,83,126,.06) 0%,transparent 60%);pointer-events:none}
        .horb{position:absolute;top:50%;left:50%;transform:translate(-50%,-55%);width:560px;height:560px;border-radius:50%;border:1px solid rgba(107,47,212,.08);background:radial-gradient(circle,rgba(107,47,212,.04) 0%,transparent 70%);animation:pulse 8s ease-in-out infinite;pointer-events:none}
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

        /* BTNS */
        .bp{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;background:linear-gradient(135deg,#6b2fd4,#d4537e);color:#fff;font-family:inherit;font-size:.88rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;border:none;border-radius:10px;cursor:pointer;transition:opacity .2s,transform .15s}
        .bp:hover{opacity:.88;transform:translateY(-1px)}
        .bs{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;background:transparent;color:var(--white);font-family:inherit;font-size:.88rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;border:1px solid var(--border2);border-radius:10px;cursor:pointer;transition:all .2s}
        .bs:hover{border-color:rgba(255,255,255,.22);background:var(--faint);transform:translateY(-1px)}

        /* SECTION CHROME */
        .sec{padding:96px 0}
        .dk{background:#0d0d18;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
        .sl{display:flex;align-items:center;gap:10px;margin-bottom:14px}
        .sl::before{content:'';display:block;width:22px;height:1px;background:var(--gold)}
        .sl span{font-size:.7rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--gold)}
        h2{font-family:var(--font-display);font-size:clamp(2rem,4.5vw,3.1rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:12px}
        h2 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .sub{font-size:1rem;color:var(--dim);max-width:500px;line-height:1.72}

        /* WAITLIST SECTION */
        .waitlist-sec{padding:96px 0;position:relative;overflow:hidden;background:#0d0d18;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
        .wbg{position:absolute;inset:0;background:radial-gradient(ellipse 70% 70% at 50% 50%,rgba(107,47,212,.05) 0%,transparent 70%);pointer-events:none}
        .wi{position:relative;z-index:1;max-width:540px;margin:0 auto;text-align:center}
        .cp{display:inline-flex;align-items:center;gap:6px;font-size:.8rem;color:var(--dim);padding:6px 14px;background:var(--faint);border-radius:100px;margin-bottom:24px}
        .cd{width:6px;height:6px;border-radius:50%;background:var(--teal);animation:blink 2s ease-in-out infinite}
        .ei{width:100%;background:var(--faint);border:0.5px solid var(--border);border-radius:10px;padding:13px 16px;color:var(--white);font-family:inherit;font-size:.88rem;outline:none;transition:border-color .2s}
        .ei:focus{border-color:rgba(107,47,212,.5)}
        .ei::placeholder{color:rgba(232,228,240,.25)}
        .fn{font-size:.76rem;color:rgba(232,228,240,.28)}
        .fs{padding:14px 22px;background:rgba(93,202,165,.1);border:0.5px solid rgba(93,202,165,.3);border-radius:10px;color:var(--teal);font-size:.88rem;font-weight:500;max-width:420px;margin:0 auto}

        /* SPLIT LAYOUT — Reading App section */
        .try-split{padding:96px 0}
        .try-grid{display:grid;grid-template-columns:1fr 1fr;gap:72px;align-items:start}
        .try-left{position:sticky;top:120px}
        .proof-list{list-style:none;margin-top:32px;display:flex;flex-direction:column;gap:12px}
        .proof-item{display:flex;align-items:flex-start;gap:14px;padding:16px 18px;background:var(--card);border:0.5px solid var(--border);border-radius:14px;transition:border-color .2s}
        .proof-item:hover{border-color:rgba(107,47,212,.3)}
        .proof-q{font-size:.93rem;color:var(--white);line-height:1.55;flex:1}
        .proof-tag-free{font-size:.68rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#5dcaa5;background:rgba(93,202,165,.12);padding:3px 9px;border-radius:100px;white-space:nowrap;flex-shrink:0;margin-top:2px}
        .proof-tag-paid{font-size:.68rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#f0b84a;background:rgba(240,184,74,.12);padding:3px 9px;border-radius:100px;white-space:nowrap;flex-shrink:0;margin-top:2px}
        .proof-icon{font-size:16px;flex-shrink:0;margin-top:1px}
        .trust-bar{display:flex;align-items:center;gap:18px;margin-top:28px;flex-wrap:wrap}
        .trust-item{font-size:.78rem;color:rgba(232,228,240,.38);display:flex;align-items:center;gap:6px}
        .trust-item::before{content:'✓';color:#5dcaa5;font-weight:700}
        .try-right{}

        /* REVEAL GRID */
        .rg{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-top:48px}
        .ri{background:var(--card);padding:30px;transition:background .2s}
        .ri:hover{background:#1a1a2e}
        .rn{font-family:var(--font-display);font-size:2.2rem;font-weight:900;color:rgba(107,47,212,.22);line-height:1;margin-bottom:10px}
        .rt{font-size:.93rem;font-weight:600;margin-bottom:8px}
        .rb{font-size:.83rem;color:var(--dim);line-height:1.65}

        /* REVIEWS */
        .revg{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;margin-top:48px}
        .revc{background:var(--card);border:0.5px solid var(--border);border-radius:14px;padding:26px;transition:border-color .2s,transform .2s;position:relative;overflow:hidden}
        .revc::before{content:'"';position:absolute;top:-12px;right:18px;font-family:var(--font-display);font-size:5rem;color:rgba(107,47,212,.1);line-height:1;pointer-events:none}
        .revc:hover{border-color:rgba(107,47,212,.3);transform:translateY(-2px)}
        .revt{font-size:.91rem;color:var(--white);line-height:1.68;margin-bottom:18px;font-style:italic}
        .reva{display:flex;align-items:center;gap:10px}
        .revav{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#6b2fd4,#d4537e);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:.9rem;font-weight:700;color:#fff;flex-shrink:0}
        .revn{font-size:.83rem;font-weight:600;color:var(--dim)}
        .revm{font-size:.73rem;color:rgba(232,228,240,.3)}

        /* OFFERINGS */
        .og{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px;margin-top:48px}
        .oc{background:var(--card);border:0.5px solid var(--border);border-radius:14px;padding:28px 24px;transition:border-color .2s,transform .2s;display:flex;flex-direction:column}
        .oc.ft{border-color:rgba(240,184,74,.3);background:linear-gradient(135deg,var(--card) 0%,rgba(107,47,212,.06) 100%)}
        .oc:hover{border-color:rgba(107,47,212,.3);transform:translateY(-2px)}
        .obg{display:inline-block;font-size:.65rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--gold);background:var(--gold-dim);padding:3px 10px;border-radius:100px;margin-bottom:14px;width:fit-content}
        .otl{font-family:var(--font-display);font-size:1.15rem;font-weight:700;margin-bottom:10px}
        .od{font-size:.83rem;color:var(--dim);line-height:1.68;flex:1;margin-bottom:22px}
        .op{font-family:var(--font-display);font-size:1.9rem;font-weight:900;color:var(--gold)}

        /* FOOTER */
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

        @media(max-width:900px){
          .try-grid{grid-template-columns:1fr;gap:48px}
          .try-left{position:static}
        }
        @media(max-width:768px){
          .nl{display:none}
          .hero{padding-top:90px;padding-bottom:64px}
          .horb{width:300px;height:300px}
          .hctas{flex-direction:column;align-items:center}
          .bp,.bs{width:100%;max-width:300px;justify-content:center}
          .htr{flex-direction:column;gap:10px}
          .rg{grid-template-columns:1fr}
          .fi{flex-direction:column;gap:28px}
          .fb2{flex-direction:column;align-items:flex-start}
          .og,.revg{grid-template-columns:1fr}
        }
        @media(max-width:480px){
          .sec,.try-split,.waitlist-sec{padding:72px 0}
          .c{padding:0 16px}
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav${scrolled?" on":""}`}>
        <div className="c nav-i">
          <a className="logo" href="#" style={{display:"flex",alignItems:"center",gap:"10px"}}>
            <Image src="/mascot.png" alt="BluntChart mascot" width={34} height={34} style={{borderRadius:"50%"}}/>
            <span className="g">BluntChart</span>
          </a>
          <ul className="nl">
            <li><a href="#reveals">What We Reveal</a></li>
            <li><a href="#reviews">Reviews</a></li>
            <li><a href="#readings">Readings</a></li>
            <li><a href="#try-it">Try It</a></li>
            <li><a className="ncta" href="#waitlist">Join Waitlist</a></li>
          </ul>
        </div>
      </nav>

      {/* 1 — HERO */}
      <section className="hero">
        <div className="hbg"/>
        <div className="horb"/>
        <div className="c">
          <div className="hi">
            <div style={{marginBottom:"24px"}}>
              <Image src="/mascot.png" alt="BluntChart cosmic cat mascot" width={130} height={130} priority
                style={{margin:"0 auto",filter:"drop-shadow(0 0 30px rgba(107,47,212,.35))"}}/>
            </div>
            <div className="ey">✦ Brutally honest birth chart readings</div>
            <h1>Your chart already knows<br /><em>why you&apos;re like this.</em></h1>
            <p className="hsh">It&apos;s time you did too.</p>
            <p className="hb">BluntChart takes your birth date, time, and place. Calculates your real natal chart and delivers a reading that tells you the truth.</p>
            <div className="hctas">
              <a className="bp" href="#try-it">Get Free Preview ✨</a>
              <a className="bs" href="#reveals">See What We Reveal ↓</a>
            </div>
            <div className="htr">
              <span><strong>$15</strong>&nbsp;one-time — no subscription</span>
              <span className="dot"/>
              <span>Real Swiss Ephemeris calculations</span>
              <span className="dot"/>
              <span>~1,500 words specific to <em>your</em> chart</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2 — WAITLIST */}
      <section className="waitlist-sec" id="waitlist">
        <div className="wbg"/>
        <div className="c">
          <div className="wi">
            <div className="cp">
              <span className="cd"/> Collecting early access signups
            </div>
            <h2>Join the waitlist for<br/><em>first access + 70% off.</em></h2>
            <p className="sub" style={{margin:"0 auto 32px",textAlign:"center"}}>
              Be first to try BluntChart at launch pricing.
            </p>
            {!submitted ? (
              <form onSubmit={handleWaitlist} style={{maxWidth:"460px",margin:"0 auto",display:"grid",gap:"12px"}}>
                <input className="ei" placeholder="First name" value={name} onChange={e=>setName(e.target.value)} required/>
                <input className="ei" type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)} required/>
                <select className="ei" style={{background:"#12121e",color:"#ffffff",appearance:"none"}} value={reason} onChange={e=>setReason(e.target.value)}>
                  <option value="Love">Love</option>
                  <option value="Career">Career</option>
                  <option value="Money">Money</option>
                  <option value="Purpose">Purpose</option>
                </select>
                <button className="bp" type="submit" style={{width:"100%",justifyContent:"center"}}>
                  {loading ? "Joining..." : "Join Waitlist + 70% Off"}
                </button>
                <p className="fn" style={{textAlign:"center"}}>No spam. Unsubscribe anytime.</p>
              </form>
            ) : (
              <div className="fs">✓ You&apos;re in. Watch your inbox for launch access + 70% off code.</div>
            )}
          </div>
        </div>
      </section>

      {/* 3 — READING APP — SPLIT LAYOUT */}
      <section className="try-split" id="try-it">
        <div className="c">
          <div className="try-grid">

            {/* LEFT — editorial sell column */}
            <div className="try-left">
              <div className="sl"><span>Try it now — free preview</span></div>
              <h2>Three answers,<br/><em>completely free.</em></h2>
              <p className="sub">No account. No payment. Just enter your birth details and we&apos;ll show you what your chart actually says.</p>

              <ul className="proof-list">
                {PROOF_POINTS.map((p, i) => (
                  <li className="proof-item" key={i}>
                    <span className="proof-icon">{i < 3 ? "🔍" : "🔒"}</span>
                    <span className="proof-q">{p.q}</span>
                    <span className={i < 3 ? "proof-tag-free" : "proof-tag-paid"}>
                      {p.tag}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="trust-bar">
                <span className="trust-item">No account needed</span>
                <span className="trust-item">Real chart calculation</span>
                <span className="trust-item">Instant result</span>
              </div>

              {/* Pull quote */}
              <div style={{marginTop:32,padding:"18px 20px",background:"var(--card)",border:"0.5px solid rgba(107,47,212,.25)",borderRadius:14,borderLeft:"3px solid #6b2fd4"}}>
                <p style={{fontFamily:"var(--font-display)",fontSize:"1rem",fontStyle:"italic",color:"var(--white)",lineHeight:1.65,marginBottom:10}}>
                  &ldquo;It just — described me. Not my sign. Me.&rdquo;
                </p>
                <div style={{fontSize:".75rem",color:"rgba(232,228,240,.4)",letterSpacing:".04em"}}>
                  Rachel T. · Virgo Rising, Libra Sun
                </div>
              </div>
            </div>

            {/* RIGHT — the app widget */}
            <div className="try-right">
              <div style={{textAlign:"center",marginBottom:24}}>
                <Image src="/mascot.png" alt="BluntChart mascot" width={60} height={60} style={{margin:"0 auto 8px"}}/>
                <div style={{fontFamily:"var(--font-display)",fontSize:20,background:"linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text"}}>BluntChart</div>
                <div style={{fontSize:11,color:"#4a4560",letterSpacing:"2.5px",textTransform:"uppercase",marginTop:2}}>Your chart. Unfiltered.</div>
              </div>
              <ReadingApp/>
            </div>

          </div>
        </div>
      </section>

      {/* 4 — WHAT WE REVEAL */}
      <section className="sec dk" id="reveals">
        <div className="c">
          <div className="sl"><span>What we actually say</span></div>
          <h2>The parts other apps<br /><em>won&apos;t touch.</em></h2>
          <p className="sub">Generic readings tell you you&apos;re &ldquo;creative and sensitive.&rdquo; We tell you why you text back immediately and then resent yourself for it.</p>
          <div className="rg">
            {REVEALS.map(r=>(
              <div className="ri" key={r.num}>
                <div className="rn">{r.num}</div>
                <div className="rt">{r.title}</div>
                <div className="rb">{r.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — PRICING */}
      <section className="sec" id="readings">
        <div className="c">
          <div className="sl"><span>Readings</span></div>
          <h2>One-time. No subscription.<br /><em>No trap.</em></h2>
          <p className="sub">Pay once, get the reading. Delivered to your email in minutes, not days.</p>
          <div className="og">
            {OFFERINGS.map(o=>(
              <div className={`oc${o.featured?" ft":""}`} key={o.title}>
                <div className="obg">{o.badge}</div>
                <div className="otl">{o.title}</div>
                <p className="od">{o.desc}</p>
                <div className="op">{o.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — REVIEWS */}
      <section className="sec dk" id="reviews">
        <div className="c">
          <div className="sl"><span>Beta reader reactions</span></div>
          <h2>People keep sending it<br /><em>to their friends.</em></h2>
          <p className="sub">Real responses from our closed beta — unfiltered, because that&apos;s the whole point.</p>
          <div className="revg">
            {REVIEWS.map(r=>(
              <div className="revc" key={r.name}>
                <div style={{display:"flex",gap:2,marginBottom:12}}>{Array.from({length:5}).map((_,i)=><span key={i} style={{color:"#F0B84A",fontSize:13}}>★</span>)}</div>
                <p className="revt">&ldquo;{r.text}&rdquo;</p>
                <div className="reva">
                  <div className="revav">{r.init}</div>
                  <div><div className="revn">{r.name}</div><div className="revm">{r.meta}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 — FOOTER */}
      <footer className="footer">
        <div className="c">
          <div className="fi">
            <div className="fb">
              <a className="logo" href="#"><span className="g">BluntChart</span></a>
              <p>Brutally honest birth chart readings. Real astrology, zero filter, no subscription.</p>
              <div className="slinks">
                <a className="sl2" href="https://tiktok.com" target="_blank" rel="noopener noreferrer">Tk</a>
                <a className="sl2" href="https://instagram.com" target="_blank" rel="noopener noreferrer">In</a>
                <a className="sl2" href="https://twitter.com" target="_blank" rel="noopener noreferrer">X</a>
              </div>
            </div>
            <div className="fl">
              <h4>Readings</h4>
              <ul>
                <li><a href="#readings">Birth Chart — $15</a></li>
                <li><a href="#readings">Compatibility — $9</a></li>
                <li><a href="#readings">Year Ahead — $18</a></li>
                <li><a href="#readings">Gift a Reading</a></li>
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
            <p className="disc">For entertainment purposes only. BluntChart readings are not a substitute for medical, psychological, financial, or legal advice. Do not make major life decisions based solely on astrological content.</p>
            <p className="copy">© 2026 BluntChart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}