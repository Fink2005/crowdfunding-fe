import { useGetCampaignMetadata } from '@/apis/queries/campaign'
import CampaignCardItem from '@/components/homePage/CampaignCardItem'
import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

const CampaignCard = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } =
    useGetCampaignMetadata()

  const { ref: refView, inView } = useInView({
    threshold: 0,
    triggerOnce: false
  })

  useEffect(() => {
    console.log('🏠 CampaignCard mounted', {
      isLoading,
      hasData: !!data,
      pagesCount: data?.pages?.length,
      campaignsCount: data?.pages.flatMap((page) => page.campaigns).length,
      error: error?.message
    })
  }, [data, isLoading, error])

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log('hello')
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  if (isLoading) {
    console.log('⏳ CampaignCard: Still loading...')
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoaderCircle className="animate-spin" size={48} />
      </div>
    )
  }

  if (error) {
    console.error('❌ CampaignCard: Error loading campaigns', error)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <p className="text-xl text-red-500 mb-2">Error loading campaigns</p>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  const campaigns = data?.pages.flatMap((page) => page.campaigns) || []
  console.log('✅ CampaignCard: Rendering campaigns', campaigns.length)
  const totalCampaigns = campaigns.length
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Campaigns</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign, index) => {
          const shouldLoadMore =
            index === totalCampaigns - 1 || index === totalCampaigns - 3
          return (
            <div
              key={campaign.campaignId}
              ref={shouldLoadMore ? refView : undefined}
            >
              <CampaignCardItem campaign={campaign} />
            </div>
          )
        })}
      </div>

      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-4">
          <LoaderCircle className="animate-spin" size={32} />
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
