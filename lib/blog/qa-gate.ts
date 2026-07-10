import type { SupabaseClient } from "@supabase/supabase-js";
import { DB } from "../db/tables";
import type { BlogPostRow } from "./db-types";
import {
  MODELS,
  BANNED_PHRASES,
  COMPETITOR_TERMS,
  MAX_QA_REVISIONS,
  ERROR_CODES,
} from "./config";
import { generateJson, Type } from "./gemini-client";
import { LINKABLE_PAGES } from "./internal-links";
import type { ContentBrief } from "./content-brief";
import { generateArticle } from "./article-writer";

type Verdict = "PASS" | "REVISE" | "FAIL";

interface RubricScores {
  problem_first_hook: number;
  specificity: number;
  reader_recognition: number;
  cta_integration: number;
  aeo_structure: number;
  factual_grounding: number;
}

export interface QaOutcome {
  verdict: Verdict;
  rubric_scores: RubricScores;
  overall_score: number;
  feedback: string;
  hard_rule_violations: string[];
  banned_matches: string[];
  disallowed_links: string[];
  competitor_matches: string[];
  word_count: number;
}

const RUBRIC_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    rubric_scores: {
      type: Type.OBJECT,
      properties: {
        problem_first_hook: { type: Type.INTEGER },
        specificity: { type: Type.INTEGER },
        reader_recognition: { type: Type.INTEGER },
        cta_integration: { type: Type.INTEGER },
        aeo_structure: { type: Type.INTEGER },
        factual_grounding: { type: Type.INTEGER },
      },
      required: [
        "problem_first_hook",
        "specificity",
        "reader_recognition",
        "cta_integration",
        "aeo_structure",
        "factual_grounding",
      ],
    },
    verdict: { type: Type.STRING },
    feedback: { type: Type.STRING },
  },
  required: ["rubric_scores", "verdict", "feedback"],
};

const ALLOWED_HOSTS = new Set(["bluntchart.com", "www.bluntchart.com", "blog.bluntchart.com"]);
const ALLOWED_URLS = new Set<string>(Object.values(LINKABLE_PAGES).map((p) => p.url));

