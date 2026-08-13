"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  House,
  Sparkle,
  BookmarkSimple,
} from "@phosphor-icons/react/dist/ssr";

const subNavSections = [
  { label: "Beranda", href: "/", icon: House },
  { label: "For You", href: "/pencarian", icon: Sparkle },
  { label: "Following", href: "/saved", icon: BookmarkSimple },
];

const subNavCategories = [
  { label: "Bisnis", href: "/bisnis" },
  { label: "Olahraga", href: "/olahraga" },
  { label: "Pendidikan", href: "/pendidikan" },
  { label: "Sosial & Budaya", href: "/sosial-dan-budaya" },
  { label: "Teknologi", href: "/teknologi" },
];

export function SubNav({ pathname }: { pathname: string }) {
  return (
    <nav className="bg-background border-b border-outline-variant">
      <div className="max-w-[1280px] mx-auto px-4 md:px-16 flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {subNavSections.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 font-label-md text-label-md uppercase tracking-wider whitespace-nowrap transition-colors border-b-2",
                isActive
                  ? "text-secondary border-secondary"
                  : "text-on-surface-variant border-transparent hover:text-secondary"
              )}
            >
              <Icon className="size-4" weight={isActive ? "fill" : "regular"} />
              {item.label}
            </Link>
          );
        })}

        <div className="mx-2 h-5 w-px bg-outline-variant shrink-0" />

        {subNavCategories.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-4 py-2.5 font-label-md text-label-md uppercase tracking-wider whitespace-nowrap transition-colors border-b-2",
                isActive
                  ? "text-secondary border-secondary"
                  : "text-on-surface-variant border-transparent hover:text-secondary"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
