import { NextResponse } from "next/server";
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define available templates with their URLs
const TEMPLATES = [
  {
    name: "3D Ping Pong",
    url: "https://raw.githubusercontent.com/SendArcade/alpha-www/main/public/games/3DPingPong.sb3",
    description: "Experience a dynamic 3D ping pong challenge with realistic physics."
  },
  {
    name: "Brick Breaker",
    url: "https://raw.githubusercontent.com/SendArcade/alpha-www/main/public/games/BrickBreaker.sb3",
    description: "Break through walls of bricks with precision and exciting power-ups."
  },
  {
    name: "Endless Runner",
    url: "https://raw.githubusercontent.com/SendArcade/alpha-www/main/public/games/EndlessRunnerGames.sb3",
    description: "Race through an endless course full of obstacles and non-stop action."
  },
  {
    name: "Flappy Bird",
    url: "https://raw.githubusercontent.com/SendArcade/alpha-www/main/public/games/FlappyBird.sb3",
    description: "Guide your bird through challenging gaps in this addictive arcade classic."
  },
  {
    name: "Hill Climb Racing",
    url: "https://raw.githubusercontent.com/SendArcade/alpha-www/main/public/games/HillClimbRacing.sb3",
    description: "Conquer rugged terrains and steep hills in this thrilling driving game."
  },
  {
    name: "Maze Game",
    url: "https://raw.githubusercontent.com/SendArcade/alpha-www/main/public/games/MazeGame.sb3",
    description: "Navigate intricate mazes and test your puzzle-solving skills."
  },
  {
    name: "Maze Runner Mario",
    url: "https://raw.githubusercontent.com/SendArcade/alpha-www/main/public/games/MazeRunnerMario.sb3",
    description: "Embark on a maze adventure with a fun twist reminiscent of classic Mario."
  },
  {
    name: "Memory Card Game",
    url: "https://raw.githubusercontent.com/SendArcade/alpha-www/main/public/games/MemoryCardGame.sb3",
    description: "Challenge your memory with an engaging and fast-paced card matching game."
  },
  {
    name: "Space Shooter",
    url: "https://raw.githubusercontent.com/SendArcade/alpha-www/main/public/games/SpaceShooter.sb3",
    description: "Pilot your spaceship and blast through waves of enemy forces in space."
  },
  {
    name: "Whack-A-Mole",
    url: "https://raw.githubusercontent.com/SendArcade/alpha-www/main/public/games/whackAMole.sb3",
    description: "Test your reflexes in a fast-paced game where quick hits are key."
  }
];


export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a template matcher. DO NOT suggest any other URLs. 
Respond ONLY with the URL, nothing else. You must ONLY respond with one of these exact URLs:

${TEMPLATES.map(t => t.url).join('\n')}

Based on the user's request, pick the most appropriate URL from this list. 
`
        },
        { role: "user", content: message }
      ],
      model: "gpt-4-turbo-preview",
      temperature: 0.3, // Lower temperature for more consistent results
    });

    const suggestedUrl = completion.choices[0].message.content?.trim();

    // Validate that the suggested URL is in our template list
    if (!TEMPLATES.some(t => t.url === suggestedUrl)) {
      return NextResponse.json({ error: "Invalid template URL" }, { status: 400 });
    }

    return NextResponse.json({ url: suggestedUrl });

  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
