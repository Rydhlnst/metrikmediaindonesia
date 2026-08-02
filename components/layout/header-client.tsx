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
  Bell,
} from "@phosphor-icons/react/dist/ssr";

const bottomNavItems = [
  { label: "Home", href: "/", icon: House },
  { label: "Search", href: "/pencarian", icon: MagnifyingGlass },
  { label: "Saved", href: "/saved", icon: BookmarkSimple },
  { label: "Profile", href: "/profile", icon: UserCircle },
];

export function HeaderClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
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
      {/* Hamburger sidebar (mobile only) */}
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSignOut={signOut}
      />

      {/* ========== MOBILE HEADER (< sm) ========== */}
      <header className="fixed top-0 left-0 right-0 z-30 glass sm:hidden">
        <div className="flex h-14 items-center px-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative h-8 w-8">
              <Image
                src="/logo-metrik.png"
                alt="Metrik Media"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-base font-bold tracking-tight text-foreground">
              {SITE_CONFIG.shortName}
            </span>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-1">
            <Link
              href="/pencarian"
              className="flex size-10 items-center justify-center text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MagnifyingGlass className="size-5" />
            </Link>
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex size-10 items-center justify-center text-gray-500 rounded-full hover:bg-gray-100 transition-colors"
            >
              <List className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {/* ========== DESKTOP HEADER (sm+) ========== */}
      <header className="fixed top-0 left-0 right-0 z-30 hidden bg-white sm:block sm:left-[240px] lg:left-[260px]">
        <div className="border-b border-gray-100">
          <div className="flex h-16 items-center gap-4 px-5 lg:px-6">
            {/* Search bar */}
            <div className="relative flex-1 max-w-xl">
              <MagnifyingGlass className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search News"
                className="h-10 w-full rounded-xl border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-foreground placeholder:text-gray-400 outline-none transition-all focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="flex size-10 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-foreground transition-colors">
                <Bell className="size-5" />
              </button>
              <Link
                href="/login"
                className="rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-gray-900 transition-colors hover:bg-amber-400"
              >
                LANGGANAN
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Nav - mobile only (< sm) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-gray-100 sm:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-4 py-1.5 text-[11px] transition-all rounded-xl",
                  isActive
                    ? "text-brand-text font-semibold"
                    : "text-gray-400"
                )}
              >
                <item.icon
                  className={cn("size-6", isActive && "text-brand-text")}
                  weight={isActive ? "fill" : "regular"}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
