import { NextResponse } from "next/server";
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Store the latest JSON response
let latestJsonResponse = '{}';

// Function to save the JSON to a file
const saveResponseToFile = async (content: string) => {
  try {
    // Try to parse the JSON to validate it
    let jsonContent = content;
    
    // First, try to extract JSON if there's any markdown or text surrounding it
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonContent = jsonMatch[0];
    }
    
    // Attempt to parse and validate the JSON
    let parsedJson: any;
    try {
      parsedJson = JSON.parse(jsonContent);
      console.log('Response is valid JSON');
      
      // Validate essential Scratch 3.0 properties and add them if missing
      if (!parsedJson.targets || !Array.isArray(parsedJson.targets) || parsedJson.targets.length === 0) {
        console.error('Invalid Scratch project: missing targets array');
        throw new Error('Invalid Scratch project format');
      }
      
      // Ensure stage exists and has required properties
      const stageTarget = parsedJson.targets.find((t: any) => t.isStage === true);
      if (!stageTarget) {
        console.error('Invalid Scratch project: no stage target found');
        throw new Error('Invalid Scratch project format');
      }
      
      // Ensure videoState exists
      if (!stageTarget.videoState) {
        console.log('Adding missing videoState property to stage');
        stageTarget.videoState = "on";
      }
      
      // Ensure other required properties exist
      for (const target of parsedJson.targets) {
        if (!target.comments) target.comments = {};
        if (!target.layerOrder && target.layerOrder !== 0) {
          target.layerOrder = target.isStage ? 0 : parsedJson.targets.indexOf(target);
        }
        
        // Ensure costume properties
        if (target.costumes && Array.isArray(target.costumes)) {
          target.costumes.forEach((costume: any) => {
            if (!costume.bitmapResolution) costume.bitmapResolution = 1;
            if (!costume.md5ext && costume.assetId) {
              costume.md5ext = `${costume.assetId}.${costume.dataFormat || 'svg'}`;
            }
          });
        }
      }
      
      // Ensure monitors array exists
      if (!parsedJson.monitors) parsedJson.monitors = [];
      
      // Update the jsonContent with fixed JSON
      jsonContent = JSON.stringify(parsedJson, null, 2);
      
    } catch (parseError) {
      console.error('Failed to parse or fix JSON:', parseError);
      // Keep original content if we can't fix it
    }
    
    // Save to file
    const filePath = path.join(process.cwd(), 'public', 'latest-scratch-project.json');
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    await fs.promises.writeFile(filePath, jsonContent, 'utf8');
    
    // Also save a backup with timestamp for debugging
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupPath = path.join(process.cwd(), 'public', `scratch-project-${timestamp}.json`);
    await fs.promises.writeFile(backupPath, jsonContent, 'utf8');
    
    console.log('Saved JSON response to file, size:', jsonContent.length, 'bytes');
    
    // Update the latest response with the validated JSON
    latestJsonResponse = jsonContent;
  } catch (error) {
    console.error('Error saving JSON to file:', error);
  }
};

// GET handler to retrieve the latest JSON
export async function GET() {
  // Return the raw JSON string directly with proper content type
  // This mimics how GitHub raw URLs serve content
  return new Response(latestJsonResponse, {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*", // Allow cross-origin requests
      "Cache-Control": "no-cache"
    }
  });
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Read example JSON from file
    const exampleJSONPath = path.join(process.cwd(), 'app/api/chat', 'example.json');
    const exampleJSON = fs.readFileSync(exampleJSONPath, 'utf8');
    console.log('Example JSON:', exampleJSON);  
    
    // Prepare messages for OpenAI
    const messages = [
      {
        role: "system",
        content:
          `Generate a fully valid Scratch 3.0 project.json file that can be directly used in an .sb3 file.
Ensure that:

Stage & Sprites
The project has a Stage object with a default Scratch backdrop.
Sprites have correct name, costumes, variables, lists, and blocks.
Blocks & Scripting
All blocks follow Scratch 3.0 JSON format, using valid opcode values.
event_whenkeypressed, motion_changexby, control_create_clone_of, and similar blocks must be correctly structured.
Use the correct data types for inputs (e.g., numbers instead of strings).
Fix cloning issues: control_create_clone_of should reference "_myself_" instead of "myself".
JSON Validity
The JSON must strictly conform to Scratch's schema.
Every sprite must have "objName" and "name" fields if required.
No unnecessary properties should be added.
The project should load without errors in the Scratch editor when packed into an .sb3 file.
DO NOT RETURN ANY EXTRA TEXT OR EXPLANATION. ONLY RETURN VALID JSON.

This is an example shooting game: ${exampleJSON}

Your response should be ONLY the valid JSON with no explanations or markdown formatting.`
      },
      ...history,
      { role: "user", content: message },
    ];

    // Create a streaming response
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Reset the latest response
    latestJsonResponse = '';
    let fullResponse = '';

    // Start the OpenAI API call in the background
    (async () => {
      try {
        const chatCompletion = await openai.chat.completions.create({
          messages,
          model: "gpt-4-turbo-preview", // or your preferred OpenAI model
          temperature: 0.7,
          top_p: 1,
          stream: true,
        });

        for await (const chunk of chatCompletion) {
          const content = chunk.choices[0]?.delta?.content || "";
          fullResponse += content;
          await writer.write(encoder.encode(content));
        }

        console.log('Response streaming complete, total length:', fullResponse.length);
        
        await saveResponseToFile(fullResponse);
        await writer.close();
      } catch (error) {
        console.error("Error in OpenAI API:", error);
        await writer.write(encoder.encode("Sorry, I encountered an error."));
        await writer.close();
      }
    })();

    // Return the stream
    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
