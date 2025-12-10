"use client";

import socket from "@/lib/socket";
import { useUser } from "@/store/authStore";
import { useParams } from "next/navigation";
import { ReactEventHandler, useEffect, useState } from "react";

export default function ChatPage() {
  const params = useParams();
  const otherUserId = params.userId;
  const user = useUser();
  const currentUserId = user?._id;

  const roomId =
    currentUserId && otherUserId
      ? [currentUserId, otherUserId].sort().join("_")
      : null;

  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    if (!roomId || !currentUserId) return;

    if (!socket.connected) socket.connect();
    socket.emit("joinRoom", roomId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [roomId, currentUserId]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentUserId || !otherUserId) return;

      const res = await fetch(
        `/api/messages?user1=${currentUserId}&user2=${otherUserId}`
      );
      const data = await res.json();

      setMessages(data.messages);
    };

    fetchHistory();
  }, [currentUserId, otherUserId]);

  const send = () => {
    if (!input.trim()) return;

    socket.emit("sendMessage", {
      text: input,
      senderId: currentUserId,
      roomId,
    });

    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto h-[90dvh] flex flex-col">
      <h1 className="text-xl font-bold mb-4">Chat</h1>

      <div className="flex flex-col w-full space-y-2 mb-4 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded max-w-[80%] ${
              m.sender === currentUserId
                ? "ml-auto bg-blue-600 text-white"
                : "mr-auto bg-gray-200 text-black"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border p-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={handleKeyPress}
        />
        <button
          onClick={send}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
