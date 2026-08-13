"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG, NAVIGATION } from "@/lib/constants";
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
} from "@phosphor-icons/react/dist/ssr";
import { BrandName } from "@/components/shared/brand-name";
import { Divider } from "@/components/shared/divider";
import { SubNav } from "@/components/layout/sub-nav";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function HeaderClient() {
  const pathname = usePathname();
  const [sheetOpen, setSheetOpen] = useState(false);
  const { user, isLoading, signOut } = useSession();

  return (
    <>
      {/* Sticky Header */}
      <div className="sticky top-0 z-50">
        {/* Top Header Bar */}
        <header className="bg-background w-full border-b border-outline-variant">
          <div className="max-w-[1280px] mx-auto px-4 md:px-16 py-4 flex justify-between items-center">
            {/* Left: hamburger + brand (desktop) */}
            <div className="flex items-center gap-6">
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <button aria-label="Open menu" className="md:hidden text-primary">
                    <List className="size-7" weight="bold" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full p-0 sm:w-[260px]" showCloseButton={false}>
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <MobileSidebar onClose={() => setSheetOpen(false)} />
                </SheetContent>
              </Sheet>
              <Link href="/" className="hidden md:block">
                <BrandName size="md" className="uppercase" />
              </Link>
            </div>

            {/* Center: brand (mobile) */}
            <Link
              href="/"
              className="md:hidden text-center flex-1"
            >
              <BrandName size="sm" className="uppercase" />
            </Link>

            {/* Center: nav links (desktop) */}
            <nav className="hidden md:flex gap-8 items-center">
              {NAVIGATION.main.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "font-label-md text-label-md uppercase tracking-wider transition-all duration-200 scale-95",
                    pathname === item.href
                      ? "text-secondary font-bold border-b-2 border-secondary pb-1"
                      : "text-on-surface hover:text-secondary"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right: search */}
            <div className="flex items-center gap-4">
              <Link href="/pencarian" className="text-primary hidden md:block">
                <MagnifyingGlass className="size-5" />
              </Link>
            </div>
          </div>
        </header>
      </div>

      {/* Sub-Navigation Bar (below navbar, above ticker) */}
      <SubNav pathname={pathname} />
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-outline-variant bg-background md:hidden">
        <Link
          href="/"
          className={cn(
            "flex size-12 items-center justify-center transition-colors",
            pathname === "/" ? "text-secondary" : "text-on-surface-variant"
          )}
        >
          <House className="size-6" weight={pathname === "/" ? "fill" : "regular"} />
        </Link>
        <Link
          href="/pencarian"
          className={cn(
            "flex size-12 items-center justify-center transition-colors",
            pathname === "/pencarian" ? "text-secondary" : "text-on-surface-variant"
          )}
        >
          <MagnifyingGlass className="size-6" />
        </Link>
        <Link
          href="/saved"
          className={cn(
            "flex size-12 items-center justify-center transition-colors",
            pathname === "/saved" ? "text-secondary" : "text-on-surface-variant"
          )}
        >
          <BookmarkSimple
            className="size-6"
            weight={pathname === "/saved" ? "fill" : "regular"}
          />
        </Link>
        <Link
          href="/profile"
          className={cn(
            "flex size-12 items-center justify-center transition-colors",
            pathname === "/profile" ? "text-secondary" : "text-on-surface-variant"
          )}
        >
          <User
            className="size-6"
            weight={pathname === "/profile" ? "fill" : "regular"}
          />
        </Link>
      </nav>
    </>
  );
}

function MobileSidebar({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const { user, isLoading, signOut } = useSession();

  const navItems = [
    { label: "Home", href: "/", icon: House },
    { label: "For You", href: "/pencarian", icon: Sparkle },
    { label: "Following", href: "/saved", icon: BookmarkSimple },
  ];

  const categories = [
    { label: "Bisnis", href: "/bisnis" },
    { label: "Olahraga", href: "/olahraga" },
    { label: "Pendidikan", href: "/pendidikan" },
    { label: "Sosial & Budaya", href: "/sosial-dan-budaya" },
    { label: "Teknologi", href: "/teknologi" },
  ];

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex h-[62px] items-center justify-between border-b border-outline-variant px-5">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <BrandName size="sm" />
        </Link>
        <button
          onClick={onClose}
          className="flex size-8 items-center justify-center text-on-surface-variant hover:bg-surface-container"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-5 py-4">
        <div className="mb-6">
          {isLoading ? (
            <div className="flex items-center gap-3">
              <div className="size-12 shrink-0 animate-pulse rounded-full bg-surface-container" />
              <div className="flex flex-1 flex-col gap-1.5">
                <div className="h-4 w-24 animate-pulse rounded bg-surface-container" />
                <div className="h-3 w-32 animate-pulse rounded bg-surface-container-low" />
              </div>
            </div>
          ) : user ? (
            <Link href="/profile" onClick={onClose} className="flex items-center gap-3">
              {user.avatar ? (
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full bg-surface-container">
                  <Image src={user.avatar} alt={user.name} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary-container text-base font-bold text-on-secondary-container">
                  {user.name?.charAt(0)?.toUpperCase() || "?"}
                </div>
              )}
              <div className="flex flex-1 flex-col min-w-0">
                <span className="text-sm font-semibold truncate">{user.name}</span>
                <span className="text-xs text-on-surface-variant truncate">{user.email}</span>
              </div>
            </Link>
          ) : (
            <Link href="/login" onClick={onClose} className="flex items-center gap-3">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-container text-on-surface-variant">
                <User className="size-6" />
              </div>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium">Masuk</span>
                <span className="text-xs text-on-surface-variant">Untuk fitur lengkap</span>
              </div>
            </Link>
          )}
        </div>

        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 text-[15px] font-medium transition-all",
                  isActive
                    ? "bg-surface-container text-on-surface font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                )}
              >
                <item.icon
                  className={cn("size-5 shrink-0", isActive ? "text-on-surface" : "text-on-surface-variant")}
                  weight={isActive ? "fill" : "regular"}
                />
                {item.label}
              </Link>
            );
          })}
        </div>

        <Divider className="my-4" />

        <div className="space-y-0.5">
          {categories.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 text-[15px] font-medium transition-all",
                  isActive
                    ? "bg-surface-container text-on-surface font-semibold"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {user && (
          <>
            <Divider className="my-4" />
            <button
              onClick={() => { signOut(); onClose(); }}
              className="flex w-full items-center gap-3 px-3 py-3 text-[15px] font-medium text-destructive hover:bg-error-container transition-colors"
            >
              Keluar
            </button>
          </>
        )}
      </nav>
    </div>
  );
}
