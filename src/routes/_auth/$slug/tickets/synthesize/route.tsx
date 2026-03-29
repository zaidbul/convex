import { createFileRoute, Outlet } from "@tanstack/react-router"
import {
  feedbackClustersQueryOptions,
  feedbackImportsQueryOptions,
  feedbackItemsQueryOptions,
  feedbackSuggestionsQueryOptions,
} from "@/query/options/tickets"

export const Route = createFileRoute("/_auth/$slug/tickets/synthesize")({
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(feedbackImportsQueryOptions()),
      context.queryClient.ensureQueryData(feedbackItemsQueryOptions()),
      context.queryClient.ensureQueryData(feedbackClustersQueryOptions()),
      context.queryClient.ensureQueryData(feedbackSuggestionsQueryOptions()),
    ])
  },
  component: SynthesizeLayout,
})

function SynthesizeLayout() {
  return <Outlet />
}
