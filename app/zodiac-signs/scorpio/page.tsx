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
  { q:"What are the Scorpio dates?", a:"Scorpio season runs from October 23 to November 21. People born during this window have Scorpio as their Sun sign. The exact start date can shift by a day year to year due to astronomical timing, so those born on October 22 or November 22 should check their birth chart to confirm which sign the Sun was actually in at their moment of birth." },
  { q:"What planets rule Scorpio?", a:"Scorpio has two ruling planets: Pluto (modern ruler) and Mars (traditional ruler). Pluto governs transformation, power, the unconscious, and rebirth — giving Scorpio their depth and fascination with hidden truths. Mars adds raw drive, passion, and combative energy. Together, they make Scorpio the most intensely powerful sign in the zodiac." },
  { q:"What element is Scorpio?", a:"Scorpio is a Water sign, along with Cancer and Pisces. Water signs are emotional, intuitive, and deeply feeling. What makes Scorpio unique among water signs is its Fixed quality — meaning Scorpio sustains and concentrates emotional intensity, while Cancer initiates (Cardinal Water) and Pisces adapts (Mutable Water)." },
  { q:"What signs are most compatible with Scorpio?", a:"Scorpio pairs best with Cancer and Pisces (fellow water signs who understand their emotional depth without fearing it), and Virgo and Capricorn (earth signs who provide stability and match their loyalty). Scorpio often has a powerful magnetic attraction to their opposite sign Taurus, though the relationship involves significant power dynamics." },
  { q:"What are Scorpio's biggest weaknesses?", a:"Scorpio's biggest weaknesses are jealousy, possessiveness, and an inability to forgive once trust is broken. They can be secretive to the point of isolation, obsessive about things and people, and manipulative when they feel threatened. Their emotional intensity, while a strength, can become consuming — for themselves and everyone around them." },
  { q:"What is Scorpio Rising?", a:"Scorpio Rising (Ascendant in Scorpio) means your outward personality projects Scorpio energy — people see you as intense, magnetic, mysterious, and slightly intimidating before they know anything else about you. You have a penetrating gaze, a controlled demeanor, and a presence that people can't ignore. Your Rising sign requires your exact birth time to calculate." },
  { q:"What is Scorpio Moon?", a:"A Scorpio Moon means your emotional processing is deep, intense, and all-or-nothing. You feel everything at full volume but show almost none of it. Under stress, you withdraw, investigate, or cut people off entirely. You need absolute trust before opening up, and betrayal is genuinely traumatic. You express love through fierce loyalty, protectiveness, and a willingness to go through fire for the people you love." },
];

