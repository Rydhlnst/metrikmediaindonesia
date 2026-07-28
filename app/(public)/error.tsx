"use client";

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <p className="text-lg font-medium">Terjadi kesalahan</p>
      <p className="mt-2 text-sm text-muted-foreground">
        {error.message || "Silakan coba lagi nanti"}
      </p>
      <button
        onClick={reset}
        className="mt-4 bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
      >
        Coba Lagi
      </button>
    </div>
  );
}
