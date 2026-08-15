import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  children: React.ReactNode;
  size?: "lg" | "md" | "sm";
  className?: string;
  as?: "h1" | "h2" | "h3";
}

const sizeClasses = {
  lg: "font-headline-xl text-headline-xl",
  md: "font-headline-lg text-headline-lg",
  sm: "font-label-md text-label-md uppercase tracking-wider",
};

export function SectionHeading({ children, size = "md", className, as: Tag = "h2" }: SectionHeadingProps) {
  return (
    <Tag className={cn("font-serif font-bold text-foreground", sizeClasses[size], className)}>
      {children}
    </Tag>
  );
}
