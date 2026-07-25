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
  { q: "Why am I only attracted to people who don't want me?", a: "Because unpredictable reward is more compelling than reliable reward — this is a well-established finding in behavioural psychology, not a quirk of yours. Someone who wants you consistently removes the uncertainty, and if uncertainty is what your system learned to read as significance, their steadiness registers as absence of feeling. It isn't. It's just quiet." },
  { q: "Does my birth chart mean I'm destined to keep repeating this?", a: "No. Placements describe patterns, not outcomes. A Venus–Saturn aspect describes a difficulty in receiving love easily; it says nothing about whether you'll resolve it. People with the same aspect end up in very different places, and the difference is awareness, not astrology." },
  { q: "Is this the same as an anxious attachment style?", a: "There's substantial overlap, and attachment theory is the better-evidenced framework of the two. Astrology isn't a competing explanation — it's a more granular description. Attachment theory gives you a category. Your chart gives you the specifics of your version of it." },
  { q: "Why do I keep attracting narcissists?", a: "Worth being careful with this word — it's a clinical diagnosis and it's applied very loosely online. What's usually happening is a match between someone who over-gives and someone who over-takes. If you learned that being useful was how you earned closeness, you'll be unusually tolerant of people who take a lot, and unusually attractive to them. That's a dynamic, not a diagnosis of them." },
  { q: "Can I change my type?", a: "Your instinctive pull is slow to change. What changes faster is what you do about it — the gap between noticing an attraction and acting on it. Most people find the pull softens gradually once the pattern is conscious, rather than switching off." },
];

const RELATED = [
  { href: "/why-do-i-push-people-away", title: "Why do I push people away?", note: "The other side of the same coin." },
  { href: "/why-do-i-self-sabotage", title: "Why do I self-sabotage?", note: "When the same protection runs the whole life." },
  { href: "/rising-sign-calculator", title: "Rising sign calculator", note: "Find your Descendant — the sign opposite your Rising." },
  { href: "/free-birth-chart", title: "Free birth chart", note: "Venus, Saturn and your 7th house, in one view." },
];

