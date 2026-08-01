export const DELAY_MS = {
  // Reading product
  preview: 30 * 60_000,
  abandonedOne: 24 * 3_600_000,
  abandonedTwo: 72 * 3_600_000,
  shareReminderOne: 24 * 3_600_000,
  shareReminderTwo: 96 * 3_600_000,
  // Book product — abandoned cart
  bookAbandonedPreview: 5 * 60_000,
  bookAbandonedOne: 24 * 3_600_000,
  bookAbandonedTwo: 3 * 24 * 3_600_000,
  bookAbandonedThree: 7 * 24 * 3_600_000,
  // Book product — post-delivery engagement
  bookReview: 2 * 24 * 3_600_000,
  bookSocialProof: 5 * 24 * 3_600_000,
} as const;

export const scheduledIso = (ms: number) => new Date(Date.now() + ms).toISOString();
