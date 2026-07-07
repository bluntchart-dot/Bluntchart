"use client";

import { useState } from "react";

interface Option { t: string; w: number; }
interface Question { q: string; cat: string; opts: Option[]; }

const QUESTIONS: Question[] = [
  {
    q: "You match with someone. Within 3 days, they're saying you're 'different.' You:",
    cat: "love-bombing",
    opts: [
      { t: "Suspicious. Take it slow.", w: 0 },
      { t: "Enjoy it, but stay grounded", w: 1 },
      { t: "Start planning the wedding a little", w: 2 },
      { t: "Full send. This is the one.", w: 3 },
    ],
  },
  {
    q: "Your last three exes had one thing in common. It was:",
    cat: "unavailable",
    opts: [
      { t: "Nothing, actually different people", w: 0 },
      { t: "Similar values", w: 1 },
      { t: "Emotionally busy or 'not ready'", w: 2 },
      { t: "Unavailable. All three.", w: 3 },
    ],
  },
  {
    q: "You start really liking someone. The version of them you fall for is:",
    cat: "fantasy",
    opts: [
      { t: "The real version", w: 0 },
      { t: "Real but with hope for the best", w: 1 },
      { t: "The one they show at their best", w: 2 },
      { t: "The one who could exist if I love them enough", w: 3 },
    ],
  },
  {
    q: "Your partner did something that hurt you. First reaction:",
    cat: "reactive",
    opts: [
      { t: "Take a beat, then say something", w: 0 },
      { t: "Speak up right away, calmly", w: 1 },
      { t: "React sharp, apologize later", w: 2 },
      { t: "Go off. Regret handling it, not the point.", w: 3 },
    ],
  },
  {
    q: "You're upset with someone you love. Instead of saying it, you:",
    cat: "silent",
    opts: [
      { t: "I say it", w: 0 },
      { t: "I take a night, then say it", w: 1 },
      { t: "Get quiet until they ask", w: 2 },
      { t: "Emotionally check out. Punishment mode.", w: 3 },
    ],
  },
  {
    q: "During a fight, you:",
    cat: "score",
    opts: [
      { t: "Stay on the current thing", w: 0 },
      { t: "Mention past stuff once", w: 1 },
      { t: "Bring up past things to make a point", w: 2 },
      { t: "I remember everything. And I use it.", w: 3 },
    ],
  },
  {
    q: "Your person is out. They haven't replied in 4 hours. You:",
    cat: "anxious",
    opts: [
      { t: "Don't notice", w: 0 },
      { t: "Notice, don't care", w: 1 },
      { t: "Send a second message. Then a third.", w: 2 },
      { t: "Convince myself something is wrong", w: 3 },
    ],
  },
  {
    q: "You've had this thought: 'If they really loved me, they'd _____.' How often?",
    cat: "testing",
    opts: [
      { t: "Never really", w: 0 },
      { t: "Once in a while", w: 1 },
      { t: "Regularly", w: 2 },
      { t: "It's basically my baseline", w: 3 },
    ],
  },
  {
    q: "In your last relationship, how much of yourself did you still have at the end?",
    cat: "losing-self",
    opts: [
      { t: "All of me, plus growth", w: 0 },
      { t: "Most of me", w: 1 },
      { t: "Some. Rebuilt after.", w: 2 },
      { t: "Not much. Had to find myself again.", w: 3 },
    ],
  },
  {
    q: "In relationships you tend to be the one who:",
    cat: "control",
    opts: [
      { t: "Follows their lead", w: 0 },
      { t: "Balances between", w: 1 },
      { t: "Usually plans and organizes", w: 2 },
      { t: "Controls the pace. It's just easier.", w: 3 },
    ],
  },
];

