"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { MobileNav } from "./mobile-nav";
import {
  List,
  MagnifyingGlass,
  X,
  TwitterLogo,
  FacebookLogo,
  UserCircle,
} from "@phosphor-icons/react/dist/ssr";

const extendedNav = [
  { label: "Home", href: "/" },
  { label: "New", href: "/terkini" },
  { label: "Top News", href: "/top-news" },
  { label: "Politics", href: "/politik" },
  { label: "Sports", href: "/olahraga" },
  { label: "Economy", href: "/ekonomi" },
  { label: "Culture", href: "/sosial-dan-budaya" },
  { label: "Technology", href: "/teknologi" },
  { label: "Science", href: "/sains" },
  { label: "Health", href: "/kesehatan" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-background">
        {/* Top Bar */}
        <div className="container-responsive">
          <div className="flex h-14 items-center border-b border-border">
            {/* Left */}
            <div className="flex w-1/3 items-center">
              <button
                className="flex items-center justify-center pr-3 lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <List className="size-5" />
              </button>
              <button
                className="flex items-center justify-center pr-3 lg:pr-4"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                {searchOpen ? <X className="size-5" /> : <MagnifyingGlass className="size-5" />}
              </button>
              <div className="hidden h-5 w-px bg-border lg:block" />
            </div>

            {/* Center: Logo — perfectly centered via w-1/3 + justify-center */}
            <div className="flex w-1/3 justify-center">
              <Link href="/">
                <span className="text-xl font-black tracking-tight uppercase sm:text-2xl">
                  {SITE_CONFIG.shortName}
                </span>
              </Link>
            </div>

            {/* Right */}
            <div className="flex w-1/3 items-center justify-end">
              <div className="hidden items-center gap-4 pr-3 sm:flex sm:pr-4">
                <a href="https://twitter.com/metrikmediaid" target="_blank" rel="noopener noreferrer" className="text-foreground transition-opacity hover:opacity-70">
                  <TwitterLogo className="size-5" weight="fill" />
                </a>
                <a href="https://facebook.com/metrikmediaid" target="_blank" rel="noopener noreferrer" className="text-foreground transition-opacity hover:opacity-70">
                  <FacebookLogo className="size-5" weight="fill" />
                </a>
              </div>
              <div className="hidden h-5 w-px bg-border sm:block" />
              <button className="flex items-center justify-center pl-3 sm:pl-4">
                <UserCircle className="size-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden border-b border-border lg:block">
          <div className="container-responsive">
            <div className="flex items-center overflow-x-auto">
              {extendedNav.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative whitespace-nowrap px-4 py-3.5 text-[13px] transition-colors xl:px-5",
                      isActive
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Search Bar */}
        {searchOpen && (
          <div className="border-b border-border">
            <div className="container-responsive py-3">
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-3">
                <MagnifyingGlass className="size-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Mencari..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  autoFocus
                />
              </form>
            </div>
          </div>
        )}
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
