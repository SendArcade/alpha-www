"use client";

import { useState, useEffect } from "react";

export default function ChatInterface() {
  // Existing chat state for the SB3 file process
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sb3Url, setSb3Url] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);

  // New state for the additional chat dialogue
  const [otherMessage, setOtherMessage] = useState("");
  const [isOtherLoading, setIsOtherLoading] = useState(false);
  const [otherChatHistory, setOtherChatHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);

  // Game templates with simple suggestions
  const gameTemplates = [
    "Make a Mario game",
    "Create a Space Shooter",
    "Build a Flappy Bird clone",
    "Make a Brick Breaker game",
    "Create an Endless Runner",
    "Build a 3D Ping Pong game",
    "Make a Hill Climb Racing game",
    "Create a Memory Card game",
    "Build a Whack-A-Mole game",
    "Make a Ball Game",
    "Create a Maze Game"
  ];

  // Get random suggestions
  const getRandomSuggestions = () => {
    const shuffled = [...gameTemplates].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  };

  // Function to handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  // Function to open the project in Alpha using the local SB3 file
  const openInAlpha = () => {
    if (!sb3Url) return;
    const projectUrl = `${window.location.origin}${sb3Url}`;
    const alphaUrl = `https://alpha-gui.vercel.app/?project_url=${encodeURIComponent(
      projectUrl
    )}`;
    window.open(alphaUrl, "_blank");
  };

  // Handle the main chat submission (for SB3 file generation)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Reset SB3-related state
    setSb3Url(null);
    setFileSize(0);

    // Add user message to chat history
    const newMessage = { role: "user" as const, content: message };
    setChatHistory((prev) => [...prev, newMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // Call your API endpoint to get the remote SB3 URL and project data.
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: chatHistory }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      // Add assistant message to the history (for context)
      const assistantMessage = {
        role: "assistant" as const,
        content: data.message || "",
      };
      setChatHistory((prev) => [...prev, assistantMessage]);

      // If a remote URL is provided, call the download API to save it locally.
      if (data.url) {
        const downloadResponse = await fetch(
          `/api/download-sb3?fileUrl=${encodeURIComponent(data.url)}`
        );
        const downloadData = await downloadResponse.json();
        if (downloadData.localUrl) {
          setSb3Url(downloadData.localUrl);

          // Verify file size by fetching the saved file.
          fetch(downloadData.localUrl)
            .then((response) => {
              if (!response.ok) throw new Error("File not available");
              return response.blob();
            })
            .then((blob) => {
              setFileSize(blob.size);
            })
            .catch((err) => {
              console.error("Error verifying file:", err);
            });

          // Append a note to the assistant's message.
          setChatHistory((prev) => {
            const newHistory = [...prev];
            const lastMessage = newHistory[newHistory.length - 1];
            if (lastMessage.role === "assistant") {
              lastMessage.content += `\n\nSB3 file saved locally at ${downloadData.localUrl}`;
            }
            return newHistory;
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Optionally verify the SB3 file is available after it's set.
  useEffect(() => {
    if (sb3Url) {
      fetch(sb3Url)
        .then((response) => {
          if (!response.ok) throw new Error("SB3 file not available");
          return response.blob();
        })
        .then((blob) => {
          console.log(`Verified SB3 file is available, size: ${blob.size} bytes`);
          setFileSize(blob.size);
        })
        .catch((error) => {
          console.error("Error verifying SB3 file:", error);
        });
    }
  }, [sb3Url]);

  // Handle submission for the additional chat dialogue.
  // Now we also include the sb3Url (if available) as context.
  const handleOtherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otherMessage.trim()) return;
    setIsOtherLoading(true);

    const newOtherMessage = { role: "user" as const, content: otherMessage };
    setOtherChatHistory((prev) => [...prev, newOtherMessage]);
    setOtherMessage("");

    try {
      // Pass the sb3Url along with the message and history to the other chat API.
      const response = await fetch("/api/other-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: otherMessage,
          history: otherChatHistory,
          sb3Url, // include the SB3 file URL here
        }),
      });

      if (!response.ok)
        throw new Error("Failed to get response from other API");

      const data = await response.json();
      const assistantOtherMessage = {
        role: "assistant" as const,
        content: data.message || "",
      };
      setOtherChatHistory((prev) => [...prev, assistantOtherMessage]);
    } catch (error) {
      console.error("Error in other chat:", error);
    } finally {
      setIsOtherLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Main Chat Interface */}
      <div className="w-full bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700 p-6">
        <h2 className="text-xl text-white font-medium mb-4">
          What do you want to build?
        </h2>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe what you'd like to build..."
              className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {isLoading ? "Processing..." : "Submit"}
            </button>

            {isLoading && (
              <div className="mt-3 text-gray-300">
                Processing your request...
              </div>
            )}

            {sb3Url && (
              <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                <h3 className="text-white text-lg mb-2">Alpha Project Ready</h3>
                <p className="text-gray-300 mb-2">
                  Your Alpha project has been generated successfully!
                </p>

                <div className="flex items-center mb-3">
                  <span className="text-gray-300 mr-2">Size:</span>
                  <span className="bg-gray-800 px-2 py-1 rounded font-mono text-green-400">
                    {(fileSize / 1024).toFixed(2)} KB
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-white mb-1">Open in Alpha</h4>
                    <button
                      onClick={openInAlpha}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors w-full"
                    >
                      Open Project in Alpha
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Suggestions Section - Moved outside the form */}
        <div className="mt-4">
          <h3 className="text-gray-300 text-sm mb-2">Try these ideas:</h3>
          <div className="flex flex-wrap gap-2">
            {getRandomSuggestions().map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-full text-sm transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Chat Dialogue - Temporarily Commented Out
      {sb3Url && (
        <div className="w-full bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700 p-6">
          <h2 className="text-xl text-white font-medium mb-4">
            Additional Chat Dialogue
          </h2>

          <div className="mb-4 max-h-64 overflow-y-auto">
            {otherChatHistory.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  msg.role === "assistant" ? "text-green-400" : "text-white"
                }`}
              >
                <strong>{msg.role}:</strong> {msg.content}
              </div>
            ))}
          </div>

          <form onSubmit={handleOtherSubmit} className="w-full">
            <div className="relative">
              <input
                type="text"
                value={otherMessage}
                onChange={(e) => setOtherMessage(e.target.value)}
                placeholder="Enter your additional message..."
                className="w-full bg-gray-900 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={isOtherLoading}
                className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                {isOtherLoading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      )}
      */}
    </div>
  );
}
