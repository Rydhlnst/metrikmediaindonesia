"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { Sidebar } from "./sidebar";
import { getMockSession } from "@/lib/mock-session";
import {
  MagnifyingGlass,
  Bell,
  List,
  House,
  BookmarkSimple,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";

const tabs = [
  { label: "Top Stories", href: "/" },
  { label: "Bisnis", href: "/bisnis" },
  { label: "Olahraga", href: "/olahraga" },
  { label: "Pendidikan", href: "/pendidikan" },
  { label: "Sosial & Budaya", href: "/sosial-dan-budaya" },
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
      {/* Sidebar - mobile overlay + desktop fixed */}
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSignOut={signOut}
      />

      {/* Header - mobile */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white dark:bg-background lg:hidden">
        {/* Mobile: 3-column top bar */}
        <div className="flex h-14 items-center border-b border-border px-4">
          <div className="w-10">
            <button onClick={() => setSidebarOpen(true)} className="flex items-center justify-center">
              <List className="size-6" />
            </button>
          </div>
          <Link href="/" className="flex flex-1 justify-center">
            <span className="text-xl font-bold tracking-tight font-serif">{SITE_CONFIG.shortName}</span>
          </Link>
          <div className="w-10 flex justify-end">
            <Link href="/pencarian" className="flex items-center justify-center">
              <MagnifyingGlass className="size-6" />
            </Link>
          </div>
        </div>

        {/* Mobile: Tabs */}
        <div className="flex h-11 items-center overflow-x-auto border-b border-border px-4 scrollbar-hide">
          <div className="flex items-center gap-0">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "relative whitespace-nowrap px-4 py-3 text-sm transition-colors",
                    isActive ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* Header - desktop */}
      <header className="fixed top-0 left-0 right-0 z-30 hidden border-b border-border bg-white dark:bg-background lg:block">
        <div className="flex h-12 items-center gap-4 px-6">
          <Link href="/" className="mr-2 shrink-0">
            <span className="text-lg font-bold tracking-tight font-serif">{SITE_CONFIG.shortName}</span>
          </Link>
          <nav className="flex-1 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-0">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={cn(
                      "relative whitespace-nowrap px-4 py-3 text-[13px] transition-colors xl:px-5",
                      isActive ? "font-semibold text-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.label}
                    {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />}
                  </Link>
                );
              })}
            </div>
          </nav>
          <div className="flex shrink-0 items-center gap-1">
            <button className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <Bell className="size-5" />
            </button>
            <Link
              href="/pencarian"
              className="flex size-8 items-center justify-center text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <MagnifyingGlass className="size-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Bottom Nav - mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-white dark:bg-background lg:hidden">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-4 py-1.5 text-[10px] transition-colors",
                  isActive ? "text-foreground" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("size-5", isActive && "text-foreground")} weight={isActive ? "fill" : "regular"} />
                <span className={cn(isActive && "font-medium")}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
