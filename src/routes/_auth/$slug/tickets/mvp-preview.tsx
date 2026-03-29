import { createFileRoute } from "@tanstack/react-router"
import { TrialFlowApp } from "@/components/mvp-preview/trialflow-app"

export const Route = createFileRoute("/_auth/$slug/tickets/mvp-preview")({
  component: MvpPreviewPage,
})

function MvpPreviewPage() {
  const { slug } = Route.useParams()
  return <TrialFlowApp slug={slug} />
}
