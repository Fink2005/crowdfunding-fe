import { campaignRequests } from '@/apis/requests/campaign'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { contractAbi, contractAddress } from '@/contract/ContractClient'
import type { CampaignMetadata } from '@/types/campaign'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { toast } from 'sonner'
import { formatEther, parseEther } from 'viem'
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

  const { isConnected } = useAccount()

  const { data: contractCampaign, refetch: refetchCampaign } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getCampaign',
    args: campaign?.campaignId ? [BigInt(campaign.campaignId)] : undefined,
    query: { enabled: !!campaign?.campaignId }
  }) as { data: ContractCampaign | undefined; refetch: () => void }

  const { data: contributionFee } = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'contributionFee'
  })

  const { data: txHash, writeContract, error: writeError } = useWriteContract()

  const { isSuccess: txSuccess } = useWaitForTransactionReceipt({
    hash: txHash
  })

  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return

      try {
        setIsLoading(true)
        const response = await campaignRequests.getCampaignById(id)

        if (response.data.success) {
          setCampaign(response.data.data)
        } else {
          toast.error('Failed to load campaign')
        }
      } catch (error) {
        console.error('Error fetching campaign:', error)
        toast.error('Failed to load campaign')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaign()
  }, [id])

  // Handle transaction success
  useEffect(() => {
    if (txSuccess) {
      toast.success('Contribution successful!')
      setIsContributing(false)
      setShowContributeDialog(false)
      setContributeAmount('')
      refetchCampaign()
    }
  }, [txSuccess, refetchCampaign])

  // Handle transaction error
  useEffect(() => {
    if (writeError) {
      toast.error(writeError.message || 'Contribution failed')
      setIsContributing(false)
    }
  }, [writeError])

  const handleContribute = () => {
    if (!isConnected) {
      toast.error('Please connect your wallet')
      return
    }
    setShowContributeDialog(true)
  }

  const handleConfirmContribute = () => {
    if (!contributeAmount || parseFloat(contributeAmount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    if (!contributionFee) {
      toast.error('Contribution fee not ready')
      return
    }

    if (!campaign?.campaignId) {
      toast.error('Campaign ID not found')
      return
    }

    const amountInWei = parseEther(contributeAmount)
    const fee = BigInt(contributionFee.toString())
    const totalAmount = amountInWei + fee

    setIsContributing(true)

    writeContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: 'contribute',
      args: [BigInt(campaign.campaignId)],
      value: totalAmount
    })

    toast.info('Waiting for confirmation...')
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <LoaderCircle className="animate-spin" size={48} />
      </div>
    )
  }

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
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden bg-gray-200 aspect-video">
            {campaign.imageUrl ? (
              <img
                src={campaign.imageUrl}
                alt={campaign.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
          </div>

          {/* IPFS Links */}
          {campaign.ipfsUri && (
            <div className="p-4 border rounded-lg bg-muted/50">
              <h3 className="font-semibold mb-2">IPFS Storage</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">CID:</span>
                  <p className="font-mono break-all">{campaign.cid}</p>
                </div>
                <a
                  href={campaign.ipfsUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  View on IPFS →
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold mb-4">{campaign.title}</h1>
          {contractCampaign && (
            <div className="border rounded-lg p-6 space-y-4 bg-linear-to-br from-primary/5 to-primary/10">
              <h3 className="text-xl font-semibold mb-4">Funding Progress</h3>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Raised</span>
                    <span className="font-bold text-lg">
                      {formatEther(contractCampaign[3])} ETH
                    </span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Goal</span>
                    <span className="font-semibold">
                      {formatEther(contractCampaign[1])} ETH
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (Number(contractCampaign[3]) /
                            Number(contractCampaign[1])) *
                            100,
                          100
                        )}%`
                      }}
                    />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {Math.round(
                      (Number(contractCampaign[3]) /
                        Number(contractCampaign[1])) *
                        100
                    )}
                    % funded
                  </p>
                </div>

                <div className="pt-3 border-t space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Deadline:</span>
                    <span className="font-semibold">
                      {new Date(
                        Number(contractCampaign[2]) * 1000
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Status:</span>
                    <span
                      className={`font-semibold ${
                        contractCampaign[4]
                          ? 'text-green-600'
                          : Date.now() > Number(contractCampaign[2]) * 1000
                            ? 'text-red-600'
                            : 'text-blue-600'
                      }`}
                    >
                      {contractCampaign[4]
                        ? 'Claimed'
                        : Date.now() > Number(contractCampaign[2]) * 1000
                          ? 'Ended'
                          : 'Active'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="border rounded-lg p-6 space-y-4">
            <h3 className="text-xl font-semibold mb-4">Campaign Details</h3>

            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Creator:</span>
                <span className="font-mono text-sm break-all text-right max-w-[200px]">
                  {campaign.creator}
                </span>
              </div>

              {campaign.createdAt && (
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Created:</span>
                  <span>
                    {new Date(campaign.createdAt).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>

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

      {/* Contribute Dialog */}
      <Dialog
        open={showContributeDialog}
        onOpenChange={setShowContributeDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contribute to {campaign.title}</DialogTitle>
            <DialogDescription>
              Enter the amount you want to contribute to this campaign.
              {contributionFee && (
                <span className="block mt-2 text-sm">
                  Note: A fee of {formatEther(contributionFee)} ETH will be
                  added to your contribution.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Amount (ETH)
              </label>
              <Input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={contributeAmount}
                onChange={(e) => setContributeAmount(e.target.value)}
                disabled={isContributing}
              />
            </div>

            {contributeAmount && contributionFee && (
              <div className="bg-muted p-3 rounded-lg space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contribution:</span>
                  <span className="font-semibold">{contributeAmount} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fee:</span>
                  <span className="font-semibold">
                    {formatEther(contributionFee)} ETH
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold">
                    {(
                      parseFloat(contributeAmount) +
                      parseFloat(formatEther(contributionFee))
                    ).toFixed(4)}{' '}
                    ETH
                  </span>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowContributeDialog(false)}
              disabled={isContributing}
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmContribute} disabled={isContributing}>
              {isContributing ? (
                <>
                  <LoaderCircle className="animate-spin mr-2" size={16} />
                  Contributing...
                </>
              ) : (
                'Confirm Contribution'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
