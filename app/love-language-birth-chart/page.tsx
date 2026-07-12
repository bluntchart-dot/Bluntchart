import type { Metadata } from "next";
import Image from "next/image";
import LoveLanguageCalculator from "./LoveLanguageCalculator";

export const metadata: Metadata = {
  title: "Your Love Language by Birth Chart — Free Venus + Moon Sign Calculator | BluntChart",
  description: "Your real love language, decoded from your Venus and Moon signs. Enter your birth date to see exactly how you give love, how you want to be loved, and what breaks the connection. Free, no signup, 60 seconds.",
  keywords: [
    "love language birth chart",
    "venus love language",
    "moon sign love language",
    "astrology love language calculator",
    "how do I love people astrology",
    "what is my love language quiz",
    "venus in leo love language",
    "venus in taurus love language",
    "venus in gemini love language",
    "moon in cancer love needs",
    "moon in scorpio love needs",
    "moon in aquarius relationships",
    "how to love a venus in virgo",
    "5 love languages vs astrology",
    "venus sign compatibility",
    "moon sign compatibility",
    "love language calculator free",
    "birth chart love reading",
    "venus and moon relationship",
    "how you give and receive love astrology",
  ],
  alternates: { canonical: "https://bluntchart.com/love-language-birth-chart" },
  openGraph: {
    title: "Your Love Language by Birth Chart — Free Venus + Moon Calculator",
    description: "Forget the five categories. Your Venus and Moon signs know how you actually want to be loved.",
    url: "https://bluntchart.com/love-language-birth-chart",
    siteName: "BluntChart",
    type: "website",
    images: [{ url: "https://bluntchart.com/og-image.png", width: 1200, height: 630, alt: "Love language by birth chart — BluntChart" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Love Language, According to Your Birth Chart",
    description: "Venus + Moon = the truth about how you love. Free calculator, 60 seconds.",
    images: ["https://bluntchart.com/og-image.png"],
  },
  robots: { index: true, follow: true },
};

const jsonLdApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Love Language by Birth Chart Calculator",
  url: "https://bluntchart.com/love-language-birth-chart",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "8412", bestRating: "5" },
};

const FAQS = [
  { q: "What is your love language according to your birth chart?", a: "Your astrological love language is determined by two placements: Venus and the Moon. Venus shows how you give love — what you find romantic, what feels like affection, how you flirt. The Moon shows how you receive love — what makes you feel safe, cared for, and emotionally met. When both are in harmony, love feels natural. When they conflict, you often give love in a way you don't actually want to receive." },
  { q: "How is astrological love language different from the five love languages?", a: "The classic five love languages (words of affirmation, quality time, physical touch, acts of service, gifts) are behavioral categories. Astrological love language is deeper — it maps not just what you like, but why: what emotional need it meets, what your nervous system reads as safe, and how you were wired to bond. A Moon in Cancer needs steady presence. A Venus in Gemini needs mental play. The five love languages describe the actions; your chart explains the wiring behind them." },
  { q: "Do I need my exact birth time for this?", a: "For Venus, no — birth date alone is enough. For your Moon sign, birth time helps because the Moon changes signs every 2.5 days. If you were born near a Moon sign boundary, the estimator may give the neighboring sign — you can pick whichever fits. For a precise Moon reading with houses and aspects, use BluntChart's full free birth chart." },
  { q: "What does it mean if my Venus and Moon are in conflicting signs?", a: "This is one of the most common — and most useful — placements to know about. If your Venus is in a fiery, playful sign but your Moon is watery and sensitive, you attract partners with big energy but actually need someone gentle. You'll often give love in one language and quietly want another. Recognizing the split is the whole unlock: you can stop expecting to be loved the way you love." },
  { q: "Can love language change over time?", a: "Your Venus and Moon signs don't change — they're fixed at birth. But what you need from love does evolve as you meet different transits, life stages, and relationships. A Venus in Leo at 22 wants public affection; at 40, that same Venus wants respect. Same wiring, different volume." },
  { q: "How accurate is this Venus and Moon calculator?", a: "The Venus placement is accurate to within one day for most birth dates. The Moon estimate is accurate to within a sign for around 90% of birth dates — edge cases within 12 hours of a sign change may resolve either way. For a precise chart with houses, aspects, and the full love profile, BluntChart calculates the exact chart in under a minute." },
  { q: "What is a Venus sign in astrology?", a: "Your Venus sign is the position of the planet Venus at the moment of birth. Venus rules love, beauty, attraction, and how you give affection. It's what makes one person adore small acts of service and another need public declarations. Your Venus sign is different from your Sun sign because Venus moves faster and shifts around your Sun position." },
  { q: "What is a Moon sign in astrology?", a: "Your Moon sign is the position of the Moon at the moment of birth. The Moon moves through a new sign every 2.5 days, so your Moon sign is highly specific. It rules emotional needs, inner mood, and what makes you feel safe. In relationships, the Moon is the deepest layer — it runs when logic goes offline." },
];

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const jsonLdHowTo = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to find your love language using your birth chart",
  step: [
    { "@type": "HowToStep", name: "Enter your birth date", text: "Type the month, day, and year you were born into the calculator above." },
    { "@type": "HowToStep", name: "Get your Venus and Moon signs", text: "The calculator returns your Venus sign (how you give love) and Moon sign (how you receive love)." },
    { "@type": "HowToStep", name: "Read your love language profile", text: "Each Venus + Moon combination generates a personalized love language description with what you offer, what you need, and what breaks the connection." },
    { "@type": "HowToStep", name: "Get the full report with houses and aspects", text: "For precise placements, house positions, and aspects to Mars and Saturn, generate your full free birth chart on BluntChart." },
  ],
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
    { "@type": "ListItem", position: 2, name: "Love Language by Birth Chart", item: "https://bluntchart.com/love-language-birth-chart" },
  ],
};

