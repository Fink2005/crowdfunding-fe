import { apiClient } from '@/apis/axios'

const mediaRequests = {
  presignUrl: async (payload: {
    fileName: string
    fileType: string
  }): Promise<{
    signedUrl: string
  }> => {
    const { data } = await apiClient.get('/media/presign-url', payload)
    return data
  }
}

export default mediaRequests
