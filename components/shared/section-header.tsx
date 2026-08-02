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
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-2.5">
        <span className="h-6 w-1 rounded-full bg-brand" />
        <h2 className="text-base font-bold tracking-tight">{title}</h2>
        {icon}
      </div>
      {href && (
        <Link
          href={href}
          className="flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-foreground"
        >
          View all
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
