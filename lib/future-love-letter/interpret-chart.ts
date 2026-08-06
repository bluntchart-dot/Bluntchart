import type { ChartData, PlanetPosition, Aspect } from "@/lib/types";
import type { RelationshipBrief, RelationshipInsight } from "./types";

function findPlanet(chart: ChartData, name: string): PlanetPosition | undefined {
  return chart.planets.find((p) => p.name === name);
}

function findAspects(chart: ChartData, planet: string): Aspect[] {
  return chart.aspects.filter(
    (a) => a.planet1 === planet || a.planet2 === planet,
  );
}

function aspectsBetween(chart: ChartData, p1: string, p2: string): Aspect[] {
  return chart.aspects.filter(
    (a) =>
      (a.planet1 === p1 && a.planet2 === p2) ||
      (a.planet1 === p2 && a.planet2 === p1),
  );
}

function signElement(sign: string): string {
  const fire = ["Aries", "Leo", "Sagittarius"];
  const earth = ["Taurus", "Virgo", "Capricorn"];
  const air = ["Gemini", "Libra", "Aquarius"];
  if (fire.includes(sign)) return "fire";
  if (earth.includes(sign)) return "earth";
  if (air.includes(sign)) return "air";
  return "water";
}

function signModality(sign: string): string {
  const cardinal = ["Aries", "Cancer", "Libra", "Capricorn"];
  const fixed = ["Taurus", "Leo", "Scorpio", "Aquarius"];
  if (cardinal.includes(sign)) return "cardinal";
  if (fixed.includes(sign)) return "fixed";
  return "mutable";
}

function insight(
  text: string,
  evidence: string[],
  confidence: "high" | "medium" | "low" = "medium",
): RelationshipInsight {
  return { insight: text, evidence, confidence };
}

function interpretMoonSign(moon: PlanetPosition): RelationshipInsight[] {
  const results: RelationshipInsight[] = [];
  const s = moon.sign;
  const h = moon.house;
  const evidence = [`Moon in ${s}`, `Moon in house ${h}`];

  const emotionalBySign: Record<string, string> = {
    Aries: "needs directness and immediate emotional honesty; can feel suffocated by passive-aggressive patterns; processes feelings through action rather than reflection",
    Taurus: "needs consistency and physical presence to feel secure; emotional trust builds slowly but runs deep; can withdraw completely when routine or stability is disrupted",
    Gemini: "needs verbal processing and intellectual engagement to feel emotionally connected; can appear detached when actually overwhelmed; needs a partner who can keep up conversationally",
    Cancer: "needs emotional reciprocity and visible nurturing; can over-give then feel resentful; tends to test whether a partner notices what they need without being asked",
    Leo: "needs to feel genuinely admired and chosen, not just convenient; emotional warmth is non-negotiable; can mistake flattery for real attention",
    Virgo: "needs to feel useful and needed; shows love through practical care and notices when it's not returned; can become critical when anxious about the relationship",
    Libra: "needs harmony and partnership to feel grounded; can suppress real feelings to avoid conflict; emotional security comes through being treated as an equal",
    Scorpio: "needs intense emotional honesty and depth; cannot tolerate superficial emotional connection; processes feelings privately before sharing; tests trust repeatedly",
    Sagittarius: "needs emotional freedom and space to process independently; can feel trapped by heavy emotional demands; shows love through shared experience and humor",
    Capricorn: "needs to respect a partner before opening up emotionally; emotional vulnerability feels like risk; shows love through reliability and long-term commitment rather than grand gestures",
    Aquarius: "needs intellectual respect and personal space within closeness; emotional expression can feel awkward or delayed; values friendship within romance",
    Pisces: "absorbs a partner's emotional state; needs gentleness and can withdraw when overwhelmed; boundaries in love are genuinely difficult but essential",
  };

  if (emotionalBySign[s]) {
    results.push(insight(emotionalBySign[s], evidence, "high"));
  }

  if ([4, 7, 8, 12].includes(h)) {
    const houseNote: Record<number, string> = {
      4: "emotional security is deeply tied to home, family patterns, and sense of belonging",
      7: "emotional needs become especially activated in committed partnerships; may unconsciously seek partners who mirror early emotional dynamics",
      8: "emotional intensity runs deep; intimacy involves vulnerability that can feel threatening; trust is earned through crisis, not comfort",
      12: "may struggle to articulate emotional needs clearly; can feel emotionally isolated even in close relationships; needs a partner who reads what's unspoken",
    };
    if (houseNote[h]) {
      results.push(insight(houseNote[h], [`Moon in house ${h}`], "high"));
    }
  }

  return results;
}

