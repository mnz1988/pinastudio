"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    });
    setLoading(false);
    if (res?.error) setError("Incorrect email or password.");
    else router.push(params.get("callbackUrl") || "/admin");
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm flex flex-col gap-5">
        <h1 className="text-2xl font-bold mb-2">Sign In</h1>
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          dir="ltr"
          className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-white text-left"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          dir="ltr"
          className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-white text-left"
        />
        <button
          disabled={loading}
          className="mt-2 px-6 py-3 rounded-full bg-white text-black font-medium hover:opacity-80 disabled:opacity-50"
        >
          {loading ? "..." : "Sign In"}
        </button>
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </form>
    </div>
  );
}
