import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandNameProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white";
  className?: string;
  showLogo?: boolean;
  as?: "span" | "h1" | "h2" | "p" | "div";
}

const sizeClasses = {
  sm: "text-xs sm:text-sm font-bold tracking-wider",
  md: "text-sm sm:text-base md:text-lg font-bold tracking-wider",
  lg: "text-base sm:text-lg md:text-xl font-bold tracking-wider",
  xl: "text-lg sm:text-xl md:text-2xl font-bold tracking-wider",
};

export function BrandName({
  size = "md",
  color = "primary",
  className,
  showLogo = true,
  as: Tag = "div",
}: BrandNameProps) {
  const isWhite = color === "white";

  return (
    <Tag className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      {showLogo && (
        <div className="relative size-8 sm:size-9 shrink-0 overflow-hidden">
          <Image
            src="/logo.png"
            alt="Metrik Media Indonesia"
            fill
            className="object-contain"
            priority
          />
        </div>
      )}
      <div className="flex flex-col leading-tight">
        <span
          className={cn(
            "font-serif font-bold tracking-wider whitespace-nowrap",
            sizeClasses[size],
            isWhite ? "text-white" : "text-foreground"
          )}
        >
          METRIK MEDIA
        </span>
        <span
          className={cn(
            "text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.25em]",
            isWhite ? "text-yellow-400" : "text-primary"
          )}
        >
          INDONESIA
        </span>
      </div>
    </Tag>
  );
}
