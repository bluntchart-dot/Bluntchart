/**
 * Visitor attribution — where a lead came from.
 *
 * The browser records a first touch (what originally brought the visitor)
 * and a last touch (what brought them back most recently) in the `bc_attr`
 * cookie (see components/AttributionCapture.tsx). /api/save-pending reads the
 * cookie and stores it on abandoned_checkouts + Payments.
 *
 * Safe to import from both client and server code.
 */

export const ATTRIBUTION_COOKIE = "bc_attr";
export const ATTRIBUTION_MAX_AGE_SECONDS = 60 * 60 * 24 * 90; // 90 days

export interface Touch {
  source: string;
  medium: string;
  campaign?: string;
  content?: string;
  term?: string;
  /** Referring hostname, when the browser exposed one. */
  referrer?: string;
  /** Path the visitor landed on, e.g. "/big-three-calculator". */
  landing?: string;
  /** ISO timestamp of the touch. */
  at: string;
}

export interface Attribution {
  first: Touch;
  last: Touch;
}

const SEARCH_HOSTS = /(^|\.)(google|bing|duckduckgo|yahoo|ecosia|yandex|baidu|brave|startpage)\./;
const SOCIAL_HOSTS: Record<string, string> = {
  "instagram.com": "instagram",
  "l.instagram.com": "instagram",
  "facebook.com": "facebook",
  "l.facebook.com": "facebook",
  "m.facebook.com": "facebook",
  "lm.facebook.com": "facebook",
  "t.co": "twitter",
  "x.com": "twitter",
  "twitter.com": "twitter",
  "tiktok.com": "tiktok",
  "pinterest.com": "pinterest",
  "pin.it": "pinterest",
  "youtube.com": "youtube",
  "m.youtube.com": "youtube",
  "reddit.com": "reddit",
  "out.reddit.com": "reddit",
  "linkedin.com": "linkedin",
  "lnkd.in": "linkedin",
  "threads.net": "threads",
  "threads.com": "threads",
};

const clean = (value: unknown, max = 120): string | undefined => {
  if (typeof value !== "string") return undefined;
  const v = value.trim().slice(0, max);
  return v || undefined;
};

const hostOf = (url: string): string | undefined => {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return undefined;
  }
};

/**
 * Work out the touch for the current page load, or null when the visit
 * carries no new source information (internal navigation, refresh, or a
 * direct visit by someone we have already attributed).
 */
export function touchFromLanding(
  href: string,
  documentReferrer: string,
  now: Date = new Date()
): Touch | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  const p = url.searchParams;
  const at = now.toISOString();
  const landing = clean(url.pathname, 200);
  const refHost = hostOf(documentReferrer);
  const referrer = refHost && refHost !== url.hostname.replace(/^www\./, "") ? refHost : undefined;

  const utmSource = clean(p.get("utm_source"));
  if (utmSource) {
    return {
      source: utmSource.toLowerCase(),
      medium: clean(p.get("utm_medium"))?.toLowerCase() ?? "unknown",
      campaign: clean(p.get("utm_campaign")),
      content: clean(p.get("utm_content")),
      term: clean(p.get("utm_term")),
      referrer,
      landing,
      at,
    };
  }

  // Ad click ids without UTM tags
  if (p.get("gclid")) return { source: "google", medium: "cpc", referrer, landing, at };
  if (p.get("fbclid")) {
    const social = referrer ? SOCIAL_HOSTS[referrer] : undefined;
    return { source: social ?? "meta", medium: "social", referrer, landing, at };
  }

  const ref = clean(p.get("ref"));
  if (ref) return { source: ref.toLowerCase(), medium: "referral", referrer, landing, at };

  if (referrer) {
    if (SOCIAL_HOSTS[referrer]) {
      return { source: SOCIAL_HOSTS[referrer], medium: "social", referrer, landing, at };
    }
    const engine = SEARCH_HOSTS.exec(referrer)?.[2];
    if (engine) {
      return { source: engine, medium: "organic", referrer, landing, at };
    }
    return { source: referrer, medium: "referral", referrer, landing, at };
  }

  return null;
}

/** Direct / unknown visit — used only when the visitor has no touch yet. */
export function directTouch(href: string, now: Date = new Date()): Touch {
  let landing: string | undefined;
  try {
    landing = clean(new URL(href).pathname, 200);
  } catch {
    landing = undefined;
  }
  return { source: "direct", medium: "none", landing, at: now.toISOString() };
}

function sanitizeTouch(raw: unknown): Touch | null {
  if (!raw || typeof raw !== "object") return null;
  const t = raw as Record<string, unknown>;
  const source = clean(t.source);
  const medium = clean(t.medium);
  const at = clean(t.at, 40);
  if (!source || !medium || !at) return null;
  return {
    source,
    medium,
    campaign: clean(t.campaign),
    content: clean(t.content),
    term: clean(t.term),
    referrer: clean(t.referrer),
    landing: clean(t.landing, 200),
    at,
  };
}

/** Parse the cookie value. Returns null for missing or malformed cookies. */
export function parseAttribution(cookieValue: string | undefined | null): Attribution | null {
  if (!cookieValue) return null;
  try {
    const raw = JSON.parse(decodeURIComponent(cookieValue)) as Record<string, unknown>;
    const first = sanitizeTouch(raw.first);
    const last = sanitizeTouch(raw.last) ?? first;
    if (!first || !last) return null;
    return { first, last };
  } catch {
    return null;
  }
}

export function serializeAttribution(a: Attribution): string {
  return encodeURIComponent(JSON.stringify(a));
}

/** Single source label for quick grouping: last touch wins, "direct" only if nothing else. */
export function primarySource(a: Attribution | null): string | null {
  if (!a) return null;
  if (a.last.source !== "direct") return a.last.source;
  return a.first.source;
}

/**
 * Add UTM tags to bluntchart.com links. Existing utm_* params are kept.
 * Non-bluntchart URLs are returned unchanged.
 */
export function withUtm(
  url: string,
  tags: { source: string; medium: string; campaign: string; content?: string }
): string {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return url;
  }
  if (!/(^|\.)bluntchart\.com$/i.test(u.hostname)) return url;
  if (u.searchParams.has("utm_source")) return url;
  u.searchParams.set("utm_source", tags.source);
  u.searchParams.set("utm_medium", tags.medium);
  u.searchParams.set("utm_campaign", tags.campaign);
  if (tags.content) u.searchParams.set("utm_content", tags.content);
  return u.toString();
}
