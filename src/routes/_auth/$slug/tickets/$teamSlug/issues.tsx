import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { TicketHeader } from "@/components/tickets/ticket-header"
import { IssueList } from "@/components/tickets/issue-list"
import { IssueDetailPanel } from "@/components/tickets/issue-detail-panel"
import {
  teamQueryOptions,
  cyclesQueryOptions,
  issuesQueryOptions,
} from "@/query/options/tickets"

export const Route = createFileRoute(
  "/_auth/$slug/tickets/$teamSlug/issues"
)({
  validateSearch: (search: Record<string, unknown>) => ({
    issueId: (search.issueId as string) || undefined,
    filter: (search.filter as string) || undefined,
  }),
  component: IssuesPage,
})

function IssuesPage() {
  const { teamSlug } = Route.useParams()
  const { issueId, filter } = Route.useSearch()
  const navigate = useNavigate()
  const { data: team } = useSuspenseQuery(teamQueryOptions(teamSlug))
  const { data: cycles } = useSuspenseQuery(cyclesQueryOptions(teamSlug))
  const { data: issues } = useSuspenseQuery(issuesQueryOptions(teamSlug, filter))

  return (
    <div className="flex h-screen flex-col bg-surface-low">
      <TicketHeader
        team={team}
        activeFilter={(filter as import("@/components/tickets/types").IssueFilter) ?? "active"}
        onFilterChange={(f) => navigate({ search: (prev) => ({ ...prev, filter: f === "active" ? undefined : f }) } as Parameters<typeof navigate>[0])}
      />
      <IssueList cycles={cycles} issues={issues} />

      {issueId && (
        <IssueDetailPanel
          issueId={issueId}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              navigate({
                search: (prev) => ({ ...prev, issueId: undefined }),
              } as Parameters<typeof navigate>[0])
            }
          }}
        />
      )}
    </div>
  )
}
