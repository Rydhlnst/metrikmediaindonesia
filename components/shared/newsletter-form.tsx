"use client";

import { useState } from "react";
import { PrimaryButton } from "@/components/shared/primary-button";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react/dist/ssr";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "Berhasil berlangganan!");
        setEmail("");
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
        setMessage(data.message || "Terjadi kesalahan");
        setTimeout(() => setStatus("idle"), 4000);
      }
    } catch {
      setStatus("error");
      setMessage("Gagal terhubung ke server");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <>
      {status === "success" && (
        <div className="mb-4 flex items-center justify-center gap-2 text-sm font-medium text-secondary">
          <CheckCircle className="size-4" weight="fill" />
          {message}
        </div>
      )}
      {status === "error" && (
        <div className="mb-4 flex items-center justify-center gap-2 text-sm font-medium text-error">
          <WarningCircle className="size-4" weight="fill" />
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-transparent border-0 border-b border-outline-variant focus:ring-0 focus:border-primary text-center sm:text-left font-label-md text-label-md uppercase text-primary placeholder-on-surface-variant flex-grow max-w-sm px-0 py-2 outline-none"
          placeholder="ALAMAT EMAIL ANDA"
          disabled={status === "loading"}
        />
        <PrimaryButton
          type="submit"
          size="lg"
          disabled={status === "loading"}
          className="font-label-md text-label-md uppercase"
        >
          {status === "loading" ? "Loading..." : "Subscribe"}
        </PrimaryButton>
      </form>
    </>
  );
}
