import type { Metadata } from "next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Honest Astrology & Birth Chart Readings | BluntChart",
  description:
    "Real natal chart readings, brutally honest and personal. Free tools, no subscription, no sugarcoating. Astrology that actually says something.",
  metadataBase: new URL("https://bluntchart.com"),
  openGraph: {
    title: "Honest Astrology & Birth Chart Readings | BluntChart",
    description:
      "Real natal chart readings, brutally honest and personal. Free tools, no subscription, no sugarcoating.",
    url: "https://bluntchart.com",
    siteName: "BluntChart",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BluntChart",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Honest Astrology & Birth Chart Readings | BluntChart",
    description:
      "Real natal chart readings, brutally honest and personal. Free tools, no subscription, no sugarcoating.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
  other: {
    "p:domain_verify": "9a982818b27e22b6271edf3d746d99ce",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body
        className="min-h-full bg-[#09090f] text-[#e8e4f0]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {children}
        <SiteFooter />
        <Analytics />
      </body>
    </html>
  );
}