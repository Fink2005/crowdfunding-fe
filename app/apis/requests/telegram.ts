import { apiClient } from '@/apis/axios'

export const telegramRequests = {
  connectBot: async (payload: string) => {
    const { data } = await apiClient.get('/telegram/link', {
      address: payload
    })
    return data
  },

  sendNotification: async (payload: {
    address: string
    message: string
    campaignId?: string
  }) => {
    const { data } = await apiClient.post('/telegram/notify', payload)
    return data
  }
}
