"use client";

import { useUser } from "@/store/authStore";
import { FriendRequest } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FriendRequests() {
  const user = useUser();
  const [requests, setRequests] = useState<FriendRequest[]>([]);

  useEffect(() => {
    if (!user?._id) return;
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `/api/users/friend-request?userId=${user._id}`
        );
        const result = await response.json();
        if(!response.ok){
            toast.error(result.message);
            return;
        }

        setRequests(result.requests);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRequests();
  }, [user]);

  const accept = async (senderId: string) => {
    await fetch("/api/users/friend-request/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentUserId: user?._id,
        senderId,
      }),
    });

    setRequests((prev) => prev.filter((r) => r.from._id !== senderId));
  };

  const decline = async (senderId: string) => {
    await fetch("/api/users/friend-request/decline", {
      method: "POST",
      body: JSON.stringify({
        currentUserId: user?._id,
        senderId,
      }),
    });

    setRequests((prev) => prev.filter((r) => r.from._id !== senderId));
  };

  return (
    <div className="p-6">
      <h1 className="font-bold text-2xl mb-4">Friend Requests</h1>

      {requests.length === 0 && <p>No friend requests.</p>}

      <div className="space-y-3">
        {requests.map((req: FriendRequest) => (
          <div
            key={req.from._id}
            className="p-3 bg-slate-800 text-white rounded flex justify-between"
          >
            <p>{req.from.username}</p>

            <div className="flex gap-2">
              <button
                onClick={() => accept(req.from._id)}
                className="bg-green-500 px-3 py-1 rounded"
              >
                Accept
              </button>
              <button
                onClick={() => decline(req.from._id)}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
