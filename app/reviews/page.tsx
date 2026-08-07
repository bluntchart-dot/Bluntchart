import type { Metadata } from "next";
import ReviewsHub from "./ReviewsHub";

export const metadata: Metadata = {
  title: "Reviews — BluntChart",
  description: "See what people are saying about BluntChart's astrology readings and tools.",
};

export default function ReviewsPage() {
  return <ReviewsHub />;
}
