"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { EnvelopeSimple, PaperPlaneRight } from "@phosphor-icons/react/dist/ssr";

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
    <div className="border border-gray-200 bg-white p-4">
      <div className="mb-2 flex items-center gap-2">
        <EnvelopeSimple className="size-4 text-brand-text" weight="bold" />
        <h3 className="text-[12px] font-bold uppercase tracking-wider">Newsletter</h3>
      </div>
      <p className="mb-3 text-[11px] leading-relaxed text-gray-500">
        Dapatkan berita terkini langsung ke email Anda. Gratis dan tanpa spam.
      </p>
      {submitted ? (
        <div className="py-2 text-center text-[12px] font-medium text-brand-text">
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
            className="flex-1 border border-gray-200 bg-gray-50 px-3 py-2 text-[11px] text-foreground placeholder:text-gray-400 outline-none focus:border-brand"
          />
          <Button type="submit" size="icon" className="size-8 shrink-0 bg-brand text-gray-900 hover:bg-amber-400">
            <PaperPlaneRight className="size-3.5" weight="fill" />
          </Button>
        </form>
      )}
    </div>
  );
}
