import { useSendTelegramNotification } from '@/apis/queries/telegram'
import type { CampaignMetadata } from '@/types/campaign'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'

type ContractCampaign = readonly [
  creator: `0x${string}`,
  goal: bigint,
  deadline: bigint,
  totalFunded: bigint,
  claimed: boolean
]

type UseContributionNotificationProps = {
  txSuccess: boolean
  campaign: CampaignMetadata | null
  address: `0x${string}` | undefined
  contributeAmount: string
  userHasTelegram: boolean
  refetchCampaign: () => Promise<{ data: ContractCampaign | undefined }>
  onSuccess: () => void
  onShowTelegramDialog: () => void
  onResetAmount: () => void
}

export function useContributionNotification({
  txSuccess,
  campaign,
  address,
  contributeAmount,
  userHasTelegram,
  refetchCampaign,
  onSuccess,
  onShowTelegramDialog,
  onResetAmount
}: UseContributionNotificationProps) {
  const { mutate: sendNotification } = useSendTelegramNotification()
  const hasProcessed = useRef(false)

  useEffect(() => {
    if (!txSuccess || !campaign || !address || hasProcessed.current) return

    // Mark as processed to prevent duplicate calls
    hasProcessed.current = true

    toast.success('Contribution successful!')
    onSuccess()

    setTimeout(async () => {
      const result = await refetchCampaign()
      const updated = result.data

      if (!updated) return

      const goalReached = updated[3] >= updated[1]
      const progress = Math.round(
        (Number(updated[3]) / Number(updated[1])) * 100
      )

      // Notify contributor
      sendNotification({
        address: address as string,
        message: `✅ <b>Contribution Successful!</b>\n\n🎯 Campaign: <b>${campaign.title}</b>\n💵 Your Contribution: <b>${contributeAmount} ETH</b>\n📊 Progress: <b>${progress}%</b> of goal\n\nThank you for supporting this project! 🙏`
      })

      // Notify creator
      sendNotification({
        address: campaign.creator,
        message: `💰 <b>New Contribution Received!</b>\n\n🎯 Campaign: <b>${campaign.title}</b>\n💵 Amount: <b>${contributeAmount} ETH</b>\n📊 Progress: <b>${progress}%</b> of goal\n👤 From: <code>${address}</code>\n\nThank you for your support! 🙏`
      })

      // Notify creator if goal reached
      if (goalReached) {
        sendNotification({
          address: campaign.creator,
          message: `🎉 <b>Congratulations! Campaign Goal Reached!</b>\n\n🎯 Campaign: <b>${campaign.title}</b>\n✅ Goal Achieved!\n\nYour campaign has successfully reached its funding goal! You can now withdraw the funds once the deadline has passed. 🚀`
        })
      }

      // Show Telegram dialog if user hasn't connected
      if (!userHasTelegram) {
        onShowTelegramDialog()
      }
    }, 2000)

    onResetAmount()
  }, [txSuccess])

  // Reset flag when txSuccess changes back to false
  useEffect(() => {
    if (!txSuccess) {
      hasProcessed.current = false
    }
  }, [txSuccess])
}
