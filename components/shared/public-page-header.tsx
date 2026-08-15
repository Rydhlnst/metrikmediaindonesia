import React from "react";
import { cn } from "@/lib/utils";

interface PublicPageHeaderProps {
  title: string;
  description?: string;
  categoryTag?: string;
  categoryTagVariant?: "gold" | "red" | "dark";
  className?: string;
  children?: React.ReactNode;
}

export function PublicPageHeader({
  title,
  description,
  categoryTag,
  categoryTagVariant = "gold",
  className,
  children,
}: PublicPageHeaderProps) {
  return (
    <header className={cn("mb-8 border-b border-black/10 pb-6 sm:pb-8", className)}>
      {categoryTag && (
        <div className="mb-3">
          <span
            className={cn(
              "inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white rounded-none",
              categoryTagVariant === "gold" && "bg-gold",
              categoryTagVariant === "red" && "bg-news-red",
              categoryTagVariant === "dark" && "bg-black"
            )}
          >
            {categoryTag}
          </span>
        </div>
      )}
      <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] tracking-tight">
        {title}
      </h1>
      {description && (
        <p className="font-sans text-base sm:text-lg text-muted-foreground mt-3 max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </header>
  );
}
