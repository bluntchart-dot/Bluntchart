import type { Metadata } from "next";
import Image from "next/image";
import BlindSpotFinder from "./BlindSpotFinder";

export const metadata: Metadata = {
  title: "Why You Keep Attracting the Wrong Person — Your Venus & 7th House Explained | BluntChart",
  description: "Your birth chart explains why you keep dating the same type. Venus sign, 7th house ruler, and nodal axis reveal the exact attraction pattern — and why you keep repeating it. Brutally honest astrology.",
  keywords: [
    "why do i keep attracting the same type","why do i attract the wrong person","why do i attract toxic people",
    "why do i always date the same type","venus sign attraction","7th house astrology","venus sign meaning",
    "why do i attract narcissists astrology","relationship patterns astrology","birth chart love",
    "venus in scorpio attraction","venus in libra love","venus sign compatibility",
    "why do i attract emotionally unavailable","nodal axis relationships","descendant sign meaning",
    "astrology attraction pattern","birth chart relationships","why do i keep dating the same person",
    "venus 7th house love pattern","astrology why am i single","why do i attract the wrong people",
  ],
  alternates: { canonical: "https://bluntchart.com/why-you-attract-the-wrong-person" },
  openGraph: {
    title: "Why You Keep Attracting the Wrong Person | BluntChart",
    description: "Your Venus sign, 7th house, and nodal axis explain the pattern. Sign-by-sign breakdown. Brutally honest.",
    url: "https://bluntchart.com/why-you-attract-the-wrong-person", siteName: "BluntChart", type: "article",
  },
  twitter: { card: "summary_large_image", title: "Why You Keep Attracting the Wrong Person | BluntChart", description: "Your birth chart mapped the pattern before you lived it. Venus, 7th house, nodal axis — explained." },
};

const jsonLdArticle = {"@context":"https://schema.org","@type":"Article",
  headline:"Why You Keep Attracting the Wrong Person: Venus, 7th House & Nodal Axis Explained",
  description:"Your birth chart explains why you keep dating the same type. Venus sign, 7th house ruler, and nodal axis reveal the exact attraction pattern.",
  author:{"@type":"Organization",name:"BluntChart",url:"https://bluntchart.com"},
  publisher:{"@type":"Organization",name:"BluntChart",url:"https://bluntchart.com"},
  datePublished:"2026-05-31T00:00:00+00:00",
  mainEntityOfPage:{"@type":"WebPage","@id":"https://bluntchart.com/why-you-attract-the-wrong-person"},
};
const jsonLdFaq = {"@context":"https://schema.org","@type":"FAQPage",mainEntity:[
  {"@type":"Question",name:"Why do I keep attracting the same type of person?",acceptedAnswer:{"@type":"Answer",text:"Your Venus sign, 7th house ruler, and South Node create an unconscious attraction pattern. Venus determines what feels attractive. Your 7th house describes who you seek in partnerships. Your South Node pulls you toward familiar (often unhealthy) dynamics. Together, they form a repeating loop that your birth chart maps precisely."}},
  {"@type":"Question",name:"Can astrology explain my toxic relationship pattern?",acceptedAnswer:{"@type":"Answer",text:"Yes — to the extent that astrology can surface psychological patterns. Venus square Pluto, for example, correlates with attraction to intensity and power dynamics. Venus in the 12th house correlates with choosing unavailable partners. These aren't fate — they're tendencies your chart highlights so you can work with them consciously rather than repeat them blindly."}},
  {"@type":"Question",name:"What does my Venus sign say about who I attract?",acceptedAnswer:{"@type":"Answer",text:"Your Venus sign describes what you find attractive and how you express love. Venus in Aries attracts through boldness and independence. Venus in Cancer attracts through emotional safety and nurturing. Venus in Scorpio attracts through intensity and psychological depth. Each sign creates a specific magnetic pull — and a specific blind spot."}},
  {"@type":"Question",name:"What is the 7th house in astrology and how does it affect relationships?",acceptedAnswer:{"@type":"Answer",text:"The 7th house is the house of partnerships — romantic, business, and any one-on-one committed relationship. The sign on your 7th house cusp (your Descendant) describes the qualities you unconsciously seek in a partner. It's always the opposite sign of your Rising sign. Understanding your 7th house explains why you're drawn to specific types of people."}},
  {"@type":"Question",name:"How do I break a negative relationship pattern according to my chart?",acceptedAnswer:{"@type":"Answer",text:"Awareness is the first step. Your chart doesn't doom you to repeat patterns — it shows you what the patterns are so you can make conscious choices instead of unconscious ones. Moving toward your North Node qualities (rather than defaulting to your South Node comfort zone) is the astrological framework for growth. A full birth chart reading maps exactly what that looks like for you."}},
].map(f=>({"@type":"Question",name:f.name,acceptedAnswer:f.acceptedAnswer}))};
const jsonLdBreadcrumb = {"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[
  {"@type":"ListItem",position:1,name:"BluntChart",item:"https://bluntchart.com"},
  {"@type":"ListItem",position:2,name:"Why You Attract the Wrong Person",item:"https://bluntchart.com/why-you-attract-the-wrong-person"},
]};

