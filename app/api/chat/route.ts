import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Prepare messages for Groq
    const messages = [
      {
        role: "system",
        content:
          "You are a helpful AI assistant focused on helping users build and develop software applications.",
      },
      ...history,
      { role: "user", content: message },
    ];

    // Create a streaming response
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();

    // Start the Groq API call in the background
    (async () => {
      try {
        const chatCompletion = await groq.chat.completions.create({
          messages,
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          max_completion_tokens: 1024,
          top_p: 1,
          stream: true,
          stop: null,
        });

        for await (const chunk of chatCompletion) {
          const content = chunk.choices[0]?.delta?.content || "";
          await writer.write(encoder.encode(content));
        }

        await writer.close();
      } catch (error) {
        console.error("Error in Groq API:", error);
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
