import { formatEther } from 'viem'

type ContractCampaign = readonly [
  creator: `0x${string}`,
  goal: bigint,
  deadline: bigint,
  totalFunded: bigint,
  claimed: boolean
]

export function FundingProgress({
  contractCampaign
}: {
  contractCampaign: ContractCampaign
}) {
  const progress = Math.round(
    (Number(contractCampaign[3]) / Number(contractCampaign[1])) * 100
  )

  const getStatus = () => {
    if (contractCampaign[4]) return { text: 'Claimed', color: 'text-green-600' }
    if (Date.now() > Number(contractCampaign[2]) * 1000)
      return { text: 'Ended', color: 'text-red-600' }
    return { text: 'Active', color: 'text-blue-600' }
  }

  const status = getStatus()

  return (
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

          <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
            <div
              className="bg-primary h-3 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {progress}% funded
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
            <span className={`font-semibold ${status.color}`}>
              {status.text}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
