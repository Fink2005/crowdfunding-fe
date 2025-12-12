import { campaignRequests } from '@/apis/requests/campaign'
import type { CampaignMetadata, CampaignPagination } from '@/types/campaign'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

export const useGetCampaignMetadata = (initialPage = 1) => {
  return useInfiniteQuery<CampaignPagination, Error>({
    queryKey: ['campaign-list'],
    queryFn: async ({
      pageParam = initialPage
    }): Promise<CampaignPagination> => {
      console.log('📡 Fetching campaigns from API, page:', pageParam)
      try {
        const { data } = await campaignRequests.getCampaigns(pageParam as number)
        console.log('✅ API Response:', { campaignsCount: data?.campaigns?.length, page: data?.currentPage })

        if (data instanceof Error) {
          throw data
        }

        if (!data) {
          throw new Error('Response is null')
        }
        return data
      } catch (error) {
        console.error('❌ API Error:', error)
        throw error
      }
    },
    initialPageParam: initialPage,
    getNextPageParam: (lastPage: CampaignPagination) => {
      const currentPage = lastPage.currentPage
      const totalPages = lastPage.totalPages

      if (currentPage < totalPages) {
        return currentPage + 1
      }
      return undefined
    }
  })
}

export const useGetCampaignById = (id: string | number) => {
  return useQuery<CampaignMetadata, Error>({
    queryKey: ['campaign-detail', id],
    queryFn: async (): Promise<CampaignMetadata> => {
      const { data } = await campaignRequests.getCampaignById(id)

      if (data instanceof Error) {
        throw data
      }

      if (!data) {
        throw new Error('Response is null')
      }
      return data
    },
    enabled: !!id
  })
}