const CATEGORIES: Record<string, { name: string; desc: string; planet: string }> = {
  "love-bombing": { name: "Love-Bombing", desc: "You go 100% too fast, then can't sustain it. Classic Venus in fire or Aries stellium energy.", planet: "Venus" },
  "unavailable": { name: "Picking Unavailable", desc: "You keep choosing people who can't fully show up. Often Venus square Saturn or Saturn in the 7th.", planet: "Venus/Saturn" },
  "fantasy": { name: "Fantasy Over Reality", desc: "You fall for potential, not reality. Neptune touching Venus is the usual suspect.", planet: "Venus/Neptune" },
  "reactive": { name: "Reactive Rupture", desc: "You hurt first, think later. Mars in fire or the 1st house at full volume.", planet: "Mars" },
  "silent": { name: "Silent Punishment", desc: "You go cold instead of saying you're hurt. Mars in water or Cancer/Scorpio Mars.", planet: "Mars" },
  "score": { name: "Score-Keeping", desc: "You remember everything and use it in future fights. Pluto in the 7th or Scorpio Mars.", planet: "Pluto" },
  "anxious": { name: "Anxious Pursuit", desc: "You chase when you sense distance. Moon square Saturn or Moon in the 7th.", planet: "Moon" },
  "testing": { name: "Emotional Testing", desc: "You create small crises to see if they'll stay. Moon-Pluto attachment work.", planet: "Moon/Pluto" },
  "losing-self": { name: "Losing Yourself", desc: "You merge so hard you forget who you were. Libra rising or 7th house heavy chart.", planet: "7th House" },
  "control": { name: "Control Games", desc: "You need to hold the power to feel safe. Pluto in the 7th or Scorpio Venus.", planet: "Pluto" },
};

const WORK_ON: Record<string, string> = {
  "love-bombing": "The next time you feel that huge early-relationship rush, wait 48 hours before making any commitment (verbal or otherwise). Your fire wants to sprint. Let it walk instead.",
  "unavailable": "For your next partner, use one rule: they must be able to say 'yes' or 'no' in the moment. If they can only give 'maybe,' that's the pattern you're rehearsing again.",
  "fantasy": "Write down three things about the last person you liked that were factually true — not potential, not hoped for. If the list is short, you were dating the projection.",
  "reactive": "When you feel the heat rising in an argument, name it out loud: 'I'm about to react.' Just saying it interrupts the loop. That's the whole practice.",
  "silent": "Silence feels like protection but reads as punishment. The unlock: send one honest sentence — 'that hurt' — even if you're not ready for a full conversation.",
  "score": "For one month, no bringing up anything more than 30 days old in a fight. If it's still bothering you, it's a separate conversation, not ammo.",
  "anxious": "When you feel the pull to chase, wait one hour before sending. Your nervous system is running old code. Give the new response time to load.",
  "testing": "The test always confirms what you already believe. Ask directly instead. It feels riskier and it's not.",
  "losing-self": "Keep one non-negotiable that doesn't include your partner: a friendship, a practice, a project. It's not selfish — it's what keeps you interesting.",
  "control": "Practice not knowing. Let a small thing be decided by them. Let a plan not exist. Your Pluto will insist you can't survive it. You can.",
};

function getVerdict(count: number) {
  if (count === 0) return {
    title: "Zero flags. Genuinely.",
    tag: "You either did the work or you were born grounded.",
    body: "This is rare and it's earned. Whatever process got you here — therapy, time, or good early attachment — is working. Keep the practices that got you here. You're the person your friends should be dating.",
  };
  if (count <= 2) return {
    title: "Occasionally messy, mostly grounded",
    tag: "You know the patterns. You mostly interrupt them.",
    body: "One or two patterns still show up when you're triggered, but you catch yourself most of the time. This is what growth looks like — not the absence of the wiring, but the ability to name it before it drives. Keep going.",
  };
  if (count <= 4) return {
    title: "The self-aware one",
    tag: "You know what you do. You don't always stop yourself.",
    body: "You have real insight into your patterns. The gap now is between what you know and what you do when you're activated. This is the frustrating middle — you can see the pattern happening in real time and still repeat it. That gap closes with practice, not more insight.",
  };
  if (count <= 6) return {
    title: "It's giving 'work in progress'",
    tag: "The patterns are running the show more than you'd like.",
    body: "You're not the problem in every relationship, but you're the through-line. The good news: you can see the flags on this list and name at least two exes who confirm them. The next step is picking one and only one to work on for the next three months. Not all of them.",
  };
  if (count <= 8) return {
    title: "The one your friends warn about",
    tag: "You already know. That's why you took this.",
    body: "This score isn't a character judgment — it's a mirror. The patterns are frequent and mostly unconscious. What people around you experience is intensity, unpredictability, and having to walk carefully. It's fixable. The chart has the exact wiring behind each pattern.",
  };
  return {
    title: "Almost every flag lit up",
    tag: "This isn't shame. It's information.",
    body: "You didn't get here by choice. The patterns are strong, they're old, and they run in the background. But every single one on this list is workable, and none of them define who you actually are. Therapy first, chart second. Both matter.",
  };
}

