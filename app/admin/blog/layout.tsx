import type { Metadata } from "next";
import type { ReactNode } from "react";

/**
 * Admin-only Blog Control area.
 * noindex/nofollow is defense-in-depth: the authentication check inside
 * each server component is the actual security boundary. This block just
 * ensures accidentally-indexed URLs never surface in Google/AI results.
 */
export const metadata: Metadata = {
  title: "Blog Control — BluntChart Admin",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function AdminBlogLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0d12",
        color: "#e8ebf1",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        padding: "24px 32px",
      }}
    >
      {children}
    </div>
  );
}
