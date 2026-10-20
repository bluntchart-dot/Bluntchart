export type ZodiacSign =
  | "Aries"
  | "Taurus"
  | "Gemini"
  | "Cancer"
  | "Leo"
  | "Virgo"
  | "Libra"
  | "Scorpio"
  | "Sagittarius"
  | "Capricorn"
  | "Aquarius"
  | "Pisces";

export type Element = "Fire" | "Earth" | "Air" | "Water";

interface ZodiacEntry {
  sign: ZodiacSign;
  element: Element;
  startMonth: number;
  startDay: number;
  endMonth: number;
  endDay: number;
  glyph: string;
}

const ZODIAC_TABLE: ZodiacEntry[] = [
  { sign: "Aries", element: "Fire", startMonth: 3, startDay: 21, endMonth: 4, endDay: 19, glyph: "♈" },
  { sign: "Taurus", element: "Earth", startMonth: 4, startDay: 20, endMonth: 5, endDay: 20, glyph: "♉" },
  { sign: "Gemini", element: "Air", startMonth: 5, startDay: 21, endMonth: 6, endDay: 20, glyph: "♊" },
  { sign: "Cancer", element: "Water", startMonth: 6, startDay: 21, endMonth: 7, endDay: 22, glyph: "♋" },
  { sign: "Leo", element: "Fire", startMonth: 7, startDay: 23, endMonth: 8, endDay: 22, glyph: "♌" },
  { sign: "Virgo", element: "Earth", startMonth: 8, startDay: 23, endMonth: 9, endDay: 22, glyph: "♍" },
  { sign: "Libra", element: "Air", startMonth: 9, startDay: 23, endMonth: 10, endDay: 22, glyph: "♎" },
  { sign: "Scorpio", element: "Water", startMonth: 10, startDay: 23, endMonth: 11, endDay: 21, glyph: "♏" },
  { sign: "Sagittarius", element: "Fire", startMonth: 11, startDay: 22, endMonth: 12, endDay: 21, glyph: "♐" },
  { sign: "Capricorn", element: "Earth", startMonth: 12, startDay: 22, endMonth: 1, endDay: 19, glyph: "♑" },
  { sign: "Aquarius", element: "Air", startMonth: 1, startDay: 20, endMonth: 2, endDay: 18, glyph: "♒" },
  { sign: "Pisces", element: "Water", startMonth: 2, startDay: 19, endMonth: 3, endDay: 20, glyph: "♓" },
];

export function getZodiacSign(dateStr: string): ZodiacEntry {
  const d = new Date(dateStr + "T12:00:00Z");
  const month = d.getUTCMonth() + 1;
  const day = d.getUTCDate();

  for (const entry of ZODIAC_TABLE) {
    if (entry.sign === "Capricorn") {
      if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return entry;
    } else {
      if (
        (month === entry.startMonth && day >= entry.startDay) ||
        (month === entry.endMonth && day <= entry.endDay)
      ) {
        return entry;
      }
    }
  }
  return ZODIAC_TABLE[0];
}

export function getElement(sign: ZodiacSign): Element {
  return ZODIAC_TABLE.find((e) => e.sign === sign)!.element;
}

export function getElementPairKey(e1: Element, e2: Element): string {
  const order: Element[] = ["Fire", "Earth", "Air", "Water"];
  const i1 = order.indexOf(e1);
  const i2 = order.indexOf(e2);
  if (i1 <= i2) return `${e1} + ${e2}`;
  return `${e2} + ${e1}`;
}

const COMPAT_SCORES: Record<string, number> = {
  "Fire + Fire": 85,
  "Fire + Earth": 62,
  "Fire + Air": 88,
  "Fire + Water": 58,
  "Earth + Earth": 82,
  "Earth + Air": 60,
  "Earth + Water": 90,
  "Air + Air": 80,
  "Air + Water": 65,
  "Water + Water": 87,
};

export function getElementCompatScore(e1: Element, e2: Element): number {
  return COMPAT_SCORES[getElementPairKey(e1, e2)] ?? 70;
}
