"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
    };
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Registration failed");
      setLoading(false);
      return;
    }
    await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });
    setLoading(false);
    router.push("/order");
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm flex flex-col gap-5">
        <h1 className="text-2xl font-bold mb-2">Sign Up</h1>
        <input name="name" required placeholder="Name" className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-white" />
        <input name="email" type="email" required placeholder="Email" dir="ltr" className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-white text-left" />
        <input name="password" type="password" required minLength={6} placeholder="Password (min. 6 characters)" dir="ltr" className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-white text-left" />
        <button disabled={loading} className="mt-2 px-6 py-3 rounded-full bg-white text-black font-medium hover:opacity-80 disabled:opacity-50">
          {loading ? "..." : "Sign Up"}
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>
    </div>
  );
}
