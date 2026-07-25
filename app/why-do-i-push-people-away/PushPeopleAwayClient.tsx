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
  { q: "Why do I sabotage relationships when they're going well?", a: "Because 'going well' is the trigger, not the safety. If closeness has historically preceded loss, then the moment things get good is the moment your system flags maximum exposure. The sabotage isn't aimed at the relationship. It's aimed at the vulnerability." },
  { q: "Is pushing people away the same as being avoidant?", a: "It overlaps heavily with what attachment researchers describe as avoidant attachment, which is a well-evidenced framework and worth reading about properly. Your chart doesn't compete with that — it describes the particular shape yours takes." },
  { q: "Why do I want closeness and reject it at the same time?", a: "Because the wanting and the fear are produced by different systems running at different speeds. The want is conscious and slow. The fear is automatic and fast, and it acts first. Both are real. Neither is the 'true' one." },
  { q: "Does a Moon–Saturn aspect mean I'll always be like this?", a: "No. It describes a starting configuration, not an outcome. What tends to happen with Moon–Saturn is that it softens with age and deliberate attention — this is one of the placements astrologers most consistently describe as getting easier rather than harder over a lifetime." },
  { q: "How do I explain this to my partner without making it their problem?", a: "Describe the mechanism, not the history, and give it a timeframe. 'I withdraw when I feel close, it's automatic, it isn't about you, and I come back' is complete, honest, and doesn't require them to manage anything." },
];

const RELATED = [
  { href: "/why-you-attract-the-wrong-person", title: "Why do I attract emotionally unavailable people?", note: "The other side of the same coin." },
  { href: "/why-do-i-self-sabotage", title: "Why do I self-sabotage?", note: "When protection turns on the goal." },
  { href: "/moon-sign-calculator", title: "Moon sign calculator", note: "Your emotional baseline, and how you react under stress." },
  { href: "/free-birth-chart", title: "Free birth chart", note: "Your Moon aspects and house placements in one view." },
];

