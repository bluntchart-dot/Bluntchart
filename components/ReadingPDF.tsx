"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

interface PreviewInsight {
  planet?: string;
  hook?: string;
  truth?: string;
  reveal?: string;
}

interface PaidInsight {
  planet?: string;
  truth?: string;
  explain?: string;
  action?: string;
}

interface Props {
  name: string;
  letterOpener: string | null;
  preview: PreviewInsight[];
  paidInsights: PaidInsight[];
}

/* ── Palette ── */
const COVER_BG = "#0a0910";
const COVER_TEXT = "#efe9dc";
const COVER_DIM = "#7a736a";
const GOLD = "#f0b84a";
const PURPLE = "#7a5abf";
const PAGE_BG = "#ffffff";
const INK = "#1a1420";
const MUTED = "#5a5468";
const LIGHT_CARD = "#f5f2f8";
const RULE = "#d8d0e4";
const TAG_BG = "#ede8f5";

/* ── Life-area tags ── */
const SECTION_TAGS: Record<string, string> = {
  rising: "PERSONALITY",
  moon: "EMOTIONS",
  venus: "LOVE",
  mars: "DRIVE & AMBITION",
  mercury: "MIND",
  saturn: "CAREER & GROWTH",
  jupiter: "CONFIDENCE",
  "the full picture": "YOUR LIFE NOW",
  "your love pattern": "LOVE",
  "what is actually going on with your career": "CAREER",
  "your real relationship with money": "MONEY",
  "who you actually are": "IDENTITY & PURPOSE",
};

function getTag(planet: string): string | null {
  const lower = planet.toLowerCase();
  for (const [key, tag] of Object.entries(SECTION_TAGS)) {
    if (lower.includes(key)) return tag;
  }
  return null;
}

const s = StyleSheet.create({
  /* ── Cover page (dark) ── */
  cover: {
    padding: 0,
    backgroundColor: COVER_BG,
    color: COVER_TEXT,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  coverInner: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 56,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  coverBrand: {
    fontSize: 10,
    letterSpacing: 4,
    color: GOLD,
    fontFamily: "Helvetica-Bold",
  },
  coverTitle: {
    fontFamily: "Times-Bold",
    fontSize: 48,
    lineHeight: 1.15,
    color: "#f5c99e",
    letterSpacing: -1,
    textAlign: "center",
    marginTop: 44,
  },
  coverSubtitle: {
    fontFamily: "Times-Italic",
    fontSize: 13,
    lineHeight: 1.6,
    color: "#c4bdb2",
    textAlign: "center",
    marginTop: 20,
  },
  coverPreparedLabel: {
    fontSize: 9,
    letterSpacing: 3,
    color: COVER_DIM,
    fontFamily: "Helvetica-Bold",
    marginTop: 56,
  },
  coverName: {
    fontFamily: "Times-Roman",
    fontSize: 22,
    lineHeight: 1.2,
    color: COVER_TEXT,
    textAlign: "center",
    marginTop: 10,
  },
  coverFooter: {
    position: "absolute",
    bottom: 36,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 9,
    letterSpacing: 2,
    color: COVER_DIM,
    fontFamily: "Helvetica",
  },

  /* ── Content pages (white) ── */
  page: {
    paddingTop: 56,
    paddingBottom: 56,
    paddingHorizontal: 52,
    backgroundColor: PAGE_BG,
    color: INK,
    fontFamily: "Times-Roman",
    fontSize: 12,
    lineHeight: 1.7,
  },
  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: RULE,
  },
  pageHeaderBrand: {
    fontSize: 7,
    letterSpacing: 3,
    color: PURPLE,
    fontFamily: "Helvetica-Bold",
  },
  pageHeaderSection: {
    fontSize: 7,
    letterSpacing: 2,
    color: MUTED,
    fontFamily: "Helvetica",
  },
  sectionEyebrow: {
    fontSize: 8,
    letterSpacing: 3,
    color: PURPLE,
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
  },
  letterOpenerText: {
    fontSize: 12.5,
    lineHeight: 1.85,
    color: INK,
    marginBottom: 10,
    fontFamily: "Times-Italic",
  },

  /* ── Tag pill ── */
  tagWrap: {
    flexDirection: "row",
    marginBottom: 8,
  },
  tag: {
    fontSize: 7,
    letterSpacing: 2,
    color: PURPLE,
    fontFamily: "Helvetica-Bold",
    backgroundColor: TAG_BG,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
  },

  /* ── Insight cards ── */
  card: {
    backgroundColor: LIGHT_CARD,
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 22,
    marginBottom: 20,
  },
  planetLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: PURPLE,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
  },
  hook: {
    fontSize: 17,
    fontFamily: "Times-Bold",
    color: INK,
    lineHeight: 1.3,
    marginBottom: 14,
  },
  truth: {
    fontSize: 16,
    fontFamily: "Times-Bold",
    color: INK,
    lineHeight: 1.3,
    marginBottom: 14,
  },
  body: {
    fontSize: 12,
    lineHeight: 1.75,
    color: "#2a2436",
    marginBottom: 7,
    fontFamily: "Times-Roman",
  },
  reveal: {
    fontSize: 13,
    fontFamily: "Times-Italic",
    color: MUTED,
    lineHeight: 1.6,
    marginTop: 10,
  },
  actionWrap: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: RULE,
  },
  actionLabel: {
    fontSize: 7,
    letterSpacing: 2,
    color: PURPLE,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  actionText: {
    fontSize: 11,
    color: INK,
    lineHeight: 1.6,
    fontFamily: "Times-Italic",
  },
  pageFooter: {
    position: "absolute",
    bottom: 24,
    left: 52,
    right: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageFooterText: {
    fontSize: 8,
    color: MUTED,
    letterSpacing: 1,
    fontFamily: "Helvetica",
  },

  /* ── Divider between insights ── */
  insightDivider: {
    height: 1,
    backgroundColor: RULE,
    marginTop: 8,
    marginBottom: 24,
  },

  /* ── Closing page (dark) ── */
  closingText: {
    fontSize: 14,
    fontFamily: "Times-Italic",
    color: "#c4bdb2",
    textAlign: "center",
    lineHeight: 1.8,
    marginTop: 20,
    maxWidth: 340,
  },
  disclaimer: {
    fontSize: 9,
    lineHeight: 1.5,
    color: COVER_DIM,
    textAlign: "center",
    fontFamily: "Helvetica",
    marginTop: 32,
    maxWidth: 360,
  },
});

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function PageHeader({ section }: { section: string }) {
  return (
    <View style={s.pageHeader} fixed>
      <Text style={s.pageHeaderBrand}>BLUNTCHART</Text>
      <Text style={s.pageHeaderSection}>{section}</Text>
    </View>
  );
}

