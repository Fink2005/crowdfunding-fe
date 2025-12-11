import { useGetCampaignById } from '@/apis/queries/campaign'
import {
  useGetCampaignContract,
  useGetContributionFee
} from '@/apis/queries/contract'
import { useGetUserProfile } from '@/apis/queries/user'
import { CampaignImage } from '@/components/campaignDetail/CampaignImage'
import { CampaignInfo } from '@/components/campaignDetail/CampaignInfo'
import { ContributeDialog } from '@/components/campaignDetail/ContributeDialog'
import { FundingProgress } from '@/components/campaignDetail/FundingProgress'
import { LoadingState } from '@/components/campaignDetail/LoadingState'
import TelegramDialog from '@/components/ideaPage/TelegramDialog'
import { Button } from '@/components/ui/button'
import { contractAbi, contractAddress } from '@/contract/ContractClient'
import { useContributionNotification } from '@/hooks/useContributionNotification'
import type { CampaignMetadata } from '@/types/campaign'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { toast } from 'sonner'
import { parseEther } from 'viem'
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>()
  const [showContributeDialog, setShowContributeDialog] = useState(false)
  const [contributeAmount, setContributeAmount] = useState('')
  const [isContributing, setIsContributing] = useState(false)
  const [showTelegramDialog, setShowTelegramDialog] = useState(false)
  const [campaignData, setCampaignData] = useState<
    CampaignMetadata['data'] | undefined
  >()

  const { isConnected, address } = useAccount()
  const { data: userProfile } = useGetUserProfile(address)

  const { data: contributionFee } = useGetContributionFee()

  const { data: txHash, writeContract, error: writeError } = useWriteContract()

  const { isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash: txHash
  })

  const { data: campaign, isSuccess, isLoading } = useGetCampaignById(id || '')

  useEffect(() => {
    if (campaign) {
      setCampaignData(campaign.data)
    }
  }, [isSuccess])

  const { data: contractCampaign, refetch: refetchCampaign } =
    useGetCampaignContract(campaignData?.campaignId || -1)

  useContributionNotification({
    txSuccess,
    campaign: campaignData,
    address,
    contributeAmount,
    userHasTelegram: !!userProfile?.chatId,
    refetchCampaign,
    onSuccess: () => {
      setIsContributing(false)
      setShowContributeDialog(false)
    },
    onShowTelegramDialog: () => setShowTelegramDialog(true),
    onResetAmount: () => setContributeAmount('')
  })

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

    if (!contributionFee || !campaignData?.campaignId) return

    const amountInWei = parseEther(contributeAmount)
    const fee = BigInt(contributionFee.toString())

    setIsContributing(true)
    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'contribute',
      args: [BigInt(campaignData.campaignId)],
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
        <CampaignImage campaign={campaignData} />

        <div className="space-y-6">
          <h1 className="text-4xl font-bold mb-4">{campaignData?.title}</h1>

          {contractCampaign && (
            <FundingProgress contractCampaign={contractCampaign} />
          )}

          <CampaignInfo campaign={campaignData} />

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

      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">About This Campaign</h2>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-muted-foreground leading-relaxed">
            {campaignData?.description}
          </p>
        </div>
      </div>

      <ContributeDialog
        open={showContributeDialog}
        onOpenChange={setShowContributeDialog}
        campaignTitle={campaignData?.title}
        contributeAmount={contributeAmount}
        setContributeAmount={setContributeAmount}
        contributionFee={contributionFee}
        isContributing={isContributing}
        onConfirm={handleConfirmContribute}
      />

      {showTelegramDialog && address && (
        <TelegramDialog
          address={address}
          onClose={() => setShowTelegramDialog(false)}
          title="Track Your Contribution!"
          description="Connect your Telegram to receive updates about this campaign's progress and when it reaches its goal."
        />
      )}
    </div>
  )
}
