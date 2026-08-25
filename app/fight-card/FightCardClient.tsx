"use client";

import Link from "next/link";
import { useState } from "react";

const TAGS = ["chaser", "wall", "fixer", "ghost"] as const;
type Tag = (typeof TAGS)[number];

const QUESTIONS: { qnum: string; text: string; opts: { tag: Tag; label: string }[] }[] = [
  {
    qnum: "Question 1 of 3",
    text: "Mid-argument, you're more likely to —",
    opts: [
      { tag: "chaser", label: "Keep talking, even if it comes out wrong" },
      { tag: "wall", label: "Go quiet and need a minute" },
      { tag: "fixer", label: "Try to fix it immediately, mid-sentence" },
      { tag: "ghost", label: "Change the subject, or leave the room" },
    ],
  },
  {
    qnum: "Question 2 of 3",
    text: "What actually calms you down?",
    opts: [
      { tag: "chaser", label: "Being told the conversation isn't over" },
      { tag: "wall", label: "Space, then coming back on your own terms" },
      { tag: "fixer", label: "A concrete next step, however small" },
      { tag: "ghost", label: "Time completely away from the topic" },
    ],
  },
  {
    qnum: "Question 3 of 3",
    text: "If a fight isn't resolved by bedtime, you —",
    opts: [
      { tag: "chaser", label: "Bring it up again the next day" },
      { tag: "wall", label: "Consider it handled, no need to reopen it" },
      { tag: "fixer", label: "Send a text with a proposed solution" },
      { tag: "ghost", label: "Genuinely forget, until it happens again" },
    ],
  },
];

const RESULTS: Record<Tag, { title: string; body: string; pivot: string }> = {
  chaser: {
    title: "The Chaser",
    body: "You measure love in response time. Silence doesn't feel neutral to you — it feels like an answer, and usually not a good one.",
    pivot: "Real pattern: this usually pairs with a Wall or a Ghost. Your Compatibility Reading names which one you've got, and the exact line that reaches them.",
  },
  wall: {
    title: "The Wall",
    body: "You're not avoiding the fight — you're avoiding saying something you can't take back. Space is maintenance to you, not rejection.",
    pivot: "Real pattern: your partner is very likely reading that pause as something worse than it is. Your reading spells out exactly what to say instead of the silence.",
  },
  fixer: {
    title: "The Fixer",
    body: "You skip the feeling and go straight for the solution. Efficient. Also, occasionally, the actual problem.",
    pivot: "Real pattern: your Compatibility Reading shows what your partner needs to hear before the fix — the step most Fixers skip without knowing it.",
  },
  ghost: {
    title: "The Ghost",
    body: "The fight doesn't end, it just stops being visible. That's not the same thing as resolved, even if it feels like it from your side.",
    pivot: "Real pattern: your reading's Relationship Timeline shows exactly where unresolved rounds like this tend to resurface later.",
  },
};

const FAQS = [
  {
    q: "Can I buy just the Fight Card, without the full reading?",
    a: "No — it's generated from data your Compatibility Reading already produces, so it ships as part of that $24 reading rather than as a separate purchase. Think of it as a bonus format of content you're already paying for, not an upsell on top of it.",
  },
  {
    q: "Is this a substitute for couples therapy?",
    a: "No. It's built to defuse one specific argument in the moment, using real repair-attempt research — not to replace a therapist, especially if the same fight is causing ongoing harm. If that's where you are, a card isn't the right tool, and we'd say so directly.",
  },
  {
    q: "What if we don't want a personalized card, just a generic one?",
    a: "Then a $15–$40 conversation deck from Amazon or the Gottman Institute's own shop is a genuinely good option, and we mean that. The Fight Card exists for people who want the specific line for their specific person, not a general framework.",
  },
  {
    q: "Does the quiz above use my real data?",
    a: "No — it's a three-question self-assessment for fun, not a calculation from your chart. Your actual pattern, computed from real synastry, is what the Compatibility Reading delivers.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`fitem2${open ? " open" : ""}`}>
      <div className="fq2" onClick={() => setOpen((o) => !o)}>
        <span>{q}</span>
        <span className="farrow2">▾</span>
      </div>
      <div className="fa2">
        <p>{a}</p>
      </div>
    </div>
  );
}