export default function AttractWrongPersonClient() {
  return (
    <>
      <PatternPageShell
        breadcrumb="Why You Attract the Wrong Person"
        h1={<>Why do I attract <em>emotionally unavailable</em> people?</>}
        intro={
          <>
            You have a type. You know you have a type. You&apos;ve explicitly decided not to have that type anymore,
            and then six weeks into something new you notice the same particular silence, the same slow withdrawal,
            the same feeling of working to earn something that was freely available at the start. And the part that&apos;s
            hardest to say out loud: the available ones bore you.
          </>
        }
      >
        <p>
          That&apos;s not a character flaw and it&apos;s not bad luck. It&apos;s a pattern, patterns have mechanisms,
          and this one is unusually well documented.
        </p>

        <h2>What&apos;s <em>actually happening</em></h2>
        <p>Three things overlap here, and most advice on this topic only names one.</p>
        <p>
          <strong>Familiarity reads as chemistry.</strong> Your nervous system learned what love feels like before
          you had any say in it. If closeness in your childhood came with uncertainty — a parent who was warm and
          then absent, approval you had to earn, affection that arrived on someone else&apos;s schedule — then
          <em> inconsistency</em> got encoded as part of what love is. Later, someone steady shows up and registers
          as flat. Not because you prefer suffering, but because your body is comparing them to a template it built
          at age six.
        </p>
        <p>
          <strong>Intermittent reinforcement is genuinely addictive.</strong> This is the most powerful reward schedule
          known to behavioural psychology, and it&apos;s the reason slot machines work. Reward that arrives unpredictably
          produces far more persistent behaviour than reward that arrives reliably. An emotionally unavailable partner
          delivers exactly this: occasional, intense warmth, separated by stretches of nothing. The intensity of the
          good moments is <em>increased</em> by the drought around them. You aren&apos;t confusing anxiety with love.
          You&apos;re experiencing the neurochemistry of anticipation, which feels remarkably similar.
        </p>
        <p>
          <strong>You&apos;re solving an old problem with a new person.</strong> There&apos;s a well-described tendency
          to unconsciously recreate the emotional conditions of early life, with the buried hope of a different outcome
          this time. Winning over someone who withholds isn&apos;t just about them. It&apos;s an attempt to finally close
          something that never closed.
        </p>
        <p>
          Notice what none of these are: low standards, poor judgement, or &ldquo;not loving yourself enough.&rdquo;
          That last one gets repeated constantly and it&apos;s mostly unhelpful, because it turns a nervous-system
          pattern into a moral failing you&apos;re then supposed to fix by trying harder.
        </p>

        <h2>Where it <em>usually starts</em></h2>
        <p>Almost always in something that didn&apos;t look like damage at the time.</p>
        <p>
          A parent who was loving but preoccupied. A household where feelings were fine as long as they weren&apos;t
          inconvenient. Being the reliable child, the easy one, the one who didn&apos;t need much — and learning that
          being needed was safer than being wanted. Praise that arrived for achievement and went quiet otherwise.
        </p>
        <p>
          None of that is dramatic enough to name as a wound, which is exactly why it goes unexamined for thirty years.
          It doesn&apos;t produce a memory. It produces a <em>setting</em>.
        </p>
        <p>And the setting is: love is something you earn, and anything you didn&apos;t have to earn probably isn&apos;t the real thing.</p>

        <h2>What your <em>chart shows</em></h2>
        <p>
          Here&apos;s where this gets specific to you rather than true of everyone. Four places in a birth chart
          describe this pattern, and most people who recognise themselves above have at least two.
        </p>
        <p>
          <strong>Your Descendant — the sign opposite your Rising.</strong> This is the 7th house cusp, and it describes
          the quality you don&apos;t experience as your own and therefore keep meeting in other people. If you have
          Aries Rising, your Descendant is Libra and you&apos;ll repeatedly partner with people who won&apos;t take a
          position. Capricorn Rising gives a Cancer Descendant — and a long history of partners who want an emotional
          closeness you find difficult to return, which quietly recasts <em>you</em> as the unavailable one in a dynamic
          you thought you were the victim of.
        </p>
        <p>The Descendant isn&apos;t a curse. It&apos;s the half of yourself you outsourced, showing up as a person.</p>
        <p>
          <strong>Venus in hard aspect to Saturn.</strong> The signature of love that feels conditional. Venus is what
          you value and how you receive affection; Saturn is restriction, delay and the requirement to earn. Together
          they produce a genuine, physical difficulty in accepting warmth that arrives without effort — and often a
          strong pull toward people who are older, unavailable, emotionally withholding, or simply hard work. Freely
          given affection can feel almost embarrassing.
        </p>
        <p>
          <strong>Venus in hard aspect to Neptune.</strong> The idealisation signature. You fall for potential. You see
          who someone could be with startling clarity, and you&apos;ll stay in a relationship with that projected version
          long after the actual person has shown you something different. The disillusionment, when it comes, feels like
          betrayal — but the gap was between the person and your image of them, and the image was yours.
        </p>
        <p>
          <strong>Moon–Saturn contacts.</strong> The Moon is what you need emotionally; Saturn is where you learned to
          go without. This aspect frequently describes someone who decided early that needing things was risky, and who
          has been quietly self-sufficient ever since. The consequence in adult relationships is a strong attraction to
          people who don&apos;t ask much — because someone who <em>does</em> ask requires you to have needs too, and
          that&apos;s the genuinely frightening part.
        </p>
        <p>
          <strong>Also worth checking:</strong> where your 7th house ruler sits. If it&apos;s in the 12th house,
          partnership tends to involve something hidden, unavailable or unspoken. If it&apos;s in the 8th, intensity
          and merging are the draw. That single placement often explains more about your relationship history than
          your Venus sign does.
        </p>
        <p>
          <Link href="/free-birth-chart" className="pp-inline-cta">Find these in your chart free →</Link>
        </p>

        <h2>What <em>actually shifts it</em></h2>
        <p>
          Honestly: not a decision. Deciding to date differently is where everyone starts and it almost never holds,
          because the selection is happening below the level where decisions operate. You don&apos;t choose who you
          find compelling.
        </p>
        <p>What does move it:</p>
        <p>
          <strong>Noticing the pull in real time rather than afterward.</strong> The specific feeling of <em>wanting
          to be chosen</em> by someone withholding is identifiable once you&apos;ve named it once. It has a texture —
          slightly anxious, slightly elevated, oriented toward their next response. Catching it while it&apos;s happening
          is the whole skill. You don&apos;t have to act on it differently at first. Just see it.
        </p>
        <p>
          <strong>Sitting with how boring &ldquo;available&rdquo; feels — without treating that as a verdict.</strong>{" "}
          The flatness you feel with someone steady is a withdrawal symptom, not a compatibility assessment. It usually
          passes at around the eight-to-twelve-week mark, which is precisely when most people leave.
        </p>
        <p>
          <strong>Getting specific about what happened.</strong> Not &ldquo;my childhood was fine&rdquo; and not
          &ldquo;my childhood was terrible,&rdquo; but the actual mechanism: what did you have to do to be loved in
          your house, and who did you become in order to do it? That&apos;s the question the pattern is built on.
        </p>
        <p>
          <strong>Understanding your chart isn&apos;t a fix, but it is a name.</strong> And a pattern you can name is
          one you can catch. Most people carrying this have never had specific language for it — only a vague sense
          that they&apos;re bad at relationships.
        </p>

        <SupportNote>
          If the pattern involves relationships where you&apos;ve been frightened, controlled, isolated from people
          who care about you, or made responsible for someone else&apos;s stability, that&apos;s outside what any
          framework here can help with, and it&apos;s worth talking to someone properly. A therapist who works with
          attachment will do more for you than a birth chart will, and there&apos;s no version of this where reading
          about your Venus placement is the better option. That&apos;s not a disclaimer — it&apos;s the honest answer.
        </SupportNote>

        <ChartCTA
          headline="What your chart says specifically"
          body="A BluntChart reading takes your exact Descendant, your Venus aspects, your Moon condition and your 7th house ruler, and tells you what the pattern is — in plain language, without softening it into something comfortable. Roughly 1,500 words, written to your chart, one payment. It won't fix anything. It'll tell you what you're looking at."
        />
      </PatternPageShell>

      <FAQBlock faqs={FAQS} />
      <RelatedBlock related={RELATED} />
    </>
  );
}