export default function ScorpioPage() {
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
          --purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5;--signColor:#c94040;
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
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 0%,rgba(201,64,64,0.06) 0%,transparent 60%)", pointerEvents:"none" }}/>
        <div className="c" style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:13, color:"rgba(232,228,240,0.3)", marginBottom:28 }}>
            <Link href="/" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>BluntChart</Link>
            <span style={{ margin:"0 8px" }}>/</span>
            <Link href="/zodiac-signs" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>Zodiac Signs</Link>
            <span style={{ margin:"0 8px" }}>/</span>
            <span style={{ color:"rgba(232,228,240,0.5)" }}>Scorpio</span>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:48, marginBottom:32, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:320 }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                <div style={{ width:60, height:60, borderRadius:16, background:"linear-gradient(145deg, rgba(201,64,64,0.15), rgba(201,64,64,0.05))", border:"1px solid rgba(201,64,64,0.25)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 28px rgba(201,64,64,0.08)" }}>
                  <span style={{ fontSize:32, color:"var(--signColor)", fontFamily:"Georgia, serif", filter:"drop-shadow(0 0 6px rgba(201,64,64,0.4))" }}>♏</span>
                </div>
                <div>
                  <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.8rem,7vw,4.2rem)", fontWeight:900, lineHeight:1.02, margin:0, background:"linear-gradient(135deg, #c94040, #8b2020)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                    Scorpio
                  </h1>
                  <p style={{ fontSize:16, color:"rgba(232,228,240,0.5)", marginTop:4 }}>The Scorpion · October 23 – November 21</p>
                </div>
              </div>
              <p style={{ fontSize:20, fontFamily:"var(--font-display)", fontStyle:"italic", color:"rgba(232,228,240,0.65)", lineHeight:1.55, maxWidth:560 }}>
                &ldquo;Knows your secret before you tell them. Won&rsquo;t tell you theirs until they decide you&rsquo;ve earned it.&rdquo;
              </p>
            </div>
            <div style={{ flexShrink:0 }}>
              <Image
                src="/scorpio-bluntchart.png"
                alt="Scorpio zodiac sign illustration — BluntChart cosmic cat mascot"
                width={260}
                height={260}
                style={{ borderRadius:20, filter:"drop-shadow(0 0 40px rgba(201,64,64,0.15))" }}
                priority
              />
            </div>
          </div>

          <div style={{ background:"var(--card)", border:"1px solid rgba(201,64,64,0.15)", borderRadius:18, padding:"28px 32px", marginBottom:48 }}>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"var(--signColor)", marginBottom:18, letterSpacing:"0.02em" }}>Scorpio at a Glance</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0px 48px" }}>
              {[
                ["Dates", "October 23 – November 21"],
                ["Element", "Water 🌊"],
                ["Quality", "Fixed"],
                ["Ruling Planets", "Pluto ♇ · Mars ♂"],
                ["Symbol", "The Scorpion ♏"],
                ["Day", "Tuesday"],
                ["Color", "Black, Dark Red, Maroon"],
                ["Greatest Compatibility", "Cancer, Pisces, Virgo"],
                ["Strengths", "Loyal, passionate, perceptive, determined, brave"],
                ["Weaknesses", "Jealous, possessive, secretive, obsessive, unforgiving"],
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
            Scorpio is the eighth sign of the zodiac and the one most people either can&apos;t stop thinking about or actively avoid. There is no casual relationship with Scorpio energy — it demands depth, authenticity, and a willingness to look at the parts of life most people pretend don&apos;t exist. Ruled by Pluto, the planet of transformation, power, and the unconscious, and co-ruled by Mars, the planet of drive and desire, Scorpio moves through the world like a deep current — invisible on the surface, undeniable underneath.
          </p>
          <p className="pp">
            As a Fixed Water sign, Scorpio combines the emotional depth of water with the unwavering persistence of fixed quality. This makes them the zodiac&apos;s most emotionally intense sign — not loud like fire, not restless like air, but deep. Deeply feeling, deeply loyal, deeply private, and deeply dangerous to anyone who mistakes their silence for weakness. Where Cancer nurtures and Pisces dreams, Scorpio investigates. They want the truth — about you, about themselves, about the world — and they will not stop until they find it.
          </p>

          <h2 className="h2s">What are the key Scorpio personality traits?</h2>
          <p className="pp">
            The Scorpio personality is built on emotional intelligence and an almost supernatural ability to read people. They walk into a room and within minutes know who&apos;s lying, who&apos;s afraid, who&apos;s faking confidence, and who actually has power. This isn&apos;t a skill they developed — it&apos;s something they were born with. Scorpio sees beneath surfaces the way other people see colors. It&apos;s automatic, constant, and impossible to turn off.
          </p>
          <p className="pp">
            Scorpios are private to an extent that can feel like secrecy, because it is. They reveal themselves in layers, and access to each layer is earned, not given. This isn&apos;t a game or a manipulation tactic — it&apos;s a survival mechanism built from the understanding that vulnerability, in the wrong hands, is a weapon. Once a Scorpio trusts you, you get a version of them that most people never see: tender, generous, fiercely protective, and capable of a loyalty so complete it borders on devotion.
          </p>
          <p className="pp">
            At their best, Scorpio is the person who stays when everyone else leaves, who tells you the truth that saves your life, and who transforms every crisis into a comeback. At their worst, they&apos;re the person who weaponizes intimacy, holds grudges like they&apos;re collecting art, and burns a bridge not just to the ground but to the foundation — then salts the earth so nothing grows there again.
          </p>

          <h2 className="h2s">What are Scorpio&apos;s strengths and weaknesses?</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
            <div style={{ background:"rgba(93,202,165,0.04)", border:"0.5px solid rgba(93,202,165,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--teal)", marginBottom:12 }}>Strengths</div>
              <ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>
                {["Penetrating perception — reads people like open books",
                  "Unbreakable loyalty — once in, they're in for life",
                  "Emotional courage — faces what others can't look at",
                  "Transformative resilience — rises from every devastation stronger",
                  "Strategic intelligence — plays the long game brilliantly",
                  "Passionate devotion — loves with their entire being",
                ].map((s,i) => <li key={i}><span style={{ color:"var(--teal)", marginRight:10 }}>✓</span>{s}</li>)}
              </ul>
            </div>
            <div style={{ background:"rgba(212,83,126,0.04)", border:"0.5px solid rgba(212,83,126,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--rose)", marginBottom:12 }}>Weaknesses</div>
              <ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>
                {["Jealousy and possessiveness — can suffocate what they love",
                  "Grudges that never expire — forgiveness is not in the default settings",
                  "Obsessive fixation — can't let go of people, situations, or slights",
                  "Emotional manipulation — knows exactly which buttons to push",
                  "Secretive isolation — walls so high nobody can scale them",
                  "All-or-nothing extremes — no middle ground, no gray area",
                ].map((s,i) => <li key={i}><span style={{ color:"var(--rose)", marginRight:10 }}>✗</span>{s}</li>)}
              </ul>
            </div>
          </div>

          <h2 className="h2s">How does Scorpio behave in love and relationships?</h2>
          <p className="pp">
            Scorpio doesn&apos;t date casually. They might sleep with someone casually, but the moment they decide they actually want you, everything changes. Scorpio in love is consuming — they want to know everything about you, merge with you on every level, and build something that nothing can destroy. The intensity of their devotion is unlike anything else in the zodiac. When a Scorpio loves you, they love you with their bones.
          </p>
          <p className="pp">
            The challenge is that Scorpio&apos;s depth comes with control issues. They need to feel secure in a relationship, and their definition of security often involves knowing everything their partner is thinking and feeling at all times. The line between deep connection and possessiveness is one Scorpio walks constantly. Jealousy isn&apos;t a minor flaw — it&apos;s a structural feature of their emotional architecture.
          </p>
          <p className="pp">
            What Scorpio needs in a partner: someone honest enough to survive their interrogation, strong enough to maintain their own identity inside the relationship, and emotionally brave enough to match Scorpio&apos;s vulnerability with their own. Scorpio needs a partner who won&apos;t flinch at intensity, won&apos;t betray trust under any circumstances, and understands that Scorpio&apos;s silence isn&apos;t disinterest — it&apos;s processing. Superficial, dishonest, or emotionally unavailable partners will trigger Scorpio&apos;s worst instincts.
          </p>

          <h2 className="h2s">Which zodiac signs are most compatible with Scorpio?</h2>
          <p className="pp">
            Compatibility in astrology depends on the full birth chart, but Sun sign compatibility offers a useful starting point. Scorpio connects most naturally with signs that can handle emotional depth without drowning in it.
          </p>
          <div className="compat" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:28 }}>
            {[
              { level:"High Compatibility", signs:"Cancer, Pisces", color:"var(--teal)", desc:"Fellow water signs who understand Scorpio's emotional depth without fearing it. Cancer provides the security Scorpio craves; Pisces offers spiritual connection and unconditional acceptance." },
              { level:"Strong Compatibility", signs:"Virgo, Capricorn", color:"#8ec5e8", desc:"Earth signs that provide stability, loyalty, and substance. Virgo matches Scorpio's analytical depth; Capricorn shares their ambition and respect for power structures." },
              { level:"Magnetic but Volatile", signs:"Taurus, Leo", color:"var(--signColor)", desc:"Taurus is Scorpio's opposite sign — devastating attraction, epic power struggles. Leo matches intensity but both are Fixed signs, making neither willing to yield." },
            ].map((c,i) => (
              <div key={i} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:14, padding:"22px 20px" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:c.color, marginBottom:8 }}>{c.level}</div>
                <div style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, marginBottom:10 }}>{c.signs}</div>
                <p style={{ fontSize:14, color:"rgba(232,228,240,0.5)", lineHeight:1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="h2s">What is Scorpio like at work and in their career?</h2>
          <p className="pp">
            Scorpio thrives in environments that reward depth, investigation, and strategic thinking. They are not built for surface-level work, small talk with colleagues, or roles where everyone pretends everything is fine. Give a Scorpio something to solve, uncover, or transform — then stand back and watch them become the most valuable person in the building.
          </p>
          <p className="pp">
            They make excellent investigators, surgeons, psychologists, researchers, financial analysts, intelligence professionals, and crisis managers — any role where the ability to see what others miss is the entire job description. They struggle in environments that are overly political, transparently fake, or require constant social performance.
          </p>
          <p className="pp">
            As leaders, Scorpio commands through presence and strategy. They don&apos;t need to raise their voice — their reputation precedes them. They protect their team fiercely and expect absolute loyalty in return. Their weakness is trust: they can micromanage because they struggle to believe anyone else will care as much as they do, and they sometimes keep information close when sharing it would serve the team better.
          </p>

          <h2 className="h2s">How does Scorpio handle friendships?</h2>
          <p className="pp">
            A Scorpio friend is the one who knows your worst secret and has never told a soul. They are the friend you call at 3 AM when everything falls apart, because they won&apos;t judge, won&apos;t panic, and won&apos;t leave. Scorpio&apos;s loyalty in friendship is absolute — but so are their standards. Betray a Scorpio&apos;s trust once, and the friendship is over. Not because they&apos;re dramatic, but because they can&apos;t unknow what they now know about you.
          </p>
          <p className="pp">
            The challenge with Scorpio friendships is that they keep a very small inner circle and can be testing without announcing it. They observe, they note, they remember. A casual offhand comment you forgot about three months ago is filed in Scorpio&apos;s memory, being cross-referenced with your other behavior. This sounds exhausting, and it is — for both of you. But if you pass Scorpio&apos;s tests, you get a friend who will go to the mat for you without hesitation.
          </p>

          <h2 className="h2s">What does it mean to have Scorpio as your Rising or Moon sign?</h2>
          <p className="pp">
            Your Sun sign is only one piece of your astrological profile. Many people with Scorpio energy in other placements feel its influence just as strongly — sometimes more so.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
            <div style={{ background:"var(--card)", border:"0.5px solid rgba(201,64,64,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--signColor)", marginBottom:10 }}>Scorpio Rising (Ascendant)</div>
              <p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>
                People with Scorpio Rising project intensity, magnetism, and an unmistakable sense of power before they say a word. Others perceive them as mysterious, controlled, and slightly dangerous — in the most attractive way possible. They tend to have piercing eyes, a focused gaze, and an energy that makes people either deeply drawn in or vaguely intimidated. Scorpio Rising people are the ones who walk into a room and change its atmosphere.
              </p>
            </div>
            <div style={{ background:"var(--card)", border:"0.5px solid rgba(196,168,255,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"#c4a8ff", marginBottom:10 }}>Scorpio Moon</div>
              <p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>
                A Scorpio Moon processes emotions with devastating depth and almost none of it visible on the surface. They feel everything at maximum intensity but control their expression completely. Under stress, they withdraw into silence, investigate compulsively, or cut ties without warning. They need emotional truth above all else and can sense dishonesty the way other people sense temperature changes. Trust is everything; without it, they operate behind walls that nothing penetrates.
              </p>
            </div>
          </div>

          <h2 className="h2s">What do Pluto and Mars mean as ruling planets for Scorpio?</h2>
          <p className="pp">
            Pluto is the planet of transformation, power, death, rebirth, and the deep unconscious. As Scorpio&apos;s modern ruler, it gives the sign its fascination with what lies beneath — the hidden truth, the buried motivation, the wound no one talks about. Pluto doesn&apos;t do surfaces. This is why Scorpio approaches every situation with the assumption that what you see is never the full story.
          </p>
          <p className="pp">
            Mars, Scorpio&apos;s traditional ruler, adds drive, physicality, passion, and combativeness. Where Mars in Aries is a fast, forward charge, Mars in Scorpio is a slow, strategic burn. Scorpio&apos;s Mars doesn&apos;t fight impulsively — it waits, observes, identifies the precise vulnerability, and strikes when the moment is right. This combination of Pluto&apos;s depth and Mars&apos;s drive makes Scorpio one of the most formidable signs in the zodiac — capable of extraordinary transformation, devastating destruction, or both.
          </p>

          {/* CTA mid-page */}
          <div style={{ background:"rgba(201,64,64,0.04)", border:"0.5px solid rgba(201,64,64,0.15)", borderRadius:20, padding:"44px 36px", textAlign:"center", margin:"48px 0" }}>
            <p style={{ fontSize:12, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"var(--gold)", marginBottom:12 }}>Your Sun sign is the headline</p>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, lineHeight:1.15, marginBottom:14 }}>
              Being a Scorpio is one thing.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#c94040,#8b2020)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Knowing your full chart is another.</em>
            </h2>
            <p style={{ fontSize:16, color:"var(--dim)", lineHeight:1.72, maxWidth:500, margin:"0 auto 24px" }}>
              Your Scorpio Sun interacts with your Moon, Rising, Venus, Mars, and house placements in ways that generic sign descriptions can&apos;t capture. A BluntChart reading tells you what YOUR specific chart says — ~1,500 words, brutally honest, no horoscope fluff.
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
            BluntChart vs <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>generic Scorpio descriptions</em>
          </h2>
          <p style={{ fontSize:15, color:"var(--dim)", maxWidth:500, lineHeight:1.72, marginBottom:32 }}>Every Scorpio page tells you the same thing. Here&apos;s what they leave out.</p>
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
            Scorpio <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#c94040,#8b2020)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>FAQ</em>
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
            Your Scorpio Sun is one placement.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#c94040,#8b2020)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Your full chart tells the real story.</em>
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