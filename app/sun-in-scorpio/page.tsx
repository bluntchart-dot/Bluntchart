import SunSignPage, { getSignPage, buildMetadata } from "@/components/SunSignPage";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const page = getSignPage("sun-in-scorpio");
if (!page) throw new Error("Missing data for sun-in-scorpio");

export const metadata: Metadata = buildMetadata(page);

export default function Page() {
  const p = getSignPage("sun-in-scorpio");
  if (!p) return notFound();
  return <SunSignPage page={p} />;
}
