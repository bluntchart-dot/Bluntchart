/**
 * /internal/premium — hidden internal playground.
 *
 * Behaviour:
 *   - PREMIUM_DEV_PASSWORD not set on the server → 404 (route effectively
 *     does not exist). No configuration surface leaks to the outside.
 *   - Cookie not present → render the password login form.
 *   - Cookie present + valid → render the Premium Reading Engine playground.
 *
 * This page is not linked from anywhere on the live site, is blocked in
 * robots.ts, is not in sitemap.ts, and is marked noindex,nofollow so it
 * cannot appear in search results even if the URL leaks.
 */

import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PremiumReadingApp from "@/components/PremiumReadingApp";
import PremiumDevLogin from "@/components/PremiumDevLogin";
import { isDevAuthorized } from "@/lib/premium/dev-auth";

export const metadata: Metadata = {
  title: "Premium Reading — internal",
  robots: { index: false, follow: false, nocache: true },
};

export default async function PremiumDevPage() {
  if (!process.env.PREMIUM_DEV_PASSWORD) notFound();

  const cookieStore = await cookies();
  const authorized  = isDevAuthorized(cookieStore);

  return (
    <main className="min-h-screen bg-[#09090f] text-[#e8e4f0] py-12 px-4 sm:px-6 lg:px-10">
      <div className="max-w-6xl mx-auto w-full">
        <div className="mb-8 inline-block rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-amber-200">
          Internal dev playground · not indexed
        </div>

        {authorized ? (
          <PremiumReadingApp eyebrow="BluntChart · Premium engine (dev)" />
        ) : (
          <PremiumDevLogin />
        )}
      </div>
    </main>
  );
}
