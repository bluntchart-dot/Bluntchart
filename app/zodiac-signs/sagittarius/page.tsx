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
  { q:"What are the Sagittarius dates?", a:"Sagittarius season runs from November 22 to December 21. People born during this window have Sagittarius as their Sun sign. The exact start date can shift by a day year to year due to astronomical timing, so those born on November 21 or December 22 should check their birth chart to confirm which sign the Sun was actually in at their moment of birth." },
  { q:"What planet rules Sagittarius?", a:"Sagittarius is ruled by Jupiter, the largest planet in our solar system and the planet of expansion, abundance, wisdom, and higher learning. Jupiter gives Sagittarius their optimism, love of travel and philosophy, generosity, and tendency to think everything should be bigger, bolder, and more. It also explains why Sagittarius can be excessive — too many opinions, too many plans, too many promises they can't keep." },
  { q:"What element is Sagittarius?", a:"Sagittarius is a Fire sign, along with Aries and Leo. Fire signs are passionate, energetic, and dynamic. What makes Sagittarius unique among fire signs is its Mutable quality — meaning Sagittarius adapts and spreads their fire in multiple directions, while Aries initiates (Cardinal Fire) and Leo sustains (Fixed Fire)." },
  { q:"What signs are most compatible with Sagittarius?", a:"Sagittarius pairs best with Aries and Leo (fellow fire signs who match their energy and enthusiasm), and Gemini and Aquarius (air signs who provide intellectual stimulation and share their love of freedom). Sagittarius often has a powerful magnetic attraction to their opposite sign Gemini, though the relationship requires both sides to balance depth with variety." },
  { q:"What are Sagittarius' biggest weaknesses?", a:"Sagittarius' biggest weaknesses are bluntness that crosses into tactlessness, restlessness that makes commitment feel like captivity, and a tendency to overpromise and underdeliver. They can be preachy, self-righteous, and so focused on the big picture that they ignore the details and the feelings of people standing right in front of them." },
  { q:"What is Sagittarius Rising?", a:"Sagittarius Rising (Ascendant in Sagittarius) means your outward personality projects Sagittarius energy — people see you as friendly, open, enthusiastic, and slightly restless before they know anything else about you. You make warm first impressions, often have an athletic build or an expressive face, and tend to talk with your hands and laugh loudly. Your Rising sign requires your exact birth time to calculate." },
  { q:"What is Sagittarius Moon?", a:"A Sagittarius Moon means your emotional processing is optimistic, expansive, and philosophically oriented. You deal with hard feelings by seeking meaning, traveling, learning, or talking it through with anyone who will listen. Under stress, you run — literally or figuratively. You need emotional freedom and a partner who doesn't try to contain your feelings in a box." },
];