function countWords(html: string): number {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

/**
 * Normalize curly quotes / apostrophes to straight ones so substring
 * matches survive Gemini's inconsistent quote output ("life's" vs
 * "life’s"). Also collapses whitespace so line-wrapped phrases match.
 */
function normalizeForPhraseMatch(s: string): string {
  return s
    .replace(/[‘’ʼ]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function findBannedMatches(html: string): string[] {
  const normalized = normalizeForPhraseMatch(html);
  return BANNED_PHRASES.filter((p) =>
    normalized.includes(normalizeForPhraseMatch(p))
  );
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Word-boundary case-insensitive match against COMPETITOR_TERMS. Word
 * boundaries prevent false positives when a competitor name is a
 * substring of a legitimate word (rare given our specific entries, but
 * cheap defense).
 */
function findCompetitorMatches(html: string): string[] {
  const text = html.replace(/<[^>]+>/g, " ");
  const found: string[] = [];
  for (const term of COMPETITOR_TERMS) {
    const re = new RegExp(`(?:^|[^a-z0-9])${escapeRegex(term)}(?:[^a-z0-9]|$)`, "i");
    if (re.test(text)) found.push(term);
  }
  return found;
}

function findDisallowedLinks(html: string): string[] {
  const hrefs = Array.from(html.matchAll(/<a[^>]+href=["']([^"']+)["']/gi)).map(
    (m) => m[1]
  );
  const bad: string[] = [];
  for (const href of hrefs) {
    if (href.startsWith("#")) continue;
    if (href.startsWith("mailto:") || href.startsWith("javascript:")) {
      bad.push(href);
      continue;
    }
    try {
      const u = new URL(href);
      if (u.protocol !== "https:" && u.protocol !== "http:") {
        bad.push(href);
        continue;
      }
      if (!ALLOWED_HOSTS.has(u.hostname)) {
        bad.push(href);
        continue;
      }
      // Any bluntchart.com link that isn't in the allowlist is treated as
      // a potentially dead/invented URL (e.g. /compatibility-chart).
      const canonical = `${u.origin}${u.pathname}`.replace(/\/$/, "");
      const isAllowed =
        ALLOWED_URLS.has(canonical) ||
        ALLOWED_URLS.has(`${canonical}/`) ||
        u.pathname === "/" ||
        (u.pathname === "" && u.hash.length > 0);
      if (!isAllowed) bad.push(href);
    } catch {
      bad.push(href);
    }
  }
  return Array.from(new Set(bad));
}

function findHardRuleViolations(
  html: string,
  brief: ContentBrief,
  wordCount: number
): string[] {
  const violations: string[] = [];
  if (/<script\b/i.test(html)) violations.push("contains <script>");
  if (/<iframe\b/i.test(html)) violations.push("contains <iframe>");
  if (/<style\b/i.test(html)) violations.push("contains <style>");
  if (/\bclaude\b|\banthropic\b/i.test(html))
    violations.push("mentions Claude/Anthropic");
  if (!/<!--\s*bluntchart:cta:[a-z_]+\s*-->/i.test(html))
    violations.push("missing CTA marker <!-- bluntchart:cta:{product} -->");
  if (!/frequently asked questions/i.test(html) && !/<h2[^>]*>[\s\S]*?faq/i.test(html))
    violations.push("missing FAQ section");
  if (wordCount < 800) violations.push(`word count too low: ${wordCount}`);
  if (wordCount > 2500) violations.push(`word count too high: ${wordCount}`);

  // Upcoming products must not link to invented product URLs
  const cta = brief.cta_plan;
  if (cta.product_status === "upcoming") {
    const invented = new RegExp(
      `href=["'][^"']*/${cta.target_product.replace("_", "-")}[^"']*["']`,
      "i"
    );
    if (invented.test(html))
      violations.push(`links to an invented URL for upcoming product ${cta.target_product}`);
  }
  return violations;
}

function buildRubricPrompt(brief: ContentBrief, html: string): string {
  return `You are a senior editorial reviewer for BluntChart. Score this article on a 6-dimension rubric, each 1-10.

BRIEF this article was meant to hit:
- reader_pain_point: ${brief.reader_pain_point}
- proposed_title: ${brief.proposed_title}
- target_word_count: ${brief.target_word_count}
- cta target: ${brief.cta_plan.target_product} (${brief.cta_plan.product_status})

RUBRIC (score each 1-10, be honest, do not inflate):
1. problem_first_hook — does the article name a specific reader pain in the first ~100 words with second-person language? Zero throat-clearing. Zero "astrology has fascinated humans" energy.
2. specificity — does it use concrete placements/aspects/houses/transits rather than generic sun-sign traits? Would an intermediate astrology reader nod?
3. reader_recognition — BluntChart's register is "someone who has been quietly observing this reader for a while, telling them plainly what they've noticed, late at night". Second-person is necessary but NOT sufficient. Grammatically-clean publication prose caps this at 6 no matter how correct it is. Cap at 6 if any of these are present: abstract mystical filler ("cosmic audit", "profound growth", "foundational energies", "life's foundations"), inspirational Pinterest-quote-card conclusions ("emerging stronger, wiser", "authentically you"), encyclopedic third-person-in-second-person tone ("Saturn is the planet of discipline"), or if the reader could not stop mid-paragraph and think "wait — why is this describing me?". Score 8+ only when the writing feels like a specific, observant friend, not an astrology publication.
4. cta_integration — the CTA must (a) bridge from the immediately preceding insight in a specific way, (b) NOT open with a generic pivot ("Ready to understand", "Discover powerful insights", "Dive deeper into"), (c) preserve curiosity — the article must NOT already have handed the reader every personalised answer, or there is nothing for the tool to reveal. Cap at 5 if the CTA opener is generic. Cap at 5 if by the time the CTA appears the article has already given away the personal expression the tool exists to show (sign+house interpretation, exact timing, personal pattern). The reader at the CTA moment should think "okay but what does MY placement say?"
5. aeo_structure — H2s framed as reader-questions when it fits, direct-answer paragraphs, visible FAQ block that's useful.
6. factual_grounding — astrology mechanics are internally consistent, no fabricated house rulerships or aspect claims, AND astrology is framed as symbolic pattern / archetypal interpretation, not physical causation. Cap at 6 if the article says things like "Saturn is testing you", "the universe is asking you to", "this planetary influence causes X". "In astrology, this pattern is associated with…" and "astrologers read this placement as…" score fine.

VERDICT rules:
- PASS: every rubric score >= 7 AND overall avg >= 7.5.
- REVISE: any rubric score in 5-6, or overall 6.5-7.5, with concrete, fixable feedback.
- FAIL: any rubric score <= 4, or overall < 6.5, or systemic issues.

Return strict JSON: { rubric_scores: {...}, verdict: "PASS"|"REVISE"|"FAIL", feedback: "concise numbered list of specific fixes if REVISE, or reason for FAIL/PASS" }.

ARTICLE HTML:
${html}`;
}

async function scoreWithModel(
  brief: ContentBrief,
  html: string
): Promise<
  | { ok: true; rubric_scores: RubricScores; verdict: Verdict; feedback: string }
  | { ok: false; errorCode: string; errorMessage: string }
> {
  const prompt = buildRubricPrompt(brief, html);
  const result = await generateJson<{
    rubric_scores: RubricScores;
    verdict: string;
    feedback: string;
  }>({
    model: MODELS.qaGate,
    prompt,
    schema: RUBRIC_SCHEMA,
    temperature: 0.2,
    maxOutputTokens: 1500,
  });

  if (!result.ok || !result.data) {
    return {
      ok: false,
      errorCode: result.errorCode ?? ERROR_CODES.QA_FAILED,
      errorMessage: result.errorMessage ?? "Empty QA response",
    };
  }

  const rawVerdict = (result.data.verdict ?? "").toUpperCase();
  const verdict: Verdict =
    rawVerdict === "PASS" || rawVerdict === "REVISE" || rawVerdict === "FAIL"
      ? (rawVerdict as Verdict)
      : "FAIL";

  return {
    ok: true,
    rubric_scores: result.data.rubric_scores,
    verdict,
    feedback: result.data.feedback ?? "",
  };
}

function overallScore(scores: RubricScores): number {
  const vals = Object.values(scores);
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function assessDeterministic(
  html: string,
  brief: ContentBrief
): {
  hard_rule_violations: string[];
  banned_matches: string[];
  disallowed_links: string[];
  competitor_matches: string[];
  word_count: number;
} {
  const word_count = countWords(html);
  return {
    word_count,
    hard_rule_violations: findHardRuleViolations(html, brief, word_count),
    banned_matches: findBannedMatches(html),
    disallowed_links: findDisallowedLinks(html),
    competitor_matches: findCompetitorMatches(html),
  };
}

function combineOutcome(
  det: ReturnType<typeof assessDeterministic>,
  model: { rubric_scores: RubricScores; verdict: Verdict; feedback: string }
): QaOutcome {
  const overall = overallScore(model.rubric_scores);
  let verdict: Verdict = model.verdict;

  const hasHardFail =
    det.hard_rule_violations.length > 0 ||
    det.banned_matches.length > 0 ||
    det.disallowed_links.length > 0 ||
    det.competitor_matches.length > 0;

  if (hasHardFail) {
    // Hard-fail items are fixable in a revision (rewrite the CTA, drop the bad link).
    // Only downgrade REVISE→FAIL if the model already said FAIL.
    verdict = verdict === "PASS" ? "REVISE" : verdict;
  }

  return {
    verdict,
    rubric_scores: model.rubric_scores,
    overall_score: Number(overall.toFixed(2)),
    feedback: model.feedback,
    ...det,
  };
}

export interface QaResult {
  ok: boolean;
  dryRun: boolean;
  outcome?: QaOutcome;
  finalStage?: string;
  revised?: boolean;
  errorCode?: string;
  errorMessage?: string;
}

export async function runQaGate(
  supabase: SupabaseClient,
  post: BlogPostRow,
  options: { dryRun?: boolean } = {}
): Promise<QaResult> {
  const dryRun = options.dryRun ?? false;

  if (!post.article_html || !post.content_brief) {
    return {
      ok: false,
      dryRun,
      errorCode: "QA_MISSING_INPUT",
      errorMessage: "article_html or content_brief is empty",
    };
  }

  const brief = post.content_brief as unknown as ContentBrief;
  const det1 = assessDeterministic(post.article_html, brief);
  const model1 = await scoreWithModel(brief, post.article_html);

  if (!model1.ok) {
    return { ok: false, dryRun, errorCode: model1.errorCode, errorMessage: model1.errorMessage };
  }

  let outcome = combineOutcome(det1, model1);
  let revised = false;
  let currentHtml = post.article_html;
  let currentPost = post;

  if (
    outcome.verdict === "REVISE" &&
    (post.revision_count ?? 0) < MAX_QA_REVISIONS &&
    !dryRun
  ) {
    const feedbackBundle = [
      outcome.feedback,
      ...(outcome.hard_rule_violations.length
        ? [`Hard rules to fix: ${outcome.hard_rule_violations.join("; ")}`]
        : []),
      ...(outcome.banned_matches.length
        ? [`Remove banned phrases: ${outcome.banned_matches.join("; ")}`]
        : []),
      ...(outcome.disallowed_links.length
        ? [`Remove/replace these links: ${outcome.disallowed_links.join("; ")}`]
        : []),
      ...(outcome.competitor_matches.length
        ? [`Remove all mentions of competing astrology brands/products: ${outcome.competitor_matches.join("; ")}. Do NOT name any competitor.`]
        : []),
    ].join("\n");

    const rewritten = await generateArticle(supabase, currentPost, brief, {
      dryRun: false,
      revisionFeedback: feedbackBundle,
    });

    if (rewritten.ok && rewritten.article) {
      revised = true;
      currentHtml = rewritten.article.article_html;
      currentPost = {
        ...currentPost,
        article_html: rewritten.article.article_html,
        title: rewritten.article.title,
        slug: rewritten.article.slug,
        meta_description: rewritten.article.meta_description,
        faq_data: rewritten.article.faq_data,
        revision_count: (currentPost.revision_count ?? 0) + 1,
      };

      const det2 = assessDeterministic(currentHtml, brief);
      const model2 = await scoreWithModel(brief, currentHtml);
      if (model2.ok) {
        outcome = combineOutcome(det2, model2);
      }
    }
  }

  const finalStage =
    outcome.verdict === "PASS" ? "QA_PASSED" : outcome.verdict === "FAIL" ? "QA_FAILED" : "QA_FAILED";

  if (dryRun) {
    return { ok: true, dryRun: true, outcome, revised, finalStage };
  }

  const { error } = await supabase
    .from(DB.blogPosts)
    .update({
      qa_model: MODELS.qaGate,
      qa_score: outcome,
      qa_feedback: outcome.feedback,
      pipeline_stage: finalStage,
      last_error_code: outcome.verdict === "PASS" ? null : ERROR_CODES.QA_FAILED,
      last_error_message:
        outcome.verdict === "PASS"
          ? null
          : outcome.feedback.slice(0, 500),
      updated_at: new Date().toISOString(),
    })
    .eq("id", currentPost.id)
    .eq("pipeline_stage", "ARTICLE_GENERATED");

  if (error) {
    return {
      ok: false,
      dryRun: false,
      errorCode: "DB_UPDATE_FAILED",
      errorMessage: error.message,
    };
  }

  return { ok: true, dryRun: false, outcome, revised, finalStage };
}
