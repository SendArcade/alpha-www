import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

// This endpoint serves the latest Scratch project JSON file
// Similar to GitHub raw URLs for direct access and use
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'latest-scratch-project.json');
    
    // Check if file exists
    try {
      await fs.promises.access(filePath);
    } catch (error) {
      return NextResponse.json(
        { error: "Project file not found" },
        { status: 404 }
      );
    }
    
    // Read the file
    const fileContent = await fs.promises.readFile(filePath, 'utf8');
    
    // Return the raw file content
    return new Response(fileContent, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    console.error("Error serving project file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 