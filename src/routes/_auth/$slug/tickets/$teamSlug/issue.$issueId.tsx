import { createFileRoute } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { IssueDetailView } from "@/components/tickets/issue-detail-view"
import {
  teamQueryOptions,
  issueDetailQueryOptions,
  cyclesQueryOptions,
  labelsQueryOptions,
} from "@/query/options/tickets"

export const Route = createFileRoute(
  "/_auth/$slug/tickets/$teamSlug/issue/$issueId",
)({
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(teamQueryOptions(params.teamSlug)),
      context.queryClient.ensureQueryData(issueDetailQueryOptions(params.issueId)),
      context.queryClient.ensureQueryData(cyclesQueryOptions(params.teamSlug)),
      context.queryClient.ensureQueryData(labelsQueryOptions()),
    ])
  },
  component: IssueDetailPage,
})

function IssueDetailPage() {
  const { teamSlug, issueId } = Route.useParams()
  const { data: team } = useSuspenseQuery(teamQueryOptions(teamSlug))

  return <IssueDetailView issueId={issueId} team={team} />
}
