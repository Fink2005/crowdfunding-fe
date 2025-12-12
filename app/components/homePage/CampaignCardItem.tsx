import { useGetCampaignContract } from '@/apis/queries/contract'
import type { CampaignMetadata } from '@/types/campaign'
import { Link } from 'react-router'
import { formatEther } from 'viem'

type Props = {
  campaign: CampaignMetadata['data']
}

function CampaignCardItem({ campaign }: Props) {
  const { data, isLoading, error } = useGetCampaignContract(campaign.campaignId)

  // Always show campaign card with API data
  // Contract data will be loaded progressively
  const hasContractData = !!data && !error

  // Use contract data if available, otherwise show placeholder values
  const [creator, goal, deadline, totalFunded, claimed] = data || [
    campaign.creator as `0x${string}`,
    BigInt(0),
    BigInt(0),
    BigInt(0),
    false
  ]
  const progress =
    goal > 0 ? Math.round((Number(totalFunded) / Number(goal)) * 100) : 0
  const isDeadlinePassed =
    deadline > 0 ? Date.now() > Number(deadline) * 1000 : false

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
          {hasContractData ? (
            <>
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
            </>
          ) : (
            <div className="text-sm text-muted-foreground italic">
              {isLoading
                ? '⏳ Loading funding data...'
                : '📊 Contract data unavailable'}
            </div>
          )}
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
                !hasContractData
                  ? 'text-gray-600 dark:text-gray-400'
                  : claimed
                    ? 'text-green-600 dark:text-green-400'
                    : isDeadlinePassed
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-blue-600 dark:text-blue-400'
              }`}
            >
              {!hasContractData
                ? '📝 Pending'
                : claimed
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
export default CampaignCardItem
