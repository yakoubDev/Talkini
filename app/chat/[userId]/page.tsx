"use client";

import socket from "@/lib/socket";
import { useUser } from "@/store/authStore";
import { Send } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";

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
  const [otherUser, setOtherUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    const fetchOtherUser = async () => {
      if (!otherUserId) return;

      const res = await fetch(`/api/users/${otherUserId}`);
      const data = await res.json();

      setOtherUser(data.user);
    };

    fetchHistory();
    fetchOtherUser();
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
    <div className="min-h-[93dvh] bg-slate-900 flex flex-col">
      {/* Chat Header */}
      <div className=" border-b border-slate-700 px-6 py-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          {otherUser?.username?.[0]?.toUpperCase() || "?"}
        </div>
        <div>
          <Link href={`/profile/${otherUser?._id}`}>
            <h1 className="text-lg font-semibold text-slate-100">
              {otherUser?.username || "Loading..."}
            </h1>
            <p className="text-sm text-slate-400">Online</p>
          </Link>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-5xl mb-4">💬</div>
              <p className="text-slate-400">
                No messages yet. Start the conversation!
              </p>
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${
              m.sender === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-3 rounded-2xl ${
                m.sender === currentUserId
                  ? "bg-blue-600 text-white rounded-br-sm"
                  : "bg-slate-800 text-slate-100 rounded-bl-sm"
              }`}
            >
              <p className="break-words">{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Container */}
      <div className=" border-t border-slate-700 p-4">
        <div className=" mx-auto flex gap-3">
          <input
            className="input flex-1"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={handleKeyPress}
          />
          <button onClick={send} disabled={!input.trim()} className="btn px-6">
            <Send />
          </button>
        </div>
      </div>
    </div>
  );
}
