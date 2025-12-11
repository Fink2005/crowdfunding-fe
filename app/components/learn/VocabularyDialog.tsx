import {
  useCreateVocabulary,
  useUpdateVocabulary
} from '@/apis/queries/vocabulary'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
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
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

type VocabularyItem = {
  _id: string
  word: string
  meaning: string
  sourceLang: string
  targetLang: string
  example: string
}

type VocabularyDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  vocabulary?: VocabularyItem | null
  mode: 'create' | 'edit'
}

export function VocabularyDialog({
  open,
  onOpenChange,
  vocabulary,
  mode
}: VocabularyDialogProps) {
  const { mutate: createVocabulary, isPending: isCreating } =
    useCreateVocabulary()
  const { mutate: updateVocabulary, isPending: isUpdating } =
    useUpdateVocabulary()

  const isPending = isCreating || isUpdating

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

  useEffect(() => {
    if (mode === 'edit' && vocabulary) {
      form.reset({
        word: vocabulary.word,
        meaning: vocabulary.meaning,
        sourceLang: vocabulary.sourceLang,
        targetLang: vocabulary.targetLang,
        example: vocabulary.example || ''
      })
    } else if (mode === 'create') {
      form.reset({
        word: '',
        meaning: '',
        sourceLang: 'en',
        targetLang: 'vi',
        example: ''
      })
    }
  }, [vocabulary, mode, form, open])

  const onSubmit = (data: VocabularyFormData) => {
    if (mode === 'edit' && vocabulary) {
      updateVocabulary(
        {
          id: vocabulary._id,
          word: data.word,
          meaning: data.meaning,
          sourceLang: data.sourceLang,
          targetLang: data.targetLang,
          example: data.example || ''
        },
        {
          onSuccess: () => {
            toast.success('Vocabulary updated successfully! 🎉')
            onOpenChange(false)
          },
          onError: (error: any) => {
            toast.error(error?.message || 'Failed to update vocabulary')
          }
        }
      )
    } else {
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
            onOpenChange(false)
          },
          onError: (error: any) => {
            toast.error(error?.message || 'Failed to add vocabulary')
          }
        }
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {mode === 'edit' ? 'Edit Vocabulary' : 'Add New Vocabulary'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                    <Input placeholder="e.g., hello" {...field} />
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
                    <Input placeholder="e.g., xin chào" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="flex-1 bg-linear-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              >
                {isPending ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    {mode === 'edit' ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>
                    <span className="mr-2">
                      {mode === 'edit' ? '💾' : '✨'}
                    </span>
                    {mode === 'edit' ? 'Save Changes' : 'Add Vocabulary'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
