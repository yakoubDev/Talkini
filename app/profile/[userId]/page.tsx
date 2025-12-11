"use client";

import { useUser } from "@/store/authStore";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

const UserProfile = () => {
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const currentUser = useUser();
  
  const [profileUser, setProfileUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();

        if (!response.ok) {
          toast.error(data.message || "Failed to load profile");
          return;
        }

        setProfileUser(data.user);
        
        // Check if already friends
        if (currentUser?.friends?.includes(userId)) {
          setIsFriend(true);
        }
      } catch (error) {
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, currentUser]);

  const sendFriendRequest = async () => {
    try {
      const response = await fetch("/api/users/friend-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          from: currentUser?._id,
          to: userId,
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.message || "Failed to send friend request");
        return;
      }

      toast.success("Friend Request Sent!");
      setRequestSent(true);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const startChat = () => {
    router.push(`/chat/${userId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Loading profile...</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">👤</div>
          <h3 className="text-xl font-semibold text-slate-100 mb-2">User not found</h3>
          <p className="text-slate-400">This user doesn't exist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 page-paddings">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">User Profile</h1>
          <p className="text-slate-400 mt-1">View {profileUser.username}'s information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
          {/* Avatar Section */}
          <div className="bg-linear-to-br from-blue-500 to-blue-600 h-32 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 bg-linear-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-4xl border-4 border-slate-800">
                {profileUser.username?.[0]?.toUpperCase() || "?"}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 p-8 space-y-6">
            {/* Action Buttons */}
            <div className="flex justify-end gap-2">
              {isFriend ? (
                <button onClick={startChat} className="btn">
                  Send Message
                </button>
              ) : requestSent ? (
                <button disabled className="btn bg-slate-700 cursor-not-allowed">
                  Request Sent
                </button>
              ) : (
                <button onClick={sendFriendRequest} className="btn">
                  Add Friend
                </button>
              )}
            </div>

            {/* User Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                <p className="text-lg text-slate-100">
                  {profileUser.username}
                </p>
              </div>

              <div className="divider"></div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                <p className="text-lg text-slate-100">
                  {profileUser.email}
                </p>
              </div>

              <div className="divider"></div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone Number
                </label>
                <p className="text-lg text-slate-100">
                  {profileUser.phone || "Not shared"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-500">
              {profileUser.friends?.length || 0}
            </div>
            <p className="text-slate-400 mt-1">Friends</p>
          </div>

          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-500">
              {isFriend ? "Friends" : "Not Friends"}
            </div>
            <p className="text-slate-400 mt-1">Status</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;