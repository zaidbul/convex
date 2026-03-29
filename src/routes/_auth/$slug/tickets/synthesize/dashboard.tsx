import { createFileRoute } from "@tanstack/react-router"
import { useSuspenseQuery } from "@tanstack/react-query"
import {
  feedbackClustersQueryOptions,
  feedbackImportsQueryOptions,
  feedbackItemsQueryOptions,
  feedbackSuggestionsQueryOptions,
} from "@/query/options/tickets"
import { FeedbackAnalysisDashboard } from "@/components/feedback/feedback-analysis-dashboard"

export const Route = createFileRoute(
  "/_auth/$slug/tickets/synthesize/dashboard"
)({
  component: SynthesizeDashboardPage,
})

function SynthesizeDashboardPage() {
  const { data: items } = useSuspenseQuery(feedbackItemsQueryOptions())
  const { data: clusters } = useSuspenseQuery(feedbackClustersQueryOptions())
  const { data: suggestions } = useSuspenseQuery(
    feedbackSuggestionsQueryOptions()
  )
  const { data: imports } = useSuspenseQuery(feedbackImportsQueryOptions())

  return (
    <div className="h-full overflow-auto px-6 py-6">
      <FeedbackAnalysisDashboard
        items={items}
        clusters={clusters}
        suggestions={suggestions}
        imports={imports}
      />
    </div>
  )
}
