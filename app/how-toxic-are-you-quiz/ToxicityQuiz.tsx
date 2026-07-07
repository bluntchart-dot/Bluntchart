"use client";

import { useState } from "react";

interface Option { t: string; w: number; }
interface Question { q: string; cat: string; opts: Option[]; }

const QUESTIONS: Question[] = [
  {
    q: "Someone cancels plans on you last-minute. What actually happens in your head?",
    cat: "reactive-anger",
    opts: [
      { t: "Cool, more time for me", w: 0 },
      { t: "Mildly annoyed, over it in an hour", w: 1 },
      { t: "Reply short and 'K.', then think about it all day", w: 2 },
      { t: "Draft a paragraph about respect. Consider sending it.", w: 3 },
    ],
  },
  {
    q: "Your partner is friends with an ex. Your honest first reaction?",
    cat: "jealousy",
    opts: [
      { t: "Fine, people have histories", w: 0 },
      { t: "A little weird but I trust them", w: 1 },
      { t: "I would check who liked their photos", w: 2 },
      { t: "This will end badly and I need to prepare", w: 3 },
    ],
  },
  {
    q: "You had a fight. They apologize first. You:",
    cat: "score-keeping",
    opts: [
      { t: "Apologize back, move on", w: 0 },
      { t: "Accept it but need a minute", w: 1 },
      { t: "Accept, but bring it up again in three weeks", w: 2 },
      { t: "Make them work for it a bit", w: 3 },
    ],
  },
  {
    q: "A friend gets the thing you wanted. Big win for them. You feel:",
    cat: "jealousy",
    opts: [
      { t: "Happy for them, genuinely", w: 0 },
      { t: "Happy and a little wistful", w: 1 },
      { t: "Fake-happy, real-annoyed", w: 2 },
      { t: "I need to know exactly how they did it", w: 3 },
    ],
  },
  {
    q: "Someone crosses a line with you. Your default:",
    cat: "stonewalling",
    opts: [
      { t: "Tell them right then", w: 0 },
      { t: "Bring it up when I've cooled off", w: 1 },
      { t: "Get quiet and pull back for a few days", w: 2 },
      { t: "Cut contact without a word", w: 3 },
    ],
  },
  {
    q: "In an argument, how often are you actually the one who was wrong?",
    cat: "blame",
    opts: [
      { t: "Honestly, pretty often", w: 0 },
      { t: "Sometimes, and I say so", w: 1 },
      { t: "Rarely. I usually have a point.", w: 2 },
      { t: "I don't really do 'wrong'", w: 3 },
    ],
  },
  {
    q: "Your ex is dating someone new. You:",
    cat: "obsession",
    opts: [
      { t: "Don't care, didn't check", w: 0 },
      { t: "Saw it once, moved on", w: 1 },
      { t: "Looked. Then looked at her friends.", w: 2 },
      { t: "Have thoughts about her that I keep to myself", w: 3 },
    ],
  },
  {
    q: "You want your partner to do something. You:",
    cat: "manipulation",
    opts: [
      { t: "Just ask them directly", w: 0 },
      { t: "Ask, and explain why it matters", w: 1 },
      { t: "Hint until they figure it out", w: 2 },
      { t: "Get quiet until they ask what's wrong", w: 3 },
    ],
  },
  {
    q: "How do things usually end for you when they end?",
    cat: "ghosting",
    opts: [
      { t: "Honest conversation, both agree", w: 0 },
      { t: "A hard talk but a clean ending", w: 1 },
      { t: "Slow fade, less texting, they get it", w: 2 },
      { t: "One day I'm gone. They can figure it out.", w: 3 },
    ],
  },
  {
    q: "Someone publicly embarrasses you. You:",
    cat: "ego",
    opts: [
      { t: "Laugh it off, address it later if needed", w: 0 },
      { t: "Say something calm in the moment", w: 1 },
      { t: "Go cold, and they know why", w: 2 },
      { t: "Remember this. For a long time.", w: 3 },
    ],
  },
];

const CATEGORIES: Record<string, { name: string; desc: string; planet: string }> = {
  "reactive-anger": { name: "Reactive Anger", desc: "You go hot fast. Mars energy needs a beat before it speaks.", planet: "Mars" },
  "jealousy": { name: "Jealousy Loops", desc: "Comparison runs in the background. Pluto wants to know everything.", planet: "Pluto" },
  "score-keeping": { name: "Score-Keeping", desc: "Nothing is forgotten. Every past hurt has a ledger.", planet: "Pluto" },
  "stonewalling": { name: "Stonewalling", desc: "Silence is the punishment. Cancer/Scorpio Mars classic.", planet: "Mars" },
  "blame": { name: "Blame Reflex", desc: "Being wrong feels dangerous. Ego takes over the story.", planet: "Mars" },
  "obsession": { name: "Obsession", desc: "You track, you check, you spiral. Pluto in overdrive.", planet: "Pluto" },
  "manipulation": { name: "Indirect Manipulation", desc: "Getting what you want without asking. Scorpio subtlety turned sideways.", planet: "Pluto" },
  "ghosting": { name: "Ghosting", desc: "Disappearing is easier than talking. Mars avoidance.", planet: "Mars" },
  "ego": { name: "Ego Injury", desc: "Pride is a live wire. Leo/Scorpio wound response.", planet: "Both" },
};

