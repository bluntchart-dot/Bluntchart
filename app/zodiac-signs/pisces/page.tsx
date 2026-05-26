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
  { name:"Aquarius", symbol:"♒", slug:"aquarius" },
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
  { q:"What are the Pisces dates?", a:"Pisces season runs from February 19 to March 20. People born during this window have Pisces as their Sun sign. The exact start date can shift by a day year to year due to astronomical timing, so those born on February 18 or March 21 should check their birth chart to confirm which sign the Sun was actually in at their moment of birth." },
  { q:"What planets rule Pisces?", a:"Pisces has two ruling planets: Neptune (modern ruler) and Jupiter (traditional ruler). Neptune governs dreams, intuition, spirituality, illusion, and the subconscious — giving Pisces their otherworldly sensitivity and creative depth. Jupiter adds expansiveness, wisdom, and a generous spirit. Together, they create a personality that feels everything deeply and sees meaning where others see nothing." },
  { q:"What element is Pisces?", a:"Pisces is a Water sign, along with Cancer and Scorpio. Water signs are emotional, intuitive, and deeply connected to the inner world. What makes Pisces unique is its Mutable quality — meaning they are the most adaptable and fluid of the water signs, absorbing the energy around them like a sponge. Cancer initiates (Cardinal Water) and Scorpio sustains (Fixed Water), but Pisces dissolves and transforms." },
  { q:"What signs are most compatible with Pisces?", a:"Pisces pairs best with Cancer and Scorpio (fellow water signs who understand their emotional depth without requiring explanation), and Taurus and Capricorn (earth signs who provide grounding stability that Pisces needs). Pisces often has a powerful magnetic attraction to their opposite sign Virgo, though the relationship requires navigating very different approaches to order and chaos." },
  { q:"What are Pisces' biggest weaknesses?", a:"Pisces' biggest weaknesses are escapism, poor boundaries, and a tendency toward martyrdom. They absorb other people's emotions so completely that they lose track of their own, often sacrifice their needs to avoid conflict, and can retreat into fantasy, substances, or isolation when reality becomes too harsh." },
  { q:"What is Pisces Rising?", a:"Pisces Rising (Ascendant in Pisces) means your outward personality projects Pisces energy — people see you as gentle, dreamy, artistic, and emotionally perceptive before they know anything else about you. You give off an ethereal quality, often with expressive eyes and a softness that draws people in. Others feel comfortable being vulnerable around you immediately. Your Rising sign requires your exact birth time to calculate." },
  { q:"What is Pisces Moon?", a:"A Pisces Moon means your emotional processing is deeply intuitive, absorptive, and boundless. You feel everything — your own emotions, other people's emotions, the emotional energy of a room. Under stress, you retreat into your inner world, lose yourself in art or music, or emotionally shut down entirely. You need a partner who creates emotional safety without demanding that you explain feelings you can barely name yourself." },
];

