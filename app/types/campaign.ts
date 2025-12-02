export type CampaignMetadata = {
  _id?: string
  campaignId: number
  creator: string
  title: string
  ipfsUri?: string
  cid?: string
  description: string
  imageUrl: string
  createdAt?: Date
  updatedAt?: Date
  __v?: number
}

export type CampaignPagination = {
  campaigns: CampaignMetadata[]
  page: number
  limit: number
  pageTotal: number
}
