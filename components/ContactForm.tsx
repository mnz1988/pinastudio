"use client";

import { useState } from "react";
import { getDir } from "@/lib/text-direction";

export type ContactFormLabels = {
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  buttonText: string;
  buttonSendingText: string;
  successMessage: string;
  errorMessage: string;
};

export default function ContactForm({ labels }: { labels: ContactFormLabels }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        message: form.get("message"),
      }),
    });
    setStatus(res.ok ? "sent" : "error");
    if (res.ok) e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <input
        name="name"
        required
        placeholder={labels.nameLabel}
        dir={getDir(labels.nameLabel)}
        className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-white transition-colors"
      />
      <input
        name="email"
        type="email"
        required
        placeholder={labels.emailLabel}
        dir="ltr"
        className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-white transition-colors text-left"
      />
      <textarea
        name="message"
        required
        rows={5}
        placeholder={labels.messageLabel}
        dir={getDir(labels.messageLabel)}
        className="bg-transparent border-b border-white/20 py-3 outline-none focus:border-white transition-colors resize-none"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-2 self-start px-6 py-3 rounded-full bg-white text-black font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
      >
        {status === "sending" ? labels.buttonSendingText : labels.buttonText}
      </button>
      {status === "sent" && <p className="text-green-400 text-sm">{labels.successMessage}</p>}
      {status === "error" && <p className="text-red-400 text-sm">{labels.errorMessage}</p>}
    </form>
  );
}
