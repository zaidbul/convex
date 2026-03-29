import { createFileRoute } from "@tanstack/react-router"
import {
  normalizeTicketRouteSearch,
  parseIssueQueryFilters,
} from "@/components/tickets/filter-state"
import { CyclePage } from "@/components/tickets/cycle-page"

export const Route = createFileRoute(
  "/_auth/$slug/tickets/$teamSlug/cycles/current"
)({
  validateSearch: normalizeTicketRouteSearch,
  component: CurrentCyclePage,
})

function CurrentCyclePage() {
  const { teamSlug } = Route.useParams()
  const search = Route.useSearch()

  return (
    <CyclePage
      teamSlug={teamSlug}
      filters={parseIssueQueryFilters(search, { defaultPresetFilter: "active" })}
      viewKind="current"
    />
  )
}