function TagPill({ planet }: { planet: string }) {
  const tag = getTag(planet);
  if (!tag) return null;
  return (
    <View style={s.tagWrap}>
      <Text style={s.tag}>{tag}</Text>
    </View>
  );
}

export default function ReadingPDF({
  name,
  letterOpener,
  preview,
  paidInsights,
}: Props) {
  const displayName = name || "you";

  return (
    <Document
      title={`Birth Chart Reading — ${displayName} — BluntChart`}
      author="BluntChart"
      subject="Your Full Birth Chart Reading"
    >
      {/* ═══ COVER PAGE (dark) ═══ */}
      <Page size="A4" style={s.cover}>
        <View style={s.coverInner}>
          <Text style={s.coverBrand}>BLUNTCHART</Text>
          <Text style={s.coverTitle}>Your Birth{"\n"}Chart Reading</Text>
          <Text style={s.coverSubtitle}>
            Brutally honest. Deeply personal.
          </Text>
          <Text style={s.coverPreparedLabel}>PREPARED FOR</Text>
          <Text style={s.coverName}>{displayName}</Text>
        </View>
        <Text style={s.coverFooter}>bluntchart.com</Text>
      </Page>

      {/* ═══ LETTER OPENER + PREVIEW (white) ═══ */}
      <Page size="A4" style={s.page}>
        <PageHeader section="YOUR READING" />

        {letterOpener && (
          <View style={{ marginBottom: 24 }}>
            {splitParagraphs(letterOpener).map((p, i) => (
              <Text key={i} style={s.letterOpenerText}>
                {p}
              </Text>
            ))}
          </View>
        )}

        <View style={s.pageFooter}>
          <Text style={s.pageFooterText}>bluntchart.com</Text>
          <Text style={s.pageFooterText}>{displayName}</Text>
        </View>
      </Page>

      {/* ═══ PAID INSIGHTS (white, flowing naturally) ═══ */}
      <Page size="A4" style={s.page}>
        <PageHeader section={`FULL READING · ${paidInsights.length} INSIGHTS`} />

        {paidInsights.map((ins, i) => (
          <View key={i}>
            {/* Divider between insights (not before the first) */}
            {i > 0 && <View style={s.insightDivider} />}

            {/* Tag pill */}
            {ins.planet && <TagPill planet={ins.planet} />}

            {/* Planet label */}
            {ins.planet && <Text style={s.planetLabel}>{ins.planet}</Text>}

            {/* Truth heading */}
            {ins.truth && <Text style={s.truth}>{ins.truth}</Text>}

            {/* Body paragraphs */}
            {ins.explain &&
              splitParagraphs(ins.explain).map((p, j) => (
                <Text key={j} style={s.body}>
                  {p}
                </Text>
              ))}

            {/* Action */}
            {ins.action && (
              <View style={s.actionWrap}>
                <Text style={s.actionLabel}>THIS WEEK</Text>
                <Text style={s.actionText}>{ins.action}</Text>
              </View>
            )}
          </View>
        ))}

        <View style={s.pageFooter}>
          <Text style={s.pageFooterText}>bluntchart.com</Text>
          <Text style={s.pageFooterText}>{displayName}</Text>
        </View>
      </Page>

      {/* ═══ CLOSING PAGE (dark) ═══ */}
      <Page size="A4" style={s.cover}>
        <View style={s.coverInner}>
          <Text style={s.coverBrand}>BLUNTCHART</Text>
          <View
            style={{
              width: 50,
              height: 1,
              backgroundColor: GOLD,
              marginTop: 16,
            }}
          />
          <Text style={s.closingText}>
            Generated from {displayName}&apos;s birth chart
          </Text>
          <Text style={s.disclaimer}>
            For entertainment purposes only. Not medical, financial, or
            psychological advice.
          </Text>
        </View>
        <Text style={s.coverFooter}>bluntchart.com</Text>
      </Page>
    </Document>
  );
}
