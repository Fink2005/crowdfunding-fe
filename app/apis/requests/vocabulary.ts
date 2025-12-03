import { apiClient } from '../axios'

export type CreateVocabularyInput = {
  word: string
  meaning: string
  sourceLang: string
  targetLang: string
  example: string
}

export type VocabularyResponse = {
  success: boolean
  message?: string
  data: {
    id: string
    word: string
    meaning: string
    sourceLang: string
    targetLang: string
    example: string
  }
}

export type VocabularyListResponse = {
  success: boolean
  data: Array<{
    id: string
    word: string
    meaning: string
    sourceLang: string
    targetLang: string
    example: string
  }>
}

export type QuizQuestion = {
  id: string
  word: string
  answer: string
  choices: string[]
}

export type QuizResponse = {
  success: boolean
  data: QuizQuestion[]
}

export type SubmitQuizInput = {
  address: string
  answers: Array<{
    wordId: string
    selected: string
  }>
}

export type SubmitQuizResponse = {
  success: boolean
  data: {
    score: number
    total: number
  }
}

export const vocabularyRequests = {
  // POST /vocabulary - Create new vocabulary
  createVocabulary: async (
    input: CreateVocabularyInput
  ): Promise<VocabularyResponse> => {
    const response = await apiClient.post('/vocabulary', input)
    return response.data
  },

  // GET /vocabulary/words - Get vocabulary list by language pair
  getVocabularyWords: async (
    sourceLang: string,
    targetLang: string
  ): Promise<VocabularyListResponse> => {
    const response = await apiClient.get('/vocabulary/words', {
      sourceLang,
      targetLang
    })
    return response.data
  },

  getQuiz: async (
    sourceLang: string,
    targetLang: string
  ): Promise<QuizResponse> => {
    const response = await apiClient.get('/vocabulary/quiz', {
      sourceLang,
      targetLang
    })
    return response.data
  },

  submitQuiz: async (input: SubmitQuizInput): Promise<SubmitQuizResponse> => {
    const response = await apiClient.post('/vocabulary/quiz/submit', input)
    return response.data
  }
}
