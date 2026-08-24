"use client";

import { useEffect } from "react";

export function AdvertisementImpression({ id }: { id: number }) {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetch(`/api/public/advertisements/${id}/impression`, { method: "POST", keepalive: true }).catch(() => undefined);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [id]);
  return null;
}
