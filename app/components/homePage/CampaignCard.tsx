import { useGetCampaignMetadata } from '@/apis/queries/campaign'
import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router'

const CampaignCard = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useGetCampaignMetadata()

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: false
  })

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoaderCircle className="animate-spin" size={48} />
      </div>
    )
  }

  const campaigns = data?.pages.flatMap((page) => page.campaigns) || []

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Active Campaigns</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <div
            key={campaign.campaignId}
            className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48 bg-gray-200">
              {campaign.imageUrl ? (
                <img
                  src={campaign.imageUrl}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="text-xl font-bold mb-2 line-clamp-1">
                {campaign.title}
              </h3>
              <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                {campaign.description}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Creator:</span>
                  <span className="font-mono text-xs">
                    {campaign.creator.slice(0, 6)}...
                    {campaign.creator.slice(-4)}
                  </span>
                </div>

                {campaign.createdAt && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Created:</span>
                    <span>
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <Link to={`/campaign/${campaign._id}`}>
                <button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md transition-colors">
                  View Details
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {hasNextPage && (
        <div ref={ref} className="flex justify-center items-center py-8 mt-8">
          {isFetchingNextPage && (
            <LoaderCircle className="animate-spin" size={32} />
          )}
        </div>
      )}

      {!hasNextPage && campaigns.length > 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No more campaigns to load
        </div>
      )}

      {campaigns.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">
            No campaigns found. Be the first to create one!
          </p>
        </div>
      )}
    </div>
  )
}

export default CampaignCard
