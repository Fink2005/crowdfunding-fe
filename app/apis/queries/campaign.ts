import { campaignRequests } from '@/apis/requests/campaign'
import type { CampaignPagination } from '@/types/campaign'
import { useInfiniteQuery } from '@tanstack/react-query'

export const useGetCampaignMetadata = (initialPage = 1) => {
  return useInfiniteQuery<CampaignPagination, Error>({
    queryKey: ['user-ranking'],
    queryFn: async ({
      pageParam = initialPage
    }): Promise<CampaignPagination> => {
      const { data } = await campaignRequests.getCampaigns(pageParam as number)

      if (data instanceof Error) {
        throw data
      }

      if (!data) {
        throw new Error('Response is null')
      }
      return data
    },
    initialPageParam: initialPage,
    getNextPageParam: (lastPage: CampaignPagination) => {
      const currentPage = lastPage.page
      const totalPages = lastPage.pageTotal

      if (currentPage < totalPages) {
        return currentPage + 1
      }
      return undefined
    }
  })
}
