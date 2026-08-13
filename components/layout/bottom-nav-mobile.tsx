"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSession } from "@/lib/use-session";
import {
  House,
  Newspaper,
  Sparkle,
  BookmarkSimple,
  User,
  List,
} from "@phosphor-icons/react/dist/ssr";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { HeaderClient } from "./header-client";

export function BottomNavMobile() {
  const pathname = usePathname();
  const { user } = useSession();

  const navItems = [
    { label: "Beranda", href: "/", icon: House },
    { label: "Indeks", href: "/pencarian", icon: Newspaper },
    { label: "Bisnis", href: "/business-publication", icon: Sparkle, highlight: true },
    { label: "Disimpan", href: "/saved", icon: BookmarkSimple },
    { label: user ? "Akun" : "Masuk", href: user ? "/dashboard" : "/login", icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-outline-variant shadow-lg py-1 px-2">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center py-1 px-2 min-w-[56px] transition-colors rounded-none",
                isActive
                  ? "text-secondary font-bold"
                  : "text-on-surface-variant hover:text-on-surface",
                item.highlight && !isActive && "text-amber-600 font-extrabold"
              )}
            >
              <Icon
                className={cn("size-5 mb-0.5", isActive && "fill-current")}
                weight={isActive ? "fill" : "regular"}
              />
              <span className="text-[10px] uppercase font-bold tracking-wider leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
