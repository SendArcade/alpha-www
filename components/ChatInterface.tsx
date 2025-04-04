"use client";

import { useState } from "react";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      if (data.url) {
        console.log(data.url);  
        const alphaUrl = `https://alpha-gui.vercel.app/?project_url=${encodeURIComponent(data.url)}`;
        window.open(alphaUrl, '_blank');
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
      setMessage("");
    }
  };

  return (
    <div className="w-full bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700 p-6">
      <h2 className="text-xl text-white font-medium mb-4">What kind of game do you want to build?</h2>
      
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe your game idea..."
            className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {isLoading ? "Finding template..." : "Find Template"}
          </button>
        </div>
      </form>
    </div>
  );
}
