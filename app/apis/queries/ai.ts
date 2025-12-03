import aiRequests from '@/apis/requests/ai'
import { useQuery } from '@tanstack/react-query'

export const useFunFact = (
  word: string,
  language: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['funFact', word, language],
    queryFn: () => aiRequests.generateFunFact(word, language),
    enabled: enabled && !!word && !!language,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
    gcTime: 1000 * 60 * 60 * 24 // Keep in cache for 24 hours
  })
}
