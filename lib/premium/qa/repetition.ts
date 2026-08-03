/**
 * lib/premium/qa/repetition.ts
 *
 * Soft QA — repetition detection.
 *
 * PRIMARY mechanism is general, not a static blacklist:
 *   - Phrase overlap: 5+ word phrases appearing in ≥2 chapters
 *   - Concept-stem frequency: stems whose count exceeds a threshold
 *   - Chapter-to-chapter cosine similarity (bag of content-words)
 *   - Ledger cross-check: banned images reappearing
 *
 * SECONDARY: a small extensible blacklist of images we've seen abused.
 * Kept short on purpose. Long-term hygiene comes from the general checks.
 *
 * Transit chapters get looser thresholds because they legitimately reuse
 * language like "opportunity", "window", "timing" by design.
 */

import type { SectionId } from "@/lib/premium/types";

export type SoftFlagReason =
  | "PHRASE_OVERLAP"
  | "CONCEPT_STEM_OVERUSE"
  | "CHAPTER_SIMILARITY"
  | "BANNED_IMAGE_REUSE"
  | "BLACKLIST_HIT";

export interface SoftFlag {
  readonly section: SectionId;
  readonly otherSection?: SectionId;
  readonly reason: SoftFlagReason;
  /** 0..1 severity. Orchestrator uses this to decide whether to regenerate. */
  readonly severity: number;
  readonly detail: string;
}

export interface ChapterUnderReview {
  readonly section: SectionId;
  readonly body: string;
  readonly isTransit: boolean;
}

/* ─────────────────────────────────────────────────────────────────────
   Small blacklist — extensible, secondary safety net.
───────────────────────────────────────────────────────────────────── */

const SMALL_BLACKLIST: readonly RegExp[] = [
  /\b(coffee|latte|mug|cup)\b/gi,
  /\bnotes app\b/gi,
  /\bunsent (text|message)\b/gi,
];
const BLACKLIST_PER_BOOK_CAP: Record<string, number> = {
  "coffee|latte|mug|cup": 3,
  "notes app": 2,
  "unsent (text|message)": 2,
};

/* ─────────────────────────────────────────────────────────────────────
   Tokenisation + stemming (very light)
───────────────────────────────────────────────────────────────────── */

/**
 * Extended stopword set — includes ordinary conversational vocabulary
 * ("feel", "need", "want", "thing", "someone", "people", etc.) that
 * naturally appears in every chapter and should NOT drive repetition
 * alerts. Only distinctive content-words (chase, grip, coffee, mug,
 * fast, etc.) should influence concept-stem scoring.
 *
 * Kept as stems after our light stemmer runs — e.g. "feeling" → "feel"
 * needs both "feel" (post-stem) AND "feeling" (raw) covered.
 */
