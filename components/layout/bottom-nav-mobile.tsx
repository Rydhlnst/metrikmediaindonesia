"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/use-session";
import {
  House,
  TrendUp,
  User,
} from "@phosphor-icons/react/dist/ssr";

export function BottomNavMobile() {
  const pathname = usePathname();
  const { user } = useSession();

  const profileHref = user ? "/profile" : "/login";

  const navItems = [
    { label: "Beranda", href: "/", icon: House },
    { label: "Trending", href: "/pencarian", icon: TrendUp },
    { label: user ? "Profil" : "Masuk", href: profileHref, icon: User },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-black/10 shadow-lg h-16 px-4 py-2 flex items-center justify-around">
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
              "flex flex-col items-center justify-center py-1 px-4 flex-1 transition-all rounded-none",
              isActive
                ? "text-gold-deep font-bold scale-105"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon
              className={cn("size-6 mb-1", isActive && "fill-current")}
              weight={isActive ? "fill" : "regular"}
            />
            <span className="text-[11px] uppercase font-bold tracking-wider leading-none">
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
