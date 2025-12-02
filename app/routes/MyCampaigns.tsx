import { useGetUserProfile } from '@/apis/queries/user'
import { Button } from '@/components/ui/button'
import { contractAbi, contractAddress } from '@/contract/ContractClient'
import type { CampaignMetadata } from '@/types/campaign'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { formatEther } from 'viem'
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'

type ContractCampaign = readonly [
  creator: `0x${string}`,
  goal: bigint,
  deadline: bigint,
  totalFunded: bigint,
  claimed: boolean
]

export default function MyCampaigns() {
  const { address, isConnected } = useAccount()
  const [withdrawingId, setWithdrawingId] = useState<number | null>(null)

  const { data: userProfile, isLoading, refetch } = useGetUserProfile(address)
  const { writeContract } = useWriteContract()
  const { isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash: useWriteContract().data
  })

  useEffect(() => {
    if (!txSuccess) return
    toast.success('Withdrawal successful!')
    setWithdrawingId(null)
    refetch()
  }, [txSuccess, refetch])

  const handleWithdraw = (campaignId: number) => {
    setWithdrawingId(campaignId)
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'withdraw',
      args: [BigInt(campaignId)]
    })
    toast.info('Processing withdrawal...')
  }

  if (!isConnected)
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔗</div>
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-muted-foreground">
          Please connect your wallet to view your campaigns
        </p>
      </div>
    )

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoaderCircle className="animate-spin" size={48} />
      </div>
    )

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Campaigns</h1>
        <Link to="/idea">
          <Button>Create New Campaign</Button>
        </Link>
      </div>

      {!userProfile?.campaigns?.length ? (
        <div className="text-center py-16 max-w-md mx-auto">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold mb-3">No Campaigns Yet</h2>
          <p className="text-muted-foreground mb-6">
            Start your journey by creating your first campaign
          </p>
          <Link to="/idea">
            <Button size="lg">✨ Create Your First Campaign</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {userProfile.campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.campaignId}
              campaign={campaign}
              onWithdraw={handleWithdraw}
              isWithdrawing={withdrawingId === campaign.campaignId}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function CampaignCard({
  campaign,
  onWithdraw,
  isWithdrawing
}: {
  campaign: CampaignMetadata
  onWithdraw: (id: number) => void
  isWithdrawing: boolean
}) {
  // Get campaign data from smart contract
  const { data: contractCampaign } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getCampaign',
    args: [BigInt(campaign.campaignId)]
  }) as { data: ContractCampaign | undefined }

  if (!contractCampaign) {
    return (
      <div className="border rounded-lg p-6">
        <LoaderCircle className="animate-spin" size={24} />
      </div>
    )
  }

  const [creator, goal, deadline, totalFunded, claimed] = contractCampaign
  const isDeadlinePassed = Date.now() > Number(deadline) * 1000
  const isGoalReached = totalFunded >= goal
  const canWithdraw = !claimed && isGoalReached && isDeadlinePassed

  return (
    <div className="border rounded-xl overflow-hidden hover:shadow-xl transition-all bg-card h-[400px]">
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr_300px] gap-6 p-6">
        <div className="space-y-3">
          <div className="relative h-48 lg:h-80 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden group">
            {campaign.imageUrl ? (
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-4xl mb-2">🖼️</div>
                  <p className="text-sm">No image</p>
                </div>
              </div>
            )}
          </div>
          <div className="lg:hidden">
            <h3 className="text-2xl font-bold mb-2">{campaign.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {campaign.description}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="hidden lg:block">
            <h3 className="text-2xl font-bold mb-2 line-clamp-1">
              {campaign.title}
            </h3>
            <p className="text-muted-foreground line-clamp-2">
              {campaign.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-4 rounded-xl">
              <p className="text-xs text-blue-600 dark:text-blue-300 font-medium mb-1">
                💰 Raised
              </p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">
                {formatEther(totalFunded)}
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400">ETH</p>
            </div>

            <div className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-4 rounded-xl">
              <p className="text-xs text-purple-600 dark:text-purple-300 font-medium mb-1">
                🎯 Goal
              </p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-200">
                {formatEther(goal)}
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400">
                ETH
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Progress</span>
              <span className="font-bold text-primary">
                {Math.round((Number(totalFunded) / Number(goal)) * 100)}%
              </span>
            </div>
            <div className="relative w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="absolute h-full bg-linear-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 shadow-lg"
                style={{
                  width: `${Math.min((Number(totalFunded) / Number(goal)) * 100, 100)}%`
                }}
              />
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="border rounded-lg p-3 bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">📅 Deadline</p>
              <p className="text-sm font-semibold">
                {new Date(Number(deadline) * 1000).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>

            <div className="border rounded-lg p-3 bg-muted/50">
              <p className="text-xs text-muted-foreground mb-1">🏷️ Status</p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    claimed
                      ? 'bg-green-500'
                      : isDeadlinePassed
                        ? 'bg-red-500'
                        : 'bg-blue-500 animate-pulse'
                  }`}
                />
                <p
                  className={`text-sm font-semibold ${
                    claimed
                      ? 'text-green-600 dark:text-green-400'
                      : isDeadlinePassed
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {claimed ? 'Claimed' : isDeadlinePassed ? 'Ended' : 'Active'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-between space-y-4 ">
          <div className="space-y-2 mt-21">
            {isGoalReached && (
              <div className="bg-linear-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-300 dark:border-green-700 rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">🎉</span>
                  <p className="text-base font-bold text-green-700 dark:text-green-300">
                    Goal Reached!
                  </p>
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Withdraw available after deadline
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all"
              onClick={() => onWithdraw(campaign.campaignId)}
              disabled={isWithdrawing}
            >
              {isWithdrawing ? (
                <>
                  <LoaderCircle className="animate-spin mr-2" size={16} />
                  Withdrawing...
                </>
              ) : (
                <>💰 Withdraw {formatEther(totalFunded)} ETH</>
              )}
            </Button>

            <Link to={`/campaign/${campaign._id}`} className="block">
              <Button variant="outline" size="lg" className="w-full">
                👁️ View Campaign Details
              </Button>
            </Link>

            {!canWithdraw && !claimed && (
              <div className="text-center p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg">
                <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                  {!isGoalReached && '⏳ Waiting to reach goal'}
                  {isGoalReached &&
                    !isDeadlinePassed &&
                    '⏰ Waiting for deadline'}
                </p>
              </div>
            )}
            {claimed && (
              <div className="bg-linear-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 border-2 border-green-400 dark:border-green-600 rounded-lg p-4 text-center">
                <p className="text-lg font-bold text-green-700 dark:text-green-300">
                  ✅ Funds Withdrawn Successfully
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
