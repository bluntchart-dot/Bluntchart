"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const OTHER_SIGNS = [
  { name:"Aries", symbol:"♈", slug:"aries" },
  { name:"Gemini", symbol:"♊", slug:"gemini" },
  { name:"Cancer", symbol:"♋", slug:"cancer" },
  { name:"Leo", symbol:"♌", slug:"leo" },
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
  { q:"What are the Taurus dates?", a:"Taurus season runs from April 20 to May 20. Those born on cusp dates should check their birth chart." },
  { q:"What planet rules Taurus?", a:"Venus, the planet of love, beauty, and value. It gives Taurus refined taste, sensual nature, and deep attachment to comfort." },
  { q:"What element is Taurus?", a:"Earth, along with Virgo and Capricorn. Taurus is Fixed Earth — sustaining and preserving rather than initiating or adapting." },
  { q:"What signs are most compatible with Taurus?", a:"Cancer (emotional depth meets physical security), Virgo (shared practical values), and Capricorn (mutual ambition and work ethic)." },
  { q:"Why are Taurus so stubborn?", a:"Their Fixed quality means they sustain and persist. Change threatens the stability they've carefully built. Pushing them only makes them dig in harder." },
  { q:"What is Taurus Rising?", a:"Your outward personality projects Venus energy — calm, attractive, grounded. You make others feel safe." },
  { q:"What is Taurus Moon?", a:"Your emotional needs center on physical comfort, routine, and security. You process slowly and show love through touch." },
];

