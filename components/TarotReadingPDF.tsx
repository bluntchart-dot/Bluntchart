import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

/* ═════════════════════════════════════════════════════════════════
   TYPES
═════════════════════════════════════════════════════════════════ */

interface TarotCardSection {
  position?: string;
  card_name?: string;
  orientation?: string;
  interpretation?: string;
}

interface ThreeCardReading {
  cards: TarotCardSection[];
  narrative: string;
  advice: string;
}

interface YesNoReading {
  answer: string;
  confidence: string;
  card_name: string;
  orientation: string;
  explanation: string;
  caveat: string;
}

interface LoveReadingSection {
  title: string;
  body: string;
}

interface LoveReading {
  opener: string;
  sections: LoveReadingSection[];
  final_word: string;
}

interface Props {
  name: string;
  productTitle: string;
  reading: Record<string, unknown>;
  variant: "three-card" | "yes-no" | "love" | "generic";
  question?: string;
  zodiacSign?: string;
  tagline?: [string, string];
}

/* ═════════════════════════════════════════════════════════════════
   PALETTE
═════════════════════════════════════════════════════════════════ */

const COVER_BG = "#0f0a1e";
const COVER_TEXT = "#efe9dc";
const COVER_DIM = "#7a736a";
const GOLD = "#f0b84a";
const INDIGO = "#6c4dc4";
const PAGE_BG = "#ffffff";
const INK = "#1a1420";
const MUTED = "#5a5468";
const CARD_BG = "#f8f5fd";
const RULE = "#d8d0e4";

/* ═════════════════════════════════════════════════════════════════
   STYLES
═════════════════════════════════════════════════════════════════ */

