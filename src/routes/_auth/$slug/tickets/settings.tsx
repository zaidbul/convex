import { createFileRoute } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { workspaceQueryOptions } from "@/query/options/tickets"

export const Route = createFileRoute("/_auth/$slug/tickets/settings")({
  component: SettingsPage,
})

function SettingsPage() {
  const { slug } = Route.useParams()
  const { data: workspace } = useSuspenseQuery(workspaceQueryOptions())

  return (
    <div className="flex h-screen flex-col bg-surface-low">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-outline-variant/15 bg-surface-low px-4 py-2.5">
        <SidebarTrigger className="md:hidden" />
        <h1 className="font-display text-sm font-medium tracking-tight text-on-surface">
          Settings
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          <div className="rounded-lg border border-outline-variant/20 bg-surface p-6">
            <h2 className="text-sm font-medium text-on-surface">Workspace</h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-medium text-on-surface-variant">
                  Name
                </label>
                <p className="mt-1 text-sm text-on-surface">
                  {workspace?.name ?? "—"}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-on-surface-variant">
                  Slug
                </label>
                <p className="mt-1 text-sm text-on-surface-variant">
                  /{slug}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
