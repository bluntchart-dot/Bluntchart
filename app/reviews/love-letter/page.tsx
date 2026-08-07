import type { Metadata } from "next";
import ReviewClient from "./ReviewClient";

export const metadata: Metadata = {
  title: "Review Your Love Letter — BluntChart",
  description:
    "Tell us what your future husband's letter made you feel. Leave a review for the Future Love Letter experience.",
};

export default function ReviewPage() {
  return <ReviewClient />;
}
