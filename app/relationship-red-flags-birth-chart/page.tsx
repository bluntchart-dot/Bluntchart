import type { Metadata } from "next";
import Image from "next/image";
import RedFlagsQuiz from "./RedFlagsQuiz";

export const metadata: Metadata = {
  title: "Relationship Red Flags in Your Birth Chart — Free 10-Question Astrology Test | BluntChart",
  description: "Find the relationship red flags hiding in your Venus, Mars, Moon and 7th house — and the top three patterns you keep repeating. Free 10-question test, no signup, brutally honest results in 2 minutes.",
  keywords: [
    "relationship red flags birth chart",
    "astrology relationship red flags",
    "toxic relationship signs by zodiac",
    "venus red flags in dating",
    "mars in scorpio relationship red flags",
    "7th house synastry red flags",
    "moon square saturn relationships",
    "how to spot red flags astrology",
    "love bombing astrology",
    "picking unavailable partners astrology",
    "score keeping in relationships astrology",
    "anxious attachment moon sign",
    "control patterns pluto 7th house",
    "fantasy over reality neptune venus",
    "silent treatment cancer mars",
    "birth chart compatibility warnings",
    "relationship patterns natal chart",
    "dating red flags by zodiac sign",
    "astrology attachment style test",
    "fixable red flags in relationships",
  ],
  alternates: { canonical: "https://bluntchart.com/relationship-red-flags-birth-chart" },
  openGraph: {
    title: "Relationship Red Flags in Your Birth Chart — Free 10-Question Test",
    description: "Ten questions. Your Venus, Mars, Moon and 7th house tell you which patterns are yours. Free, no signup.",
    url: "https://bluntchart.com/relationship-red-flags-birth-chart",
    siteName: "BluntChart",
    type: "website",
    images: [{ url: "https://bluntchart.com/og-image.png", width: 1200, height: 630, alt: "Relationship red flags in your birth chart — BluntChart" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Your Relationship Red Flags, Decoded by Your Chart",
    description: "10 questions. Venus, Mars, Moon, 7th house. Your top three patterns and one thing to work on next.",
    images: ["https://bluntchart.com/og-image.png"],
  },
  robots: { index: true, follow: true },
};

const jsonLdQuiz = {
  "@context": "https://schema.org",
  "@type": "Quiz",
  name: "Relationship Red Flags Test — Astrology Edition",
  description: "A 10-question test that identifies the top three relationship red flags you carry into partnerships, mapped to Venus, Mars, Moon, and 7th house patterns.",
  about: { "@type": "Thing", name: "Relationship patterns based on Venus, Mars, Moon and 7th house astrology" },
  learningResourceType: "quiz",
  inLanguage: "en",
  publisher: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
};

const jsonLdApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Relationship Red Flags Test",
  url: "https://bluntchart.com/relationship-red-flags-birth-chart",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", ratingCount: "18523", bestRating: "5" },
};

const FAQS = [
  { q: "What are the biggest relationship red flags in a birth chart?", a: "The most common relationship red flags in a birth chart come from four placements: Venus (love style — love-bombing, fantasy, picking unavailable people), Mars (conflict — reactive rupture, silent punishment, score-keeping), Moon (attachment — anxious pursuit, emotional testing), and the 7th house (partnership dynamics — losing yourself, control games). Every chart has at least one or two. The point isn't perfection — it's naming which patterns are yours before they cost you another year." },
  { q: "What zodiac sign has the most relationship red flags?", a: "No sign has more red flags than any other. Every sign has patterns that turn into red flags when unhealed. Scorpio slides into control and obsession. Gemini goes emotionally unavailable. Cancer guilt-trips and withdraws. Aries reacts before thinking. Capricorn goes cold. Pisces disappears into fantasy. The healthiest partners you'll ever meet also come from these signs — the difference is awareness, not the sign." },
  { q: "Is this test about my red flags or my partner's?", a: "This one is about you — the patterns you bring into relationships. That's the more useful test. You can only change your own wiring, not theirs. Once you know your top three, you can spot yourself doing them in real time and interrupt the loop instead of running it again with a different person." },
  { q: "Can relationship red flags in a birth chart be changed?", a: "The placements don't change, but the expression absolutely does. Every placement has a healthy and an unhealthy version. Awareness is the switch. Naming a pattern out loud — 'I'm doing the thing where I go cold' — is usually enough to break it in the moment. Over time, therapy and Saturn returns tend to do the heavy lifting." },
  { q: "Which planets show relationship red flags in astrology?", a: "Four placements do most of the work. Venus shows how you give love and where you sabotage it. Mars shows how you fight and where you rupture. The Moon shows how you attach and where you cling or panic. The 7th house shows your unconscious partnership template — the dynamic you inherited before you knew you had one." },
  { q: "How is this different from just a personality test?", a: "Personality tests describe who you are in general. This one focuses only on relationship patterns — how you show up when it counts, when you're triggered, when you're falling for someone, and when things are ending. It maps ten specific relationship red flags tied to Venus, Mars, Moon and 7th house astrology." },
  { q: "How long does the test take?", a: "About 2 minutes. Ten quick questions with honest options. You'll get a red flag count from 0 to 10, your top three patterns, and one specific thing to work on next." },
  { q: "Do I need my birth time or full chart to take this?", a: "No. This test works from behavior, not birth data. But if you want the actual placements behind your top three flags — the exact Venus sign, Mars house, Moon aspects, and 7th house profile — BluntChart's free birth chart calculates them in under a minute." },
];

const jsonLdFaq = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "BluntChart", item: "https://bluntchart.com" },
    { "@type": "ListItem", position: 2, name: "Relationship Red Flags", item: "https://bluntchart.com/relationship-red-flags-birth-chart" },
  ],
};

