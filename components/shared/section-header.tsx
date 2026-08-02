import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  href?: string;
  icon?: ReactNode;
  className?: string;
}

export function SectionHeader({ title, href, icon, className }: SectionHeaderProps) {
  return (
    <div className={cn("border-b-2 border-brand pb-2.5", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="text-[14px] font-bold uppercase tracking-wider">{title}</h2>
        </div>
        {href && (
          <Link
            href={href}
            className="flex items-center gap-1 text-[11px] font-medium text-gray-500 transition-colors hover:text-foreground link-underline"
          >
            Lihat Semua
            <ArrowRight className="size-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