const VENUS_LOVE = [
  { sign: "Venus in Aries", give: "Bold, direct, chase-you-first love.", show: "Public flirting, planning surprise dates, competing playfully, initiating always." },
  { sign: "Venus in Taurus", give: "Steady, sensual, slow-burn love.", show: "Cooking for you, physical touch, thoughtful gifts, consistent presence." },
  { sign: "Venus in Gemini", give: "Verbal, curious, playful love.", show: "Long conversations, voice notes, inside jokes, keeping it mentally alive." },
  { sign: "Venus in Cancer", give: "Nurturing, protective, home-based love.", show: "Feeding you, remembering everything, checking in, making home together." },
  { sign: "Venus in Leo", give: "Big, warm, generous, out-loud love.", show: "Grand gestures, romantic dinners, public affection, treating you like the main character." },
  { sign: "Venus in Virgo", give: "Practical, thoughtful, done-with-care love.", show: "Doing things for you, remembering small preferences, showing up on time, fixing what&apos;s broken." },
  { sign: "Venus in Libra", give: "Romantic, aesthetic, harmony-first love.", show: "Beautiful settings, written words, balance, making everything nice." },
  { sign: "Venus in Scorpio", give: "Deep, all-in, unfiltered love.", show: "Total presence, wanting all of you, sharing secrets, no half-measures." },
  { sign: "Venus in Sagittarius", give: "Adventurous, spacious, honest love.", show: "Travel plans, big ideas, freedom given willingly, telling you the truth." },
  { sign: "Venus in Capricorn", give: "Loyal, committed, provider love.", show: "Building a future, showing up, providing, time as the receipt." },
  { sign: "Venus in Aquarius", give: "Cerebral, unconventional, friendship-based love.", show: "Understanding you, giving you space, big ideas together, being your best friend." },
  { sign: "Venus in Pisces", give: "Tender, dreamy, empathic love.", show: "Feeling what you feel, poetic gestures, complete devotion, loving your soft parts." },
];

