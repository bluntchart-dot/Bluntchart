/**
 * lib/tarot/deck.ts
 *
 * Full 78-card tarot deck: 22 Major Arcana + 56 Minor Arcana.
 * Each card has upright and reversed meanings plus keywords.
 */

export interface TarotCard {
  readonly id: string;
  readonly name: string;
  readonly arcana: "major" | "minor";
  readonly suit?: "wands" | "cups" | "swords" | "pentacles";
  readonly number?: number;
  readonly keywords: readonly string[];
  readonly upright: string;
  readonly reversed: string;
}

/* ═════════════════════════════════════════════════════════════════
   MAJOR ARCANA (0-21)
═════════════════════════════════════════════════════════════════ */

const MAJOR_ARCANA: TarotCard[] = [
  { id: "major-0",  name: "The Fool",            arcana: "major", number: 0,  keywords: ["beginnings", "innocence", "spontaneity", "free spirit"], upright: "New beginnings, innocence, spontaneity, a leap of faith", reversed: "Holding back, recklessness, risk-taking without thinking" },
  { id: "major-1",  name: "The Magician",         arcana: "major", number: 1,  keywords: ["manifestation", "resourcefulness", "power", "inspired action"], upright: "Manifestation, resourcefulness, power, inspired action", reversed: "Manipulation, poor planning, untapped talents" },
  { id: "major-2",  name: "The High Priestess",   arcana: "major", number: 2,  keywords: ["intuition", "sacred knowledge", "divine feminine", "the subconscious"], upright: "Intuition, sacred knowledge, the subconscious mind", reversed: "Secrets, disconnected from intuition, withdrawal" },
  { id: "major-3",  name: "The Empress",          arcana: "major", number: 3,  keywords: ["femininity", "beauty", "nature", "nurturing", "abundance"], upright: "Femininity, beauty, nature, nurturing, abundance", reversed: "Creative block, dependence on others, emptiness" },
  { id: "major-4",  name: "The Emperor",          arcana: "major", number: 4,  keywords: ["authority", "establishment", "structure", "father figure"], upright: "Authority, establishment, structure, a solid foundation", reversed: "Domination, excessive control, lack of discipline, inflexibility" },
  { id: "major-5",  name: "The Hierophant",       arcana: "major", number: 5,  keywords: ["spiritual wisdom", "tradition", "conformity", "morality"], upright: "Spiritual wisdom, religious beliefs, conformity, tradition", reversed: "Personal beliefs, freedom, challenging the status quo" },
  { id: "major-6",  name: "The Lovers",           arcana: "major", number: 6,  keywords: ["love", "harmony", "relationships", "values alignment", "choices"], upright: "Love, harmony, relationships, values alignment, choices", reversed: "Self-love, disharmony, imbalance, misalignment of values" },
  { id: "major-7",  name: "The Chariot",          arcana: "major", number: 7,  keywords: ["control", "willpower", "success", "action", "determination"], upright: "Control, willpower, success, action, determination", reversed: "Self-discipline lacking, opposition, no direction" },
  { id: "major-8",  name: "Strength",             arcana: "major", number: 8,  keywords: ["strength", "courage", "persuasion", "influence", "compassion"], upright: "Strength, courage, persuasion, influence, compassion", reversed: "Inner strength, self-doubt, low energy, raw emotion" },
  { id: "major-9",  name: "The Hermit",           arcana: "major", number: 9,  keywords: ["soul-searching", "introspection", "being alone", "inner guidance"], upright: "Soul-searching, introspection, being alone, inner guidance", reversed: "Isolation, loneliness, withdrawal, lost your way" },
  { id: "major-10", name: "Wheel of Fortune",     arcana: "major", number: 10, keywords: ["good luck", "karma", "life cycles", "destiny", "a turning point"], upright: "Good luck, karma, life cycles, destiny, a turning point", reversed: "Bad luck, resistance to change, breaking cycles" },
  { id: "major-11", name: "Justice",              arcana: "major", number: 11, keywords: ["justice", "fairness", "truth", "cause and effect", "law"], upright: "Justice, fairness, truth, cause and effect, law", reversed: "Unfairness, lack of accountability, dishonesty" },
  { id: "major-12", name: "The Hanged Man",       arcana: "major", number: 12, keywords: ["pause", "surrender", "letting go", "new perspectives"], upright: "Pause, surrender, letting go, new perspectives", reversed: "Delays, resistance, stalling, indecision" },
  { id: "major-13", name: "Death",                arcana: "major", number: 13, keywords: ["endings", "change", "transformation", "transition"], upright: "Endings, change, transformation, transition", reversed: "Resistance to change, personal transformation, inner purging" },
  { id: "major-14", name: "Temperance",           arcana: "major", number: 14, keywords: ["balance", "moderation", "patience", "purpose"], upright: "Balance, moderation, patience, purpose", reversed: "Imbalance, excess, self-healing, realignment" },
  { id: "major-15", name: "The Devil",            arcana: "major", number: 15, keywords: ["shadow self", "attachment", "addiction", "restriction", "sexuality"], upright: "Shadow self, attachment, addiction, restriction", reversed: "Releasing limiting beliefs, exploring dark thoughts, detachment" },
  { id: "major-16", name: "The Tower",            arcana: "major", number: 16, keywords: ["sudden change", "upheaval", "chaos", "revelation", "awakening"], upright: "Sudden change, upheaval, chaos, revelation, awakening", reversed: "Personal transformation, fear of change, averting disaster" },
  { id: "major-17", name: "The Star",             arcana: "major", number: 17, keywords: ["hope", "faith", "purpose", "renewal", "spirituality"], upright: "Hope, faith, purpose, renewal, serenity", reversed: "Lack of faith, despair, self-trust issues, disconnection" },
  { id: "major-18", name: "The Moon",             arcana: "major", number: 18, keywords: ["illusion", "fear", "anxiety", "subconscious", "intuition"], upright: "Illusion, fear, anxiety, subconscious, intuition", reversed: "Release of fear, repressed emotion, inner confusion" },
  { id: "major-19", name: "The Sun",              arcana: "major", number: 19, keywords: ["positivity", "fun", "warmth", "success", "vitality"], upright: "Positivity, fun, warmth, success, vitality", reversed: "Inner child, feeling down, overly optimistic" },
  { id: "major-20", name: "Judgement",            arcana: "major", number: 20, keywords: ["judgement", "rebirth", "inner calling", "absolution"], upright: "Judgement, rebirth, inner calling, absolution", reversed: "Self-doubt, inner critic, ignoring the call" },
  { id: "major-21", name: "The World",            arcana: "major", number: 21, keywords: ["completion", "integration", "accomplishment", "travel"], upright: "Completion, integration, accomplishment, travel", reversed: "Seeking personal closure, short-cuts, delays" },
];

