import SunSignPage, { getSignPage, buildMetadata } from "@/components/SunSignPage";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const page = getSignPage("sun-in-taurus");
if (!page) throw new Error("Missing data for sun-in-taurus");

export const metadata: Metadata = buildMetadata(page);

export default function Page() {
  const p = getSignPage("sun-in-taurus");
  if (!p) return notFound();
  return <SunSignPage page={p} />;
}
