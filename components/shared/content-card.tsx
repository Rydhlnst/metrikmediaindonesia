import { cn } from "@/lib/utils";

interface ContentCardProps {
  children: React.ReactNode;
  variant?: "default" | "low" | "flat";
  className?: string;
}

const variantClasses = {
  default: "border border-black/10 bg-white p-6",
  low: "border border-black/10 bg-surface-container-low p-6",
  flat: "bg-surface-container-low p-6",
};

export function ContentCard({ children, variant = "default", className }: ContentCardProps) {
  return (
    <div className={cn(variantClasses[variant], className)}>
      {children}
    </div>
  );
}
