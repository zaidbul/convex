import { useEffect, useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { TeamIssuesScreen } from "@/components/tickets/team-issues-screen"
import type { IssueQueryFilters } from "@/components/tickets/types"
import {
  useCreateSavedViewMutation,
  useUpdateSavedViewMutation,
} from "@/query/mutations/tickets"
import { savedViewQueryOptions } from "@/query/options/tickets"

export const Route = createFileRoute("/_auth/$slug/tickets/views/$viewId")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(savedViewQueryOptions(params.viewId))
  },
  component: SavedViewPage,
})

function SavedViewPage() {
  const navigate = useNavigate()
  const { slug, viewId } = Route.useParams()
  const { data: savedView } = useSuspenseQuery(savedViewQueryOptions(viewId))
  const createSavedView = useCreateSavedViewMutation()
  const updateSavedView = useUpdateSavedViewMutation()
  const [filters, setFilters] = useState<IssueQueryFilters>(() => ({
    presetFilter: savedView?.presetFilter,
    advancedFilters: savedView?.advancedFilters,
  }))

  useEffect(() => {
    if (!savedView) {
      return
    }

    setFilters({
      presetFilter: savedView.presetFilter,
      advancedFilters: savedView.advancedFilters,
    })
  }, [savedView])

  if (!savedView) {
    return null
  }

  const handleSaveAsNew = async () => {
    const name = window.prompt("Name this saved view", `${savedView.name} copy`)
    if (!name?.trim()) {
      return
    }

    try {
      const view = await createSavedView.mutateAsync({
        teamId: savedView.teamId,
        name: name.trim(),
        presetFilter: filters.presetFilter,
        advancedFilters: filters.advancedFilters,
      })

      toast.success(`Saved view ${view.name}`)
      navigate({
        to: "/$slug/tickets/views/$viewId",
        params: { slug, viewId: view.id },
      })
    } catch {
      toast.error("Failed to save view")
    }
  }

  const handleUpdateView = async () => {
    try {
      await updateSavedView.mutateAsync({
        viewId: savedView.id,
        presetFilter: filters.advancedFilters ? null : (filters.presetFilter ?? null),
        advancedFilters: filters.advancedFilters ?? null,
      })
      toast.success("Saved view updated")
    } catch {
      toast.error("Failed to update saved view")
    }
  }

  return (
    <TeamIssuesScreen
      teamSlug={savedView.teamSlug}
      filters={filters}
      savedViewName={savedView.name}
      onPresetChange={(presetFilter) => setFilters({ presetFilter })}
      onAdvancedFiltersChange={(advancedFilters) =>
        setFilters(advancedFilters ? { advancedFilters } : { presetFilter: "active" })
      }
      onSaveView={handleSaveAsNew}
      onUpdateView={handleUpdateView}
    />
  )
}
