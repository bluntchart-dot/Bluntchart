/**
 * lib/etsy/order-parser.ts
 *
 * Extracts structured birth data from Etsy personalization fields.
 * Etsy personalization is free-text, so customers type dates in
 * inconsistent formats. This parser handles the common ones.
 */

import type { EtsyReceipt, EtsyTransaction, EtsyVariation } from "./client";
import { productFromListingId, guessProductFromTitle, resolveListingId, guessBundleFromTitle, type ListingResolution } from "./listing-map";
import { getBundleProducts } from "@/lib/pipeline/bundles";
import type { ReadingProduct } from "@/lib/premium/types";

/* ═════════════════════════════════════════════════════════════════
   TYPES
═════════════════════════════════════════════════════════════════ */

export interface ParsedEtsyOrder {
  receiptId: number;
  buyerEmail: string;
  buyerUserId: number;
  product: ReadingProduct;
  listingId: number;
  amountCents: number;
  birthData: ParsedBirthData | null;
  missingFields: string[];
  rawPersonalization: Record<string, string>;
  bundleId?: string;
}

export interface ParsedEtsyBundle {
  receiptId: number;
  buyerEmail: string;
  buyerUserId: number;
  bundleId: string;
  products: readonly ReadingProduct[];
  listingId: number;
  amountCents: number;
  birthData: ParsedBirthData | null;
  missingFields: string[];
  rawPersonalization: Record<string, string>;
}

export type ParsedEtsyResult =
  | { type: "single"; order: ParsedEtsyOrder }
  | { type: "bundle"; bundle: ParsedEtsyBundle };

export interface ParsedBirthData {
  name: string;
  dob: string;
  birth_time: string;
  birth_place: string;
  focus_area?: string;
}

/* ═════════════════════════════════════════════════════════════════
   DATE PARSING
   Handles: "March 15 1992", "03/15/1992", "15-03-1992",
   "1992.03.15", "3/15/92", "15 March 1992", etc.
═════════════════════════════════════════════════════════════════ */

const MONTHS: Record<string, string> = {
  january: "01", february: "02", march: "03", april: "04",
  may: "05", june: "06", july: "07", august: "08",
  september: "09", october: "10", november: "11", december: "12",
  jan: "01", feb: "02", mar: "03", apr: "04",
  jun: "06", jul: "07", aug: "08", sep: "09", sept: "09",
  oct: "10", nov: "11", dec: "12",
};

function normalizeYear(y: string): string {
  if (y.length === 4) return y;
  const num = parseInt(y, 10);
  return num > 30 ? `19${y.padStart(2, "0")}` : `20${y.padStart(2, "0")}`;
}

function pad2(n: number | string): string {
  return String(n).padStart(2, "0");
}

export function parseDate(raw: string): string | null {
  const s = raw.trim();
  if (!s) return null;

  // YYYY-MM-DD (already correct)
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // "Month DD, YYYY" or "Month DD YYYY"
  const monthFirst = s.match(/^([a-z]+)\s+(\d{1,2}),?\s+(\d{2,4})$/i);
  if (monthFirst) {
    const mm = MONTHS[monthFirst[1].toLowerCase()];
    if (mm) return `${normalizeYear(monthFirst[3])}-${mm}-${pad2(monthFirst[2])}`;
  }

  // "DD Month YYYY"
  const dayFirst = s.match(/^(\d{1,2})\s+([a-z]+),?\s+(\d{2,4})$/i);
  if (dayFirst) {
    const mm = MONTHS[dayFirst[2].toLowerCase()];
    if (mm) return `${normalizeYear(dayFirst[3])}-${mm}-${pad2(dayFirst[1])}`;
  }

  // MM/DD/YYYY, MM-DD-YYYY, MM.DD.YYYY
  const slashed = s.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})$/);
  if (slashed) {
    const a = parseInt(slashed[1], 10);
    const b = parseInt(slashed[2], 10);
    const y = normalizeYear(slashed[3]);

    // If first number > 12, assume DD/MM/YYYY (European)
    if (a > 12 && b <= 12) {
      return `${y}-${pad2(b)}-${pad2(a)}`;
    }
    // Otherwise assume MM/DD/YYYY (US)
    return `${y}-${pad2(a)}-${pad2(b)}`;
  }

  // YYYY.MM.DD or YYYY/MM/DD
  const isoLike = s.match(/^(\d{4})[/\-.](\d{1,2})[/\-.](\d{1,2})$/);
  if (isoLike) {
    return `${isoLike[1]}-${pad2(isoLike[2])}-${pad2(isoLike[3])}`;
  }

  return null;
}

