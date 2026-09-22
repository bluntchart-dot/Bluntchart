import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Founder page moved to top-level route. Permanent (308) preserves method
      // and is treated as 301 by search engines for indexing purposes.
      {
        source: "/about/founder",
        destination: "/founder",
        permanent: true,
      },
      // Without-year URL that Google indexed before the page was named with the year.
      {
        source: "/mercury-retrograde-in-scorpio",
        destination: "/mercury-retrograde-in-scorpio-2026",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      // Defence-in-depth for the hidden internal surfaces. robots.ts already
      // disallows crawling and the page carries noindex metadata; this header
      // covers the API routes (which have no HTML meta at all) and any edge
      // case where a crawler ignores the meta tag.
      {
        source: "/internal/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/api/internal/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
    ];
  },
};

export default nextConfig;
