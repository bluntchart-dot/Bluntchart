/** Unescape model JSON newlines and trim reading fields for display. */
export function normalizeReadingCopy(text: string): string {
  return text
    .replace(/\\n\\n/g, "\n\n")
    .replace(/\\n/g, "\n")
    .trim();
}