export default function RedFlagsQuiz() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);

  const start = () => {
    setStarted(true);
    setStep(0);
    setFinished(false);
    setScores({});
  };

  const answer = (w: number) => {
    const cat = QUESTIONS[step].cat;
    const next = { ...scores, [cat]: (scores[cat] || 0) + w };
    setScores(next);
    if (step + 1 >= QUESTIONS.length) {
      setFinished(true);
    } else {
      setStep(step + 1);
    }
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const flagCount = Object.values(scores).filter((v) => v >= 2).length;
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .filter(([, v]) => v > 0)
    .slice(0, 3);
  const topFlag = sorted.length > 0 ? sorted[0][0] : null;
  const verdict = getVerdict(flagCount);

  const share = () => {
    const topName = topFlag ? CATEGORIES[topFlag].name : "None";
    const text = `${flagCount}/10 red flags. Top pattern: ${topName}. "${verdict.tag}" — take it: bluntchart.com/relationship-red-flags-birth-chart`;
    if (navigator.share) {
      navigator.share({ title: "My Red Flag Count", text, url: "https://bluntchart.com/relationship-red-flags-birth-chart" }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      showToast("Copied to clipboard");
    }
  };

  const progressPct = finished ? 100 : started ? (step / QUESTIONS.length) * 100 : 0;
  const counterText = finished ? "10/10" : started ? `${step + 1}/10` : "0/10";
  const statusText = finished ? "Result" : started ? "Answer honestly" : "Ready when you are";

  return (
    <div className="quiz-shell">
      <div className="quiz-header">
        <span>{statusText}</span>
        <div className="progress-bar"><div className="progress-fill" style={{ width: `${progressPct}%` }} /></div>
        <span>{counterText}</span>
      </div>

      <div className="quiz-body">
        {!started && (
          <div className="start-screen fade-in">
            <h2>Answer honestly, or don&apos;t bother.</h2>
            <p>The friend version of you knows the truth already. Answer as that friend, not the version you post about.</p>
            <button className="btn-primary" onClick={start}>Start the test</button>
          </div>
        )}

        {started && !finished && (
          <div className="fade-in" key={step}>
            <div className="q-number">Question {String(step + 1).padStart(2, "0")}</div>
            <h3 className="q-text">{QUESTIONS[step].q}</h3>
            <div className="options">
              {QUESTIONS[step].opts.map((opt, i) => (
                <button className="option" key={i} onClick={() => answer(opt.w)}>
                  <span className="option-mark" />
                  <span>{opt.t}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {finished && (
          <div className="result-screen fade-in">
            <div className="flag-count-hero">
              <div className="flag-count-num">{flagCount}</div>
              <div className="flag-count-label">Red flags out of 10</div>
              <div className="flag-count-verdict">{verdict.title}</div>
              <div className="flag-count-tag">&quot;{verdict.tag}&quot;</div>
            </div>

            <div className="flag-body"><p>{verdict.body}</p></div>

            {sorted.length > 0 && (
              <>
                <div className="flag-cards-header">Your top {sorted.length} pattern{sorted.length > 1 ? "s" : ""}</div>
                <div className="flag-cards">
                  {sorted.map(([cat]) => {
                    const c = CATEGORIES[cat];
                    return (
                      <div className="flag-card" key={cat}>
                        <div className="flag-card-label">{c.planet}</div>
                        <div className="flag-card-name">{c.name}</div>
                        <div className="flag-card-desc">{c.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {topFlag && (
              <div className="work-on-card">
                <div className="work-on-label">One thing to work on</div>
                <div className="work-on-title">Start with {CATEGORIES[topFlag].name}</div>
                <div className="work-on-text">{WORK_ON[topFlag]}</div>
              </div>
            )}

            <div className="upsell">
              <div className="upsell-eyebrow">Want to see the actual placements?</div>
              <h3>Your chart has the receipts</h3>
              <p>This test measured behavior. Your birth chart shows the exact Venus, Mars, Moon and 7th house placements behind each pattern — and where the healthiest expression lives. Free, one minute.</p>
              <div className="upsell-features">
                <span>Venus + Mars breakdown</span>
                <span>7th house profile</span>
                <span>Personalized pattern report</span>
              </div>
              <a href="/free-birth-chart" className="btn-ember">Get my free chart</a>
            </div>

            <div className="share-row">
              <button className="share-btn" onClick={share}>Share this</button>
              <button className="share-btn" onClick={start}>Retake test</button>
            </div>
          </div>
        )}
      </div>

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
