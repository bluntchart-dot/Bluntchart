/**
 * In-Depth Reading — Guidelines
 *
 * The private emotional blueprint for the AI writer. Never rendered.
 *
 * Transit-first structure:
 *   Part I  — 3 transit chapters (hook → timing → forward look)
 *   Part II — 6 birth chart chapters (deep context)
 *   Closer  — 1 takeaways chapter
 *
 * Transit rule: every transit chapter ALWAYS evaluates love/relationships
 * AND career/success as fixed anchors, then adds the most strongly
 * activated additional area from the chart.
 */

import type { SectionGuideline, SectionId } from "@/lib/premium/types";

type GuidelineMap = Partial<Record<SectionId, SectionGuideline>>;

const BASELINE_WORDS: readonly [number, number] = [500, 650];

export const IN_DEPTH_READING_GUIDELINES: GuidelineMap = {
  /* ═══════════════════════════════════════════════════════════════════
     PART I — YOUR CURRENT SEASON (transits first — the hook)
  ═══════════════════════════════════════════════════════════════════ */

  "whats-happening-now": {
    id: "whats-happening-now",
    narrativeForm: "guess",
    emotionalObjective:
      "This is the hook chapter. The reader should finish it thinking 'how does this know what's happening in my life?' Answer: Why does my life feel the way it does right now? What major area is being activated? What is ending, beginning, changing or demanding attention? ALWAYS evaluate: (1) love/relationships, (2) career/work, (3) one additional area the transits most strongly activate (money, wellbeing, family, identity, etc.).",
    tone: "Present, intimate, knowing. Someone who has been watching their life from above and is finally telling them what they see.",
    desiredReaderFeeling:
      "\"How did it know that? That is exactly what's happening.\"",
    writingStyle:
      "Open with a small, specific guess about their recent weeks — something that feels uncannily accurate. Then name what's being activated, what's trying to leave, what's trying to enter. Give each area (love, career, one more) ONE focused paragraph with real depth and daily-life specifics. NEVER repeat the same topic across multiple paragraphs — if career is covered in paragraph 2, do not return to career in paragraph 5. Lead with the strongest signal. Each observation should feel grounded in their actual daily experience, not a vague astrological summary. End on what this period is actually asking of them.",
    approxWords: [550, 700],
    transitionGoal:
      "End on the natural question the reader now has: when does this pressure let up? That's exactly what the next chapter answers.",
    astrologyInputs: ["current-transits", "saturn", "pluto"],
  },

  "when-does-it-get-better": {
    id: "when-does-it-get-better",
    narrativeForm: "observation",
    emotionalObjective:
      "This is the relief chapter. Keep it tight and specific — 2-3 focused paragraphs. Answer: When does the pressure start easing? Which area improves first? What does relief actually look like? Cover love timing, career timing, and one more area — concisely.",
    tone: "Warm, honest, hopeful without lying. A friend who tells the truth about the forecast.",
    desiredReaderFeeling:
      "\"Okay. I can hold on. I know when it shifts and where.\"",
    writingStyle:
      "Keep this chapter tight. Open by validating what they're carrying in one sentence. Then be specific and concise: the heaviest pressure eases within X months/weeks, the area that lightens first is [area], and what relief looks like for them specifically. Use relative timing only (months, weeks — NEVER seasons like spring/summer). Be honest if some pressure continues. End on the specific thing that gets noticeably easier first. This chapter should feel like a sharp, useful answer — not a long exploration.",
    approxWords: [350, 450],
    transitionGoal:
      "They know when it eases. The next chapter shows what's opening up beyond that.",
    astrologyInputs: ["current-transits", "jupiter", "venus"],
  },

  "whats-coming-next": {
    id: "whats-coming-next",
    narrativeForm: "challenge",
    emotionalObjective:
      "This is the strategic forward-look chapter. Answer: What important opportunities or changes are approaching? What should they be prepared for? ALWAYS cover: (1) love — what relationship development is approaching, (2) career — what professional opportunity or shift is coming, (3) one more area with genuine upcoming transit activity. One opportunity, one caution, one window.",
    tone: "Clear-eyed, strategic, forward-leaning. The friend who tells them what they would actually do.",
    desiredReaderFeeling:
      "\"I know what's coming and I feel ready for it.\"",
    writingStyle:
      "Open with a friendly dare — there's a decision they already know they have to make. Name the biggest upcoming shift in love. Name the biggest career move. Name the biggest caution — the mistake to avoid. Give approximate timing in months or weeks (NEVER seasons). End with a line that makes them feel equipped, not anxious. This is not a prediction of specific events — it's a reading of what the chart evidence suggests is developing.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "The reader now knows what's happening, when it shifts, and what's coming. They're ready to understand WHY — the birth chart explains everything the transits just showed.",
    astrologyInputs: ["current-transits", "major-aspects"],
  },

  /* ═══════════════════════════════════════════════════════════════════
     PART II — YOUR BIRTH CHART (deep context)
  ═══════════════════════════════════════════════════════════════════ */

  "who-you-are": {
    id: "who-you-are",
    narrativeForm: "observation",
    emotionalObjective:
      "Answer: What are my hidden strengths and flaws? How do other people see me? What do people misunderstand about me? Build one connected portrait: the face she shows → the person underneath → the gap between them → what people get wrong.",
    tone: "Honest, direct, admiring where earned. Not flattering.",
    desiredReaderFeeling:
      "\"Finally someone said it. This is exactly who I am.\"",
    writingStyle:
      "Open with what people see first. Then reveal what's underneath. Name the specific strengths she underestimates and the specific flaws she overestimates. End with what people consistently misunderstand about her and why. Every claim gets a behavioural translation — what does this look like on a Tuesday?",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "End on the version of her that quietly drives everything else — her purpose, her career, her relationships. That's where we're going next.",
    astrologyInputs: ["sun", "moon", "rising", "mercury"],
  },

  "purpose-and-destiny": {
    id: "purpose-and-destiny",
    narrativeForm: "quiet-question",
    emotionalObjective:
      "Answer: What is my purpose/mission? What am I naturally good at? What lessons am I being pushed to learn? Connect her natural gifts to the larger pattern life keeps teaching her.",
    tone: "Firm, clear, big-sister energy. Not motivational.",
    desiredReaderFeeling:
      "\"I always felt that, but I never had words for it.\"",
    writingStyle:
      "Open with the question she keeps circling. Name the talent that runs underneath everything — the thing she does so naturally she doesn't count it as a skill. Then name the lesson Saturn keeps bringing back. Show how the talent and the lesson are two sides of the same thing. End on what changes when she stops arguing with the lesson.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "The purpose clarifies what success should actually look like. The next chapter makes it concrete.",
    astrologyInputs: ["north-node", "saturn", "chiron", "sun"],
  },

  "career-and-success": {
    id: "career-and-success",
    narrativeForm: "memory",
    emotionalObjective:
      "Answer: What career/business fits me? What am I naturally good at in work? What does success actually look like for me? Land 2–4 specific fields or roles that genuinely fit her chart.",
    tone: "Confident, grounded, specific. A friend who is genuinely good at seeing where she would fit.",
    desiredReaderFeeling:
      "\"That actually makes sense. I've been thinking about this wrong.\"",
    writingStyle:
      "Show her working at her best — use verbs, not job titles. Name the specific way she creates value that other people can't replicate. Address the gap between what she's doing and what she's built for. In the closing section, name 2–4 specific fields or roles her chart fits. End on the permission she's been waiting for.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "Her career patterns reveal something about what she values. That connects directly to how she loves.",
    astrologyInputs: ["midheaven", "saturn", "jupiter", "house-10"],
  },

  "love-and-relationships": {
    id: "love-and-relationships",
    narrativeForm: "dialogue",
    emotionalObjective:
      "Answer ALL of these in one connected story: How should I be loved? How do I love and connect emotionally? What kind of partner suits me? What relationship patterns keep repeating? Why have relationships failed or become difficult? What do I need sexually/emotionally? What does marriage/long-term commitment look like? Build a full arc: attraction → emotional needs → sex/intimacy → past patterns → ideal partner → relationship blocks → what commitment looks like.",
    tone: "Best friend over drinks. Direct, warm, zero judgment. Not a couples therapist.",
    desiredReaderFeeling:
      "\"This is why love keeps going the way it goes. Finally.\"",
    writingStyle:
      "This is the longest and richest chapter. Open with what she actually wants underneath what she says she wants. Cover: how she falls for people and why (Venus), what she needs emotionally (Moon), what she needs sexually and physically (Mars), the repeating pattern that has caused the most damage, why it keeps happening, what kind of partner would actually work, what she should stop tolerating. At least one warm best-friend call-out. End on what love that felt like home would look like on an ordinary Tuesday.",
    approxWords: [650, 800],
    transitionGoal:
      "The love chapter reveals her relationship with receiving. That connects to how she handles money.",
    astrologyInputs: ["venus", "mars", "moon", "house-5", "house-7"],
  },

  "money-and-wealth": {
    id: "money-and-wealth",
    narrativeForm: "observation",
    emotionalObjective:
      "Answer: How do I naturally deal with money? How can I build wealth? What income/business paths suit me? Name her specific money patterns and the wealth-building approach her chart supports.",
    tone: "Practical, direct, no shame. A friend who is good with money talking to a friend who isn't sure she is.",
    desiredReaderFeeling:
      "\"I never thought about money that way. That explains a lot.\"",
    writingStyle:
      "Open with her actual relationship with money — not what she earns but how she feels about it. Name the specific pattern. Then the wealth path: how her chart builds financial security. End on one specific money behaviour she could change this month.",
    approxWords: [400, 500],
    transitionGoal:
      "Money patterns reveal deeper emotional patterns. The next chapter goes to the root.",
    astrologyInputs: ["jupiter", "house-2", "venus", "saturn"],
  },

  "growth-and-wellbeing": {
    id: "growth-and-wellbeing",
    narrativeForm: "confession",
    emotionalObjective:
      "Answer: What are my biggest blind spots? Why do I become anxious/stressed or emotionally heavy? What helps me find balance and peace? Name the shadow, the coping mechanism, and the actual path to emotional regulation.",
    tone: "Deep, quiet, unafraid. The friend who doesn't flinch.",
    desiredReaderFeeling:
      "\"You said the thing I've never told anyone. And it didn't break anything.\"",
    writingStyle:
      "Open by saying something on her behalf she hasn't said out loud. Name the blind spot. Name the coping mechanism. Connect it to the WHY in her chart. Then what actually works: the specific conditions her nervous system needs. Not candles and journaling. The real thing. End on the version of peace that's actually available to her.",
    approxWords: [550, 700],
    transitionGoal:
      "This is the last birth chart chapter. End with a sense of completeness — she now understands who she is and why.",
    astrologyInputs: ["saturn", "pluto", "house-12", "chiron", "moon"],
  },

  /* ═══════════════════════════════════════════════════════════════════
     CLOSER — TAKEAWAYS
  ═══════════════════════════════════════════════════════════════════ */

  takeaways: {
    id: "takeaways",
    narrativeForm: "observation",
    emotionalObjective:
      "Distill the entire reading into actionable clarity. What matters most right now, what to stop doing, what to start doing, what deserves priority, and what they can look forward to.",
    tone: "Direct, warm, concise. A friend wrapping up a long conversation with the essentials.",
    desiredReaderFeeling:
      "\"I know exactly what to do with all of this.\"",
    writingStyle:
      "Use pointer/bullet format — start each piece of advice with a dash or bullet. No new information, only synthesis. Cover: what matters most right now, what to stop doing, what to start doing, the area that deserves priority, and the hopeful thing on the horizon. Each point is 1–2 sentences max. Scannable and actionable.",
    approxWords: [250, 350],
    transitionGoal:
      "This is the closer. End on the thing they can look forward to.",
    astrologyInputs: [],
  },
};
