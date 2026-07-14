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

/**
 * Two independent gates.
 *
 * PublishingGate is objective and deterministic — it decides whether an
 * article is safe to ship. Only banned phrases, disallowed URLs, script/
 * iframe injection, missing structural fields, competitor mentions, and
 * word-count bounds count here. A PASS means the SEO/safety contract
 * holds; a FAIL means we must not publish.
 *
 * BrandQuality is subjective and model-scored — the existing 6-dim
 * rubric that judges register, recognition, CTA feel. It NEVER blocks
 * publishing. It is persisted so we can see aggregate trends and tune
 * prompts, but a low score does not stop an SEO-safe article from
 * shipping. The article's job is to rank, educate, create curiosity,
 * and convert — not to sound exactly like the paid reading.
 */
export interface PublishingGate {
  verdict: "PASS" | "FAIL";
  /** True iff the FAIL signals could plausibly be fixed by regenerating
   *  the article. False iff they include a terminal violation (invented
   *  URL, script/iframe injection, Claude/Anthropic leak, missing
   *  structural field) that another Gemini call would not reliably fix. */
  recoverable: boolean;
  hard_rule_violations: string[];
  banned_matches: string[];
  disallowed_links: string[];
  competitor_matches: string[];
  /** Any of: title, slug, meta_description, article_html — empty or missing. */
  missing_fields: string[];
  word_count: number;
}

export interface BrandQuality {
  /** Informational only — never gates publishing. */
  verdict: Verdict;
  overall_score: number;
  rubric_scores: RubricScores;
  feedback: string;
}

export interface QaOutcome {
  publishing_gate: PublishingGate;
  brand_quality: BrandQuality;
}

/**
 * Terminal hard-rule violation patterns. If any of these appear in
 * hard_rule_violations, the article cannot be safely revised — either
 * because the revision path might reproduce the security issue (script,
 * iframe, style, invented URL) or because it indicates an integrity
 * failure at a layer the writer prompt does not control (Claude/Anthropic
 * leak). Missing CTA marker, missing FAQ, and word-count violations are
 * NOT terminal — writer can regenerate to fix them.
 */
const TERMINAL_HARD_RULE_PATTERNS: RegExp[] = [
  /contains <script>/i,
  /contains <iframe>/i,
  /contains <style>/i,
  /mentions Claude\/Anthropic/i,
  /links to an invented URL/i,
];

/**
 * Terminal iff any of:
 *  - disallowed_links present (writer emitted an invented / non-allowlisted URL)
 *  - hard_rule_violations includes any TERMINAL_HARD_RULE_PATTERNS entry
 *
 * Recoverable otherwise — including banned_matches, competitor_matches,
 * missing CTA marker, missing FAQ, word-count out of bounds, and any
 * rubric-driven editorial FAIL.
 */
