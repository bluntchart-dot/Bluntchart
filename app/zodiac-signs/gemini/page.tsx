"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const OTHER_SIGNS = [
  { name:"Aries", symbol:"♈", slug:"aries" },
  { name:"Taurus", symbol:"♉", slug:"taurus" },
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
  { q:"What are the Gemini dates?", a:"May 21 to June 20. Those on cusp dates should check their birth chart." },
  { q:"What planet rules Gemini?", a:"Mercury, the planet of communication and thought. It gives Gemini their quick mind and restless curiosity." },
  { q:"What element is Gemini?", a:"Air, along with Libra and Aquarius. Gemini is Mutable Air — adapting and communicating." },
  { q:"What signs are most compatible with Gemini?", a:"Aries and Leo (fire signs matching energy), and Aquarius (air sign sharing intellectual curiosity)." },
  { q:"Why are Gemini called two-faced?", a:"It's a misconception. Their duality is genuine versatility — they contain multiple perspectives and see every side simultaneously." },
  { q:"What is Gemini Rising?", a:"Your outward personality projects curiosity and wit. People see you as quick, youthful, and adaptable." },
  { q:"What is Gemini Moon?", a:"You process emotions through thought and conversation. Anxiety spirals when you can't articulate what's wrong." },
];

export default function GeminiPage() {
  const [scrolled, setScrolled] = useState(false);
  if (typeof window !== "undefined") { useState(() => { const fn = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", fn, { passive: true }); }); }
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--font-display:'Playfair Display',Georgia,serif;--font-body:'DM Sans',system-ui,sans-serif;--bg:#09090f;--card:#0e0e1a;--border:rgba(255,255,255,0.08);--border2:rgba(255,255,255,0.12);--white:#e8e4f0;--dim:rgba(232,228,240,0.55);--gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);--purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5;--signColor:#8ec5e8}
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
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 0%,#8ec5e80a 0%,transparent 60%)", pointerEvents:"none" }}/>
        <div className="c" style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:13, color:"rgba(232,228,240,0.3)", marginBottom:28 }}><Link href="/" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>BluntChart</Link><span style={{ margin:"0 8px" }}>/</span><Link href="/zodiac-signs" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>Zodiac Signs</Link><span style={{ margin:"0 8px" }}>/</span><span style={{ color:"rgba(232,228,240,0.5)" }}>Gemini</span></div>
          <div style={{ display:"flex", alignItems:"center", gap:48, marginBottom:32, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:320 }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                <div style={{ width:60, height:60, borderRadius:16, background:"linear-gradient(145deg, #8ec5e820, #8ec5e808)", border:"1px solid #8ec5e840", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 28px #8ec5e810" }}><span style={{ fontSize:32, color:"var(--signColor)", fontFamily:"Georgia, serif", filter:"drop-shadow(0 0 6px #8ec5e860)" }}>♊</span></div>
                <div>
                  <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.8rem,7vw,4.2rem)", fontWeight:900, lineHeight:1.02, margin:0, background:"linear-gradient(135deg, #8ec5e8, #d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Gemini</h1>
                  <p style={{ fontSize:16, color:"rgba(232,228,240,0.5)", marginTop:4 }}>May 21 – June 20</p>
                </div>
              </div>
              <p style={{ fontSize:20, fontFamily:"var(--font-display)", fontStyle:"italic", color:"rgba(232,228,240,0.65)", lineHeight:1.55, maxWidth:560 }}>&ldquo;Two people in one body. Both of them are talking. Neither of them is finished.&rdquo;</p>
            </div>
            <div style={{ flexShrink:0 }}><Image src="/gemini-bluntchart.png" alt="Gemini zodiac sign illustration" width={260} height={260} style={{ borderRadius:20, filter:"drop-shadow(0 0 40px #8ec5e818)" }} priority/></div>
          </div>
          <div style={{ background:"var(--card)", border:"1px solid #8ec5e820", borderRadius:18, padding:"28px 32px", marginBottom:48 }}>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"var(--signColor)", marginBottom:18 }}>Gemini at a Glance</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0px 48px" }}>{[["Dates","May 21 – June 20"],["Element","Air"],["Quality","Mutable"],["Ruling Planet","Mercury ☿"],["Day","Wednesday"],["Color","Yellow, Light Green"],["Greatest Compatibility","Aries, Leo, Aquarius"],["Strengths","Adaptable, witty, curious, versatile, communicative"],["Weaknesses","Inconsistent, indecisive, scattered, superficial, anxious"]].map(([l,v],i) => (<div key={i} style={{ display:"flex", gap:12, padding:"12px 0", borderBottom:"0.5px solid rgba(255,255,255,0.05)" }}><span style={{ color:"rgba(232,228,240,0.4)", minWidth:180, fontWeight:500, fontSize:15 }}>{l}</span><span style={{ color:"rgba(232,228,240,0.75)", fontSize:15, fontWeight:500 }}>{v}</span></div>))}</div>
          </div>
        </div>
      </section>

      <section style={{ paddingBottom:48 }}><div className="c">
        <p className="pp" style={{ fontSize:17 }}>Gemini is the third sign of the zodiac and the communicator of the astrological world. Ruled by Mercury, the planet of the mind, Gemini thinks faster than they feel, connects everything to everything else, and gets bored the moment you think you've figured them out.</p>
        <p className="pp">As a Mutable Air sign, Gemini combines adaptive energy with intellectual curiosity. They can talk to anyone, learn anything, and reinvent themselves on a Tuesday afternoon. The gift is range. The shadow is never going deep enough to stay.</p>
        <h2 className="h2s">What are the key Gemini personality traits?</h2>
        <p className="pp">The Gemini personality is built on curiosity and speed. Their mind moves at a pace that leaves most people several sentences behind. They're already on the third topic while you're still processing the first.</p><p className="pp">Gemini is the social chameleon of the zodiac. They can charm a boardroom at noon, debate philosophy at dinner, and text three people simultaneously. Fascinating company but unreliable in situations requiring sustained focus.</p><p className="pp">At their best, Gemini makes you see connections you never noticed and turns boring Tuesdays into adventures. At their worst, they promised to be there and forgot, and have seventeen unfinished projects.</p>
        <h2 className="h2s">What are Gemini&apos;s strengths and weaknesses?</h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
          <div style={{ background:"rgba(93,202,165,0.04)", border:"0.5px solid rgba(93,202,165,0.15)", borderRadius:14, padding:"22px" }}><div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--teal)", marginBottom:12 }}>Strengths</div><ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>{[
                  "Mental agility — processes faster than any sign",
                  "Social versatility — connects with anyone anywhere",
                  "Communication talent — explains complex things simply",
                  "Adaptability — thrives in change that paralyzes others",
                  "Humor — lightens any room with genuine wit",
                  "Curiosity — never stops learning, always interesting",
          ].map((s,i) => <li key={i}><span style={{ color:"var(--teal)", marginRight:10 }}>✓</span>{s}</li>)}</ul></div>
          <div style={{ background:"rgba(212,83,126,0.04)", border:"0.5px solid rgba(212,83,126,0.15)", borderRadius:14, padding:"22px" }}><div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--rose)", marginBottom:12 }}>Weaknesses</div><ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>{[
                  "Inconsistency — says one thing, does another",
                  "Scattered focus — starts ten things, finishes three",
                  "Emotional avoidance — intellectualizes instead of feeling",
                  "Superficiality — skims when depth is needed",
                  "Unreliability — forgets commitments genuinely",
                  "Anxiety — overthinking spirals under pressure",
          ].map((s,i) => <li key={i}><span style={{ color:"var(--rose)", marginRight:10 }}>✗</span>{s}</li>)}</ul></div>
        </div>
        <h2 className="h2s">How does Gemini behave in love and relationships?</h2>
        <p className="pp">Gemini falls in love with minds first. If you can't hold their intellectual attention, physical chemistry alone won't save you. They need conversation, novelty, and the feeling that there's always something new to discover.</p><p className="pp">The challenge is depth. Gemini can skim the surface of intimacy brilliantly but going deeper requires sitting still with uncomfortable feelings — their least favorite activity.</p><p className="pp">What Gemini needs: mental stimulation, freedom to maintain other friendships, and a partner who doesn't mistake variety for lack of commitment. They're looking for someone who makes the conversation even better.</p>
        <h2 className="h2s">Which zodiac signs are most compatible with Gemini?</h2>
        <div className="compat" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:28 }}>{[{ level:"High Compatibility", signs:"Aries, Leo, Aquarius", color:"var(--teal)", desc:"Fire and air signs matching energy. Aries brings spontaneity; Leo brings warmth; Aquarius shares intellectual freedom." },{ level:"Strong Compatibility", signs:"Libra, Sagittarius", color:"#8ec5e8", desc:"Libra shares social intelligence. Sagittarius is Gemini's opposite — mutual expansion through debate." },{ level:"Challenging", signs:"Virgo, Pisces", color:"var(--signColor)", desc:"Virgo's criticism stings. Pisces' emotional depth overwhelms Gemini's processing style." }].map((c,i) => (<div key={i} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:14, padding:"22px 20px" }}><div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:c.color, marginBottom:8 }}>{c.level}</div><div style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, marginBottom:10 }}>{c.signs}</div><p style={{ fontSize:14, color:"rgba(232,228,240,0.5)", lineHeight:1.65 }}>{c.desc}</p></div>))}</div>
        <h2 className="h2s">What is Gemini like at work and in their career?</h2>
        <p className="pp">Gemini thrives in communication, quick thinking, and variety. Journalism, marketing, teaching, sales, tech, writing — anything where no two days are the same.</p><p className="pp">They struggle in repetitive environments. A bored Gemini doesn't just lose interest — they get physically restless.</p><p className="pp">As leaders, Gemini inspires through ideas. They brainstorm brilliantly and delegate naturally. The weakness is follow-through — ten ideas for every one executed.</p>
        <h2 className="h2s">How does Gemini handle friendships?</h2>
        <p className="pp">A Gemini friend knows about the restaurant that just opened, the podcast you haven't heard, and the person you should meet. They make life more interesting by existing in it.</p><p className="pp">The challenge is reliability — late replies, cancelled plans. Their attention is a spotlight that moves. Accept this and you get a connection that's one of a kind.</p>
        <h2 className="h2s">What does it mean to have Gemini as your Rising or Moon sign?</h2>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
          <div style={{ background:"var(--card)", border:"0.5px solid #8ec5e820", borderRadius:14, padding:"22px" }}><div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--signColor)", marginBottom:10 }}>Gemini Rising</div><p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>People with Gemini Rising project curiosity, wit, and youthful energy. Talkative, quick, hard to pin down. Expressive faces, animated gestures, often look younger than their age.</p></div>
          <div style={{ background:"var(--card)", border:"0.5px solid rgba(196,168,255,0.15)", borderRadius:14, padding:"22px" }}><div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"#c4a8ff", marginBottom:10 }}>Gemini Moon</div><p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>Gemini Moon processes emotions by talking — or overthinking. They need to articulate feelings to understand them. Under stress, they scatter — too many tabs open, nervous energy, rapid topic changes.</p></div>
        </div>
        <h2 className="h2s">What does Mercury mean for Gemini?</h2>
        <p className="pp">Mercury governs communication, thought, and information. As Gemini's ruler, it gives quick mind, verbal agility, and insatiable curiosity. Mercury moves faster than any planet — and so does Gemini's attention.</p><p className="pp">When Mercury is healthy, it creates a brilliant communicator. When overwhelmed, it creates anxiety, scattered thinking, and the inability to finish a sentence — or a project.</p>
        <div style={{ background:"#8ec5e808", border:"0.5px solid #8ec5e820", borderRadius:20, padding:"44px 36px", textAlign:"center", margin:"48px 0" }}>
          <p style={{ fontSize:12, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"var(--gold)", marginBottom:12 }}>Your Sun sign is the headline</p>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, lineHeight:1.15, marginBottom:14 }}>Being a Gemini is one thing.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#8ec5e8,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Knowing your full chart is another.</em></h2>
          <p style={{ fontSize:16, color:"var(--dim)", lineHeight:1.72, maxWidth:500, margin:"0 auto 24px" }}>Your Gemini Sun interacts with Moon, Rising, Venus, Mars, and houses in ways generic descriptions can&apos;t capture. ~1,500 words, brutally honest.</p>
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
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, marginBottom:32 }}>Gemini <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#8ec5e8,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>FAQ</em></h2>
        {FAQS.map((f,i) => (<details key={i} style={{ borderBottom:"0.5px solid rgba(255,255,255,0.08)" }}><summary style={{ padding:"20px 0", fontSize:16, fontWeight:600, color:"#e8e4f0", cursor:"pointer", listStyle:"none", display:"flex", alignItems:"center", justifyContent:"space-between" }}>{f.q}<span style={{ color:"var(--purple)", fontSize:20, fontWeight:700, flexShrink:0, marginLeft:16 }}>+</span></summary><p style={{ fontSize:15, color:"rgba(232,228,240,0.6)", lineHeight:1.78, paddingBottom:20, paddingRight:32 }}>{f.a}</p></details>))}
      </div></section>

      <section style={{ padding:"64px 0" }}><div className="c" style={{ textAlign:"center" }}>
        <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, marginBottom:14 }}>Your Gemini Sun is one placement.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#8ec5e8,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Your full chart tells the real story.</em></h2>
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