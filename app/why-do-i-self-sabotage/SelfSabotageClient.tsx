"use client";

import Link from "next/link";
import {
  PatternPageShell,
  SupportNote,
  ChartCTA,
  FAQBlock,
  RelatedBlock,
} from "@/components/PatternPageShell";

const FAQS = [
  { q: "Why do I self-sabotage when things are going well?", a: "Because 'going well' is the trigger. Progress raises the stakes — it makes the outcome matter, makes failure meaningful, and makes retreat costly. If the underlying pattern is protection against a failure that would say something about you, then the moment success becomes plausible is the moment protection activates." },
  { q: "Is self-sabotage the same as fear of failure?", a: "Related, but the simple version is often wrong. Plenty of self-sabotage is fear of success — of visibility, of raised expectations, of outgrowing the people you came from. Both produce identical behaviour and need opposite responses, which is why generic advice on this usually misses." },
  { q: "Does my birth chart mean I'm going to keep doing this?", a: "No. Saturn placements describe difficulty and slow development, not a fixed outcome. Saturn is the planet astrologers most consistently associate with things that genuinely improve with age — it describes what's hard early and competent later. That's the opposite of a life sentence." },
  { q: "Why do I procrastinate on the things I care about most and not the trivial things?", a: "Because the trivial things carry no risk to your sense of self. Nothing about your identity is at stake in answering an email. The things you care about are the only things where failing would mean something — so they're the only things worth defending against." },
  { q: "How do I tell self-sabotage apart from just not wanting it?", a: "Self-sabotage is cyclical: you approach, retreat, and approach again, and the wanting returns. Genuinely not wanting something is flat and stable — there's no pull back toward it, just relief when it's dropped. If you keep returning, it's a pattern. If you never do, it wasn't yours." },
];

const RELATED = [
  { href: "/why-am-i-so-hard-on-myself", title: "Why am I so hard on myself?", note: "Usually the same Saturn, pointed elsewhere." },
  { href: "/why-do-i-push-people-away", title: "Why do I push people away?", note: "Protection running in relationships." },
  { href: "/saturn-return-calculator", title: "Saturn return calculator", note: "If you're 27–30, this pattern may be peaking for a reason." },
  { href: "/free-birth-chart", title: "Free birth chart", note: "Your Saturn, Mars and 12th house in one view." },
];

