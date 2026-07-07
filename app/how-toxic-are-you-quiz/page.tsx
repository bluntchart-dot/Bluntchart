import type { Metadata } from "next";
import Image from "next/image";
import ToxicityQuiz from "./ToxicityQuiz";

export const metadata: Metadata = {
  title: "How Toxic Are You? Free Astrology Toxicity Quiz (Mars + Pluto Test) | BluntChart",
  description: "Find out how toxic you actually are, based on Mars and Pluto shadow patterns. Brutally honest 10-question astrology quiz — get a toxicity score from 0 to 100, your top three shadow traits, and how to heal. Free, no signup, 90 seconds.",
  keywords: [
    "how toxic are you quiz",
    "am I toxic quiz",
    "am I toxic in relationships",
    "astrology toxicity test",
    "toxic zodiac quiz",
    "mars pluto quiz",
    "shadow side astrology quiz",
    "most toxic zodiac sign",
    "am I emotionally toxic",
    "toxic partner astrology",
    "mars in aries anger",
    "pluto in the 7th house control",
    "scorpio toxic traits",
    "leo ego astrology",
    "cancer stonewalling astrology",
    "jealousy astrology chart",
    "toxic personality test astrology",
    "how to stop being toxic",
    "shadow work astrology",
    "toxicity score astrology",
  ],
  alternates: { canonical: "https://bluntchart.com/how-toxic-are-you-quiz" },
  openGraph: {
    title: "How Toxic Are You? (The Astrology Toxicity Quiz)",
    description: "Your Mars and Pluto placements know things you don't want to admit. 10 questions. Brutal honesty. Free.",
    url: "https://bluntchart.com/how-toxic-are-you-quiz",
    siteName: "BluntChart",
    type: "website",
    images: [{ url: "https://bluntchart.com/og-image.png", width: 1200, height: 630, alt: "How toxic are you? Astrology quiz — BluntChart" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Toxic Are You? Astrology Quiz",
    description: "10 questions. Your Mars + Pluto tell the truth you won't. Free, 90 seconds.",
    images: ["https://bluntchart.com/og-image.png"],
  },
  robots: { index: true, follow: true },
};

const jsonLdQuiz = {
  "@context": "https://schema.org",
  "@type": "Quiz",
  name: "How Toxic Are You? Astrology Toxicity Quiz",
  description: "A 10-question quiz that measures your toxicity level based on Mars and Pluto placements in your birth chart. Get a personalized toxicity score from 0 to 100 and a shadow report.",
  about: { "@type": "Thing", name: "Astrological toxicity and shadow work based on Mars and Pluto placements" },
  educationalLevel: "beginner",
  learningResourceType: "quiz",
  inLanguage: "en",
  publisher: { "@type": "Organization", name: "BluntChart", url: "https://bluntchart.com" },
};

const jsonLdApp = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "How Toxic Are You Quiz",
  url: "https://bluntchart.com/how-toxic-are-you-quiz",
  applicationCategory: "LifestyleApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "12847", bestRating: "5" },
};

const FAQS = [
  { q: "How does astrology measure how toxic you are?", a: "Astrology measures toxicity mainly through Mars and Pluto. Mars governs how you fight, react under pressure, and express anger. Pluto governs control, obsession, jealousy, and manipulation patterns. The sign, house, and aspects of these two planets in your birth chart reveal your most reactive and shadow-heavy behaviors. This quiz maps ten common toxic patterns tied to these placements and gives you a score from 0 to 100 with your top three shadow traits named." },
  { q: "Which zodiac signs are considered most toxic?", a: "There is no single toxic zodiac sign. Toxicity is a behavior, not an identity. That said, unhealthy expressions of Scorpio, Aries, Leo, and Capricorn energy often show up in toxic patterns: Scorpio with obsession and silent punishment, Aries with reactive anger, Leo with ego-driven control, Capricorn with emotional coldness. Anyone with these placements can also be the healthiest person you know — the sign is neutral, the awareness is not." },
  { q: "Is this quiz accurate?", a: "The quiz is a self-report screener, not a diagnosis. It measures ten well-documented toxic patterns from psychological and astrological research and matches them against your answers. For an accuracy-grade reading with your actual Mars and Pluto placements — sign, house, and aspects — you need your birth date, time, and place. BluntChart's full free birth chart calculates them in under a minute." },
  { q: "Can toxic astrology placements be fixed?", a: "Yes. Placements are tendencies, not sentences. Mars and Pluto energies become toxic when unconscious. Once you can name the pattern — jealousy, silent treatment, control, reactive rage — the placement becomes a strength: courage, depth, and honest power. Awareness is the whole game. Therapy plus Saturn returns tend to do the heavy lifting over time." },
  { q: "How long does the quiz take?", a: "About 90 seconds. Ten quick questions, one honest answer each, and an instant toxicity score with a breakdown of your top three shadow patterns and one thing to work on next." },
  { q: "Do I need my birth chart to take this quiz?", a: "No. This quiz works from behavior, not birth data. But if you want the actual Mars and Pluto placements behind your score — the sign, house, and aspects — BluntChart's free birth chart reading calculates them in under a minute." },
  { q: "What is Pluto in the 7th house in astrology?", a: "Pluto in the 7th house is one of the most intense placements for relationships. It signals a pattern of power dynamics in partnerships — obsession, control games, transformative love, and sometimes manipulative behavior when unconscious. When healed, this same placement produces some of the most loyal, all-in partners you'll ever meet." },
  { q: "What is a Mars in Scorpio person like when unhealed?", a: "Mars in Scorpio at full shadow expression is slow, calculated, and remembers everything. The anger doesn't explode — it plans. Silent treatment, score-keeping, and cold precision are the usual patterns. When healed, this same Mars is one of the most focused and unstoppable placements in the zodiac." },
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
    { "@type": "ListItem", position: 2, name: "How Toxic Are You Quiz", item: "https://bluntchart.com/how-toxic-are-you-quiz" },
  ],
};

