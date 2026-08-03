/**
 * Birth Chart — Guidelines
 *
 * The private emotional blueprint for the AI writer. Never rendered.
 *
 * v1.2 (Insight Map): scene templates removed. Concrete scenarios like
 * "coffee this week" or "11pm text" are gone — the Insight Map now
 * drives per-chapter content, and specific behaviours emerge from the
 * assigned insights + domain palette in chapter-profiles.ts.
 *
 * `writingStyle` is now emotional camera work only, not a scenario. It
 * describes the shape of the chapter (opening move, middle beat, closing
 * beat) — never the specific scene. The insights + domain palette from
 * the scheduler decide what actually gets written.
 *
 * `narrativeForm` is the OPENING MOVE only, unchanged from v1.1.
 * `emotionalObjective` still frames the "why do I..." question this
 * chapter quietly answers, but no longer specifies particular scenes.
 * `transitionGoal` is a soft drift, never a labelled hand-off.
 *
 * Life Story and Before We Begin have bespoke prompt scaffolding built
 * into the prompt-builder; their guideline entries here are lean.
 */

import type { SectionGuideline, SectionId } from "@/lib/premium/types";

type GuidelineMap = Partial<Record<SectionId, SectionGuideline>>;

const BASELINE_WORDS: readonly [number, number] = [400, 500];

