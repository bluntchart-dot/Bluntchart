"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const OTHER_SIGNS = [
  { name:"Taurus", symbol:"♉", slug:"taurus" }, { name:"Gemini", symbol:"♊", slug:"gemini" },
  { name:"Cancer", symbol:"♋", slug:"cancer" }, { name:"Leo", symbol:"♌", slug:"leo" },
  { name:"Virgo", symbol:"♍", slug:"virgo" }, { name:"Libra", symbol:"♎", slug:"libra" },
  { name:"Scorpio", symbol:"♏", slug:"scorpio" }, { name:"Sagittarius", symbol:"♐", slug:"sagittarius" },
  { name:"Capricorn", symbol:"♑", slug:"capricorn" }, { name:"Aquarius", symbol:"♒", slug:"aquarius" },
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
  { q:"What are the Aries dates?", a:"Aries season runs from March 21 to April 19. People born during this window have Aries as their Sun sign. The exact start date can shift by a day year to year due to astronomical timing, so those born on March 20 or April 20 should check their birth chart to confirm which sign the Sun was actually in at their moment of birth." },
  { q:"What planet rules Aries?", a:"Aries is ruled by Mars, the planet of war, action, desire, and physical energy. Mars gives Aries their competitive drive, directness, physical vitality, and fearless approach to challenges. It also explains why Aries can be impatient, aggressive, and quick to anger — Mars doesn't do subtle, and neither does Aries." },
  { q:"What element is Aries?", a:"Aries is a Fire sign, along with Leo and Sagittarius. Fire signs are passionate, energetic, and dynamic. What makes Aries unique among fire signs is its Cardinal quality — meaning Aries initiates and leads, while Leo sustains (Fixed Fire) and Sagittarius adapts (Mutable Fire)." },
  { q:"What signs are most compatible with Aries?", a:"Aries pairs best with Leo and Sagittarius (fellow fire signs who match their energy), and Gemini and Aquarius (air signs who provide intellectual stimulation without trying to control them). Aries often has a powerful magnetic attraction to their opposite sign Libra, though the relationship requires work on both sides." },
  { q:"What are Aries biggest weaknesses?", a:"Aries' biggest weaknesses are impatience, impulsiveness, and a short temper that flares hot and fast. They can be self-centered without realizing it, abandon projects when the excitement fades, and struggle with listening because they're already formulating their response before you finish talking." },
  { q:"What is Aries Rising?", a:"Aries Rising (Ascendant in Aries) means your outward personality projects Aries energy — people see you as bold, direct, confident, and energetic before they know anything else about you. You make strong first impressions, often have an athletic build or sharp features, and tend to walk fast and talk faster. Your Rising sign requires your exact birth time to calculate." },
  { q:"What is Aries Moon?", a:"An Aries Moon means your emotional processing is fast, direct, and action-oriented. You feel things intensely but move through emotions quickly — sometimes too quickly. Under stress, you fight rather than freeze. You need independence even in emotional intimacy, and you express love through doing, not just saying." },
];

