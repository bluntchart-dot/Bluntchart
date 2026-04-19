import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, dob, tob, place, concern } = body;

    const prompt = `
You are a brutally honest astrologer.

User Details:
Name: ${name}
Date of Birth: ${dob}
Time of Birth: ${tob}
Place of Birth: ${place}

Main Concern:
${concern}

Give a highly personal astrology reading.

Rules:
- Make it emotional
- Deeply specific
- Talk about love, money, mindset, future
- Slightly controversial but believable
- Feels like you know them
- Use modern language
- 400-600 words
`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 900,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();

    const reading =
      data?.content?.[0]?.text || "Could not generate reading.";

    return NextResponse.json({ reading });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}