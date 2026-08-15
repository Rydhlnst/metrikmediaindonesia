"use client";

import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { WarningCircle, ArrowClockwise, House, Code } from "@phosphor-icons/react/dist/ssr";

interface ErrorStateProps {
  title?: string;
  error?: Error & { digest?: string };
  reset?: () => void;
  actionHref?: string;
  actionLabel?: string;
  className?: string;
  showHomeButton?: boolean;
}

export function ErrorState({
  title = "Terjadi Kesalahan pada Sistem",
  error,
  reset,
  actionHref,
  actionLabel = "Coba Lagi",
  className,
  showHomeButton = true,
}: ErrorStateProps) {
  const [showDetails, setShowDetails] = useState(false);

  const errorMessage =
    error?.message ||
    "Sistem tidak dapat memproses permintaan Anda saat ini. Silakan muat ulang atau hubungi tim teknis redaksi.";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center rounded-none border border-black/10 bg-white p-8 sm:p-12",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-none border border-destructive/30 bg-destructive/5 text-destructive mb-4">
        <WarningCircle className="size-7" weight="duotone" />
      </div>

      <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground max-w-lg">
        {title}
      </h3>

      <div className="mt-3 max-w-md w-full rounded-none border border-destructive/20 bg-destructive/5 p-3.5 text-left">
        <p className="text-xs font-semibold text-destructive font-mono break-words leading-relaxed">
          {errorMessage}
        </p>
        {error?.digest && (
          <p className="mt-1 text-[11px] text-muted-foreground font-mono">
            Error Digest ID: <span className="text-foreground font-bold">{error.digest}</span>
          </p>
        )}
      </div>

      {error?.stack && (
        <div className="mt-3 w-full max-w-md text-left">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
          >
            <Code className="size-3.5" />
            {showDetails ? "Sembunyikan Detail Stack Trace" : "Lihat Detail Stack Trace Teknis"}
          </button>
          {showDetails && (
            <pre className="mt-2 p-3 text-[10px] font-mono bg-black text-amber-300 rounded-none overflow-x-auto max-h-48 whitespace-pre-wrap leading-relaxed border border-black/10">
              {error.stack}
            </pre>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {reset && (
          <Button
            onClick={reset}
            className="gap-2 rounded-none bg-primary text-white hover:bg-primary/90 text-xs font-bold uppercase tracking-wider px-5 py-2.5 shadow-2xs"
          >
            <ArrowClockwise className="size-4" weight="bold" />
            {actionLabel}
          </Button>
        )}

        {actionHref && !reset && (
          <Link href={actionHref}>
            <Button className="gap-2 rounded-none bg-primary text-white hover:bg-primary/90 text-xs font-bold uppercase tracking-wider px-5 py-2.5 shadow-2xs">
              <ArrowClockwise className="size-4" weight="bold" />
              {actionLabel}
            </Button>
          </Link>
        )}

        {showHomeButton && (
          <Link href="/">
            <Button
              variant="outline"
              className="gap-2 rounded-none border-black/15 text-xs font-bold uppercase tracking-wider px-4 py-2.5"
            >
              <House className="size-4" />
              Kembali ke Beranda
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