function getVerdict(score: number) {
  if (score < 20) return {
    title: "You're the safe harbor",
    verdict: "Genuinely one of the healthy ones.",
    body: "Your Mars processes anger before it speaks. Your Pluto isn't running background jealousy loops. This doesn't mean you're a pushover — it means you fight when it matters and let things go when they don't. This is what growth looks like. Whether it came easy or you earned it the hard way, it's yours.",
  };
  if (score < 40) return {
    title: "Occasionally spicy, mostly grounded",
    verdict: "You have a temper, but it's on a leash.",
    body: "You react. Sometimes hard. But you catch yourself, most of the time. Your Mars has heat. Your Pluto has depth. The work isn't to become nicer — it's to keep noticing the moment before the reaction, which you already do about seventy percent of the time. Keep going.",
  };
  if (score < 60) return {
    title: "The complicated one",
    verdict: "You know exactly which parts of this were about you.",
    body: "You're not the villain in your story. But you're also not always the hero. Mars in a triggered state makes you sharp. Pluto in a triggered state makes you cold. When either goes off, people around you feel it before they can name it. The good news: you already know this. The next step is saying it out loud when it happens.",
  };
  if (score < 80) return {
    title: "The one your friends warn people about",
    verdict: "You're the fun one until you're not.",
    body: "Your Mars is reactive. Your Pluto is running control patterns you probably learned before you had language for them. This score isn't a character judgment — it's a mirror. The people who love you have a version of you they walk on eggshells around. That version isn't fixed, but it needs to be named. Your birth chart has the actual receipts.",
  };
  return {
    title: "It's giving Pluto in the 7th",
    verdict: "You already know. That's why you took the quiz.",
    body: "You didn't get here by accident. Deep Mars, deep Pluto, deep everything. The intensity is a feature, not a bug — but right now it's running you instead of you running it. Every pattern this quiz named is workable. Not fixable in a weekend, but workable. The chart shows exactly where the wiring is.",
  };
}

export default function ToxicityQuiz() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [toast, setToast] = useState<string | null>(null);

  const start = () => {
    setStarted(true);
    setStep(0);
    setFinished(false);
    setAnswers([]);
    setScores({});
  };

  const answer = (w: number) => {
    const cat = QUESTIONS[step].cat;
    setAnswers((prev) => [...prev, w]);
    setScores((prev) => ({ ...prev, [cat]: (prev[cat] || 0) + w }));
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

  const raw = answers.reduce((a, b) => a + b, 0);
  const score = Math.round((raw / 30) * 100);
  const sorted = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .filter(([, v]) => v > 0)
    .slice(0, 3);
  const verdict = getVerdict(score);

  const share = () => {
    if (sorted.length === 0) return;
    const text = `I scored ${score}/100 on the "How Toxic Are You?" quiz. My top shadow: ${CATEGORIES[sorted[0][0]].name}. Take it: bluntchart.com/how-toxic-are-you-quiz`;
    if (navigator.share) {
      navigator.share({ title: "My Toxicity Score", text, url: "https://bluntchart.com/how-toxic-are-you-quiz" }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      showToast("Copied to clipboard");
    }
  };

  const progressPct = finished ? 100 : started ? (step / QUESTIONS.length) * 100 : 0;
  const counterText = finished ? "10/10" : started ? `${step + 1}/10` : "0/10";
  const statusText = finished ? "Result" : started ? "Answer honestly" : "Ready when you are";
  const circumference = 2 * Math.PI * 90;

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
            <h2>Ready for brutal honesty?</h2>
            <p>Answer instinctively. Overthinking makes the score worse — literally. That&apos;s a Pluto thing.</p>
            <button className="btn-primary" onClick={start}>Start the quiz</button>
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
            <div className="score-ring">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle className="bg-circle" cx="100" cy="100" r="90" />
                <circle
                  className="fill-circle"
                  cx="100" cy="100" r="90"
                  style={{ strokeDasharray: circumference, strokeDashoffset: circumference - (score / 100) * circumference }}
                />
              </svg>
              <div className="score-value">
                <div className="score-num">{score}</div>
                <div className="score-label">Toxicity</div>
              </div>
            </div>

            <div className="result-title">{verdict.title}</div>
            <div className="result-verdict">&quot;{verdict.verdict}&quot;</div>

            <div className="result-body"><p>{verdict.body}</p></div>

            {sorted.length > 0 && (
              <>
                <div className="shadow-cards-header">Your top 3 shadow patterns</div>
                <div className="shadow-cards">
                  {sorted.map(([cat]) => {
                    const c = CATEGORIES[cat];
                    return (
                      <div className="shadow-card" key={cat}>
                        <div className="shadow-card-label">{c.planet}</div>
                        <div className="shadow-card-name">{c.name}</div>
                        <div className="shadow-card-desc">{c.desc}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            <div className="upsell">
              <div className="upsell-eyebrow">Want the real answer?</div>
              <h3>See the actual Mars and Pluto in your chart</h3>
              <p>This quiz measured your behavior. Your birth chart measures the source. Get the sign, house, and aspects behind your score — free, in under a minute.</p>
              <div className="upsell-features">
                <span>Exact Mars sign + house</span>
                <span>Pluto placement + aspects</span>
                <span>Personalized shadow report</span>
              </div>
              <a href="/free-birth-chart" className="btn-primary" style={{ textDecoration: "none", display: "inline-block" }}>Get my free chart reading</a>
            </div>

            <div className="share-row">
              <button className="share-btn" onClick={share}>Share my score</button>
              <button className="share-btn" onClick={start}>Retake quiz</button>
            </div>
          </div>
        )}
      </div>

      <div className={`toast${toast ? " show" : ""}`}>{toast}</div>
    </div>
  );
}
