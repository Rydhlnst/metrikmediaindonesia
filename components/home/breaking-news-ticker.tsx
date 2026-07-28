"use client";

import { Lightning } from "@phosphor-icons/react/dist/ssr";

interface BreakingNewsTickerProps {
  items?: string[];
}

export function BreakingNewsTicker({ items = [] }: BreakingNewsTickerProps) {
  if (!items || items.length === 0) return null;

  const duplicated = [...items, ...items];

  return (
    <div className="border-b border-border bg-white dark:bg-background">
      <div className="container-responsive flex items-center">
        <div className="flex shrink-0 items-center gap-1.5 bg-brand px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-brand-foreground">
          <Lightning className="size-3" weight="fill" />
          Breaking
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="animate-ticker flex whitespace-nowrap py-2">
            {duplicated.map((item, index) => (
              <span key={index} className="mx-8 flex items-center gap-2 text-xs text-foreground">
                <span className="size-1 shrink-0 bg-brand" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
