"use client";

import { useState, useRef, useEffect } from "react";
import { LinkIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message to chat
    const newMessage = { role: "user" as const, content: message };
    setChatHistory((prev) => [...prev, newMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, history: chatHistory }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      // Add assistant message placeholder
      const assistantMessage = { role: "assistant" as const, content: "" };
      setChatHistory((prev) => [...prev, assistantMessage]);

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);

        // Update the last message (assistant's message) with the new chunk
        setChatHistory((prev) => {
          const newHistory = [...prev];
          const lastMessage = newHistory[newHistory.length - 1];
          if (lastMessage.role === "assistant") {
            lastMessage.content += chunk;
          }
          return newHistory;
        });
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700">
      {/* Chat History */}
      <div className="h-full min-h-[300px] max-h-[calc(100vh-10rem)] overflow-y-auto p-4 space-y-4">
        {chatHistory.map((chat, index) => (
          <div
            key={index}
            className={`flex ${
              chat.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                chat.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-200"
              }`}
            >
              {chat.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-700 text-gray-200 rounded-lg p-3">
              Thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="border-t border-gray-700 p-4">
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can I help you today?"
            className="w-full bg-gray-900 text-white rounded-lg pl-4 pr-20 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {/* <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-2">
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-300"
            >
              <LinkIcon className="w-5 h-5" />
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-gray-300"
            >
              <SparklesIcon className="w-5 h-5" />
            </button> */}
          {/* </div> */}
        </div>
      </form>
    </div>
  );
}