function Quiz() {
  const [tally, setTally] = useState<Record<Tag, number>>({ chaser: 0, wall: 0, fixer: 0, ghost: 0 });
  const [step, setStep] = useState(0);
  const [winner, setWinner] = useState<Tag | null>(null);

  function choose(tag: Tag) {
    const next = { ...tally, [tag]: tally[tag] + 1 };
    setTally(next);
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1);
    } else {
      let best: Tag = "chaser";
      let bestScore = -1;
      (Object.keys(next) as Tag[]).forEach((k) => {
        if (next[k] > bestScore) {
          bestScore = next[k];
          best = k;
        }
      });
      setWinner(best);
    }
  }

  function restart() {
    setTally({ chaser: 0, wall: 0, fixer: 0, ghost: 0 });
    setStep(0);
    setWinner(null);
  }

  if (winner) {
    const r = RESULTS[winner];
    return (
      <div className="qresult active">
        <div className="rtag">Your fight style</div>
        <h3>{r.title}</h3>
        <p>{r.body}</p>
        <p className="pivot">{r.pivot}</p>
        <a href="#bridge" className="btnA">Get the real read — $24</a><br />
        <span className="qrestart" onClick={restart}>Retake it</span>
      </div>
    );
  }

  const q = QUESTIONS[step];
  return (
    <>
      <div className="qstep active">
        <div className="qnum">{q.qnum}</div>
        <div className="qtext">{q.text}</div>
        {q.opts.map((o) => (
          <button key={o.tag} className="qopt" onClick={() => choose(o.tag)}>{o.label}</button>
        ))}
      </div>
      <div className="qdots">
        {QUESTIONS.map((_, i) => (
          <div key={i} className={`qdot${i <= step ? " on" : ""}`}></div>
        ))}
      </div>
    </>
  );
}

