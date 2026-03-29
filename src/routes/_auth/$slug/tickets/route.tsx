import { createFileRoute, Outlet } from "@tanstack/react-router"
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TicketSidebar } from "@/components/tickets/ticket-sidebar"
import { CommandPaletteProvider } from "@/components/tickets/command-palette-provider"
import {
  savedViewsQueryOptions,
  teamsQueryOptions,
  workspaceQueryOptions,
} from "@/query/options/tickets"

export const Route = createFileRoute("/_auth/$slug/tickets")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(workspaceQueryOptions()),
      context.queryClient.ensureQueryData(teamsQueryOptions()),
      context.queryClient.ensureQueryData(savedViewsQueryOptions()),
    ])
  },
  component: TicketsLayout,
})

function TicketsLayout() {
  return (
    <CommandPaletteProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "330px",
          } as React.CSSProperties
        }
      >
        <Sidebar side="left" collapsible="offcanvas">
          <TicketSidebar />
        </Sidebar>
        <SidebarInset>
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </CommandPaletteProvider>
  )
}
