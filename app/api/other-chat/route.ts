import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, sb3Url } = await req.json();
    console.log("Received SB3 URL:", sb3Url);
    
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "", // You can add instructions here if needed.
        },
        { role: "user", content: message }
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.3, // Lower temperature for more consistent results
    });

    // Extract the assistant's reply
    const reply = completion?.choices?.[0]?.message?.content || "";
    return NextResponse.json({ message: reply });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