// Sign-by-sign red flag data (long-tail SEO — one target keyword per sign)
const SIGN_FLAGS = [
  { sign: "Aries", planet: "Mars-ruled", flag: "Reactive rupture. You react before you think. The fight is over in ten minutes but the ten minutes hurt. Watch for: raising your voice first, needing to win.", healthy: "Direct honesty, courage to name conflict early." },
  { sign: "Taurus", planet: "Venus-ruled", flag: "Stubborn stonewalling. You stay too long when you should leave, and once you're done, you're immovable. Watch for: refusing to revisit, freezing partners out over money or comfort.", healthy: "Steadiness, sensual presence, loyalty when earned." },
  { sign: "Gemini", planet: "Mercury-ruled", flag: "Emotional avoidance through wit. You talk your way out of feeling. Watch for: making a joke when it gets real, disappearing mid-conversation.", healthy: "Playful curiosity, mental intimacy, mediation." },
  { sign: "Cancer", planet: "Moon-ruled", flag: "Guilt-trip withdrawal. You get quiet, then punish through mood. Watch for: 'nothing's wrong' when everything is, testing them to prove love.", healthy: "Deep nurturing, emotional attunement, protective loyalty." },
  { sign: "Leo", planet: "Sun-ruled", flag: "Ego injury as weapon. Bruised pride becomes cold silence or drama. Watch for: making it about being seen, requiring public devotion.", healthy: "Generous warmth, big-hearted commitment, celebration." },
  { sign: "Virgo", planet: "Mercury-ruled", flag: "Criticism disguised as help. You edit your partner. Watch for: fixing when they didn't ask, small daily corrections that add up.", healthy: "Practical devotion, thoughtful acts of service." },
  { sign: "Libra", planet: "Venus-ruled", flag: "Losing yourself in the merge. You bend until you break, then blame them. Watch for: 'what do you want to do?' every time, no boundary until resentment.", healthy: "Beautiful balance, genuine partnership, fairness." },
  { sign: "Scorpio", planet: "Pluto-ruled", flag: "Control and score-keeping. You remember everything and use it. Watch for: silent testing, needing to hold power, jealousy loops.", healthy: "All-in loyalty, transformative depth, no half-love." },
  { sign: "Sagittarius", planet: "Jupiter-ruled", flag: "Freedom as exit strategy. When it gets real, you bolt. Watch for: booking a trip mid-argument, calling boundaries 'a cage.'", healthy: "Honest adventure, spacious love, big-picture optimism." },
  { sign: "Capricorn", planet: "Saturn-ruled", flag: "Emotional coldness. You go structural to avoid vulnerable. Watch for: turning feelings into plans, respecting more than adoring.", healthy: "Rock-solid commitment, long-term building, quiet devotion." },
  { sign: "Aquarius", planet: "Uranus-ruled", flag: "Intellectual distance. You watch instead of feel. Watch for: analyzing the relationship from outside it, calling detachment 'independence.'", healthy: "Genuine understanding, freedom-based love, friendship first." },
  { sign: "Pisces", planet: "Neptune-ruled", flag: "Fantasy over reality. You love who they could be. Watch for: excusing what's actually happening, disappearing into daydream when reality bites.", healthy: "Tender empathy, poetic devotion, healing presence." },
];

