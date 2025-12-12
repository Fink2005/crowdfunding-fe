import { contractAbi, contractAddress } from '@/contract/ContractClient'
import type { ContractCampaign } from '@/types/campaign'
import { useReadContract } from 'wagmi'

export const useGetCampaignContract = (id: number) => {
  const result = useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'getCampaign',
    args: id || id === 0 ? [BigInt(id)] : undefined,
    query: {
      enabled: id === 0 ? true : !!id,
      retry: 3,
      retryDelay: 1000
    }
  })

  // Debug logging
  if (result.error) {
    console.error(`❌ Contract read failed for campaign ${id}:`, result.error)
  }

  if (result.isLoading) {
    console.log(`⏳ Loading campaign ${id} from contract...`)
  }

  if (result.data) {
    console.log(`✅ Campaign ${id} data:`, result.data)
  }

  return {
    ...result,
    data: result.data as ContractCampaign | undefined,
    refetch: result.refetch as () => Promise<{
      data: ContractCampaign | undefined
    }>
  }
}
export const useGetContributionFee = () =>
  useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'contributionFee'
  }) as { data: bigint | undefined }

export const useGetCreationFee = () =>
  useReadContract({
    address: contractAddress,
    abi: contractAbi,
    functionName: 'creationFee'
  }) as { data: bigint | undefined }
