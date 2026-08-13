import { cn } from "@/lib/utils";

interface BrandNameProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white";
  className?: string;
  as?: "span" | "h1" | "h2" | "p";
}

const sizeClasses = {
  sm: "font-serif text-xs sm:text-sm font-bold tracking-wider whitespace-nowrap",
  md: "font-serif text-sm sm:text-base md:text-xl font-bold tracking-wider whitespace-nowrap",
  lg: "font-serif text-base sm:text-xl md:text-2xl font-bold tracking-wider whitespace-nowrap",
  xl: "font-serif text-xl sm:text-2xl md:text-4xl font-bold tracking-wider whitespace-nowrap",
};

const colorClasses = {
  primary: "text-on-surface",
  white: "text-white",
};

export function BrandName({ size = "md", color = "primary", className, as: Tag = "span" }: BrandNameProps) {
  return (
    <Tag className={cn(colorClasses[color], sizeClasses[size], className)}>
      METRIK MEDIA INDONESIA
    </Tag>
  );
}
