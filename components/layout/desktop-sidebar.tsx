"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import {
  House,
  MagnifyingGlass,
  BookmarkSimple,
  UserCircle,
  Newspaper,
  Info,
  Envelope,
  TrendUp,
  Clock,
} from "@phosphor-icons/react/dist/ssr";

const mainNav = [
  { label: "Beranda", href: "/", icon: House },
  { label: "Bisnis", href: "/bisnis", icon: Newspaper },
  { label: "Olahraga", href: "/olahraga", icon: TrendUp },
  { label: "Pendidikan", href: "/pendidikan", icon: Newspaper },
  { label: "Sosial & Budaya", href: "/sosial-dan-budaya", icon: Newspaper },
];

const secondaryNav = [
  { label: "Pencarian", href: "/pencarian", icon: MagnifyingGlass },
  { label: "Tersimpan", href: "/saved", icon: BookmarkSimple },
  { label: "Riwayat", href: "/profile", icon: Clock },
  { label: "Profil", href: "/profile", icon: UserCircle },
];

const bottomLinks = [
  { label: "Tentang Kami", href: "/tentang-kami", icon: Info },
  { label: "Hubungi Kami", href: "/hubungi-kami", icon: Envelope },
];

export function DesktopSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 z-30 hidden h-screen w-[240px] border-r border-gray-100 bg-white sm:block lg:w-[260px]">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center px-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-9 w-9">
              <Image
                src="/logo-metrik.png"
                alt={SITE_CONFIG.shortName}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight leading-none">
                {SITE_CONFIG.shortName}
              </span>
              <span className="text-[10px] font-medium tracking-[0.1em] text-gray-400 uppercase mt-0.5">
                {SITE_CONFIG.tagline}
              </span>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-2">
          <div className="space-y-0.5">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all rounded-xl",
                    isActive
                      ? "bg-brand/15 text-brand-text font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn("size-5 shrink-0", isActive ? "text-brand-text" : "text-gray-400")}
                    weight={isActive ? "fill" : "regular"}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="mx-3 my-4 h-px bg-gray-100" />

          <div className="space-y-0.5">
            {secondaryNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all rounded-xl",
                    isActive
                      ? "bg-brand/15 text-brand-text font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn("size-5 shrink-0", isActive ? "text-brand-text" : "text-gray-400")}
                    weight={isActive ? "fill" : "regular"}
                  />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Links */}
        <div className="border-t border-gray-100 px-3 py-3 space-y-0.5">
          {bottomLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-sm font-medium transition-all rounded-xl",
                  isActive
                    ? "text-brand-text"
                    : "text-gray-500 hover:text-foreground"
                )}
              >
                <item.icon className="size-4.5" />
                {item.label}
              </Link>
            );
          })}
          <div className="mt-2 px-3">
            <p className="text-[11px] text-gray-400">
              &copy; {new Date().getFullYear()} {SITE_CONFIG.shortName}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
