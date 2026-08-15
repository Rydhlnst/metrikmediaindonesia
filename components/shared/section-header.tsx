import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  href?: string;
  actionText?: string;
  className?: string;
}

export function SectionHeader({
  title,
  href,
  actionText,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between border-b border-black/10 pb-1.5 mb-6", className)}>
      <h2 className="text-xs font-bold uppercase tracking-widest text-foreground border-b-2 border-black -mb-[8px] pb-1.5 inline-block">
        {title}
      </h2>
      {actionText && href && (
        <Link
          href={href}
          className="text-xs font-bold text-foreground uppercase tracking-wider transition-colors hover:text-gold-deep"
        >
          {actionText} &rarr;
        </Link>
      )}
    </div>
  );
}
