"use client";

import { useState } from "react";
import { Minus, Plus, TextAa } from "@phosphor-icons/react";

interface ArticleFontSizeControlsProps {
  children: React.ReactNode;
}

const MIN_SIZE = 90;
const MAX_SIZE = 130;
const STEP = 10;

export function ArticleFontSizeControls({ children }: ArticleFontSizeControlsProps) {
  const [size, setSize] = useState(100);

  return (
    <>
      <div className="flex items-center justify-end gap-2" aria-label="Article text size controls">
        <TextAa className="size-4 text-muted-foreground" aria-hidden="true" />
        <button
          type="button"
          className="flex size-9 items-center justify-center border border-black/10 bg-white text-foreground transition-colors hover:border-gold hover:text-gold-deep disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => setSize((current) => Math.max(MIN_SIZE, current - STEP))}
          disabled={size <= MIN_SIZE}
          aria-label="Decrease article text size"
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
        <span className="min-w-12 text-center text-xs font-semibold text-muted-foreground" aria-live="polite">
          {size}%
        </span>
        <button
          type="button"
          className="flex size-9 items-center justify-center border border-black/10 bg-white text-foreground transition-colors hover:border-gold hover:text-gold-deep disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => setSize((current) => Math.min(MAX_SIZE, current + STEP))}
          disabled={size >= MAX_SIZE}
          aria-label="Increase article text size"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div style={{ fontSize: `${size}%` }}>{children}</div>
    </>
  );
}
