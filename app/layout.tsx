import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BluntChart",
  description: "Honest astrology readings based on your real birth chart.",

  openGraph: {
    title: "BluntChart",
    description:
      "Specific, honest chart readings about your patterns, relationships and strengths.",
    url: "https://bluntchart.com",
    siteName: "BluntChart",
    images: [
      {
        url: "https://bluntchart.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "BluntChart",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "BluntChart",
    description: "Honest astrology readings based on your real birth chart.",
    images: ["https://bluntchart.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
