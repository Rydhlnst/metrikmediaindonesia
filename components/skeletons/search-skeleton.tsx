import { Skeleton } from "@/components/ui/skeleton";

export function SearchSkeleton() {
  return (
    <div className="p-4 sm:p-6">
      {/* Search Input Skeleton */}
      <div className="mb-6">
        <Skeleton className="mb-4 h-10 w-full" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Categories Skeleton */}
      <div className="mb-8">
        <Skeleton className="mb-3 h-4 w-40" />
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>

      {/* Results Skeleton */}
      <div>
        <Skeleton className="mb-4 h-5 w-32" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col gap-3">
              <Skeleton className="aspect-[16/10] w-full" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
