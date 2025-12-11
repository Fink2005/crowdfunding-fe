import { useAllVocabulary } from '@/apis/queries/vocabulary'
import { VocabularyDialog } from '@/components/learn/VocabularyDialog'
import { VocabularyTable } from '@/components/learn/VocabularyTable'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

export default function ManageVocabulary() {
  const { data, isLoading, error } = useAllVocabulary()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-spin">📚</div>
            <p className="text-xl text-muted-foreground">
              Loading vocabularies...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="text-6xl">❌</div>
            <p className="text-xl text-red-500">Failed to load vocabularies</p>
            <p className="text-muted-foreground">{(error as any)?.message}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/learn"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <span className="text-xl">←</span>
          <span className="font-medium">Back to Learn</span>
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-blue-500">
              Manage Vocabulary
            </h1>
            <p className="text-muted-foreground">
              View, edit, and manage all vocabulary entries
            </p>
          </div>

          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="bg-linear-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 h-12 px-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <span className="mr-2">
              <Plus />
            </span>
            Add New Vocabulary
          </Button>
        </div>

        <div className="bg-card rounded-3xl p-6 shadow-xl border">
          {data?.data && data.data.length > 0 ? (
            <VocabularyTable data={data.data} />
          ) : (
            <div className="text-center py-16 space-y-4">
              <div className="text-6xl">📝</div>
              <h3 className="text-2xl font-bold">No Vocabularies Yet</h3>
              <p className="text-muted-foreground">
                Start by adding your first vocabulary entry
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="mt-4 bg-linear-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
              >
                <span className="mr-2">➕</span>
                Add Vocabulary
              </Button>
            </div>
          )}
        </div>

        {/* Add Dialog */}
        <VocabularyDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          mode="create"
        />
      </div>
    </div>
  )
}
