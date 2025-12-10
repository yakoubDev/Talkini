"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFetchUser } from "@/store/authStore";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchUser = useFetchUser();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      setMessage("Login successful! Redirecting...");
      form.reset();
      fetchUser();

      // Redirect after a short delay
      setTimeout(() => {
        router.push("/"); // Change to your protected route
      }, 1000);
    } catch (err) {
      setMessage("Something went wrong...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto flex flex-col gap-4 p-4 border rounded-lg"
    >
      <h2 className="text-2xl font-semibold text-center">Login</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="p-2 border rounded"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="p-2 border rounded"
        required
      />

      {message && <p className="text-center text-sm text-red-500">{message}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white p-2 rounded hover:bg-gray-800"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
