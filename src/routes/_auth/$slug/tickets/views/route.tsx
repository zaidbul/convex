import { createFileRoute, Outlet } from "@tanstack/react-router"
import { savedViewsQueryOptions } from "@/query/options/tickets"

export const Route = createFileRoute("/_auth/$slug/tickets/views")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(savedViewsQueryOptions())
  },
  component: ViewsLayout,
})

function ViewsLayout() {
  return <Outlet />
}
