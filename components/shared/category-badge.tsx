import { cn } from "@/lib/utils";

interface CategoryBadgeProps {
  children: React.ReactNode;
  variant?: "inline" | "pill" | "bordered" | "solid";
  className?: string;
}

const variantClasses = {
  inline: "text-xs font-bold uppercase tracking-wider text-[#A16207] dark:text-yellow-400",
  pill: "inline-flex items-center bg-[#B8860B] text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-2xs",
  solid: "inline-flex items-center bg-black text-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md",
  bordered: "text-xs font-bold uppercase tracking-wider text-[#A16207] border-b-2 border-[#B8860B] pb-0.5",
};

export function CategoryBadge({ children, variant = "pill", className }: CategoryBadgeProps) {
  return (
    <span className={cn(variantClasses[variant], className)}>
      {children}
    </span>
  );
}
