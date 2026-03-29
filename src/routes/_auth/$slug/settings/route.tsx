import { Suspense } from "react"
import { createFileRoute, Outlet } from "@tanstack/react-router"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Spinner } from "@/components/ui/spinner"
import { SettingsNav } from "@/components/settings/settings-nav"
import {
  workspaceQueryOptions,
  teamsQueryOptions,
} from "@/query/options/tickets"
import { workspaceMembersQueryOptions } from "@/query/options/settings"

export const Route = createFileRoute("/_auth/$slug/settings")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(workspaceQueryOptions()),
      context.queryClient.ensureQueryData(teamsQueryOptions()),
      context.queryClient.ensureQueryData(workspaceMembersQueryOptions()),
    ])
  },
  component: SettingsLayout,
})

function SettingsLayout() {
  return (
    <SidebarProvider>
      <SettingsNav />
      <SidebarInset className="overflow-y-auto">
        <header className="sticky top-0 z-40 flex h-12 items-center gap-3 border-b border-outline-variant/15 bg-surface-low px-4 md:hidden">
          <SidebarTrigger />
          <span className="font-display text-sm font-medium tracking-tight text-on-surface">
            Settings
          </span>
        </header>
        <div className="p-6 md:p-8">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <Spinner className="size-5 text-muted-foreground" />
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
