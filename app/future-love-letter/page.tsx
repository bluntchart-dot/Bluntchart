import type { Metadata } from "next";
import FutureLoveLetterClient from "./FutureLoveLetterClient";

export const metadata: Metadata = {
  title: "Love Letter From Your Future Husband | BluntChart",
  description:
    "What would your future husband say if he could write to you today? Get a personalized love letter inspired by your birth chart, love patterns and relationship needs.",
  openGraph: {
    title: "Love Letter From Your Future Husband | BluntChart",
    description:
      "What would your future husband say if he could write to you today? Get a personalized love letter inspired by your birth chart, love patterns and relationship needs.",
    url: "https://bluntchart.com/future-love-letter",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Love Letter From Your Future Husband | BluntChart",
    description:
      "What would your future husband say if he could write to you today? Get a personalized love letter inspired by your birth chart, love patterns and relationship needs.",
  },
  alternates: {
    canonical: "https://bluntchart.com/future-love-letter",
  },
};

export default function FutureLoveLetterPage() {
  return <FutureLoveLetterClient />;
}
