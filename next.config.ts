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
    ];
  },
};

export default nextConfig;