/* ═════════════════════════════════════════════════════════════════
   TIME PARSING
   Handles: "2:30 PM", "14:30", "2:30pm", "2.30 PM",
   "afternoon", "morning", "unknown"
═════════════════════════════════════════════════════════════════ */

export function parseTime(raw: string): string | null {
  const s = raw.trim().toLowerCase();
  if (!s) return null;

  // Already HH:mm
  if (/^\d{2}:\d{2}$/.test(s)) return s;

  // 12-hour: "2:30 PM", "2:30pm", "2.30 pm", "2:30 am"
  const twelve = s.match(/^(\d{1,2})[:\.](\d{2})\s*(am|pm)$/i);
  if (twelve) {
    let h = parseInt(twelve[1], 10);
    const m = parseInt(twelve[2], 10);
    const ampm = twelve[3].toLowerCase();
    if (ampm === "pm" && h < 12) h += 12;
    if (ampm === "am" && h === 12) h = 0;
    return `${pad2(h)}:${pad2(m)}`;
  }

  // Just hour: "2pm", "2 pm", "14"
  const hourOnly = s.match(/^(\d{1,2})\s*(am|pm)?$/i);
  if (hourOnly) {
    let h = parseInt(hourOnly[1], 10);
    const ampm = (hourOnly[2] ?? "").toLowerCase();
    if (ampm === "pm" && h < 12) h += 12;
    if (ampm === "am" && h === 12) h = 0;
    if (h >= 0 && h <= 23) return `${pad2(h)}:00`;
  }

  // Approximate words
  if (s.includes("morning") || s.includes("sunrise")) return "08:00";
  if (s.includes("noon") || s.includes("midday")) return "12:00";
  if (s.includes("afternoon")) return "15:00";
  if (s.includes("evening") || s.includes("sunset")) return "18:00";
  if (s.includes("night") || s.includes("midnight")) return "00:00";

  // Unknown / don't know — treat as missing, not silently default to noon.
  // The caller will add "time of birth" to missingFields, which triggers
  // an Etsy message asking the buyer for their actual birth time.
  if (s.includes("unknown") || s.includes("don't know") || s.includes("not sure") || s.includes("idk")) {
    return null;
  }

  return null;
}

/* ═════════════════════════════════════════════════════════════════
   FIELD EXTRACTION FROM PERSONALIZATION
═════════════════════════════════════════════════════════════════ */

function extractFromVariations(
  variations: EtsyVariation[]
): Record<string, string> {
  const fields: Record<string, string> = {};

  for (const v of variations) {
    const label = v.formatted_name.toLowerCase().trim();
    const value = v.formatted_value.trim();

    if (label.includes("name") || label.includes("full name")) {
      fields.name = value;
    } else if (label.includes("date of birth") || label.includes("dob") || label.includes("birthday") || label.includes("birth date")) {
      fields.dob = value;
    } else if (label.includes("time of birth") || label.includes("birth time") || label.includes("time born")) {
      fields.birth_time = value;
    } else if (label.includes("city") || label.includes("place") || label.includes("born") || label.includes("location") || label.includes("birth place")) {
      if (!fields.birth_place) fields.birth_place = value;
    } else if (label.includes("focus") || label.includes("area") || label.includes("topic")) {
      fields.focus_area = value;
    }
  }

  return fields;
}

/* ═════════════════════════════════════════════════════════════════
   MAIN PARSER
═════════════════════════════════════════════════════════════════ */