export default function SagittariusPage() {
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
          --purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5;--signColor:#b06ce0;
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
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 0%,rgba(176,108,224,0.06) 0%,transparent 60%)", pointerEvents:"none" }}/>
        <div className="c" style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:13, color:"rgba(232,228,240,0.3)", marginBottom:28 }}>
            <Link href="/" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>BluntChart</Link>
            <span style={{ margin:"0 8px" }}>/</span>
            <Link href="/zodiac-signs" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>Zodiac Signs</Link>
            <span style={{ margin:"0 8px" }}>/</span>
            <span style={{ color:"rgba(232,228,240,0.5)" }}>Sagittarius</span>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:48, marginBottom:32, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:320 }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                <div style={{ width:60, height:60, borderRadius:16, background:"linear-gradient(145deg, rgba(176,108,224,0.15), rgba(176,108,224,0.05))", border:"1px solid rgba(176,108,224,0.25)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 28px rgba(176,108,224,0.08)" }}>
                  <span style={{ fontSize:32, color:"var(--signColor)", fontFamily:"Georgia, serif", filter:"drop-shadow(0 0 6px rgba(176,108,224,0.4))" }}>♐</span>
                </div>
                <div>
                  <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.8rem,7vw,4.2rem)", fontWeight:900, lineHeight:1.02, margin:0, background:"linear-gradient(135deg, #b06ce0, #7b3db8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                    Sagittarius
                  </h1>
                  <p style={{ fontSize:16, color:"rgba(232,228,240,0.5)", marginTop:4 }}>The Archer · November 22 – December 21</p>
                </div>
              </div>
              <p style={{ fontSize:20, fontFamily:"var(--font-display)", fontStyle:"italic", color:"rgba(232,228,240,0.65)", lineHeight:1.55, maxWidth:560 }}>
                &ldquo;Will tell you the truth you didn&rsquo;t ask for, then book a flight before you can respond.&rdquo;
              </p>
            </div>
            <div style={{ flexShrink:0 }}>
              <Image
                src="/sagittarius-bluntchart.png"
                alt="Sagittarius zodiac sign illustration — BluntChart cosmic cat mascot"
                width={260}
                height={260}
                style={{ borderRadius:20, filter:"drop-shadow(0 0 40px rgba(176,108,224,0.15))" }}
                priority
              />
            </div>
          </div>

          <div style={{ background:"var(--card)", border:"1px solid rgba(176,108,224,0.15)", borderRadius:18, padding:"28px 32px", marginBottom:48 }}>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"var(--signColor)", marginBottom:18, letterSpacing:"0.02em" }}>Sagittarius at a Glance</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0px 48px" }}>
              {[
                ["Dates", "November 22 – December 21"],
                ["Element", "Fire 🔥"],
                ["Quality", "Mutable"],
                ["Ruling Planet", "Jupiter ♃"],
                ["Symbol", "The Archer ♐"],
                ["Day", "Thursday"],
                ["Color", "Purple, Dark Blue"],
                ["Greatest Compatibility", "Aries, Leo, Gemini"],
                ["Strengths", "Adventurous, optimistic, honest, philosophical"],
                ["Weaknesses", "Blunt, restless, commitment-averse, preachy"],
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
            Sagittarius is the ninth sign of the zodiac and the one most likely to say exactly what everyone else is thinking — loudly, at the wrong moment, with zero regret. Ruled by Jupiter, the planet of expansion, wisdom, and excess, Sagittarius moves through the world like a philosophy lecture that somehow turned into a road trip. They are the zodiac&apos;s eternal seekers: hungry for truth, allergic to boredom, and constitutionally incapable of staying in one place — physically, mentally, or emotionally — for very long.
          </p>
          <p className="pp">
            As a Mutable Fire sign, Sagittarius combines the passionate energy of fire with the adaptability of mutable quality. This makes them the zodiac&apos;s most versatile fire sign — where Aries charges and Leo holds court, Sagittarius explores. They scatter their fire in every direction, lighting up rooms, conversations, and relationships with an enthusiasm that&apos;s genuinely infectious. The problem is that fire that spreads everywhere doesn&apos;t always burn deep. Sagittarius can know a little about everything and a lot about nothing, start ten projects and finish two, and leave a trail of half-packed suitcases and half-finished conversations behind them.
          </p>

          <h2 className="h2s">What are the key Sagittarius personality traits?</h2>
          <p className="pp">
            The Sagittarius personality is built on optimism and a genuine belief that life is meant to be experienced, not observed. They are the friend who says &ldquo;let&apos;s just go&rdquo; when everyone else is still checking reviews. They trust that things will work out, and they&apos;re right often enough to keep believing it — and wrong often enough to have some spectacular stories.
          </p>
          <p className="pp">
            Sagittarians are intellectually restless. They&apos;re drawn to big ideas, foreign cultures, philosophical debates, and anyone who can teach them something they didn&apos;t already know. This isn&apos;t academic snobbery — Sagittarius learns from a street vendor in Bangkok with the same enthusiasm they bring to a university lecture. What matters is that it&apos;s new, that it challenges their worldview, and that it doesn&apos;t come with a mandatory schedule.
          </p>
          <p className="pp">
            At their best, Sagittarius is the person who expands your world, introduces you to ideas you never would have found alone, and reminds you that life is bigger than your comfort zone. At their worst, they&apos;re the person who cancels plans because something more exciting came along, gives unsolicited advice as if they invented wisdom, and disappears for three weeks only to return acting like nothing happened.
          </p>

          <h2 className="h2s">What are Sagittarius&apos; strengths and weaknesses?</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
            <div style={{ background:"rgba(93,202,165,0.04)", border:"0.5px solid rgba(93,202,165,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--teal)", marginBottom:12 }}>Strengths</div>
              <ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>
                {["Infectious optimism — makes impossible things feel achievable",
                  "Radical honesty — will never lie to you, even when you wish they would",
                  "Intellectual curiosity — genuinely interested in everything and everyone",
                  "Adventurous spirit — turns ordinary days into memorable experiences",
                  "Generosity — gives freely with time, money, and energy",
                  "Resilience — bounces back from failure with their worldview intact",
                ].map((s,i) => <li key={i}><span style={{ color:"var(--teal)", marginRight:10 }}>✓</span>{s}</li>)}
              </ul>
            </div>
            <div style={{ background:"rgba(212,83,126,0.04)", border:"0.5px solid rgba(212,83,126,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--rose)", marginBottom:12 }}>Weaknesses</div>
              <ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>
                {["Tactless bluntness — delivers truth without considering the landing",
                  "Commitment avoidance — equates settling down with giving up",
                  "Overpromising — says yes to everything, delivers on half",
                  "Preachy self-righteousness — assumes their perspective is the correct one",
                  "Restless boredom — moves on before fully experiencing where they are",
                  "Emotional shallowness — philosophizes feelings instead of feeling them",
                ].map((s,i) => <li key={i}><span style={{ color:"var(--rose)", marginRight:10 }}>✗</span>{s}</li>)}
              </ul>
            </div>
          </div>

          <h2 className="h2s">How does Sagittarius behave in love and relationships?</h2>
          <p className="pp">
            Sagittarius falls in love with the idea of a person before they fall in love with the actual person. The early stages are thrilling — they&apos;ll plan spontaneous trips, have three-hour conversations about the meaning of life at 2 AM, and make their partner feel like the most fascinating human alive. The problem starts when the novelty fades and routine appears on the horizon. Routine is Sagittarius&apos; nemesis.
          </p>
          <p className="pp">
            Sagittarius doesn&apos;t cheat because they&apos;re dishonest. They drift because they confuse comfort with stagnation. The key to keeping a Sagittarius is understanding that their need for freedom isn&apos;t a rejection of you — it&apos;s a core part of who they are. They need a partner who has their own adventures, their own friendships, and their own inner world that Sagittarius can keep discovering.
          </p>
          <p className="pp">
            What Sagittarius needs in a partner: someone honest enough to handle their honesty, independent enough to not take their absences personally, and curious enough to keep the conversation interesting for decades. Sagittarius needs a co-adventurer, not a caretaker. Possessive, routine-dependent, or emotionally needy partners will feel abandoned; partners who match Sagittarius&apos; fire will build something extraordinary.
          </p>

          <h2 className="h2s">Which zodiac signs are most compatible with Sagittarius?</h2>
          <p className="pp">
            Compatibility depends on the full birth chart, but Sun sign compatibility offers a useful starting point. Sagittarius connects most naturally with signs that value freedom, growth, and honest communication.
          </p>
          <div className="compat" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:28 }}>
            {[
              { level:"High Compatibility", signs:"Aries, Leo", color:"var(--teal)", desc:"Fellow fire signs who match Sagittarius' energy, enthusiasm, and directness. These relationships are dynamic, passionate, and built on mutual respect for each other's independence." },
              { level:"Strong Compatibility", signs:"Gemini, Aquarius", color:"#8ec5e8", desc:"Air signs that feed Sagittarius' intellectual hunger. Gemini is their opposite sign — intense attraction and complementary energies. Aquarius shares their love of freedom and big ideas." },
              { level:"Magnetic but Challenging", signs:"Virgo, Pisces", color:"var(--signColor)", desc:"Virgo's detail-orientation clashes with Sagittarius' big-picture thinking. Pisces shares their mutable nature but their emotional depth can overwhelm Sagittarius' breezy approach to feelings." },
            ].map((c,i) => (
              <div key={i} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:14, padding:"22px 20px" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:c.color, marginBottom:8 }}>{c.level}</div>
                <div style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, marginBottom:10 }}>{c.signs}</div>
                <p style={{ fontSize:14, color:"rgba(232,228,240,0.5)", lineHeight:1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="h2s">What is Sagittarius like at work and in their career?</h2>
          <p className="pp">
            Sagittarius thrives in careers that offer variety, freedom, and the opportunity to learn. They are not built for cubicles, micromanagement, or any job where the answer to &ldquo;why do we do it this way?&rdquo; is &ldquo;because we&apos;ve always done it this way.&rdquo; Give a Sagittarius a role with travel, intellectual challenge, and room to innovate — and they&apos;ll outperform everyone in the building.
          </p>
          <p className="pp">
            They make excellent professors, travel writers, foreign correspondents, entrepreneurs, coaches, and sales professionals — any role where enthusiasm, broad knowledge, and the ability to connect with diverse people is the entire job. They struggle in rigid, process-heavy, or repetitive environments. A Sagittarius doing the same task every day will eventually snap, quit, or revolutionize the process without asking permission.
          </p>
          <p className="pp">
            As leaders, Sagittarius inspires through vision and energy. They paint a picture of where the team is going that makes everyone want to follow. Their weakness is follow-through: they&apos;re brilliant at launching initiatives and terrible at maintaining them. They need operational partners who can handle the details while Sagittarius keeps the big picture alive.
          </p>

          <h2 className="h2s">How does Sagittarius handle friendships?</h2>
          <p className="pp">
            A Sagittarius friend is the one who convinces you to take the trip, try the thing, and say the thing you&apos;ve been holding back. They&apos;re the friend who disappears for weeks and then shows up with a story that makes the absence worth it. Sagittarius doesn&apos;t do small talk — they want to know what you really think, what you actually believe, and whether you&apos;re living the life you want or just the one that was expected of you.
          </p>
          <p className="pp">
            The challenge with Sagittarius friendships is reliability. They mean every plan they make — at the moment they make it. But new opportunities, new invitations, and new impulses can redirect them before the calendar date arrives. It&apos;s not malicious; their attention is simply pulled by whatever feels most alive. The friends who last with Sagittarius are the ones who don&apos;t keep score and who value quality of presence over quantity of appearances.
          </p>

          <h2 className="h2s">What does it mean to have Sagittarius as your Rising or Moon sign?</h2>
          <p className="pp">
            Your Sun sign is only one piece of your astrological profile. Many people with Sagittarius energy in other placements feel its influence just as strongly — sometimes more so.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
            <div style={{ background:"var(--card)", border:"0.5px solid rgba(176,108,224,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--signColor)", marginBottom:10 }}>Sagittarius Rising (Ascendant)</div>
              <p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>
                People with Sagittarius Rising project warmth, openness, and an infectious enthusiasm before they say a word. Others perceive them as friendly, approachable, and slightly larger-than-life. They tend to have expressive faces, animated gestures, and an energy that makes every room feel more interesting. Sagittarius Rising people are the ones who strike up conversations with strangers and somehow make everyone feel like an old friend.
              </p>
            </div>
            <div style={{ background:"var(--card)", border:"0.5px solid rgba(196,168,255,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"#c4a8ff", marginBottom:10 }}>Sagittarius Moon</div>
              <p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>
                A Sagittarius Moon processes emotions by seeking meaning and movement. They deal with pain by philosophizing it, traveling away from it, or converting it into a lesson they can share. Under stress, they become restless, preachy, or emotionally detached — turning feelings into concepts rather than experiencing them directly. They need emotional freedom above all else and express love through shared adventures, honest conversations, and an unwavering belief in their partner&apos;s potential.
              </p>
            </div>
          </div>

          <h2 className="h2s">What does Jupiter as a ruling planet mean for Sagittarius?</h2>
          <p className="pp">
            Jupiter is the planet of expansion, abundance, higher learning, and luck. As the largest planet in our solar system, it governs everything that grows, magnifies, and reaches beyond current limits. For Sagittarius, this means an innate belief that more is more — more knowledge, more experiences, more conversations, more stamps in the passport.
          </p>
          <p className="pp">
            Jupiter&apos;s influence gives Sagittarius their legendary optimism and their equally legendary excess. They&apos;re the sign most likely to overcommit, overspend, over-eat, over-share, and over-promise — not because they lack discipline, but because Jupiter doesn&apos;t recognize limits. This is both Sagittarius&apos; superpower and their Achilles heel: they genuinely believe that everything will work out, and that belief carries them through situations that would crush a more cautious sign. When it doesn&apos;t work out, they simply reframe the failure as a learning experience and start the next chapter.
          </p>

          {/* CTA mid-page */}
          <div style={{ background:"rgba(176,108,224,0.04)", border:"0.5px solid rgba(176,108,224,0.15)", borderRadius:20, padding:"44px 36px", textAlign:"center", margin:"48px 0" }}>
            <p style={{ fontSize:12, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"var(--gold)", marginBottom:12 }}>Your Sun sign is the headline</p>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, lineHeight:1.15, marginBottom:14 }}>
              Being a Sagittarius is one thing.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#b06ce0,#7b3db8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Knowing your full chart is another.</em>
            </h2>
            <p style={{ fontSize:16, color:"var(--dim)", lineHeight:1.72, maxWidth:500, margin:"0 auto 24px" }}>
              Your Sagittarius Sun interacts with your Moon, Rising, Venus, Mars, and house placements in ways that generic sign descriptions can&apos;t capture. A BluntChart reading tells you what YOUR specific chart says — ~1,500 words, brutally honest, no horoscope fluff.
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
            BluntChart vs <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>generic Sagittarius descriptions</em>
          </h2>
          <p style={{ fontSize:15, color:"var(--dim)", maxWidth:500, lineHeight:1.72, marginBottom:32 }}>Every Sagittarius page tells you the same thing. Here&apos;s what they leave out.</p>
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
            Sagittarius <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#b06ce0,#7b3db8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>FAQ</em>
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
            Your Sagittarius Sun is one placement.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#b06ce0,#7b3db8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Your full chart tells the real story.</em>
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