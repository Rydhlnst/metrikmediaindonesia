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
  CaretRight,
} from "@phosphor-icons/react/dist/ssr";

const mainNav = [
  { label: "Beranda", href: "/", icon: House },
  { label: "Bisnis", href: "/bisnis", icon: Newspaper },
  { label: "Olahraga", href: "/olahraga", icon: Newspaper },
  { label: "Pendidikan", href: "/pendidikan", icon: Newspaper },
  { label: "Sosial & Budaya", href: "/sosial-dan-budaya", icon: Newspaper },
];

const secondaryNav = [
  { label: "Pencarian", href: "/pencarian", icon: MagnifyingGlass },
  { label: "Tersimpan", href: "/saved", icon: BookmarkSimple },
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
        <div className="flex h-14 items-center border-b border-gray-100 px-4 lg:h-16 lg:px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative h-8 w-8">
              <Image
                src="/logo-metrik.png"
                alt={SITE_CONFIG.shortName}
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold tracking-tight leading-none">
                {SITE_CONFIG.shortName}
              </span>
              <span className="text-[8px] font-medium tracking-[0.15em] text-gray-400 uppercase">
                {SITE_CONFIG.tagline}
              </span>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">
            Kategori
          </p>
          {mainNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 text-[13px] font-medium transition-colors rounded-md",
                  isActive
                    ? "bg-amber-50 text-brand-text"
                    : "text-gray-600 hover:bg-gray-50 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn("size-[18px]", isActive ? "text-brand-text" : "text-gray-400")}
                    weight={isActive ? "fill" : "regular"}
                  />
                  {item.label}
                </div>
                <CaretRight className={cn("size-3.5", isActive ? "text-brand-text" : "text-gray-300")} />
              </Link>
            );
          })}

          <div className="mx-3 my-3 h-px bg-gray-100" />

          <p className="px-3 text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">
            Lainnya
          </p>
          {secondaryNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 text-[13px] font-medium transition-colors rounded-md",
                  isActive
                    ? "bg-amber-50 text-brand-text"
                    : "text-gray-600 hover:bg-gray-50 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    className={cn("size-[18px]", isActive ? "text-brand-text" : "text-gray-400")}
                    weight={isActive ? "fill" : "regular"}
                  />
                  {item.label}
                </div>
                <CaretRight className={cn("size-3.5", isActive ? "text-brand-text" : "text-gray-300")} />
              </Link>
            );
          })}
        </nav>

        {/* Bottom Links */}
        <div className="border-t border-gray-100 px-3 py-3">
          {bottomLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 text-[12px] font-medium transition-colors rounded-md",
                  isActive
                    ? "text-brand-text"
                    : "text-gray-500 hover:text-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
          <div className="mt-2 px-3">
            <p className="text-[10px] text-gray-400">
              &copy; {new Date().getFullYear()} {SITE_CONFIG.shortName}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
