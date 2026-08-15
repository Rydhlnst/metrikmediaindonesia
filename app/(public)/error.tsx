"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/error-state";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Public portal error:", error);
  }, [error]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <ErrorState
          title="Halaman Berita Tidak Dapat Ditampilkan"
          error={error}
          reset={reset}
          actionLabel="Muat Ulang Halaman"
        />
      </div>
    </div>
  );
}
