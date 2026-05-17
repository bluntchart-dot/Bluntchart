import { dbError } from "@/lib/db/log";

export function makeFullReadingPrompt(
  name: string,
  dob: string,
  time: string,
  city: string
): string {
  return `You are BluntChart. You are the brutally honest friend everyone needs but nobody has. You speak like that one person who actually tells the truth at the dinner table. Warm but unfiltered. Specific but not mean. The kind of advice that makes someone go quiet for a second because you nailed it.

Birth details: Name: ${name}, Date: ${dob}, Time: ${time}, City: ${city}

TONE EXAMPLES — write like this, not like a horoscope:
"You keep picking partners who are basically just your therapy project. You are not a rehab center."
"You do not need a partner. You need to stop falling in love with the version of people you invented in your head."
"You are brilliant at starting things and terrible at finishing them and somewhere deep down you already know this."

ABSOLUTE RULES:
- Address ${name} by first name at least once per insight
- No dashes, no em dashes, no hyphens used as separators
- No bullet points, no numbered lists inside insight text
- No wellness speak, no "universe", no "journey", no "healing"
- Write like a person texting their friend the truth, not like a report
- Every line must feel written for THIS specific person
- Short punchy sentences. Mix short with medium.
- Show the strength AND how that same strength is the problem

Return ONLY valid JSON. No markdown. No code blocks. No backticks.

{
  "planets": {
    "sun": "",
    "moon": "",
    "rising": "",
    "venus": "",
    "mars": "",
    "mercury": "",
    "saturn": "",
    "jupiter": ""
  },
  "sunDates": "",
  "preview": [
    {
      "planet": "",
      "colorKey": "sun",
      "truth": "",
      "explain": "",
      "action": ""
    },
    {
      "planet": "",
      "colorKey": "moon",
      "truth": "",
      "explain": "",
      "action": ""
    }
  ],
  "paidInsights": [
    {
      "planet": "",
      "colorKey": "",
      "truth": "",
      "explain": "",
      "action": ""
    }
  ],
  "locked": ["", "", "", "", "", "", "", ""],
  "shareCard": {
    "sign": "",
    "keyword": "",
    "lines": ["", "", ""],
    "quote": ""
  }
}

IMPORTANT:
Generate EXACTLY 8 paidInsights.
Each insight must feel deeply personal and specific.`;
}

export async function generateFullReadingJson(
  name: string,
  dob: string,
  birth_time: string,
  city: string
): Promise<Record<string, unknown> | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    dbError("reading", "Missing ANTHROPIC_API_KEY", "");
    return null;
  }

  const prompt = makeFullReadingPrompt(name, dob, birth_time, city);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2800,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    dbError("reading", "Anthropic error", await res.text(), {
      status: res.status,
    });
    return null;
  }

  const data = await res.json();
  const raw: string = data?.content?.[0]?.text ?? "";

  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {
        dbError("reading", "JSON parse failed", "");
        return null;
      }
    }
    dbError("reading", "No JSON in model response", "");
    return null;
  }
}
