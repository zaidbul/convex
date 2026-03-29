import { createFileRoute } from "@tanstack/react-router"
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/ui/data-table"
import type { FeedbackCluster } from "@/components/tickets/types"
import { feedbackClustersQueryOptions } from "@/query/options/tickets"

export const Route = createFileRoute(
  "/_auth/$slug/tickets/synthesize/clusters"
)({
  component: SynthesizeClustersPage,
})

const columns: ColumnDef<FeedbackCluster, any>[] = [
  {
    accessorKey: "title",
    header: "Cluster",
  },
  {
    id: "team",
    header: "Team",
    accessorFn: (row) => row.suggestedTeam?.name ?? "Unassigned",
  },
  {
    accessorKey: "featureArea",
    header: "Feature",
    cell: ({ getValue }) => getValue() ?? "General",
  },
  {
    accessorKey: "signalCount",
    header: "Signals",
  },
  {
    accessorKey: "confidence",
    header: "Confidence",
    cell: ({ getValue }) => `${getValue()}%`,
  },
]

function SynthesizeClustersPage() {
  const queryClient = useQueryClient()
  const { data: clusters } = useSuspenseQuery(feedbackClustersQueryOptions())

  return (
    <div className="flex h-full flex-col px-6 py-6">
      <DataTable
        columns={columns}
        data={clusters}
        searchPlaceholder="Search clusters..."
        onRefresh={() =>
          queryClient.invalidateQueries({
            queryKey: ["feedback-clusters"],
          })
        }
      />
    </div>
  )
}
