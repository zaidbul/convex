import { createFileRoute } from "@tanstack/react-router"
import {
  normalizeTicketRouteSearch,
  parseIssueQueryFilters,
} from "@/components/tickets/filter-state"
import { CyclePage } from "@/components/tickets/cycle-page"
import { issuesQueryOptions } from "@/query/options/tickets"

export const Route = createFileRoute(
  "/_auth/$slug/tickets/$teamSlug/cycles/upcoming"
)({
  validateSearch: normalizeTicketRouteSearch,
  loaderDeps: ({ search }) => ({
    filters: parseIssueQueryFilters(search, { defaultPresetFilter: "all" }),
  }),
  loader: async ({ context, params, deps }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(
        issuesQueryOptions(params.teamSlug, deps.filters)
      ),
      context.queryClient.ensureQueryData(
        issuesQueryOptions(params.teamSlug, { presetFilter: "all" })
      ),
    ])
  },
  component: UpcomingCyclePage,
})

function UpcomingCyclePage() {
  const { teamSlug } = Route.useParams()
  const search = Route.useSearch()

  return (
    <CyclePage
      teamSlug={teamSlug}
      filters={parseIssueQueryFilters(search, { defaultPresetFilter: "all" })}
      viewKind="upcoming"
    />
  )
}
