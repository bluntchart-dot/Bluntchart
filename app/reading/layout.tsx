import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Birth Chart Reading: The Honest One | BluntChart",
  description:
    "Your real natal chart, read in plain language with nothing softened. Around 1,500 words specific to your placements, delivered in ten minutes.",
  openGraph: {
    title: "Birth Chart Reading: The Honest One | BluntChart",
    description:
      "Your real natal chart, read in plain language with nothing softened. Around 1,500 words specific to your placements.",
    url: "https://bluntchart.com/reading",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Birth Chart Reading: The Honest One | BluntChart",
    description:
      "Your real natal chart, read in plain language with nothing softened. Around 1,500 words specific to your placements.",
  },
  alternates: { canonical: "https://bluntchart.com/reading" },
};

export default function ReadingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
