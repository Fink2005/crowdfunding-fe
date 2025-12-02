import { useSendTelegramNotification } from '@/apis/queries/telegram'
import { campaignRequests } from '@/apis/requests/campaign'
import { CampaignImage } from '@/components/campaignDetail/CampaignImage'
import { CampaignInfo } from '@/components/campaignDetail/CampaignInfo'
import { ContributeDialog } from '@/components/campaignDetail/ContributeDialog'
import { FundingProgress } from '@/components/campaignDetail/FundingProgress'
import { LoadingState } from '@/components/campaignDetail/LoadingState'
import { Button } from '@/components/ui/button'
import { contractAbi, contractAddress } from '@/contract/ContractClient'
import type { CampaignMetadata } from '@/types/campaign'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { toast } from 'sonner'
import { parseEther } from 'viem'
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

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>()
  const [campaign, setCampaign] = useState<CampaignMetadata | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showContributeDialog, setShowContributeDialog] = useState(false)
  const [contributeAmount, setContributeAmount] = useState('')
  const [isContributing, setIsContributing] = useState(false)

  const { isConnected, address } = useAccount()

  const { mutate: sendNotification } = useSendTelegramNotification()

  const { data: contractCampaign, refetch: refetchCampaign } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getCampaign',
    args: campaign?.campaignId ? [BigInt(campaign.campaignId)] : undefined,
    query: { enabled: !!campaign?.campaignId }
  }) as {
    data: ContractCampaign | undefined
    refetch: () => Promise<{ data: ContractCampaign | undefined }>
  }

  const { data: contributionFee } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'contributionFee'
  }) as { data: bigint | undefined }

  const { data: txHash, writeContract, error: writeError } = useWriteContract()

  const { isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash: txHash
  })

  useEffect(() => {
    if (!id) return

    const fetchCampaign = async () => {
      setIsLoading(true)
      const response = await campaignRequests.getCampaignById(id)
      if (response.data.success) setCampaign(response.data.data)
      setIsLoading(false)
    }

    fetchCampaign()
  }, [id])

  useEffect(() => {
    if (txSuccess && campaign && address) {
      toast.success('Contribution successful!')
      setIsContributing(false)
      setShowContributeDialog(false)

      // Refetch and check if goal reached
      setTimeout(async () => {
        const result = await refetchCampaign()
        const updated = result.data as ContractCampaign | undefined

        if (updated) {
          const goalReached = updated[3] >= updated[1]

          sendNotification({
            address: address as string,
            message: `✅ <b>Contribution Successful!</b>\n\n🎯 Campaign: <b>${campaign.title}</b>\n💵 Your Contribution: <b>${contributeAmount} ETH</b>\n\nThank you for supporting this project! 🙏`,
            campaignId: String(campaign.campaignId)
          })

          sendNotification({
            address: campaign.creator,
            message: `💰 <b>New Contribution Received!</b>\n\n🎯 Campaign: <b>${campaign.title}</b>\n💵 Amount: <b>${contributeAmount} ETH</b>\n👤 From: <code>${address}</code>\n\nThank you for your support! 🙏`,
            campaignId: String(campaign.campaignId)
          })

          if (goalReached) {
            sendNotification({
              address: campaign.creator,
              message: `🎉 <b>Congratulations! Campaign Goal Reached!</b>\n\n🎯 Campaign: <b>${campaign.title}</b>\n✅ Goal Achieved!\n\nYour campaign has successfully reached its funding goal! You can now withdraw the funds once the deadline has passed. 🚀`,
              campaignId: String(campaign.campaignId)
            })
          }
        }
      }, 2000)

      setContributeAmount('')
    }
  }, [
    txSuccess,
    campaign,
    address,
    contributeAmount,
    sendNotification,
    refetchCampaign
  ])

  useEffect(() => {
    if (writeError) {
      toast.error('Contribution failed')
      setIsContributing(false)
    }
  }, [writeError])

  const handleContribute = () => {
    if (!isConnected) return toast.error('Please connect your wallet')
    setShowContributeDialog(true)
  }

  const handleConfirmContribute = () => {
    if (!contributeAmount || parseFloat(contributeAmount) <= 0)
      return toast.error('Please enter a valid amount')

    if (!contributionFee || !campaign?.campaignId) return

    const amountInWei = parseEther(contributeAmount)
    const fee = BigInt(contributionFee.toString())

    setIsContributing(true)
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'contribute',
      args: [BigInt(campaign.campaignId)],
      value: amountInWei + fee
    })

    toast.info('Waiting for confirmation...')
  }

  if (isLoading) return <LoadingState />

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Campaign Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The campaign you're looking for doesn't exist or has been removed.
        </p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-block mb-6">
        <Button variant="outline">← Back to Campaigns</Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CampaignImage campaign={campaign} />

        <div className="space-y-6">
          <h1 className="text-4xl font-bold mb-4">{campaign.title}</h1>

          {contractCampaign && (
            <FundingProgress contractCampaign={contractCampaign} />
          )}

          <CampaignInfo campaign={campaign} />

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              className="w-full"
              size="lg"
              onClick={handleContribute}
              disabled={
                !isConnected ||
                !contractCampaign ||
                contractCampaign[4] ||
                Date.now() > Number(contractCampaign?.[2]) * 1000
              }
            >
              {!isConnected
                ? 'Connect Wallet to Contribute'
                : contractCampaign?.[4]
                  ? 'Campaign Claimed'
                  : Date.now() > Number(contractCampaign?.[2] || 0) * 1000
                    ? 'Campaign Ended'
                    : 'Contribute to Campaign'}
            </Button>
            <Button variant="outline" className="w-full" size="lg">
              Share Campaign
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Info Section */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">About This Campaign</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            {campaign.description}
          </p>
        </div>
      </div>

      <ContributeDialog
        open={showContributeDialog}
        onOpenChange={setShowContributeDialog}
        campaignTitle={campaign.title}
        contributeAmount={contributeAmount}
        setContributeAmount={setContributeAmount}
        contributionFee={contributionFee}
        isContributing={isContributing}
        onConfirm={handleConfirmContribute}
      />
    </div>
  )
}
