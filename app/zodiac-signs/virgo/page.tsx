"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const OTHER_SIGNS = [
  { name:"Aries", symbol:"♈", slug:"aries" },
  { name:"Taurus", symbol:"♉", slug:"taurus" },
  { name:"Gemini", symbol:"♊", slug:"gemini" },
  { name:"Cancer", symbol:"♋", slug:"cancer" },
  { name:"Leo", symbol:"♌", slug:"leo" },
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
  { text:"My therapist has been saying the same thing for six months. My chart said it better in one paragraph.", name:"Dani L.", meta:"Capricorn Sun · Gemini Moon", init:"D" },
  { text:"Finally astrology that doesn't sound like it was written for everyone and no one at the same time.", name:"Zara O.", meta:"Leo Sun · Scorpio Rising", init:"Z" },
  { text:"Twelve dollars. I spent two hours talking about it with my best friend. Insane value.", name:"Chloe M.", meta:"Sagittarius Sun · Aquarius Moon", init:"C" },
];

const FAQS = [
  { q:"What are the Virgo dates?", a:"Virgo season runs from August 23 to September 22. People born during this window have Virgo as their Sun sign. The exact start date can shift by a day year to year due to astronomical timing, so those born on August 22 or September 23 should check their birth chart to confirm which sign the Sun was actually in at their moment of birth." },
  { q:"What planet rules Virgo?", a:"Virgo is ruled by Mercury, the planet of communication, intellect, and analysis. Mercury gives Virgo their razor-sharp mind, attention to detail, verbal precision, and relentless need to understand how things work. It also explains why Virgo can overthink a text message for 45 minutes and still not send it — Mercury doesn't do impulsive, and neither does Virgo." },
  { q:"What element is Virgo?", a:"Virgo is an Earth sign, along with Taurus and Capricorn. Earth signs are practical, grounded, and reliable. What makes Virgo unique among earth signs is its Mutable quality — meaning Virgo adapts and refines, while Taurus sustains (Fixed Earth) and Capricorn initiates (Cardinal Earth)." },
  { q:"What signs are most compatible with Virgo?", a:"Virgo pairs best with Taurus and Capricorn (fellow earth signs who share their practical approach), and Cancer and Scorpio (water signs who provide emotional depth without chaos). Virgo often has a powerful magnetic attraction to their opposite sign Pisces, though the relationship requires Virgo to loosen control and Pisces to get more grounded." },
  { q:"What are Virgo's biggest weaknesses?", a:"Virgo's biggest weaknesses are perfectionism, overthinking, and relentless self-criticism that they rarely show anyone. They can be hypercritical of others without realizing it, anxious about things that haven't happened yet, and so focused on details that they miss the bigger picture entirely. Their standards are high — for themselves most of all." },
  { q:"What is Virgo Rising?", a:"Virgo Rising (Ascendant in Virgo) means your outward personality projects Virgo energy — people see you as composed, observant, helpful, and quietly competent before they know anything else about you. You give off an impression of someone who has it together. Clean style, precise language, and a tendency to notice the one thing that's slightly off. Your Rising sign requires your exact birth time to calculate." },
  { q:"What is Virgo Moon?", a:"A Virgo Moon means your emotional processing runs through analysis. You feel things deeply but your first instinct is to understand the feeling rather than sit with it. Under stress, you organize, clean, or problem-solve compulsively. You express love through acts of service — fixing things, helping, showing up — and emotional chaos genuinely unsettles you." },
];

