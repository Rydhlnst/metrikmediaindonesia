"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/use-session";
import {
  List,
  X,
  MagnifyingGlass,
  User,
  House,
  BookmarkSimple,
  Sparkle,
  SignOut,
  ArrowRight,
  TrendUp,
} from "@phosphor-icons/react/dist/ssr";
import { BrandName } from "@/components/shared/brand-name";
import { MediaImage } from "@/components/shared/media-image";
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

const TRENDING_KEYWORDS = [
  "Transformasi Digital",
  "Piala Dunia U-20",
  "IKN Nusantara",
  "Kebijakan Moneter",
  "Pasar Modal",
];

export function HeaderClient() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const { user } = useSession();

  // Keyboard shortcut Cmd+K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchFocused(true);
      }
      if (e.key === "Escape") {
        setIsSearchFocused(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Click outside to close suggestion dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      router.push(`/pencarian?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleQuickSearch = (keyword: string) => {
    setSearchQuery(keyword);
    setIsSearchFocused(false);
    router.push(`/pencarian?q=${encodeURIComponent(keyword)}`);
  };

  return (
    <header className="w-full bg-background border-b border-black/10 sticky top-0 z-50">
      
      {/* TINGKAT 1: Top Bar Header Utama */}
      <div className="border-b border-black/5 bg-background">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-2.5 flex items-center justify-between gap-4">
          
          {/* Left: Mobile Sheet Trigger (lg:hidden) + Official Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button
                  aria-label="Buka Menu Navigation"
                  className="p-1.5 rounded-none text-foreground hover:bg-black/5 transition-colors shrink-0 lg:hidden"
                >
                  <List className="size-6 text-foreground" weight="bold" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:w-[320px] p-0 border-r border-black/10 bg-background" showCloseButton={false}>
                <SheetTitle className="sr-only">Navigasi Utama</SheetTitle>
                <PremiumMobileSheet onClose={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>

            <Link href="/" className="flex items-center shrink-0 min-w-0">
              <BrandName size="sm" showLogo={true} className="truncate max-w-[220px] sm:max-w-none" />
            </Link>
          </div>

          {/* Center: Modern Desktop Search Bar with Shortcut & Quick Suggestions */}
          <div ref={searchContainerRef} className="hidden lg:block flex-1 max-w-lg relative mx-2">
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center w-full rounded-none border border-black/15 bg-black/[0.02] hover:bg-black/[0.04] focus-within:bg-white focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/10 transition-all"
            >
              <div className="pl-3 pr-2 text-muted-foreground flex items-center">
                <MagnifyingGlass className="size-4 transition-colors" weight="bold" />
              </div>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari topik, berita, atau daerah..."
                className="w-full py-2 text-xs font-medium bg-transparent text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
              />

              {/* Clear button if typed */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 mr-1 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Bersihkan pencarian"
                >
                  <X className="size-3.5" />
                </button>
              )}

              {/* Keyboard Shortcut badge */}
              <kbd className="hidden xl:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/70 bg-black/5 border border-black/10 rounded-none mr-1.5 select-none">
                ⌘K
              </kbd>

              {/* Modern Action Submit Button */}
              <button
                type="submit"
                className="px-3.5 py-2 bg-foreground hover:bg-gold text-white text-[11px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                <span>Cari</span>
                <ArrowRight className="size-3" weight="bold" />
              </button>
            </form>

            {/* Quick Search Suggestions Dropdown on Focus */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-black/15 shadow-lg p-3.5 z-50 space-y-3">
                <div className="flex items-center justify-between border-b border-black/5 pb-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                    <TrendUp className="size-3 text-gold" weight="bold" /> Topik Trending
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground/70">Tekan ESC untuk tutup</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING_KEYWORDS.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => handleQuickSearch(kw)}
                      className="px-2.5 py-1 text-xs font-medium text-foreground bg-black/5 hover:bg-gold hover:text-white transition-colors text-left"
                    >
                      {kw}
                    </button>
                  ))}
                </div>
                <div className="pt-2 border-t border-black/5 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Jelajahi kategori:</span>
                  <div className="flex items-center gap-2 font-bold text-foreground">
                    <button type="button" onClick={() => handleQuickSearch("Bisnis")} className="hover:text-gold">Bisnis</button>
                    <span>•</span>
                    <button type="button" onClick={() => handleQuickSearch("Teknologi")} className="hover:text-gold">Teknologi</button>
                    <span>•</span>
                    <button type="button" onClick={() => handleQuickSearch("Daerah")} className="hover:text-gold">Daerah</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Actions (Desktop & Mobile) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile Search Button */}
            <Link
              href="/pencarian"
              className="lg:hidden p-2 text-foreground hover:bg-black/5 transition-colors rounded-none"
              aria-label="Pencarian Berita"
            >
              <MagnifyingGlass className="size-5 text-foreground" weight="bold" />
            </Link>

            <Link
              href="/saved"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-gold-deep hover:bg-black/5 transition-colors rounded-none"
            >
              <BookmarkSimple className="size-4" />
              <span>Disimpan</span>
            </Link>

            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-none hover:bg-black/90 transition-all active:scale-[0.99]"
              >
                <User className="size-4 text-white" />
                <span className="text-white hidden sm:inline">Dashboard</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-none hover:bg-black/90 transition-all active:scale-[0.99]"
              >
                <User className="size-4 text-white" />
                <span className="text-white hidden sm:inline">Masuk</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* TINGKAT 2: Bar Navigasi Kategori (Clean Editorial Border Tabs) */}
      <div className="bg-background border-t border-black/5">
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 flex items-center overflow-x-auto scrollbar-hide">
          <nav className="flex items-center gap-1 py-0.5 text-xs font-bold uppercase tracking-wider">
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
                    "px-3 py-2 whitespace-nowrap transition-all duration-150 border-b-2 flex items-center gap-1.5 text-xs",
                    isActive
                      ? "text-primary font-bold border-primary bg-primary/5"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:border-primary/40",
                    item.highlight && "text-primary font-extrabold hover:text-gold-deep"
                  )}
                >
                  {item.label}
                  {item.badge && (
                    <span className="px-1.5 py-0.5 text-[9px] font-black uppercase rounded-none bg-black text-white">
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
    <div className="flex h-full flex-col bg-background text-foreground">
      {/* Sheet Header */}
      <div className="flex h-[62px] items-center justify-between border-b border-black/10 px-5">
        <BrandName size="sm" className="uppercase" />
        <button
          onClick={onClose}
          className="p-2 text-muted-foreground hover:bg-black/5 transition-colors rounded-none"
          aria-label="Tutup Menu"
        >
          <X className="size-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
        
        {/* User Account Section */}
        <div>
          {user ? (
            <div className="flex flex-col gap-3 p-3 bg-white border border-black/10 rounded-none">
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <div className="relative size-10 overflow-hidden rounded-none bg-surface-container">
                    <MediaImage src={user.avatar} alt={user.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="flex size-10 items-center justify-center bg-black text-white text-sm font-bold rounded-none uppercase">
                    {user.name?.charAt(0) || "U"}
                  </div>
                )}
                <div className="flex flex-1 flex-col min-w-0">
                  <span className="text-xs font-bold truncate">{user.name}</span>
                  <span className="text-[11px] text-muted-foreground truncate">{user.email}</span>
                </div>
              </div>
              <Link
                href="/dashboard"
                onClick={onClose}
                className="w-full text-center py-2 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-none block hover:bg-black/90 transition-all"
              >
                Ke CMS Dashboard
              </Link>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-none hover:bg-black/90 transition-all"
            >
              <User className="size-4 text-white" />
              <span className="text-white">Masuk / Daftar Akun</span>
            </Link>
          )}
        </div>

        {/* Quick Nav */}
        <div className="space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-2 px-1">
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
                    ? "bg-gold/10 text-gold-deep border-l-2 border-gold"
                    : "text-muted-foreground hover:bg-black/5 hover:text-foreground"
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
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70 mb-2 px-1">
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
                    ? "text-gold-deep font-extrabold bg-gold/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-black/5",
                  item.highlight && "text-gold-deep"
                )}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] bg-gold text-white rounded-none font-bold">
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
