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
  { name:"Virgo", symbol:"♍", slug:"virgo" },
  { name:"Libra", symbol:"♎", slug:"libra" },
  { name:"Scorpio", symbol:"♏", slug:"scorpio" },
  { name:"Sagittarius", symbol:"♐", slug:"sagittarius" },
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
  { q:"What are the Capricorn dates?", a:"Capricorn season runs from December 22 to January 19. People born during this window have Capricorn as their Sun sign. The exact start date can shift by a day year to year due to astronomical timing, so those born on December 21 or January 20 should check their birth chart to confirm which sign the Sun was actually in at their moment of birth." },
  { q:"What planet rules Capricorn?", a:"Capricorn is ruled by Saturn, the planet of discipline, structure, time, limitations, and karma. Saturn gives Capricorn their extraordinary work ethic, patience, respect for hierarchy, and understanding that nothing worthwhile comes without sustained effort. It also explains why Capricorn can feel burdened by responsibility, prone to pessimism, and convinced that the universe charges interest on every good thing." },
  { q:"What element is Capricorn?", a:"Capricorn is an Earth sign, along with Taurus and Virgo. Earth signs are practical, grounded, and focused on the material world. What makes Capricorn unique among earth signs is its Cardinal quality — meaning Capricorn initiates and builds with strategic purpose, while Taurus sustains (Fixed Earth) and Virgo refines (Mutable Earth)." },
  { q:"What signs are most compatible with Capricorn?", a:"Capricorn pairs best with Taurus and Virgo (fellow earth signs who share their values and work ethic), and Scorpio and Pisces (water signs who provide emotional depth that Capricorn secretly craves). Capricorn often has a powerful magnetic attraction to their opposite sign Cancer, though the relationship requires navigating fundamentally different approaches to security." },
  { q:"What are Capricorn's biggest weaknesses?", a:"Capricorn's biggest weaknesses are workaholism, emotional repression, and a tendency to measure their worth by their achievements. They can be rigid, pessimistic, and so focused on long-term goals that they forget to enjoy the present. Their stoicism can read as coldness, and their high standards can make the people around them feel like they're never good enough." },
  { q:"What is Capricorn Rising?", a:"Capricorn Rising (Ascendant in Capricorn) means your outward personality projects Capricorn energy — people see you as serious, composed, capable, and slightly reserved before they know anything else about you. You project competence and authority naturally. Capricorn Rising people often look mature beyond their years when young and age remarkably well. Your Rising sign requires your exact birth time to calculate." },
  { q:"What is Capricorn Moon?", a:"A Capricorn Moon means your emotional processing is controlled, strategic, and private. You feel deeply but express feelings sparingly. Under stress, you work harder — emotion gets converted into productivity. You need stability and structure in relationships, and you show love through acts of service, reliability, and building a secure foundation rather than grand emotional gestures." },
];