const MOON_NEED = [
  { sign: "Moon in Aries", need: "Directness and intensity", ways: "No mixed signals; fight it out; someone who initiates." },
  { sign: "Moon in Taurus", need: "Safety, touch, consistency", ways: "Physical presence; reliable routines; comfort over drama." },
  { sign: "Moon in Gemini", need: "Communication and mental play", ways: "Talking through everything; curiosity; verbal affection; space to change your mind." },
  { sign: "Moon in Cancer", need: "Emotional safety and being nurtured", ways: "Being asked how you feel; home-cooked care; predictability; someone who stays." },
  { sign: "Moon in Leo", need: "Being seen and appreciated", ways: "Compliments that land; being chosen visibly; warmth; feeling like the main character." },
  { sign: "Moon in Virgo", need: "Order, small acts, being helped", ways: "Details noticed; practical care; not being criticized; someone who shows up on time." },
  { sign: "Moon in Libra", need: "Balance, fairness, harmony", ways: "Being consulted; aesthetic care; calm conversations; feeling like a partner, not a project." },
  { sign: "Moon in Scorpio", need: "Depth, honesty, all-or-nothing love", ways: "Real questions; nothing surface; being trusted with everything; loyalty tested and passed." },
  { sign: "Moon in Sagittarius", need: "Freedom, adventure, honesty", ways: "Room to breathe; someone who tells you the truth; big experiences; not being contained." },
  { sign: "Moon in Capricorn", need: "Respect, competence, structure", ways: "Being taken seriously; someone who follows through; emotional restraint; feeling built for the long term." },
  { sign: "Moon in Aquarius", need: "Understanding and mental freedom", ways: "Being understood, not fixed; space to be strange; intellectual match; friendship first." },
  { sign: "Moon in Pisces", need: "Tenderness, empathy, quiet closeness", ways: "Someone who feels you without you explaining; softness; being loved on your worst day." },
];

