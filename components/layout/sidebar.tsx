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
  TrendUp,
  UserCircle,
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
  { label: "Artikel Tersimpan", href: "/saved", icon: BookmarkSimple },
  { label: "Riwayat", href: "/profile", icon: Clock },
  { label: "Profil", href: "/profile", icon: UserCircle },
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
      {/* Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-all duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={cn(
          "fixed inset-y-0 right-0 z-[70] flex w-full max-w-sm flex-col bg-white transition-transform duration-300 ease-out sm:w-[380px]",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 px-5">
          <Link href="/" className="flex items-center gap-3" onClick={handleNavClick}>
            <div className="relative h-8 w-8">
              <Image src="/logo-metrik.png" alt={SITE_CONFIG.shortName} fill className="object-contain" />
            </div>
            <span className="text-base font-bold tracking-tight">{SITE_CONFIG.shortName}</span>
          </Link>
          <button
            onClick={onClose}
            className="flex size-10 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-foreground transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* User Section */}
        {user ? (
          <div className="border-b border-gray-100 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-brand text-sm font-bold text-gray-900">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-b border-gray-100 px-5 py-4">
            <Link
              href="/login"
              onClick={handleNavClick}
              className="flex items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-amber-400"
            >
              <SignIn className="size-4" />
              Masuk / Daftar
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-0.5">
            {mainNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 text-sm font-medium transition-all rounded-xl",
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
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 text-sm font-medium transition-all rounded-xl",
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

        {/* Footer */}
        <div className="border-t border-gray-100 px-3 py-3 space-y-0.5">
          <Link
            href="/tentang-kami"
            onClick={handleNavClick}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-500 rounded-xl hover:text-foreground"
          >
            <Info className="size-4.5" />
            Tentang Kami
          </Link>
          <Link
            href="/hubungi-kami"
            onClick={handleNavClick}
            className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-500 rounded-xl hover:text-foreground"
          >
            <Envelope className="size-4.5" />
            Hubungi Kami
          </Link>
          {user && (
            <button
              onClick={() => { onSignOut(); onClose(); }}
              className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-500 rounded-xl hover:text-red-600"
            >
              <SignOut className="size-4.5" />
              Keluar
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
