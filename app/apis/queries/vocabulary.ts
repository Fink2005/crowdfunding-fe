import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type {
  CreateVocabularyInput,
  SubmitQuizInput
} from '../requests/vocabulary'
import { vocabularyRequests } from '../requests/vocabulary'

export const useVocabularyWords = (
  sourceLang: string,
  targetLang: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['vocabulary-words', sourceLang, targetLang],
    queryFn: () =>
      vocabularyRequests.getVocabularyWords(sourceLang, targetLang),
    enabled: enabled && !!sourceLang && !!targetLang
  })
}

export const useVocabularyQuiz = (
  sourceLang: string,
  targetLang: string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ['vocabulary-quiz', sourceLang, targetLang],
    queryFn: () => vocabularyRequests.getQuiz(sourceLang, targetLang),
    enabled: enabled && !!sourceLang && !!targetLang,
    staleTime: 0,
    refetchOnMount: true
  })
}

export const useCreateVocabulary = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateVocabularyInput) =>
      vocabularyRequests.createVocabulary(input),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['vocabulary-words'] })
      queryClient.refetchQueries({ queryKey: ['vocabulary-quiz'] })
    }
  })
}

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: SubmitQuizInput) =>
      vocabularyRequests.submitQuiz(input),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['vocabulary-quiz'] })
    }
  })
}