export default function SelfSabotageClient() {
  return (
    <>
      <PatternPageShell
        breadcrumb="Why Do I Self-Sabotage"
        h1={<>Why do I <em>self-sabotage?</em></>}
        intro={
          <>
            You get close to something you want and then you do the thing. You miss the deadline you had three weeks
            for. You pick a fight the week before the holiday. You stop going to the gym at the exact point it started
            working. Afterwards you can see it clearly, which is somehow the worst part. You watched yourself do it.
            You could have stopped and you didn&apos;t.
          </>
        }
      >
        <p>
          And every explanation you&apos;ve read — you&apos;re lazy, you&apos;re afraid of failure, you don&apos;t
          want it enough — lands wrong, because none of them match the fact that you genuinely wanted the thing.
        </p>

        <h2>What&apos;s <em>actually happening</em></h2>
        <p>
          Self-sabotage is almost never an attack on the goal. It&apos;s protection, aimed at something else, that
          happens to take out the goal on its way past.
        </p>
        <p>
          <strong>You&apos;re protecting against the version of failure that would mean something.</strong> There&apos;s
          a meaningful difference between failing at something you gave everything to and failing at something you
          half-did. The first one is information about you. The second one is information about your effort. If your
          sense of worth is tied to being capable, then never fully trying is the only way to keep the question open.
          Psychologists call the deliberate version self-handicapping. Most of it isn&apos;t deliberate.
        </p>
        <p>
          <strong>Success is a threat if it changes what&apos;s expected of you.</strong> Getting what you want means
          having to keep it, being visible, being held to a new standard, and losing the option of retreat. If your
          baseline experience is that pressure eventually exceeds your capacity, then success looks less like a
          reward and more like a raised floor you&apos;ll eventually fall through.
        </p>
        <p>
          <strong>Sometimes it&apos;s loyalty.</strong> This one is rarely named and it&apos;s remarkably common. If
          moving forward means outgrowing where you came from — earning more than your parents, leaving the town,
          becoming someone your family doesn&apos;t recognise — then part of you may be quietly refusing to complete
          the separation. The sabotage keeps you in reach of home.
        </p>
        <p>
          <strong>And sometimes the goal was never yours.</strong> Worth checking before doing any deeper work.
          Procrastination that&apos;s total and permanent, rather than cyclical, is often not sabotage at all.
          It&apos;s the correct response to something you don&apos;t actually want and have never given yourself
          permission to drop.
        </p>

        <h2>Where it <em>usually starts</em></h2>
        <p>Somewhere that taught you achievement was the currency.</p>
        <p>
          Households where love arrived with results. Being the clever one, the one with potential, the one who was
          going to do something — a label that starts as a compliment and becomes a debt. Or the opposite: an
          environment where standing out was dangerous, where ambition drew resentment, where the safest thing was
          to stay level with everyone else.
        </p>
        <p>
          Both produce the same adult, running the same programme, from opposite directions. One is protecting against
          falling short of the label. The other is protecting against exceeding it.
        </p>

        <h2>What your <em>chart shows</em></h2>
        <p>
          The general pattern is common. The specific mechanism is yours, and this is where it gets legible.
        </p>
        <p>
          <strong>Saturn&apos;s house placement — the single most useful thing to check.</strong> Saturn is where you
          experience restriction, self-doubt, and the sense of having to earn permission. The house it occupies is
          the area of life where you most reliably undercut yourself.
        </p>
        <ul>
          <li>Saturn in the <strong>10th</strong>: career and public visibility. You&apos;ll get near recognition and find a way to stay just below it.</li>
          <li>Saturn in the <strong>5th</strong>: creativity, play, romance. The things you make never feel ready. The things you enjoy get postponed.</li>
          <li>Saturn in the <strong>2nd</strong>: money and self-worth. Income has a ceiling you keep setting and then hitting.</li>
          <li>Saturn in the <strong>7th</strong>: partnership. Closeness gets delayed, tested, or quietly made difficult.</li>
          <li>Saturn in the <strong>1st</strong>: self-presentation. You hold back from being fully seen as yourself.</li>
        </ul>
        <p>
          Saturn is not a curse in any of these. It&apos;s the area where competence is built slowly and rarely feels
          sufficient — and the sabotage is usually the gap between the standard you hold and the standard you&apos;ll
          accept.
        </p>
        <p>
          <strong>Mars–Saturn aspects.</strong> The signature of blocked drive. Mars is action and desire; Saturn is
          the brake. Together they produce someone who starts with real force and then meets an internal resistance
          that reads as sudden pointlessness. Motivation doesn&apos;t fade gradually — it cuts out. There&apos;s often
          anger underneath it that has nowhere to go, which turns inward and looks like apathy.
        </p>
        <p>
          <strong>12th house planets, particularly the Sun or Mars.</strong> The 12th house is what operates below
          your own visibility — the motivations you can&apos;t see and therefore can&apos;t argue with. A 12th house
          Mars in particular describes drive that runs underground: you&apos;ll act against your own stated intentions
          and be genuinely unable to explain why afterwards. This is the placement most associated with the specific
          experience of watching yourself do it.
        </p>
        <p>
          <strong>Neptune aspecting the Sun, Mars or Saturn.</strong> The dissolution signature. Plans lose definition.
          Deadlines feel negotiable in a way that seems reasonable at the time and obviously wasn&apos;t in retrospect.
          Neptune contacts often describe someone who isn&apos;t avoiding the work so much as losing hold of it — the
          goal stops feeling solid, and then it stops feeling real.
        </p>
        <p>
          <strong>Your South Node.</strong> This is the direction of least resistance: the behaviours so familiar
          they&apos;re automatic, and comfortable enough to hide in. When you sabotage forward movement, you almost
          always retreat toward your South Node. Knowing which sign and house it&apos;s in tells you exactly what
          your particular hiding place looks like.
        </p>
        <p>
          <Link href="/free-birth-chart" className="pp-inline-cta">Find your Saturn and 12th house free →</Link>
        </p>

        <h2>What <em>actually shifts it</em></h2>
        <p>
          Not discipline. Discipline is the thing you&apos;ve been trying, and if it worked you wouldn&apos;t be
          reading this.
        </p>
        <p>
          <strong>Find out what&apos;s being protected.</strong> The useful question isn&apos;t &ldquo;why can&apos;t
          I follow through,&rdquo; it&apos;s &ldquo;what would become true about me if this worked?&rdquo; Answer it
          honestly and the sabotage usually stops being mysterious. Often the answer is something like: <em>I&apos;d
          have no excuse anymore</em>, or <em>I&apos;d have to keep this up</em>, or <em>I&apos;d be alone in a way
          I&apos;m not now</em>.
        </p>
        <p>
          <strong>Lower the stakes deliberately.</strong> If sabotage is protection against meaningful failure, then
          reducing the meaning reduces the need. Doing something badly and on purpose — a deliberately rough draft,
          a session you&apos;ve decided in advance won&apos;t count — removes the thing being defended against. This
          works far better than it sounds like it should.
        </p>
        <p>
          <strong>Notice the exact moment.</strong> Sabotage has a trigger point, and it&apos;s usually not the hard
          part. It&apos;s the moment just after something goes <em>well</em> — the positive feedback, the sign of
          progress, the point where it starts to look possible. Catching that moment is more useful than any amount
          of planning.
        </p>
        <p>
          <strong>Separate the pattern from the identity.</strong> &ldquo;I self-sabotage&rdquo; is a description of
          a behaviour. &ldquo;I&apos;m a self-saboteur&rdquo; is a story that makes the behaviour load-bearing, and
          it&apos;s much harder to put down.
        </p>

        <SupportNote>
          If this pattern comes with long stretches where nothing feels possible, where the energy for things you
          used to care about is simply gone, or where the self-criticism has a cruelty to it that frightens you a
          little — that&apos;s worth taking to a professional rather than a birth chart. Those are recognised,
          treatable things, and they respond to actual treatment far better than to insight. This page can name
          a pattern. It can&apos;t do that.
        </SupportNote>

        <ChartCTA
          headline="What your chart says specifically"
          body="A BluntChart reading works from your actual chart and names the specific mechanism — which house Saturn sits in, how tightly Mars aspects it, what's hidden in your 12th, and where your South Node pulls you back to. It won't be flattering and it won't be vague."
        />
      </PatternPageShell>

      <FAQBlock faqs={FAQS} />
      <RelatedBlock related={RELATED} />
    </>
  );
}
