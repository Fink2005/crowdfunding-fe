import { useCreateVocabulary } from '@/apis/queries/vocabulary'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { vocabularySchema, type VocabularyFormData } from '@/schema/vocabulary'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { toast } from 'sonner'

export default function AddVocabulary() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutate: createVocabulary } = useCreateVocabulary()

  const form = useForm<VocabularyFormData>({
    resolver: zodResolver(vocabularySchema),
    defaultValues: {
      word: '',
      meaning: '',
      sourceLang: 'en',
      targetLang: 'vi',
      example: ''
    }
  })

  const onSubmit = (data: VocabularyFormData) => {
    setIsSubmitting(true)

    createVocabulary(
      {
        word: data.word,
        meaning: data.meaning,
        sourceLang: data.sourceLang,
        targetLang: data.targetLang,
        example: data.example || ''
      },
      {
        onSuccess: () => {
          toast.success('Vocabulary added successfully! 🎉')
          form.reset()
          setIsSubmitting(false)
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to add vocabulary')
          setIsSubmitting(false)
        }
      }
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Link
          to="/learn"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <span className="text-xl">←</span>
          <span className="font-medium">Back to Learn</span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-linear-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">
            Add New Vocabulary
          </h1>
          <p className="text-muted-foreground">
            Create vocabulary cards for the learning system
          </p>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-lg">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sourceLang"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Source Language</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full px-4 py-2 rounded-lg border-2 border-muted bg-background"
                        >
                          <option value="en">🇬🇧 English</option>
                          <option value="vi">🇻🇳 Vietnamese</option>
                          <option value="ja">🇯🇵 Japanese</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetLang"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Language</FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full px-4 py-2 rounded-lg border-2 border-muted bg-background"
                        >
                          <option value="en">🇬🇧 English</option>
                          <option value="vi">🇻🇳 Vietnamese</option>
                          <option value="ja">🇯🇵 Japanese</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="word"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Word (Source Language)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., hello"
                        {...field}
                        className="h-12 text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="meaning"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meaning (Target Language)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., xin chào"
                        {...field}
                        className="h-12 text-lg"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Example */}
              <FormField
                control={form.control}
                name="example"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Example Sentence (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Hello, how are you?"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-14 text-lg font-bold bg-linear-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Adding...
                  </>
                ) : (
                  <>
                    <span className="mr-2">✨</span>
                    Add Vocabulary
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
