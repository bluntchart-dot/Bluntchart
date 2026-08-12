import SunSignPage, { getSignPage, buildMetadata } from "@/components/SunSignPage";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const page = getSignPage("sun-in-pisces");
if (!page) throw new Error("Missing data for sun-in-pisces");

export const metadata: Metadata = buildMetadata(page);

export default function Page() {
  const p = getSignPage("sun-in-pisces");
  if (!p) return notFound();
  return <SunSignPage page={p} />;
}