const s = StyleSheet.create({
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
    fontSize: 42,
    lineHeight: 1.2,
    color: "#f5c99e",
    textAlign: "center",
    marginTop: 40,
  },
  coverSubtitle: {
    fontFamily: "Times-Italic",
    fontSize: 13,
    lineHeight: 1.6,
    color: "#c4bdb2",
    textAlign: "center",
    marginTop: 16,
  },
  coverName: {
    fontFamily: "Times-Roman",
    fontSize: 20,
    color: COVER_TEXT,
    textAlign: "center",
    marginTop: 12,
  },
  coverPreparedLabel: {
    fontSize: 9,
    letterSpacing: 3,
    color: COVER_DIM,
    fontFamily: "Helvetica-Bold",
    marginTop: 48,
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
    color: INDIGO,
    fontFamily: "Helvetica-Bold",
  },
  pageHeaderSection: {
    fontSize: 7,
    letterSpacing: 2,
    color: MUTED,
    fontFamily: "Helvetica",
  },

  card: {
    backgroundColor: CARD_BG,
    borderRadius: 6,
    paddingHorizontal: 24,
    paddingTop: 18,
    paddingBottom: 20,
    marginBottom: 18,
  },
  cardPosition: {
    fontSize: 8,
    letterSpacing: 3,
    color: INDIGO,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
  },
  cardName: {
    fontSize: 18,
    fontFamily: "Times-Bold",
    color: INK,
    marginBottom: 4,
  },
  cardOrientation: {
    fontSize: 10,
    fontFamily: "Helvetica",
    color: MUTED,
    marginBottom: 12,
  },
  body: {
    fontSize: 12,
    lineHeight: 1.75,
    color: "#2a2436",
    marginBottom: 7,
    fontFamily: "Times-Roman",
  },

  sectionTitle: {
    fontSize: 16,
    fontFamily: "Times-Bold",
    color: INK,
    marginTop: 20,
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 8,
    letterSpacing: 3,
    color: INDIGO,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    marginTop: 20,
  },
  divider: {
    height: 1,
    backgroundColor: RULE,
    marginTop: 8,
    marginBottom: 20,
  },

  answerBig: {
    fontSize: 52,
    fontFamily: "Times-Bold",
    color: INDIGO,
    textAlign: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  confidence: {
    fontSize: 11,
    fontFamily: "Helvetica",
    color: MUTED,
    textAlign: "center",
    marginBottom: 24,
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

/* ═════════════════════════════════════════════════════════════════
   HELPERS
═════════════════════════════════════════════════════════════════ */

function splitParagraphs(text: string): string[] {
  return text.split(/\n+/).map((p) => p.trim()).filter(Boolean);
}

function PageHeader({ section }: { section: string }) {
  return (
    <View style={s.pageHeader} fixed>
      <Text style={s.pageHeaderBrand}>BLUNTCHART</Text>
      <Text style={s.pageHeaderSection}>{section}</Text>
    </View>
  );
}

function Footer({ name }: { name: string }) {
  return (
    <View style={s.pageFooter}>
      <Text style={s.pageFooterText}>bluntchart.com</Text>
      <Text style={s.pageFooterText}>{name}</Text>
    </View>
  );
}

/* ═════════════════════════════════════════════════════════════════
   VARIANT RENDERERS
═════════════════════════════════════════════════════════════════ */

function ThreeCardPages({ reading, name }: { reading: ThreeCardReading; name: string }) {
  return (
    <Page size="A4" style={s.page}>
      <PageHeader section="THREE CARD READING" />

      {reading.cards.map((card, i) => (
        <View key={i} style={s.card}>
          {card.position && (
            <Text style={s.cardPosition}>{card.position.toUpperCase()}</Text>
          )}
          {card.card_name && <Text style={s.cardName}>{card.card_name}</Text>}
          {card.orientation && (
            <Text style={s.cardOrientation}>{card.orientation.toUpperCase()}</Text>
          )}
          {card.interpretation &&
            splitParagraphs(card.interpretation).map((p, j) => (
              <Text key={j} style={s.body}>{p}</Text>
            ))}
        </View>
      ))}

      <View style={s.divider} />
      <Text style={s.sectionLabel}>THE STORY</Text>
      {splitParagraphs(reading.narrative).map((p, i) => (
        <Text key={i} style={s.body}>{p}</Text>
      ))}

      <View style={s.divider} />
      <Text style={s.sectionLabel}>THIS WEEK</Text>
      {splitParagraphs(reading.advice).map((p, i) => (
        <Text key={i} style={s.body}>{p}</Text>
      ))}

      <Footer name={name} />
    </Page>
  );
}

function YesNoPages({ reading, name, question }: { reading: YesNoReading; name: string; question?: string }) {
  return (
    <Page size="A4" style={s.page}>
      <PageHeader section="YES / NO TAROT" />

      {question && (
        <View style={{ marginBottom: 20 }}>
          <Text style={s.sectionLabel}>YOUR QUESTION</Text>
          <Text style={{ ...s.body, fontFamily: "Times-Italic", fontSize: 14 }}>
            {question}
          </Text>
        </View>
      )}

      <Text style={s.answerBig}>{reading.answer.toUpperCase()}</Text>
      <Text style={s.confidence}>
        Confidence: {reading.confidence} — {reading.card_name} ({reading.orientation})
      </Text>

      <View style={s.card}>
        <Text style={s.cardName}>{reading.card_name}</Text>
        <Text style={s.cardOrientation}>{reading.orientation.toUpperCase()}</Text>
        {splitParagraphs(reading.explanation).map((p, i) => (
          <Text key={i} style={s.body}>{p}</Text>
        ))}
      </View>

      <View style={s.divider} />
      <Text style={s.sectionLabel}>WHAT YOU CAN CHANGE</Text>
      {splitParagraphs(reading.caveat).map((p, i) => (
        <Text key={i} style={s.body}>{p}</Text>
      ))}

      <Footer name={name} />
    </Page>
  );
}

function LoveReadingPages({ reading, name }: { reading: LoveReading; name: string }) {
  return (
    <>
      <Page size="A4" style={s.page}>
        <PageHeader section="LOVE READING" />

        <View style={{ marginBottom: 20 }}>
          {splitParagraphs(reading.opener).map((p, i) => (
            <Text key={i} style={{ ...s.body, fontFamily: "Times-Italic", fontSize: 13 }}>
              {p}
            </Text>
          ))}
        </View>

        {reading.sections.map((section, i) => (
          <View key={i}>
            {i > 0 && <View style={s.divider} />}
            <Text style={s.sectionTitle}>{section.title}</Text>
            {splitParagraphs(section.body).map((p, j) => (
              <Text key={j} style={s.body}>{p}</Text>
            ))}
          </View>
        ))}

        <View style={s.divider} />
        <Text style={s.sectionLabel}>FINAL WORD</Text>
        {splitParagraphs(reading.final_word).map((p, i) => (
          <Text key={i} style={{ ...s.body, fontFamily: "Times-Italic" }}>
            {p}
          </Text>
        ))}

        <Footer name={name} />
      </Page>
    </>
  );
}

function GenericPages({ reading, name }: { reading: Record<string, unknown>; name: string }) {
  const sections = extractTextSections(reading);
  return (
    <Page size="A4" style={s.page}>
      <PageHeader section="YOUR READING" />
      {sections.map(([key, text], i) => (
        <View key={i}>
          {i > 0 && <View style={s.divider} />}
          <Text style={s.sectionLabel}>{key.toUpperCase()}</Text>
          {splitParagraphs(text).map((p, j) => (
            <Text key={j} style={s.body}>{p}</Text>
          ))}
        </View>
      ))}
      <Footer name={name} />
    </Page>
  );
}

function extractTextSections(obj: Record<string, unknown>): [string, string][] {
  const result: [string, string][] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string" && value.length > 50) {
      result.push([key, value]);
    } else if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "object" && item !== null) {
          const label = (item as any).title ?? (item as any).planet ?? (item as any).position ?? key;
          const body = (item as any).body ?? (item as any).explain ?? (item as any).interpretation ?? "";
          if (typeof body === "string" && body.length > 50) {
            result.push([String(label), body]);
          }
        }
      }
    }
  }
  return result;
}

