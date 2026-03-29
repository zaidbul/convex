import { createFileRoute } from "@tanstack/react-router"
import { Eye } from "lucide-react"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export const Route = createFileRoute("/_auth/$slug/tickets/views")({
  component: ViewsPage,
})

function ViewsPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-surface-low p-6">
      <Empty className="max-w-xl border-outline-variant/30 bg-surface px-8 py-12">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Eye />
          </EmptyMedia>
          <EmptyTitle>Views</EmptyTitle>
          <EmptyDescription>
            Create and manage saved views to quickly filter and organize your
            work. This feature is coming soon.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  )
}
