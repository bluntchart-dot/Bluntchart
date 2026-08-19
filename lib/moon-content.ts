/**
 * Curated content library for Moon Phase Compatibility.
 *
 * 100 relationship-focused lines, deterministically selected by score
 * range and a hash of the input data. No AI/API generation.
 */

type PsychTag =
  | "chemistry"
  | "ego-boost"
  | "curiosity"
  | "tension"
  | "difference"
  | "commitment"
  | "growth"
  | "defiance";

interface ContentLine {
  text: string;
  range: [number, number];
  tag: PsychTag;
}

export const SECONDARY_LINE = "Bit different, but this moon is ours.";

const LINES: ContentLine[] = [
  // 90–100% — Exceptional chemistry
  { range: [90, 100], tag: "chemistry", text: "Chemistry isn't supposed to be this easy." },
  { range: [90, 100], tag: "ego-boost", text: "The kind of connection people write songs about and still get wrong." },
  { range: [90, 100], tag: "ego-boost", text: "Some people search their whole life for what you two just… have." },
  { range: [90, 100], tag: "chemistry", text: "Dangerously compatible." },
  { range: [90, 100], tag: "curiosity", text: "You finish each other's silences. That's the real flex." },
  { range: [90, 100], tag: "ego-boost", text: "This is the connection people don't believe exists until they see it." },
  { range: [90, 100], tag: "growth", text: "You make each other better without trying to." },
  { range: [90, 100], tag: "commitment", text: "Some souls are just meant to find each other." },
  { range: [90, 100], tag: "chemistry", text: "You fit together like pieces of a puzzle designed by destiny." },
  { range: [90, 100], tag: "ego-boost", text: "Looking at you two, you realize true compatibility isn't a myth." },
  { range: [90, 100], tag: "ego-boost", text: "You are living proof that some people are just made for each other." },
  { range: [90, 100], tag: "chemistry", text: "There's enough chemistry here to keep things interesting." },
  { range: [90, 100], tag: "ego-boost", text: "Their love story feels like it was written by the stars themselves." },
  { range: [90, 100], tag: "curiosity", text: "It makes you wonder how two people could possibly fit together this perfectly." },
  { range: [90, 100], tag: "chemistry", text: "Your chemistry is a beautiful puzzle that you solve together every day." },

  // 80–89% — Strong pull
  { range: [80, 89], tag: "chemistry", text: "That's a dangerous amount of chemistry." },
  { range: [80, 89], tag: "ego-boost", text: "Not perfect. Better than perfect." },
  { range: [80, 89], tag: "growth", text: "You make each other braver. That's not nothing." },
  { range: [80, 89], tag: "tension", text: "Close enough to feel safe. Different enough to never get bored." },
  { range: [80, 89], tag: "growth", text: "You challenge each other in exactly the right places." },
  { range: [80, 89], tag: "commitment", text: "You two have options. Somehow, you keep choosing each other." },
  { range: [80, 89], tag: "tension", text: "You challenge each other without losing each other." },
  { range: [80, 89], tag: "chemistry", text: "Your love is a perfect blend of shared dreams and individual strengths." },
  { range: [80, 89], tag: "commitment", text: "You chose each other, and you choose to grow closer every single day." },
  { range: [80, 89], tag: "difference", text: "You found a unique harmony where your differences make your bond even deeper." },
  { range: [80, 89], tag: "chemistry", text: "You have that electric, magnetic chemistry that keeps the spark alive." },
  { range: [80, 89], tag: "chemistry", text: "You have that intense, magnetic pull that keeps you coming back to each other." },
  { range: [80, 89], tag: "ego-boost", text: "This is what \"I just knew\" actually looks like." },
  { range: [80, 89], tag: "commitment", text: "Their love story is beautiful because they choose each other through every twist and turn." },
  { range: [80, 89], tag: "ego-boost", text: "You make a relationship look like the most exciting adventure in the world." },

  // 70–79% — Strong complement
  { range: [70, 79], tag: "difference", text: "Enough difference to keep it interesting." },
  { range: [70, 79], tag: "difference", text: "You two aren't the same person. Thank god." },
  { range: [70, 79], tag: "curiosity", text: "You bring out sides of each other nobody else gets to see." },
  { range: [70, 79], tag: "commitment", text: "You chose each other for the right reasons. Even the weird ones." },
  { range: [70, 79], tag: "difference", text: "Different speeds, same direction." },
  { range: [70, 79], tag: "curiosity", text: "You don't always speak the same language. You still understand." },
  { range: [70, 79], tag: "tension", text: "A little complicated. Very worth it." },
  { range: [70, 79], tag: "tension", text: "You don't always make things easy. You make them interesting." },
  { range: [70, 79], tag: "tension", text: "You bring out each other's strong opinions. And somehow, it works." },
  { range: [70, 79], tag: "growth", text: "You two probably learn more from each other than you expected." },
  { range: [70, 79], tag: "difference", text: "You don't need to agree on everything to feel understood." },
  { range: [70, 79], tag: "difference", text: "You fit without having to become the same." },
  { range: [70, 79], tag: "chemistry", text: "Compatible where it counts. Interesting where it doesn't." },
  { range: [70, 79], tag: "ego-boost", text: "It is captivating how your differences make you stronger together." },

  // 60–69% — Balanced tension
  { range: [60, 69], tag: "curiosity", text: "You don't always make sense together. That's the interesting part." },
  { range: [60, 69], tag: "tension", text: "The push and pull is the whole point." },
  { range: [60, 69], tag: "difference", text: "You're not each other's type. You're each other's exception." },
  { range: [60, 69], tag: "tension", text: "Half the time you're in sync. The other half is where the story lives." },
  { range: [60, 69], tag: "growth", text: "You argue well. That matters more than people think." },
  { range: [60, 69], tag: "difference", text: "The spark comes from the difference, not the overlap." },
  { range: [60, 69], tag: "commitment", text: "Not a simple love. A real one." },
  { range: [60, 69], tag: "commitment", text: "You don't always agree. You still choose each other." },
  { range: [60, 69], tag: "difference", text: "You balance each other out — sometimes on purpose, sometimes by accident." },
  { range: [60, 69], tag: "growth", text: "You can disagree without becoming strangers." },
  { range: [60, 69], tag: "chemistry", text: "You two are proof that similarity isn't the only kind of chemistry." },
  { range: [60, 69], tag: "tension", text: "You two weren't built for boring conversations." },
  { range: [60, 69], tag: "tension", text: "There's a little friction. There's a lot of understanding." },
  { range: [60, 69], tag: "curiosity", text: "You bring out something in each other that neither gets alone." },

  // 50–59% — Honest friction
  { range: [50, 59], tag: "commitment", text: "Worth the fight." },
  { range: [50, 59], tag: "commitment", text: "More different than alike. Still can't walk away." },
  { range: [50, 59], tag: "growth", text: "The hard parts are where you grow. You two grow a lot." },
  { range: [50, 59], tag: "tension", text: "You don't make it easy for each other. That's not always a bad thing." },
  { range: [50, 59], tag: "difference", text: "You see the world differently. You look at each other the same way." },
  { range: [50, 59], tag: "curiosity", text: "Less overlap, more discovery." },
  { range: [50, 59], tag: "curiosity", text: "The gap between you is where the good stuff happens." },
  { range: [50, 59], tag: "defiance", text: "Not the easy road. The interesting one." },
  { range: [50, 59], tag: "chemistry", text: "Proof that chemistry has nothing to do with convenience." },
  { range: [50, 59], tag: "commitment", text: "The effort is the relationship. You both showed up." },
  { range: [50, 59], tag: "commitment", text: "You're not easy together. You're worth it together." },
  { range: [50, 59], tag: "difference", text: "You don't see things the same way. That's where the spark starts." },

  // 40–49% — Drawn to the difference
  { range: [40, 49], tag: "curiosity", text: "A thin thread. Turns out threads hold more than you'd think." },
  { range: [40, 49], tag: "defiance", text: "Almost nothing in common. Still somehow everything." },
  { range: [40, 49], tag: "commitment", text: "You didn't find each other. You chose each other. Repeatedly." },
  { range: [40, 49], tag: "chemistry", text: "The connection is quiet. Quiet doesn't mean weak." },
  { range: [40, 49], tag: "chemistry", text: "Very different people. Very specific chemistry." },
  { range: [40, 49], tag: "defiance", text: "You had every reason not to work. You work anyway." },
  { range: [40, 49], tag: "curiosity", text: "The attraction doesn't make logical sense. It doesn't need to." },
  { range: [40, 49], tag: "tension", text: "Different enough to clash. Curious enough to stay." },
  { range: [40, 49], tag: "commitment", text: "You notice the differences. You keep choosing each other." },
  { range: [40, 49], tag: "defiance", text: "You weren't supposed to work. Nobody told you that." },

  // 30–39% — Against the odds
  { range: [30, 39], tag: "defiance", text: "The odds were against this. You don't seem to care." },
  { range: [30, 39], tag: "defiance", text: "Against all logic. And yet." },
  { range: [30, 39], tag: "curiosity", text: "A connection this unlikely is either nothing or everything." },
  { range: [30, 39], tag: "commitment", text: "What you have didn't come free. That's why it means something." },
  { range: [30, 39], tag: "ego-boost", text: "You make no sense together. That's what makes people stare." },
  { range: [30, 39], tag: "commitment", text: "You share almost nothing. Except the decision to stay." },

  // 20–29% — Unlikely, but intriguing
  { range: [20, 29], tag: "commitment", text: "Nothing was given. Everything was chosen." },
  { range: [20, 29], tag: "growth", text: "You started with nothing between you. Look at you now." },
  { range: [20, 29], tag: "chemistry", text: "No borrowed chemistry. Everything between you is yours." },
  { range: [20, 29], tag: "defiance", text: "No easy explanation. No one's asking for one." },
  { range: [20, 29], tag: "defiance", text: "Not compatible. Not done." },

  // 0–19% — Very different
  { range: [0, 19], tag: "growth", text: "Somehow, you make each other better anyway." },
  { range: [0, 19], tag: "defiance", text: "You prove that the heart wants what it wants, regardless of the odds." },
  { range: [0, 19], tag: "defiance", text: "Your love is a quiet rebellion against a world that says you shouldn't work." },
  { range: [0, 19], tag: "chemistry", text: "You're a chaotic, thrilling match that lives completely on your own terms." },
  { range: [0, 19], tag: "ego-boost", text: "You break every single rule in the book and look incredibly good doing it." },
  { range: [0, 19], tag: "chemistry", text: "You have a wild, untamed energy that keeps the spark burning white-hot." },
  { range: [0, 19], tag: "tension", text: "You prove that a little bit of danger makes this relationship a lot more exciting." },
  { range: [0, 19], tag: "defiance", text: "You beat the odds and make your own rules as a couple." },
  { range: [0, 19], tag: "commitment", text: "You found each other in spite of the odds. That's something." },
];

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export function getContentLine(
  score: number,
  name1: string,
  date1: string,
  name2: string,
  date2: string
): string {
  const candidates = LINES.filter(
    (l) => score >= l.range[0] && score <= l.range[1]
  );
  if (candidates.length === 0) return "";
  const seed = hashSeed(name1 + date1 + name2 + date2);
  return candidates[seed % candidates.length].text;
}

export function getLineCount(): number {
  return LINES.length;
}

export function getAllLines(): { text: string; range: [number, number]; tag: string }[] {
  return LINES.map((l) => ({ text: l.text, range: l.range, tag: l.tag }));
}
