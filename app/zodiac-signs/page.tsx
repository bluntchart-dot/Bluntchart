"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/* ── Sign data with expanded content ── */
const SIGNS = [
  { name:"Aries", symbol:"♈", dates:"March 21 – April 19", element:"Fire", quality:"Cardinal", ruler:"Mars", slug:"aries", color:"#e8a090",
    tagline:"The one who leads before being asked, fights before thinking, and loves before protecting themselves.",
    traits:"Courageous, direct, impatient, competitive, fiercely independent",
    strengths:"Natural leadership, fearless initiative, infectious energy, unwavering honesty",
    weaknesses:"Impulsive decisions, short temper, difficulty listening, burns out chasing too many things at once",
    inLove:"Aries falls hard and fast. They want passion, chemistry, and someone who doesn't bore them. The chase excites them more than the catch — and if there's no challenge, there's no interest. They're loyal once committed, but they need a partner who can match their energy without trying to control it.",
    summary:"Aries is the first sign of the zodiac and the ignition switch of the astrological wheel. Ruled by Mars, the planet of action and aggression, Aries doesn't wait for permission — they charge in headfirst, set things on fire (sometimes literally), and deal with the consequences later. Their cardinal fire energy makes them natural initiators: the ones who start businesses, lead movements, and text first. The shadow side is impatience so intense it looks like aggression, and a tendency to abandon things the moment they stop being exciting.",
    stars:[[30,25],[55,15],[70,35],[50,50],[35,60]] },

  { name:"Taurus", symbol:"♉", dates:"April 20 – May 20", element:"Earth", quality:"Fixed", ruler:"Venus", slug:"taurus", color:"#9bc88a",
    tagline:"The one who won't be rushed, won't be moved, and won't apologize for wanting what they want.",
    traits:"Patient, reliable, stubborn, sensual, possessive, deeply loyal",
    strengths:"Unshakeable determination, aesthetic sensibility, emotional steadiness, ability to build lasting things",
    weaknesses:"Resistance to change, possessiveness in relationships, comfort-seeking that becomes avoidance, holds grudges quietly",
    inLove:"Taurus needs consistency over excitement. Grand gestures mean nothing if they're followed by silence. They want someone who shows up every day, remembers the small things, and doesn't make them guess. Once they commit, they're all in — but getting them to leave something that isn't working can take years.",
    summary:"Taurus is the second sign of the zodiac and the builder of the astrological world. Ruled by Venus, the planet of beauty and pleasure, Taurus knows exactly what they want and will wait longer than anyone else to get it right. Their fixed earth energy makes them the most grounded sign — dependable, sensual, and stubbornly resistant to anything that disrupts their comfort. They build slowly, love deeply, and hold on to people and things long past their expiration date. The strength is resilience. The shadow is stagnation.",
    stars:[[25,20],[45,15],[65,25],[55,45],[30,55],[45,65]] },

  { name:"Gemini", symbol:"♊", dates:"May 21 – June 20", element:"Air", quality:"Mutable", ruler:"Mercury", slug:"gemini", color:"#8ec5e8",
    tagline:"Two people in one body. Both of them are talking. Neither of them is finished.",
    traits:"Curious, adaptable, witty, restless, inconsistent, socially magnetic",
    strengths:"Rapid mental processing, versatility, communication skills, ability to see multiple perspectives simultaneously",
    weaknesses:"Scattered focus, emotional avoidance through intellectualizing, unreliability when bored, says what people want to hear",
    inLove:"Gemini needs a partner who can keep up mentally. Emotional connection for them starts with intellectual stimulation — if someone bores them, closeness becomes impossible. They're charming and attentive when interested, but their attention is a spotlight that moves. The partner who holds it is the one who keeps surprising them.",
    summary:"Gemini is the third sign of the zodiac and the communicator of the astrological world. Ruled by Mercury, the planet of the mind, Gemini thinks faster than they feel, connects everything to everything else, and gets bored the moment you think you've figured them out. Their mutable air energy makes them the most adaptable sign — they can talk to anyone, learn anything, and reinvent themselves on a Tuesday afternoon. The gift is versatility. The shadow is never going deep enough to stay.",
    stars:[[20,30],[35,15],[50,30],[65,15],[80,30],[50,55]] },

  { name:"Cancer", symbol:"♋", dates:"June 21 – July 22", element:"Water", quality:"Cardinal", ruler:"Moon", slug:"cancer", color:"#8aa8e8",
    tagline:"Remembers everything you said — especially the thing you didn't mean.",
    traits:"Nurturing, intuitive, moody, protective, emotionally intelligent, quietly strategic",
    strengths:"Deep empathy, emotional memory, ability to create safety for others, fierce protectiveness of loved ones",
    weaknesses:"Mood swings tied to lunar cycles, emotional manipulation when insecure, difficulty letting go of past hurts, builds walls disguised as warmth",
    inLove:"Cancer loves with their whole body. They need to feel emotionally safe before they can open up, and once they do, their devotion is total. They remember every detail — your coffee order, your childhood story, the exact words you used when you were upset. The danger is that they also remember every hurt with the same precision.",
    summary:"Cancer is the fourth sign of the zodiac and the emotional center of the astrological wheel. Ruled by the Moon, Cancer's moods shift with genuine tidal force — they feel the room before they enter it, absorb other people's emotions like a sponge, and love harder than most signs can comprehend. Their cardinal water energy makes them surprisingly initiatory: they're the ones who build the home, organize the gathering, and hold the family together. The strength is depth of feeling. The shadow is using that depth as a weapon.",
    stars:[[40,20],[55,30],[70,20],[60,45],[45,55],[35,40]] },

  { name:"Leo", symbol:"♌", dates:"July 23 – August 22", element:"Fire", quality:"Fixed", ruler:"Sun", slug:"leo", color:"#e8a090",
    tagline:"Doesn't need the spotlight. The spotlight needs them.",
    traits:"Generous, dramatic, proud, warm, attention-seeking, fiercely loyal",
    strengths:"Natural charisma, creative self-expression, generosity of spirit, ability to make others feel special",
    weaknesses:"Need for external validation, ego sensitivity, dramatic reactions to perceived slights, difficulty admitting fault",
    inLove:"Leo needs to feel adored — openly, consistently, and without ambiguity. They give love generously and expect the same in return. Silence from someone they care about is devastating. They want a partner who is proud of them in public, not just privately appreciative. The relationship must feel like a celebration, not a compromise.",
    summary:"Leo is the fifth sign of the zodiac and the heart of the astrological world. Ruled by the Sun, Leo doesn't orbit — they are the center around which everything else turns. Their fixed fire energy creates a personality that is warm, magnetic, and impossible to ignore. They don't perform for attention; they perform because existing quietly feels like a waste of their considerable gifts. The strength is radiance that lights up everyone around them. The shadow is the devastation they feel when that light isn't reflected back.",
    stars:[[30,15],[50,10],[70,20],[80,40],[60,50],[40,45],[25,35]] },

  { name:"Virgo", symbol:"♍", dates:"August 23 – September 22", element:"Earth", quality:"Mutable", ruler:"Mercury", slug:"virgo", color:"#9bc88a",
    tagline:"Already noticed the typo, the tone shift, and the thing that doesn't add up.",
    traits:"Analytical, precise, helpful, anxious, self-critical, quietly indispensable",
    strengths:"Exceptional attention to detail, practical problem-solving, reliability, ability to improve any system they touch",
    weaknesses:"Paralyzing perfectionism, inner critic that never rests, difficulty accepting 'good enough,' shows love through fixing rather than feeling",
    inLove:"Virgo shows love through acts of service — remembering your schedule, fixing the thing you mentioned once, making your life run more smoothly. They struggle with vulnerability because being open means being imperfect, and imperfection triggers their deepest anxiety. The partner who earns their trust sees a tenderness they show almost no one.",
    summary:"Virgo is the sixth sign of the zodiac and the analyst of the astrological world. Ruled by Mercury (like Gemini, but expressed through earth rather than air), Virgo processes the world through detail, precision, and an unrelenting drive to improve. Their mutable earth energy makes them the most adaptable of the practical signs — they can troubleshoot anything, optimize any system, and find the flaw everyone else missed. The strength is competence that borders on genius. The shadow is self-criticism so brutal it would make their best friend cry.",
    stars:[[25,25],[40,15],[55,30],[70,20],[65,45],[45,55]] },

  { name:"Libra", symbol:"♎", dates:"September 23 – October 22", element:"Air", quality:"Cardinal", ruler:"Venus", slug:"libra", color:"#8ec5e8",
    tagline:"Makes everyone feel included while slowly falling apart inside.",
    traits:"Diplomatic, charming, indecisive, people-pleasing, aesthetically driven, conflict-averse",
    strengths:"Social intelligence, ability to see all sides of any situation, natural aesthetic sense, talent for making others feel seen",
    weaknesses:"Chronic indecision, suppresses own needs for harmony, passive-aggressive when pushed too far, defines self through relationships",
    inLove:"Libra wants a partnership that feels equal and beautiful. They keep emotional scorecards even when they pretend they don't. They need someone who makes decisions (because they can't), who fights fair (because they won't), and who loves them enough to see through the performance of being fine.",
    summary:"Libra is the seventh sign of the zodiac and the diplomat of the astrological world. Ruled by Venus (like Taurus, but expressed through air rather than earth), Libra seeks balance, beauty, and fairness in all things. Their cardinal air energy makes them natural initiators of relationships and social connections. They're the ones who introduce people, mediate conflicts, and make sure nobody feels left out. The strength is genuine grace under pressure. The shadow is that the pressure never gets released — it just gets buried under a beautiful smile.",
    stars:[[30,30],[50,15],[70,30],[50,50],[30,50]] },

  { name:"Scorpio", symbol:"♏", dates:"October 23 – November 21", element:"Water", quality:"Fixed", ruler:"Pluto", slug:"scorpio", color:"#8aa8e8",
    tagline:"Already knows your secret. Hasn't decided what to do with it yet.",
    traits:"Intense, perceptive, secretive, passionate, controlling, transformative",
    strengths:"Emotional X-ray vision, unmatched depth of commitment, resilience through crisis, ability to transform pain into power",
    weaknesses:"Trust issues that border on paranoia, emotional manipulation when threatened, all-or-nothing approach that alienates moderates, holds grudges with geological patience",
    inLove:"Scorpio doesn't do casual. When they love, it's consuming, obsessive, and total — they want to merge with you on every level. Betrayal isn't just painful; it's an extinction-level event. They test loyalty constantly without telling you you're being tested. The partner who passes earns a devotion that most people only read about.",
    summary:"Scorpio is the eighth sign of the zodiac and the psychologist of the astrological world. Ruled by Pluto, the planet of death and transformation, Scorpio lives in the depths that other signs pretend don't exist. Their fixed water energy creates an emotional intensity that is both their greatest power and their heaviest burden. They see through pretense instantly, guard their own vulnerability with military precision, and transform themselves through crisis more effectively than any other sign. The strength is unflinching honesty about what lies beneath. The shadow is becoming the darkness they were brave enough to examine.",
    stars:[[20,20],[35,30],[50,25],[65,35],[80,30],[75,50],[60,55]] },

  { name:"Sagittarius", symbol:"♐", dates:"November 22 – December 21", element:"Fire", quality:"Mutable", ruler:"Jupiter", slug:"sagittarius", color:"#e8a090",
    tagline:"Already planning their next move. Not from you — from standing still.",
    traits:"Adventurous, blunt, optimistic, restless, philosophical, commitment-averse",
    strengths:"Infectious enthusiasm, radical honesty, big-picture thinking, ability to find meaning in chaos",
    weaknesses:"Fear of commitment disguised as love of freedom, bluntness that crosses into cruelty, starts more things than they finish, runs from emotional pain",
    inLove:"Sagittarius needs a partner who gives them space without making it conditional. They love deeply but need to choose to come back — not be forced to stay. Jealousy suffocates them. They want someone who has their own life, their own adventures, and their own opinions. The relationship must feel like a chosen alliance, not a cage.",
    summary:"Sagittarius is the ninth sign of the zodiac and the philosopher of the astrological world. Ruled by Jupiter, the planet of expansion and luck, Sagittarius needs meaning, freedom, and a horizon to chase. Their mutable fire energy makes them the most adaptable of the passionate signs — they can thrive anywhere, connect with anyone, and find the lesson in every disaster. They'll tell you the truth whether you asked for it or not, and be halfway to the next adventure before you've processed what they said. The strength is boundless optimism. The shadow is running from anything that requires them to sit still and feel.",
    stars:[[25,35],[40,20],[55,35],[70,25],[75,45],[55,55]] },

  { name:"Capricorn", symbol:"♑", dates:"December 22 – January 19", element:"Earth", quality:"Cardinal", ruler:"Saturn", slug:"capricorn", color:"#9bc88a",
    tagline:"Showed up early. Stayed late. Won't tell you it hurt.",
    traits:"Ambitious, disciplined, reserved, strategic, emotionally guarded, quietly powerful",
    strengths:"Long-term vision, work ethic that shames most, quiet authority, ability to build empires from nothing",
    weaknesses:"Emotional suppression until physical symptoms appear, measures self-worth through achievement, difficulty being vulnerable, confuses love with responsibility",
    inLove:"Capricorn shows love through reliability, provision, and presence — not words. They might not say it, but they'll be there at 3 AM without being asked. They need a partner who respects their ambition without competing with it, and who can coax out the tenderness they hide behind competence.",
    summary:"Capricorn is the tenth sign of the zodiac and the architect of the astrological world. Ruled by Saturn, the planet of discipline and time, Capricorn plays the long game in everything they do. Their cardinal earth energy makes them natural leaders who earn authority through demonstrated competence rather than charisma. They set goals, execute plans, and measure results — while quietly pretending they don't have an emotional life. The strength is a resilience that can survive anything. The shadow is forgetting that surviving and living are not the same thing.",
    stars:[[30,15],[45,25],[60,15],[55,40],[40,50],[30,40]] },

  { name:"Aquarius", symbol:"♒", dates:"January 20 – February 18", element:"Air", quality:"Fixed", ruler:"Uranus", slug:"aquarius", color:"#8ec5e8",
    tagline:"Friendly with everyone. Close to almost no one. Genuinely fine with it.",
    traits:"Independent, intellectual, detached, humanitarian, eccentric, emotionally unavailable",
    strengths:"Original thinking, ability to see systems others can't, genuine concern for collective well-being, comfortable being different",
    weaknesses:"Emotional detachment mistaken for not caring, contrarianism for its own sake, intimacy avoidance, intellectualizes feelings to avoid actually having them",
    inLove:"Aquarius needs a partner who respects their independence and doesn't interpret space as rejection. They love in unconventional ways — through shared ideas, causes, and intellectual connection rather than traditional romance. The partner who tries to possess them will lose them. The one who gives them freedom will discover a loyalty they didn't know they had.",
    summary:"Aquarius is the eleventh sign of the zodiac and the visionary of the astrological world. Ruled by Uranus, the planet of revolution and disruption, Aquarius sees the world differently — not to be contrarian, but because they genuinely perceive patterns and possibilities that others miss. Their fixed air energy creates a personality that is intellectually committed but emotionally detached. They care deeply about humanity in the abstract while struggling with individual humans up close. The strength is seeing the future before it arrives. The shadow is living so far ahead that they forget to be present.",
    stars:[[20,25],[40,15],[60,25],[75,15],[70,40],[45,50],[25,45]] },

  { name:"Pisces", symbol:"♓", dates:"February 19 – March 20", element:"Water", quality:"Mutable", ruler:"Neptune", slug:"pisces", color:"#8aa8e8",
    tagline:"Feels everything — theirs, yours, the room's. Can't always tell the difference.",
    traits:"Empathetic, creative, escapist, intuitive, boundary-less, deeply perceptive",
    strengths:"Emotional intelligence beyond measure, artistic vision, ability to connect with anyone's pain, sees beauty where others see nothing",
    weaknesses:"Absorbs others' emotions until they lose themselves, escapism through fantasy or substances, difficulty enforcing boundaries, idealizes people beyond recognition",
    inLove:"Pisces loves with their entire being and idealizes the people they care about. When their partner turns out to be human — flawed, inconsistent, imperfect — the disappointment can be crushing. They need someone grounded enough to keep them tethered but gentle enough not to dismiss their inner world as fantasy.",
    summary:"Pisces is the twelfth and final sign of the zodiac, carrying within it a trace of every sign that came before. Ruled by Neptune, the planet of dreams and dissolution, Pisces lives between reality and somewhere softer. Their mutable water energy makes them the most fluid sign — they adapt to any emotional environment, absorb whatever surrounds them, and create beauty from the overflow. They see potential in everyone, which is both their most generous gift and their most painful wound. The strength is empathy so deep it borders on psychic. The shadow is forgetting where they end and someone else begins.",
    stars:[[25,20],[40,30],[55,20],[70,35],[60,50],[40,55],[25,45]] },
];

