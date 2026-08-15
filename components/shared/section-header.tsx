import Link from "next/link";
import { cn } from "@/lib/utils";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  href?: string;
  actionText?: string;
  className?: string;
  icon?: ReactNode;
}

export function SectionHeader({
  title,
  href,
  actionText,
  className,
  icon,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between border-b border-black/10 pb-1.5 mb-6", className)}>
      <div className="flex items-center gap-2 border-b-2 border-black -mb-[8px] pb-1.5 inline-flex">
        {icon && <span className="text-gold-deep flex items-center justify-center">{icon}</span>}
        <h2 className="text-xs font-bold uppercase tracking-widest text-foreground">
          {title}
        </h2>
      </div>
      {actionText && href && (
        <Link
          href={href}
          className="inline-flex items-center gap-1 text-xs font-bold text-foreground uppercase tracking-wider transition-colors hover:text-gold-deep group"
        >
          <span>{actionText}</span>
          <ArrowRight weight="bold" className="size-3 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

