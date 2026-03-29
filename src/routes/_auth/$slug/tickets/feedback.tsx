import { createFileRoute } from "@tanstack/react-router"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { FeedbackHubScreen } from "@/components/feedback/feedback-hub-screen"
import {
  feedbackClustersQueryOptions,
  feedbackImportsQueryOptions,
  feedbackItemsQueryOptions,
  feedbackSuggestionQueryOptions,
  feedbackSuggestionsQueryOptions,
} from "@/query/options/tickets"

export const Route = createFileRoute("/_auth/$slug/tickets/feedback")({
  validateSearch: (search: Record<string, unknown>) => ({
    suggestionId: typeof search.suggestionId === "string" ? search.suggestionId : undefined,
  }),
  loader: async ({ context, location }) => {
    const { suggestionId } = location.search as { suggestionId?: string }

    await Promise.all([
      context.queryClient.ensureQueryData(feedbackImportsQueryOptions()),
      context.queryClient.ensureQueryData(feedbackItemsQueryOptions()),
      context.queryClient.ensureQueryData(feedbackClustersQueryOptions()),
      context.queryClient.ensureQueryData(feedbackSuggestionsQueryOptions()),
      suggestionId
        ? context.queryClient.ensureQueryData(feedbackSuggestionQueryOptions(suggestionId))
        : Promise.resolve(),
    ])
  },
  component: FeedbackHubPage,
})

function FeedbackHubPage() {
  const search = Route.useSearch()
  const { data: imports } = useSuspenseQuery(feedbackImportsQueryOptions())
  const { data: items } = useSuspenseQuery(feedbackItemsQueryOptions())
  const { data: clusters } = useSuspenseQuery(feedbackClustersQueryOptions())
  const { data: suggestions } = useSuspenseQuery(feedbackSuggestionsQueryOptions())
  const { data: selectedSuggestion } = useQuery({
    ...feedbackSuggestionQueryOptions(search.suggestionId ?? ""),
    enabled: !!search.suggestionId,
  })

  return (
    <FeedbackHubScreen
      imports={imports}
      items={items}
      clusters={clusters}
      suggestions={suggestions}
      selectedSuggestion={selectedSuggestion ?? null}
    />
  )
}
