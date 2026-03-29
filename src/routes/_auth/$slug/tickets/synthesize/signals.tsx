import { createFileRoute } from "@tanstack/react-router"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import type { FeedbackItem } from "@/components/tickets/types"
import { feedbackItemsQueryOptions } from "@/query/options/tickets"

export const Route = createFileRoute(
  "/_auth/$slug/tickets/synthesize/signals"
)({
  component: SynthesizeSignalsPage,
})

const columns: ColumnDef<FeedbackItem, any>[] = [
  {
    accessorKey: "importSourceName",
    header: "Source",
  },
  {
    id: "summary",
    header: "Summary",
    accessorFn: (row) => row.title ?? row.summary ?? "Feedback item",
    cell: ({ row }) => (
      <div className="max-w-[360px] space-y-0.5 whitespace-normal">
        <p className="text-sm font-medium text-foreground">
          {row.original.title || row.original.summary || "Feedback item"}
        </p>
        {row.original.summary && (
          <p className="line-clamp-1 text-xs text-muted-foreground">
            {row.original.summary}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: "featureArea",
    header: "Feature",
    cell: ({ getValue }) => getValue() ?? "General",
  },
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ getValue }) => getValue() ?? "n/a",
  },
  {
    id: "team",
    header: "Team",
    accessorFn: (row) => row.suggestedTeam?.name ?? "Unassigned",
  },
]

function SynthesizeSignalsPage() {
  const queryClient = useQueryClient()
  const { data: items } = useSuspenseQuery(feedbackItemsQueryOptions())

  return (
    <div className="flex h-full flex-col px-6 py-6">
      <DataTable
        columns={columns}
        data={items}
        searchPlaceholder="Search signals..."
        onRefresh={() =>
          queryClient.invalidateQueries({ queryKey: ["feedback-items"] })
        }
      />
    </div>
  )
}
