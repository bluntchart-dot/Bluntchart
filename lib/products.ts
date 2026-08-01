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
