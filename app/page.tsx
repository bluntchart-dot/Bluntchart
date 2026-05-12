"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";

// ─── TYPES ─────────────────────────────────────────────────────────────────────

interface PlanetMap {
  sun?: string; moon?: string; rising?: string; venus?: string;
  mars?: string; mercury?: string; saturn?: string; jupiter?: string;
}
interface Insight {
  planet: string;
  colorKey: string;
  truth: string;
  explain: string;
  action?: string;
}
interface ShareCard {
  sign: string;
  keyword: string;
  lines: string[];
  quote: string;
}
interface ReadingData {
  planets: PlanetMap;
  sunDates?: string;
  preview: Insight[];
  paidInsights: Insight[];
  locked: string[];
  shareCard: ShareCard;
}

// ─── STATIC DATA ───────────────────────────────────────────────────────────────

const REVIEWS = [
  { text: "I've used Co-Star, The Pattern, Sanctuary... none said anything I didn't already know. This one said things I hadn't told anyone. It was uncomfortable. I loved it.", name: "Michelle R.", meta: "Scorpio Sun, Cancer Moon", init: "M" },
  { text: "I was ready to roll my eyes. Three paragraphs in I had to put my phone down. It just... described me. Not my sign. Me.", name: "Rachel T.", meta: "Virgo Rising, Libra Sun", init: "R" },
  { text: "Way more accurate than Co-Star ever was. And it didn't sugarcoat the parts I wasn't ready to hear, which is the whole point.", name: "Sophie K.", meta: "Aries Sun, Pisces Moon", init: "S" },
  { text: "I felt attacked. In a good way. My therapist has been saying the same thing for six months. My birth chart said it better in one paragraph.", name: "Dani L.", meta: "Capricorn Sun, Gemini Moon", init: "D" },
  { text: "Finally astrology that doesn't sound like it was written for everyone and no one at the same time. Sent it to three friends immediately.", name: "Zara O.", meta: "Leo Sun, Scorpio Rising", init: "Z" },
  { text: "Twelve dollars. I spent two hours talking about it with my best friend. That's insane value.", name: "Chloe M.", meta: "Sagittarius Sun, Aquarius Moon", init: "C" },
];

const REVEALS = [
  { num: "01", title: "Why you attract the same type of people", body: "Your Venus placement, 7th house, and nodal axis spell out the exact pattern and why you keep repeating it." },
  { num: "02", title: "Why you procrastinate when it matters most", body: "Your chart shows the specific fear driving it. It's not laziness. It has never been laziness." },
  { num: "03", title: "What people assume about you instantly", body: "Your Rising sign is the mask you wear without knowing it. Most people never meet the real you." },
  { num: "04", title: "Your emotional triggers, mapped precisely", body: "Moon sign, 4th house, and Saturn's position tell us exactly where you're most raw and why certain things hit harder than they should." },
  { num: "05", title: "Where your real confidence comes from", body: "Not the kind you perform. The kind that actually holds. Your Sun and Mars placement show the difference." },
  { num: "06", title: "What your chart is screaming right now", body: "Current transits to your natal placements. The tension you're feeling isn't random. It's your chart, on schedule." },
];

const UPCOMING = [
  { badge: "Coming Soon", title: "Compatibility Reading", desc: "You and a partner, friend, or situationship. Brutally honest about the real tension points and why you keep having the same fight.", price: "$9" },
  { badge: "Coming Soon", title: "Year Ahead Reading", desc: "What your chart says about the next 12 months. Love, money, career, major turning points.", price: "$18" },
  { badge: "Coming Soon", title: "Gift a Reading", desc: "Buy for someone else. Birthday, bachelorette, just because. Delivered to their email with a gift message.", price: "$15" },
];

const COMPARISON = [
  { feature: "Based on your exact birth time", us: true, them: "Limited" },
  { feature: "Personalised written reading",   us: true, them: false },
  { feature: "Brutally honest tone",           us: true, them: false },
  { feature: "One-time payment",               us: true, them: "Subscription" },
  { feature: "Shareable identity card",        us: true, them: false },
  { feature: "~1,500 words specific to you",   us: true, them: false },
  { feature: "Free preview before you pay",    us: true, them: false },
];

const FAQS = [
  { q: "Do I need to know my exact birth time?", a: "Yes and here's why it matters. Your birth time determines your Rising sign and all 12 house placements. Without it, we can still do a reading, but you'll miss the layer that makes it feel eerily personal. Your birth certificate almost always has it. If you genuinely can't find it, use 12:00 noon and we'll note where the reading may be less precise." },
  { q: "Is this actually based on my chart or just my Sun sign?", a: "It's based on your full natal chart. Sun, Moon, Rising, Venus, Mars, Mercury, Saturn, Jupiter, plus the house positions and aspects between them. We use Swiss Ephemeris calculations, the same standard used by professional astrologers. Your Sun sign is one of dozens of data points we use." },
  { q: "How is this different from Co-Star or The Pattern?", a: "Co-Star gives you daily notifications and brief, often cryptic text. The Pattern gives you broad personality archetypes. BluntChart gives you one deep, specific reading around 1,500 words written to your exact placements, in plain language, with a tone that doesn't soften what the chart actually says. It's not a daily app. It's a mirror." },
  { q: "Can I get a refund if I don't like the reading?", a: "Because this is a personalized digital product generated instantly for you, we don't offer refunds after delivery. This is standard for custom digital goods. If something breaks or fails to generate, we'll fix it or refund immediately." },
  { q: "Is the reading AI-generated? Will it feel robotic?", a: "It's generated using AI, but the system behind it was built specifically to interpret your exact birth chart in a way that feels human, not generic. It's designed to sound like a brutally honest friend who actually understands you, not a horoscope app. The goal is simple. You read it and think how did it know that. Most people do." },
  { q: "Is this for entertainment or is it real?", a: "Both, honestly. Astrology is not science and we're clear about that. But the psychological patterns that good astrology surfaces are real. The reading is designed to make you think, not to predict your future. If it makes you more self-aware, that's real value regardless of how you feel about the stars." },
  { q: "Will my birth data be stored or sold?", a: "Your birth data is used solely to generate your reading. We don't sell it, share it with third parties, or use it for advertising. You can request deletion any time. Full details in our Privacy Policy." },
];

const PLANET_CREDENTIALS = [
  { icon: "☉", label: "Sun sign", desc: "Your core identity and ego expression" },
  { icon: "☽", label: "Moon sign", desc: "Your emotional wiring and hidden needs" },
  { icon: "↑",  label: "Rising sign", desc: "How others perceive you. Needs exact birth time." },
  { icon: "♀", label: "Venus placement", desc: "Why you attract who you attract" },
  { icon: "♂", label: "Mars placement", desc: "Where your energy goes and how you fight" },
  { icon: "♄", label: "Saturn lessons", desc: "The thing your chart keeps making you confront" },
];

const SIGN_SYMBOLS: Record<string, string> = {
  Aries:"♈",Taurus:"♉",Gemini:"♊",Cancer:"♋",Leo:"♌",Virgo:"♍",
  Libra:"♎",Scorpio:"♏",Sagittarius:"♐",Capricorn:"♑",Aquarius:"♒",Pisces:"♓",
};
const DOT_COLORS: Record<string, string> = {
  sun:"#F0B84A", moon:"#B8B0D4", rising:"#9B6FE8", venus:"#D4537E",
  mars:"#E8854A", mercury:"#5DCAA5", saturn:"#8A849E", jupiter:"#F0D87A",
};
const PLANET_LABELS: Record<string, string> = {
  sun:"Sun", moon:"Moon", rising:"Rising", venus:"Venus",
  mars:"Mars", mercury:"Mercury", saturn:"Saturn", jupiter:"Jupiter",
};
const PLANET_ORDER = ["sun","moon","rising","venus","mars","mercury","saturn","jupiter"];
const LOADING_MSGS = ["Reading the stars…","Consulting your planets…","Finding your truth…","Almost there…"];

// ─── AI PROMPT ─────────────────────────────────────────────────────────────────

