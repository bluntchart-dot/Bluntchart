"use client";

import { ReadingText } from "@/components/ReadingText";
import { normalizeReadingCopy } from "@/lib/normalize-reading-copy";

export interface PreviewInsight {
  planet: string;
  colorKey?: string;
  truth: string;
  explain?: string;
  action?: string;
}

const DOT_COLORS: Record<string, string> = {
  sun: "#F4C878",
  moon: "#C8B8EC",
  rising: "#B898EC",
  venus: "#EC96B4",
  mars: "#F0A87A",
  mercury: "#82DCBA",
  saturn: "#AAA4C8",
  jupiter: "#F0E09A",
};

function inferColorKey(planetOrTheme: string, index: number): string {
  const t = planetOrTheme.toLowerCase();
  for (const k of Object.keys(DOT_COLORS)) {
    if (t.includes(k)) return k;
  }
  return index === 0 ? "sun" : "moon";
}

export function PreviewReadingStage({
  fname,
  preview,
  letterOpener,
}: {
  fname: string;
  preview: PreviewInsight[];
  letterOpener?: string;
}) {
  const displayName = fname.trim() || "You";
  const beats = preview.slice(0, 2).map((ins, i) => ({
    ...ins,
    colorKey: ins.colorKey?.trim() || inferColorKey(ins.planet, i),
    truth: normalizeReadingCopy(ins.truth),
    explain: ins.explain ? normalizeReadingCopy(ins.explain) : "",
    action: ins.action?.trim() ?? "",
  }));

  return (
    <div className="preview-landscape">
      {letterOpener ? (
        <div className="preview-letter">
          <ReadingText text={normalizeReadingCopy(letterOpener)} />
        </div>
      ) : null}

      <header className="preview-header">
        <div>
          <p className="preview-eyebrow">Your chart · free preview</p>
          <h2 className="preview-name">{displayName}</h2>
        </div>
        <p className="preview-count">2 of 10 insights</p>
      </header>

      <div className="preview-grid">
        {beats.map((ins, i) => {
          const accent = DOT_COLORS[ins.colorKey] || "#EC96B4";
          const plainExplain = ins.explain.includes("In simple words:")
            ? ins.explain.split("In simple words:")[1]?.trim() ?? ins.explain
            : ins.explain;

          return (
            <article
              key={i}
              className="preview-panel"
              style={{ borderColor: `${accent}33` }}
            >
              <p className="preview-theme" style={{ color: accent }}>
                {ins.planet}
              </p>

              <div className="preview-truth">
                <ReadingText text={ins.truth} />
              </div>

              {plainExplain ? (
                <div className="preview-explain">
                  <span className="preview-explain-label">In simple words</span>
                  <ReadingText text={plainExplain} />
                </div>
              ) : null}

              {ins.action ? (
                <p className="preview-action">
                  <span>This week</span>
                  {ins.action}
                </p>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}