export function parseEtsyOrder(receipt: EtsyReceipt): ParsedEtsyOrder | null {
  if (!receipt.transactions?.length) return null;

  const tx = receipt.transactions[0];
  const product = resolveProduct(tx);
  if (!product) return null;

  const rawFields = extractFromVariations(tx.variations ?? []);
  const missing: string[] = [];

  if (!rawFields.name) missing.push("name");
  if (!rawFields.dob) missing.push("date of birth");
  if (!rawFields.birth_time) missing.push("time of birth");
  if (!rawFields.birth_place) missing.push("city/country of birth");

  const priceCents = tx.price
    ? Math.round((tx.price.amount / tx.price.divisor) * 100)
    : 0;

  let birthData: ParsedBirthData | null = null;

  if (missing.length === 0) {
    const parsedDate = parseDate(rawFields.dob);
    const parsedTime = parseTime(rawFields.birth_time);

    if (!parsedDate) missing.push("date of birth (could not parse)");
    if (!parsedTime) missing.push("time of birth (could not parse)");

    if (parsedDate && parsedTime) {
      birthData = {
        name: rawFields.name,
        dob: parsedDate,
        birth_time: parsedTime,
        birth_place: rawFields.birth_place,
        focus_area: rawFields.focus_area,
      };
    }
  }

  return {
    receiptId: receipt.receipt_id,
    buyerEmail: receipt.buyer_email,
    buyerUserId: receipt.buyer_user_id,
    product,
    listingId: tx.listing_id,
    amountCents: priceCents,
    birthData,
    missingFields: missing,
    rawPersonalization: rawFields,
  };
}

function resolveProduct(tx: EtsyTransaction): ReadingProduct | null {
  return productFromListingId(tx.listing_id) ?? guessProductFromTitle(tx.title);
}

function resolveProductOrBundle(tx: EtsyTransaction): ListingResolution | null {
  const fromMap = resolveListingId(tx.listing_id);
  if (fromMap) return fromMap;
  const bundleId = guessBundleFromTitle(tx.title);
  if (bundleId) {
    const products = getBundleProducts(bundleId);
    if (products) return { type: "bundle", bundleId, products };
  }
  const product = guessProductFromTitle(tx.title);
  if (product) return { type: "product", product };
  return null;
}

export function parseEtsyOrderOrBundle(receipt: EtsyReceipt): ParsedEtsyResult | null {
  if (!receipt.transactions?.length) return null;
  const tx = receipt.transactions[0];
  const resolution = resolveProductOrBundle(tx);
  if (!resolution) return null;

  const rawFields = extractFromVariations(tx.variations ?? []);
  const missing: string[] = [];
  if (!rawFields.name) missing.push("name");
  if (!rawFields.dob) missing.push("date of birth");
  if (!rawFields.birth_time) missing.push("time of birth");
  if (!rawFields.birth_place) missing.push("city/country of birth");

  const priceCents = tx.price
    ? Math.round((tx.price.amount / tx.price.divisor) * 100)
    : 0;

  let birthData: ParsedBirthData | null = null;
  if (missing.length === 0) {
    const parsedDate = parseDate(rawFields.dob);
    const parsedTime = parseTime(rawFields.birth_time);
    if (!parsedDate) missing.push("date of birth (could not parse)");
    if (!parsedTime) missing.push("time of birth (could not parse)");
    if (parsedDate && parsedTime) {
      birthData = {
        name: rawFields.name,
        dob: parsedDate,
        birth_time: parsedTime,
        birth_place: rawFields.birth_place,
        focus_area: rawFields.focus_area,
      };
    }
  }

  if (resolution.type === "bundle") {
    return {
      type: "bundle",
      bundle: {
        receiptId: receipt.receipt_id,
        buyerEmail: receipt.buyer_email,
        buyerUserId: receipt.buyer_user_id,
        bundleId: resolution.bundleId,
        products: resolution.products,
        listingId: tx.listing_id,
        amountCents: priceCents,
        birthData,
        missingFields: missing,
        rawPersonalization: rawFields,
      },
    };
  }

  return {
    type: "single",
    order: {
      receiptId: receipt.receipt_id,
      buyerEmail: receipt.buyer_email,
      buyerUserId: receipt.buyer_user_id,
      product: resolution.product,
      listingId: tx.listing_id,
      amountCents: priceCents,
      birthData,
      missingFields: missing,
      rawPersonalization: rawFields,
    },
  };
}

/**
 * Builds a friendly Etsy message requesting missing birth details.
 */
export function buildMissingDataMessage(
  customerName: string | undefined,
  missing: string[]
): string {
  const greeting = customerName ? `Hi ${customerName}!` : "Hi there!";

  return `${greeting} Thank you so much for your order! 🙏

I need a few more details to create your personalized reading:

${missing.map((f) => `• ${f.charAt(0).toUpperCase() + f.slice(1)}`).join("\n")}

Please reply to this message with the missing details and I will get your reading to you as quickly as possible!

(For time of birth: if you are not sure, "morning", "afternoon", or "evening" works. If you really do not know, I will use noon as a default.)`;
}
