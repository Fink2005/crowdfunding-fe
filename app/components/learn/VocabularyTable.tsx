import { useDeleteVocabulary } from '@/apis/queries/vocabulary'
import { Button } from '@/components/ui/button'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState
} from '@tanstack/react-table'
import { Pencil, Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { VocabularyDialog } from './VocabularyDialog'

type VocabularyItem = {
  _id: string
  word: string
  meaning: string
  sourceLang: string
  targetLang: string
  example: string
  __v: number
}

type VocabularyTableProps = {
  data: VocabularyItem[]
}

const languageFlags: Record<string, string> = {
  en: '🇬🇧 EN',
  vi: '🇻🇳 VI',
  ja: '🇯🇵 JA'
}

export function VocabularyTable({ data }: VocabularyTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [editingVocabulary, setEditingVocabulary] =
    useState<VocabularyItem | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const { mutate: deleteVocabulary } = useDeleteVocabulary()

  const handleDelete = (id: string, word: string) => {
    if (confirm(`Are you sure you want to delete "${word}"?`)) {
      deleteVocabulary(id, {
        onSuccess: () => {
          toast.success('Vocabulary deleted successfully! 🗑️')
        },
        onError: (error: any) => {
          toast.error(error?.message || 'Failed to delete vocabulary')
        }
      })
    }
  }

  const handleEdit = (vocabulary: VocabularyItem) => {
    setEditingVocabulary(vocabulary)
    setIsEditDialogOpen(true)
  }

  const columns: ColumnDef<VocabularyItem>[] = [
    {
      accessorKey: 'word',
      header: 'Word',
      cell: ({ row }) => (
        <div className="font-semibold text-lg">{row.getValue('word')}</div>
      )
    },
    {
      accessorKey: 'meaning',
      header: 'Meaning',
      cell: ({ row }) => (
        <div className="text-muted-foreground">{row.getValue('meaning')}</div>
      )
    },
    {
      accessorKey: 'sourceLang',
      header: 'Source',
      cell: ({ row }) => {
        const lang = row.getValue('sourceLang') as string
        return <div className="font-medium">{languageFlags[lang] || lang}</div>
      }
    },
    {
      accessorKey: 'targetLang',
      header: 'Target',
      cell: ({ row }) => {
        const lang = row.getValue('targetLang') as string
        return <div className="font-medium">{languageFlags[lang] || lang}</div>
      }
    },
    {
      accessorKey: 'example',
      header: 'Example',
      cell: ({ row }) => {
        const example = row.getValue('example') as string
        return (
          <div className="text-sm text-muted-foreground max-w-xs truncate">
            {example || '-'}
          </div>
        )
      }
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const vocabulary = row.original
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleEdit(vocabulary)}
              className="hover:bg-blue-50 hover:text-blue-600"
            >
              <Pencil />
              Edit
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(vocabulary._id, vocabulary.word)}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <Trash />
              Delete
            </Button>
          </div>
        )
      }
    }
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    }
  })

  return (
    <div className="space-y-4">
      {/* Search Filter */}
      <div className="flex gap-4 items-center">
        <input
          placeholder="Search words..."
          value={(table.getColumn('word')?.getFilterValue() as string) ?? ''}
          onChange={(e) =>
            table.getColumn('word')?.setFilterValue(e.target.value)
          }
          className="max-w-sm px-4 py-2 rounded-lg border-2 border-muted bg-background focus:border-primary outline-none transition-colors"
        />
        <div className="text-sm text-muted-foreground">
          Total: {data.length} vocabularies
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border bg-card overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-sm font-semibold text-muted-foreground uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-muted">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    No vocabularies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ← Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next →
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      <VocabularyDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        vocabulary={editingVocabulary}
        mode="edit"
      />
    </div>
  )
}
