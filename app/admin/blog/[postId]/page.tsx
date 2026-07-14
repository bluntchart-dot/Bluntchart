import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { hasAdminSession } from "@/lib/blog/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { DB } from "@/lib/db/tables";
import type { BlogPostRow } from "@/lib/blog/db-types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface PageProps {
  params: Promise<{ postId: string }>;
}

export default async function PostDetailPage({ params }: PageProps) {
  const authed = await hasAdminSession();
  if (!authed) redirect("/admin/blog/login");

  const { postId } = await params;
  const supabase = createSupabaseAdmin();
  const { data } = await supabase
    .from(DB.blogPosts)
    .select("*")
    .eq("id", postId)
    .maybeSingle();

  if (!data) return notFound();
  const post = data as BlogPostRow;

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto" }}>
      <div style={{ marginBottom: 16 }}>
        <Link href="/admin/blog" style={{ color: "#93c5fd", fontSize: 12 }}>
          ← Back to dashboard
        </Link>
      </div>

      <h1 style={{ fontSize: 20, marginBottom: 6 }}>
        {post.title || post.primary_keyword}
      </h1>
      <div style={{ fontSize: 12, opacity: 0.6, marginBottom: 20 }}>
        {post.source} • {post.pipeline_stage} • score {post.opportunity_score} • rev {post.revision_count}
      </div>

      <Grid>
        <Field label="Primary keyword" value={post.primary_keyword} />
        <Field
          label="Secondary keywords"
          value={
            post.secondary_keywords && post.secondary_keywords.length > 0
              ? post.secondary_keywords.join(", ")
              : "—"
          }
        />
        <Field label="Content cluster" value={post.content_cluster ?? "—"} />
        <Field
          label="Target product"
          value={`${post.target_product ?? "—"} (${post.product_status})`}
        />
        <Field label="Conversion angle" value={post.conversion_angle ?? "—"} />
        <Field label="CTA destination" value={post.cta_destination ?? "—"} />
        <Field label="Slug" value={post.slug ?? "—"} />
        <Field label="Meta description" value={post.meta_description ?? "—"} />
        <Field label="Generation model" value={post.generation_model ?? "—"} />
        <Field label="QA model" value={post.qa_model ?? "—"} />
        <Field label="Image URL" value={post.image_url ?? "—"} />
        <Field label="Blogger URL" value={post.blogger_url ?? "—"} link={post.blogger_url} />
        <Field
          label="Scheduled publish"
          value={post.scheduled_publish_at ?? "—"}
        />
        <Field label="Last error code" value={post.last_error_code ?? "—"} />
        <Field
          label="Last error"
          value={post.last_error_message ? post.last_error_message.slice(0, 300) : "—"}
        />
      </Grid>

      {post.qa_score && <QaGatesRender qa_score={post.qa_score} />}

      {post.faq_data && Array.isArray(post.faq_data) && post.faq_data.length > 0 && (
        <Section title={`FAQ (${post.faq_data.length})`}>
          <pre style={preStyle}>{JSON.stringify(post.faq_data, null, 2)}</pre>
        </Section>
      )}

      {post.content_brief && (
        <Section title="Content brief">
          <pre style={preStyle}>{JSON.stringify(post.content_brief, null, 2)}</pre>
        </Section>
      )}

      {post.article_html && (
        <Section title="Article preview (read-only)">
          <div
            style={{
              background: "#fff",
              color: "#111",
              borderRadius: 8,
              overflow: "hidden",
            }}
          >
            <iframe
              title={`article preview for ${post.id}`}
              srcDoc={renderPreviewHtml(post.article_html)}
              sandbox=""
              style={{ width: "100%", height: 640, border: 0, display: "block" }}
            />
          </div>
        </Section>
      )}
    </div>
  );
}

