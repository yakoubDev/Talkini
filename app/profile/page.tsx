"use client";

import { useAuthStore, useUser } from "@/store/authStore";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Profile = () => {
  const user = useUser();
  const { loadingUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
  });

  // Update formData when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/${user?._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const result = await response.json();
        toast.error(result.message || "Failed to update profile");
        return;
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
    });
    setIsEditing(false);
  };

  if (!user || loadingUser) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 page-paddings">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-100">My Profile</h1>
          <p className="text-slate-400 mt-1">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-xl">
          {/* Avatar Section */}
          <div className="bg-linear-to-br from-blue-500 to-blue-600 h-32 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-4xl border-4 border-slate-800">
                {user?.username?.[0]?.toUpperCase() || "?"}
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-16 p-8 space-y-6">
            {/* Edit Toggle */}
            <div className="flex justify-end">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="btn">
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="btn bg-slate-700 hover:bg-slate-600 shadow-slate-700 shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              )}
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Username
                </label>
                {isEditing ? (
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="input"
                  />
                ) : (
                  <p className="text-lg text-slate-100">
                    {user?.username || "Not set"}
                  </p>
                )}
              </div>

              <div className="divider"></div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input"
                  />
                ) : (
                  <p className="text-lg text-slate-100">
                    {user?.email || "Not set"}
                  </p>
                )}
              </div>

              <div className="divider"></div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input"
                  />
                ) : (
                  <p className="text-lg text-slate-100">
                    {user?.phone || "Not set"}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
