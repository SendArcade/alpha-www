"use client";
import React from "react";
import SuggestionCard from "@/components/SuggestionCard";
import Navbar from "@/components/Layout/Navbar";

// List of game templates
const templates = [
  {
    name: "Ball Game",
    url: "https://raw.githubusercontent.com/SendArcade/alpha-www/main/public/games/BallGame.sb3",
    description: "A very simple ball game."
  },
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

export default function GamesPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white mt-10">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">All Game Templates</h1>
          <p className="text-gray-400">Browse and open any of the available sample projects.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((t, idx) => (
            <SuggestionCard
              key={idx}
              embedUrl={`https://alpha-gui.vercel.app/embed.html?autoplay&project_url=${encodeURIComponent(
                t.url
              )}`}
              name={t.name}
              description={t.description}
              onOpen={() => window.open(
                `https://alpha-gui.vercel.app/?project_url=${encodeURIComponent(t.url)}`,
                "_blank"
              )}
            />
          ))}
        </div>
      </main>
    </div>
  );
} 