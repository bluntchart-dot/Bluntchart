/**
 * Maps tarot card IDs to their image paths.
 * Images: Rider-Waite-Smith (1909, Pamela Colman Smith) — public domain.
 * Source: Wikimedia Commons, "Rider-Waite-Smith tarot deck (Geldard)" set.
 */

export function getCardImagePath(cardId: string): string {
  return `/tarot/${cardId}.png`;
}