function interpretVenus(venus: PlanetPosition, chart: ChartData): RelationshipInsight[] {
  const results: RelationshipInsight[] = [];
  const s = venus.sign;
  const evidence = [`Venus in ${s}`, `Venus in house ${venus.house}`];

  const venusDescriptions: Record<string, string> = {
    Aries: "drawn to bold, direct pursuit; can lose interest when the chase ends; values independence within a relationship; may initiate but struggle with sustained vulnerability",
    Taurus: "values sensuality, loyalty and material comfort in love; slow to commit but deeply devoted once attached; can become possessive when insecure",
    Gemini: "needs mental stimulation and variety in love; flirting is natural, not necessarily a red flag; can struggle with depth when lightness feels safer",
    Cancer: "loves through nurturing and emotional closeness; can become clingy or test a partner's devotion through withdrawal; values domestic intimacy",
    Leo: "needs romance, grand gestures and visible adoration; generous and warm but expects reciprocation; can feel devastated when taken for granted",
    Virgo: "shows love through acts of service and practical devotion; may struggle to express affection verbally; can become critical when love feels insecure",
    Libra: "values beauty, partnership and fairness in love; can idealize partners or relationships; may avoid necessary conflict to preserve the aesthetic of harmony",
    Scorpio: "loves with intensity and total commitment; all-or-nothing approach to relationships; jealousy and possessiveness can surface when trust is uncertain",
    Sagittarius: "values freedom, adventure and growth in love; can struggle with commitment that feels restrictive; needs a partner who has their own passions",
    Capricorn: "approaches love with caution and long-term thinking; may struggle with spontaneous affection; values a partner who is ambitious and self-sufficient",
    Aquarius: "values intellectual connection and unconventional dynamics; can seem emotionally detached; needs space and will resist any partner who tries to constrain them",
    Pisces: "loves with empathy and idealism; can lose boundaries in relationships; tendency to romanticize unavailable or complicated partners",
  };

  if (venusDescriptions[s]) {
    results.push(insight(venusDescriptions[s], evidence, "high"));
  }

  const venusAspects = findAspects(chart, "Venus");
  for (const asp of venusAspects) {
    const other = asp.planet1 === "Venus" ? asp.planet2 : asp.planet1;
    if (other === "Saturn" && (asp.type === "square" || asp.type === "opposition")) {
      results.push(
        insight(
          "may carry a sense of not being enough in love, or attract partners who withhold; can delay commitment out of fear of rejection rather than lack of desire",
          [`Venus ${asp.type} Saturn (orb ${asp.orb}°)`],
          "high",
        ),
      );
    }
    if (other === "Pluto" && (asp.type === "conjunction" || asp.type === "square" || asp.type === "opposition")) {
      results.push(
        insight(
          "experiences love as transformative and potentially consuming; attraction patterns can involve intensity, power dynamics, or compulsive attachment",
          [`Venus ${asp.type} Pluto (orb ${asp.orb}°)`],
          "high",
        ),
      );
    }
    if (other === "Neptune" && (asp.type === "conjunction" || asp.type === "square" || asp.type === "opposition")) {
      results.push(
        insight(
          "tendency to idealize partners or fall for potential rather than reality; may struggle with clear boundaries in love; can be deeply romantic but also prone to disillusionment",
          [`Venus ${asp.type} Neptune (orb ${asp.orb}°)`],
          "medium",
        ),
      );
    }
    if (other === "Mars" && asp.type === "conjunction") {
      results.push(
        insight(
          "strong connection between desire and affection; may confuse chemistry with compatibility; passionate but can burn through relationships quickly",
          [`Venus conjunct Mars (orb ${asp.orb}°)`],
          "medium",
        ),
      );
    }
  }

  return results;
}

