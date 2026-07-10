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

      {post.qa_score && (
        <Section title="QA rubric">
          <pre style={preStyle}>{JSON.stringify(post.qa_score, null, 2)}</pre>
        </Section>
      )}

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
