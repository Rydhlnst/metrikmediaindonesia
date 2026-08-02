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
  User,
  CalendarBlank,
  Clock,
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

function formatIndonesianDate(date: Date): string {
  const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function DateTimeDisplay() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) {
    return (
      <div className="flex items-center gap-4 text-[11px] text-gray-500">
        <span className="flex items-center gap-1.5">
          <CalendarBlank className="size-3" />
          <span className="inline-block w-32">&nbsp;</span>
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="size-3" />
          <span className="inline-block w-16">&nbsp;</span>
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 text-[11px] text-gray-500">
      <span className="flex items-center gap-1.5">
        <CalendarBlank className="size-3" />
        {formatIndonesianDate(now)}
      </span>
      <span className="flex items-center gap-1.5">
        <Clock className="size-3" />
        {formatTime(now)} WIB
      </span>
    </div>
  );
}

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
      <header className="fixed top-0 left-0 right-0 z-30 bg-white sm:hidden">
        <div className="flex h-14 items-center border-b border-gray-100 px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-7 w-7">
              <Image
                src="/logo-metrik.png"
                alt="Metrik Media"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-[13px] font-bold tracking-tight text-foreground">
              {SITE_CONFIG.shortName}
            </span>
          </Link>
          <div className="flex-1" />
          <div className="flex items-center gap-1.5">
            <Link
              href="/pencarian"
              className="flex size-8 items-center justify-center text-gray-500"
            >
              <MagnifyingGlass className="size-[18px]" />
            </Link>
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex size-8 items-center justify-center text-gray-500"
            >
              <List className="size-5" />
            </button>
          </div>
        </div>

        <div className="flex h-10 items-center overflow-x-auto border-b border-gray-100 px-4 scrollbar-hide">
          <div className="flex items-center gap-0">
            {categoryNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative whitespace-nowrap px-3 py-2 text-[11px] font-medium tracking-wide transition-colors",
                    isActive
                      ? "font-bold text-brand-text"
                      : "text-gray-500 hover:text-foreground"
                  )}
                >
                  {item.label.toUpperCase()}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-brand" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </header>

      {/* ========== DESKTOP HEADER (sm+) ========== */}
      <header className="fixed top-0 left-0 right-0 z-30 hidden bg-white sm:block sm:left-[240px] lg:left-[260px]">
        {/* Top strip: date + time */}
        <div className="border-b border-gray-100 bg-gray-50/60">
          <div className="mx-auto flex h-8 items-center justify-between px-4 sm:px-5 lg:px-6">
            <DateTimeDisplay />
            <div className="flex items-center gap-4 text-[11px] text-gray-500">
              <Link href="/tentang-kami" className="transition-colors hover:text-foreground">
                Tentang Kami
              </Link>
              <Link href="/hubungi-kami" className="transition-colors hover:text-foreground">
                Kontak
              </Link>
              <span className="h-3 w-px bg-gray-200" />
              {mounted && user ? (
                <Link href="/profile" className="flex items-center gap-1 transition-colors hover:text-foreground">
                  <User className="size-3" />
                  <span>Profil</span>
                </Link>
              ) : (
                <Link href="/login" className="transition-colors hover:text-foreground">
                  Masuk
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Main header: Search + Actions */}
        <div className="border-b border-gray-100">
          <div className="mx-auto flex h-14 items-center justify-between px-4 sm:h-16 sm:px-5 lg:px-6">
            <Link href="/" className="flex shrink-0 items-center gap-3 sm:hidden">
              <div className="relative h-9 w-9">
                <Image
                  src="/logo-metrik.png"
                  alt="Metrik Media"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-bold tracking-tight text-foreground leading-none">
                  {SITE_CONFIG.shortName}
                </span>
                <span className="text-[9px] font-medium tracking-[0.15em] text-gray-400 uppercase">
                  {SITE_CONFIG.tagline}
                </span>
              </div>
            </Link>

            <div className="flex-1" />

            <div className="flex items-center gap-3">
              <Link
                href="/pencarian"
                className="flex size-9 items-center justify-center text-gray-400 transition-colors hover:text-foreground"
              >
                <MagnifyingGlass className="size-5" />
              </Link>
              <span className="h-5 w-px bg-gray-200" />
              <Link
                href="/login"
                className="bg-brand text-gray-900 px-4 py-1.5 text-[12px] font-semibold tracking-wide transition-colors hover:bg-amber-400"
              >
                LANGGANAN
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Nav - mobile only (< sm) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white sm:hidden">
        <div className="flex items-center justify-around px-2 py-1.5">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 px-4 py-1 text-[9px] transition-colors",
                  isActive ? "text-brand-text" : "text-gray-400"
                )}
              >
                <item.icon
                  className={cn("size-5", isActive && "text-brand-text")}
                  weight={isActive ? "fill" : "regular"}
                />
                <span className={cn(isActive && "font-semibold")}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
