import { apiClient } from '@/apis/axios'

export const campaignRequests = {
  createCampaign: (data: {
    title: string
    description: string
    campaignId: number
    imageUrl: string
    creator: string
  }) => apiClient.post('/campaigns/metadata', data),
  getCampaigns: (page: number = 1, limit: number = 6) =>
    apiClient.get('/campaigns/metadata', { page, limit }),
  getCampaignById: (id: string | number) =>
    apiClient.get(`/campaigns/metadata/${id}`)
}
