"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import {
  MagnifyingGlass,
  BookmarkSimple,
  X,
  SignIn,
  SignOut,
  House,
  Info,
  Envelope,
  Newspaper,
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
  { label: "Artikel Tersimpan", href: "/saved", icon: BookmarkSimple },
  { label: "Tentang Kami", href: "/tentang-kami", icon: Info },
  { label: "Hubungi Kami", href: "/hubungi-kami", icon: Envelope },
];

interface SidebarProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

export function Sidebar({ user, isOpen, onClose, onSignOut }: SidebarProps) {
  const pathname = usePathname();

  const handleNavClick = () => onClose();

  return (
    <>
      {/* Full screen overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-all duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      {/* Full height sidebar panel */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col bg-white transition-transform duration-300 ease-out sm:w-[380px]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-gray-100 px-5">
          <Link href="/" className="flex items-center gap-2.5" onClick={handleNavClick}>
            <div className="relative h-8 w-8">
              <Image
                src="/logo-metrik.png"
                alt={SITE_CONFIG.shortName}
                fill
                className="object-contain"
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
          <button
            onClick={onClose}
            className="flex size-9 items-center justify-center text-gray-400 hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* User Section */}
        {user ? (
          <div className="border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-brand text-gray-900 text-sm font-bold">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold truncate">{user.name}</p>
                <p className="text-[11px] text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-b border-gray-100 px-5 py-4">
            <Link
              href="/login"
              onClick={handleNavClick}
              className="flex items-center justify-center gap-2 bg-brand px-4 py-2.5 text-[12px] font-semibold text-gray-900 transition-colors hover:bg-amber-400"
            >
              <SignIn className="size-4" />
              Masuk / Daftar
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          {/* Main Categories */}
          <div className="px-3 pt-4 pb-2">
            <p className="px-3 text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">
              Kategori
            </p>
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center justify-between px-3 py-3 text-[13px] font-medium transition-colors rounded-md",
                    isActive
                      ? "bg-amber-50 text-brand-text"
                      : "text-gray-700 hover:bg-gray-50 hover:text-foreground"
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
          </div>

          <div className="mx-5 h-px bg-gray-100" />

          {/* Secondary Nav */}
          <div className="px-3 pt-2 pb-4">
            <p className="px-3 text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1 mt-2">
              Lainnya
            </p>
            {secondaryNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center justify-between px-3 py-3 text-[13px] font-medium transition-colors rounded-md",
                    isActive
                      ? "bg-amber-50 text-brand-text"
                      : "text-gray-700 hover:bg-gray-50 hover:text-foreground"
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
          </div>
        </nav>

        {/* Footer */}
        {user && (
          <div className="border-t border-gray-100 px-5 py-4">
            <button
              onClick={() => { onSignOut(); onClose(); }}
              className="flex items-center gap-2 text-[12px] text-gray-500 hover:text-red-600 transition-colors"
            >
              <SignOut className="size-4" />
              Keluar
            </button>
          </div>
        )}

        <div className="border-t border-gray-100 px-5 py-3">
          <p className="text-[10px] text-gray-400 text-center">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}
          </p>
        </div>
      </aside>
    </>
  );
}
