"use client";

import posthog from "posthog-js";
import { PostHogProvider as PHProvider, usePostHog } from "posthog-js/react";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { parseAttribution, ATTRIBUTION_COOKIE } from "@/lib/attribution";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : null;
}

function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthogClient = usePostHog();

  useEffect(() => {
    if (!pathname || !posthogClient) return;
    let url = window.origin + pathname;
    if (searchParams?.toString()) {
      url += "?" + searchParams.toString();
    }
    posthogClient.capture("$pageview", { $current_url: url });
  }, [pathname, searchParams, posthogClient]);

  return null;
}

function SyncAttribution() {
  const posthogClient = usePostHog();
  const synced = useRef(false);

  useEffect(() => {
    if (synced.current || !posthogClient) return;
    synced.current = true;

    const attr = parseAttribution(readCookie(ATTRIBUTION_COOKIE));
    if (!attr) return;

    posthogClient.setPersonProperties({
      first_touch_source: attr.first.source,
      first_touch_medium: attr.first.medium,
      first_touch_campaign: attr.first.campaign ?? null,
      first_touch_landing: attr.first.landing ?? null,
      last_touch_source: attr.last.source,
      last_touch_medium: attr.last.medium,
      last_touch_campaign: attr.last.campaign ?? null,
      last_touch_landing: attr.last.landing ?? null,
    });
  }, [posthogClient]);

  return null;
}

export default function PostHogProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
      person_profiles: "identified_and_anonymous",
      capture_pageview: false,
      capture_pageleave: true,
      autocapture: true,
    });
  }, []);

  return (
    <PHProvider client={posthog}>
      <PostHogPageView />
      <SyncAttribution />
      {children}
    </PHProvider>
  );
}
