import type { SupabaseClient } from "@supabase/supabase-js";
import { DB } from "../db/tables";
import type { BlogPostRow } from "./db-types";
import { MODELS, BANNED_PHRASES, COMPETITOR_TERMS, type TargetProduct } from "./config";
import { generateText } from "./gemini-client";
import { wrapCtaHtml } from "./internal-links";
import { validateBriefShape, type ContentBrief } from "./content-brief";
import { toSlug, uniqueSlug } from "./slugify";

export interface GeneratedArticle {
  title: string;
  slug: string;
  meta_description: string;
  article_html: string;
  faq_data: Array<{ q: string; a: string }>;
  generation_model: string;
  word_count: number;
}

export interface ArticleResult {
  ok: boolean;
  dryRun: boolean;
  article?: GeneratedArticle;
  errorCode?: string;
  errorMessage?: string;
}

function buildArticlePrompt(
  post: BlogPostRow,
  brief: ContentBrief,
  revisionFeedback?: string
): string {
  const sections = brief.key_sections
    .map(
      (s, i) =>
        `${i + 1}. H2: "${s.h2}"
   angle: ${s.angle}
   must_cover: ${s.must_cover.join(" | ")}
   reader_takeaway: ${s.reader_takeaway}`
    )
    .join("\n\n");

  const faqPlan = brief.faq
    .map((f, i) => `${i + 1}. Q: ${f.q}\n   A gist: ${f.a_gist}`)
    .join("\n");

  const linkList = brief.internal_link_candidates
    .map((l) => `- ${l.url}  →  anchor: "${l.label}"`)
    .join("\n");

  const cta = brief.cta_plan;
  const ctaBlock =
    cta.product_status === "live"
      ? `- CTA is LIVE: link the anchor text to ${cta.cta_url}. Frame it as a natural next step, not a hard sell.`
      : `- CTA product is UPCOMING. Do NOT invent a URL for it. Mention it as a teaser ("${cta.upcoming_teaser}") and link readers to ${cta.cta_url} as the immediate action.`;

  const revisionBlock = revisionFeedback
    ? `\n\nREVISION REQUIRED — the previous draft failed QA for these reasons. Fix ALL of them:\n${revisionFeedback}\n`
    : "";

  return `You are BluntChart's senior astrology content writer. Voice: direct, second-person ("you"), specific, warm-but-honest. You write for a reader who came from Google feeling stuck about "${post.primary_keyword}" and needs to see themselves in the first paragraph.

BRIEF:
- reader_pain_point: ${brief.reader_pain_point}
- proposed_title: ${brief.proposed_title}
- meta_description: ${brief.meta_description}
- target_word_count: ~${brief.target_word_count} words
- problem_signals the reader will recognize:
${brief.problem_signals.map((s) => `  • ${s}`).join("\n")}

SECTIONS TO WRITE (H2s must read as reader-questions when it fits the topic):
${sections}

FAQ TO INCLUDE (visible at the bottom, each Q as <h3>, each A as <p>):
${faqPlan}

INTERNAL LINKS (place 2-4 of these naturally in the body — never invent URLs):
${linkList}

CTA:
${ctaBlock}

HARD RULES:
- Open with a specific pain or pattern in the first 100 words. No "astrology has fascinated humans", no "in today's world", no throat-clearing.
- Use concrete astrology mechanics — placements, aspects, houses, transits — not sun-sign clichés.
- Second-person voice throughout. "You" not "some people".
- Emit only these HTML tags: <h2>, <h3>, <p>, <ul>, <ol>, <li>, <strong>, <em>, <blockquote>, <a>. No images, no scripts, no <html>/<body>/<head>, no inline styles, no classes.
- Every <a href> must point to one of the listed internal links or an anchor on bluntchart.com. No external links. No mailto. No javascript:.
- The CTA paragraph must be wrapped exactly like this (I will unwrap it after your response):
  <<<CTA_START>>>
  <p>...cta paragraph with a link to ${cta.cta_url}...</p>
  <<<CTA_END>>>
- Never use these banned phrases:
${BANNED_PHRASES.map((p) => `  • "${p}"`).join("\n")}
- Do NOT mention, promote, compare against, or recommend competing astrology apps or services by name (including but not limited to: ${COMPETITOR_TERMS.join(", ")}). If a comparison feels needed, describe the pattern generically without naming the competitor.
${revisionBlock}
OUTPUT FORMAT — return EXACTLY these five fenced sections in this order, no preamble, no epilogue:

===TITLE===
{final title — may refine the proposed_title, keep <65 chars}

===SLUG===
{lowercase-kebab-slug derived from the final title, no punctuation, <=60 chars}

===META===
{150-160 char meta description}

===ARTICLE===
{the full article HTML — opening paragraph, then H2 sections, then <h2>Frequently Asked Questions</h2> block with H3/P per Q&A, then the <<<CTA_START>>> ... <<<CTA_END>>> block as the final content}

===FAQ_JSON===
{a JSON array like [{"q":"...","a":"..."},...] mirroring the FAQ section, plain text answers, 1-2 sentences each}
`;
}

interface ParsedSections {
  title?: string;
  slug?: string;
  meta?: string;
  article?: string;
  faqJson?: string;
}

function parseSections(raw: string): ParsedSections {
  const grab = (tag: string): string | undefined => {
    const re = new RegExp(`===${tag}===\\s*([\\s\\S]*?)(?=\\n===[A-Z_]+===|$)`, "i");
    const m = raw.match(re);
    return m ? m[1].trim() : undefined;
  };
  return {
    title: grab("TITLE"),
    slug: grab("SLUG"),
    meta: grab("META"),
    article: grab("ARTICLE"),
    faqJson: grab("FAQ_JSON"),
  };
}