export default function FightCardClient() {
  return (
    <>
      <link rel="canonical" href="https://bluntchart.com/fight-card" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&display=swap');
        .fcpg{
          --paper:#F2ECDD; --paper2:#E8E0CB; --paper3:#DED3B5;
          --ink:#2A251E; --ink-dim:#6B6252; --line:#D2C6A6;
          --teal:#1F6F65; --teal-d:#164F47; --rust:#B5582E; --rust-d:#8A421E;
          --cta:#A63B26; --cta-d:#832B19; --sage:#5D7D4E; --warn:#9C3B2E;
        }
        .fcpg *{box-sizing:border-box}
        .fcpg{background:var(--paper);color:var(--ink);font-family:'Inter',system-ui,sans-serif;line-height:1.6;
          background-image:radial-gradient(ellipse 60% 40% at 85% 0%, rgba(181,88,46,.06), transparent),
          radial-gradient(ellipse 50% 35% at 10% 15%, rgba(31,111,101,.06), transparent);}
        .fcpg .wrap{max-width:900px;margin:0 auto;padding:0 20px}
        .fcpg h1,.fcpg h2,.fcpg h3{font-family:'Space Grotesk',sans-serif}
        .fcpg em{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-weight:400}
        .fcpg a{color:inherit}

        .fcpg .topbar{display:flex;justify-content:space-between;align-items:center;padding:18px 0;border-bottom:1px solid var(--line)}
        .fcpg .logo{font-family:'Space Grotesk';font-weight:700;font-size:19px;color:var(--ink);text-decoration:none}
        .fcpg .logo b{color:var(--cta)}
        .fcpg .navlinks{display:flex;gap:22px;font-size:13px;color:var(--ink-dim)}
        .fcpg .navlinks a{text-decoration:none}
        .fcpg .navlinks a:hover{color:var(--ink)}
        .fcpg .crumb{font-size:11.5px;color:var(--ink-dim);padding:14px 0 0}
        .fcpg .crumb b{color:var(--rust);font-weight:600}

        .fcpg section{padding:56px 0}
        .fcpg .kicker{font-size:11.5px;letter-spacing:.2em;text-transform:uppercase;color:var(--rust-d);margin-bottom:10px;text-align:center;font-weight:600}
        .fcpg h2{font-size:clamp(22px,4vw,30px);letter-spacing:-.02em;margin-bottom:12px;text-align:center;color:var(--ink)}
        .fcpg h2 em{color:var(--cta)}
        .fcpg .lede{color:var(--ink-dim);max-width:560px;margin:0 auto 30px;font-size:14.5px;text-align:center}

        .fcpg .hero{text-align:center;padding:46px 0 10px}
        .fcpg .eyebrow{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--teal-d);border:1px solid var(--teal);display:inline-block;padding:6px 16px;border-radius:99px;margin-bottom:22px;background:rgba(31,111,101,.07)}
        .fcpg .hero h1{font-size:clamp(30px,5.2vw,44px);letter-spacing:-.03em;line-height:1.14;max-width:680px;margin:0 auto 16px;color:var(--ink)}
        .fcpg .hero h1 em{color:var(--cta)}
        .fcpg .hero-sub{color:var(--ink-dim);max-width:520px;margin:0 auto 30px;font-size:15px}
        .fcpg .herobtns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-bottom:8px}
        .fcpg .btnA{background:var(--cta);color:var(--paper);border:none;font-family:'Space Grotesk';font-weight:700;font-size:14px;padding:14px 26px;border-radius:8px;text-decoration:none;box-shadow:0 6px 0 var(--cta-d);transition:transform .15s;display:inline-block;cursor:pointer}
        .fcpg .btnA:hover{transform:translateY(2px);box-shadow:0 4px 0 var(--cta-d)}
        .fcpg .btnB{background:transparent;color:var(--ink);border:1.5px solid var(--ink);font-family:'Space Grotesk';font-weight:700;font-size:14px;padding:13px 24px;border-radius:8px;text-decoration:none}
        .fcpg .btnB:hover{background:var(--paper2)}

        .fcpg .cardstage{max-width:640px;margin:44px auto 0;padding:20px 0 30px}
        .fcpg .cardobj{position:relative;background:#FBF7ED;border-radius:14px;box-shadow:0 22px 44px rgba(42,37,30,.18), 0 2px 0 rgba(42,37,30,.06);
          transform:rotate(-1.1deg);padding:6px;transition:transform .35s ease}
        .fcpg .cardobj:hover{transform:rotate(0deg) translateY(-4px)}
        .fcpg .grain{position:absolute;inset:0;opacity:.05;mix-blend-mode:multiply;pointer-events:none;border-radius:14px}
        .fcpg .cardhalves{display:grid;grid-template-columns:1fr 1fr;position:relative;border-radius:10px;overflow:hidden}
        @media(max-width:560px){.fcpg .cardhalves{grid-template-columns:1fr}}
        .fcpg .chalf{padding:26px 24px 24px;position:relative}
        .fcpg .chalf.her{background:linear-gradient(165deg,#EAF3F0,#DCEBE6)}
        .fcpg .chalf.him{background:linear-gradient(165deg,#F7EBE0,#F0DCC7)}
        .fcpg .seam{position:absolute;top:0;bottom:0;left:50%;width:0;border-left:2px dashed rgba(42,37,30,.35);transform:translateX(-1px);z-index:2}
        @media(max-width:560px){.fcpg .seam{display:none}}
        .fcpg .snip{position:absolute;top:-11px;left:50%;transform:translateX(-50%) rotate(90deg);font-size:13px;color:var(--ink-dim);background:var(--paper);padding:0 4px;z-index:3}
        @media(max-width:560px){.fcpg .snip{display:none}}
        .fcpg .calert{display:inline-block;font-family:'Space Grotesk';font-weight:700;font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:#fff;padding:4px 10px;border-radius:99px;margin-bottom:12px}
        .fcpg .chalf.her .calert{background:var(--teal)}
        .fcpg .chalf.him .calert{background:var(--rust)}
        .fcpg .chalf h3{font-size:15px;margin-bottom:2px;color:var(--ink)}
        .fcpg .chalf .sub{font-family:'Instrument Serif',Georgia,serif;font-style:italic;font-size:12.5px;color:var(--ink-dim);margin-bottom:14px}
        .fcpg .chalf ul{list-style:none;margin:0;padding:0}
        .fcpg .chalf li{font-size:12.8px;color:#332c22;padding:5px 0 5px 22px;position:relative;line-height:1.5}
        .fcpg .chalf li::before{content:"✓";position:absolute;left:2px;font-weight:700}
        .fcpg .chalf.her li::before{color:var(--teal-d)}
        .fcpg .chalf.him li::before{color:var(--rust-d)}
        .fcpg .chalf li.x::before{content:"✗";color:var(--warn)}
        .fcpg .cline{height:1px;background:rgba(42,37,30,.15);margin:12px 0}
        .fcpg .script{font-size:11.5px;color:#332c22;background:rgba(255,255,255,.5);border:1px solid rgba(42,37,30,.12);border-radius:8px;padding:9px 11px;font-family:'Instrument Serif',Georgia,serif;font-style:italic;line-height:1.5}
        .fcpg .cshared{background:#F0EADA;border-top:2px dashed rgba(42,37,30,.25);padding:16px 22px;text-align:center;position:relative}
        .fcpg .cshared h4{font-family:'Space Grotesk';font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--ink-dim);margin-bottom:7px}
        .fcpg .cshared p{font-size:12.5px;color:#332c22;max-width:480px;margin:0 auto}
        .fcpg .cshared p em{color:var(--cta)}
        .fcpg .cardfoot{text-align:center;font-size:10px;color:var(--ink-dim);letter-spacing:.1em;text-transform:uppercase;padding:8px 0 2px}

        .fcpg .research{max-width:680px;margin:0 auto}
        .fcpg .research p{color:#332c22;font-size:14.5px;margin-bottom:14px}
        .fcpg .research b{color:var(--ink)}
        .fcpg .statrow{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:24px 0}
        @media(max-width:560px){.fcpg .statrow{grid-template-columns:1fr}}
        .fcpg .statcard{background:var(--paper2);border:1px solid var(--line);border-radius:14px;padding:18px 20px}
        .fcpg .statcard .num{font-family:'Space Grotesk';font-weight:700;font-size:28px;color:var(--cta)}
        .fcpg .statcard p{font-size:12.5px;color:var(--ink-dim);margin:6px 0 0}

        .fcpg .compare2{display:grid;grid-template-columns:1fr 1fr;gap:18px;max-width:720px;margin:0 auto}
        @media(max-width:640px){.fcpg .compare2{grid-template-columns:1fr}}
        .fcpg .cpanel2{background:var(--paper2);border:1px solid var(--line);border-radius:16px;padding:22px}
        .fcpg .cpanel2 h3{font-size:13px;letter-spacing:.05em;text-transform:uppercase;margin-bottom:14px;color:var(--ink-dim)}
        .fcpg .cpanel2.good h3{color:var(--teal-d)}
        .fcpg .cpanel2 ul{list-style:none;margin:0;padding:0}
        .fcpg .cpanel2 li{font-size:13.5px;color:#332c22;padding:6px 0 6px 22px;position:relative;line-height:1.5}
        .fcpg .cpanel2.bad li::before{content:"✗";position:absolute;left:0;color:var(--warn)}
        .fcpg .cpanel2.good li::before{content:"✓";position:absolute;left:0;color:var(--teal-d);font-weight:700}

        .fcpg .formatrow{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;max-width:700px;margin:0 auto}
        .fcpg .fmt{background:var(--paper2);border:1px solid var(--line);border-radius:14px;padding:16px 20px;text-align:center;flex:1;min-width:160px}
        .fcpg .fmt .ic{font-size:20px;margin-bottom:6px}
        .fcpg .fmt h4{font-family:'Space Grotesk';font-size:13px;margin-bottom:4px}
        .fcpg .fmt p{font-size:11.5px;color:var(--ink-dim)}

        .fcpg .quizbox{max-width:520px;margin:0 auto;background:var(--paper2);border:1px solid var(--line);border-radius:20px;padding:28px 26px}
        .fcpg .qnum{font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--rust-d);margin-bottom:10px}
        .fcpg .qtext{font-family:'Space Grotesk';font-size:17px;margin-bottom:16px;color:var(--ink)}
        .fcpg .qopt{display:block;width:100%;text-align:left;background:var(--paper);border:1.5px solid var(--line);border-radius:10px;padding:12px 16px;margin-bottom:9px;cursor:pointer;font-family:'Inter';font-size:13.5px;color:var(--ink);transition:border-color .15s}
        .fcpg .qopt:hover{border-color:var(--rust)}
        .fcpg .qresult{text-align:center}
        .fcpg .qresult .rtag{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--teal-d);margin-bottom:6px}
        .fcpg .qresult h3{font-family:'Space Grotesk';font-size:22px;margin-bottom:10px}
        .fcpg .qresult p{color:#332c22;font-size:13.5px;margin-bottom:10px}
        .fcpg .qresult .pivot{font-family:'Instrument Serif',Georgia,serif;font-style:italic;color:var(--ink-dim);font-size:13.5px;margin-bottom:18px}
        .fcpg .qrestart{font-size:11.5px;color:var(--ink-dim);text-decoration:underline;cursor:pointer;display:inline-block;margin-top:8px}
        .fcpg .qdots{display:flex;gap:6px;justify-content:center;margin-top:18px}
        .fcpg .qdot{width:6px;height:6px;border-radius:50%;background:var(--line)}
        .fcpg .qdot.on{background:var(--rust)}

        .fcpg .bridge2{max-width:640px;margin:0 auto;background:linear-gradient(165deg,#F7EBE0,#EAF3F0);border:1px solid var(--line);border-radius:22px;padding:32px 28px;text-align:center}
        .fcpg .bridge2 h3{font-size:21px;margin-bottom:10px}
        .fcpg .bridge2 p{color:var(--ink-dim);font-size:13.5px;max-width:460px;margin:0 auto 20px}

        .fcpg .faq2{max-width:680px;margin:0 auto}
        .fcpg .fitem2{border-bottom:1px solid var(--line)}
        .fcpg .fq2{display:flex;justify-content:space-between;align-items:center;padding:16px 4px;cursor:pointer;font-family:'Space Grotesk';font-size:14.5px}
        .fcpg .farrow2{color:var(--rust-d);transition:transform .3s ease}
        .fcpg .fitem2.open .farrow2{transform:rotate(180deg)}
        .fcpg .fa2{max-height:0;overflow:hidden;transition:max-height .5s ease}
        .fcpg .fitem2.open .fa2{max-height:220px}
        .fcpg .fa2 p{font-size:13.5px;color:var(--ink-dim);padding:0 4px 16px;line-height:1.6}
      `}</style>

      <div className="fcpg">
        <div className="wrap topbar">
          <Link href="/" className="logo">Blunt<b>Chart</b></Link>
          <div className="navlinks">
            <Link href="/#try-it">Birth Chart</Link>
            <Link href="/#waitlist">Compatibility</Link>
            <Link href="/moon-phase-soulmate-calculator">Moon Phase Match</Link>
          </div>
        </div>
        <div className="wrap crumb"><Link href="/">BluntChart</Link> / <b>The Fight Card</b></div>

        {/* ================= HERO ================= */}
        <div className="wrap"><div className="hero">
          <div className="eyebrow">Included free with every Compatibility Reading · built on Gottman&apos;s repair-attempt research</div>
          <h1>What to say when you&apos;re <em>actually fighting.</em></h1>
          <p className="hero-sub">Not a deck of a thousand strangers&apos; prompts. A two-sided wallet card built from your actual synastry — what to say, what not to say, and the one line that de-escalates your specific pattern.</p>
          <div className="herobtns">
            <a href="#bridge" className="btnA">See how you get yours — $24</a>
            <a href="#sample" className="btnB">See a real one first</a>
          </div>
        </div></div>

        {/* ================= CARD OBJECT ================= */}
        <div className="wrap"><div className="cardstage" id="sample">
          <div className="cardobj">
            <svg className="grain" width="100%" height="100%" preserveAspectRatio="none">
              <filter id="paperNoise"><feTurbulence type="fractalNoise" baseFrequency={0.9} numOctaves={2} stitchTiles="stitch" /></filter>
              <rect width="100%" height="100%" filter="url(#paperNoise)" />
            </svg>
            <div className="snip">✂ cut here</div>
            <div className="cardhalves">
              <div className="seam"></div>
              <div className="chalf her">
                <div className="calert">Reading this mid-fight?</div>
                <h3>Jake — this card is for you</h3>
                <div className="sub">How to fight with Emma without losing her</div>
                <ul>
                  <li>Say something. Anything. To her, silence feels like losing — even when that&apos;s not what you mean.</li>
                  <li>Agree first, fix later. &quot;That makes sense&quot; buys you ten minutes to actually think.</li>
                  <li>Give her a deadline: &quot;Give me an hour, I promise we&apos;ll finish this.&quot;</li>
                  <li className="x">Don&apos;t go cold and quiet. She won&apos;t read it as &quot;thinking.&quot; She&apos;ll read it as &quot;you don&apos;t care.&quot;</li>
                </ul>
                <div className="cline"></div>
                <div className="script">Say this: &quot;I&apos;m not walking away from this. I just need a minute to get it right.&quot;</div>
              </div>
              <div className="chalf him">
                <div className="calert">Reading this mid-fight?</div>
                <h3>Emma — this card is for you</h3>
                <div className="sub">How to fight with Jake without losing him</div>
                <ul>
                  <li>Give him the minute. His silence is his brain working, not him checking out.</li>
                  <li>Say what you need, not what he did wrong. &quot;I need to feel picked&quot; lands better than &quot;you always...&quot;</li>
                  <li>Pick one issue and stick to it. Old fights won&apos;t help tonight&apos;s fight.</li>
                  <li className="x">Don&apos;t threaten to leave to make a point. He&apos;ll remember it long after you&apos;ve forgotten saying it.</li>
                </ul>
                <div className="cline"></div>
                <div className="script">Say this: &quot;I&apos;m not attacking you. I just need to know I still matter to you.&quot;</div>
              </div>
            </div>
            <div className="cshared">
              <h4>Both of you — the pattern in one line</h4>
              <p>She hears love in <em>speed</em>. He hears love in <em>certainty</em>. That&apos;s not a compatibility problem — it&apos;s a <em>translation</em> problem.</p>
            </div>
          </div>
          <div className="cardfoot">A real sample · wallet PDF, fridge version, and two lock-screen wallpapers ship with every reading</div>
        </div></div>

        {/* ================= RESEARCH ================= */}
        <div className="wrap"><section>
          <div className="kicker">This isn&apos;t a vibes-based conversation deck</div>
          <h2>Built on the one thing decades of research agrees on</h2>
          <div className="research">
            <p>Psychologist John Gottman spent decades recording real couples arguing, and found the split between couples who last and couples who don&apos;t isn&apos;t whether they fight. It&apos;s whether they make — and accept — <b>repair attempts</b>: any small move, verbal or not, that stops a fight from escalating before it does real damage.</p>
            <p>The catch: repair attempts fail constantly, not because they&apos;re the wrong idea, but because they&apos;re delivered in the wrong words, at the wrong moment, in a pattern neither partner can see from inside the argument. That&apos;s the actual gap a card can close — not &quot;communicate better&quot; as a concept, but the specific sentence that lands for the specific person you&apos;re fighting with.</p>
            <div className="statrow">
              <div className="statcard"><div className="num">69%</div><p>of relationship conflicts are &quot;perpetual&quot; — never fully solved, only ever managed well or managed badly. (Gottman Institute)</p></div>
              <div className="statcard"><div className="num">5:1</div><p>ratio of positive to negative moments that defines relationships built to last — repair attempts are how couples get there. (Gottman Institute)</p></div>
            </div>
            <p>Generic decks teach the concept. Yours is built from your actual chase-and-withdraw pattern, so the card doesn&apos;t ask you to improvise a repair attempt mid-flood — it just hands you the one that already works on your specific person.</p>
          </div>
        </section></div>

        {/* ================= COMPARE ================= */}
        <div className="wrap"><section>
          <div className="kicker">Why not just buy a card deck</div>
          <h2>Generic decks vs. <em>a card that already knows you</em></h2>
          <div className="compare2">
            <div className="cpanel2 bad">
              <h3>A $15–$40 conversation deck</h3>
              <ul>
                <li>Same 125 prompts as every other couple who bought it</li>
                <li>Built for calm conversation, not an active fight</li>
                <li>Requires browsing a box mid-argument</li>
                <li>Teaches the concept of repair, not your pattern</li>
              </ul>
            </div>
            <div className="cpanel2 good">
              <h3>Your Fight Card</h3>
              <ul>
                <li>Written from your actual synastry — chase, withdraw, triggers</li>
                <li>Built for the fight already happening</li>
                <li>One card, already in your wallet, nothing to search for</li>
                <li>Zero extra cost — it&apos;s a re-layout of your reading&apos;s own content</li>
              </ul>
            </div>
          </div>
        </section></div>

        {/* ================= FORMATS ================= */}
        <div className="wrap"><section>
          <div className="kicker">However you&apos;ll actually use it</div>
          <h2>Wallet, fridge, <em>or lock screen.</em></h2>
          <div className="formatrow">
            <div className="fmt"><div className="ic">🪪</div><h4>Wallet PDF</h4><p>Print-ready, two cards + a fridge version</p></div>
            <div className="fmt"><div className="ic">📱</div><h4>Lock screens</h4><p>Two matching wallpapers, one per person</p></div>
            <div className="fmt"><div className="ic">🧊</div><h4>Fridge version</h4><p>Both sides, one page, for the kitchen</p></div>
          </div>
        </section></div>

        {/* ================= QUIZ ================= */}
        <div className="wrap"><section>
          <div className="kicker">Before you go</div>
          <h2>What&apos;s your fight style?</h2>
          <p className="lede">Three questions. Then we&apos;ll tell you what it actually means.</p>
          <div className="quizbox" id="quizbox">
            <Quiz />
          </div>
        </section></div>

        {/* ================= BRIDGE ================= */}
        <div className="wrap"><section id="bridge">
          <div className="bridge2">
            <h3>The card is free. It just needs a reading first.</h3>
            <p>The Fight Card isn&apos;t sold on its own — it&apos;s generated from your Compatibility Reading, which also covers your Fight Decoder, Attraction Chemistry, Green and Red Flags, and the full pattern behind every version of this fight you&apos;ve had.</p>
            <Link href="/#waitlist" className="btnA">Get your Compatibility Reading — $24</Link>
          </div>
        </section></div>

        {/* ================= FAQ ================= */}
        <div className="wrap"><section>
          <div className="kicker">Common questions</div>
          <h2>Everything you&apos;re <em>wondering about.</em></h2>
          <div className="faq2" id="faq2">
            {FAQS.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </section></div>
      </div>
    </>
  );
}
