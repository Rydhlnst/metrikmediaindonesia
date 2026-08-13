import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantClasses = {
  primary: "bg-primary text-on-primary hover:bg-primary/85 active:scale-[0.99]",
  secondary: "bg-secondary text-on-secondary hover:bg-secondary/85 active:scale-[0.99]",
  outline: "border border-outline-variant bg-background text-on-surface hover:bg-surface-container-low hover:border-on-surface active:scale-[0.99]",
};

const sizeClasses = {
  sm: "px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-none",
  md: "px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-none",
  lg: "px-8 py-3 text-sm font-bold uppercase tracking-wider rounded-none",
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
        "inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider font-bold rounded-none",
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
