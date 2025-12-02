import { apiClient } from '@/apis/axios'

export const campaignRequests = {
  createCampaign: (data: {
    title: string
    description: string
    campaignId: number
    imageUrl: string
    creator: string
  }) => apiClient.post('/campaigns/metadata', data)
}
