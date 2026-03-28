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
  }),
  component: IssuesPage,
})

function IssuesPage() {
  const { teamSlug } = Route.useParams()
  const { issueId } = Route.useSearch()
  const navigate = useNavigate()
  const { data: team } = useSuspenseQuery(teamQueryOptions(teamSlug))
  const { data: cycles } = useSuspenseQuery(cyclesQueryOptions(teamSlug))
  const { data: issues } = useSuspenseQuery(issuesQueryOptions(teamSlug))

  return (
    <div className="flex h-screen flex-col bg-surface-low">
      <TicketHeader team={team} />
      <IssueList cycles={cycles} issues={issues} />

      {issueId && (
        <IssueDetailPanel
          issueId={issueId}
          open={true}
          onOpenChange={(open) => {
            if (!open) {
              navigate({ search: {} } as never)
            }
          }}
        />
      )}
    </div>
  )
}