export default function PiscesPage() {
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
          --purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5;--signColor:#7b9ec4;
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
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 60% 50% at 50% 0%,rgba(123,158,196,0.06) 0%,transparent 60%)", pointerEvents:"none" }}/>
        <div className="c" style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:13, color:"rgba(232,228,240,0.3)", marginBottom:28 }}>
            <Link href="/" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>BluntChart</Link>
            <span style={{ margin:"0 8px" }}>/</span>
            <Link href="/zodiac-signs" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>Zodiac Signs</Link>
            <span style={{ margin:"0 8px" }}>/</span>
            <span style={{ color:"rgba(232,228,240,0.5)" }}>Pisces</span>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:48, marginBottom:32, flexWrap:"wrap" }}>
            <div style={{ flex:1, minWidth:320 }}>
              <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:16 }}>
                <div style={{ width:60, height:60, borderRadius:16, background:"linear-gradient(145deg, rgba(123,158,196,0.15), rgba(123,158,196,0.05))", border:"1px solid rgba(123,158,196,0.25)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 0 28px rgba(123,158,196,0.08)" }}>
                  <span style={{ fontSize:32, color:"var(--signColor)", fontFamily:"Georgia, serif", filter:"drop-shadow(0 0 6px rgba(123,158,196,0.4))" }}>♓</span>
                </div>
                <div>
                  <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.8rem,7vw,4.2rem)", fontWeight:900, lineHeight:1.02, margin:0, background:"linear-gradient(135deg, #7b9ec4, #4a6e8f)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                    Pisces
                  </h1>
                  <p style={{ fontSize:16, color:"rgba(232,228,240,0.5)", marginTop:4 }}>The Fish · February 19 – March 20</p>
                </div>
              </div>
              <p style={{ fontSize:20, fontFamily:"var(--font-display)", fontStyle:"italic", color:"rgba(232,228,240,0.65)", lineHeight:1.55, maxWidth:560 }}>
                &ldquo;Absorbs everyone else&apos;s emotions, then wonders why they&apos;re exhausted by noon.&rdquo;
              </p>
            </div>
            <div style={{ flexShrink:0 }}>
              <Image
                src="/pisces-bluntchart.png"
                alt="Pisces zodiac sign illustration — BluntChart cosmic cat mascot"
                width={260}
                height={260}
                style={{ borderRadius:20, filter:"drop-shadow(0 0 40px rgba(123,158,196,0.15))" }}
                priority
              />
            </div>
          </div>

          <div style={{ background:"var(--card)", border:"1px solid rgba(123,158,196,0.15)", borderRadius:18, padding:"28px 32px", marginBottom:48 }}>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:20, fontWeight:700, color:"var(--signColor)", marginBottom:18, letterSpacing:"0.02em" }}>Pisces at a Glance</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0px 48px" }}>
              {[
                ["Dates", "February 19 – March 20"],
                ["Element", "Water 💧"],
                ["Quality", "Mutable"],
                ["Ruling Planets", "Neptune ♆ · Jupiter ♃"],
                ["Symbol", "The Fish ♓"],
                ["Day", "Thursday"],
                ["Color", "Sea Green, Lavender, Silver"],
                ["Greatest Compatibility", "Cancer, Scorpio, Taurus"],
                ["Strengths", "Empathic, creative, intuitive, compassionate"],
                ["Weaknesses", "Escapist, boundary-less, people-pleasing, martyrdom-prone"],
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
            Pisces is the twelfth and final sign of the zodiac — and it carries a little of everything that came before it. Ruled by Neptune, the planet of dreams, illusion, spirituality, and the subconscious, and co-ruled by Jupiter, the planet of expansion and wisdom, Pisces is the zodiac&apos;s most emotionally porous sign: feeling everything, absorbing everything, and processing the entire spectrum of human experience as though it were their own.
          </p>
          <p className="pp">
            As a Mutable Water sign, Pisces combines the emotional depth of water with the shape-shifting adaptability of the mutable quality. Where Cancer protects its emotional world and Scorpio controls it, Pisces dissolves into it entirely. They don&apos;t have boundaries so much as they have suggestions, and the line between their feelings and everyone else&apos;s is less a wall and more a watercolor bleed. This is their greatest gift and their most exhausting liability.
          </p>

          <h2 className="h2s">What are the key Pisces personality traits?</h2>
          <p className="pp">
            The Pisces personality is built on an almost supernatural capacity for empathy. They don&apos;t just understand what you&apos;re feeling — they feel it with you, sometimes before you&apos;ve even named it yourself. This makes them extraordinary listeners, intuitive friends, and deeply present partners. It also makes them chronically overwhelmed, because you can&apos;t absorb the emotional weight of every room you walk into without eventually running out of places to put it.
          </p>
          <p className="pp">
            Pisces lives in two worlds simultaneously: the tangible one everyone else occupies and an inner world of imagination, intuition, and meaning that is richer, stranger, and more vivid than most people will ever know. They process life through feeling rather than logic, through symbolism rather than data. A song isn&apos;t just a song — it&apos;s a memory, a mood, a whole emotional landscape. A stranger&apos;s passing comment can redirect their entire week. They are tuned to frequencies that other signs can&apos;t hear.
          </p>
          <p className="pp">
            At their best, Pisces is the healer, the artist, the person whose compassion actually changes the energy of a room. At their worst, they&apos;re the one who drowns in everyone else&apos;s problems to avoid facing their own, who retreats into fantasy because reality is too sharp, and who confuses self-sacrifice with love because nobody taught them that their own needs are allowed to matter.
          </p>

          <h2 className="h2s">What are Pisces&apos; strengths and weaknesses?</h2>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
            <div style={{ background:"rgba(93,202,165,0.04)", border:"0.5px solid rgba(93,202,165,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--teal)", marginBottom:12 }}>Strengths</div>
              <ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>
                {["Deep empathy — feels what others feel before they say a word",
                  "Creative brilliance — channels emotion into art, music, writing, and storytelling",
                  "Powerful intuition — knows things they have no logical reason to know",
                  "Boundless compassion — genuinely wants to ease suffering wherever they find it",
                  "Radical adaptability — flows through change that would break more rigid signs",
                  "Emotional courage — willing to sit with pain and darkness others avoid",
                ].map((s,i) => <li key={i}><span style={{ color:"var(--teal)", marginRight:10 }}>✓</span>{s}</li>)}
              </ul>
            </div>
            <div style={{ background:"rgba(212,83,126,0.04)", border:"0.5px solid rgba(212,83,126,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--rose)", marginBottom:12 }}>Weaknesses</div>
              <ul style={{ listStyle:"none", fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:2 }}>
                {["Escapism — retreats into fantasy, sleep, substances, or screens when reality hurts",
                  "No boundaries — absorbs others' pain until they can't find their own feelings",
                  "People-pleasing — says yes when every cell in their body screams no",
                  "Martyrdom complex — sacrifices themselves, then resents that nobody noticed",
                  "Indecisiveness — sees every side so clearly that choosing feels impossible",
                  "Addiction-prone — anything that numbs the overwhelm becomes a risk",
                ].map((s,i) => <li key={i}><span style={{ color:"var(--rose)", marginRight:10 }}>✗</span>{s}</li>)}
              </ul>
            </div>
          </div>

          <h2 className="h2s">How does Pisces behave in love and relationships?</h2>
          <p className="pp">
            Pisces in love is an all-or-nothing experience. When they fall, they fall completely — merging with their partner emotionally, intuitively, sometimes to the point where they lose track of where they end and the other person begins. They love in a way that is generous, devotional, and deeply romantic. The problem is that this same intensity can make them lose themselves entirely in a relationship, bending and reshaping until they&apos;re unrecognizable even to themselves.
          </p>
          <p className="pp">
            Pisces partners are extraordinarily attuned. They notice the shift in your voice, the tension in your shoulders, the thing you didn&apos;t say. They will anticipate your needs before you articulate them and show love through presence, tenderness, and an almost psychic attentiveness. The shadow of this is that they expect the same level of emotional attunement in return — and when they don&apos;t get it, they don&apos;t confront it. They absorb the disappointment, let it calcify into quiet resentment, and eventually retreat.
          </p>
          <p className="pp">
            What Pisces needs in a partner: someone emotionally present enough to meet them in the deep end, grounded enough to pull them back to shore when they&apos;re spiraling, and perceptive enough to notice when Pisces is giving everything away and gently remind them to keep something for themselves. They need a partner who treats their sensitivity as a strength rather than a problem to manage.
          </p>

          <h2 className="h2s">Which zodiac signs are most compatible with Pisces?</h2>
          <p className="pp">
            Compatibility depends on the full birth chart, but Sun sign compatibility offers a useful starting point. Pisces connects most naturally with signs that can hold emotional space without drowning in it alongside them.
          </p>
          <div className="compat" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:28 }}>
            {[
              { level:"High Compatibility", signs:"Cancer, Scorpio", color:"var(--teal)", desc:"Fellow water signs who understand Pisces' emotional depth without requiring explanation. Cancer provides the nurturing stability Pisces craves; Scorpio matches their intensity and shares their willingness to explore the emotional underworld." },
              { level:"Strong Compatibility", signs:"Taurus, Capricorn", color:"#8ec5e8", desc:"Earth signs that ground Pisces' fluid nature. Taurus offers sensory comfort, patience, and a steady presence; Capricorn provides structure and ambition that gives Pisces' dreams a practical framework." },
              { level:"Magnetic but Challenging", signs:"Virgo, Gemini", color:"var(--signColor)", desc:"Virgo is Pisces' opposite sign — a powerful magnetic pull between chaos and order, intuition and analysis. Gemini shares Pisces' mutable adaptability but lives in the mind rather than the heart, creating fascinating friction." },
            ].map((c,i) => (
              <div key={i} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:14, padding:"22px 20px" }}>
                <div style={{ fontSize:11, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:c.color, marginBottom:8 }}>{c.level}</div>
                <div style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, marginBottom:10 }}>{c.signs}</div>
                <p style={{ fontSize:14, color:"rgba(232,228,240,0.5)", lineHeight:1.65 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          <h2 className="h2s">What is Pisces like at work and in their career?</h2>
          <p className="pp">
            Pisces thrives in environments that engage their creativity, empathy, and intuition — and that don&apos;t require them to suppress their emotional nature in favor of corporate sterility. They are not built for rigid hierarchies, spreadsheet culture, or any job that treats humans as line items. Give a Pisces meaningful work and the autonomy to do it their way, and they&apos;ll create something that moves people.
          </p>
          <p className="pp">
            They make exceptional musicians, therapists, nurses, filmmakers, social workers, writers, nonprofit founders, and spiritual practitioners — any role where feeling deeply is the qualification rather than the liability. They have a natural talent for roles that require reading people, translating emotion into expression, or holding space for others during their hardest moments.
          </p>
          <p className="pp">
            As leaders, Pisces inspires through empathy and vision. They create environments where people feel safe to be vulnerable and are often the leader that team members remember as the one who actually cared. Their weakness is structure: they can be disorganized, avoidant of conflict, and so focused on the emotional landscape that deadlines, budgets, and deliverables become afterthoughts. They perform best when paired with someone more operationally minded who handles the scaffolding while Pisces handles the soul.
          </p>

          <h2 className="h2s">How does Pisces handle friendships?</h2>
          <p className="pp">
            A Pisces friend is the one who calls to check on you after you posted something slightly off on social media, who remembers the thing you said in passing six months ago and brings you exactly that, and who will sit with you in silence during the worst night of your life without trying to fix it or fill the space with words. They are the friend who makes you feel seen in a way that is almost disorienting in its accuracy.
          </p>
          <p className="pp">
            The challenge with Pisces friendships is reciprocity. They give so naturally and so constantly that friends often don&apos;t realize Pisces is running on empty. They absorb your crisis, hold your feelings, and process your pain alongside you — then go home and collapse, and nobody asks how they&apos;re doing because Pisces is always &ldquo;fine.&rdquo; The friends who truly thrive with Pisces are the ones who notice when the caretaker needs care, who check in without being prompted, and who make space for Pisces to be the mess for once.
          </p>

          <h2 className="h2s">What does it mean to have Pisces as your Rising or Moon sign?</h2>
          <p className="pp">
            Your Sun sign is only one piece of your astrological profile. Many people with Pisces energy in other placements feel its influence just as strongly — sometimes more so.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:28 }}>
            <div style={{ background:"var(--card)", border:"0.5px solid rgba(123,158,196,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--signColor)", marginBottom:10 }}>Pisces Rising (Ascendant)</div>
              <p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>
                People with Pisces Rising project gentleness, dreaminess, and an almost magnetic emotional warmth before they say a word. Others perceive them as soft, artistic, slightly otherworldly, and immediately trustworthy. They often have large, expressive eyes and a fluid quality to their movements that makes them seem like they&apos;re moving through water even on dry land. Pisces Rising people are the ones strangers tell their life stories to in line at the grocery store — there&apos;s something about their presence that makes people feel safe to open up.
              </p>
            </div>
            <div style={{ background:"var(--card)", border:"0.5px solid rgba(196,168,255,0.15)", borderRadius:14, padding:"22px 22px" }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"#c4a8ff", marginBottom:10 }}>Pisces Moon</div>
              <p style={{ fontSize:15, color:"rgba(232,228,240,0.62)", lineHeight:1.72 }}>
                A Pisces Moon processes emotions like a sponge in a rainstorm — absorbing everything, distinguishing nothing, and needing periodic wringing out just to function. They feel the emotional temperature of every room they enter and take on the moods of people they love without consciously choosing to. Under stress, they retreat into sleep, fantasy, music, or solitude. They need a partner who creates a safe emotional container without demanding they explain what&apos;s happening inside them — because often, they genuinely don&apos;t know. They just feel it.
              </p>
            </div>
          </div>

          <h2 className="h2s">What do Neptune and Jupiter mean as ruling planets for Pisces?</h2>
          <p className="pp">
            Neptune is the planet of dreams, illusion, transcendence, and the dissolution of boundaries. As Pisces&apos; modern ruler, it gives the sign their extraordinary intuition, their creative and spiritual depth, and their sometimes alarming ability to sense things they have no earthly reason to sense. Neptune doesn&apos;t clarify — it dissolves. This is why Pisces doesn&apos;t analyze the problem; they feel their way through it, often arriving at the answer before they can explain the logic.
          </p>
          <p className="pp">
            Jupiter, Pisces&apos; traditional ruler, adds expansiveness, generosity, and an instinct for meaning. Where Neptune dissolves the self into the collective, Jupiter expands the vision — making Pisces not just empathic but genuinely wise, not just sensitive but capable of holding the full emotional range of the human experience. The combination of Neptune and Jupiter makes Pisces the sign most capable of spiritual transcendence, artistic genius, and radical compassion — and also the most vulnerable to delusion, escapism, and losing themselves entirely.
          </p>

          {/* CTA mid-page */}
          <div style={{ background:"rgba(123,158,196,0.04)", border:"0.5px solid rgba(123,158,196,0.15)", borderRadius:20, padding:"44px 36px", textAlign:"center", margin:"48px 0" }}>
            <p style={{ fontSize:12, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"var(--gold)", marginBottom:12 }}>Your Sun sign is the headline</p>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.5rem,3.5vw,2.2rem)", fontWeight:800, lineHeight:1.15, marginBottom:14 }}>
              Being a Pisces is one thing.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#7b9ec4,#4a6e8f)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Knowing your full chart is another.</em>
            </h2>
            <p style={{ fontSize:16, color:"var(--dim)", lineHeight:1.72, maxWidth:500, margin:"0 auto 24px" }}>
              Your Pisces Sun interacts with your Moon, Rising, Venus, Mars, and house placements in ways that generic sign descriptions can&apos;t capture. A BluntChart reading tells you what YOUR specific chart says — ~1,500 words, brutally honest, no horoscope fluff.
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
            BluntChart vs <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>generic Pisces descriptions</em>
          </h2>
          <p style={{ fontSize:15, color:"var(--dim)", maxWidth:500, lineHeight:1.72, marginBottom:32 }}>Every Pisces page tells you the same thing. Here&apos;s what they leave out.</p>
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
            Pisces <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#7b9ec4,#4a6e8f)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>FAQ</em>
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
            Your Pisces Sun is one placement.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#7b9ec4,#4a6e8f)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Your full chart tells the real story.</em>
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