const makePrompt = (name: string, dob: string, time: string, city: string) =>
`You are BluntChart. You are the brutally honest friend everyone needs but nobody has. You speak like that one person who actually tells the truth at the dinner table. Warm but unfiltered. Specific but not mean. The kind of advice that makes someone go quiet for a second because you nailed it.

Birth details: Name: ${name}, Date: ${dob}, Time: ${time}, City: ${city}

TONE EXAMPLES — write like this, not like a horoscope:
"You keep picking partners who are basically just your therapy project. You are not a rehab center."
"Your friend the listener is actually just the trauma dumper. Your chart says set a boundary before you lose your mind."
"You are not busy. You are avoiding the one conversation that will actually fix everything."
"Stop asking if they are busy. They are not busy. They are just not that into you. Move on."
"You do not need a partner. You need to stop falling in love with the version of people you invented in your head."
"You are brilliant at starting things and terrible at finishing them and somewhere deep down you already know this."

ABSOLUTE RULES:
- Address ${name} by first name at least once per insight
- No dashes, no em dashes, no hyphens used as separators
- No bullet points, no numbered lists inside insight text
- No wellness speak, no "universe", no "journey", no "healing"
- Write like a person texting their friend the truth, not like a report
- Every line must feel written for THIS specific person not any Aries or any Taurus
- Short punchy sentences. Let them breathe. Mix short with medium.
- Show the strength AND how that same strength is the problem

For the shareCard: this is the most important part of the entire output. It will be posted to Instagram Stories, sent in DMs, shared in group chats. It must feel like it was written specifically for this exact person based on their actual placements.

THE FORMAT — Flex Card with a Sting. Always exactly 3 lines. No more. No less.

Line 1 — THE FLEX. The thing they own about themselves. Unapologetic. Based on their Sun or Rising sign energy. Sounds like something they would actually say about themselves if they were being honest. Bold. No softening.

Line 2 — THE STING. The cost of that same trait. The shadow side. Specific to their Moon, Venus, or Saturn placement. The line that makes them pause. Not mean, just true. The kind of thing a close friend says and then goes quiet.

Line 3 — THE WITNESS. Warm. Short. Makes them feel understood rather than attacked. Does NOT mention charts, astrology, or the app. Sounds like something a close friend would say after the sting. This is what tips them from "I relate" to "I am sharing this."

RULES:
Each line must be under 12 words. Short sentences. No em dashes. No hyphens as separators.
Line 1 should feel like a statement they would caption a photo with.
Line 2 should feel like the thing their best friend finally said out loud.
Line 3 should feel like a warm hand on the shoulder after the sting.
The whole card should read like one coherent thought. Not three random observations.
NEVER use the words "chart", "astrology", "placement", "reading", or any app language anywhere in the lines or quote. The card must feel like it came from a person who knows them, not a product.
Focus on personality in relationships and emotional patterns. Never career or money.

EXAMPLES OF THE TONE AND STRUCTURE (generate fresh content for this specific person based on their actual placements, do not copy these):

Example A:
"You will fight for everyone in this room.
Nobody has ever had to fight for you.
Maybe it is time to let someone try."

Example B:
"You are not hard to love.
You are hard to love badly.
There is a difference. And you deserve someone who knows it."

The keyword must be 2 to 4 words in ALL CAPS. It should be the identity label they did not know they needed. Something they will use as a caption. Slightly uncomfortable because it is too accurate. Examples of the energy: SOFT BUT SELECTIVE, QUIETLY UNMOVABLE, SELECTIVE HEART, LOVES TOO HONESTLY, EVERYONE'S SAFE PLACE, THE ONE WHO STAYS.

The quote at the bottom is the emotional payoff. Under 20 words. The sentence that makes them feel like someone finally understood them. Warm, specific, never generic. The kind of line they screenshot and keep even if they never share the card.

Return ONLY valid JSON. No markdown. No code blocks. No backticks. Nothing before or after the JSON.

The JSON must have this exact structure:

{
  "planets": {
    "sun": "Aries",
    "moon": "Taurus",
    "rising": "Taurus",
    "venus": "Aries (retrograde)",
    "mars": "Sagittarius",
    "mercury": "Pisces",
    "saturn": "Taurus",
    "jupiter": "Gemini"
  },
  "sunDates": "March 21 to April 19",
  "preview": [
    {
      "planet": "Sun in Aries",
      "colorKey": "sun",
      "truth": "${name}, you have more raw energy than most people will ever have in their lives. The problem is you spend it like you have an unlimited supply and then act surprised when you burn out at the finish line. You have started more things than you have finished and somewhere on your phone right now there is a note with a business idea you told three people about and never opened again.",
      "explain": "In simple words: You are built for beginnings. The excitement of a new thing is genuinely your fuel. But Aries energy burns hot and fast and the moment something stops being new it starts feeling like a chore. That is not a character flaw. It is just physics. The question is whether you are going to keep starting new fires or finally learn to keep one burning.",
      "action": "Pick one thing you abandoned in the last six months. Set a 20 minute timer and work on only that today. No new ideas allowed during those 20 minutes."
    },
    {
      "planet": "Moon in Taurus",
      "colorKey": "moon",
      "truth": "You present yourself as low maintenance and adaptable but ${name} you are neither of those things and the people closest to you absolutely know it. You have built an entire identity around not needing much because needing things felt unsafe at some point. So now you have a long list of unmet needs and a reputation for being chill that makes it impossible for anyone to actually show up for you.",
      "explain": "In simple words: You are more sensitive than you let on. You have learned to hide it because showing need felt like showing weakness. But the version of you that says you are fine when you are not is costing you actual intimacy. Your Moon in Taurus is not asking you to be needy. It is asking you to be honest about what you actually require.",
      "action": "Tell one person close to you something specific you need this week. Not a hint. Not a suggestion. Say it out loud with actual words."
    }
  ],
  "paidInsights": [
    {
      "planet": "Saturn in Taurus",
      "colorKey": "saturn",
      "truth": "${name} you work harder than almost everyone around you and you still feel behind. The bar keeps moving the moment you reach it. You hit a goal and instead of sitting in it for even five minutes you immediately spot everything that still needs to be fixed. This is not ambition. This is Saturn sitting directly on your self worth telling you that you have not earned the right to feel good yet. It is lying.",
      "explain": "In simple words: The thing driving you is not passion. It is the fear that you are not enough yet. Saturn in Taurus puts that fear specifically around security and self worth and it makes you work constantly but feel satisfied almost never. The lesson is not to work less. It is to learn that the finish line was never going to give you the feeling you are chasing.",
      "action": "Write down one thing you did in the last year that you are genuinely proud of. Read it without following it with a but or a however."
    },
    {
      "planet": "Venus in Aries (retrograde)",
      "colorKey": "venus",
      "truth": "${name} you chase people with the full force of your personality and the moment they finally choose you back something in you goes quiet. The interest cools. You find reasons to pull away. You have done this more than once and told yourself each time it just was not the right person. But the pattern is the same every time. That is not bad luck. That is a pattern.",
      "explain": "In simple words: Venus retrograde in Aries means your relationship with desire is complicated. You want what you cannot have and when you get it you do not quite know what to do with it. This is not about the other person. It is about learning to stay once the chase is over. The intensity you feel at the start is real. Learning to convert it into something that lasts is the actual work.",
      "action": "Think about the last person you pulled away from once they got close. Write down the actual reason, not the story you told yourself."
    },
    {
      "planet": "Mars in Sagittarius",
      "colorKey": "mars",
      "truth": "You have the energy to start ten projects, the enthusiasm to pitch them all, and the follow through of someone who just remembered they had a flight to catch. ${name} your Mars wants freedom so badly that it treats commitment like a trap. This applies to more than work. It applies to people, to decisions, to anything that requires you to close a door.",
      "explain": "In simple words: Mars in Sagittarius is a fire that burns in every direction at once. The ambition is real. The vision is genuine. But the moment a thing requires grinding rather than discovering, your energy moves on. The fix is not forcing yourself to be someone you are not. It is learning to structure your life around sprints instead of pretending you are built for marathons.",
      "action": "Name one commitment you have been half-in on for months. Decide today: go all in or let it go. The middle is the most exhausting place to live."
    },
    {
      "planet": "Rising in Taurus",
      "colorKey": "rising",
      "truth": "The first impression you give is calm, grounded, reliable. People meet you and immediately feel like you have your life together. ${name} this is both your greatest asset and a cage you did not entirely choose. People bring you their problems because you seem sturdy. They underestimate your chaos because you seem stable. They stay because you feel safe. Not all of them deserve that access.",
      "explain": "In simple words: Your Rising sign is the face you wear in the world before you say a word. Taurus rising reads as someone who is solid and unshakeable. That reputation draws people in. It also means your own unrest gets invisible. You have to work twice as hard to let people know when you are not okay because nothing about your exterior signals it.",
      "action": "The next time something genuinely bothers you, say it out loud before you have time to smooth it over. Let someone see the rough edge."
    },
    {
      "planet": "Jupiter in Gemini",
      "colorKey": "jupiter",
      "truth": "${name} your luck lives in your words. In conversations. In the connection between ideas that no one else sees. Every time you have talked your way into or out of something, every time a random conversation opened a door you did not expect, that was Jupiter doing exactly what it was built to do. The problem is you keep looking for your luck in the wrong places.",
      "explain": "In simple words: Jupiter in Gemini expands through communication, curiosity, and connection. You are luckiest when you are talking, writing, pitching, exploring ideas, and meeting people who think differently. The mistake most people with this placement make is assuming luck looks like a stable plan. For you it looks like following an interesting conversation and seeing where it leads.",
      "action": "Have one conversation this week purely out of curiosity with no agenda. No networking, no goal. Just see what opens up."
    },
    {
      "planet": "Mercury in Pisces",
      "colorKey": "mercury",
      "truth": "You think in feelings before you think in words. ${name} you often know the answer before you can explain how you got there. This makes you intuitive in ways that impress people and infuriating in meetings when you cannot show your work. You have lost arguments you were right about because you could not articulate the knowing fast enough. That is Mercury in Pisces. Brilliant and slippery at the same time.",
      "explain": "In simple words: Your mind processes through imagery, emotion, and association rather than logic and sequence. You are not a bad communicator. You are a different kind of communicator. The gap between what you feel and what you can express is real and it shows up most under pressure. The fix is giving yourself more time before you have to speak, and learning to trust that the words will catch up.",
      "action": "Before your next important conversation or message, write out what you want to say first. Not to send, just to let the feeling find its shape."
    },
    {
      "planet": "Your self-sabotage pattern",
      "colorKey": "saturn",
      "truth": "${name} your specific pattern is this. You get close to something real, something that could actually work, and then you introduce chaos. You pick a fight that did not need to happen. You disappear for no clear reason. You find a flaw that lets you leave before the leaving happens to you. It is so consistent across different areas of your life that it cannot be coincidence. Your chart calls this a Saturn and Venus wound that reads abandonment as inevitable so you exit first.",
      "explain": "In simple words: Self-sabotage in your chart is not random self-destruction. It is a protective reflex. Something early taught you that good things do not stay. So before they leave, you create the exit. Knowing the pattern does not make it stop immediately. But it does mean that next time you feel the urge to blow something up that is actually working, you will at least recognize what is happening.",
      "action": "Think of one thing in the last two years that fell apart and ask honestly: did I create the ending before the ending could find me?"
    },
    {
      "planet": "The 12th house shadow",
      "colorKey": "rising",
      "truth": "There is a version of you that almost nobody gets to see. ${name} the 12th house in your chart holds what you hide not because it is shameful but because it feels too undefended to show. The longing you do not talk about. The version of you that wants to be chosen without having to perform. The fear that if people saw the soft centre under all that competence they would use it against you. They probably would not. But the fear is real.",
      "explain": "In simple words: The 12th house is the hidden room in your chart. It contains what you keep private, what you process alone, and what you cannot quite put into words even to yourself. For you this shows up as a gap between who you present and who you actually are in the quiet. This is not a problem to fix. It is an invitation to let at least one person close enough to see the room.",
      "action": "Tell one person something true about yourself this week that you have never said out loud. Not a confession. Just a true thing."
    }
  ],
  "locked": [
    "Venus in Aries retrograde: why you chase people then vanish the moment they actually want you back",
    "Mars in Sagittarius: the enormous gap between your ambition and your actual follow through",
    "Rising in Taurus: the version of you the world sees and why it keeps attracting the wrong people",
    "Jupiter in Gemini: where your luck actually lives and why you keep missing it",
    "Mercury in Pisces: why your brain works in feelings not logic and how that tanks your communication",
    "Your specific self sabotage pattern: named and explained from your exact chart",
    "The 12th house shadow: the thing you hide from everyone including yourself",
    "Your work and money truth: what your chart says you are actually here to do"
  ],
  "shareCard": {
    "sign": "Aries",
    "keyword": "EVERYONE'S SAFE PLACE",
    "lines": [
      "You will fight for everyone in this room.",
      "Nobody has ever had to fight for you.",
      "Maybe it is time to let someone try."
    ],
    "quote": "You are not too much. You just have not found someone who knows what to do with all of you yet."
  }
}

IMPORTANT: Generate the paidInsights array with EXACTLY 8 full insight objects based on the actual birth chart of ${name}. Each must have planet, colorKey, truth, explain, and action fields. Make the truth field at least 4 sentences, deeply personal, and specific to the actual sign. The paidInsights must cover: Venus placement, Mars placement, Rising sign, Jupiter, Mercury, self-sabotage pattern, 12th house shadow, and one more synthesized insight about their core wound or life pattern.`;

// ─── SIGN SYMBOLS ─────────────────────────────────────────────────────────────
void SIGN_SYMBOLS;

// ─── BIRTH CHART WHEEL — real positions + colored aspects ─────────────────────

const SIGN_BASE_DEG: Record<string, number> = {
  Aries:0, Taurus:30, Gemini:60, Cancer:90, Leo:120, Virgo:150,
  Libra:180, Scorpio:210, Sagittarius:240, Capricorn:270, Aquarius:300, Pisces:330,
};

function signToDeg(signStr: string): number {
  const name = signStr.trim().split(/\s+/)[0];
  const base = SIGN_BASE_DEG[name] ?? 0;
  return base + 15;
}

function getAspect(deg1: number, deg2: number): { type: string; color: string } | null {
  let diff = Math.abs(deg1 - deg2) % 360;
  if (diff > 180) diff = 360 - diff;
  const orb = 8;
  if (diff <= orb)              return { type: "conjunction",  color: "#f0d87a" };
  if (Math.abs(diff - 60) <= orb)  return { type: "sextile",     color: "#a8e6cf" };
  if (Math.abs(diff - 90) <= orb)  return { type: "square",      color: "#ffb3c1" };
  if (Math.abs(diff - 120) <= orb) return { type: "trine",       color: "#c3b1e1" };
  if (Math.abs(diff - 180) <= orb) return { type: "opposition",  color: "#a8d8ea" };
  return null;
}

