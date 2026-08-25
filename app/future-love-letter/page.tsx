import type { Metadata } from "next";
import FutureLoveLetterClient from "./FutureLoveLetterClient";

export const metadata: Metadata = {
  title: "Love Letter From Your Future Husband | BluntChart",
  description:
    "A personalized love letter written from the person your chart says you're waiting for. Built from your Venus, Moon, and 7th house — not a template.",
  openGraph: {
    title: "Love Letter From Your Future Husband | BluntChart",
    description:
      "A personalized love letter written from the person your chart says you're waiting for. Built from your Venus, Moon, and 7th house — not a template.",
    url: "https://bluntchart.com/future-love-letter",
    siteName: "BluntChart",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Love Letter From Your Future Husband | BluntChart",
    description:
      "A personalized love letter written from the person your chart says you're waiting for. Built from your Venus, Moon, and 7th house — not a template.",
  },
  alternates: {
    canonical: "https://bluntchart.com/future-love-letter",
  },
};

export default function FutureLoveLetterPage() {
  return <FutureLoveLetterClient />;
}
