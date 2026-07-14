import { redirect } from "next/navigation";
import Link from "next/link";
import { hasAdminSession } from "@/lib/blog/admin-auth";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { DB } from "@/lib/db/tables";
import type { BlogPostRow, BlogRunRow } from "@/lib/blog/db-types";
import ManualTopicForm from "./ManualTopicForm";
import RefreshButton from "./RefreshButton";
import LogoutButton from "./LogoutButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type StageBucket =
  | "Queued"
  | "Brief"
  | "Article"
  | "QA"
  | "Image"
  | "Publish"
  | "Failed";

const STAGE_TO_BUCKET: Record<string, StageBucket> = {
  TOPIC_SELECTED: "Queued",
  BRIEF_CREATED: "Brief",
  ARTICLE_GENERATED: "Article",
  QA_PASSED: "QA",
  QA_FAILED: "QA",
  IMAGE_GENERATED: "Image",
  IMAGE_UPLOADED: "Image",
  BLOGGER_CREATED: "Publish",
  BLOGGER_SCHEDULED: "Publish",
  PUBLISHED: "Publish",
  REJECTED: "Failed",
};

const BUCKET_ORDER: StageBucket[] = [
  "Queued",
  "Brief",
  "Article",
  "QA",
  "Image",
  "Publish",
  "Failed",
];

function bucketFor(row: BlogPostRow): StageBucket {
  return STAGE_TO_BUCKET[row.pipeline_stage] ?? "Failed";
}

function stageBadgeColor(stage: string): string {
  if (stage === "PUBLISHED") return "#22c55e";
  if (stage === "QA_FAILED" || stage === "REJECTED") return "#ef4444";
  if (stage === "QA_PASSED") return "#84cc16";
  if (stage.startsWith("BLOGGER")) return "#3b82f6";
  if (stage.startsWith("IMAGE")) return "#a855f7";
  if (stage === "ARTICLE_GENERATED") return "#eab308";
  if (stage === "BRIEF_CREATED") return "#f59e0b";
  return "#6b7280";
}

export default async function AdminBlogPage() {
  const authed = await hasAdminSession();
  if (!authed) redirect("/admin/blog/login");

  const supabase = createSupabaseAdmin();

  const { data: postsRaw } = await supabase
    .from(DB.blogPosts)
    .select(
      "id, source, primary_keyword, secondary_keywords, content_cluster, target_product, opportunity_score, pipeline_stage, publishing_status, title, slug, meta_description, article_html, generation_model, qa_score, revision_count, blogger_url, blogger_post_id, image_url, scheduled_publish_at, last_error_code, last_error_message, created_at, updated_at, published_at, run_id"
    )
    .order("opportunity_score", { ascending: false })
    .order("created_at", { ascending: true })
    .limit(200);

  const posts = (postsRaw ?? []) as BlogPostRow[];

  const { data: runsRaw } = await supabase
    .from(DB.blogRuns)
    .select("id, run_date, dry_run, status, topics_discovered, posts_published, last_error, created_at")
    .order("created_at", { ascending: false })
    .limit(5);
  const runs = (runsRaw ?? []) as BlogRunRow[];

  const buckets: Record<StageBucket, BlogPostRow[]> = {
    Queued: [],
    Brief: [],
    Article: [],
    QA: [],
    Image: [],
    Publish: [],
    Failed: [],
  };
  for (const p of posts) buckets[bucketFor(p)].push(p);

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, margin: 0 }}>Blog Control</h1>
          <div style={{ fontSize: 12, opacity: 0.55, marginTop: 4 }}>
            Internal only • {posts.length} posts tracked
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <RefreshButton />
          <LogoutButton />
        </div>
      </header>

      <section style={{ marginBottom: 28 }}>
        <SectionTitle>New manual topic</SectionTitle>
        <ManualTopicForm />
      </section>

      <section style={{ marginBottom: 28 }}>
        <SectionTitle>Recent runs</SectionTitle>
        <table style={tableStyle}>
          <thead>
            <tr>
              <Th>Date</Th>
              <Th>Dry?</Th>
              <Th>Status</Th>
              <Th>Discovered</Th>
              <Th>Published</Th>
              <Th>Last error</Th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => (
              <tr key={r.id}>
                <Td>{r.run_date}</Td>
                <Td>{r.dry_run ? "yes" : "no"}</Td>
                <Td>{r.status}</Td>
                <Td>{r.topics_discovered}</Td>
                <Td>{r.posts_published}</Td>
                <Td style={{ color: r.last_error ? "#ef4444" : undefined }}>
                  {r.last_error ? r.last_error.slice(0, 120) : "—"}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <SectionTitle>Pipeline</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, marginBottom: 18 }}>
          {BUCKET_ORDER.map((b) => (
            <div key={b} style={countCardStyle}>
              <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 2 }}>{b}</div>
              <div style={{ fontSize: 20 }}>{buckets[b].length}</div>
            </div>
          ))}
        </div>

        {BUCKET_ORDER.map((b) =>
          buckets[b].length === 0 ? null : (
            <div key={b} style={{ marginBottom: 22 }}>
              <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 8 }}>
                {b} ({buckets[b].length})
              </div>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <Th>Source</Th>
                    <Th>Topic</Th>
                    <Th>Score</Th>
                    <Th>Cluster / Product</Th>
                    <Th>Stage</Th>
                    <Th>Words</Th>
                    <Th>Brand</Th>
                    <Th>Publish</Th>
                    <Th></Th>
                  </tr>
                </thead>
                <tbody>
                  {buckets[b].map((p) => (
                    <tr key={p.id}>
                      <Td>
                        <SourceBadge source={p.source} />
                      </Td>
                      <Td>
                        <div style={{ maxWidth: 320, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {p.title || p.primary_keyword}
                        </div>
                        {p.title && p.primary_keyword !== p.title && (
                          <div style={{ fontSize: 11, opacity: 0.5 }}>kw: {p.primary_keyword}</div>
                        )}
                        {p.last_error_code && (
                          <div style={{ fontSize: 11, color: "#ef4444" }}>
                            {p.last_error_code}
                          </div>
                        )}
                      </Td>
                      <Td>{p.opportunity_score ?? "—"}</Td>
                      <Td style={{ fontSize: 12 }}>
                        {p.content_cluster ?? "—"}
                        <br />
                        <span style={{ opacity: 0.6 }}>{p.target_product ?? "—"}</span>
                      </Td>
                      <Td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: 999,
                            background: stageBadgeColor(p.pipeline_stage) + "22",
                            border: `1px solid ${stageBadgeColor(p.pipeline_stage)}66`,
                            color: stageBadgeColor(p.pipeline_stage),
                            fontSize: 11,
                          }}
                        >
                          {p.pipeline_stage}
                        </span>
                      </Td>
                      <Td>{wordCount(p.article_html)}</Td>
                      <Td>{brandScore(p.qa_score)}</Td>
                      <Td>
                        {p.blogger_url ? (
                          <a href={p.blogger_url} target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa" }}>
                            live
                          </a>
                        ) : (
                          "—"
                        )}
                      </Td>
                      <Td>
                        <Link href={`/admin/blog/${p.id}`} style={{ color: "#93c5fd", fontSize: 12 }}>
                          open →
                        </Link>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </section>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 0.5, opacity: 0.65, marginBottom: 12 }}>
      {children}
    </h2>
  );
}

