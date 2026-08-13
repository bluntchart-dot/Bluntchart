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

const PURPLE = "#6b2fd4";
const GOLD = "#f0b84a";
const BG = "#0e0e18";
const CARD_BG = "#16162a";
const WHITE = "#e8e4f0";
const DIM = "#9b95b0";
const ACCENT = "#c4a8ff";

const s = StyleSheet.create({
  page: {
    paddingTop: 56,
    paddingBottom: 64,
    paddingHorizontal: 48,
    backgroundColor: BG,
    fontFamily: "Helvetica",
    fontSize: 11,
    lineHeight: 1.7,
    color: WHITE,
  },
  brand: {
    fontSize: 10,
    letterSpacing: 4,
    color: GOLD,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 9,
    letterSpacing: 2,
    color: DIM,
    textAlign: "center",
    marginBottom: 32,
  },
  divider: {
    width: 50,
    height: 1,
    backgroundColor: PURPLE,
    alignSelf: "center",
    marginBottom: 28,
    marginTop: 4,
  },
  letterOpener: {
    fontSize: 12,
    lineHeight: 1.8,
    color: WHITE,
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 8,
    letterSpacing: 2.5,
    color: DIM,
    fontFamily: "Helvetica-Bold",
    marginBottom: 16,
    marginTop: 8,
  },
  sectionLabelGold: {
    fontSize: 8,
    letterSpacing: 2.5,
    color: GOLD,
    fontFamily: "Helvetica-Bold",
    marginBottom: 16,
    marginTop: 8,
  },
  card: {
    backgroundColor: CARD_BG,
    borderRadius: 8,
    padding: 24,
    marginBottom: 18,
  },
  planetLabel: {
    fontSize: 8,
    letterSpacing: 2,
    color: DIM,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  hook: {
    fontSize: 15,
    fontFamily: "Times-Bold",
    color: WHITE,
    lineHeight: 1.4,
    marginBottom: 12,
  },
  truth: {
    fontSize: 14,
    fontFamily: "Times-Bold",
    color: WHITE,
    lineHeight: 1.4,
    marginBottom: 12,
  },
  body: {
    fontSize: 11,
    lineHeight: 1.75,
    color: ACCENT,
    marginBottom: 6,
  },
  reveal: {
    fontSize: 12,
    fontFamily: "Times-Italic",
    color: WHITE,
    lineHeight: 1.6,
    marginTop: 8,
  },
  actionWrap: {
    marginTop: 14,
    paddingTop: 10,
    borderTop: `0.5 solid ${PURPLE}`,
  },
  actionLabel: {
    fontSize: 7,
    letterSpacing: 2,
    color: GOLD,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  actionText: {
    fontSize: 10,
    color: GOLD,
    lineHeight: 1.6,
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: DIM,
    letterSpacing: 1,
    fontFamily: "Helvetica",
  },
  disclaimer: {
    marginTop: 28,
    paddingTop: 14,
    borderTop: `0.5 solid ${PURPLE}`,
    fontSize: 8,
    lineHeight: 1.5,
    color: DIM,
    textAlign: "center",
    fontFamily: "Helvetica",
  },
});

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
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
      {/* Page 1: Letter opener + preview insights */}
      <Page size="A4" style={s.page}>
        <Text style={s.brand}>BLUNTCHART</Text>
        <Text style={s.subtitle}>YOUR BIRTH CHART READING</Text>
        <View style={s.divider} />

        {letterOpener && (
          <View style={{ marginBottom: 24 }}>
            {splitParagraphs(letterOpener).map((p, i) => (
              <Text key={i} style={s.letterOpener}>
                {p}
              </Text>
            ))}
          </View>
        )}

        {preview.length > 0 && (
          <View>
            <Text style={s.sectionLabel}>PREVIEW INSIGHTS</Text>
            {preview.map((ins, i) => (
              <View key={i} style={s.card}>
                {ins.planet && <Text style={s.planetLabel}>{ins.planet}</Text>}
                {ins.hook && <Text style={s.hook}>{ins.hook}</Text>}
                {ins.truth &&
                  splitParagraphs(ins.truth).map((p, j) => (
                    <Text key={j} style={s.body}>
                      {p}
                    </Text>
                  ))}
                {ins.reveal && <Text style={s.reveal}>{ins.reveal}</Text>}
              </View>
            ))}
          </View>
        )}

        <Text style={s.footer}>bluntchart.com</Text>
      </Page>

      {/* Paid insights: ~2 per page */}
      {chunkArray(paidInsights, 2).map((chunk, pageIdx) => (
        <Page key={pageIdx} size="A4" style={s.page}>
          {pageIdx === 0 && (
            <Text style={s.sectionLabelGold}>
              FULL READING · {paidInsights.length} INSIGHTS
            </Text>
          )}

          {chunk.map((ins, i) => (
            <View
              key={i}
              style={s.card}
              wrap={false}
            >
              {ins.planet && <Text style={s.planetLabel}>{ins.planet}</Text>}
              {ins.truth && <Text style={s.truth}>{ins.truth}</Text>}
              {ins.explain &&
                splitParagraphs(ins.explain).map((p, j) => (
                  <Text key={j} style={s.body}>
                    {p}
                  </Text>
                ))}
              {ins.action && (
                <View style={s.actionWrap}>
                  <Text style={s.actionLabel}>THIS WEEK</Text>
                  <Text style={s.actionText}>{ins.action}</Text>
                </View>
              )}
            </View>
          ))}

          <Text style={s.footer}>bluntchart.com</Text>
        </Page>
      ))}

      {/* Final page: disclaimer */}
      <Page size="A4" style={s.page}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={s.brand}>BLUNTCHART</Text>
          <View style={s.divider} />
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Times-Italic",
              color: ACCENT,
              textAlign: "center",
              lineHeight: 1.8,
              marginBottom: 20,
              maxWidth: 360,
            }}
          >
            Generated from {displayName}&apos;s birth chart
          </Text>
          <Text style={s.disclaimer}>
            For entertainment purposes only. Not medical, financial, or
            psychological advice.
          </Text>
        </View>
        <Text style={s.footer}>bluntchart.com</Text>
      </Page>
    </Document>
  );
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}