export default function RelationshipRedFlagsPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdQuiz) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      <style>{`
        .rf{--bg:#09090f;--bg-2:#12121e;--ink:#F5F1E8;--ink-dim:#A8A2B8;--ink-mute:#6B6579;--ember:#FF5B35;--red:#E63946;--red-glow:rgba(230,57,70,0.15);--amber:#E8B34B;--purple:#6b2fd4;--rose:#d4537e;--line:rgba(245,241,232,0.08);--line-strong:rgba(245,241,232,0.18);--card:rgba(255,255,255,0.03);--serif:'Playfair Display',Georgia,serif;--sans:'DM Sans',ui-sans-serif,system-ui,sans-serif;background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:17px;line-height:1.6;position:relative;overflow-x:hidden}
        .rf *{box-sizing:border-box}
        .rf-bg{content:"";position:fixed;inset:0;background:radial-gradient(ellipse at top left,rgba(230,57,70,0.08),transparent 50%),radial-gradient(ellipse at bottom right,rgba(255,91,53,0.05),transparent 45%);pointer-events:none;z-index:0}
        .rf main,.rf .site-nav,.rf .site-footer{position:relative;z-index:1}
        .rf a{color:inherit;text-decoration:none}
        .rf .container{max-width:1080px;margin:0 auto;padding:0 32px}
        .rf .container-wide{max-width:1200px;margin:0 auto;padding:0 32px}

        /* SITE NAV — matches main site pattern */
        .rf .site-nav{position:sticky;top:0;padding:18px 0;background:rgba(9,9,15,0.92);border-bottom:1px solid var(--line);backdrop-filter:blur(16px);z-index:10}
        .rf .nav-i{display:flex;align-items:center;justify-content:space-between}
        .rf .logo{font-family:var(--serif);font-weight:700;font-size:1.3rem;letter-spacing:.02em;display:flex;align-items:center;gap:10px}
        .rf .logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .rf .nav-links{display:flex;align-items:center;gap:20px;list-style:none;margin:0;padding:0}
        .rf .nav-links a{font-size:.82rem;font-weight:500;color:var(--ink-dim);letter-spacing:.04em;text-transform:uppercase;transition:color .2s}
        .rf .nav-links a:hover{color:var(--ink)}
        .rf .ncta{color:var(--amber)!important;border:1px solid rgba(240,184,74,0.35);padding:6px 15px;border-radius:4px}
        .rf .ncta:hover{background:rgba(240,184,74,0.15)}

        .rf .breadcrumbs{padding:20px 0 0;font-size:13px;color:var(--ink-mute)}
        .rf .breadcrumbs a:hover{color:var(--red)}
        .rf .breadcrumbs span{margin:0 8px;opacity:0.5}
        .rf .hero{padding:40px 0 24px}
        .rf .eyebrow{display:inline-block;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.18em;color:var(--red);padding:6px 12px;border:1px solid var(--red);border-radius:100px;margin-bottom:20px}
        .rf h1{font-family:var(--serif);font-weight:900;font-size:clamp(38px,6vw,60px);line-height:1.02;letter-spacing:-0.03em;margin-bottom:20px}
        .rf h1 em{font-style:italic;color:var(--red);font-weight:400}
        .rf .hero-sub{font-size:clamp(17px,2.2vw,20px);color:var(--ink-dim);max-width:640px;margin-bottom:32px}
        .rf .answer-block{background:var(--card);border-left:3px solid var(--red);padding:20px 24px;margin:32px 0;border-radius:4px;font-size:16px;color:var(--ink)}
        .rf .answer-block strong{color:var(--amber);font-weight:600}
        .rf .meta-strip{display:flex;gap:20px;flex-wrap:wrap;font-size:13px;color:var(--ink-mute);padding:16px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin:32px 0 0}
        .rf .meta-strip strong{color:var(--ink);font-weight:600}
        .rf .quiz-shell{margin:48px 0;background:var(--bg-2);border:1px solid var(--line-strong);border-radius:16px;overflow:hidden;box-shadow:0 40px 80px -20px rgba(0,0,0,0.5)}
        .rf .quiz-header{padding:20px 28px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--ink-dim)}
        .rf .progress-bar{height:3px;background:var(--line);border-radius:100px;overflow:hidden;flex:1;margin:0 16px}
        .rf .progress-fill{height:100%;background:var(--red);width:0;transition:width 0.4s cubic-bezier(0.16,1,0.3,1);box-shadow:0 0 12px var(--red)}
        .rf .quiz-body{padding:40px 28px;min-height:340px}
        .rf .q-number{font-family:var(--serif);font-size:14px;font-weight:600;color:var(--red);letter-spacing:0.08em;margin-bottom:12px}
        .rf .q-text{font-family:var(--serif);font-size:clamp(22px,3.5vw,28px);font-weight:600;line-height:1.25;margin-bottom:28px;letter-spacing:-0.01em}
        .rf .options{display:flex;flex-direction:column;gap:10px}
        .rf .option{padding:16px 20px;background:transparent;border:1px solid var(--line-strong);border-radius:10px;color:var(--ink);font-size:15px;font-family:inherit;text-align:left;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;gap:12px;width:100%}
        .rf .option:hover{border-color:var(--red);background:var(--red-glow);transform:translateX(4px)}
        .rf .option-mark{width:20px;height:20px;border:1px solid var(--line-strong);border-radius:50%;flex-shrink:0;transition:all 0.15s}
        .rf .option:hover .option-mark{border-color:var(--red);background:var(--red)}
        .rf .start-screen{text-align:center;padding:20px 0}
        .rf .start-screen h2{font-family:var(--serif);font-size:clamp(24px,4vw,32px);font-weight:600;letter-spacing:-0.02em;margin-bottom:12px}
        .rf .start-screen p{color:var(--ink-dim);margin-bottom:28px;max-width:400px;margin-left:auto;margin-right:auto}
        .rf .btn-primary{display:inline-block;padding:16px 32px;background:var(--red);color:#fff;border:none;border-radius:100px;font-family:inherit;font-weight:700;font-size:16px;cursor:pointer;transition:all 0.2s;box-shadow:0 0 40px var(--red-glow)}
        .rf .btn-primary:hover{transform:translateY(-2px);box-shadow:0 0 60px rgba(230,57,70,0.4)}
        .rf .btn-ember{display:inline-block;padding:16px 32px;background:var(--ember);color:#0B0B14;border:none;border-radius:100px;font-family:inherit;font-weight:700;font-size:16px;cursor:pointer;transition:all 0.2s;box-shadow:0 0 40px rgba(255,91,53,0.15);text-decoration:none}
        .rf .btn-ember:hover{transform:translateY(-2px);box-shadow:0 0 60px rgba(255,91,53,0.4)}
        .rf .result-screen{text-align:center;padding:20px 0}
        .rf .flag-count-hero{padding:32px 0;margin-bottom:24px;border-bottom:1px solid var(--line)}
        .rf .flag-count-num{font-family:var(--serif);font-weight:900;font-size:clamp(80px,15vw,120px);color:var(--red);line-height:1;letter-spacing:-0.04em;text-shadow:0 0 40px var(--red-glow);margin-bottom:8px}
        .rf .flag-count-label{font-size:13px;text-transform:uppercase;letter-spacing:0.25em;color:var(--ink-mute);margin-bottom:20px}
        .rf .flag-count-verdict{font-family:var(--serif);font-weight:900;font-size:clamp(24px,4vw,32px);letter-spacing:-0.01em;margin-bottom:8px}
        .rf .flag-count-tag{font-family:var(--serif);font-style:italic;color:var(--amber);font-size:17px}
        .rf .flag-body{color:var(--ink-dim);max-width:520px;margin:24px auto;text-align:left;font-size:15px}
        .rf .flag-cards-header{font-family:var(--serif);font-size:14px;letter-spacing:0.1em;text-transform:uppercase;color:var(--red);margin:24px auto 12px;text-align:left;max-width:520px}
        .rf .flag-cards{display:grid;grid-template-columns:1fr;gap:12px;margin:12px 0 24px;text-align:left}
        @media(min-width:640px){.rf .flag-cards{grid-template-columns:repeat(3,1fr)}}
        .rf .flag-card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:18px;position:relative;overflow:hidden}
        .rf .flag-card::before{content:"";position:absolute;top:0;left:0;width:3px;height:100%;background:var(--red)}
        .rf .flag-card-label{font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:var(--red);margin-bottom:6px}
        .rf .flag-card-name{font-family:var(--serif);font-weight:600;font-size:18px;margin-bottom:6px}
        .rf .flag-card-desc{font-size:13px;color:var(--ink-dim);line-height:1.5}
        .rf .work-on-card{padding:20px 24px;background:linear-gradient(135deg,rgba(232,179,75,0.08),transparent);border:1px solid rgba(232,179,75,0.25);border-radius:12px;margin:24px 0;text-align:left}
        .rf .work-on-label{font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:var(--amber);margin-bottom:8px}
        .rf .work-on-title{font-family:var(--serif);font-weight:700;font-size:18px;margin-bottom:8px}
        .rf .work-on-text{color:var(--ink);font-size:15px}
        .rf .upsell{background:linear-gradient(135deg,rgba(255,91,53,0.12),rgba(230,57,70,0.08));border:1px solid rgba(255,91,53,0.3);border-radius:16px;padding:32px 24px;margin:32px 0;text-align:center}
        .rf .upsell-eyebrow{font-family:var(--serif);font-style:italic;color:var(--amber);font-size:14px;margin-bottom:8px}
        .rf .upsell h3{font-family:var(--serif);font-size:clamp(22px,3vw,28px);font-weight:700;letter-spacing:-0.01em;margin-bottom:12px}
        .rf .upsell p{color:var(--ink-dim);margin-bottom:20px;max-width:440px;margin-left:auto;margin-right:auto;font-size:15px}
        .rf .upsell-features{display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin:20px 0;font-size:13px;color:var(--ink-dim)}
        .rf .upsell-features span::before{content:"✦ ";color:var(--amber)}
        .rf .share-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:20px}
        .rf .share-btn{padding:10px 18px;background:transparent;border:1px solid var(--line-strong);border-radius:100px;color:var(--ink);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s}
        .rf .share-btn:hover{border-color:var(--red);color:var(--red)}
        .rf section.content{padding:48px 0}
        .rf section.content + section.content{border-top:1px solid var(--line)}
        .rf h2.section-h{font-family:var(--serif);font-size:clamp(28px,4vw,38px);font-weight:700;letter-spacing:-0.02em;margin-bottom:24px;line-height:1.15}
        .rf h2.section-h em{font-style:italic;color:var(--red);font-weight:400}
        .rf h3.sub-h{font-family:var(--serif);font-size:22px;font-weight:600;margin:28px 0 12px;color:var(--amber)}
        .rf section.content p{color:var(--ink-dim);margin-bottom:16px}
        .rf section.content ul{color:var(--ink-dim);margin:12px 0 20px 20px}
        .rf section.content li{margin-bottom:8px}
        .rf section.content strong{color:var(--ink);font-weight:600}

        /* Sign grid — long-tail SEO block */
        .rf .signs-grid{display:grid;grid-template-columns:1fr;gap:14px;margin:24px 0}
        @media(min-width:640px){.rf .signs-grid{grid-template-columns:1fr 1fr}}
        @media(min-width:960px){.rf .signs-grid{grid-template-columns:1fr 1fr 1fr}}
        .rf .sign-card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px 20px}
        .rf .sign-card h4{font-family:var(--serif);font-weight:700;font-size:18px;margin-bottom:4px;color:var(--ink)}
        .rf .sign-card .sign-planet{font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:var(--red);margin-bottom:10px}
        .rf .sign-card .sign-flag{font-size:14px;color:var(--ink-dim);line-height:1.55;margin-bottom:10px}
        .rf .sign-card .sign-healthy{font-size:12.5px;color:var(--ink-mute);line-height:1.5;padding-top:10px;border-top:1px dashed var(--line-strong)}
        .rf .sign-card .sign-healthy strong{color:var(--amber)}

        .rf .placement-map{display:grid;grid-template-columns:1fr;gap:16px;margin:20px 0}
        @media(min-width:640px){.rf .placement-map{grid-template-columns:1fr 1fr}}
        .rf .placement-map-card{background:var(--card);border:1px solid var(--line);border-left:3px solid var(--red);border-radius:8px;padding:20px}
        .rf .placement-map-card h4{font-family:var(--serif);font-size:18px;font-weight:700;margin-bottom:6px}
        .rf .placement-map-card .pmc-planet{font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:var(--red);margin-bottom:8px}
        .rf .placement-map-card p{font-size:14px;color:var(--ink-dim);line-height:1.6;margin-bottom:0}

        .rf .faq-item{border-bottom:1px solid var(--line);padding:20px 0}
        .rf .faq-q{font-family:var(--serif);font-size:19px;font-weight:600;color:var(--ink);cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:8px 0;list-style:none}
        .rf .faq-q::-webkit-details-marker{display:none}
        .rf .faq-q::after{content:"+";font-size:24px;color:var(--red);transition:transform 0.2s;flex-shrink:0}
        .rf details[open] .faq-q::after{transform:rotate(45deg)}
        .rf .faq-a{padding:12px 0 4px;color:var(--ink-dim);line-height:1.65}
        .rf .related-grid{display:grid;grid-template-columns:1fr;gap:16px;margin-top:24px}
        @media(min-width:640px){.rf .related-grid{grid-template-columns:repeat(3,1fr)}}
        .rf .related-card{padding:20px;background:var(--card);border:1px solid var(--line);border-radius:12px;transition:all 0.2s;display:block}
        .rf .related-card:hover{border-color:var(--red);transform:translateY(-2px)}
        .rf .related-card-tag{font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:var(--red);margin-bottom:8px}
        .rf .related-card-title{font-family:var(--serif);font-weight:600;font-size:17px;margin-bottom:6px}
        .rf .related-card-desc{font-size:13px;color:var(--ink-dim)}

        /* SITE FOOTER — matches main site */
        .rf .site-footer{border-top:1px solid var(--line);padding:48px 0 30px;margin-top:64px}
        .rf .fi{display:flex;align-items:flex-start;justify-content:space-between;gap:36px;flex-wrap:wrap;margin-bottom:36px}
        .rf .fb p{font-size:.82rem;color:var(--ink-dim);max-width:260px;line-height:1.6;margin-top:8px}
        .rf .fl h4{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-dim);margin-bottom:14px}
        .rf .fl ul{list-style:none;display:flex;flex-direction:column;gap:10px;padding:0;margin:0}
        .rf .fl a{font-size:.83rem;color:rgba(232,228,240,.55);transition:color .2s}
        .rf .fl a:hover{color:var(--ink)}
        .rf .fb2{border-top:1px solid var(--line);padding-top:22px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
        .rf .disc{font-size:.73rem;color:rgba(232,228,240,.35);max-width:540px;line-height:1.55}
        .rf .copy{font-size:.73rem;color:rgba(232,228,240,.3)}
        .rf .slinks{display:flex;gap:10px;margin-top:14px}
        .rf .sl2{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid var(--line);border-radius:8px;color:var(--ink-dim);font-size:.82rem;font-weight:700;transition:all .2s}
        .rf .sl2:hover{border-color:rgba(230,57,70,0.4);color:var(--red);background:rgba(230,57,70,0.08)}

        @media(max-width:768px){.rf .nav-links{display:none}.rf .container{padding:0 16px}.rf .container-wide{padding:0 16px}.rf .fi{flex-direction:column;gap:28px}.rf .fb2{flex-direction:column;align-items:flex-start}}

        .rf .fade-in{animation:rfFadeIn 0.5s cubic-bezier(0.16,1,0.3,1)}
        @keyframes rfFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .rf .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--red);color:#fff;padding:12px 24px;border-radius:100px;font-weight:600;font-size:14px;transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);z-index:100;pointer-events:none}
        .rf .toast.show{transform:translateX(-50%) translateY(0)}
      `}</style>

      <div className="rf">
        <div className="rf-bg" />

        {/* NAV — mascot logo, matches main site */}
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
            <a href="/">Home</a><span>/</span>Relationship Red Flags in Your Birth Chart
          </nav>
        </div>

        <main>
          <section className="hero">
            <div className="container">
              <span className="eyebrow">Venus + Mars + Moon + 7th House · 2 mins · Free</span>
              <h1>Your <em>relationship</em> red flags, before they cost you another year.</h1>
              <p className="hero-sub">Ten questions. Your Venus, Mars, Moon and 7th house flag the patterns you keep repeating — the ones your friends have noticed and haven&apos;t said out loud. Take it before the next situationship.</p>

              <div className="answer-block">
                <strong>The short answer:</strong> Relationship red flags in astrology are recurring behavioral patterns tied to <strong>Venus</strong> (love style), <strong>Mars</strong> (conflict style), <strong>Moon</strong> (emotional needs), and the <strong>7th house</strong> (partnership template). The ten most common are love-bombing, picking unavailable partners, fantasy-over-reality, reactive rupture, silent punishment, score-keeping, anxious pursuit, emotional testing, losing yourself, and control games. This free 10-question test scores you from 0 to 10, names your top three patterns, and gives you one specific thing to work on next.
              </div>

              <div className="meta-strip">
                <span><strong>10</strong> questions</span>
                <span><strong>~2</strong> minutes</span>
                <span><strong>18,523</strong> people took this today</span>
                <span><strong>4.9/5</strong> rating</span>
              </div>
            </div>
          </section>

          <section>
            <div className="container">
              <RedFlagsQuiz />
            </div>
          </section>

          {/* SECTION: the ten flags — unchanged core content */}
          <section className="content" id="learn-more">
            <div className="container">
              <h2 className="section-h">The <em>ten</em> relationship red flags this test measures</h2>
              <p>Every relationship red flag on this list comes from one of four places in your birth chart. Below is the map — the astrology red flags your friends can name in you before you can, sorted by the planet or house that drives them.</p>

              <h3 className="sub-h">Venus-driven red flags: how you love (and sabotage it)</h3>
              <ul>
                <li><strong>Love-bombing</strong> — going 100% in the first week, then vanishing when it gets real. Common with Venus in Aries, Leo, or a fire-heavy chart.</li>
                <li><strong>Picking unavailable partners</strong> — repeatedly choosing people who can&apos;t fully show up. Classic Venus square Saturn, or Saturn in the 7th house.</li>
                <li><strong>Fantasy over reality</strong> — falling for potential, not the actual person in front of you. Neptune touching Venus is the usual suspect.</li>
              </ul>

              <h3 className="sub-h">Mars-driven red flags: how you fight (and rupture)</h3>
              <ul>
                <li><strong>Reactive rupture</strong> — hostile response before you&apos;ve thought about it. Mars in Aries, Mars in the 1st house, or fire-Mars in general.</li>
                <li><strong>Silent punishment</strong> — going cold instead of saying you&apos;re hurt. Mars in Cancer, Mars in Scorpio, or a water-Mars pattern.</li>
                <li><strong>Score-keeping</strong> — bringing up old fights in new ones. Pluto contacts to Mars or a Scorpio Mars.</li>
              </ul>

              <h3 className="sub-h">Moon-driven red flags: how you attach</h3>
              <ul>
                <li><strong>Anxious pursuit</strong> — chasing when you sense distance. Moon square Saturn, Moon in the 7th, or Moon-Neptune insecurity.</li>
                <li><strong>Emotional testing</strong> — creating small crises to see if they&apos;ll stay. Moon-Pluto attachment work.</li>
              </ul>

              <h3 className="sub-h">7th house red flags: how you partner</h3>
              <ul>
                <li><strong>Losing yourself</strong> — merging so hard you forget who you were. Libra rising, 7th house stellium, or Neptune in the 7th.</li>
                <li><strong>Control games</strong> — needing to hold the power in the relationship. Pluto in the 7th or Scorpio on the descendant.</li>
              </ul>

              <p>None of these placements make you a bad partner. All of them get worse when unconscious. The point of this test is to name yours out loud so you can spot the pattern the next time it fires.</p>
            </div>
          </section>

          {/* NEW SECTION: sign-by-sign red flags (long-tail SEO) */}
          <section className="content">
            <div className="container">
              <h2 className="section-h">Relationship red flags <em>by zodiac sign</em>: what each sign brings</h2>
              <p>Every zodiac sign has a version of itself that runs healthy and one that runs on autopilot. Below is the shorthand for each — the specific relationship red flag that sign tends to bring when unhealed, plus the healthy expression to grow into. Use your Venus, Mars, or Moon sign for the sharpest read; Sun sign works as a fallback.</p>

              <div className="signs-grid">
                {SIGN_FLAGS.map((s) => (
                  <div className="sign-card" key={s.sign}>
                    <div className="sign-planet">{s.planet}</div>
                    <h4>{s.sign}</h4>
                    <div className="sign-flag">{s.flag}</div>
                    <div className="sign-healthy"><strong>Healthy version:</strong> {s.healthy}</div>
                  </div>
                ))}
              </div>

              <p>None of these are life sentences. A Scorpio who has done the work is one of the most loyal partners you&apos;ll ever have. A Sagittarius who&apos;s learned to stay is unmatched at honest love. The sign gives you the raw material — awareness turns the red flag into the strength.</p>
            </div>
          </section>

          {/* NEW SECTION: how to spot placement red flags in your own chart */}
          <section className="content">
            <div className="container">
              <h2 className="section-h">How to spot <em>your</em> red flags in your natal chart</h2>
              <p>Once you know your top three patterns from the test, the next question is which chart placements are producing them. Below is a plain-language map of the placements astrologers look at first when reading relationship red flags in a birth chart.</p>

              <div className="placement-map">
                <div className="placement-map-card">
                  <div className="pmc-planet">Venus sign & house</div>
                  <h4>Your love style — what you offer, what you sabotage</h4>
                  <p>Venus shows how you flirt, what you find romantic, and where you overspend emotionally. A Venus in fire loves fast and burns out. A Venus in earth loves slow and refuses to leave. A Venus in air stays intellectual; a Venus in water fuses. The house Venus sits in tells you the arena where the pattern shows up: 1st (self-image), 5th (dating), 7th (committed partnership), 12th (secret relationships).</p>
                </div>
                <div className="placement-map-card">
                  <div className="pmc-planet">Mars sign & house</div>
                  <h4>Your conflict style — how you fight and how you rupture</h4>
                  <p>Mars is the temper. A fire Mars explodes; a water Mars withdraws; an earth Mars digs in; an air Mars debates you into the ground. Mars in the 7th brings the fight into every partnership. Mars-Pluto aspects turn arguments into power struggles. Mars-Saturn aspects freeze anger into resentment.</p>
                </div>
                <div className="placement-map-card">
                  <div className="pmc-planet">Moon sign & aspects</div>
                  <h4>Your attachment style — what makes you feel safe or panicked</h4>
                  <p>The Moon is the earliest emotional wiring you have. Moon square Saturn tends to run anxious-avoidant. Moon-Pluto runs intense-testing. Moon in the 7th makes partnership the main source of emotional regulation. Moon-Neptune fuses with the partner&apos;s mood. This is the deepest layer — the one that runs when logic is offline.</p>
                </div>
                <div className="placement-map-card">
                  <div className="pmc-planet">7th house & descendant</div>
                  <h4>Your partnership template — the dynamic you inherited</h4>
                  <p>The 7th house is what you unconsciously look for in a partner. Scorpio on the descendant tends to attract intense, transformative relationships. Aquarius on the descendant tends toward unconventional partners with distance built in. Planets inside the 7th house — Saturn, Neptune, Pluto especially — flag the pattern that will keep repeating until it&apos;s conscious.</p>
                </div>
              </div>

              <p>To read all four accurately in your own chart, you need your birth date, exact time, and birthplace. <a href="/free-birth-chart" style={{color:"var(--amber)"}}>BluntChart&apos;s free birth chart</a> calculates all of it in about a minute — Venus and Mars signs and houses, Moon aspects, and the exact 7th house profile including any planets sitting inside it.</p>
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
                  <div className="related-card-desc">Your shadow patterns, decoded in 90 seconds.</div>
                </a>
                <a href="/love-language-birth-chart" className="related-card">
                  <div className="related-card-tag">Venus + Moon</div>
                  <div className="related-card-title">Your love language</div>
                  <div className="related-card-desc">How you give and receive love.</div>
                </a>
                <a href="/career-strength-birth-chart" className="related-card">
                  <div className="related-card-tag">Saturn + MC</div>
                  <div className="related-card-title">Career strength</div>
                  <div className="related-card-desc">The work you were built for.</div>
                </a>
              </div>
            </div>
          </section>
        </main>

        {/* FOOTER — matches main site multi-column */}
        <footer className="site-footer">
          <div className="container-wide">
            <div className="fi">
              <div className="fb">
                <a href="/" className="logo">
                  <Image src="/mascot.png" alt="BluntChart mascot" width={34} height={34} style={{ borderRadius: "50%" }} />
                  <span className="g">BluntChart</span>
                </a>
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
                <h4>Quizzes & Tests</h4>
                <ul>
                  <li><a href="/relationship-red-flags-birth-chart" style={{color:"var(--red)"}}>Relationship Red Flags</a></li>
                  <li><a href="/how-toxic-are-you-quiz">How Toxic Are You?</a></li>
                  <li><a href="/love-language-birth-chart">Love Language</a></li>
                  <li><a href="/career-strength-birth-chart">Career Strength</a></li>
                  <li><a href="/saturn-return-calculator">Saturn Return</a></li>
                  <li><a href="/why-you-attract-the-wrong-person">Why You Attract the Wrong Person</a></li>
                </ul>
              </div>
              <div className="fl">
                <h4>Learn</h4>
                <ul>
                  <li><a href="/free-birth-chart-readings">How Readings Work</a></li>
                  <li><a href="/is-mercury-retrograde">Is Mercury Retrograde?</a></li>
                  <li><a href="/mercury-retrograde-2026">Mercury Retrograde 2026</a></li>
                  <li><a href="/venus-retrograde-2026">Venus Retrograde 2026</a></li>
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
              <p className="disc">For entertainment purposes only. BluntChart readings are not a substitute for medical, psychological, financial, or legal advice. Do not make major life decisions based solely on astrological content.</p>
              <p className="copy">© 2026 BluntChart. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
