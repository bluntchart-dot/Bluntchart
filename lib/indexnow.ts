const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bluntchart.com";
const HOST = new URL(SITE_URL).host;

export interface IndexNowResult {
  ok: boolean;
  status: number;
  submittedUrls: string[];
  errorCode?: string;
  errorMessage?: string;
}

/**
 * Submits one or more absolute bluntchart.com URLs to IndexNow so
 * Bing (and other participating engines) can crawl them without
 * waiting for the next sitemap fetch. Server-only: INDEXNOW_API_KEY
 * must never reach client bundles.
 *
 * Not wired to deploys or the blog pipeline (blog posts publish to
 * Blogger's own host, which IndexNow would reject as a host mismatch).
 * Call this explicitly when a bluntchart.com page is published,
 * meaningfully updated, or removed.
 */
export async function submitToIndexNow(
  urls: string | string[]
): Promise<IndexNowResult> {
  const urlList = Array.isArray(urls) ? urls : [urls];

  const key = process.env.INDEXNOW_API_KEY;
  if (!key) {
    console.error("[indexnow] INDEXNOW_API_KEY is not configured");
    return {
      ok: false,
      status: 0,
      submittedUrls: urlList,
      errorCode: "MISSING_KEY",
      errorMessage: "INDEXNOW_API_KEY is not configured",
    };
  }

  if (urlList.length === 0) {
    return { ok: false, status: 0, submittedUrls: [], errorCode: "NO_URLS", errorMessage: "no URLs provided" };
  }

  for (const url of urlList) {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return {
        ok: false,
        status: 0,
        submittedUrls: urlList,
        errorCode: "INVALID_URL",
        errorMessage: `not an absolute URL: ${url}`,
      };
    }
    if (parsed.host !== HOST) {
      return {
        ok: false,
        status: 0,
        submittedUrls: urlList,
        errorCode: "HOST_MISMATCH",
        errorMessage: `url host "${parsed.host}" does not match site host "${HOST}": ${url}`,
      };
    }
  }

  const body = {
    host: HOST,
    key,
    keyLocation: `${SITE_URL}/${key}.txt`,
    urlList,
  };

  let res: Response;
  try {
    res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error("[indexnow] request failed:", errorMessage);
    return {
      ok: false,
      status: 0,
      submittedUrls: urlList,
      errorCode: "NETWORK_ERROR",
      errorMessage,
    };
  }

  const result = interpretResponse(res.status, urlList);
  if (result.ok) {
    console.log(
      `[indexnow] submitted ${urlList.length} url(s), status ${res.status}`
    );
  } else {
    console.error(
      `[indexnow] submission failed: ${result.errorCode} (status ${res.status}) — ${result.errorMessage}`
    );
  }
  return result;
}

function interpretResponse(
  status: number,
  submittedUrls: string[]
): IndexNowResult {
  switch (status) {
    case 200:
    case 202:
      return { ok: true, status, submittedUrls };
    case 400:
      return {
        ok: false,
        status,
        submittedUrls,
        errorCode: "BAD_REQUEST",
        errorMessage: "Invalid request format (malformed body, missing fields, or invalid URLs)",
      };
    case 403:
      return {
        ok: false,
        status,
        submittedUrls,
        errorCode: "FORBIDDEN",
        errorMessage: "Key not valid — key not found, invalid format, or not accessible at keyLocation",
      };
    case 422:
      return {
        ok: false,
        status,
        submittedUrls,
        errorCode: "UNPROCESSABLE",
        errorMessage: "URL host does not match the key file host, or key mismatch",
      };
    case 429:
      return {
        ok: false,
        status,
        submittedUrls,
        errorCode: "RATE_LIMITED",
        errorMessage: "Too many requests",
      };
    default:
      return {
        ok: false,
        status,
        submittedUrls,
        errorCode: "UNEXPECTED_STATUS",
        errorMessage: `Unexpected HTTP status ${status}`,
      };
  }
}
