"use client";

import { useUser } from "@/store/authStore";
import { User } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const AddFriend = () => {
  const router = useRouter(); 
  const [search, setSearch] = useState("");
  const [foundUsers, setFoundUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(false);

  const user = useUser();

  const handleSearch = async () => {
    if (!search.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/users?search=${search}`);
      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Something went wrong");
        return;
      }

      setFoundUsers(result.users);
    } catch (err) {
      toast.error("Failed to search users");
    } finally {
      setLoading(false);
    }
  };

  const sendFriendRequest = async (userId: string) => {
    try {
      const response = await fetch("/api/users/friend-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: user?._id,
          to: userId,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.message || "Failed to send friend request");
        return;
      }

      toast.success("Friend Request Sent!");
    } catch (error) {
      toast.error("Something went wrong...");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 page-paddings">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">Add Friend</h1>
          <p className="text-slate-400 mt-1">
            Search and connect with people on Talkini
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Search by username
          </label>
          <div className="flex gap-3">
            <input
              placeholder="Enter username..."
              className="input flex-1"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              onClick={handleSearch}
              disabled={loading || !search.trim()}
              className="btn"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-3">
          {foundUsers !== null && foundUsers.length === 0 && (
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-12 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-100 mb-2">
                No users found
              </h3>
              <p className="text-slate-400">
                Try searching with a different username
              </p>
            </div>
          )}

          {foundUsers && foundUsers.length > 0 && (
            <div>
              <p className="text-sm text-slate-400 mb-3">
                Found {foundUsers.length}{" "}
                {foundUsers.length === 1 ? "user" : "users"}
              </p>
              {foundUsers.map((u) => (
                <div
                  key={u._id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-3 flex items-center justify-between hover:border-slate-600 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {u.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-100 text-lg">
                        {u.username}
                      </p>
                      <p className="text-sm text-slate-400">{u.email}</p>
                    </div>
                  </div>

                  {user?.friends?.includes(u._id) ? (
                    <button onClick={() => router.push(`/chat/${u._id}`)} className="btn">Message</button>
                  ) : (
                    <button
                      onClick={() => sendFriendRequest(u._id)}
                      className="btn"
                    >
                      Add Friend
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddFriend;
