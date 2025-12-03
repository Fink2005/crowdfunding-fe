import { apiClient } from '@/apis/axios'

const aiRequests = {
  generateFunFact: async (
    word: string,
    language: string
  ): Promise<{ content: string }> => {
    const languageMap: Record<string, string> = {
      en: 'English',
      vi: 'Vietnamese',
      ja: 'Japanese'
    }

    const response = await apiClient.post('/ai/generate', {
      prompt: `Fun Fact about ${word} in 200 words do not yapping just give the result by ${languageMap[language]} language`
    })
    return response.data
  }
}

export default aiRequests
