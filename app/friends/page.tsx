"use client";

import { useUser } from "@/store/authStore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FriendsList() {
  const [friends, setFriends] = useState([]);
  const user = useUser();

  useEffect(() => {
    if (!user?._id) return;
    const fetchFriends = async () => {
      const response = await fetch(`/api/users/friends?userId=${user?._id}`);
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message || "Failed to fetch friends");
      }

      setFriends(result.friends);
    };

    fetchFriends();
  }, [user?._id]);

  if (!user) return;
  return (
    <div className="p-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold ">Friends List</h1>

        <div className="flex items-center gap-2">
          <Link href={"/friends/requests"}>
            <button className="bg-blue-600 hover:bg-blue-600/90 text-white p-1 rounded cursor-pointer">
              Requests
            </button>
          </Link>
          <Link href={"/friends/add"}>
            <button className="bg-blue-600 hover:bg-blue-600/90 text-white p-1 rounded cursor-pointer">
              Add Friend
            </button>
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {friends.map((u: any) => (
          <div
            key={u._id}
            className="p-3 border rounded-lg flex justify-between"
          >
            <p className="font-semibold">{u.username}</p>

            <Link
              href={`/chat/${u._id}`}
              className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
            >
              Chat
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
