"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG, NAVIGATION } from "@/lib/constants";
import { useSession } from "@/lib/use-session";
import { DesktopSidebar } from "./desktop-sidebar";
import Image from "next/image";
import {
  Bell,
  EnvelopeSimple,
  List,
  X,
  MagnifyingGlass,
  GearSix,
  SignOut,
  User,
  House,
  MagnifyingGlass as Search,
  BookmarkSimple,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
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

const topNavItems = [
  { label: "Top Stories", href: "/" },
  { label: "For You", href: "/pencarian" },
  { label: "Your Topics", href: "/saved" },
  { label: "Fact Check", href: "/fact-check" },
  { label: "More", href: "/dunia" },
];

export function HeaderClient() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const { user, isLoading, signOut } = useSession();

  return (
    <>
      <DesktopSidebar />

      {/* Top Header Bar — mobile: full width, desktop: from sidebar to right edge */}
      <header className="fixed top-0 left-0 right-0 z-30 h-14 border-b border-gray-100 bg-white sm:left-[220px] lg:left-[240px]">
        {/* Desktop: nav tabs + search + icons */}
        <div className="hidden h-full sm:flex sm:w-full sm:items-center sm:justify-between">
          {/* Nav Tabs — centered */}
          <nav className="flex h-full flex-1 items-center justify-center gap-1">
            {topNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative flex h-full items-center px-3 text-sm font-medium transition-colors",
                    isActive
                      ? "text-foreground"
                      : "text-gray-400 hover:text-foreground"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-brand" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Search + Icons */}
          <div className="flex items-center gap-3 pr-5 shrink-0">
            <div className="relative">
              <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-64 rounded-xl border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm placeholder-gray-400 transition-all focus:border-brand focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand/20"
              />
            </div>
            <button className="relative flex size-9 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-foreground">
              <Bell className="size-5" weight="regular" />
            </button>
            <button className="relative flex size-9 items-center justify-center rounded-xl text-gray-400 transition-colors hover:bg-gray-100 hover:text-foreground">
              <EnvelopeSimple className="size-5" weight="regular" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex size-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-gray-900 hover:ring-2 hover:ring-brand/30 transition-all cursor-pointer">
                  {user?.avatar ? (
                    <Image src={user.avatar} alt={user.name} width={32} height={32} className="size-8 rounded-full object-cover" />
                  ) : (
                    user?.name?.charAt(0)?.toUpperCase() || "?"
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                {user ? (
                  <>
                    <div className="px-3 py-2">
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center gap-2">
                        <User className="size-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center gap-2">
                        <GearSix className="size-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 text-red-500 focus:text-red-500">
                      <SignOut className="size-4" /> Sign out
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="flex items-center gap-2">
                      <User className="size-4" /> Masuk
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile: hamburger + logo + bell */}
        <div className="flex h-full w-full items-center justify-between px-4 sm:hidden">
          <div className="flex items-center gap-3">
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <SheetTrigger asChild>
                <button className="flex size-9 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-gray-100">
                  <List className="size-5" weight="fill" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[260px] p-0">
                <SheetTitle className="sr-only">Navigation</SheetTitle>
                <MobileSidebar onClose={() => setSheetOpen(false)} />
              </SheetContent>
            </Sheet>
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-7 w-7">
                <Image
                  src="/logo-metrik.png"
                  alt={SITE_CONFIG.shortName}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative flex size-9 items-center justify-center rounded-xl text-gray-600 transition-colors hover:bg-gray-100">
              <Bell className="size-5" weight="regular" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation — icon only */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-14 items-center justify-around border-t border-gray-100 bg-white sm:hidden">
        <Link href="/" className={cn("flex size-12 items-center justify-center rounded-xl transition-colors", pathname === "/" ? "text-brand" : "text-gray-400")}>
          <House className="size-6" weight={pathname === "/" ? "fill" : "regular"} />
        </Link>
        <Link href="/pencarian" className={cn("flex size-12 items-center justify-center rounded-xl transition-colors", pathname === "/pencarian" ? "text-brand" : "text-gray-400")}>
          <Search className="size-6" weight="regular" />
        </Link>
        <Link href="/saved" className={cn("flex size-12 items-center justify-center rounded-xl transition-colors", pathname === "/saved" ? "text-brand" : "text-gray-400")}>
          <BookmarkSimple className="size-6" weight={pathname === "/saved" ? "fill" : "regular"} />
        </Link>
        <Link href="/profile" className={cn("flex size-12 items-center justify-center rounded-xl transition-colors", pathname === "/profile" ? "text-brand" : "text-gray-400")}>
          <User className="size-6" weight={pathname === "/profile" ? "fill" : "regular"} />
        </Link>
      </nav>
    </>
  );
}

function MobileSidebar({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-14 items-center justify-between border-b border-gray-100 px-5">
        <Link href="/" className="flex items-center gap-2" onClick={onClose}>
          <div className="relative h-7 w-7">
            <Image
              src="/logo-metrik.png"
              alt={SITE_CONFIG.shortName}
              fill
              className="object-contain"
              priority
            />
          </div>
          <span className="text-sm font-bold">{SITE_CONFIG.shortName}</span>
        </Link>
        <button
          onClick={onClose}
          className="flex size-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100"
        >
          <X className="size-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-0.5">
          {NAVIGATION.main.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all rounded-xl",
                  isActive
                    ? "bg-brand/10 text-brand font-semibold"
                    : "text-gray-500 hover:bg-gray-50 hover:text-foreground"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
