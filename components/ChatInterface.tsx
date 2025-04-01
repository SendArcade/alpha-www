"use client";

import { useState, useEffect } from "react";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [jsonUrl, setJsonUrl] = useState<string | null>(null);
  const [jsonSize, setJsonSize] = useState<number>(0);
  const [chatHistory, setChatHistory] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);

  // Function to open the project in Thurl
  const openInThurl = () => {
    if (!jsonUrl) return;
    
    const projectUrl = `${window.location.origin}${jsonUrl}`;
    const thurlUrl = `https://alpha-gui.vercel.app/?project_url=${encodeURIComponent(projectUrl)}`;
    window.open(thurlUrl, '_blank');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Log user input
    console.log("User wants to build:", message);

    // Reset JSON URL and size
    setJsonUrl(null);
    setJsonSize(0);

    // Add user message to chat history (kept for API context)
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

      // Add assistant message placeholder to history (for API context)
      const assistantMessage = { role: "assistant" as const, content: "" };
      setChatHistory((prev) => [...prev, assistantMessage]);

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No reader available");

      let fullResponse = "";
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);
        fullResponse += chunk;
        
        // Update the last message in history (for API context)
        setChatHistory((prev) => {
          const newHistory = [...prev];
          const lastMessage = newHistory[newHistory.length - 1];
          if (lastMessage.role === "assistant") {
            lastMessage.content += chunk;
          }
          return newHistory;
        });
      }
      
      // Log the complete response
      console.log("Complete AI response:", fullResponse);
      setJsonSize(fullResponse.length);

      // Set the JSON URL - using raw file endpoint
      const apiUrl = "/api/scratch-file";
      setJsonUrl(apiUrl);
      
      // Add a note about the JSON being ready
      setChatHistory(prev => {
        const newHistory = [...prev];
        const lastMessage = newHistory[newHistory.length - 1];
        if (lastMessage.role === "assistant") {
          lastMessage.content += `\n\nJSON saved successfully! You can access it at ${apiUrl}`;
        }
        return newHistory;
      });

      // Automatically open in Thurl after a short delay to ensure the file is saved
      setTimeout(() => {
        openInThurl();
      }, 1000);
      
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verify JSON is available after generation
  useEffect(() => {
    if (jsonUrl) {
      // Check if the file exists and its size
      fetch(jsonUrl)
        .then(response => {
          if (!response.ok) throw new Error('JSON file not available');
          return response.text();
        })
        .then(text => {
          console.log(`Verified JSON file is available, size: ${text.length} bytes`);
          setJsonSize(text.length);
        })
        .catch(error => {
          console.error('Error verifying JSON file:', error);
        });
    }
  }, [jsonUrl]);

  return (
    <div className="w-full bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700 p-6">
      <h2 className="text-xl text-white font-medium mb-4">What do you want to build?</h2>
      
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

          {jsonUrl && (
            <div className="mt-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
              <h3 className="text-white text-lg mb-2">Alpha Project Ready</h3>
              <p className="text-gray-300 mb-2">
                Your Alpha project has been generated successfully!
              </p>
              
              <div className="flex items-center mb-3">
                <span className="text-gray-300 mr-2">Size:</span>
                <span className="bg-gray-800 px-2 py-1 rounded font-mono text-green-400">
                  {(jsonSize / 1024).toFixed(2)} KB
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <h4 className="text-white mb-1">Open in Alpha</h4>
                  <button
                    onClick={openInThurl}
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
