import { createFileRoute } from "@tanstack/react-router"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import type { FeedbackImport } from "@/components/tickets/types"
import { feedbackImportsQueryOptions } from "@/query/options/tickets"
import { FeedbackImportForm } from "@/components/feedback/feedback-import-form"

export const Route = createFileRoute(
  "/_auth/$slug/tickets/synthesize/imports"
)({
  component: SynthesizeImportsPage,
})

const columns: ColumnDef<FeedbackImport, any>[] = [
  {
    accessorKey: "sourceName",
    header: "Source",
    cell: ({ row }) => (
      <div className="space-y-0.5">
        <p className="text-sm font-medium text-foreground">
          {row.original.sourceName}
        </p>
        {row.original.sourceDescription && (
          <p className="text-xs text-muted-foreground">
            {row.original.sourceDescription}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "kind",
    header: "Kind",
  },
  {
    accessorKey: "itemCount",
    header: "Items",
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleString(),
  },
]

function SynthesizeImportsPage() {
  const queryClient = useQueryClient()
  const { data: imports } = useSuspenseQuery(feedbackImportsQueryOptions())

  return (
    <div className="flex h-full flex-col px-6 py-6">
      <DataTable
        columns={columns}
        data={imports}
        searchPlaceholder="Search imports..."
        headerContent={<FeedbackImportForm />}
        onRefresh={() =>
          queryClient.invalidateQueries({ queryKey: ["feedback-imports"] })
        }
      />
    </div>
  )
}
