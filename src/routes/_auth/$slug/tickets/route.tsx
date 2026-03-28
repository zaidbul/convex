import { createFileRoute, Outlet } from "@tanstack/react-router"
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { TicketSidebar } from "@/components/tickets/ticket-sidebar"
import {
  teamsQueryOptions,
  workspaceQueryOptions,
} from "@/query/options/tickets"

export const Route = createFileRoute("/_auth/$slug/tickets")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(workspaceQueryOptions())
    context.queryClient.ensureQueryData(teamsQueryOptions())
  },
  component: TicketsLayout,
})

function TicketsLayout() {
  return (
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
  )
}
