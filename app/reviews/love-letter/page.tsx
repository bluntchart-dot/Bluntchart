import type { Metadata } from "next";
import ReviewClient from "./ReviewClient";

export const metadata: Metadata = {
  title: "Review Your Love Letter — BluntChart",
  description:
    "Tell us what your future husband's letter made you feel. Leave a review for the Future Love Letter experience.",
  openGraph: {
    title: "Review Your Love Letter — BluntChart",
    description: "Tell us what your future husband's letter made you feel. Leave a review for the Future Love Letter experience.",
    url: "https://bluntchart.com/reviews/love-letter",
    siteName: "BluntChart",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BluntChart Love Letter Review" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Review Your Love Letter — BluntChart",
    description: "Tell us what your future husband's letter made you feel.",
  },
  alternates: { canonical: "https://bluntchart.com/reviews/love-letter" },
};

export default function ReviewPage() {
  return <ReviewClient />;
}
