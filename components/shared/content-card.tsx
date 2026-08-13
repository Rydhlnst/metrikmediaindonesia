import { cn } from "@/lib/utils";

interface ContentCardProps {
  children: React.ReactNode;
  variant?: "default" | "low" | "flat";
  className?: string;
}

const variantClasses = {
  default: "border border-outline-variant bg-background p-6",
  low: "border border-outline-variant bg-surface-container-low p-6",
  flat: "bg-surface-container-low p-6",
};

export function ContentCard({ children, variant = "default", className }: ContentCardProps) {
  return (
    <div className={cn(variantClasses[variant], className)}>
      {children}
    </div>
  );
}
