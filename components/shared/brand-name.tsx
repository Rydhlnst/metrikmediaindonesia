import { cn } from "@/lib/utils";

interface BrandNameProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white";
  className?: string;
  as?: "span" | "h1" | "h2" | "p";
}

const sizeClasses = {
  sm: "font-headline-lg text-base sm:text-headline-lg-mobile tracking-tight",
  md: "font-headline-lg text-headline-lg tracking-tight",
  lg: "font-headline-xl text-headline-xl tracking-tight",
  xl: "font-display-lg text-display-lg tracking-tight",
};

const colorClasses = {
  primary: "text-primary",
  white: "text-white",
};

export function BrandName({ size = "md", color = "primary", className, as: Tag = "span" }: BrandNameProps) {
  return (
    <Tag className={cn(colorClasses[color], sizeClasses[size], className)}>
      METRIK MEDIA INDONESIA
    </Tag>
  );
}
