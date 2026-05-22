"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/* ─── Types ─────────────────────────────────────────────────────────────── */

export interface SelectedLocation {
  displayName: string;
  shortName: string;
  lat: number;
  lng: number;
}

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    state?: string;
    country?: string;
  };
}

interface Props {
  value: string;
  onChange: (location: SelectedLocation | null, rawText: string) => void;
  placeholder?: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function buildShortName(result: NominatimResult): string {
  const addr = result.address;
  if (!addr) {
    const parts = result.display_name.split(",").map((s) => s.trim());
    if (parts.length >= 2) return `${parts[0]}, ${parts[parts.length - 1]}`;
    return result.display_name;
  }
  const city = addr.city || addr.town || addr.village || "";
  const state = addr.state || addr.county || "";
  const country = addr.country || "";
  if (city && country) return `${city}, ${state ? state + ", " : ""}${country}`;
  if (city) return city;
  return result.display_name.split(",").slice(0, 2).join(",").trim();
}

/* ─── Inline styles matching BluntChart form ─────────────────────────────── */

const inputBase: React.CSSProperties = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  borderWidth: "0.5px",
  borderStyle: "solid",
  borderColor: "rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "13px 14px",
  fontSize: 14,
  color: "#e8e4f0",
  fontFamily: "inherit",
  outline: "none",
};

const inputStyle = inputBase;

const inputFocusedStyle: React.CSSProperties = {
  ...inputBase,
  borderColor: "rgba(236,72,153,0.6)",
};

const inputSelectedStyle: React.CSSProperties = {
  ...inputBase,
  borderColor: "rgba(93,202,165,0.4)",
};

const dropdownStyle: React.CSSProperties = {
  position: "absolute",
  zIndex: 50,
  width: "100%",
  marginTop: 6,
  borderRadius: 14,
  border: "0.5px solid rgba(255,255,255,0.1)",
  background: "#111118",
  boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
  overflow: "hidden",
  maxHeight: 320,
  overflowY: "auto",
};

const itemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 12,
  padding: "14px 18px",
  borderTop: "none",
  borderLeft: "none",
  borderRight: "none",
  borderBottom: "0.5px solid rgba(255,255,255,0.05)",
  cursor: "pointer",
  transition: "background 0.15s",
  textAlign: "left",
  width: "100%",
  background: "transparent",
  fontFamily: "inherit",
  color: "inherit",
};

const itemHoverStyle: React.CSSProperties = {
  ...itemStyle,
  background: "rgba(107,47,212,0.12)",
};

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function LocationPicker({
  value,
  onChange,
  placeholder = "Start typing your birth city…",
}: Props) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(-1);
  const [hasSelected, setHasSelected] = useState(!!value);
  const [isFocused, setIsFocused] = useState(false);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ── Search Nominatim with debounce ── */
  const searchPlaces = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);

    try {
      const url = new URL("https://nominatim.openstreetmap.org/search");
      url.searchParams.set("q", q);
      url.searchParams.set("format", "json");
      url.searchParams.set("limit", "6");
      url.searchParams.set("addressdetails", "1");

      const res = await fetch(url.toString(), {
        headers: { "Accept-Language": "en" },
      });

      if (!res.ok) throw new Error("Nominatim request failed");

      const data: NominatimResult[] = await res.json();
      setResults(data);
      setIsOpen(data.length > 0);
      setHighlightIdx(-1);
    } catch (err) {
      console.error("[LocationPicker] search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Handle typing ── */
  function handleInput(text: string) {
    setQuery(text);
    setHasSelected(false);
    onChange(null, text);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      searchPlaces(text);
    }, 400);
  }

  /* ── Handle selection ── */
  function handleSelect(result: NominatimResult) {
    const location: SelectedLocation = {
      displayName: result.display_name,
      shortName: buildShortName(result),
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
    };

    setQuery(location.shortName);
    setHasSelected(true);
    setIsOpen(false);
    setResults([]);
    onChange(location, location.shortName);
  }

  /* ── Keyboard navigation ── */
  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIdx((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIdx((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && highlightIdx >= 0) {
      e.preventDefault();
      handleSelect(results[highlightIdx]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  /* ── Close on outside click ── */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ── Cleanup debounce ── */
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const currentInputStyle = hasSelected
    ? inputSelectedStyle
    : isFocused
      ? inputFocusedStyle
      : inputStyle;

  return (
    <div ref={wrapperRef} style={{ position: "relative" }}>
      {/* Input */}
      <div style={{ position: "relative" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            if (results.length > 0 && !hasSelected) setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoComplete="off"
          style={currentInputStyle}
        />

        {/* Status indicators */}
        <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 6 }}>
          {loading && (
            <div style={{
              width: 16, height: 16,
              border: "2px solid rgba(107,47,212,0.3)",
              borderTopColor: "#6b2fd4",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
          )}
          {hasSelected && !loading && (
            <span style={{ color: "#5dcaa5", fontSize: 14, fontWeight: 700 }}>✓</span>
          )}
        </div>
      </div>

      {/* Selected confirmation */}
      {hasSelected && query && (
        <p style={{ marginTop: 4, fontSize: 11, color: "rgba(93,202,165,0.5)", letterSpacing: "0.5px" }}>
          ✓ Location locked — coordinates saved for your chart
        </p>
      )}

      {/* Dropdown */}
      {isOpen && results.length > 0 && (
        <div style={dropdownStyle}>
          {results.map((result, idx) => {
            const short = buildShortName(result);
            const detail = result.display_name;

            return (
              <button
                key={result.place_id}
                type="button"
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setHighlightIdx(idx)}
                style={idx === highlightIdx ? itemHoverStyle : itemStyle}
              >
                {/* Pin icon */}
                <span style={{ flexShrink: 0, marginTop: 2, opacity: 0.4, fontSize: 14 }}>📍</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#e8e4f0", marginBottom: 3 }}>
                    {short}
                  </div>
                  <div style={{
                    fontSize: 11, color: "#6b6585", lineHeight: 1.4,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {detail}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Attribution */}
          <div style={{ padding: "8px 18px", fontSize: 9, color: "rgba(107,101,133,0.4)", background: "rgba(255,255,255,0.02)" }}>
            Powered by OpenStreetMap
          </div>
        </div>
      )}

      {/* No results */}
      {isOpen && results.length === 0 && !loading && query.length >= 2 && (
        <div style={{
          ...dropdownStyle,
          padding: "16px 18px",
          maxHeight: "none",
        }}>
          <p style={{ fontSize: 13, color: "#6b6585", margin: 0 }}>
            No places found for &ldquo;{query}&rdquo;
          </p>
          <p style={{ fontSize: 11, color: "rgba(107,101,133,0.5)", marginTop: 6 }}>
            Try a nearby city or add the country name
          </p>
        </div>
      )}

      {/* Spinner animation */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}