function interpretMars(mars: PlanetPosition, chart: ChartData): RelationshipInsight[] {
  const results: RelationshipInsight[] = [];
  const s = mars.sign;
  const evidence = [`Mars in ${s}`, `Mars in house ${mars.house}`];

  const marsDescriptions: Record<string, string> = {
    Aries: "direct and assertive in pursuit; conflict is approached head-on; can be impatient with partners who avoid confrontation",
    Taurus: "slow to act but persistent; desire is sensual and steady; can become stubborn in conflict and hold grudges",
    Gemini: "desire is activated through conversation and wit; may struggle with sustained physical intensity; argues through words rather than actions",
    Cancer: "desire is intertwined with emotional safety; can be passive-aggressive in conflict; protective instinct is strong",
    Leo: "desires to be desired; confident and generous in pursuit; conflict can become dramatic when pride is involved",
    Virgo: "desire is expressed through attentiveness and service; can be self-critical about physical expression; conflict manifests as criticism",
    Libra: "desire is activated through beauty and intellectual connection; can be indecisive in pursuit; avoids direct conflict at the cost of resentment",
    Scorpio: "intense and strategic in desire; all-or-nothing pursuit; conflict runs deep and can become manipulative when trust is broken",
    Sagittarius: "desire is adventurous and spontaneous; can lose interest without growth; conflict is blunt and quickly forgotten",
    Capricorn: "desire is controlled and ambitious; may suppress passion in favor of practicality; conflict is handled with cold composure",
    Aquarius: "desire requires intellectual stimulation and uniqueness; can be emotionally detached during intimacy; conflict is rationalized rather than felt",
    Pisces: "desire is imaginative and emotionally driven; can be passive in pursuit; conflict is avoided through retreat or martyrdom",
  };

  if (marsDescriptions[s]) {
    results.push(insight(marsDescriptions[s], evidence, "high"));
  }

  if (mars.house === 7) {
    results.push(
      insight(
        "may attract partners who are assertive, competitive, or confrontational; conflict within partnerships can be a recurring theme but also a source of growth",
        ["Mars in house 7"],
        "high",
      ),
    );
  }

  return results;
}

function interpretSeventhHouse(chart: ChartData): RelationshipInsight[] {
  const results: RelationshipInsight[] = [];
  const descSign = chart.descendant.sign;
  const house7 = chart.houses.find((h) => h.number === 7);
  const evidence = [`Descendant in ${descSign}`];

  const descDescriptions: Record<string, string> = {
    Aries: "may be drawn to partners who are bold, independent, and direct — qualities that may feel exciting but also challenging to accommodate",
    Taurus: "may seek stability, loyalty and sensuality in partners; can prioritize comfort and security in choosing relationships",
    Gemini: "may be drawn to communicative, intellectually stimulating partners; can attract people who are inconsistent but fascinating",
    Cancer: "may seek nurturing, emotionally available partners; partnership can feel like creating a home together",
    Leo: "may be drawn to confident, warm, expressive partners; can attract people who need attention and admiration",
    Virgo: "may seek partners who are practical, detail-oriented and helpful; can attract critical or anxious types",
    Libra: "may seek harmony, beauty and equality in partnerships; can over-compromise to maintain relational peace",
    Scorpio: "may be drawn to intense, transformative partners; relationships can involve deep emotional exposure and power dynamics",
    Sagittarius: "may seek adventurous, freedom-loving partners; can attract people who challenge settled beliefs",
    Capricorn: "may seek mature, ambitious, responsible partners; can attract relationships that feel like work before they feel like love",
    Aquarius: "may seek unconventional, intellectually independent partners; can attract emotionally distant types who value friendship over romance",
    Pisces: "may be drawn to empathetic, creative, emotionally complex partners; can attract people who need saving or who are emotionally unavailable",
  };

  if (descDescriptions[descSign]) {
    results.push(insight(descDescriptions[descSign], evidence, "high"));
  }

  const planetsIn7 = chart.planets.filter((p) => p.house === 7);
  if (planetsIn7.length > 0) {
    const names = planetsIn7.map((p) => p.name).join(", ");
    results.push(
      insight(
        `with ${names} placed in the 7th house, partnership themes are emphasized — relationships may be a primary arena for personal development`,
        planetsIn7.map((p) => `${p.name} in house 7`),
        "medium",
      ),
    );
  }

  return results;
}

function interpretSaturnRelationship(saturn: PlanetPosition, chart: ChartData): RelationshipInsight[] {
  const results: RelationshipInsight[] = [];

  if (saturn.house === 7) {
    results.push(
      insight(
        "may experience delays or heaviness around commitment; relationships can feel like they require proving oneself; long-term partnerships may improve significantly with maturity",
        ["Saturn in house 7"],
        "high",
      ),
    );
  }

  const saturnVenus = aspectsBetween(chart, "Saturn", "Venus");
  for (const asp of saturnVenus) {
    if (asp.type === "conjunction" || asp.type === "trine" || asp.type === "sextile") {
      results.push(
        insight(
          "capable of deep long-term devotion but may express love cautiously; loyalty and commitment come naturally but spontaneous affection may not",
          [`Saturn ${asp.type} Venus (orb ${asp.orb}°)`],
          "medium",
        ),
      );
    }
  }

  const saturnMoon = aspectsBetween(chart, "Saturn", "Moon");
  for (const asp of saturnMoon) {
    if (asp.type === "square" || asp.type === "opposition" || asp.type === "conjunction") {
      results.push(
        insight(
          "emotional expression may feel restricted or guarded; may have learned early that vulnerability leads to disappointment; needs a partner who is patient with slow emotional opening",
          [`Saturn ${asp.type} Moon (orb ${asp.orb}°)`],
          "high",
        ),
      );
    }
  }

  return results;
}

