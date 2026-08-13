"use client";

import { useState } from "react";
import { EnvelopeSimple, PaperPlaneRight, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { SectionHeading } from "@/components/shared/section-heading";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitted(true);
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
    } catch {
      // Silent fail — UI already shows success state
    }
    setEmail("");
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="rounded-none bg-surface-container-low border border-outline-variant p-5">
      <div className="mb-3 flex items-center gap-2">
        <EnvelopeSimple className="size-5 text-secondary" weight="bold" />
        <SectionHeading size="sm" as="h3">Newsletter</SectionHeading>
      </div>
      <p className="mb-4 text-sm leading-relaxed text-on-surface-variant">
        Dapatkan berita terkini langsung ke email Anda. Gratis dan tanpa spam.
      </p>
      {submitted ? (
        <div className="flex items-center justify-center gap-2 rounded-none bg-secondary-container py-3 text-center text-xs font-bold uppercase tracking-wider text-on-secondary-container">
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
            className="flex-1 rounded-none border border-outline-variant bg-background px-4 py-2.5 text-xs font-medium text-foreground placeholder:text-on-surface-variant outline-none focus:border-primary"
          />
          <button type="submit" className="shrink-0 rounded-none bg-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-on-primary transition-all hover:bg-primary/90">
            <PaperPlaneRight className="size-4" weight="fill" />
          </button>
        </form>
      )}
    </div>
  );
}
