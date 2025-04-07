import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, sb3Url } = await req.json();
    console.log("Received SB3 URL:", sb3Url);

    let projectJson = "";
    if (sb3Url) {
      const relPath = sb3Url.startsWith("/") ? sb3Url.substring(1) : sb3Url;
      const sb3Path = path.join(process.cwd(), "public", relPath);
      if (fs.existsSync(sb3Path)) {
        const zipPath = sb3Path.replace(/\.sb3$/, ".zip");
        await fs.promises.rename(sb3Path, zipPath);
        console.log("Renamed file to", zipPath);
        const zip = new AdmZip(zipPath);
        for (const entry of zip.getEntries()) {
          if (entry.entryName === "project.json") {
            projectJson = entry.getData().toString("utf8");
            break;
          }
        }
        console.log("Extracted project.json:", projectJson);
      } else {
        console.log("SB3 file not found at:", sb3Path);
      }
    }

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "meta-llama/llama-4-maverick",
      messages: [
        {
          role: "system",
          content:
            "You are given a valid JSON file of a Scratch project. Return a JSON file and nothing else.",
        },
        {
          role: "user",
          content: `${message}\n\n${projectJson}`.trim(),
        },
      ],
      temperature: 0.3,
    });

    // Use the returned choices directly.
    const reply = completion.choices?.[0]?.message?.content || "";
    console.log("LLama reply:", reply);
    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
