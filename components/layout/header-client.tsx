"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
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
  SignOut,
} from "@phosphor-icons/react/dist/ssr";
import { BrandName } from "@/components/shared/brand-name";
import { Divider } from "@/components/shared/divider";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";

const NAV_CATEGORIES = [
  { label: "Beranda", href: "/" },
  { label: "Nasional", href: "/nasional" },
  { label: "Politik", href: "/politik" },
  { label: "Bisnis", href: "/bisnis" },
  { label: "Teknologi", href: "/teknologi" },
  { label: "Lifestyle", href: "/lifestyle" },
  { label: "Entertainment", href: "/entertainment" },
  { label: "Sports", href: "/sports" },
  { label: "Daerah", href: "/daerah" },
  { label: "Video", href: "/video", badge: "HD" },
  { label: "Foto", href: "/foto" },
  { label: "Publish Business", href: "/business-publication", highlight: true },
];

export function HeaderClient() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const { user } = useSession();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/pencarian?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="w-full bg-background border-b border-outline-variant sticky top-0 z-50 shadow-2xs">
      
      {/* TINGKAT 1: Top Bar Header Utama */}
      <div className="border-b border-outline-variant/70 bg-background">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-2.5 flex items-center justify-between gap-3">
          
          {/* Left: Mobile Sheet Trigger + Logo (Clean Mobile Layout) */}
          <div className="flex items-center gap-2.5 min-w-0">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  aria-label="Buka Menu Navigation"
                  className="p-1.5 rounded-none text-on-surface hover:bg-surface-container-low transition-colors shrink-0"
                >
                  <List className="size-6 text-on-surface" weight="bold" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[320px] p-0 border-r border-outline-variant bg-background" showCloseButton={false}>
                <SheetTitle className="sr-only">Navigasi Utama</SheetTitle>
                <PremiumMobileSheet onClose={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center shrink-0 min-w-0">
              <BrandName size="sm" className="uppercase truncate max-w-[200px] sm:max-w-none text-xs sm:text-sm md:text-xl" />
            </Link>
          </div>

          {/* Center: Desktop Search Bar (Hidden on Mobile) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex flex-1 max-w-md items-center relative mx-4"
          >
            <div className="relative w-full flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari berita, topik, atau daerah..."
                className="w-full pl-9 pr-22 py-2 text-xs font-medium rounded-none border border-outline-variant bg-surface-container-lowest text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary transition-all"
              />
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant" />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 px-4 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-none hover:bg-primary/90 transition-all cursor-pointer shadow-2xs"
              >
                Cari
              </button>
            </div>
          </form>

          {/* Right: Actions (Hidden on Mobile, Displayed on Desktop) */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Link
              href="/saved"
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors rounded-none"
            >
              <BookmarkSimple className="size-4" />
              <span>Disimpan</span>
            </Link>

            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-none hover:bg-primary/90 transition-all active:scale-[0.99] shadow-2xs"
              >
                <User className="size-4 text-white" />
                <span className="text-white">Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-none hover:bg-primary/90 transition-all active:scale-[0.99] shadow-2xs"
              >
                <User className="size-4 text-white" />
                <span className="text-white">Masuk</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* TINGKAT 2: Bar Navigasi Kategori */}
      <div className="bg-background">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex items-center overflow-x-auto scrollbar-hide">
          <nav className="flex items-center gap-1 py-1 text-xs font-bold uppercase tracking-wider">
            {NAV_CATEGORIES.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2.5 whitespace-nowrap transition-all duration-150 border-b-2 flex items-center gap-1.5 rounded-none",
                    isActive
                      ? "text-secondary font-bold border-secondary bg-secondary/5"
                      : "text-on-surface-variant border-transparent hover:text-secondary hover:border-secondary/40",
                    item.highlight && "text-amber-600 font-extrabold hover:text-amber-700"
                  )}
                >
                  {item.label}
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded-none bg-red-600 text-white animate-pulse">
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

/**
 * Premium Mobile Drawer / Sheet Navigation
 */
function PremiumMobileSheet({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const { user, signOut } = useSession();

  const quickNav = [
    { label: "Beranda Utama", href: "/", icon: House },
    { label: "Jelajah & Pencarian", href: "/pencarian", icon: Sparkle },
    { label: "Berita Disimpan", href: "/saved", icon: BookmarkSimple },
  ];

  return (
    <div className="flex h-full flex-col bg-background text-on-surface">
      {/* Sheet Header */}
      <div className="flex h-[62px] items-center justify-between border-b border-outline-variant px-5">
        <BrandName size="sm" className="uppercase" />
        <button
          onClick={onClose}
          className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-none"
          aria-label="Tutup Menu"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        
        {/* User Account Section */}
        <div>
          {user ? (
            <div className="flex flex-col gap-3 p-3 bg-surface-container-low border border-outline-variant rounded-none">
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <div className="relative size-10 overflow-hidden rounded-none bg-surface-container">
                    <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex size-10 items-center justify-center bg-primary text-white text-sm font-bold rounded-none uppercase">
                    {user.name?.charAt(0) || "U"}
                  </div>
                )}
                <div className="flex flex-1 flex-col min-w-0">
                  <span className="text-xs font-bold truncate">{user.name}</span>
                  <span className="text-[11px] text-on-surface-variant truncate">{user.email}</span>
                </div>
              </div>
              <Link
                href="/dashboard"
                onClick={onClose}
                className="w-full text-center py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-none block hover:bg-primary/90 transition-all shadow-2xs"
              >
                Ke CMS Dashboard
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-none hover:bg-primary/90 transition-all shadow-2xs"
            >
              <User className="size-4 text-white" />
              <span className="text-white">Masuk / Daftar Akun</span>
            </Link>
          )}
        </div>

        {/* Quick Nav */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70 mb-2 px-1">
            Navigasi Cepat
          </div>
          {quickNav.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors rounded-none",
                  isActive
                    ? "bg-secondary/10 text-secondary border-l-2 border-secondary"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                )}
              >
                <Icon className="size-4" weight={isActive ? "fill" : "regular"} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <Divider />

        {/* Categories List */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/70 mb-2 px-1">
            Kategori & Portal
          </div>
          {NAV_CATEGORIES.map((item) => {
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
                  "flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-none",
                  isActive
                    ? "text-secondary font-extrabold bg-secondary/5"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low",
                  item.highlight && "text-amber-600"
                )}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] bg-red-600 text-white rounded-none font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Sign Out Button */}
        {user && (
          <>
            <Divider />
            <button
              onClick={() => {
                signOut();
                onClose();
              }}
              className="flex w-full items-center justify-center gap-2 py-2.5 text-xs font-bold uppercase tracking-wider text-destructive bg-error-container/20 hover:bg-error-container/40 rounded-none transition-colors"
            >
              <SignOut className="size-4" />
              <span>Keluar</span>
            </button>
          </>
        )}

      </div>
    </div>
  );
}
