import { Skeleton } from '@/components/ui/skeleton'

export function CampaignCardSkeleton() {
  return (
    <div className="border rounded-xl overflow-hidden bg-card lg:h-[400px]">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-6 p-6">
        {/* Image skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-48 lg:h-80 rounded-xl" />
        </div>

        {/* Content skeleton */}
        <div className="space-y-5">
          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3 mt-2" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-3 w-full rounded-full" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
        </div>

        {/* Actions skeleton */}
        <div className="flex flex-col justify-end space-y-3">
          <Skeleton className="h-12 w-full rounded-lg" />
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}
