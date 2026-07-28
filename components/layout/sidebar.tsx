"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { AvatarAuthor } from "@/components/shared/avatar-author";
import {
  House,
  Sparkle,
  UserPlus,
  MagnifyingGlass,
  ChartLineUp,
  Trophy,
  GraduationCap,
  Buildings,
  X,
  SignIn,
  SignOut,
} from "@phosphor-icons/react/dist/ssr";

const mainNav = [
  { label: "Beranda", href: "/", icon: House },
  { label: "Pencarian", href: "/pencarian", icon: MagnifyingGlass },
  { label: "Tentang Kami", href: "/tentang-kami", icon: Sparkle },
  { label: "Hubungi Kami", href: "/hubungi-kami", icon: UserPlus },
];

const categories = [
  { label: "Bisnis", slug: "bisnis", icon: ChartLineUp },
  { label: "Olahraga", slug: "olahraga", icon: Trophy },
  { label: "Pendidikan", slug: "pendidikan", icon: GraduationCap },
  { label: "Sosial & Budaya", slug: "sosial-dan-budaya", icon: Buildings },
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
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-white dark:bg-background transition-transform duration-300 lg:w-[240px] lg:translate-x-0 lg:border-r lg:border-border",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header with title centered + close */}
        <div className="flex h-14 items-center justify-between border-b border-border px-4 lg:h-12">
          <Link href="/" className="flex items-center gap-2" onClick={handleNavClick}>
            <span className="text-lg font-bold tracking-tight font-serif">
              {SITE_CONFIG.shortName}
            </span>
          </Link>
          <button onClick={onClose} className="flex size-8 items-center justify-center hover:bg-muted lg:hidden">
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
              Sign In
            </Link>
          )}
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {mainNav.map((item) => {
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

          <div className="my-5 border-t border-border" />

          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Categories
          </p>
          <div className="space-y-1">
            {categories.map((cat) => {
              const isActive = pathname === `/${cat.slug}`;
              return (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  onClick={handleNavClick}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <cat.icon className="size-5" weight={isActive ? "fill" : "regular"} />
                  {cat.label}
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