function renderPreviewHtml(articleHtml: string): string {
  // Sandbox is empty (no scripts, no forms, no top-nav) but we still
  // wrap in a doc that resembles the eventual Blogger view so layout is
  // representative. Never inject any admin data here.
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  body { font: 15px/1.55 -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #111; padding: 20px 28px; max-width: 780px; margin: 0 auto; }
  h2 { font-size: 20px; margin-top: 28px; }
  h3 { font-size: 16px; margin-top: 20px; }
  p, li { color: #222; }
  a { color: #1d4ed8; }
  blockquote { border-left: 3px solid #cbd5e1; margin: 16px 0; padding: 4px 14px; color: #444; }
  </style></head><body>${articleHtml}</body></html>`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 28 }}>
      <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5, opacity: 0.65, marginBottom: 10 }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "10px 24px",
        background: "#0f131c",
        border: "1px solid #1a1e28",
        borderRadius: 8,
        padding: 16,
      }}
    >
      {children}
    </div>
  );
}

function Field({ label, value, link }: { label: string; value: string; link?: string | null }) {
  return (
    <div>
      <div style={{ fontSize: 10, opacity: 0.55, textTransform: "uppercase", letterSpacing: 0.6, marginBottom: 2 }}>
        {label}
      </div>
      <div style={{ fontSize: 13, wordBreak: "break-word" }}>
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa" }}>
            {value}
          </a>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

const preStyle: React.CSSProperties = {
  background: "#0f131c",
  border: "1px solid #1a1e28",
  borderRadius: 8,
  padding: 14,
  fontSize: 12,
  color: "#c8ccd6",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  maxHeight: 400,
  overflow: "auto",
};

/**
 * Render the QA outcome. Handles both:
 *  - New shape: { publishing_gate, brand_quality }
 *  - Legacy flat shape from before the split (verdict, rubric_scores, ...)
 */
function QaGatesRender({ qa_score }: { qa_score: unknown }) {
  const s = qa_score as Record<string, unknown> | null;
  if (!s || typeof s !== "object") return null;

  const rawPublishing = s.publishing_gate as
    | {
        verdict?: string;
        recoverable?: boolean;
        hard_rule_violations?: string[];
        banned_matches?: string[];
        disallowed_links?: string[];
        competitor_matches?: string[];
        missing_fields?: string[];
        word_count?: number;
      }
    | undefined;
  // Legacy fallback: pre-split rows kept these fields flat on the outcome.
  // Reconstruct a Publishing-Gate-shaped view so legacy rows render the
  // same UI. verdict comes from `recoverable` + array presence.
  const legacyHardRules = (s.hard_rule_violations as string[]) ?? [];
  const legacyBanned = (s.banned_matches as string[]) ?? [];
  const legacyDisallowed = (s.disallowed_links as string[]) ?? [];
  const legacyCompetitors = (s.competitor_matches as string[]) ?? [];
  const publishing =
    rawPublishing ??
    (typeof s.recoverable === "boolean" || legacyBanned.length > 0 || legacyDisallowed.length > 0
      ? {
          verdict:
            legacyHardRules.length + legacyBanned.length + legacyDisallowed.length + legacyCompetitors.length === 0
              ? "PASS"
              : "FAIL",
          recoverable: s.recoverable as boolean | undefined,
          hard_rule_violations: legacyHardRules,
          banned_matches: legacyBanned,
          disallowed_links: legacyDisallowed,
          competitor_matches: legacyCompetitors,
          missing_fields: [],
          word_count: typeof s.word_count === "number" ? s.word_count : undefined,
        }
      : undefined);
  const brand = s.brand_quality as
    | {
        verdict?: string;
        overall_score?: number;
        rubric_scores?: Record<string, number>;
        feedback?: string;
      }
    | undefined;

  // Fallback: legacy pre-split shape stored the flat fields at the top level.
  const legacyOverall = typeof s.overall_score === "number" ? s.overall_score : undefined;
  const legacyRubric = s.rubric_scores as Record<string, number> | undefined;
  const legacyFeedback = typeof s.feedback === "string" ? s.feedback : undefined;
  const legacyVerdict = typeof s.verdict === "string" ? s.verdict : undefined;

  return (
    <>
      {publishing && (
        <Section title="Publishing Gate (blocks publishing)">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "6px 16px",
              background: "#0f131c",
              border: "1px solid #1a1e28",
              borderRadius: 8,
              padding: 14,
              fontSize: 13,
            }}
          >
            <div style={{ opacity: 0.65 }}>Verdict</div>
            <div style={{ color: publishing.verdict === "PASS" ? "#22c55e" : "#ef4444", fontWeight: 600 }}>
              {publishing.verdict}
              {publishing.verdict === "FAIL" && ` (recoverable: ${publishing.recoverable ? "yes" : "no"})`}
            </div>
            <div style={{ opacity: 0.65 }}>Word count</div>
            <div>{publishing.word_count ?? "—"}</div>
            {publishing.missing_fields && publishing.missing_fields.length > 0 && (
              <>
                <div style={{ opacity: 0.65 }}>Missing fields</div>
                <div>{publishing.missing_fields.join(", ")}</div>
              </>
            )}
            {publishing.hard_rule_violations && publishing.hard_rule_violations.length > 0 && (
              <>
                <div style={{ opacity: 0.65 }}>Hard rule violations</div>
                <div>{publishing.hard_rule_violations.join("; ")}</div>
              </>
            )}
            {publishing.banned_matches && publishing.banned_matches.length > 0 && (
              <>
                <div style={{ opacity: 0.65 }}>Banned matches</div>
                <div>{publishing.banned_matches.join(", ")}</div>
              </>
            )}
            {publishing.disallowed_links && publishing.disallowed_links.length > 0 && (
              <>
                <div style={{ opacity: 0.65 }}>Disallowed links</div>
                <div>{publishing.disallowed_links.join(", ")}</div>
              </>
            )}
            {publishing.competitor_matches && publishing.competitor_matches.length > 0 && (
              <>
                <div style={{ opacity: 0.65 }}>Competitor mentions</div>
                <div>{publishing.competitor_matches.join(", ")}</div>
              </>
            )}
          </div>
        </Section>
      )}

      {(brand || legacyOverall !== undefined) && (
        <Section title="Brand Quality Score (informational — does not gate publishing)">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              gap: "6px 16px",
              background: "#0f131c",
              border: "1px solid #1a1e28",
              borderRadius: 8,
              padding: 14,
              fontSize: 13,
              marginBottom: 10,
            }}
          >
            <div style={{ opacity: 0.65 }}>Overall score</div>
            <div style={{ fontWeight: 600 }}>{brand?.overall_score ?? legacyOverall ?? "—"} / 10</div>
            <div style={{ opacity: 0.65 }}>Rubric verdict</div>
            <div>{brand?.verdict ?? legacyVerdict ?? "—"}</div>
            <div style={{ opacity: 0.65 }}>Rubric scores</div>
            <div>
              {Object.entries(brand?.rubric_scores ?? legacyRubric ?? {}).map(([k, v]) => (
                <div key={k}>
                  <span style={{ opacity: 0.6 }}>{k}:</span> {String(v)}
                </div>
              ))}
            </div>
          </div>
          {(brand?.feedback ?? legacyFeedback) && (
            <details>
              <summary style={{ fontSize: 12, opacity: 0.7, cursor: "pointer", marginBottom: 4 }}>
                Rubric feedback
              </summary>
              <pre style={preStyle}>{brand?.feedback ?? legacyFeedback}</pre>
            </details>
          )}
        </Section>
      )}

      <Section title="qa_score (raw)">
        <details>
          <summary style={{ fontSize: 12, opacity: 0.7, cursor: "pointer", marginBottom: 4 }}>
            Show raw JSON
          </summary>
          <pre style={preStyle}>{JSON.stringify(qa_score, null, 2)}</pre>
        </details>
      </Section>
    </>
  );
}
