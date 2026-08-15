import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const variantClasses = {
  primary: "bg-black text-white hover:bg-black/90 active:scale-[0.99]",
  secondary: "bg-gold text-white hover:bg-gold/90 active:scale-[0.99]",
  outline: "border border-black/15 bg-white text-foreground hover:border-black/40 hover:bg-black/5 active:scale-[0.99]",
};

const sizeClasses = {
  sm: "px-4 py-2 text-xs",
  md: "px-6 py-2.5 text-xs",
  lg: "px-8 py-3 text-sm",
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
        "inline-flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase tracking-wider rounded-none",
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
