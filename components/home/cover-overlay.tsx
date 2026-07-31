"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function CoverOverlay() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeenCover = sessionStorage.getItem("metrik-cover-seen");
    if (!hasSeenCover) {
      setShow(true);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("metrik-cover-seen", "true");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1a1a1a]">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute right-6 top-6 text-sm text-white/50 transition-colors hover:text-white/80"
      >
        Lewati &rarr;
      </button>

      {/* Logo */}
      <div className="flex flex-col items-center">
        <div className="relative h-40 w-40 sm:h-52 sm:w-52">
          <Image
            src="/logo-metrik.png"
            alt="PT Metrik Media Indonesia"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="mt-6 text-2xl font-bold tracking-wide text-[#a68a0a] sm:text-3xl">
          METRIK MEDIA INDONESIA
        </h1>
        <p className="mt-2 text-sm tracking-widest text-[#a68a0a]/70">
          DATA DRIVEN &middot; STRATEGIC &middot; GROWTH
        </p>
      </div>

      {/* Click anywhere to close */}
      <button
        onClick={handleClose}
        className="absolute inset-0 -z-10"
        aria-label="Close"
      />
    </div>
  );
}
