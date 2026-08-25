"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeSlash, CircleNotch, EnvelopeSimple, LockSimple, ArrowRight, GoogleLogo, FacebookLogo } from "@phosphor-icons/react/dist/ssr";
import Blocks from "@/components/ui/blocks";
import { BrandName } from "@/components/shared/brand-name";
import { requestJson, toastApiError } from "@/lib/api-client";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeDivs, setActiveDivs] = useState<Record<number, Set<number>>>({});

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Register extra fields
  const [name, setName] = useState("");

  const isLogin = mode === "login";

  const animateBlocks = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const blockSize = containerWidth * 0.06;
    const columns = Math.floor(containerWidth / blockSize);
    const rows = Math.floor(containerHeight / blockSize);

    const newActiveDivs: Record<number, Set<number>> = {};
    const numActive = Math.floor(Math.random() * 8) + 4;

    for (let i = 0; i < numActive; i++) {
      const col = Math.floor(Math.random() * columns);
      const row = Math.floor(Math.random() * rows);
      if (!newActiveDivs[col]) newActiveDivs[col] = new Set();
      newActiveDivs[col].add(row);
    }

    setActiveDivs(newActiveDivs);
  }, []);

  useEffect(() => {
    animateBlocks();
    const interval = setInterval(animateBlocks, 3000);
    return () => clearInterval(interval);
  }, [animateBlocks]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = isLogin ? "/api/auth/sign-in/email" : "/api/auth/sign-up/email";
      const body = isLogin ? { email, password, rememberMe } : { name, email, password };

      await requestJson(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo = searchParams.get("redirect") || "/dashboard";
      router.push(redirectTo);
      router.refresh();
    } catch (error: unknown) {
      toastApiError(error);
      setError(error instanceof Error ? error.message : (isLogin ? "Email atau password salah" : "Gagal membuat akun"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left - Form */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-16 sm:px-10 lg:max-w-xl lg:px-16">
        <div className="w-full max-w-sm space-y-8">
          {/* Brand */}
          <div className="space-y-1">
            <Link href="/" className="inline-block">
              <BrandName size="sm" />
            </Link>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isLogin
                ? "Masuk untuk mengakses ruang redaksi dan manajemen artikel."
                : "Daftar untuk mulai menulis dan mengirimkan liputan berita."}
            </p>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex h-10 items-center justify-center gap-2 border border-outline-variant bg-muted text-sm font-medium transition-colors hover:bg-muted/80 rounded-none"
            >
              <GoogleLogo className="h-4 w-4" />
              Google
            </button>
            <button
              type="button"
              className="flex h-10 items-center justify-center gap-2 border border-outline-variant bg-muted text-sm font-medium transition-colors hover:bg-muted/80 rounded-none"
            >
              <FacebookLogo className="h-4 w-4" weight="fill" />
              Facebook
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-outline-variant" />
            <span className="shrink-0 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              atau gunakan email
            </span>
            <div className="h-px flex-1 bg-outline-variant" />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-error/10 border-l-2 border-error p-3 text-xs text-error rounded-none">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name (register only) */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Nama Lengkap Penulis
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                    @
                  </span>
                  <input
                    id="name"
                    type="text"
                    placeholder="Nama lengkap Anda..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 w-full border border-outline-variant bg-muted px-3.5 pl-9 text-sm outline-none transition-colors focus:border-[#b8860b] focus:ring-1 focus:ring-[#b8860b] rounded-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Alamat Email
              </label>
              <div className="relative">
                <EnvelopeSimple className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="nama@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full border border-outline-variant bg-muted pl-10 pr-3.5 text-sm outline-none transition-colors focus:border-[#b8860b] focus:ring-1 focus:ring-[#b8860b] rounded-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Kata Sandi
                </label>
                {isLogin && (
                  <Link href="/forgot-password" className="text-xs font-semibold text-[#b8860b] hover:underline">
                    Lupa kata sandi?
                  </Link>
                )}
              </div>
              <div className="relative">
                <LockSimple className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 w-full border border-outline-variant bg-muted pl-10 pr-10 text-sm outline-none transition-colors focus:border-[#b8860b] focus:ring-1 focus:ring-[#b8860b] rounded-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeSlash className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember me (login only) */}
            {isLogin && (
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 border-outline-variant accent-[#b8860b] rounded-none"
                />
                <label htmlFor="remember" className="cursor-pointer text-xs font-medium text-muted-foreground">
                  Ingat sesi login saya
                </label>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center gap-2 bg-[#111827] text-white hover:bg-[#b8860b] text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 rounded-none border border-black/20"
            >
              {isLoading ? (
                <CircleNotch className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Masuk ke Dashboard" : "Daftar sebagai Penulis"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground">
            {isLogin ? "Belum memiliki akun kontributor?" : "Sudah memiliki akun?"}{" "}
            <Link
              href={isLogin ? "/signup" : "/login"}
              className="font-bold text-[#b8860b] hover:underline"
            >
              {isLogin ? "Daftar sekarang gratis" : "Masuk di sini"}
            </Link>
          </p>
        </div>
      </section>

      {/* Right - Blocks Animation */}
      <section
        ref={containerRef}
        className="relative hidden flex-1 items-center justify-center overflow-hidden bg-on-surface lg:flex"
      >
        <Blocks
          containerRef={containerRef}
          activeDivs={activeDivs}
          activeDivsClass="bg-primary/40 border-primary/20"
          divClass="border-white/5"
        />
        <div className="relative z-10 max-w-md text-center text-white">
          <BrandName size="lg" color="white" as="h2" />
          <p className="mt-3 text-lg text-white/80">Portal Berita Terpercaya</p>
        </div>
      </section>
    </div>
  );
}
