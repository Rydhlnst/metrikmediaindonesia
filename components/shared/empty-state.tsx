import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tray } from "@phosphor-icons/react/dist/ssr";

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  onSecondaryAction?: () => void;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon = Tray,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  secondaryActionLabel,
  secondaryActionHref,
  onSecondaryAction,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center rounded-none border border-dashed border-black/10 bg-white p-8 sm:p-12",
        compact && "p-6 sm:p-8",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-none border border-gold/30 bg-gold/5 text-gold mb-4">
        <Icon className="size-7" weight="duotone" />
      </div>

      <h3 className="font-serif text-base sm:text-lg font-bold text-foreground max-w-md">
        {title}
      </h3>

      {description && (
        <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-sm leading-relaxed">
          {description}
        </p>
      )}

      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {secondaryActionLabel &&
            (secondaryActionHref ? (
              <Link href={secondaryActionHref}>
                <Button
                  variant="outline"
                  className="rounded-none border-black/15 text-xs font-bold uppercase tracking-wider px-4 py-2.5"
                >
                  {secondaryActionLabel}
                </Button>
              </Link>
            ) : (
              <Button
                variant="outline"
                onClick={onSecondaryAction}
                className="rounded-none border-black/15 text-xs font-bold uppercase tracking-wider px-4 py-2.5"
              >
                {secondaryActionLabel}
              </Button>
            ))}

          {actionLabel &&
            (actionHref ? (
              <Link href={actionHref}>
                <Button className="rounded-none bg-primary text-white hover:bg-primary/90 text-xs font-bold uppercase tracking-wider px-5 py-2.5">
                  {actionLabel}
                </Button>
              </Link>
            ) : (
              <Button
                onClick={onAction}
                className="rounded-none bg-primary text-white hover:bg-primary/90 text-xs font-bold uppercase tracking-wider px-5 py-2.5"
              >
                {actionLabel}
              </Button>
            ))}
        </div>
      )}
    </div>
  );
}