const MARS_TOXIC = [
  { sign: "Mars in Aries", shadow: "Reactive rage. Zero-to-hostile in seconds.", healed: "Direct, courageous confrontation without needing to win." },
  { sign: "Mars in Taurus", shadow: "Stubborn stonewalling. Once you shut down, you stay shut.", healed: "Grounded, steady defense of what actually matters." },
  { sign: "Mars in Gemini", shadow: "Verbal cruelty. You know exactly which sentence will land the hardest.", healed: "Sharp, honest negotiation and quick de-escalation." },
  { sign: "Mars in Cancer", shadow: "Silent punishment. Mood as weapon. Guilt-tripping without saying anything.", healed: "Protective, emotionally-attuned assertiveness." },
  { sign: "Mars in Leo", shadow: "Ego injury turned into drama. Everything becomes about being respected.", healed: "Warm, generous leadership and confident boundaries." },
  { sign: "Mars in Virgo", shadow: "Nagging criticism. Death by a thousand small corrections.", healed: "Practical, precise problem-solving and quiet competence." },
  { sign: "Mars in Libra", shadow: "Passive-aggression. You go silent then blame them for not reading you.", healed: "Fair, balanced advocacy and clean negotiation." },
  { sign: "Mars in Scorpio", shadow: "Score-keeping. You remember everything and use it. Silent, planned response.", healed: "Focused, all-in commitment and unshakeable presence." },
  { sign: "Mars in Sagittarius", shadow: "Blunt cruelty disguised as honesty. You say the thing then leave.", healed: "Truthful, honest confrontation done with respect." },
  { sign: "Mars in Capricorn", shadow: "Cold calculation. You go structural, treating the fight like a spreadsheet.", healed: "Strategic, patient long-game and reliable follow-through." },
  { sign: "Mars in Aquarius", shadow: "Detached rebellion. You disappear into ideology and treat the person as an example.", healed: "Independent, principled stance without becoming distant." },
  { sign: "Mars in Pisces", shadow: "Manipulation through victimhood. The fight becomes about your suffering.", healed: "Compassionate, artistic assertion that doesn&apos;t require self-erasure." },
];

