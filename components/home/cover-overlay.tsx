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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]">
      <button
        onClick={handleClose}
        className="absolute right-6 top-6 rounded-full bg-white/10 px-4 py-2 text-sm text-white/60 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white"
      >
        Lewati &rarr;
      </button>

      <div className="flex flex-col items-center px-6 text-center">
        <div className="relative h-48 w-48 sm:h-64 sm:w-64">
          <Image
            src="/logo-metrik.png"
            alt="PT Metrik Media Indonesia"
            fill
            className="object-contain"
            priority
          />
        </div>
        <h1 className="mt-8 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          METRIK MEDIA INDONESIA
        </h1>
        <p className="mt-3 text-sm tracking-widest text-white/40 uppercase">
          Data Driven &middot; Strategic &middot; Growth
        </p>
        <button
          onClick={handleClose}
          className="mt-8 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-gray-900 transition-all hover:bg-amber-400 hover:shadow-brand"
        >
          Mulai Membaca
        </button>
      </div>

      <button onClick={handleClose} className="absolute inset-0 -z-10" aria-label="Close" />
    </div>
  );
}
