import { useEffect, useState } from "react"
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
import { TeamIssuesScreen } from "@/components/tickets/team-issues-screen"
import type { ViewMode } from "@/components/tickets/filter-state"
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

  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [saveAsDialogOpen, setSaveAsDialogOpen] = useState(false)
  const [saveAsName, setSaveAsName] = useState("")

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
    return <div className="flex h-screen items-center justify-center text-muted-foreground">View not found</div>
  }

  const handleSaveAsNew = () => {
    setSaveAsName(`${savedView.name} copy`)
    setSaveAsDialogOpen(true)
  }

  const handleSaveAsSubmit = async () => {
    if (!saveAsName.trim()) return

    try {
      const view = await createSavedView.mutateAsync({
        teamId: savedView.teamId,
        name: saveAsName.trim(),
        presetFilter: filters.presetFilter,
        advancedFilters: filters.advancedFilters,
      })

      toast.success(`Saved view ${view.name}`)
      setSaveAsDialogOpen(false)
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
    <>
      <TeamIssuesScreen
        teamSlug={savedView.teamSlug}
        filters={filters}
        savedViewName={savedView.name}
        viewMode={viewMode}
        onPresetChange={(presetFilter) => setFilters({ presetFilter })}
        onAdvancedFiltersChange={(advancedFilters) =>
          setFilters(advancedFilters ? { advancedFilters } : { presetFilter: "all" })
        }
        onViewModeChange={setViewMode}
        onSaveView={handleSaveAsNew}
        onUpdateView={handleUpdateView}
      />

      <Dialog open={saveAsDialogOpen} onOpenChange={setSaveAsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save as new view</DialogTitle>
            <DialogDescription>Enter a name for this saved view.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSaveAsSubmit()
            }}
          >
            <Input
              autoFocus
              type="text"
              value={saveAsName}
              onChange={(e) => setSaveAsName(e.target.value)}
              className="rounded-lg"
            />
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSaveAsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!saveAsName.trim()}>
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
