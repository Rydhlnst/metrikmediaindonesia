"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Warning, CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { BrandName } from "@/components/shared/brand-name";

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const searchParams = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : null;
  const error = searchParams?.get("error");
  const email = searchParams?.get("email") || "";

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    try {
      await fetch("/api/auth/send-verification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setResendSuccess(true);
    } catch {
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-1">
          <Link href="/" className="inline-block">
            <BrandName size="sm" />
          </Link>
        </div>

        {error ? (
          <div className="space-y-6">
            <div className="flex justify-center">
              <Warning className="h-12 w-12 text-yellow-500" />
            </div>
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-extrabold tracking-tight">Verifikasi gagal</h1>
              <p className="text-sm text-muted-foreground">
                {error === "invalid_token"
                  ? "Token verifikasi tidak valid atau sudah kedaluwarsa."
                  : "Terjadi kesalahan saat verifikasi email."}
              </p>
            </div>
            {email && (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="flex h-11 w-full items-center justify-center gap-2 bg-foreground text-sm font-semibold text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
              >
                {isResending ? (
                  <CircleNotch className="h-4 w-4 animate-spin" />
                ) : (
                  "Kirim ulang email verifikasi"
                )}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-extrabold tracking-tight">Email terverifikasi</h1>
              <p className="text-sm text-muted-foreground">
                Email Anda telah berhasil diverifikasi. Anda sekarang bisa menggunakan semua fitur.
              </p>
            </div>
            <Link
              href="/login"
              className="flex h-11 w-full items-center justify-center gap-2 bg-foreground text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
            >
              Login sekarang
            </Link>
          </div>
        )}

        {resendSuccess && (
          <div className="bg-green-50 p-3 text-xs text-green-700">
            Email verifikasi telah dikirim. Silakan cek inbox Anda.
          </div>
        )}
      </div>
    </div>
  );
}
