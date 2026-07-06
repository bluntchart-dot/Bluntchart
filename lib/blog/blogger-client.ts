const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const BLOGGER_API = "https://www.googleapis.com/blogger/v3";

interface TokenResponse {
  access_token?: string;
  expires_in?: number;
  error?: string;
  error_description?: string;
}

export interface BloggerPost {
  id?: string;
  url?: string;
  title?: string;
  published?: string;
  updated?: string;
  status?: string;
  labels?: string[];
}

interface PostsListResponse {
  items?: BloggerPost[];
  nextPageToken?: string;
}

interface BloggerError {
  error?: { message?: string; code?: number };
}

function getRequiredEnv(name: string): string {
  const val = process.env[name];
  if (!val) throw new Error(`Missing required env var: ${name}`);
  return val;
}

export async function refreshAccessToken(): Promise<string> {
  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: getRequiredEnv("BLOGGER_CLIENT_ID"),
      client_secret: getRequiredEnv("BLOGGER_CLIENT_SECRET"),
      refresh_token: getRequiredEnv("BLOGGER_REFRESH_TOKEN"),
      grant_type: "refresh_token",
    }),
    cache: "no-store",
  });

  const json = (await res.json()) as TokenResponse;

  if (!res.ok || !json.access_token) {
    throw new Error(
      `Token refresh failed: ${json.error_description ?? json.error ?? res.status}`
    );
  }

  return json.access_token;
}

export function getBlogId(): string {
  return getRequiredEnv("BLOGGER_BLOG_ID");
}

export async function listPosts(
  accessToken: string,
  maxResults = 5
): Promise<BloggerPost[]> {
  const blogId = getBlogId();
  const url = `${BLOGGER_API}/blogs/${blogId}/posts?maxResults=${maxResults}&status=live&status=draft`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const err = (await res.json()) as BloggerError;
    throw new Error(
      `List posts failed (${res.status}): ${err.error?.message ?? "unknown"}`
    );
  }

  const data = (await res.json()) as PostsListResponse;
  return data.items ?? [];
}

export async function createPost(
  accessToken: string,
  post: { title: string; content: string; labels?: string[] },
  isDraft = false
): Promise<BloggerPost> {
  const blogId = getBlogId();
  const url = `${BLOGGER_API}/blogs/${blogId}/posts?isDraft=${isDraft}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      kind: "blogger#post",
      title: post.title,
      content: post.content,
      labels: post.labels ?? [],
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = (await res.json()) as BloggerError;
    throw new Error(
      `Create post failed (${res.status}): ${err.error?.message ?? "unknown"}`
    );
  }

  return (await res.json()) as BloggerPost;
}

export async function createScheduledPost(
  accessToken: string,
  post: { title: string; content: string; labels?: string[] },
  publishDate: Date
): Promise<BloggerPost> {
  const blogId = getBlogId();
  const url = `${BLOGGER_API}/blogs/${blogId}/posts`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      kind: "blogger#post",
      title: post.title,
      content: post.content,
      labels: post.labels ?? [],
      published: publishDate.toISOString(),
      status: "SCHEDULED",
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    const err = (await res.json()) as BloggerError;
    throw new Error(
      `Create scheduled post failed (${res.status}): ${err.error?.message ?? "unknown"}`
    );
  }

  return (await res.json()) as BloggerPost;
}

export async function deletePost(
  accessToken: string,
  postId: string
): Promise<void> {
  const blogId = getBlogId();
  const url = `${BLOGGER_API}/blogs/${blogId}/posts/${postId}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error(`Delete post failed (${res.status}): ${text.slice(0, 200)}`);
  }
}

export async function getPost(
  accessToken: string,
  postId: string
): Promise<BloggerPost | null> {
  const blogId = getBlogId();
  const url = `${BLOGGER_API}/blogs/${blogId}/posts/${postId}`;

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    const err = (await res.json()) as BloggerError;
    throw new Error(
      `Get post failed (${res.status}): ${err.error?.message ?? "unknown"}`
    );
  }

  return (await res.json()) as BloggerPost;
}
