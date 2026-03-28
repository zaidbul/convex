import { createFileRoute, Outlet } from "@tanstack/react-router"
import {
  teamQueryOptions,
  cyclesQueryOptions,
  issuesQueryOptions,
} from "@/query/options/tickets"

export const Route = createFileRoute("/_auth/$slug/tickets/$teamSlug")({
  loader: async ({ context, params }) => {
    const { teamSlug } = params
    await Promise.all([
      context.queryClient.ensureQueryData(teamQueryOptions(teamSlug)),
      context.queryClient.ensureQueryData(cyclesQueryOptions(teamSlug)),
      context.queryClient.ensureQueryData(issuesQueryOptions(teamSlug)),
    ])
  },
  component: TeamLayout,
})

function TeamLayout() {
  return <Outlet />
}
