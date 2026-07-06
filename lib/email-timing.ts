export const DELAY_MS = {
  preview: 30 * 60_000,
  abandonedOne: 24 * 3_600_000,
  abandonedTwo: 72 * 3_600_000,
  shareReminderOne: 24 * 3_600_000,
  shareReminderTwo: 96 * 3_600_000,
} as const;

export const scheduledIso = (ms: number) => new Date(Date.now() + ms).toISOString();
