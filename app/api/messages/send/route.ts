
import Message from "@/models/MessageSchema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { senderId, receiverId, text } = body;

  const msg = await Message.create({
    sender: senderId,
    receiver: receiverId,
    text,
  });

  return NextResponse.json({ message: msg });
}
