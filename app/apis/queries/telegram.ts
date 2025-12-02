import { telegramRequests } from '@/apis/requests/telegram'
import { useMutation } from '@tanstack/react-query'

export const useSendTelegramNotification = () => {
  return useMutation({
    mutationFn: (payload: {
      address: string
      message: string
      campaignId?: string
    }) => telegramRequests.sendNotification(payload),
    onSuccess: () => {
      console.log('Telegram notification sent successfully')
    },
    onError: (error) => {
      console.error('Failed to send Telegram notification:', error)
    }
  })
}