export default function AriesPage() {
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
          --purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5;--aries:#e8a090;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--white);font-family:var(--font-body);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .c{max-width:1100px;margin:0 auto;padding:0 24px}
        .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;transition:all .3s}
        .nav.on{background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
        .logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:10px;letter-spacing:.02em}
        .logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .nl{display:flex;align-items:center;gap:28px;list-style:none}
        .nl a{font-size:.83rem;font-weight:500;color:var(--dim);text-decoration:none;letter-spacing:.04em;text-transform:uppercase;transition:color .2s}
        .nl a:hover{color:var(--white)}
        .ncta{color:var(--gold)!important;border:1px solid var(--gold-dim);padding:6px 15px;border-radius:4px}
        .ncta:hover{background:var(--gold-dim)}
        .ar-h2{font-family:var(--font-display);font-size:clamp(1.5rem,3.2vw,2rem);font-weight:800;line-height:1.15;margin:56px 0 18px;color:var(--white)}
        .ar-p{font-size:16px;color:rgba(232,228,240,0.62);line-height:1.82;margin-bottom:18px}
        .ar-cta{display:block;width:100%;max-width:480px;margin:0 auto;background:linear-gradient(135deg,#f0b84a,#e8854a);color:#0d0800;border:none;border-radius:12px;padding:18px 24px;font-size:16px;font-weight:700;font-family:inherit;cursor:pointer;text-align:center;text-decoration:none;transition:opacity .2s,transform .15s}
        .ar-cta:hover{opacity:.88;transform:translateY(-1px)}
        /* Footer styles matching main site */
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
        @media(max-width:768px){.nl{display:none!important}.ar-compat{grid-template-columns:1fr!important}.ar-signs-nav{grid-template-columns:repeat(4,1fr)!important}.fi{flex-direction:column;gap:28px}.fb2{flex-direction:column;align-items:flex-start}}
      `}</style>

      {/* NAV — matching main site with Zodiac Signs added */}
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
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 0%,rgba(232,160,144,.06) 0%,transparent 60%)", pointerEvents:"none" }}/>
        <div className="c" style={{ position:"relative", zIndex:1 }}>
          {/* Breadcrumb */}
          <div style={{ fontSize:13, color:"rgba(232,228,240,0.3)", marginBottom:28 }}>
            <Link href="/" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>BluntChart</Link>
            <span style={{ margin:"0 8px" }}>/</span>
            <Link href="/zodiac-signs" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>Zodiac Signs</Link>
            <span style={{ margin:"0 8px" }}>/</span>
            <span style={{ color:"rgba(232,228,240,0.5)" }}>Aries</span>
          </div>

          {/* Hero layout: text left, image right */}
          <div style={{ display:"flex", alignItems:"center", gap:48, marginBottom:32, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:320 }}>
              {/* Sign badge + title */}
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                <div style={{ width:60, height:60, borderRadius:16, background:"linear-gradient(145deg, rgba(232,160,144,0.15), rgba(232,160,144,0.05))", border:"1px solid rgba(232,160,144,0.25)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 28px rgba(232,160,144,0.08)" }}>
                  <span style={{ fontSize:32, color:"var(--aries)", fontFamily:"Georgia, serif", filter:"drop-shadow(0 0 6px rgba(232,160,144,0.4))" }}>♈</span>
                </div>
                <div>
                  <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.8rem,7vw,4.2rem)", fontWeight:900, lineHeight:1.02, margin:0, background:"linear-gradient(135deg, #e8a090, #d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                    Aries
                  </h1>
                  <p style={{ fontSize:16, color:"rgba(232,228,240,0.5)", marginTop:4 }}>The Ram · March 21 – April 19</p>
                </div>
              </div>

              {/* Tagline */}
              <p style={{ fontSize:20, fontFamily:"var(--font-display)", fontStyle:"italic", color:"rgba(232,228,240,0.65)", lineHeight:1.55, maxWidth:560 }}>
                &ldquo;Leads before being asked. Fights before thinking. Loves before protecting themselves.&rdquo;
              </p>
            </div>

            {/* Aries mascot image */}
            <div style={{ flexShrink:0 }}>
              <Image
                src="/aries-bluntchart.png"
                alt="Aries zodiac sign illustration — BluntChart cosmic cat mascot"
                width={260}
                height={260}
                style={{ borderRadius:20, filter:"drop-shadow(0 0 40px rgba(232,160,144,0.15))" }}
                priority
              />
            </div>
          </div>

          {/* Summary box — expanded, bigger fonts */}
          <div style={{ background:"var(--card)", border:"1px solid rgba(232,160,144,0.15)", borderRadius:18, padding:"28px 32px", marginBottom:48 }}>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"var(--aries)", marginBottom:18, letterSpacing:"0.02em" }}>Aries at a Glance</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0px 48px" }}>
              {[
                ["Dates", "March 21 – April 19"],
                ["Element", "Fire 🔥"],
                ["Quality", "Cardinal"],
                ["Ruling Planet", "Mars ♂"],
                ["Symbol", "The Ram ♈"],
                ["Day", "Tuesday"],
                ["Color", "Red, Orange"],
                ["Greatest Compatibility", "Leo, Sagittarius, Gemini"],
                ["Strengths", "Courageous, confident, honest, passionate"],
                ["Weaknesses", "Impatient, impulsive, short-tempered, competitive"],
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
          <p className="ar-p" style={{ fontSize:17 }}>
            Aries is the first sign of the zodiac, and everything about them reflects that position. They are the beginning — the spark, the ignition, the first one through the door. Ruled by Mars, the planet of war, action, and raw desire, Aries doesn&apos;t wait for the world to invite them in. They arrive uninvited, rearrange the furniture, and somehow make it look like it was their house all along.
          </p>
          <p className="ar-p">
            As a Cardinal Fire sign, Aries combines the initiatory energy of cardinal quality with the raw passion of fire. This makes them natural leaders — not the kind who hold meetings about meetings, but the kind who are already halfway down the field while everyone else is still lacing up their shoes. They act first, think second, and apologize third (if at all). Their courage is genuine, their honesty is blunt, and their impatience is legendary.
          </p>

          {/* PERSONALITY TRAITS */}
          <h2 className="ar-h2">What are the key Aries personality traits?</h2>
          <p className="ar-p">
            The Aries personality is built on a foundation of directness and initiative. They say what they mean, they do what they say, and they expect everyone around them to operate at the same speed. This makes them refreshingly honest in a world of passive-aggressive texts and diplomatic non-answers — but it also makes them exhausting to people who need more time to process.
          </p>
          <p className="ar-p">
            Aries are independent to a fault. They trust their own instincts above all else and would rather fail on their own terms than succeed following someone else&apos;s plan. This isn&apos;t arrogance — it&apos;s a fundamental need to know that their choices are their own. The flip side is that they can steamroll collaborative processes, dismiss good advice because it wasn&apos;t their idea, and leave a trail of frustrated teammates wondering why they bothered preparing a presentation.
          </p>
          <p className="ar-p">
            At their best, Aries is the person who stands up when no one else will, who says the thing everyone is thinking but nobody has the nerve to say, and who turns a hopeless situation into an adventure. At their worst, they&apos;re the person who picks a fight at a dinner party, quits a job because their boss mildly disagreed with them, and forgets your birthday because they were too busy chasing their latest obsession.
          </p>

          {/* STRENGTHS & WEAKNESSES */}
          <h2 className="ar-h2">What are Aries&apos; strengths and weaknesses?</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
            <div style={{ background:"rgba(93,202,165,0.04)", border:"0.5px solid rgba(93,202,165,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--teal)", marginBottom:12 }}>Strengths</div>
              <ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>
                {["Fearless initiative — they start what others only talk about",
                  "Radical honesty — you always know where you stand",
                  "Natural leadership — people follow them instinctively",
                  "Infectious energy — they make everything feel possible",
                  "Loyalty to their inner circle — they fight for their people",
                  "Recovery speed — they bounce back faster than any other sign",
                ].map((s,i) => <li key={i}><span style={{ color:"var(--teal)", marginRight:10 }}>✓</span>{s}</li>)}
              </ul>
            </div>
            <div style={{ background:"rgba(212,83,126,0.04)", border:"0.5px solid rgba(212,83,126,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--rose)", marginBottom:12 }}>Weaknesses</div>
              <ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>
                {["Impulsive decisions — acts before consequences are clear",
                  "Short temper — flares hot and fast, often over small things",
                  "Poor listener — formulating a response before you finish",
                  "Boredom intolerance — abandons projects once novelty fades",
                  "Competitive to a fault — turns everything into a contest",
                  "Self-centered blind spots — unaware of others' needs",
                ].map((s,i) => <li key={i}><span style={{ color:"var(--rose)", marginRight:10 }}>✗</span>{s}</li>)}
              </ul>
            </div>
          </div>

          {/* LOVE */}
          <h2 className="ar-h2">How does Aries behave in love and relationships?</h2>
          <p className="ar-p">
            Aries falls in love the same way they do everything else — fast, hard, and without a safety net. When they&apos;re attracted to someone, they make it known immediately. There&apos;s no ambiguity, no slow build, no three-day texting rule. They want you, they tell you, and they expect you to either match their energy or get out of the way.
          </p>
          <p className="ar-p">
            The early stage of an Aries relationship is intoxicating. They&apos;re attentive, passionate, and make their partner feel like the center of the universe. The challenge comes when the initial fire stabilizes into something steadier. Aries can mistake comfort for boredom, and they need a partner who understands that their restlessness isn&apos;t dissatisfaction — it&apos;s just how their engine runs.
          </p>
          <p className="ar-p">
            What Aries needs in a partner: someone who has their own life, their own passions, and their own opinions. Aries is attracted to strength, not dependence. They want an equal — someone who challenges them intellectually, matches them physically, and doesn&apos;t crumble when Aries inevitably says something blunt at the worst possible moment. Clingy, passive, or conflict-avoidant partners will not survive an Aries relationship.
          </p>

          {/* COMPATIBILITY */}
          <h2 className="ar-h2">Which zodiac signs are most compatible with Aries?</h2>
          <p className="ar-p">
            Compatibility in astrology is complex and depends on the full birth chart, but Sun sign compatibility offers a useful starting point. Aries tends to connect most naturally with signs that can match their fire without trying to extinguish it.
          </p>
          <div className="ar-compat" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:28 }}>
            {[
              { level:"High Compatibility", signs:"Leo, Sagittarius", color:"var(--teal)", desc:"Fellow fire signs who match Aries' energy, passion, and directness. These relationships burn bright with mutual respect and shared enthusiasm for life." },
              { level:"Strong Compatibility", signs:"Gemini, Aquarius", color:"#8ec5e8", desc:"Air signs that fuel Aries' fire. Gemini brings mental stimulation and playfulness; Aquarius brings independence and intellectual depth. Both give Aries the room to breathe." },
              { level:"Magnetic but Challenging", signs:"Libra, Scorpio", color:"var(--aries)", desc:"Libra is Aries' opposite sign — intense attraction, completely different approaches to conflict. Scorpio matches Aries' intensity but power struggles are inevitable." },
            ].map((c,i) => (
              <div key={i} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:14, padding:"22px 20px" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:c.color, marginBottom:8 }}>{c.level}</div>
                <div style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, marginBottom:10 }}>{c.signs}</div>
                <p style={{ fontSize:14, color:"rgba(232,228,240,0.5)", lineHeight:1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          {/* CAREER */}
          <h2 className="ar-h2">What is Aries like at work and in their career?</h2>
          <p className="ar-p">
            Aries thrives in environments that reward initiative, speed, and independent thinking. They are not built for bureaucracy, committee decisions, or roles that require them to wait for approval before acting. Give an Aries a goal, a deadline, and the freedom to figure out how to get there — then get out of their way.
          </p>
          <p className="ar-p">
            They make excellent entrepreneurs, team leaders, salespeople, athletes, and emergency responders — any role where quick decisions and bold action are rewarded. They struggle in environments that are slow, hierarchical, or politically sensitive. An Aries forced to sit through a four-hour meeting about process optimization will start looking for the exit before the second slide.
          </p>
          <p className="ar-p">
            As leaders, Aries are inspiring but demanding. They set the pace by example, expect everyone to keep up, and can be genuinely confused when someone can&apos;t. Their leadership style is action-first: they&apos;d rather demonstrate than delegate, which makes them brilliant in a crisis and frustrating in steady-state operations.
          </p>

          {/* FRIENDSHIPS */}
          <h2 className="ar-h2">How does Aries handle friendships?</h2>
          <p className="ar-p">
            An Aries friend is the one who texts you at 11 PM with a plan for tomorrow, shows up first when things go wrong, and tells you the truth even when it&apos;s uncomfortable. They&apos;re fiercely loyal to their inner circle and will go to war for the people they love — sometimes literally starting a confrontation on your behalf before you&apos;ve even asked.
          </p>
          <p className="ar-p">
            The challenge with Aries friendships is that they can be self-centered without realizing it. They assume their friends operate on the same schedule and at the same emotional speed. They might cancel plans impulsively, dominate conversations unintentionally, or forget to check in because they were absorbed in their latest project. It&apos;s never malicious — it&apos;s just that their world moves fast, and sometimes other people aren&apos;t in the frame.
          </p>

          {/* ARIES RISING & MOON */}
          <h2 className="ar-h2">What does it mean to have Aries as your Rising or Moon sign?</h2>
          <p className="ar-p">
            Your Sun sign is only one piece of your astrological profile. Many people with Aries energy in other placements feel its influence just as strongly — sometimes more so.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
            <div style={{ background:"var(--card)", border:"0.5px solid rgba(232,160,144,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--aries)", marginBottom:10 }}>Aries Rising (Ascendant)</div>
              <p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>
                People with Aries Rising project confidence, directness, and physical energy before they say a word. Others perceive them as bold, competitive, and slightly intimidating. They tend to have sharp features, an athletic presence, and an urgency in how they move. Aries Rising people are often the first to speak in a group, the first to take action, and the first to leave when things get boring.
              </p>
            </div>
            <div style={{ background:"var(--card)", border:"0.5px solid rgba(196,168,255,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"#c4a8ff", marginBottom:10 }}>Aries Moon</div>
              <p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>
                An Aries Moon processes emotions through action. When they feel something, they want to do something about it — immediately. Sitting with discomfort is almost unbearable. Under stress, they fight rather than freeze. They need independence even in their most intimate relationships, and they express love through initiative and protection rather than words and patience.
              </p>
            </div>
          </div>

          {/* MARS RULER */}
          <h2 className="ar-h2">What does Mars as a ruling planet mean for Aries?</h2>
          <p className="ar-p">
            Mars is the planet of war, action, aggression, and desire. As Aries&apos; ruling planet, it infuses the sign with a relentless drive to act, compete, and conquer. Mars doesn&apos;t negotiate — it charges. This is why Aries approaches every situation with the assumption that the best strategy is forward momentum.
          </p>
          <p className="ar-p">
            Mars also governs physical energy and sexuality, which is why Aries tends to be physically dynamic and directly expressive about attraction. There&apos;s no subtlety in Martian energy — when Aries wants something, everyone in the room knows. This transparency is one of their most attractive qualities and one of their most challenging. In a world that rewards diplomacy, Aries&apos; Martian bluntness can feel like a bulldozer at a garden party.
          </p>

          {/* CTA mid-page */}
          <div style={{ background:"rgba(232,160,144,0.04)", border:"0.5px solid rgba(232,160,144,0.15)", borderRadius:20, padding:"44px 36px", textAlign:"center", margin:"48px 0" }}>
            <p style={{ fontSize:12, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"var(--gold)", marginBottom:12 }}>Your Sun sign is the headline</p>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, lineHeight:1.15, marginBottom:14 }}>
              Being an Aries is one thing.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#e8a090,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Knowing your full chart is another.</em>
            </h2>
            <p style={{ fontSize:16, color:"var(--dim)", lineHeight:1.72, maxWidth:500, margin:"0 auto 24px" }}>
              Your Aries Sun interacts with your Moon, Rising, Venus, Mars, and house placements in ways that generic sign descriptions can&apos;t capture. A BluntChart reading tells you what YOUR specific chart says — ~1,500 words, brutally honest, no horoscope fluff.
            </p>
            <Link href="/#try-it" className="ar-cta" style={{ maxWidth:380 }}>Get My Full Reading · $15 ✦</Link>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section style={{ padding:"64px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}>
        <div className="c">
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><span style={{ width:22, height:1, background:"var(--gold)" }}/><span style={{ fontSize:12, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"var(--gold)" }}>Beyond your Sun sign</span></div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, lineHeight:1.1, marginBottom:12 }}>
            BluntChart vs <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>generic Aries descriptions</em>
          </h2>
          <p style={{ fontSize:15, color:"var(--dim)", maxWidth:500, lineHeight:1.72, marginBottom:32 }}>Every Aries page tells you the same thing. Here&apos;s what they leave out.</p>
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
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><span style={{ width:22, height:1, background:"var(--aries)" }}/><span style={{ fontSize:12, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"var(--aries)" }}>Common questions</span></div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, lineHeight:1.1, marginBottom:32 }}>
            Aries <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#e8a090,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>FAQ</em>
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
            Your Aries Sun is one placement.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#e8a090,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Your full chart tells the real story.</em>
          </h2>
          <p style={{ fontSize:16, color:"var(--dim)", maxWidth:480, margin:"0 auto 24px", lineHeight:1.72 }}>10 insights from your exact birth chart. Brutally honest, ~1,500 words, specific to you.</p>
          <Link href="/#try-it" className="ar-cta" style={{ maxWidth:380 }}>Get My Full Reading · $15 ✦</Link>
        </div>
      </section>

      {/* OTHER SIGNS NAV */}
      <section style={{ padding:"48px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}>
        <div className="c">
          <h3 style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, color:"rgba(232,228,240,0.4)", marginBottom:18, textAlign:"center" }}>Explore other zodiac signs</h3>
          <div className="ar-signs-nav" style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:10 }}>
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