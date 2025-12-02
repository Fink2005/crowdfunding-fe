import mediaRequests from '@/apis/requests/media'
import { useQuery } from '@tanstack/react-query'

export const useMediaQuery = (query: {
  fileName: string
  fileType: string
}) => {
  return useQuery({
    queryKey: ['media', 'presignUrl', query],
    queryFn: async () => mediaRequests.presignUrl(query),
    enabled: !!query.fileName && !!query.fileType
  })
}
