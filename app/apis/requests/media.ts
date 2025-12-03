import { apiClient } from '@/apis/axios'

const mediaRequests = {
  presignUrl: async (payload: {
    fileName: string
    fileType: string
  }): Promise<{
    signedUrl: string
  }> => {
    const response = await apiClient.get('/media/presign-url', {
      payload
    })
    return response.data
  }
}

export default mediaRequests