/* ═════════════════════════════════════════════════════════════════
   MINOR ARCANA GENERATOR
═════════════════════════════════════════════════════════════════ */

type Suit = "wands" | "cups" | "swords" | "pentacles";

interface MinorDef {
  readonly number: number;
  readonly label: string;
  readonly keywords: Record<Suit, readonly string[]>;
  readonly upright: Record<Suit, string>;
  readonly reversed: Record<Suit, string>;
}

const COURT = ["Page", "Knight", "Queen", "King"] as const;

const SUIT_THEMES: Record<Suit, { element: string; domain: string }> = {
  wands:     { element: "Fire",  domain: "passion, creativity, ambition, energy" },
  cups:      { element: "Water", domain: "emotions, relationships, feelings, intuition" },
  swords:    { element: "Air",   domain: "thoughts, words, conflict, truth" },
  pentacles: { element: "Earth", domain: "money, career, health, material world" },
};

const MINOR_DEFS: MinorDef[] = [
  { number: 1,  label: "Ace",   keywords: { wands: ["inspiration", "new beginning", "creation"], cups: ["love", "new feelings", "emotional awakening"], swords: ["breakthrough", "clarity", "new idea"], pentacles: ["new opportunity", "prosperity", "new venture"] }, upright: { wands: "Inspiration, new opportunities, growth, potential", cups: "Love, new relationships, compassion, creativity", swords: "Breakthrough, clarity, sharp mind, new idea", pentacles: "New financial opportunity, prosperity, new venture" }, reversed: { wands: "Emerging idea not yet ready, delays in plans", cups: "Self-love needed, blocked emotions, emptiness", swords: "Confusion, chaos, lack of clarity, brutality", pentacles: "Lost opportunity, lack of planning, poor finances" } },
  { number: 2,  label: "Two",   keywords: { wands: ["planning", "decisions", "discovery"], cups: ["unified love", "partnership", "mutual attraction"], swords: ["indecision", "stalemate", "difficult choices"], pentacles: ["balance", "adaptability", "juggling priorities"] }, upright: { wands: "Future planning, progress, decisions, discovery", cups: "Unified love, partnership, mutual attraction", swords: "Difficult choices, indecision, stalemate, blocked emotions", pentacles: "Multiple priorities, time management, adaptability" }, reversed: { wands: "Personal alignment, fear of the unknown", cups: "Self-love, break-up, disharmony, distrust", swords: "Indecision, confusion, information overload", pentacles: "Over-committed, disorganization, reprioritization" } },
  { number: 3,  label: "Three", keywords: { wands: ["progress", "expansion", "foresight"], cups: ["celebration", "friendship", "creativity", "community"], swords: ["heartbreak", "suffering", "grief", "sorrow"], pentacles: ["teamwork", "collaboration", "learning", "growth"] }, upright: { wands: "Progress, expansion, foresight, overseas opportunities", cups: "Celebration, friendship, creativity, community", swords: "Heartbreak, emotional pain, sorrow, grief, rejection", pentacles: "Teamwork, collaboration, learning, implementation" }, reversed: { wands: "Obstacles, delays, frustration, playing small", cups: "Overindulgence, gossip, isolation from others", swords: "Recovery, forgiveness, moving on from pain", pentacles: "Lack of teamwork, disregard for skills, poor quality" } },
  { number: 4,  label: "Four",  keywords: { wands: ["celebration", "harmony", "homecoming"], cups: ["meditation", "contemplation", "apathy"], swords: ["rest", "recovery", "contemplation", "passive"], pentacles: ["security", "conservation", "control", "stability"] }, upright: { wands: "Celebration, joy, harmony, relaxation, homecoming", cups: "Meditation, contemplation, apathy, reevaluation", swords: "Rest, relaxation, meditation, contemplation, recovery", pentacles: "Long-term security, stability, conservation" }, reversed: { wands: "Personal celebration, inner harmony, conflict with others", cups: "Retreat, withdrawal, checking in for alignment", swords: "Restlessness, burnout, stress, lack of rest", pentacles: "Over-spending, greed, insecurity, possessiveness" } },
  { number: 5,  label: "Five",  keywords: { wands: ["disagreement", "competition", "tension"], cups: ["regret", "failure", "disappointment", "pessimism"], swords: ["conflict", "defeat", "win at all costs", "intimidation"], pentacles: ["financial loss", "poverty", "lack mindset", "isolation"] }, upright: { wands: "Disagreement, competition, tension, conflict", cups: "Regret, failure, disappointment, pessimism", swords: "Conflict, disagreements, competition, defeat, winning at all costs", pentacles: "Financial loss, poverty, lack mindset, isolation, worry" }, reversed: { wands: "Inner conflict, conflict avoidance, release tension", cups: "Personal setbacks, self-forgiveness, moving on", swords: "Reconciliation, making amends, past resentment", pentacles: "Recovery from financial loss, spiritual poverty" } },
  { number: 6,  label: "Six",   keywords: { wands: ["success", "public recognition", "progress"], cups: ["revisiting the past", "childhood memories", "innocence"], swords: ["transition", "change", "rite of passage"], pentacles: ["giving", "receiving", "sharing wealth", "generosity"] }, upright: { wands: "Public recognition, progress, self-confidence", cups: "Revisiting the past, childhood memories, innocence, joy", swords: "Transition, change, rite of passage, releasing baggage", pentacles: "Giving, receiving, sharing wealth, generosity, charity" }, reversed: { wands: "Egotism, lack of recognition, fall from grace", cups: "Living in the past, unrealistic memories, being stuck", swords: "Resistance to transition, unfinished business", pentacles: "Self-care, unpaid debts, one-sided charity" } },
  { number: 7,  label: "Seven", keywords: { wands: ["challenge", "competition", "perseverance"], cups: ["opportunities", "choices", "wishful thinking", "illusion"], swords: ["betrayal", "deception", "getting away with it", "strategy"], pentacles: ["long-term view", "sustainable results", "perseverance", "investment"] }, upright: { wands: "Challenge, competition, protection, perseverance", cups: "Opportunities, choices, wishful thinking, illusion", swords: "Betrayal, deception, getting away with something, acting strategically", pentacles: "Long-term view, sustainable results, perseverance, investment" }, reversed: { wands: "Exhaustion, giving up, overwhelmed", cups: "Alignment, personal values, overwhelmed by choices", swords: "Imposter syndrome, coming clean, conscience", pentacles: "Lack of long-term vision, limited success or reward" } },
  { number: 8,  label: "Eight", keywords: { wands: ["speed", "action", "movement", "quick decisions"], cups: ["disappointment", "abandonment", "withdrawal"], swords: ["restriction", "imprisonment", "self-limiting beliefs"], pentacles: ["apprenticeship", "repetitive tasks", "mastery", "skill development"] }, upright: { wands: "Speed, action, air travel, movement, quick decisions", cups: "Disappointment, abandonment, withdrawal, escapism", swords: "Negative thoughts, self-imposed restriction, imprisonment, victim mentality", pentacles: "Apprenticeship, repetitive tasks, mastery, skill development" }, reversed: { wands: "Delays, frustration, resisting change, internal alignment", cups: "Trying one more time, indecision, aimless drifting", swords: "Self-acceptance, new perspective, freedom", pentacles: "Self-development, perfectionism, misdirected activity" } },
  { number: 9,  label: "Nine",  keywords: { wands: ["resilience", "grit", "last stretch", "boundaries"], cups: ["contentment", "satisfaction", "gratitude", "wish come true"], swords: ["anxiety", "worry", "fear", "depression", "nightmares"], pentacles: ["abundance", "luxury", "self-sufficiency", "financial security"] }, upright: { wands: "Resilience, courage, persistence, test of faith, boundaries", cups: "Contentment, satisfaction, gratitude, wish come true", swords: "Anxiety, worry, fear, depression, nightmares", pentacles: "Abundance, luxury, self-sufficiency, financial security" }, reversed: { wands: "Overwhelm, defensive, paranoia, struggle", cups: "Inner happiness, materialism, dissatisfaction, indulgence", swords: "Hope, reaching out, despair turning to relief", pentacles: "Self-worth, over-investment in work, hustling" } },
  { number: 10, label: "Ten",   keywords: { wands: ["burden", "extra responsibility", "hard work"], cups: ["divine love", "blissful relationships", "harmony", "alignment"], swords: ["painful endings", "deep wounds", "betrayal", "loss", "crisis"], pentacles: ["wealth", "financial security", "family", "long-term success", "inheritance"] }, upright: { wands: "Burden, extra responsibility, hard work, completion", cups: "Harmony, marriage, happiness, alignment, family", swords: "Painful endings, deep wounds, betrayal, loss, crisis", pentacles: "Wealth, financial security, family, long-term success, inheritance" }, reversed: { wands: "Doing it all, carrying too much, delegation needed", cups: "Disconnection, misalignment, unrealistic expectations", swords: "Recovery, regeneration, resisting an inevitable end", pentacles: "Financial failure or loss, lone wolf, transient" } },
];

