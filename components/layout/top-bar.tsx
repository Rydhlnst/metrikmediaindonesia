"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import {
  MagnifyingGlass,
  Bell,
  List,
} from "@phosphor-icons/react/dist/ssr";

const tabs = [
  { label: "Top Stories", href: "/" },
  { label: "Bisnis", href: "/bisnis" },
  { label: "Olahraga", href: "/olahraga" },
  { label: "Pendidikan", href: "/pendidikan" },
  { label: "Sosial & Budaya", href: "/sosial-dan-budaya" },
];

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-background">
      {/* Mobile: 3-column flex layout */}
      <div className="flex h-14 items-center border-b border-border px-4 lg:hidden">
        <div className="w-10">
          <button onClick={onMenuClick} className="flex items-center justify-center">
            <List className="size-6" />
          </button>
        </div>
        <Link href="/" className="flex flex-1 justify-center">
          <span className="text-xl font-bold tracking-tight">
            {SITE_CONFIG.shortName}
          </span>
        </Link>
        <div className="w-10 flex justify-end">
          <button className="flex items-center justify-center">
            <MagnifyingGlass className="size-6" />
          </button>
        </div>
      </div>

      {/* Mobile: Tabs */}
      <div className="flex h-11 items-center overflow-x-auto border-b border-border px-4 lg:hidden">
        <div className="flex items-center gap-0">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "relative whitespace-nowrap px-4 py-3 text-sm transition-colors",
                  isActive
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Desktop: single row */}
      <div className="hidden items-center gap-3 border-b border-border px-4 lg:flex lg:h-12 lg:px-6">
        <nav className="flex-1 overflow-x-auto">
          <div className="flex items-center gap-0">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={cn(
                    "relative whitespace-nowrap px-4 py-3 text-[13px] transition-colors xl:px-5",
                    isActive
                      ? "font-semibold text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>
        <div className="flex items-center gap-1">
          <button className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Bell className="size-5" />
          </button>
          <button className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <MagnifyingGlass className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
