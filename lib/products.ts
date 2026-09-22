import type { ProductType } from "./db/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bluntchart.com";

export interface ProductConfig {
  type: ProductType;
  gumroadPermalink: string;
  gumroadCheckoutUrl: string;
  priceDollars: string;
  priceCents: number;
  accessPath: string;
  /** Whether this product has a live purchase flow (form → checkout → webhook → delivery). */
  hasCheckoutFlow: boolean;
}

const PRODUCTS: Record<string, ProductConfig> = {
  reading: {
    type: "reading",
    gumroadPermalink: "bluntchart-reading",
    gumroadCheckoutUrl:
      process.env.NEXT_PUBLIC_GUMROAD_CHECKOUT_URL ??
      "https://bluntchart.gumroad.com/l/bluntchart-reading",
    priceDollars: "15",
    priceCents: 1500,
    accessPath: "/my-reading",
    hasCheckoutFlow: true,
  },
  "birth-chart-book": {
    type: "birth-chart-book",
    gumroadPermalink: "in-depth-birthchart",
    gumroadCheckoutUrl:
      "https://bluntchart.gumroad.com/l/in-depth-birthchart",
    priceDollars: "24",
    priceCents: 2400,
    accessPath: "/my-book",
    hasCheckoutFlow: true,
  },
  "in-depth-reading": {
    type: "in-depth-reading",
    gumroadPermalink: "in-depth-birthchart",
    gumroadCheckoutUrl:
      "https://bluntchart.gumroad.com/l/in-depth-birthchart",
    priceDollars: "24",
    priceCents: 2400,
    accessPath: "/in-depth-readings",
    hasCheckoutFlow: true,
  },
  "future-love-letter": {
    type: "future-love-letter",
    gumroadPermalink: "wfuvtd",
    gumroadCheckoutUrl:
      "https://bluntchart.gumroad.com/l/wfuvtd",
    priceDollars: "4.99",
    priceCents: 499,
    accessPath: "/my-love-letter",
    hasCheckoutFlow: true,
  },
  compatibility: {
    type: "compatibility",
    gumroadPermalink: "",
    gumroadCheckoutUrl: "",
    priceDollars: "0",
    priceCents: 0,
    accessPath: "/my-reading",
    hasCheckoutFlow: false,
  },
  transit: {
    type: "transit",
    gumroadPermalink: "",
    gumroadCheckoutUrl: "",
    priceDollars: "0",
    priceCents: 0,
    accessPath: "/my-reading",
    hasCheckoutFlow: false,
  },
  "brutally-honest-reading": {
    type: "brutally-honest-reading", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "4.99", priceCents: 499, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "love-reading": {
    type: "love-reading", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "3.99", priceCents: 399, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "career-reading": {
    type: "career-reading", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "5.99", priceCents: 599, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "shadow-reading": {
    type: "shadow-reading", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "4.99", priceCents: 499, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "money-reading": {
    type: "money-reading", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "4.99", priceCents: 499, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "moon-reading": {
    type: "moon-reading", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "4.99", priceCents: 499, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "saturn-return": {
    type: "saturn-return", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "4.99", priceCents: 499, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "year-ahead": {
    type: "year-ahead", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "7.99", priceCents: 799, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "gift-reading": {
    type: "gift-reading", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "3.99", priceCents: 399, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "three-card-tarot": {
    type: "three-card-tarot", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "3.99", priceCents: 399, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "yes-no-tarot": {
    type: "yes-no-tarot", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "1.99", priceCents: 199, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "daily-tarot": {
    type: "daily-tarot", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "1.99", priceCents: 199, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "monthly-transit": {
    type: "monthly-transit", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "4.99", priceCents: 499, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "soulmate-reading": {
    type: "soulmate-reading", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "5.99", priceCents: 599, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "hidden-feelings": {
    type: "hidden-feelings", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "4.99", priceCents: 499, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "ex-love-reading": {
    type: "ex-love-reading", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "4.99", priceCents: 499, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "blunt-love": {
    type: "blunt-love", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "4.99", priceCents: 499, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "blunt-career": {
    type: "blunt-career", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "4.99", priceCents: 499, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "big-three-mini": {
    type: "big-three-mini", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "3.99", priceCents: 399, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "life-purpose": {
    type: "life-purpose", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "5.99", priceCents: 599, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "personality-decoded": {
    type: "personality-decoded", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "4.99", priceCents: 499, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "blind-reading": {
    type: "blind-reading", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "3.99", priceCents: 399, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
  "situationship-reality-check": {
    type: "situationship-reality-check", gumroadPermalink: "", gumroadCheckoutUrl: "",
    priceDollars: "4.99", priceCents: 499, accessPath: "/my-reading", hasCheckoutFlow: false,
  },
};

export function getProduct(type: ProductType): ProductConfig {
  return PRODUCTS[type];
}

export function getProductOrNull(type: string | null | undefined): ProductConfig | null {
  if (!type) return null;
  return PRODUCTS[type] ?? null;
}

export function isKnownProduct(type: string | null | undefined): type is ProductType {
  return typeof type === "string" && type in PRODUCTS;
}

export function detectProductByPermalink(permalink: string): ProductConfig | null {
  if (!permalink) return null;
  for (const config of Object.values(PRODUCTS)) {
    if (config.gumroadPermalink && permalink.includes(config.gumroadPermalink)) {
      return config;
    }
  }
  return null;
}

export function accessUrl(accessToken: string, type: ProductType): string {
  const product = getProduct(type);
  return `${SITE_URL}${product.accessPath}?token=${encodeURIComponent(accessToken)}`;
}

export function buildCheckoutUrl(
  type: ProductType,
  params: { email: string; sessionId: string }
): string {
  const product = getProduct(type);
  const url = new URL(product.gumroadCheckoutUrl);
  url.searchParams.set("wanted", "true");
  const email = params.email.trim().toLowerCase();
  if (email) url.searchParams.set("email", email);
  url.searchParams.set("custom_fields[session_id]", params.sessionId);
  url.searchParams.set("session_id", params.sessionId);
  const returnUrl = `${SITE_URL}/checkout/complete?session_id=${encodeURIComponent(params.sessionId)}`;
  url.searchParams.set("redirect_url", returnUrl);
  url.searchParams.set("return_url", returnUrl);
  return url.toString();
}
