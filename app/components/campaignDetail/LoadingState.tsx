import { Skeleton } from '@/components/ui/skeleton'

export function LoadingState() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        <Skeleton className="h-10 w-40" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="aspect-video" />
            <Skeleton className="h-32" />
          </div>

          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />

            <div className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-6 w-1/2" />
              <div className="space-y-3">
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-3 rounded-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>

            <div className="border rounded-lg p-6 space-y-3">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  )
}
