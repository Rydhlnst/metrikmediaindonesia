"use client";

import { useState } from "react";
import { Link as LinkIcon, Check } from "@phosphor-icons/react/dist/ssr";

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex size-9 items-center justify-center border border-black/10 bg-white text-muted-foreground transition-colors hover:border-gold hover:text-gold-deep"
      aria-label="Salin tautan"
    >
      {copied ? <Check className="size-4" /> : <LinkIcon className="size-4" />}
    </button>
  );
}
