// app/api/download-sb3/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileUrl = searchParams.get("fileUrl");

  if (!fileUrl) {
    return NextResponse.json({ error: "Missing fileUrl parameter" }, { status: 400 });
  }

  try {
    // Fetch the SB3 file from the remote URL
    const remoteResponse = await fetch(fileUrl);
    if (!remoteResponse.ok) {
      throw new Error(`Failed to download file: ${remoteResponse.statusText}`);
    }
    const arrayBuffer = await remoteResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Extract filename from the remote URL (e.g. MazeRunnerMario.sb3)
    const filename = path.basename(fileUrl);
    const downloadsDir = path.join(process.cwd(), "public", "downloads");

    // Ensure the downloads directory exists
    await fs.promises.mkdir(downloadsDir, { recursive: true });

    // Write the file to disk
    const filePath = path.join(downloadsDir, filename);
    await fs.promises.writeFile(filePath, buffer);

    console.log(`Saved SB3 file to ${filePath}`);

    // Return the local URL (files in public/ are served from the root)
    return NextResponse.json({ localUrl: `/downloads/${filename}` });
  } catch (error: any) {
    console.error("Download error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
