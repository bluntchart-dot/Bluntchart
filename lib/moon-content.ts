/**
 * Curated content library for Moon Phase Compatibility.
 *
 * ~500 pre-written lines, deterministically selected by score range
 * and a hash of the input data. No AI/API generation.
 *
 * Each line is short, emotionally triggering, and free of astrology jargon.
 */

interface ContentLine {
  text: string;
  range: [number, number]; // inclusive score range
}

const LINES: ContentLine[] = [
  // 90-100: shared sky — deep resonance
  { range: [90, 100], text: "Your moons light up almost the entire sky together." },
  { range: [90, 100], text: "Two moons, one sky. Barely a shadow between you." },
  { range: [90, 100], text: "The night you were born, the moon was already waiting for theirs." },
  { range: [90, 100], text: "Together your moons leave almost nothing in the dark." },
  { range: [90, 100], text: "Some pairs light up a sliver. You two light up the whole thing." },
  { range: [90, 100], text: "If your moons shared one sky, you'd forget what darkness looked like." },
  { range: [90, 100], text: "Your moons don't just match. They complete each other's light." },
  { range: [90, 100], text: "Born under moons that refuse to leave any corner unlit." },
  { range: [90, 100], text: "You share the kind of light most people only get alone." },
  { range: [90, 100], text: "When your moons overlap, the sky barely needs stars." },

  // 80-89: growing bright — strong connection
  { range: [80, 89], text: "Your moons fill most of the sky. The rest is just atmosphere." },
  { range: [80, 89], text: "Not quite a full sky, but close enough to feel it in the dark." },
  { range: [80, 89], text: "Your moons leave just enough shadow to keep things interesting." },
  { range: [80, 89], text: "Together your moons make a light most people search their whole lives for." },
  { range: [80, 89], text: "The small dark space between your moons is where the good tension lives." },
  { range: [80, 89], text: "Two moons that almost fill the sky. The gap is what makes it beautiful." },
  { range: [80, 89], text: "Enough light to see each other clearly. Enough shadow to stay curious." },
  { range: [80, 89], text: "Your moons were born wanting the same sky." },
  { range: [80, 89], text: "Most of the darkness disappears when your moons share the same night." },
  { range: [80, 89], text: "The sky you make together is brighter than either of you alone." },

  // 70-79: warm pull
  { range: [70, 79], text: "Your moons share more light than they keep for themselves." },
  { range: [70, 79], text: "Not identical, not opposite. Somewhere in the middle where it matters." },
  { range: [70, 79], text: "Your moons lean toward each other like they've done this before." },
  { range: [70, 79], text: "Together you illuminate more than you shadow. That's rarer than you think." },
  { range: [70, 79], text: "The light your moons share is quiet, but it reaches far." },
  { range: [70, 79], text: "Your moons know what the other one needs without being told." },
  { range: [70, 79], text: "A shared sky that's three-quarters bright. The rest is just room to grow." },
  { range: [70, 79], text: "Two moons that don't fight for the same part of the sky." },
  { range: [70, 79], text: "Your moons overlap where it counts and give space where it matters." },
  { range: [70, 79], text: "Not every corner is lit, but the important ones are." },

  // 60-69: balanced pull
  { range: [60, 69], text: "Your moons meet in the middle. That takes more effort than matching perfectly." },
  { range: [60, 69], text: "Different light, shared warmth. Your moons don't need to agree to connect." },
  { range: [60, 69], text: "Your moons light different corners of the same sky. That's not a flaw." },
  { range: [60, 69], text: "Sixty-something percent is where comfortable meets compelling." },
  { range: [60, 69], text: "The space between your moons isn't empty. It's where you learn each other." },
  { range: [60, 69], text: "Your moons don't mirror each other. They complement each other." },
  { range: [60, 69], text: "Not too much light. Not too much dark. Just enough tension to stay awake." },
  { range: [60, 69], text: "Your moons share the sky without crowding it." },
  { range: [60, 69], text: "Where your moons overlap, there's warmth. Where they don't, there's growth." },
  { range: [60, 69], text: "Two very different moons making one unexpectedly beautiful sky." },

  // 50-59: interesting tension
  { range: [50, 59], text: "Half light, half shadow. Your moons make the sky more interesting, not easier." },
  { range: [50, 59], text: "Your moons split the sky almost evenly. The tension is the point." },
  { range: [50, 59], text: "You were born under moons that challenge each other. That's not a warning — it's a gift." },
  { range: [50, 59], text: "Your moons don't take the easy road. They take the one worth walking." },
  { range: [50, 59], text: "Half the sky lit, half in shadow. You'll never be bored." },
  { range: [50, 59], text: "Your moons disagree just enough to keep things honest." },
  { range: [50, 59], text: "The friction between your moons is where the heat comes from." },
  { range: [50, 59], text: "Not an easy match. A real one." },
  { range: [50, 59], text: "Your moons don't make the same light. That's what makes the sky worth watching." },
  { range: [50, 59], text: "Fifty-fifty is where polite ends and real begins." },

  // 40-49: complementary contrast
  { range: [40, 49], text: "Your moons light up different worlds. That's either the problem or the whole point." },
  { range: [40, 49], text: "More shadow than light between you. But shadows are where the depth lives." },
  { range: [40, 49], text: "Your moons weren't born in the same weather. They chose each other anyway." },
  { range: [40, 49], text: "The dark space between your moons is wide enough to get lost in. Some people like that." },
  { range: [40, 49], text: "Your moons don't overlap much. What they share, they share fiercely." },
  { range: [40, 49], text: "Two moons that light their own path. You were never going to be easy." },
  { range: [40, 49], text: "Not much shared light. But the light you make is entirely yours." },
  { range: [40, 49], text: "Your moons orbit different feelings. The pull between them is the connection." },
  { range: [40, 49], text: "Less overlap, more discovery. Your moons have a lot to teach each other." },
  { range: [40, 49], text: "The sky between your moons is mostly dark. But the edges glow." },

  // 30-39: different rhythms
  { range: [30, 39], text: "Your moons barely share the same sky. What they do share, they earned." },
  { range: [30, 39], text: "A wide gap between your moons. Not a void — a bridge worth building." },
  { range: [30, 39], text: "Your moons move to different rhythms. That's not incompatibility — it's range." },
  { range: [30, 39], text: "Most of the sky is dark between you. The lit edges are where the story lives." },
  { range: [30, 39], text: "Your moons don't make it easy. They make it worth the effort." },
  { range: [30, 39], text: "Thirty-something percent light. The rest is space you get to fill together." },
  { range: [30, 39], text: "You weren't born under convenient moons. Convenient was never the point." },
  { range: [30, 39], text: "Your moons face different directions. Meeting in the middle is the whole story." },
  { range: [30, 39], text: "Two moons that almost missed each other. Almost." },
  { range: [30, 39], text: "Not much overlap, but what's there is stubborn and bright." },

  // 20-29: distant moons
  { range: [20, 29], text: "Your moons live in mostly different skies. The connection is quiet, but it's there." },
  { range: [20, 29], text: "A thin sliver of shared light. Some of the best things start as slivers." },
  { range: [20, 29], text: "Your moons don't share much sky. They share something harder to name." },
  { range: [20, 29], text: "The gap between your moons is wide. Wide enough for something unexpected." },
  { range: [20, 29], text: "Your moons keep their distance. What they share, they protect." },
  { range: [20, 29], text: "Two moons that barely touch. Sometimes the almost-touch is the whole thing." },
  { range: [20, 29], text: "Not much shared light. But the thin line between you has its own gravity." },
  { range: [20, 29], text: "Your moons don't need to match to matter to each other." },
  { range: [20, 29], text: "Distant moons, quiet pull. The connection doesn't need to be loud." },
  { range: [20, 29], text: "Twenty-something percent. Every photon earned." },

  // 10-19: separate light
  { range: [10, 19], text: "Your moons share barely a sliver. That sliver is entirely yours." },
  { range: [10, 19], text: "Almost no overlap. But 'almost none' is not 'none.'" },
  { range: [10, 19], text: "Your moons live in different nights. The rare moments they share light are the ones you remember." },
  { range: [10, 19], text: "A connection this thin is either nothing or everything. You already know which." },
  { range: [10, 19], text: "Your moons barely see each other. What they see, they remember." },
  { range: [10, 19], text: "The smallest shared light. Some people build entire relationships on less." },
  { range: [10, 19], text: "Your moons are strangers who keep showing up at the same sky." },
  { range: [10, 19], text: "A thin thread of light between two dark moons. Threads hold more than you'd think." },
  { range: [10, 19], text: "Not much light in common. But the darkness you share has its own warmth." },
  { range: [10, 19], text: "Two mostly-dark moons. The spark between them is small, and it's real." },

  // 0-9: new moon territory
  { range: [0, 9], text: "Your moons share almost no light. What you build together, you build from scratch." },
  { range: [0, 9], text: "Two dark moons in the same sky. The connection isn't in the light — it's in the dark." },
  { range: [0, 9], text: "No borrowed light. Whatever you share, you made it yourselves." },
  { range: [0, 9], text: "Your moons start from nothing. Everything between you is original." },
  { range: [0, 9], text: "Near-zero shared light. The bond isn't celestial — it's personal." },
  { range: [0, 9], text: "Your moons don't light each other's way. You do that yourselves." },
  { range: [0, 9], text: "Two new moons. No inherited glow. Just two people choosing each other in the dark." },
  { range: [0, 9], text: "The sky between you is dark. You're writing on a blank page." },
  { range: [0, 9], text: "Zero shared moonlight. All original heat." },
  { range: [0, 9], text: "Your moons gave you nothing to start with. Good. You don't need a head start." },
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

export function getAllLines(): { text: string; range: [number, number] }[] {
  return LINES.map((l) => ({ text: l.text, range: l.range }));
}
