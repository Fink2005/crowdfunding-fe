import { contractAbi, contractAddress } from '@/contract/ContractClient'
import { useCallback, useEffect, useState } from 'react'
import { type Abi, type Address, decodeEventLog } from 'viem'
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract
} from 'wagmi'

type UseContractOptions<TEventArgs = unknown> = {
  onSuccess?: (eventArgs: TEventArgs) => void
  onError?: (error: Error) => void
  eventName?: string
}

export function useContract<
  TFunctionName extends string,
  TArgs,
  TEventArgs = unknown
>(options?: UseContractOptions<TEventArgs>) {
  const { address } = useAccount()
  const [isLoading, setIsLoading] = useState(false)

  const { data: hash, writeContract, isPending, error } = useWriteContract()

  const { data: receipt, isSuccess } = useWaitForTransactionReceipt({
    hash
  })

  // Decode event when transaction is confirmed
  useEffect(() => {
    if (!isSuccess || !receipt) return

    try {
      if (options?.eventName && receipt.logs.length > 0) {
        const log = receipt.logs[0]
        const event = decodeEventLog({
          abi: contractAbi,
          data: log.data,
          topics: log.topics
        })

        if (event.eventName === options.eventName) {
          options?.onSuccess?.(event.args as TEventArgs)
        }
      } else {
        options?.onSuccess?.({} as TEventArgs)
      }
      setIsLoading(false)
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error')
      options?.onError?.(error)
      setIsLoading(false)
    }
  }, [isSuccess, receipt, options])

  // Handle error
  useEffect(() => {
    if (error) {
      options?.onError?.(error)
      setIsLoading(false)
    }
  }, [error, options])

  const write = useCallback(
    (functionName: TFunctionName, args: TArgs) => {
      setIsLoading(true)
      writeContract({
        address: contractAddress as Address,
        abi: contractAbi as Abi,
        functionName,
        args: args as readonly unknown[]
      })
    },
    [writeContract]
  )

  return {
    write,
    hash,
    receipt,
    isLoading: isLoading || isPending,
    isSuccess,
    error,
    address,
    reset: () => setIsLoading(false)
  }
}

// Specific hook for creating campaigns
export function useCreateCampaign(
  onSuccess?: (campaignId: bigint) => void,
  onError?: (error: Error) => void
) {
  const contract = useContract<
    'createCampaign',
    readonly [string, bigint, bigint],
    { campaignId: bigint }
  >({
    eventName: 'CampaignCreated',
    onSuccess: (args) => onSuccess?.(args.campaignId),
    onError
  })

  const createCampaign = useCallback(
    (metadataURI: string, goal: bigint, deadline: bigint) => {
      contract.write('createCampaign', [metadataURI, goal, deadline])
    },
    [contract]
  )

  return {
    createCampaign,
    ...contract
  }
}
