import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import {
  normalizeTicketRouteSearch,
  parseIssueQueryFilters,
  serializeIssueQueryFilters,
} from "@/components/tickets/filter-state"
import { TeamIssuesScreen } from "@/components/tickets/team-issues-screen"
import { useCreateSavedViewMutation } from "@/query/mutations/tickets"
import { teamQueryOptions } from "@/query/options/tickets"

export const Route = createFileRoute(
  "/_auth/$slug/tickets/$teamSlug/issues"
)({
  validateSearch: normalizeTicketRouteSearch,
  component: IssuesPage,
})

function IssuesPage() {
  const { slug, teamSlug } = Route.useParams()
  const search = Route.useSearch()
  const navigate = useNavigate()
  const { data: team } = useSuspenseQuery(teamQueryOptions(teamSlug))
  const createSavedView = useCreateSavedViewMutation()
  const filters = parseIssueQueryFilters(search, { defaultPresetFilter: "active" })

  const updateSearch = (nextFilters: typeof filters) =>
    navigate({
      search: () =>
        serializeIssueQueryFilters(nextFilters, { omitActivePreset: true }),
    } as unknown as Parameters<typeof navigate>[0])

  const handleSaveView = async () => {
    const name = window.prompt("Name this saved view")
    if (!name?.trim()) {
      return
    }

    try {
      const view = await createSavedView.mutateAsync({
        teamId: team.id,
        name: name.trim(),
        presetFilter: filters.presetFilter,
        advancedFilters: filters.advancedFilters,
      })

      toast.success(`Saved view ${view.name}`)
      navigate({
        to: "/$slug/tickets/views/$viewId",
        params: {
          slug,
          viewId: view.id,
        },
      })
    } catch {
      toast.error("Failed to save view")
    }
  }

  return (
    <TeamIssuesScreen
      teamSlug={teamSlug}
      filters={filters}
      onPresetChange={(presetFilter) => updateSearch({ presetFilter })}
      onAdvancedFiltersChange={(advancedFilters) =>
        updateSearch(advancedFilters ? { advancedFilters } : { presetFilter: "active" })
      }
      onSaveView={handleSaveView}
    />
  )
}
