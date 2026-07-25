"use client";

/**
 * One-click PDF download button. Dynamic-imports @react-pdf/renderer +
 * PremiumBookPDF only when the reader actually clicks, so these libraries
 * never land in the initial book bundle.
 *
 * The natal chart is drawn as a native react-pdf SVG (see
 * PdfChartWheel.tsx) so we don't depend on the browser DOM or on
 * html2canvas — the wheel always renders, regardless of which page the
 * user was on when they clicked.
 */

import { useState } from "react";
import type { PremiumReading } from "@/lib/premium/types";

function filenameFor(reading: PremiumReading): string {
  const safeName = (reading.meta.name || "Reader")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "reader";
  return `bluntchart-${safeName}.pdf`;
}

export default function PremiumBookPDFButton({ reading }: { reading: PremiumReading }) {
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    if (busy) return;
    setBusy(true);
    try {
      const [{ pdf }, { default: PremiumBookPDF }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./PremiumBookPDF"),
      ]);
      const blob = await pdf(<PremiumBookPDF reading={reading} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filenameFor(reading);
      document.body.appendChild(a);
      a.click();
      a.remove();
      // Revoke on next tick — Safari needs the URL alive during the click.
      setTimeout(() => URL.revokeObjectURL(url), 2_000);
    } catch (err) {
      console.error("[premium-pdf] download failed:", err);
      alert("Could not generate the PDF. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label="Download PDF"
    >
      {busy ? "Preparing…" : "Download PDF"}
    </button>
  );
}
