"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

interface Props {
  letter: string;
  name?: string;
  date: string;
}

const s = StyleSheet.create({
  page: {
    paddingTop: 72,
    paddingBottom: 72,
    paddingHorizontal: 64,
    backgroundColor: "#faf6ee",
    fontFamily: "Times-Roman",
    fontSize: 12,
    lineHeight: 1.85,
    color: "#3a3428",
  },
  brand: {
    fontSize: 9,
    letterSpacing: 3,
    color: "#c4a45a",
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 36,
  },
  heading: {
    fontFamily: "Times-Bold",
    fontSize: 22,
    color: "#5a4e3a",
    textAlign: "center",
    lineHeight: 1.3,
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: "Times-Italic",
    fontSize: 11,
    color: "#9a8a6a",
    textAlign: "center",
    marginBottom: 40,
  },
  divider: {
    width: 60,
    height: 1,
    backgroundColor: "#d4c4a0",
    alignSelf: "center",
    marginBottom: 36,
  },
  date: {
    fontSize: 10,
    color: "#9a8a6a",
    marginBottom: 24,
  },
  salutation: {
    fontFamily: "Times-Italic",
    fontSize: 14,
    color: "#3a3428",
    marginBottom: 20,
  },
  body: {
    fontSize: 11.5,
    lineHeight: 1.85,
    color: "#3a3428",
    marginBottom: 14,
    fontFamily: "Times-Roman",
  },
  closing: {
    fontFamily: "Times-Italic",
    fontSize: 12,
    color: "#5a4e3a",
    marginTop: 28,
    marginBottom: 6,
  },
  footer: {
    position: "absolute",
    bottom: 36,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 8,
    color: "#c4b89a",
    letterSpacing: 1,
    fontFamily: "Helvetica",
  },
  footerUrl: {
    fontSize: 7,
    color: "#d4c4a0",
    marginTop: 3,
  },
});

export default function LoveLetterPDF({ letter, name, date }: Props) {
  const paragraphs = letter
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .filter((p) => !/^my\s+love[,.]?\s*$/i.test(p))
    .filter((p) => !/^my\s+dear[,.]?\s*$/i.test(p));

  const displayName = name || "you";

  return (
    <Document
      title={`Love Letter — ${displayName} — BluntChart`}
      author="BluntChart"
      subject="A Love Letter From Your Future Husband"
    >
      <Page size="A4" style={s.page}>
        <Text style={s.brand}>BLUNTCHART</Text>

        <Text style={s.heading}>A Love Letter</Text>
        <Text style={s.subtitle}>From Your Future Husband</Text>

        <View style={s.divider} />

        <Text style={s.date}>{date}</Text>
        <Text style={s.salutation}>My love,</Text>

        {paragraphs.map((p, i) => {
          if (
            p.startsWith("Yours,") ||
            p === "Someone worth waiting for" ||
            p === "♥"
          ) {
            return (
              <Text key={i} style={s.closing}>
                {p}
              </Text>
            );
          }
          return (
            <Text key={i} style={s.body}>
              {p}
            </Text>
          );
        })}

        <Text style={s.footer}>
          Generated from {displayName}&apos;s birth chart by BluntChart
        </Text>
        <Text style={[s.footer, s.footerUrl, { bottom: 24 }]}>
          bluntchart.com
        </Text>
      </Page>
    </Document>
  );
}
