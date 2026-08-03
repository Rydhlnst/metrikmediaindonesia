"use client";

import { useState } from "react";
import { EnvelopeSimple, PaperPlaneRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setEmail("");
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="rounded-xl bg-brand/10 p-5">
      <div className="mb-3 flex items-center gap-2">
        <EnvelopeSimple className="size-5 text-brand-text" weight="bold" />
        <h3 className="text-base font-bold">Newsletter</h3>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-gray-500">
        Dapatkan berita terkini langsung ke email Anda. Gratis dan tanpa spam.
      </p>
      {submitted ? (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 py-3 text-center text-sm font-medium text-green-700">
          <CheckCircle className="size-4" />
          Terima kasih telah berlangganan!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            placeholder="Email Anda"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-foreground placeholder:text-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <button type="submit" className="shrink-0 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-amber-400">
            <PaperPlaneRight className="size-4" weight="fill" />
          </button>
        </form>
      )}
    </div>
  );
}
