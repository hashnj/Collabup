// app/meeting/Chat.tsx
"use client";

import { useState } from "react";
import { SendHorizonal } from "lucide-react";

const Chat = () => {
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev, `You: ${chatInput}`]);
    setChatInput("");
  };

  return (
    <aside className="w-80 bg-gray-800 p-4 flex flex-col">
      <div className="flex-grow overflow-y-auto mb-2">
        {chatMessages.map((msg, index) => (
          <div key={index} className="bg-gray-700 p-2 rounded mb-1">{msg}</div>
        ))}
      </div>
      <div className="flex items-center">
        <input
          className="flex-grow bg-gray-700 p-2 rounded mr-2"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendChat} className="text-blue-400 hover:text-blue-300">
          <SendHorizonal className="w-5 h-5" />
        </button>
      </div>
    </aside>
  );
};

export default Chat;
