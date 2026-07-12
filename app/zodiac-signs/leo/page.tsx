"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const OTHER_SIGNS = [
  { name:"Aries", symbol:"♈", slug:"aries" },
  { name:"Taurus", symbol:"♉", slug:"taurus" },
  { name:"Gemini", symbol:"♊", slug:"gemini" },
  { name:"Cancer", symbol:"♋", slug:"cancer" },
  { name:"Virgo", symbol:"♍", slug:"virgo" },
  { name:"Libra", symbol:"♎", slug:"libra" },
  { name:"Scorpio", symbol:"♏", slug:"scorpio" },
  { name:"Sagittarius", symbol:"♐", slug:"sagittarius" },
  { name:"Capricorn", symbol:"♑", slug:"capricorn" },
  { name:"Aquarius", symbol:"♒", slug:"aquarius" },
  { name:"Pisces", symbol:"♓", slug:"pisces" },
];
const REVIEWS = [
  { text:"I've used Co-Star, The Pattern, Sanctuary... none said anything I didn't already know. This one said things I hadn't told anyone.", name:"Michelle R.", meta:"Scorpio Sun · Cancer Moon", init:"M" },
  { text:"Three paragraphs in I had to put my phone down. It described me. Not my sign. Me.", name:"Rachel T.", meta:"Libra Sun · Virgo Rising", init:"R" },
  { text:"Way more accurate than Co-Star. It didn't sugarcoat the parts I wasn't ready to hear.", name:"Sophie K.", meta:"Aries Sun · Pisces Moon", init:"S" },
  { text:"My therapist has been saying the same thing for six months. My chart said it better.", name:"Dani L.", meta:"Capricorn Sun · Gemini Moon", init:"D" },
  { text:"Finally astrology that doesn't sound like it was written for everyone and no one.", name:"Zara O.", meta:"Leo Sun · Scorpio Rising", init:"Z" },
  { text:"Twelve dollars. I spent two hours talking about it with my best friend. Insane value.", name:"Chloe M.", meta:"Sagittarius Sun · Aquarius Moon", init:"C" },
];
const FAQS = [
  { q:"What are the Leo dates?", a:"July 23 to August 22. Those on cusp dates should check their birth chart." },
  { q:"What planet rules Leo?", a:"The Sun — the center of the solar system. It gives Leo warmth, charisma, and the need to be seen." },
  { q:"What element is Leo?", a:"Fire, along with Aries and Sagittarius. Leo is Fixed Fire — sustaining and radiating passionate energy." },
  { q:"What signs are most compatible with Leo?", a:"Aries and Sagittarius (fellow fire signs), plus Libra (air sign that fans Leo's flames with admiration)." },
  { q:"Why do Leos need so much attention?", a:"It's not vanity — it's the Sun's energy. The Sun needs to shine; Leo needs to be seen. Without recognition, they feel existentially invisible." },
  { q:"What is Leo Rising?", a:"Your outward personality radiates warmth and star quality. People notice you immediately. Notable hair, expressive features, theatrical self-assurance." },
  { q:"What is Leo Moon?", a:"Your emotional needs center on feeling special and appreciated. Silence from loved ones is devastating. You express emotions dramatically." },
];

