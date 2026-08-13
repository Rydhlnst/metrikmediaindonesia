"use client";

import { useState } from "react";
import Link from "next/link";
import { CircleNotch, LockSimple, ArrowRight, CheckCircle, Warning } from "@phosphor-icons/react/dist/ssr";
import { BrandName } from "@/components/shared/brand-name";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const searchParams = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search)
    : null;
  const token = searchParams?.get("token") || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Password tidak cocok");
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password minimal 8 karakter");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal reset password");
      }

      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm space-y-8 text-center">
          <BrandName size="sm" />
          <div className="space-y-4">
            <Warning className="mx-auto h-12 w-12 text-yellow-500" />
            <h1 className="text-2xl font-extrabold tracking-tight">Token tidak valid</h1>
            <p className="text-sm text-muted-foreground">
              Link reset password tidak valid atau sudah kedaluwarsa.
            </p>
            <Link
              href="/forgot-password"
              className="flex h-11 w-full items-center justify-center gap-2 bg-foreground text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
            >
              Minta link baru
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-1">
          <Link href="/" className="inline-block">
            <BrandName size="sm" />
          </Link>
        </div>

        {isSuccess ? (
          <div className="space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <div className="space-y-1 text-center">
              <h1 className="text-2xl font-extrabold tracking-tight">Password berhasil direset</h1>
              <p className="text-sm text-muted-foreground">
                Password Anda telah berhasil diubah. Silakan login dengan password baru.
              </p>
            </div>
            <Link
              href="/login"
              className="flex h-11 w-full items-center justify-center gap-2 bg-foreground text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
            >
              Login sekarang
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-1">
              <h1 className="text-2xl font-extrabold tracking-tight">Reset password</h1>
              <p className="text-sm text-muted-foreground">
                Masukkan password baru Anda.
              </p>
            </div>

            {error && (
              <div className="bg-error/10 p-3 text-xs text-error">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium">Password baru</label>
                <div className="relative">
                  <LockSimple className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 w-full border border-outline-variant bg-muted pl-10 pr-3.5 text-sm outline-none transition-colors focus:border-foreground focus:ring-1 focus:ring-foreground"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium">Konfirmasi password</label>
                <div className="relative">
                  <LockSimple className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-11 w-full border border-outline-variant bg-muted pl-10 pr-3.5 text-sm outline-none transition-colors focus:border-foreground focus:ring-1 focus:ring-foreground"
                    required
                    minLength={8}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="showPassword"
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="h-4 w-4 border-outline-variant accent-foreground"
                />
                <label htmlFor="showPassword" className="cursor-pointer text-sm text-muted-foreground">
                  Tampilkan password
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex h-11 w-full items-center justify-center gap-2 bg-foreground text-sm font-semibold text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
              >
                {isLoading ? (
                  <CircleNotch className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Reset password
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
