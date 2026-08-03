/**
 * lib/premium/insights/ledger.ts
 *
 * Book-level ledger tracking what has been used where. Consumed by the
 * scheduler and by the prompt-builder. Also read by QA to check for
 * banned-image reuse.
 */

import type { SectionId } from "@/lib/premium/types";

export class Ledger {
  private ownedBy = new Map<string, SectionId>();
  private referencedBy = new Map<string, Set<SectionId>>();
  private bannedImages = new Set<string>();

  markOwned(insightId: string, chapter: SectionId): void {
    if (!this.ownedBy.has(insightId)) {
      this.ownedBy.set(insightId, chapter);
    }
  }

  markReferenced(insightId: string, chapter: SectionId): void {
    let set = this.referencedBy.get(insightId);
    if (!set) {
      set = new Set();
      this.referencedBy.set(insightId, set);
    }
    set.add(chapter);
  }

  isOwned(insightId: string): boolean {
    return this.ownedBy.has(insightId);
  }

  ownerOf(insightId: string): SectionId | undefined {
    return this.ownedBy.get(insightId);
  }

  banImage(image: string): void {
    this.bannedImages.add(image.toLowerCase().trim());
  }

  bannedImagesForChapter(_chapter: SectionId): string[] {
    // Currently ban-list is book-global. We keep the per-chapter signature
    // so we can differentiate later without changing callers.
    return Array.from(this.bannedImages);
  }

  snapshot(): {
    ownedBy: Record<string, SectionId>;
    referencedBy: Record<string, SectionId[]>;
    bannedImages: string[];
  } {
    const ownedBy: Record<string, SectionId> = {};
    for (const [k, v] of this.ownedBy) ownedBy[k] = v;
    const referencedBy: Record<string, SectionId[]> = {};
    for (const [k, v] of this.referencedBy) referencedBy[k] = Array.from(v);
    return {
      ownedBy,
      referencedBy,
      bannedImages: Array.from(this.bannedImages),
    };
  }
}

/**
 * Small starter blacklist of images that have historically been over-used
 * by the model. The QA layer is the primary defence; this is a belt-and-
 * braces seed so the first generation of each book already avoids them.
 */
export function seedKnownBannedImages(ledger: Ledger): void {
  const seed = [
    "coffee", "mug", "the same cup", "latte",
    "11pm text", "unsent text", "unsent message", "notes app entry",
    "linkedin refresh", "instagram refresh",
  ];
  for (const image of seed) ledger.banImage(image);
}
