"use client";

interface Props {
  onCta: () => void;
}

const CARDS = [
  {
    title: "WHEN YOU PRETEND YOU’RE FINE",
    body: "Will he give you space? Chase you? Or know that “I’m fine” was absolutely not the end of that conversation?",
  },
  {
    title: "WHEN YOU’RE ACTUALLY FALLING FOR HIM",
    body: "What makes you soften? What makes you panic? And what makes you suddenly take four business days to reply?",
  },
  {
    title: "WHEN YOU TWO FIGHT",
    body: "Because apparently “future husband” does not mean “man who magically agrees with everything you say.”",
  },
  {
    title: "WHEN YOU NEED HIM",
    body: "Even when you’re doing that adorable thing where you insist you don’t.",
  },
];

export default function RelationshipTease({ onCta }: Props) {
  return (
    <section className="fll-rel-tease">
      <h2 className="fll-section-heading">
        SO&hellip; WHAT MIGHT YOUR FUTURE HUSBAND
        <br />
        HAVE TO DEAL WITH?
      </h2>

      <div className="fll-rel-cards">
        {CARDS.map((card, i) => (
          <div key={i} className="fll-rel-card">
            <h3 className="fll-rel-card-title">{card.title}</h3>
            <p className="fll-rel-card-body">{card.body}</p>
          </div>
        ))}
      </div>

      <p className="fll-rel-tease-end">Your chart has opinions.</p>
      <button className="fll-cta-ghost" onClick={onCta} type="button">
        I NEED TO KNOW &rarr;
      </button>
    </section>
  );
}
