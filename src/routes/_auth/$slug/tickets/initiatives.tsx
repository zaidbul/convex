import { createFileRoute } from "@tanstack/react-router"
import { Rocket } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export const Route = createFileRoute("/_auth/$slug/tickets/initiatives")({
  component: InitiativesPage,
})

function InitiativesPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-surface-low p-6">
      <Empty className="max-w-xl border-outline-variant/30 bg-surface px-8 py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Rocket />
          </EmptyMedia>
          <EmptyTitle>Initiatives</EmptyTitle>
          <EmptyDescription>
            Track high-level initiatives across your workspace. This feature is
            coming soon.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