const VENUS_SIGNS = [
  { sign:"Aries",symbol:"♈",attracts:"People who match your energy — bold, impulsive, competitive. The kind who text back immediately or not at all.",blindSpot:"You mistake intensity for compatibility. The chase IS the attraction. Once someone is caught, you get bored — or they do. You confuse conflict with passion and independence with unavailability. The pattern: you fall fast, burn hot, and wonder why it never lasts past the adrenaline phase.",breaks:"Learning that real love isn't a conquest. It's the thing that stays interesting after the chase is over." },
  { sign:"Taurus",symbol:"♉",attracts:"Stable, sensual, financially secure types. People who feel like a warm bed on a cold morning — comfortable, reliable, hard to leave.",blindSpot:"You stay too long. Comfort becomes a cage you furnish so beautifully you forget it's still a cage. You confuse security with love and possessiveness with devotion. The pattern: you choose safe over right, then resent the safety for not being exciting enough.",breaks:"Learning that security built on fear of being alone isn't security — it's dependence with nice furniture." },
  { sign:"Gemini",symbol:"♊",attracts:"Witty, cerebral, stimulating conversationalists. People who make you laugh and never bore you. The kind who have a take on everything.",blindSpot:"You intellectualise your way out of intimacy. When it gets emotionally deep, you change the subject, crack a joke, or find someone new to be interested in. You confuse mental connection with emotional availability. The pattern: amazing first dates, shallow relationships, and a graveyard of almost-loves you talked yourself out of feeling.",breaks:"Learning that vulnerability isn't a conversation topic — it's a state you have to actually enter." },
  { sign:"Cancer",symbol:"♋",attracts:"Emotionally available (or seemingly so), nurturing, family-oriented people. The kind who remember your childhood stories and cook you dinner.",blindSpot:"You mother your partners or choose partners who mother you. Caretaking replaces equality. You confuse being needed with being loved — and you stay in relationships long past their expiration because leaving feels like abandonment. The pattern: you give everything, they take it, and you wonder why you're exhausted.",breaks:"Learning the difference between a partner and a patient. You deserve someone who feeds you back." },
  { sign:"Leo",symbol:"♌",attracts:"Charismatic, confident, admiring partners. People who make you feel seen, special, and like the main character in someone else's story.",blindSpot:"You choose people who reflect your best self back to you — which is flattering until you realise they're reflecting, not connecting. You confuse adoration with intimacy and performance with presence. The pattern: relationships that look incredible from the outside and feel empty when the audience leaves.",breaks:"Learning that being truly known is better than being admired. The right person sees the unperformed version." },
  { sign:"Virgo",symbol:"♍",attracts:"People who need fixing. Projects disguised as partners. Someone with potential who just needs the right person (you, obviously) to unlock it.",blindSpot:"You choose people who are slightly broken so you can be useful, because being useful feels safer than being desired. You confuse fixing with loving and criticism with care. The pattern: you pour yourself into someone, improve their life, and they either leave once they're fixed or you resent them for never being enough.",breaks:"Learning that you are not a rehabilitation centre. The right partner doesn't need to be improved — and neither do you." },
  { sign:"Libra",symbol:"♎",attracts:"Beautiful, charming, socially graceful people. Partners who make your life feel curated, balanced, and aesthetically pleasing.",blindSpot:"You lose yourself in partnerships. Your identity becomes 'us' so quickly that 'I' disappears. You confuse harmony with love and avoiding conflict with having a good relationship. The pattern: you bend until you break, then start over with someone new and bend again.",breaks:"Learning that a relationship that can't survive your honesty isn't a relationship worth preserving." },
  { sign:"Scorpio",symbol:"♏",attracts:"Intense, mysterious, emotionally complex people. The kind who have depth, secrets, and a gaze that makes you feel simultaneously terrified and alive.",blindSpot:"You're addicted to transformation through pain. You choose partners who challenge you at a soul level, but that often means choosing people who hurt you at a human level. You confuse obsession with love and control with commitment. The pattern: earth-shattering connections that destroy as much as they create.",breaks:"Learning that intimacy doesn't require suffering. Depth without destruction is possible — it's just less dramatic." },
  { sign:"Sagittarius",symbol:"♐",attracts:"Free spirits, adventurers, people with big ideas and bigger plans. Partners who expand your world and never make you feel trapped.",blindSpot:"You choose people who are emotionally elsewhere — travelling, philosophising, always on their way somewhere that isn't here with you. You confuse freedom with unavailability and excitement with substance. The pattern: falling for potential and possibility, then wondering why the relationship never fully lands.",breaks:"Learning that commitment isn't a cage. The right person is an adventure you don't need to escape from." },
  { sign:"Capricorn",symbol:"♑",attracts:"Ambitious, accomplished, status-oriented partners. People who have their act together, or at least look like they do.",blindSpot:"You choose partners the way you'd choose a business investment — based on returns, not feelings. You confuse shared ambition with shared values and practical compatibility with actual love. The pattern: partnerships that work on paper and feel hollow in practice.",breaks:"Learning that emotional ROI isn't calculated in spreadsheets. The right person makes you feel something you can't optimise." },
  { sign:"Aquarius",symbol:"♒",attracts:"Unconventional, intellectual, slightly aloof individuals. People who challenge norms and don't need you — which is precisely why you want them.",blindSpot:"You choose emotional distance and call it independence. You're attracted to people who don't quite need you because it feels safer than being needed. You confuse detachment with self-sufficiency and uniqueness with unavailability. The pattern: always almost-together, never fully in.",breaks:"Learning that being known doesn't mean being trapped. Intimacy requires you to show up as a human, not just a concept." },
  { sign:"Pisces",symbol:"♓",attracts:"Dreamers, artists, wounded souls, people who need saving. Partners who feel like soulmates in the first week and strangers by month three.",blindSpot:"You fall in love with the idea of someone, not the reality. You project your fantasy onto real humans and then feel betrayed when they turn out to be themselves. You confuse empathy with connection and merging with intimacy. The pattern: overwhelming love followed by equally overwhelming disillusionment.",breaks:"Learning that love is not a rescue mission. The right person is already whole — and so are you." },
];

