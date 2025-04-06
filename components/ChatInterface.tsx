// components/ChatInterface.tsx
"use client";

import { useState, useEffect } from "react";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sb3Url, setSb3Url] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number>(0);
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);

  // Function to open the project in Alpha using the local SB3 file
  const openInAlpha = () => {
    if (!sb3Url) return;
    const projectUrl = `${window.location.origin}${sb3Url}`;
    const alphaUrl = `https://alpha-gui.vercel.app/?project_url=${encodeURIComponent(
      projectUrl
    )}`;
    window.open(alphaUrl, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Reset state for SB3 URL and file size
    setSb3Url(null);
    setFileSize(0);

    // Add user message to chat history
    const newMessage = { role: "user" as const, content: message };
    setChatHistory((prev) => [...prev, newMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // Call your chat API to get the remote SB3 URL.
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: chatHistory }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      // Optionally add the assistant's message to history
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

          // Add a note to the assistant's message in the chat history.
          setChatHistory((prev) => {
            const newHistory = [...prev];
            const lastMessage = newHistory[newHistory.length - 1];
            if (lastMessage.role === "assistant") {
              lastMessage.content += `\n\nSB3 file saved locally at ${downloadData.localUrl}`;
            }
            return newHistory;
          });

          // Automatically open the project in Alpha after a short delay.
          setTimeout(() => {
            openInAlpha();
          }, 1000);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Optionally, verify the SB3 file is available after it is set.
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

  return (
    <div className="w-full bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700 p-6">
      <h2 className="text-xl text-white font-medium mb-4">
        What do you want to build?
      </h2>

      {/* Input Form */}
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
    </div>
  );
}
