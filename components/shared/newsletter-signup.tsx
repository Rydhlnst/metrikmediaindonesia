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
    <div className="border border-border bg-white dark:bg-background p-5">
      <div className="mb-3 flex items-center gap-2">
        <EnvelopeSimple className="size-4" weight="bold" />
        <h3 className="text-sm font-bold uppercase tracking-wider">Newsletter</h3>
      </div>
      <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
        Dapatkan berita terkini langsung ke email Anda. Gratis dan tanpa spam.
      </p>
      {submitted ? (
        <div className="py-2 text-center text-sm font-medium">
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
            className="flex-1 border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:border-brand"
          />
          <Button type="submit" size="icon" className="size-8 shrink-0 bg-brand text-brand-foreground hover:bg-brand/90">
            <PaperPlaneRight className="size-3.5" weight="fill" />
          </Button>
        </form>
      )}
    </div>
  );
}