function extractCtaBlock(articleHtml: string): { article: string; cta: string | null } {
  const m = articleHtml.match(/<<<CTA_START>>>([\s\S]*?)<<<CTA_END>>>/);
  if (!m) return { article: articleHtml, cta: null };
  const cta = m[1].trim();
  return {
    article: articleHtml.replace(m[0], "").trim(),
    cta,
  };
}

function stripCodeFences(s: string): string {
  const fenced = s.match(/```(?:html|json)?\s*([\s\S]*?)```/);
  return (fenced ? fenced[1] : s).trim();
}

function countWords(html: string): number {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
}

interface WriteInput {
  post: BlogPostRow;
  brief: ContentBrief;
  revisionFeedback?: string;
}

async function runOneGeneration(
  input: WriteInput
): Promise<
  | { ok: true; article: GeneratedArticle }
  | { ok: false; errorCode: string; errorMessage: string }
> {
  const prompt = buildArticlePrompt(input.post, input.brief, input.revisionFeedback);

  const result = await generateText({
    model: MODELS.articleGeneration,
    prompt,
    temperature: 0.75,
    maxOutputTokens: 8000,
  });

  if (!result.ok || !result.data) {
    return {
      ok: false,
      errorCode: result.errorCode ?? "ARTICLE_GENERATION_FAILED",
      errorMessage: result.errorMessage ?? "Empty response",
    };
  }

  const sections = parseSections(result.data);
  if (!sections.title || !sections.article || !sections.meta) {
    return {
      ok: false,
      errorCode: "ARTICLE_PARSE_FAILED",
      errorMessage: `Missing required sections. Raw head: ${result.data.slice(0, 200)}`,
    };
  }

  const { article: articleWithoutCta, cta } = extractCtaBlock(sections.article);
  if (!cta) {
    return {
      ok: false,
      errorCode: "ARTICLE_CTA_MISSING",
      errorMessage: "CTA markers <<<CTA_START>>>/<<<CTA_END>>> not present in article",
    };
  }

  const product = (input.post.target_product ?? "birth_chart") as TargetProduct;
  const wrappedCta = wrapCtaHtml(cta, product);
  const fullArticle = `${articleWithoutCta}\n\n${wrappedCta}`;

  let faqData: Array<{ q: string; a: string }> = [];
  if (sections.faqJson) {
    try {
      const parsed = JSON.parse(stripCodeFences(sections.faqJson));
      if (Array.isArray(parsed)) {
        faqData = parsed
          .filter((x) => x && typeof x.q === "string" && typeof x.a === "string")
          .map((x) => ({ q: x.q, a: x.a }));
      }
    } catch {
      // Non-fatal — QA will still see the visible FAQ HTML in the article body.
    }
  }

  const title = sections.title.replace(/^["']|["']$/g, "").slice(0, 120);
  const slugBase = sections.slug ? toSlug(sections.slug) : toSlug(title);

  return {
    ok: true,
    article: {
      title,
      slug: slugBase,
      meta_description: sections.meta.replace(/^["']|["']$/g, "").slice(0, 200),
      article_html: fullArticle,
      faq_data: faqData,
      generation_model: MODELS.articleGeneration,
      word_count: countWords(fullArticle),
    },
  };
}

export async function generateArticle(
  supabase: SupabaseClient,
  post: BlogPostRow,
  brief: ContentBrief,
  options: { dryRun?: boolean; revisionFeedback?: string } = {}
): Promise<ArticleResult> {
  const dryRun = options.dryRun ?? false;

  const shape = validateBriefShape(brief);
  if (!shape.ok) {
    return {
      ok: false,
      dryRun,
      errorCode: "BRIEF_MALFORMED",
      errorMessage: `Stored content_brief is missing required fields: ${shape.missing.join(", ")}. Reset pipeline_stage to TOPIC_SELECTED and re-run /api/admin/generate-briefs.`,
    };
  }

  const gen = await runOneGeneration({
    post,
    brief,
    revisionFeedback: options.revisionFeedback,
  });

  if (!gen.ok) {
    return {
      ok: false,
      dryRun,
      errorCode: gen.errorCode,
      errorMessage: gen.errorMessage,
    };
  }

  if (dryRun) {
    return { ok: true, dryRun: true, article: gen.article };
  }

  const finalSlug = await uniqueSlug(supabase, gen.article.slug);
  const article: GeneratedArticle = { ...gen.article, slug: finalSlug };

  const isRevision = Boolean(options.revisionFeedback);
  const updatePayload: Record<string, unknown> = {
    title: article.title,
    slug: article.slug,
    article_html: article.article_html,
    meta_description: article.meta_description,
    faq_data: article.faq_data,
    generation_model: article.generation_model,
    pipeline_stage: "ARTICLE_GENERATED",
    updated_at: new Date().toISOString(),
  };
  if (isRevision) {
    updatePayload.revision_count = (post.revision_count ?? 0) + 1;
  }

  // On a first write we expect stage=BRIEF_CREATED; on a QA revision we
  // expect stage=ARTICLE_GENERATED. Match either to stay idempotent.
  const expectedStage = isRevision ? "ARTICLE_GENERATED" : "BRIEF_CREATED";

  const { error } = await supabase
    .from(DB.blogPosts)
    .update(updatePayload)
    .eq("id", post.id)
    .eq("pipeline_stage", expectedStage);

  if (error) {
    return {
      ok: false,
      dryRun: false,
      errorCode: "DB_UPDATE_FAILED",
      errorMessage: error.message,
    };
  }

  return { ok: true, dryRun: false, article };
}