const ELEMENTS = [
  { name:"Fire", signs:"Aries · Leo · Sagittarius", color:"#e8a090", desc:"Passionate, dynamic, and temperamental. Fire signs act on instinct, lead with energy, and demand to be seen. Their drive is unmatched — and so is their capacity to burn." },
  { name:"Earth", signs:"Taurus · Virgo · Capricorn", color:"#9bc88a", desc:"Grounded, practical, and reliable. Earth signs build things that last. They value stability, work harder than anyone in the room, and show love through actions rather than words." },
  { name:"Air", signs:"Gemini · Libra · Aquarius", color:"#8ec5e8", desc:"Intellectual, social, and analytical. Air signs live in their minds. They connect ideas, people, and systems — and need mental stimulation the way fire signs need excitement." },
  { name:"Water", signs:"Cancer · Scorpio · Pisces", color:"#8aa8e8", desc:"Emotional, intuitive, and deep. Water signs feel everything at maximum volume. Their emotional intelligence is unmatched, but so is their capacity to drown in what they feel." },
];

/* Premium constellation SVG — silver with glow */
function Constellation({ stars, color }: { stars: number[][]; color: string }) {
  return (
    <svg viewBox="0 0 100 70" style={{ position:"absolute", top:0, right:0, width:"42%", height:"100%", pointerEvents:"none" }}>
      <defs>
        <filter id="star-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {/* Connecting lines — thin silver */}
      {stars.slice(0,-1).map((s,i) => (
        <line key={`l-${i}`} x1={s[0]} y1={s[1]} x2={stars[i+1][0]} y2={stars[i+1][1]}
          stroke="#c0c8d8" strokeWidth="0.4" strokeOpacity="0.2"/>
      ))}
      {/* Stars — varying sizes, silver with subtle glow */}
      {stars.map((s,i) => (
        <g key={`s-${i}`}>
          {/* Glow layer for bright stars */}
          {i === 0 && <circle cx={s[0]} cy={s[1]} r={4} fill="#c0c8d8" fillOpacity={0.06}/>}
          {i <= 1 && <circle cx={s[0]} cy={s[1]} r={2.5} fill="#c0c8d8" fillOpacity={0.08}/>}
          {/* Star dot */}
          <circle cx={s[0]} cy={s[1]}
            r={i === 0 ? 2.2 : i <= 2 ? 1.5 : 1}
            fill={i === 0 ? "#e0e4ec" : "#c0c8d8"}
            fillOpacity={i === 0 ? 0.45 : i <= 2 ? 0.3 : 0.18}
            filter={i === 0 ? "url(#star-glow)" : undefined}
          />
          {/* Tiny cross sparkle on brightest star */}
          {i === 0 && (
            <>
              <line x1={s[0]-3.5} y1={s[1]} x2={s[0]+3.5} y2={s[1]} stroke="#e0e4ec" strokeWidth="0.3" strokeOpacity="0.2"/>
              <line x1={s[0]} y1={s[1]-3.5} x2={s[0]} y2={s[1]+3.5} stroke="#e0e4ec" strokeWidth="0.3" strokeOpacity="0.2"/>
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

/* Premium zodiac icon badge */
function ZodiacIcon({ symbol, color }: { symbol: string; color: string }) {
  return (
    <div style={{
      width:48, height:48, borderRadius:12,
      background:`linear-gradient(145deg, ${color}18, ${color}08)`,
      border:`1px solid ${color}30`,
      display:"flex", alignItems:"center", justifyContent:"center",
      flexShrink:0,
      boxShadow:`0 0 20px ${color}08, inset 0 1px 0 ${color}15`,
    }}>
      <span style={{
        fontSize:24, color, fontFamily:"Georgia, serif", lineHeight:1,
        filter:`drop-shadow(0 0 4px ${color}40)`,
      }}>{symbol}</span>
    </div>
  );
}

export default function ZodiacSignsPage() {
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
        :root{--font-display:'Playfair Display',Georgia,serif;--font-body:'DM Sans',system-ui,sans-serif;--bg:#09090f;--card:#0e0e1a;--border:rgba(255,255,255,0.08);--white:#e8e4f0;--dim:rgba(232,228,240,0.55);--gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);--purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5}
        html{scroll-behavior:smooth}body{background:var(--bg);color:var(--white);font-family:var(--font-body);-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .zs-c{max-width:1280px;margin:0 auto;padding:0 40px}
        @media(max-width:768px){.zs-c{padding:0 20px}}
        .zs-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;transition:all .3s}
        .zs-nav.on{background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
        .zs-logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;display:flex;align-items:center;gap:10px}
        .zs-logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .zs-sign{background:var(--card);border:1px solid rgba(240,184,74,0.12);border-radius:18px;padding:32px 28px;position:relative;overflow:hidden;margin-bottom:24px;text-decoration:none;display:block;transition:border-color .25s}
        .zs-sign:hover{border-color:rgba(240,184,74,0.3)}
        @media(max-width:768px){.zs-nav-links{display:none!important}.zs-el-grid{grid-template-columns:1fr 1fr!important}.zs-traits{grid-template-columns:1fr!important}}
        @media(max-width:480px){.zs-el-grid{grid-template-columns:1fr!important}}
      `}</style>

      {/* NAV */}
      <nav className={`zs-nav${scrolled?" on":""}`}>
        <div className="zs-c" style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <Link href="/" className="zs-logo"><Image src="/mascot.png" alt="BluntChart" width={34} height={34} style={{ borderRadius:"50%" }}/><span className="g">BluntChart</span></Link>
          <div className="zs-nav-links" style={{ display:"flex", alignItems:"center", gap:24 }}>
            <Link href="/free-birth-chart" style={{ fontSize:13, color:"var(--dim)", textDecoration:"none" }}>Free Birth Chart</Link>
            <Link href="/#try-it" style={{ fontSize:13, color:"#F0B84A", textDecoration:"none", fontWeight:600, border:"1px solid var(--gold-dim)", padding:"6px 15px", borderRadius:4 }}>Full Reading $15</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ paddingTop:120, paddingBottom:48, position:"relative" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 80% 60% at 50% -10%,rgba(107,47,212,.08) 0%,transparent 50%)", pointerEvents:"none" }}/>
        <div className="zs-c" style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:12, color:"rgba(232,228,240,0.3)", marginBottom:24 }}>
            <Link href="/" style={{ color:"rgba(232,228,240,0.3)", textDecoration:"none" }}>BluntChart</Link>
            <span style={{ margin:"0 8px" }}>/</span>
            <span style={{ color:"rgba(232,228,240,0.5)" }}>Zodiac Signs</span>
          </div>

          <div style={{ maxWidth:900, marginBottom:40 }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:8, fontSize:11, fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" as const, color:"#F0B84A", padding:"5px 14px", border:"1px solid var(--gold-dim)", borderRadius:100, background:"rgba(240,184,74,0.06)", marginBottom:24 }}>✦ Complete zodiac guide · All 12 signs</div>
            <h1 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(2.4rem,6vw,4rem)", fontWeight:900, lineHeight:1.06, letterSpacing:"-0.02em", marginBottom:16 }}>
              The 12 Zodiac Signs:<br/>Traits, Dates &amp; <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Personality</em>
            </h1>
            <p style={{ fontSize:17, color:"var(--dim)", lineHeight:1.78, maxWidth:640, marginBottom:16 }}>
              Every zodiac sign has a story — and most astrology sites tell it like a greeting card.
              We tell it like your most honest friend would: the strengths you rely on, the weaknesses
              you pretend aren&apos;t there, and the patterns in love and life that your Sun sign has been
              running since birth.
            </p>
            <p style={{ fontSize:15, color:"rgba(232,228,240,0.45)", lineHeight:1.72, maxWidth:620 }}>
              Below you&apos;ll find all 12 zodiac signs in order — from Aries (March 21) through Pisces (March 20).
              Each sign includes its dates, element, ruling planet, personality traits, strengths, weaknesses,
              and how it behaves in relationships. No vague wisdom. No &ldquo;you&apos;re creative and sensitive.&rdquo;
              Just what the chart says.
            </p>
          </div>

          {/* SUMMARY BOX */}
          <div style={{ background:"var(--card)", border:"1px solid rgba(240,184,74,0.15)", borderRadius:16, padding:"28px 28px 24px", maxWidth:900, marginBottom:48 }}>
            <h2 style={{ fontFamily:"var(--font-display)", fontSize:18, fontWeight:700, color:"#F0B84A", marginBottom:14 }}>Quick reference: All 12 zodiac signs</h2>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 24px" }}>
              {SIGNS.map((sign) => (
                <a key={sign.slug} href={`#${sign.slug}`} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:"0.5px solid rgba(255,255,255,0.04)", textDecoration:"none", transition:"opacity .15s" }}>
                  <div style={{ width:28, height:28, borderRadius:7, background:`${sign.color}12`, border:`1px solid ${sign.color}25`, display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <span style={{ fontSize:14, color:sign.color, fontFamily:"Georgia, serif" }}>{sign.symbol}</span>
                  </div>
                  <span style={{ fontSize:14, fontWeight:600, color:"var(--white)", minWidth:90 }}>{sign.name}</span>
                  <span style={{ fontSize:12, color:"rgba(232,228,240,0.35)" }}>{sign.dates}</span>
                  <span style={{ fontSize:10, color:sign.color, marginLeft:"auto", fontWeight:500, letterSpacing:"0.04em" }}>{sign.element}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 12 SIGN SECTIONS */}
      <section style={{ paddingBottom:48 }}>
        <div className="zs-c">
          {SIGNS.map((sign) => (
            <Link key={sign.slug} href={`/zodiac-signs/${sign.slug}`} className="zs-sign" id={sign.slug}>
              <Constellation stars={sign.stars} color={sign.color} />

              <div style={{ position:"relative", zIndex:1 }}>
                {/* Header */}
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:16, marginBottom:16, flexWrap:"wrap" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <ZodiacIcon symbol={sign.symbol} color={sign.color} />
                    <div>
                      <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2rem)", fontWeight:900, lineHeight:1.1, margin:0,
                        background:`linear-gradient(135deg, ${sign.color}, #d4537e)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
                        {sign.name}
                      </h2>
                      <div style={{ fontSize:14, color:"rgba(232,228,240,0.5)", marginTop:3, fontWeight:500 }}>{sign.dates}</div>
                    </div>
                  </div>
                  <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
                    <span style={{ fontSize:10, fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase" as const, color:sign.color, background:`${sign.color}12`, padding:"4px 12px", borderRadius:6 }}>{sign.element}</span>
                    <span style={{ fontSize:10, fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase" as const, color:"rgba(232,228,240,0.3)", background:"rgba(255,255,255,0.03)", padding:"4px 12px", borderRadius:6 }}>{sign.quality}</span>
                    <span style={{ fontSize:10, fontWeight:500, letterSpacing:"0.06em", textTransform:"uppercase" as const, color:"rgba(232,228,240,0.3)", background:"rgba(255,255,255,0.03)", padding:"4px 12px", borderRadius:6 }}>Ruler: {sign.ruler}</span>
                  </div>
                </div>

                {/* Tagline */}
                <p style={{ fontSize:15, color:"var(--white)", fontFamily:"var(--font-display)", fontStyle:"italic", lineHeight:1.5, marginBottom:16, opacity:0.85 }}>
                  &ldquo;{sign.tagline}&rdquo;
                </p>

                {/* Summary */}
                <p style={{ fontSize:14, color:"rgba(232,228,240,0.55)", lineHeight:1.7, marginBottom:18 }}>{sign.summary}</p>

                {/* Traits grid */}
                <div className="zs-traits" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:18 }}>
                  <div style={{ background:"rgba(255,255,255,0.02)", borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--teal)", marginBottom:6 }}>Strengths</div>
                    <p style={{ fontSize:12, color:"rgba(232,228,240,0.5)", lineHeight:1.55 }}>{sign.strengths}</p>
                  </div>
                  <div style={{ background:"rgba(255,255,255,0.02)", borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"var(--rose)", marginBottom:6 }}>Weaknesses</div>
                    <p style={{ fontSize:12, color:"rgba(232,228,240,0.5)", lineHeight:1.55 }}>{sign.weaknesses}</p>
                  </div>
                </div>

                {/* In love */}
                <div style={{ background:"rgba(107,47,212,0.04)", borderRadius:10, padding:"14px 16px", marginBottom:16 }}>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" as const, color:"#c4a8ff", marginBottom:6 }}>{sign.name} in love</div>
                  <p style={{ fontSize:13, color:"rgba(232,228,240,0.5)", lineHeight:1.65 }}>{sign.inLove}</p>
                </div>

                {/* Read more */}
                <span style={{ fontSize:13, fontWeight:600, color:sign.color }}>Read full {sign.name} guide →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ELEMENTS */}
      <section style={{ padding:"80px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}>
        <div className="zs-c">
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><span style={{ width:22, height:1, background:"#F0B84A" }}/><span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"#F0B84A" }}>The four elements</span></div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:12 }}>
            What element is <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>your sign?</em>
          </h2>
          <p style={{ fontSize:15, color:"var(--dim)", maxWidth:520, lineHeight:1.72, marginBottom:36 }}>Every zodiac sign belongs to one of four elements. Your element shapes how you think, feel, and relate — the fundamental energy beneath everything your sign does.</p>
          <div className="zs-el-grid" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:14 }}>
            {ELEMENTS.map((el) => (
              <div key={el.name} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:14, padding:"24px 20px", borderTop:`2px solid ${el.color}` }}>
                <div style={{ fontFamily:"var(--font-display)", fontSize:22, fontWeight:800, color:el.color, marginBottom:6 }}>{el.name}</div>
                <div style={{ fontSize:12, color:"rgba(232,228,240,0.35)", marginBottom:12 }}>{el.signs}</div>
                <p style={{ fontSize:13, color:"rgba(232,228,240,0.55)", lineHeight:1.65 }}>{el.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO LONG-FORM GUIDE */}
      <section style={{ padding:"80px 0" }}>
        <div className="zs-c" style={{ maxWidth:1080 }}>

          <style>{`
            .zs-h2{font-family:var(--font-display);font-size:clamp(1.5rem,3.2vw,2rem);font-weight:800;line-height:1.15;letter-spacing:-0.01em;color:#e8e4f0;margin:0 0 14px}
            .zs-h2 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
            .zs-h3{font-family:var(--font-display);font-size:18px;font-weight:700;color:#e8e4f0;margin:24px 0 10px}
            .zs-p{font-size:15px;color:rgba(232,228,240,0.65);line-height:1.78;margin-bottom:16px}
            .zs-p a{color:#F0B84A;text-decoration:underline;text-decoration-color:rgba(240,184,74,0.35);text-underline-offset:3px}
            .zs-p a:hover{text-decoration-color:#F0B84A}
            .zs-tldr{background:rgba(240,184,74,0.06);border-left:3px solid #F0B84A;border-radius:0 10px 10px 0;padding:16px 20px;margin:0 0 24px}
            .zs-tldr-l{font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#F0B84A;margin-bottom:6px;display:block}
            .zs-tldr-t{font-size:15px;color:#e8e4f0;line-height:1.65}
            .zs-block{margin-bottom:56px}
            .zs-list{margin:0 0 16px 0;padding-left:22px}
            .zs-list li{font-size:15px;color:rgba(232,228,240,0.65);line-height:1.7;margin-bottom:8px}
            .zs-list li strong{color:#e8e4f0;font-weight:600}
            .zs-table-wrap{overflow-x:auto;margin:8px 0 24px;-webkit-overflow-scrolling:touch}
            .zs-table{width:100%;border-collapse:collapse;font-size:14px;min-width:460px}
            .zs-table th,.zs-table td{padding:10px 14px;text-align:left;border-bottom:0.5px solid rgba(255,255,255,0.06);color:rgba(232,228,240,0.7);line-height:1.5}
            .zs-table th{color:#F0B84A;font-weight:700;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;background:rgba(255,255,255,0.02)}
            .zs-table td:first-child{color:#e8e4f0;font-weight:600;white-space:nowrap}
          `}</style>

          {/* Zodiac dates & cusp */}
          <div className="zs-block">
            <h2 className="zs-h2">Zodiac dates, <em>and why they shift by a day</em></h2>
            <div className="zs-tldr">
              <span className="zs-tldr-l">Short answer</span>
              <p className="zs-tldr-t">The dates for each zodiac sign shift by up to about 18 hours from year to year because the Sun&apos;s entry into each sign is an astronomical event, not a calendar convention. If you were born on a cusp date (roughly the 19th–23rd of any month), your birth date alone isn&apos;t enough — you need year and possibly time.</p>
            </div>
            <p className="zs-p">The dates listed above are the standard ranges, and they&apos;re accurate for most years. But you&apos;ll find sites listing March 20 for the start of Aries and others listing March 21, and neither is a typo.</p>
            <p className="zs-p">The Sun&apos;s entry into each sign is an astronomical event. Aries begins at the exact moment of the vernal equinox — when the Sun crosses the celestial equator going north. That moment drifts by up to about 18 hours from year to year, because the tropical year is 365.2422 days long and our calendar rounds. The leap year cycle pulls it back every four years.</p>
            <p className="zs-p"><strong style={{ color:"#e8e4f0" }}>If you were born on a cusp date</strong> — roughly the 19th to the 23rd of any month — your birth <em>date</em> is not enough to determine your Sun sign. You need your birth year and, if it&apos;s close, your birth time. The calculator on our <Link href="/free-birth-chart">free birth chart page</Link> resolves it exactly.</p>
            <p className="zs-p"><strong style={{ color:"#e8e4f0" }}>And to be clear: there is no such thing as being &ldquo;on the cusp&rdquo; of two signs in the sense of being both.</strong> The Sun is in one sign or the other at any given instant. It doesn&apos;t blend. What&apos;s true is that people born in the first or last couple of degrees of a sign often have several other planets in the neighbouring sign — Mercury and Venus never stray far from the Sun — which produces a genuinely mixed chart. That&apos;s a real effect with a real explanation, and it&apos;s not cusp magic.</p>
          </div>

          {/* Modalities */}
          <div className="zs-block">
            <h2 className="zs-h2">What are the <em>zodiac modalities?</em></h2>
            <div className="zs-tldr">
              <span className="zs-tldr-l">Short answer</span>
              <p className="zs-tldr-t">Every sign combines one of four elements (Fire, Earth, Air, Water) with one of three modalities (Cardinal, Fixed, Mutable). Cardinal signs initiate. Fixed signs sustain and hold. Mutable signs adapt and translate. Modality often explains behaviour better than element does — a Cardinal Water sign (Cancer) and a Fixed Water sign (Scorpio) are both deeply emotional, but Cancer acts on emotion and Scorpio holds it.</p>
            </div>
            <p className="zs-p"><strong style={{ color:"#e8e4f0" }}>Cardinal — Aries, Cancer, Libra, Capricorn.</strong> These four begin the seasons. Cardinal signs initiate. They start things, take charge, and create momentum from nothing. Their weakness is follow-through: starting is the part they&apos;re good at.</p>
            <p className="zs-p"><strong style={{ color:"#e8e4f0" }}>Fixed — Taurus, Leo, Scorpio, Aquarius.</strong> These sit at the height of each season. Fixed signs sustain, hold, and refuse to move. They&apos;re the most reliable and the most stubborn signs in the zodiac, and they will defend a position long after they&apos;ve stopped believing in it.</p>
            <p className="zs-p"><strong style={{ color:"#e8e4f0" }}>Mutable — Gemini, Virgo, Sagittarius, Pisces.</strong> These end each season and hand over to the next. Mutable signs adapt, translate, and dissolve boundaries. They&apos;re the most flexible signs and the least anchored — they can become whatever the situation requires, which sometimes means they don&apos;t know what they are.</p>
            <div className="zs-table-wrap">
              <table className="zs-table">
                <thead><tr><th></th><th>Fire</th><th>Earth</th><th>Air</th><th>Water</th></tr></thead>
                <tbody>
                  <tr><td>Cardinal</td><td>Aries</td><td>Capricorn</td><td>Libra</td><td>Cancer</td></tr>
                  <tr><td>Fixed</td><td>Leo</td><td>Taurus</td><td>Aquarius</td><td>Scorpio</td></tr>
                  <tr><td>Mutable</td><td>Sagittarius</td><td>Virgo</td><td>Gemini</td><td>Pisces</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Polarity */}
          <div className="zs-block">
            <h2 className="zs-h2">What is <em>zodiac sign polarity?</em></h2>
            <div className="zs-tldr">
              <span className="zs-tldr-l">Short answer</span>
              <p className="zs-tldr-t">Each sign is either positive/masculine/yang (Fire and Air) or negative/feminine/yin (Earth and Water). These alternate around the wheel. The terminology is ancient and has nothing to do with gender — it describes the direction of energy: outward-projecting versus inward-receiving.</p>
            </div>
            <p className="zs-p">A chart heavily weighted toward one polarity produces a recognisable pattern. Heavy positive polarity: someone who processes by expressing, who thinks out loud, whose first instinct is to act. Heavy negative polarity: someone who processes internally, who needs to sit with things, whose first instinct is to absorb and assess.</p>
          </div>

          {/* Ruling planets */}
          <div className="zs-block">
            <h2 className="zs-h2">What is the <em>ruling planet of each zodiac sign?</em></h2>
            <div className="zs-tldr">
              <span className="zs-tldr-l">Short answer</span>
              <p className="zs-tldr-t">Each sign is governed by a planet, and the planet&apos;s nature explains the sign&apos;s behaviour more directly than any adjective list. Modern astrology uses Pluto for Scorpio, Uranus for Aquarius and Neptune for Pisces; traditional astrology uses Mars, Saturn and Jupiter respectively — and the traditional readings are often sharper.</p>
            </div>
            <div className="zs-table-wrap">
              <table className="zs-table">
                <thead><tr><th>Sign</th><th>Modern ruler</th><th>Traditional</th><th>Meaning</th></tr></thead>
                <tbody>
                  <tr><td>Aries</td><td>Mars</td><td>Mars</td><td>Drive, aggression, initiative</td></tr>
                  <tr><td>Taurus</td><td>Venus</td><td>Venus</td><td>Pleasure, value, physical comfort</td></tr>
                  <tr><td>Gemini</td><td>Mercury</td><td>Mercury</td><td>Information, exchange, speed</td></tr>
                  <tr><td>Cancer</td><td>Moon</td><td>Moon</td><td>Emotion, memory, protection</td></tr>
                  <tr><td>Leo</td><td>Sun</td><td>Sun</td><td>Identity, radiance, vitality</td></tr>
                  <tr><td>Virgo</td><td>Mercury</td><td>Mercury</td><td>Analysis, discrimination, refinement</td></tr>
                  <tr><td>Libra</td><td>Venus</td><td>Venus</td><td>Harmony, aesthetics, relation</td></tr>
                  <tr><td>Scorpio</td><td>Pluto</td><td>Mars</td><td>Depth, power, transformation</td></tr>
                  <tr><td>Sagittarius</td><td>Jupiter</td><td>Jupiter</td><td>Expansion, meaning, faith</td></tr>
                  <tr><td>Capricorn</td><td>Saturn</td><td>Saturn</td><td>Structure, time, consequence</td></tr>
                  <tr><td>Aquarius</td><td>Uranus</td><td>Saturn</td><td>Disruption, systems, detachment</td></tr>
                  <tr><td>Pisces</td><td>Neptune</td><td>Jupiter</td><td>Dissolution, imagination, compassion</td></tr>
                </tbody>
              </table>
            </div>
            <p className="zs-p">Mercury and Venus each rule two signs, expressed through different elements — Mercury as Air (Gemini: ideas moving between people) and as Earth (Virgo: ideas applied to matter). Same planet, opposite output. The dual rulership of Scorpio, Aquarius and Pisces reflects a genuine split in modern astrology — Aquarius as Saturn-ruled explains its coldness and rigidity far better than Uranus does.</p>
          </div>

          {/* Compatibility */}
          <div className="zs-block">
            <h2 className="zs-h2">Zodiac sign compatibility, <em>honestly</em></h2>
            <div className="zs-tldr">
              <span className="zs-tldr-l">Short answer</span>
              <p className="zs-tldr-t">The compatibility charts everywhere reduce to a rule: same element = harmony, complementary element = attraction, square or opposite = friction. It&apos;s a very crude instrument — Sun sign compatibility compares one placement in each chart out of dozens. Moon sign compatibility is more predictive of long-term relationships; Venus and Mars matter more for romantic chemistry.</p>
            </div>
            <ul className="zs-list">
              <li><strong>Fire + Fire</strong> — high energy, high ego, mutual understanding, competitive.</li>
              <li><strong>Fire + Air</strong> — Air feeds Fire. Stimulating, fast, sometimes exhausting.</li>
              <li><strong>Earth + Earth</strong> — stable, practical, quietly deep, risk of stagnation.</li>
              <li><strong>Earth + Water</strong> — Water nourishes Earth. Grounded emotional security.</li>
              <li><strong>Air + Air</strong> — endless conversation, mental rapport, emotional avoidance.</li>
              <li><strong>Water + Water</strong> — profound intimacy, no need for explanation, no exit from the mood.</li>
              <li><strong>Fire + Water</strong> — steam. Intense, and one of them is always getting hurt.</li>
              <li><strong>Fire + Earth</strong> — Earth smothers Fire, Fire scorches Earth. Workable, effortful.</li>
              <li><strong>Air + Water</strong> — Air rationalises, Water feels. Chronic mutual mistranslation.</li>
              <li><strong>Air + Earth</strong> — abstraction meets pragmatism. Respectful, rarely passionate.</li>
            </ul>
            <p className="zs-p"><strong style={{ color:"#e8e4f0" }}>And now the honest part: this is a very crude instrument.</strong> Sun sign compatibility compares one placement in each chart against one placement in the other, out of dozens available. It ignores the <Link href="/moon-sign-calculator">Moon</Link>, which is far more predictive of whether a relationship survives. It ignores Venus and Mars, which govern romantic attraction and conflict style directly. It ignores the <Link href="/rising-sign-calculator">Ascendant</Link>, which governs whether there&apos;s chemistry in the first place. Two people with &ldquo;incompatible&rdquo; Sun signs and harmonious Moons and Venuses will do fine. Use the element grid as a rough first pass — then read the actual charts.</p>
          </div>

          {/* Which sign gets angry etc */}
          <div className="zs-block">
            <h2 className="zs-h2">Which zodiac sign <em>gets angry easily?</em> And other honest answers</h2>
            <div className="zs-tldr">
              <span className="zs-tldr-l">Short answer</span>
              <p className="zs-tldr-t">Fastest to anger: Aries (arrives at full volume, gone in twenty minutes). Stays angry longest: Scorpio and Taurus. There isn&apos;t a &ldquo;fakest&rdquo; sign — but Libra and Pisces are most likely to tell you what you want to hear, for different reasons. No sign is unloyal. A sign is not a moral category.</p>
            </div>
            <p className="zs-p"><strong style={{ color:"#e8e4f0" }}>Which sign gets angry fastest?</strong> Aries. Ruled by Mars, cardinal fire — anger is the first response, arrives at full volume, and is completely gone twenty minutes later. Aries anger is loud and short. But &ldquo;fastest&rdquo; isn&apos;t the interesting question. <strong style={{ color:"#e8e4f0" }}>Which sign stays angry longest? Scorpio and Taurus</strong> — the fixed signs. Scorpio anger goes underground and waits. Taurus anger takes weeks to arrive and then simply never leaves.</p>
            <p className="zs-p"><strong style={{ color:"#e8e4f0" }}>Which is the &ldquo;fakest&rdquo; zodiac sign?</strong> There isn&apos;t one, and this question is really asking something else. What&apos;s true: Libra and Pisces are the signs most likely to tell you what you want to hear — Libra because conflict is genuinely painful to it, Pisces because it absorbs the emotional shape of whoever it&apos;s with. Gemini gets accused of fakeness constantly for a different reason: it&apos;s genuinely different with different people, not out of deceit but because it&apos;s mutable Air and adapts to the room by nature. None of that is fakeness. It&apos;s conflict-avoidance, empathy, and adaptability respectively.</p>
            <p className="zs-p"><strong style={{ color:"#e8e4f0" }}>Which sign is most unloyal?</strong> No sign is unloyal. Sagittarius and Aquarius are the signs most likely to leave, which is different — both need autonomy at a level that reads as detachment to signs that don&apos;t. Fixed signs — Taurus, Leo, Scorpio, Aquarius — are the ones most likely to stay far too long in something that has clearly ended, which causes at least as much damage.</p>
            <p className="zs-p"><strong style={{ color:"#e8e4f0" }}>Which is the luckiest?</strong> Sagittarius, by tradition, as the sign ruled by Jupiter — the classical greater benefic. Take it with the appropriate scepticism: luck isn&apos;t distributed by birth month, and a well-placed Jupiter anywhere in a chart does more than a Sagittarius Sun with a badly-placed one.</p>
            <p className="zs-p"><strong style={{ color:"#e8e4f0" }}>Which is rarest?</strong> Births aren&apos;t evenly distributed across the year. In the US and much of Europe, Virgo and Libra are relatively common; February births are the fewest, making Aquarius and Pisces relatively uncommon. In the southern hemisphere the pattern differs. Any article giving a single global answer isn&apos;t using data.</p>
          </div>

          {/* Ophiuchus */}
          <div className="zs-block">
            <h2 className="zs-h2">Did NASA <em>change the zodiac signs?</em> The Ophiuchus story, settled</h2>
            <div className="zs-tldr">
              <span className="zs-tldr-l">Short answer</span>
              <p className="zs-tldr-t">No. Ophiuchus is a real constellation and the Sun does pass in front of it for about 18 days a year — this has been true for thousands of years, and the Babylonians knew about it. The confusion is between constellations (irregular patterns of stars) and signs (twelve equal 30-degree divisions of a circle used as a coordinate system). Astrology has used twelve equal divisions for 2,500 years and was never anchored to which constellation the Sun is visually in front of.</p>
            </div>
            <p className="zs-p">Every couple of years a story goes viral claiming astronomers have discovered a 13th zodiac sign, that all the dates have shifted, and that you&apos;re not the sign you thought you were. It reliably causes a small internet panic. Here is what&apos;s actually going on.</p>
            <p className="zs-p"><strong style={{ color:"#e8e4f0" }}>Ophiuchus is a real constellation, and this is not new.</strong> The Sun does pass in front of it for about eighteen days each year, roughly November 29 to December 18. This has been true for thousands of years. The Babylonians knew about it. Nobody discovered anything.</p>
            <p className="zs-p"><strong style={{ color:"#e8e4f0" }}>The confusion is between constellations and signs, which are two different things.</strong></p>
            <p className="zs-p"><em>Constellations</em> are irregular patterns of stars. They&apos;re different sizes, different shapes, and they overlap messily. Virgo sprawls across about 44 degrees of sky; Scorpius covers barely 7. They&apos;re a map of what&apos;s visible.</p>
            <p className="zs-p"><em>Signs</em> are twelve equal 30-degree divisions of a circle. They&apos;re a coordinate system, not a star map. The zodiac was standardised into twelve equal segments by the Babylonians around 500 BCE precisely <em>because</em> the constellations are uneven and unusable as a measurement system. Astrology has used the twelve equal divisions for two and a half thousand years. It has never been based on which star pattern the Sun happens to be visually in front of.</p>
            <p className="zs-p"><strong style={{ color:"#e8e4f0" }}>There&apos;s a second layer to it.</strong> Western astrology uses the tropical zodiac, which is anchored to the seasons rather than the stars. 0° Aries is defined as the moment of the spring equinox. Because the Earth&apos;s axis wobbles slowly (precession, a roughly 26,000-year cycle), the seasonal anchor and the visible constellations have drifted apart by about 24 degrees over the past two millennia. This is well documented, entirely expected, and has no effect whatsoever on a system that was never anchored to the constellations in the first place.</p>
            <p className="zs-p"><strong style={{ color:"#e8e4f0" }}>So: your sign hasn&apos;t changed, the dates haven&apos;t moved, and NASA hasn&apos;t updated anything.</strong> NASA has in fact published an explainer pointing out that they teach astronomy, not astrology. If you want a genuinely more accurate picture of yourself than your Sun sign gives you, the answer isn&apos;t a thirteenth sign. It&apos;s the other nine placements in your <Link href="/free-birth-chart">chart</Link> that nobody ever told you about.</p>
          </div>

          {/* Sun sign not the full picture */}
          <div className="zs-block">
            <h2 className="zs-h2">Is your <em>Sun sign the full picture?</em></h2>
            <div className="zs-tldr">
              <span className="zs-tldr-l">Short answer</span>
              <p className="zs-tldr-t">No. Your Sun sign — also called your star sign in the UK, Ireland and Australia — is the most widely known placement, but it&apos;s one of dozens in your complete birth chart. Your Moon sign governs your emotional nature; your Rising sign shapes how others perceive you; Venus reveals your love style; Mars drives your ambition and conflict approach. A full natal chart reading analyses all of these together.</p>
            </div>
            <p className="zs-p">Two people with the same Sun sign can have completely different personalities. If you want the full picture, get your <Link href="/free-birth-chart">free birth chart</Link>, find your <Link href="/big-three-calculator">Big Three</Link>, or try a <Link href="/#try-it">BluntChart full reading</Link> — a written interpretation of your entire natal chart in plain language.</p>
          </div>

        </div>
      </section>

      {/* COMPARISON */}
      <section style={{ padding:"80px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}>
        <div className="zs-c">
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><span style={{ width:22, height:1, background:"#F0B84A" }}/><span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"#F0B84A" }}>Why BluntChart</span></div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:12 }}>
            BluntChart vs <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>generic zodiac sites</em>
          </h2>
          <p style={{ fontSize:15, color:"var(--dim)", maxWidth:500, lineHeight:1.72, marginBottom:36 }}>Knowing your sign is step one. Knowing what your full chart actually says — that&apos;s where it gets real.</p>
          <div style={{ border:"1px solid rgba(255,255,255,0.08)", borderRadius:16, overflow:"hidden", maxWidth:720 }}>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 140px 140px", background:"#0a0a14", borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ padding:"16px 20px", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"var(--dim)" }}>Feature</div>
              <div style={{ padding:"16px 20px", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"#F0B84A" }}>BluntChart</div>
              <div style={{ padding:"16px 20px", fontSize:11, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase" as const, color:"var(--dim)" }}>Others</div>
            </div>
            {[
              { feature:"Based on your exact birth chart", us:true, them:"Sun sign only" },
              { feature:"High-precision ephemeris", us:true, them:"Approximate" },
              { feature:"Brutally honest, personalized insights", us:true, them:false },
              { feature:"~1,500 words written to YOUR chart", us:true, them:"Generic paragraphs" },
              { feature:"One-time payment, no subscription", us:true, them:"Subscription" },
              { feature:"Full natal chart wheel included", us:true, them:false },
              { feature:"Shareable identity card", us:true, them:false },
              { feature:"Free preview before you pay", us:true, them:false },
            ].map((row, i, arr) => (
              <div key={i} style={{ display:"grid", gridTemplateColumns:"1fr 140px 140px", borderBottom: i < arr.length-1 ? "0.5px solid rgba(255,255,255,0.05)" : "none" }}>
                <div style={{ padding:"15px 20px", fontSize:14, color:"var(--white)", fontWeight:500 }}>{row.feature}</div>
                <div style={{ padding:"15px 20px", display:"flex", alignItems:"center" }}>
                  {row.us === true ? <span style={{ color:"var(--teal)", fontWeight:700 }}>✓</span> : <span style={{ color:"var(--rose)", opacity:0.6 }}>✗</span>}
                </div>
                <div style={{ padding:"15px 20px", display:"flex", alignItems:"center" }}>
                  {row.them === true ? <span style={{ color:"var(--teal)" }}>✓</span>
                   : row.them === false ? <span style={{ color:"var(--rose)", opacity:0.6 }}>✗</span>
                   : <span style={{ color:"#6b6585", fontStyle:"italic", fontSize:13 }}>{row.them}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section style={{ padding:"80px 0" }}>
        <div className="zs-c">
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><span style={{ width:22, height:1, background:"#F0B84A" }}/><span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"#F0B84A" }}>What people say</span></div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:12 }}>
            People keep sending it <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>to their friends.</em>
          </h2>
          <p style={{ fontSize:15, color:"var(--dim)", maxWidth:440, lineHeight:1.72, marginBottom:36 }}>Real responses from beta readers. Unfiltered, because that&apos;s the whole point.</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:16 }}>
            {[
              { text:"I've used Co-Star, The Pattern, Sanctuary... none said anything I didn't already know. This one said things I hadn't told anyone.", name:"Michelle R.", meta:"Scorpio Sun · Cancer Moon · Leo Rising", init:"M" },
              { text:"Three paragraphs in I had to put my phone down. It described me. Not my sign. Me.", name:"Rachel T.", meta:"Libra Sun · Virgo Rising · Aries Moon", init:"R" },
              { text:"Way more accurate than Co-Star. It didn't sugarcoat the parts I wasn't ready to hear.", name:"Sophie K.", meta:"Aries Sun · Pisces Moon · Gemini Rising", init:"S" },
              { text:"My therapist has been saying the same thing for six months. My chart said it better in one paragraph.", name:"Dani L.", meta:"Capricorn Sun · Gemini Moon · Scorpio Rising", init:"D" },
              { text:"Finally astrology that doesn't sound like it was written for everyone and no one at the same time.", name:"Zara O.", meta:"Leo Sun · Scorpio Rising · Aquarius Moon", init:"Z" },
              { text:"Twelve dollars. I spent two hours talking about it with my best friend. Insane value.", name:"Chloe M.", meta:"Sagittarius Sun · Aquarius Moon · Taurus Rising", init:"C" },
            ].map((r, i) => (
              <div key={i} style={{ background:"var(--card)", border:"0.5px solid var(--border)", borderRadius:14, padding:24, position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:-12, right:18, fontFamily:"var(--font-display)", fontSize:"5rem", color:"rgba(107,47,212,0.1)", lineHeight:1, pointerEvents:"none" }}>&ldquo;</div>
                <div style={{ display:"flex", gap:2, marginBottom:12 }}>{Array.from({length:5}).map((_,j) => <span key={j} style={{ color:"#F0B84A", fontSize:13 }}>★</span>)}</div>
                <p style={{ fontSize:14, color:"var(--white)", lineHeight:1.68, marginBottom:18, fontStyle:"italic" }}>&ldquo;{r.text}&rdquo;</p>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#6b2fd4,#d4537e)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"var(--font-display)", fontSize:14, fontWeight:700, color:"#fff" }}>{r.init}</div>
                  <div><div style={{ fontSize:13, fontWeight:600, color:"var(--dim)" }}>{r.name}</div><div style={{ fontSize:11, color:"rgba(232,228,240,0.3)" }}>{r.meta}</div></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:"center", marginTop:32 }}>
            <Link href="/#try-it" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"14px 30px", background:"linear-gradient(135deg,#6b2fd4,#d4537e)", color:"#fff", fontWeight:700, fontSize:14, letterSpacing:"0.04em", textTransform:"uppercase" as const, textDecoration:"none", borderRadius:10 }}>Get My Full Reading — $15 ✨</Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding:"80px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}>
        <div className="zs-c" style={{ maxWidth:900 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}><span style={{ width:22, height:1, background:"#F0B84A" }}/><span style={{ fontSize:11, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, color:"#F0B84A" }}>Common questions</span></div>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.6rem,3.5vw,2.4rem)", fontWeight:800, lineHeight:1.1, marginBottom:32 }}>
            Zodiac signs <em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>FAQ</em>
          </h2>
          {[
            { q:"What are the 12 zodiac signs in order?", a:"Aries (March 21 – April 19), Taurus (April 20 – May 20), Gemini (May 21 – June 20), Cancer (June 21 – July 22), Leo (July 23 – August 22), Virgo (August 23 – September 22), Libra (September 23 – October 22), Scorpio (October 23 – November 21), Sagittarius (November 22 – December 21), Capricorn (December 22 – January 19), Aquarius (January 20 – February 18), and Pisces (February 19 – March 20). Dates shift by up to a day between years." },
            { q:"What are the zodiac modalities?", a:"Every sign combines an element with a modality. Cardinal signs (Aries, Cancer, Libra, Capricorn) initiate. Fixed signs (Taurus, Leo, Scorpio, Aquarius) sustain and hold. Mutable signs (Gemini, Virgo, Sagittarius, Pisces) adapt and translate. Modality often explains behaviour better than element — Cardinal Water (Cancer) and Fixed Water (Scorpio) are both deeply emotional, but Cancer acts on emotion and Scorpio holds it." },
            { q:"What are the ruling planets of each zodiac sign?", a:"Aries: Mars. Taurus: Venus. Gemini and Virgo: Mercury. Cancer: Moon. Leo: Sun. Libra: Venus. Scorpio: Pluto (Mars traditionally). Sagittarius: Jupiter. Capricorn: Saturn. Aquarius: Uranus (Saturn traditionally). Pisces: Neptune (Jupiter traditionally). The planet's nature explains the sign's behaviour more directly than any adjective list." },
            { q:"Am I born 'on the cusp' of two signs?", a:"No — there is no such thing as being on the cusp in the sense of being both signs. The Sun is in one sign or the other at any given instant, and it doesn't blend. What's true is that people born in the first or last couple of degrees often have several other planets in the neighbouring sign, which produces a genuinely mixed chart. That's not cusp magic." },
            { q:"Which zodiac signs are most compatible?", a:"Same element = harmony, complementary element = attraction, square or opposite = friction. This is a very crude instrument. Sun sign compatibility compares one placement out of dozens. Moon sign compatibility is more predictive of long-term relationships; Venus and Mars matter more for romantic chemistry. Use the element grid as a rough first pass, then read the actual charts." },
            { q:"Which zodiac sign gets angry easily?", a:"Aries gets angry fastest — anger arrives at full volume and is gone twenty minutes later. Scorpio and Taurus stay angry the longest — Scorpio's goes underground and waits; Taurus's takes weeks to arrive and never leaves. Cancer's anger comes out sideways as hurt rather than forward as rage, which is harder to resolve." },
            { q:"Which zodiac sign is the luckiest?", a:"Sagittarius, by tradition — ruled by Jupiter, the classical greater benefic associated with expansion and fortune. Take it with scepticism: luck isn't distributed by birth month, and a well-placed Jupiter anywhere in a chart does more than a Sagittarius Sun with a badly-placed one." },
            { q:"Did NASA change the zodiac signs? Is there a 13th sign?", a:"No. Ophiuchus is a real constellation the Sun does pass in front of for about 18 days a year, and this has been true for thousands of years — the Babylonians knew. Constellations are irregular star patterns; zodiac signs are twelve equal 30-degree divisions of a circle, a coordinate system. Astrology has used the twelve equal divisions for 2,500 years and was never anchored to which star pattern the Sun is visually in front of." },
            { q:"Why don't I relate to my zodiac sign?", a:"Your Sun sign is one of dozens of placements in your chart. A Libra Sun with an Aries Moon and Scorpio Rising will act nothing like a typical Libra description. If you have a stellium in another sign, that sign dominates — a Gemini Sun with four planets in Cancer is functionally a Cancer with a Gemini job title." },
            { q:"What is the difference between Sun sign and star sign?", a:"They're the same thing. 'Sun sign' is the astrological term — the sign the Sun was in when you were born. 'Star sign' is the popular term, dominant in the UK, Ireland and Australia. Both refer to the sign determined by your birth date." },
          ].map((f, i) => (
            <details key={i} style={{ borderBottom:"0.5px solid rgba(255,255,255,0.08)" }}>
              <summary style={{ padding:"20px 0", fontSize:15, fontWeight:600, color:"#e8e4f0", cursor:"pointer", listStyle:"none", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                {f.q}
                <span style={{ color:"var(--purple)", fontSize:18, fontWeight:700, flexShrink:0, marginLeft:16 }}>+</span>
              </summary>
              <p style={{ fontSize:14, color:"rgba(232,228,240,0.6)", lineHeight:1.78, paddingBottom:20, paddingRight:40 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding:"64px 0", background:"#0d0d18", borderTop:"1px solid var(--border)" }}>
        <div className="zs-c" style={{ textAlign:"center" }}>
          <h2 style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.4rem,3vw,2rem)", fontWeight:800, marginBottom:14 }}>
            Your Sun sign is the headline.<br/><em style={{ fontStyle:"italic", background:"linear-gradient(135deg,#f0b84a,#d4537e)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Your full chart is the story.</em>
          </h2>
          <p style={{ fontSize:14, color:"var(--dim)", maxWidth:480, margin:"0 auto 24px", lineHeight:1.72 }}>A BluntChart reading goes beyond your zodiac sign. 10 insights from your exact birth chart — brutally honest, ~1,500 words, specific to you.</p>
          <Link href="/#try-it" style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"16px 32px", background:"linear-gradient(135deg,#f0b84a,#e8854a)", color:"#0d0800", fontWeight:700, fontSize:15, textDecoration:"none", borderRadius:12 }}>Get My Full Reading · $15 ✦</Link>
        </div>
      </section>
</>
  );
}