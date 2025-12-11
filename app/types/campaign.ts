export type CampaignMetadata = {
  data: {
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
}

export type CampaignPagination = {
  campaigns: CampaignMetadata['data'][]
  page: number
  limit: number
  currentPage: number
  totalPages: number
}

export type ContractCampaign = [
  creator: `0x${string}`,
  goal: bigint,
  deadline: bigint,
  totalFunded: bigint,
  claimed: boolean
]
