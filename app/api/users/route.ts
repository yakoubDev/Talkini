import User from "@/models/UserSchema";
import { connectToDB } from "@/util/ConnectToDB";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    await connectToDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const users = await User.find({
      username: { $regex: search, $options: "i" },
    }).select("_id username");

    return NextResponse.json({ users }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
