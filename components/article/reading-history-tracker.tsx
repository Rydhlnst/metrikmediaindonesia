"use client";

import { useEffect } from "react";

export function ReadingHistoryTracker({ articleId }: { articleId: number }) {
  useEffect(() => {
    void fetch("/api/reading-history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ articleId }),
    }).catch(() => undefined);
  }, [articleId]);
  return null;
}
