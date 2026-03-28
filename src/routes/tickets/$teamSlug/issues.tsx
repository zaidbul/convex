import { createFileRoute } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { TicketHeader } from "@/components/tickets/ticket-header"
import { IssueList } from "@/components/tickets/issue-list"
import {
  teamQueryOptions,
  cyclesQueryOptions,
  issuesQueryOptions,
} from "@/query/options/tickets"

export const Route = createFileRoute("/tickets/$teamSlug/issues")({
  component: IssuesPage,
})

function IssuesPage() {
  const { teamSlug } = Route.useParams()
  const { data: team } = useSuspenseQuery(teamQueryOptions(teamSlug))
  const { data: cycles } = useSuspenseQuery(cyclesQueryOptions(teamSlug))
  const { data: issues } = useSuspenseQuery(issuesQueryOptions(teamSlug))

  return (
    <div className="flex h-screen flex-col bg-surface-low">
      <TicketHeader team={team} />
      <IssueList cycles={cycles} issues={issues} />
    </div>
  )
}
