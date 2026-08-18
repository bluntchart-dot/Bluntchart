import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  const { packageName, files } = (await req.json()) as {
    packageName: string;
    files: { name: string; dataURL: string }[];
  };

  const dir = path.join(
    process.cwd(),
    "public",
    "moon-textures",
    "rendered",
    packageName
  );
  await mkdir(dir, { recursive: true });

  const saved: string[] = [];
  for (const f of files) {
    const base64 = f.dataURL.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(base64, "base64");
    const filePath = path.join(dir, f.name);
    await writeFile(filePath, buffer);
    saved.push(f.name);
  }

  return NextResponse.json({
    saved,
    directory: `public/moon-textures/rendered/${packageName}`,
    count: saved.length,
  });
}
