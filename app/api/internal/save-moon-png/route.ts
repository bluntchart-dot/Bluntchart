import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const { name, dataURL } = await req.json();
  const base64 = dataURL.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64, "base64");
  const filename = name.toLowerCase().replace(/\s+/g, "-") + ".png";
  const filePath = path.join(
    process.cwd(),
    "public",
    "moon-textures",
    "rendered",
    filename
  );
  await writeFile(filePath, buffer);
  return NextResponse.json({ saved: filename, size: buffer.length });
}
