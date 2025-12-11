"use client";

import { useUser } from "@/store/authStore";
import { FriendRequest } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function FriendRequests() {
  const user = useUser();
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `/api/users/friend-request?userId=${user._id}`
        );
        const result = await response.json();
        if (!response.ok) {
          toast.error(result.message);
          return;
        }

        setRequests(result.requests);
      } catch (error) {
        toast.error("Failed to fetch requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user]);

  const accept = async (senderId: string) => {
    try {
      const response = await fetch("/api/users/friend-request/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUserId: user?._id,
          senderId,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to accept request");
        return;
      }

      setRequests((prev) => prev.filter((r) => r.from._id !== senderId));
      toast.success("Friend request accepted!");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const decline = async (senderId: string) => {
    try {
      const response = await fetch("/api/users/friend-request/decline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUserId: user?._id,
          senderId,
        }),
      });

      if (!response.ok) {
        toast.error("Failed to decline request");
        return;
      }

      setRequests((prev) => prev.filter((r) => r.from._id !== senderId));
      toast.success("Friend request declined");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 page-paddings">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">Friend Requests</h1>
          <p className="text-slate-400 mt-1">
            {requests.length} pending {requests.length === 1 ? 'request' : 'requests'}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-12 text-center">
            <div className="inline-block w-8 h-8 border-3 border-slate-700 border-t-blue-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-400">Loading requests...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && requests.length === 0 && (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-12 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-slate-100 mb-2">No pending requests</h3>
            <p className="text-slate-400">You're all caught up!</p>
          </div>
        )}

        {/* Requests List */}
        {!loading && requests.length > 0 && (
          <div className="space-y-3">
            {requests.map((req: FriendRequest) => (
              <div
                key={req.from._id}
                className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center justify-between hover:border-slate-600 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {req.from.username[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-100 text-lg">{req.from.username}</p>
                    <p className="text-sm text-slate-400">wants to connect</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => accept(req.from._id)}
                    className="btn bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => decline(req.from._id)}
                    className="btn bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}