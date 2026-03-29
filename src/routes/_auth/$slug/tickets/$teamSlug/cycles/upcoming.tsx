import { createFileRoute } from "@tanstack/react-router"
import {
  normalizeTicketRouteSearch,
  parseIssueQueryFilters,
} from "@/components/tickets/filter-state"
import { CyclePage } from "@/components/tickets/cycle-page"

export const Route = createFileRoute(
  "/_auth/$slug/tickets/$teamSlug/cycles/upcoming"
)({
  validateSearch: normalizeTicketRouteSearch,
  component: UpcomingCyclePage,
})

function UpcomingCyclePage() {
  const { teamSlug } = Route.useParams()
  const search = Route.useSearch()

  return (
    <CyclePage
      teamSlug={teamSlug}
      filters={parseIssueQueryFilters(search, { defaultPresetFilter: "active" })}
      viewKind="upcoming"
    />
  )
}
