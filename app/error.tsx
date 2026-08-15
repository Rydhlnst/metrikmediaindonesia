"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/shared/error-state";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[#f8f9fa] p-4 sm:p-8">
      <div className="w-full max-w-lg">
        <ErrorState
          title="Terjadi Kesalahan Aplikasi"
          error={error}
          reset={reset}
          actionLabel="Muat Ulang Halaman"
        />
      </div>
    </div>
  );
}
