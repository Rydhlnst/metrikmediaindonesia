import { Skeleton } from "@/components/ui/skeleton";

export function ArticleSkeleton() {
  return (
    <div className="p-4 sm:p-6">
      {/* Breadcrumb Skeleton */}
      <div className="mb-4 flex gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
      </div>

      {/* Header Skeleton */}
      <div className="mb-6">
        <Skeleton className="mb-2 h-3 w-24" />
        <Skeleton className="h-8 w-full sm:h-10" />
        <Skeleton className="mt-2 h-8 w-3/4" />
      </div>

      {/* Meta Skeleton */}
      <div className="mb-6 flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-none" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>

      {/* Featured Image Skeleton */}
      <Skeleton className="mb-6 aspect-video w-full" />

      {/* Content Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Sidebar Skeleton (desktop) */}
      <div className="mt-8 lg:mt-0">
        <Skeleton className="mb-4 h-5 w-32" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="h-16 w-16 shrink-0" />
              <div className="flex flex-1 flex-col gap-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