const STOP_WORDS = new Set([
  // articles / conjunctions / prepositions
  "the","a","an","and","or","but","if","of","in","on","at","to","for","from",
  "with","by","as","into","up","down","out","over","under","again","because",
  "about","than","then","also","only","just","so","between","through","after",
  "before","during","while","upon","across","among","toward","towards",
  // be verbs
  "is","are","was","were","be","been","being","am",
  // pronouns + contractions
  "it","its","this","that","those","these","you","your","yours","yourself",
  "you're","you've","you'll","you'd","i","me","my","mine","myself","we","us",
  "our","ours","ourselves","he","him","his","himself","she","her","hers","herself",
  "they","them","their","theirs","themselves","who","whom","whose","which","what",
  "when","where","why","how","there","here","who's","that's","there's","here's",
  "it's","isn't","aren't","wasn't","weren't","don't","doesn't","didn't","won't",
  "wouldn't","can't","couldn't","shouldn't","haven't","hasn't","hadn't",
  // negation + modality
  "not","no","never","yes","maybe","perhaps",
  // do / have / modals
  "do","does","did","done","doing","have","has","had","having","will","would",
  "shall","should","can","could","may","might","must","ought",
  // quantifiers / determiners
  "some","any","all","most","more","less","few","fewer","other","another","same",
  "own","new","old","first","last","next","previous","every","each","either",
  "neither","both","half","full","several","various","certain","several","enough",
  // small nouns/verbs/adjectives that are ubiquitous in this genre
  "really","actually","actual","actually","kind","kinda","sort","sorta",
  "thing","things","something","anything","everything","nothing","someone",
  "anyone","everyone","nobody","people","person","folks","stuff",
  "way","ways","time","times","moment","moments","day","days","night","nights",
  "week","weeks","year","years",
  "know","knew","known","knows","knowing","think","thought","thoughts","thinks",
  "thinking","feel","feels","felt","feeling","feelings","want","wants","wanted",
  "wanting","need","needs","needed","needing","see","sees","saw","seen",
  "seeing","look","looks","looked","looking","find","finds","found","finding",
  "make","makes","made","making","get","gets","got","getting","take","takes",
  "took","taking","give","gives","gave","given","giving","go","goes","went",
  "gone","going","come","comes","came","coming","say","says","said","saying",
  "tell","tells","told","telling","try","tries","tried","trying","use","uses",
  "used","using","let","lets","letting",
  "life","lives","world","worlds","room","rooms","door","doors","hand","hands",
  "eye","eyes","face","faces","voice","voices","head","heads","heart","hearts",
  // pace/tone words that are natural filler
  "little","big","small","large","whole","whole","much","many","most",
  "even","still","yet","already","again","almost","away","back","again",
  "though","although","however","instead","otherwise","either",
  // rest of the common short-word noise
  "one","two","three","four","five","six","seven","eight","nine","ten",
  "part","parts","piece","pieces","side","sides","end","ends","start","starts",
  "started","starting","begin","begins","began","begun","beginning","stop",
  "stops","stopped","stopping","keep","keeps","kept","keeping","stay","stays",
  "stayed","staying","hold","holds","held","holding","put","puts","putting",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z\s'-]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function contentWords(text: string): string[] {
  return tokenize(text).filter((w) => w.length >= 4 && !STOP_WORDS.has(w));
}

/** Very light stemming: strip common English suffixes to fold word families. */
function stem(word: string): string {
  const w = word.toLowerCase();
  for (const suf of ["ingly", "ing", "edly", "ed", "ies", "ies", "es", "ly", "s"]) {
    if (w.length > suf.length + 3 && w.endsWith(suf)) return w.slice(0, -suf.length);
  }
  return w;
}

/* ─────────────────────────────────────────────────────────────────────
   Phrase overlap
───────────────────────────────────────────────────────────────────── */

function fivegrams(tokens: string[]): string[] {
  const out: string[] = [];
  for (let i = 0; i <= tokens.length - 5; i++) {
    out.push(tokens.slice(i, i + 5).join(" "));
  }
  return out;
}

/* ─────────────────────────────────────────────────────────────────────
   Chapter similarity (cosine on content-word bag)
───────────────────────────────────────────────────────────────────── */

function bag(text: string): Map<string, number> {
  const m = new Map<string, number>();
  for (const w of contentWords(text)) {
    const s = stem(w);
    m.set(s, (m.get(s) ?? 0) + 1);
  }
  return m;
}

function cosine(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  for (const [, v] of a) magA += v * v;
  for (const [, v] of b) magB += v * v;
  for (const [k, va] of a) {
    const vb = b.get(k);
    if (vb) dot += va * vb;
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  return denom === 0 ? 0 : dot / denom;
}

/* ─────────────────────────────────────────────────────────────────────
   PUBLIC
───────────────────────────────────────────────────────────────────── */

export function runRepetitionScan(
  chapters: readonly ChapterUnderReview[],
  bannedImages: readonly string[]
): SoftFlag[] {
  const flags: SoftFlag[] = [];

  const partIChapters = chapters.filter((c) => !c.isTransit);

  /* 1) Phrase overlap across ALL chapters (transits included, but transit-
        transit similarity is expected so we downweight when both are transit). */
  const phraseIndex = new Map<string, Set<SectionId>>();
  for (const c of chapters) {
    const tokens = tokenize(c.body);
    for (const g of fivegrams(tokens)) {
      let set = phraseIndex.get(g);
      if (!set) {
        set = new Set();
        phraseIndex.set(g, set);
      }
      set.add(c.section);
    }
  }
  for (const [phrase, sections] of phraseIndex) {
    if (sections.size < 2) continue;
    // Count non-stopword content in the phrase. Phrases that are mostly
    // fluff ("the version of you that" — 1 content word) still surface,
    // but at a lower severity that won't trigger regens on its own.
    const phraseTokens = phrase.split(" ");
    const contentCount = phraseTokens.filter((t) => !STOP_WORDS.has(t)).length;
    const severity =
      contentCount >= 2 ? 0.6 :
      contentCount === 1 ? 0.35 :
      0.2;
    const arr = Array.from(sections);
    // Pair each subsequent chapter with the first occurrence.
    const first = arr[0];
    for (let i = 1; i < arr.length; i++) {
      const other = arr[i];
      const bothTransit =
        chapters.find((c) => c.section === first)?.isTransit &&
        chapters.find((c) => c.section === other)?.isTransit;
      if (bothTransit) continue; // acceptable — transit language reuses on purpose
      flags.push({
        section: other,
        otherSection: first,
        reason: "PHRASE_OVERLAP",
        severity,
        detail: `phrase reused: "${phrase}"`,
      });
    }
  }

  /* 2) Concept-stem overuse across the whole book. */
  const stemCounts = new Map<string, number>();
  const stemLocations = new Map<string, Set<SectionId>>();
  for (const c of chapters) {
    for (const w of contentWords(c.body)) {
      const s = stem(w);
      stemCounts.set(s, (stemCounts.get(s) ?? 0) + 1);
      let set = stemLocations.get(s);
      if (!set) {
        set = new Set();
        stemLocations.set(s, set);
      }
      set.add(c.section);
    }
  }
  const chapterCount = chapters.length;
  for (const [stemKey, count] of stemCounts) {
    // Ignore stems that only appear in transits — those are their vocabulary.
    const locations = stemLocations.get(stemKey);
    if (!locations) continue;
    const partIHits = Array.from(locations).filter((s) =>
      partIChapters.some((c) => c.section === s)
    );
    if (partIHits.length === 0) continue;
    // Raised thresholds: appears in ≥75% of Part I chapters AND ≥15 total
    // mentions. Any word passing both is genuinely load-bearing repetition,
    // not stopword noise.
    const chapterRatio = partIHits.length / Math.max(1, partIChapters.length);
    if (chapterRatio >= 0.75 && count >= 15) {
      flags.push({
        section: partIHits[0],
        reason: "CONCEPT_STEM_OVERUSE",
        severity: Math.min(1, (chapterRatio - 0.75) * 2 + 0.4),
        detail: `stem "${stemKey}" appears ${count} times across ${partIHits.length}/${partIChapters.length} Part I chapters`,
      });
    }
  }

  /* 3) Chapter-to-chapter cosine similarity (Part I only). */
  const bags = new Map<SectionId, Map<string, number>>();
  for (const c of partIChapters) bags.set(c.section, bag(c.body));
  const partISections = partIChapters.map((c) => c.section);
  for (let i = 0; i < partISections.length; i++) {
    for (let j = i + 1; j < partISections.length; j++) {
      const a = bags.get(partISections[i]);
      const b = bags.get(partISections[j]);
      if (!a || !b) continue;
      const sim = cosine(a, b);
      // Raised threshold: two chapters about the same reader naturally
      // share a lot of vocabulary. Only flag genuinely-close bodies.
      if (sim >= 0.55) {
        flags.push({
          section: partISections[j],
          otherSection: partISections[i],
          reason: "CHAPTER_SIMILARITY",
          severity: Math.min(1, (sim - 0.55) * 2.5 + 0.3),
          detail: `bag-of-words cosine ${sim.toFixed(2)} vs ${partISections[i]}`,
        });
      }
    }
  }

  /* 4) Ledger banned-image reuse (any chapter that mentions a banned image). */
  const banRegexes = bannedImages.map(
    (img) => new RegExp(`\\b${img.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi")
  );
  for (const c of chapters) {
    for (let i = 0; i < banRegexes.length; i++) {
      const rx = banRegexes[i];
      const image = bannedImages[i];
      if (rx.test(c.body)) {
        // For transit chapters we treat this as advisory (severity halved).
        const sev = c.isTransit ? 0.3 : 0.7;
        flags.push({
          section: c.section,
          reason: "BANNED_IMAGE_REUSE",
          severity: sev,
          detail: `mentions banned image "${image}"`,
        });
      }
    }
  }

  /* 5) Blacklist per-book caps. */
  for (const rx of SMALL_BLACKLIST) {
    let totalCount = 0;
    const perChapter = new Map<SectionId, number>();
    for (const c of chapters) {
      const matches = c.body.match(rx) ?? [];
      totalCount += matches.length;
      perChapter.set(c.section, matches.length);
    }
    const key = rx.source.replace(/[\\/gi]/g, "");
    const cap = BLACKLIST_PER_BOOK_CAP[key] ?? 3;
    if (totalCount > cap) {
      // Flag the chapter with the most hits.
      let worst: SectionId | undefined;
      let worstCount = 0;
      for (const [s, n] of perChapter) {
        if (n > worstCount) {
          worst = s;
          worstCount = n;
        }
      }
      if (worst) {
        flags.push({
          section: worst,
          reason: "BLACKLIST_HIT",
          severity: Math.min(1, (totalCount - cap) / (cap + 1) + 0.4),
          detail: `pattern /${rx.source}/ appears ${totalCount}× book-wide (cap ${cap})`,
        });
      }
    }
  }

  return flags;
}
