"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { Sidebar } from "./sidebar";
import { getMockSession } from "@/lib/mock-session";
import {
  MagnifyingGlass,
  List,
  House,
  BookmarkSimple,
  UserCircle,
  SignIn,
  User,
} from "@phosphor-icons/react/dist/ssr";

const categoryNav = [
  { label: "Beranda", href: "/" },
  { label: "Bisnis", href: "/bisnis" },
  { label: "Olahraga", href: "/olahraga" },
  { label: "Pendidikan", href: "/pendidikan" },
  { label: "Sosial & Budaya", href: "/sosial-dan-budaya" },
  { label: "Tentang Kami", href: "/tentang-kami" },
];

const bottomNavItems = [
  { label: "Home", href: "/", icon: House },
  { label: "Search", href: "/pencarian", icon: MagnifyingGlass },
  { label: "Saved", href: "/saved", icon: BookmarkSimple },
  { label: "Profile", href: "/profile", icon: UserCircle },
];

export function HeaderClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const pathname = usePathname();

  useEffect(() => {
    const mockUser = getMockSession();
    if (mockUser) {
      setUser(mockUser);
      return;
    }
    
    fetch("/api/auth/get-session")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  const signOut = async () => {
    try {
      if (getMockSession()) {
        localStorage.removeItem("mock-session");
      } else {
        await fetch("/api/auth/sign-out", { method: "POST" });
      }
      setUser(null);
      window.location.href = "/";
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <div>
      {/* Sidebar - mobile overlay */}
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSignOut={signOut}
      />

      {/* ========== MOBILE HEADER ========== */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white lg:hidden">
        {/* Mobile: Top bar - Logo + Actions */}
        <div className="flex h-14 items-center border-b border-border px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <Image
                src="/logo-metrik.png"
                alt="Metrik Media"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-sm font-bold tracking-tight text-foreground sm:hidden">
              {SITE_CONFIG.shortName}
            </span>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex size-9 items-center justify-center text-foreground"
            >
              <List className="size-6" />
            </button>
          </div>
        </div>

        {/* Mobile: Category tabs */}
        <div className="flex h-10 items-center overflow-x-auto border-b border-border px-4 scrollbar-hide">
          <div className="flex items-center gap-0">
            {categoryNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative whitespace-nowrap px-3 py-2.5 text-xs transition-colors",
                    isActive ? "font-semibold text-[#a68a0a]" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#a68a0a]" />}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* ========== DESKTOP HEADER (Tempo-style) ========== */}
      <header className="fixed top-0 left-0 right-0 z-30 hidden bg-white lg:block">
        {/* Row 1: Logo + Langganan + User + Search/Menu */}
        <div className="mx-auto flex h-14 items-center border-b border-border px-6" style={{ maxWidth: "1440px" }}>
          {/* Logo */}
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="relative h-10 w-10">
              <Image
                src="/logo-metrik.png"
                alt="Metrik Media"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-none border border-[#a68a0a] bg-[#a68a0a] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#856d0a]"
            >
              Langganan
            </Link>
            <div className="h-6 w-px bg-border" />
            {user ? (
              <Link
                href="/profile"
                className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                <User className="size-6" />
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              >
                <User className="size-6" />
              </Link>
            )}
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex size-9 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
            >
              <div className="flex items-center gap-1">
                <MagnifyingGlass className="size-5" />
                <List className="size-5" />
              </div>
            </button>
          </div>
        </div>

        {/* Row 2: Category Navigation */}
        <div className="border-b border-border">
          <div className="mx-auto flex items-center px-6" style={{ maxWidth: "1440px" }}>
            {categoryNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative whitespace-nowrap px-4 py-3.5 text-[13px] transition-colors",
                    isActive
                      ? "font-semibold text-[#a68a0a]"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#a68a0a]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Bottom Nav - mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-4 py-1.5 text-[10px] transition-colors",
                  isActive ? "text-[#a68a0a]" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("size-5", isActive && "text-[#a68a0a]")} weight={isActive ? "fill" : "regular"} />
                <span className={cn(isActive && "font-medium")}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
