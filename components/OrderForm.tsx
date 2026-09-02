"use client";

import { useState } from "react";

export default function OrderForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [notice, setNotice] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setNotice("");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
      }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) {
      setStatus("error");
      setNotice(data.error || "Something went wrong");
      return;
    }
    setStatus("sent");
    e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <input
        name="title"
        required
        placeholder="Order title"
        className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-white"
      />
      <textarea
        name="description"
        required
        rows={6}
        placeholder="Full description of your request"
        className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-white resize-none"
      />
      <button
        disabled={status === "sending"}
        className="mt-2 self-start px-6 py-3 rounded-full bg-white text-black font-medium hover:opacity-80 disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Submit Order"}
      </button>
      {status === "sent" && (
        <p className="text-green-400 text-sm">
          Your order has been submitted. You'll be contacted soon to work out the details and price.
        </p>
      )}
      {notice && status === "error" && <p className="text-red-400 text-sm">{notice}</p>}
    </form>
  );
}
