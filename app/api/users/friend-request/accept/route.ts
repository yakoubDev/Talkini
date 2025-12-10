import User from "@/models/UserSchema";
import { connectToDB } from "@/util/ConnectToDB";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { currentUserId, senderId } = await req.json();

    const currentUser = await User.findById(currentUserId);
    const sender = await User.findById(senderId);

    if (!currentUser || !sender)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    // Add each other as friends
    currentUser.friends.push(senderId);
    sender.friends.push(currentUserId);

    // Remove pending request
    currentUser.friendRequests = currentUser.friendRequests.filter(
      (req: any) => req.from.toString() !== senderId
    );

    await currentUser.save();
    await sender.save();

    return NextResponse.json({ message: "Friend request accepted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error accepting request" },
      { status: 500 }
    );
  }
}