export default function PushPeopleAwayClient() {
  return (
    <>
      <PatternPageShell
        breadcrumb="Why Do I Push People Away"
        h1={<>Why do I push people away <em>when I get close?</em></>}
        intro={
          <>
            Something goes well. They say something warm, or make a plan for months from now, or simply look at you
            a second too long — and something in you goes quiet. You reply a little later than usual. You&apos;re a
            bit less available. And by the time you notice what you&apos;re doing, you&apos;ve already built enough
            distance that they&apos;ve felt it. The worst part is that you <em>want</em> the closeness. You just
            can&apos;t seem to stay in the room for it.
          </>
        }
      >
        <h2>What&apos;s <em>actually happening</em></h2>
        <p>
          The withdrawal isn&apos;t a decision. That&apos;s the first thing worth understanding, because most people
          carrying this pattern have spent years assuming they&apos;re choosing it and concluding they must be broken
          or cruel.
        </p>
        <p>
          <strong>Closeness registers as exposure.</strong> Intimacy requires being known, and being known means
          someone has enough information to hurt you accurately. If you learned early that being seen was risky —
          that vulnerability was used, mocked, ignored, or turned into someone else&apos;s crisis — then your system
          built a fast, automatic response to proximity. The response fires before conscious thought does. You
          withdraw and <em>then</em> look for a reason.
        </p>
        <p>
          <strong>Leaving first is a control strategy.</strong> If you&apos;re carrying an assumption that closeness
          eventually ends in abandonment, then the abandonment isn&apos;t the question — the timing is. Pulling back
          early means it happens on your terms, at a distance you chose, at a cost you set. It feels like protection.
          It is protection. It&apos;s just protection against something that hasn&apos;t happened.
        </p>
        <p>
          <strong>Self-sufficiency became identity, not preference.</strong> For a lot of people this pattern isn&apos;t
          about fear at all, at least not on the surface. It&apos;s that needing people was never an option, so
          not-needing became the thing you&apos;re good at. Letting someone in doesn&apos;t feel dangerous so much as
          <em> disorienting</em> — it asks you to be a different kind of person than the one you built.
        </p>
        <p>
          <strong>And sometimes the read is correct.</strong> Worth saying, because this gets left out: not every
          withdrawal is dysfunction. Sometimes you pull back because something genuinely isn&apos;t right and you
          noticed before you could articulate it. Learning the difference between a protective reflex and accurate
          information is most of the work here, and it&apos;s not obvious from the inside.
        </p>

        <h2>Where it <em>usually starts</em></h2>
        <p>Rarely in one dramatic event. Usually in a repeated small one.</p>
        <p>
          A parent whose moods you had to manage, so you learned to stay slightly back and read the room before
          entering it. A household where someone else&apos;s needs were so large there was no space for yours, and
          independence was the only thing available. Being the child who was praised for being no trouble. An early
          friendship or relationship where you were fully open and it was used against you — once is enough at fifteen.
        </p>
        <p>
          What all of these teach is the same lesson: <em>closeness costs more than it returns.</em> And once
          that&apos;s learned, it doesn&apos;t get unlearned by meeting someone kind. It gets triggered by them.
        </p>

        <h2>What your <em>chart shows</em></h2>
        <p>
          This is where it stops being a general description and starts being about you. Four signatures describe
          this pattern, and the specific one you have determines what the withdrawal actually feels like from the
          inside — which is more useful to know than the pattern itself.
        </p>
        <p>
          <strong>Moon–Saturn contacts.</strong> The most common signature, and the heaviest. The Moon is emotional
          need; Saturn is restriction, self-reliance and the lesson that you&apos;re on your own. This aspect describes
          someone who concluded very early that having needs was unsafe or unwelcome, and who has been quietly
          competent ever since. The withdrawal here isn&apos;t panic — it&apos;s a kind of closing down, a return to
          the familiar solitude that feels less like loneliness and more like relief.
        </p>
        <p>
          <strong>Moon–Uranus contacts.</strong> A completely different flavour. This one is sudden. Everything is
          fine and then you need to be <em>away</em>, immediately, with an urgency that surprises you as much as
          anyone. Uranus is disruption and the need for autonomy; against the Moon it produces someone whose emotional
          safety depends on being able to leave.
        </p>
        <p><strong>Scorpio, Capricorn or Aquarius Moon.</strong> Each produces a version of this.</p>
        <ul>
          <li><em>Scorpio Moon</em> withdraws to protect depth. Trust is given in increments and revoked permanently, and there&apos;s usually a test running that the other person doesn&apos;t know they&apos;re taking.</li>
          <li><em>Capricorn Moon</em> withdraws into competence. Emotion gets managed rather than felt, and closeness is handled by becoming more useful and less available.</li>
          <li><em>Aquarius Moon</em> withdraws into observation — watching the relationship from a slight distance rather than being inside it. It doesn&apos;t feel like coldness from the inside. It feels like clarity.</li>
        </ul>
        <p>
          <strong>8th and 12th house emphasis.</strong> Planets in the 8th house describe someone for whom intimacy is
          all-or-nothing — merging or nothing, no shallow end. That intensity is exactly why the retreat happens: if
          closeness means total exposure, half-closeness isn&apos;t available as a safer option. A loaded 12th house
          often describes someone with a genuine, structural need for solitude, who then feels guilty about needing
          it and withdraws further to hide the withdrawing.
        </p>
        <p>
          <strong>Also check Chiron&apos;s house.</strong> If it&apos;s in the 1st, 4th, 7th or 8th, the sensitivity
          around being seen is likely to be sharper than the aspects alone would suggest.
        </p>
        <p>
          <Link href="/free-birth-chart" className="pp-inline-cta">Find your Moon aspects free →</Link>
        </p>

        <h2>What <em>actually shifts it</em></h2>
        <p>
          Not forcing yourself to stay. That approach — overriding the reflex through willpower — tends to produce a
          stretch of performed closeness followed by a much larger withdrawal, and it makes the whole thing worse.
        </p>
        <p>What helps:</p>
        <p>
          <strong>Naming it out loud, to them, while it&apos;s happening.</strong> &ldquo;I&apos;m doing the thing
          where I go quiet, it&apos;s not about you, give me a day.&rdquo; This is enormously difficult and it changes
          everything, because it converts an unexplained absence into a shared, temporary event. Most of the damage
          this pattern causes isn&apos;t the distance itself — it&apos;s the other person&apos;s interpretation of it.
        </p>
        <p>
          <strong>Separating the reflex from the assessment.</strong> The reflex fires within seconds of a closeness
          cue. A genuine &ldquo;this isn&apos;t right&rdquo; usually arrives slower, and it has content — you can say
          what&apos;s wrong. If you can&apos;t name it, it&apos;s probably the reflex.
        </p>
        <p>
          <strong>Reducing the size of the exposure rather than the frequency.</strong> Full vulnerability is not the
          only option. Small, specific, survivable disclosures — one real thing, not the whole history — build tolerance
          in a way that grand openness doesn&apos;t.
        </p>
        <p>
          <strong>Accepting that the need for distance may not be a defect.</strong> For some charts, particularly
          heavy Aquarius, Uranus or 12th house signatures, solitude is a genuine structural requirement rather than
          a wound. The problem in that case isn&apos;t the need for space. It&apos;s the guilt about it, and the
          resulting failure to negotiate for it openly.
        </p>

        <SupportNote>
          If the withdrawal has reached the point where you&apos;re isolated from most people, or if closeness reliably
          brings on something that feels more like panic than reluctance, that&apos;s beyond what a birth chart is any
          use for. A therapist who works with attachment or trauma will get you further than this page will, and
          there&apos;s no shame in the pattern being bigger than a $15 reading. Sometimes it just is.
        </SupportNote>

        <ChartCTA
          headline="What your chart says specifically"
          body="A BluntChart reading takes your actual Moon condition, your Saturn and Uranus contacts, your 8th and 12th house placements, and describes the pattern as it works in you. Not 'you have trust issues.' Something more specific, and less comfortable."
        />
      </PatternPageShell>

      <FAQBlock faqs={FAQS} />
      <RelatedBlock related={RELATED} />
    </>
  );
}