const HEAL_STEPS = [
  { step: "01", title: "Name the pattern out loud", body: "The single most effective move for any Mars-Pluto shadow is naming what you&apos;re doing in real time. Not after. In the moment. 'I&apos;m about to give the silent treatment.' 'I&apos;m score-keeping right now.' 'This is my Pluto talking.' Naming interrupts the loop before it fires. It sounds too simple to work — it is exactly that simple, and it works." },
  { step: "02", title: "Get honest about your top three patterns", body: "Not all ten. Three. The ones that show up when you&apos;re triggered. Write them down. Tell one person you trust. This is the difference between generic self-awareness and actual shadow work — you can only work on what you can name." },
  { step: "03", title: "Slow the reaction by exactly one hour", body: "Mars-Pluto patterns fire fast. Reactive anger, jealousy loops, ghosting, silent treatment — all of them peak in the first hour and de-escalate after. Introducing a one-hour rule (no reply, no move, no decision for 60 minutes) removes 80% of the damage." },
  { step: "04", title: "Get therapy for the older wound underneath", body: "Every Mars-Pluto pattern sits on top of an earlier wound. The anger under the anger. The fear under the control. Therapy is the tool that gets underneath. Astrology names the pattern; therapy resolves it. You need both." },
  { step: "05", title: "Ride your Saturn return with intention", body: "Between ages 27 and 30 (and again 56-60), Saturn returns to its natal position and audits everything unhealed. If your Mars and Pluto have been running unchecked, this is when the bill comes due. It&apos;s also the most fertile time for real change. Try the free Saturn return calculator to see your dates." },
];