function BirthChartWheel({ planets, name }: { planets: PlanetMap; name: string }) {
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 138;
  const zodiacR = 122;
  const zodiacInner = 104;
  const houseR = 96;
  const innerR = 60;
  const toRad = (deg: number) => (deg - 90) * Math.PI / 180;
  const activePlanets = PLANET_ORDER.filter(k => planets[k as keyof PlanetMap]);

  const zodiacSigns = ["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
  const zodiacColors = [
    "#E8854A","#5DCAA5","#F0B84A","#7EB8D4",
    "#F0B84A","#5DCAA5","#D4537E","#9B6FE8",
    "#E8854A","#8A849E","#7EB8D4","#9B6FE8",
  ];

  const planetSymbols: Record<string, string> = {
    sun:"☉", moon:"☽", rising:"AC", venus:"♀", mars:"♂",
    mercury:"☿", saturn:"♄", jupiter:"♃"
  };

  const getPlanetDeg = (key: string): number => {
    const signStr = planets[key as keyof PlanetMap] || "";
    return signToDeg(signStr);
  };

  const getPlanetPos = (key: string) => {
    const deg = getPlanetDeg(key);
    const angle = toRad(deg);
    const r = (houseR + zodiacInner) / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle), deg };
  };

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ display:"block", margin:"0 auto", filter:"drop-shadow(0 0 28px rgba(107,47,212,0.3))" }}>
      <defs>
        <radialGradient id="innerGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(107,47,212,0.15)"/>
          <stop offset="100%" stopColor="rgba(4,3,16,0.9)"/>
        </radialGradient>
        <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(155,111,232,0.08)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>

      <circle cx={cx} cy={cy} r={outerR} fill="none" stroke="rgba(155,111,232,0.55)" strokeWidth="1"/>
      <circle cx={cx} cy={cy} r={outerR - 8} fill="none" stroke="rgba(155,111,232,0.12)" strokeWidth="0.5"/>
      {Array.from({length:72}).map((_,i) => {
        const a = toRad(i * 5);
        const isMajor = i % 6 === 0;
        const isMinor = i % 2 === 0;
        const r1 = outerR - (isMajor ? 11 : isMinor ? 6 : 4);
        const r2 = outerR - 1;
        return <line key={`tick-${i}`}
          x1={cx + r1 * Math.cos(a)} y1={cy + r1 * Math.sin(a)}
          x2={cx + r2 * Math.cos(a)} y2={cy + r2 * Math.sin(a)}
          stroke={isMajor ? "rgba(155,111,232,0.75)" : "rgba(155,111,232,0.22)"}
          strokeWidth={isMajor ? "1.2" : "0.5"}/>;
      })}

      <circle cx={cx} cy={cy} r={zodiacR} fill="none" stroke="rgba(107,47,212,0.5)" strokeWidth="1"/>
      <circle cx={cx} cy={cy} r={zodiacInner} fill="none" stroke="rgba(107,47,212,0.4)" strokeWidth="0.8"/>
      {Array.from({length:12}).map((_,i) => {
        const a = toRad(i * 30);
        const aMid = toRad(i * 30 + 15);
        const rSym = (zodiacR + zodiacInner) / 2;
        return (
          <g key={`z-${i}`}>
            <line
              x1={cx + zodiacInner * Math.cos(a)} y1={cy + zodiacInner * Math.sin(a)}
              x2={cx + outerR * Math.cos(a)} y2={cy + outerR * Math.sin(a)}
              stroke="rgba(107,47,212,0.45)" strokeWidth="0.8"/>
            <text x={cx + rSym * Math.cos(aMid)} y={cy + rSym * Math.sin(aMid)}
              textAnchor="middle" dominantBaseline="middle"
              fill={zodiacColors[i]} fontSize="10" opacity="0.9" fontFamily="serif">
              {zodiacSigns[i]}
            </text>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r={houseR} fill="none" stroke="rgba(107,47,212,0.28)" strokeWidth="0.7"/>
      {Array.from({length:12}).map((_,i) => {
        const a = toRad(i * 30 + 5);
        const aMid = toRad(i * 30 + 20);
        return (
          <g key={`h-${i}`}>
            <line
              x1={cx + innerR * Math.cos(a)} y1={cy + innerR * Math.sin(a)}
              x2={cx + houseR * Math.cos(a)} y2={cy + houseR * Math.sin(a)}
              stroke="rgba(155,111,232,0.18)" strokeWidth="0.5" strokeDasharray="2,4"/>
            <text
              x={cx + (innerR + 14) * Math.cos(aMid)}
              y={cy + (innerR + 14) * Math.sin(aMid)}
              textAnchor="middle" dominantBaseline="middle"
              fill="rgba(155,111,232,0.32)" fontSize="6.5" fontFamily="sans-serif">
              {i + 1}
            </text>
          </g>
        );
      })}

      <circle cx={cx} cy={cy} r={innerR} fill="url(#innerGrad)" stroke="rgba(107,47,212,0.5)" strokeWidth="0.8"/>
      <circle cx={cx} cy={cy} r={innerR - 4} fill="url(#centerGlow)" stroke="none"/>

      {activePlanets.map((key, idx) => {
        const deg1 = getPlanetDeg(key);
        const ix1 = cx + (innerR - 2) * Math.cos(toRad(deg1));
        const iy1 = cy + (innerR - 2) * Math.sin(toRad(deg1));
        return activePlanets.slice(idx + 1).map((key2) => {
          const deg2 = getPlanetDeg(key2);
          const ix2 = cx + (innerR - 2) * Math.cos(toRad(deg2));
          const iy2 = cy + (innerR - 2) * Math.sin(toRad(deg2));
          const aspect = getAspect(deg1, deg2);
          const stroke = aspect ? aspect.color : "rgba(155,111,232,0.12)";
          const opacity = aspect ? 0.55 : 0.2;
          const sw = aspect ? "0.8" : "0.35";
          return (
            <line key={`asp-${key}-${key2}`}
              x1={ix1} y1={iy1} x2={ix2} y2={iy2}
              stroke={stroke} strokeWidth={sw} opacity={opacity}/>
          );
        });
      })}

      {activePlanets.map((key) => {
        const pos = getPlanetPos(key);
        const color = DOT_COLORS[key] || "#6B2FD4";
        const rimX = cx + innerR * Math.cos(toRad(pos.deg));
        const rimY = cy + innerR * Math.sin(toRad(pos.deg));
        return (
          <line key={`con-${key}`}
            x1={rimX} y1={rimY} x2={pos.x} y2={pos.y}
            stroke={color} strokeWidth="0.6" opacity="0.5"/>
        );
      })}

      {activePlanets.map((key) => {
        const pos = getPlanetPos(key);
        const color = DOT_COLORS[key] || "#6B2FD4";
        const sym = planetSymbols[key] || key[0].toUpperCase();
        const isAC = sym === "AC";
        const signRaw = planets[key as keyof PlanetMap] || "";
        const isRetro = signRaw.toLowerCase().includes("retro");
        return (
          <g key={`pl-${key}`}>
            <circle cx={pos.x} cy={pos.y} r={10} fill={color} opacity="0.1"/>
            <circle cx={pos.x} cy={pos.y} r={6}  fill={color} opacity="0.15"/>
            <circle cx={pos.x} cy={pos.y} r={4.5} fill={color} opacity="0.95"/>
            <text x={pos.x} y={pos.y - 8} textAnchor="middle"
              fill={color} fontSize={isAC ? "5.5" : "8"} fontWeight="700"
              fontFamily="serif" opacity="1">
              {sym}
            </text>
            {isRetro && (
              <text x={pos.x + 6} y={pos.y - 6} textAnchor="middle"
                fill={color} fontSize="5.5" fontFamily="sans-serif" opacity="0.8">
                ℞
              </text>
            )}
          </g>
        );
      })}

      <text x={cx} y={cy - 7} textAnchor="middle"
        fill="rgba(232,228,240,0.18)" fontSize="6" fontWeight="700"
        letterSpacing="1.8" fontFamily="sans-serif">
        {name.toUpperCase()}
      </text>
      <text x={cx} y={cy + 7} textAnchor="middle"
        fill="rgba(155,111,232,0.7)" fontSize="12" fontFamily="serif">✦</text>

      {[
        { label:"△", color:"#c3b1e1", x: cx - 42 },
        { label:"□", color:"#ffb3c1", x: cx - 14 },
        { label:"✶", color:"#a8e6cf", x: cx + 14 },
        { label:"☍", color:"#a8d8ea", x: cx + 42 },
      ].map((l) => (
        <text key={l.label} x={l.x} y={size - 6} textAnchor="middle"
          fill={l.color} fontSize="7" fontFamily="serif" opacity="0.6">
          {l.label}
        </text>
      ))}
    </svg>
  );
}

// ─── INSIGHT CARD ─────────────────────────────────────────────────────────────

function InsightCard({ ins, badge, badgeColor }: {
  ins: Insight;
  badge: string;
  badgeColor: string;
}) {
  const col = DOT_COLORS[ins.colorKey] || "#6B2FD4";
  const parts = ins.explain.split("In simple words:");
  return (
    <div style={{
      background: "rgba(255,255,255,0.02)",
      border: "0.5px solid rgba(255,255,255,0.06)",
      borderRadius: 20,
      overflow: "hidden",
      marginBottom: 28,
    }}>
      <div style={{
        padding: "16px 28px 14px",
        borderBottom: "0.5px solid rgba(255,255,255,0.04)",
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}>
        <div style={{
          width: 9, height: 9, borderRadius: "50%",
          background: col, flexShrink: 0,
          boxShadow: `0 0 10px ${col}70`,
        }}/>
        <div style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "1.2px",
          textTransform: "uppercase" as const,
          color: "rgba(232,228,240,0.4)", flex: 1,
        }}>
          {ins.planet}
        </div>
        <div style={{
          fontSize: 10,
          background: badgeColor === "gold"
            ? "rgba(240,184,74,0.1)"
            : "rgba(29,158,117,0.1)",
          color: badgeColor === "gold" ? "#f0b84a" : "#5dcaa5",
          padding: "3px 12px",
          borderRadius: 20,
          fontWeight: 600,
          letterSpacing: "0.5px",
        }}>
          {badge}
        </div>
      </div>
      <div style={{ padding: "28px 28px 24px" }}>
        <p style={{
          fontSize: 17, lineHeight: 1.85, color: "#e8e4f0", marginBottom: 20,
          fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400,
          letterSpacing: "0.01em",
        }}>
          {ins.truth}
        </p>
        <div style={{
          background: "rgba(107,47,212,0.05)",
          borderLeft: "2px solid rgba(107,47,212,0.35)",
          borderRadius: "0 12px 12px 0",
          padding: "16px 20px",
          fontSize: 14,
          color: "rgba(184,176,212,0.85)",
          lineHeight: 1.85,
          marginBottom: ins.action ? 14 : 0,
        }}>
          {parts.length > 1
            ? <><span style={{ color: "#c4a8ff", fontWeight: 600 }}>In simple words: </span>
                <span>{parts[1].trim()}</span></>
            : ins.explain}
        </div>
        {ins.action && (
          <div style={{
            background: "rgba(240,184,74,0.04)",
            borderLeft: "2px solid rgba(240,184,74,0.3)",
            borderRadius: "0 12px 12px 0",
            padding: "14px 20px",
            fontSize: 14,
            color: "rgba(212,168,58,0.9)",
            lineHeight: 1.8,
          }}>
            <strong style={{ color: "#f0b84a" }}>This week: </strong>{ins.action}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── VIRAL SHARE CARD (9:16) ───────────────────────────────────────────────────

function ViralShareCard({ fname, shareCard }: { fname: string; shareCard: ShareCard }) {
  return (
    <div style={{
      width: 360,
      minHeight: 640,
      margin: "0 auto",
      background: "linear-gradient(170deg,#07070d 0%,#0b0820 40%,#0e0628 70%,#07070d 100%)",
      borderRadius: 20,
      overflow: "hidden",
      fontFamily: "'DM Sans', system-ui, sans-serif",
      position: "relative",
      boxShadow: "0 0 0 1px rgba(107,47,212,0.3), 0 32px 80px rgba(0,0,0,0.8)",
      display: "flex",
      flexDirection: "column",
    }}>
      <div style={{ height: 3, background: "linear-gradient(90deg,#6b2fd4,#d4537e,#f0b84a)", flexShrink: 0 }}/>
      <div style={{ position:"absolute", top:"-10%", left:"-20%", width:"80%", height:"50%",
        background:"radial-gradient(ellipse,rgba(107,47,212,0.1) 0%,transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"10%", right:"-15%", width:"60%", height:"40%",
        background:"radial-gradient(ellipse,rgba(212,83,126,0.07) 0%,transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", inset:0, pointerEvents:"none" }}>
        {[
          {t:"8%",l:"10%",s:1.5,o:0.25},{t:"15%",l:"85%",s:1,o:0.2},{t:"25%",l:"7%",s:1,o:0.15},
          {t:"40%",l:"92%",s:1.5,o:0.2},{t:"58%",l:"5%",s:1,o:0.15},{t:"70%",l:"80%",s:1,o:0.18},
          {t:"80%",l:"22%",s:1.5,o:0.15},{t:"90%",l:"68%",s:1,o:0.18},{t:"96%",l:"42%",s:1,o:0.12},
        ].map((d,i) => (
          <div key={i} style={{ position:"absolute", top:d.t, left:d.l,
            width:d.s, height:d.s, borderRadius:"50%", background:"#fff", opacity:d.o }}/>
        ))}
      </div>
      <div style={{ padding:"18px 24px 0", display:"flex", alignItems:"center", gap:6, position:"relative", zIndex:1 }}>
        <span style={{ fontSize:14, lineHeight:1, color:"rgba(240,184,74,0.7)" }}>✦</span>
        <span style={{ fontFamily:"Georgia,serif", fontSize:11, fontWeight:700, letterSpacing:"0.08em",
          background:"linear-gradient(135deg,rgba(240,184,74,0.75),rgba(212,83,126,0.75))",
          WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
          BluntChart
        </span>
        <span style={{ fontSize:9, color:"rgba(232,228,240,0.2)", marginLeft:2, letterSpacing:"0.06em" }}>
          · your chart read you first.
        </span>
      </div>
      <div style={{ padding:"32px 28px 20px", textAlign:"center", position:"relative", zIndex:1 }}>
        <div style={{
          fontFamily:"Georgia,serif", fontSize:52, fontWeight:700,
          letterSpacing:"6px", textTransform:"uppercase" as const,
          color:"#f0ece8", lineHeight:1, marginBottom:10,
          textShadow:"0 0 60px rgba(240,184,74,0.12)",
        }}>
          {fname.toUpperCase()}
        </div>
        <div style={{ width:48, height:1,
          background:"linear-gradient(90deg,transparent,rgba(240,184,74,0.5),transparent)",
          margin:"0 auto" }}/>
      </div>
      <div style={{ flex:1, padding:"0 36px 24px", position:"relative", zIndex:1,
        display:"flex", flexDirection:"column", justifyContent:"center", gap:0 }}>
        {shareCard.lines.slice(0, 3).map((line, i) => {
          const styles: React.CSSProperties[] = [
            { fontFamily:"Georgia, serif", fontSize:22, fontWeight:700, lineHeight:1.4,
              color:"#f0ece8", marginBottom:18, letterSpacing:"0.01em" },
            { fontFamily:"'DM Sans', system-ui, sans-serif", fontSize:19, fontWeight:500, lineHeight:1.5,
              background:"linear-gradient(135deg,#f0b84a,#d4537e)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text",
              marginBottom:22, letterSpacing:"0.01em" },
            { fontFamily:"Georgia, serif", fontSize:16, fontWeight:400, fontStyle:"italic" as const,
              lineHeight:1.65, color:"rgba(220,214,235,0.65)", marginBottom:0, letterSpacing:"0.01em" },
          ];
          return <p key={i} style={styles[i] || styles[2]}>{line}</p>;
        })}
      </div>
      <div style={{ padding:"0 28px 20px", position:"relative", zIndex:1, display:"flex", justifyContent:"center" }}>
        <div style={{
          display:"inline-block", padding:"8px 20px", borderRadius:100,
          border:"1px solid rgba(107,47,212,0.5)", background:"rgba(107,47,212,0.12)",
          fontSize:11, fontWeight:700, letterSpacing:"2.5px", textTransform:"uppercase" as const,
          color:"rgba(155,111,232,0.9)",
        }}>
          {shareCard.keyword}
        </div>
      </div>
      <div style={{ margin:"0 28px", height:"0.5px",
        background:"linear-gradient(90deg,transparent,rgba(107,47,212,0.3),transparent)",
        position:"relative", zIndex:1 }}/>
      <div style={{ padding:"18px 32px 14px", textAlign:"center", position:"relative", zIndex:1 }}>
        <div style={{ fontFamily:"Georgia,serif", fontSize:13, fontStyle:"italic",
          color:"rgba(232,228,240,0.45)", lineHeight:1.75 }}>
          &ldquo;{shareCard.quote}&rdquo;
        </div>
      </div>
      <div style={{ padding:"10px 24px 14px", display:"flex", alignItems:"center",
        justifyContent:"space-between", position:"relative", zIndex:1 }}>
        <div style={{ fontSize:9, color:"rgba(232,228,240,0.2)", letterSpacing:"0.5px" }}>
          your chart picked you specifically.
        </div>
        <div style={{ fontSize:9, color:"rgba(232,228,240,0.2)", letterSpacing:"0.5px" }}>
          bluntchart.com
        </div>
      </div>
      <div style={{ height:3, background:"linear-gradient(90deg,#f0b84a,#d4537e,#6b2fd4)", flexShrink:0 }}/>
    </div>
  );
}

// ─── STYLE HELPERS ─────────────────────────────────────────────────────────────

const inp: React.CSSProperties = {
  width:"100%", background:"rgba(255,255,255,0.04)", border:"0.5px solid rgba(255,255,255,0.1)",
  borderRadius:10, padding:"13px 14px", fontSize:14, color:"#e8e4f0", fontFamily:"inherit", outline:"none",
};
const lbl: React.CSSProperties = {
  display:"block", fontSize:11, fontWeight:600, color:"#6b6585",
  letterSpacing:"1.2px", textTransform:"uppercase", marginBottom:6,
};

// ─── SECTION DIVIDER ──────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:32 }}>
      <span style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.06)", display:"block" }}/>
      <span style={{ fontSize:10, fontWeight:700, letterSpacing:"2.5px",
        textTransform:"uppercase" as const, color:"#3a3858", whiteSpace:"nowrap" }}>
        {label}
      </span>
      <span style={{ flex:1, height:"0.5px", background:"rgba(255,255,255,0.06)", display:"block" }}/>
    </div>
  );
}

// ─── READING APP ───────────────────────────────────────────────────────────────

function ReadingApp({ onResultChange }: { onResultChange?: (v: boolean) => void }) {
  const [screen, setScreen] = useState<"form"|"loading"|"result">("form");
  const [fname, setFname] = useState("");
  const [dob, setDob] = useState("");
  const [btime, setBtime] = useState("");
  const [city, setCity] = useState("");
  const [err, setErr] = useState("");
  const [loadMsg, setLoadMsg] = useState(LOADING_MSGS[0]);
  const [data, setData] = useState<ReadingData|null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [dlLbl, setDlLbl] = useState("⬇ Download card");
  const [downloading, setDownloading] = useState(false);
  const [shareLbl, setShareLbl] = useState("Share My Card");
  const [copyLbl, setCopyLbl] = useState("📋 Copy quote");
  const msgIdx = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval>|null>(null);

  const startRot = () => {
    timer.current = setInterval(() => {
      msgIdx.current = (msgIdx.current + 1) % LOADING_MSGS.length;
      setLoadMsg(LOADING_MSGS[msgIdx.current]);
    }, 2000);
  };
  const stopRot = () => { if (timer.current) clearInterval(timer.current); };

  const submit = async () => {
    if (!fname.trim() || !dob || !city.trim()) {
      setErr("Please fill in your name, date of birth, and city."); return;
    }
    if (!btime) {
      setErr("Exact birth time is needed for your Rising sign. Check your birth certificate."); return;
    }
    setErr(""); setScreen("loading"); startRot();
    try {
      const res = await fetch("/api/reading", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: makePrompt(fname, dob, btime, city) }),
      });
      stopRot();
      if (!res.ok) {
        const e = await res.json().catch(() => ({}));
        throw new Error(e.error || `Server error ${res.status}`);
      }
      const resp = await res.json();
      if (!resp.content?.[0]?.text) throw new Error("Empty response from API");
      const txt = resp.content[0].text.trim()
        .replace(/^```json\s*/, "").replace(/\s*```$/, "").trim();
      let parsed: ReadingData;
      try { parsed = JSON.parse(txt); }
      catch {
        const m = txt.match(/\{[\s\S]*\}/);
        if (m) parsed = JSON.parse(m[0]);
        else throw new Error("JSON parse failed");
      }
      if (!parsed.shareCard.lines) {
        parsed.shareCard.lines = [parsed.shareCard.quote || "Some things are hard to say out loud."];
      }
      if (!parsed.shareCard.keyword) parsed.shareCard.keyword = "CHART READING";
      if (!parsed.paidInsights) parsed.paidInsights = [];
      setData(parsed);
      setScreen("result");
      onResultChange?.(true);
    } catch (e) {
      stopRot(); setScreen("form");
      setErr("Something went wrong. Please try again. (" + (e as Error).message + ")");
    }
  };

  const reset = () => {
    setScreen("form"); setData(null); setUnlocked(false);
    setFname(""); setDob(""); setBtime(""); setCity(""); setErr("");
    onResultChange?.(false);
  };

  const handleUnlock = () => {
    window.location.href = "https://bluntchart.gumroad.com/l/bluntchart-reading";
    setTimeout(() => {
      document.getElementById("paid-reading-sec")?.scrollIntoView({ behavior: "smooth" });
    }, 120);
  };

  // ── Canvas card renderer ──────────────────────────────────────────────────
  const drawCardToCanvas = (targetFname: string, card: ShareCard): HTMLCanvasElement => {
    const W = 1080, H = 1920;
    const cvs = document.createElement("canvas");
    cvs.width = W; cvs.height = H;
    const ctx = cvs.getContext("2d")!;

    const wrapText = (text: string, maxWidth: number): string[] => {
      const words = text.split(" ");
      const lines: string[] = [];
      let line = "";
      for (const word of words) {
        const test = line ? `${line} ${word}` : word;
        if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = word; }
        else line = test;
      }
      if (line) lines.push(line);
      return lines;
    };

    const PAD = 88;
    const CONTENT_W = W - PAD * 2;

    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#08070f"); bg.addColorStop(0.35,"#0c0a1e");
    bg.addColorStop(0.7,"#0e0628"); bg.addColorStop(1,"#08070f");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    const glow1 = ctx.createRadialGradient(180, 320, 0, 180, 320, 680);
    glow1.addColorStop(0,"rgba(107,47,212,0.14)"); glow1.addColorStop(1,"rgba(107,47,212,0)");
    ctx.fillStyle = glow1; ctx.fillRect(0, 0, W, H);

    const glow2 = ctx.createRadialGradient(W-160, H-400, 0, W-160, H-400, 600);
    glow2.addColorStop(0,"rgba(212,83,126,0.08)"); glow2.addColorStop(1,"rgba(212,83,126,0)");
    ctx.fillStyle = glow2; ctx.fillRect(0, 0, W, H);

    const starPositions = [
      [90,160,2.2],[950,240,1.6],[72,510,1.4],[1002,800,1.8],[68,1100,1.4],
      [870,1240,1.6],[220,1380,2.0],[760,1560,1.4],[440,1750,1.6],[580,80,1.2],
    ];
    for (const [sx, sy, sr] of starPositions) {
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fill();
    }

    const topBar = ctx.createLinearGradient(0, 0, W, 0);
    topBar.addColorStop(0,"#6b2fd4"); topBar.addColorStop(0.5,"#d4537e"); topBar.addColorStop(1,"#f0b84a");
    ctx.fillStyle = topBar; ctx.fillRect(0, 0, W, 10);

    ctx.textAlign = "left";
    ctx.font = "600 34px Georgia, serif";
    ctx.fillStyle = "rgba(240,184,74,0.8)";
    ctx.fillText("✦  BluntChart", PAD, 170);
    ctx.font = "400 26px sans-serif";
    ctx.fillStyle = "rgba(232,228,240,0.2)";
    ctx.fillText("your chart read you first.", PAD + 310, 170);

    const ruleGrad = ctx.createLinearGradient(PAD, 0, W-PAD, 0);
    ruleGrad.addColorStop(0,"rgba(107,47,212,0)"); ruleGrad.addColorStop(0.4,"rgba(107,47,212,0.4)");
    ruleGrad.addColorStop(1,"rgba(107,47,212,0)");
    ctx.strokeStyle = ruleGrad; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PAD, 200); ctx.lineTo(W-PAD, 200); ctx.stroke();

    let nameFontSize = 152;
    ctx.font = `700 ${nameFontSize}px Georgia, serif`;
    while (ctx.measureText(targetFname.toUpperCase()).width > CONTENT_W && nameFontSize > 72) {
      nameFontSize -= 4;
      ctx.font = `700 ${nameFontSize}px Georgia, serif`;
    }
    ctx.fillStyle = "#f0ece8"; ctx.textAlign = "center";
    ctx.fillText(targetFname.toUpperCase(), W/2, 500);

    const nameW = ctx.measureText(targetFname.toUpperCase()).width;
    const ulX1 = W/2 - Math.min(nameW/2, 180);
    const ulX2 = W/2 + Math.min(nameW/2, 180);
    const ulGrad = ctx.createLinearGradient(ulX1, 0, ulX2, 0);
    ulGrad.addColorStop(0,"rgba(240,184,74,0)"); ulGrad.addColorStop(0.5,"rgba(240,184,74,0.65)");
    ulGrad.addColorStop(1,"rgba(240,184,74,0)");
    ctx.strokeStyle = ulGrad; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(ulX1, 526); ctx.lineTo(ulX2, 526); ctx.stroke();

    const lineStyles = [
      { font:"700 62px Georgia, serif", color:"flex", leadAfter:30 },
      { font:"500 54px sans-serif", color:"sting", leadAfter:36 },
      { font:"italic 400 44px Georgia, serif", color:"warm", leadAfter:0 },
    ];
    let lineY = 650;
    const lines3 = card.lines.slice(0, 3);
    for (let i = 0; i < lines3.length; i++) {
      const line = lines3[i];
      const style = lineStyles[i] || lineStyles[2];
      ctx.font = style.font;
      const parts = style.font.match(/^(.*?)(\d+)(px.*)$/);
      if (parts) {
        let sz = parseInt(parts[2]);
        while (ctx.measureText(line).width > CONTENT_W && sz > 32) {
          sz -= 2;
          ctx.font = `${parts[1]}${sz}${parts[3]}`;
        }
      }
      const wrapped = wrapText(line, CONTENT_W);
      for (const wl of wrapped) {
        ctx.textAlign = "left";
        if (style.color === "flex") {
          ctx.fillStyle = "#f0ece8";
        } else if (style.color === "sting") {
          const tw = ctx.measureText(wl).width;
          const g = ctx.createLinearGradient(PAD, 0, PAD+tw, 0);
          g.addColorStop(0,"#f0b84a"); g.addColorStop(1,"#d4537e");
          ctx.fillStyle = g;
        } else {
          ctx.fillStyle = "rgba(210,205,228,0.6)";
        }
        ctx.fillText(wl, PAD, lineY);
        lineY += parseInt((ctx.font.match(/(\d+)px/) || ["","60"])[1]) * 1.45;
      }
      lineY += style.leadAfter;
    }
    lineY += 28;

    const badgeText = card.keyword;
    ctx.font = "700 30px sans-serif"; ctx.textAlign = "center";
    const bTextW = ctx.measureText(badgeText).width;
    const bPadH = 36, bPadW = 56;
    const bW = bTextW + bPadW*2; const bH = 70;
    const bX = W/2 - bW/2; const bY = lineY; const bR = 35;
    ctx.beginPath();
    ctx.moveTo(bX+bR, bY); ctx.lineTo(bX+bW-bR, bY);
    ctx.arcTo(bX+bW, bY, bX+bW, bY+bR, bR); ctx.lineTo(bX+bW, bY+bH-bR);
    ctx.arcTo(bX+bW, bY+bH, bX+bW-bR, bY+bH, bR); ctx.lineTo(bX+bR, bY+bH);
    ctx.arcTo(bX, bY+bH, bX, bY+bH-bR, bR); ctx.lineTo(bX, bY+bR);
    ctx.arcTo(bX, bY, bX+bR, bY, bR); ctx.closePath();
    ctx.fillStyle = "rgba(107,47,212,0.18)"; ctx.fill();
    ctx.strokeStyle = "rgba(155,111,232,0.55)"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = "rgba(185,155,240,0.95)"; ctx.font = "700 30px sans-serif";
    ctx.textAlign = "center"; ctx.fillText(badgeText, W/2, bY+bPadH+10);

    const divY = bY + bH + 56;
    const divGrad = ctx.createLinearGradient(PAD, 0, W-PAD, 0);
    divGrad.addColorStop(0,"rgba(107,47,212,0)"); divGrad.addColorStop(0.5,"rgba(155,111,232,0.4)");
    divGrad.addColorStop(1,"rgba(107,47,212,0)");
    ctx.strokeStyle = divGrad; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PAD, divY); ctx.lineTo(W-PAD, divY); ctx.stroke();

    ctx.font = "italic 400 40px Georgia, serif";
    ctx.fillStyle = "rgba(220,216,235,0.45)"; ctx.textAlign = "center";
    const quoteWrapped = wrapText(`"${card.quote}"`, CONTENT_W-40);
    let qY = divY + 72;
    for (const ql of quoteWrapped) { ctx.fillText(ql, W/2, qY); qY += 60; }

    const footerY = H - 52;
    ctx.font = "400 26px sans-serif";
    ctx.fillStyle = "rgba(232,228,240,0.18)";
    ctx.textAlign = "left"; ctx.fillText("your chart picked you specifically.", PAD, footerY);
    ctx.textAlign = "right"; ctx.fillText("bluntchart.com", W-PAD, footerY);

    const botBar = ctx.createLinearGradient(0, 0, W, 0);
    botBar.addColorStop(0,"#f0b84a"); botBar.addColorStop(0.5,"#d4537e"); botBar.addColorStop(1,"#6b2fd4");
    ctx.fillStyle = botBar; ctx.fillRect(0, H-10, W, 10);

    return cvs;
  };

  const handleDownload = async () => {
    if (!data) return;
    setDownloading(true); setDlLbl("Generating…");
    try {
      const canvas = drawCardToCanvas(fname, data.shareCard);
      canvas.toBlob((blob) => {
        if (!blob) { setDlLbl("Failed, try again"); return; }
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bluntchart-${fname.toLowerCase().replace(/\s+/g,"-")}.png`;
        document.body.appendChild(a); a.click();
        document.body.removeChild(a); URL.revokeObjectURL(url);
        setDlLbl("✓ Downloaded!"); setDownloading(false);
        setTimeout(() => setDlLbl("⬇ Download card"), 3000);
      }, "image/png");
    } catch(e) {
      console.error(e); setDlLbl("Failed, try again"); setDownloading(false);
      setTimeout(() => setDlLbl("⬇ Download card"), 3000);
    }
  };

  const handleShare = async () => {
    if (!data) return;
    setShareLbl("Preparing…");
    try {
      const canvas = drawCardToCanvas(fname, data.shareCard);
      canvas.toBlob(async (blob) => {
        if (!blob) { setShareLbl("Failed, try Download"); return; }
        const file = new File([blob],
          `bluntchart-${fname.toLowerCase().replace(/\s+/g,"-")}.png`,
          { type: "image/png" }
        );
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              text: `My birth chart read me too accurately 😭 Get yours 👇`,
              url: "https://bluntchart.com",
            });
            setShareLbl("✓ Shared!");
          } catch { setShareLbl("Cancelled"); }
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `bluntchart-${fname.toLowerCase().replace(/\s+/g,"-")}.png`;
          document.body.appendChild(a); a.click();
          document.body.removeChild(a); URL.revokeObjectURL(url);
          setShareLbl("✓ Saved. Ready to share!");
        }
        setTimeout(() => setShareLbl("Share My Card"), 3000);
      }, "image/png");
    } catch(e) {
      console.error(e); setShareLbl("Failed. Try Download");
      setTimeout(() => setShareLbl("Share My Card"), 3000);
    }
  };

  const copyQuote = (q: string) => {
    navigator.clipboard.writeText(
      `"${q}"\n\nGet your brutally honest birth chart reading at bluntchart.com`
    ).then(() => {
      setCopyLbl("✓ Copied!");
      setTimeout(() => setCopyLbl("📋 Copy quote"), 2200);
    });
  };

  // ── FORM ──────────────────────────────────────────────────────────────────────
  if (screen === "form") return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      {err && (
        <div style={{ background:"rgba(212,83,126,0.08)", border:"0.5px solid rgba(212,83,126,0.3)",
          borderRadius:10, padding:"11px 14px", fontSize:13, color:"#f0a0b8", marginBottom:14 }}>
          {err}
        </div>
      )}
      <div style={{ background:"rgba(255,255,255,0.03)", border:"0.5px solid rgba(255,255,255,0.08)",
        borderRadius:18, padding:32 }}>
        <div style={{ fontFamily:"var(--font-display)", fontSize:22, marginBottom:6, color:"#e8e4f0" }}>
          Get your free preview
        </div>
        <div style={{ fontSize:13, color:"#6b6585", lineHeight:1.6, marginBottom:28 }}>
          Your exact birth time is what makes this specific to you, not just anyone born that day.
        </div>
        <div style={{ marginBottom:16 }}>
          <label style={lbl}>Your first name</label>
          <input value={fname} onChange={e=>setFname(e.target.value)} placeholder="e.g. Sarah" style={inp}/>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
          <div>
            <label style={lbl}>Date of birth</label>
            <input type="date" value={dob} onChange={e=>setDob(e.target.value)} style={inp}/>
          </div>
          <div>
            <label style={lbl}>Time of birth</label>
            <input type="time" value={btime} onChange={e=>setBtime(e.target.value)} style={inp}/>
            <small style={{ fontSize:11, color:"#3a3858", marginTop:4, display:"block" }}>
              From birth certificate
            </small>
          </div>
        </div>
        <div style={{ marginBottom:24 }}>
          <label style={lbl}>City &amp; country of birth</label>
          <input value={city} onChange={e=>setCity(e.target.value)}
            placeholder="e.g. New York, USA or London, UK" style={inp}/>
        </div>
        <button onClick={submit} style={{ width:"100%",
          background:"linear-gradient(135deg,#6b2fd4,#d4537e)", color:"#fff", border:"none",
          borderRadius:12, padding:"16px 20px", fontSize:15, fontWeight:600,
          fontFamily:"inherit", cursor:"pointer", letterSpacing:"0.2px" }}>
          Read my chart, free preview ✨
        </button>
      </div>
      <div style={{ fontSize:11, color:"#2e2c3e", textAlign:"center", marginTop:14 }}>
        For entertainment purposes only · Not professional advice
      </div>
    </div>
  );

  // ── LOADING ───────────────────────────────────────────────────────────────────
  if (screen === "loading") return (
    <div style={{ textAlign:"center", padding:"80px 0" }}>
      <span style={{ fontSize:60, display:"block", animation:"bob 1.8s ease-in-out infinite" }}>🌙</span>
      <div style={{ fontFamily:"var(--font-display)", fontSize:22, margin:"16px 0 8px", color:"#e8e4f0" }}>
        {loadMsg}
      </div>
      <div style={{ fontSize:13, color:"#4a4560" }}>Calculating your planetary positions…</div>
    </div>
  );

  // ── RESULT ────────────────────────────────────────────────────────────────────
  if (screen === "result" && data) {
    const { planets, preview, locked, paidInsights, shareCard } = data;

    return (
      <div style={{ maxWidth: 800, margin: "0 auto" }}>

        {/* ── NATAL CHART WHEEL ── */}
        <div style={{
          background:"linear-gradient(160deg,rgba(107,47,212,0.08) 0%,rgba(10,4,24,0.7) 100%)",
          border:"1px solid rgba(107,47,212,0.18)", borderRadius:24,
          marginBottom:48, overflow:"hidden",
        }}>
          <div style={{ borderBottom:"0.5px solid rgba(107,47,212,0.12)",
            padding:"22px 32px 18px", display:"flex", alignItems:"center", gap:10 }}>
            <div style={{ width:6, height:6, borderRadius:"50%",
              background:"linear-gradient(135deg,#9b6fe8,#d4537e)", flexShrink:0 }}/>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:"2px",
              textTransform:"uppercase" as const, color:"rgba(155,111,232,0.7)" }}>
              Natal Chart
            </div>
            <div style={{ flex:1 }}/>
            <div style={{ fontSize:12, color:"rgba(232,228,240,0.3)" }}>
              {fname} · Swiss Ephemeris
            </div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
            gap:0, padding:"36px 32px 32px", alignItems:"center" }}>
            <div>
              <BirthChartWheel planets={planets} name={fname}/>
            </div>
            <div style={{ paddingLeft:28 }}>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:"2px",
                textTransform:"uppercase" as const, color:"rgba(232,228,240,0.25)", marginBottom:20 }}>
                Planetary Positions
              </div>
              <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                {PLANET_ORDER.filter(k => planets[k as keyof PlanetMap]).map(k => (
                  <div key={k} style={{ display:"flex", alignItems:"center", gap:10,
                    padding:"10px 0", borderBottom:"0.5px solid rgba(255,255,255,0.04)" }}>
                    <div style={{ width:8, height:8, borderRadius:"50%",
                      background:DOT_COLORS[k], flexShrink:0,
                      boxShadow:`0 0 8px ${DOT_COLORS[k]}60` }}/>
                    <span style={{ fontSize:12, color:"rgba(232,228,240,0.35)",
                      minWidth:60, fontWeight:400 }}>
                      {PLANET_LABELS[k]}
                    </span>
                    <span style={{ fontSize:13, color:"rgba(232,228,240,0.82)", fontWeight:500 }}>
                      {planets[k as keyof PlanetMap]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── FREE PREVIEW — 2 insights ── */}
        <SectionDivider label="Free preview · 2 insights" />
        {preview.slice(0, 2).map((ins, i) => (
          <InsightCard key={i} ins={ins} badge="Free" badgeColor="teal" />
        ))}

        {/* ── LOCK WALL (visible before unlock) ── */}
        {!unlocked && (
          <div style={{ background:"rgba(255,255,255,0.02)",
            border:"0.5px solid rgba(255,255,255,0.06)", borderRadius:20,
            overflow:"hidden", marginBottom:28 }}>

            {/* Teaser list — visible, partially obscured */}
            <div style={{ padding:"8px 0", position:"relative" }}>
              {locked.map((l, i) => (
                <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:12,
                  padding:"14px 28px",
                  borderBottom: i < locked.length - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none",
                  filter: i >= 3 ? "blur(3px)" : "none",
                  transition:"filter 0.2s",
                }}>
                  <div style={{ width:7, height:7, borderRadius:"50%",
                    background:"rgba(107,47,212,0.4)", flexShrink:0, marginTop:4 }}/>
                  <div style={{ fontSize:13, color:"rgba(232,228,240,0.45)", flex:1, lineHeight:1.55 }}>
                    {l}
                  </div>
                  <span style={{ fontSize:13, color:"rgba(155,111,232,0.4)", flexShrink:0 }}>🔒</span>
                </div>
              ))}
              {/* Gradient overlay to entice */}
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:80,
                background:"linear-gradient(to bottom, transparent, rgba(9,9,15,0.9))",
                pointerEvents:"none" }}/>
            </div>

            {/* CTA */}
            <div style={{ background:"rgba(107,47,212,0.04)",
              borderTop:"0.5px solid rgba(107,47,212,0.1)",
              padding:"32px 28px 28px", textAlign:"center" }}>
              <div style={{ fontFamily:"var(--font-display)", fontSize:20,
                marginBottom:10, color:"#e8e4f0" }}>
                {locked.length} more insights waiting
              </div>
              <div style={{ fontSize:14, color:"#6b6585", lineHeight:1.75,
                marginBottom:24, maxWidth:380, margin:"0 auto 24px" }}>
                Venus retrograde truth. Your self-sabotage pattern named.
                The 12th house shadow. One payment, yours forever.
              </div>
              <button onClick={handleUnlock}
                style={{ display:"block", width:"100%",
                  background:"linear-gradient(135deg,#f0b84a,#e8854a)",
                  color:"#0d0800", border:"none", borderRadius:12, padding:"17px 20px",
                  fontSize:15, fontWeight:700, fontFamily:"inherit", cursor:"pointer" }}>
                Unlock full reading · $15 ✦
              </button>
              <button onClick={handleUnlock}
                style={{ marginTop:10, background:"transparent",
                  border:"0.5px solid rgba(255,255,255,0.08)",
                  borderRadius:8, padding:"8px 16px", fontSize:11, color:"#3a3858",
                  cursor:"pointer", fontFamily:"inherit" }}>
                👁 Preview full reading (dev only)
              </button>
              <div style={{ fontSize:11, color:"#3a3858", marginTop:10 }}>
                One-time · No subscription · Delivered instantly
              </div>
            </div>
          </div>
        )}

        {/* ── FULL PAID READING ── */}
        {unlocked && (
          <div id="paid-reading-sec">

            {/* Unlock confirmation banner */}
            <div style={{
              background:"linear-gradient(135deg,rgba(240,184,74,0.08),rgba(232,133,74,0.06))",
              border:"0.5px solid rgba(240,184,74,0.2)",
              borderRadius:14,
              padding:"18px 24px",
              marginBottom:36,
              display:"flex",
              alignItems:"center",
              gap:14,
            }}>
              <div style={{ fontSize:24, flexShrink:0 }}>✦</div>
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:"#f0b84a", marginBottom:3 }}>
                  Full reading unlocked
                </div>
                <div style={{ fontSize:13, color:"rgba(232,228,240,0.5)", lineHeight:1.5 }}>
                  {paidInsights.length} additional insights below, specific to your exact chart.
                  This is yours forever.
                </div>
              </div>
            </div>

            <SectionDivider label={`Full reading · ${paidInsights.length} paid insights`} />

            {/* Paid insight cards */}
            {paidInsights.map((ins, i) => (
              <InsightCard key={i} ins={ins} badge="Paid" badgeColor="gold" />
            ))}

            {/* Share card section */}
            <div style={{ marginTop:56 }}>
              <SectionDivider label="Your shareable identity card" />

              <p style={{ textAlign:"center", fontSize:14, color:"rgba(232,228,240,0.45)",
                marginBottom:24, fontFamily:"var(--font-display)", fontStyle:"italic" }}>
                Your chart just exposed you. Post it. Send it. Let them figure out who it&apos;s about.
              </p>

              <ViralShareCard fname={fname} shareCard={shareCard} />

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginTop:18 }}>
                <button onClick={handleShare}
                  style={{ background:"linear-gradient(135deg,#d4537e,#6b2fd4)", border:"none",
                    borderRadius:12, padding:"15px 16px", fontSize:13, fontWeight:600,
                    fontFamily:"inherit", color:"#fff", cursor:"pointer" }}>
                  {shareLbl}
                </button>
                <button onClick={handleDownload} disabled={downloading}
                  style={{ background:"linear-gradient(135deg,#6b2fd4,#9b4fd4)", border:"none",
                    borderRadius:12, padding:"15px 16px", fontSize:13, fontWeight:600,
                    fontFamily:"inherit", color:"#fff",
                    cursor:downloading ? "not-allowed" : "pointer",
                    opacity:downloading ? 0.65 : 1, transition:"opacity .2s" }}>
                  {dlLbl}
                </button>
                <button onClick={() => copyQuote(shareCard.quote)}
                  style={{ background:"transparent", border:"0.5px solid rgba(255,255,255,0.12)",
                    borderRadius:12, padding:"15px 16px", fontSize:13, fontWeight:500,
                    fontFamily:"inherit", color:"#e8e4f0", cursor:"pointer" }}>
                  {copyLbl}
                </button>
              </div>
              <div style={{ fontSize:11, color:"#252340", textAlign:"center", marginTop:10 }}>
                Download saves a 1080px PNG · perfect for Stories, Reels &amp; Snapchat
              </div>
            </div>
          </div>
        )}

        <button onClick={reset} style={{ width:"100%", background:"transparent", border:"none",
          padding:"18px", fontSize:13, color:"#4a4560", cursor:"pointer",
          fontFamily:"inherit", marginTop:28 }}>
          ← Read a different chart
        </button>
        <div style={{ fontSize:11, color:"#2a2840", textAlign:"center", marginTop:4, lineHeight:1.5 }}>
          For entertainment purposes only · Not psychological or medical advice
        </div>
      </div>
    );
  }
  return null;
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────

function FAQ() {
  const [open, setOpen] = useState<number|null>(null);
  return (
    <div style={{ marginTop:48, maxWidth:720, margin:"48px auto 0" }}>
      {FAQS.map((f, i) => (
        <div key={i} style={{ borderBottom:"0.5px solid rgba(255,255,255,0.08)", overflow:"hidden" }}>
          <button
            onClick={() => setOpen(p => p === i ? null : i)}
            style={{ width:"100%", background:"transparent", border:"none", padding:"22px 0",
              display:"flex", alignItems:"center", justifyContent:"space-between", gap:16,
              cursor:"pointer", fontFamily:"inherit", textAlign:"left" }}>
            <span style={{ fontSize:"0.97rem", fontWeight:600, color:"#e8e4f0",
              lineHeight:1.45, flex:1 }}>{f.q}</span>
            <span style={{ width:26, height:26, borderRadius:"50%",
              border:"0.5px solid rgba(255,255,255,0.12)",
              display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0, fontSize:14, color:"#6b2fd4", fontWeight:700,
              background: open===i ? "rgba(107,47,212,0.12)" : "transparent",
              transition:"all .2s" }}>
              {open===i ? "−" : "+"}
            </span>
          </button>
          <div style={{ maxHeight: open===i ? 400 : 0, overflow:"hidden",
            transition:"max-height .35s cubic-bezier(.4,0,.2,1)" }}>
            <p style={{ fontSize:"0.89rem", color:"rgba(232,228,240,0.65)",
              lineHeight:1.78, paddingBottom:22, paddingRight:40 }}>{f.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("Compatibility Reading");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [resultShowing, setResultShowing] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive:true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    try {
      await fetch(
        "https://script.google.com/macros/s/AKfycbwgxIPG-QmNI89GEMqeV6GA83STXCncvc77fsqH6bAK3AatSO3pfi96TzGNSB6ZvxGIMA/exec",
        { method:"POST", mode:"no-cors", headers:{"Content-Type":"application/json"},
          body:JSON.stringify({ name, email, reason, source:"Website Waitlist" }) }
      );
      setSubmitted(true); setName(""); setEmail(""); setReason("Compatibility Reading");
    } catch { alert("Something went wrong."); }
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{
          --font-display:'Playfair Display',Georgia,serif;
          --font-body:'DM Sans',system-ui,sans-serif;
          --bg:#09090f;--card:#12121e;
          --border:rgba(255,255,255,0.08);--border2:rgba(255,255,255,0.12);
          --white:#e8e4f0;--dim:rgba(232,228,240,0.55);--faint:rgba(232,228,240,0.08);
          --gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);
          --purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5;
        }
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--white);font-family:var(--font-body);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:.5;transform:translate(-50%,-55%) scale(1)}50%{opacity:1;transform:translate(-50%,-55%) scale(1.03)}}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
        .c{max-width:1100px;margin:0 auto;padding:0 24px}
        section{position:relative;z-index:1}

        /* NAV */
        .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;transition:all .3s}
        .nav.on{background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}
        .nav-i{display:flex;align-items:center;justify-content:space-between}
        .logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;letter-spacing:.02em}
        .logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .nl{display:flex;align-items:center;gap:28px;list-style:none}
        .nl a{font-size:.83rem;font-weight:500;color:var(--dim);text-decoration:none;letter-spacing:.04em;text-transform:uppercase;transition:color .2s}
        .nl a:hover{color:var(--white)}
        .ncta{color:var(--gold)!important;border:1px solid var(--gold-dim);padding:6px 15px;border-radius:4px}
        .ncta:hover{background:var(--gold-dim)}

        /* HERO */
        .hero{min-height:100vh;display:flex;align-items:center;padding-top:96px;padding-bottom:80px;overflow:hidden}
        .hbg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% -10%,rgba(107,47,212,.1) 0%,transparent 50%),radial-gradient(ellipse 40% 40% at 85% 60%,rgba(212,83,126,.06) 0%,transparent 60%);pointer-events:none}
        .horb{position:absolute;top:50%;left:50%;transform:translate(-50%,-55%);width:560px;height:560px;border-radius:50%;border:1px solid rgba(107,47,212,.08);background:radial-gradient(circle,rgba(107,47,212,.04) 0%,transparent 50%);animation:pulse 8s ease-in-out infinite;pointer-events:none}
        .hi{position:relative;z-index:1;text-align:center;max-width:860px;margin:0 auto}
        .ey{display:inline-flex;align-items:center;gap:8px;font-size:.73rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:28px;padding:5px 14px;border:1px solid var(--gold-dim);border-radius:100px;background:rgba(240,184,74,.06);animation:fadeUp .6s ease both}
        h1{font-family:var(--font-display);font-size:clamp(2.8rem,7vw,5.2rem);font-weight:900;line-height:1.06;letter-spacing:-.02em;animation:fadeUp .6s .1s ease both}
        h1 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .hsh{font-family:var(--font-display);font-size:clamp(1.3rem,2.8vw,1.8rem);font-style:italic;color:var(--dim);margin:10px 0 18px;animation:fadeUp .6s .15s ease both}
        .hb{font-size:1.05rem;color:var(--dim);max-width:540px;margin:0 auto 36px;line-height:1.72;animation:fadeUp .6s .2s ease both}
        .hctas{display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;animation:fadeUp .6s .25s ease both}
        .htr{margin-top:44px;display:flex;align-items:center;justify-content:center;gap:18px;flex-wrap:wrap;animation:fadeUp .6s .3s ease both;font-size:.82rem;color:var(--dim)}
        .htr strong{color:var(--white)}
        .dot{width:3px;height:3px;border-radius:50%;background:rgba(240,184,74,.3)}

        /* BTNS */
        .bp{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;background:linear-gradient(135deg,#6b2fd4,#d4537e);color:#fff;font-family:inherit;font-size:.88rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;border:none;border-radius:10px;cursor:pointer;transition:opacity .2s,transform .15s}
        .bp:hover{opacity:.88;transform:translateY(-1px)}
        .bs{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;background:transparent;color:var(--white);font-family:inherit;font-size:.88rem;font-weight:600;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;border:1px solid var(--border2);border-radius:10px;cursor:pointer;transition:all .2s}
        .bs:hover{border-color:rgba(255,255,255,.22);background:var(--faint);transform:translateY(-1px)}

        /* SECTIONS */
        .sec{padding:96px 0}
        .dk{background:#0d0d18;border-top:1px solid var(--border);border-bottom:1px solid var(--border)}
        .sl{display:flex;align-items:center;gap:10px;margin-bottom:14px}
        .sl::before{content:'';display:block;width:22px;height:1px;background:var(--gold)}
        .sl span{font-size:.7rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--gold)}
        h2{font-family:var(--font-display);font-size:clamp(2rem,4.5vw,3.1rem);font-weight:800;line-height:1.1;letter-spacing:-.02em;margin-bottom:12px}
        h2 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .sub{font-size:1rem;color:var(--dim);max-width:500px;line-height:1.72}

        /* TRY SECTION */
        .try-sec{padding:96px 0}

        /* Credential pills row */
        .cred-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:36px;max-width:800px}
        .cred-item{display:flex;align-items:center;gap:12px;padding:14px 16px;background:var(--card);border:0.5px solid var(--border);border-radius:12px;transition:border-color .2s}
        .cred-item:hover{border-color:rgba(107,47,212,.3)}
        .cred-icon{font-size:18px;width:28px;text-align:center;flex-shrink:0;color:var(--gold);font-family:serif}
        .cred-label{font-size:12px;font-weight:700;color:var(--white);letter-spacing:.03em;margin-bottom:1px}
        .cred-desc{font-size:11px;color:rgba(232,228,240,.35)}

        /* Form section */
        .form-wrap{margin-top:64px;padding-top:56px;border-top:0.5px solid rgba(255,255,255,0.06)}

        /* REVEAL GRID */
        .rg{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--border);border:1px solid var(--border);border-radius:14px;overflow:hidden;margin-top:48px}
        .ri{background:var(--card);padding:30px;transition:background .2s}
        .ri:hover{background:#1a1a2e}
        .rn{font-family:var(--font-display);font-size:2.2rem;font-weight:900;color:rgba(107,47,212,.22);line-height:1;margin-bottom:10px}
        .rt{font-size:.93rem;font-weight:600;margin-bottom:8px}
        .rb{font-size:.83rem;color:var(--dim);line-height:1.65}

        /* PRICING */
        .price-main{background:linear-gradient(135deg,var(--card) 0%,rgba(107,47,212,.08) 100%);border:1px solid rgba(240,184,74,.4);border-radius:18px;padding:36px 32px;position:relative;overflow:hidden}
        .price-main::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(107,47,212,.06) 0%,transparent 60%);pointer-events:none}
        .price-badge-main{display:inline-block;font-size:.65rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#1a0a00;background:var(--gold);padding:4px 12px;border-radius:100px;margin-bottom:18px}
        .price-title{font-family:var(--font-display);font-size:1.6rem;font-weight:800;margin-bottom:12px;color:var(--white)}
        .price-desc{font-size:.9rem;color:var(--dim);line-height:1.72;margin-bottom:24px}
        .price-num{font-family:var(--font-display);font-size:3rem;font-weight:900;color:var(--gold);line-height:1}
        .price-sub{font-size:.8rem;color:rgba(232,228,240,.35);margin-top:4px;margin-bottom:28px}
        .price-includes{list-style:none;display:flex;flex-direction:column;gap:9px;margin-bottom:28px}
        .price-includes li{font-size:.86rem;color:var(--dim);display:flex;align-items:center;gap:10px}
        .price-includes li::before{content:'✓';color:var(--teal);font-weight:700;flex-shrink:0}
        .upcoming-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin-top:32px}
        .uc{background:var(--card);border:0.5px solid var(--border);border-radius:14px;padding:26px 22px;display:flex;flex-direction:column;position:relative;overflow:hidden}
        .uc::after{content:'';position:absolute;inset:0;background:rgba(9,9,15,.35);pointer-events:none}
        .uc-badge{display:inline-block;font-size:.62rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#4a4560;background:rgba(255,255,255,.05);padding:3px 10px;border-radius:100px;margin-bottom:14px;width:fit-content}
        .uc-title{font-family:var(--font-display);font-size:1.1rem;font-weight:700;margin-bottom:8px;color:rgba(232,228,240,.5)}
        .uc-desc{font-size:.82rem;color:rgba(232,228,240,.28);line-height:1.65;flex:1;margin-bottom:18px}
        .uc-price{font-family:var(--font-display);font-size:1.6rem;font-weight:900;color:#2e2c3e}
        .uc-soon{display:inline-block;font-size:.72rem;font-weight:600;color:#4a4560;border:0.5px solid rgba(255,255,255,.08);border-radius:6px;padding:4px 12px;margin-top:10px}

        /* COMPARISON */
        .cmp-wrap{margin-top:48px;border:1px solid var(--border);border-radius:16px;overflow:hidden}
        .cmp-head{display:grid;grid-template-columns:1fr 140px 140px;background:#0d0d18;border-bottom:1px solid var(--border)}
        .cmp-head-cell{padding:16px 20px;font-size:.72rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--dim)}
        .cmp-head-cell.hl{color:var(--gold)}
        .cmp-row{display:grid;grid-template-columns:1fr 140px 140px;border-bottom:0.5px solid rgba(255,255,255,.05);transition:background .15s}
        .cmp-row:last-child{border-bottom:none}
        .cmp-row:hover{background:rgba(107,47,212,.04)}
        .cmp-cell{padding:15px 20px;font-size:.88rem;color:var(--dim);display:flex;align-items:center}
        .cmp-cell.feat{color:var(--white);font-weight:500}
        .cmp-yes{color:var(--teal);font-size:1rem}
        .cmp-no{color:rgba(212,83,126,.6);font-size:.82rem}
        .cmp-partial{color:#6b6585;font-size:.82rem;font-style:italic}
        .cmp-sub{color:rgba(212,83,126,.7);font-size:.82rem;font-style:italic}
        .cmp-cta{text-align:center;padding:28px;background:#0d0d18;border-top:1px solid var(--border)}

        /* REVIEWS */
        .revg{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:18px;margin-top:48px}
        .revc{background:var(--card);border:0.5px solid var(--border);border-radius:14px;padding:26px;transition:border-color .2s,transform .2s;position:relative;overflow:hidden}
        .revc::before{content:'"';position:absolute;top:-12px;right:18px;font-family:var(--font-display);font-size:5rem;color:rgba(107,47,212,.1);line-height:1;pointer-events:none}
        .revc:hover{border-color:rgba(107,47,212,.3);transform:translateY(-2px)}
        .revt{font-size:.91rem;color:var(--white);line-height:1.68;margin-bottom:18px;font-style:italic}
        .reva{display:flex;align-items:center;gap:10px}
        .revav{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#6b2fd4,#d4537e);display:flex;align-items:center;justify-content:center;font-family:var(--font-display);font-size:.9rem;font-weight:700;color:#fff;flex-shrink:0}
        .revn{font-size:.83rem;font-weight:600;color:var(--dim)}
        .revm{font-size:.73rem;color:rgba(232,228,240,.3)}

        /* WAITLIST */
        .waitlist-sec{padding:96px 0;position:relative;overflow:hidden;background:#0d0d18;border-top:1px solid var(--border)}
        .wbg{position:absolute;inset:0;background:radial-gradient(ellipse 50% 50% at 50% 50%,rgba(107,47,212,.05) 0%,transparent 50%);pointer-events:none}
        .wi{position:relative;z-index:1;max-width:600px;margin:0 auto;text-align:center}
        .ei{width:100%;background:var(--faint);border:0.5px solid var(--border);border-radius:10px;padding:13px 16px;color:var(--white);font-family:inherit;font-size:.88rem;outline:none;transition:border-color .2s}
        .ei:focus{border-color:rgba(107,47,212,.5)}
        .ei::placeholder{color:rgba(232,228,240,.25)}
        .fn{font-size:.76rem;color:rgba(232,228,240,.28)}
        .fs{padding:14px 22px;background:rgba(93,202,165,.1);border:0.5px solid rgba(93,202,165,.3);border-radius:10px;color:var(--teal);font-size:.88rem;font-weight:500;max-width:420px;margin:0 auto}
        .wl-cards{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:40px}
        .wl-card{background:var(--card);border:0.5px solid var(--border);border-radius:12px;padding:20px 18px;text-align:left}
        .wl-card-badge{font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#4a4560;margin-bottom:8px}
        .wl-card-title{font-family:var(--font-display);font-size:1rem;font-weight:700;color:rgba(232,228,240,.55);margin-bottom:6px}
        .wl-card-price{font-family:var(--font-display);font-size:1.4rem;font-weight:900;color:#2e2c3e}

        /* FOOTER */
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

        @media(max-width:900px){
          .cred-grid{grid-template-columns:1fr 1fr}
          .upcoming-grid,.wl-cards{grid-template-columns:1fr}
          .cmp-head,.cmp-row{grid-template-columns:1fr 110px 110px}
        }
        @media(max-width:768px){
          .nl{display:none}
          .hero{padding-top:90px;padding-bottom:64px}
          .horb{width:300px;height:300px}
          .hctas{flex-direction:column;align-items:center}
          .bp,.bs{width:100%;max-width:300px;justify-content:center}
          .htr{flex-direction:column;gap:10px}
          .rg{grid-template-columns:1fr}
          .fi{flex-direction:column;gap:28px}
          .fb2{flex-direction:column;align-items:flex-start}
          .revg{grid-template-columns:1fr}
          .cmp-head,.cmp-row{grid-template-columns:1fr 90px 90px}
          .cred-grid{grid-template-columns:1fr}
        }
        @media(max-width:480px){
          .sec,.try-sec,.waitlist-sec{padding:72px 0}
          .c{padding:0 16px}
          .price-main{padding:24px 20px}
          .upcoming-grid,.wl-cards{grid-template-columns:1fr}
        }
      `}</style>

      {/* NAV */}
      <nav className={`nav${scrolled ? " on" : ""}`}>
        <div className="c nav-i">
          <a className="logo" href="#" style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <Image src="/mascot.png" alt="BluntChart mascot" width={34} height={34}
              style={{ borderRadius:"50%" }}/>
            <span className="g">BluntChart</span>
          </a>
          <ul className="nl">
            <li><a href="#try-it">Try Free</a></li>
            <li><a href="#reveals">What We Reveal</a></li>
            <li><a href="#reviews">Reviews</a></li>
            <li><a href="#compare">vs Co-Star</a></li>
            <li><a className="ncta" href="#try-it">Get Reading $15</a></li>
          </ul>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hbg"/>
        <div className="horb"/>
        <div className="c">
          <div className="hi">
            <div style={{ marginBottom:"24px" }}>
              <Image src="/mascot.png" alt="BluntChart cosmic cat mascot" width={130} height={130} priority
                style={{ margin:"0 auto", filter:"drop-shadow(0 0 30px rgba(107,47,212,.35))" }}/>
            </div>
            <div className="ey">✦ Brutally honest birth chart readings</div>
            <h1>Your chart already knows<br /><em>why you&apos;re like this.</em></h1>
            <p className="hsh">It&apos;s time you did too.</p>
            <p className="hb">BluntChart takes your birth date, time, and place. Calculates your real natal chart and delivers a reading that tells you the truth in plain language, no sugarcoating.</p>
            <div className="hctas">
              <a className="bp" href="#try-it">Get My Free Preview ✨</a>
              <a className="bs" href="#reveals">See What We Reveal ↓</a>
            </div>
            <div className="htr">
              <span><strong>$15</strong>&nbsp;one-time. No subscription.</span>
              <span className="dot"/>
              <span>Real chart calculation</span>
              <span className="dot"/>
              <span>~1,500 words specific to <em>your</em> chart</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRY IT ── */}
      <section className="try-sec" id="try-it">
        <div className="c">
          {!resultShowing && (
            <>
              <div className="sl"><span>Real natal chart · Swiss Ephemeris</span></div>
              <h2 style={{ maxWidth:640 }}>
                Two answers,<br/><em>completely free.</em>
              </h2>
              <p className="sub">
                No account. No payment. Enter your birth details and we&apos;ll tell you
                what your chart actually says. Sun, Moon, Rising, Venus, Mars, all 8 placements
                calculated from your exact birth time. Not your sign. <em>Your chart.</em>
              </p>
              <div className="cred-grid">
                {PLANET_CREDENTIALS.map((item, i) => (
                  <div className="cred-item" key={i}>
                    <span className="cred-icon">{item.icon}</span>
                    <div>
                      <div className="cred-label">{item.label}</div>
                      <div className="cred-desc">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", alignItems:"stretch", gap:16,
                marginTop:28, flexWrap:"wrap", maxWidth:800 }}>
                <div style={{ display:"flex", alignItems:"center", gap:20,
                  padding:"14px 20px", background:"var(--card)",
                  border:"0.5px solid var(--border)", borderRadius:12, flexWrap:"wrap"}}>
                  {["No account needed","Real chart calculation","Instant result"].map((t, i) => (
                    <span key={i} style={{ fontSize:12, color:"rgba(232,228,240,0.45)",
                      display:"flex", alignItems:"center", gap:6 }}>
                      <span style={{ color:"#5dcaa5", fontWeight:700 }}>✓</span>{t}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
          <div className="form-wrap" style={resultShowing ? { borderTop:"none", marginTop:0, paddingTop:0 } : {}}>
            {!resultShowing && (
              <div style={{ textAlign:"center", marginBottom:40 }}>
                <div style={{ fontFamily:"var(--font-display)", fontSize:"clamp(1.4rem,3vw,2rem)",
                  fontWeight:700, color:"#e8e4f0", marginBottom:8 }}>
                  Enter your birth details below
                </div>
                <p style={{ fontSize:14, color:"#6b6585", maxWidth:480, margin:"0 auto" }}>
                  Your exact birth time is what makes this specific to you, not just anyone
                  born on the same day.
                </p>
              </div>
            )}
            <ReadingApp onResultChange={setResultShowing} />
          </div>
        </div>
      </section>

      {/* ── WHAT WE REVEAL ── */}
      <section className="sec dk" id="reveals">
        <div className="c">
          <div className="sl"><span>What we actually say</span></div>
          <h2>The parts other apps<br /><em>won&apos;t touch.</em></h2>
          <p className="sub">Generic readings tell you you&apos;re creative and sensitive. We tell you why you text back immediately and then resent yourself for it.</p>
          <div className="rg">
            {REVEALS.map(r => (
              <div className="ri" key={r.num}>
                <div className="rn">{r.num}</div>
                <div className="rt">{r.title}</div>
                <div className="rb">{r.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="sec" id="readings">
        <div className="c">
          <div className="sl"><span>Readings</span></div>
          <h2>One-time. No subscription.<br /><em>No trap.</em></h2>
          <p className="sub">Pay once, get your reading. Delivered instantly, yours forever. No monthly nonsense.</p>
          <div className="price-main" style={{ maxWidth:560, marginTop:48 }}>
            <div style={{ position:"relative", zIndex:1 }}>
              <div className="price-badge-main">⭐ Most Popular</div>
              <div className="price-title">Full Birth Chart Reading</div>
              <p className="price-desc">12 brutally honest insights across all your planets, houses, and key life areas. Sun, Moon, Rising, Venus, Mars, Saturn, the 12th house shadow, your self-sabotage pattern. All of it, in plain language.</p>
              <div className="price-num">$15</div>
              <p className="price-sub">One-time · Delivered instantly · Yours forever</p>
              <p style={{ fontSize:".78rem", color:"rgba(232,228,240,0.3)", marginBottom:24, lineHeight:1.6 }}>
                This is a personalized digital product delivered instantly after purchase. No refunds once generated.
              </p>
              <ul className="price-includes">
                <li>~1,500 words specific to your exact birth chart</li>
                <li>2 free insights before you pay</li>
                <li>8 full paid insights after unlock</li>
                <li>Shareable viral identity card</li>
                <li>Real Swiss Ephemeris calculations</li>
                <li>No account required</li>
              </ul>
              <a className="bp" href="#try-it" style={{ display:"block", textAlign:"center", textDecoration:"none" }}>
                Get My Free Preview First ✨
              </a>
            </div>
          </div>
          <div style={{ marginTop:56 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:24 }}>
              <div style={{ width:22, height:1, background:"rgba(255,255,255,.15)" }}/>
              <span style={{ fontSize:".7rem", fontWeight:700, letterSpacing:".16em",
                textTransform:"uppercase" as const, color:"#4a4560" }}>
                More readings coming
              </span>
            </div>
            <div className="upcoming-grid">
              {UPCOMING.map(u => (
                <div className="uc" key={u.title}>
                  <div className="uc-badge">{u.badge}</div>
                  <div className="uc-title">{u.title}</div>
                  <p className="uc-desc">{u.desc}</p>
                  <div className="uc-price">{u.price}</div>
                  <div className="uc-soon">Launching Soon</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="sec dk" id="reviews">
        <div className="c">
          <div className="sl"><span>Beta reader reactions</span></div>
          <h2>People keep sending it<br /><em>to their friends.</em></h2>
          <p className="sub">Real responses from our closed beta. Unfiltered, because that&apos;s the whole point.</p>
          <div className="revg">
            {REVIEWS.map(r => (
              <div className="revc" key={r.name}>
                <div style={{ display:"flex", gap:2, marginBottom:12 }}>
                  {Array.from({length:5}).map((_,i) =>
                    <span key={i} style={{ color:"#F0B84A", fontSize:13 }}>★</span>)}
                </div>
                <p className="revt">&ldquo;{r.text}&rdquo;</p>
                <div className="reva">
                  <div className="revav">{r.init}</div>
                  <div>
                    <div className="revn">{r.name}</div>
                    <div className="revm">{r.meta}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="sec" id="compare">
        <div className="c">
          <div className="sl"><span>Co-Star alternative</span></div>
          <h2>Why people are<br /><em>leaving Co&#8209;Star.</em></h2>
          <p className="sub">Less vague quotes. More specific truths. Here&apos;s exactly how we compare.</p>
          <div className="cmp-wrap">
            <div className="cmp-head">
              <div className="cmp-head-cell">Feature</div>
              <div className="cmp-head-cell hl">BluntChart</div>
              <div className="cmp-head-cell">Co&#8209;Star</div>
            </div>
            {COMPARISON.map((row, i) => (
              <div className="cmp-row" key={i}>
                <div className="cmp-cell feat">{row.feature}</div>
                <div className="cmp-cell">
                  {row.us === true ? <span className="cmp-yes">✓</span> : <span className="cmp-no">✗</span>}
                </div>
                <div className="cmp-cell">
                  {row.them === true ? <span className="cmp-yes">✓</span>
                    : row.them === false ? <span className="cmp-no">✗</span>
                    : row.them === "Subscription" ? <span className="cmp-sub">Subscription</span>
                    : <span className="cmp-partial">{row.them}</span>}
                </div>
              </div>
            ))}
            <div className="cmp-cta">
              <p style={{ fontSize:".87rem", color:"var(--dim)", marginBottom:16,
                maxWidth:440, margin:"0 auto 18px" }}>
                Co-Star is built for daily engagement. BluntChart is built for one honest conversation with your chart.
              </p>
              <a className="bp" href="#try-it" style={{ textDecoration:"none", display:"inline-flex" }}>
                Try BluntChart Free Preview ✨
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="sec dk">
        <div className="c">
          <div className="sl"><span>Common questions</span></div>
          <h2>Everything you&apos;re<br /><em>wondering about.</em></h2>
          <p className="sub">The questions people ask before they get their reading and after they realise it was more accurate than they expected.</p>
          <FAQ />
        </div>
      </section>

      {/* ── WAITLIST ── */}
      <section className="waitlist-sec" id="waitlist">
        <div className="wbg"/>
        <div className="c">
          <div className="wi">
            <div style={{ display:"inline-flex", alignItems:"center", gap:6, fontSize:".8rem",
              color:"var(--dim)", padding:"6px 14px", background:"var(--faint)",
              borderRadius:"100px", marginBottom:24 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"var(--teal)",
                animation:"blink 2s ease-in-out infinite", display:"block" }}/>
              More readings are coming
            </div>
            <h2 style={{ marginBottom:14 }}>
              Join <em>1,000+ waitlist</em><br/>members for first access.
            </h2>
            <p className="sub" style={{ margin:"0 auto 36px", textAlign:"center" }}>
              Compatibility readings, Year Ahead reports, and Gift readings are in development.
              Waitlist members get launch pricing before anyone else.
            </p>
            <div className="wl-cards">
              {UPCOMING.map(u => (
                <div className="wl-card" key={u.title}>
                  <div className="wl-card-badge">Coming Soon</div>
                  <div className="wl-card-title">{u.title}</div>
                  <div className="wl-card-price">{u.price}</div>
                </div>
              ))}
            </div>
            {!submitted ? (
              <form onSubmit={handleWaitlist}
                style={{ maxWidth:"460px", margin:"0 auto", display:"grid", gap:"12px" }}>
                <input className="ei" placeholder="First name" value={name}
                  onChange={e=>setName(e.target.value)} required/>
                <input className="ei" type="email" placeholder="Email address" value={email}
                  onChange={e=>setEmail(e.target.value)} required/>
                <select className="ei"
                  style={{ background:"#12121e", color:"rgba(232,228,240,0.8)", appearance:"none" }}
                  value={reason} onChange={e=>setReason(e.target.value)}>
                  <option value="Compatibility Reading">Compatibility Reading</option>
                  <option value="Year Ahead Reading">Year Ahead Reading</option>
                  <option value="Gift a Reading">Gift a Reading</option>
                  <option value="All of the above">All of the above</option>
                </select>
                <button className="bp" type="submit" style={{ width:"100%", justifyContent:"center" }}>
                  {loading ? "Joining…" : "Join 1,000+ Waitlist Members →"}
                </button>
                <p className="fn" style={{ textAlign:"center" }}>No spam. Launch pricing ends soon.</p>
              </form>
            ) : (
              <div className="fs">
                ✓ You&apos;re in. Watch your inbox. You&apos;ll be first when it launches.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="c">
          <div className="fi">
            <div className="fb">
              <a className="logo" href="#"><span className="g">BluntChart</span></a>
              <p>Brutally honest birth chart readings. Real astrology, zero filter, no subscription.</p>
              <div className="slinks">
                <a className="sl2" href="https://www.tiktok.com/@bluntchart"
                  target="_blank" rel="noopener noreferrer" aria-label="TikTok">Tk</a>
                <a className="sl2" href="https://www.instagram.com/bluntchart/"
                  target="_blank" rel="noopener noreferrer" aria-label="Instagram">In</a>
                <a className="sl2" href="https://www.youtube.com/@BluntChart"
                  target="_blank" rel="noopener noreferrer" aria-label="YouTube">Yt</a>
              </div>
            </div>
            <div className="fl">
              <h4>Readings</h4>
              <ul>
                <li><a href="#try-it">Birth Chart · $15</a></li>
                <li><a href="#waitlist">Compatibility · Coming Soon</a></li>
                <li><a href="#waitlist">Year Ahead · Coming Soon</a></li>
                <li><a href="#waitlist">Gift a Reading · Coming Soon</a></li>
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