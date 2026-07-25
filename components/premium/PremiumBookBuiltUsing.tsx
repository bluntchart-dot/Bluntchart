"use client";

/**
 * The small "Built Using" trust card that appears at the end of every
 * AI chapter. Populated by lib/premium/built-using.ts from the real
 * chart. The AI never produces this.
 */

import type { BuiltUsingItem } from "@/lib/premium/types";

export default function PremiumBookBuiltUsing({
  items,
}: {
  items: readonly BuiltUsingItem[];
}) {
  if (!items || items.length === 0) return null;

  return (
    <div className="mt-14 pt-8 border-t border-white/8">
      <div className="text-[10px] uppercase tracking-[0.22em] text-white/40 mb-5 flex items-center gap-2">
        <span className="text-[#f0b84a]">✨</span>
        <span>Why we&apos;re saying this</span>
      </div>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li
            key={`${item.label}-${i}`}
            className="flex items-start gap-3 text-sm leading-relaxed"
          >
            <span
              className="w-6 shrink-0 text-center text-base text-[#c4a8ff] font-medium"
              aria-hidden
            >
              {item.symbol}
            </span>
            <span className="flex-1">
              <span className="text-[#e8e4f0] font-medium">{item.label}</span>
              <span className="block text-white/55 text-[13px] mt-0.5">
                {item.meaning}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
