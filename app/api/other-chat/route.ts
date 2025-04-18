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
    let zipPath = "";
    if (sb3Url) {
      const relPath = sb3Url.startsWith("/") ? sb3Url.substring(1) : sb3Url;
      const sb3Path = path.join(process.cwd(), "public", relPath);
      if (fs.existsSync(sb3Path)) {
        // Rename the .sb3 file to .zip
        zipPath = sb3Path.replace(/\.sb3$/, ".zip");
        await fs.promises.rename(sb3Path, zipPath);
        console.log("Renamed file to", zipPath);

        // Open the zip and extract project.json content
        const zip = new AdmZip(zipPath);
        const projEntry = zip.getEntry("project.json");
        if (projEntry) {
          projectJson = projEntry.getData().toString("utf8");
        }
        // console.log("Extracted project.json:", projectJson);
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
            `You are provided with a valid JSON file representing a Scratch project. Make only the requested modifications with minimal changes while preserving all existing properties and structure. Return only the modified, complete JSON file and nothing else. JSON file: ${projectJson}`,
        },
        {
          role: "user",
          content: message.trim(),
        },
      ],
      temperature: 0.3,
    });

    const reply = completion.choices?.[0]?.message?.content || "";
    console.log("LLama reply (new project.json):", reply);

    // Repackage: update project.json inside the zip with the full new JSON.
    if (zipPath) {
      // Open the existing zip archive.
      const zip = new AdmZip(zipPath);
      // Delete any existing "project.json" entry.
      zip.deleteFile("project.json");
      // Add the new project.json with the full reply.
      zip.addFile("project.json", Buffer.from(reply, "utf8"), "New project.json content");
      // Write the updated ZIP back to disk.
      zip.writeZip(zipPath);

      // OPTIONAL: Re-read the entry to verify the full content was written.
      const updatedZip = new AdmZip(zipPath);
      const updatedEntry = updatedZip.getEntry("project.json");
      if (updatedEntry) {
        const updatedContent = updatedEntry.getData().toString("utf8");
        console.log("Updated project.json content length:", updatedContent.length);
      } else {
        console.log("Failed to update project.json in the zip file");
      }

      // Rename the updated zip file back to .sb3.
      const newSb3Path = zipPath.replace(/\.zip$/, ".sb3");
      await fs.promises.rename(zipPath, newSb3Path);
      console.log("Repacked and renamed file to", newSb3Path);
    }

    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
