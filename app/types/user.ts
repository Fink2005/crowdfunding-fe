import type { CampaignMetadata } from './campaign'

export type UserProfile = {
  id: string
  address: string
  chatId?: string
  createdAt: string
  campaigns: CampaignMetadata[]
}