function Th({ children }: { children?: React.ReactNode }) {
  return (
    <th
      style={{
        textAlign: "left",
        padding: "8px 10px",
        borderBottom: "1px solid #232838",
        fontSize: 11,
        fontWeight: 500,
        opacity: 0.7,
        textTransform: "uppercase",
        letterSpacing: 0.4,
      }}
    >
      {children}
    </th>
  );
}
function Td({ children, style }: { children?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <td
      style={{
        padding: "10px",
        borderBottom: "1px solid #1a1e28",
        fontSize: 13,
        verticalAlign: "top",
        ...style,
      }}
    >
      {children}
    </td>
  );
}

function SourceBadge({ source }: { source: "gemini" | "manual" }) {
  const isManual = source === "manual";
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 6px",
        borderRadius: 4,
        background: isManual ? "#a855f722" : "#232838",
        color: isManual ? "#c084fc" : "#a1a8b6",
        fontSize: 10,
        textTransform: "uppercase",
        letterSpacing: 0.5,
      }}
    >
      {source}
    </span>
  );
}

function wordCount(html: string | null | undefined): string {
  if (!html) return "—";
  const n = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean).length;
  return n.toString();
}

/**
 * Pluck the Brand Quality overall score from qa_score, handling both the
 * new two-gate shape and legacy flat blobs. Returns a compact "X.X/10"
 * string, or "—" when no score exists.
 */
function brandScore(qa: unknown): string {
  if (!qa || typeof qa !== "object") return "—";
  const s = qa as Record<string, unknown>;
  const bq = s.brand_quality as { overall_score?: number } | undefined;
  const score = typeof bq?.overall_score === "number" ? bq.overall_score : typeof s.overall_score === "number" ? s.overall_score : null;
  return score === null ? "—" : `${score.toFixed(1)}/10`;
}

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  background: "#0f131c",
  border: "1px solid #1a1e28",
  borderRadius: 8,
  overflow: "hidden",
};

const countCardStyle: React.CSSProperties = {
  background: "#0f131c",
  border: "1px solid #1a1e28",
  borderRadius: 8,
  padding: "10px 12px",
  textAlign: "center" as const,
};