const FAQS = [
  { q:"Why do I keep attracting the same type of person?", a:"Three chart factors create the loop: your Venus sign (what feels attractive to you), your 7th house ruler (what you seek in partnerships), and your South Node (the familiar dynamic you default to). These three together form an unconscious blueprint that draws specific types of people into your life — and specific types of problems. Your full birth chart maps all three." },
  { q:"Is it my fault I attract toxic people?", a:"No. Your chart maps tendencies, not blame. Everyone has Venus blind spots — places where what feels magnetic is actually harmful. Venus in Scorpio isn't at fault for being drawn to intensity any more than Venus in Pisces is at fault for idealising partners. The pattern isn't your fault. But recognising it IS your responsibility. That's the difference between repeating a cycle and breaking one." },
  { q:"Can I change my attraction pattern?", a:"Yes — and your chart shows how. The North Node represents the direction of growth, and it's always opposite your South Node (your comfort zone). Moving toward North Node qualities in relationships — even when it feels uncomfortable and unfamiliar — is the astrological framework for breaking patterns. A birth chart reading maps exactly what your North Node asks of you." },
  { q:"What does the 7th house say about my relationships?", a:"The 7th house is the house of partnerships. The sign on your 7th house cusp (your Descendant) describes the qualities you unconsciously seek in a partner. It's always opposite your Rising sign. Aries Rising seeks Libra qualities in partners. Cancer Rising seeks Capricorn qualities. Understanding your Descendant explains why you're drawn to specific types — even types you wouldn't consciously choose." },
  { q:"Does my Venus sign determine who I'm compatible with?", a:"Venus sign compatibility is one factor but not the whole picture. Your Venus sign describes your love language and attraction style. Compatibility involves comparing Venus signs, Moon signs (emotional needs), Mars signs (desire and conflict style), 7th house placements, and synastry aspects between two charts. Venus alone tells you what you want. The full chart tells you what you need." },
  { q:"How does my birth chart actually help with dating?", a:"It gives you the manual you never had. Your chart shows what you find attractive (Venus), what you need emotionally (Moon), how you fight (Mars), what you seek in a partner (7th house), and what patterns you're prone to repeating (Nodal axis). That's not a dating app — it's a self-awareness tool. The more you understand your own wiring, the less likely you are to mistake familiar for right." },
];

export default function WhyYouAttractWrongPersonPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--font-display:'Playfair Display',Georgia,serif;--font-body:'DM Sans',system-ui,sans-serif;--bg:#09090f;--card:#12121e;--border:rgba(255,255,255,0.08);--white:#e8e4f0;--dim:rgba(232,228,240,0.55);--faint:rgba(232,228,240,0.08);--gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);--purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5}
        html{scroll-behavior:smooth}body{background:var(--bg);color:var(--white);font-family:var(--font-body);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .c{max-width:1200px;margin:0 auto;padding:0 32px}
        .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}.nav-i{display:flex;align-items:center;justify-content:space-between}.logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;letter-spacing:.02em;display:flex;align-items:center;gap:10px}.logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.nav-links{display:flex;align-items:center;gap:20px}.nav-links a{font-size:.82rem;font-weight:500;color:var(--dim);text-decoration:none;letter-spacing:.04em;text-transform:uppercase;transition:color .2s}.nav-links a:hover{color:var(--white)}.ncta{color:var(--gold)!important;border:1px solid var(--gold-dim);padding:6px 15px;border-radius:4px}.ncta:hover{background:var(--gold-dim)}
        .breadcrumb{padding:88px 0 0;font-size:.82rem;color:var(--dim)}.breadcrumb a{color:var(--dim);text-decoration:none}.breadcrumb a:hover{color:var(--gold)}
        .hero{padding:16px 0 40px;position:relative;overflow:hidden}.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(212,83,126,.06) 0%,transparent 50%);pointer-events:none}
        .hero-split{display:flex;align-items:center;gap:40px}
        .hero-text{flex:1;min-width:0}
        .hero-img-col{flex-shrink:0;width:240px}
        .hero-img-wrap{border-radius:16px;overflow:hidden;border:0.5px solid rgba(212,83,126,.15);box-shadow:0 16px 48px rgba(212,83,126,.1)}
        .hero-img{width:100%;height:auto;display:block}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--rose);margin-bottom:14px;padding:5px 14px;border:1px solid rgba(212,83,126,.2);border-radius:100px;background:rgba(212,83,126,.06)}
        h1{font-family:var(--font-display);font-size:clamp(2.2rem,5.5vw,3.8rem);font-weight:900;line-height:1.08;letter-spacing:-.02em;margin-bottom:14px}h1 em{font-style:italic;background:linear-gradient(135deg,#d4537e,#f0b84a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .hero-sub{font-size:1.05rem;color:var(--dim);max-width:720px;line-height:1.72;margin-bottom:0}
        .prose{font-size:1rem;color:rgba(232,228,240,0.78);line-height:1.82}.prose p{margin-bottom:22px}.prose strong{color:var(--white);font-weight:600}.prose a{color:var(--gold);text-decoration:underline;text-decoration-color:rgba(240,184,74,.3)}.prose a.bp,.prose a.bs{color:#fff;text-decoration:none}.prose a:hover{text-decoration-color:var(--gold)}.prose h2{font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2rem);font-weight:800;line-height:1.15;margin:56px 0 18px;color:var(--white)}.prose h2 em{font-style:italic;background:linear-gradient(135deg,#d4537e,#f0b84a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .venus-card{background:var(--card);border:0.5px solid var(--border);border-radius:16px;padding:28px 26px;margin-bottom:18px;transition:border-color .2s}.venus-card:hover{border-color:rgba(212,83,126,.25)}
        .venus-header{display:flex;align-items:center;gap:14px;margin-bottom:16px}.venus-symbol{font-size:1.8rem;opacity:.5}.venus-name{font-family:var(--font-display);font-size:1.15rem;font-weight:700;color:var(--white)}
        .venus-section{margin-bottom:16px}.venus-label{font-size:.68rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;margin-bottom:8px}.venus-text{font-size:.92rem;color:rgba(232,228,240,0.68);line-height:1.72}
        .cta-section{background:linear-gradient(165deg,rgba(212,83,126,.06),rgba(107,47,212,.04));border:1px solid rgba(212,83,126,.2);border-radius:20px;padding:48px 36px;text-align:center;margin:56px 0}.cta-section h2{font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2rem);font-weight:800;margin-bottom:14px;color:var(--white)}.cta-section h2 em{font-style:italic;background:linear-gradient(135deg,#d4537e,#f0b84a);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.cta-section p{font-size:1rem;color:var(--dim);max-width:520px;margin:0 auto 28px;line-height:1.72}
        .bp{display:inline-flex;align-items:center;gap:8px;padding:14px 30px;background:linear-gradient(135deg,#6b2fd4,#d4537e);color:#ffffff;font-family:inherit;font-size:.88rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;border:none;border-radius:10px;cursor:pointer;transition:opacity .2s,transform .15s;-webkit-text-fill-color:#ffffff}.bp:hover{opacity:.88;transform:translateY(-1px)}
        .related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;margin:32px 0 48px}.related-card{background:var(--card);border:0.5px solid var(--border);border-radius:12px;padding:18px 16px;text-decoration:none;transition:border-color .2s,transform .15s}.related-card:hover{border-color:rgba(212,83,126,.3);transform:translateY(-2px)}.related-card-title{font-family:var(--font-display);font-size:.95rem;font-weight:700;color:var(--white);margin-bottom:4px}.related-card-desc{font-size:.8rem;color:var(--dim);line-height:1.5}
        .footer{border-top:1px solid var(--border);padding:48px 0 30px;margin-top:64px}.fi{display:flex;align-items:flex-start;justify-content:space-between;gap:36px;flex-wrap:wrap;margin-bottom:36px}.fb p{font-size:.82rem;color:var(--dim);max-width:240px;line-height:1.6;margin-top:8px}.fl h4{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--dim);margin-bottom:14px}.fl ul{list-style:none;display:flex;flex-direction:column;gap:10px}.fl a{font-size:.83rem;color:rgba(232,228,240,.35);text-decoration:none;transition:color .2s}.fl a:hover{color:var(--white)}.fb2{border-top:1px solid var(--border);padding-top:22px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}.disc{font-size:.73rem;color:rgba(232,228,240,.25);max-width:520px;line-height:1.55}.copy{font-size:.73rem;color:rgba(232,228,240,.2)}
        .slinks{display:flex;gap:10px;margin-top:14px}.sl2{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:0.5px solid var(--border);border-radius:8px;color:var(--dim);text-decoration:none;font-size:.82rem;font-weight:700;transition:all .2s}.sl2:hover{border-color:rgba(107,47,212,.4);color:var(--gold);background:rgba(107,47,212,.1)}
        @media(max-width:768px){.nav-links{display:none}.fi{flex-direction:column;gap:28px}.fb2{flex-direction:column;align-items:flex-start}.related-grid{grid-template-columns:1fr}.c{padding:0 16px}.hero-split{flex-direction:column;gap:20px}.hero-img-col{width:160px;order:-1}}
      `}</style>

      <nav className="nav"><div className="c nav-i"><a className="logo" href="/"><img src="/mascot.png" alt="BluntChart" width={34} height={34} style={{borderRadius:"50%"}}/><span className="g">BluntChart</span></a><div className="nav-links"><a href="/#try-it">Get Reading</a><a href="/free-birth-chart">Free Chart</a><a href="/saturn-return-calculator">Saturn Return</a><a className="ncta" href="/#try-it">Full Reading $15</a></div></div></nav>

      <div className="c"><nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">BluntChart</a><span style={{margin:"0 8px",opacity:.4}}>/</span><span style={{color:"var(--white)"}}>Why You Attract the Wrong Person</span></nav></div>

      <header className="hero"><div className="hero-bg"/>
        <div className="c">
          <div className="hero-split">
            <div className="hero-text">
              <div className="eyebrow">♀ Venus · 7th House · Nodal Axis</div>
              <h1>Why you keep attracting<br/><em>the wrong person.</em></h1>
              <p className="hero-sub">It&apos;s not bad luck. It&apos;s not the apps. It&apos;s your chart. Three specific placements — your Venus sign, your 7th house ruler, and your nodal axis — create an unconscious attraction pattern that keeps pulling the same type of person into your life. Here&apos;s how it works, sign by sign, with zero sugarcoating.</p>
            </div>
            <div className="hero-img-col">
              <div className="hero-img-wrap">
                <Image
                  src="/heartbroken-bluntchart.png"
                  alt="Heartbroken BluntChart mascot illustrating relationship attraction patterns explained by Venus sign, 7th house, and nodal axis in your birth chart"
                  width={480}
                  height={480}
                  priority
                  className="hero-img"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main><div className="c">
        {/* ── INTERACTIVE TOOL ── */}
        <BlindSpotFinder />

        <article className="prose">
          <h2>The three chart placements that control <em>who you attract</em></h2>
          <p>Most astrology content tells you about your Sun sign compatibility and calls it a day. That&apos;s like reading the title of a book and claiming you know the plot. Your attraction pattern runs deeper — and it&apos;s mapped by three specific chart placements most people never look at.</p>
          <p><strong>Venus</strong> is the planet of love, beauty, and attraction. Your Venus sign determines what you find attractive, how you express affection, and what you magnetise into your life. It&apos;s your love language translated into astrology — and it comes with a blind spot the size of a planet.</p>
          <p>Your <strong>7th house</strong> (the Descendant) is the house of partnerships. The sign on your 7th house cusp describes the qualities you unconsciously seek in a partner — often the qualities you don&apos;t see in yourself. It&apos;s always the opposite sign of your Rising sign: if you&apos;re Aries Rising, your 7th house is Libra. If you&apos;re Cancer Rising, it&apos;s Capricorn. The 7th house is your relationship shadow — the part of yourself you project onto other people and then fall in love with.</p>
          <p>Your <strong>nodal axis</strong> (North Node and South Node) maps your karmic growth direction. In relationships, your South Node represents the familiar dynamic — the pattern you default to because it feels comfortable, even when it&apos;s destructive. Your North Node represents the unfamiliar dynamic you&apos;re meant to grow into. Most people keep dating their South Node. The ones who break the pattern start dating their North Node.</p>
          <p>Together, these three placements explain why you keep having the same relationship over and over — different person, same dynamic, same disappointment. The only way to see all three in your chart is with your exact birth time and place. <a href="/free-birth-chart">Get your free birth chart here</a> and find your Venus sign, Descendant, and nodes.</p>

          <div className="cta-section">
            <h2>Your chart already mapped the pattern.<br/><em>Before you lived it.</em></h2>
            <p>The Venus breakdown below tells you the theme. Your full birth chart — Venus sign, house, aspects, 7th house ruler, and nodal axis — tells you the specific story. Get your free preview and see what your chart actually says about your love life.</p>
            <a className="bp" href="/#try-it">Get My Free Preview ✨</a>
            <div style={{fontSize:".78rem",color:"rgba(232,228,240,.35)",marginTop:12}}>Two free insights from your exact chart. $15 for the full reading.</div>
          </div>

          <h2>Your Venus sign blind spot — <em>sign by sign</em></h2>
          <p>Find your Venus sign below. If you don&apos;t know it, use our <a href="/free-birth-chart">free birth chart calculator</a>. Read for your Venus sign, not your Sun sign — they&apos;re often different.</p>
        </article>

        {/* VENUS SIGN CARDS */}
        <div style={{display:"grid",gridTemplateColumns:"1fr",gap:16,marginBottom:48}}>
          {VENUS_SIGNS.map(v => (
            <div className="venus-card" key={v.sign}>
              <div className="venus-header">
                <span className="venus-symbol">{v.symbol}</span>
                <div className="venus-name">Venus in {v.sign}</div>
              </div>
              <div className="venus-section">
                <div className="venus-label" style={{color:"var(--teal)"}}>What you attract</div>
                <div className="venus-text">{v.attracts}</div>
              </div>
              <div className="venus-section">
                <div className="venus-label" style={{color:"var(--rose)"}}>Your blind spot</div>
                <div className="venus-text">{v.blindSpot}</div>
              </div>
              <div className="venus-section" style={{marginBottom:0}}>
                <div className="venus-label" style={{color:"var(--gold)"}}>What breaks the pattern</div>
                <div className="venus-text">{v.breaks}</div>
              </div>
            </div>
          ))}
        </div>

        <article className="prose">
          <h2>Why knowing your Venus sign <em>isn&apos;t enough</em></h2>
          <p>The Venus breakdowns above tell you the theme — the broad strokes of your attraction pattern. But your actual relationship blueprint is more specific. Venus in Scorpio in the 7th house is a completely different experience from Venus in Scorpio in the 12th house. The first attracts intense, transformative partnerships. The second attracts unavailable ones. Same Venus sign, different house, different life.</p>
          <p>Then there are <strong>aspects</strong> — the angles Venus makes to other planets in your chart. Venus square Pluto? You&apos;re drawn to power dynamics and obsessive love. Venus trine Jupiter? You attract generously but struggle with boundaries. Venus opposite Saturn? You fear intimacy and choose partners who confirm that fear. These aspects fine-tune your Venus sign into something deeply personal — and deeply specific to you.</p>
          <p>Your <a href="/free-birth-chart">full birth chart</a> shows all of it: Venus sign, Venus house, Venus aspects, 7th house ruler, and nodal axis. That&apos;s the complete map of your attraction pattern — not a horoscope that applies to a twelfth of the population, but a specific reading of <em>your</em> wiring.</p>

          <div className="cta-section">
            <h2>Stop guessing. <em>Read the map.</em></h2>
            <p>Your birth chart has been trying to tell you this since the day you were born. BluntChart reads it in plain language — no sugarcoating, no vague reassurances, just the truth about why you attract who you attract and what to do about it. Two free insights before you pay.</p>
            <a className="bp" href="/#try-it">Get My Free Preview ✨</a>
            <div style={{fontSize:".78rem",color:"rgba(232,228,240,.35)",marginTop:12}}>$15 one-time. ~1,500 words specific to your chart. No subscription.</div>
          </div>

          <h2>Attraction pattern <em>FAQ</em></h2>
        </article>

        <div style={{maxWidth:780,marginBottom:48}}>
          {FAQS.map((f,i)=>(
            <details key={i} style={{borderBottom:"0.5px solid rgba(255,255,255,0.08)"}}>
              <summary style={{padding:"22px 0",cursor:"pointer",listStyle:"none",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,fontSize:".97rem",fontWeight:600,color:"#e8e4f0",lineHeight:1.45}}>
                <span style={{flex:1}}>{f.q}</span>
                <span style={{width:26,height:26,borderRadius:"50%",border:"0.5px solid rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:14,color:"var(--rose)",fontWeight:700}}>+</span>
              </summary>
              <p style={{fontSize:".89rem",color:"rgba(232,228,240,.65)",lineHeight:1.78,paddingBottom:22,paddingRight:40}}>{f.a}</p>
            </details>
          ))}
        </div>

        <article className="prose"><h2>Related <em>free tools</em></h2></article>
        <div className="related-grid">
          <a className="related-card" href="/free-birth-chart"><div className="related-card-title">Free Birth Chart</div><div className="related-card-desc">Find your Venus sign, 7th house, and complete planetary placements.</div></a>
          <a className="related-card" href="/saturn-return-calculator"><div className="related-card-title">Saturn Return Calculator</div><div className="related-card-desc">Are you in your Saturn Return? It explains the relationship crisis.</div></a>
          <a className="related-card" href="/moon-sign-calculator"><div className="related-card-title">Moon Sign Calculator</div><div className="related-card-desc">Your emotional needs in relationships — often more important than Venus.</div></a>
          <a className="related-card" href="/rising-sign-calculator"><div className="related-card-title">Rising Sign Calculator</div><div className="related-card-desc">Your Rising sign determines your 7th house — and who you seek.</div></a>
          <a className="related-card" href="/big-three-calculator"><div className="related-card-title">Big Three Calculator</div><div className="related-card-desc">Sun, Moon, Rising — the core placements that shape everything.</div></a>
          <a className="related-card" href="/mercury-retrograde-2026"><div className="related-card-title">Mercury Retrograde 2026</div><div className="related-card-desc">Yes, your ex texting you during retrograde is astrologically on brand.</div></a>
        </div>

        <div style={{fontSize:".78rem",color:"rgba(232,228,240,.3)",textAlign:"center",marginTop:48}}><time dateTime="2026-05-31">Last updated: May 31, 2026</time> · For entertainment purposes only</div>
      </div></main>

      </>
  );
}