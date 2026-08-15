"use client";

import { useEffect } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { ErrorState } from "@/components/shared/error-state";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-[#f8f9fa]">
      <DashboardTopbar />
      <div className="w-full flex-1 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full max-w-xl">
          <ErrorState
            title="Gagal Memuat Data Redaksi Dashboard"
            error={error}
            reset={reset}
            actionLabel="Coba Muat Ulang"
            actionHref="/dashboard"
          />
        </div>
      </div>
    </div>
  );
}