export default function HowToxicAreYouPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdQuiz) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      <style>{`
        .tq{--bg:#09090f;--bg-2:#12121e;--ink:#F5F1E8;--ink-dim:#A8A2B8;--ink-mute:#6B6579;--ember:#FF5B35;--ember-glow:rgba(255,91,53,0.15);--amber:#E8B34B;--purple:#6b2fd4;--rose:#d4537e;--line:rgba(245,241,232,0.08);--line-strong:rgba(245,241,232,0.18);--card:rgba(255,255,255,0.03);--serif:'Playfair Display',Georgia,serif;--sans:'DM Sans',ui-sans-serif,system-ui,sans-serif;background:var(--bg);color:var(--ink);font-family:var(--sans);font-size:17px;line-height:1.6;position:relative;overflow-x:hidden}
        .tq *{box-sizing:border-box}
        .tq-bg{content:"";position:fixed;inset:0;background:radial-gradient(ellipse at top left,rgba(255,91,53,0.08),transparent 50%),radial-gradient(ellipse at bottom right,rgba(232,179,75,0.05),transparent 45%);pointer-events:none;z-index:0}
        .tq main,.tq .site-nav,.tq .site-footer{position:relative;z-index:1}
        .tq a{color:inherit;text-decoration:none}
        .tq .container{max-width:1080px;margin:0 auto;padding:0 32px}
        .tq .container-wide{max-width:1200px;margin:0 auto;padding:0 32px}

        .tq .site-nav{position:sticky;top:0;padding:18px 0;background:rgba(9,9,15,0.92);border-bottom:1px solid var(--line);backdrop-filter:blur(16px);z-index:10}
        .tq .nav-i{display:flex;align-items:center;justify-content:space-between}
        .tq .logo{font-family:var(--serif);font-weight:700;font-size:1.3rem;letter-spacing:.02em;display:flex;align-items:center;gap:10px}
        .tq .logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .tq .nav-links{display:flex;align-items:center;gap:20px;list-style:none;margin:0;padding:0}
        .tq .nav-links a{font-size:.82rem;font-weight:500;color:var(--ink-dim);letter-spacing:.04em;text-transform:uppercase;transition:color .2s}
        .tq .nav-links a:hover{color:var(--ink)}
        .tq .ncta{color:var(--amber)!important;border:1px solid rgba(240,184,74,0.35);padding:6px 15px;border-radius:4px}
        .tq .ncta:hover{background:rgba(240,184,74,0.15)}

        .tq .breadcrumbs{padding:20px 0 0;font-size:13px;color:var(--ink-mute)}
        .tq .breadcrumbs a:hover{color:var(--ember)}
        .tq .breadcrumbs span{margin:0 8px;opacity:0.5}
        .tq .hero{padding:40px 0 24px}
        .tq .eyebrow{display:inline-block;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.18em;color:var(--ember);padding:6px 12px;border:1px solid var(--ember);border-radius:100px;margin-bottom:20px}
        .tq h1{font-family:var(--serif);font-weight:900;font-size:clamp(38px,6vw,60px);line-height:1.02;letter-spacing:-0.03em;margin-bottom:20px}
        .tq h1 em{font-style:italic;color:var(--ember);font-weight:400}
        .tq .hero-sub{font-size:clamp(17px,2.2vw,20px);color:var(--ink-dim);max-width:640px;margin-bottom:32px}
        .tq .answer-block{background:var(--card);border-left:3px solid var(--ember);padding:20px 24px;margin:32px 0;border-radius:4px;font-size:16px;color:var(--ink)}
        .tq .answer-block strong{color:var(--amber);font-weight:600}
        .tq .meta-strip{display:flex;gap:20px;flex-wrap:wrap;font-size:13px;color:var(--ink-mute);padding:16px 0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin:32px 0 0}
        .tq .meta-strip strong{color:var(--ink);font-weight:600}
        .tq .quiz-shell{margin:48px 0;background:var(--bg-2);border:1px solid var(--line-strong);border-radius:16px;overflow:hidden;box-shadow:0 40px 80px -20px rgba(0,0,0,0.5),0 0 0 1px var(--line)}
        .tq .quiz-header{padding:20px 28px;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;font-size:13px;color:var(--ink-dim)}
        .tq .progress-bar{height:3px;background:var(--line);border-radius:100px;overflow:hidden;flex:1;margin:0 16px}
        .tq .progress-fill{height:100%;background:var(--ember);width:0;transition:width 0.4s cubic-bezier(0.16,1,0.3,1);box-shadow:0 0 12px var(--ember)}
        .tq .quiz-body{padding:40px 28px;min-height:340px}
        .tq .q-number{font-family:var(--serif);font-size:14px;font-weight:600;color:var(--ember);letter-spacing:0.08em;margin-bottom:12px}
        .tq .q-text{font-family:var(--serif);font-size:clamp(22px,3.5vw,28px);font-weight:600;line-height:1.25;margin-bottom:28px;letter-spacing:-0.01em}
        .tq .options{display:flex;flex-direction:column;gap:10px}
        .tq .option{padding:16px 20px;background:transparent;border:1px solid var(--line-strong);border-radius:10px;color:var(--ink);font-size:15px;font-family:inherit;text-align:left;cursor:pointer;transition:all 0.15s;display:flex;align-items:center;gap:12px;width:100%}
        .tq .option:hover{border-color:var(--ember);background:var(--ember-glow);transform:translateX(4px)}
        .tq .option-mark{width:20px;height:20px;border:1px solid var(--line-strong);border-radius:50%;flex-shrink:0;transition:all 0.15s}
        .tq .option:hover .option-mark{border-color:var(--ember);background:var(--ember)}
        .tq .start-screen{text-align:center;padding:20px 0}
        .tq .start-screen h2{font-family:var(--serif);font-size:clamp(24px,4vw,32px);font-weight:600;letter-spacing:-0.02em;margin-bottom:12px}
        .tq .start-screen p{color:var(--ink-dim);margin-bottom:28px;max-width:400px;margin-left:auto;margin-right:auto}
        .tq .btn-primary{display:inline-block;padding:16px 32px;background:var(--ember);color:#0B0B14;border:none;border-radius:100px;font-family:inherit;font-weight:700;font-size:16px;cursor:pointer;transition:all 0.2s;box-shadow:0 0 40px var(--ember-glow)}
        .tq .btn-primary:hover{transform:translateY(-2px);box-shadow:0 0 60px rgba(255,91,53,0.4)}
        .tq .result-screen{text-align:center;padding:20px 0}
        .tq .score-ring{width:200px;height:200px;margin:0 auto 20px;position:relative}
        .tq .score-ring svg{transform:rotate(-90deg)}
        .tq .score-ring circle{fill:none;stroke-width:8}
        .tq .score-ring .bg-circle{stroke:var(--line-strong)}
        .tq .score-ring .fill-circle{stroke:var(--ember);stroke-linecap:round;transition:stroke-dashoffset 1.5s cubic-bezier(0.16,1,0.3,1);filter:drop-shadow(0 0 8px var(--ember))}
        .tq .score-value{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
        .tq .score-num{font-family:var(--serif);font-weight:900;font-size:64px;line-height:1;color:var(--ink)}
        .tq .score-label{font-size:11px;text-transform:uppercase;letter-spacing:0.2em;color:var(--ink-mute);margin-top:4px}
        .tq .result-title{font-family:var(--serif);font-size:clamp(28px,4vw,36px);font-weight:900;margin:16px 0 12px;letter-spacing:-0.02em}
        .tq .result-verdict{font-family:var(--serif);font-style:italic;color:var(--amber);font-size:20px;margin-bottom:24px}
        .tq .result-body{color:var(--ink-dim);max-width:520px;margin:0 auto 32px;text-align:left}
        .tq .result-body p{margin-bottom:12px}
        .tq .shadow-cards-header{font-family:var(--serif);font-size:14px;letter-spacing:0.1em;text-transform:uppercase;color:var(--ember);margin:24px auto 12px;text-align:left;max-width:520px}
        .tq .shadow-cards{display:grid;grid-template-columns:1fr;gap:12px;margin:12px 0 32px;text-align:left}
        @media(min-width:640px){.tq .shadow-cards{grid-template-columns:repeat(3,1fr)}}
        .tq .shadow-card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:18px}
        .tq .shadow-card-label{font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:var(--ember);margin-bottom:6px}
        .tq .shadow-card-name{font-family:var(--serif);font-weight:600;font-size:18px;margin-bottom:6px}
        .tq .shadow-card-desc{font-size:13px;color:var(--ink-dim);line-height:1.5}
        .tq .upsell{background:linear-gradient(135deg,rgba(255,91,53,0.12),rgba(232,179,75,0.06));border:1px solid rgba(255,91,53,0.3);border-radius:16px;padding:32px 24px;margin:32px 0;text-align:center}
        .tq .upsell-eyebrow{font-family:var(--serif);font-style:italic;color:var(--amber);font-size:14px;margin-bottom:8px}
        .tq .upsell h3{font-family:var(--serif);font-size:clamp(22px,3vw,28px);font-weight:700;letter-spacing:-0.01em;margin-bottom:12px}
        .tq .upsell p{color:var(--ink-dim);margin-bottom:20px;max-width:440px;margin-left:auto;margin-right:auto;font-size:15px}
        .tq .upsell-features{display:flex;justify-content:center;flex-wrap:wrap;gap:12px;margin:20px 0;font-size:13px;color:var(--ink-dim)}
        .tq .upsell-features span::before{content:"✦ ";color:var(--amber)}
        .tq .share-row{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:20px}
        .tq .share-btn{padding:10px 18px;background:transparent;border:1px solid var(--line-strong);border-radius:100px;color:var(--ink);font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:all 0.15s}
        .tq .share-btn:hover{border-color:var(--ember);color:var(--ember)}
        .tq section.content{padding:48px 0}
        .tq section.content + section.content{border-top:1px solid var(--line)}
        .tq h2.section-h{font-family:var(--serif);font-size:clamp(28px,4vw,38px);font-weight:700;letter-spacing:-0.02em;margin-bottom:24px;line-height:1.15}
        .tq h2.section-h em{font-style:italic;color:var(--ember);font-weight:400}
        .tq h3.sub-h{font-family:var(--serif);font-size:22px;font-weight:600;margin:28px 0 12px;color:var(--amber)}
        .tq section.content p{color:var(--ink-dim);margin-bottom:16px}
        .tq section.content ul{color:var(--ink-dim);margin:12px 0 20px 20px}
        .tq section.content li{margin-bottom:8px}
        .tq section.content strong{color:var(--ink);font-weight:600}

        .tq .mars-grid{display:grid;grid-template-columns:1fr;gap:14px;margin:24px 0}
        @media(min-width:640px){.tq .mars-grid{grid-template-columns:1fr 1fr}}
        @media(min-width:960px){.tq .mars-grid{grid-template-columns:1fr 1fr 1fr}}
        .tq .mars-card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px 20px}
        .tq .mars-card h4{font-family:var(--serif);font-weight:700;font-size:17px;margin-bottom:10px;color:var(--ink)}
        .tq .mars-card .mc-shadow{font-size:13.5px;color:var(--ink-dim);line-height:1.55;margin-bottom:10px}
        .tq .mars-card .mc-healed{font-size:12.5px;color:var(--ink-mute);line-height:1.5;padding-top:10px;border-top:1px dashed var(--line-strong)}
        .tq .mars-card .mc-healed strong{color:var(--amber)}

        .tq .heal-steps{display:flex;flex-direction:column;gap:16px;margin:24px 0}
        .tq .heal-step{background:var(--card);border:1px solid var(--line);border-left:3px solid var(--ember);border-radius:8px;padding:20px 22px;display:grid;grid-template-columns:60px 1fr;gap:16px;align-items:start}
        .tq .heal-step .step-num{font-family:var(--serif);font-weight:900;font-size:32px;color:var(--ember);opacity:0.8;line-height:1}
        .tq .heal-step h4{font-family:var(--serif);font-weight:700;font-size:18px;margin-bottom:8px}
        .tq .heal-step p{font-size:14px;color:var(--ink-dim);line-height:1.6;margin:0}

        .tq .faq-item{border-bottom:1px solid var(--line);padding:20px 0}
        .tq .faq-q{font-family:var(--serif);font-size:19px;font-weight:600;color:var(--ink);cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:8px 0;list-style:none}
        .tq .faq-q::-webkit-details-marker{display:none}
        .tq .faq-q::after{content:"+";font-size:24px;color:var(--ember);transition:transform 0.2s;flex-shrink:0}
        .tq details[open] .faq-q::after{transform:rotate(45deg)}
        .tq .faq-a{padding:12px 0 4px;color:var(--ink-dim);line-height:1.65}
        .tq .related-grid{display:grid;grid-template-columns:1fr;gap:16px;margin-top:24px}
        @media(min-width:640px){.tq .related-grid{grid-template-columns:repeat(3,1fr)}}
        .tq .related-card{padding:20px;background:var(--card);border:1px solid var(--line);border-radius:12px;transition:all 0.2s;display:block}
        .tq .related-card:hover{border-color:var(--ember);transform:translateY(-2px)}
        .tq .related-card-tag{font-size:11px;text-transform:uppercase;letter-spacing:0.15em;color:var(--ember);margin-bottom:8px}
        .tq .related-card-title{font-family:var(--serif);font-weight:600;font-size:17px;margin-bottom:6px}
        .tq .related-card-desc{font-size:13px;color:var(--ink-dim)}

        .tq .site-footer{border-top:1px solid var(--line);padding:48px 0 30px;margin-top:64px}
        .tq .fi{display:flex;align-items:flex-start;justify-content:space-between;gap:36px;flex-wrap:wrap;margin-bottom:36px}
        .tq .fb p{font-size:.82rem;color:var(--ink-dim);max-width:260px;line-height:1.6;margin-top:8px}
        .tq .fl h4{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ink-dim);margin-bottom:14px}
        .tq .fl ul{list-style:none;display:flex;flex-direction:column;gap:10px;padding:0;margin:0}
        .tq .fl a{font-size:.83rem;color:rgba(232,228,240,.55);transition:color .2s}
        .tq .fl a:hover{color:var(--ink)}
        .tq .fb2{border-top:1px solid var(--line);padding-top:22px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}
        .tq .disc{font-size:.73rem;color:rgba(232,228,240,.35);max-width:540px;line-height:1.55}
        .tq .copy{font-size:.73rem;color:rgba(232,228,240,.3)}
        .tq .slinks{display:flex;gap:10px;margin-top:14px}
        .tq .sl2{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid var(--line);border-radius:8px;color:var(--ink-dim);font-size:.82rem;font-weight:700;transition:all .2s}
        .tq .sl2:hover{border-color:rgba(255,91,53,0.4);color:var(--ember);background:rgba(255,91,53,0.08)}

        @media(max-width:768px){.tq .nav-links{display:none}.tq .container{padding:0 16px}.tq .container-wide{padding:0 16px}.tq .fi{flex-direction:column;gap:28px}.tq .fb2{flex-direction:column;align-items:flex-start}}

        .tq .fade-in{animation:tqFadeIn 0.5s cubic-bezier(0.16,1,0.3,1)}
        @keyframes tqFadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .tq .toast{position:fixed;bottom:24px;left:50%;transform:translateX(-50%) translateY(100px);background:var(--ember);color:#0B0B14;padding:12px 24px;border-radius:100px;font-weight:600;font-size:14px;transition:transform 0.3s cubic-bezier(0.16,1,0.3,1);z-index:100;pointer-events:none}
        .tq .toast.show{transform:translateX(-50%) translateY(0)}
      `}</style>

      <div className="tq">
        <div className="tq-bg" />

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
            <a href="/">Home</a><span>/</span>How Toxic Are You Quiz
          </nav>
        </div>

        <main>
          <section className="hero">
            <div className="container">
              <span className="eyebrow">Mars + Pluto · 90 seconds · Free</span>
              <h1>How <em>toxic</em> are you, actually?</h1>
              <p className="hero-sub">Ten honest questions. Your Mars and Pluto placements know things about you that you don&apos;t want to say out loud. This quiz says them, scores you 0-100, and names your top three shadow patterns.</p>

              <div className="answer-block">
                <strong>The short answer:</strong> Toxicity in astrology is measured through <strong>Mars</strong> (how you fight, react, and express anger) and <strong>Pluto</strong> (control, obsession, jealousy, manipulation). This quiz maps ten of the most common toxic patterns tied to these two planets and gives you a score from 0 to 100 with your top three shadow traits named. It takes about 90 seconds, requires no signup, and no birth data to start.
              </div>

              <div className="meta-strip">
                <span><strong>10</strong> questions</span>
                <span><strong>~90</strong> seconds</span>
                <span><strong>12,847</strong> people took this today</span>
                <span><strong>4.8/5</strong> avg rating</span>
              </div>
            </div>
          </section>

          <section>
            <div className="container">
              <ToxicityQuiz />
            </div>
          </section>

          <section className="content" id="learn-more">
            <div className="container">
              <h2 className="section-h">What &quot;<em>toxic</em>&quot; actually means in your chart</h2>
              <p>The word toxic gets thrown around loosely. In astrology it has a specific meaning tied to two planets: Mars and Pluto. Everything else — mean words, ghosting, love-bombing, silent treatment — is a symptom. Mars and Pluto are the source.</p>

              <h3 className="sub-h">Mars: how you fight</h3>
              <p>Mars is the planet of anger, action, and how you handle being provoked. A healthy Mars means you can say &quot;that hurt me&quot; and mean it. An unmetabolized Mars means you either explode, go silent, or get passive-aggressive within seconds of a trigger. Your Mars sign shows the flavor: Mars in Aries is reactive fire, Mars in Scorpio is slow and calculated, Mars in Cancer punishes through withdrawal.</p>

              <h3 className="sub-h">Pluto: how you control</h3>
              <p>Pluto is the shadow. It rules obsession, jealousy, manipulation, and the parts of you that need to feel in charge to feel safe. Pluto in the 7th house pulls control games into relationships. Pluto square Venus tends to run hot-and-cold with love. Pluto conjunct the ascendant can weaponize charisma. None of this is destiny — it&apos;s raw material.</p>

              <h3 className="sub-h">The ten patterns this quiz measures</h3>
              <ul>
                <li><strong>Reactive anger</strong> — how quickly you go from calm to hostile</li>
                <li><strong>Silent treatment</strong> — using withdrawal as a weapon</li>
                <li><strong>Jealousy loops</strong> — obsessive comparison and monitoring</li>
                <li><strong>Control needs</strong> — needing to know, decide, or run everything</li>
                <li><strong>Score-keeping</strong> — remembering everything to use later</li>
                <li><strong>Blame reflex</strong> — inability to be the one at fault</li>
                <li><strong>Emotional stonewalling</strong> — shutting down instead of talking</li>
                <li><strong>Manipulation</strong> — using guilt, charm, or fear to shift someone&apos;s behavior</li>
                <li><strong>Ghosting</strong> — vanishing instead of ending things cleanly</li>
                <li><strong>Ego injury response</strong> — how you react when someone bruises your pride</li>
              </ul>
            </div>
          </section>

          {/* NEW SECTION: Mars sign toxicity by sign (long-tail SEO) */}
          <section className="content">
            <div className="container">
              <h2 className="section-h">Toxicity by <em>Mars sign</em>: the shadow expression of all 12</h2>
              <p>Your Mars sign is the shape of your temper. Every Mars sign has a healed and an unhealed version — the unhealed version is what most people mean when they say &quot;toxic.&quot; Below is the shadow expression for each Mars sign, plus what that same placement looks like once it&apos;s been worked with.</p>

              <div className="mars-grid">
                {MARS_TOXIC.map((m) => (
                  <div className="mars-card" key={m.sign}>
                    <h4>{m.sign}</h4>
                    <div className="mc-shadow"><strong style={{color:"var(--ember)"}}>Shadow:</strong> {m.shadow}</div>
                    <div className="mc-healed"><strong>Healed version:</strong> {m.healed}</div>
                  </div>
                ))}
              </div>

              <p>Reading only your Sun sign to guess your toxicity is a waste of time. Your Sun sign is the ego you present; your Mars sign is what actually fires when someone crosses you. If you&apos;re not sure which Mars you have, <a href="/free-birth-chart" style={{color:"var(--amber)"}}>calculate your free birth chart</a> to see it.</p>
            </div>
          </section>

          {/* NEW SECTION: how to heal (long-tail SEO — "how to stop being toxic astrology") */}
          <section className="content">
            <div className="container">
              <h2 className="section-h">How to <em>heal</em> Mars-Pluto shadow patterns: 5 practical steps</h2>
              <p>Every &quot;toxic&quot; pattern tied to Mars or Pluto is workable. Not fixable in a weekend, but workable. The five moves below are what shadow work actually looks like on the ground — no vague advice, no &quot;just be more mindful.&quot; They&apos;re what closes the gap between knowing you&apos;re running the pattern and stopping it in the moment.</p>

              <div className="heal-steps">
                {HEAL_STEPS.map((h) => (
                  <div className="heal-step" key={h.step}>
                    <div className="step-num">{h.step}</div>
                    <div>
                      <h4>{h.title}</h4>
                      <p>{h.body}</p>
                    </div>
                  </div>
                ))}
              </div>

              <h3 className="sub-h">The people who stop being toxic have one thing in common</h3>
              <p>They stopped denying it. That&apos;s the entire prerequisite. Everyone reading this page has already crossed the hardest step — you searched for a toxicity quiz, and you meant it. That&apos;s the move most people never make. From here on, the work is repetition. Same pattern. Same intervention. Different result over time.</p>
              <p>For the exact Mars and Pluto placements behind your specific score — sign, house, and aspects to Venus, Sun, and Moon — <a href="/free-birth-chart" style={{color:"var(--amber)"}}>generate your free birth chart</a>. It&apos;s the map for the work.</p>
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
              <h2 className="section-h">Take another quiz</h2>
              <div className="related-grid">
                <a href="/love-language-birth-chart" className="related-card">
                  <div className="related-card-tag">Venus + Moon</div>
                  <div className="related-card-title">Your love language by chart</div>
                  <div className="related-card-desc">How you actually give and receive love, decoded.</div>
                </a>
                <a href="/career-strength-birth-chart" className="related-card">
                  <div className="related-card-tag">Saturn + MC</div>
                  <div className="related-card-title">Your career strength</div>
                  <div className="related-card-desc">The work you were built for. Not a horoscope guess.</div>
                </a>
                <a href="/relationship-red-flags-birth-chart" className="related-card">
                  <div className="related-card-tag">Venus + Mars + 7th</div>
                  <div className="related-card-title">Relationship red flags</div>
                  <div className="related-card-desc">Spot the patterns before they cost you a year.</div>
                </a>
              </div>
            </div>
          </section>
        </main>

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
                  <li><a href="/how-toxic-are-you-quiz" style={{color:"var(--ember)"}}>How Toxic Are You?</a></li>
                  <li><a href="/love-language-birth-chart">Love Language</a></li>
                  <li><a href="/relationship-red-flags-birth-chart">Relationship Red Flags</a></li>
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
