"use client";

import { PrimaryButton } from "@/components/shared/primary-button";
import { SectionHeading } from "@/components/shared/section-heading";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-editorial py-8 pb-20 md:pb-8 flex flex-col items-center justify-center text-center">
      <SectionHeading size="md" className="mb-2">
        Terjadi kesalahan
      </SectionHeading>
      <p className="font-body-md text-body-md text-on-surface-variant">
        {error.message || "Silakan coba lagi nanti"}
      </p>
      <PrimaryButton onClick={reset} size="md" className="mt-4">
        Coba Lagi
      </PrimaryButton>
    </div>
  );
}