export default function CapricornPage() {
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
          --purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5;--signColor:#7a8c6e;
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
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 0%,rgba(122,140,110,0.06) 0%,transparent 60%)", pointerEvents:"none" }}/>
        <div className="c" style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:13, color:"rgba(232,228,240,0.3)", marginBottom:28 }}>
            <Link href="/" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>BluntChart</Link>
            <span style={{ margin:"0 8px" }}>/</span>
            <Link href="/zodiac-signs" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>Zodiac Signs</Link>
            <span style={{ margin:"0 8px" }}>/</span>
            <span style={{ color:"rgba(232,228,240,0.5)" }}>Capricorn</span>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:48, marginBottom:32, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:320 }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                <div style={{ width:60, height:60, borderRadius:16, background:"linear-gradient(145deg, rgba(122,140,110,0.15), rgba(122,140,110,0.05))", border:"1px solid rgba(122,140,110,0.25)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 28px rgba(122,140,110,0.08)" }}>
                  <span style={{ fontSize:32, color:"var(--signColor)", fontFamily:"Georgia, serif", filter:"drop-shadow(0 0 6px rgba(122,140,110,0.4))" }}>♑</span>
                </div>
                <div>
                  <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.8rem,7vw,4.2rem)", fontWeight:900, lineHeight:1.02, margin:0, background:"linear-gradient(135deg, #7a8c6e, #4a5a40)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                    Capricorn
                  </h1>
                  <p style={{ fontSize:16, color:"rgba(232,228,240,0.5)", marginTop:4 }}>The Sea-Goat · December 22 – January 19</p>
                </div>
              </div>
              <p style={{ fontSize:20, fontFamily:"var(--font-display)", fontStyle:"italic", color:"rgba(232,228,240,0.65)", lineHeight:1.55, maxWidth:560 }}>
                &ldquo;Won&rsquo;t tell you their five-year plan. Will just execute it while you&rsquo;re still making vision boards.&rdquo;
              </p>
            </div>
            <div style={{ flexShrink:0 }}>
              <Image
                src="/capricorn-bluntchart.png"
                alt="Capricorn zodiac sign illustration — BluntChart cosmic cat mascot"
                width={260}
                height={260}
                style={{ borderRadius:20, filter:"drop-shadow(0 0 40px rgba(122,140,110,0.15))" }}
                priority
              />
            </div>
          </div>

          <div style={{ background:"var(--card)", border:"1px solid rgba(122,140,110,0.15)", borderRadius:18, padding:"28px 32px", marginBottom:48 }}>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"var(--signColor)", marginBottom:18, letterSpacing:"0.02em" }}>Capricorn at a Glance</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0px 48px" }}>
              {[
                ["Dates", "December 22 – January 19"],
                ["Element", "Earth 🌍"],
                ["Quality", "Cardinal"],
                ["Ruling Planet", "Saturn ♄"],
                ["Symbol", "The Sea-Goat ♑"],
                ["Day", "Saturday"],
                ["Color", "Dark Brown, Charcoal, Forest Green"],
                ["Greatest Compatibility", "Taurus, Virgo, Scorpio"],
                ["Strengths", "Ambitious, disciplined, patient, strategic, loyal"],
                ["Weaknesses", "Workaholic, emotionally guarded, pessimistic, rigid"],
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

          <p className="pp" style={{ fontSize:17 }}>
            Capricorn is the tenth sign of the zodiac and the one most people underestimate — once. Ruled by Saturn, the planet of discipline, time, and hard-earned wisdom, Capricorn doesn&apos;t announce their ambitions. They execute them. Quietly, methodically, and with a patience that borders on geological. While other signs are posting about their goals, Capricorn is three years into a plan they never told anyone about, and they&apos;re ahead of schedule.
          </p>
          <p className="pp">
            As a Cardinal Earth sign, Capricorn combines the initiatory drive of cardinal quality with the grounded pragmatism of earth. This makes them the zodiac&apos;s most strategic sign — not dreamers, but builders. They see the mountain, they calculate the route, and they start climbing before sunrise. No shortcuts, no complaints, no asking for directions. Their ambition isn&apos;t flashy like Leo&apos;s or impulsive like Aries&apos; — it&apos;s structural. They don&apos;t want to be seen succeeding. They want to have succeeded, and then they want to build something bigger.
          </p>

          <h2 className="h2s">What are the key Capricorn personality traits?</h2>
          <p className="pp">
            The Capricorn personality is built on responsibility and self-reliance. From an absurdly young age, Capricorns feel the weight of obligation — to their families, to their goals, to some internal standard of excellence that nobody asked them to carry but they carry anyway. They are the child who acts like an adult and the adult who finally learns to be a child, often aging in reverse emotionally.
          </p>
          <p className="pp">
            Capricorns are strategic thinkers who see patterns where others see chaos. They assess risks, calculate odds, and rarely make a move without considering the second and third-order consequences. This makes them extraordinarily reliable in a crisis and extraordinarily frustrating at a party. They&apos;re the friend who actually reads the terms and conditions, who budgets for emergencies, and who quietly built a retirement plan while everyone else was buying concert tickets.
          </p>
          <p className="pp">
            At their best, Capricorn is the person who holds everything together, who builds institutions that outlast their creators, and who proves through their life that discipline and character produce results that talent alone never will. At their worst, they&apos;re the person who works through Christmas, who measures every relationship by what it produces, and who is so afraid of vulnerability that they build a fortress instead of a home.
          </p>

          <h2 className="h2s">What are Capricorn&apos;s strengths and weaknesses?</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
            <div style={{ background:"rgba(93,202,165,0.04)", border:"0.5px solid rgba(93,202,165,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--teal)", marginBottom:12 }}>Strengths</div>
              <ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>
                {["Relentless discipline — outworks every sign in the zodiac",
                  "Strategic patience — plays the long game and wins",
                  "Quiet loyalty — shows up consistently, not dramatically",
                  "Practical wisdom — advice that actually works in the real world",
                  "Self-reliance — never puts their stability in someone else's hands",
                  "Dry humor — unexpectedly funny once you earn their trust",
                ].map((s,i) => <li key={i}><span style={{ color:"var(--teal)", marginRight:10 }}>✓</span>{s}</li>)}
              </ul>
            </div>
            <div style={{ background:"rgba(212,83,126,0.04)", border:"0.5px solid rgba(212,83,126,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--rose)", marginBottom:12 }}>Weaknesses</div>
              <ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>
                {["Workaholism — equates rest with failure and play with waste",
                  "Emotional repression — buries feelings under to-do lists",
                  "Pessimistic outlook — prepares for the worst so consistently it becomes their worldview",
                  "Rigid standards — judges themselves and others by impossible benchmarks",
                  "Control issues — struggles to delegate or trust others' competence",
                  "Status fixation — can confuse net worth with self-worth",
                ].map((s,i) => <li key={i}><span style={{ color:"var(--rose)", marginRight:10 }}>✗</span>{s}</li>)}
              </ul>
            </div>
          </div>

          <h2 className="h2s">How does Capricorn behave in love and relationships?</h2>
          <p className="pp">
            Capricorn approaches love the way they approach everything else: seriously. They don&apos;t date for entertainment — they date to build. Every relationship is evaluated, whether consciously or not, against the question: &ldquo;Is this going somewhere?&rdquo; If the answer is no, Capricorn will exit with the efficiency of someone closing a tab they didn&apos;t mean to open.
          </p>
          <p className="pp">
            When Capricorn does commit, they commit completely. They&apos;re the partner who remembers the practical things — your car service is due, your lease renewal is next month, your dad&apos;s birthday is Thursday. Their love language is acts of service and long-term planning. Romance isn&apos;t flowers and poetry; it&apos;s the fact that they reorganized your filing system and set up an investment account in your name.
          </p>
          <p className="pp">
            What Capricorn needs in a partner: someone patient enough to wait for their walls to come down, ambitious enough to have their own goals, and emotionally intelligent enough to recognize that Capricorn&apos;s stoicism isn&apos;t coldness — it&apos;s armor they built young and haven&apos;t fully figured out how to remove. Capricorn needs a partner who values substance over spectacle, and who understands that love, for a Saturn-ruled sign, is something you prove over years, not profess over dinner.
          </p>

          <h2 className="h2s">Which zodiac signs are most compatible with Capricorn?</h2>
          <p className="pp">
            Compatibility depends on the full birth chart, but Sun sign compatibility offers a useful starting point. Capricorn connects most naturally with signs that value stability, loyalty, and depth over novelty.
          </p>
          <div className="compat" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:28 }}>
            {[
              { level:"High Compatibility", signs:"Taurus, Virgo", color:"var(--teal)", desc:"Fellow earth signs who share Capricorn's values: stability, loyalty, and building something real. Taurus provides sensual grounding; Virgo matches their analytical approach and work ethic." },
              { level:"Strong Compatibility", signs:"Scorpio, Pisces", color:"#8ec5e8", desc:"Water signs that access Capricorn's hidden emotional world. Scorpio matches their intensity and strategic mind; Pisces softens their edges and reminds them that not everything needs a plan." },
              { level:"Magnetic but Challenging", signs:"Cancer, Aries", color:"var(--signColor)", desc:"Cancer is Capricorn's opposite sign — deep attraction, opposing approaches to security. Aries' impulsiveness clashes with Capricorn's need for calculated action, but mutual respect for ambition is real." },
            ].map((c,i) => (
              <div key={i} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:14, padding:"22px 20px" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:c.color, marginBottom:8 }}>{c.level}</div>
                <div style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, marginBottom:10 }}>{c.signs}</div>
                <p style={{ fontSize:14, color:"rgba(232,228,240,0.5)", lineHeight:1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="h2s">What is Capricorn like at work and in their career?</h2>
          <p className="pp">
            This is where Capricorn truly comes alive. Work isn&apos;t just something they do — it&apos;s how they define themselves, for better and worse. They thrive in environments that reward competence, consistency, and long-term strategy. They are built for hierarchies, not because they blindly respect authority, but because they plan to be at the top of one.
          </p>
          <p className="pp">
            They make excellent executives, financial advisors, architects, engineers, surgeons, lawyers, and government officials — any role where precision, accountability, and the ability to play the long game are rewarded. They struggle in environments that are chaotic, politically unstable, or where success depends on charm rather than substance.
          </p>
          <p className="pp">
            As leaders, Capricorn sets the standard through personal example. They are the boss who works longer hours than anyone on their team, who expects excellence because they demonstrate it, and who earns respect through competence rather than charisma. Their weakness is warmth: they can be so focused on results that they forget the people producing them need encouragement, not just expectations.
          </p>

          <h2 className="h2s">How does Capricorn handle friendships?</h2>
          <p className="pp">
            A Capricorn friend is the one who shows up. Not with grand gestures or emotional speeches, but with consistent, reliable presence. They&apos;re the friend who drives you to the airport at 5 AM, who cosigns your lease without making it weird, and who gives you advice so practical it almost sounds cold — until you realize it saved you six months of wasted effort.
          </p>
          <p className="pp">
            The challenge with Capricorn friendships is that they can be difficult to access. They keep their circle small, not out of snobbery, but because they don&apos;t have the bandwidth for relationships that don&apos;t add substance to their life. They&apos;re not going to text you daily, but they will remember what you said three months ago and act on it without being asked. Capricorn&apos;s friendship is quiet, dependable, and worth more than most people realize — because they show love through doing, not saying.
          </p>

          <h2 className="h2s">What does it mean to have Capricorn as your Rising or Moon sign?</h2>
          <p className="pp">
            Your Sun sign is only one piece of your astrological profile. Many people with Capricorn energy in other placements feel its influence just as strongly — sometimes more so.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
            <div style={{ background:"var(--card)", border:"0.5px solid rgba(122,140,110,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--signColor)", marginBottom:10 }}>Capricorn Rising (Ascendant)</div>
              <p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>
                People with Capricorn Rising project seriousness, competence, and an air of quiet authority before they say a word. Others perceive them as mature, reliable, and slightly intimidating in a professional way. They tend to have sharp bone structure, a composed demeanor, and an energy that says &ldquo;I have somewhere important to be.&rdquo; Capricorn Rising people are the ones others instinctively trust with responsibility — even as strangers.
              </p>
            </div>
            <div style={{ background:"var(--card)", border:"0.5px solid rgba(196,168,255,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"#c4a8ff", marginBottom:10 }}>Capricorn Moon</div>
              <p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>
                A Capricorn Moon processes emotions with extreme privacy and control. They feel deeply but rarely show it — emotions are cataloged, managed, and dealt with on their own terms. Under stress, they become hyper-productive, converting emotional pain into work output. They need a partner who understands that their reserve isn&apos;t a lack of feeling but a deeply ingrained survival strategy. They express love through building, providing, and showing up reliably rather than emotional declarations.
              </p>
            </div>
          </div>

          <h2 className="h2s">What does Saturn as a ruling planet mean for Capricorn?</h2>
          <p className="pp">
            Saturn is the planet of time, discipline, structure, karma, and limitation. In mythology, Saturn is the taskmaster — the force that demands you earn everything you receive and that ensures you learn from everything you suffer. For Capricorn, this means an innate understanding that life has a cost and that the only currency that matters is sustained effort over time.
          </p>
          <p className="pp">
            Saturn&apos;s influence gives Capricorn their legendary patience, their respect for systems and hierarchies, and their quiet confidence that they will outlast everyone. It also gives them their heaviness — the sense that the world sits on their shoulders, that rest must be justified, and that joy is something to be earned rather than expected. The challenge for every Capricorn is learning that Saturn&apos;s lessons include knowing when to stop building and start living inside what they&apos;ve already built.
          </p>

          {/* CTA mid-page */}
          <div style={{ background:"rgba(122,140,110,0.04)", border:"0.5px solid rgba(122,140,110,0.15)", borderRadius:20, padding:"44px 36px", textAlign:"center", margin:"48px 0" }}>
            <p style={{ fontSize:12, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"var(--gold)", marginBottom:12 }}>Your Sun sign is the headline</p>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, lineHeight:1.15, marginBottom:14 }}>
              Being a Capricorn is one thing.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#7a8c6e,#4a5a40)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Knowing your full chart is another.</em>
            </h2>
            <p style={{ fontSize:16, color:"var(--dim)", lineHeight:1.72, maxWidth:500, margin:"0 auto 24px" }}>
              Your Capricorn Sun interacts with your Moon, Rising, Venus, Mars, and house placements in ways that generic sign descriptions can&apos;t capture. A BluntChart reading tells you what YOUR specific chart says — ~1,500 words, brutally honest, no horoscope fluff.
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
            BluntChart vs <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>generic Capricorn descriptions</em>
          </h2>
          <p style={{ fontSize:15, color:"var(--dim)", maxWidth:500, lineHeight:1.72, marginBottom:32 }}>Every Capricorn page tells you the same thing. Here&apos;s what they leave out.</p>
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
            Capricorn <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#7a8c6e,#4a5a40)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>FAQ</em>
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
            Your Capricorn Sun is one placement.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#7a8c6e,#4a5a40)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Your full chart tells the real story.</em>
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

      {/* FOOTER */}
      <footer className="footer">
        <div className="c">
          <div className="fi">
            <div className="fb">
              <Link href="/" className="logo"><span className="g">BluntChart</span></Link>
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
                <li><a href="/#try-it">Birth Chart · $15</a></li>
                <li><a href="/#waitlist">Compatibility · Coming Soon</a></li>
                <li><a href="/#waitlist">Year Ahead · Coming Soon</a></li>
                <li><a href="/#waitlist">Gift a Reading · Coming Soon</a></li>
              </ul>
            </div>
            <div className="fl">
              <h4>Free Tools</h4>
              <ul>
                <li><a href="/free-birth-chart">Free Birth Chart</a></li>
                <li><a href="/natal-chart">Natal Chart</a></li>
                <li><a href="/big-three-calculator">Big Three Calculator</a></li>
                <li><a href="/moon-sign-calculator">Moon Sign Calculator</a></li>
                <li><a href="/rising-sign-calculator">Rising Sign Calculator</a></li>
                <li><a href="/zodiac-signs">Zodiac Signs</a></li>
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