export function isRecoverableFailure(outcome: {
  disallowed_links: string[];
  hard_rule_violations: string[];
}): boolean {
  if (outcome.disallowed_links.length > 0) return false;
  for (const v of outcome.hard_rule_violations) {
    if (TERMINAL_HARD_RULE_PATTERNS.some((re) => re.test(v))) return false;
  }
  return true;
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

function checkMissingFields(post: BlogPostRow): string[] {
  const missing: string[] = [];
  if (!post.title || !post.title.trim()) missing.push("title");
  if (!post.slug || !post.slug.trim()) missing.push("slug");
  if (!post.meta_description || !post.meta_description.trim())
    missing.push("meta_description");
  if (!post.article_html || !post.article_html.trim())
    missing.push("article_html");
  return missing;
}

function computePublishingGate(
  post: BlogPostRow,
  det: ReturnType<typeof assessDeterministic>
): PublishingGate {
  const missing_fields = checkMissingFields(post);

  // Objective failure signals — anything here means we must not publish.
  const hasAnyFailure =
    det.hard_rule_violations.length > 0 ||
    det.banned_matches.length > 0 ||
    det.disallowed_links.length > 0 ||
    det.competitor_matches.length > 0 ||
    missing_fields.length > 0;

  // Terminal: structural or security failures a Gemini rewrite can't safely fix.
  const terminalFromHardRules = det.hard_rule_violations.some((v) =>
    TERMINAL_HARD_RULE_PATTERNS.some((re) => re.test(v))
  );
  const isTerminal =
    det.disallowed_links.length > 0 ||
    missing_fields.length > 0 ||
    terminalFromHardRules;

  return {
    verdict: hasAnyFailure ? "FAIL" : "PASS",
    recoverable: hasAnyFailure && !isTerminal,
    hard_rule_violations: det.hard_rule_violations,
    banned_matches: det.banned_matches,
    disallowed_links: det.disallowed_links,
    competitor_matches: det.competitor_matches,
    missing_fields,
    word_count: det.word_count,
  };
}

function computeBrandQuality(model: {
  rubric_scores: RubricScores;
  verdict: Verdict;
  feedback: string;
}): BrandQuality {
  return {
    verdict: model.verdict,
    overall_score: Number(overallScore(model.rubric_scores).toFixed(2)),
    rubric_scores: model.rubric_scores,
    feedback: model.feedback,
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

  let publishing = computePublishingGate(post, det1);
  let brand = computeBrandQuality(model1);
  let revised = false;
  let currentPost = post;

  // Revision fires ONLY when the Publishing Gate fails on recoverable
  // signals — never for a low Brand Quality score. Brand quality is
  // reporting-only. SEO throughput > register polish.
  const revisionEligible =
    !dryRun &&
    (post.revision_count ?? 0) < MAX_QA_REVISIONS &&
    publishing.verdict === "FAIL" &&
    publishing.recoverable;

  if (revisionEligible) {
    // Bundle both objective violations (must-fix) and the subjective brand
    // feedback (nice-to-fix while we're regenerating). If the revision helps
    // brand quality too, great; if not, the Publishing Gate still decides
    // whether to publish.
    const feedbackBundle = [
      brand.feedback,
      ...(publishing.hard_rule_violations.length
        ? [`Hard rules to fix: ${publishing.hard_rule_violations.join("; ")}`]
        : []),
      ...(publishing.banned_matches.length
        ? [`Remove banned phrases: ${publishing.banned_matches.join("; ")}`]
        : []),
      ...(publishing.disallowed_links.length
        ? [`Remove/replace these links: ${publishing.disallowed_links.join("; ")}`]
        : []),
      ...(publishing.competitor_matches.length
        ? [`Remove all mentions of competing astrology brands/products: ${publishing.competitor_matches.join("; ")}. Do NOT name any competitor.`]
        : []),
    ].join("\n");

    const rewritten = await generateArticle(supabase, currentPost, brief, {
      dryRun: false,
      revisionFeedback: feedbackBundle,
    });

    if (rewritten.ok && rewritten.article) {
      revised = true;
      currentPost = {
        ...currentPost,
        article_html: rewritten.article.article_html,
        title: rewritten.article.title,
        slug: rewritten.article.slug,
        meta_description: rewritten.article.meta_description,
        faq_data: rewritten.article.faq_data,
        revision_count: (currentPost.revision_count ?? 0) + 1,
      };

      const det2 = assessDeterministic(currentPost.article_html!, brief);
      const model2 = await scoreWithModel(brief, currentPost.article_html!);
      publishing = computePublishingGate(currentPost, det2);
      if (model2.ok) brand = computeBrandQuality(model2);
      // If model2 fails, brand stays as first-pass — better than nothing.
    }
  }

  // Publish decision uses ONLY the Publishing Gate.
  const finalStage = publishing.verdict === "PASS" ? "QA_PASSED" : "QA_FAILED";
  const outcome: QaOutcome = { publishing_gate: publishing, brand_quality: brand };

  if (dryRun) {
    return { ok: true, dryRun: true, outcome, revised, finalStage };
  }

  const { error } = await supabase
    .from(DB.blogPosts)
    .update({
      qa_model: MODELS.qaGate,
      qa_score: outcome,
      qa_feedback: brand.feedback,
      pipeline_stage: finalStage,
      last_error_code: publishing.verdict === "PASS" ? null : ERROR_CODES.QA_FAILED,
      last_error_message:
        publishing.verdict === "PASS"
          ? null
          : describePublishingFailure(publishing).slice(0, 500),
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

/**
 * Short, human-readable reason a Publishing Gate FAIL happened —
 * written to last_error_message so the dashboard can surface it.
 */
function describePublishingFailure(pg: PublishingGate): string {
  const parts: string[] = [];
  if (pg.missing_fields.length)
    parts.push(`missing_fields: ${pg.missing_fields.join(", ")}`);
  if (pg.disallowed_links.length)
    parts.push(`disallowed_links: ${pg.disallowed_links.join(", ")}`);
  if (pg.hard_rule_violations.length)
    parts.push(`hard_rules: ${pg.hard_rule_violations.join("; ")}`);
  if (pg.banned_matches.length)
    parts.push(`banned: ${pg.banned_matches.join(", ")}`);
  if (pg.competitor_matches.length)
    parts.push(`competitors: ${pg.competitor_matches.join(", ")}`);
  return parts.join(" | ") || "unknown publishing gate failure";
}