export const BIRTH_CHART_GUIDELINES: GuidelineMap = {
  "before-we-begin": {
    id: "before-we-begin",
    narrativeForm: "guess",
    emotionalObjective:
      "Land immediate recognition. She should think, wait — keep going. Do not explain her. Do not summarise. Create curiosity plus a small emotional reveal.",
    tone: "Warm, intimate, slightly playful. Like she just sat down next to her.",
    desiredReaderFeeling:
      "\"Okay, keep going.\" A small chill, then a small smile.",
    writingStyle:
      "Open by naming one thing the reader will find quietly true about herself — a shape of behaviour, not a fabricated event. Build curiosity through recognition. Never fabricate specific past incidents.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "Land on a beat that quietly promises: I'm going to tell you who you actually are next.",
    astrologyInputs: ["sun", "moon", "rising"],
  },

  "real-you": {
    id: "real-you",
    narrativeForm: "observation",
    emotionalObjective:
      "Show her the gap between the version she presents and the person underneath, without picking sides.",
    tone: "Honest, unshowy, admiring.",
    desiredReaderFeeling:
      "Relief. \"So I'm not making it up. This is real.\"",
    writingStyle:
      "Draw the contrast between presented self and interior self. Use what she does, not what she is. Close on which version is actually running things when nobody's watching.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "End on the interior version — the one who quietly fights for her. That is where the next chapter opens.",
    astrologyInputs: ["sun", "moon", "rising"],
  },

  "inner-fighter": {
    id: "inner-fighter",
    narrativeForm: "scene",
    emotionalObjective:
      "Show the shape of her fire — how it lives inside her when she is holding it, not just when she uses it.",
    tone: "Direct. A little fierce. Proud of her.",
    desiredReaderFeeling:
      "Recognition, then dignity. \"That's why I don't back down like other people.\"",
    writingStyle:
      "Show her in the moment before or after conflict. One line of interior monologue in quotes. Land the cost of holding it that way — that cost is the doorway into the next chapter.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "The cost of the fire she is still holding. That cost is the pattern the next chapter will name.",
    astrologyInputs: ["mars", "sun", "major-aspects"],
  },

  "blind-spot": {
    id: "blind-spot",
    narrativeForm: "challenge",
    emotionalObjective:
      "Name the pattern her friends have politely stopped mentioning, and give her the WHY in the same breath so she doesn't hear it as criticism.",
    tone: "Loving, honest, non-shaming. Direct without cruelty.",
    desiredReaderFeeling:
      "A wince, then a laugh, then a quiet \"yeah.\"",
    writingStyle:
      "Open with a friendly dare she cannot help checking. Name the pattern in one clean paragraph. Then the WHY, in plain language. No advice list. Close on the fact that noticing it is already the whole shift.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "Land on the fact that this pattern shows up most cleanly in how she loves people. That's the next chapter's territory.",
    astrologyInputs: ["saturn", "house-12", "major-aspects"],
  },

  "love-patterns": {
    id: "love-patterns",
    narrativeForm: "dialogue",
    emotionalObjective:
      "Show her the specific pattern under her loop in love, without pathologising her. Include at least one warm best-friend call-out in the register of \"okay, can I say something without you getting offended?\"",
    tone: "A best friend over drinks who genuinely wants better for her. Not a couples therapist.",
    desiredReaderFeeling:
      "\"This is exactly why. Finally.\"",
    writingStyle:
      "Show what she really wants underneath what she says she wants. One warm best-friend call-out in the middle. Close on what love that felt like home would actually look like on an ordinary day. Not who, what.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "End on the version of herself she hides even from the people she loves most. The next chapter is that version.",
    astrologyInputs: ["venus", "mars", "house-5", "house-7"],
  },

  shadow: {
    id: "shadow",
    narrativeForm: "confession",
    emotionalObjective:
      "Name the part she hides with dignity. Let her feel that the friend is not afraid of it.",
    tone: "Deep, quiet, unafraid. The friend who does not flinch.",
    desiredReaderFeeling:
      "Seen at the part she hides. Not exposed. Understood.",
    writingStyle:
      "Open by saying something on her behalf she hasn't said out loud. One line of interior monologue in quotes. Close on the fact that this part of her isn't the problem she thinks it is. Say that plainly, not poetically.",
    approxWords: [550, 650],
    transitionGoal:
      "The realisation that this hidden part is the exact place life keeps circling back to teach her something. That is where the next chapter starts, mid-thought.",
    astrologyInputs: ["pluto", "saturn", "house-12"],
  },

  "growth-lesson": {
    id: "growth-lesson",
    narrativeForm: "quiet-question",
    emotionalObjective:
      "Name the lesson that keeps circling. Not as a moral — as a room she keeps walking back into.",
    tone: "Firm and kind. Big-sister tone.",
    desiredReaderFeeling:
      "A quiet \"okay. I hear it.\"",
    writingStyle:
      "Open with a whispered question — not for her to answer, for her to feel. Avoid the word \"journey\". Close on what changes the moment she stops arguing with the lesson.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "End on what this lesson unlocks in her. That unlock is a place she has been quietly trying to build for years — which is the next chapter.",
    astrologyInputs: ["saturn", "north-node", "chiron"],
  },

  career: {
    id: "career",
    narrativeForm: "memory",
    emotionalObjective:
      "Show her where her contribution actually lives, in the specific things she naturally does that other people can't. Land the reading with 2 to 4 real-world fields or roles those strengths actually fit.",
    tone: "Confident, admiring, grounded. Ends with the register of a friend who is genuinely good at seeing where you would fit.",
    desiredReaderFeeling:
      "\"That actually makes sense.\" Not just \"that describes me.\"",
    writingStyle:
      "Use verbs, not job titles. In the closing paragraph, name 2 to 4 specific fields or roles her chart genuinely fits — for example: entrepreneurship, marketing, product management, consulting, business strategy, data and analytics, psychology, education, design, leadership, operations, research, therapy, journalism, sales, engineering. Do not list them all. Do not force. Close with a line that makes her think: that actually makes sense.",
    approxWords: [450, 550],
    transitionGoal:
      "The version of success that fits her involves the exact thing she keeps undervaluing. The next chapter is that thing.",
    astrologyInputs: ["midheaven", "saturn", "jupiter", "house-10"],
  },

  "hidden-gift": {
    id: "hidden-gift",
    narrativeForm: "observation",
    emotionalObjective:
      "Name the thing plainly, and show her the evidence she has been dismissing for years.",
    tone: "Warm, proud, slightly insistent.",
    desiredReaderFeeling:
      "Embarrassed pride. \"Wait, that's a thing? That's a gift?\"",
    writingStyle:
      "Show the pattern of how people around her respond to this gift. Do not overshoot. Close on a line about what happens the day she stops downplaying it.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "End on the fact that this gift is quiet, and quiet things need somewhere safe to live. That is the next chapter's air.",
    astrologyInputs: ["jupiter", "sun", "major-aspects"],
  },

  "safe-place": {
    id: "safe-place",
    narrativeForm: "scene",
    emotionalObjective:
      "Describe the pace and company her interior actually needs — as opposed to the one she keeps trying to survive in.",
    tone: "Soft, tender, protective.",
    desiredReaderFeeling:
      "A physical exhale. Shoulders down.",
    writingStyle:
      "Land what she is actually protecting when she says she needs \"space\". Close on the smallest specific thing she could build more of on purpose. Sensory but not literary.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "End on the arc of a person who has been quietly building this shelter her whole life. That whole life is the next chapter.",
    astrologyInputs: ["moon", "ic", "house-2"],
  },

  "life-story": {
    id: "life-story",
    narrativeForm: "memory",
    emotionalObjective:
      "The emotional climax. She is the protagonist of a film. Show her the arc — the specific tension that's always been true, how it shows up as her life keeps meeting her, the shift life is asking of her now, and where she's pointed. Do NOT recap earlier chapters. Do NOT invent childhood events. Do NOT close her story.",
    tone: "Cinematic, generous, quietly certain. Emotional range across the chapter: playful → tender → hungry → quiet → wondering.",
    desiredReaderFeeling:
      "\"I know this woman better now. And I really want to see what she does next.\"",
    writingStyle:
      "Second-person, present-tense, cinematic close. Structure invisibly as SETUP → COMPLICATION → REALISATION → DIRECTION (never label). No childhood scenes. No fabricated events. No metaphors about rivers, mountains, seasons, or maps. End with curiosity and ownership — cut to black before the next scene.",
    approxWords: [550, 650],
    transitionGoal:
      "End on a beat of arrival that quietly holds a question about what she is walking into right now. That question is Part II.",
    astrologyInputs: ["sun", "moon", "rising", "north-node", "major-aspects"],
  },

  /* ─── Part II — transits (UNCHANGED; keep the strong output) ────── */

  "transit-season": {
    id: "transit-season",
    narrativeForm: "guess",
    emotionalObjective:
      "Quietly answer: \"Why does everything feel different right now?\" Name the specific season she is inside of, what is on its way out, what wants in, without predicting the future.",
    tone: "Present, aware, hopeful. Someone reading the weather with her, not for her.",
    desiredReaderFeeling:
      "\"That explains this year.\"",
    writingStyle:
      "Open with a small guess about her week — the argument she nearly had, the thing she almost bought, the message she is composing in her head. One image for what is leaving, one for what is arriving. No moon-phase clichés. No dates. Close on a line about how this season is not what she thinks it is.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "End on the sense that this season is showing up across everything she cares about at once. That's the next chapter's air.",
    astrologyInputs: ["current-transits", "saturn"],
  },

  "transit-life-areas": {
    id: "transit-life-areas",
    narrativeForm: "dialogue",
    emotionalObjective:
      "Quietly answer: \"Why is love, work, and money all feeling like this at the same time?\" Braid three specific reads into one continuous paragraph so she feels one weather across three windows, not three sections.",
    tone: "Grounded, useful, specific. A friend catching her up on herself.",
    desiredReaderFeeling:
      "\"Okay. That is exactly what is happening.\"",
    writingStyle:
      "Open with a small three-voice exchange — her heart, her calendar, her account. Then one paragraph each for love, career, money, braided by the same underlying weather. No listy structure, no headings, no numbered areas. Close by naming the one theme running through all three.",
    approxWords: [500, 600],
    transitionGoal:
      "End on the theme running through all three. That theme is telling her something about timing. The next chapter listens to it.",
    astrologyInputs: ["current-transits", "venus", "midheaven", "jupiter", "house-2"],
  },

  "transit-timing": {
    id: "transit-timing",
    narrativeForm: "challenge",
    emotionalObjective:
      "Quietly answer: \"Why does this feel like a window I'm not supposed to miss?\" Give her a clear read on the window: one thing to take, one thing to avoid, one soft timeframe, without prophesying.",
    tone: "Clear-eyed, unshowy. The friend who tells her what she would actually do.",
    desiredReaderFeeling:
      "A small forward lean. \"I know what to do now.\"",
    writingStyle:
      "Open with a friendly dare — there is a decision in the next few weeks she already knows she has to make. One opportunity, one mistake to avoid, one window with approximate timing (weeks or months, never exact dates). Callback to who she is from Part I. Close on a line that lands the whole book, not just the season.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "This is the last chapter. End on a line that quietly hands her back to her own life.",
    astrologyInputs: ["current-transits", "major-aspects"],
  },
};