const COURT_DEFS: Record<string, { keywords: Record<Suit, readonly string[]>; upright: Record<Suit, string>; reversed: Record<Suit, string> }> = {
  Page: {
    keywords: { wands: ["exploration", "excitement", "freedom"], cups: ["creative opportunity", "curiosity", "possibility"], swords: ["new ideas", "curiosity", "thirst for knowledge"], pentacles: ["ambition", "desire", "diligence", "a new career"] },
    upright: { wands: "Exploration, excitement, freedom, discovery", cups: "Creative opportunities, curiosity, possibility", swords: "New ideas, curiosity, thirst for knowledge, new ways of communicating", pentacles: "Ambition, desire, diligence, a new career or money opportunity" },
    reversed: { wands: "Newly found passion, lack of direction, distraction", cups: "Emotional immaturity, insecurity, creative block", swords: "Self-expression, all talk no action, hurtful gossip", pentacles: "Lack of progress, procrastination, learn from failure" },
  },
  Knight: {
    keywords: { wands: ["energy", "passion", "inspired action", "adventure"], cups: ["creativity", "romance", "charm", "imagination"], swords: ["ambitious", "action-oriented", "driven to succeed"], pentacles: ["hard work", "productivity", "routine", "conservatism"] },
    upright: { wands: "Energy, passion, inspired action, adventure, impulsiveness", cups: "Creativity, romance, charm, imagination, beauty", swords: "Ambitious, action-oriented, driven to succeed, fast-thinking", pentacles: "Hard work, productivity, routine, conservatism" },
    reversed: { wands: "Passion project, haste, scattered energy, delays", cups: "Overactive imagination, unrealistic, jealousy", swords: "Restless, unfocused, impulsive, burnout", pentacles: "Self-discipline, boredom, feeling stuck, perfectionism" },
  },
  Queen: {
    keywords: { wands: ["courage", "confidence", "independence", "social butterfly"], cups: ["compassion", "calm", "comfort", "emotionally secure"], swords: ["independent", "unbiased judgement", "clear boundaries"], pentacles: ["nurturing", "practical", "providing financially", "a working parent"] },
    upright: { wands: "Courage, confidence, independence, social butterfly, determination", cups: "Compassionate, caring, emotionally stable, intuitive, in flow", swords: "Independent, unbiased judgement, clear boundaries, direct communication", pentacles: "Nurturing, practical, providing financially, a working parent, down-to-earth" },
    reversed: { wands: "Self-respect, self-confidence, introverted, re-establish sense of self", cups: "Inner feelings, self-care, self-love, co-dependency", swords: "Overly emotional, easily influenced, bitter, cold", pentacles: "Financial independence, self-care, work-home conflict" },
  },
  King: {
    keywords: { wands: ["natural leader", "vision", "entrepreneur", "honour"], cups: ["emotionally balanced", "compassionate", "diplomatic"], swords: ["mental clarity", "intellectual power", "authority", "truth"], pentacles: ["wealth", "business", "leadership", "security", "discipline"] },
    upright: { wands: "Natural-born leader, vision, entrepreneur, honour", cups: "Emotionally balanced, compassionate, diplomatic", swords: "Mental clarity, intellectual power, authority, truth", pentacles: "Wealth, business, leadership, security, discipline, abundance" },
    reversed: { wands: "Impulsive, overbearing, unachievable expectations", cups: "Self-compassion, inner feelings, moodiness, emotionally manipulative", swords: "Quiet power, inner truth, misuse of power, manipulation", pentacles: "Financially inept, obsessed with wealth, stubborn" },
  },
};

