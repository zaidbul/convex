import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query"
import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/data-table"
import type { FeedbackSuggestion } from "@/components/tickets/types"
import {
  feedbackSuggestionsQueryOptions,
  feedbackSuggestionQueryOptions,
  teamsQueryOptions,
} from "@/query/options/tickets"
import { FeedbackSuggestionReviewDialog } from "@/components/feedback/feedback-suggestion-review-dialog"

export const Route = createFileRoute(
  "/_auth/$slug/tickets/synthesize/suggestions"
)({
  validateSearch: (search: Record<string, unknown>) => ({
    suggestionId:
      typeof search.suggestionId === "string"
        ? search.suggestionId
        : undefined,
  }),
  component: SynthesizeSuggestionsPage,
})

const statusLabel: Record<FeedbackSuggestion["status"], string> = {
  new: "New",
  reviewing: "Reviewing",
  accepted: "Accepted",
  issue_created: "Issue Created",
  dismissed: "Dismissed",
}

const columns: ColumnDef<FeedbackSuggestion, any>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="max-w-[360px] space-y-0.5 whitespace-normal">
        <p className="text-sm font-medium text-foreground">
          {row.original.title}
        </p>
        <p className="line-clamp-1 text-xs text-muted-foreground">
          {row.original.summary}
        </p>
      </div>
    ),
  },
  {
    id: "team",
    header: "Team",
    accessorFn: (row) =>
      row.selectedTeam?.name ?? row.suggestedTeam?.name ?? "Unassigned",
  },
  {
    accessorKey: "evidenceCount",
    header: "Signals",
  },
  {
    accessorKey: "confidence",
    header: "Confidence",
    cell: ({ getValue }) => `${getValue()}%`,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => (
      <Badge variant="outline" className="rounded-full text-[10px]">
        {statusLabel[getValue() as FeedbackSuggestion["status"]]}
      </Badge>
    ),
  },
]

function SynthesizeSuggestionsPage() {
  const queryClient = useQueryClient()
  const search = Route.useSearch()
  const { data: suggestions } = useSuspenseQuery(
    feedbackSuggestionsQueryOptions()
  )
  const { data: teams = [] } = useQuery(teamsQueryOptions())
  const [dialogOpen, setDialogOpen] = useState(!!search.suggestionId)
  const [selectedSuggestionId, setSelectedSuggestionId] = useState<
    string | null
  >(search.suggestionId ?? null)
  const { data: fetchedSuggestion } = useQuery(
    feedbackSuggestionQueryOptions(selectedSuggestionId ?? "")
  )

  const actionColumn: ColumnDef<FeedbackSuggestion, any> = {
    id: "action",
    header: "",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-right">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSelectedSuggestionId(row.original.id)
            setDialogOpen(true)
          }}
        >
          Review
        </Button>
      </div>
    ),
  }

  return (
    <div className="flex h-full flex-col px-6 py-6">
      <DataTable
        columns={[...columns, actionColumn]}
        data={suggestions}
        searchPlaceholder="Search suggestions..."
        onRefresh={() =>
          queryClient.invalidateQueries({
            queryKey: ["feedback-suggestions"],
          })
        }
      />

      <FeedbackSuggestionReviewDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        suggestion={fetchedSuggestion ?? null}
        teams={teams}
      />
    </div>
  )
}
