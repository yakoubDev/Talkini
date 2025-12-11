"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchUser } from "@/store/authStore";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const fetchUser = useFetchUser();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);

    const { email, password } = formData;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      setMessage("Login successful! Redirecting...");
      setFormData({ email: "", password: "" });
      fetchUser();

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      setMessage("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center page-paddings">
      <div className="w-full max-w-xl">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 space-y-6 shadow-xl">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-100">Welcome Back</h2>
            <p className="text-slate-400">Login to continue chatting</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="your@email.com"
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                className="input"
                required
              />
            </div>
          </div>

          {message && (
            <div className={`text-center text-sm p-3 rounded-lg ${
              message.includes("successful") 
                ? "bg-green-600/20 text-green-400 border border-green-600/30" 
                : "bg-red-600/20 text-red-400 border border-red-600/30"
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn w-full "
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center">
            <p className="text-sm text-slate-400">
              Don't have an account?{" "}
              <a href="/signup" className="text-blue-500 hover:text-blue-400 font-medium">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}