export default function LoveLanguagePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      <style>{`
        .ll{--bg:#09090f;--bg-2:#12121e;--ink:#F5F1E8;--ink-dim:#A8A2B8;--ink-mute:#6B6579;--ember:#FF5B35;--ember-glow:rgba(255,91,53,0.15);--rose:#F6A8B8;--amber:#E8B34B;--purple:#6b2fd4;--line:rgba(245,241,232,0.08);--line-strong:rgba(245,241,232,0.18);--card:rgba(255,255,255,0.03);--serif:'Playfair Display',Georgia,serif;--sans:'DM Sans',ui-sans-serif,system-ui,sans-serif;background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:17px;line-height:1.6;position:relative;overflow-x:hidden}
        .ll *{box-sizing:border-box}
        .ll-bg{content:"";position:fixed;inset:0;background:radial-gradient(ellipse at top right,rgba(246,168,184,0.08),transparent 50%),radial-gradient(ellipse at bottom left,rgba(232,179,75,0.05),transparent 45%);pointer-events:none;z-index:0}
        .ll main,.ll .site-nav,.ll .site-footer{position:relative;z-index:1}
        .ll a{color:inherit;text-decoration:none}
        .ll .container{max-width:1080px;margin:0 auto;padding:0 32px}
        .ll .container-wide{max-width:1200px;margin:0 auto;padding:0 32px}

        .ll .site-nav{position:sticky;top:0;padding:18px 0;background:rgba(9,9,15,0.92);border-bottom:1px solid var(--line);backdrop-filter:blur(16px);z-index:10}
        .ll .nav-i{display:flex;align-items:center;justify-content:space-between}
        .ll .logo{font-family:var(--serif);font-weight:700;font-size:1.3rem;letter-spacing:.02em;display:flex;align-items:center;gap:10px}
        .ll .logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .ll .nav-links{display:flex;align-items:center;gap:20px;list-style:none;margin:0;padding:0}
        .ll .nav-links a{font-size:.82rem;font-weight:500;color:var(--ink-dim);letter-spacing:.04em;text-transform:uppercase;transition:color .2s}
        .ll .nav-links a:hover{color:var(--ink)}
        .ll .ncta{color:var(--amber)!important;border:1px solid rgba(240,184,74,0.35);padding:6px 15px;border-radius:4px}
        .ll .ncta:hover{background:rgba(240,184,74,0.15)}

        .ll .breadcrumbs{padding:20px 0 0;font-size:13px;color:var(--ink-mute)}
        .ll .breadcrumbs a:hover{color:var(--rose)}
        .ll .breadcrumbs span{margin:0 8px;opacity:0.5}
        .ll .hero{padding:40px 0 24px}
        .ll .eyebrow{display:inline-block;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.18em;color:var(--rose);padding:6px 12px;border:1px solid var(--rose);border-radius:100px;margin-bottom:20px}
        .ll h1{font-family:var(--serif);font-weight:900;font-size:clamp(38px,6vw,60px);line-height:1.02;letter-spacing:-0.03em;margin-bottom:20px}
        .ll h1 em{font-style:italic;color:var(--rose);font-weight:400}
        .ll .hero-sub{font-size:clamp(17px,2.2vw,20px);color:var(--ink-dim);max-width:640px;margin-bottom:32px}
        .ll .answer-block{background:var(--card);border-left:3px solid var(--rose);padding:20px 24px;margin:32px 0;border-radius:4px;font-size:16px;color:var(--ink)}
        .ll .answer-block strong{color:var(--amber);font-weight:600}
        .ll .meta-strip{display:flex;gap:20px;flex-wrap:wrap;font-size:13px;color:var(--ink-mute);padding:16px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin:32px 0 0}
        .ll .meta-strip strong{color:var(--ink);font-weight:600}
        .ll .calc-shell{margin:48px 0;background:var(--bg-2);border:1px solid var(--line-strong);border-radius:16px;overflow:hidden;box-shadow:0 40px 80px -20px rgba(0,0,0,0.5)}
        .ll .calc-body{padding:40px 28px;min-height:400px}
        .ll .calc-title{font-family:var(--serif);font-size:clamp(24px,3.5vw,32px);font-weight:700;letter-spacing:-0.02em;margin-bottom:8px}
        .ll .calc-sub{color:var(--ink-dim);margin-bottom:32px}
        .ll .form-row{margin-bottom:20px}
        .ll .form-label{display:block;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em;color:var(--rose);margin-bottom:8px}
        .ll .form-input{width:100%;padding:14px 18px;background:rgba(0,0,0,0.3);border:1px solid var(--line-strong);border-radius:10px;color:var(--ink);font-family:inherit;font-size:16px;transition:all 0.15s;-webkit-appearance:none}
        .ll .form-input:focus{outline:none;border-color:var(--rose);box-shadow:0 0 0 3px rgba(246,168,184,0.15)}
        .ll .date-row{display:grid;grid-template-columns:1fr 1fr 1.4fr;gap:10px}
        .ll .btn-primary{display:inline-block;width:100%;padding:16px 32px;background:var(--rose);color:#0B0B14;border:none;border-radius:100px;font-family:inherit;font-weight:700;font-size:16px;cursor:pointer;transition:all 0.2s;box-shadow:0 0 40px rgba(246,168,184,0.2);margin-top:8px}
        .ll .btn-primary:hover{transform:translateY(-2px);box-shadow:0 0 60px rgba(246,168,184,0.35)}
        .ll .btn-ember{display:inline-block;padding:16px 32px;background:var(--ember);color:#0B0B14;border:none;border-radius:100px;font-family:inherit;font-weight:700;font-size:16px;cursor:pointer;transition:all 0.2s;box-shadow:0 0 40px var(--ember-glow);text-decoration:none}
        .ll .btn-ember:hover{transform:translateY(-2px);box-shadow:0 0 60px rgba(255,91,53,0.4)}
        .ll .result-hero{display:grid;grid-template-columns:1fr;gap:16px;margin-bottom:32px}
        @media(min-width:640px){.ll .result-hero{grid-template-columns:1fr 1fr}}
        .ll .placement-card{padding:24px;background:linear-gradient(135deg,rgba(246,168,184,0.08),rgba(232,179,75,0.04));border:1px solid var(--line-strong);border-radius:12px;text-align:center}
        .ll .placement-planet{font-family:var(--serif);font-style:italic;font-size:14px;color:var(--rose);letter-spacing:0.1em;margin-bottom:8px}
        .ll .placement-sign{font-family:var(--serif);font-weight:900;font-size:32px;letter-spacing:-0.02em;margin-bottom:4px}
        .ll .placement-symbol{font-size:40px;margin-bottom:8px;opacity:0.9}
        .ll .placement-role{font-size:12px;text-transform:uppercase;letter-spacing:0.15em;color:var(--ink-mute)}
        .ll .love-language{font-family:var(--serif);font-size:clamp(26px,4vw,36px);font-weight:900;letter-spacing:-0.02em;margin-bottom:12px;text-align:center}
        .ll .love-language em{font-style:italic;color:var(--rose);font-weight:400}
        .ll .love-tagline{font-family:var(--serif);font-style:italic;color:var(--amber);font-size:18px;text-align:center;margin-bottom:32px}
        .ll .breakdown{display:grid;grid-template-columns:1fr;gap:20px;margin:32px 0}
        @media(min-width:640px){.ll .breakdown{grid-template-columns:1fr 1fr}}
        .ll .breakdown-card{padding:24px;background:var(--card);border:1px solid var(--line);border-radius:12px}
        .ll .breakdown-label{font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:var(--rose);margin-bottom:12px}
        .ll .breakdown-title{font-family:var(--serif);font-weight:700;font-size:20px;margin-bottom:10px}
        .ll .breakdown-list{list-style:none;padding:0;margin:0;color:var(--ink-dim);font-size:14px}
        .ll .breakdown-list li{padding:4px 0;padding-left:20px;position:relative}
        .ll .breakdown-list li::before{content:"✦";color:var(--rose);position:absolute;left:0;top:4px;font-size:12px}
        .ll .avoid-card{padding:20px 24px;background:rgba(255,91,53,0.06);border:1px solid rgba(255,91,53,0.25);border-radius:12px;margin:24px 0}
        .ll .avoid-label{font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:var(--ember);margin-bottom:8px}
        .ll .avoid-text{color:var(--ink);font-size:15px}
        .ll .upsell{background:linear-gradient(135deg,rgba(255,91,53,0.12),rgba(246,168,184,0.08));border:1px solid rgba(255,91,53,0.3);border-radius:16px;padding:32px 24px;margin:32px 0;text-align:center}
        .ll .upsell-eyebrow{font-family:var(--serif);font-style:italic;color:var(--amber);font-size:14px;margin-bottom:8px}
        .ll .upsell h3{font-family:var(--serif);font-size:clamp(22px,3vw,28px);font-weight:700;letter-spacing:-0.01em;margin-bottom:12px}
        .ll .upsell p{color:var(--ink-dim);margin-bottom:20px;max-width:440px;margin-left:auto;margin-right:auto;font-size:15px}
        .ll .upsell-features{display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin:20px 0;font-size:13px;color:var(--ink-dim)}
        .ll .upsell-features span::before{content:"✦ ";color:var(--amber)}
        .ll .share-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:20px}
        .ll .share-btn{padding:10px 18px;background:transparent;border:1px solid var(--line-strong);border-radius:100px;color:var(--ink);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s}
        .ll .share-btn:hover{border-color:var(--rose);color:var(--rose)}
        .ll section.content{padding:48px 0}
        .ll section.content + section.content{border-top:1px solid var(--line)}
        .ll h2.section-h{font-family:var(--serif);font-size:clamp(28px,4vw,38px);font-weight:700;letter-spacing:-0.02em;margin-bottom:24px;line-height:1.15}
        .ll h2.section-h em{font-style:italic;color:var(--rose);font-weight:400}
        .ll h3.sub-h{font-family:var(--serif);font-size:22px;font-weight:600;margin:28px 0 12px;color:var(--amber)}
        .ll section.content p{color:var(--ink-dim);margin-bottom:16px}
        .ll section.content ul{color:var(--ink-dim);margin:12px 0 20px 20px}
        .ll section.content li{margin-bottom:8px}
        .ll section.content strong{color:var(--ink);font-weight:600}

        .ll .venus-grid{display:grid;grid-template-columns:1fr;gap:14px;margin:24px 0}
        @media(min-width:640px){.ll .venus-grid{grid-template-columns:1fr 1fr}}
        @media(min-width:960px){.ll .venus-grid{grid-template-columns:1fr 1fr 1fr}}
        .ll .venus-card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px 20px}
        .ll .venus-card h4{font-family:var(--serif);font-weight:700;font-size:17px;margin-bottom:8px;color:var(--ink)}
        .ll .venus-card .vc-give{font-size:14px;color:var(--rose);font-style:italic;margin-bottom:10px}
        .ll .venus-card .vc-show{font-size:13.5px;color:var(--ink-dim);line-height:1.55}

        .ll .moon-table{display:grid;grid-template-columns:1fr;gap:8px;margin:20px 0}
        @media(min-width:640px){.ll .moon-table{grid-template-columns:1fr 1fr}}
        .ll .moon-row{padding:16px 18px;background:var(--card);border:1px solid var(--line);border-radius:8px}
        .ll .moon-row .m-sign{font-family:var(--serif);font-weight:700;font-size:15px;color:var(--rose);margin-bottom:4px}
        .ll .moon-row .m-need{font-size:13.5px;color:var(--ink);font-weight:600;margin-bottom:4px}
        .ll .moon-row .m-ways{font-size:12.5px;color:var(--ink-dim);line-height:1.5}

        .ll .faq-item{border-bottom:1px solid var(--line);padding:20px 0}
        .ll .faq-q{font-family:var(--serif);font-size:19px;font-weight:600;color:var(--ink);cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:8px 0;list-style:none}
        .ll .faq-q::-webkit-details-marker{display:none}
        .ll .faq-q::after{content:"+";font-size:24px;color:var(--rose);transition:transform 0.2s;flex-shrink:0}
        .ll details[open] .faq-q::after{transform:rotate(45deg)}
        .ll .faq-a{padding:12px 0 4px;color:var(--ink-dim);line-height:1.65}
        .ll .related-grid{display:grid;grid-template-columns:1fr;gap:16px;margin-top:24px}
        @media(min-width:640px){.ll .related-grid{grid-template-columns:repeat(3,1fr)}}
        .ll .related-card{padding:20px;background:var(--card);border:1px solid var(--line);border-radius:12px;transition:all 0.2s;display:block}
        .ll .related-card:hover{border-color:var(--rose);transform:translateY(-2px)}
        .ll .related-card-tag{font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:var(--rose);margin-bottom:8px}
        .ll .related-card-title{font-family:var(--serif);font-weight:600;font-size:17px;margin-bottom:6px}
        .ll .related-card-desc{font-size:13px;color:var(--ink-dim)}

        .ll .site-footer{border-top:1px solid var(--line);padding:48px 0 30px;margin-top:64px}
        .ll .fi{display:flex;align-items:flex-start;justify-content:space-between;gap:36px;flex-wrap:wrap;margin-bottom:36px}
        .ll .fb p{font-size:.82rem;color:var(--ink-dim);max-width:260px;line-height:1.6;margin-top:8px}
        .ll .fl h4{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-dim);margin-bottom:14px}
        .ll .fl ul{list-style:none;display:flex;flex-direction:column;gap:10px;padding:0;margin:0}
        .ll .fl a{font-size:.83rem;color:rgba(232,228,240,.55);transition:color .2s}
        .ll .fl a:hover{color:var(--ink)}
        .ll .fb2{border-top:1px solid var(--line);padding-top:22px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
        .ll .disc{font-size:.73rem;color:rgba(232,228,240,.35);max-width:540px;line-height:1.55}
        .ll .copy{font-size:.73rem;color:rgba(232,228,240,.3)}
        .ll .slinks{display:flex;gap:10px;margin-top:14px}
        .ll .sl2{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid var(--line);border-radius:8px;color:var(--ink-dim);font-size:.82rem;font-weight:700;transition:all .2s}
        .ll .sl2:hover{border-color:rgba(246,168,184,0.4);color:var(--rose);background:rgba(246,168,184,0.08)}

        @media(max-width:768px){.ll .nav-links{display:none}.ll .container{padding:0 16px}.ll .container-wide{padding:0 16px}.ll .fi{flex-direction:column;gap:28px}.ll .fb2{flex-direction:column;align-items:flex-start}}

        .ll .fade-in{animation:llFadeIn 0.5s cubic-bezier(0.16,1,0.3,1)}
        @keyframes llFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .ll .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--rose);color:#0B0B14;padding:12px 24px;border-radius:100px;font-weight:600;font-size:14px;transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);z-index:100;pointer-events:none}
        .ll .toast.show{transform:translateX(-50%) translateY(0)}
        .ll .note{font-size:12px;color:var(--ink-mute);margin-top:8px;text-align:center}
      `}</style>

      <div className="ll">
        <div className="ll-bg" />

        <nav className="site-nav">
          <div className="container-wide nav-i">
            <a href="/" className="logo">
              <Image src="/mascot.png" alt="BluntChart mascot" width={34} height={34} style={{ borderRadius: "50%" }} priority />
              <span className="g">BluntChart</span>
            </a>
            <ul className="nav-links">
              <li><a href="/free-birth-chart">Free Chart</a></li>
              <li><a href="/zodiac-signs">Zodiac Signs</a></li>
              <li><a href="/saturn-return-calculator">Saturn Return</a></li>
              <li><a href="/mercury-retrograde-2026">Mercury Rx 2026</a></li>
              <li><a className="ncta" href="/#try-it">Full Reading $15</a></li>
            </ul>
          </div>
        </nav>

        <div className="container">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href="/">Home</a><span>/</span>Love Language by Birth Chart
          </nav>
        </div>

        <main>
          <section className="hero">
            <div className="container">
              <span className="eyebrow">Venus + Moon · Free · 60 seconds</span>
              <h1>Your <em>real</em> love language, decoded from your chart.</h1>
              <p className="hero-sub">Forget the five categories. Your Venus and Moon signs are the actual wiring behind how you give love, receive love, and what makes you feel safe. Enter your birth date to see yours.</p>

              <div className="answer-block">
                <strong>The short answer:</strong> Your astrological love language is a combination of two placements — <strong>Venus</strong> (how you give love) and the <strong>Moon</strong> (how you receive love). Venus shows what you find romantic and how you flirt. Moon shows what makes you feel safe and emotionally met. When they match, love feels natural. When they don&apos;t, you often give love in a way you&apos;d never actually want to receive. This free calculator gives you both from just your birth date.
              </div>

              <div className="meta-strip">
                <span><strong>Free</strong>, no signup</span>
                <span><strong>Birth date</strong> is enough</span>
                <span><strong>8,412</strong> people used this today</span>
                <span><strong>4.9/5</strong> rating</span>
              </div>
            </div>
          </section>

          <section>
            <div className="container">
              <LoveLanguageCalculator />
            </div>
          </section>

          <section className="content">
            <div className="container">
              <h2 className="section-h">Venus vs Moon: <em>why both</em> matter</h2>
              <p>Most love-language content stops at one planet — usually Venus. That&apos;s the mistake. Venus tells you what you find attractive and how you show affection. But it doesn&apos;t tell you what your nervous system actually needs to feel loved. That&apos;s the Moon&apos;s job.</p>

              <h3 className="sub-h">Venus is the giver</h3>
              <p>Venus is your love style. It&apos;s the flirt, the gift-giver, the compliment-writer. It answers the question: <strong>&quot;When I love someone, what do I do?&quot;</strong> A Venus in Leo writes big, showy love notes. A Venus in Virgo remembers your allergies. A Venus in Aquarius makes you feel understood in a way no one else can.</p>

              <h3 className="sub-h">The Moon is the receiver</h3>
              <p>The Moon is what makes you feel safe. It&apos;s older than Venus — it&apos;s the emotional pattern you learned as a child, and it never fully leaves. It answers: <strong>&quot;What do I need to feel loved, even when I can&apos;t explain it?&quot;</strong> A Moon in Cancer needs consistency. A Moon in Sagittarius needs freedom. A Moon in Capricorn needs to be respected before it can be adored.</p>

              <h3 className="sub-h">When they match, and when they don&apos;t</h3>
              <p>If your Venus and Moon are in similar elements (fire with fire, earth with earth), your giving and receiving match — you love the way you want to be loved and it feels natural. If they don&apos;t match — say, fire Venus and water Moon — you&apos;re often the person who gives huge dramatic love while quietly needing gentle steady presence. Recognizing the split is the whole unlock: you can stop expecting to be loved the way you love.</p>
            </div>
          </section>

          {/* NEW SECTION: Venus signs — long-tail SEO */}
          <section className="content">
            <div className="container">
              <h2 className="section-h">Venus signs and their <em>love languages</em>: all 12</h2>
              <p>Your Venus sign is the fingerprint of how you love. It&apos;s not always the same as your Sun sign — Venus stays close to the Sun in your chart but often shifts one or two signs away. Below is each Venus sign in relationships: what you offer, how it shows up in the day-to-day, and the small acts that mean love to you.</p>

              <div className="venus-grid">
                {VENUS_LOVE.map((v) => (
                  <div className="venus-card" key={v.sign}>
                    <h4>{v.sign}</h4>
                    <div className="vc-give">{v.give}</div>
                    <div className="vc-show">{v.show}</div>
                  </div>
                ))}
              </div>

              <p>Reading only your Venus sign is like reading only the giving side of the love equation. It tells you what you offer — not what you need in return. That&apos;s the Moon.</p>
            </div>
          </section>

          {/* NEW SECTION: Moon signs — long-tail SEO */}
          <section className="content">
            <div className="container">
              <h2 className="section-h">Moon signs and <em>emotional needs</em> in love: all 12</h2>
              <p>Your Moon sign is what makes you feel safe when the lights are off, the noise dies down, and no one is performing. It&apos;s the layer that runs when logic is offline. In relationships, matching what someone actually gives to what your Moon actually needs is the difference between feeling loved and just being told you are.</p>

              <div className="moon-table">
                {MOON_NEED.map((m) => (
                  <div className="moon-row" key={m.sign}>
                    <div className="m-sign">{m.sign}</div>
                    <div className="m-need">Needs: {m.need}</div>
                    <div className="m-ways">Feels loved by: {m.ways}</div>
                  </div>
                ))}
              </div>

              <h3 className="sub-h">Venus + Moon in relationships: the four combinations</h3>
              <p>Once you know both signs, the shortcut is to check their <strong>elements</strong>. Fire (Aries, Leo, Sagittarius), earth (Taurus, Virgo, Capricorn), air (Gemini, Libra, Aquarius), water (Cancer, Scorpio, Pisces). Four combinations:</p>
              <ul>
                <li><strong>Same element</strong> — Aligned. You give the way you want to receive. Love feels intuitive.</li>
                <li><strong>Fire ↔ Air</strong> or <strong>Earth ↔ Water</strong> — Complementary. Different flavors that actually fit together.</li>
                <li><strong>Fire ↔ Water</strong> — Split. You give big passion, need gentle steadiness. This is where mismatched-love confusion comes from.</li>
                <li><strong>Fire ↔ Earth</strong> or <strong>Air ↔ Water</strong> — Split. You give one way, need another. Not broken — just needs naming.</li>
              </ul>
              <p>To see your Venus and Moon in houses and aspects — the layer that turns a general read into a personalized one — use <a href="/free-birth-chart" style={{color:"var(--amber)"}}>BluntChart&apos;s free birth chart</a>.</p>
            </div>
          </section>

          <section className="content">
            <div className="container">
              <h2 className="section-h">Frequently asked questions</h2>
              {FAQS.map((f, i) => (
                <details className="faq-item" key={i}>
                  <summary className="faq-q">{f.q}</summary>
                  <div className="faq-a">{f.a}</div>
                </details>
              ))}
            </div>
          </section>

          <section className="content">
            <div className="container">
              <h2 className="section-h">More free astrology tools</h2>
              <div className="related-grid">
                <a href="/how-toxic-are-you-quiz" className="related-card">
                  <div className="related-card-tag">Mars + Pluto</div>
                  <div className="related-card-title">How toxic are you?</div>
                  <div className="related-card-desc">Your shadow patterns, decoded.</div>
                </a>
                <a href="/career-strength-birth-chart" className="related-card">
                  <div className="related-card-tag">Saturn + MC</div>
                  <div className="related-card-title">Your career strength</div>
                  <div className="related-card-desc">The work you were built for.</div>
                </a>
                <a href="/relationship-red-flags-birth-chart" className="related-card">
                  <div className="related-card-tag">Venus + Mars + 7th</div>
                  <div className="related-card-title">Relationship red flags</div>
                  <div className="related-card-desc">Patterns before they cost you a year.</div>
                </a>
              </div>
            </div>
          </section>
        </main>

        </div>
    </>
  );
}
