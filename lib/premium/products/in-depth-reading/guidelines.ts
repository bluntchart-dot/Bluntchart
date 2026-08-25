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
      "This is the deep transit chapter — the hook AND the substance. The reader should finish thinking 'how does this know what's happening in my life?' Go deep into the changes happening right now. ALWAYS evaluate: (1) love/relationships, (2) career/work, (3) one additional area the transits most strongly activate (money, wellbeing, family, identity, etc.). Each area gets real depth and daily-life specifics, not surface-level observations.",
    tone: "Present, intimate, knowing. Someone who has been watching their life from above and is finally telling them what they see.",
    desiredReaderFeeling:
      "\"How did it know that? That is exactly what's happening.\"",
    writingStyle:
      "Open with a small, specific guess about their recent weeks — something uncannily accurate. Then go DEEP into the changes. Give each area (love, career, one more) real depth with daily-life specifics — not 'your career is shifting' but 'you have been staring at that message from someone who wants to work with you and you keep not replying.' NEVER repeat the same topic across multiple paragraphs. Lead with the strongest signal. Every observation should feel like it describes their actual daily experience. End on what this period is actually asking of them.",
    approxWords: [600, 750],
    transitionGoal:
      "End on the natural question the reader now has: when does this pressure let up? That's exactly what the next section answers.",
    astrologyInputs: ["current-transits", "saturn", "pluto"],
  },

  "when-does-it-get-better": {
    id: "when-does-it-get-better",
    narrativeForm: "observation",
    emotionalObjective:
      "This is a continuation of the transit reading — a tight subheadline section. 2-3 focused paragraphs answering: When does the pressure ease? Which area improves first? What does relief actually look like?",
    tone: "Warm, honest, hopeful without lying. A friend who tells the truth about the forecast.",
    desiredReaderFeeling:
      "\"Okay. I can hold on. I know when it shifts and where.\"",
    writingStyle:
      "Keep this tight — 2-3 paragraphs only. This is a continuation of the transit period, not a separate exploration. Open by validating what they're carrying in one sentence. Then be sharp and specific: the heaviest pressure eases within X months/weeks, the area that lightens first is [area], and what relief looks like for them. Use relative timing only (months, weeks — NEVER seasons). Be honest if some pressure continues. End on the specific thing that gets noticeably easier first.",
    approxWords: [250, 350],
    transitionGoal:
      "They know when it eases. The next section shows what's developing beyond that.",
    astrologyInputs: ["current-transits", "jupiter", "venus"],
  },

  "whats-coming-next": {
    id: "whats-coming-next",
    narrativeForm: "challenge",
    emotionalObjective:
      "This is the forward-look section — 2-3 substantive paragraphs using future astrology structure. Cover love, money, and career together. Name any caution or happy moment approaching. Be specific about WHICH direction things are heading — marriage, family, health, relocation, a financial shift, a professional leap. Not vague 'changes are coming' — specific possibilities the astrology supports.",
    tone: "Clear-eyed, strategic, forward-leaning. The friend who tells them what they would actually do.",
    desiredReaderFeeling:
      "\"I know what's coming and I feel ready for it.\"",
    writingStyle:
      "2-3 focused paragraphs with real depth. Cover love, money, and career together — what direction each is heading and any specific shift the evidence supports (is it heading toward commitment? a career pivot? a financial opportunity? a health wake-up call?). Name at least one caution and one happy moment approaching. Be specific about the direction — not 'changes in love' but 'this is heading toward either a serious commitment conversation or a clean break, and the chart leans toward [direction].' Give timing in months or weeks (NEVER seasons). This is a short future reading that uses the available astrology evidence well. End with a line that makes them feel equipped.",
    approxWords: [350, 450],
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
      "Answer: What are my hidden strengths and flaws? How do other people see me? What do people misunderstand about me? Build one connected portrait: the face they show → the person underneath → the gap between them → what people get wrong.",
    tone: "Honest, direct, admiring where earned. Not flattering.",
    desiredReaderFeeling:
      "\"Finally someone said it. This is exactly who I am.\"",
    writingStyle:
      "Open with what people see first. Then reveal what's underneath. Name the specific strengths they underestimate and the specific flaws they overestimate. End with what people consistently misunderstand about them and why. Every claim gets a behavioural translation — what does this look like on a Tuesday?",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "End on the version of them that quietly drives everything else — their purpose, career, relationships. That's where we're going next.",
    astrologyInputs: ["sun", "moon", "rising", "mercury"],
  },

  "purpose-and-destiny": {
    id: "purpose-and-destiny",
    narrativeForm: "quiet-question",
    emotionalObjective:
      "Answer: What is my purpose/mission? What am I naturally good at? What lessons am I being pushed to learn? Connect their natural gifts to the larger pattern life keeps teaching them.",
    tone: "Firm, clear, direct energy. Not motivational.",
    desiredReaderFeeling:
      "\"I always felt that, but I never had words for it.\"",
    writingStyle:
      "Open with the question they keep circling. Name the talent that runs underneath everything — the thing they do so naturally they don't count it as a skill. Then name the lesson Saturn keeps bringing back. Show how the talent and the lesson are two sides of the same thing. End on what changes when they stop arguing with the lesson.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "The purpose clarifies what success should actually look like. The next chapter makes it concrete.",
    astrologyInputs: ["north-node", "saturn", "chiron", "sun"],
  },

  "career-and-success": {
    id: "career-and-success",
    narrativeForm: "memory",
    emotionalObjective:
      "Answer: What career/business fits me? What am I naturally good at in work? What does success actually look like for me? Land 2–4 specific fields or roles that genuinely fit their chart.",
    tone: "Confident, grounded, specific. A friend who is genuinely good at seeing where they would fit.",
    desiredReaderFeeling:
      "\"That actually makes sense. I've been thinking about this wrong.\"",
    writingStyle:
      "Show them working at their best — use verbs, not job titles. Name the specific way they create value that other people can't replicate. Address the gap between what they're doing and what they're built for. In the closing section, name 2–4 specific fields or roles their chart fits. End on the permission they've been waiting for.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "Their career patterns reveal something about what they value. That connects directly to how they love.",
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
      "This is the longest and richest chapter. Open with what they actually want underneath what they say they want. Cover: how they fall for people and why (Venus), what they need emotionally (Moon), what they need sexually and physically (Mars), the repeating pattern that has caused the most damage, why it keeps happening, what kind of partner would actually work, what they should stop tolerating. At least one warm best-friend call-out. End on what love that felt like home would look like on an ordinary Tuesday.",
    approxWords: [650, 800],
    transitionGoal:
      "The love chapter reveals their relationship with receiving. That connects to how they handle money.",
    astrologyInputs: ["venus", "mars", "moon", "house-5", "house-7"],
  },

  "money-and-wealth": {
    id: "money-and-wealth",
    narrativeForm: "observation",
    emotionalObjective:
      "Answer: How do I naturally deal with money? How can I build wealth? What income/business paths suit me? Name their specific money patterns and the wealth-building approach their chart supports.",
    tone: "Practical, direct, no shame. A friend who is good with money talking to a friend who isn't sure they are.",
    desiredReaderFeeling:
      "\"I never thought about money that way. That explains a lot.\"",
    writingStyle:
      "Open with their actual relationship with money — not what they earn but how they feel about it. Name the specific pattern. Then the wealth path: how their chart builds financial security. End on one specific money behaviour they could change this month.",
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
      "Open by saying something on their behalf they haven't said out loud. Name the blind spot. Name the coping mechanism. Connect it to the WHY in their chart. Then what actually works: the specific conditions their nervous system needs. Not candles and journaling. The real thing. End on the version of peace that's actually available to them.",
    approxWords: [550, 700],
    transitionGoal:
      "This is the last birth chart chapter. End with a sense of completeness — they now understand who they are and why.",
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
