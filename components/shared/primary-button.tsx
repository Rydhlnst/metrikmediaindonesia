import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantClasses = {
  primary: "bg-primary text-on-primary hover:bg-secondary hover:text-on-secondary",
  outline: "border border-outline-variant bg-background text-on-surface hover:bg-surface-container-low",
};

const sizeClasses = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-body-md",
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
        "inline-flex items-center justify-center gap-2 font-medium transition-colors duration-300",
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
