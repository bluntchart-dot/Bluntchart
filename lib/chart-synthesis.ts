import type {
  ChartData,
  PlanetPosition,
  Aspect,
} from "./types";

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function findPlanet(
  chart: ChartData,
  name: string
): PlanetPosition | undefined {
  return chart.planets.find((p) => p.name === name);
}

function hasAspect(
  chart: ChartData,
  p1: string,
  p2: string,
  type?: Aspect["type"]
): boolean {
  return chart.aspects.some((a) => {
    const match =
      (a.planet1 === p1 && a.planet2 === p2) ||
      (a.planet1 === p2 && a.planet2 === p1);

    if (!match) return false;
    if (!type) return true;

    return a.type === type;
  });
}

function houseTheme(house: number): string {
  switch (house) {
    case 1:
      return "identity, confidence, first impressions";
    case 2:
      return "money, self-worth, possessions";
    case 3:
      return "communication, learning, siblings";
    case 4:
      return "home, family, emotional roots";
    case 5:
      return "romance, fun, creativity";
    case 6:
      return "health, habits, daily routine";
    case 7:
      return "relationships, commitment, mirrors";
    case 8:
      return "power, intimacy, transformation";
    case 9:
      return "beliefs, travel, expansion";
    case 10:
      return "career, status, reputation";
    case 11:
      return "friends, networks, future goals";
    case 12:
      return "hidden fears, healing, subconscious";
    default:
      return "life themes";
  }
}

function signStyle(sign: string): string {
  const map: Record<string, string> = {
    Aries: "direct, impulsive, bold",
    Taurus: "steady, stubborn, comfort-seeking",
    Gemini: "curious, restless, witty",
    Cancer: "protective, sensitive, intuitive",
    Leo: "dramatic, proud, expressive",
    Virgo: "analytical, useful, perfectionist",
    Libra: "charming, diplomatic, indecisive",
    Scorpio: "intense, private, magnetic",
    Sagittarius: "optimistic, blunt, freedom-seeking",
    Capricorn: "disciplined, strategic, serious",
    Aquarius: "independent, unconventional, detached",
    Pisces: "dreamy, empathetic, escapist",
  };

  return map[sign] || "complex, layered, evolving";
}

/* -------------------------------------------------------------------------- */
/*                                CORE SYNTHESIS                              */
/* -------------------------------------------------------------------------- */

export interface SynthesizedInsight {
  summary: string;
  strengths: string[];
  challenges: string[];
  love: string;
  career: string;
  nextMonth: string;
}

export function synthesizeChart(
  chart: ChartData
): SynthesizedInsight {
  const sun = findPlanet(chart, "Sun");
  const moon = findPlanet(chart, "Moon");
  const mercury = findPlanet(chart, "Mercury");
  const venus = findPlanet(chart, "Venus");
  const mars = findPlanet(chart, "Mars");
  const saturn = findPlanet(chart, "Saturn");
  const jupiter = findPlanet(chart, "Jupiter");

  const strengths: string[] = [];
  const challenges: string[] = [];

  /* ------------------------------ Strengths -------------------------------- */

  if (sun) {
    strengths.push(
      `Your core personality feels ${signStyle(
        sun.sign
      )}. People notice this quickly.`
    );
  }

  if (moon) {
    strengths.push(
      `Emotionally, you process life through ${moon.sign.toLowerCase()} energy, which shapes your private reactions.`
    );
  }

  if (jupiter) {
    strengths.push(
      `Growth comes through ${houseTheme(
        jupiter.house
      )}. Luck increases when you invest there.`
    );
  }

  if (hasAspect(chart, "Sun", "Jupiter", "trine")) {
    strengths.push(
      "You naturally attract momentum when you believe in yourself."
    );
  }

  if (hasAspect(chart, "Mercury", "Uranus")) {
    strengths.push(
      "Your mind can spot patterns faster than most people."
    );
  }

  /* ------------------------------ Challenges ------------------------------- */

  if (saturn) {
    challenges.push(
      `Life lessons often hit around ${houseTheme(
        saturn.house
      )}. This area may feel delayed before it becomes mastery.`
    );
  }

  if (hasAspect(chart, "Moon", "Saturn")) {
    challenges.push(
      "You may hide emotions until they become heavier than necessary."
    );
  }

  if (hasAspect(chart, "Venus", "Mars", "square")) {
    challenges.push(
      "You can want love and independence at the same time, creating mixed signals."
    );
  }

  if (hasAspect(chart, "Mercury", "Neptune")) {
    challenges.push(
      "Sometimes intuition is strong, but clarity gets delayed."
    );
  }

  /* -------------------------------- Love ---------------------------------- */

  const love = venus
    ? `In relationships, you love in a ${venus.sign.toLowerCase()} style. You value ${houseTheme(
        venus.house
      )}. People who match that rhythm feel safe to you.`
    : "Your relationships mirror what you believe you deserve.";

  /* ------------------------------- Career ---------------------------------- */

  const career = mars
    ? `Career drive comes through ${mars.sign.toLowerCase()} energy. You perform best when work allows movement, challenge, and visible progress. Focus on ${houseTheme(
        mars.house
      )}.`
    : "Career improves when your ambition and routine finally align.";

  /* ------------------------------ Summary ---------------------------------- */

  const summary = `
You are not random. Your chart shows repeated themes around ${
    sun ? sun.sign.toLowerCase() : "identity"
  } confidence, ${
    moon ? moon.sign.toLowerCase() : "emotion"
  } emotional habits, and the need to grow through ${
    jupiter ? houseTheme(jupiter.house) : "new experiences"
  }.
You tend to evolve the hard way first, then become strong because of it.
`.trim();

  /* ----------------------------- Next Month -------------------------------- */

  const nextMonth = `
Over the next 30 days, simplify one draining commitment and commit harder to one meaningful goal. Momentum follows clarity.
`.trim();

  return {
    summary,
    strengths,
    challenges,
    love,
    career,
    nextMonth,
  };
}