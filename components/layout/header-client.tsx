"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { useSession } from "@/lib/use-session";
import Image from "next/image";
import {
  List,
  X,
  MagnifyingGlass,
  User,
  House,
  BookmarkSimple,
  Sparkle,
  Building,
  Video,
  Camera,
  Flame,
} from "@phosphor-icons/react/dist/ssr";
import { BrandName } from "@/components/shared/brand-name";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const TIER_2_NAV = [
  { label: "Beranda", href: "/" },
  { label: "Nasional", href: "/category/nasional" },
  { label: "Politik", href: "/category/politik" },
  { label: "Bisnis", href: "/category/bisnis" },
  { label: "Teknologi", href: "/category/teknologi" },
  { label: "Lifestyle", href: "/category/lifestyle" },
  { label: "Entertainment", href: "/category/entertainment" },
  { label: "Sports", href: "/category/sports" },
  { label: "Daerah", href: "/category/daerah" },
  { label: "Video", href: "/video", badge: "HD" },
  { label: "Foto", href: "/foto" },
  { label: "Publish Business", href: "/business-publication", highlight: true },
];

export function HeaderClient() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const { user, isLoading, signOut } = useSession();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/pencarian?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full bg-background border-b border-outline-variant sticky top-0 z-50 shadow-xs">
      
      {/* ============================================================ */}
      /* TINGKAT 1: Top Bar (Logo + Search Input + Actions)            */
      {/* ============================================================ */}
      <div className="border-b border-outline-variant/60 bg-background/95 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-3 flex items-center justify-between gap-4">
          
          {/* Left: Mobile Menu Trigger & Logo */}
          <div className="flex items-center gap-3">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  aria-label="Buka Menu Navigation"
                  className="lg:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <List className="size-6" weight="bold" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full p-0 sm:w-[280px]" showCloseButton={false}>
                <SheetTitle className="sr-only">Navigasi Utama</SheetTitle>
                <MobileSidebar onClose={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center gap-2 shrink-0">
              <BrandName size="md" className="uppercase" />
            </Link>
          </div>

          {/* Center: Search Bar Interaktif */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex flex-1 max-w-lg items-center relative mx-4"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berita, topik, tokoh, atau wilayah..."
                className="w-full pl-10 pr-20 py-2 text-sm rounded-full border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all shadow-xs"
              />
              <MagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1 bg-secondary text-on-secondary text-xs font-semibold rounded-full hover:bg-secondary/90 transition-colors"
              >
                Cari
              </button>
            </div>
          </form>

          {/* Right: Quick Actions & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              href="/pencarian"
              className="sm:hidden p-2 text-on-surface hover:bg-surface-container rounded-full transition-colors"
              aria-label="Cari Berita"
            >
              <MagnifyingGlass className="size-5" />
            </Link>

            <Link
              href="/saved"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-on-surface-variant hover:text-secondary hover:bg-surface-container-low rounded-lg transition-colors"
            >
              <BookmarkSimple className="size-4" />
              <span>Disimpan</span>
            </Link>

            {user ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg text-xs font-bold transition-colors"
              >
                <User className="size-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-primary text-on-primary hover:bg-primary/90 text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <User className="size-4" />
                <span>Masuk</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      /* TINGKAT 2: Category Navigation Bar (Single Clean Bar)         */
      {/* ============================================================ */}
      <div className="bg-background">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex items-center overflow-x-auto scrollbar-hide">
          <nav className="flex items-center gap-1 py-1 text-xs font-bold uppercase tracking-wider">
            {TIER_2_NAV.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2.5 whitespace-nowrap transition-all duration-150 border-b-2 flex items-center gap-1",
                    isActive
                      ? "text-secondary font-bold border-secondary bg-secondary/5"
                      : "text-on-surface-variant border-transparent hover:text-secondary hover:border-secondary/40",
                    item.highlight && "text-amber-600 font-extrabold hover:text-amber-700"
                  )}
                >
                  {item.label}
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded bg-red-600 text-white animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

    </header>
  );
}

function MobileSidebar({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const { user, signOut } = useSession();

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex h-[60px] items-center justify-between border-b border-outline-variant px-4">
        <BrandName size="sm" />
        <button
          onClick={onClose}
          className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-1">
          {TIER_2_NAV.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-secondary/10 text-secondary font-bold"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                )}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[10px] bg-red-600 text-white rounded font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {user && (
          <div className="pt-4 border-t border-outline-variant">
            <button
              onClick={() => {
                signOut();
                onClose();
              }}
              className="w-full text-left px-3 py-2.5 text-sm font-bold text-destructive hover:bg-error-container/20 rounded-lg transition-colors"
            >
              Keluar dari Akun
            </button>
          </div>
        )}
      </nav>
    </div>
  );
}
