"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeSlash, CircleNotch, EnvelopeSimple, LockSimple, ArrowRight, GoogleLogo, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import Blocks from "@/components/ui/blocks";
import { BrandName } from "@/components/shared/brand-name";

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

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || (isLogin ? "Email atau password salah" : "Gagal membuat akun"));
      }

      const searchParams = new URLSearchParams(window.location.search);
      const redirectTo = searchParams.get("redirect") || "/profile";
      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
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
                ? "Sign in to continue to your workspace."
                : "Sign up to get started with Metrik Media."}
            </p>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex h-10 items-center justify-center gap-2 border border-outline-variant bg-muted text-sm font-medium transition-colors hover:bg-muted/80"
            >
              <GoogleLogo className="h-4 w-4" />
              Google
            </button>
            <button
              type="button"
              className="flex h-10 items-center justify-center gap-2 border border-outline-variant bg-muted text-sm font-medium transition-colors hover:bg-muted/80"
            >
              <GithubLogo className="h-4 w-4" />
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-outline-variant" />
            <span className="shrink-0 text-xs text-muted-foreground">
              or continue with email
            </span>
            <div className="h-px flex-1 bg-outline-variant" />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-error/10 p-3 text-xs text-error">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name (register only) */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-11 w-full border border-outline-variant bg-muted px-3.5 pl-10 text-sm outline-none transition-colors focus:border-foreground focus:ring-1 focus:ring-foreground"
                  required
                />
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email address
              </label>
              <div className="relative">
                <EnvelopeSimple className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full border border-outline-variant bg-muted pl-10 pr-3.5 text-sm outline-none transition-colors focus:border-foreground focus:ring-1 focus:ring-foreground"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                {isLogin && (
                  <Link href="/forgot-password" className="text-xs font-medium text-foreground hover:underline">
                    Forgot password?
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
                  className="h-11 w-full border border-outline-variant bg-muted pl-10 pr-10 text-sm outline-none transition-colors focus:border-foreground focus:ring-1 focus:ring-foreground"
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
                  className="h-4 w-4 border-outline-variant accent-foreground"
                />
                <label htmlFor="remember" className="cursor-pointer text-sm text-muted-foreground">
                  Keep me signed in
                </label>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center gap-2 bg-foreground text-sm font-semibold text-background transition-colors hover:bg-foreground/90 disabled:opacity-50"
            >
              {isLoading ? (
                <CircleNotch className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign in" : "Create account"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <Link
              href={isLogin ? "/signup" : "/login"}
              className="font-medium text-foreground hover:underline"
            >
              {isLogin ? "Create one for free" : "Sign in"}
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
