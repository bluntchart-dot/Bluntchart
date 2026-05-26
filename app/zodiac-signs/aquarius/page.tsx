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
  { name:"Capricorn", symbol:"♑", slug:"capricorn" },
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
  { q:"What are the Aquarius dates?", a:"Aquarius season runs from January 20 to February 18. People born during this window have Aquarius as their Sun sign. The exact start date can shift by a day year to year due to astronomical timing, so those born on January 19 or February 19 should check their birth chart to confirm which sign the Sun was actually in at their moment of birth." },
  { q:"What planets rule Aquarius?", a:"Aquarius has two ruling planets: Uranus (modern ruler) and Saturn (traditional ruler). Uranus governs innovation, sudden change, rebellion, and unconventional thinking — giving Aquarius their visionary nature and aversion to conformity. Saturn adds discipline, structure, and a serious commitment to ideals. Together, they create a personality that wants to revolutionize the world — but with a plan." },
  { q:"What element is Aquarius?", a:"Aquarius is an Air sign, along with Gemini and Libra — not a water sign, despite the 'water bearer' symbol. Air signs are intellectual, communicative, and socially oriented. What makes Aquarius unique is its Fixed quality — meaning they sustain their ideas and ideals with unwavering commitment, while Gemini initiates (Mutable Air) and Libra balances (Cardinal Air)." },
  { q:"What signs are most compatible with Aquarius?", a:"Aquarius pairs best with Gemini and Libra (fellow air signs who share their intellectual curiosity and social energy), and Aries and Sagittarius (fire signs who provide enthusiasm and match their independent spirit). Aquarius often has a powerful magnetic attraction to their opposite sign Leo, though the relationship requires navigating ego dynamics and very different needs for attention." },
  { q:"What are Aquarius' biggest weaknesses?", a:"Aquarius' biggest weaknesses are emotional detachment, stubbornness disguised as principled conviction, and a tendency to be contrarian just for the sake of it. They can be aloof and dismissive of emotions — their own and others' — and so committed to being 'different' that they reject good ideas simply because they're mainstream." },
  { q:"What is Aquarius Rising?", a:"Aquarius Rising (Ascendant in Aquarius) means your outward personality projects Aquarius energy — people see you as unique, friendly, slightly eccentric, and intellectually engaged before they know anything else about you. You make interesting first impressions, often have an unusual style or energy, and project an air of calm detachment. Your Rising sign requires your exact birth time to calculate." },
  { q:"What is Aquarius Moon?", a:"An Aquarius Moon means your emotional processing is intellectual and detached. You feel things deeply but run them through a mental filter before allowing them to register as emotions. Under stress, you disconnect, rationalize, or redirect your energy toward a cause. You need emotional freedom and a partner who respects your need for space without interpreting it as a lack of love." },
];

