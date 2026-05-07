'use client';

import { useRef, useState } from 'react';

interface Props {
  name: string;
  signLine: string;
  cardLines: string[];
  cardClosing: string;
}

export default function ShareCard({
  name,
  signLine,
  cardLines,
  cardClosing,
}: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  const [downloading, setDownloading] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  async function downloadCard() {
    if (!cardRef.current) return;

    setDownloading(true);

    try {
      const { default: html2canvas } =
        await import('html2canvas');

      const canvas = await html2canvas(
        cardRef.current,
        {
          scale: 3,
          backgroundColor: '#09090f',
          logging: false,
          useCORS: true,
        }
      );

      const link =
        document.createElement('a');

      link.download = `bluntchart-${name
        .toLowerCase()
        .replace(/\s+/g, '-')}.png`;

      link.href =
        canvas.toDataURL('image/png');

      link.click();
    } catch (e) {
      console.error(e);

      alert(
        'Download failed. Try right-clicking the card and saving the image.'
      );
    } finally {
      setDownloading(false);
    }
  }

  function copyLink() {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      });
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      {/* Card */}
      <div
        ref={cardRef}
        className="relative overflow-hidden rounded-2xl bg-[#09090f] p-8"
        style={{
          background:
            'linear-gradient(135deg, #0d0b14 0%, #09090f 50%, #0f0d18 100%)',
          border:
            '1px solid rgba(191,150,96,0.25)',
        }}
      >
        {/* Corner accents */}
        {[
          'top-4 left-4 border-t border-l',
          'top-4 right-4 border-t border-r',
          'bottom-4 left-4 border-b border-l',
          'bottom-4 right-4 border-b border-r',
        ].map((cls, i) => (
          <div
            key={i}
            className={`absolute h-5 w-5 ${cls} border-amber-600/40`}
          />
        ))}

        {/* Glyph */}
        <div className="mb-4 text-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            className="mx-auto opacity-60"
          >
            <circle
              cx="14"
              cy="14"
              r="12"
              fill="none"
              stroke="#bf9660"
              strokeWidth="1"
            />

            <circle
              cx="14"
              cy="14"
              r="6"
              fill="none"
              stroke="#bf9660"
              strokeWidth="0.7"
            />

            <line
              x1="2"
              y1="14"
              x2="26"
              y2="14"
              stroke="#bf9660"
              strokeWidth="0.7"
            />

            <line
              x1="14"
              y1="2"
              x2="14"
              y2="26"
              stroke="#bf9660"
              strokeWidth="0.7"
            />
          </svg>
        </div>

        {/* Name */}
        <h2
          className="mb-1 text-center text-3xl text-amber-400"
          style={{
            fontFamily:
              'Georgia, serif',
            letterSpacing:
              '0.02em',
          }}
        >
          {name}
        </h2>

        {/* Sign line */}
        <p
          className="mb-5 text-center text-xs tracking-wider text-white/35"
          style={{
            fontStyle: 'italic',
          }}
        >
          {signLine}
        </p>

        {/* Divider */}
        <div className="mb-5 border-t border-amber-600/15" />

        {/* Lines */}
        <div className="mb-5 space-y-3">
          {cardLines.map(
            (line, i) => (
              <p
                key={i}
                className="text-center text-sm leading-relaxed text-white/85"
                style={{
                  fontFamily:
                    'Georgia, serif',
                }}
              >
                {line}
              </p>
            )
          )}
        </div>

        {/* Closing */}
        <div className="border-t border-amber-600/15 pt-4">
          <p className="text-center text-xs italic text-amber-500/70">
            {cardClosing}
          </p>
        </div>

        {/* Brand */}
        <p
          className="mt-4 text-center text-xs uppercase tracking-widest text-white/20"
          style={{
            fontSize: '10px',
          }}
        >
          bluntchart.com
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={downloadCard}
          disabled={downloading}
          className="flex-1 rounded-lg bg-amber-600 py-3 text-sm font-medium text-black transition-all hover:bg-amber-500 disabled:opacity-50"
        >
          {downloading
            ? 'Saving...'
            : '⬇ Download Card'}
        </button>

        <button
          onClick={copyLink}
          className="flex-1 rounded-lg border border-white/10 bg-white/8 py-3 text-sm font-medium text-white/70 transition-all hover:bg-white/12"
        >
          {copied
            ? '✓ Copied!'
            : '🔗 Copy Link'}
        </button>
      </div>
    </div>
  );
}