export default function LeoPage() {
  const [scrolled, setScrolled] = useState(false);
  if (typeof window !== "undefined") { useState(() => { const fn = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", fn, { passive: true }); }); }
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--font-display:'Playfair Display',Georgia,serif;--font-body:'DM Sans',system-ui,sans-serif;--bg:#09090f;--card:#0e0e1a;--border:rgba(255,255,255,0.08);--border2:rgba(255,255,255,0.12);--white:#e8e4f0;--dim:rgba(232,228,240,0.55);--gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);--purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5;--signColor:#e8a090}
        html{scroll-behavior:smooth}body{background:var(--bg);color:var(--white);font-family:var(--font-body);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .c{max-width:1100px;margin:0 auto;padding:0 24px}
        .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;transition:all .3s}.nav.on{background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
        .logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:10px}.logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .nl{display:flex;align-items:center;gap:28px;list-style:none}.nl a{font-size:.83rem;font-weight:500;color:var(--dim);text-decoration:none;letter-spacing:.04em;text-transform:uppercase;transition:color .2s}.nl a:hover{color:var(--white)}.ncta{color:var(--gold)!important;border:1px solid var(--gold-dim);padding:6px 15px;border-radius:4px}
        .h2s{font-family:var(--font-display);font-size:clamp(1.5rem,3.2vw,2rem);font-weight:800;line-height:1.15;margin:56px 0 18px;color:var(--white)}
        .pp{font-size:16px;color:rgba(232,228,240,0.62);line-height:1.82;margin-bottom:18px}
        .cta{display:block;width:100%;max-width:480px;margin:0 auto;background:linear-gradient(135deg,#f0b84a,#e8854a);color:#0d0800;border:none;border-radius:12px;padding:18px 24px;font-size:16px;font-weight:700;font-family:inherit;cursor:pointer;text-align:center;text-decoration:none;transition:opacity .2s,transform .15s}.cta:hover{opacity:.88;transform:translateY(-1px)}
        .footer{border-top:1px solid var(--border);padding:48px 0 30px}.fi{display:flex;align-items:flex-start;justify-content:space-between;gap:36px;flex-wrap:wrap;margin-bottom:36px}.fb p{font-size:.82rem;color:var(--dim);max-width:240px;line-height:1.6;margin-top:8px}.fl h4{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--dim);margin-bottom:14px}.fl ul{list-style:none;display:flex;flex-direction:column;gap:10px}.fl a{font-size:.83rem;color:rgba(232,228,240,.35);text-decoration:none;transition:color .2s}.fl a:hover{color:var(--white)}.slinks{display:flex;gap:10px;margin-top:14px}.sl2{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:0.5px solid var(--border);border-radius:8px;color:var(--dim);text-decoration:none;font-size:.82rem;font-weight:700;transition:all .2s}.sl2:hover{border-color:rgba(107,47,212,.4);color:var(--gold)}.fb2{border-top:1px solid var(--border);padding-top:22px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}.disc{font-size:.73rem;color:rgba(232,228,240,.25);max-width:520px;line-height:1.55}.copy{font-size:.73rem;color:rgba(232,228,240,.2)}
        @media(max-width:768px){.nl{display:none!important}.compat{grid-template-columns:1fr!important}.snav{grid-template-columns:repeat(4,1fr)!important}.fi{flex-direction:column;gap:28px}.fb2{flex-direction:column;align-items:flex-start}}
      `}</style>

      <nav className={`nav${scrolled?" on":""}`}><div className="c" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}><Link href="/" className="logo"><Image src="/mascot.png" alt="BluntChart" width={34} height={34} style={{ borderRadius:"50%" }}/><span className="g">BluntChart</span></Link><ul className="nl"><li><Link href="/zodiac-signs">Zodiac Signs</Link></li><li><Link href="/free-birth-chart">Free Birth Chart</Link></li><li><Link href="/#try-it" className="ncta">Get Reading $15</Link></li></ul></div></nav>

      <section style={{ paddingTop:120, paddingBottom:48, position:"relative" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 0%,#e8a0900a 0%,transparent 60%)", pointerEvents:"none" }}/>
        <div className="c" style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:13, color:"rgba(232,228,240,0.3)", marginBottom:28 }}><Link href="/" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>BluntChart</Link><span style={{ margin:"0 8px" }}>/</span><Link href="/zodiac-signs" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>Zodiac Signs</Link><span style={{ margin:"0 8px" }}>/</span><span style={{ color:"rgba(232,228,240,0.5)" }}>Leo</span></div>
          <div style={{ display:"flex", alignItems:"center", gap:48, marginBottom:32, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:320 }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                <div style={{ width:60, height:60, borderRadius:16, background:"linear-gradient(145deg, #e8a09020, #e8a09008)", border:"1px solid #e8a09040", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 28px #e8a09010" }}><span style={{ fontSize:32, color:"var(--signColor)", fontFamily:"Georgia, serif", filter:"drop-shadow(0 0 6px #e8a09060)" }}>♌</span></div>
                <div>
                  <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.8rem,7vw,4.2rem)", fontWeight:900, lineHeight:1.02, margin:0, background:"linear-gradient(135deg, #e8a090, #d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Leo</h1>
                  <p style={{ fontSize:16, color:"rgba(232,228,240,0.5)", marginTop:4 }}>July 23 – August 22</p>
                </div>
              </div>
              <p style={{ fontSize:20, fontFamily:"var(--font-display)", fontStyle:"italic", color:"rgba(232,228,240,0.65)", lineHeight:1.55, maxWidth:560 }}>&ldquo;Doesn't need the spotlight. The spotlight needs them.&rdquo;</p>
            </div>
            <div style={{ flexShrink:0 }}><Image src="/leo-bluntchart.png" alt="Leo zodiac sign illustration" width={260} height={260} style={{ borderRadius:20, filter:"drop-shadow(0 0 40px #e8a09018)" }} priority/></div>
          </div>
          <div style={{ background:"var(--card)", border:"1px solid #e8a09020", borderRadius:18, padding:"28px 32px", marginBottom:48 }}>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"var(--signColor)", marginBottom:18 }}>Leo at a Glance</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0px 48px" }}>{[["Dates","July 23 – August 22"],["Element","Fire"],["Quality","Fixed"],["Ruling Planet","Sun ☉"],["Day","Sunday"],["Color","Gold, Orange"],["Greatest Compatibility","Aries, Sagittarius, Gemini, Libra"],["Strengths","Generous, warm, charismatic, creative, loyal, confident"],["Weaknesses","Arrogant, attention-seeking, dramatic, stubborn, ego-sensitive"]].map(([l,v],i) => (<div key={i} style={{ display:"flex", gap:12, padding:"12px 0", borderBottom:"0.5px solid rgba(255,255,255,0.05)" }}><span style={{ color:"rgba(232,228,240,0.4)", minWidth:180, fontWeight:500, fontSize:15 }}>{l}</span><span style={{ color:"rgba(232,228,240,0.75)", fontSize:15, fontWeight:500 }}>{v}</span></div>))}</div>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom:48 }}><div className="c">
        <p className="pp" style={{ fontSize:17 }}>Leo is the fifth sign of the zodiac and the heart of the astrological world. Ruled by the Sun — the center of the solar system — Leo doesn't orbit anything. They are the center. This isn't arrogance; it's cosmology.</p>
        <p className="pp">As a Fixed Fire sign, Leo combines sustaining energy with passionate expression. They don't perform for attention; they perform because existing quietly feels like a waste of their considerable gifts. The strength is radiance. The shadow is the devastation when that light isn't reflected back.</p>
        <h2 className="h2s">What are the key Leo personality traits?</h2>
        <p className="pp">The Leo personality is built on warmth and creative self-expression. They don't just enter a room — they improve it. Their energy is genuinely generous: they want everyone to feel special. The catch is they also need to feel special in return.</p><p className="pp">Leo's confidence is misread as arrogance. Arrogance says 'I'm better than you.' Leo confidence says 'I know who I am.' The problem is their sense of self is more fragile than it appears — they need regular reassurance that they matter.</p><p className="pp">At their best, Leo makes everyone feel like a star — generous, encouraging, joyful. At their worst, they make every situation about themselves, sulk without enough praise, and mistake loyalty for unconditional agreement.</p>
        <h2 className="h2s">What are Leo&apos;s strengths and weaknesses?</h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
          <div style={{ background:"rgba(93,202,165,0.04)", border:"0.5px solid rgba(93,202,165,0.15)", borderRadius:14, padding:"22px" }}><div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--teal)", marginBottom:12 }}>Strengths</div><ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>{[
                  "Natural charisma — lights up every room",
                  "Creative vision — sees and creates beauty everywhere",
                  "Generous spirit — gives time, energy, and praise freely",
                  "Fierce loyalty — fights for their people",
                  "Inspiring presence — makes others feel capable",
                  "Courage — faces challenges with genuine bravery",
          ].map((s,i) => <li key={i}><span style={{ color:"var(--teal)", marginRight:10 }}>✓</span>{s}</li>)}</ul></div>
          <div style={{ background:"rgba(212,83,126,0.04)", border:"0.5px solid rgba(212,83,126,0.15)", borderRadius:14, padding:"22px" }}><div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--rose)", marginBottom:12 }}>Weaknesses</div><ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>{[
                  "Ego sensitivity — takes minor slights as major injuries",
                  "Attention dependency — withers without validation",
                  "Dramatic reactions — turns small problems into spectacles",
                  "Stubborn pride — won't apologize even when clearly wrong",
                  "Credit seeking — struggles to share the spotlight",
                  "Inability to receive criticism — even constructive feedback stings",
          ].map((s,i) => <li key={i}><span style={{ color:"var(--rose)", marginRight:10 }}>✗</span>{s}</li>)}</ul></div>
        </div>
        <h2 className="h2s">How does Leo behave in love and relationships?</h2>
        <p className="pp">Leo loves like the Sun — constantly, generously, and with an expectation of being orbited. Attentive, romantic, demonstrative. They want their partner adored AND visible. Private love isn't enough.</p><p className="pp">The challenge is ego. They struggle to separate partner's independence from personal rejection. Partner has a night out? Leo's first thought: 'why wasn't I invited?'</p><p className="pp">What Leo needs: open admiration, physical affection, and a partner proud of them publicly. They want someone with their own shine who also reflects Leo's light.</p>
        <h2 className="h2s">Which zodiac signs are most compatible with Leo?</h2>
        <div className="compat" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:28 }}>{[{ level:"High Compatibility", signs:"Aries, Sagittarius, Libra", color:"var(--teal)", desc:"Fellow fire signs match energy. Libra fans Leo's flames with social grace and admiration." },{ level:"Strong Compatibility", signs:"Gemini, Leo", color:"#8ec5e8", desc:"Gemini keeps Leo entertained. Two Leos: power couple or competition — often both." },{ level:"Challenging", signs:"Taurus, Scorpio", color:"var(--signColor)", desc:"Taurus won't be moved by drama. Scorpio matches intensity but power struggles are relentless. Both Fixed." }].map((c,i) => (<div key={i} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:14, padding:"22px 20px" }}><div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:c.color, marginBottom:8 }}>{c.level}</div><div style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, marginBottom:10 }}>{c.signs}</div><p style={{ fontSize:14, color:"rgba(232,228,240,0.5)", lineHeight:1.65 }}>{c.desc}</p></div>))}</div>
        <h2 className="h2s">What is Leo like at work and in their career?</h2>
        <p className="pp">Leo thrives in creative expression and visible impact: entertainment, leadership, teaching, public speaking, marketing, luxury brands. Natural performers everywhere.</p><p className="pp">They struggle in anonymous roles and environments rewarding blending in. A Leo who can't express individuality becomes genuinely depressed.</p><p className="pp">As leaders, Leo inspires fierce loyalty through warmth and charisma. They celebrate teams publicly and defend fiercely. Weakness: taking credit and struggling with unpadded feedback.</p>
        <h2 className="h2s">How does Leo handle friendships?</h2>
        <p className="pp">A Leo friend plans the birthday party, hypes you before interviews, and posts about how amazing you are. Generosity with praise is genuine and loyalty is fierce.</p><p className="pp">The challenge: Leo friendships require attention. They need to feel valued. If they sense they're taken for granted, warmth disappears fast — and dramatically.</p>
        <h2 className="h2s">What does it mean to have Leo as your Rising or Moon sign?</h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
          <div style={{ background:"var(--card)", border:"0.5px solid #e8a09020", borderRadius:14, padding:"22px" }}><div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--signColor)", marginBottom:10 }}>Leo Rising</div><p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>Leo Rising projects warmth, confidence, and magnetic presence. Noticed immediately — through energy, style, or their actual hair. Visible self-assurance and theatrical gestures.</p></div>
          <div style={{ background:"var(--card)", border:"0.5px solid rgba(196,168,255,0.15)", borderRadius:14, padding:"22px" }}><div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"#c4a8ff", marginBottom:10 }}>Leo Moon</div><p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>Leo Moon needs to feel special to the people who matter — not for ego, for emotional survival. If you love them but don't show it, it doesn't register. Under stress: take over or withdraw into wounded pride.</p></div>
        </div>
        <h2 className="h2s">What does Sun mean for Leo?</h2>
        <p className="pp">The Sun governs identity, ego, vitality, and creative self-expression. As Leo's ruler, it places the self at the center — structurally, not selfishly. Leo's purpose is to shine, create, and express.</p><p className="pp">The Sun also represents the father and authority figures. Many Leos have a significant father relationship that shapes their need for recognition and understanding of leadership.</p>
        <div style={{ background:"#e8a09008", border:"0.5px solid #e8a09020", borderRadius:20, padding:"44px 36px", textAlign:"center", margin:"48px 0" }}>
          <p style={{ fontSize:12, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"var(--gold)", marginBottom:12 }}>Your Sun sign is the headline</p>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, lineHeight:1.15, marginBottom:14 }}>Being a Leo is one thing.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#e8a090,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Knowing your full chart is another.</em></h2>
          <p style={{ fontSize:16, color:"var(--dim)", lineHeight:1.72, maxWidth:500, margin:"0 auto 24px" }}>Your Leo Sun interacts with Moon, Rising, Venus, Mars, and houses in ways generic descriptions can&apos;t capture. ~1,500 words, brutally honest.</p>
          <Link href="/#try-it" className="cta" style={{ maxWidth:380 }}>Get My Full Reading · $15 ✦</Link>
        </div>
      </div></section>

      <section style={{ padding:"64px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}><div className="c">
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, marginBottom:28 }}>BluntChart vs <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>generic descriptions</em></h2>
        <div style={{ border:"1px solid var(--border)", borderRadius:16, overflow:"hidden", maxWidth:780 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 140px 140px", background:"#0a0a14", borderBottom:"1px solid var(--border)" }}><div style={{ padding:"16px 22px", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"var(--dim)" }}>Feature</div><div style={{ padding:"16px 22px", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"var(--gold)" }}>BluntChart</div><div style={{ padding:"16px 22px", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"var(--dim)" }}>Others</div></div>
          {[{ f:"Based on YOUR exact birth chart", us:true, them:"Sun sign only" },{ f:"Personalized to your placements", us:true, them:false },{ f:"Brutally honest insights", us:true, them:"Vague positives" },{ f:"~1,500 words about YOUR chart", us:true, them:"Generic" },{ f:"Natal chart wheel included", us:true, them:false },{ f:"One-time payment", us:true, them:"Subscription" }].map((r,i,a) => (<div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 140px 140px", borderBottom:i<a.length-1?"0.5px solid rgba(255,255,255,0.04)":"none" }}><div style={{ padding:"15px 22px", fontSize:15, color:"var(--white)", fontWeight:500 }}>{r.f}</div><div style={{ padding:"15px 22px", display:"flex", alignItems:"center" }}>{r.us?<span style={{ color:"var(--teal)", fontWeight:700 }}>✓</span>:<span style={{ color:"var(--rose)", opacity:.6 }}>✗</span>}</div><div style={{ padding:"15px 22px", display:"flex", alignItems:"center" }}>{r.them===true?<span style={{ color:"var(--teal)" }}>✓</span>:r.them===false?<span style={{ color:"var(--rose)", opacity:.6 }}>✗</span>:<span style={{ color:"#6b6585", fontStyle:"italic", fontSize:14 }}>{r.them}</span>}</div></div>))}
        </div>
      </div></section>

      <section style={{ padding:"64px 0" }}><div className="c">
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, marginBottom:28 }}>People keep sending it <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>to their friends.</em></h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:16 }}>{REVIEWS.map((r,i) => (<div key={i} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:14, padding:24, position:"relative", overflow:"hidden" }}><div style={{ position:"absolute", top:-12, right:18, fontFamily:"var(--font-display)", fontSize:"5rem", color:"rgba(107,47,212,0.08)", lineHeight:1, pointerEvents:"none" }}>&ldquo;</div><div style={{ display:"flex", gap:2, marginBottom:12 }}>{Array.from({length:5}).map((_,j) => <span key={j} style={{ color:"var(--gold)", fontSize:13 }}>★</span>)}</div><p style={{ fontSize:15, color:"var(--white)", lineHeight:1.68, marginBottom:16, fontStyle:"italic" }}>&ldquo;{r.text}&rdquo;</p><div style={{ display:"flex", alignItems:"center", gap:10 }}><div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#6b2fd4,#d4537e)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:700, color:"#fff" }}>{r.init}</div><div><div style={{ fontSize:14, fontWeight:600, color:"var(--dim)" }}>{r.name}</div><div style={{ fontSize:12, color:"rgba(232,228,240,0.25)" }}>{r.meta}</div></div></div></div>))}</div>
      </div></section>

      <section style={{ padding:"64px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}><div className="c" style={{ maxWidth:820, margin:"0 auto" }}>
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, marginBottom:32 }}>Leo <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#e8a090,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>FAQ</em></h2>
        {FAQS.map((f,i) => (<details key={i} style={{ borderBottom:"0.5px solid rgba(255,255,255,0.08)" }}><summary style={{ padding:"20px 0", fontSize:16, fontWeight:600, color:"#e8e4f0", cursor:"pointer", listStyle:"none", display:"flex", alignItems:"center", justifyContent:"space-between" }}>{f.q}<span style={{ color:"var(--purple)", fontSize:20, fontWeight:700, flexShrink:0, marginLeft:16 }}>+</span></summary><p style={{ fontSize:15, color:"rgba(232,228,240,0.6)", lineHeight:1.78, paddingBottom:20, paddingRight:32 }}>{f.a}</p></details>))}
      </div></section>

      <section style={{ padding:"64px 0" }}><div className="c" style={{ textAlign:"center" }}>
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, marginBottom:14 }}>Your Leo Sun is one placement.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#e8a090,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Your full chart tells the real story.</em></h2>
        <p style={{ fontSize:16, color:"var(--dim)", maxWidth:480, margin:"0 auto 24px", lineHeight:1.72 }}>10 insights from your exact birth chart. Brutally honest, ~1,500 words.</p>
        <Link href="/#try-it" className="cta" style={{ maxWidth:380 }}>Get My Full Reading · $15 ✦</Link>
      </div></section>

      <section style={{ padding:"48px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}><div className="c">
        <h3 style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, color:"rgba(232,228,240,0.4)", marginBottom:18, textAlign:"center" }}>Explore other zodiac signs</h3>
        <div className="snav" style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10 }}>{OTHER_SIGNS.map((s) => (<Link key={s.slug} href={`/zodiac-signs/${s.slug}`} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px 10px", background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:10, textDecoration:"none", fontSize:14, color:"var(--dim)" }}><span style={{ fontFamily:"Georgia, serif", fontSize:16 }}>{s.symbol}</span> {s.name}</Link>))}</div>
      </div></section>

      </>
  );
}