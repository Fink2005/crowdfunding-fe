import { Skeleton } from '@/components/ui/skeleton'

export function CampaignCardItemSkeleton() {
  return (
    <div className="border rounded-lg overflow-hidden shadow-lg">
      {/* Image skeleton */}
      <Skeleton className="h-48 w-full rounded-none" />

      <div className="p-4 space-y-4">
        {/* Title and description */}
        <div>
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3 mt-1" />
        </div>

        {/* Progress section */}
        <div>
          <div className="flex justify-between mb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-3 w-20 mt-1" />
        </div>

        {/* Info rows */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* Button */}
        <Skeleton className="h-10 w-full rounded-md" />
      </div>
    </div>
  )
}
