import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/_auth/$slug/tickets/$teamSlug/cycles")({
  component: CyclesLayout,
})

function CyclesLayout() {
  return <Outlet />
}
