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
    tone: "Present, intimate, knowing. Someone who has been watching her life from above and is finally telling her what they see.",
    desiredReaderFeeling:
      "\"How did it know that? That is exactly what's happening.\"",
    writingStyle:
      "Open with a small, specific guess about her recent weeks — something that feels uncannily accurate. The guess should be grounded in what the transit evidence actually supports, expressed as the most specific possibility the astrology allows. Then name the season: what's being activated, what's trying to leave, what's trying to enter. Cover love (is a new connection forming? is an old one exhausting her? is she avoiding something?), career (is something shifting? is she outgrowing a role? is an opportunity circling?), and one more activated area. Do NOT force equal space if the astrology doesn't show meaningful activity in one area — lead with the strongest signal. End on what this season is actually asking of her.",
    approxWords: [550, 700],
    transitionGoal:
      "End on the natural question the reader now has: when does this pressure let up? That's exactly what the next chapter answers.",
    astrologyInputs: ["current-transits", "saturn", "pluto"],
  },

  "when-does-it-get-better": {
    id: "when-does-it-get-better",
    narrativeForm: "observation",
    emotionalObjective:
      "This is the relief chapter. Answer: When does the difficult phase start easing? When do happier/supportive periods begin? In which area — love, career, money, wellbeing? ALWAYS cover: (1) love timing — when does the relationship situation shift, (2) career timing — when does work pressure ease or opportunity arrive, (3) one more area with genuine transit activity.",
    tone: "Warm, honest, hopeful without lying. A friend who tells the truth about the forecast.",
    desiredReaderFeeling:
      "\"Okay. I can hold on. I know when it shifts and where.\"",
    writingStyle:
      "Open by validating the weight she's carrying. Then be specific: which transit is causing the heaviness, when does it ease (months, not exact dates). For love: when does the relationship energy shift, and what does the shift look like (new connection? existing relationship deepening? clarity about what she wants?). For career: when does the work pressure lift, when does an opportunity window open. For the third area: name the specific transit and timing. Be honest if some pressure continues while other areas improve. End on the specific area that gets noticeably lighter first.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "She knows when it eases. The next chapter shows what's opening up beyond that.",
    astrologyInputs: ["current-transits", "jupiter", "venus"],
  },

  "whats-coming-next": {
    id: "whats-coming-next",
    narrativeForm: "challenge",
    emotionalObjective:
      "This is the strategic forward-look chapter. Answer: What important opportunities or changes are approaching? What should I be prepared for? ALWAYS cover: (1) love — what relationship development is approaching, (2) career — what professional opportunity or shift is coming, (3) one more area with genuine upcoming transit activity. One opportunity, one caution, one window.",
    tone: "Clear-eyed, strategic, forward-leaning. The friend who tells her what she would actually do.",
    desiredReaderFeeling:
      "\"I know what's coming and I feel ready for it.\"",
    writingStyle:
      "Open with a friendly dare — there's a decision she already knows she has to make. Name the biggest upcoming shift in love (someone entering? a commitment question? a pattern finally breaking?). Name the biggest career move (the opportunity, the timing, what it requires). Name the biggest caution across all areas — the mistake to avoid, the trap that looks tempting. Give approximate timing (weeks or months, never exact dates). End with a line that makes her feel equipped, not anxious.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "The reader now knows what's happening, when it shifts, and what's coming. She's ready to understand WHY — the birth chart explains everything the transits just showed.",
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
      "Distill the entire reading into actionable clarity. What matters most right now, what to stop doing, what to start doing, what deserves priority, and what she can look forward to.",
    tone: "Direct, warm, concise. A friend wrapping up a long conversation with the essentials.",
    desiredReaderFeeling:
      "\"I know exactly what to do with all of this.\"",
    writingStyle:
      "Short and punchy. No new information — only synthesis. The one thing that matters most right now, the one thing to stop doing, the one thing to start doing, the area that deserves priority this season, and the hopeful thing on the horizon. Each point is 1–2 sentences max.",
    approxWords: [250, 350],
    transitionGoal:
      "This is the closer. End on the thing she can look forward to.",
    astrologyInputs: [],
  },
};
