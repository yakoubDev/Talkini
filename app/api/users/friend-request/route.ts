import User from "@/models/UserSchema";
import { connectToDB } from "@/util/ConnectToDB";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    await connectToDB();

    const { from, to } = await req.json();

    if (!from || !to)
      return NextResponse.json({ message: "Invalid data" }, { status: 400 });

    if (from === to)
      return NextResponse.json(
        { message: "You cannot add yourself" },
        { status: 400 }
      );

    const receiver = await User.findById(to);
    const sender = await User.findById(from);

    if (!receiver || !sender)
      return NextResponse.json({ message: "User not found" }, { status: 404 });

    // Check if already friends
    if (receiver.friends.includes(from))
      return NextResponse.json({ message: "Already friends" }, { status: 400 });

    // Check if request already sent
    const alreadyRequested = receiver.friendRequests.some(
      (req: any) => req.from.toString() === from
    );

    if (alreadyRequested)
      return NextResponse.json(
        { message: "Friend request already sent" },
        { status: 400 }
      );

    // Push request
    receiver.friendRequests.push({ from });
    await receiver.save();

    return NextResponse.json(
      { message: "Friend request sent" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error sending request" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const user = await User.findById(userId).populate(
    "friendRequests.from",
    "username _id"
  );

  return NextResponse.json({ requests: user.friendRequests });
}
