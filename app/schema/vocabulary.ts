import z from 'zod'

export const vocabularySchema = z.object({
  word: z.string().min(1, 'Word is required').max(100),
  meaning: z.string().min(1, 'Meaning is required').max(200),
  sourceLang: z.string().min(2, 'Source language is required'),
  targetLang: z.string().min(2, 'Target language is required'),
  example: z.string().max(500).optional()
})

export type VocabularyFormData = z.infer<typeof vocabularySchema>