export default function AquariusPage() {
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
          --purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5;--signColor:#4ea8c7;
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
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 0%,rgba(78,168,199,0.06) 0%,transparent 60%)", pointerEvents:"none" }}/>
        <div className="c" style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:13, color:"rgba(232,228,240,0.3)", marginBottom:28 }}>
            <Link href="/" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>BluntChart</Link>
            <span style={{ margin:"0 8px" }}>/</span>
            <Link href="/zodiac-signs" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>Zodiac Signs</Link>
            <span style={{ margin:"0 8px" }}>/</span>
            <span style={{ color:"rgba(232,228,240,0.5)" }}>Aquarius</span>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:48, marginBottom:32, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:320 }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                <div style={{ width:60, height:60, borderRadius:16, background:"linear-gradient(145deg, rgba(78,168,199,0.15), rgba(78,168,199,0.05))", border:"1px solid rgba(78,168,199,0.25)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 28px rgba(78,168,199,0.08)" }}>
                  <span style={{ fontSize:32, color:"var(--signColor)", fontFamily:"Georgia, serif", filter:"drop-shadow(0 0 6px rgba(78,168,199,0.4))" }}>♒</span>
                </div>
                <div>
                  <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.8rem,7vw,4.2rem)", fontWeight:900, lineHeight:1.02, margin:0, background:"linear-gradient(135deg, #4ea8c7, #2d7a94)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                    Aquarius
                  </h1>
                  <p style={{ fontSize:16, color:"rgba(232,228,240,0.5)", marginTop:4 }}>The Water Bearer · January 20 – February 18</p>
                </div>
              </div>
              <p style={{ fontSize:20, fontFamily:"var(--font-display)", fontStyle:"italic", color:"rgba(232,228,240,0.65)", lineHeight:1.55, maxWidth:560 }}>
                &ldquo;Cares deeply about humanity. Struggles to text back a single human.&rdquo;
              </p>
            </div>
            <div style={{ flexShrink:0 }}>
              <Image
                src="/aquarius-bluntchart.png"
                alt="Aquarius zodiac sign illustration — BluntChart cosmic cat mascot"
                width={260}
                height={260}
                style={{ borderRadius:20, filter:"drop-shadow(0 0 40px rgba(78,168,199,0.15))" }}
                priority
              />
            </div>
          </div>

          <div style={{ background:"var(--card)", border:"1px solid rgba(78,168,199,0.15)", borderRadius:18, padding:"28px 32px", marginBottom:48 }}>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"var(--signColor)", marginBottom:18, letterSpacing:"0.02em" }}>Aquarius at a Glance</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0px 48px" }}>
              {[
                ["Dates", "January 20 – February 18"],
                ["Element", "Air 💨"],
                ["Quality", "Fixed"],
                ["Ruling Planets", "Uranus ♅ · Saturn ♄"],
                ["Symbol", "The Water Bearer ♒"],
                ["Day", "Saturday"],
                ["Color", "Electric Blue, Turquoise, Silver"],
                ["Greatest Compatibility", "Gemini, Libra, Sagittarius"],
                ["Strengths", "Independent, innovative, humanitarian, intellectual"],
                ["Weaknesses", "Detached, stubborn, contrarian, emotionally aloof"],
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
            Aquarius is the eleventh sign of the zodiac and the one most likely to be misunderstood — and perfectly comfortable with that. Ruled by Uranus, the planet of innovation, disruption, and sudden change, and co-ruled by Saturn, the planet of structure and discipline, Aquarius is the zodiac&apos;s walking paradox: a rebel with a system, a humanitarian who needs space from actual humans, and an intellectual who feels things more deeply than they&apos;ll ever admit.
          </p>
          <p className="pp">
            As a Fixed Air sign, Aquarius combines the intellectual nature of air with the unwavering persistence of fixed quality. This makes them the zodiac&apos;s most stubbornly idealistic sign. Where Gemini collects ideas and Libra weighs them, Aquarius commits to them — and once an Aquarius decides what they believe, good luck changing their mind. They don&apos;t follow trends. They either started the trend, rejected the trend on principle, or are three trends ahead of everyone else and quietly waiting for the world to catch up.
          </p>

          <h2 className="h2s">What are the key Aquarius personality traits?</h2>
          <p className="pp">
            The Aquarius personality is built on independence and a genuine desire to understand how things work — systems, societies, technologies, people. They observe the world like scientists in a social experiment, noticing patterns that others miss and asking questions that others don&apos;t think to ask. This gives them a perspective that is frequently brilliant and occasionally alienating.
          </p>
          <p className="pp">
            Aquarians are fiercely individual but deeply community-minded — a contradiction they embody without apparent effort. They care about humanity in the abstract while struggling with humans in the specific. They&apos;ll donate to a cause, organize a protest, and build a platform for collective change, but they might not remember to call their mother back. It&apos;s not that they don&apos;t care. It&apos;s that they operate on a wavelength that prioritizes the collective over the personal.
          </p>
          <p className="pp">
            At their best, Aquarius is the visionary who sees the world not as it is but as it could be, and who has the intellectual firepower and determination to actually move it in that direction. At their worst, they&apos;re the person who is so attached to being &ldquo;different&rdquo; that they reject good ideas on principle, who intellectualizes every emotion until it loses all feeling, and who mistakes detachment for enlightenment.
          </p>

          <h2 className="h2s">What are Aquarius&apos; strengths and weaknesses?</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
            <div style={{ background:"rgba(93,202,165,0.04)", border:"0.5px solid rgba(93,202,165,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--teal)", marginBottom:12 }}>Strengths</div>
              <ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>
                {["Original thinking — sees solutions nobody else considers",
                  "Unwavering principles — stands by their beliefs regardless of pressure",
                  "Intellectual depth — genuinely brilliant at understanding systems",
                  "Humanitarian instinct — cares about fairness and collective progress",
                  "Independence — never needs validation to know their own worth",
                  "Loyal friendship — once you're in, they're endlessly reliable",
                ].map((s,i) => <li key={i}><span style={{ color:"var(--teal)", marginRight:10 }}>✓</span>{s}</li>)}
              </ul>
            </div>
            <div style={{ background:"rgba(212,83,126,0.04)", border:"0.5px solid rgba(212,83,126,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--rose)", marginBottom:12 }}>Weaknesses</div>
              <ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>
                {["Emotional detachment — intellectualizes feelings instead of feeling them",
                  "Stubborn contrarianism — rejects ideas just because they're popular",
                  "Superiority complex — can come across as condescending about their views",
                  "Aloofness — friends and partners often feel kept at arm's length",
                  "Unpredictable energy — hot and cold without apparent reason",
                  "Commitment resistance — freedom feels safer than vulnerability",
                ].map((s,i) => <li key={i}><span style={{ color:"var(--rose)", marginRight:10 }}>✗</span>{s}</li>)}
              </ul>
            </div>
          </div>

          <h2 className="h2s">How does Aquarius behave in love and relationships?</h2>
          <p className="pp">
            Aquarius approaches love with the same curiosity and caution they bring to everything else. They&apos;re attracted to minds first — if you can&apos;t hold an interesting conversation, physical attraction alone will never be enough. The early stages of an Aquarius relationship often feel more like an intellectual partnership than a romance, and that&apos;s by design. Aquarius needs to respect you before they can love you.
          </p>
          <p className="pp">
            The challenge is that Aquarius&apos; need for independence can read as emotional unavailability. They go quiet not because they&apos;ve lost interest, but because they need space to process. They show love through actions — sharing ideas, building things together, showing up when it matters — rather than through emotional declarations. The partner who demands constant reassurance will drain an Aquarius; the partner who trusts their consistency will unlock a loyalty that runs deeper than most people expect.
          </p>
          <p className="pp">
            What Aquarius needs in a partner: someone intellectually stimulating enough to keep them engaged for years, independent enough to have their own life, and emotionally secure enough to not panic during Aquarius&apos; inevitable withdrawals. They need a partner who values authenticity over convention and who understands that Aquarius&apos; love, while quiet, is built to last.
          </p>

          <h2 className="h2s">Which zodiac signs are most compatible with Aquarius?</h2>
          <p className="pp">
            Compatibility depends on the full birth chart, but Sun sign compatibility offers a useful starting point. Aquarius connects most naturally with signs that value intellectual freedom and aren&apos;t threatened by unconventional approaches to life.
          </p>
          <div className="compat" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:28 }}>
            {[
              { level:"High Compatibility", signs:"Gemini, Libra", color:"var(--teal)", desc:"Fellow air signs who match Aquarius' intellectual energy and social curiosity. Gemini brings playful mental stimulation; Libra provides balance and aesthetic appreciation that complements Aquarius' ideas." },
              { level:"Strong Compatibility", signs:"Aries, Sagittarius", color:"#8ec5e8", desc:"Fire signs that energize Aquarius' visions. Aries brings bold initiative to Aquarius' ideas; Sagittarius shares their love of freedom and philosophical conversation." },
              { level:"Magnetic but Challenging", signs:"Leo, Scorpio", color:"var(--signColor)", desc:"Leo is Aquarius' opposite sign — powerful attraction, fundamentally different needs for attention. Scorpio matches their intensity but demands emotional depth Aquarius struggles to provide." },
            ].map((c,i) => (
              <div key={i} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:14, padding:"22px 20px" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:c.color, marginBottom:8 }}>{c.level}</div>
                <div style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, marginBottom:10 }}>{c.signs}</div>
                <p style={{ fontSize:14, color:"rgba(232,228,240,0.5)", lineHeight:1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="h2s">What is Aquarius like at work and in their career?</h2>
          <p className="pp">
            Aquarius thrives in environments that reward original thinking, technological innovation, and work that serves a larger purpose. They are not built for corporate conformity, dress codes, or any workplace where &ldquo;that&apos;s how we&apos;ve always done it&rdquo; is considered a valid argument. Give an Aquarius a problem nobody has solved and the freedom to approach it sideways — they&apos;ll deliver something nobody expected.
          </p>
          <p className="pp">
            They make excellent technologists, scientists, nonprofit directors, urban planners, UX designers, documentary filmmakers, and social entrepreneurs — any role where systemic thinking, innovation, and a genuine desire to improve the world are the job description. They struggle in environments that are hierarchical, tradition-bound, or that prioritize politics over ideas.
          </p>
          <p className="pp">
            As leaders, Aquarius inspires through vision and egalitarianism. They treat the intern and the CEO with the same respect, and they create cultures where ideas are valued regardless of who presents them. Their weakness is emotional management: they can be so focused on systems and outcomes that they miss the human element, and their detached style can leave team members feeling unseen.
          </p>

          <h2 className="h2s">How does Aquarius handle friendships?</h2>
          <p className="pp">
            An Aquarius friend is the one who sends you an article at midnight about something you mentioned three weeks ago, who introduces you to the person who changes your career, and who will debate you for two hours about something neither of you will remember tomorrow — and consider it a perfect evening. They are the friend who respects your weirdness because they have their own, and who will never judge you for being different because they&apos;ve never tried to be anything else.
          </p>
          <p className="pp">
            The challenge with Aquarius friendships is emotional accessibility. They maintain a wide circle of acquaintances but a very small circle of people they actually let in. They can be present and engaged one week and unreachable the next, not because they don&apos;t care but because their energy moves in waves. The friends who thrive with Aquarius are the ones who don&apos;t require constant contact and who value depth of connection over frequency of interaction.
          </p>

          <h2 className="h2s">What does it mean to have Aquarius as your Rising or Moon sign?</h2>
          <p className="pp">
            Your Sun sign is only one piece of your astrological profile. Many people with Aquarius energy in other placements feel its influence just as strongly — sometimes more so.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
            <div style={{ background:"var(--card)", border:"0.5px solid rgba(78,168,199,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--signColor)", marginBottom:10 }}>Aquarius Rising (Ascendant)</div>
              <p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>
                People with Aquarius Rising project uniqueness, intellectual curiosity, and an easy-going independence before they say a word. Others perceive them as friendly yet slightly detached, interesting yet hard to pin down. They tend to have distinctive features, an eclectic style, and an energy that makes people wonder what they&apos;re thinking. Aquarius Rising people are the ones who walk into a room and immediately stand out — not by trying, but by simply being themselves.
              </p>
            </div>
            <div style={{ background:"var(--card)", border:"0.5px solid rgba(196,168,255,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"#c4a8ff", marginBottom:10 }}>Aquarius Moon</div>
              <p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>
                An Aquarius Moon processes emotions through the intellect. They feel things deeply but immediately translate those feelings into thoughts, analyses, or abstract concepts. Under stress, they become emotionally distant, redirect their energy toward a project or cause, or simply go quiet. They need space in relationships — not because they don&apos;t love deeply, but because their emotional processing requires solitude. They express love through loyalty, intellectual engagement, and a quiet consistency that speaks louder than words.
              </p>
            </div>
          </div>

          <h2 className="h2s">What do Uranus and Saturn mean as ruling planets for Aquarius?</h2>
          <p className="pp">
            Uranus is the planet of revolution, innovation, sudden insight, and disruption. As Aquarius&apos; modern ruler, it gives the sign their need to challenge conventions, their flashes of brilliance, and their sometimes unsettling ability to see the future before it arrives. Uranus doesn&apos;t evolve — it disrupts. This is why Aquarius doesn&apos;t improve the system; they replace it entirely.
          </p>
          <p className="pp">
            Saturn, Aquarius&apos; traditional ruler, adds structure, discipline, and a deep sense of responsibility. Where Uranus wants to tear everything down, Saturn wants to build something lasting. This tension between revolution and structure is the core of the Aquarius personality — they want to change the world, but they want the change to stick. The combination makes Aquarius capable of both radical vision and practical execution, which is why they&apos;re often the ones who actually make the future happen rather than just imagining it.
          </p>

          {/* CTA mid-page */}
          <div style={{ background:"rgba(78,168,199,0.04)", border:"0.5px solid rgba(78,168,199,0.15)", borderRadius:20, padding:"44px 36px", textAlign:"center", margin:"48px 0" }}>
            <p style={{ fontSize:12, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"var(--gold)", marginBottom:12 }}>Your Sun sign is the headline</p>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, lineHeight:1.15, marginBottom:14 }}>
              Being an Aquarius is one thing.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#4ea8c7,#2d7a94)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Knowing your full chart is another.</em>
            </h2>
            <p style={{ fontSize:16, color:"var(--dim)", lineHeight:1.72, maxWidth:500, margin:"0 auto 24px" }}>
              Your Aquarius Sun interacts with your Moon, Rising, Venus, Mars, and house placements in ways that generic sign descriptions can&apos;t capture. A BluntChart reading tells you what YOUR specific chart says — ~1,500 words, brutally honest, no horoscope fluff.
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
            BluntChart vs <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>generic Aquarius descriptions</em>
          </h2>
          <p style={{ fontSize:15, color:"var(--dim)", maxWidth:500, lineHeight:1.72, marginBottom:32 }}>Every Aquarius page tells you the same thing. Here&apos;s what they leave out.</p>
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
            Aquarius <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#4ea8c7,#2d7a94)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>FAQ</em>
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
            Your Aquarius Sun is one placement.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#4ea8c7,#2d7a94)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Your full chart tells the real story.</em>
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