/* ═════════════════════════════════════════════════════════════════
   MAIN COMPONENT
═════════════════════════════════════════════════════════════════ */

export default function TarotReadingPDF({
  name,
  productTitle,
  reading,
  variant,
  question,
  zodiacSign,
  tagline,
}: Props) {
  const displayName = name || "you";
  const subtitle = tagline
    ? `${tagline[0]}\n${tagline[1]}`
    : "No fluff. No filter. Just the cards.";

  return (
    <Document
      title={`${productTitle} — ${displayName} — BluntChart`}
      author="BluntChart"
      subject={productTitle}
    >
      {/* Cover */}
      <Page size="A4" style={s.cover}>
        <View style={s.coverInner}>
          <Text style={s.coverBrand}>BLUNTCHART</Text>
          <Text style={s.coverTitle}>{productTitle}</Text>
          <Text style={s.coverSubtitle}>{subtitle}</Text>
          <Text style={s.coverPreparedLabel}>PREPARED FOR</Text>
          <Text style={s.coverName}>{displayName}</Text>
          {zodiacSign && (
            <Text style={{
              fontSize: 11,
              letterSpacing: 3,
              color: GOLD,
              fontFamily: "Helvetica",
              marginTop: 8,
            }}>
              {zodiacSign.toUpperCase()}
            </Text>
          )}
        </View>
        <Text style={s.coverFooter}>bluntchart.com</Text>
      </Page>

      {/* Content */}
      {variant === "three-card" && (
        <ThreeCardPages reading={reading as unknown as ThreeCardReading} name={displayName} />
      )}
      {variant === "yes-no" && (
        <YesNoPages reading={reading as unknown as YesNoReading} name={displayName} question={question} />
      )}
      {variant === "love" && (
        <LoveReadingPages reading={reading as unknown as LoveReading} name={displayName} />
      )}
      {variant === "generic" && (
        <GenericPages reading={reading} name={displayName} />
      )}

      {/* Closing */}
      <Page size="A4" style={s.cover}>
        <View style={s.coverInner}>
          <Text style={s.coverBrand}>BLUNTCHART</Text>
          <View style={{ width: 50, height: 1, backgroundColor: GOLD, marginTop: 16 }} />
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
