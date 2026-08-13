import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  children: React.ReactNode;
  variant?: "inline" | "pill" | "bordered";
  className?: string;
}

const variantClasses = {
  inline: "font-label-md text-label-md uppercase tracking-widest text-secondary",
  pill: "inline-flex items-center bg-secondary-container px-3 py-1 text-xs font-semibold text-on-secondary-container",
  bordered: "font-label-md text-label-md uppercase tracking-widest text-secondary border-b border-secondary pb-1",
};

export function CategoryBadge({ children, variant = "inline", className }: CategoryBadgeProps) {
  return (
    <span className={cn(variantClasses[variant], className)}>
      {children}
    </span>
  );
}
