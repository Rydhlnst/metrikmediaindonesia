import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantClasses = {
  primary: "bg-primary text-on-primary hover:bg-primary/90 shadow-2xs active:scale-95",
  secondary: "bg-secondary text-on-secondary hover:bg-secondary/90 shadow-2xs active:scale-95",
  outline: "border border-outline-variant bg-background text-on-surface hover:bg-surface-container-low hover:border-on-surface-variant/40 active:scale-95",
};

const sizeClasses = {
  sm: "px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-full",
  md: "px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-full",
  lg: "px-8 py-3 text-sm font-bold uppercase tracking-wider rounded-full",
};

export function PrimaryButton({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
