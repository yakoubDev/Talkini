import User from "@/models/UserSchema";
import { connectToDB } from "@/util/ConnectToDB";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { currentUserId, senderId } = await req.json();

    const currentUser = await User.findById(currentUserId);

    if (!currentUser)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    currentUser.friendRequests = currentUser.friendRequests.filter(
      (req: any) => req.from.toString() !== senderId
    );

    await currentUser.save();

    return NextResponse.json(
      { message: "Friend request declined" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error declining request" },
      { status: 500 }
    );
  }
}
