"use client";

import { useUser } from "@/store/authStore";
import { User } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

const AddFriend = () => {
  const [search, setSearch] = useState("");
  const [foundUsers, setFoundUsers] = useState<User[] | null>(null);

  const user = useUser();

  const handleSearch = async () => {
    if (!search.trim()) return;

    try {
      const response = await fetch(`/api/users?search=${search}`);
      const result = await response.json();

      if (!response.ok) {
        console.log(result.message || "Something went wrong");
        return;
      }

      setFoundUsers(result.users);
    } catch (err) {
      console.log(err);
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

      toast.success("Friend Request Sent !");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong...");
    }
  };

  return (
    <div className="h-screen w-full p-4 flex justify-center">
      <div className="min-w-8xl p-4">
        <h1 className="font-bold text-2xl">Add Friend</h1>
        <p>You can add friends by username</p>

        {/* Search bar */}
        <div className="flex items-center gap-2 mt-3">
          <input
            placeholder="Search usernames"
            className="bg-slate-900 text-white px-2 py-1 rounded focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={handleSearch} className="btn">
            Search
          </button>
        </div>

        {/* Results */}
        <div className="mt-6 space-y-3">
          {foundUsers !== null && foundUsers.length === 0 && (
            <p>No users found.</p>
          )}

          {foundUsers &&
            foundUsers.map((u) => (
              <div
                key={u._id}
                className="p-2 bg-slate-800 rounded text-white flex items-center justify-between"
              >
                <p>{u.username}</p>

                <button
                  onClick={() => sendFriendRequest(u._id)}
                  className="btn"
                >
                  Add Friend
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AddFriend;
