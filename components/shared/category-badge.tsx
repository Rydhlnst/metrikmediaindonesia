import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  children: React.ReactNode;
  variant?: "inline" | "pill" | "bordered" | "solid";
  className?: string;
}

const variantClasses = {
  inline: "text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400",
  pill: "inline-flex items-center bg-amber-600 text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none",
  solid: "inline-flex items-center bg-black text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-none",
  bordered: "text-xs font-bold uppercase tracking-wider text-amber-700 border-b-2 border-amber-600 pb-0.5",
};

export function CategoryBadge({ children, variant = "pill", className }: CategoryBadgeProps) {
  return (
    <span className={cn(variantClasses[variant], className)}>
      {children}
    </span>
  );
}
