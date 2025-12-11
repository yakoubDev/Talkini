"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Signup failed");
        return;
      }

      setMessage("Account created! Redirecting...");
      setFormData({ username: "", email: "", phone: "", password: "" });

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } catch (err) {
      setMessage("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center page-paddings">
      <div className="w-full max-w-xl">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8 space-y-6 shadow-xl">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-100">Create Account</h2>
            <p className="text-slate-400">Join Talkini and start chatting</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Username
              </label>
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="input"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Phone Number
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
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
                placeholder="Create a strong password"
                className="input"
                required
              />
            </div>
          </div>

          {message && (
            <div className={`text-center text-sm p-3 rounded-lg ${
              message.includes("created") 
                ? "bg-green-600/20 text-green-400 border border-green-600/30" 
                : "bg-red-600/20 text-red-400 border border-red-600/30"
            }`}>
              {message}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn w-full shadow-lg shadow-blue-600/20 py-3 text-base"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          <div className="text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:text-blue-400 font-medium">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}