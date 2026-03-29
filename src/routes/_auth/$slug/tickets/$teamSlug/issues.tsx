import { useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  getViewMode,
  normalizeTicketRouteSearch,
  parseIssueQueryFilters,
  serializeIssueQueryFilters,
  type ViewMode,
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
  const viewMode = getViewMode(search)

  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveViewName, setSaveViewName] = useState("")

  const updateSearch = (nextFilters: typeof filters) =>
    navigate({
      search: () => ({
        ...serializeIssueQueryFilters(nextFilters, { omitActivePreset: true }),
        view: viewMode === "board" ? "board" : undefined,
      }),
    } as unknown as Parameters<typeof navigate>[0])

  const handleViewModeChange = (mode: ViewMode) =>
    navigate({
      search: (prev: Record<string, unknown>) => ({
        ...prev,
        view: mode === "board" ? "board" : undefined,
      }),
    } as unknown as Parameters<typeof navigate>[0])

  const handleSaveView = () => {
    setSaveViewName("")
    setSaveDialogOpen(true)
  }

  const handleSaveSubmit = async () => {
    if (!saveViewName.trim()) return

    try {
      const view = await createSavedView.mutateAsync({
        teamId: team.id,
        name: saveViewName.trim(),
        presetFilter: filters.presetFilter,
        advancedFilters: filters.advancedFilters,
      })

      toast.success(`Saved view ${view.name}`)
      setSaveDialogOpen(false)
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
    <>
      <TeamIssuesScreen
        teamSlug={teamSlug}
        filters={filters}
        viewMode={viewMode}
        onPresetChange={(presetFilter) => updateSearch({ presetFilter })}
        onAdvancedFiltersChange={(advancedFilters) =>
          updateSearch(advancedFilters ? { advancedFilters } : { presetFilter: "active" })
        }
        onViewModeChange={handleViewModeChange}
        onSaveView={handleSaveView}
      />

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save view</DialogTitle>
            <DialogDescription>
              Save the current filter state as a reusable view.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSaveSubmit()
            }}
          >
            <Input
              autoFocus
              type="text"
              value={saveViewName}
              onChange={(e) => setSaveViewName(e.target.value)}
              placeholder="View name"
              className="rounded-lg"
            />
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSaveDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!saveViewName.trim()}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
