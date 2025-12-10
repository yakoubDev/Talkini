"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          phone,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Signup failed");
        return;
      }

      setMessage("Account created! Redirecting...");
      form.reset();

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
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto flex flex-col gap-4 p-4 border rounded-lg"
    >
      <h2 className="text-2xl font-semibold text-center">Create Account</h2>

      <input
        name="username"
        placeholder="Username"
        className="p-2 border rounded"
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        className="p-2 border rounded"
        required
      />
      <input
        name="phone"
        placeholder="Phone Number"
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
        {loading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  );
}
