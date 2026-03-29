import { useState } from "react"
import { createFileRoute, useNavigate } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveViewName, setSaveViewName] = useState("")

  const updateSearch = (nextFilters: typeof filters) =>
    navigate({
      search: () =>
        serializeIssueQueryFilters(nextFilters, { omitActivePreset: true }),
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
        onPresetChange={(presetFilter) => updateSearch({ presetFilter })}
        onAdvancedFiltersChange={(advancedFilters) =>
          updateSearch(advancedFilters ? { advancedFilters } : { presetFilter: "active" })
        }
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
            <input
              autoFocus
              type="text"
              value={saveViewName}
              onChange={(e) => setSaveViewName(e.target.value)}
              placeholder="View name"
              className="w-full rounded-lg border border-outline-variant/20 bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
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
