/**
 * Birth Chart — Guidelines
 *
 * The private emotional blueprint for the AI writer. Never rendered.
 *
 * v1.1 rewrite — story-first, astrology-invisible.
 *
 * Each chapter now quietly answers one emotional question the reader has
 * probably asked themselves for years ("Why do I always...", "Why can't
 * I...", "Why does this keep happening..."). The question is embedded in
 * emotionalObjective so the model writes toward a felt problem, not a
 * personality description.
 *
 * narrativeForm no longer names a genre for the whole chapter. It names
 * the shape of the OPENING MOVE only (see NarrativeForm in ../../types.ts).
 * The rest of every chapter continues in the book's one continuous voice.
 *
 * writingStyle is emotional camera work only. No astrology scaffolding.
 * The chapter's astrology inputs are already digested up-front in the
 * reader anchor (chart-context.ts); the writer does not re-touch them.
 *
 * transitionGoal is a DRIFT into the next chapter's territory, not a
 * bridge or a "next up..." hand-off. The reader should never feel a seam.
 *
 * approxWords are tight: 400–500 for most chapters, slightly longer for
 * the emotional peaks (Shadow, Life Story) and the braided transit
 * chapter. Never pad to hit a target.
 */

import type { SectionGuideline, SectionId } from "@/lib/premium/types";

type GuidelineMap = Partial<Record<SectionId, SectionGuideline>>;

/**
 * The tight baseline. Every chapter earns its length through specificity,
 * not padding. If a paragraph does not make the chapter more emotional,
 * memorable, or recognisable, it should not exist.
 */
const BASELINE_WORDS: readonly [number, number] = [400, 500];

/**
 * Only entries for AI-authored sections (pageType: "chapter") appear
 * below. Static pages do not need a guideline.
 */