function buildMinorArcana(): TarotCard[] {
  const cards: TarotCard[] = [];
  const suits: Suit[] = ["wands", "cups", "swords", "pentacles"];
  const suitNames: Record<Suit, string> = {
    wands: "Wands", cups: "Cups", swords: "Swords", pentacles: "Pentacles",
  };

  for (const suit of suits) {
    for (const def of MINOR_DEFS) {
      cards.push({
        id: `${suit}-${def.number}`,
        name: `${def.label} of ${suitNames[suit]}`,
        arcana: "minor",
        suit,
        number: def.number,
        keywords: def.keywords[suit],
        upright: def.upright[suit],
        reversed: def.reversed[suit],
      });
    }
    for (let ci = 0; ci < COURT.length; ci++) {
      const rank = COURT[ci];
      cards.push({
        id: `${suit}-${rank.toLowerCase()}`,
        name: `${rank} of ${suitNames[suit]}`,
        arcana: "minor",
        suit,
        number: 11 + ci,
        keywords: COURT_DEFS[rank].keywords[suit],
        upright: COURT_DEFS[rank].upright[suit],
        reversed: COURT_DEFS[rank].reversed[suit],
      });
    }
  }

  return cards;
}

export const FULL_DECK: readonly TarotCard[] = [
  ...MAJOR_ARCANA,
  ...buildMinorArcana(),
];

export const MAJOR_ARCANA_ONLY: readonly TarotCard[] = MAJOR_ARCANA;

export { SUIT_THEMES };
