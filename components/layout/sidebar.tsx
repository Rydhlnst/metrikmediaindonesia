"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { AvatarAuthor } from "@/components/shared/avatar-author";
import {
  MagnifyingGlass,
  BookmarkSimple,
  UserCircle,
  X,
  SignIn,
  SignOut,
  House,
  Newspaper,
  Info,
  Envelope,
} from "@phosphor-icons/react/dist/ssr";

const secondaryNav = [
  { label: "Beranda", href: "/", icon: House },
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
      {/* Mobile Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-white dark:bg-background transition-transform duration-300",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-12 items-center justify-between border-b border-border px-4">
          <Link href="/" className="flex items-center gap-2" onClick={handleNavClick}>
            <span className="text-lg font-bold tracking-tight">
              {SITE_CONFIG.shortName}
            </span>
          </Link>
          <button onClick={onClose} className="flex size-8 items-center justify-center hover:bg-muted">
            <X className="size-5" />
          </button>
        </div>

        {/* User Section */}
        <div className="border-b border-border px-4 py-4">
          {user ? (
            <div className="flex items-center gap-3">
              <AvatarAuthor name={user.name || "User"} size="lg" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-[11px] text-muted-foreground">{user.email}</p>
              </div>
              <button
                onClick={() => { onSignOut(); onClose(); }}
                className="text-muted-foreground hover:text-foreground"
                title="Sign Out"
              >
                <SignOut className="size-5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={handleNavClick}
              className="flex items-center justify-center gap-2 border border-border px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              <SignIn className="size-5" />
              Masuk
            </Link>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {secondaryNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="size-5" weight={isActive ? "fill" : "regular"} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-border px-4 py-4">
          <p className="text-[11px] text-muted-foreground">
            &copy; {new Date().getFullYear()} {SITE_CONFIG.name}
          </p>
        </div>
      </aside>
    </>
  );
}