export const BIRTH_CHART_GUIDELINES: GuidelineMap = {
  "before-we-begin": {
    id: "before-we-begin",
    narrativeForm: "guess",
    emotionalObjective:
      "Quietly answer the question the reader has probably asked themselves for years: \"Why does nobody actually see me?\" Land three small specific guesses in the first minute that make them think: someone is finally paying attention.",
    tone: "Warm, intimate, slightly playful. Like she just sat down next to them.",
    desiredReaderFeeling:
      "A small chill, then a small smile. \"Wait, how did you know that?\"",
    writingStyle:
      "Open with a specific tiny guess — how they took their coffee this week, what they almost sent and didn't, a tab they have kept open for days. Three short paragraphs, one image each. No 'you tend to', no 'you are someone who'. Close on a line that promises: this book is going to keep seeing you like this.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "Land on a beat that quietly says, I'm about to tell you who you actually are underneath all of that.",
    astrologyInputs: ["sun", "moon", "rising"],
  },

  "real-you": {
    id: "real-you",
    narrativeForm: "observation",
    emotionalObjective:
      "Quietly answer: \"Why do I feel like a slightly different person to different people?\" Show them the seam between the version they present and the person underneath, without picking sides.",
    tone: "Honest, unshowy, admiring.",
    desiredReaderFeeling:
      "Relief. \"So I'm not making it up. This is real.\"",
    writingStyle:
      "Open with a tiny habit they have stopped noticing — the pause before ordering, the way their voice changes on a work call. Show two versions of them in one paragraph and let the gap sit. Only what they do, not what they are. Close on which version is actually running things when nobody's watching.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "End on the interior version — the one who quietly fights for them. That is where the next chapter opens.",
    astrologyInputs: ["sun", "moon", "rising"],
  },

  "inner-fighter": {
    id: "inner-fighter",
    narrativeForm: "scene",
    emotionalObjective:
      "Quietly answer: \"Why do I go so quiet, and then I don't?\" Show them the shape of their fire — not who they fight, but how it lives inside them when they are holding it.",
    tone: "Direct. A little fierce. Proud of them.",
    desiredReaderFeeling:
      "Recognition, then dignity. \"That's why I don't back down like other people.\"",
    writingStyle:
      "Open in the moment before the anger. A specific room, a specific silence, a specific thing someone just said. One line of interior monologue in quotes on its own line. Then what they actually do, or don't. No sports metaphors. Close on the quiet cost of carrying it that way — that cost is the doorway into the next chapter.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "The cost of the fire they are still holding. That cost is exactly the pattern the next chapter is going to name.",
    astrologyInputs: ["mars", "sun", "major-aspects"],
  },

  "blind-spot": {
    id: "blind-spot",
    narrativeForm: "challenge",
    emotionalObjective:
      "Quietly answer: \"Why does this same thing keep happening to me?\" Name the pattern their friends have politely stopped mentioning, and give them the WHY in the same breath so they don't hear it as criticism.",
    tone: "Loving, honest, non-shaming. Direct without cruelty.",
    desiredReaderFeeling:
      "A wince, then a laugh, then a quiet \"yeah.\"",
    writingStyle:
      "Open with a friendly dare they cannot help checking — something they will disagree with in the first sentence and agree with by the third. Callback to the fire they are holding from the previous chapter; this pattern lives right next to it. Name the pattern in one clean paragraph. Then the WHY, in plain language. Then one recognisable moment. No advice list. Close on the fact that noticing it is already the whole shift.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "Land on the fact that this pattern shows up most cleanly in how they love people. That's the next chapter's territory, and you don't need to announce it.",
    astrologyInputs: ["saturn", "house-12", "major-aspects"],
  },

  "love-patterns": {
    id: "love-patterns",
    narrativeForm: "dialogue",
    emotionalObjective:
      "Quietly answer: \"Why does love keep feeling like this?\" Show them the specific pattern under the loop they keep landing back in, without pathologising them.",
    tone: "A best friend over drinks who genuinely wants better for them. Not a couples therapist.",
    desiredReaderFeeling:
      "\"This is exactly why. Finally.\"",
    writingStyle:
      "Open with a two-voice exchange on its own lines — them at 11pm looking at a message they haven't sent, and them the next morning. Land what they are really asking for underneath what they are asking for out loud. Include at least one warm best-friend call-out in the middle of the chapter — the register of \"okay, can I say something without you getting offended?\" or \"this is where you keep making the same mistake\" or \"stop chasing people who make consistency feel like a reward.\" Not those exact lines. That register. Honest, not mean. Use one very specific real-life situation (the person who texts fast then goes distant for three days, the friend who only calls when things fall apart, the one you stopped seeing but still check the profile of). Close on what love that felt like home would actually look like on a Tuesday. Not who, what.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "End on the version of themselves they hide even from the people they love most. The next chapter is that version.",
    astrologyInputs: ["venus", "mars", "house-5", "house-7"],
  },

  shadow: {
    id: "shadow",
    narrativeForm: "confession",
    emotionalObjective:
      "Quietly answer: \"Why do I hide this part of me, even from the people I trust?\" Name that part with dignity, and let them feel that the reader is not afraid of it.",
    tone: "Deep, quiet, unafraid. The friend who does not flinch.",
    desiredReaderFeeling:
      "Seen at the part they hide. Not exposed. Understood.",
    writingStyle:
      "Open by saying something on their behalf they haven't said out loud. Show one small specific thing they do when nobody's watching — the kind of thing that would embarrass them if a friend brought it up. One line of interior monologue in quotes. Close on the fact that this part of them isn't the problem they think it is. Say that plainly, not poetically.",
    approxWords: [550, 650],
    transitionGoal:
      "The realisation that this hidden part is the exact place life keeps circling back to teach them something. That is where the next chapter starts, mid-thought.",
    astrologyInputs: ["pluto", "saturn", "house-12"],
  },

  "growth-lesson": {
    id: "growth-lesson",
    narrativeForm: "quiet-question",
    emotionalObjective:
      "Quietly answer: \"Why does life keep asking me the same question?\" Name the lesson that has been circling for years, not as a moral, as a room they keep walking back into.",
    tone: "Firm and kind. Big-sister tone.",
    desiredReaderFeeling:
      "A quiet \"okay. I hear it.\"",
    writingStyle:
      "Open with a whispered question — not for them to answer, for them to feel. One image of the recurring shape (the same conversation with different people, the same job with different names). Callback to the pattern from the blind-spot chapter and to what they hide in shadow. Avoid the word \"journey\". Close on what changes the moment they stop arguing with it.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "End on what this lesson unlocks in them. That unlock is a place they have been quietly trying to build for years — which is the next chapter.",
    astrologyInputs: ["saturn", "north-node", "chiron"],
  },

  career: {
    id: "career",
    narrativeForm: "memory",
    emotionalObjective:
      "Quietly answer: \"Why am I only fully myself in the exact place other people think doesn't count?\" Show them where their contribution actually lives — in the specific things they naturally do that other people can't. Then land the reading with 2 to 4 real-world fields those strengths actually fit, so the chapter concludes something practical, not just descriptive.",
    tone: "Confident, admiring, grounded. Ends with the register of a friend who is genuinely good at seeing where you would fit.",
    desiredReaderFeeling:
      "\"That actually makes sense.\" Not just \"that describes me.\"",
    writingStyle:
      "Open by describing a specific kind of moment from their working life — the meeting they left carrying everyone's problem, the 9pm message asking them how to word something, the friend who keeps DMing them for a second opinion. Use verbs, not job titles. Show one recognisable image of them doing the thing they don't count as work. Then, in the closing paragraph, name 2 to 4 specific fields or roles their chart genuinely fits. Choose only from areas that actually match — for example: entrepreneurship, marketing, product management, consulting, business strategy, data and analytics, psychology, education, design, leadership, operations, research, therapy, journalism, sales, engineering. Do not list them all. Do not force. Close with a line that makes them think: that actually makes sense, not just \"that describes me.\"",
    approxWords: [450, 550],
    transitionGoal:
      "The version of success that fits them involves the exact thing they keep undervaluing. The next chapter is that thing.",
    astrologyInputs: ["midheaven", "saturn", "jupiter", "house-10"],
  },

  "hidden-gift": {
    id: "hidden-gift",
    narrativeForm: "observation",
    emotionalObjective:
      "Quietly answer: \"Why do people keep coming to me for this thing I don't even count?\" Name the thing plainly, and show them the evidence they have been dismissing for years.",
    tone: "Warm, proud, slightly insistent.",
    desiredReaderFeeling:
      "Embarrassed pride. \"Wait, that's a thing? That's a gift?\"",
    writingStyle:
      "Open with a small habit of the people around them — who calls them first, what they ask them, what changes when they walk into a room. Then the pattern that connects those. Then one concrete example in the wild. Do not overshoot. Close on a line about what happens the day they stop downplaying it.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "End on the fact that this gift is quiet, and quiet things need somewhere safe to live. That is the next chapter's air.",
    astrologyInputs: ["jupiter", "sun", "major-aspects"],
  },

  "safe-place": {
    id: "safe-place",
    narrativeForm: "scene",
    emotionalObjective:
      "Quietly answer: \"Why can't I fully relax, even at home?\" Describe the environment, the pace, and the kind of company their interior actually needs — as opposed to the one they keep trying to survive in.",
    tone: "Soft, tender, protective.",
    desiredReaderFeeling:
      "A physical exhale. Shoulders down.",
    writingStyle:
      "Open on a Tuesday-evening scene, not a philosophical claim. What the light looks like, what is on the counter, who is or isn't in the room, what is playing. Sensory. Short paragraphs. Land what they are actually protecting when they say they need \"space\". Close on the smallest specific thing they could build more of on purpose.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "End on the arc of a person who has been quietly building this shelter their whole life. That whole life is the next chapter.",
    astrologyInputs: ["moon", "ic", "house-2"],
  },

  "life-story": {
    id: "life-story",
    narrativeForm: "memory",
    emotionalObjective:
      "Quietly answer: \"Why does my life not follow the shape everyone else's does?\" Give them the shape of their whole arc — beginning, middle, direction — as if narrating a film they are the lead in.",
    tone: "Cinematic, generous, quietly certain.",
    desiredReaderFeeling:
      "\"So all of this was going somewhere.\"",
    writingStyle:
      "Tell them the story of themselves the way a friend would at 2am. Move through beginning, middle, and where they're pointed, without labelling any of it. Callback to at least two earlier chapters by image, not by chapter name. This chapter can carry a bit more weight than most, but no metaphors about rivers, mountains, seasons, or maps. Close on one line they would screenshot. Do not moralise. Do not tie it up.",
    approxWords: [550, 650],
    transitionGoal:
      "End on a beat of arrival that quietly holds a question about what they are walking into right now. That question is Part II.",
    astrologyInputs: ["sun", "moon", "rising", "north-node", "major-aspects"],
  },

  /* ─── Part II — Current season (needs the transit engine to feel real) ─ */

  "transit-season": {
    id: "transit-season",
    narrativeForm: "guess",
    emotionalObjective:
      "Quietly answer: \"Why does everything feel different right now?\" Name the specific season they are inside of, what is on its way out, what wants in, without predicting the future.",
    tone: "Present, aware, hopeful. Someone reading the weather with them, not for them.",
    desiredReaderFeeling:
      "\"That explains this year.\"",
    writingStyle:
      "Open with a small guess about their week — the argument they nearly had, the thing they almost bought, the message they are composing in their head. One image for what is leaving, one for what is arriving. No moon-phase clichés. No dates. Close on a line about how this season is not what they think it is.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "End on the sense that this season is showing up across everything they care about at once. That's the next chapter's air.",
    astrologyInputs: ["current-transits", "saturn"],
  },

  "transit-life-areas": {
    id: "transit-life-areas",
    narrativeForm: "dialogue",
    emotionalObjective:
      "Quietly answer: \"Why is love, work, and money all feeling like this at the same time?\" Braid three specific reads into one continuous paragraph so they feel one weather across three windows, not three sections.",
    tone: "Grounded, useful, specific. A friend catching them up on themselves.",
    desiredReaderFeeling:
      "\"Okay. That is exactly what is happening.\"",
    writingStyle:
      "Open with a small three-voice exchange — their heart, their calendar, their account. Then one paragraph each for love, career, money, braided by the same underlying weather. No listy structure, no headings, no numbered areas. Close by naming the one theme running through all three.",
    approxWords: [500, 600],
    transitionGoal:
      "End on the theme running through all three. That theme is telling them something about timing. The next chapter listens to it.",
    astrologyInputs: ["current-transits", "venus", "midheaven", "jupiter", "house-2"],
  },

  "transit-timing": {
    id: "transit-timing",
    narrativeForm: "challenge",
    emotionalObjective:
      "Quietly answer: \"Why does this feel like a window I'm not supposed to miss?\" Give them a clear read on the window: one thing to take, one thing to avoid, one soft timeframe, without prophesying.",
    tone: "Clear-eyed, unshowy. The friend who tells them what she would actually do.",
    desiredReaderFeeling:
      "A small forward lean. \"I know what to do now.\"",
    writingStyle:
      "Open with a friendly dare — there is a decision in the next few weeks they already know they have to make. One opportunity, one mistake to avoid, one window with approximate timing (weeks or months, never exact dates). Callback to who they are from Part I. Close on a line that lands the whole book, not just the season.",
    approxWords: BASELINE_WORDS,
    transitionGoal:
      "This is the last chapter. End on a line that quietly hands them back to their own life.",
    astrologyInputs: ["current-transits", "major-aspects"],
  },
};