function interpretPlutoRelationship(pluto: PlanetPosition, chart: ChartData): RelationshipInsight[] {
  const results: RelationshipInsight[] = [];

  if (pluto.house === 7) {
    results.push(
      insight(
        "partnerships may involve power dynamics, deep transformation, or intensity that can feel overwhelming; relationships may end or transform dramatically before finding the right fit",
        ["Pluto in house 7"],
        "high",
      ),
    );
  }

  if (pluto.house === 8) {
    results.push(
      insight(
        "intimacy is experienced as a form of power exchange; trust in relationships must be earned through genuine vulnerability on both sides",
        ["Pluto in house 8"],
        "medium",
      ),
    );
  }

  return results;
}

function findContradictions(brief: Partial<RelationshipBrief>): RelationshipInsight[] {
  const results: RelationshipInsight[] = [];
  const all = [
    ...(brief.emotionalNeeds || []),
    ...(brief.affectionStyle || []),
    ...(brief.attractionPatterns || []),
    ...(brief.conflictPatterns || []),
    ...(brief.fearsOrDefenses || []),
  ];

  const needsIndependence = all.some((i) =>
    /freedom|independence|space|detach/i.test(i.insight),
  );
  const needsCloseness = all.some((i) =>
    /closeness|nurtur|cling|reciproc|intimacy/i.test(i.insight),
  );

  if (needsIndependence && needsCloseness) {
    results.push(
      insight(
        "tension between wanting deep emotional closeness and needing personal freedom; may send mixed signals about how much intimacy they actually want",
        ["pattern conflict: independence vs closeness needs"],
        "high",
      ),
    );
  }

  const needsStability = all.some((i) =>
    /stability|consistency|loyal|routine|steady/i.test(i.insight),
  );
  const attractedToIntensity = all.some((i) =>
    /intensity|transform|consuming|all-or-nothing|chase/i.test(i.insight),
  );

  if (needsStability && attractedToIntensity) {
    results.push(
      insight(
        "drawn to intensity and passion but actually needs consistency and reliability; may confuse unpredictability with chemistry",
        ["pattern conflict: stability need vs intensity attraction"],
        "high",
      ),
    );
  }

  return results;
}

function generateLetterHooks(
  brief: Partial<RelationshipBrief>,
  chart: ChartData,
): string[] {
  const hooks: string[] = [];
  const moon = findPlanet(chart, "Moon");
  const venus = findPlanet(chart, "Venus");
  const mars = findPlanet(chart, "Mars");

  if (moon) {
    const el = signElement(moon.sign);
    if (el === "water") hooks.push("emotional depth as both a gift and a vulnerability");
    if (el === "earth") hooks.push("shows love through presence and practical care rather than words");
    if (el === "fire") hooks.push("needs a partner who matches their emotional energy, not dampens it");
    if (el === "air") hooks.push("processes feelings through conversation but may intellectualize emotions to avoid feeling them");
  }

  if (venus && mars) {
    const venusEl = signElement(venus.sign);
    const marsEl = signElement(mars.sign);
    if (venusEl !== marsEl) {
      hooks.push("what they want in love and how they pursue it operate differently — can create internal friction about what they actually need");
    }
  }

  if (brief.specificContradictions && brief.specificContradictions.length > 0) {
    hooks.push("the contradictions in their love nature are where the letter becomes most interesting");
  }

  const sun = findPlanet(chart, "Sun");
  if (sun && moon) {
    const sunMod = signModality(sun.sign);
    const moonMod = signModality(moon.sign);
    if (sunMod === "fixed" && moonMod === "mutable") {
      hooks.push("projects confidence and decisiveness but emotionally adapts and bends more than they'd admit");
    }
    if (sunMod === "cardinal" && moonMod === "fixed") {
      hooks.push("initiates boldly but holds on to emotional patterns long past their usefulness");
    }
  }

  return hooks;
}

