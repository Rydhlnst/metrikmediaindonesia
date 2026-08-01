"use client";

import { Lightning } from "@phosphor-icons/react/dist/ssr";

interface BreakingNewsTickerProps {
  items?: string[];
}

export function BreakingNewsTicker({ items = [] }: BreakingNewsTickerProps) {
  if (!items || items.length === 0) return null;

  const duplicated = [...items, ...items];

  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="container-responsive flex items-center">
        <div className="flex shrink-0 items-center gap-1.5 bg-brand px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
          <Lightning className="size-3" weight="fill" />
          Breaking
        </div>
        <div className="relative flex-1 overflow-hidden">
          <div className="animate-ticker flex whitespace-nowrap py-2">
            {duplicated.map((item, index) => (
              <span key={index} className="mx-8 flex items-center gap-2 text-[11px] text-gray-700">
                <span className="size-1 shrink-0 bg-brand rounded-full" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
