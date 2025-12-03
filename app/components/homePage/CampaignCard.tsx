import { useGetCampaignMetadata } from '@/apis/queries/campaign'
import { CampaignCardItemSkeleton } from '@/components/homePage/CampaignCardItemSkeleton'
import { contractAbi, contractAddress } from '@/contract/ContractClient'
import type { CampaignMetadata } from '@/types/campaign'
import { LoaderCircle } from 'lucide-react'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { Link } from 'react-router'
import { formatEther } from 'viem'
import { useReadContract } from 'wagmi'

type ContractCampaign = readonly [
  creator: `0x${string}`,
  goal: bigint,
  deadline: bigint,
  totalFunded: bigint,
  claimed: boolean
]

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
          <CampaignCardItem key={campaign.campaignId} campaign={campaign} />
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

function CampaignCardItem({ campaign }: { campaign: CampaignMetadata }) {
  const { data: contractCampaign } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getCampaign',
    args:
      campaign.campaignId || campaign.campaignId === 0
        ? [BigInt(campaign.campaignId)]
        : undefined,
    query: { enabled: campaign.campaignId === 0 ? true : !!campaign.campaignId }
  }) as { data: ContractCampaign | undefined }

  if (!contractCampaign) {
    return <CampaignCardItemSkeleton />
  }

  const [creator, goal, deadline, totalFunded, claimed] = contractCampaign
  const progress = Math.round((Number(totalFunded) / Number(goal)) * 100)
  const isDeadlinePassed = Date.now() > Number(deadline) * 1000

  return (
    <div className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
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

        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">
              {formatEther(totalFunded)} ETH raised
            </span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
            <div
              className="bg-linear-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Goal: {formatEther(goal)} ETH
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Creator:</span>
            <span className="font-mono text-xs">
              {campaign.creator.slice(0, 6)}...
              {campaign.creator.slice(-4)}
            </span>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Status:</span>
            <span
              className={`text-xs font-semibold ${
                claimed
                  ? 'text-green-600 dark:text-green-400'
                  : isDeadlinePassed
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-blue-600 dark:text-blue-400'
              }`}
            >
              {claimed
                ? '✅ Claimed'
                : isDeadlinePassed
                  ? '⏰ Ended'
                  : '🔥 Active'}
            </span>
          </div>
        </div>

        <Link to={`/campaign/${campaign._id}`}>
          <button className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md transition-colors">
            View Details
          </button>
        </Link>
      </div>
    </div>
  )
}

export default CampaignCard
