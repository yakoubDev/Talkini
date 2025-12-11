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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-900 page-paddings">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">Friends</h1>
            <p className="text-slate-400 mt-1">
              {friends.length} {friends.length === 1 ? 'friend' : 'friends'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/friends/requests">
              <button className="btn  bg-slate-800 hover:bg-slate-700 shadow-lg shadow-slate-900">
                Requests
              </button>
            </Link>
            <Link href="/friends/add">
              <button className="btn">
                Add Friend
              </button>
            </Link>
          </div>
        </div>

        {/* Friends List */}
        {friends.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
            <div className="text-5xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">No friends yet</h3>
            <p className="text-slate-400 mb-6">Start connecting with people on Talkini</p>
            <Link href="/friends/add">
              <button className="btn bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-600/20">
                Add Your First Friend
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {friends.map((u: any) => (
              <div
                key={u._id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between hover:border-slate-600 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {u.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100 text-lg">{u.username}</p>
                    <p className="text-sm text-slate-400">Online</p>
                  </div>
                </div>

                <div>

                <Link href={`/chat/${u._id}`}>
                  <button className="btn bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 px-5 py-2">
                    Chat
                  </button>
                </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}