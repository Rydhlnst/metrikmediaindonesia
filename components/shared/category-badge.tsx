import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  children: React.ReactNode;
  variant?: "inline" | "pill" | "bordered" | "solid";
  className?: string;
}

const variantClasses = {
  inline: "text-xs font-bold uppercase tracking-wider text-gold-deep",
  pill: "inline-flex items-center bg-gold text-white p-2 text-[10px] font-bold uppercase tracking-wider rounded-none",
  solid: "inline-flex items-center bg-black text-white p-2 text-[10px] font-bold uppercase tracking-wider rounded-none",
  bordered: "text-xs font-bold uppercase tracking-wider text-gold-deep border-b-2 border-gold pb-0.5",
};

export function CategoryBadge({ children, variant = "pill", className }: CategoryBadgeProps) {
  return (
    <span className={cn(variantClasses[variant], className)}>
      {children}
    </span>
  );
}
