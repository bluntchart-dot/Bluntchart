import type { Metadata } from "next";
import SaturnCalculator from "./SaturnCalculator";

export const metadata: Metadata = {
  title: "Saturn Return Calculator — When Is My Saturn Return? | BluntChart",
  description: "Free Saturn Return calculator. Enter your birth date to find your Saturn sign, exact return dates, and a brutally honest reading of what Saturn is actually testing in your life. Used by 27–30 year olds whose life just fell apart.",
  keywords: [
    "saturn return calculator","when is my saturn return","saturn return","saturn return dates",
    "am I in my saturn return","saturn return age","saturn return 27","saturn return 28","saturn return 29",
    "saturn return in aries","saturn return in aries 2026","saturn return 2026","saturn return meaning",
    "what is saturn return","saturn sign calculator","first saturn return","saturn return crisis",
    "saturn return relationships","saturn return career change","saturn return breakup",
    "saturn return calculator free","my saturn return","saturn return test",
  ],
  alternates: { canonical: "https://bluntchart.com/saturn-return-calculator" },
  openGraph: {
    title: "Saturn Return Calculator — Find Your Exact Dates | BluntChart",
    description: "When is your Saturn Return? Free calculator with brutally honest readings. Find your Saturn sign, return dates, and what Saturn is actually testing.",
    url: "https://bluntchart.com/saturn-return-calculator", siteName: "BluntChart", type: "website",
    images: [{ url: "https://bluntchart.com/og-mercury-retrograde-2026.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Saturn Return Calculator | BluntChart", description: "When is your Saturn Return? Find your Saturn sign and exact dates. Free." },
};

const jsonLdFaq = {"@context":"https://schema.org","@type":"FAQPage",mainEntity:[
  { "@type":"Question", name:"When is my Saturn Return?", acceptedAnswer:{"@type":"Answer",text:"Your Saturn Return happens when transiting Saturn returns to the exact zodiac sign it occupied at your birth. This occurs approximately every 29.5 years. Your first return hits between ages 27–30, your second between ages 56–60. Use the calculator above with your birth date to find your exact return window."} },
  { "@type":"Question", name:"What is a Saturn Return?", acceptedAnswer:{"@type":"Answer",text:"A Saturn Return is an astrological transit when Saturn completes its orbit and returns to the position it held when you were born. In astrological tradition, it marks a major life transition — the shift from youth to real adulthood. Career upheavals, relationship reckonings, identity crises, and forced growth are all common Saturn Return experiences."} },
  { "@type":"Question", name:"Am I in my Saturn Return right now?", acceptedAnswer:{"@type":"Answer",text:"If you were born between April 1996 and June 1998 (Saturn in Aries), you are currently in your first Saturn Return as of 2026. Saturn entered Aries in February 2026 and stays until April 2028. Those born 1993–1996 (Saturn in Pisces) have just completed theirs. Use the calculator to check your exact dates."} },
  { "@type":"Question", name:"Why does Saturn Return feel like a crisis?", acceptedAnswer:{"@type":"Answer",text:"Saturn is the planet of structure, consequence, and accountability. Its return forces you to confront whether the life you've built is actually yours — or whether you've been following someone else's script. The structures that aren't authentic (wrong career, wrong relationship, wrong identity) collapse so you can rebuild on honest foundations."} },
  { "@type":"Question", name:"How long does Saturn Return last?", acceptedAnswer:{"@type":"Answer",text:"Saturn spends roughly 2.5 years in each sign, so the return window is about 2–3 years. The most intense period is when Saturn hits the exact degree it occupied at your birth — that window is tighter, usually 6–12 months. But the broader themes of restructuring and growth span the full transit."} },
  { "@type":"Question", name:"Does Saturn Return affect everyone the same way?", acceptedAnswer:{"@type":"Answer",text:"No. Your Saturn sign determines the themes, but which house Saturn occupies in your birth chart determines which life area gets tested. Someone with Saturn in Aries in their 7th house will face a relationship reckoning. Someone with Saturn in Aries in their 10th house will face a career crisis. Same sign, different experience. A full natal chart reading shows exactly where Saturn falls in your chart."} },
]};
const jsonLdBreadcrumb = {"@context":"https://schema.org","@type":"BreadcrumbList",itemListElement:[
  {"@type":"ListItem",position:1,name:"BluntChart",item:"https://bluntchart.com"},
  {"@type":"ListItem",position:2,name:"Saturn Return Calculator",item:"https://bluntchart.com/saturn-return-calculator"},
]};
const jsonLdTool = {"@context":"https://schema.org","@type":"WebApplication",name:"Saturn Return Calculator",url:"https://bluntchart.com/saturn-return-calculator",applicationCategory:"LifestyleApplication",description:"Free Saturn Return calculator that finds your Saturn sign, return dates, and provides a brutally honest reading.",offers:{"@type":"Offer",price:"0",priceCurrency:"USD"},operatingSystem:"Web"};

const FAQS = [
  { q:"When is my Saturn Return?", a:"Your Saturn Return happens when Saturn returns to the zodiac sign it occupied at your birth — roughly every 29.5 years. First return: ages 27–30. Second: ages 56–60. Enter your birth date in the calculator above to find your exact window. Saturn is currently in Aries (Feb 2026 – Apr 2028), meaning those born April 1996 to June 1998 are in their first return right now." },
  { q:"What is a Saturn Return and why does it matter?", a:"A Saturn Return is the astrological equivalent of a life audit. Saturn is the planet of structure, discipline, and consequence. When it returns to its natal position, it tests whether the life you've built is genuinely yours — or a collection of other people's expectations. Career shifts, breakups, identity crises, and forced growth are all hallmarks. It matters because, whether you believe in astrology or not, the pattern holds: people consistently face major life restructuring between ages 27–30." },
  { q:"Am I in my Saturn Return right now in 2026?", a:"If you were born between April 1996 and June 1998, yes — Saturn in Aries is your first return, and it's happening now through April 2028. If you were born between March 1967 and April 1969, you're in your second Saturn Return in Aries. Those born 1993–1996 (Saturn in Pisces) have just completed theirs." },
  { q:"Why does Saturn Return feel like everything is falling apart?", a:"Because it is — on purpose. Saturn tears down the structures that aren't built on honest foundations. The career you chose to please your parents. The relationship you stayed in because leaving felt scarier than staying. The identity you built to fit in rather than to be yourself. The collapse isn't punishment. It's demolition before renovation. What survives your Saturn Return is actually yours." },
  { q:"How long does a Saturn Return last?", a:"Saturn spends roughly 2.5 years in each sign, so the broad return window is 2–3 years. The most intense phase — when Saturn crosses the exact degree it held at your birth — lasts about 6–12 months within that window. But the themes of restructuring and growth span the entire transit and often extend into the year after." },
  { q:"Does Saturn Return affect everyone the same way?", a:"Not remotely. Your Saturn sign sets the theme (what's being tested), but your natal house placement determines which area of life gets hit. Saturn in Aries in your 4th house tests your home and family foundations. The same Saturn in your 10th house tests your career and public image. Your full birth chart is the only way to know which house Saturn occupies — and that's what a BluntChart reading shows you." },
];

export default function SaturnReturnCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdTool) }} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        :root{--font-display:'Playfair Display',Georgia,serif;--font-body:'DM Sans',system-ui,sans-serif;--bg:#09090f;--card:#12121e;--border:rgba(255,255,255,0.08);--white:#e8e4f0;--dim:rgba(232,228,240,0.55);--faint:rgba(232,228,240,0.08);--gold:#F0B84A;--gold-dim:rgba(240,184,74,0.18);--purple:#6b2fd4;--rose:#d4537e;--teal:#5dcaa5}
        html{scroll-behavior:smooth}body{background:var(--bg);color:var(--white);font-family:var(--font-body);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
        .c{max-width:1200px;margin:0 auto;padding:0 32px}
        .nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 0;background:rgba(9,9,15,.92);border-bottom:1px solid var(--border);backdrop-filter:blur(16px)}.nav-i{display:flex;align-items:center;justify-content:space-between}.logo{font-family:var(--font-display);font-size:1.3rem;font-weight:700;text-decoration:none;letter-spacing:.02em;display:flex;align-items:center;gap:10px}.logo .g{background:linear-gradient(135deg,#f0b84a,#d4537e,#6b2fd4);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.nav-links{display:flex;align-items:center;gap:20px}.nav-links a{font-size:.82rem;font-weight:500;color:var(--dim);text-decoration:none;letter-spacing:.04em;text-transform:uppercase;transition:color .2s}.nav-links a:hover{color:var(--white)}.ncta{color:var(--gold)!important;border:1px solid var(--gold-dim);padding:6px 15px;border-radius:4px}.ncta:hover{background:var(--gold-dim)}
        .breadcrumb{padding:88px 0 0;font-size:.82rem;color:var(--dim)}.breadcrumb a{color:var(--dim);text-decoration:none}.breadcrumb a:hover{color:var(--gold)}
        .hero{padding:28px 0 48px;position:relative;overflow:hidden;text-align:center}.hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(107,47,212,.08) 0%,transparent 50%);pointer-events:none}
        .eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:.72rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);margin-bottom:20px;padding:5px 14px;border:1px solid var(--gold-dim);border-radius:100px;background:rgba(240,184,74,.06)}
        h1{font-family:var(--font-display);font-size:clamp(2.2rem,5.5vw,3.8rem);font-weight:900;line-height:1.08;letter-spacing:-.02em;margin-bottom:18px}h1 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .hero-sub{font-size:1.05rem;color:var(--dim);max-width:640px;line-height:1.72;margin:0 auto 40px}
        .prose{font-size:1rem;color:rgba(232,228,240,0.78);line-height:1.82;max-width:780px}.prose p{margin-bottom:22px}.prose strong{color:var(--white);font-weight:600}.prose a{color:var(--gold);text-decoration:underline;text-decoration-color:rgba(240,184,74,.3)}.prose a.bp,.prose a.bs{color:#fff;text-decoration:none}.prose a:hover{text-decoration-color:var(--gold)}.prose h2{font-family:var(--font-display);font-size:clamp(1.5rem,3vw,2rem);font-weight:800;line-height:1.15;margin:56px 0 18px;color:var(--white)}.prose h2 em{font-style:italic;background:linear-gradient(135deg,#f0b84a,#d4537e);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .related-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px;margin:32px 0 48px}.related-card{background:var(--card);border:0.5px solid var(--border);border-radius:12px;padding:18px 16px;text-decoration:none;transition:border-color .2s,transform .15s}.related-card:hover{border-color:rgba(107,47,212,.3);transform:translateY(-2px)}.related-card-title{font-family:var(--font-display);font-size:.95rem;font-weight:700;color:var(--white);margin-bottom:4px}.related-card-desc{font-size:.8rem;color:var(--dim);line-height:1.5}
        .footer{border-top:1px solid var(--border);padding:48px 0 30px;margin-top:64px}.fi{display:flex;align-items:flex-start;justify-content:space-between;gap:36px;flex-wrap:wrap;margin-bottom:36px}.fb p{font-size:.82rem;color:var(--dim);max-width:240px;line-height:1.6;margin-top:8px}.fl h4{font-size:.7rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--dim);margin-bottom:14px}.fl ul{list-style:none;display:flex;flex-direction:column;gap:10px}.fl a{font-size:.83rem;color:rgba(232,228,240,.35);text-decoration:none;transition:color .2s}.fl a:hover{color:var(--white)}.fb2{border-top:1px solid var(--border);padding-top:22px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px}.disc{font-size:.73rem;color:rgba(232,228,240,.25);max-width:520px;line-height:1.55}.copy{font-size:.73rem;color:rgba(232,228,240,.2)}
        .slinks{display:flex;gap:10px;margin-top:14px}.sl2{display:flex;align-items:center;justify-content:center;width:36px;height:36px;border:0.5px solid var(--border);border-radius:8px;color:var(--dim);text-decoration:none;font-size:.82rem;font-weight:700;transition:all .2s}.sl2:hover{border-color:rgba(107,47,212,.4);color:var(--gold);background:rgba(107,47,212,.1)}
        @media(max-width:768px){.nav-links{display:none}.fi{flex-direction:column;gap:28px}.fb2{flex-direction:column;align-items:flex-start}.related-grid{grid-template-columns:1fr}.c{padding:0 16px}}
      `}</style>

      <nav className="nav"><div className="c nav-i"><a className="logo" href="/"><img src="/mascot.png" alt="BluntChart" width={34} height={34} style={{borderRadius:"50%"}}/><span className="g">BluntChart</span></a><div className="nav-links"><a href="/#try-it">Get Reading</a><a href="/free-birth-chart">Free Chart</a><a href="/mercury-retrograde-2026">Mercury Rx 2026</a><a className="ncta" href="/#try-it">Full Reading $15</a></div></div></nav>

      <div className="c"><nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">BluntChart</a><span style={{margin:"0 8px",opacity:.4}}>/</span><span style={{color:"var(--white)"}}>Saturn Return Calculator</span></nav></div>

      <header className="hero"><div className="hero-bg"/>
        <div className="c">
          <div className="eyebrow">♄ Free Saturn Return Calculator</div>
          <h1>When is your Saturn Return?<br/><em>And what is it actually testing?</em></h1>
          <p className="hero-sub">Saturn Return hits between ages 27–30 and it tests whether the life you built is actually yours. Enter your birth date below. We&apos;ll tell you your Saturn sign, your exact return dates, and what Saturn is confronting you with — in plain language, no sugarcoating.</p>
        </div>
      </header>

      <main><div className="c">
        <SaturnCalculator />

        <article className="prose" style={{ marginTop:64 }}>
          <h2>What is a Saturn Return — and <em>why does it wreck people?</em></h2>
          <p>Saturn takes 29.5 years to orbit the Sun. When it returns to the exact position it held when you were born, that&apos;s your Saturn Return. It happens roughly at ages 27–30, again at 56–60, and (if you make it) at 85–88. The first one is the big one. The one TikTok won&apos;t shut up about. The one that statistically aligns with a spike in career changes, divorces, quarter-life crises, and therapy intake forms.</p>
          <p>Saturn is the planet of <strong>structure, consequence, and time</strong>. It rules the things you can&apos;t shortcut: discipline, responsibility, integrity, and the long-term consequences of your choices. When Saturn returns to its natal position, it audits everything. The career you chose because your parents expected it. The relationship you stayed in because leaving felt scarier. The identity you assembled from social media and peer pressure. Whatever isn&apos;t built on honest foundations, Saturn tests it — and what fails the test, collapses.</p>
          <p>This isn&apos;t punishment. It&apos;s renovation. The structures that survive your Saturn Return are genuinely yours. The ones that don&apos;t were never going to last anyway. Saturn just accelerates the timeline.</p>

          <h2>Who is in their Saturn Return <em>right now in 2026?</em></h2>
          <p><strong>Saturn entered Aries in February 2026</strong> and stays until April 2028. That means everyone born between approximately April 1996 and June 1998 — with natal Saturn in Aries — is currently in their first Saturn Return. If you were born in 1996, 1997, or 1998 and your life has recently felt like it&apos;s being dismantled and reassembled without your permission, this is why.</p>
          <p>Those born between March 1967 and April 1969 are experiencing their second Saturn Return in Aries — a mid-life review of leadership, independence, and whether the authority you&apos;ve built serves who you actually are.</p>
          <p>Meanwhile, those born 1993–1996 (Saturn in Pisces) have just completed their first return. If you survived a spiritual crisis, an addiction reckoning, or a fundamental dissolution of your old identity between 2023 and early 2026 — that was Saturn. You made it through. Now build on what&apos;s left.</p>

          <h2>How does Saturn Return interact with <em>your full birth chart?</em></h2>
          <p>The calculator above tells you your Saturn <strong>sign</strong> — which determines the theme of your return. But which <strong>house</strong> Saturn occupies in your natal chart determines where the return lands. Saturn in Aries in your 4th house tests your home and family foundations. The exact same Saturn in your 10th house tests your career and public image. Same sign, completely different crisis.</p>
          <p>Then there are <strong>aspects</strong> — the angles Saturn makes to your other natal planets. Saturn conjunct your Moon? Emotional reckoning. Saturn square your Venus? Relationship restructuring. Saturn opposite your Sun? Identity overhaul. The sign tells you what. The house tells you where. The aspects tell you how intense. You need your <a href="/free-birth-chart">full birth chart</a> to see the complete picture.</p>

          <h2>Saturn Return <em>FAQ</em></h2>
        </article>

        <div style={{maxWidth:780,marginBottom:48}}>
          {FAQS.map((f,i)=>(
            <details key={i} style={{borderBottom:"0.5px solid rgba(255,255,255,0.08)"}}>
              <summary style={{padding:"22px 0",cursor:"pointer",listStyle:"none",display:"flex",alignItems:"center",justifyContent:"space-between",gap:16,fontSize:".97rem",fontWeight:600,color:"#e8e4f0",lineHeight:1.45}}>
                <span style={{flex:1}}>{f.q}</span>
                <span style={{width:26,height:26,borderRadius:"50%",border:"0.5px solid rgba(255,255,255,.12)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:14,color:"#6b2fd4",fontWeight:700}}>+</span>
              </summary>
              <p style={{fontSize:".89rem",color:"rgba(232,228,240,.65)",lineHeight:1.78,paddingBottom:22,paddingRight:40}}>{f.a}</p>
            </details>
          ))}
        </div>

        <article className="prose"><h2>Related <em>free tools</em></h2></article>
        <div className="related-grid">
          <a className="related-card" href="/free-birth-chart"><div className="related-card-title">Free Birth Chart</div><div className="related-card-desc">Full natal chart — find your Saturn house placement and aspects.</div></a>
          <a className="related-card" href="/rising-sign-calculator"><div className="related-card-title">Rising Sign Calculator</div><div className="related-card-desc">Your Ascendant determines which house Saturn occupies.</div></a>
          <a className="related-card" href="/mercury-retrograde-2026"><div className="related-card-title">Mercury Retrograde 2026</div><div className="related-card-desc">All three retrograde dates, shadow periods, and sign effects.</div></a>
          <a className="related-card" href="/is-mercury-retrograde"><div className="related-card-title">Is Mercury Retrograde?</div><div className="related-card-desc">Live status checker with countdown timer.</div></a>
          <a className="related-card" href="/big-three-calculator"><div className="related-card-title">Big Three Calculator</div><div className="related-card-desc">Sun, Moon, Rising — the three placements that define you.</div></a>
          <a className="related-card" href="/why-you-attract-the-wrong-person"><div className="related-card-title">Why You Attract the Wrong Person</div><div className="related-card-desc">Your Venus and 7th house explain the pattern. Brutally.</div></a>
        </div>

        <div style={{fontSize:".78rem",color:"rgba(232,228,240,.3)",textAlign:"center",marginTop:48}}>For entertainment purposes only · Not professional advice · Saturn sign dates are approximate due to retrograde motion</div>
      </div></main>

      </>
  );
}