export function interpretChart(chart: ChartData): RelationshipBrief {
  const moon = findPlanet(chart, "Moon");
  const venus = findPlanet(chart, "Venus");
  const mars = findPlanet(chart, "Mars");
  const saturn = findPlanet(chart, "Saturn");
  const pluto = findPlanet(chart, "Pluto");

  const emotionalNeeds = moon ? interpretMoonSign(moon) : [];
  const affectionStyle = venus ? interpretVenus(venus, chart) : [];
  const attractionPatterns = mars ? interpretMars(mars, chart) : [];
  const relationshipStrengths: RelationshipInsight[] = [];
  const relationshipChallenges: RelationshipInsight[] = [];
  const conflictPatterns: RelationshipInsight[] = [];
  const fearsOrDefenses: RelationshipInsight[] = [];
  const communicationNeeds: RelationshipInsight[] = [];

  const mercury = findPlanet(chart, "Mercury");
  if (mercury) {
    const mercDescriptions: Record<string, string> = {
      Aries: "communicates directly and can be impatient with vague emotional conversations",
      Taurus: "thinks carefully before speaking about feelings; once a position is stated, rarely changes it",
      Gemini: "needs to talk through relationship issues; silence feels like punishment",
      Cancer: "communicates emotionally and can take feedback personally; remembers every word said during arguments",
      Leo: "expresses feelings dramatically; needs to feel heard and validated in conversation",
      Virgo: "communicates precisely; may over-analyze partner's words for hidden meaning",
      Libra: "diplomatic communicator who may soften honest opinions to keep peace",
      Scorpio: "says less than they think; communicates through intensity and subtext rather than surface words",
      Sagittarius: "blunt communicator who values honesty over tact; can inadvertently hurt feelings",
      Capricorn: "measured communicator; may struggle with emotional vulnerability in conversation",
      Aquarius: "communicates ideas more readily than feelings; can intellectualize emotional conversations",
      Pisces: "intuitive communicator who absorbs tone and energy; may struggle to articulate boundaries clearly",
    };
    if (mercDescriptions[mercury.sign]) {
      communicationNeeds.push(
        insight(mercDescriptions[mercury.sign], [`Mercury in ${mercury.sign}`], "medium"),
      );
    }
  }

  const idealPartnerTraits = interpretSeventhHouse(chart);
  const healthyRelationshipDynamic: RelationshipInsight[] = [];

  if (saturn) {
    const saturnInsights = interpretSaturnRelationship(saturn, chart);
    for (const si of saturnInsights) {
      if (/delay|heavy|proving|restricted|guarded/i.test(si.insight)) {
        fearsOrDefenses.push(si);
      } else {
        relationshipStrengths.push(si);
      }
    }
  }

  if (pluto) {
    const plutoInsights = interpretPlutoRelationship(pluto, chart);
    for (const pi of plutoInsights) {
      relationshipChallenges.push(pi);
    }
  }

  if (mars) {
    const marsConflict = attractionPatterns.filter((i) =>
      /conflict|argue|stubborn|passive-aggressive|manipulat|dramatic|resentment/i.test(i.insight),
    );
    conflictPatterns.push(...marsConflict);
  }

  const sun = findPlanet(chart, "Sun");
  if (sun && moon) {
    const sunEl = signElement(sun.sign);
    const moonEl = signElement(moon.sign);
    if (sunEl === moonEl) {
      relationshipStrengths.push(
        insight(
          "identity and emotional needs are aligned — what they want and what they need from love tend to reinforce each other",
          [`Sun in ${sun.sign} (${sunEl})`, `Moon in ${moon.sign} (${moonEl})`],
          "medium",
        ),
      );
    } else {
      relationshipChallenges.push(
        insight(
          `outward identity (${sunEl}) and inner emotional needs (${moonEl}) operate from different registers — a partner may need to understand both sides`,
          [`Sun in ${sun.sign} (${sunEl})`, `Moon in ${moon.sign} (${moonEl})`],
          "medium",
        ),
      );
    }
  }

  const partial: Partial<RelationshipBrief> = {
    emotionalNeeds,
    affectionStyle,
    attractionPatterns,
    communicationNeeds,
    relationshipStrengths,
    relationshipChallenges,
    conflictPatterns,
    fearsOrDefenses,
    idealPartnerTraits,
    healthyRelationshipDynamic,
  };

  const specificContradictions = findContradictions(partial);
  const letterHooks = generateLetterHooks(
    { ...partial, specificContradictions },
    chart,
  );

  return {
    emotionalNeeds,
    affectionStyle,
    attractionPatterns,
    communicationNeeds,
    relationshipStrengths,
    relationshipChallenges,
    conflictPatterns,
    fearsOrDefenses,
    idealPartnerTraits,
    healthyRelationshipDynamic,
    specificContradictions,
    letterHooks,
  };
}