export default function VirgoPage() {
  const [scrolled, setScrolled] = useState(false);
  if (typeof window !== "undefined") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useState(() => { const fn = () => setScrolled(window.scrollY > 40); window.addEventListener("scroll", fn, { passive: true }); });
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --font-display:'Playfair Display',Georgia,serif;
          --font-body:'DM Sans',system-ui,sans-serif;
          --bg:#09090f;--card:#0e0e1a;
          --border:rgba(255,255,255,0.08);--border2:rgba(255,255,255,0.12);
          --white:#e8e4f0;--dim:rgba(232,228,240,0.55);
          --gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);
          --purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5;--signColor:#8ec5a0;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--white);font-family:var(--font-body);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .c{max-width:1100px;margin:0 auto;padding:0 24px}
        .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;transition:all .3s}.nav.on{background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
        .logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:10px;letter-spacing:.02em}.logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .nl{display:flex;align-items:center;gap:28px;list-style:none}.nl a{font-size:.83rem;font-weight:500;color:var(--dim);text-decoration:none;letter-spacing:.04em;text-transform:uppercase;transition:color .2s}.nl a:hover{color:var(--white)}.ncta{color:var(--gold)!important;border:1px solid var(--gold-dim);padding:6px 15px;border-radius:4px}.ncta:hover{background:var(--gold-dim)}
        .h2s{font-family:var(--font-display);font-size:clamp(1.5rem,3.2vw,2rem);font-weight:800;line-height:1.15;margin:56px 0 18px;color:var(--white)}
        .pp{font-size:16px;color:rgba(232,228,240,0.62);line-height:1.82;margin-bottom:18px}
        .cta{display:block;width:100%;max-width:480px;margin:0 auto;background:linear-gradient(135deg,#f0b84a,#e8854a);color:#0d0800;border:none;border-radius:12px;padding:18px 24px;font-size:16px;font-weight:700;font-family:inherit;cursor:pointer;text-align:center;text-decoration:none;transition:opacity .2s,transform .15s}.cta:hover{opacity:.88;transform:translateY(-1px)}
        .footer{border-top:1px solid var(--border);padding:48px 0 30px;position:relative;z-index:1}
        .fi{display:flex;align-items:flex-start;justify-content:space-between;gap:36px;flex-wrap:wrap;margin-bottom:36px}
        .fb p{font-size:.82rem;color:var(--dim);max-width:240px;line-height:1.6;margin-top:8px}
        .fl h4{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--dim);margin-bottom:14px}
        .fl ul{list-style:none;display:flex;flex-direction:column;gap:10px}
        .fl a{font-size:.83rem;color:rgba(232,228,240,.35);text-decoration:none;transition:color .2s}.fl a:hover{color:var(--white)}
        .slinks{display:flex;gap:10px;margin-top:14px}
        .sl2{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:0.5px solid var(--border);border-radius:8px;color:var(--dim);text-decoration:none;font-size:.82rem;font-weight:700;transition:all .2s}.sl2:hover{border-color:rgba(107,47,212,.4);color:var(--gold);background:rgba(107,47,212,.1)}
        .fb2{border-top:1px solid var(--border);padding-top:22px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
        .disc{font-size:.73rem;color:rgba(232,228,240,.25);max-width:520px;line-height:1.55}
        .copy{font-size:.73rem;color:rgba(232,228,240,.2)}
        @media(max-width:768px){.nl{display:none!important}.compat{grid-template-columns:1fr!important}.snav{grid-template-columns:repeat(4,1fr)!important}.fi{flex-direction:column;gap:28px}.fb2{flex-direction:column;align-items:flex-start}}
      `}</style>

      {/* NAV */}
      <nav className={`nav${scrolled?" on":""}`}>
        <div className="c" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Link href="/" className="logo">
            <Image src="/mascot.png" alt="BluntChart" width={34} height={34} style={{ borderRadius:"50%" }}/>
            <span className="g">BluntChart</span>
          </Link>
          <ul className="nl">
            <li><Link href="/zodiac-signs">Zodiac Signs</Link></li>
            <li><Link href="/free-birth-chart">Free Birth Chart</Link></li>
            <li><Link href="/#reveals">What We Reveal</Link></li>
            <li><Link href="/#reviews">Reviews</Link></li>
            <li><Link href="/#try-it" className="ncta">Get Reading $15</Link></li>
          </ul>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop:120, paddingBottom:48, position:"relative" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 0%,rgba(142,197,160,0.06) 0%,transparent 60%)", pointerEvents:"none" }}/>
        <div className="c" style={{ position:"relative", zIndex:1 }}>
          {/* Breadcrumb */}
          <div style={{ fontSize:13, color:"rgba(232,228,240,0.3)", marginBottom:28 }}>
            <Link href="/" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>BluntChart</Link>
            <span style={{ margin:"0 8px" }}>/</span>
            <Link href="/zodiac-signs" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>Zodiac Signs</Link>
            <span style={{ margin:"0 8px" }}>/</span>
            <span style={{ color:"rgba(232,228,240,0.5)" }}>Virgo</span>
          </div>

          {/* Hero layout */}
          <div style={{ display:"flex", alignItems:"center", gap:48, marginBottom:32, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:320 }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                <div style={{ width:60, height:60, borderRadius:16, background:"linear-gradient(145deg, rgba(142,197,160,0.15), rgba(142,197,160,0.05))", border:"1px solid rgba(142,197,160,0.25)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 28px rgba(142,197,160,0.08)" }}>
                  <span style={{ fontSize:32, color:"var(--signColor)", fontFamily:"Georgia, serif", filter:"drop-shadow(0 0 6px rgba(142,197,160,0.4))" }}>♍</span>
                </div>
                <div>
                  <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.8rem,7vw,4.2rem)", fontWeight:900, lineHeight:1.02, margin:0, background:"linear-gradient(135deg, #8ec5a0, #5dcaa5)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                    Virgo
                  </h1>
                  <p style={{ fontSize:16, color:"rgba(232,228,240,0.5)", marginTop:4 }}>The Maiden · August 23 – September 22</p>
                </div>
              </div>
              <p style={{ fontSize:20, fontFamily:"var(--font-display)", fontStyle:"italic", color:"rgba(232,228,240,0.65)", lineHeight:1.55, maxWidth:560 }}>
                &ldquo;Notices everything. Says almost nothing. Fixes it before you realize it was broken.&rdquo;
              </p>
            </div>
            <div style={{ flexShrink:0 }}>
              <Image
                src="/virgo-bluntchart.png"
                alt="Virgo zodiac sign illustration — BluntChart cosmic cat mascot"
                width={260}
                height={260}
                style={{ borderRadius:20, filter:"drop-shadow(0 0 40px rgba(142,197,160,0.15))" }}
                priority
              />
            </div>
          </div>

          {/* Summary box */}
          <div style={{ background:"var(--card)", border:"1px solid rgba(142,197,160,0.15)", borderRadius:18, padding:"28px 32px", marginBottom:48 }}>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"var(--signColor)", marginBottom:18, letterSpacing:"0.02em" }}>Virgo at a Glance</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0px 48px" }}>
              {[
                ["Dates", "August 23 – September 22"],
                ["Element", "Earth 🌿"],
                ["Quality", "Mutable"],
                ["Ruling Planet", "Mercury ☿"],
                ["Symbol", "The Maiden ♍"],
                ["Day", "Wednesday"],
                ["Color", "Grey, Beige, Sage Green"],
                ["Greatest Compatibility", "Taurus, Capricorn, Cancer"],
                ["Strengths", "Analytical, kind, hardworking, reliable, patient"],
                ["Weaknesses", "Perfectionist, overthinking, self-critical, anxious"],
              ].map(([label, value], i) => (
                <div key={i} style={{ display:"flex", gap:12, padding:"12px 0", borderBottom:"0.5px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ color:"rgba(232,228,240,0.4)", minWidth:180, fontWeight:500, fontSize:15 }}>{label}</span>
                  <span style={{ color:"rgba(232,228,240,0.75)", fontSize:15, fontWeight:500 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section style={{ paddingBottom:48 }}>
        <div className="c">

          {/* INTRO */}
          <p className="pp" style={{ fontSize:17 }}>
            Virgo is the sixth sign of the zodiac, and the one most likely to have already noticed the typo in your email, reorganized your kitchen, and said nothing about either. Ruled by Mercury, the planet of communication and intellect, Virgo processes the world through analysis — not to judge, but to understand. They see the details everyone else misses, and they can&apos;t unsee them.
          </p>
          <p className="pp">
            As a Mutable Earth sign, Virgo combines the grounded practicality of earth with the adaptable flexibility of mutable quality. This makes them the zodiac&apos;s most effective problem-solvers — not through brute force like Aries or stubborn persistence like Taurus, but through careful observation, methodical thinking, and a genuine desire to make things work better. They serve not because they&apos;re submissive, but because they find purpose in being useful. The shadow of that gift is that they sometimes forget they deserve the same care they give everyone else.
          </p>

          {/* PERSONALITY TRAITS */}
          <h2 className="h2s">What are the key Virgo personality traits?</h2>
          <p className="pp">
            The Virgo personality is built on observation and quiet competence. They are the person who reads the room before speaking, prepares before anyone asks, and somehow always knows where the extra phone charger is. This isn&apos;t fussy or neurotic — it&apos;s a mind that runs on pattern recognition and a heart that genuinely wants to help.
          </p>
          <p className="pp">
            Virgos are privately one of the most emotional signs in the zodiac, but you&apos;d never know it from the outside. They process feelings through logic, which means their first response to emotional pain is to analyze it, categorize it, and determine what went wrong. This makes them excellent at helping others through crises and terrible at accepting help when they&apos;re the ones falling apart. They&apos;d rather reorganize a closet than admit they&apos;re sad.
          </p>
          <p className="pp">
            At their best, Virgo is the person who shows up without being asked, fixes the thing no one else noticed was broken, and makes you feel like someone competent has your back. At their worst, they&apos;re the person who corrects your grammar mid-argument, silently judges your life choices, and sets standards for themselves so impossibly high that they spend most of their time feeling like they&apos;re failing.
          </p>

          {/* STRENGTHS & WEAKNESSES */}
          <h2 className="h2s">What are Virgo&apos;s strengths and weaknesses?</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
            <div style={{ background:"rgba(93,202,165,0.04)", border:"0.5px solid rgba(93,202,165,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--teal)", marginBottom:12 }}>Strengths</div>
              <ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>
                {["Razor-sharp analytical mind — sees what everyone else misses",
                  "Quiet reliability — always shows up, always follows through",
                  "Genuine kindness — serves others without expecting praise",
                  "Practical problem-solving — turns chaos into order effortlessly",
                  "Deep loyalty — once committed, they're all in",
                  "Intellectual depth — curious, well-read, and endlessly thoughtful",
                ].map((s,i) => <li key={i}><span style={{ color:"var(--teal)", marginRight:10 }}>✓</span>{s}</li>)}
              </ul>
            </div>
            <div style={{ background:"rgba(212,83,126,0.04)", border:"0.5px solid rgba(212,83,126,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--rose)", marginBottom:12 }}>Weaknesses</div>
              <ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>
                {["Crippling perfectionism — nothing is ever good enough",
                  "Chronic overthinking — replays conversations for days",
                  "Harsh self-criticism — their inner voice is merciless",
                  "Hypercritical of others — notices flaws they can't un-notice",
                  "Difficulty accepting help — would rather suffer in silence",
                  "Anxiety spirals — worries about problems that don't exist yet",
                ].map((s,i) => <li key={i}><span style={{ color:"var(--rose)", marginRight:10 }}>✗</span>{s}</li>)}
              </ul>
            </div>
          </div>

          {/* LOVE */}
          <h2 className="h2s">How does Virgo behave in love and relationships?</h2>
          <p className="pp">
            Virgo falls in love slowly, carefully, and with their eyes wide open. Where Aries charges in and Leo performs, Virgo observes. They study you. They notice whether you tip well, how you talk to service workers, whether you remember the small things they mentioned three weeks ago. By the time a Virgo tells you they love you, they&apos;ve already run a comprehensive internal audit and decided you&apos;re worth the risk.
          </p>
          <p className="pp">
            In relationships, Virgo expresses love through acts of service — not grand romantic gestures, but the kind of care that actually matters. They&apos;ll remember your doctor&apos;s appointment, pack your lunch when you&apos;re stressed, and research the best route to avoid traffic before you even leave. The challenge is that Virgo can become so focused on taking care of their partner that they forget to let themselves be taken care of.
          </p>
          <p className="pp">
            What Virgo needs in a partner: someone who sees through their composure, appreciates their effort without taking it for granted, and has enough emotional intelligence to coax them into vulnerability. Virgo needs a partner who is emotionally stable, authentically kind, and willing to gently push back when Virgo starts spiraling into self-criticism. Disorganized, unreliable, or emotionally volatile partners will exhaust a Virgo faster than anything.
          </p>

          {/* COMPATIBILITY */}
          <h2 className="h2s">Which zodiac signs are most compatible with Virgo?</h2>
          <p className="pp">
            Compatibility in astrology depends on the full birth chart, but Sun sign compatibility offers a useful starting point. Virgo tends to connect most naturally with signs that value substance over flash and can handle their quiet intensity.
          </p>
          <div className="compat" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:28 }}>
            {[
              { level:"High Compatibility", signs:"Taurus, Capricorn", color:"var(--teal)", desc:"Fellow earth signs who share Virgo's practical values, work ethic, and preference for stability. These relationships are built on mutual respect and quiet, steady devotion." },
              { level:"Strong Compatibility", signs:"Cancer, Scorpio", color:"#8ec5e8", desc:"Water signs that provide the emotional depth Virgo secretly craves. Cancer nurtures Virgo's hidden softness; Scorpio matches their intensity and values loyalty above all." },
              { level:"Magnetic but Challenging", signs:"Pisces, Gemini", color:"var(--signColor)", desc:"Pisces is Virgo's opposite sign — profound attraction, completely different approaches to reality. Gemini shares Mercury rulership but their chaos can overwhelm Virgo's need for order." },
            ].map((c,i) => (
              <div key={i} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:14, padding:"22px 20px" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:c.color, marginBottom:8 }}>{c.level}</div>
                <div style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, marginBottom:10 }}>{c.signs}</div>
                <p style={{ fontSize:14, color:"rgba(232,228,240,0.5)", lineHeight:1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          {/* CAREER */}
          <h2 className="h2s">What is Virgo like at work and in their career?</h2>
          <p className="pp">
            Virgo thrives in environments that reward precision, reliability, and intellectual rigor. They are not built for jobs that require improvisation without preparation, or workplaces where quality doesn&apos;t matter. Give a Virgo a complex problem, a quiet workspace, and the autonomy to build a system — then watch them quietly become indispensable.
          </p>
          <p className="pp">
            They make excellent researchers, editors, healthcare professionals, data analysts, accountants, therapists, and project managers — any role where attention to detail and methodical thinking are valued. They struggle in environments that are chaotic, political, or reward style over substance. A Virgo forced into a role that requires constant self-promotion will physically wilt.
          </p>
          <p className="pp">
            As leaders, Virgo leads by example and through systems. They&apos;re not the inspirational speech type — they&apos;re the type who quietly builds a process that makes the entire team 30% more efficient. Their weakness is delegation: they genuinely believe they can do it better themselves, and they&apos;re often right, which makes the habit even harder to break.
          </p>

          {/* FRIENDSHIPS */}
          <h2 className="h2s">How does Virgo handle friendships?</h2>
          <p className="pp">
            A Virgo friend is the one who remembers your allergies, arrives ten minutes early, and gives advice that&apos;s annoyingly accurate. They show love through practical support — driving you to the airport, proofreading your resume, researching the best therapist in your area. If a Virgo is spending their time on you, that is their love language. Don&apos;t underestimate it.
          </p>
          <p className="pp">
            The challenge with Virgo friendships is that they have a small capacity for social energy and a high bar for who gets access to their real self. They can appear reserved or distant, not because they don&apos;t care but because they&apos;re selective about who they let in. Once you&apos;re in Virgo&apos;s inner circle, the loyalty is absolute — but the critiques are included, whether you asked for them or not.
          </p>

          {/* VIRGO RISING & MOON */}
          <h2 className="h2s">What does it mean to have Virgo as your Rising or Moon sign?</h2>
          <p className="pp">
            Your Sun sign is only one piece of your astrological profile. Many people with Virgo energy in other placements feel its influence just as strongly — sometimes more so.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
            <div style={{ background:"var(--card)", border:"0.5px solid rgba(142,197,160,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--signColor)", marginBottom:10 }}>Virgo Rising (Ascendant)</div>
              <p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>
                People with Virgo Rising project composure, intelligence, and understated competence before they say a word. Others perceive them as put-together, observant, and slightly reserved. They tend to have clean features, a polished appearance, and an energy that says &ldquo;I already noticed that.&rdquo; Virgo Rising people are the ones who get asked for directions, recommendations, and opinions — because they look like they know.
              </p>
            </div>
            <div style={{ background:"var(--card)", border:"0.5px solid rgba(196,168,255,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"#c4a8ff", marginBottom:10 }}>Virgo Moon</div>
              <p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>
                A Virgo Moon processes emotions through analysis and problem-solving. When they feel something, their first instinct is to understand why — not to sit with the feeling. Under stress, they clean, organize, or throw themselves into work. They need routines and order to feel emotionally safe, and they express love through practical care rather than verbal affirmation. Emotional chaos is their kryptonite.
              </p>
            </div>
          </div>

          {/* MERCURY RULER */}
          <h2 className="h2s">What does Mercury as a ruling planet mean for Virgo?</h2>
          <p className="pp">
            Mercury is the planet of communication, intellect, analysis, and information processing. As Virgo&apos;s ruling planet, it gives the sign its exceptional mental precision, its gift for language, and its compulsive need to understand how things work. Mercury doesn&apos;t guess — it investigates. This is why Virgo approaches every situation with the assumption that the best strategy is gathering more information.
          </p>
          <p className="pp">
            Mercury also rules Gemini, but expresses differently through each sign. In Gemini, Mercury is social, quick, and scattered. In Virgo, Mercury is focused, methodical, and practical. Virgo&apos;s Mercury wants to organize information into something useful — a system, a plan, a solution. This makes Virgo one of the zodiac&apos;s most effective communicators, not because they talk the most, but because when they do talk, every word is chosen carefully.
          </p>

          {/* CTA mid-page */}
          <div style={{ background:"rgba(142,197,160,0.04)", border:"0.5px solid rgba(142,197,160,0.15)", borderRadius:20, padding:"44px 36px", textAlign:"center", margin:"48px 0" }}>
            <p style={{ fontSize:12, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"var(--gold)", marginBottom:12 }}>Your Sun sign is the headline</p>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, lineHeight:1.15, marginBottom:14 }}>
              Being a Virgo is one thing.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#8ec5a0,#5dcaa5)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Knowing your full chart is another.</em>
            </h2>
            <p style={{ fontSize:16, color:"var(--dim)", lineHeight:1.72, maxWidth:500, margin:"0 auto 24px" }}>
              Your Virgo Sun interacts with your Moon, Rising, Venus, Mars, and house placements in ways that generic sign descriptions can&apos;t capture. A BluntChart reading tells you what YOUR specific chart says — ~1,500 words, brutally honest, no horoscope fluff.
            </p>
            <Link href="/#try-it" className="cta" style={{ maxWidth:380 }}>Get My Full Reading · $15 ✦</Link>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section style={{ padding:"64px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}>
        <div className="c">
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><span style={{ width:22, height:1, background:"var(--gold)" }}/><span style={{ fontSize:12, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"var(--gold)" }}>Beyond your Sun sign</span></div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, lineHeight:1.1, marginBottom:12 }}>
            BluntChart vs <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>generic Virgo descriptions</em>
          </h2>
          <p style={{ fontSize:15, color:"var(--dim)", maxWidth:500, lineHeight:1.72, marginBottom:32 }}>Every Virgo page tells you the same thing. Here&apos;s what they leave out.</p>
          <div style={{ border:"1px solid var(--border)", borderRadius:16, overflow:"hidden", maxWidth:780 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 140px 140px", background:"#0a0a14", borderBottom:"1px solid var(--border)" }}>
              <div style={{ padding:"16px 22px", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"var(--dim)" }}>Feature</div>
              <div style={{ padding:"16px 22px", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"var(--gold)" }}>BluntChart</div>
              <div style={{ padding:"16px 22px", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"var(--dim)" }}>Others</div>
            </div>
            {[
              { f:"Based on YOUR exact birth chart", us:true, them:"Sun sign only" },
              { f:"Personalized to your placements", us:true, them:false },
              { f:"Brutally honest, specific insights", us:true, them:"Vague positives" },
              { f:"~1,500 words about YOUR chart", us:true, them:"Generic paragraphs" },
              { f:"Includes natal chart wheel", us:true, them:false },
              { f:"One-time payment", us:true, them:"Subscription" },
            ].map((row,i,arr) => (
              <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 140px 140px", borderBottom:i<arr.length-1?"0.5px solid rgba(255,255,255,0.04)":"none" }}>
                <div style={{ padding:"15px 22px", fontSize:15, color:"var(--white)", fontWeight:500 }}>{row.f}</div>
                <div style={{ padding:"15px 22px", display:"flex", alignItems:"center" }}>{row.us?<span style={{ color:"var(--teal)", fontWeight:700, fontSize:16 }}>✓</span>:<span style={{ color:"var(--rose)", opacity:.6 }}>✗</span>}</div>
                <div style={{ padding:"15px 22px", display:"flex", alignItems:"center" }}>{row.them===true?<span style={{ color:"var(--teal)" }}>✓</span>:row.them===false?<span style={{ color:"var(--rose)", opacity:.6, fontSize:16 }}>✗</span>:<span style={{ color:"#6b6585", fontStyle:"italic", fontSize:14 }}>{row.them}</span>}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding:"64px 0" }}>
        <div className="c">
          <div style={{ marginBottom:32 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><span style={{ width:22, height:1, background:"var(--gold)" }}/><span style={{ fontSize:12, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"var(--gold)" }}>What people say</span></div>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, lineHeight:1.1 }}>
              People keep sending it <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>to their friends.</em>
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))", gap:16 }}>
            {REVIEWS.map((r,i) => (
              <div key={i} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:14, padding:24, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-12, right:18, fontFamily:"var(--font-display)", fontSize:"5rem", color:"rgba(107,47,212,0.08)", lineHeight:1, pointerEvents:"none" }}>&ldquo;</div>
                <div style={{ display:"flex", gap:2, marginBottom:12 }}>{Array.from({length:5}).map((_,j) => <span key={j} style={{ color:"var(--gold)", fontSize:13 }}>★</span>)}</div>
                <p style={{ fontSize:15, color:"var(--white)", lineHeight:1.68, marginBottom:16, fontStyle:"italic" }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#6b2fd4,#d4537e)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontSize:14, fontWeight:700, color:"#fff" }}>{r.init}</div>
                  <div><div style={{ fontSize:14, fontWeight:600, color:"var(--dim)" }}>{r.name}</div><div style={{ fontSize:12, color:"rgba(232,228,240,0.25)" }}>{r.meta}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding:"64px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}>
        <div className="c" style={{ maxWidth:820, margin:"0 auto" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><span style={{ width:22, height:1, background:"var(--signColor)" }}/><span style={{ fontSize:12, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"var(--signColor)" }}>Common questions</span></div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, lineHeight:1.1, marginBottom:32 }}>
            Virgo <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#8ec5a0,#5dcaa5)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>FAQ</em>
          </h2>
          {FAQS.map((f,i) => (
            <details key={i} style={{ borderBottom:"0.5px solid rgba(255,255,255,0.08)" }}>
              <summary style={{ padding:"20px 0", fontSize:16, fontWeight:600, color:"#e8e4f0", cursor:"pointer", listStyle:"none", display:"flex", alignItems:"center", justifyContent:"space-between" }}>{f.q}<span style={{ color:"var(--purple)", fontSize:20, fontWeight:700, flexShrink:0, marginLeft:16 }}>+</span></summary>
              <p style={{ fontSize:15, color:"rgba(232,228,240,0.6)", lineHeight:1.78, paddingBottom:20, paddingRight:32 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section style={{ padding:"64px 0" }}>
        <div className="c" style={{ textAlign:"center" }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, marginBottom:14 }}>
            Your Virgo Sun is one placement.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#8ec5a0,#5dcaa5)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Your full chart tells the real story.</em>
          </h2>
          <p style={{ fontSize:16, color:"var(--dim)", maxWidth:480, margin:"0 auto 24px", lineHeight:1.72 }}>10 insights from your exact birth chart. Brutally honest, ~1,500 words, specific to you.</p>
          <Link href="/#try-it" className="cta" style={{ maxWidth:380 }}>Get My Full Reading · $15 ✦</Link>
        </div>
      </section>

      {/* OTHER SIGNS NAV */}
      <section style={{ padding:"48px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}>
        <div className="c">
          <h3 style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, color:"rgba(232,228,240,0.4)", marginBottom:18, textAlign:"center" }}>Explore other zodiac signs</h3>
          <div className="snav" style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10 }}>
            {OTHER_SIGNS.map((s) => (
              <Link key={s.slug} href={`/zodiac-signs/${s.slug}`} style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, padding:"12px 10px", background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:10, textDecoration:"none", fontSize:14, color:"var(--dim)", transition:"border-color .2s" }}>
                <span style={{ fontFamily:"Georgia, serif", fontSize:16 }}>{s.symbol}</span> {s.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
</>
  );
}