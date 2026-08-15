import { Skeleton } from "@/components/ui/skeleton";

export function HomeSkeleton() {
  return (
    <div className="p-4 sm:p-6">
      {/* Hero Skeleton */}
      <div className="relative aspect-video w-full overflow-hidden">
        <Skeleton className="h-full w-full" />
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
          <Skeleton className="mb-2 h-3 w-32" />
          <Skeleton className="mb-2 h-6 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-[16/10] w-full" />
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>
        ))}
      </div>

      <div className="my-6 border-t border-black/10" />

      {/* List Skeleton */}
      <div>
        <Skeleton className="mb-4 h-5 w-32" />
        <div className="divide-y divide-black/10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 py-4">
              <Skeleton className="h-20 w-24 shrink-0 sm:w-28" />
              <div className="flex flex-1 flex-col justify-center gap-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
