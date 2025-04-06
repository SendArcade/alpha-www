import { NextResponse } from "next/server";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import AdmZip from "adm-zip";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, sb3Url } = await req.json();
    console.log("Received SB3 URL:", sb3Url);

    if (sb3Url) {
      // Remove leading slash if present to form a relative path
      const relativePath = sb3Url.startsWith("/") ? sb3Url.substring(1) : sb3Url;
      // Full path of the SB3 file in the public folder
      const sb3Path = path.join(process.cwd(), "public", relativePath);
      
      if (fs.existsSync(sb3Path)) {
        // Rename the file from .sb3 to .zip
        const zipPath = sb3Path.replace(/\.sb3$/, ".zip");
        await fs.promises.rename(sb3Path, zipPath);
        console.log(`Renamed file to ${zipPath}`);

        // Use AdmZip to open the zip file and extract project.json
        const zip = new AdmZip(zipPath);
        const zipEntries = zip.getEntries();
        let projectJsonContent = "";
        for (const entry of zipEntries) {
          if (entry.entryName === "project.json") {
            projectJsonContent = entry.getData().toString("utf8");
            break;
          }
        }
        if (projectJsonContent) {
          console.log("Extracted project.json content:", projectJsonContent);
        } else {
          console.log("project.json not found in the zip file");
        }
      } else {
        console.log("SB3 file not found at:", sb3Path);
      }
    }

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Proceed with OpenAI call (if needed)
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "", // Add system instructions if necessary.
        },
        { role: "user", content: message },
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.3,
    });

    // Extract the assistant's reply
    const reply = completion?.choices?.[0]?.message?.content || "";
    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
