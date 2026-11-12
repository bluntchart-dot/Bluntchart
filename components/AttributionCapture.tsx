"use client";

import { useEffect } from "react";
import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_MAX_AGE_SECONDS,
  directTouch,
  parseAttribution,
  serializeAttribution,
  touchFromLanding,
  type Attribution,
} from "@/lib/attribution";

function readCookie(name: string): string | null {
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : null;
}

/**
 * Records where the visitor came from (UTM tags, ad click ids, referrer) in a
 * first-party cookie on each full page load. /api/save-pending reads it when a
 * form is submitted. Renders nothing.
 */
export default function AttributionCapture() {
  useEffect(() => {
    try {
      const existing = parseAttribution(readCookie(ATTRIBUTION_COOKIE));
      const touch = touchFromLanding(window.location.href, document.referrer);

      let next: Attribution | null = null;
      if (touch) {
        next = { first: existing?.first ?? touch, last: touch };
      } else if (!existing) {
        const direct = directTouch(window.location.href);
        next = { first: direct, last: direct };
      }
      if (!next) return;

      const secure = window.location.protocol === "https:" ? "; Secure" : "";
      document.cookie =
        `${ATTRIBUTION_COOKIE}=${serializeAttribution(next)}; Path=/; ` +
        `Max-Age=${ATTRIBUTION_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
    } catch {
      /* attribution is best-effort; never break the page */
    }
  }, []);

  return null;
}
