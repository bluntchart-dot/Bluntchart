import type { Metadata } from "next";
import ReviewsHub from "./ReviewsHub";

export const metadata: Metadata = {
  title: "Reviews — BluntChart",
  description: "See what people are saying about BluntChart's astrology readings and tools.",
  openGraph: {
    title: "Reviews — BluntChart",
    description: "See what people are saying about BluntChart's astrology readings and tools.",
    url: "https://bluntchart.com/reviews",
    siteName: "BluntChart",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BluntChart Reviews" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Reviews — BluntChart",
    description: "See what people are saying about BluntChart's astrology readings and tools.",
  },
  alternates: { canonical: "https://bluntchart.com/reviews" },
};

export default function ReviewsPage() {
  return <ReviewsHub />;
}