export default function TaurusPage() {
  const [scrolled, setScrolled] = useState(false);
  if (typeof window !== "undefined") { useState(() => { const fn = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", fn, { passive: true }); }); }
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--font-display:'Playfair Display',Georgia,serif;--font-body:'DM Sans',system-ui,sans-serif;--bg:#09090f;--card:#0e0e1a;--border:rgba(255,255,255,0.08);--border2:rgba(255,255,255,0.12);--white:#e8e4f0;--dim:rgba(232,228,240,0.55);--gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);--purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5;--signColor:#9bc88a}
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
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 0%,#9bc88a0a 0%,transparent 60%)", pointerEvents:"none" }}/>
        <div className="c" style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:13, color:"rgba(232,228,240,0.3)", marginBottom:28 }}><Link href="/" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>BluntChart</Link><span style={{ margin:"0 8px" }}>/</span><Link href="/zodiac-signs" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>Zodiac Signs</Link><span style={{ margin:"0 8px" }}>/</span><span style={{ color:"rgba(232,228,240,0.5)" }}>Taurus</span></div>
          <div style={{ display:"flex", alignItems:"center", gap:48, marginBottom:32, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:320 }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                <div style={{ width:60, height:60, borderRadius:16, background:"linear-gradient(145deg, #9bc88a20, #9bc88a08)", border:"1px solid #9bc88a40", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 28px #9bc88a10" }}><span style={{ fontSize:32, color:"var(--signColor)", fontFamily:"Georgia, serif", filter:"drop-shadow(0 0 6px #9bc88a60)" }}>♉</span></div>
                <div>
                  <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.8rem,7vw,4.2rem)", fontWeight:900, lineHeight:1.02, margin:0, background:"linear-gradient(135deg, #9bc88a, #d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Taurus</h1>
                  <p style={{ fontSize:16, color:"rgba(232,228,240,0.5)", marginTop:4 }}>April 20 – May 20</p>
                </div>
              </div>
              <p style={{ fontSize:20, fontFamily:"var(--font-display)", fontStyle:"italic", color:"rgba(232,228,240,0.65)", lineHeight:1.55, maxWidth:560 }}>&ldquo;Won't be rushed. Won't be moved. Won't apologize for wanting what they want.&rdquo;</p>
            </div>
            <div style={{ flexShrink:0 }}><Image src="/taurus-bluntchart.png" alt="Taurus zodiac sign illustration" width={260} height={260} style={{ borderRadius:20, filter:"drop-shadow(0 0 40px #9bc88a18)" }} priority/></div>
          </div>
          <div style={{ background:"var(--card)", border:"1px solid #9bc88a20", borderRadius:18, padding:"28px 32px", marginBottom:48 }}>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"var(--signColor)", marginBottom:18 }}>Taurus at a Glance</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0px 48px" }}>{[["Dates","April 20 – May 20"],["Element","Earth"],["Quality","Fixed"],["Ruling Planet","Venus ♀"],["Day","Friday"],["Color","Green, Pink"],["Greatest Compatibility","Cancer, Virgo, Capricorn"],["Strengths","Patient, reliable, devoted, sensual, determined"],["Weaknesses","Stubborn, possessive, materialistic, resistant to change"]].map(([l,v],i) => (<div key={i} style={{ display:"flex", gap:12, padding:"12px 0", borderBottom:"0.5px solid rgba(255,255,255,0.05)" }}><span style={{ color:"rgba(232,228,240,0.4)", minWidth:180, fontWeight:500, fontSize:15 }}>{l}</span><span style={{ color:"rgba(232,228,240,0.75)", fontSize:15, fontWeight:500 }}>{v}</span></div>))}</div>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom:48 }}><div className="c">
        <p className="pp" style={{ fontSize:17 }}>Taurus is the second sign of the zodiac and the anchor of the astrological world. Where Aries sparks the fire, Taurus builds the house around it. Ruled by Venus, the planet of beauty, pleasure, and value, Taurus knows exactly what they want and what they're worth. They don't chase. They attract.</p>
        <p className="pp">As a Fixed Earth sign, Taurus combines sustaining energy with grounded practicality. This makes them the most reliable sign — the one who shows up, follows through, and builds things that last. Their patience borders on geological. The flip side is a stubbornness so profound it can outlast marriages and careers.</p>
        <h2 className="h2s">What are the key Taurus personality traits?</h2>
        <p className="pp">The Taurus personality is built on stability and sensory experience. They experience the world through touch, taste, sound, and texture in a way other signs don't. A good meal isn't just food — it's an event. A comfortable bed isn't a luxury — it's a non-negotiable.</p><p className="pp">Taurus is dependable in a way that makes other signs look flaky. When they commit — to a person, a project, a Thursday dinner reservation — they mean it. The problem is that this reliability can calcify into rigidity. They do things the way they've always done them because change feels like a threat.</p><p className="pp">At their best, Taurus makes you feel safe, fed, and genuinely appreciated. At their worst, they refuse to leave a relationship that ended three years ago, eat the same meal every Tuesday for a decade, and respond to feedback with the emotional equivalent of a brick wall.</p>
        <h2 className="h2s">What are Taurus&apos;s strengths and weaknesses?</h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
          <div style={{ background:"rgba(93,202,165,0.04)", border:"0.5px solid rgba(93,202,165,0.15)", borderRadius:14, padding:"22px" }}><div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--teal)", marginBottom:12 }}>Strengths</div><ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>{[
                  "Unshakeable determination — they finish what they start",
                  "Sensory intelligence — creates beauty and comfort instinctively",
                  "Financial wisdom — builds wealth patiently",
                  "Loyal devotion — once committed, they're all in",
                  "Emotional steadiness — the calm in everyone's storm",
                  "Physical endurance — outlasts every other sign",
          ].map((s,i) => <li key={i}><span style={{ color:"var(--teal)", marginRight:10 }}>✓</span>{s}</li>)}</ul></div>
          <div style={{ background:"rgba(212,83,126,0.04)", border:"0.5px solid rgba(212,83,126,0.15)", borderRadius:14, padding:"22px" }}><div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--rose)", marginBottom:12 }}>Weaknesses</div><ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>{[
                  "Stubborn beyond reason — won't change even when they should",
                  "Possessive in relationships — treats people like property",
                  "Comfort addiction — avoids growth because it's uncomfortable",
                  "Holds grudges silently — forgives slowly if at all",
                  "Fear of change — stays in bad situations too long",
                  "Materialistic tendencies — confuses having with being",
          ].map((s,i) => <li key={i}><span style={{ color:"var(--rose)", marginRight:10 }}>✗</span>{s}</li>)}</ul></div>
        </div>
        <h2 className="h2s">How does Taurus behave in love and relationships?</h2>
        <p className="pp">Taurus loves slowly, deliberately, and with their entire body. They don't fall — they settle in, like roots into soil. They need time to trust. But once they do, their devotion is absolute.</p><p className="pp">The challenge is letting go. Taurus stays in relationships long past their expiration date because the devil they know feels safer than uncertainty. They equate commitment with permanence.</p><p className="pp">What Taurus needs: consistency, physical affection, and someone who respects their pace. Grand gestures mean nothing followed by silence. They'd rather have someone who makes coffee every morning than someone who plans surprise trips and forgets anniversaries.</p>
        <h2 className="h2s">Which zodiac signs are most compatible with Taurus?</h2>
        <div className="compat" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:28 }}>{[{ level:"High Compatibility", signs:"Cancer, Virgo, Capricorn", color:"var(--teal)", desc:"Earth and water signs sharing Taurus' need for security. Cancer nurtures; Virgo shares practical values; Capricorn matches ambition." },{ level:"Strong Compatibility", signs:"Pisces, Taurus", color:"#8ec5e8", desc:"Pisces softens rigidity with imagination. Two Tauruses create unshakeable stability — or an immovable standoff." },{ level:"Challenging", signs:"Leo, Aquarius", color:"var(--signColor)", desc:"Leo's attention needs clash with Taurus' quiet confidence. Aquarius' unpredictability threatens stability." }].map((c,i) => (<div key={i} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:14, padding:"22px 20px" }}><div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:c.color, marginBottom:8 }}>{c.level}</div><div style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, marginBottom:10 }}>{c.signs}</div><p style={{ fontSize:14, color:"rgba(232,228,240,0.5)", lineHeight:1.65 }}>{c.desc}</p></div>))}</div>
        <h2 className="h2s">What is Taurus like at work and in their career?</h2>
        <p className="pp">Taurus excels in patience, craftsmanship, and long-term thinking. Finance, real estate, culinary arts, design — any field where building something tangible is rewarded.</p><p className="pp">They struggle with rapid change, pivot-heavy startup culture, and constant improvisation. Their desk is the best-organized in the office, same coffee mug since 2019.</p><p className="pp">As leaders, Taurus provides stability others rely on. They won't inspire with speeches, but they'll ensure funding, realistic deadlines, and nobody works hungry.</p>
        <h2 className="h2s">How does Taurus handle friendships?</h2>
        <p className="pp">A Taurus friend remembers your order, shows up with food when you're sick, and has had the same phone number for fifteen years. Love through consistency.</p><p className="pp">The challenge: possessive of friendships. They don't share easily and take it personally when friends drift toward new circles.</p>
        <h2 className="h2s">What does it mean to have Taurus as your Rising or Moon sign?</h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
          <div style={{ background:"var(--card)", border:"0.5px solid #9bc88a20", borderRadius:14, padding:"22px" }}><div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--signColor)", marginBottom:10 }}>Taurus Rising</div><p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>People with Taurus Rising project calm, groundedness, and hypnotic steadiness. Perceived as reliable, attractive, impossible to rush. Solid build, pleasing voice, natural elegance. They move deliberately and speak with intention.</p></div>
          <div style={{ background:"var(--card)", border:"0.5px solid rgba(196,168,255,0.15)", borderRadius:14, padding:"22px" }}><div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"#c4a8ff", marginBottom:10 }}>Taurus Moon</div><p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>Taurus Moon needs physical comfort and emotional predictability. They process slowly and need time before articulating what's wrong. Under stress, they retreat into comfort — food, sleep, familiar places. Love through touch and provision.</p></div>
        </div>
        <h2 className="h2s">What does Venus mean for Taurus?</h2>
        <p className="pp">Venus governs love, beauty, pleasure, and value. As Taurus' ruler, it gives refined taste, sensual nature, and deep appreciation for quality. Venus doesn't settle — it curates.</p><p className="pp">Venus also governs self-worth. Healthy Venus means knowing your worth and attracting abundance. Unhealthy Venus confuses possessions with security and clings to people like property.</p>
        <div style={{ background:"#9bc88a08", border:"0.5px solid #9bc88a20", borderRadius:20, padding:"44px 36px", textAlign:"center", margin:"48px 0" }}>
          <p style={{ fontSize:12, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"var(--gold)", marginBottom:12 }}>Your Sun sign is the headline</p>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, lineHeight:1.15, marginBottom:14 }}>Being a Taurus is one thing.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#9bc88a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Knowing your full chart is another.</em></h2>
          <p style={{ fontSize:16, color:"var(--dim)", lineHeight:1.72, maxWidth:500, margin:"0 auto 24px" }}>Your Taurus Sun interacts with Moon, Rising, Venus, Mars, and houses in ways generic descriptions can&apos;t capture. ~1,500 words, brutally honest.</p>
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
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, marginBottom:32 }}>Taurus <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#9bc88a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>FAQ</em></h2>
        {FAQS.map((f,i) => (<details key={i} style={{ borderBottom:"0.5px solid rgba(255,255,255,0.08)" }}><summary style={{ padding:"20px 0", fontSize:16, fontWeight:600, color:"#e8e4f0", cursor:"pointer", listStyle:"none", display:"flex", alignItems:"center", justifyContent:"space-between" }}>{f.q}<span style={{ color:"var(--purple)", fontSize:20, fontWeight:700, flexShrink:0, marginLeft:16 }}>+</span></summary><p style={{ fontSize:15, color:"rgba(232,228,240,0.6)", lineHeight:1.78, paddingBottom:20, paddingRight:32 }}>{f.a}</p></details>))}
      </div></section>

      <section style={{ padding:"64px 0" }}><div className="c" style={{ textAlign:"center" }}>
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, marginBottom:14 }}>Your Taurus Sun is one placement.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#9bc88a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Your full chart tells the real story.</em></h2>
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