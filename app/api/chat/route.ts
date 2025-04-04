import { NextResponse } from "next/server";
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define available templates with their URLs
const TEMPLATES = [
  {
    name: "Space Shooter",
    url: "https://example.com/templates/space-shooter.json",
    description: "Classic space shooting game"
  },
  {
    name: "Platform Game",
    url: "https://example.com/templates/platform.json",
    description: "Mario-style platformer"
  },
  // Add all your template URLs here...
];

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Respond ONLY with the URL of the most appropriate template. Nothing else.
          You are a game template suggester. Given the available templates:
${TEMPLATES.map(t => `- ${t.name}: ${t.description}`).join('\n')}`
        },
        { role: "user", content: message }
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.7,
    });

    const suggestedUrl = completion.choices[0].message.content?.trim();
    console.log(suggestedUrl);    
    return NextResponse.json({ url: suggestedUrl });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
