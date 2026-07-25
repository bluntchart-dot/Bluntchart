"use client";

/**
 * PremiumBookPDF — the @react-pdf/renderer document for the reading.
 *
 * Kept as a separate module so the PDF library only lands in the bundle
 * when the reader actually clicks Download (see PremiumBookPDFButton).
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type {
  PremiumReading,
  RenderedSection,
} from "@/lib/premium/types";
import {
  CHAPTER_BUILT_USING_TABLE,
  HOW_WE_READ_EXPLAINER,
} from "@/lib/premium/products/birth-chart/blueprint";
import PdfChartWheel from "./PdfChartWheel";

/* React-PDF uses its own StyleSheet (subset of CSS). No CSS variables,
   no display:grid. Layout is flex only. */
const styles = StyleSheet.create({
  page: {
    paddingTop: 64,
    paddingBottom: 64,
    paddingHorizontal: 56,
    backgroundColor: "#ffffff",
    color: "#1a1420",
    fontFamily: "Times-Roman",
    fontSize: 11,
    lineHeight: 1.65,
  },
  coverPage: {
    padding: 0,
    backgroundColor: "#0a0910",
    color: "#efe9dc",
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
    color: "#f0b84a",
    fontFamily: "Helvetica-Bold",
  },
  coverTitleSpacer: {
    height: 44,
  },
  coverTitle: {
    fontFamily: "Times-Bold",
    fontSize: 52,
    lineHeight: 1.15,
    color: "#f5c99e",
    letterSpacing: -1,
    textAlign: "center",
  },
  coverSubtitleSpacer: {
    height: 22,
  },
  coverSubtitle: {
    fontFamily: "Times-Italic",
    fontSize: 13,
    lineHeight: 1.6,
    color: "#c4bdb2",
    textAlign: "center",
  },
  coverBottomSpacer: {
    height: 56,
  },
  coverPreparedLabel: {
    fontSize: 9,
    letterSpacing: 3,
    color: "#7a736a",
    fontFamily: "Helvetica-Bold",
  },
  coverPreparedLabelSpacer: {
    height: 10,
  },
  coverPreparedName: {
    fontFamily: "Times-Roman",
    fontSize: 20,
    lineHeight: 1.2,
    color: "#efe9dc",
    textAlign: "center",
  },
  coverPreparedSpacer: {
    height: 48,
  },
  coverTime: {
    fontSize: 9,
    letterSpacing: 2,
    color: "#7a736a",
    fontFamily: "Helvetica",
    textAlign: "center",
  },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 3,
    textTransform: "uppercase",
    color: "#7a5abf",
    marginBottom: 10,
    fontFamily: "Helvetica-Bold",
  },
  chapterTitle: {
    fontFamily: "Times-Bold",
    fontSize: 26,
    marginBottom: 8,
    color: "#1a1420",
    lineHeight: 1.1,
  },
  subtitle: {
    fontFamily: "Times-Italic",
    fontSize: 12,
    color: "#5a5468",
    marginBottom: 22,
    lineHeight: 1.5,
  },
  body: {
    fontFamily: "Times-Roman",
    fontSize: 11,
    color: "#1a1420",
    lineHeight: 1.72,
  },
  paragraph: {
    marginBottom: 12,
  },
  builtUsingWrap: {
    marginTop: 24,
    paddingTop: 14,
    borderTopWidth: 0.5,
    borderTopColor: "#c8c0d4",
  },
  builtUsingHeading: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#7a5abf",
    marginBottom: 10,
    fontFamily: "Helvetica-Bold",
  },
  builtUsingItem: {
    flexDirection: "row",
    marginBottom: 6,
  },
  builtUsingSymbol: {
    width: 18,
    fontSize: 11,
    color: "#7a5abf",
  },
  builtUsingLabel: {
    fontSize: 10,
    color: "#1a1420",
    fontFamily: "Helvetica-Bold",
  },
  builtUsingMeaning: {
    fontSize: 9.5,
    color: "#5a5468",
    marginTop: 1,
  },
  attributionTable: {
    marginTop: 20,
    padding: 14,
    backgroundColor: "#f5f2f8",
    borderRadius: 6,
  },
  attributionHeading: {
    fontSize: 8,
    letterSpacing: 2,
    textTransform: "uppercase",
    color: "#5a5468",
    marginBottom: 10,
    fontFamily: "Helvetica-Bold",
  },
  attributionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 0.25,
    borderBottomColor: "#e0dae8",
  },
  attributionRowLast: {
    borderBottomWidth: 0,
  },
  attributionChapter: {
    fontSize: 10,
    color: "#1a1420",
  },
  attributionInputs: {
    fontSize: 9,
    color: "#5a5468",
  },
  chartImageWrap: {
    marginTop: 16,
    marginBottom: 20,
    alignItems: "center",
  },
  chartImage: {
    width: 260,
    height: 260,
    objectFit: "contain",
  },
  chartPlacements: {
    marginTop: 8,
  },
  chartPlacementRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9.5,
    marginBottom: 4,
    color: "#1a1420",
  },
  chartMeta: {
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#c8c0d4",
    fontSize: 10,
    color: "#5a5468",
  },
  chartMetaRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 4,
  },
  pageFooter: {
    position: "absolute",
    bottom: 30,
    left: 56,
    right: 56,
    fontSize: 8,
    color: "#a09aad",
    fontFamily: "Helvetica",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  closingPage: {
    justifyContent: "center",
  },
  closingBody: {
    fontFamily: "Times-Italic",
    fontSize: 13,
    lineHeight: 1.75,
    color: "#1a1420",
  },
  closingSignature: {
    marginTop: 24,
    fontSize: 8,
    letterSpacing: 3,
    color: "#7a5abf",
    fontFamily: "Helvetica-Bold",
  },

  /* ─── Dark hero page (used by part-title + farewell) ─── */
  darkHeroPage: {
    padding: 0,
    backgroundColor: "#0a0910",
    color: "#efe9dc",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  darkHeroInner: {
    paddingTop: 48,
    paddingBottom: 48,
    paddingHorizontal: 56,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  darkHeroEyebrow: {
    fontSize: 9,
    letterSpacing: 4,
    color: "#f0b84a",
    fontFamily: "Helvetica-Bold",
    marginBottom: 32,
  },
  darkHeroTitle: {
    fontFamily: "Times-Bold",
    fontSize: 62,
    lineHeight: 1.05,
    color: "#f5c99e",
    letterSpacing: -1,
    textAlign: "center",
  },
  darkHeroTitleFarewell: {
    fontSize: 44,
  },
  darkHeroSpacer: {
    height: 20,
  },
  darkHeroSubtitle: {
    fontFamily: "Times-Italic",
    fontSize: 15,
    lineHeight: 1.55,
    color: "#c4bdb2",
    textAlign: "center",
  },
  darkHeroSignature: {
    marginTop: 44,
    fontSize: 8,
    letterSpacing: 4,
    color: "#7a736a",
    fontFamily: "Helvetica-Bold",
  },
});

function toParagraphs(body: string): string[] {
  return body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function PageFooter({ label, pageNo, total }: { label: string; pageNo: number; total: number }) {
  return (
    <View style={styles.pageFooter} fixed>
      <Text>{label}</Text>
      <Text>{`${pageNo} / ${total}`}</Text>
    </View>
  );
}

function ChapterPage({
  section,
  pageNo,
  total,
}: {
  section: RenderedSection;
  pageNo: number;
  total: number;
}) {
  const paragraphs = toParagraphs(section.body);
  return (
    <Page size="A5" style={styles.page}>
      <Text style={styles.eyebrow}>
        {section.chapterNumber ? `CHAPTER ${section.chapterNumber}` : "CHAPTER"}
      </Text>
      <Text style={styles.chapterTitle}>{section.title}</Text>
      {section.subtitle && <Text style={styles.subtitle}>{section.subtitle}</Text>}
      <View style={styles.body}>
        {paragraphs.map((p, i) => (
          <Text key={i} style={styles.paragraph}>
            {p}
          </Text>
        ))}
      </View>

      {section.builtUsing && section.builtUsing.length > 0 && (
        <View style={styles.builtUsingWrap} wrap={false}>
          <Text style={styles.builtUsingHeading}>Why we&apos;re saying this</Text>
          {section.builtUsing.map((item, i) => (
            <View key={i} style={styles.builtUsingItem}>
              <Text style={styles.builtUsingSymbol}>{item.symbol}</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.builtUsingLabel}>{item.label}</Text>
                <Text style={styles.builtUsingMeaning}>{item.meaning}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      <PageFooter label={section.title} pageNo={pageNo} total={total} />
    </Page>
  );
}

function CoverPage({ reading }: { reading: PremiumReading }) {
  return (
    <Page size="A5" style={[styles.page, styles.coverPage]}>
      <View style={styles.coverInner}>
        <Text style={styles.coverBrand}>BLUNTCHART</Text>
        <View style={styles.coverTitleSpacer} />
        <Text style={styles.coverTitle}>Your Story</Text>
        <View style={styles.coverSubtitleSpacer} />
        <Text style={styles.coverSubtitle}>Some stories are written by life.</Text>
        <Text style={styles.coverSubtitle}>This one was written by the sky.</Text>
        <View style={styles.coverBottomSpacer} />
        <Text style={styles.coverPreparedLabel}>PREPARED FOR</Text>
        <View style={styles.coverPreparedLabelSpacer} />
        <Text style={styles.coverPreparedName}>{reading.meta.name}</Text>
        <View style={styles.coverPreparedSpacer} />
        <Text style={styles.coverTime}>
          about {reading.meta.estimatedReadingMinutes} min · one sitting or in pieces
        </Text>
      </View>
    </Page>
  );
}

function WelcomePage({ section, pageNo, total }: { section: RenderedSection; pageNo: number; total: number }) {
  const paragraphs = toParagraphs(section.body);
  return (
    <Page size="A5" style={styles.page}>
      <Text style={styles.eyebrow}>PREFACE</Text>
      <Text style={styles.chapterTitle}>{section.title}</Text>
      {section.subtitle && <Text style={styles.subtitle}>{section.subtitle}</Text>}
      <View style={styles.body}>
        {paragraphs.map((p, i) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}
      </View>
      <PageFooter label="Preface" pageNo={pageNo} total={total} />
    </Page>
  );
}

function ChartPagePDF({
  reading,
  section,
  pageNo,
  total,
}: {
  reading: PremiumReading;
  section: RenderedSection;
  pageNo: number;
  total: number;
}) {
  const planets = reading.chart.planets.map((p) => ({
    name: p.name,
    sign: p.sign,
    deg: Math.floor(p.degree),
    house: p.house,
    retrograde: p.retrograde,
  }));
  const rising = reading.chart.ascendant;
  const midheaven = reading.chart.midheaven;

  return (
    <Page size="A5" style={styles.page}>
      <Text style={styles.eyebrow}>THE BLUEPRINT</Text>
      <Text style={styles.chapterTitle}>{section.title}</Text>
      {section.subtitle && <Text style={styles.subtitle}>{section.subtitle}</Text>}

      <View style={styles.chartImageWrap} wrap={false}>
        <PdfChartWheel chart={reading.chart} size={220} />
      </View>

      <View style={styles.chartPlacements} wrap={false}>
        {rising?.sign && (
          <View style={styles.chartPlacementRow}>
            <Text style={styles.builtUsingLabel}>Rising</Text>
            <Text>{rising.sign} · {Math.floor(rising.degree ?? 0)}°</Text>
          </View>
        )}
        {planets.map((p, i) => (
          <View key={i} style={styles.chartPlacementRow}>
            <Text style={styles.builtUsingLabel}>{p.name}</Text>
            <Text>
              {p.sign} · {p.deg}° · House {p.house}
              {p.retrograde ? "  ℞" : ""}
            </Text>
          </View>
        ))}
        {midheaven?.sign && (
          <View style={styles.chartPlacementRow}>
            <Text style={styles.builtUsingLabel}>Midheaven</Text>
            <Text>{midheaven.sign} · {Math.floor(midheaven.degree ?? 0)}°</Text>
          </View>
        )}
      </View>

      <View style={styles.chartMeta} wrap={false}>
        <View style={styles.chartMetaRow}>
          <Text>Born</Text><Text>{reading.meta.dob} · {reading.meta.birthTime}</Text>
        </View>
        <View style={styles.chartMetaRow}>
          <Text>In</Text><Text>{reading.meta.birthPlace}</Text>
        </View>
      </View>

      <PageFooter label="Your Natal Chart" pageNo={pageNo} total={total} />
    </Page>
  );
}

function EducationPage({ section, pageNo, total }: { section: RenderedSection; pageNo: number; total: number }) {
  return (
    <Page size="A5" style={styles.page}>
      <Text style={styles.eyebrow}>A QUICK NOTE</Text>
      <Text style={styles.chapterTitle}>{section.title}</Text>
      {section.subtitle && <Text style={styles.subtitle}>{section.subtitle}</Text>}
      <View style={styles.body}>
        {toParagraphs(HOW_WE_READ_EXPLAINER).map((p, i) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}
      </View>
      <View style={styles.attributionTable} wrap={false}>
        <Text style={styles.attributionHeading}>What each chapter is built on</Text>
        {CHAPTER_BUILT_USING_TABLE.map((row, i) => (
          <View
            key={row.chapter}
            wrap={false}
            style={[
              styles.attributionRow,
              i === CHAPTER_BUILT_USING_TABLE.length - 1 ? styles.attributionRowLast : {},
            ]}
          >
            <Text style={styles.attributionChapter}>{row.chapter}</Text>
            <Text style={styles.attributionInputs}>{row.builtUsing}</Text>
          </View>
        ))}
      </View>
      <PageFooter label="How we read your chart" pageNo={pageNo} total={total} />
    </Page>
  );
}

function PartTitlePage({ pageNo, total, section }: { pageNo: number; total: number; section: RenderedSection }) {
  return (
    <Page size="A5" style={[styles.page, styles.darkHeroPage]}>
      <View style={styles.darkHeroInner}>
        <Text style={styles.darkHeroEyebrow}>BLUNTCHART</Text>
        <Text style={styles.darkHeroTitle}>{section.title}</Text>
        {section.subtitle && (
          <>
            <View style={styles.darkHeroSpacer} />
            <Text style={styles.darkHeroSubtitle}>{section.subtitle}</Text>
          </>
        )}
      </View>
      <PageFooter label={section.title} pageNo={pageNo} total={total} />
    </Page>
  );
}

function FarewellPage({ pageNo, total, section }: { pageNo: number; total: number; section: RenderedSection }) {
  return (
    <Page size="A5" style={[styles.page, styles.darkHeroPage]}>
      <View style={styles.darkHeroInner}>
        <Text style={styles.darkHeroEyebrow}>FIN</Text>
        <Text style={[styles.darkHeroTitle, styles.darkHeroTitleFarewell]}>
          {section.title}
        </Text>
        {section.subtitle && (
          <>
            <View style={styles.darkHeroSpacer} />
            <Text style={styles.darkHeroSubtitle}>{section.subtitle}</Text>
          </>
        )}
        <Text style={styles.darkHeroSignature}>— BLUNTCHART</Text>
      </View>
    </Page>
  );
}

function TransitionPage({ section, pageNo, total }: { section: RenderedSection; pageNo: number; total: number }) {
  return (
    <Page size="A5" style={[styles.page, styles.closingPage]}>
      <Text style={styles.eyebrow}>PART TWO</Text>
      <Text style={styles.chapterTitle}>{section.title}</Text>
      <View style={styles.closingBody}>
        {toParagraphs(section.body).map((p, i) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}
      </View>
      <PageFooter label="Part Two" pageNo={pageNo} total={total} />
    </Page>
  );
}

function ClosingPage({ section, pageNo, total }: { section: RenderedSection; pageNo: number; total: number }) {
  return (
    <Page size="A5" style={[styles.page, styles.closingPage]}>
      <Text style={styles.eyebrow}>BEFORE YOU GO</Text>
      <Text style={styles.chapterTitle}>{section.title}</Text>
      <View style={styles.closingBody}>
        {toParagraphs(section.body).map((p, i) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}
      </View>
      <Text style={styles.closingSignature}>— BLUNTCHART</Text>
      <PageFooter label="Fin" pageNo={pageNo} total={total} />
    </Page>
  );
}

export default function PremiumBookPDF({
  reading,
}: {
  reading: PremiumReading;
}) {
  /* Cover already lives inside reading.sections at pageType === "cover".
     We handle it separately below and skip it in the loop so it doesn't
     appear twice. */
  const nonCover = reading.sections.filter((s) => s.pageType !== "cover");
  const total = nonCover.length + 1; // + cover

  return (
    <Document
      title={`BluntChart — ${reading.meta.name}`}
      author="BluntChart"
      subject="Personal Birth Chart Reading"
    >
      <CoverPage reading={reading} />
      {nonCover.map((section, i) => {
        const pageNo = i + 2; // cover is page 1
        switch (section.pageType) {
          case "welcome":
            return <WelcomePage key={section.id} section={section} pageNo={pageNo} total={total} />;
          case "chart":
            return (
              <ChartPagePDF
                key={section.id}
                reading={reading}
                section={section}
                pageNo={pageNo}
                total={total}
              />
            );
          case "education":
            return <EducationPage key={section.id} section={section} pageNo={pageNo} total={total} />;
          case "part-title":
            return <PartTitlePage key={section.id} section={section} pageNo={pageNo} total={total} />;
          case "farewell":
            return <FarewellPage key={section.id} section={section} pageNo={pageNo} total={total} />;
          case "closing":
            return <ClosingPage key={section.id} section={section} pageNo={pageNo} total={total} />;
          case "transition":
            return <TransitionPage key={section.id} section={section} pageNo={pageNo} total={total} />;
          case "chapter":
          default:
            return <ChapterPage key={section.id} section={section} pageNo={pageNo} total={total} />;
        }
      })}
    </Document>
  );
}
