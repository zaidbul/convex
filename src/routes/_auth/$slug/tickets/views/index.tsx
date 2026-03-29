import { useState } from "react"
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { Eye, Pencil, Trash2 } from "lucide-react"
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  useDeleteSavedViewMutation,
  useUpdateSavedViewMutation,
} from "@/query/mutations/tickets"
import { savedViewsQueryOptions } from "@/query/options/tickets"

export const Route = createFileRoute("/_auth/$slug/tickets/views/")({
  component: ViewsIndexPage,
})

function ViewsIndexPage() {
  const navigate = useNavigate()
  const { slug } = useParams({ strict: false }) as { slug?: string }
  const { data: views } = useSuspenseQuery(savedViewsQueryOptions())
  const updateSavedView = useUpdateSavedViewMutation()
  const deleteSavedView = useDeleteSavedViewMutation()

  const [renameTarget, setRenameTarget] = useState<{ id: string; name: string } | null>(null)
  const [renameValue, setRenameValue] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null)

  return (
    <div className="flex h-screen flex-col bg-surface-low">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-outline-variant/15 bg-surface-low px-4 py-2.5">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-display text-sm font-medium tracking-tight text-on-surface">
          Views
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {views.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <Empty className="max-w-xl border-outline-variant/30 bg-surface px-8 py-12">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Eye />
                </EmptyMedia>
                <EmptyTitle>No saved views yet</EmptyTitle>
                <EmptyDescription>
                  Save the current filter state from any team issue list to reuse it here.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        ) : (
          <div className="mx-auto grid max-w-4xl gap-4">
            {views.map((view) => (
              <div
                key={view.id}
                className="flex items-center gap-4 rounded-2xl border border-outline-variant/15 bg-surface p-5 shadow-sm"
              >
                <Link
                  to="/$slug/tickets/views/$viewId"
                  params={{ slug: slug!, viewId: view.id }}
                  className="min-w-0 flex-1"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="size-3 shrink-0 rounded-sm"
                      style={{ backgroundColor: view.teamColor }}
                    />
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium text-foreground">
                        {view.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {view.teamName}
                      </div>
                    </div>
                  </div>
                </Link>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      setRenameTarget({ id: view.id, name: view.name })
                      setRenameValue(view.name)
                    }}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => {
                      setDeleteTarget({ id: view.id, name: view.name })
                    }}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rename dialog */}
      <Dialog
        open={renameTarget !== null}
        onOpenChange={(open) => {
          if (!open) setRenameTarget(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename saved view</DialogTitle>
            <DialogDescription>Enter a new name for this view.</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              if (!renameTarget || !renameValue.trim() || renameValue.trim() === renameTarget.name) {
                setRenameTarget(null)
                return
              }
              try {
                await updateSavedView.mutateAsync({
                  viewId: renameTarget.id,
                  name: renameValue.trim(),
                })
                toast.success("Saved view renamed")
              } catch {
                toast.error("Failed to rename saved view")
              }
              setRenameTarget(null)
            }}
          >
            <input
              autoFocus
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              className="w-full rounded-lg border border-outline-variant/20 bg-surface px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRenameTarget(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={!renameValue.trim()}>
                Rename
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete saved view?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &ldquo;{deleteTarget?.name}&rdquo;. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={async () => {
                if (!deleteTarget) return
                try {
                  await deleteSavedView.mutateAsync({ viewId: deleteTarget.id })
                  toast.success("Saved view deleted")
                  navigate({
                    to: "/$slug/tickets/views",
                    params: { slug: slug! },
                  })
                } catch {
                  toast.error("Failed to delete saved view")
                }
                setDeleteTarget(null)
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
