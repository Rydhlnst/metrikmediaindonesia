"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AnimateOnScrollProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale-in";
  delay?: 0 | 100 | 200 | 300 | 400 | 500;
  threshold?: number;
}

export function AnimateOnScroll({
  children,
  className,
  animation = "fade-up",
  delay = 0,
  threshold = 0.1,
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const animClass = {
    "fade-up": "animate-fade-in-up",
    "fade-in": "animate-fade-in",
    "slide-left": "animate-slide-in-left",
    "slide-right": "animate-slide-in-right",
    "scale-in": "animate-scale-in",
  }[animation];

  const delayClass = delay > 0 ? `delay-${delay}` : "";

  return (
    <div
      ref={ref}
      className={cn(
        visible ? `${animClass} ${delayClass}` : "opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(Math.min(scrollPercent, 100));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="reading-progress" style={{ width: `${progress}%` }} />
  );
}

export function LiveBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-gray-900",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-green-500 animate-live-pulse" />
      Live
    </span>
  );
}

export function UpdatedAgo({ minutes = 5 }: { minutes?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-gray-400">
      <span className="size-1.5 rounded-full bg-green-500 animate-live-pulse" />
      Diperbarui {minutes} menit lalu
    </span>
  );
}
