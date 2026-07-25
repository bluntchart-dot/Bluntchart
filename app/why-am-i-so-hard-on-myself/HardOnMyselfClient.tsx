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
  { q: "Why can't I accept a compliment?", a: "Because praise contradicts the model you're running. If your working assumption is that you're falling short, positive feedback is data that doesn't fit the system, so it gets deflected rather than absorbed. It isn't modesty and it isn't fishing — the compliment genuinely has nowhere to land." },
  { q: "Is being hard on myself why I'm successful?", a: "This is the belief that keeps the pattern in place, and the evidence is against it. Research on self-criticism generally associates it with more avoidance and worse recovery from setbacks, while self-compassion is associated with more persistence. You've likely succeeded alongside the critic rather than because of it — and the things you've quietly avoided are the part of the ledger it doesn't show you." },
  { q: "Does Saturn in my chart mean I'll always feel this way?", a: "No, and Saturn is the specific placement astrologers most consistently describe as improving over a lifetime. It describes something that's hard early and becomes competence later. Most people report the harshness easing considerably after their first Saturn return, around age 29." },
  { q: "Why do I feel like I'm never doing enough even when I'm doing a lot?", a: "Because the measurement isn't against your output — it's against a standard that adjusts upward as you meet it. That's characteristic of Saturn and of Capricorn placements in particular. The goalpost isn't moving to be cruel; it was never fixed to begin with." },
  { q: "What's the difference between high standards and self-criticism?", a: "High standards evaluate the work. Self-criticism evaluates you. The same sentence — 'this isn't good enough' — means something entirely different depending on which one is the subject." },
];

const RELATED = [
  { href: "/why-do-i-self-sabotage", title: "Why do I self-sabotage?", note: "Usually the same Saturn, pointed elsewhere." },
  { href: "/why-do-i-push-people-away", title: "Why do I push people away?", note: "The intimacy version of the same defence." },
  { href: "/saturn-return-calculator", title: "Saturn return calculator", note: "The astrological milestone when this pattern often resets." },
  { href: "/free-birth-chart", title: "Free birth chart", note: "Find your Saturn's house and aspects." },
];

