"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { useSession } from "@/lib/use-session";
import {
  House,
  Sparkle,
  Bell,
  CaretDown,
} from "@phosphor-icons/react/dist/ssr";

const navItems = [
  { label: "Home", href: "/", icon: House },
  { label: "For You", href: "/pencarian", icon: Sparkle },
  { label: "Following", href: "/saved", icon: Bell },
  { label: "Suggestions", href: "/pencarian", icon: Sparkle },
];

const categories = [
  { label: "Bisnis", href: "/bisnis" },
  { label: "Dunia", href: "/dunia" },
  { label: "Lokal", href: "/lokal" },
  { label: "Olahraga", href: "/olahraga" },
  { label: "Teknologi", href: "/teknologi" },
  { label: "Hiburan", href: "/hiburan" },
  { label: "Sosial & Budaya", href: "/sosial-dan-budaya" },
];

export function DesktopSidebar() {
  const pathname = usePathname();
  const { user, isLoading } = useSession();

  return (
    <aside className="fixed top-0 left-0 z-30 hidden h-screen w-[220px] border-r border-gray-100 bg-white sm:block lg:w-[240px]">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative h-12 w-12">
              <Image
                src="/logo-metrik.png"
                alt={SITE_CONFIG.shortName}
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="text-base font-bold tracking-tight">
              {SITE_CONFIG.shortName}
            </span>
          </Link>
        </div>

        {/* User Profile */}
        <div className="px-4 pb-2">
          {isLoading ? (
            <div className="flex items-center gap-3 rounded-xl p-2">
              <div className="size-10 shrink-0 animate-pulse rounded-full bg-gray-200" />
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="h-3.5 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-28 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          ) : user ? (
            <Link href="/profile" className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gray-50">
              {user.avatar ? (
                <div className="relative size-10 shrink-0 overflow-hidden rounded-full bg-gray-100">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-bold text-gray-900">
                  {user.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
              <div className="flex flex-1 items-center justify-between min-w-0">
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-semibold truncate">{user.name}</span>
                  <span className="text-[11px] text-gray-400 truncate">{user.email}</span>
                </div>
                <CaretDown className="size-4 shrink-0 text-gray-400" />
              </div>
            </Link>
          ) : (
            <Link href="/login" className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-gray-50">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-400">
                <Sparkle className="size-5" />
              </div>
              <div className="flex flex-1 flex-col min-w-0">
                <span className="text-sm font-medium text-gray-500">Masuk</span>
                <span className="text-[11px] text-gray-400">Untuk fitur lengkap</span>
              </div>
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <div className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all rounded-xl",
                    isActive
                      ? "bg-gray-100 text-foreground font-semibold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn("size-5 shrink-0", isActive ? "text-foreground" : "text-gray-400")}
                    weight={isActive ? "fill" : "regular"}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="mx-3 my-4 h-px bg-gray-100" />

          {/* Categories */}
          <div className="space-y-0.5">
            {categories.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all rounded-xl",
                    isActive
                      ? "bg-gray-100 text-foreground font-semibold"
                      : "text-gray-500 hover:bg-gray-50 hover:text-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </aside>
  );
}
