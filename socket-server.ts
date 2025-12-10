import * as dotenv from 'dotenv';
dotenv.config();

import { Server } from "socket.io";
import http from "http";
import express from "express";
import { createMessage } from "@/lib/CreateMessage";
import { connectToDB } from "@/util/ConnectToDB";

async function startServer() {
  try {
    await connectToDB();
    const app = express();
    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
      },
    });
    const onlineUsers = new Map();

    io.on("connection", (socket) => {
      socket.on("registerUser", (userId) => {
        onlineUsers.set(userId, socket.id);
      });

      socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
      });

      socket.on("sendMessage", async (msg) => {
        const { senderId, roomId, text } = msg;

        const newMessage = await createMessage(senderId, roomId, text);

        if (!newMessage) {
          return;
        }
        io.to(roomId).emit("receiveMessage", newMessage);
      });

      socket.on("disconnect", () => {
        for (const [userId, id] of onlineUsers.entries()) {
          if (id === socket.id) {
            onlineUsers.delete(userId);
            break;
          }
        }
      });
    });

    server.listen(3001, () => console.log("Socket server running on port 3001"));
  } catch (error) {
    console.error("Server initialization failed:", error);
    process.exit(1);
  }
}

startServer();