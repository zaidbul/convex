import { createFileRoute } from "@tanstack/react-router"
import { useAuth } from "@clerk/tanstack-react-start"

export const Route = createFileRoute("/_auth/$slug/dashboard")({
  component: DashboardPage,
})

function DashboardPage() {
  const { slug } = Route.useParams()
  const { userId } = useAuth()

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
      <p className="mt-2 text-on-surface-variant">
        Workspace: {slug} &middot; User: {userId}
      </p>
    </div>
  )
}