export default function HardOnMyselfClient() {
  return (
    <>
      <PatternPageShell
        breadcrumb="Why Am I So Hard on Myself"
        h1={<>Why am I <em>so hard on myself?</em></>}
        intro={
          <>
            You can list what you did wrong today without pausing. You&apos;d struggle to list what you did well.
            Someone compliments your work and you hear the qualifier they didn&apos;t say. You&apos;d never speak to
            another person the way you narrate your own day, and you know that, and it changes nothing. And when
            anyone suggests being kinder to yourself, some part of you resists immediately — because you&apos;re
            fairly sure the harshness is the only reason you get anything done.
          </>
        }
      >
        <h2>What&apos;s <em>actually happening</em></h2>
        <p>
          <strong>The voice was installed, not invented.</strong> Nobody arrives with an inner critic. It&apos;s a
          set of standards absorbed from somewhere — a parent, a teacher, a household culture, an early environment
          where approval was contingent — that got internalised and kept running long after the original source
          stopped speaking. What&apos;s often surprising is how <em>specific</em> the phrasing is. If you listen
          closely, the critic frequently uses vocabulary that isn&apos;t yours.
        </p>
        <p>
          <strong>It&apos;s protective, which is why it&apos;s so hard to remove.</strong> The critic&apos;s job is
          to catch the flaw before someone else does. If being criticised was dangerous — humiliating, or the prelude
          to withdrawal of affection — then getting there first is a genuine defensive strategy. Pre-emptive
          self-attack means nobody can land a blow you haven&apos;t already absorbed. It works. That&apos;s the
          problem.
        </p>
        <p>
          <strong>You&apos;ve attributed your success to it.</strong> This is the belief that keeps the whole system
          in place: that the harshness is <em>why</em> you&apos;re competent, and that softening it would mean the
          standards collapse. The evidence doesn&apos;t support it — the research on self-criticism fairly consistently
          finds it&apos;s associated with more avoidance and more procrastination, not less, while self-compassion
          tends to correlate with better persistence after failure. But it&apos;s a hard belief to shift, because
          you have decades of achievement that happened <em>while</em> the critic was running, and correlation feels
          like proof from the inside.
        </p>
        <p>
          <strong>Praise doesn&apos;t land because it contradicts the model.</strong> If the operating assumption is
          that you&apos;re not quite enough, then a compliment is data that doesn&apos;t fit, and it gets discarded
          rather than integrated. This is why reassurance has never worked on you and never will. It&apos;s not that
          you don&apos;t believe the person. It&apos;s that the belief has nowhere to attach.
        </p>

        <h2>Where it <em>usually starts</em></h2>
        <p>In an environment where the standard was slightly out of reach.</p>
        <p>
          Being praised specifically for achievement, so that achievement became the price of being valued. A parent
          who was hard on themselves and modelled it without ever saying it aloud. Being the capable child, the one
          who didn&apos;t need supervision, and learning that the reward for competence is more expectation. School
          environments that measured constantly. A household where mistakes were treated as character rather than
          events.
        </p>
        <p>
          None of this requires anyone to have been unkind. Most people carrying a loud inner critic were raised by
          people who loved them and were also, themselves, exhausted and exacting. The voice gets passed down like
          an accent.
        </p>

        <h2>What your <em>chart shows</em></h2>
        <p>
          Here&apos;s where it becomes yours rather than general. Three signatures cover most of it, and the one you
          have determines what the harshness is actually <em>about</em> — which matters more than the harshness itself.
        </p>
        <p>
          <strong>Saturn — the primary signature.</strong> Saturn is the internalised authority: the standard, the
          judge, the sense of never quite having earned the position. Its house shows where the criticism concentrates.
        </p>
        <ul>
          <li>Saturn in the <strong>1st</strong>: aimed at your self, your body, your presence. The most personal and the most constant.</li>
          <li>Saturn in the <strong>6th</strong>: aimed at your work, your health, your daily performance. This is the &ldquo;I should be more productive&rdquo; version, and it doesn&apos;t switch off at weekends.</li>
          <li>Saturn in the <strong>10th</strong>: aimed at achievement and status. Nothing is ever quite the level you should be at by now.</li>
          <li>Saturn in the <strong>5th</strong>: aimed at anything you create or enjoy. Creativity carries a judge, so it stops being fun.</li>
        </ul>
        <p>
          <strong>Moon–Saturn contacts specifically.</strong> This is the aspect most consistently associated with the
          inner critic, because it fuses emotional need with restriction and judgement. It describes someone whose
          emotional baseline includes a background assumption of falling short — not as a thought, but as a
          <em> feeling</em> that precedes any evidence. People with this aspect often describe a sense of having been
          on probation their whole lives without ever being told what for. It also tends to produce genuine difficulty
          in receiving care, because being cared for requires admitting you needed something.
        </p>
        <p>
          <strong>Virgo and Capricorn emphasis.</strong> Virgo placements — particularly Sun, Moon, Mercury or Rising —
          produce criticism that&apos;s <em>specific</em>. You don&apos;t feel vaguely inadequate; you can itemise.
          Virgo&apos;s function is discrimination and improvement, which is genuinely valuable when aimed outward
          and corrosive when aimed inward, and it aims inward by default. Capricorn placements produce criticism
          that&apos;s <em>structural</em>: measured against where you should be by now, against your age, against
          other people&apos;s timelines.
        </p>
        <p>
          <strong>Also check Chiron.</strong> If Chiron sits in the 1st house or aspects the Sun or Moon closely,
          there&apos;s likely a sensitivity around worth that predates any of your actual achievements and won&apos;t
          be resolved by adding more of them.
        </p>
        <p>
          <strong>One important distinction.</strong> Saturn in a chart isn&apos;t the critic. Saturn is <em>capacity
          built slowly through difficulty</em> — the reason you&apos;re genuinely good at things is often the same
          placement producing the harshness. The two aren&apos;t separable, and any advice that treats the critic as
          a foreign object to be removed misunderstands what it&apos;s attached to.
        </p>
        <p>
          <Link href="/free-birth-chart" className="pp-inline-cta">Find your Saturn free →</Link>
        </p>

        <h2>What <em>actually shifts it</em></h2>
        <p>
          Not affirmations. If the belief is &ldquo;I&apos;m not enough,&rdquo; then saying &ldquo;I am enough&rdquo;
          produces immediate internal argument, and you lose.
        </p>
        <p>
          <strong>Notice whose voice it is.</strong> Genuinely — listen to the phrasing next time it starts. Most
          people can identify the source within a few days, and the recognition changes the volume more than any
          technique does. A criticism you can attribute is one you can decline.
        </p>
        <p>
          <strong>Test the belief that it&apos;s working.</strong> Look at what you&apos;ve actually done well and
          ask honestly whether the harshness caused it or merely accompanied it. Then look at what you&apos;ve avoided,
          delayed or abandoned, and ask what role the critic played there. Most people find the ledger doesn&apos;t
          say what they assumed.
        </p>
        <p>
          <strong>Aim for accuracy rather than kindness.</strong> If &ldquo;be nicer to yourself&rdquo; triggers
          resistance — and for Saturn-heavy charts it almost always does — reframe it. The critic isn&apos;t too
          harsh, it&apos;s <em>inaccurate</em>. It&apos;s a measurement instrument that only reports deficits.
          Demanding accuracy is a standard you can accept, where compassion is one you&apos;ll argue with.
        </p>
        <p>
          <strong>Let the standards stay.</strong> You don&apos;t have to lower them, and you probably won&apos;t.
          The change worth aiming for isn&apos;t caring less. It&apos;s separating the assessment of the work from
          the assessment of you — noticing that &ldquo;this could be better&rdquo; and &ldquo;I am insufficient&rdquo;
          are two different sentences that have been welded together since you were young.
        </p>

        <SupportNote>
          If the voice has a genuine cruelty to it — if it says things about your worth or your existence that would
          alarm you coming from someone else, or if it&apos;s louder than the rest of your thinking most days —
          that&apos;s worth taking to a therapist rather than an astrologer. Self-criticism at that intensity is well
          understood clinically and responds well to treatment. A chart can tell you the shape of it. It can&apos;t
          do anything about the volume.
        </SupportNote>

        <ChartCTA
          headline="What your chart says specifically"
          body="A BluntChart reading works from your real chart and names what the critic is actually protecting — which house Saturn occupies, how tight the Moon contact is, and what else it's connected to. In language that doesn't soften it into a compliment."
        />
      </PatternPageShell>

      <FAQBlock faqs={FAQS} />
      <RelatedBlock related={RELATED} />
    </>
  );
}
